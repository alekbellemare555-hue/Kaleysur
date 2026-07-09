/* Smoke-tests Kaleysur — valide les calculs purs extraits des HTML (version indexée git).
   Exécuté par le hook pre-commit : un échec bloque le commit.
   Les fonctions sont extraites du source par scan d'accolades équilibrées :
   si un marqueur devient introuvable après un refactor, le test échoue bruyamment
   → mettre à jour le marqueur ici.
   N.B. pas de 'use strict' : on dépend du mode sloppy pour que les déclarations
   de fonctions faites dans eval() fuient vers la portée du module. */
const { execSync } = require('child_process');

function staged(file) {
  return execSync(`git show :"${file}"`, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
}

/* Extrait un bloc depuis `marker` jusqu'à la fermeture équilibrée de la première
   accolade/crochet rencontré. Suffisant pour les fonctions de calcul ciblées
   (aucune ne contient de { } ou [ ] dans des littéraux de chaîne). */
function extract(src, marker) {
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Marqueur introuvable : "${marker}"`);
  let i = start;
  while (i < src.length && src[i] !== '{' && src[i] !== '[') i++;
  const open = src[i], close = open === '{' ? '}' : ']';
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === open) depth++;
    else if (src[i] === close) { depth--; if (depth === 0) return src.slice(start, i + 1) + ';'; }
  }
  throw new Error(`Bloc non fermé pour : "${marker}"`);
}

const failures = [];
let assertions = 0;
function eq(actual, expected, label) {
  assertions++;
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) failures.push(`${label} : attendu ${e}, obtenu ${a}`);
}
function ok(cond, label) {
  assertions++;
  if (!cond) failures.push(label);
}

/* ══════════ joueurs.html ══════════ */
{
  const J = staged('joueurs.html');
  const window = {};
  eval([
    extract(J, 'function mod(score)'),
    extract(J, 'function pb(niveau)'),
    extract(J, 'function esc(val)'),
    extract(J, 'function getClasses(c)'),
    extract(J, 'function getTotalLevel(c)'),
    extract(J, 'const MULTICLASS_SLOTS'),
    extract(J, 'function computeMulticlassSlots(c)'),
    extract(J, 'window.rollDiceExpr = function'),
  ].join('\n'));
  const rollDiceExpr = window.rollDiceExpr;

  // Bonus de maîtrise (table D&D : 1-4 → +2 … 17-20 → +6)
  [[1,2],[4,2],[5,3],[8,3],[9,4],[12,4],[13,5],[16,5],[17,6],[20,6]]
    .forEach(([n, p]) => eq(pb(n), p, `pb(${n})`));

  // Modificateur de caractéristique
  [[1,-5],[8,-1],[10,0],[11,0],[15,2],[16,3],[20,5],[30,10]]
    .forEach(([s, m]) => eq(mod(s), m, `mod(${s})`));

  // Échappement HTML
  eq(esc('<b "x">&'), '&lt;b &quot;x&quot;&gt;&amp;', 'esc(html)');
  eq(esc(null), '', 'esc(null)');

  // Niveau total multiclasse
  eq(getTotalLevel({ classes: [{ niveau: 3 }, { niveau: '2' }] }), 5, 'getTotalLevel multiclasse');
  eq(getTotalLevel({ niveau: 7 }), 7, 'getTotalLevel legacy');
  eq(getTotalLevel({}), 1, 'getTotalLevel vide');

  // Emplacements de sorts multiclasse (PHB)
  eq(computeMulticlassSlots({ classes: [{ classe: 'Wizard', niveau: 5 }] }),
     [4,3,2,0,0,0,0,0,0], 'slots Wizard 5');
  eq(computeMulticlassSlots({ classes: [{ classe: 'Paladin', niveau: 4 }, { classe: 'Wizard', niveau: 3 }] }),
     [4,3,2,0,0,0,0,0,0], 'slots Paladin4+Wizard3 (eff.5)');
  eq(computeMulticlassSlots({ classes: [{ classe: 'Fighter', niveau: 5 }] }), null, 'slots Fighter (aucun)');
  eq(computeMulticlassSlots({ classes: [{ classe: 'Warlock', niveau: 5 }] }), null, 'slots Warlock (pact magic exclu)');

  // Parseur d'expressions de dés — bornes sur 200 tirages
  for (let k = 0; k < 200; k++) {
    const r = rollDiceExpr('2d6+3');
    ok(r.total >= 5 && r.total <= 15, `rollDiceExpr 2d6+3 hors bornes (${r.total})`);
    if (r.total < 5 || r.total > 15) break;
  }
  ok((() => { const r = rollDiceExpr('d20'); return r.total >= 1 && r.total <= 20; })(), 'rollDiceExpr d20 bornes');
  eq(rollDiceExpr('+3').total, 3, 'rollDiceExpr constante');
  ok(rollDiceExpr('2d6-1').total >= 1, 'rollDiceExpr malus');
}

/* ══════════ dm.html ══════════ */
{
  const D = staged('dm.html');
  eval([
    extract(D, 'const DM_SKILLS'),
    extract(D, 'const DM_SAVES'),
    extract(D, 'function dmMod(score)'),
    extract(D, 'function dmFmt(n)'),
    extract(D, 'function dmCalc(c)'),
  ].join('\n'));

  // Rogue niv 5 : DEX 16, SAG 13, expertise Perception, prof Discrétion, save DEX
  const rogue = { niveau: 5, for: 8, dex: 16, con: 14, int: 13, sag: 13, cha: 10,
                  saveDex: true, perception: 2, discret: 1 };
  const dc = dmCalc(rogue);
  eq(dc.pb, 3, 'dmCalc PB niv5');
  eq(dc.passivePerc, 17, 'dmCalc perception passive (10 + mod SAG 1 + expertise 6)');
  eq(dc.save({ key: 'saveDex', attr: 'dex' }), { prof: true, val: 6 }, 'dmCalc save DEX maîtrisé');
  eq(dc.save({ key: 'saveFor', attr: 'for' }), { prof: false, val: -1 }, 'dmCalc save FOR');
  const stealth = dc.profSkills.find(x => x.sk.key === 'discret');
  eq(stealth && stealth.val, 6, 'dmCalc Stealth +6');
  const perc = dc.profSkills.find(x => x.sk.key === 'perception');
  eq(perc && perc.prof, 2, 'dmCalc Perception expertise');

  // Multiclasse + Jack of All Trades
  eq(dmCalc({ classes: [{ niveau: 3 }, { niveau: 2 }] }).totalLevel, 5, 'dmCalc niveau total multiclasse');
  const bard = dmCalc({ niveau: 4, dex: 10, jackOfAllTrades: true });
  eq(bard.skill({ key: 'acrobaties', attr: 'dex' }).val, 1, 'dmCalc Jack of All Trades (demi-PB)');

  eq(dmFmt(3), '+3', 'dmFmt positif');
  eq(dmFmt(-1), '-1', 'dmFmt négatif');
  eq(dmMod(14), 2, 'dmMod');
}

/* ══════════ Verdict ══════════ */
if (failures.length) {
  console.error(`✗ Smoke-tests : ${failures.length} échec(s) sur ${assertions} assertions`);
  failures.forEach(f => console.error('  • ' + f));
  process.exit(1);
}
console.log(`✓ Smoke-tests OK (${assertions} assertions)`);
