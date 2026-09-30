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

/* ══════════ joueurs.html + js/rules-2024.js ══════════ */
{
  const J = staged('joueurs.html');
  const R = staged('js/rules-2024.js'); // données de règles extraites
  const window = {};
  eval([
    extract(J, 'function mod(score)'),
    extract(J, 'function pb(niveau)'),
    extract(J, 'function esc(val)'),
    extract(J, 'function getClasses(c)'),
    extract(J, 'function getTotalLevel(c)'),
    extract(J, 'function classesReelles(c)'),
    extract(R, 'const MULTICLASS_SLOTS'),
    extract(R, 'const FULL_CASTER_SLOTS'),
    extract(R, 'const HALF_CASTER_SLOTS'),
    extract(R, 'const THIRD_CASTER_SLOTS'),
    extract(R, 'const WARLOCK_SLOTS'),
    extract(R, 'const ARTIFICER_SLOTS'),
    extract(R, 'const LANCEURS'),
    extract(R, 'function typeLanceur(classe, sousClasse)'),
    extract(R, 'function emplacementsClasse(classe, sousClasse, niveau)'),
    extract(R, 'function niveauLanceurEffectif(classes)'),
    extract(R, 'function emplacementsPersonnage(classes)'),
    extract(J, 'function computeMulticlassSlots(c)'),
    extract(R, 'const STARTING_ARMOR'),
    extract(R, 'const STARTING_WEAPONS'),
    extract(R, 'const STARTING_SPELLS'),
    extract(R, 'const PREPARED_SPELLS'),
    extract(R, 'const CLASS_DATA'),
    extract(R, 'const SUBCLASS_DATA'),
    extract(R, 'const SPECIES_DATA'),
    extract(R, 'const DND_CLASSES'),
    extract(R, 'const ASI_LEVELS'),
    extract(R, 'const GENERAL_FEATS'),
    extract(R, 'const CLASS_RESOURCES'),
    extract(R, 'const MULTICLASS_PREREQ'),
    extract(J, 'function syncClassesToLegacy(c)'),
    extract(J, 'function migrerNomsSousClasse(c)'),
    extract(J, 'function abilKeysFromFeat(abilStr)'),
    extract(J, 'function preparedTotal(c)'),
    extract(J, 'function multiclassPrereqCheck(c, className)'),
    extract(R, 'const CANTRIPS_KNOWN'),
    extract(R, 'const FEATURE_CHOICES'),
    extract(J, 'function featureOptions(featureName, className)'),
    extract(J, 'function classeOffreCapacite(className, featureName)'),
    extract(J, 'function featureChoicesAt(className, subclassName, level)'),
    extract(J, 'function cleChoix(className, featureName)'),
    extract(J, 'function getFeatureChoice(c, featureName, className)'),
    extract(J, 'function migrerChoixCapacites(c)'),
    extract(J, 'function deDeVie(c)'),
    extract(J, 'function migrerNomsAttaques(c)'),
    extract(J, 'function setFeatureChoice(c, featureName, className, selection)'),
    extract(J, 'function pendingFeatureChoices(c)'),
    extract(J, 'function cantripsAt(className, level)'),
    extract(J, 'function expertiseAt(className, level)'),
    extract(J, 'function topSlotLevel(slots)'),
    extract(J, 'function planLevelUp(c, className, opts)'),
    extract(J, 'function applyLevelUp(c, plan, choices)'),
    extract(J, 'function applyStartingGear(c, className, items)'),
    extract(J, 'function startingMaxHp(c, hitDie, speciesEffects)'),
    extract(J, 'function startingSpellHint(className)'),
    extract(J, 'const SIZE_CARRY_MULT'),
    extract(J, 'function carryCapacity(c)'),
    extract(J, 'function coinWeight(currency)'),
    extract(J, 'function inventoryWeight(inv)'),
    extract(J, 'const ARMOR_PRESETS'),
    extract(J, 'function isShieldItem(item)'),
    extract(J, 'function armorFromItem(item)'),
    extract(J, 'function isEquippable(item)'),
    extract(J, 'function defaultArmorConfig(c)'),
    extract(J, 'function equippedArmorMismatch(c, inv)'),
    extract(J, 'const ATTUNE_MAX'),
    extract(J, 'function isAttunable(item)'),
    extract(J, 'function attunedItems(inv)'),
    extract(J, 'function migrateAttunement(inv)'),
    extract(J, 'function isProficientWith(c, weaponCat, props)'),
    extract(J, 'function attackFromItem(item, c)'),
    extract(J, 'function syncAttackForItem(c, item, equipped)'),
    extract(J, 'const COIN_RATE'),
    extract(J, 'function purseValue(currency)'),
    extract(J, 'function itemsValue(items)'),
    extract(J, 'function fmtGp(v)'),
    extract(J, 'function searchNotes(pages, query)'),
    extract(J, 'function diffNotes(local, distant)'),
    extract(J, 'function buildWikiIndex(entries)'),
    extract(J, 'function renderNoteMarkdown(texte, wikiIndex)'),
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


  /* ── Qui lance quoi : une seule table, trois ecrans ──
     La fiche, l'onglet plan et le multiclassement avaient chacun leur copie de
     la liste des lanceurs, et elles avaient diverge : le Psion etait complet
     d'un cote, demi-lanceur de l'autre, si bien que le meme personnage
     affichait deux tables selon l'ecran. */
  eq(typeLanceur('Psion', ''), 'complet', 'Psion : lanceur complet, partout');
  eq(typeLanceur('Wizard', ''), 'complet', 'Magicien : lanceur complet');
  eq(typeLanceur('Paladin', 'Oath of Devotion'), 'demi', 'Paladin : demi-lanceur');
  eq(typeLanceur('Ranger', 'Hunter'), 'demi', 'Rodeur : demi-lanceur');
  eq(typeLanceur('Warlock', ''), 'pacte', 'Occultiste : magie de pacte');
  eq(typeLanceur('Artificer', ''), 'artificier', 'Artificier : sa propre table');
  eq(typeLanceur('Fighter', 'Champion'), null, 'Champion : aucun sort');
  eq(typeLanceur('Rogue', 'Thief'), null, 'Voleur : aucun sort');
  /* La sous-classe seule fait la difference ici. */
  eq(typeLanceur('Fighter', 'Eldritch Knight'), 'tiers', 'Chevalier Occulte : tiers-lanceur');
  eq(typeLanceur('Rogue', 'Arcane Trickster'), 'tiers', 'Filou Arcanique : tiers-lanceur');
  eq(typeLanceur('', ''), null, 'pas de classe, pas de sorts');

  /* ── Le demi-lanceur 2024 lance des sorts des le niveau 1 ──
     C'est le seul ecart avec la table 2014. Un 0 ici veut dire que la table
     2014 est revenue. */
  eq(emplacementsClasse('Paladin', '', 1), [2,0,0,0,0,0,0,0,0], 'Paladin 1 : 2 emplacements (2024)');
  eq(emplacementsClasse('Ranger', '', 1), [2,0,0,0,0,0,0,0,0], 'Rodeur 1 : 2 emplacements (2024)');
  eq(emplacementsClasse('Paladin', '', 5), [4,2,0,0,0,0,0,0,0], 'Paladin 5');
  eq(emplacementsClasse('Paladin', '', 20), [4,3,3,3,2,0,0,0,0], 'Paladin 20 : plafonne au niveau 5 de sort');

  /* ── Le tiers-lanceur a sa propre table ──
     Elle n'est PAS la table multiclasse au tiers du niveau : un Chevalier
     Occulte 7 a 4 emplacements de niveau 1 et 2 de niveau 2, alors que la regle
     multiclasse (floor(7/3) = 2) n'en donnerait que 3 de niveau 1. Confondre
     les deux est l'erreur naturelle. */
  eq(emplacementsClasse('Fighter', 'Eldritch Knight', 2), [0,0,0,0,0,0,0,0,0], 'Chevalier Occulte 2 : rien avant le niveau 3');
  eq(emplacementsClasse('Fighter', 'Eldritch Knight', 3), [2,0,0,0,0,0,0,0,0], 'Chevalier Occulte 3 : les premiers');
  eq(emplacementsClasse('Fighter', 'Eldritch Knight', 7), [4,2,0,0,0,0,0,0,0], 'Chevalier Occulte 7 : 4/2, pas la table multiclasse');
  eq(emplacementsClasse('Rogue', 'Arcane Trickster', 20), [4,3,3,1,0,0,0,0,0], 'Filou Arcanique 20');
  eq(emplacementsClasse('Fighter', 'Champion', 20), null, 'Champion 20 : toujours aucun sort');

  /* ── Multiclassement : 2024 arrondit AU SUPERIEUR les demi-lanceurs ──
     Niveaux impairs uniquement : c'est la que floor et ceil different. */
  eq(niveauLanceurEffectif([{classe:'Paladin', niveau:5}]), 3, 'Paladin 5 : ceil(5/2) = 3, pas 2');
  eq(niveauLanceurEffectif([{classe:'Ranger', niveau:3}]), 2, 'Rodeur 3 : ceil(3/2) = 2, pas 1');
  eq(niveauLanceurEffectif([{classe:'Paladin', niveau:5}, {classe:'Wizard', niveau:5}]), 8,
     'Paladin 5 + Magicien 5 : 3 + 5 = 8');
  eq(niveauLanceurEffectif([{classe:'Fighter', sousClasse:'Eldritch Knight', niveau:9}]), 3,
     'Chevalier Occulte 9 : floor(9/3) = 3, le tiers arrondit a l\'inferieur');
  eq(niveauLanceurEffectif([{classe:'Fighter', sousClasse:'Eldritch Knight', niveau:8}]), 2,
     'Chevalier Occulte 8 : floor(8/3) = 2');
  eq(niveauLanceurEffectif([{classe:'Fighter', sousClasse:'Champion', niveau:20}]), 0,
     'Champion 20 : ne compte pas');
  eq(niveauLanceurEffectif([{classe:'Warlock', niveau:10}]), 0,
     'Occultiste : la magie de pacte ne se combine pas');

  /* ── Mono ou multi : deux mecanismes, pas un ──
     Un seul lanceur utilise SA table de classe. Passer par la table multiclasse
     donnerait un resultat faux pour un tiers-lanceur. */
  eq(emplacementsPersonnage([{classe:'Fighter', sousClasse:'Eldritch Knight', niveau:7}]),
     [4,2,0,0,0,0,0,0,0], 'Chevalier Occulte seul : sa table de classe');
  eq(emplacementsPersonnage([{classe:'Paladin', sousClasse:'', niveau:5}]),
     [4,2,0,0,0,0,0,0,0], 'Paladin seul : sa table de classe');
  eq(emplacementsPersonnage([{classe:'Fighter', sousClasse:'Champion', niveau:20}]), null,
     'aucun lanceur : aucun emplacement');
  eq(emplacementsPersonnage([{classe:'Warlock', sousClasse:'', niveau:5}]), null,
     'Occultiste seul : magie de pacte, affichee a part');
  /* Un niveau a zero ne doit pas compter comme une classe. */
  eq(emplacementsPersonnage([{classe:'Wizard', sousClasse:'', niveau:0}]), null,
     'une classe a zero niveau ne lance rien');


  /* ── Aucune table d'emplacements hors des regles ──
     Chaque copie privee derive : celle de l'import portait encore le Psion en
     demi-lanceur et l'arrondi 2014 longtemps apres leur correction ailleurs.
     Les motifs ci-dessous sont des lignes caracteristiques des tables ; ils ne
     peuvent apparaitre par hasard dans du code d'interface. */
  {
    const MOTIFS = [
      [/\[\s*4\s*,\s*3\s*,\s*3\s*,\s*3\s*,\s*2\s*,\s*1/, 'lanceur complet / multiclasse'],
      [/\[\s*4\s*,\s*2\s*,\s*0\s*,\s*0\s*,\s*0/,         'demi-lanceur'],
      [/\[\s*0\s*,\s*0\s*,\s*2\s*,\s*0\s*,\s*0/,         'magie de pacte'],
      [/\[\s*4\s*,\s*3\s*,\s*3\s*,\s*1\s*,\s*0/,         'tiers-lanceur'],
    ];
    for (const [re, quoi] of MOTIFS) {
      ok(!re.test(J), 'joueurs.html : table « ' + quoi + '  » recopiee hors des regles');
    }
    /* Et elles existent bien la ou elles doivent etre. */
    for (const [re, quoi] of MOTIFS) {
      ok(re.test(R), 'js/rules-2024.js : la table « ' + quoi + ' » y est');
    }

    /* Les listes de lanceurs ne doivent pas non plus se recopier : c'est par la
       qu'une copie reintroduit le Psion en demi-lanceur. */
    ok(!/HALF_CASTERS|FULL_CASTERS|HALF_CAST_CLS|FULL_CAST_CLS/.test(J),
       'joueurs.html : plus de liste de lanceurs recopiee');
    ok(!/const SLOT_TABLE/.test(J), 'joueurs.html : plus de table d\'emplacements privee');
  }

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

  /* ── Cohérence des données de règles 2024 ──
     Les const d'un eval direct ne fuient pas vers la portée appelante :
     on les récupère via une IIFE qui les renvoie. */
  // Le fichier de règles est du JS valide complet : on l'exécute en entier plutôt
  // que d'extraire bloc par bloc (les accolades dans les descriptions piègent le scan).
  const { CLASS_DATA, SPECIES_DATA, BACKGROUND_DATA, GENERAL_FEATS, ORIGIN_FEATS,
          STARTING_EQUIP, DND_CLASSES, SUBCLASS_DATA, PREPARED_SPELLS, SPELL_PREP_STYLE,
          STARTING_SPELLS, LANGUAGES, TOOL_CHOICES, MULTICLASS_PREREQ, STARTING_ARMOR,
          FEATURE_CHOICES, estUA, nomUA, sourceUA, titreUA, STARTING_WEAPONS,
          CANTRIPS_KNOWN, CLASS_RESOURCES, infoUA, UA_SUBCLASSES,
          SUBCLASS_RENOMMEES, SOURCE_LIVRE, livreSource, donsDisponibles,
          /* typeLanceur n'est pas repris ici : les declarations de fonction
             d'un eval direct fuient deja dans cette portee, et le redeclarer en
             const provoquerait un conflit de nom au chargement. */
          LANCEURS } =
    new Function(R + '; return { CLASS_DATA, SPECIES_DATA, BACKGROUND_DATA, GENERAL_FEATS,'
      + ' ORIGIN_FEATS, STARTING_EQUIP, DND_CLASSES, SUBCLASS_DATA, PREPARED_SPELLS,'
      + ' STARTING_SPELLS, LANGUAGES, TOOL_CHOICES, MULTICLASS_PREREQ, STARTING_ARMOR,'
      + ' FEATURE_CHOICES, estUA, nomUA, sourceUA, titreUA, STARTING_WEAPONS,'
      + ' CANTRIPS_KNOWN, CLASS_RESOURCES, infoUA, UA_SUBCLASSES,'
      + ' SUBCLASS_RENOMMEES, SOURCE_LIVRE, livreSource, donsDisponibles,'
      + ' LANCEURS,'
      + ' SPELL_PREP_STYLE };')();
  /* L'invariant qui empeche la divergence de revenir : une classe ne peut pas
     figurer dans deux categories. C'est exactement ce qui s'etait produit — le
     Psion etait a la fois complet et demi-lanceur, et chaque ecran attrapait
     celle qu'il testait en premier. L'ordre de typeLanceur rend aujourd'hui le
     doublon inoffensif, mais il reste un piege arme pour la prochaine lecture. */
  {
    const vues = new Map();
    ['complet', 'demi', 'pacte', 'artificier'].forEach(type =>
      LANCEURS[type].forEach(cls => {
        ok(!vues.has(cls), `LANCEURS : « ${cls} » est a la fois ${vues.get(cls)} et ${type}`);
        vues.set(cls, type);
      }));
    /* Toute classe connue doit etre classee, sinon ses emplacements disparaissent
       en silence le jour ou on en ajoute une. */
    Object.keys(CLASS_DATA).forEach(cls => {
      const sous = Object.keys(SUBCLASS_DATA[cls] || {});
      const lance = !!typeLanceur(cls, '') || sous.some(sc => typeLanceur(cls, sc));
      const attendu = !!(PREPARED_SPELLS[cls] || CANTRIPS_KNOWN[cls] || cls === 'Warlock');
      if (attendu) ok(lance, `${cls} : prepare des sorts mais n'est classe nulle part`);
    });
  }

  const SKILL_KEYS = extract(J, 'const SKILLS = [')
    .match(/key:'([a-z]+)'/g).map(s => s.slice(5, -1));

  // Toutes les classes choisissent leur sous-classe au niveau 3 (PHB 2024)
  Object.entries(CLASS_DATA).forEach(([cls, d]) => {
    const first = Object.entries(d.features)
      .filter(([, fs]) => fs.some(f => f.type === 'subclass'))
      .map(([l]) => +l).sort((a, b) => a - b)[0];
    eq(first, 3, `${cls} : sous-classe au niveau 3`);
    ok(Array.isArray(d.saves) && d.saves.length === 2, `${cls} : 2 jets de sauvegarde`);
    ok(!!DND_CLASSES[cls], `${cls} : présent dans DND_CLASSES (dé de vie)`);
    // Compétences de classe : quota cohérent et clés valides
    ok(d.skillChoices >= 2 && d.skillChoices <= 4, `${cls} : quota de compétences (${d.skillChoices})`);
    ok(Array.isArray(d.skillList) && d.skillList.length >= d.skillChoices,
       `${cls} : liste de compétences au moins aussi grande que le quota`);
    (d.skillList || []).forEach(k =>
      ok(SKILL_KEYS.includes(k), `${cls} : compétence « ${k} » inconnue`));
    eq(new Set(d.skillList).size, (d.skillList || []).length, `${cls} : pas de doublon de compétence`);
  });

  // Backgrounds : clés de compétences valides + origin feat documenté
  Object.entries(BACKGROUND_DATA).forEach(([bg, d]) => {
    eq(d.abilities.length, 3, `${bg} : 3 caractéristiques`);
    ok(!!ORIGIN_FEATS[d.feat], `${bg} : origin feat « ${d.feat} » documenté`);
    (d.skillKeys || []).forEach(k =>
      ok(SKILL_KEYS.includes(k), `${bg} : clé de compétence « ${k} » inconnue`));
    eq((d.skillKeys || []).length, 2, `${bg} : 2 compétences`);
  });

  // Espèces : vitesse et traits de base présents ; lignées non vides
  const CREATURE_TYPES = ['Humanoid','Aberration','Construct','Elemental','Fey','Giant','Monstrosity','Plant','Undead'];
  Object.entries(SPECIES_DATA).forEach(([sp, d]) => {
    ok(typeof d.speed === 'number' && d.speed > 0, `${sp} : vitesse définie`);
    ok(typeof d.size === 'string' && d.size.length > 0, `${sp} : taille définie`);
    // Le type conditionne les sorts qui ciblent les Humanoïdes : jamais implicite
    ok(CREATURE_TYPES.includes(d.type), `${sp} : type de créature manquant ou inconnu (${d.type})`);
    ok(Array.isArray(d.traits[1]) && d.traits[1].length > 0, `${sp} : traits de niveau 1`);
    Object.values(d.traits).flat().forEach(t =>
      ok(t.name && typeof t.desc === 'string' && t.desc.length > 15, `${sp}/${t.name} : description trop courte`));
    Object.entries(d.lineages || {}).forEach(([ln, lv]) =>
      ok(Array.isArray(lv[1]) && lv[1].length > 0, `${sp}/${ln} : trait de niveau 1`));
  });
  // Kalashtar (Eberron: Forge of the Artificer) — la seule Aberration jouable
  {
    const k = SPECIES_DATA.Kalashtar;
    ok(!!k, 'Kalashtar présent');
    eq(k.type, 'Aberration', 'Kalashtar : Aberration, pas Humanoïde');
    eq(k.speed, 30, 'Kalashtar : 30 ft');
    eq(k.effects.telepathyPerLevel, 10, 'Kalashtar : télépathie 10 ft/niveau');
    ['Dual Mind','Mental Discipline','Mind Link','Severed from Dreams'].forEach(t =>
      ok(k.traits[1].some(x => x.name === t), `Kalashtar : trait « ${t} »`));
    eq(k.traits[1].length, 4, 'Kalashtar : 4 traits, pas un de plus');
    ok(!k.lineages, 'Kalashtar : aucune lignée');
  }
  eq(Object.values(SPECIES_DATA).filter(d => d.type !== 'Humanoid').length, 3,
     'trois espèces non-Humanoïdes : Kalashtar, Drider, Myconid');

  /* ── Étiquetage Unearthed Arcana ──
     Une option de playtest doit s'annoncer au moment du choix, sinon le joueur
     la découvre en partie. Le contrat : la clé reste le nom nu (c'est elle qui
     part dans la fiche), seul l'affichage porte « (UA) ». */
  {
    const uaEspeces = Object.keys(SPECIES_DATA).filter(n => SPECIES_DATA[n].ua);
    const uaClasses = Object.keys(CLASS_DATA).filter(n => CLASS_DATA[n].ua);

    ok(uaEspeces.length > 0, 'au moins une espèce UA étiquetée');
    ok(uaClasses.includes('Psion'), 'Psion : toujours du playtest (Dark Sun, pas encore paru)');
    ok(!uaClasses.includes('Artificier') && !uaClasses.includes('Artificer'),
       "Artificier : paru dans Eberron: Forge of the Artificer — plus du playtest");

    // Chaque option UA dit d'où elle vient : sans ça, l'infobulle est muette.
    [...uaEspeces, ...uaClasses].forEach(n => {
      ok(typeof sourceUA(n) === 'string' && sourceUA(n).length > 10, `${n} : uaSource manquante`);
      eq(nomUA(n), '(UA) ' + n, `${n} : préfixe « (UA) »`);
      ok(titreUA(n).startsWith(' title="'), `${n} : infobulle de playtest`);
    });

    // Le nom affiché ne doit jamais devenir une clé : sinon un aller-retour
    // fiche → liste enregistrerait « (UA) Myconid » et l'espèce serait perdue.
    [...uaEspeces, ...uaClasses].forEach(n =>
      ok(!SPECIES_DATA[nomUA(n)] && !CLASS_DATA[nomUA(n)], `${n} : le nom affiché n'est pas une clé`));

    // Contenu officiel : jamais préfixé, jamais d'infobulle.
    ['Human', 'Elf', 'Kalashtar', 'Wizard', 'Artificer'].forEach(n => {
      ok(!estUA(n), `${n} : officiel, pas de drapeau UA`);
      eq(nomUA(n), n, `${n} : nom inchangé`);
      eq(titreUA(n), '', `${n} : aucune infobulle de playtest`);
    });
    eq(nomUA(''), '', 'nom vide : pas de préfixe');
    ok(!estUA('EspeceInconnue'), 'espèce inconnue : pas UA');
    eq(nomUA('EspeceInconnue'), 'EspeceInconnue', 'espèce inconnue : nom inchangé');

    // Les cinq espèces de l'UA « Underdark Options 2 » (10 septembre 2026)
    const UNDERDARK = ['Deep Imaskari', 'Drider', 'Illithidkin', 'Kuo-toa', 'Myconid'];
    UNDERDARK.forEach(n => {
      ok(!!SPECIES_DATA[n], `${n} : espèce présente`);
      ok(SPECIES_DATA[n]?.ua, `${n} : étiquetée UA`);
      eq(SPECIES_DATA[n]?.speed, 30, `${n} : 30 ft`);
    });
    eq(SPECIES_DATA['Drider'].type, 'Monstrosity', 'Drider : Monstruosité, pas Humanoïde');
    eq(SPECIES_DATA['Myconid'].type, 'Plant', 'Myconid : Plante, pas Humanoïde');
    // Sorts acquis en montant : le trait doit exister au niveau annoncé
    ok(SPECIES_DATA['Drider'].traits[3]?.some(t => t.name === 'Faerie Fire'), 'Drider : Faerie Fire au niveau 3');
    ok(SPECIES_DATA['Drider'].traits[5]?.some(t => t.name === 'Web'), 'Drider : Web au niveau 5');
    ok(SPECIES_DATA['Illithidkin'].traits[3]?.some(t => t.name === 'Command'), 'Illithidkin : Command au niveau 3');
    ok(SPECIES_DATA['Illithidkin'].traits[5]?.some(t => t.name === 'Levitate'), 'Illithidkin : Levitate au niveau 5');
    ok(SPECIES_DATA['Deep Imaskari'].traits[3]?.some(t => t.name === 'Aura of Unlight'), 'Deep Imaskari : Aura of Unlight au niveau 3');
    // Le Kuo-toa n'a aucune vision dans le noir dans le document publié : c'est
    // voulu, pas un oubli de saisie. On fige le constat pour qu'il se voie.
    ok(!SPECIES_DATA['Kuo-toa'].traits[1].some(t => t.name === 'Darkvision'),
       'Kuo-toa : pas de Darkvision (conforme au document de playtest)');

    // L'Ardling vient d'un autre playtest, écarté du PHB 2024
    ok(SPECIES_DATA['Ardling']?.ua, 'Ardling : étiqueté UA');
    ok(/2022/.test(sourceUA('Ardling')), 'Ardling : source datée de 2022');

    // Télépathie à portée fixe (Illithidkin, Myconid) : entier positif
    Object.entries(SPECIES_DATA).forEach(([sp, d]) => {
      const t = d.effects?.telepathy;
      if (t !== undefined) ok(Number.isInteger(t) && t > 0, `${sp} : telepathy invalide (${t})`);
    });
    eq(SPECIES_DATA['Illithidkin'].effects.telepathy, 30, 'Illithidkin : télépathie 30 ft');
    eq(SPECIES_DATA['Myconid'].effects.telepathy, 30, 'Myconid : télépathie 30 ft');
  }

  // Feats généraux : description non vide
  Object.entries(GENERAL_FEATS).forEach(([f, d]) =>
    ok(typeof d.desc === 'string' && d.desc.length > 20, `feat « ${f} » : description`));

  // Équipement de départ : au moins une option par classe jouable
  Object.entries(STARTING_EQUIP).forEach(([cls, opts]) => {
    ok(opts.length >= 1, `${cls} : option d'équipement`);
    opts.forEach(o => ok(typeof o.gold === 'number', `${cls}/${o.label} : bourse`));
  });
  // Aucune classe ne doit sortir du créateur les mains vides (l'Artificier l'était)
  Object.keys(CLASS_DATA).forEach(cls =>
    ok(!!STARTING_EQUIP[cls], `${cls} : aucun équipement de départ — le créateur laisse la fiche vide`));

  /* ── Équipement de départ → CA et attaques (applyStartingGear) ── */
  const gear = (cls, optIdx, abils) => {
    const c = Object.assign({ for:15, dex:14, con:13, int:12, sag:10, cha:8 }, abils);
    applyStartingGear(c, cls, STARTING_EQUIP[cls][optIdx].items);
    return c;
  };
  // Toute option A doit produire au moins une attaque : sinon un nom d'arme a changé
  // dans STARTING_EQUIP sans être répercuté dans STARTING_WEAPONS.
  Object.keys(STARTING_EQUIP).forEach(cls => {
    const c = gear(cls, 0);
    ok((c.attaques || []).length >= 1, `${cls} option A : aucune arme reconnue`);
    (c.attaques || []).forEach(a => {
      ok(/^\d+d\d+([+-]\d+)?$/.test(a.degats), `${cls}/${a.name} : dégâts mal formés (${a.degats})`);
      ok(['for','dex'].includes(a.atkType), `${cls}/${a.name} : atkType invalide (${a.atkType})`);
      ok(a.prof === true, `${cls}/${a.name} : maîtrise attendue`);
    });
  });
  // Armures : le mode doit correspondre à l'armure reçue
  eq(gear('Cleric', 0).armorConfig.mode, 'medium', 'Clerc : chemise de mailles = intermédiaire');
  eq(gear('Cleric', 0).armorConfig.baseAC, 13, 'Clerc : CA de base 13');
  eq(gear('Cleric', 0).armorConfig.shield, true, 'Clerc : bouclier détecté');
  eq(gear('Fighter', 0).armorConfig.mode, 'heavy', 'Guerrier : cotte de mailles = lourde');
  eq(gear('Fighter', 0).armorConfig.baseAC, 16, 'Guerrier : CA de base 16');
  eq(gear('Rogue', 0).armorConfig.mode, 'light', 'Roublard : armure légère');
  // Défense sans armure : la classe décide quand aucune armure n'est fournie
  eq(gear('Barbarian', 0).armorConfig.mode, 'unarmoredBarb', 'Barbare : défense sans armure');
  eq(gear('Monk', 0).armorConfig.mode, 'unarmoredMonk', 'Moine : défense sans armure');
  eq(gear('Wizard', 0).armorConfig.mode, 'unarmored', 'Magicien : sans armure');
  // Option « or uniquement » : pas d'armure, pas d'attaque, mais un armorConfig valide
  const goldOnly = gear('Barbarian', 1);
  eq(goldOnly.armorConfig.mode, 'unarmoredBarb', 'or seul : la classe décide encore de la CA');
  eq(goldOnly.armorConfig.shield, false, 'or seul : pas de bouclier');
  ok(!goldOnly.attaques, 'or seul : aucune attaque inventée');
  // Dégâts = dé de l'arme + modificateur de la caractéristique utilisée
  eq(gear('Barbarian', 0, { for:17 }).attaques[0].degats, '1d12+3', 'Hache d\'armes 1d12 + FOR 17');
  eq(gear('Barbarian', 0, { for:8 }).attaques[0].degats,  '1d12-1', 'Hache d\'armes avec FOR 8');
  eq(gear('Barbarian', 0, { for:10 }).attaques[0].degats, '1d12',   'Aucun modificateur affiché si 0');
  // Doublons : 4 haches de jet → une seule ligne d'attaque
  eq(gear('Barbarian', 0).attaques.length, 2, 'Barbare : haches de jet regroupées en une ligne');
  // Finesse : la meilleure des deux caractéristiques
  eq(gear('Rogue', 0, { for:10, dex:17 }).attaques[1].atkType, 'dex', 'Épée courte (finesse) → DEX');
  eq(gear('Rogue', 0, { for:17, dex:10 }).attaques[1].atkType, 'for', 'Épée courte (finesse) → FOR');
  // Les armes à distance restent en DEX quelle que soit la FOR
  eq(gear('Ranger', 0, { for:18, dex:10 }).attaques[2].atkType, 'dex', 'Arc long toujours en DEX');
  // Focus d'incantation monté sur bâton : reconnu comme arme
  ok(gear('Wizard', 0).attaques.some(a => a.name === 'Quarterstaff'),
     'Magicien : « Arcane Focus (Quarterstaff) » compte comme un bâton');

  /* ── PV de départ (startingMaxHp) ── */
  eq(startingMaxHp({ con:14 }, '1d8',  {}), 10, 'd8 + CON 14 = 10 PV');
  eq(startingMaxHp({ con:10 }, '1d12', {}), 12, 'd12 + CON 10 = 12 PV');
  eq(startingMaxHp({ con:6 },  '1d6',  {}),  4, 'd6 + CON 6 = 4 PV');
  eq(startingMaxHp({ con:1 },  '1d6',  {}),  1, 'PV jamais sous 1');
  // Robustesse naine : le bonus était affiché sur la fiche mais jamais ajouté
  eq(startingMaxHp({ con:14 }, '1d8', { hpPerLevel:1 }), 11, 'Nain : +1 PV/niveau appliqué');
  eq(startingMaxHp({ con:14 }, '1d8', { speed:25 }),     10, 'Un effet sans PV ne change rien');
  // Toute espèce déclarant hpPerLevel doit être un entier positif
  Object.entries(SPECIES_DATA).forEach(([sp, d]) => {
    const h = d.effects?.hpPerLevel;
    if (h !== undefined) ok(Number.isInteger(h) && h > 0, `${sp} : hpPerLevel invalide (${h})`);
  });

  /* ── Montée de niveau (planLevelUp / applyLevelUp) ── */
  const hero = (over) => Object.assign({
    for:14, dex:14, con:14, int:14, sag:14, cha:14, pvMax:20, pvActuel:20, nbDeVie:2,
  }, over);

  // Caractéristiques des dons : chaque libellé doit se traduire en clés valides
  eq(abilKeysFromFeat('CHA'), ['cha'], 'abilKeysFromFeat simple');
  eq(abilKeysFromFeat('FOR or DEX'), ['for','dex'], 'abilKeysFromFeat « or »');
  eq(abilKeysFromFeat('FOR, DEX or SAG'), ['for','dex','sag'], 'abilKeysFromFeat liste');
  eq(abilKeysFromFeat('choice').length, 6, 'abilKeysFromFeat « choice »');
  Object.entries(GENERAL_FEATS).forEach(([name, f]) => {
    if (!f.asi) return;
    const keys = abilKeysFromFeat(f.abil);
    ok(keys.length > 0, `don « ${name} » : abil « ${f.abil} » illisible`);
    keys.forEach(k => ok(['for','dex','con','int','sag','cha'].includes(k),
      `don « ${name} » : clé « ${k} » invalide`));
  });



  /* ── Une modal ouverte est isolee ── */
  {
    /* Un refus d'applyLevelUp ne doit pas fermer la modal : le joueur y a saisi
       ses PV, sa sous-classe, son don et ses choix de capacite, et un message
       d'erreur devant une modal fermee ne dit pas ou reprendre. L'ordre des
       deux lignes est tout le correctif, donc c'est l'ordre qu'on verifie. */
    /* Le bouton Cancel est declare AVANT Confirm dans le fichier : borner la
       fin sur lui donnait une tranche vide, et les trois assertions passaient
       a cote sans rien dire. On prend donc une fenetre a partir du debut. */
    const debutConf = J.indexOf("$('lvlup-confirm').addEventListener");
    const conf = J.slice(debutConf, debutConf + 3000);
    const iLecture = conf.indexOf('if (!res.ok)');
    const iFermeture = conf.indexOf("overlay.classList.remove('open')");
    ok(iLecture !== -1, 'montee : le resultat est lu');
    ok(iFermeture !== -1, 'montee : la modal se ferme');
    ok(iLecture < iFermeture,
       'montee : un refus ne ferme pas la modal — les choix seraient perdus');

    /* Les raccourcis a une lettre ne doivent pas traverser une modal : le test
       du focus ne suffit pas, puisqu'un clic sur un bouton de la modal sort du
       champ de saisie sans fermer quoi que ce soit. */
    const raccourcis = J.slice(J.indexOf('17b. Raccourcis clavier globaux'),
                               J.indexOf("case '?':"));
    ok(/modalOuverte\(\)/.test(raccourcis),
       'raccourcis : une modal ouverte les absorbe');
    ok(/e\.key !== 'Escape'/.test(raccourcis),
       "raccourcis : Echap reste actif — il ferme la modal");
    /* Les quatre lettres qui changent l'etat du personnage. */
    ["case 'l'", "case 'r'", "case 's'", "case 'd'"].forEach(c =>
      ok(raccourcis.includes(c) || J.includes(c), 'raccourci ' + c + ' toujours present'));

    /* La liste des overlays doit couvrir les modals qui existent vraiment :
       en oublier une la laisse permeable sans que rien ne le signale. */
    const liste = J.slice(J.indexOf('const MODALS = ['), J.indexOf('function modalOuverte'));
    ['.new-char-modal-overlay.open', '.sr-modal-overlay.open',
     '.ddb-modal-overlay.open', '#compendium-overlay.open', '.modal-overlay.open']
      .forEach(sel => ok(liste.includes(sel), 'MODALS : ' + sel + ' surveille'));
    /* Et chaque overlay declare dans le markup doit y figurer. */
    const declares = [...J.matchAll(/id="([a-z0-9-]*overlay[a-z0-9-]*)"/g)].map(m => m[1]);
    declares.filter(id => id !== 'sidebar-overlay').forEach(id => {
      const parClasse = new RegExp('id="' + id + '"[^>]*class="([^"]*)"').exec(J)
                     || new RegExp('class="([^"]*)"[^>]*id="' + id + '"').exec(J);
      const couvert = liste.includes('#' + id)
        || (parClasse && parClasse[1].split(/\s+/).some(c => liste.includes('.' + c + '.open')));
      ok(couvert, 'MODALS : « ' + id +' » n\'est surveille par aucun selecteur');
    });
  }


  /* ── La forme des attaques est celle que la fiche lit ── */
  {
    /* La fiche rend atk.name et atk.degats ; les deux imports ecrivaient
       nom/degat, donc les attaques importees arrivaient sans nom ni degats.
       Les SORTS, eux, utilisent bien nom/degat : les deux formes coexistent,
       et c'est ce qui a permis a la confusion de durer. */
    const canon = { name:'', degats:'', typeDegat:'', atkType:'', prof:true, bonus:'' };
    Object.keys(canon).forEach(k =>
      ok(J.includes("C().attaques.push({ name:''"), 'attaque ajoutee a la main : forme canonique'));

    /* Aucun import ne doit plus poser les anciens noms dans une attaque. */
    const zoneImports = J.slice(J.indexOf('function parseRoll20JSON'), J.indexOf('function parseDnDBeyondJSON') + 20000);
    ok(!/attaques\.push\(\{\s*nom:/.test(zoneImports), 'import : plus de « nom » dans une attaque');
    ok(!/^\s*nom: champ\(l, 'atkname'/m.test(zoneImports), 'Roll20 : plus de « nom » dans une attaque');
    /* Le filtre final lit le meme champ que la construction : en renommer un
       sans l'autre vidait silencieusement toute la liste. */
    ok(!/filter\(a => a\.nom\)/.test(J), 'Roll20 : le filtre lit le champ qui existe');

    /* La migration reprend les fiches deja importees, et ne touche pas aux sorts. */
    const c = { attaques: [{ nom:'Rapière', degat:'1d8+4', typeDegat:'perçant' }],
                spells:   [{ nom:'Trait de feu', degat:'1d10' }] };
    ok(migrerNomsAttaques(c), 'migration : il y a quelque chose a reprendre');
    eq(c.attaques[0].name, 'Rapière', 'migration : le nom est repris');
    eq(c.attaques[0].degats, '1d8+4', 'migration : les degats sont repris');
    eq(c.attaques[0].nom, undefined, 'migration : l\'ancien champ disparait');
    eq(c.spells[0].nom, 'Trait de feu', 'migration : les sorts gardent leur forme');
    eq(c.spells[0].degat, '1d10', 'migration : les degats de sort sont intacts');
    ok(!migrerNomsAttaques(c), 'migration : rien a refaire au second passage');

    /* Une attaque deja a la bonne forme ne doit pas etre ecrasee. */
    const d = { attaques: [{ name:'Arc', degats:'1d8', nom:'VIEUX', degat:'VIEUX' }] };
    migrerNomsAttaques(d);
    eq(d.attaques[0].name, 'Arc', 'migration : ne remplace pas une valeur deja bonne');
    eq(d.attaques[0].degats, '1d8', 'migration : idem pour les degats');
  }

  /* ── Le dé de vie se lit dans toutes ses formes ── */
  {
    /* c.deVie a trois formes selon le chemin de creation. Le repos court la
       lisait avec .replace('1d',''), ce qui marchait pour « 1d10 » mais donnait
       un d5 pour « 5d10 » et un d110 pour « 11d10 » — d'ou un defaut qui ne se
       voyait qu'apres un import. */
    const avec = (deVie, classes) => deDeVie({ deVie, classes });
    const g = [{ classe:'Fighter', sousClasse:'', niveau:5 }];

    eq(avec('1d10', g), 10, 'de de vie : forme normale');
    eq(avec('1d6', g), 6, 'de de vie : d6');
    eq(avec('1d12', g), 12, 'de de vie : d12');
    eq(avec('5d10', g), 10, 'de de vie : forme Roll20 (nombre total devant)');
    eq(avec('11d10', g), 10, 'de de vie : deux chiffres devant');
    /* Plusieurs des : on prend celui de la classe ou il a le plus de niveaux. */
    eq(avec('5d10 + 2d8', [{ classe:'Fighter', niveau:5 }, { classe:'Wizard', niveau:2 }]), 10,
       'de de vie : multiclasse, la classe dominante decide');
    eq(avec('5d10 + 2d8', [{ classe:'Fighter', niveau:2 }, { classe:'Wizard', niveau:5 }]), 6,
       'de de vie : multiclasse, l\'autre sens');
    /* Libelle vide ou illisible : la classe tranche, sinon d8. */
    eq(avec('', g), 10, 'de de vie : sans libelle, la classe decide');
    eq(avec('n\'importe quoi', [{ classe:'', niveau:1 }]), 8, 'de de vie : dernier recours');

    /* Le repos court doit passer par la, pas re-decouper la chaine. */
    ok(/const dieType = deDeVie\(c\)/.test(J), 'repos court : lit la taille au lieu de la deviner');
    /* Les trois autres decoupages de « 1d » lisent DND_CLASSES[...].de, dont la
       forme est garantie. C'est la chaine STOCKEE sur le personnage qui ne doit
       plus etre decoupee a l'aveugle, puisqu'elle prend trois formes. */
    {
      let aveugle = false;
      let i = J.indexOf('c.deVie');
      while (i !== -1) {
        if (J.slice(i, i + 60).includes(".replace('1d'")) aveugle = true;
        i = J.indexOf('c.deVie', i + 1);
      }
      ok(!aveugle, 'c.deVie : plus de decoupage a l aveugle');
    }
  }

  /* ── Le libellé suit la classe dominante à la montée ── */
  {
    /* Sans ca, un Magicien qui multiclasse Guerrier garde son d6 pour toujours,
       et le repos court avec. */
    const m = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:5,customSousClasse:''}], deVie:'1d6' });
    applyLevelUp(m, planLevelUp(m, 'Wizard'), {});
    eq(m.deVie, '1d6', 'mono-classe : le de ne bouge pas');

    const mc = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:2,customSousClasse:''},
                               {classe:'Fighter',sousClasse:'Champion',niveau:5,customSousClasse:''}],
                      deVie:'1d6' });
    applyLevelUp(mc, planLevelUp(mc, 'Fighter'), {});
    eq(mc.deVie, '1d10', 'multiclasse : le de suit la classe dominante');
    eq(deDeVie(mc), 10, 'et le repos court roulera le bon de');
  }


  /* ── Une feuille vierge n'a pas de classe fantome ── */
  {
    /* emptyCharacter pose une entree de classe vide. La compter donnait un
       niveau total de 1 a un personnage sans classe, puis applyLevelUp
       ajoutait la vraie classe A COTE : deux classes, total 2, des la
       premiere montee. */
    const vierge = () => hero({ classes:[{ classe:'', sousClasse:'', niveau:1, customSousClasse:'' }] });

    eq(classesReelles(vierge()).length, 0, 'feuille vierge : aucune classe reelle');
    eq(classesReelles(hero({ classes:[{classe:'Fighter',niveau:3},{classe:'',niveau:1}] })).length, 1,
       'une entree vide a cote d\'une vraie ne compte pas');

    const c = vierge();
    const p = planLevelUp(c, 'Fighter');
    ok(p.ok, 'feuille vierge : la montee est possible');
    ok(p.isNewClass, 'feuille vierge : la classe est nouvelle');
    eq(p.totalAfter, 1, 'feuille vierge : on arrive au niveau 1, pas 2');
    applyLevelUp(c, p, { hp:8 });
    eq(c.classes.length, 1, 'feuille vierge : une seule classe apres la montee');
    eq(c.classes[0].classe, 'Fighter', 'feuille vierge : la bonne classe');
    eq(getTotalLevel(c), 1, 'feuille vierge : niveau total 1');

    /* Une vraie classe a cote d'une entree vide : l'indice doit designer la
       bonne, sinon le plan et l'application parlent de deux classes
       differentes. */
    const mix = hero({ classes:[{ classe:'', sousClasse:'', niveau:1, customSousClasse:'' },
                                { classe:'Wizard', sousClasse:'', niveau:3, customSousClasse:'' }] });
    const pm = planLevelUp(mix, 'Wizard');
    eq(pm.fromLevel, 3, 'entree vide en tete : le niveau lu est le bon');
    ok(!pm.isNewClass, 'entree vide en tete : la classe existe deja');
    applyLevelUp(mix, pm, { hp:5 });
    eq(mix.classes.length, 1, 'entree vide en tete : elle a disparu');
    eq(mix.classes[0].niveau, 4, 'entree vide en tete : c\'est bien le Magicien qui monte');
  }

  /* ── La vue partagée compte le niveau total ── */
  {
    /* c.niveau vaut le niveau de la PREMIERE classe apres une montee, mais le
       niveau TOTAL apres un import. La vue en tirait le bonus de maitrise. */
    const mc = { niveau: 5, classes:[{classe:'Fighter',niveau:5},{classe:'Wizard',niveau:5}] };
    eq(getTotalLevel(mc), 10, 'multiclasse : le total est 10, pas 5');
    eq(Math.ceil(getTotalLevel(mc) / 4) + 1, 4, 'multiclasse : bonus de maitrise +4');
    eq(Math.ceil((parseInt(mc.niveau) || 1) / 4) + 1, 3, 'et +3 si on croit c.niveau');

    const vue = J.slice(J.indexOf('function renderViewSheet'), J.indexOf('function renderViewSheet') + 4000);
    /* Un const portant le nom d'une fonction appelee juste en dessous la
       masquait : sans avatarPng, la vue plantait sur une zone morte temporelle
       — donc pour presque toutes les fiches, puisque peu portent une image.
       Trouve en essayant de verifier le bonus de maitrise, pas par l'audit. */
    ok(!vue.includes('const avatarHtml ='),
       'vue partagee : plus de const qui masque la fonction avatarHtml');
    ok(vue.includes('const avatarBloc ='),
       'vue partagee : le bloc d\'avatar a son propre nom');
    ok(/const niveau = getTotalLevel\(c\)/.test(vue),
       'vue partagee : le niveau vient du total');
    ok(!/const niveau = parseInt\(c\.niveau\)/.test(vue),
       'vue partagee : plus de confiance a c.niveau');
  }

  /* ── Le bonus d'historique ne se perd plus ── */
  {
    /* La boucle sautait les caracteristiques sans valeur du tableau, et le
       +2/+1 partait avec elles. Ce qui suit est la forme du code, faute de DOM :
       la condition doit dependre AUSSI du bonus, pas seulement de la valeur. */
    /* Trois endroits appellent abilBox.querySelectorAll — on visait par erreur
       celui qui VIDE les cases. On ancre donc sur la ligne qui calcule le
       bonus, qui n'existe que dans le bloc voulu. */
    const debutAbil = J.indexOf("const bonus = (bgOk && k === b2 ? 2 : 0)");
    const bloc = J.slice(Math.max(0, debutAbil - 400), debutAbil + 400);
    ok(/if \(!s\.value && !bonus\) return/.test(bloc),
       'bonus d\'historique : une case vide ne le fait plus disparaitre');
    ok(/parseInt\(c\[k\]\) \|\| 10/.test(bloc),
       'bonus d\'historique : a defaut de choix, on part de la fiche');
    ok(!/if \(!s\.value\) return;/.test(bloc),
       'bonus d\'historique : plus de sortie seche sur la valeur');
  }

  /* ── Les doublons de nom se signalent ── */
  {
    const bloc = J.slice(J.indexOf('const noteNom'), J.indexOf('const noteNom') + 900);
    ok(bloc.length > 100, 'doublons : le garde existe');
    ok(/already goes by this name/.test(bloc), 'doublons : le joueur est prevenu');
    /* On previent, on n'interdit pas : deux jumeaux sont le droit du joueur. */
    ok(!/return;/.test(bloc.slice(0, bloc.indexOf('addEventListener'))),
       'doublons : aucun blocage, seulement un avertissement');
    /* Le nom par defaut, pas les commentaires : « Nouveau personnage » subsiste
       legitimement dans un commentaire de code, et l'assertion large le prenait
       pour une chaine affichee. */
    ok(!J.includes("trim() || 'Nouveau personnage'"),
       'nom par defaut : plus de francais dans l interface joueur');
    ok(J.includes("trim() || 'New character'"),
       'nom par defaut : New character');
  }


  /* ── Resilient donne la maitrise de sauvegarde ── */
  {
    /* Le don applique son +1 et s'inscrit dans les capacites, mais n'ecrivait
       jamais c.saveXxx. Un Magicien qui le prend en CON pour ses jets de
       Concentration n'avait toujours pas la maitrise sur sa fiche, alors que la
       description affichee la lui promet mot pour mot. */
    const m = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:3,customSousClasse:''}], con:14 });
    eq(m.saveCon, undefined, 'avant : pas de maitrise en CON');
    const r = applyLevelUp(m, planLevelUp(m, 'Wizard'),
                           { asiMode:'feat', feat:'Resilient', featAbil:'con' });
    eq(m.saveCon, true, 'Resilient : la maitrise de sauvegarde est posee');
    eq(m.con, 15, 'Resilient : le +1 est applique aussi');
    ok(r.log.some(x => /Save proficiency/.test(x)), 'Resilient : le journal le dit');

    /* Les six caracteristiques ecrivent la bonne cle. */
    const CLES = { for:'saveFor', dex:'saveDex', con:'saveCon',
                   int:'saveInt', sag:'saveSag', cha:'saveCha' };
    for (const [abil, cle] of Object.entries(CLES)) {
      const h = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:3,customSousClasse:''}] });
      applyLevelUp(h, planLevelUp(h, 'Wizard'), { asiMode:'feat', feat:'Resilient', featAbil:abil });
      eq(h[cle], true, 'Resilient ' + abil.toUpperCase() + ' : ' + cle);
    }

    /* Un autre don ne doit pas accorder de maitrise au passage. */
    const autre = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:3,customSousClasse:''}], con:14 });
    applyLevelUp(autre, planLevelUp(autre, 'Wizard'),
                 { asiMode:'feat', feat:'Durable', featAbil:'con' });
    eq(autre.saveCon, undefined, 'Durable : aucune maitrise accordee');

    /* Le journal parle la langue de l'interface. */
    ok(r.log.some(x => /^Feat : /.test(x)), 'journal : « Feat », pas « Don »');
    ok(!J.includes('\`Don : \${ch.feat}\`'), 'journal : plus de « Don » en francais');
  }

  /* ── Le bonus de maitrise ne se recalcule plus a cote ── */
  {
    /* Deux copies d'une meme formule finissent par diverger : c'est deja arrive
       trois fois dans ce fichier avec les tables d'emplacements. */
    const plan = J.slice(J.indexOf('const pbLigne'), J.indexOf('const pbLigne') + 200);
    ok(/pb\(totalLv\)/.test(plan), 'onglet plan : le bonus vient de pb()');
    ok(!J.includes('Math.ceil(totalLv / 4) + 1'),
       'onglet plan : plus de formule recopiee');
    /* Et pb() donne bien ce que l'ancienne formule donnait, sur toute la plage. */
    for (let n = 1; n <= 20; n++) {
      eq(pb(n), Math.ceil(n / 4) + 1, 'pb(' + n + ') : identique a l ancienne formule');
    }
  }


  /* ── La sous-classe choisie dans la modal entre dans le plan ── */
  {
    /* Le plan etait calcule a l'ouverture de la modal, donc AVANT le choix de
       sous-classe — et le choix ne le recalculait pas. Un Guerrier qui prend
       Eldritch Knight au niveau 3 devient lanceur de sorts : l'ecran n'en
       disait rien, le message d'apres-coup si. */
    const guerrier = () => hero({ classes:[{classe:'Fighter',sousClasse:'',niveau:2,customSousClasse:''}] });

    const sans = planLevelUp(guerrier(), 'Fighter');
    eq(topSlotLevel(sans.slotsAfter), 0, 'Guerrier 3 sans sous-classe : aucun emplacement');

    const ek = planLevelUp(guerrier(), 'Fighter', { subclass:'Eldritch Knight' });
    eq(topSlotLevel(ek.slotsBefore), 0, 'Eldritch Knight : rien avant la montee');
    eq(topSlotLevel(ek.slotsAfter),  1, 'Eldritch Knight : le niveau 3 ouvre les sorts de niveau 1');
    /* computeMulticlassSlots rend null pour un non-lanceur : lire [0] dessus
       faisait PLANTER le test au lieu de le faire echouer, ce qui masquait
       toutes les assertions suivantes. */
    eq((ek.slotsAfter || [])[0], 2, 'Eldritch Knight : deux emplacements de niveau 1');

    /* Une sous-classe non lanceuse ne doit rien inventer. */
    const champ = planLevelUp(guerrier(), 'Fighter', { subclass:'Champion' });
    eq(topSlotLevel(champ.slotsAfter), 0, 'Champion : toujours pas de sorts');

    /* Le Roublard a le meme mecanisme. */
    const rogue = hero({ classes:[{classe:'Rogue',sousClasse:'',niveau:2,customSousClasse:''}] });
    eq(topSlotLevel(planLevelUp(rogue, 'Rogue', { subclass:'Arcane Trickster' }).slotsAfter), 1,
       'Arcane Trickster : le niveau 3 ouvre les sorts de niveau 1');
    eq(topSlotLevel(planLevelUp(rogue, 'Rogue', { subclass:'Thief' }).slotsAfter), 0,
       'Thief : aucun emplacement');

    /* Les nouveautes de la sous-classe retenue apparaissent dans le plan. */
    ok(!sans.subFeatures.length, 'sans sous-classe : aucune capacite de sous-classe annoncee');
    ok(ek.subFeatures.length > 0, 'Eldritch Knight : ses capacites de niveau 3 sont annoncees');
    ok(ek.subFeatures.every(f => f.source === 'Eldritch Knight'),
       'les capacites de sous-classe portent son nom comme source');
    ok(ek.newFeatures.some(f => f.source === 'Eldritch Knight'),
       'la liste des nouveautes inclut la sous-classe');
    eq(ek.subName, 'Eldritch Knight', 'le plan porte la sous-classe retenue');

    /* Une sous-classe inconnue est ignoree, pas injectee. */
    const faux = planLevelUp(guerrier(), 'Fighter', { subclass:'Bladesinger' });
    eq(faux.subName, '', 'sous-classe etrangere a la classe : ignoree');
    eq(topSlotLevel(faux.slotsAfter), 0, 'sous-classe etrangere : aucun emplacement');

    /* Un personnage qui a DEJA sa sous-classe garde la sienne : le menu n'est
       pas affiche, et une valeur residuelle ne doit pas la remplacer. */
    const deja = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:5,customSousClasse:''}] });
    const p6 = planLevelUp(deja, 'Fighter', { subclass:'Eldritch Knight' });
    eq(p6.subName, 'Champion', 'sous-classe deja posee : le pending ne la remplace pas');
    eq(topSlotLevel(p6.slotsAfter), 0, 'sous-classe deja posee : pas de sorts voles a une autre');

    /* Les capacites a choix de la sous-classe sont proposees. Cas reel : une
       fiche importee sans sous-classe qui monte au niveau 7. */
    const tardif = () => hero({ classes:[{classe:'Fighter',sousClasse:'',niveau:6,customSousClasse:''}] });
    const nom = (p) => (p.featureChoices || []).map(f => f.name);
    ok(!nom(planLevelUp(tardif(), 'Fighter')).includes('Additional Fighting Style'),
       'sans sous-classe : le choix du Champion n est pas propose');
    ok(nom(planLevelUp(tardif(), 'Fighter', { subclass:'Champion' })).includes('Additional Fighting Style'),
       'Champion retenu : son choix de niveau 7 est propose');
  }

  /* ── Le plan annonce exactement ce que la montee produit ── */
  {
    /* C'est l'invariant qui a casse : deux calculs separes des memes
       emplacements, l'un dans la modal et l'autre apres coup, qui se sont
       contredits des qu'une sous-classe est entree en jeu. */
    const cas = [];
    Object.keys(CLASS_DATA).forEach(cls => {
      const subs = Object.keys(SUBCLASS_DATA[cls] || {});
      [1, 2, 4, 9, 16].forEach(niv => {
        cas.push([cls, niv, '']);
        if (niv === 2 && subs.length) subs.forEach(sub => cas.push([cls, niv, sub]));
      });
    });
    /* Plus une feuille portant une entree de classe vide : l'ancien calcul
       indexait la mauvaise classe des qu'il y en avait une. */
    cas.push(['Fighter', 2, 'Eldritch Knight', true]);

    cas.forEach(([cls, niv, sub, vide]) => {
      const c = hero({ classes: (vide ? [{ classe:'', sousClasse:'', niveau:1, customSousClasse:'' }] : [])
        .concat([{ classe:cls, sousClasse:'', niveau:niv, customSousClasse:'' }]) });
      const plan = planLevelUp(c, cls, { subclass: sub });
      if (!plan.ok) return;
      const annonce = plan.slotsAfter;
      applyLevelUp(c, plan, { hp:5, subclass: sub });
      eq(annonce, computeMulticlassSlots(c),
         cls + ' ' + niv + '→' + (niv + 1) + (sub ? ' / ' + sub : '') + (vide ? ' (entree vide)' : '')
         + ' : le plan annonce les emplacements reellement obtenus');
    });
  }

  /* ── L'ecran ne recalcule plus les emplacements dans son coin ── */
  {
    ok(!J.includes('function simulateLevel'),
       'simulateLevel supprimee : le plan porte slotsAfter');
    ok(J.includes('topSlotLevel(plan.slotsAfter)'),
       'la modal lit les emplacements du plan');
    /* Le menu de sous-classe recalcule le plan au lieu d afficher un apercu. */
    const h = J.indexOf("$('lvlup-sub').addEventListener('change'");
    ok(h !== -1, 'le menu de sous-classe a bien un gestionnaire');
    const bloc = J.slice(h, h + 260);
    ok(/refresh\(\)/.test(bloc), 'choisir sa sous-classe recalcule le plan');
  }


  /* ── Niveaux d'acquisition verifies sur les tables 2024 ── */
  {
    /* Chacun de ces paliers etait faux et a ete relu sur dnd2024.wikidot.com et
       AideDD. Ils sont ecrits ici en clair : une table qui derive redevient
       invisible a la lecture, c'est comme ca qu'ils s'etaient installes. */
    const noms = (cls, lvl) => (CLASS_DATA[cls]?.features?.[lvl] || []).map(f => f.name);
    const a = (cls, lvl, nom) => ok(noms(cls, lvl).includes(nom),
      cls + ' ' + lvl + ' : ' + nom + ' attendu — trouve ' + JSON.stringify(noms(cls, lvl)));
    const pas = (cls, lvl, nom) => ok(!noms(cls, lvl).includes(nom),
      cls + ' ' + lvl + ' : ' + nom + ' ne doit pas y etre');

    /* BARDE : Expertise 2 et 9, Countercharm 7. */
    a('Bard', 2, 'Expertise');
    a('Bard', 9, 'Expertise');
    pas('Bard', 7, 'Expertise');
    a('Bard', 7, 'Countercharm');
    pas('Bard', 6, 'Countercharm');
    eq(noms('Bard', 6), ['Subclass Feature'], 'Barde 6 : rien que la sous-classe');
    /* « Superior Bardic Inspiration » au niveau 9 etait un doublon sous un autre
       nom de « Superior Inspiration », qui est au 18 et y est toujours. */
    pas('Bard', 9, 'Superior Bardic Inspiration');
    a('Bard', 18, 'Superior Inspiration');
    eq(expertiseAt('Bard', 2), 2, 'Barde 2 : deux competences');
    eq(expertiseAt('Bard', 9), 2, 'Barde 9 : deux de plus');
    eq(expertiseAt('Bard', 7), 0, 'Barde 7 : aucune');

    /* ROUBLARD : 1 et 6. Ils etaient justes — ne pas les aligner sur le Barde. */
    eq(expertiseAt('Rogue', 1), 2, 'Roublard 1 : deux competences');
    eq(expertiseAt('Rogue', 6), 2, 'Roublard 6 : deux de plus');

    /* RODEUR : aucune Expertise au niveau 1 ; une par Deft Explorer au 2 ;
       deux au 9, soit trois en tout. */
    pas('Ranger', 1, 'Expertise');
    eq(noms('Ranger', 1).sort(), ['Favored Enemy','Spellcasting','Weapon Mastery'],
       'Rodeur 1 : trois capacites, pas d Expertise');
    eq(expertiseAt('Ranger', 1), 0, 'Rodeur 1 : aucune competence en Expertise');
    eq(expertiseAt('Ranger', 2), 1, 'Rodeur 2 : une, par Deft Explorer');
    eq(expertiseAt('Ranger', 9), 2, 'Rodeur 9 : deux de plus');
    {
      const de = (CLASS_DATA.Ranger.features[2] || []).find(f => f.name === 'Deft Explorer');
      ok(de && !/\bCanny\b/i.test(de.desc || ''), 'Deft Explorer : « Canny » n existe plus en 2024');
      ok(de && /languages?/i.test(de.desc || ''), 'Deft Explorer : les deux langues sont dites');
      ok(!FEATURE_CHOICES['Deft Explorer'], 'Deft Explorer n est plus un choix');
      const neuf = (CLASS_DATA.Ranger.features[9] || []).find(f => f.name === 'Expertise');
      ok(neuf && /3 total/.test(neuf.desc || ''), 'Rodeur 9 : trois au total, pas quatre');
    }

    /* MAGICIEN : Scholar, six competences, aucune langue. */
    {
      const sc = (CLASS_DATA.Wizard.features[2] || []).find(f => f.name === 'Scholar');
      ok(sc, 'Magicien 2 : Scholar');
      ok(!/language/i.test(sc.desc || ''), 'Scholar : aucune langue accordee');
      ['Arcana','History','Investigation','Medicine','Nature','Religion'].forEach(k =>
        ok(new RegExp(k).test(sc.desc || ''), 'Scholar : ' + k + ' doit etre proposee'));
      eq(expertiseAt('Wizard', 2), 1, 'Scholar : une competence en Expertise');
    }

    /* ENSORCELEUR : metamagie aux niveaux 2, 10 et 17. */
    a('Sorcerer', 2,  'Metamagic');
    a('Sorcerer', 10, 'Metamagic (2 more)');
    a('Sorcerer', 17, 'Metamagic (2 final)');
    /* Et chacun de ces trois paliers doit REELLEMENT proposer deux options :
       la correspondance se fait par nom exact, un libelle qui ne figure pas
       dans FEATURE_CHOICES n'offrait rien du tout. */
    /* Le || {} n'est pas de la coquetterie : sans lui, un palier qui redevient
       muet fait PLANTER le test au lieu de le faire echouer, et toutes les
       assertions suivantes disparaissent avec lui. */
    [[2,'Metamagic'],[10,'Metamagic (2 more)'],[17,'Metamagic (2 final)']].forEach(([lvl, nom]) => {
      const ch = featureChoicesAt('Sorcerer', null, lvl);
      const c0 = ch[0] || {};
      eq(ch.length, 1, 'Ensorceleur ' + lvl + ' : un bloc de choix');
      eq(c0.name, nom, 'Ensorceleur ' + lvl + ' : ' + nom);
      eq(c0.pick, 2, 'Ensorceleur ' + lvl + ' : deux options a retenir');
      eq((c0.options || []).length, 10, 'Ensorceleur ' + lvl + ' : les dix options');
    });
    /* Les trois paliers portent des noms distincts, sinon leurs choix
       s'ecraseraient : la cle de stockage est « classe::nom ». */
    {
      const trois = [2,10,17].map(l => (featureChoicesAt('Sorcerer', null, l)[0] || {}).name);
      eq(new Set(trois).size, 3, 'metamagie : trois libelles distincts');
    }

    /* Toute capacite qui declare expertise doit declarer un entier positif. */
    Object.entries(CLASS_DATA).forEach(([cls, d]) => {
      Object.entries(d.features || {}).forEach(([lvl, liste]) => {
        (liste || []).forEach(f => {
          if (f.expertise === undefined) return;
          ok(Number.isInteger(f.expertise) && f.expertise > 0,
             cls + ' ' + lvl + ' / ' + f.name + ' : expertise invalide (' + f.expertise + ')');
        });
      });
    });
  }


  /* ── Maitrises 2024 : armes, armure, outils ── */
  {
    /* Les listes etaient celles de 2014. Le piege : isProficientWith ne
       cherchait que les mots « martial » et « simple », si bien que corriger le
       texte du Roublard — « Martial weapons that have the Finesse or Light
       property » — l'aurait rendu maitre de TOUTES les armes de guerre. Le
       defaut aurait change de sens sans qu'on le voie. */
    eq(CLASS_DATA.Bard.weaponProf, 'Simple weapons',
       'Barde : armes courantes seulement en 2024');
    eq(CLASS_DATA.Artificer.weaponProf, 'Simple weapons',
       'Artificier : armes courantes seulement');
    ok(/Finesse or Light/.test(CLASS_DATA.Rogue.weaponProf),
       'Roublard : armes de guerre Finesse ou Legeres');
    ok(/that have the Light property/.test(CLASS_DATA.Monk.weaponProf),
       'Moine : armes de guerre Legeres');
    /* Le Druide : ni armure intermediaire, ni restriction sur le metal — la
       phrase de 2014 sur le metal ne figure plus dans le livre. */
    eq(CLASS_DATA.Druid.armorProf, 'Light armor and Shields',
       'Druide : armure legere et boucliers');
    ok(!/metal/i.test(CLASS_DATA.Druid.armorProf), 'Druide : plus d interdiction du metal');
    ok(!/medium/i.test(CLASS_DATA.Druid.armorProf), 'Druide : pas d armure intermediaire');

    /* Outils accordes par la classe au niveau 1. Les huit autres classes du PHB
       n'en accordent aucun : le champ vide est la bonne reponse chez elles. */
    eq(CLASS_DATA.Rogue.toolProf,  "Thieves' Tools", 'Roublard : outils de voleur');
    eq(CLASS_DATA.Druid.toolProf,  'Herbalism Kit',  'Druide : kit d herboriste');
    ok(/Musical Instrument/.test(CLASS_DATA.Bard.toolProf || ''), 'Barde : des instruments');
    ok(/×3/.test(CLASS_DATA.Bard.toolProf || ''),                 'Barde : trois');
    ok(/Artisan/.test(CLASS_DATA.Monk.toolProf || ''),            'Moine : outils d artisan');
    ok(/or Musical Instrument/.test(CLASS_DATA.Monk.toolProf || ''), 'Moine : ou un instrument');
    ok(/Tinker/.test(CLASS_DATA.Artificer.toolProf || ''),        'Artificier : outils de bricoleur');
    /* Le Clerc avait recu par erreur les outils de l'Artificier, faute d un
       ancrage borne a la bonne classe. */
    ['Barbarian','Cleric','Fighter','Paladin','Ranger','Sorcerer','Warlock','Wizard']
      .forEach(cls => ok(!CLASS_DATA[cls].toolProf,
        cls + ' : aucune maitrise d outils de classe en 2024'));

    /* La maitrise conditionnelle, arme par arme. */
    const h = (cls) => hero({ classes:[{ classe:cls, sousClasse:'', niveau:5, customSousClasse:'' }] });
    const CAS = [
      ['Rogue',  'martial', { finesse:true,  light:false }, true,  'rapiere'],
      ['Rogue',  'martial', { finesse:true,  light:true  }, true,  'epee courte'],
      ['Rogue',  'martial', { finesse:false, light:false }, false, 'epee a deux mains'],
      ['Rogue',  'simple',  { finesse:true,  light:true  }, true,  'dague'],
      ['Monk',   'martial', { finesse:true,  light:true  }, true,  'cimeterre'],
      ['Monk',   'martial', { finesse:true,  light:false }, false, 'rapiere (Finesse sans Legere)'],
      ['Monk',   'martial', { finesse:false, light:false }, false, 'hache d armes'],
      ['Bard',   'martial', { finesse:false, light:false }, false, 'epee longue'],
      ['Bard',   'simple',  { finesse:true,  light:true  }, true,  'dague'],
      ['Fighter','martial', { finesse:false, light:false }, true,  'epee a deux mains'],
      ['Wizard', 'martial', { finesse:false, light:false }, false, 'epee a deux mains'],
      ['Wizard', 'simple',  { finesse:true,  light:true  }, true,  'dague'],
    ];
    CAS.forEach(([cls, cat, props, attendu, quoi]) =>
      eq(isProficientWith(h(cls), cat, props), attendu,
         cls + ' + ' + quoi + ' (' + cat + ')'));

    /* Multiclassage : les maitrises se cumulent, elles ne se melangent pas.
       Un texte concatene aurait fait lire la condition du Roublard a travers
       la liste du Guerrier. */
    const mc = hero({ classes:[{ classe:'Rogue', sousClasse:'', niveau:3, customSousClasse:'' },
                               { classe:'Fighter', sousClasse:'', niveau:2, customSousClasse:'' }] });
    ok(isProficientWith(mc, 'martial', { finesse:false, light:false }),
       'Roublard/Guerrier : le Guerrier donne l epee a deux mains');
    const mc2 = hero({ classes:[{ classe:'Rogue', sousClasse:'', niveau:3, customSousClasse:'' },
                                { classe:'Wizard', sousClasse:'', niveau:2, customSousClasse:'' }] });
    ok(!isProficientWith(mc2, 'martial', { finesse:false, light:false }),
       'Roublard/Magicien : ni l un ni l autre ne la donne');

    /* Propriete inconnue : on ne tranche pas contre le joueur. */
    ok(isProficientWith(h('Rogue'), 'martial', {}),
       'arme de guerre aux proprietes inconnues : pas de malus invente');
    ok(isProficientWith({ classes:[{ classe:'ClasseMaison', niveau:3 }] }, 'martial', { finesse:false }),
       'classe inconnue : pas de malus invente');

    /* La table d'armes porte desormais categorie et propriete Legere : sans
       elles, la maitrise conditionnelle n'a pas de quoi repondre. */
    const W = STARTING_WEAPONS;
    eq(W.Shortsword.cat, 'martial', 'epee courte : arme de guerre');
    eq(W.Dagger.cat,     'simple',  'dague : arme courante');
    ok(W.Scimitar.light,   'cimeterre : Legere');
    ok(W.Shortsword.light, 'epee courte : Legere');
    ok(!W.Longsword.light, 'epee longue : pas Legere');
    ok(!W.Greatsword.light,'epee a deux mains : pas Legere');
    /* La Serpe n'a pas Finesse en 2024 : Simple, Legere, 1d4 tranchant. */
    ok(!W.Sickle.finesse, 'serpe : pas de Finesse en 2024');
    ok(W.Sickle.light,    'serpe : Legere');
    Object.entries(W).forEach(([nom, w]) =>
      ok(w.cat === 'simple' || w.cat === 'martial', nom + ' : categorie manquante ou invalide'));

    /* Et le bout en bout : la ligne d'attaque construite depuis un objet porte
       la bonne maitrise, categorie et propriete venant de la table. */
    [['Rogue','Shortsword',true],['Rogue','Greatsword',false],['Rogue','Dagger',true],
     ['Wizard','Greatsword',false],['Monk','Scimitar',true],['Monk','Greataxe',false],
     ['Bard','Longsword',false],['Fighter','Greatsword',true]].forEach(([cls, nom, attendu]) => {
      const a = attackFromItem({ name:nom }, h(cls));
      ok(a, cls + ' + ' + nom + ' : une attaque est construite');
      eq(a?.prof, attendu, cls + ' + ' + nom + ' : maitrise');
    });
  }

  /* ── PV saisis a la main a la montee de niveau ── */
  {
    const auNiveau = (hp) => {
      const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:4}], con:14, pvMax:36, pvActuel:36 });
      applyLevelUp(c, planLevelUp(c, 'Fighter'), { hp });
      return c.pvMax - 36;
    };

    /* Le contrat : ce qui est saisi est ce qui est applique. Pas de plafond au
       maximum du de — un MJ qui accorde un forfait a le droit, et le refuser
       obligerait a corriger la fiche juste apres. */
    eq(auNiveau(11), 11, 'PV saisis : 11 appliques tels quels');
    eq(auNiveau(1), 1, 'PV saisis : le minimum de 1 passe');
    eq(auNiveau(99), 99, 'PV saisis : aucun plafond, le MJ decide');

    /* Les valeurs qui ne veulent rien dire retombent sur la moyenne plutot que
       d'offrir un niveau a 1 PV par inadvertance. */
    const moyenne = planLevelUp(
      hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:4}], con:14 }), 'Fighter').avgHp;
    eq(auNiveau(0), moyenne, 'PV saisis : zero retombe sur la moyenne');
    eq(auNiveau(''), moyenne, 'PV saisis : vide retombe sur la moyenne');
    eq(auNiveau(undefined), moyenne, 'PV saisis : absent retombe sur la moyenne');
    eq(auNiveau(-5), 1, 'PV saisis : un negatif ne retire pas de PV');

    /* Les PV courants suivent les PV max : on monte de niveau repose. */
    {
      const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:4}], con:14, pvMax:36, pvActuel:30 });
      applyLevelUp(c, planLevelUp(c, 'Fighter'), { hp:11 });
      eq(c.pvMax, 47, 'PV max apres saisie');
      eq(c.pvActuel, 41, 'PV courants suivent le gain');
      eq(c.nbDeVie, 3, 'un de de vie de plus');
    }

    /* Le plan de niveaux garde la trace du nombre saisi : sans ca, rouvrir
       l'onglet plan afficherait une ligne vide pour ce niveau. */
    {
      const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:4}], con:14, pvMax:36, pvActuel:36 });
      applyLevelUp(c, planLevelUp(c, 'Fighter'), { hp:11 });
      eq(c.levelPlan.rows[4].hp, 11, 'le plan de niveaux retient les PV saisis');
    }
  }

  /* ── Cablage du champ de PV (lecture du source) ── */
  {
    /* « // Sous-classe » apparait deux fois dans le fichier : on borne la
       recherche de la fin APRES le debut, sinon le bloc ressort vide et toutes
       les assertions qui suivent passent a cote sans rien dire. */
    const debutHp = J.indexOf("$('lvlup-hp-row').innerHTML");
    const bloc = J.slice(debutHp, J.indexOf('// Sous-classe', debutHp));
    ok(/id="lvlup-hp-input"/.test(bloc), 'PV : le champ de saisie existe');
    ok(/type="number"/.test(bloc), 'PV : champ numerique');
    ok(/min="1"/.test(bloc), 'PV : pas de valeur negative au clavier');

    /* La regression exacte deja rencontree : le gestionnaire de frappe doit
       lire le champ sans le reecrire, sinon on ne peut plus l'effacer pour
       retaper — « 12 » passait par un « 1 » aussitot fige. */
    const frappe = bloc.slice(bloc.indexOf("addEventListener('input'"));
    ok(/ecrire:\s*false/.test(frappe.slice(0, 200)),
       'PV : la frappe ne reecrit pas le champ');
    ok(/addEventListener\('blur'/.test(bloc),
       'PV : la sortie du champ remet la derniere valeur valable');

    /* Les deux boutons passent par la meme porte que la frappe : sans ca, deux
       verites concurrentes pour une seule valeur. */
    const poses = bloc.match(/poserHp\(/g) || [];
    ok(poses.length >= 4, 'PV : moyenne, jet, frappe et sortie passent tous par poserHp');
    ok(!/lvlup-hp-pick/.test(bloc), 'PV : plus de valeur figee non modifiable');

    /* L'avertissement de borne doit rester un avertissement : s'il devenait une
       correction, le forfait du MJ serait ecrase en silence. */
    ok(/kept as entered/.test(bloc), 'PV : hors bornes, la valeur est conservee');
  }



  /* ── Le style de combat ne s'ecrase plus en multiclasse ── */
  {
    /* Le scenario d'origine : un Guerrier/Rodeur a deux styles de combat.
       Ranges sous le seul nom de la capacite, le second effacait le premier et
       le joueur perdait un choix sans aucun signe. */
    const gr = { classes: [{ classe:'Fighter', sousClasse:'Champion', niveau:5 },
                           { classe:'Ranger',  sousClasse:'Hunter',   niveau:3 }] };
    setFeatureChoice(gr, 'Fighting Style', 'Fighter', ['Defense']);
    setFeatureChoice(gr, 'Fighting Style', 'Ranger', ['Archery']);
    eq(getFeatureChoice(gr, 'Fighting Style', 'Fighter'), ['Defense'],
       'multiclasse : le Guerrier garde son style');
    eq(getFeatureChoice(gr, 'Fighting Style', 'Ranger'), ['Archery'],
       'multiclasse : le Rodeur garde le sien');

    /* La cle porte la classe : c'est ce qui rend les deux possibles. */
    ok(Object.keys(gr.featureChoices).every(k => k.includes('::')),
       'les cles portent la classe');

    /* Effacer un choix ne doit pas emporter celui de l'autre classe. */
    setFeatureChoice(gr, 'Fighting Style', 'Fighter', []);
    eq(getFeatureChoice(gr, 'Fighting Style', 'Fighter'), [], 'choix du Guerrier efface');
    eq(getFeatureChoice(gr, 'Fighting Style', 'Ranger'), ['Archery'],
       'celui du Rodeur survit a l\'effacement de l\'autre');
  }

  /* ── Les fiches ecrites avant le changement de cle ── */
  {
    /* Une fiche existante range son choix sous le nom nu. Elle doit rester
       lisible AVANT migration : une migration qui ne tourne pas ne doit pas
       faire disparaitre un choix deja fait. */
    const vieux = { classes: [{ classe:'Fighter', sousClasse:'Champion', niveau:5 }],
                    featureChoices: { 'Fighting Style': ['Defense'] } };
    eq(getFeatureChoice(vieux, 'Fighting Style', 'Fighter'), ['Defense'],
       'ancienne cle : encore lue avant migration');

    ok(migrerChoixCapacites(vieux), 'migration : elle a quelque chose a faire');
    eq(getFeatureChoice(vieux, 'Fighting Style', 'Fighter'), ['Defense'],
       'apres migration : le choix est toujours la');
    eq(vieux.featureChoices['Fighter::Fighting Style'], ['Defense'],
       'apres migration : range sous la classe');
    eq(vieux.featureChoices['Fighting Style'], undefined,
       'apres migration : l\'ancienne cle a disparu');
    ok(!migrerChoixCapacites(vieux), 'migration : rien a refaire au second passage');

    /* Une entree qui ne correspond a aucune classe du personnage est laissee
       en place plutot que jetee — on ne detruit pas ce qu'on ne comprend pas. */
    const orphelin = { classes: [{ classe:'Wizard', sousClasse:'', niveau:3 }],
                       featureChoices: { 'Fighting Style': ['Defense'] } };
    migrerChoixCapacites(orphelin);
    eq(orphelin.featureChoices['Fighting Style'], ['Defense'],
       'entree sans classe proprietaire : conservee, pas jetee');
  }

  /* ── Monter la CON releve les PV deja gagnes ── */
  {
    /* Le scenario : un Guerrier 7 passe au 8 et met son ASI en CON.
       Le modificateur passe de +2 a +3, donc chaque niveau deja pris vaut un
       point de vie de plus. Sans rattrapage, huit points disparaissaient. */
    const g = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:7}],
                     con:14, pvMax:60, pvActuel:60 });
    const plan = planLevelUp(g, 'Fighter');
    const gain = plan.avgHp;                 /* calcule avec l'ancien modificateur */
    applyLevelUp(g, plan, { asiMode:'abil', asiA:'con', asiB:'' });
    eq(g.con, 16, 'CON montee de 2');
    /* +gain pour le niveau, puis +1 par niveau du total (le nouveau compris). */
    eq(g.pvMax, 60 + gain + 8, 'PV max : le niveau plus le rattrapage sur 8 niveaux');
    eq(g.pvActuel, 60 + gain + 8, 'PV courants suivent');

    /* Une CON qui monte sans changer de modificateur ne doit rien rattraper :
       14 a 15, c'est toujours +2. */
    const h2 = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:7}],
                      con:14, pvMax:60, pvActuel:60 });
    const p2 = planLevelUp(h2, 'Fighter');
    const g2 = p2.avgHp;
    applyLevelUp(h2, p2, { asiMode:'abil', asiA:'con', asiB:'dex' });
    eq(h2.con, 15, 'CON montee de 1');
    eq(h2.pvMax, 60 + g2, 'modificateur inchange : aucun rattrapage');

    /* Le +1 d'un don compte pareil : c'est le modificateur qui decide, pas le
       chemin par lequel la caracteristique a monte. */
    const h3 = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:7}],
                      con:15, pvMax:60, pvActuel:60 });
    const p3 = planLevelUp(h3, 'Fighter');
    const g3 = p3.avgHp;
    applyLevelUp(h3, p3, { asiMode:'feat', feat:'Durable', featAbil:'con' });
    eq(h3.con, 16, 'don : CON a 16');
    eq(h3.pvMax, 60 + g3 + 8, 'don : rattrapage aussi');

    /* Le journal doit le dire, sinon le joueur voit ses PV bouger sans savoir
       pourquoi. */
    const h4 = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:7}],
                      con:14, pvMax:60, pvActuel:60 });
    const r4 = applyLevelUp(h4, planLevelUp(h4, 'Fighter'),
                            { asiMode:'abil', asiA:'con', asiB:'' });
    ok(r4.log.some(x => /rétroactif/.test(x)), 'le rattrapage est noté dans le journal');
  }

  // PV : moyenne PHB = dé/2 + 1, plus CON, plus le bonus d'espèce
  {
    const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:1}], con:14 });
    const p = planLevelUp(c, 'Fighter');
    eq(p.avgHp, 8,  'd10 : moyenne 6 (= 10/2 + 1) + CON 2');
    eq(p.maxHp, 12, 'd10 max 10 + CON 2');
    eq(p.minHp, 3,  'd10 min 1 + CON 2');
  }
  {
    const c = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:1}], con:14, species:'Dwarf' });
    const p = planLevelUp(c, 'Wizard');
    eq(p.speciesHp, 1, 'Nain : +1 PV/niveau pris en compte');
    eq(p.avgHp, 7, 'd6 moyenne 4 + CON 2 + Nain 1');
  }

  // Sous-classe : requise au niveau 3, et seulement si aucune n'est choisie
  {
    const c2 = hero({ classes:[{classe:'Cleric',sousClasse:'',niveau:2}] });
    ok(planLevelUp(c2, 'Cleric').needsSubclass, 'sous-classe requise en montant au niveau 3');
    const c3 = hero({ classes:[{classe:'Cleric',sousClasse:'Life Domain',niveau:3}] });
    ok(!planLevelUp(c3, 'Cleric').needsSubclass, 'sous-classe déjà choisie : plus demandée');
    const c1 = hero({ classes:[{classe:'Cleric',sousClasse:'',niveau:1}] });
    ok(!planLevelUp(c1, 'Cleric').needsSubclass, 'pas de sous-classe au niveau 2');
  }

  // ASI : lu dans la table de la classe, sur le niveau DE CLASSE
  [3,7,9,11,15].forEach(l => ok(planLevelUp(hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:l}] }), 'Rogue').isAsi,
    `Roublard : ASI en montant au niveau ${l + 1}`));
  /* 18 a quitte cette liste : le niveau 19 donne un don epique, donc un don.
     L'y laisser verrouillait le defaut — tout correctif echouait au pre-commit. */
  [1,4,5,13].forEach(l => ok(!planLevelUp(hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:l}] }), 'Rogue').isAsi,
    `Roublard : pas d'ASI en montant au niveau ${l + 1}`));
  // Le Guerrier en a deux de plus (6 et 14) — une liste generique les raterait
  [3,5,7,11,13,15].forEach(l => ok(planLevelUp(hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:l}] }), 'Fighter').isAsi,
    `Guerrier : ASI en montant au niveau ${l + 1}`));
  /* Niveau 19 : un don epique, donc un don — et l'assistant doit le proposer.
     L'assertion inverse figeait le defaut : elle affirmait pour les 14 classes
     que le niveau 19 n'offre rien, ce qui etait vrai du code et faux de la regle. */
  Object.keys(CLASS_DATA).forEach(cls => {
    const p19 = planLevelUp(hero({ classes:[{classe:cls,sousClasse:'',niveau:18}] }), cls);
    ok(p19.isAsi, `${cls} : le niveau 19 propose un don`);
    ok(p19.isEpic, `${cls} : et c'est un don epique`);
    ok(p19.newFeatures.some(f => f.type === 'epic'), `${cls} : don epique au niveau 19`);
    /* Un ASI ordinaire ne doit pas se faire passer pour un don epique. */
    const p4 = planLevelUp(hero({ classes:[{classe:cls,sousClasse:'',niveau:3}] }), cls);
    if (p4.isAsi) ok(!p4.isEpic, `${cls} : le niveau 4 est un ASI, pas un don epique`);
  });

  /* Le plafond depend du don : 30 pour un don epique, 20 sinon. */
  {
    const epique = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:18}], for:20 });
    applyLevelUp(epique, planLevelUp(epique, 'Fighter'),
                 { asiMode:'feat', feat:'Boon of the Iron Mind', featAbil:'for' });
    eq(epique.for, 21, 'don epique : la caracteristique depasse 20');

    const ordinaire = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:3}], for:20 });
    applyLevelUp(ordinaire, planLevelUp(ordinaire, 'Fighter'),
                 { asiMode:'feat', feat:'Durable', featAbil:'for' });
    eq(ordinaire.for, 20, 'don ordinaire : le plafond de 20 tient');
  }
  // Chaque classe a au minimum les ASI de base
  Object.entries(CLASS_DATA).forEach(([cls, d]) => {
    const lv = Object.entries(d.features).filter(([, fs]) => fs.some(f => f.type === 'asi')).map(([l]) => +l);
    [4,8,12,16].forEach(n => ok(lv.includes(n), `${cls} : ASI manquant au niveau ${n}`));
  });
  // Multiclasse : un Guerrier 3 / Magicien 3 qui monte Guerrier 4 a bien son ASI
  ok(planLevelUp(hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:3},{classe:'Wizard',sousClasse:'Evoker',niveau:3}] }), 'Fighter').isAsi,
     'ASI calculé sur le niveau de classe, pas le total');

  // Bornes
  eq(planLevelUp(hero({ classes:[{classe:'Bard',sousClasse:'College of Lore',niveau:20}] }), 'Bard').ok, false, 'niveau 21 refusé');
  eq(planLevelUp(hero({}), 'Sorceror').ok, false, 'classe inconnue refusée');
  eq(planLevelUp(hero({ classes:[{classe:'Bard',sousClasse:'College of Lore',niveau:20}] }), 'Wizard').ok, false,
     'niveau total 20 : plus de multiclassage');

  // Application : niveau, PV, dés de vie, sous-classe
  {
    const c = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:2}], con:14, pvMax:14, pvActuel:9, nbDeVie:2 });
    const r = applyLevelUp(c, planLevelUp(c, 'Wizard'), { hp:5, subclass:'Evoker' });
    ok(r.ok, 'montée appliquée');
    eq(c.classes[0].niveau, 3, 'niveau de classe incrémenté');
    eq(c.classes[0].sousClasse, 'Evoker', 'sous-classe écrite');
    eq(c.pvMax, 19, 'PV max +5');
    eq(c.pvActuel, 14, 'PV actuels suivent le gain');
    eq(c.nbDeVie, 3, 'dé de vie ajouté');
    eq(c.niveau, 3, 'champ legacy synchronisé');
  }
  // Sans choix de PV, on prend la moyenne
  {
    const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:1}], con:14, pvMax:12 });
    applyLevelUp(c, planLevelUp(c, 'Fighter'), {});
    eq(c.pvMax, 20, 'PV : moyenne par défaut (+8)');
  }
  // ASI : +2, ou +1/+1, plafonné à 20
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:16, con:12 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'abil', asiA:'dex' });
    eq(c.dex, 18, 'ASI +2');
  }
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:16, con:12 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'abil', asiA:'dex', asiB:'con' });
    eq([c.dex, c.con], [17, 13], 'ASI +1/+1');
  }
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:19 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'abil', asiA:'dex' });
    eq(c.dex, 20, 'ASI plafonné à 20');
  }
  // Don : enregistré dans les capacités + son +1 de caractéristique
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:16 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'feat', feat:'Crossbow Expert', featAbil:'dex' });
    eq(c.dex, 17, 'don : +1 appliqué');
    eq(c.customFeatures.length, 1, 'don enregistré dans les capacités');
    eq(c.customFeatures[0].name, 'Crossbow Expert', 'nom du don');
    ok(/Rogue 4/.test(c.customFeatures[0].source), 'source du don datée du niveau');
  }
  // Multiclassage : nouvelle classe au niveau 1, l'ancienne intacte
  {
    const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:5}], int:14, for:15, pvMax:44 });
    const p = planLevelUp(c, 'Wizard');
    ok(p.isNewClass, 'multiclassage détecté');
    eq(p.toLevel, 1, 'la nouvelle classe démarre au niveau 1');
    applyLevelUp(c, p, {});
    eq(c.classes.length, 2, 'deux classes');
    eq(c.classes[0].niveau, 5, 'la classe d\'origine ne bouge pas');
    eq(c.classes[1].niveau, 1, 'la nouvelle est au niveau 1');
    eq(getTotalLevel(c), 6, 'niveau total 6');
  }
  // Prérequis de multiclassage (13 des deux côtés)
  {
    const faible = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:5}], for:15, int:10 });
    const p = planLevelUp(faible, 'Wizard');
    eq(p.prereq.ok, false, 'INT 10 : prérequis Magicien non rempli');
    ok(/Wizard/.test(p.prereq.missing.join(' ')), 'la classe manquante est nommée');
    const fort = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:5}], for:15, int:13 });
    eq(planLevelUp(fort, 'Wizard').prereq.ok, true, 'INT 13 : prérequis rempli');
    // Guerrier : FOR *ou* DEX suffit
    const dexOnly = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], for:8, dex:16 });
    eq(planLevelUp(dexOnly, 'Fighter').prereq.ok, true, 'Guerrier : DEX seule suffit');
    // Monter sa propre classe ne déclenche aucune vérification
    eq(planLevelUp(hero({ classes:[{classe:'Wizard',sousClasse:'Evoker',niveau:3}], int:8 }), 'Wizard').prereq, null,
       'pas de prérequis quand on monte sa classe');
  }
  // Toute classe jouable doit avoir des prérequis déclarés
  Object.keys(CLASS_DATA).forEach(cls => {
    ok(!!MULTICLASS_PREREQ[cls], `${cls} : prérequis de multiclassage manquants`);
    (MULTICLASS_PREREQ[cls]?.abils || []).forEach(a =>
      ok(['for','dex','con','int','sag','cha'].includes(a), `${cls} : caractéristique « ${a} » invalide`));
  });
  // Ressources : mises à l'échelle sans oublier ce qui est déjà dépensé
  {
    const c = hero({ classes:[{classe:'Barbarian',sousClasse:'',niveau:2}], con:16,
                     resources:[{name:'Rages',used:1,max:2,reset:'long'}] });
    applyLevelUp(c, planLevelUp(c, 'Barbarian'), { subclass:'Path of the Berserker' });
    eq(c.resources.length, 1, 'une seule entrée Rages');
    eq(c.resources[0].max, 3, 'Rages passent à 3 au niveau 3');
    eq(c.resources[0].used, 1, 'la consommation est préservée');
  }
  // Un nom de sous-classe ou de don invalide est refuse, sans rien ecrire
  {
    const c = hero({ classes:[{classe:'Cleric',sousClasse:'',niveau:2}], pvMax:16 });
    const r = applyLevelUp(c, planLevelUp(c, 'Cleric'), { subclass:'Domaine bidon' });
    eq(r.ok, false, 'sous-classe inconnue refusee');
    eq(c.classes[0].niveau, 2, 'niveau inchange apres un refus');
    eq(c.pvMax, 16, 'PV inchanges apres un refus');
  }
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], pvMax:24 });
    const r = applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'feat', feat:'Don Inexistant' });
    eq(r.ok, false, 'don inconnu refuse');
    eq(c.pvMax, 24, 'PV inchanges apres un refus de don');
  }
  // Chaque sous-classe proposee par le plan doit exister dans les donnees
  Object.keys(CLASS_DATA).forEach(cls => {
    const c = hero({ classes:[{classe:cls,sousClasse:'',niveau:2}] });
    const p = planLevelUp(c, cls);
    ok(p.subOptions.length >= 2, `${cls} : au moins deux sous-classes proposees`);
    p.subOptions.forEach(s2 => ok(!!SUBCLASS_DATA[cls][s2], `${cls}/${s2} : sous-classe fantome`));
  });

  // Le Level Plan sert de journal : pas de second registre
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:16 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { hp:7, asiMode:'abil', asiA:'dex', asiB:'con' });
    eq(c.levelPlan.rows[3].cls, 'Rogue', 'journal : classe du niveau 4');
    eq(c.levelPlan.rows[3].hp, 7, 'journal : PV gagnés');
    eq(c.levelPlan.rows[3].asi, '+1 DEX / +1 CON', 'journal : décision ASI');
  }

  /* -- Encombrement : capacite, poids des pieces, total de l'inventaire -- */
  eq(carryCapacity({ for:10, species:'Human' }), 150, 'capacite FOR 10');
  eq(carryCapacity({ for:18, species:'Dwarf' }), 270, 'capacite FOR 18');
  eq(carryCapacity({}), 150, 'sans FOR : 10 par defaut');
  eq(carryCapacity({ for:12, species:'EspeceInconnue' }), 180, 'espece inconnue : taille Medium');
  // Toute espece jouable doit donner une capacite exploitable
  Object.keys(SPECIES_DATA).forEach(sp =>
    ok(carryCapacity({ for:10, species:sp }) > 0, `${sp} : capacite de charge invalide`));
  eq(coinWeight({ gp:50 }), 1, '50 pieces = 1 lb');
  eq(coinWeight({ pp:10, gp:20, sp:20 }), 1, 'pieces melangees');
  eq(coinWeight({}), 0, 'aucune piece');
  eq(inventoryWeight({ items:[{ name:'Javelin', qty:4, weight:2 }], currency:{} }).total, 8,
     'le poids est multiplie par la quantite');
  eq(inventoryWeight({ items:[{ name:'X', qty:1 }], currency:{} }),
     { total:0, sansPoids:1, coins:0 }, 'objet sans poids : compte comme non renseigne, pas 0');
  eq(inventoryWeight({ items:[{ name:'Y', weight:2.5 }], currency:{} }).total, 2.5,
     'quantite absente = 1');
  eq(inventoryWeight({ items:[], currency:{ gp:100 } }).total, 2, 'les pieces comptent dans la charge');
  eq(inventoryWeight({ items:[], currency:{} }), { total:0, sansPoids:0, coins:0 }, 'inventaire vide');


  /* -- Choix de capacites : style de combat, ordre divin, metamagie... -- */
  {
    /* En 2024 les styles de combat sont des DONS de categorie « Fighting Style
       Feat », ouverts aux trois classes : « You gain a Fighting Style feat of
       your choice », chez le Guerrier comme chez le Paladin et le Rodeur.
       Les assertions d'origine verrouillaient les listes cloisonnees de 2014 —
       elles affirmaient notamment qu'Archery n'est pas propose au Paladin. */
    const STYLES_PHB = ['Archery','Blind Fighting','Defense','Dueling','Great Weapon Fighting',
                        'Interception','Protection','Thrown Weapon Fighting','Two-Weapon Fighting',
                        'Unarmed Fighting'];
    ['Fighter', 'Paladin', 'Ranger'].forEach(cls => {
      const o = featureOptions('Fighting Style', cls).options;
      STYLES_PHB.forEach(st => ok(o.includes(st), `${cls} : ${st} doit etre propose`));
      /* Arcane Warrior est un don de cette categorie, d'Arcana Unleashed. */
      ok(o.includes('Arcane Warrior'), `${cls} : Arcane Warrior propose`);
      ok(/Arcana Unleashed/.test(livreSource('Arcane Warrior')),
         'Arcane Warrior : son livre doit etre signale');
    });
    /* Blessed Warrior et Druidic Warrior ne sont PAS des dons : ce sont les
       options exclusives de la capacite de classe. Le Guerrier n'en a aucune. */
    eq(featureOptions('Fighting Style', 'Fighter').options.length, 11,
       'Guerrier : les dix styles du PHB plus Arcane Warrior, rien d exclusif');
    eq(featureOptions('Fighting Style', 'Paladin').options.length, 12, 'Paladin : plus Blessed Warrior');
    eq(featureOptions('Fighting Style', 'Ranger').options.length, 12, 'Rodeur : plus Druidic Warrior');
    ok(featureOptions('Fighting Style', 'Paladin').options.includes('Archery'),
       'Archery est desormais ouvert au Paladin');
    ok(featureOptions('Fighting Style', 'Ranger').options.includes('Dueling'),
       'Dueling est desormais ouvert au Rodeur');
    ok(featureOptions('Fighting Style', 'Ranger').options.includes('Druidic Warrior'),
       'Druidic Warrior propre au Rodeur');
    ok(!featureOptions('Fighting Style', 'Paladin').options.includes('Druidic Warrior'),
       'Druidic Warrior reste refuse au Paladin');
    ok(featureOptions('Fighting Style', 'Paladin').options.includes('Blessed Warrior'),
       'Blessed Warrior propre au Paladin');
    ok(!featureOptions('Fighting Style', 'Ranger').options.includes('Blessed Warrior'),
       'Blessed Warrior reste refuse au Rodeur');
    ok(!featureOptions('Fighting Style', 'Fighter').options.includes('Blessed Warrior'),
       'le Guerrier n a aucune option exclusive');
    /* Deux descriptions etaient celles de 2014. */
    {
      const d = FEATURE_CHOICES['Fighting Style'].desc;
      ok(!/reroll/i.test(d['Great Weapon Fighting']),
         'Great Weapon Fighting : plus de relance en 2024');
      ok(/treat any 1 or 2/i.test(d['Great Weapon Fighting']),
         'Great Weapon Fighting : les 1 et les 2 comptent pour 3');
      ok(/all other attack/i.test(d['Protection']),
         'Protection : le Desavantage s etend aux autres attaques contre la cible');
      ok(/Shield/.test(d['Protection']), 'Protection : le bouclier est requis');
    }
    eq(featureOptions('Metamagic', 'Sorcerer').pick, 2, 'Metamagie : deux options a retenir');
    eq(featureOptions('Second Wind', 'Fighter'), null, 'une capacite sans choix ne propose rien');
    eq(featureOptions('Additional Fighting Style', 'Fighter').options.length, 11,
       'Champion : herite de la liste du Guerrier');

    // Chaque option a une description : sans elle l'infobulle serait vide
    Object.entries(FEATURE_CHOICES).forEach(([nom, def]) => {
      const src = def.inherit ? FEATURE_CHOICES[def.inherit] : def;
      const toutes = [].concat(src.options || [], ...Object.values(src.perClassExtra || {}));
      [...new Set(toutes)].forEach(o =>
        ok(!!(src.desc || {})[o], `${nom} / ${o} : description manquante`));
      ok((def.pick || 1) >= 1, `${nom} : nombre a retenir invalide`);
    });

    // Niveaux ou le choix se presente
    eq(featureChoicesAt('Fighter', null, 1).map(f => f.name), ['Fighting Style'], 'Guerrier niveau 1');
    eq(featureChoicesAt('Paladin', null, 2).map(f => f.name), ['Fighting Style'], 'Paladin niveau 2');
    eq(featureChoicesAt('Cleric', null, 1).map(f => f.name), ['Divine Order'], 'Clerc niveau 1');
    eq(featureChoicesAt('Druid', null, 1).map(f => f.name), ['Primal Order'], 'Druide niveau 1');
    eq(featureChoicesAt('Sorcerer', null, 2).map(f => f.name), ['Metamagic'], 'Ensorceleur niveau 2');
    /* Deft Explorer a quitte cette liste : en 2024 ses deux benefices sont
       cumules — « you gain the following benefits » — et l'option « Canny »
       n'existe plus. Le seul choix du niveau 2 est le style de combat.
       L'assertion d'origine verrouillait le defaut. */
    eq(featureChoicesAt('Ranger', null, 2).map(f => f.name), ['Fighting Style'],
       'Rodeur niveau 2 : seul le style de combat se choisit');
    eq(featureChoicesAt('Sorcerer', null, 10).map(f => f.name), ['Metamagic (2 more)'],
       'Ensorceleur niveau 10 : deux options de metamagie de plus');
    eq(featureChoicesAt('Sorcerer', null, 17).map(f => f.name), ['Metamagic (2 final)'],
       'Ensorceleur niveau 17 : les deux dernieres');
    eq(featureChoicesAt('Fighter', 'Champion', 7).map(f => f.name), ['Additional Fighting Style'],
       'Champion niveau 7 : un second style');
    eq(featureChoicesAt('Fighter', 'Champion', 3), [], 'aucun choix a ce niveau');

    // Enregistrement : on refuse ce qui n'est pas propose
    {
      const c3 = { classes: [{ classe: 'Fighter', sousClasse: 'Champion', niveau: 7 }] };
      eq(setFeatureChoice(c3, 'Fighting Style', 'Fighter', ['Defense']), ['Defense'], 'choix valide retenu');
      eq(getFeatureChoice(c3, 'Fighting Style', 'Fighter'), ['Defense'], 'choix relu correctement');
      eq(setFeatureChoice(c3, 'Fighting Style', 'Fighter', ['OptionBidon']), [],
         'option inexistante refusee');
      /* Archery est desormais ouvert aux trois classes : l'option qui reste
         refusee au Guerrier est celle qui appartient en propre a une autre
         classe. Blessed Warrior n'est pas un don, c'est l'option exclusive du
         Paladin. */
      eq(setFeatureChoice(c3, 'Fighting Style', 'Fighter', ['Blessed Warrior']), [],
         'option exclusive d une autre classe refusee');
      eq(setFeatureChoice(c3, 'Fighting Style', 'Fighter', ['Druidic Warrior']), [],
         'l option du Rodeur refusee au Guerrier');

      /* classeOffreCapacite repond a « la classe a-t-elle cette capacite »,
         ce que featureOptions ne sait plus faire depuis que les styles de
         combat ont une liste commune aux trois classes. */
      ok(classeOffreCapacite('Fighter', 'Fighting Style'), 'le Guerrier a un style de combat');
      ok(classeOffreCapacite('Paladin', 'Fighting Style'), 'le Paladin aussi');
      ok(classeOffreCapacite('Ranger',  'Fighting Style'), 'le Rodeur aussi');
      ok(!classeOffreCapacite('Wizard', 'Fighting Style'), 'le Magicien, non');
      ok(!classeOffreCapacite('Rogue',  'Metamagic'),      'le Roublard n a pas la metamagie');
      ok(classeOffreCapacite('Sorcerer','Metamagic'),      'l Ensorceleur si');
      /* Une capacite de sous-classe compte pour sa classe. */
      ok(classeOffreCapacite('Fighter', 'Additional Fighting Style'),
         'Additional Fighting Style appartient au Champion, donc au Guerrier');
      ok(!classeOffreCapacite('Paladin', 'Additional Fighting Style'),
         'mais pas au Paladin');
      ok(!classeOffreCapacite('', 'Fighting Style'), 'classe vide : non');
      ok(!classeOffreCapacite('Fighter', ''), 'capacite vide : non');
      eq(setFeatureChoice(c3, 'Metamagic', 'Sorcerer', ['Careful', 'Subtle', 'Twinned']),
         ['Careful', 'Subtle'], 'surplus tronque au nombre autorise');
      eq(getFeatureChoice({}, 'Fighting Style'), [], 'personnage sans choix enregistre');
    }

    // Ce qui reste a decider
    {
      const g = { classes: [{ classe: 'Fighter', sousClasse: 'Champion', niveau: 7 }] };
      eq(pendingFeatureChoices(g).map(x => x.name), ['Fighting Style', 'Additional Fighting Style'],
         'Guerrier 7 neuf : deux choix en attente');
      setFeatureChoice(g, 'Fighting Style', 'Fighter', ['Defense']);
      eq(pendingFeatureChoices(g).map(x => x.name), ['Additional Fighting Style'],
         'un choix fait, un restant');
      const s3 = { classes: [{ classe: 'Sorcerer', sousClasse: '', niveau: 3 }] };
      setFeatureChoice(s3, 'Metamagic', 'Sorcerer', ['Careful']);
      eq(pendingFeatureChoices(s3)[0], { name: 'Metamagic', classe: 'Sorcerer', niveau: 2, pick: 2, fait: 1 },
         'Metamagie a moitie choisie : signalee');
    }

    // Le monteur de niveau expose bien les choix du niveau vise
    {
      const f2 = { for: 14, dex: 14, con: 14, int: 14, sag: 14, cha: 14, pvMax: 20, nbDeVie: 1,
                   classes: [{ classe: 'Fighter', sousClasse: '', niveau: 1 }] };
      eq(planLevelUp(f2, 'Fighter').featureChoices, [], 'niveau 2 du Guerrier : aucun choix');
      const p2 = { for: 14, dex: 14, con: 14, int: 14, sag: 14, cha: 14, pvMax: 20, nbDeVie: 1,
                   classes: [{ classe: 'Paladin', sousClasse: '', niveau: 1 }] };
      eq(planLevelUp(p2, 'Paladin').featureChoices.map(f => f.name), ['Fighting Style'],
         'niveau 2 du Paladin : style de combat propose');
      // Et applyLevelUp l'enregistre
      const r2 = applyLevelUp(p2, planLevelUp(p2, 'Paladin'),
                              { featureChoices: { 'Fighting Style': ['Dueling'] } });
      eq(getFeatureChoice(p2, 'Fighting Style', 'Paladin'), ['Dueling'], 'choix enregistre a la montee');
      ok(r2.log.some(x => /Fighting Style/.test(x)), 'choix note dans le journal');
    }
  }

  /* -- Gains que le joueur doit choisir : sorts mineurs, Expertise, emplacements -- */
  {
    const CANTRIPS_T = new Function(extract(R, 'const CANTRIPS_KNOWN') + '; return CANTRIPS_KNOWN;')();
    // Chaque lanceur a une table de 20 niveaux, croissante, coherente avec le niveau 1
    Object.entries(STARTING_SPELLS).forEach(([cls, st]) => {
      const tb = CANTRIPS_T[cls];
      ok(!!tb, `${cls} : table de sorts mineurs manquante`);
      eq((tb || []).length, 20, `${cls} : table sur 20 niveaux`);
      eq((tb || [])[0], st.cantrips, `${cls} : niveau 1 coherent avec STARTING_SPELLS`);
      (tb || []).forEach((n, i) => {
        if (i > 0) ok(n >= tb[i - 1], `${cls} niv.${i + 1} : la table ne doit pas decroitre`);
      });
    });
    eq(cantripsAt('Fighter', 5), 0, 'une classe non lanceuse n a pas de sorts mineurs');
    eq(cantripsAt('Bard', 4) - cantripsAt('Bard', 3), 1, 'Barde : un sort mineur de plus au niveau 4');
    eq(cantripsAt('Wizard', 10) - cantripsAt('Wizard', 9), 1, 'Magicien : un de plus au niveau 10');

    // Expertise lue dans la description de la capacite, pas codee en dur
    eq(expertiseAt('Rogue', 1), 2, 'Roublard niveau 1 : deux competences');
    eq(expertiseAt('Rogue', 6), 2, 'Roublard niveau 6 : deux de plus');
    eq(expertiseAt('Rogue', 5), 0, 'Roublard niveau 5 : aucune');
    eq(expertiseAt('Bard', 2), 2, 'Barde niveau 2');
    eq(expertiseAt('Ranger', 9), 2, 'Rodeur niveau 9');
    eq(expertiseAt('Fighter', 6), 0, 'le Guerrier n a pas d Expertise');

    eq(topSlotLevel([4,3,2,0,0,0,0,0,0]), 3, 'plus haut niveau de sort accessible');
    eq(topSlotLevel(null), 0, 'aucun emplacement');
    eq(topSlotLevel([]), 0, 'tableau vide');

    // L'Expertise ne s'applique qu'a une competence deja maitrisee
    const r0 = { for:14, dex:14, con:14, int:14, sag:14, cha:14, pvMax:20, nbDeVie:5,
                 classes:[{ classe:'Rogue', sousClasse:'Assassin', niveau:5 }], discret:1, perception:0 };
    const res0 = applyLevelUp(r0, planLevelUp(r0, 'Rogue'), { expertise:['discret','perception'] });
    eq(r0.discret, 2, 'competence maitrisee : passe en Expertise');
    eq(r0.perception, 0, 'competence non maitrisee : refusee');
    ok(res0.log.some(x => /Expertise/.test(x)), 'Expertise notee dans le journal');
    // Le journal annonce aussi les gains a choisir soi-meme
    const b1 = { for:14, dex:14, con:14, int:14, sag:14, cha:14, pvMax:20, nbDeVie:3,
                 classes:[{ classe:'Bard', sousClasse:'College of Lore', niveau:3 }] };
    ok(applyLevelUp(b1, planLevelUp(b1, 'Bard'), {}).log.some(x => /cantrip/.test(x)),
       'sort mineur gagne : annonce');
  }

  /* -- Valeur du butin -- */
  eq(purseValue({ gp:100 }), 100, 'bourse en po');
  eq(purseValue({ pp:1, gp:1, ep:1, sp:1, cp:1 }), 11.61, 'toutes les denominations');
  eq(purseValue({}), 0, 'bourse vide');
  eq(itemsValue([{ name:'A', cost:15, qty:2 }]), { total:30, sansPrix:0 }, 'prix multiplie par la quantite');
  eq(itemsValue([{ name:'A', cost:15 }, { name:'B' }]), { total:15, sansPrix:1 },
     'objet sans prix signale, pas compte a zero');
  eq(itemsValue([{ name:'A', cost:2.5 }]), { total:2.5, sansPrix:0 }, 'quantite absente = 1');
  eq(itemsValue([]), { total:0, sansPrix:0 }, 'inventaire vide');
  eq(fmtGp(15), '15', 'pas de decimale inutile');
  eq(fmtGp(0.5), '0.5', 'decimale conservee');
  eq(fmtGp(15.006), '15.01', 'arrondi au centieme');

  /* -- Notes : markdown leger et liens wiki -- */
  {
    const idx = buildWikiIndex([{ title:'Ouestvir', url:'ayakan/ouestvir.html' }]);
    const r = t2 => renderNoteMarkdown(t2, idx);
    eq(r('# Session 4'), '<h3 class="note-h">Session 4</h3>', 'titre de niveau 1');
    eq(r('### Detail'), '<h5 class="note-h">Detail</h5>', 'titre de niveau 3');
    eq(r('du **texte** ici'), '<p>du <strong>texte</strong> ici</p>', 'gras');
    eq(r('du *texte* ici'), '<p>du <em>texte</em> ici</p>', 'italique');
    { const NL = String.fromCharCode(10);
      eq(r('- un' + NL + '- deux'), '<ul>' + NL + '<li>un</li>' + NL + '<li>deux</li>' + NL + '</ul>', 'liste a puces'); }
    eq(r('> parole'), '<blockquote>parole</blockquote>', 'citation');
    eq(r('---'), '<hr>', 'separateur');
    eq(r('[[Ouestvir]]'), '<p><a class="note-wiki" href="ayakan/ouestvir.html">Ouestvir</a></p>',
       'lien vers une page du wiki');
    eq(r('[[Ouestvir|la cite]]'), '<p><a class="note-wiki" href="ayakan/ouestvir.html">la cite</a></p>',
       'lien avec libelle personnalise');
    ok(/note-wiki missing/.test(r('[[Zorglub]]')), 'page inconnue : signalee, pas de lien mort');
    ok(r('[[OUESTVIR]]').includes('ayakan/ouestvir.html'), 'recherche de page insensible a la casse');
    // Echappement : les notes sont aussi affichees dans la vue MJ
    eq(r('<script>alert(1)</script>'), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>', 'HTML echappe');
    ok(r('[[<b>x</b>]]').includes('&lt;b&gt;'), 'HTML echappe aussi dans un lien wiki');
    eq(r('Bram & Elara'), '<p>Bram &amp; Elara</p>', 'esperluette echappee');
    eq(r(''), '', 'texte vide');
    eq(r(null), '', 'texte absent');
    eq(buildWikiIndex(null).size, 0, 'index absent');
    eq(buildWikiIndex([{ title:'X' }]).size, 0, 'entree sans url ignoree');
  }

  /* -- Filet de securite sur conflit : ce que le local avait en plus -- */
  {
    const mk = (nom, notes) => ({ characters:{ c1:{ character:{ characterName:nom }, notes } } });
    eq(diffNotes(mk('Thorin', [{ content:'aaa' }, { content:'bbb' }]), mk('Thorin', [{ content:'aaa' }])),
       [{ nom:'Thorin', pagesEnPlus:1, caracteresEnPlus:3 }], 'page en plus cote local');
    eq(diffNotes(mk('Thorin', [{ content:'aaaaa' }]), mk('Thorin', [{ content:'aaa' }])),
       [{ nom:'Thorin', pagesEnPlus:0, caracteresEnPlus:2 }], 'texte en plus cote local');
    eq(diffNotes(mk('Thorin', [{ content:'aaa' }]), mk('Thorin', [{ content:'aaa' }])), [],
       'versions identiques : rien a signaler');
    eq(diffNotes(mk('Thorin', [{ content:'a' }]), mk('Thorin', [{ content:'aaaa' }])), [],
       'distant plus riche : on ne reclame rien');
    eq(diffNotes(mk('Thorin', [{ content:'aaa' }]), { characters:{} }),
       [{ nom:'Thorin', pagesEnPlus:1, caracteresEnPlus:3 }], 'personnage absent du distant');
    eq(diffNotes({}, {}), [], 'donnees vides');
    eq(diffNotes(mk('Thorin', null), mk('Thorin', null)), [], 'notes absentes');
  }

  /* -- Recherche dans les notes -- */
  {
    const pages = [
      { name:'Session 1', content:'Nous avons rencontre Elara a Ouestvir. Elara nous a parle du culte.' },
      { name:'PNJ',       content:'Elara — pretresse. Bram — forgeron.' },
      { name:'Elara',     content:'Rien ici.' },
      { name:'Vide',      content:'' },
    ];
    const r = searchNotes(pages, 'elara');
    eq(r.length, 3, 'trois pages concernees');
    eq(r[0].total, 2, 'occurrences comptees dans la page');
    eq(r[0].hits[0].motif, 'Elara', 'la casse d origine est conservee dans l extrait');
    eq(r[2].dansTitre, true, 'trouve dans le titre seul');
    eq(r[2].hits.length, 0, 'titre seul : aucun extrait');
    eq(searchNotes(pages, 'e'), [], 'requete d un seul caractere ignoree');
    eq(searchNotes(pages, ''), [], 'requete vide');
    eq(searchNotes(pages, 'dragon'), [], 'aucun resultat');
    eq(searchNotes(pages, 'ELARA').length, 3, 'recherche insensible a la casse');
    eq(searchNotes(null, 'test'), [], 'pages absentes');
    eq(searchNotes(pages, '  elara  ').length, 3, 'espaces autour de la requete ignores');
    const many = searchNotes([{ name:'X', content:'orc orc orc orc orc' }], 'orc');
    eq(many[0].hits.length, 3, 'au plus trois extraits affiches');
    eq(many[0].total, 5, 'mais le total reste exact');
  }

  /* -- Une arme equipee devient une ligne d'attaque -- */
  {
    const guerrier = { for:16, dex:12, classes:[{ classe:'Fighter', niveau:5 }] };
    const magicien = { for:8,  dex:14, classes:[{ classe:'Wizard',  niveau:5 }] };
    const roublard = { for:10, dex:18, classes:[{ classe:'Rogue',   niveau:5 }] };
    eq(attackFromItem({ name:'Longsword', dmg:'1d8', dmgType:'Slashing', weaponCat:'martial' }, guerrier),
       { name:'Longsword', degats:'1d8+3', typeDegat:'Slashing', atkType:'for', prof:true, bonus:'', fromItem:'Longsword' },
       'arme du compendium -> ligne d attaque');
    eq(attackFromItem({ name:'Rapier', dmg:'1d8', finesse:true }, roublard).atkType, 'dex',
       'finesse : la meilleure des deux caracteristiques');
    eq(attackFromItem({ name:'Rapier', dmg:'1d8', finesse:true }, guerrier).atkType, 'for',
       'finesse : FOR quand elle est meilleure');
    eq(attackFromItem({ name:'Longbow', dmg:'1d8', ranged:true }, guerrier).atkType, 'dex',
       'arme a distance : toujours DEX');
    // Maitrise deduite de la classe : un magicien n'est pas maitre d'une arme martiale
    eq(attackFromItem({ name:'Greataxe', dmg:'1d12', weaponCat:'martial' }, magicien).prof, false,
       'magicien : pas maitre des armes martiales');
    eq(attackFromItem({ name:'Dagger', dmg:'1d4', weaponCat:'simple' }, magicien).prof, true,
       'magicien : maitre des armes simples');
    eq(isProficientWith({ classes:[{ classe:'ClasseInconnue' }] }, 'martial'), true,
       'classe inconnue : aucun malus invente');
    // Repli sur STARTING_WEAPONS quand l'objet n'a pas ete importe du compendium
    eq(attackFromItem({ name:'Greataxe' }, guerrier).degats, '1d12+3',
       'arme saisie a la main : repli sur les armes connues');
    eq(attackFromItem({ name:'Rope, Hempen' }, guerrier), null, 'un objet quelconque ne cree pas d attaque');
    eq(attackFromItem({ name:'Chain Mail' }, guerrier), null, 'une armure ne cree pas d attaque');
    // Ajout / retrait sans toucher aux lignes saisies a la main
    const c2 = { for:16, dex:12, classes:[{ classe:'Fighter', niveau:5 }],
                 attaques:[{ name:'Poing', degats:'1', atkType:'for' }] };
    syncAttackForItem(c2, { name:'Longsword', dmg:'1d8' }, true);
    eq(c2.attaques.length, 2, 'attaque ajoutee a l equipement');
    syncAttackForItem(c2, { name:'Longsword', dmg:'1d8' }, true);
    eq(c2.attaques.length, 2, 'pas de doublon si deja presente');
    syncAttackForItem(c2, { name:'Longsword', dmg:'1d8' }, false);
    eq(c2.attaques.length, 1, 'attaque retiree au deshabillage');
    eq(c2.attaques[0].name, 'Poing', 'les attaques saisies a la main sont preservees');
    eq(syncAttackForItem(c2, { name:'Rope' }, true), null, 'un objet non-arme ne touche a rien');
  }

  /* -- Lien magique : migration des anciens emplacements, plafond de 3 -- */
  const ATTUNE_MAX_T = new Function(extract(J, 'const ATTUNE_MAX') + '; return ATTUNE_MAX;')();
  eq(ATTUNE_MAX_T, 3, 'trois liens au maximum');
  eq(isAttunable({ name:'X', attune:true }), true, 'objet du compendium liable');
  eq(isAttunable({ name:'X', cat:'magique' }), true, 'objet magique liable');
  eq(isAttunable({ name:'Rope', cat:'equipement' }), false, 'objet ordinaire non liable');
  {
    // L'ancien format (3 champs texte) doit se transferer sans rien perdre
    const inv = { items:[{ name:'Cloak of Protection', cat:'magique' }],
                  attunement:[{ name:'Cloak of Protection', active:true },
                              { name:'Ring of Jumping', active:false },
                              { name:'', active:false }] };
    eq(migrateAttunement(inv), 2, 'deux emplacements nommes repris');
    eq(inv.items[0].attuned, true, 'objet existant : lien conserve');
    eq(inv.items.length, 2, 'objet absent de l inventaire : cree');
    eq(inv.items[1].name, 'Ring of Jumping', 'nom repris tel quel');
    eq('attunement' in inv, false, 'ancienne cle supprimee');
    eq(migrateAttunement(inv), 0, 'migration idempotente');
  }
  eq(migrateAttunement({ items:[] }), 0, 'inventaire sans ancien format');
  eq(migrateAttunement(null), 0, 'inventaire absent');
  eq(attunedItems({ items:[{ attuned:true }, {}, { attuned:true }] }).length, 2, 'comptage des liens');

  /* -- Objets equipes : l'inventaire pilote la CA -- */
  const ARMOR_PRESETS_T = new Function(extract(J, 'const ARMOR_PRESETS') + '; return ARMOR_PRESETS;')();
  eq(isShieldItem({ name:'Shield' }), true, 'bouclier reconnu');
  eq(isShieldItem({ name:'Shield, +1' }), true, 'bouclier magique reconnu');
  eq(isShieldItem({ name:'Bouclier' }), true, 'bouclier en francais');
  eq(isShieldItem({ name:'Shielded Boots' }), false, 'pas de faux positif sur un mot compose');
  eq(isShieldItem({ name:'Longsword' }), false, 'une arme n est pas un bouclier');
  eq(isShieldItem({ name:'Pavois', shield:true }), true, 'donnee du compendium prioritaire');
  // Resolution d'une armure : compendium, puis tables connues, puis rien
  eq(armorFromItem({ name:'Elven Chain', armorType:'medium', ac:13 }),
     { mode:'medium', baseAC:13, armorName:'Elven Chain' }, 'armure du compendium');
  eq(armorFromItem({ name:'Chain Mail' }),
     { mode:'heavy', baseAC:16, armorName:'Chain Mail' }, 'armure connue par son nom');
  eq(armorFromItem({ name:'Studded Leather Armor' }),
     { mode:'light', baseAC:12, armorName:'Studded Leather' }, 'armure reconnue par contenu');
  eq(armorFromItem({ name:'Shield' }), null, 'un bouclier n est pas une armure');
  eq(armorFromItem({ name:'Rope' }), null, 'un objet quelconque n est pas une armure');
  // Toute armure de depart doit se resoudre, sinon l'equipement ne ferait rien
  Object.keys(STARTING_ARMOR).forEach(n =>
    ok(!!armorFromItem({ name:n }), `${n} : armure de depart non resolue`));
  // Tous les presets de la fiche aussi
  ['light','medium','heavy'].forEach(m => ARMOR_PRESETS_T[m].forEach(p2 =>
    eq(armorFromItem({ name:p2.name })?.mode, m, `${p2.name} : type d armure attendu ${m}`)));
  // Retrait : on rend a la classe sa defense sans armure
  eq(defaultArmorConfig({ classes:[{ classe:'Barbarian', niveau:3 }] }).mode, 'unarmoredBarb',
     'barbare : defense sans armure');
  eq(defaultArmorConfig({ classes:[{ classe:'Monk', niveau:3 }] }).mode, 'unarmoredMonk',
     'moine : defense sans armure');
  eq(defaultArmorConfig({ classes:[{ classe:'Fighter', niveau:3 }] }).mode, 'unarmored',
     'guerrier : simplement sans armure');
  // Incoherence entre l'armure configuree et ce qui est reellement porte
  eq(equippedArmorMismatch({ armorConfig:{ mode:'heavy', armorName:'Plate' } }, { items:[] }), 'Plate',
     'armure portee sans objet correspondant : signalee');
  eq(equippedArmorMismatch({ armorConfig:{ mode:'heavy', armorName:'Chain Mail' } },
     { items:[{ name:'Chain Mail', equipped:true }] }), null, 'armure equipee : rien a signaler');
  eq(equippedArmorMismatch({ armorConfig:{ mode:'unarmored' } }, { items:[] }), null,
     'sans armure : rien a signaler');
  eq(isEquippable({ name:'Rope', cat:'equipement' }), false, 'une corde ne s equipe pas');
  ok(isEquippable({ name:'Longsword', cat:'arme' }), 'une arme s equipe');
  ok(isEquippable({ name:'Chain Mail' }), 'une armure s equipe');

  /* ── Sorts à choisir après création (startingSpellHint) ── */
  eq(startingSpellHint('Fighter'), null, 'Guerrier : aucun sort à choisir');
  eq(startingSpellHint('Rogue'),   null, 'Roublard : aucun sort à choisir');
  ok(/3<\/strong> cantrips/.test(startingSpellHint('Wizard')), 'Magicien : 3 sorts mineurs');
  ok(/6<\/strong> level-1 spells for your spellbook/.test(startingSpellHint('Wizard')), 'Magicien : grimoire de 6');
  ok(/4<\/strong> prepared/.test(startingSpellHint('Wizard')), 'Magicien : 4 préparés');
  ok(/3<\/strong> cantrips/.test(startingSpellHint('Cleric')), 'Clerc : 3 sorts mineurs');
  ok(!/spellbook/.test(startingSpellHint('Cleric')), 'Clerc : pas de grimoire');
  // Demi-lanceurs 2024 : pas de sorts mineurs, mais des sorts préparés dès le niveau 1
  ok(!/cantrip/.test(startingSpellHint('Paladin')), 'Paladin : aucun sort mineur');
  ok(/2<\/strong> level-1 spells to prepare/.test(startingSpellHint('Paladin')), 'Paladin : 2 sorts préparés');
  ok(/2<\/strong> level-1 spells to prepare/.test(startingSpellHint('Ranger')), 'Rôdeur : lanceur dès le niveau 1 (2024)');
  // Tout lanceur doit déclarer ses sorts mineurs, sinon la fiche sort sans indication
  Object.keys(PREPARED_SPELLS).forEach(cls => {
    ok(!!STARTING_SPELLS[cls], `${cls} : sorts de départ non déclarés`);
    ok(Number.isInteger(STARTING_SPELLS[cls].cantrips), `${cls} : nombre de sorts mineurs invalide`);
    ok(!!startingSpellHint(cls), `${cls} : lanceur sans rappel de sorts à choisir`);
  });
  eq(Object.entries(STARTING_SPELLS).filter(([, s]) => s.spellbook).map(([c]) => c).join(','),
     'Wizard', 'seul le Magicien démarre avec un grimoire');

  /* ── Langues et outils au choix ── */
  ok(LANGUAGES.standard.length >= 8 && LANGUAGES.rare.length >= 8, 'listes de langues fournies');
  ok(!LANGUAGES.standard.includes('Common'), 'le Commun est automatique, pas au choix');
  ok(!LANGUAGES.rare.includes('Common'), 'le Commun n\'est pas une langue rare');
  {
    const all = [...LANGUAGES.standard, ...LANGUAGES.rare];
    eq(new Set(all).size, all.length, 'aucune langue en double');
  }
  // Chaque outil « (choice) » d'un background doit proposer une liste
  Object.entries(BACKGROUND_DATA).forEach(([bg, d]) => {
    if (/\(choice\)/.test(d.tool))
      ok((TOOL_CHOICES[d.tool] || []).length >= 2, `${bg} : « ${d.tool} » sans liste de choix`);
  });
  Object.entries(TOOL_CHOICES).forEach(([k, list]) => {
    eq(new Set(list).size, list.length, `${k} : doublon dans la liste`);
    ok(list.every(t => !/\(choice\)/.test(t)), `${k} : un choix ne peut pas rester « (choice) »`);
  });

  // Les descriptions d'incantation ne doivent plus porter la formule 2014
  // (« mod + niveau ») : depuis 2024 le nombre vient de la table de classe.
  Object.entries(CLASS_DATA).forEach(([cls, d]) => {
    Object.values(d.features).flat().forEach(f => {
      if (!/Spellcasting|Pact Magic/i.test(f.name)) return;
      ok(!/modifier \+ (half your |your )?\w+ level/i.test(f.desc),
         `${cls} : description d'incantation encore en formule 2014`);
    });
  });

  // Sorts préparés : 20 niveaux, croissance monotone, classe connue
  Object.entries(PREPARED_SPELLS).forEach(([cls, table]) => {
    ok(!!CLASS_DATA[cls], `PREPARED_SPELLS : « ${cls} » n'est pas une classe connue`);
    eq(table.length, 20, `${cls} : table de sorts préparés sur 20 niveaux`);
    table.forEach((n, i) => {
      ok(Number.isInteger(n) && n > 0, `${cls} niv.${i + 1} : valeur invalide (${n})`);
      if (i > 0) ok(n >= table[i - 1], `${cls} niv.${i + 1} : la table doit croître (${table[i-1]} → ${n})`);
    });
  });
  // Tout lanceur (présent dans DND_CLASSES avec une caractéristique d'incantation)
  // doit avoir une table de préparation — sinon le compteur disparaît en silence.
  Object.entries(DND_CLASSES).forEach(([cls, info]) => {
    if (info.sort) ok(!!PREPARED_SPELLS[cls], `${cls} : lanceur sans table de sorts préparés`);
  });

  // Style de préparation : chaque lanceur déclare quand il peut échanger ses sorts.
  // Sans entrée, la fiche n'affiche aucune indication et le 📖 du grimoire disparaît.
  Object.entries(PREPARED_SPELLS).forEach(([cls]) => {
    ok(!!SPELL_PREP_STYLE[cls], `${cls} : lanceur sans style de préparation déclaré`);
  });
  Object.entries(SPELL_PREP_STYLE).forEach(([cls, st]) => {
    ok(!!CLASS_DATA[cls], `SPELL_PREP_STYLE : « ${cls} » n'est pas une classe connue`);
    ok(st.swap === 'long' || st.swap === 'level', `${cls} : swap invalide (${st.swap})`);
    ok(typeof st.book === 'boolean', `${cls} : book doit être un booléen`);
  });
  // Le grimoire est propre au Magicien (PHB 2024)
  eq(Object.entries(SPELL_PREP_STYLE).filter(([, s]) => s.book).map(([c]) => c).join(','),
     'Wizard', 'seul le Magicien a un grimoire');

  /* ── Psion — « Psion Update » (2 octobre 2025) ──
     Les chiffres viennent de la table Psion Features du document. Ils sont
     figés ici parce qu'une classe de playtest se fait rééditer : le jour où
     une table bouge, l'écart doit se voir tout de suite. */
  {
    const p = CLASS_DATA.Psion;
    eq(p.uaSource, 'Psion Update (Oct. 2025)', 'Psion : document de référence');

    // Table des capacités, niveau par niveau
    const attendu = {
      1: ['Psionic Power', 'Spellcasting', 'Subtle Telekinesis'],
      2: ['Psionic Discipline'],
      3: ['Psion Subclass'],
      4: ['Ability Score Improvement'],
      5: ['Psionic Discipline', 'Psionic Restoration'],
      6: ['Subclass Feature'],
      7: ['Psionic Surge'],
      8: ['Ability Score Improvement'],
      10: ['Psionic Discipline', 'Subclass Feature'],
      12: ['Ability Score Improvement'],
      13: ['Psionic Discipline'],
      14: ['Subclass Feature'],
      16: ['Ability Score Improvement'],
      17: ['Psionic Discipline'],
      18: ['Psionic Reserves'],
      19: ['Epic Boon'],
      20: ['Enkindled Life Force'],
    };
    eq(Object.keys(p.features).map(Number).sort((a, b) => a - b),
       Object.keys(attendu).map(Number).sort((a, b) => a - b),
       'Psion : niveaux qui donnent une capacité');
    Object.entries(attendu).forEach(([lvl, noms]) =>
      eq((p.features[lvl] || []).map(f => f.name), noms, `Psion niveau ${lvl}`));

    // Les Modes Psioniques ont été retirés de la classe par la mise à jour
    const tousNoms = Object.values(p.features).flat().map(f => f.name);
    ok(!tousNoms.includes('Psionic Modes'), 'Psion : Psionic Modes retiré');
    ok(!JSON.stringify(SUBCLASS_DATA.Psion.Metamorph).includes('Attack Mode'),
       'Metamorph : ne renvoie plus aux Modes Psioniques');
    ok(!JSON.stringify(SUBCLASS_DATA.Psion.Telepath).includes('Defense Mode'),
       'Telepath : ne renvoie plus aux Modes Psioniques');

    // Sorts mineurs : 2 au niveau 1, 3 au 4, 4 au 10
    eq(CANTRIPS_KNOWN.Psion[0], 2, 'Psion : 2 sorts mineurs au niveau 1');
    eq(CANTRIPS_KNOWN.Psion[3], 3, 'Psion : 3 sorts mineurs au niveau 4');
    eq(CANTRIPS_KNOWN.Psion[9], 4, 'Psion : 4 sorts mineurs au niveau 10');
    eq(CANTRIPS_KNOWN.Psion[2], 2, 'Psion : encore 2 au niveau 3');
    eq(CANTRIPS_KNOWN.Psion[8], 3, 'Psion : encore 3 au niveau 9');

    // Sorts préparés : table de lanceur complet standard
    eq(PREPARED_SPELLS.Psion, [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
       'Psion : table des sorts préparés');

    // Dés d'Énergie Psionique : 4 / 6 / 8 / 10 / 12 par tranches de quatre niveaux
    const des = lvl => CLASS_RESOURCES.Psion(lvl)[0].max;
    [[1,4],[4,4],[5,6],[8,6],[9,8],[12,8],[13,10],[16,10],[17,12],[20,12]].forEach(([lvl, n]) =>
      eq(des(lvl), n, `Psion : ${n} dés d'énergie au niveau ${lvl}`));
    eq(CLASS_RESOURCES.Psion(5).length, 1, 'Psion : une seule ressource (plus de Modes)');

    // Quatre sous-classes : le Psi Warper n'est pas réimprimé dans la mise à
    // jour, mais le document dit qu'il n'a pas besoin d'un autre playtest.
    eq(Object.keys(SUBCLASS_DATA.Psion).sort(),
       ['Metamorph', 'Psi Warper', 'Psykinetic', 'Telepath'], 'Psion : quatre sous-classes');
    ['Metamorph', 'Psykinetic', 'Telepath'].forEach(sc => {
      const f = SUBCLASS_DATA.Psion[sc];
      eq(Object.keys(f).map(Number).sort((a, b) => a - b), [3, 6, 10, 14], `${sc} : paliers 3/6/10/14`);
    });
    ok(SUBCLASS_DATA.Psion.Metamorph[3].some(f => f.name === 'Mutable Form'),
       'Metamorph : Mutable Form (ex-Extend Limbs) au niveau 3');
    ok(SUBCLASS_DATA.Psion.Metamorph[6].some(f => f.name === 'Flesh Weaver'),
       'Metamorph : Flesh Weaver, capacité neuve au niveau 6');
    ok(SUBCLASS_DATA.Psion.Psykinetic[3].some(f => f.name === 'Stronger Telekinesis'),
       'Psykinetic : Stronger Telekinesis, capacité neuve au niveau 3');
    ok(SUBCLASS_DATA.Psion.Telepath[3].some(f => f.name === 'Telepathic Distraction'),
       'Telepath : Telepathic Distraction remplace Telepathic Hub');
  }

  // Liste fixe (échange au niveau) : Barde, Rôdeur, Ensorceleur, Occultiste —
  // et le Psion depuis « Psion Update » (oct. 2025), qui l'a fait passer de
  // l'échange au repos long à l'échange en montant de niveau.
  eq(Object.entries(SPELL_PREP_STYLE).filter(([, s]) => s.swap === 'level').map(([c]) => c).sort().join(','),
     'Bard,Psion,Ranger,Sorcerer,Warlock', 'classes à liste fixe');

  // La premiere capacite d'une sous-classe tombe au niveau 3 (PHB 2024).
  // Un reliquat 2014 (niveau 2 pour Druide/Magicien) laisserait le joueur sans
  // aucune capacite entre le niveau 3 et le niveau 6.
  Object.entries(SUBCLASS_DATA).forEach(([cls, subs]) => {
    Object.entries(subs).forEach(([sub, byLevel]) => {
      const levels = Object.keys(byLevel).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
      if (!levels.length) return;
      eq(levels[0], 3, `${cls}/${sub} : premiere capacite au niveau ${levels[0]} au lieu de 3`);
    });
  });


  /* ── Sous-classes Unearthed Arcana ──
     Elles ne peuvent pas porter le drapeau sur elles-mêmes : SUBCLASS_DATA est
     indexé par niveau, une clé de métadonnée s'y ferait passer pour un palier.
     D'où UA_SUBCLASSES à côté — et d'où ces tests, qui sont ce qui l'empêche de
     dériver silencieusement. */
  {
    // Le nom de sous-classe est la clé de UA_SUBCLASSES : il doit être unique
    // toutes classes confondues, sinon deux sous-classes se partagent une source.
    const parNom = new Map();
    Object.entries(SUBCLASS_DATA).forEach(([cls, subs]) =>
      Object.keys(subs).forEach(sub => {
        ok(!parNom.has(sub), `« ${sub} » existe dans ${parNom.get(sub)} et ${cls} — nom de sous-classe non unique`);
        parNom.set(sub, cls);
      }));

    // Ni une espèce ni une classe ne doit porter un nom de sous-classe :
    // estUA() interroge les trois tables sans savoir de quoi il s'agit.
    parNom.forEach((cls, sub) => {
      ok(!SPECIES_DATA[sub], `« ${sub} » est à la fois une sous-classe et une espèce`);
      ok(!CLASS_DATA[sub], `« ${sub} » est à la fois une sous-classe et une classe`);
    });

    // Aucune entrée orpheline dans un sens ni dans l'autre
    Object.keys(UA_SUBCLASSES).forEach(sub =>
      ok(parNom.has(sub), `UA_SUBCLASSES : « ${sub} » n'existe dans aucune classe`));
    Object.entries(UA_SUBCLASSES).forEach(([sub, src]) =>
      ok(typeof src === 'string' && src.length > 10, `${sub} : document d'origine manquant`));

    // Étiquetage
    Object.keys(UA_SUBCLASSES).forEach(sub => {
      ok(estUA(sub), `${sub} : reconnue comme playtest`);
      eq(nomUA(sub), '(UA) ' + sub, `${sub} : préfixe « (UA) »`);
      ok(infoUA(sub).includes('Unearthed Arcana'), `${sub} : infobulle de playtest`);
    });
    ['Champion', 'Life Domain', 'Bladesinger', 'Thief'].forEach(sub => {
      ok(!estUA(sub), `${sub} : officielle, pas de drapeau`);
      eq(nomUA(sub), sub, `${sub} : nom inchangé`);
      eq(infoUA(sub), '', `${sub} : aucune infobulle`);
    });

    // Paliers de sous-classe du PHB 2024 : ils varient d'une classe à l'autre.
    // Un palier hors liste veut dire qu'on a recopié la table d'une autre classe.
    const PALIERS = {
      Barbarian: [3, 6, 10, 14],    Bard:    [3, 6, 14],         Cleric:  [3, 6, 8, 17],
      Druid:     [3, 6, 10, 14],    Fighter: [3, 7, 10, 15, 18], Monk:    [3, 6, 11, 17],
      Paladin:   [3, 7, 15, 20],    Ranger:  [3, 7, 11, 15],     Rogue:   [3, 9, 13, 17],
      Sorcerer:  [3, 6, 14, 18],    Warlock: [3, 6, 10, 14],     Wizard:  [3, 6, 10, 14],
      Artificer: [3, 5, 9, 15],     Psion:   [3, 6, 10, 14],
    };
    Object.entries(SUBCLASS_DATA).forEach(([cls, subs]) => {
      const permis = PALIERS[cls];
      ok(!!permis, `${cls} : paliers de sous-classe non documentés dans les tests`);
      if (!permis) return;
      Object.entries(subs).forEach(([sub, byLevel]) =>
        Object.keys(byLevel).map(Number).forEach(lvl =>
          ok(permis.includes(lvl), `${cls}/${sub} : palier ${lvl} hors de ${permis.join('/')}`)));
    });

    /* ── Barde ──
       Cinq collèges portaient un palier 10 qui n'existe pas chez le Barde : leur
       capacité de niveau 14 y avait glissé, et le niveau 14 portait un nom
       qu'aucun livre ne contient (« Unmatched Lore », « Valor's Triumph »…).
       Relu dans le PHB 2024, collège par collège. Ces relevés sont ce qui
       empêche la dérive de revenir. */
    {
      const attendu = {
        'College of Dance':    { 3: ['Dazzling Footwork'], 6: ['Inspiring Movement', 'Tandem Footwork'], 14: ['Leading Evasion'] },
        'College of Glamour':  { 3: ['Beguiling Magic', 'Mantle of Inspiration'], 6: ['Mantle of Majesty'], 14: ['Unbreakable Majesty'] },
        'College of Lore':     { 3: ['Bonus Proficiencies', 'Cutting Words'], 6: ['Magical Discoveries'], 14: ['Peerless Skill'] },
        'College of Valor':    { 3: ['Combat Inspiration', 'Martial Training'], 6: ['Extra Attack'], 14: ['Battle Magic'] },
        // Xanathar's Guide (2014) : le seul que le PHB 2024 n'a pas réédité
        'College of Whispers': { 3: ['Psychic Blades', 'Words of Terror'], 6: ['Mantle of Whispers'], 14: ['Shadow Lore'] },
      };
      Object.entries(attendu).forEach(([college, paliers]) => {
        const d = SUBCLASS_DATA.Bard[college];
        ok(!!d, `${college} : présent`);
        if (!d) return;
        eq(Object.keys(d).map(Number).sort((a, b) => a - b),
           Object.keys(paliers).map(Number).sort((a, b) => a - b), `${college} : paliers`);
        Object.entries(paliers).forEach(([lvl, noms]) =>
          eq((d[lvl] || []).map(f => f.name), noms, `${college} niveau ${lvl}`));
      });
      // Aucun collège ne doit porter de palier 10 : le Barde n'en a pas
      eq(Object.entries(SUBCLASS_DATA.Bard).filter(([, d]) => d[10]).map(([n]) => n), [],
         'Barde : plus aucun palier 10');
      // Les capstones inventées ne doivent pas revenir
      const tout = JSON.stringify(SUBCLASS_DATA.Bard);
      ['Unmatched Lore', "Valor's Triumph", 'Mantle of Dreams', 'Master of Intrigue',
       'Irresistible Dance'].forEach(faux =>
        ok(!tout.includes(faux), `Barde : « ${faux} » n'existe dans aucun livre`));
    }

    // Toute sous-classe commence au niveau 3 — c'est la règle 2024, sans exception
    Object.entries(SUBCLASS_DATA).forEach(([cls, subs]) =>
      Object.entries(subs).forEach(([sub, byLevel]) =>
        ok(!!byLevel[3], `${cls}/${sub} : rien au niveau 3`)));

    /* Les huit sous-classes d'Arcana Unleashed sont parues le 15 septembre 2026.
       Elles ne sont plus du playtest — mais elles ne sont pas dans le Manuel des
       joueurs pour autant : il faut posseder le livre. L'infobulle passe donc de
       l'avertissement de playtest a la mention du livre, et c'est cette bascule
       que le test surveille, dans les deux sens. */
    const PARUES = ['Arcana Domain', 'Arcane Archer', 'Warrior of the Mystic Arts',
                    'Vestige Patron', 'Conjurer', 'Enchanter', 'Necromancer', 'Transmuter'];
    PARUES.forEach(sub => {
      ok(!UA_SUBCLASSES[sub], `${sub} : sortie de la table de playtest`);
      ok(!estUA(sub), `${sub} : plus reconnue comme playtest`);
      eq(nomUA(sub), sub, `${sub} : plus de prefixe « (UA) »`);
      eq(infoUA(sub), '', `${sub} : plus d'avertissement de playtest`);
      eq(livreSource(sub), 'Arcana Unleashed (2026)', `${sub} : le livre a posseder est indique`);
      ok(titreUA(sub).includes('Arcana Unleashed'), `${sub} : le livre passe dans l'infobulle`);
    });
    // Les huit existent bien dans la classe annoncee : les officialiser ne sert a
    // rien si le nom a derive au passage.
    [['Cleric', 'Arcana Domain'], ['Fighter', 'Arcane Archer'],
     ['Monk', 'Warrior of the Mystic Arts'], ['Warlock', 'Vestige Patron'],
     ['Wizard', 'Conjurer'], ['Wizard', 'Enchanter'],
     ['Wizard', 'Necromancer'], ['Wizard', 'Transmuter']].forEach(([cls, sub]) =>
      ok(!!SUBCLASS_DATA[cls]?.[sub], `${sub} : presente chez le ${cls}`));

    /* Capacites renommees entre le playtest et le livre. Le fichier contenait la
       version playtest ; ces noms-la sont ceux du livre, releves sur les pages
       de dnd2024.wikidot.com qui citent « Arcana Unleashed » comme source. */
    [['Cleric', 'Arcana Domain', 3, 'Student of Arcana', 'Arcane Initiate'],
     ['Cleric', 'Arcana Domain', 17, 'Magical Mastery', 'Arcane Mastery'],
     ['Fighter', 'Arcane Archer', 15, 'Indomitable Teleport', 'Arcane Burst'],
     ['Monk', 'Warrior of the Mystic Arts', 11, 'Focused Strike', 'Centered Focus'],
     ['Warlock', 'Vestige Patron', 6, 'Vestige Power', null],
     ['Warlock', 'Vestige Patron', 10, 'Vestige Recovery', 'Aura of Power'],
     ['Wizard', 'Transmuter', 10, 'Shape-Shifter', 'Shapechanger'],
    ].forEach(([cls, sub, lvl, publie, playtest]) => {
      const noms = (SUBCLASS_DATA[cls][sub][lvl] || []).map(f => f.name);
      ok(noms.includes(publie), `${sub} niv.${lvl} : « ${publie} » (version publiee)`);
      if (playtest) ok(!JSON.stringify(SUBCLASS_DATA[cls][sub]).includes(`"${playtest}"`),
                       `${sub} : « ${playtest} » etait le nom de playtest`);
    });

    // Quelques relevés de contenu, pour attraper une extraction qui aurait glissé
    eq(SUBCLASS_DATA.Artificer.Reanimator && Object.keys(SUBCLASS_DATA.Artificer.Reanimator).map(Number).sort((a, b) => a - b),
       [3, 5, 9, 15], 'Reanimator : paliers d\'Artificier');
    eq(Object.keys(SUBCLASS_DATA.Paladin.Oathbreaker).map(Number).sort((a, b) => a - b),
       [3, 7, 15, 20], 'Oathbreaker : paliers de Paladin');
    eq(Object.keys(SUBCLASS_DATA.Bard['College of Spirits']).map(Number).sort((a, b) => a - b),
       [3, 6, 14], 'College of Spirits : le Barde n\'a que trois paliers');
    ok(SUBCLASS_DATA.Fighter['Hell Knight'][3].some(f => f.name === 'Infernal Wound'),
       'Hell Knight : Infernal Wound au niveau 3');
    ok(SUBCLASS_DATA.Cleric['Freedom Domain'][3].some(f => f.name === 'Unencumbered Grace'),
       'Freedom Domain : Unencumbered Grace au niveau 3');
    ok(SUBCLASS_DATA.Wizard.Imaskarcanist[14].some(f => f.name === 'Doom of Unlight'),
       'Imaskarcanist : Doom of Unlight au niveau 14');
    eq(Object.keys(UA_SUBCLASSES).length, 34, '34 sous-classes encore en playtest');

    /* ── Magicien ──
       Les huit « School of … » venaient de 2014. Quatre ont une version 2024
       dans le PHB sous un autre nom, quatre n'en ont une que dans les documents
       de playtest. Relu école par école, et le Bladesinger avec. */
    {
      const attendu = {
        Abjurer:     { 3: ['Abjuration Savant', 'Arcane Ward'],      6: ['Projected Ward'],      10: ['Spell Breaker'],       14: ['Spell Resistance'] },
        Diviner:     { 3: ['Divination Savant', 'Portent'],          6: ['Expert Divination'],   10: ['The Third Eye'],       14: ['Greater Portent'] },
        Evoker:      { 3: ['Evocation Savant', 'Potent Cantrip'],    6: ['Sculpt Spells'],       10: ['Empowered Evocation'], 14: ['Overchannel'] },
        Illusionist: { 3: ['Illusion Savant', 'Improved Illusions'], 6: ['Phantasmal Creatures'],10: ['Illusory Self'],       14: ['Illusory Reality'] },
        // Forgotten Realms (2025), pas le PHB — mais bien du contenu 2024
        Bladesinger: { 3: ['Bladesong', 'Training in War and Song'], 6: ['Extra Attack'],        10: ['Song of Defense'],     14: ['Song of Victory'] },
      };
      Object.entries(attendu).forEach(([ecole, paliers]) => {
        const d = SUBCLASS_DATA.Wizard[ecole];
        ok(!!d, `${ecole} : présent`);
        if (!d) return;
        eq(Object.keys(d).map(Number).sort((a, b) => a - b),
           Object.keys(paliers).map(Number).sort((a, b) => a - b), `${ecole} : paliers`);
        Object.entries(paliers).forEach(([lvl, noms]) =>
          eq((d[lvl] || []).map(f => f.name), noms, `${ecole} niveau ${lvl}`));
      });

      // Plus aucune « School of … » : c'était la marque du contenu 2014
      eq(Object.keys(SUBCLASS_DATA.Wizard).filter(n => /^School of /.test(n)), [],
         'Magicien : plus aucune école au nom de 2014');

      // Le Savant 2024 donne des sorts ; celui de 2014 réduisait le coût de copie
      ['Abjurer', 'Diviner', 'Evoker', 'Illusionist'].forEach(ecole => {
        const savant = SUBCLASS_DATA.Wizard[ecole][3].find(f => /Savant$/.test(f.name));
        ok(/spellbook for free/.test(savant.desc), `${ecole} : Savant version 2024`);
        ok(!/half/.test(savant.desc), `${ecole} : Savant ne parle plus de coût de copie`);
      });

      // Évocateur : Potent Cantrip au 3 et Sculpt Spells au 6 — l'ordre inverse
      // de 2014, et l'erreur exacte qu'on vient de corriger
      ok(SUBCLASS_DATA.Wizard.Evoker[3].some(f => f.name === 'Potent Cantrip'),
         'Évocateur : Potent Cantrip au niveau 3, pas au 6');
      ok(SUBCLASS_DATA.Wizard.Evoker[6].some(f => f.name === 'Sculpt Spells'),
         'Évocateur : Sculpt Spells au niveau 6, pas au 3');

      // Capacités de 2014 qui ne doivent pas revenir
      const tout = JSON.stringify(SUBCLASS_DATA.Wizard);
      ['Improved Abjuration', 'Improved Minor Illusion', 'Malleable Illusions',
       'Minor Conjuration', 'Hypnotic Gaze', 'Minor Alchemy'].forEach(vieux =>
        ok(!tout.includes(vieux), `Magicien : « ${vieux} » est du contenu 2014`));
    }

    /* ── Renommages ──
       La sous-classe est stockée par son nom : sans cette table, les fiches
       existantes perdraient la leur. Chaque ancien nom doit avoir disparu de
       SUBCLASS_DATA, chaque nouveau doit y être. */
    {
      const parNomTout = new Set(Object.values(SUBCLASS_DATA).flatMap(s => Object.keys(s)));
      Object.entries(SUBCLASS_RENOMMEES).forEach(([ancien, neuf]) => {
        ok(!parNomTout.has(ancien), `renommage : « ${ancien} » existe encore comme sous-classe`);
        ok(parNomTout.has(neuf), `renommage : « ${neuf} » n'existe pas`);
      });
      eq(Object.keys(SUBCLASS_RENOMMEES).length, 8, 'huit écoles de magie renommées');

      // La migration réécrit les deux endroits où le nom est stocké
      const fiche = {
        sousClasse: 'School of Evocation',
        classes: [{ classe: 'Wizard', sousClasse: 'School of Evocation', niveau: 5 },
                  { classe: 'Rogue',  sousClasse: 'Thief',               niveau: 2 }],
      };
      eq(migrerNomsSousClasse(fiche), true, 'migration : signale le changement');
      eq(fiche.classes[0].sousClasse, 'Evoker', 'migration : multiclassage réécrit');
      eq(fiche.classes[1].sousClasse, 'Thief', 'migration : une sous-classe à jour est laissée seule');
      eq(fiche.sousClasse, 'Evoker', 'migration : champ hérité réécrit');
      // Idempotente : un second passage ne trouve plus rien
      eq(migrerNomsSousClasse(fiche), false, 'migration : rien à faire au second passage');
      eq(migrerNomsSousClasse({ classes: [{ classe: 'Wizard', sousClasse: 'Abjurer' }] }), false,
         'migration : un nom déjà à jour ne bouge pas');
      eq(migrerNomsSousClasse(null), false, 'migration : fiche absente');
      eq(migrerNomsSousClasse({}), false, 'migration : fiche vide');
    }

  }

  // Sous-classes : structure SUBCLASS_DATA[classe][sous-classe][niveau] = [features].
  // Attrape une sous-classe mal imbriquée (elle apparaîtrait comme une fausse classe).
  Object.entries(SUBCLASS_DATA).forEach(([cls, subs]) => {
    ok(!!CLASS_DATA[cls], `SUBCLASS_DATA : « ${cls} » n'est pas une classe connue`);
    Object.entries(subs).forEach(([sub, byLevel]) => {
      if (/^\d+$/.test(sub)) {
        // Un nom de sous-classe numérique = un niveau d'imbrication perdu
        ok(false, `${cls} : « ${sub} » est un niveau, pas une sous-classe — imbrication cassée`);
        return;
      }
      Object.entries(byLevel).forEach(([lvl, feats]) => {
        ok(/^\d+$/.test(lvl) && +lvl >= 1 && +lvl <= 20, `${cls}/${sub} : niveau « ${lvl} » invalide`);
        if (!Array.isArray(feats)) { ok(false, `${cls}/${sub} niv.${lvl} : liste de capacités attendue`); return; }
        ok(feats.length > 0, `${cls}/${sub} niv.${lvl} : liste non vide`);
        feats.forEach(f => ok(f && f.name && f.desc, `${cls}/${sub} niv.${lvl} : nom + description`));
      });
    });
  });
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

  /* -- Actions de groupe : degats avec PV temporaires, soins, sauvegardes -- */
  eval([
    extract(D, 'function applyDamageWithTemp(cible, degats)'),
    extract(D, 'function applyHealing(cible, soin)'),
    extract(D, 'function rollGroupSave(cibles, dc)'),
  ].join('\n'));

  // Les PV temporaires absorbent en premier (regle 2024)
  eq(applyDamageWithTemp({ hp:30, temp:0 }, 12), { hp:18, temp:0, absorbe:0, applique:12 },
     'degats sans PV temporaires');
  eq(applyDamageWithTemp({ hp:30, temp:15 }, 12), { hp:30, temp:3, absorbe:12, applique:0 },
     'PV temporaires absorbent tout');
  eq(applyDamageWithTemp({ hp:30, temp:5 }, 12), { hp:23, temp:0, absorbe:5, applique:7 },
     'absorption partielle');
  eq(applyDamageWithTemp({ hp:5, temp:0 }, 50), { hp:0, temp:0, absorbe:0, applique:50 },
     'les PV ne passent jamais sous zero');
  eq(applyDamageWithTemp({ hp:30, temp:5 }, 0), { hp:30, temp:5, absorbe:0, applique:0 },
     'degats nuls : rien ne bouge');
  eq(applyDamageWithTemp({ hp:30, temp:0 }, -5), { hp:30, temp:0, absorbe:0, applique:0 },
     'degats negatifs ignores');

  // Soins plafonnes au maximum
  eq(applyHealing({ hp:20, hpMax:30 }, 25), { hp:30, rendu:10 }, 'soin plafonne au maximum');
  eq(applyHealing({ hp:10, hpMax:30 }, 8), { hp:18, rendu:8 }, 'soin normal');
  eq(applyHealing({ hp:30, hpMax:30 }, 10), { hp:30, rendu:0 }, 'deja au maximum');
  eq(applyHealing({ hp:0, hpMax:30 }, 5), { hp:5, rendu:5 }, 'un personnage a terre remonte');

  // Sauvegardes de groupe
  {
    const res = rollGroupSave([{ id:'a', label:'Thorin', mod:5 }, { id:'b', label:'Elara', mod:-1 }], 15);
    eq(res.length, 2, 'un resultat par cible');
    ok(res.every(r => r.total === r.de + r.mod), 'total = de + modificateur');
    ok(res.every(r => r.de >= 1 && r.de <= 20), 'le de reste dans ses bornes');
    ok(res.every(r => r.reussi === (r.total >= 15)), 'reussite evaluee sur le DD');
    eq(rollGroupSave([], 15), [], 'aucune cible');
    eq(rollGroupSave(null, 15), [], 'cibles absentes');
    // Un DD de 1 est toujours reussi, un DD de 30 avec mod 0 jamais
    ok(rollGroupSave([{ id:'x', mod:0 }], 1)[0].reussi, 'DD 1 toujours reussi');
    ok(!rollGroupSave([{ id:'x', mod:0 }], 30)[0].reussi, 'DD 30 sans modificateur : impossible');
  }

  // Multiclasse + Jack of All Trades
  eq(dmCalc({ classes: [{ niveau: 3 }, { niveau: 2 }] }).totalLevel, 5, 'dmCalc niveau total multiclasse');
  const bard = dmCalc({ niveau: 4, dex: 10, jackOfAllTrades: true });
  eq(bard.skill({ key: 'acrobaties', attr: 'dex' }).val, 1, 'dmCalc Jack of All Trades (demi-PB)');

  eq(dmFmt(3), '+3', 'dmFmt positif');
  eq(dmFmt(-1), '-1', 'dmFmt négatif');
  eq(dmMod(14), 2, 'dmMod');
}

/* ══════════ js/monsters.js — bestiaire ══════════ */
{
  /* Le module est une IIFE sur window : on l'exécute avec un faux global pour
     récupérer l'API publique, plutôt que d'extraire fonction par fonction. */
  const src = staged('js/monsters.js');
  const faux = {};
  new Function('window', src)(faux);
  const B = faux.Bestiaire;

  ok(!!B, 'Bestiaire exposé');

  // Facteur de puissance : fractions, valeurs, libellés
  eq(B.crValue('1/2'), 0.5, 'FP 1/2 en valeur');
  eq(B.crValue('1/8'), 0.125, 'FP 1/8 en valeur');
  eq(B.crValue(7), 7, 'FP numérique inchangé');
  eq(B.crValue(null), 0, 'FP absent = 0');
  eq(B.crLabel(0.25), '1/4', 'FP 0,25 affiché en fraction');
  eq(B.crLabel(12), '12', 'FP entier affiché tel quel');

  // Bonus de maîtrise : +2 jusqu'à FP 4, puis +1 tous les 4 FP
  eq(B.pbFromCr(0), 2, 'PB au FP 0');
  eq(B.pbFromCr(4), 2, 'PB au FP 4');
  eq(B.pbFromCr(5), 3, 'PB au FP 5');
  eq(B.pbFromCr(8), 3, 'PB au FP 8');
  eq(B.pbFromCr(9), 4, 'PB au FP 9');
  eq(B.pbFromCr(17), 6, 'PB au FP 17');
  eq(B.pbFromCr(21), 7, 'PB au FP 21');
  eq(B.pbFromCr('1/2'), 2, 'PB au FP fractionnaire');

  // Expérience
  eq(B.xpFromCr('1/4'), 50, 'PX au FP 1/4');
  eq(B.xpFromCr(10), 5900, 'PX au FP 10');
  eq(B.xpFromCr(30), 155000, 'PX au FP 30');
  eq(B.xpFromCr(99), 0, 'FP hors table : pas de PX inventés');

  // Moyenne des dés de vie
  eq(B.avgHitDice('20d10 + 40'), 150, 'PV moyens 20d10+40');
  eq(B.avgHitDice('6d6+6'), 27, 'PV moyens 6d6+6');
  eq(B.avgHitDice('2d6'), 7, 'PV moyens 2d6');
  eq(B.avgHitDice('4d8 - 4'), 14, 'PV moyens avec bonus négatif');
  eq(B.avgHitDice(''), 0, 'dés de vie absents');
  eq(B.avgHitDice('nawak'), 0, 'dés de vie illisibles');

  eq(B.mod(21), 5, 'modificateur de 21');
  eq(B.mod(9), -1, 'modificateur de 9');

  /* Normalisation — schéma local (champs à plat, valeurs en texte) */
  const local = {
    name: 'Sbire', size: 'Small', type: 'Humanoid', subtype: 'Halfling',
    alignment: 'Neutral Evil', armor_class: 13, armor_desc: 'studded leather',
    hit_points: 27, hit_dice: '6d6+6', speed: { walk: '40 ft.' },
    strength: 10, dexterity: 15, constitution: 12,
    intelligence: 12, wisdom: 10, charisma: 14,
    saving_throws: { dexterity: '+4' }, skills: { stealth: '+5' },
    damage_resistances: ['poison'], damage_immunities: [], condition_immunities: [],
    senses: 'passive Perception 12', languages: 'Common', challenge_rating: '1/2', cr: 0.5,
    special_abilities: [{ name: 'Hustle', desc: 'Bonus Action.' }],
    actions: [{ name: 'Shortsword', desc: '+4, 5 (1d6+2).' }],
    bonus_actions: [{ name: 'Hustle', desc: 'Move.' }]
  };
  const n1 = B.normaliser(local, 'Eberron');
  eq(n1.name, 'Sbire', 'nom conservé');
  eq(n1.source, 'Eberron', 'source du supplément');
  eq(n1.ac, 13, 'CA locale');
  eq(n1.hp, 27, 'PV locaux');
  eq(n1.speed.walk, 40, 'vitesse « 40 ft. » convertie en nombre');
  eq(n1.scores.dex, 15, 'score de DEX à plat');
  eq(n1.mods.dex, 2, 'modificateur calculé faute de source');
  eq(n1.saves.dex, 4, 'sauvegarde « +4 » convertie');
  eq(n1.skills.stealth, 5, 'compétence convertie');
  eq(n1.sens.pp, 12, 'Perception passive extraite du texte');
  eq(n1.resistances, ['poison'], 'résistances locales');
  eq(n1.pb, 2, 'PB déduit du FP');
  eq(n1.xp, 100, 'PX déduits du FP');
  eq(n1.traits.length, 1, 'special_abilities lus comme traits');
  eq(n1.actions.length, 1, 'actions locales');
  eq(n1.bonusActions.length, 1, 'actions bonus locales');
  eq(n1.reactions, [], 'réactions absentes');

  /* Normalisation — schéma API v2 (objets imbriqués, valeurs numériques) */
  const api = {
    key: 'srd-2024_truc', name: 'Truc',
    size: { name: 'Large' }, type: { name: 'Aberration' }, alignment: 'lawful evil',
    challenge_rating: 10, armor_class: 17, armor_detail: 'natural armor',
    hit_points: 150, hit_dice: '20d10 + 40', speed: { walk: 10, swim: 40, unit: 'feet' },
    ability_scores: { strength: 21, dexterity: 9, constitution: 15, intelligence: 18, wisdom: 15, charisma: 18 },
    modifiers: { strength: 5, dexterity: -1, constitution: 2, intelligence: 4, wisdom: 2, charisma: 4 },
    saving_throws: { strength: 5, dexterity: 3, constitution: 6, intelligence: 8, wisdom: 6, charisma: 4 },
    skill_bonuses: { history: 12, perception: 10 },
    resistances_and_immunities: { damage_immunities_display: 'psychic', damage_resistances: [], condition_immunities: [], damage_vulnerabilities: [] },
    darkvision_range: 120, passive_perception: 20,
    languages: { as_string: 'Deep Speech' }, initiative_bonus: 7,
    traits: [{ name: 'Amphibious', desc: 'Respire.' }],
    actions: [
      { name: 'Multiattack', desc: 'Trois attaques.', action_type: 'ACTION', order_in_statblock: 1 },
      { name: 'Lash', desc: 'Réaction légendaire.', action_type: 'LEGENDARY_ACTION', order_in_statblock: 2 },
      { name: 'Esquive', desc: 'Réaction.', action_type: 'REACTION', order_in_statblock: 3 }
    ]
  };
  const n2 = B.normaliser(api, 'SRD 2024');
  eq(n2.size, 'Large', 'taille désimbriquée');
  eq(n2.type, 'Aberration', 'type désimbriqué');
  eq(n2.speed.swim, 40, 'vitesse de nage');
  eq(n2.mods.for, 5, 'modificateur fourni par l API');
  /* L'API donne les six sauvegardes ; seules celles qui dépassent le
     modificateur sont des maîtrises. */
  eq(n2.saves.for, undefined, 'FOR non maîtrisée : écartée');
  eq(n2.saves.int, 8, 'INT maîtrisée : conservée');
  eq(Object.keys(n2.saves).length, 4, 'quatre sauvegardes maîtrisées');
  eq(n2.immunites, ['psychic'], 'immunités lues depuis le champ d affichage');
  eq(n2.sens.pp, 20, 'Perception passive de l API');
  ok(n2.sens.texte.includes('darkvision 120'), 'portée de vision dans le noir présente');
  ok(n2.sens.texte.includes('passive Perception 20'), 'Perception passive dans le texte des sens');
  eq(n2.initiative, 7, 'initiative fournie par l API');
  eq(n2.actions.length, 1, 'seules les ACTION dans actions');
  eq(n2.legendaires.length, 1, 'actions légendaires triées à part');
  eq(n2.reactions.length, 1, 'réactions triées à part');
  eq(n2.traits.length, 1, 'traits v2');
  eq(B.normaliser(null), null, 'entrée nulle refusée');
  eq(B.normaliser({}), null, 'entrée sans nom refusée');

  /* Tranches de FP du filtre */
  ok(B.dansTrancheCr(0, '0'), 'FP 0 dans la tranche 0');
  ok(!B.dansTrancheCr(1, '0'), 'FP 1 hors de la tranche « moins de 1 »');
  ok(B.dansTrancheCr('1/2', '0'), 'FP 1/2 dans la tranche « moins de 1 »');
  ok(!B.dansTrancheCr('1/2', '5'), 'FP 1/2 hors de la tranche 1-5');
  ok(B.dansTrancheCr(5, '5'), 'FP 5 borne haute incluse');
  ok(!B.dansTrancheCr(6, '5'), 'FP 6 hors tranche 1-5');
  ok(B.dansTrancheCr(10, '10'), 'FP 10 dans 6-10');
  ok(B.dansTrancheCr(25, '21'), 'FP 25 dans 21+');
  ok(B.dansTrancheCr(3, ''), 'filtre vide : tout passe');

  /* Recherche */
  const catalogue = [n1, n2];
  eq(B.filtrer(catalogue, { q: 'sbi' }).length, 1, 'recherche par nom');
  eq(B.filtrer(catalogue, { q: 'aberration' }).length, 1, 'recherche par type');
  eq(B.filtrer(catalogue, { q: 'zzz' }).length, 0, 'recherche sans résultat');
  eq(B.filtrer(catalogue, { type: 'Humanoid' }).length, 1, 'filtre de type');
  eq(B.filtrer(catalogue, { cr: '10' }).length, 1, 'filtre de FP');
  eq(B.filtrer(catalogue, {}).length, 2, 'aucun filtre');
  eq(B.filtrer(null, {}), [], 'liste absente');

  /* Tri : FP croissant puis nom */
  const tri = B.trier([{ name: 'B', cr: 5 }, { name: 'A', cr: 5 }, { name: 'C', cr: 1 }]);
  eq(tri.map(m => m.name), ['C', 'A', 'B'], 'tri par FP puis par nom');

  eq(B.typesConnus(catalogue), ['Aberration', 'Humanoid'], 'types du catalogue');

  /* Rendu : la fiche doit contenir les repères que le MJ cherche */
  const html = B.ficheHtml(n2);
  ok(html.includes('CA</b> 17'), 'fiche : CA');
  ok(html.includes('150'), 'fiche : PV');
  ok(html.includes('FP</b> 10'), 'fiche : FP');
  ok(html.includes('Actions légendaires'), 'fiche : section légendaire');
  ok(html.includes('Amphibious'), 'fiche : trait');
  eq(B.ficheHtml(null), '', 'fiche vide sans monstre');

  /* Échappement : un nom hostile ne doit pas produire de balise */
  const mechant = B.normaliser({ name: '<img src=x onerror=alert(1)>', armor_class: 1, hit_points: 1 }, 'x');
  ok(!B.ficheHtml(mechant).includes('<img'), 'fiche : nom échappé');

  eq(B.vitesseTexte({ walk: 30, fly: 60 }), '30 ft, vol 60 ft', 'vitesses en texte');
  eq(B.vitesseTexte({}), '—', 'aucune vitesse');
}

/* ══════════ Modificateur de dégâts ══════════ */
{
  const J = staged('joueurs.html');
  eval(extract(J, 'function getDmgMod('));
  eval(extract(J, 'function dmgModLabel('));

  /* getDmgMod lit le personnage courant : on lui en fournit un. */
  let _perso = { mods: [] };
  C = () => _perso;

  eq(getDmgMod(), '', 'aucun modificateur');

  _perso.mods = [{ name:'Divine Favor', cible:'dmg', val:'1d4', on:true }];
  eq(getDmgMod(), '+1d4', 'signe ajoute a un de sans signe');
  eq(dmgModLabel(), ' (Divine Favor)', 'nom de la source');

  _perso.mods[0].on = false;
  eq(getDmgMod(), '', 'modificateur desactive : ignore');

  _perso.mods = [{ cible:'dmg', val:'+1d6', on:true }];
  eq(getDmgMod(), '+1d6', 'signe deja present : conserve');

  _perso.mods = [{ cible:'dmg', val:'-2', on:true }];
  eq(getDmgMod(), '-2', 'malus conserve');

  _perso.mods = [
    { name:'Divine Favor', cible:'dmg', val:'1d4', on:true },
    { name:'Rage',         cible:'dmg', val:'2',   on:true }
  ];
  eq(getDmgMod(), '+1d4+2', 'deux bonus se cumulent dans l expression');
  eq(dmgModLabel(), ' (Divine Favor, Rage)', 'les deux sources nommees');

  /* Une valeur vide ne doit pas produire un « + » orphelin qui casserait le jet */
  _perso.mods = [{ name:'Vide', cible:'dmg', val:'', on:true },
                 { name:'Bon',  cible:'dmg', val:'1d4', on:true }];
  eq(getDmgMod(), '+1d4', 'valeur vide ignoree');
  eq(dmgModLabel(), ' (Bon)', 'source vide non nommee');

  /* Les autres cibles ne polluent pas les degats */
  _perso.mods = [{ cible:'atk', val:2, on:true }, { cible:'ac', val:1, on:true }];
  eq(getDmgMod(), '', 'seules les cibles dmg comptent');
}







/* ══════════ Couleurs avancées (surcharges de thème) ══════════ */
{
  /* Les couleurs avancées sont des SURCHARGES posées par-dessus le thème, pas
     une palette parallèle. La nuance est tout le bug : le thème dérive les
     mêmes variables et applyTheme() est rejoué à chaque changement de
     personnage, donc une surcharge appliquée une seule fois au chargement se
     faisait effacer juste après — elle ne survivait pas à un rafraîchissement. */
  const J = staged('joueurs.html');

  var playerData = null;
  // extract() cherche une accolade : une const de chaine simple lui echappe.
  var PALETTE_KEY = 'kaleysur_palette';
  eq(J.includes("const PALETTE_KEY = 'kaleysur_palette'"), true, 'cle de stockage des couleurs avancees');
  eval([
    extract(J, 'const PALETTE_VARS'),
    extract(J, 'const PALETTE_DEFAULTS'),
    extract(J, 'function loadPalette()'),
  ].join('\n'));

  // Aucune surcharge : loadPalette rend null, et applyPalette(null) ne touche
  // à rien. C'est ce qui laisse le thème décider pour tout le monde.
  playerData = null;
  global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  eq(loadPalette(), null, 'aucune surcharge : rien à appliquer');

  global.localStorage = { getItem: () => '{}', setItem: () => {}, removeItem: () => {} };
  eq(loadPalette(), null, 'objet vide : ce n\'est pas une surcharge');

  global.localStorage = { getItem: () => 'pas du json', setItem: () => {}, removeItem: () => {} };
  eq(loadPalette(), null, 'JSON illisible : traité comme absent');

  const surcharge = { panel: '#1a3a2a', input: '#0a1a12', border: '#2f7a4a', text: '#d0f0e0' };
  global.localStorage = { getItem: () => JSON.stringify(surcharge), setItem: () => {}, removeItem: () => {} };
  eq(loadPalette(), surcharge, 'surcharge enregistrée : relue telle quelle');

  // Une surcharge partielle reste une surcharge : les autres variables
  // continuent de suivre le thème.
  global.localStorage = { getItem: () => JSON.stringify({ panel: '#1a3a2a' }), setItem: () => {}, removeItem: () => {} };
  eq(loadPalette(), { panel: '#1a3a2a' }, 'surcharge partielle acceptée');

  // La fiche du joueur prime sur le stockage local
  playerData = { palette: { text: '#ffffff' } };
  eq(loadPalette(), { text: '#ffffff' }, 'la fiche prime sur le stockage local');
  delete global.localStorage;

  /* ── Le câblage, sans lequel rien de tout ça ne sert ── */
  // applyTheme doit rejouer les surcharges APRÈS avoir dérivé la palette :
  // c'est la ligne qui manquait.
  const corps = J.slice(J.indexOf('function applyTheme(id)'),
                        J.indexOf('function buildThemeSwatches'));
  const iDerive = corps.indexOf('KaleysurTheme.appliquerPalette');
  const iSurcharge = corps.indexOf('applyPalette(loadPalette())');
  ok(iDerive !== -1, 'applyTheme dérive la palette du thème');
  ok(iSurcharge !== -1, 'applyTheme rejoue les couleurs avancées');
  ok(iSurcharge > iDerive,
     'applyTheme : les surcharges passent APRÈS la dérivation, sinon elles sont effacées');

  // applyPalette ne doit rien poser quand il n'y a pas de surcharge
  const ap = extract(J, 'function applyPalette(p)');
  ok(/if \(!p\) return/.test(ap), 'applyPalette : sans surcharge, il ne touche à rien');
  ok(!/PALETTE_DEFAULTS\.panel/.test(ap),
     'applyPalette : ne retombe plus sur l\'ancienne palette dorée');

  // « Reset » efface la surcharge au lieu d'écrire les anciennes valeurs
  const reset = J.slice(J.indexOf("getElementById('btn-reset-palette')"),
                        J.indexOf("getElementById('btn-reset-palette')") + 900);
  ok(/savePalette\(null\)/.test(reset), 'Reset : efface la surcharge');
  ok(/removeProperty\('--j-panel'\)/.test(reset), 'Reset : retire la variable posée en ligne');
  ok(/applyCharTheme\(\)/.test(reset), 'Reset : rend la main au thème');
  ok(!/\{ \.\.\.PALETTE_DEFAULTS \}/.test(reset),
     'Reset : ne réécrit pas l\'ancienne palette dorée par-dessus le thème');

  // savePalette(null) doit vraiment nettoyer les deux côtés
  const sp = extract(J, 'function savePalette(p)');
  ok(/removeItem\(PALETTE_KEY\)/.test(sp), 'savePalette(null) : vide le stockage local');
  ok(/delete playerData\.palette/.test(sp), 'savePalette(null) : vide aussi la fiche');

  // Les quatre variables surchargeables sont celles que le thème dérive :
  // si les deux listes divergent, une couleur devient impossible à surcharger.
  const vars = extract(J, 'const PALETTE_VARS');
  ['--j-panel', '--j-input', '--j-border-col', '--j-text'].forEach(v =>
    ok(vars.includes(v), `PALETTE_VARS : ${v} surchargeable`));
  const theme = staged('js/theme.js');
  ['--j-panel', '--j-input', '--j-border-col', '--j-text'].forEach(v =>
    ok(theme.includes("'" + v + "'"), `js/theme.js : ${v} dérivé du thème`));
}

/* ══════════ Lisibilité du texte ══════════ */
{
  /* Les fonds de la fiche descendent à 3,5 % de clarté. Un texte sous ~50 %
     de clarté y disparaît — c'est ce qui rendait la moitié des libellés
     invisibles sur un thème violet sombre. La rampe garde la teinte du thème
     mais plancherise la clarté ; ces tests la vérifient sur des accents de
     toutes les teintes, y compris les plus sombres. */
  const J = staged('joueurs.html');
  /* La dérivation vit dans js/theme.js, chargé par toutes les pages. On
     exécute le module dans un faux navigateur et on prend ce qu'il expose. */
  const fauxWindow = {};
  new Function('window', 'localStorage', 'document', staged('js/theme.js'))(
    fauxWindow,
    { getItem: () => null, setItem: () => {} },
    { documentElement: { style: { setProperty: () => {} } } }
  );
  const { hexToHsl, hslToHex, rampeTexte, paletteTheme } = fauxWindow.KaleysurTheme;

  /* Luminance relative et contraste WCAG. */
  const lum = hex => {
    const v = i => parseInt(hex.slice(i, i + 2), 16) / 255;
    const f = x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    return 0.2126 * f(v(1)) + 0.7152 * f(v(3)) + 0.0722 * f(v(5));
  };
  const contraste = (a, b) => {
    const L1 = lum(a), L2 = lum(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  };

  /* Le fond le plus clair que le thème produise : --bg-card, à 8,5 %. C'est le
     pire cas pour un texte, donc celui qu'on teste. */
  const fondLePlusClair = gold => {
    const [h, sa] = hexToHsl(gold);
    return hslToHex(h, Math.min(sa * 0.65, 40) + 4, 8.5);
  };

  const ACCENTS = [
    ['or (défaut)', '#c9a227'], ['violet', '#a06ad0'], ['sang', '#a33a3a'],
    ['forêt', '#2f7a4a'], ['glace', '#6aa8d0'], ['très sombre', '#2a1e0a'],
    ['presque noir', '#141414'], ['très clair', '#f0e0b0'], ['saturé', '#ff0000'],
    ['désaturé', '#808080'],
  ];

  ACCENTS.forEach(([nom, accent]) => {
    const r = rampeTexte(accent);
    const fond = fondLePlusClair(accent);
    // AA demande 4,5:1 pour le petit texte. Les libellés sont le plancher.
    ok(contraste(r.label, fond) >= 4.5,
       `rampe ${nom} : libellés à ${contraste(r.label, fond).toFixed(2)}:1 (min 4,5)`);
    ok(contraste(r.dim, fond) >= 4.5,
       `rampe ${nom} : texte secondaire à ${contraste(r.dim, fond).toFixed(2)}:1`);
    ok(contraste(r.text, fond) >= 7,
       `rampe ${nom} : texte courant à ${contraste(r.text, fond).toFixed(2)}:1 (min 7)`);
    ok(contraste(r.gold, fond) >= 4.5,
       `rampe ${nom} : accent lisible à ${contraste(r.gold, fond).toFixed(2)}:1`);
    // Une rampe cohérente : du plus sombre au plus clair
    ok(lum(r.label) <= lum(r.dim) && lum(r.dim) <= lum(r.text),
       `rampe ${nom} : libellé ≤ secondaire ≤ courant`);
    [r.text, r.dim, r.label, r.gold].forEach(c =>
      ok(/^#[0-9a-f]{6}$/i.test(c), `rampe ${nom} : « ${c} » est une couleur hex`));
  });

  /* L'accent lisible RELÈVE la clarté, il ne la baisse jamais : un thème clair
     choisi par un joueur ne doit pas être terni au passage. */
  [['#f0e0b0', 88], ['#ffffff', 100], ['#a06ad0', 62]].forEach(([accent, clarte]) => {
    const r = rampeTexte(accent);
    ok(hexToHsl(r.gold)[2] >= Math.min(clarte, 62) - 2,
       `accent clair ${accent} : gardé clair (${hexToHsl(r.gold)[2]} %)`);
  });
  ok(hexToHsl(rampeTexte('#141414').gold)[2] >= 60, 'accent presque noir : relevé au-dessus de 60 %');

  /* La teinte est préservée — la rampe reste dans le thème */
  [['#a06ad0', 271], ['#2f7a4a', 145], ['#c9a227', 46]].forEach(([accent, teinte]) => {
    const h = hexToHsl(rampeTexte(accent).gold)[0];
    ok(Math.abs(h - teinte) <= 4, `${accent} : teinte conservée (${h}° pour ${teinte}°)`);
  });

  /* ── Le CSS ne doit plus court-circuiter la rampe ── */
  // Les gris codés en dur descendaient à 1,6:1. Ils passent tous par la rampe.
  ['#333', '#444', '#555', '#666', '#777', '#888'].forEach(g => {
    // Le délimiteur en tête évite d'attraper border-color, outline-color…
    // — c'est exactement l'erreur commise en écrivant ce correctif.
    const re = new RegExp('(?:^|[;{\\s])color:\\s*' + g + '(?![0-9a-fA-F])', 'g');
    eq((J.match(re) || []).length, 0, `aucun ${g} codé en dur comme couleur de texte`);
  });

  // --gold-dark est une bordure : à 20-25 % de clarté, illisible en texte.
  const C = staged('css/style.css');
  [['joueurs.html', J], ['css/style.css', C]].forEach(([nom, src]) => {
    const txt = [...src.matchAll(/([a-z-]*color):\s*var\(--gold-dark\)/g)].filter(m => m[1] === 'color');
    eq(txt.length, 0, `${nom} : --gold-dark n'est plus une couleur de texte`);
    // …et réciproquement, --gold-text ne doit pas servir de bordure
    const bord = [...src.matchAll(/([a-z-]+color):\s*var\(--gold-text\)/g)].map(m => m[1]).filter(p => p !== 'color');
    eq(bord.length, 0, `${nom} : --gold-text ne sert qu'au texte (${[...new Set(bord)].join(',')})`);
  });

  // Les variables existent avant le premier applyTheme(), et ailleurs que sur la fiche
  ['--text-dim', '--text-label', '--gold-text'].forEach(v =>
    ok(new RegExp(v + ':\\s*#').test(J), `joueurs.html : ${v} a une valeur de repli`));
  ok(/--gold-text:\s*#/.test(C), 'css/style.css : --gold-text défini pour les autres pages');
  eq((C.match(/var\(--gold-text\)/g) || []).length > 0, true, 'css/style.css : la rampe y est utilisée');

  // Une variable ne peut pas se définir par elle-même : la déclaration devient
  // invalide et la variable n'existe plus. C'était le cas de --j-text.
  ok(!/--j-text:\s*var\(--j-text/.test(J), '--j-text ne se référence plus lui-même');

  /* ── Le thème couvre tout le site ──
     La palette doit fournir TOUTES les variables que les deux feuilles
     utilisent. Une variable oubliée, et la page garde l'or d'origine à cet
     endroit : c'est le genre d'écart qu'on ne voit qu'en naviguant. */
  {
    const C2 = staged('css/style.css');
    const p = paletteTheme('#a06ad0', '#6a4090');

    // Toutes les variables déclarées dans le :root de la feuille partagée,
    // hors celles qui ne sont pas des couleurs.
    const racine = C2.slice(C2.indexOf(':root'), C2.indexOf('}', C2.indexOf(':root')));
    /* Hors du theme : les unites, les polices, et les couleurs SEMANTIQUES.
       Un avertissement rouge ne doit pas virer au violet parce que le joueur
       a choisi cet accent — le rouge veut dire quelque chose. */
    const HORS_COULEUR = ['--radius', '--transition', '--sidebar-w', '--nav-h', '--shadow',
                          '--font-ui', '--font-body', '--font-display', '--font-title',
                          '--red', '--red-dark'];
    const declarees = [...racine.matchAll(/(--[a-z-]+):/g)].map(m => m[1])
      .filter(v => !HORS_COULEUR.includes(v));
    declarees.forEach(v =>
      ok(v in p, `palette : ${v} manque — cette page resterait dorée`));

    // …et les variables propres à la fiche
    ['--j-panel', '--j-input', '--j-border-col', '--j-text', '--text-dim', '--text-label']
      .forEach(v => ok(v in p, `palette : ${v} manque pour la fiche`));

    // Toute valeur est une couleur exploitable
    Object.entries(p).forEach(([nom, val]) =>
      ok(/^#[0-9a-f]{6}$/i.test(val) || /^rgba?\(/.test(val),
         `palette : ${nom} = « ${val} » n'est pas une couleur`));

    // L'accent demandé ressort tel quel : on ne corrige pas le choix du joueur
    eq(p['--gold'], '#a06ad0', 'palette : l\'accent choisi est conservé');
    eq(p['--gold-dark'], '#6a4090', 'palette : la nuance sombre fournie est conservée');
    // …et se déduit si elle manque
    ok(/^#[0-9a-f]{6}$/i.test(paletteTheme('#a06ad0')['--gold-dark']),
       'palette : nuance sombre déduite quand elle n\'est pas fournie');

    // Les fonds restent des fonds : sombres, quelle que soit la teinte choisie
    ['#ffffff', '#f0e0b0', '#a06ad0', '#141414'].forEach(accent => {
      const q = paletteTheme(accent);
      const clarte = v => hexToHsl(q[v])[2];
      ok(clarte('--bg-primary') <= 8, `${accent} : --bg-primary reste sombre (${clarte('--bg-primary')} %)`);
      ok(clarte('--bg-card') <= 16, `${accent} : --bg-card reste sombre (${clarte('--bg-card')} %)`);
      ok(clarte('--text-primary') >= 80, `${accent} : --text-primary reste clair`);
      // --text-muted valait #6e5530 : 2,5:1, sous le seuil. Il suit la rampe.
      ok(clarte('--text-muted') >= 45, `${accent} : --text-muted lisible (${clarte('--text-muted')} %)`);
    });

    // js/theme.js est chargé par toutes les pages, et dans le <head>
    const pages = ['index.html', 'joueurs.html', 'dm.html', 'carte.html', 'chronologie.html'];
    pages.forEach(f => {
      let src; try { src = staged(f); } catch { return; }
      ok(/<script src="[^"]*js\/theme\.js"><\/script>/.test(src), `${f} : charge js/theme.js`);
      const tete = src.slice(0, src.indexOf('</head>'));
      ok(tete.includes('js/theme.js'),
         `${f} : js/theme.js est dans le <head>, sinon la couleur clignote`);
    });
  }
}

/* ══════════ Import Roll20 (joueurs.html) ══════════ */
{
  /* Roll20 n'exporte rien nativement : le JSON vient de l'extension VTT
     Enhancement Suite, et c'est une liste plate d'attributs dont les noms
     varient d'une feuille à l'autre. Le parseur est volontairement tolérant —
     ces tests fixent ce qu'il doit savoir lire, y compris les pièges :
     PV max rangé dans la colonne `max`, expertise notée « 2 », multiclassage
     éclaté sur des attributs séparés, sections répétables à identifiant. */
  const J = staged('joueurs.html');
  eval(extract(J, 'function parseRoll20JSON(raw)'));

  const at = (name, current, max) => ({ name, current, max: max === undefined ? '' : max });
  const fiche = { schema_version: 3, name: 'Brannor', attribs: [
    at('character_name', 'Brannor'),
    at('strength', '10'), at('dexterity', '18'), at('constitution', '14'),
    at('intelligence', '12'), at('wisdom', '13'), at('charisma', '8'),
    at('hp', '27', '34'), at('ac', '16'), at('speed', '30 ft'),
    at('initiative_bonus', '6'), at('hp_temp', '5'), at('hitdietype', 'd8'),
    at('class', 'Rogue'), at('base_level', '5'), at('subclass', 'Assassin'),
    at('race', 'Wood Elf'), at('background', 'Criminal'), at('alignment', 'Chaotic Neutral'),
    at('experience', '6500'),
    at('dexterity_save_prof', '1'), at('intelligence_save_prof', '1'),
    at('stealth_prof', '2'), at('acrobatics_prof', '1'), at('deception_prof', '0'),
    at('multiclass1_flag', '1'), at('multiclass1', 'Fighter'), at('multiclass1_lvl', '2'),
    at('pp', '2'), at('gp', '140'), at('sp', '12'), at('cp', '7'),
    at('personality_traits', 'Je parle peu.'), at('ideals', 'La liberté.'),
    at('repeating_attack_-abc_atkname', 'Rapière'),
    at('repeating_attack_-abc_atkbonus', '+7'),
    at('repeating_attack_-abc_dmgbase', '1d8'),
    at('repeating_attack_-abc_dmgattr', '4'),
    at('repeating_attack_-abc_dmgtype', 'Piercing'),
    at('repeating_inventory_-i1_itemname', 'Potion of Healing'),
    at('repeating_inventory_-i1_itemcount', '3'),
    at('repeating_inventory_-i2_itemname', 'Thieves Tools'),
    at('repeating_spell-cantrip_-s1_spellname', 'Minor Illusion'),
    at('repeating_spell-1_-s2_spellname', 'Shield'),
    at('repeating_spell-2_-s3_spellname', 'Misty Step'),
    at('repeating_spell-2_-s3_spellduration', 'Concentration, up to 1 minute'),
    at('lvl1_slots_total', '', '4'), at('lvl2_slots_total', '', '2'),
    at('repeating_traits_-t1_name', 'Sneak Attack'),
    at('repeating_proficiencies_-p1_name', 'Simple weapons'),
  ] };

  const r = parseRoll20JSON(fiche);
  const c = r.character;

  eq(c.characterName, 'Brannor', 'Roll20 : nom');
  eq(c.species, 'Wood Elf', 'Roll20 : espèce');
  eq(c.background, 'Criminal', 'Roll20 : historique');
  eq(c.xp, 6500, 'Roll20 : expérience');
  eq([c.for, c.dex, c.con, c.int, c.sag, c.cha], [10, 18, 14, 12, 13, 8], 'Roll20 : caractéristiques');

  // Roll20 range les PV courants dans `current` et le maximum dans `max`
  eq(c.pvMax, 34, 'Roll20 : PV max lus dans la colonne max');
  eq(c.pvActuel, 27, 'Roll20 : PV courants');
  eq(c.pvTemp, 5, 'Roll20 : PV temporaires');
  eq(c.ca, 16, 'Roll20 : CA');
  eq(c.vitesse, 30, 'Roll20 : « 30 ft » devient 30');
  eq(c.initiative, 6, 'Roll20 : initiative');
  eq(c.deVie, '7d8', 'Roll20 : dés de vie au niveau total');

  // Le multiclassage vit dans des attributs séparés, pas dans une liste
  eq(c.classes.map(x => x.classe + ' ' + x.niveau), ['Rogue 5', 'Fighter 2'], 'Roll20 : multiclassage');
  eq(c.niveau, 7, 'Roll20 : niveau total');
  eq(c.sousClasse, 'Assassin', 'Roll20 : sous-classe');

  eq([c.saveDex, c.saveInt], [true, true], 'Roll20 : sauvegardes maîtrisées');
  eq(c.saveFor, undefined, 'Roll20 : une sauvegarde non maîtrisée reste absente');
  eq(c.discret, 2, 'Roll20 : « 2 » vaut expertise');
  eq(c.acrobaties, 1, 'Roll20 : « 1 » vaut maîtrise');
  eq(c.duperie, undefined, 'Roll20 : « 0 » ne vaut rien');

  // Les sections répétables sont regroupées par identifiant de ligne
  /* name/degats : la forme que la fiche lit. Les imports ecrivaient nom/degat,
     et les attaques importees s'affichaient vides. */
  eq(c.attaques.map(x => x.name), ['Rapière'], 'Roll20 : attaques');
  /* Renommer la construction sans renommer le filtre final vidait toute la
     liste : sans ce garde, les assertions suivantes plantaient au lieu de le
     dire, et masquaient tout ce qui venait apres. */
  const atk0 = c.attaques[0] || {};
  ok(c.attaques.length === 1, 'Roll20 : une attaque, pas une liste vidée par le filtre');
  eq(atk0.nom, undefined, 'Roll20 : plus de champ nom sur une attaque');
  eq(atk0.degats, '1d8 + 4', 'Roll20 : dégâts recomposés');
  eq(atk0.degat, undefined, 'Roll20 : plus de champ degat sur une attaque');
  eq(atk0.bonus, '+7', 'Roll20 : bonus d\'attaque conservé tel quel');
  eq(atk0.atkType, '', 'Roll20 : caractéristique laissée vide — calcAtkBonus garde le bonus');
  eq(c.spells.map(x => x.name + '@' + x.level),
     ['Minor Illusion@0', 'Shield@1', 'Misty Step@2'], 'Roll20 : sorts, cantrip au niveau 0');
  ok(c.spells[2].conc, 'Roll20 : concentration déduite de la durée');
  eq([c.emplacementsSort[1], c.emplacementsSort[2]], [4, 2], 'Roll20 : emplacements de sorts');
  eq(r.inventory.map(i => i.qty + 'x' + i.name), ['3xPotion of Healing', '1xThieves Tools'], 'Roll20 : inventaire');
  eq(r.currency, { pp: 2, gp: 140, ep: 0, sp: 12, cp: 7 }, 'Roll20 : bourse');
  eq(c.customFeatures.map(f => f.name), ['Sneak Attack'], 'Roll20 : capacités');
  eq(c.maitrises, 'Simple weapons', 'Roll20 : maîtrises');
  eq(c.traits, 'Je parle peu.', 'Roll20 : personnalité');

  // La modale d'aperçu est partagée avec l'import D&D Beyond : même forme attendue
  ['character', 'inventory', 'currency', '_meta'].forEach(k =>
    ok(k in r, `Roll20 : la sortie porte « ${k} », comme l'import D&D Beyond`));
  eq(r._meta.source, 'Roll20', 'Roll20 : la modale saura quoi annoncer');
  ok(r._meta.multiclass, 'Roll20 : multiclassage signalé dans l\'aperçu');

  /* ── Robustesse ── */
  let leve = false;
  try { parseRoll20JSON({ name: 'x' }); } catch { leve = true; }
  ok(leve, 'Roll20 : un JSON sans attributs est refusé, pas importé à moitié');

  const vide = parseRoll20JSON({ attribs: [] });
  eq(vide.character.for, 10, 'Roll20 : fiche vide — caractéristique par défaut');
  eq(vide.character.pvMax, 1, 'Roll20 : fiche vide — jamais 0 PV');
  eq(vide.character.spells.length, 0, 'Roll20 : fiche vide — aucun sort inventé');
  eq(vide.character.attaques.length, 0, 'Roll20 : fiche vide — aucune attaque inventée');

  // Les deux enveloppes rencontrées dans la nature
  eq(parseRoll20JSON({ character: fiche })._meta.name, 'Brannor', 'Roll20 : enveloppe { character: … }');
  eq(parseRoll20JSON({ attributes: fiche.attribs })._meta.name, 'Brannor', 'Roll20 : clé « attributes »');

  /* L'interface doit exister, sinon le parseur n'est atteignable par personne */
  ['r20-dropzone', 'r20-import-file', 'r20-paste-area', 'r20-paste-btn', 'ddb-modal-title'].forEach(id =>
    ok(J.includes('id="' + id + '"'), `Roll20 : l'élément #${id} est dans la page`));
  ok(/estRoll20 \? parseRoll20JSON\(raw\) : parseDnDBeyondJSON\(raw\)/.test(J),
     'Roll20 : le handler reconnaît la provenance au lieu d\'exiger la bonne zone');
}

/* ══════════ Service worker ══════════ */
{
  /* On exécute vraiment le service worker dans un faux environnement et on lui
     soumet des requêtes, plutôt que de relire son source à la grep. Ce qui
     compte n'est pas ce qu'il écrit, c'est la branche qu'il prend :
       .html et .json → réseau d'abord. Ce sont des données : leur contenu
                        change sans que leur URL bouge, donc un cache-first les
                        fige jusqu'au prochain roulement de service worker.
       le reste       → cache d'abord, dans le cache de LA version courante.
     Les sorts du Psion sont restés invisibles pour l'avoir oublié.

     Le test est synchrone : les deux stratégies se distinguent à l'appel, avant
     toute attente — network-first appelle fetch() tout de suite, cache-first
     interroge caches.match() tout de suite. */
  const src = staged('service-worker.js');

  const ecouteurs = {};
  const faux = {
    addEventListener: (type, fn) => { (ecouteurs[type] = ecouteurs[type] || []).push(fn); },
    location: { hostname: 'kaleysur.github.io' },
    skipWaiting: () => {},
    clients: { claim: () => {} },
  };
  let cacheInterroge;
  const fauxCaches = {
    open: async () => ({ put: () => {}, add: async () => {}, match: async () => null }),
    keys: async () => [],
    match: (req, opts) => { cacheInterroge = opts && opts.cacheName; return Promise.resolve(null); },
    delete: async () => true,
  };
  let reseauAppele;
  const fauxFetch = () => { reseauAppele = true; return Promise.resolve(null); };

  new Function('self', 'caches', 'fetch', 'URL', src)(faux, fauxCaches, fauxFetch, URL);

  const surFetch = (ecouteurs.fetch || [])[0];
  ok(typeof surFetch === 'function', 'service worker : un gestionnaire de fetch');

  /* Soumet une requête et dit qui a été consulté en premier. */
  const strategie = (chemin, destination) => {
    reseauAppele = false; cacheInterroge = undefined;
    let repondu = false;
    surFetch({
      request: { method: 'GET', url: 'https://kaleysur.github.io' + chemin, destination: destination || '' },
      respondWith: p => { repondu = true; if (p && p.catch) p.catch(() => {}); },
    });
    if (!repondu) return 'ignoree';
    return reseauAppele ? 'reseau' : (cacheInterroge !== undefined ? 'cache' : 'ignoree');
  };

  /* Données : le réseau d'abord */
  ['/spells-2024.json', '/search-index.json', '/monsters-eberron.json',
   '/items-faerun-heroes.json', '/manifest.json'].forEach(f =>
    eq(strategie(f), 'reseau', `${f} : servi depuis le réseau, pas depuis le cache`));

  /* Pages : le réseau d'abord, comme avant */
  eq(strategie('/joueurs.html', 'document'), 'reseau', 'joueurs.html : réseau d\'abord');
  eq(strategie('/'), 'reseau', 'racine : réseau d\'abord');
  eq(strategie('/lore/ayakan.html'), 'reseau', 'une page de lore : réseau d\'abord');

  /* Le reste : le cache d'abord, et dans le cache de la version courante */
  ['/css/style.css', '/js/rules-2024.js', '/js/compendium.js', '/img/carte.jpg'].forEach(f => {
    eq(strategie(f), 'cache', `${f} : servi depuis le cache`);
    ok(/^kaleysur-v\d+$/.test(cacheInterroge || ''),
       `${f} : la recherche vise le cache de la version (${cacheInterroge})`);
  });

  /* Les fichiers de données restent pré-chargés, pour le hors-ligne */
  const assets = extract(src, 'const ASSETS');
  ['spells-2024.json', 'search-index.json', 'joueurs.html', 'dm.html',
   'js/theme.js', 'js/components.js'].forEach(f =>
    ok(assets.includes(f), `ASSETS : ${f} pré-chargé pour le hors-ligne`));

  ok(/const CACHE_NAME = 'kaleysur-v\d+';/.test(src), 'service worker : nom de cache versionné');
  ok(/self\.skipWaiting\(\)/.test(src) && /self\.clients\.claim\(\)/.test(src),
     'service worker : la nouvelle version prend la main sans attendre');
}

/* ══════════ Sorts (spells-2024.json) ══════════ */
{
  /* Le fichier porte une marque d'ordre d'octets : JSON.parse s'y casse les
     dents si on ne l'enlève pas. C'est déjà arrivé une fois. */
  const brut = staged('spells-2024.json').replace(/^\uFEFF/, '');
  let sorts = null;
  try { sorts = JSON.parse(brut); } catch (e) { ok(false, 'spells-2024.json : JSON invalide — ' + e.message); }

  if (sorts) {
    ok(Array.isArray(sorts) && sorts.length > 400, `spells-2024.json : ${sorts.length} sorts`);

    const CLASSES = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Psion',
                     'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
    const vus = new Set();
    sorts.forEach(sp => {
      ok(typeof sp.name === 'string' && sp.name.length > 0, 'sort sans nom');
      ok(!vus.has(sp.name), `${sp.name} : sort en double`);
      vus.add(sp.name);
      ok(Number.isInteger(sp.level) && sp.level >= 0 && sp.level <= 9, `${sp.name} : niveau ${sp.level}`);
      ok(typeof sp.school === 'string' && sp.school.length > 2, `${sp.name} : école manquante`);
      ok(typeof sp.desc === 'string' && sp.desc.length > 20, `${sp.name} : description trop courte`);
      ok(Array.isArray(sp.classes) && sp.classes.length > 0, `${sp.name} : aucune classe`);
      (sp.classes || []).forEach(c =>
        ok(CLASSES.includes(c), `${sp.name} : classe « ${c} » inconnue`));
      // Le filtre du compendium lit ce champ : un booléen ou rien, jamais une chaîne
      if (sp.concentration !== undefined)
        ok(typeof sp.concentration === 'boolean', `${sp.name} : concentration doit être un booléen`);
    });

    /* ── La liste du Psion, relevée dans « Psion Update » (oct. 2025) ──
       143 sorts. Le compte est figé : un sort qui disparaît de la liste est une
       régression, un sort qui s'y ajoute demande de mettre ce test à jour. */
    const duPsion = sorts.filter(sp => sp.classes.includes('Psion'));
    eq(duPsion.length, 143, 'liste de sorts du Psion');
    eq(duPsion.filter(sp => sp.level === 0).length, 12, 'Psion : 12 sorts mineurs');

    // Les 17 sorts qui n'existent que dans le document de playtest
    const playtest = sorts.filter(sp => sp.ua);
    eq(playtest.length, 17, '17 sorts de playtest');
    playtest.forEach(sp =>
      ok(sp.classes.includes('Psion'), `${sp.name} : sort de playtest hors liste du Psion`));
    ['Telekinetic Fling', 'Life Siphon', 'Ego Whip', 'Telekinetic Crush', 'Intellect Fortress',
     'Thought Form', 'Psychic Scream', 'Summon Astral Entity'].forEach(n => {
      const sp = sorts.find(x => x.name === n);
      ok(!!sp, `${n} : présent`);
      ok(sp && sp.ua === true, `${n} : marqué playtest`);
    });

    // Crown of Madness vient du PHB 2024, pas du playtest : il manquait au fichier
    const crown = sorts.find(sp => sp.name === 'Crown of Madness');
    ok(!!crown, 'Crown of Madness : présent');
    ok(crown && !crown.ua, 'Crown of Madness : officiel, pas du playtest');
    eq(crown && crown.level, 2, 'Crown of Madness : niveau 2');

    // Quelques niveaux relevés dans la table du document
    [['Telekinetic Fling', 0], ['Life Siphon', 1], ['Ego Whip', 2], ['Intellect Fortress', 3],
     ["Raulothim's Psychic Lance", 4], ['Psionic Blast', 6], ["Abi-Dalzim's Horrid Wilting", 8],
     ['Psychic Scream', 9]].forEach(([n, lvl]) => {
      const sp = sorts.find(x => x.name === n);
      eq(sp && sp.level, lvl, `${n} : niveau ${lvl}`);
    });

    // Le filtre du compendium doit proposer le Psion, avec la valeur que porte la donnée
    const J = staged('joueurs.html');
    const filtre = J.slice(J.indexOf('id="comp-filter-class"'), J.indexOf('id="comp-filter-class"') + 900);
    ok(/<option value="Psion">/.test(filtre), 'compendium : le filtre propose le Psion');
    ok(/<option value="Psion">\(UA\) Psion<\/option>/.test(filtre),
       'compendium : le Psion est annoncé comme playtest');
    CLASSES.forEach(c =>
      ok(filtre.includes(`value="${c}"`), `compendium : le filtre propose ${c}`));
  }
}

/* ══════════ Campagnes (dm.html) ══════════ */
{
  const D = staged('dm.html');
  /* Les fonctions de filtre lisent `campagnes` et `allPlayers` dans leur portée.
     On les déclare ici en `var` : les déclarations de fonction d'un eval sloppy
     fuient vers cette portée, et leurs variables libres s'y résolvent. */
  var ADMIN_USER = 'dm';
  var campagnes = { actif: '', liste: {} };
  var allPlayers = [];
  eval([
    extract(D, 'function clePerso(username, charId)'),
    extract(D, 'function campagnesTriees()'),
    extract(D, 'function campagneActive()'),
    extract(D, 'function persoVisible(username, charId)'),
    extract(D, 'function persosVisibles(player)'),
    extract(D, 'function joueursVisibles()'),
    extract(D, 'function persoRepresentatif(player)'),
  ].join('\n'));

  const perso = nom => ({ name: nom, character: { classe: 'Bard', niveau: 3 } });
  allPlayers = [
    { username: 'dm',    data: {} },
    { username: 'alice', data: { activeCharId: 'c1', characters: { c1: perso('Lyra'), c2: perso('Nym') } } },
    { username: 'bob',   data: { activeCharId: 'c1', characters: { c1: perso('Thorn') } } },
    { username: 'clara', data: { activeCharId: 'c1', characters: { c1: perso('Sable') } } },
  ];

  eq(clePerso('alice', 'c1'), 'alice::c1', 'clé d\'un personnage');

  /* ── Sans campagne choisie : rien ne change ── */
  eq(campagneActive(), null, 'aucune campagne active par défaut');
  eq(joueursVisibles().map(p => p.username), ['alice', 'bob', 'clara'],
     'sans filtre : tous les joueurs, jamais le MJ');
  eq(persosVisibles(allPlayers[1]).map(([cid]) => cid), ['c1', 'c2'], 'sans filtre : tous les personnages');
  ok(persoVisible('clara', 'c1'), 'sans filtre : un personnage passe');

  /* ── Une campagne choisie : seuls ses personnages ── */
  campagnes = {
    actif: 'a',
    liste: {
      a: { nom: 'Les Cendres', membres: ['alice::c1', 'bob::c1'] },
      b: { nom: 'Ayakan',      membres: ['alice::c2', 'clara::c1'] },
    },
  };
  eq(campagneActive().nom, 'Les Cendres', 'campagne active résolue');
  eq(joueursVisibles().map(p => p.username), ['alice', 'bob'],
     'un joueur sans personnage dans la campagne disparaît');
  eq(persosVisibles(allPlayers[1]).map(([cid]) => cid), ['c1'],
     'un joueur ne montre que le personnage de la campagne');
  ok(!persoVisible('alice', 'c2'), 'un personnage d\'une autre campagne est masqué');
  ok(!persoVisible('clara', 'c1'), 'un personnage hors campagne est masqué');

  campagnes.actif = 'b';
  eq(joueursVisibles().map(p => p.username), ['alice', 'clara'], 'changer de campagne change la table');
  eq(persosVisibles(allPlayers[1]).map(([cid]) => cid), ['c2'], 'le même joueur, l\'autre personnage');

  /* ── Le personnage représentatif suit le filtre ──
     Sans ça, la barre de vie d'alice montrerait Lyra alors qu'on joue Ayakan. */
  eq(persoRepresentatif(allPlayers[1])[0], 'c2',
     'personnage représentatif : l\'actif est hors campagne, on prend le visible');
  campagnes.actif = 'a';
  eq(persoRepresentatif(allPlayers[1])[0], 'c1',
     'personnage représentatif : l\'actif passe le filtre, on le garde');
  campagnes.actif = '';
  eq(persoRepresentatif(allPlayers[1])[0], 'c1', 'sans filtre : le personnage actif');
  eq(persoRepresentatif({ username: 'vide', data: {} })[0], null, 'joueur sans personnage');
  eq(persoRepresentatif(null)[0], null, 'joueur absent');

  /* ── Tri et robustesse ── */
  campagnes = { actif: '', liste: { z: { nom: 'Ayakan' }, a: { nom: 'Les Cendres' } } };
  eq(campagnesTriees().map(([, c]) => c.nom), ['Ayakan', 'Les Cendres'], 'campagnes triées par nom');
  campagnes = { actif: 'fantome', liste: {} };
  eq(campagneActive(), null, 'un identifiant inconnu ne filtre rien');
  eq(joueursVisibles().map(p => p.username), ['alice', 'bob', 'clara'],
     'un identifiant inconnu laisse tout visible');
  campagnes = { actif: 'a', liste: { a: { nom: 'Vide' } } };
  eq(joueursVisibles(), [], 'une campagne sans membres ne montre personne');
}

/* ══════════ Butin (dm.html) ══════════ */
{
  const D = staged('dm.html');
  /* Un `const` declare dans un eval ne fuit pas vers la portee appelante :
     on redeclare la liste en global, en verifiant qu.elle suit la source. */
  BUT_MONNAIES = ['pp', 'gp', 'ep', 'sp', 'cp'];
  ok(extract(D, 'const BUT_MONNAIES').includes("'pp', 'gp', 'ep', 'sp', 'cp'"),
     'liste des monnaies inchangee dans la source');
  eval(extract(D, 'function partagerButin('));
  eval(extract(D, 'function lireLigneObjet('));
  eval(extract(D, 'function lireObjets('));

  /* Partage a parts egales, denomination par denomination */
  const a = partagerButin({ gp: 100 }, 4);
  eq(a.part.gp, 25, '100 po pour 4 : 25 chacun');
  eq(a.reste.gp, 0, 'pas de reste');

  const b = partagerButin({ gp: 7 }, 3);
  eq(b.part.gp, 2, '7 po pour 3 : 2 chacun');
  eq(b.reste.gp, 1, 'le reste est annonce, pas converti');

  const c = partagerButin({ pp: 3, gp: 25, sp: 11 }, 2);
  eq([c.part.pp, c.part.gp, c.part.sp], [1, 12, 5], 'chaque denomination se partage separement');
  eq([c.reste.pp, c.reste.gp, c.reste.sp], [1, 1, 1], 'restes par denomination');

  /* Sans beneficiaire, rien ne se distribue et tout reste */
  const d = partagerButin({ gp: 10 }, 0);
  eq(d.part.gp, 0, 'aucun beneficiaire : aucune part');
  eq(d.reste.gp, 10, 'aucun beneficiaire : tout reste');

  /* Valeurs absurdes : on ne distribue pas de dette */
  const e = partagerButin({ gp: -5, sp: 'x' }, 2);
  eq(e.part.gp, 0, 'montant negatif ramene a zero');
  eq(e.part.sp, 0, 'montant illisible ramene a zero');

  /* Lecture des objets */
  eq(lireLigneObjet('Potion'), { qty: 1, name: 'Potion' }, 'objet simple');
  eq(lireLigneObjet('2x Torch'), { qty: 2, name: 'Torch' }, 'quantite avec x');
  eq(lireLigneObjet('3 × Arrow'), { qty: 3, name: 'Arrow' }, 'quantite avec le signe multiplier');
  eq(lireLigneObjet('  '), null, 'ligne vide ignoree');
  eq(lireLigneObjet('0x Rien'), { qty: 1, name: 'Rien' }, 'quantite nulle ramenee a un');
  eq(lireObjets('Potion' + "\n" + "\n" + '2x Torch').length, 2, 'lignes vides sautees');
  eq(lireObjets('').length, 0, 'texte vide');
}

/* ══════════ Arcana Unleashed (15 septembre 2026) ══════════ */
{
  /* Ce que le livre annonce, et qui sert de reference a tout ce bloc.
     Le bestiaire fait exception : sur ses 19 creatures, quatre seulement ont un
     bloc complet hors du livre. Les quinze autres sont volontairement absentes —
     les inventer donnerait un compendium qui a l'air complet et qui ment a la
     table. Le compte de 4 est donc un choix, pas un oubli, et le test le fige
     pour qu'on s'en souvienne le jour ou quelqu'un voudra "completer". */
  const LIVRE = 'Arcana Unleashed';

  const R = staged('js/rules-2024.js');
  const R2 = new Function(R + '; return { BACKGROUND_DATA, ORIGIN_FEATS, GENERAL_FEATS,'
    + ' SUBCLASS_DATA, FEATURE_CHOICES, SOURCE_LIVRE, livreSource, donsDisponibles };')();
  /* Les cles de competence sont celles de la fiche : un historique qui en nomme
     une autre passerait la relecture et ne cocherait rien a l'ecran. */
  const CLES_COMP = extract(staged('joueurs.html'), 'const SKILLS = [')
    .match(/key:'([a-z]+)'/g).map(x => x.slice(5, -1));

  /* ── Les 33 sorts ── */
  {
    const sorts = JSON.parse(staged('spells-2024.json').replace(/^﻿/, ''));
    const au = sorts.filter(sp => sp.source === LIVRE);
    eq(au.length, 33, '33 sorts du livre');

    /* Sept des 33 sont des reprises d'anciens livres, les 26 autres sont
       inedits. Si ce partage derive, c'est qu'une entree a ete mal rattachee. */
    const REPRISES = ['Wither and Bloom', 'Catnap', 'Enervation', 'Negative Energy Flood',
                      'Power Word Pain', 'Illusory Dragon', 'Invulnerability'];
    const noms = new Set(au.map(sp => sp.name));
    REPRISES.forEach(n => ok(noms.has(n), 'sort repris : ' + n));

    /* Onze sorts de niveau 7 ou plus : « plus de la moitie » des 33 sont de
       niveau 5+, ce qui est la promesse du livre. */
    ok(au.filter(sp => sp.level >= 5).length > au.length / 2,
       'plus de la moitie des sorts sont de niveau 5+');

    au.forEach(sp => {
      ok(Number.isInteger(sp.level) && sp.level >= 0 && sp.level <= 9, sp.name + ' : niveau');
      ok(!!sp.school, sp.name + ' : ecole');
      ok(Array.isArray(sp.classes) && sp.classes.length > 0, sp.name + ' : au moins une classe');
      /* Invulnerability tient en une phrase de 53 signes : le seuil attrape une
         description vide ou tronquee, il n'exige pas une longueur. */
      ok((sp.desc || '').length > 40, sp.name + ' : description');
      ok(!!sp.castingTime && !!sp.range && !!sp.duration, sp.name + ' : en-tete complet');
      /* L'en-tete vit dans les champs structures. Le recopier en tete du texte
         casse l'apercu du compendium, qui affiche la premiere ligne : on y
         lisait « Casting Time: Action » a la place du sort. */
      ok(!/^(Casting Time|Range|Components|Duration|Level|School)\s*:/i.test(sp.desc),
         sp.name + ' : pas d\'en-tete recopie dans la description');
      /* La concentration se lit dans la duree : les deux doivent s'accorder,
         sinon la fiche affiche un sort concentre qui n'en est pas un. */
      eq(sp.concentration, /^C[,\s]/.test(sp.duration), sp.name + ' : concentration coherente');
      /* Le rituel s'ecrit « … or R » dans le temps d'incantation, comme partout
         ailleurs dans le fichier — pas dans le drapeau. */
      eq(sp.ritual, false, sp.name + ' : le rituel se note dans castingTime');
      ok(/^[a-z0-9-]+$/.test(sp.slug), sp.name + ' : slug');
    });
    /* Dueling Ground est le seul rituel du lot : c'est ce qui verifie que la
       convention « or R » a bien ete appliquee au lieu du drapeau. */
    ok(/ or R$/.test((au.find(sp => sp.name === 'Dueling Ground') || {}).castingTime || ''),
       'Dueling Ground : rituel note dans le temps d\'incantation');
  }

  /* ── Les 10 historiques et les 10 dons d'origine ── */
  {
    const HISTORIQUES = ['Agent of the Ninth Quill', 'Bejeweled Conclave Spy',
      'Cosmic Dawn Experiment', 'Covenant of the Grave Recruit', 'Crucible Storm Chaser',
      'Familiar Trainer', 'Horizon Weaver Initiate', 'Phantasmic Circus Trouper',
      'Seer Apprentice', 'Ward of the Sheltering Hands'];
    eq(HISTORIQUES.filter(h => R2.BACKGROUND_DATA[h]).length, 10, '10 historiques du livre');

    /* Chaque historique donne le don de sa faction, un pour un. Cette bijection
       est ce qui a servi a recouper deux listes trouvees separement : si elle
       casse, c'est qu'un don ou un historique a ete mal recopie. */
    const dons = HISTORIQUES.map(h => R2.BACKGROUND_DATA[h].feat);
    eq(new Set(dons).size, 10, 'un don d\'origine distinct par historique');
    dons.forEach(d => ok(!!R2.ORIGIN_FEATS[d], 'don d\'origine defini : ' + d));

    HISTORIQUES.forEach(h => {
      const b = R2.BACKGROUND_DATA[h];
      eq(b.abilities.length, 3, h + ' : trois caracteristiques');
      eq(b.skillKeys.length, 2, h + ' : deux competences');
      b.skillKeys.forEach(k => ok(CLES_COMP.includes(k), h + ' : competence connue — ' + k));
      ok(!!b.tool, h + ' : un outil');
      eq(R2.livreSource(h), 'Arcana Unleashed (2026)', h + ' : livre indique');
    });
  }

  /* ── Dons generaux, dons epiques, style de combat ── */
  {
    const ADEPTES = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment',
                     'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];
    ADEPTES.forEach(ecole =>
      ok(!!R2.GENERAL_FEATS[ecole + ' Adept'], 'don d\'ecole : ' + ecole + ' Adept'));

    ['Elemental Familiar', 'Otherworldly Familiar', 'Soothing Familiar', 'Warlike Familiar']
      .forEach(d => {
        ok(!!R2.GENERAL_FEATS[d], 'don de familier : ' + d);
        ok(/Familiar Friend/.test(R2.GENERAL_FEATS[d].prereq),
           d + ' : prerequis Familiar Friend');
      });

    /* Les dons epiques sont reserves au niveau 19. Les lister plus tot revient
       a proposer un choix que la regle refuse — c'est precisement ce qui
       arrivait tant que GENERAL_FEATS etait affiche tel quel.

       Les douze du Player's Handbook 2024, verifies sur aidedd.org et
       dnd2024.wikidot.com : les deux listes concordent exactement. Le site n'en
       avait que trois, et les trois viennent d'un autre livre — le niveau 19 ne
       proposait donc aucun don du livre de base. */
    const EPIQUES_PHB = [
      'Boon of Combat Prowess', 'Boon of Dimensional Travel', 'Boon of Energy Resistance',
      'Boon of Fate', 'Boon of Fortitude', 'Boon of Irresistible Offense',
      'Boon of Recovery', 'Boon of Skill', 'Boon of Speed', 'Boon of Spell Recall',
      'Boon of the Night Spirit', 'Boon of Truesight',
    ];
    /* Ceux-la viennent d'Arcana Unleashed : ils restent, et l'infobulle doit le
       dire maintenant que la liste melange deux livres. */
    const EPIQUES_AU = ['Boon of Erupting Spellpower', 'Boon of Magic School Mastery',
                        'Boon of the Iron Mind'];
    const EPIQUES = [...EPIQUES_PHB, ...EPIQUES_AU];
    EPIQUES.forEach(d => {
      ok(R2.GENERAL_FEATS[d] && R2.GENERAL_FEATS[d].epic === true, d + ' : marque epique');
      ok(R2.GENERAL_FEATS[d] && R2.GENERAL_FEATS[d].asi === true, d + ' : porte un +1');
      ok(/^Level 19\+/.test(R2.GENERAL_FEATS[d]?.prereq || ''), d + ' : prerequis niveau 19');
      ok(/\b30\b/.test(R2.GENERAL_FEATS[d]?.desc || ''), d + ' : le plafond de 30 est dit');
      ok(!R2.donsDisponibles(4).includes(d), d + ' : absent au niveau 4');
      ok(!R2.donsDisponibles(18).includes(d), d + ' : absent au niveau 18');
      ok(R2.donsDisponibles(19).includes(d), d + ' : propose au niveau 19');
    });
    EPIQUES_PHB.forEach(d => eq(R2.livreSource(d), '', d + ' : du PHB, aucun livre a signaler'));
    EPIQUES_AU.forEach(d => ok(/Arcana Unleashed/.test(R2.livreSource(d)),
       d + ' : vient d Arcana Unleashed et doit le dire'));
    /* Aucun autre don ne doit porter le drapeau epique : un don ordinaire
       marque epic disparaitrait de la liste avant le niveau 19. */
    eq(Object.keys(R2.GENERAL_FEATS).filter(d => R2.GENERAL_FEATS[d].epic).sort(),
       [...EPIQUES].sort(), 'la liste des dons epiques est exactement celle-la');
    eq(R2.donsDisponibles(19).length - R2.donsDisponibles(4).length, EPIQUES.length,
       'les quinze dons epiques s\'ajoutent au niveau 19, et rien d\'autre');
    /* Un appel sans niveau ne doit pas ouvrir les dons epiques par accident. */
    ok(!R2.donsDisponibles().some(d => EPIQUES.includes(d)),
       'sans niveau connu, pas de don epique');

    /* Tout don doit dire ce qu'il fait : une entree vide passerait inapercue au
       milieu de soixante. Le seuil est bas expres — « Gain proficiency with Heavy
       armor. » est une description complete, et elle fait trente signes. */
    Object.entries(R2.GENERAL_FEATS).forEach(([nom, f]) =>
      ok((f.desc || '').length > 25, 'don decrit : ' + nom));
    Object.entries(R2.ORIGIN_FEATS).forEach(([nom, d]) =>
      ok(String(d).length > 25, 'don d\'origine decrit : ' + nom));
  }

  /* ── Objets magiques ── */
  {
    const objets = JSON.parse(staged('items-arcana-unleashed.json'));
    eq(objets.length, 52, '52 objets magiques');

    /* La repartition par rarete est le releve du livre. Elle sert de controle :
       un objet mal classe ou perdu se voit tout de suite ici. */
    const parRarete = {};
    objets.forEach(o => { parRarete[o.rarity] = (parRarete[o.rarity] || 0) + 1; });
    /* Compare des paires triees : eq() compare cle a cle dans l'ordre, et celui
       des raretes depend de l'ordre alphabetique des objets. */
    eq(Object.entries(parRarete).sort(),
       [['Artifact', 2], ['Common', 9], ['Legendary', 3], ['Rare', 15],
        ['Uncommon', 20], ['Very Rare', 3]],
       'repartition des raretes');

    /* Le filtre de categories du compendium se construit a partir des donnees :
       une categorie inedite par objet donnerait un menu illisible. */
    const CATS = ['Wondrous Items', 'Magic Items', 'Weapon', 'Armor'];
    const vus = new Set();
    objets.forEach(o => {
      ok(CATS.includes(o.category), o.name + ' : categorie du filtre — ' + o.category);
      ok((o.desc || '').length > 80, o.name + ' : description');
      eq(o.source, LIVRE, o.name + ' : livre d\'origine');
      eq(typeof o.requires_attunement, 'boolean', o.name + ' : attunement booleen');
      ok(!vus.has(o.name), o.name + ' : objet en double');
      vus.add(o.name);
      /* L'en-tete reprend rarete et type, comme dans items-eberron.json. */
      ok(o.desc.startsWith(o.rarity), o.name + ' : en-tete commence par la rarete');
    });
  }

  /* ── Bestiaire ── */
  {
    const monstres = JSON.parse(staged('monsters-arcana-unleashed.json'));
    eq(monstres.length, 4, '4 blocs de monstres publiquement disponibles sur 19');
    eq(monstres.map(m => m.name).sort(),
       ['Living Vitriolic Sphere', 'Spellguard', 'Taisus', 'Venger'],
       'les quatre blocs complets');

    monstres.forEach(m => {
      ok(m.armor_class > 0, m.name + ' : CA');
      ok(m.hit_points > 0, m.name + ' : points de vie');
      ok(!!m.hit_dice, m.name + ' : des de vie');
      ok(typeof m.cr === 'number' && m.cr > 0, m.name + ' : facteur de puissance');
      ok(m.actions.length > 0, m.name + ' : au moins une action');
      ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
        .forEach(c => ok(m[c] > 0, m.name + ' : ' + c));
      ok(Object.keys(m.speed).length > 0, m.name + ' : vitesse');
      eq(m.source, LIVRE, m.name + ' : livre d\'origine');
      /* Chaque action porte un nom ET un texte : un decoupage rate produit des
         entrees a moitie vides, et c'est arrive — les actions legendaires de
         Venger avaient atterri dans ses reactions. */
      ['special_abilities', 'actions', 'bonus_actions', 'reactions', 'legendary_actions']
        .forEach(k => (m[k] || []).forEach(a => {
          ok(!!a.name && a.desc.length > 10, m.name + ' : ' + k + ' — ' + a.name);
        }));
    });
    /* Venger : le decoupage en sections a deja echoue ici, parce que son intitule
       porte un suffixe (« LEGENDARY ACTIONS (4 uses in Lair) »). */
    const venger = monstres.find(m => m.name === 'Venger');
    eq(venger.reactions.length, 1, 'Venger : une seule reaction');
    eq(venger.legendary_actions.map(a => a.name),
       ['Booming Censure', 'Crimson Strike', 'Magic-Binding Chains'],
       'Venger : ses trois actions legendaires, pas ailleurs');
  }

  /* ── Les fichiers sont effectivement charges ──
     Un fichier de donnees present dans le depot et absent des chargeurs est du
     contenu invisible : le depot grossit, l'application ne change pas. */
  {
    const C = staged('js/compendium.js');
    ok(C.includes('items-arcana-unleashed.json'), 'compendium : objets charges');
    ok(C.includes('monsters-arcana-unleashed.json'), 'compendium : monstres charges');
    ok(/item\.source \? /.test(C) || /_livre\(item\)/.test(C),
       'compendium : le livre d\'origine est affiche');

    /* Le cache persistant du compendium garde objets et monstres 24 h et
       survit aux bumps du service worker. Si sa cle ne depend pas des
       suppplements charges, ajouter un fichier ne change rien a l'ecran
       pendant une journee — on livre 52 objets que personne ne voit. */
    const cle = new Function(
      C.slice(C.indexOf('const ITEMS_LOCAUX'), C.indexOf('async function _persistGet'))
      + '; return _cleCache;')();
    ok(cle('equipment').includes('items-arcana-unleashed.json'),
       'cache compendium : la cle des objets porte les suppplements');
    ok(cle('monsters').includes('monsters-arcana-unleashed.json'),
       'cache compendium : la cle des monstres porte les suppplements');
    ok(cle('equipment') !== cle('monsters'), 'cache compendium : une cle par onglet');
    eq(cle('spells'), '__comp__spells',
       'cache compendium : les sorts sont un fichier local, pas de supplement dans la cle');

    const M = staged('js/monsters.js');
    ok(M.includes('monsters-arcana-unleashed.json'), 'bestiaire : fichier declare');

    const SW = staged('service-worker.js');
    ['items-arcana-unleashed.json', 'monsters-arcana-unleashed.json'].forEach(f =>
      ok(SW.includes(f), 'service worker : ' + f + ' pre-cache'));
  }
}

/* ══════════ Plaques 3D du calendrier (tools/calendrier-3d.js) ══════════ */
{
  /* Le générateur se charge depuis la version stagée, comme tout le reste : le
     shebang doit sauter, new Function ne l'avale pas. */
  const moduleFactice = { exports: {} };
  new Function('require', 'module', '__dirname',
    staged('tools/calendrier-3d.js').replace(/^#![^\n]*\n/, '')
  )(require, moduleFactice, 'tools');
  const G = moduleFactice.exports;

  /* La police se valide toute seule au chargement : dix-sept glyphes déformés
     étaient passés tant qu'un rembourrage silencieux corrigeait la taille. Si
     le module se charge, c'est que les 39 glyphes font bien 7 rangs de 5. */
  ok(Object.keys(G.GLYPHES).length >= 39, 'police : les glyphes sont là');
  eq(G.pixelsGlyphe('1').length, 12, 'police : le 1 a ses douze pixels');
  ok(G.pixelsGlyphe('É').length > G.pixelsGlyphe('E').length,
     'police : É porte bien un accent de plus que E');
  eq(G.pixelsGlyphe('@'), null, 'police : un caractère inconnu ne dessine rien');

  const cal = G.analyser(staged('calendrier.html'));

  /* Le générateur LIT le calendrier du site. Si ces chiffres bougent, c'est le
     monde qui a changé et les plaques doivent suivre — pas l'inverse. */
  eq(cal.mois.length, 9, 'calendrier : 9 mois');
  eq(cal.total, 333, 'calendrier : 333 jours');
  eq(cal.semaine.length, 9, 'calendrier : semaine de 9 jours');
  eq(cal.lunes.length, 3, 'calendrier : 3 lunes');
  eq(cal.semaine.length % cal.lunes.length, 0,
     'calendrier : la semaine se divise en lunes — toute la grille en dépend');

  /* Les décalages de début de mois sont ce qui place chaque jour dans sa
     colonne. Le site les calcule de son côté (MONTH_STARTS) : les deux doivent
     tomber pareil, sinon la plaque imprimée contredit la page. */
  const depuisLaPage = G.litteral(staged('calendrier.html'), 'MONTHS')
    .reduce((acc, m) => { acc.out.push(acc.cum % 9); acc.cum += m.days; return acc; },
            { cum: 0, out: [] }).out;
  eq(cal.mois.map(m => m.depart), depuisLaPage, 'calendrier : décalages de mois');

  /* Le Zénith est au jour absolu 190, et la page le décrit comme « 3 Soillse ».
     C'est le seul jour marqué du calendrier : s'il atterrit ailleurs, le cercle
     gravé se retrouve sur le mauvais chiffre. */
  const soillse = cal.mois[5];
  eq(soillse.name, 'Soillse', 'Zénith : le mois attendu');
  eq(190 - soillse.premierJourAbsolu + 1, 3, 'Zénith : troisième jour de Soillse');

  /* Chaque jour du mois doit occuper une case, une seule, et dans la grille. */
  cal.mois.forEach((m, i) => {
    const cases = new Set();
    const lignes = Math.ceil((m.depart + m.days) / 9);
    for (let j = 1; j <= m.days; j++) {
      const idx = m.depart + j - 1;
      const col = idx % 9, ligne = Math.floor(idx / 9);
      ok(ligne < lignes, m.name + ' : le jour ' + j + ' déborde de la grille');
      ok(!cases.has(idx), m.name + ' : deux jours dans la même case');
      cases.add(idx);
    }
    eq(cases.size, m.days, m.name + ' : ' + m.days + ' cases occupées');
  });

  /* Géométrie : on ne génère que deux mois par mode. Le contrôle est identique
     pour tous et chaque plaque coûte une seconde — Réolta est le mois le plus
     long (41 jours, 5 lignes), Soillse le plus court et le seul à porter un
     jour marqué. Les deux cas particuliers sont donc couverts. */
  [['saillant', {}], ['creusé', { creux: true }]].forEach(([mode, opts]) => {
    [0, 5].forEach(i => {
      const p = G.plaque(cal, i, opts);
      const v = G.verifier(p);
      ok(v.ok, p.mois.name + ' (' + mode + ') : ' + (v.ennuis.join(' · ') || 'ok'));
      eq(p.maille.tri.length % 12, 0, p.mois.name + ' (' + mode + ') : maillage en boîtes');
      ok(p.L <= 220 && p.H <= 220, p.mois.name + ' : tient sur un plateau de 220 mm');
      ok(p.maille.tri.length > 1000, p.mois.name + ' (' + mode + ') : la plaque n\'est pas vide');

      /* Le STL binaire annonce son compte de triangles à l'octet 80. Un fichier
         qui ment là-dessus s'ouvre sur une pièce tronquée. */
      const buf = p.maille.stl('test');
      eq(buf.readUInt32LE(80), p.maille.tri.length, p.mois.name + ' : en-tête STL');
      eq(buf.length, 84 + p.maille.tri.length * 50, p.mois.name + ' : taille du fichier STL');
    });
  });

  /* Les contrôles doivent ATTRAPER, pas seulement passer : un test de maillage
     qui ne casse jamais ne protège de rien. On casse donc exprès. */
  {
    const p = G.plaque(cal, 0, {});
    const t = p.maille.tri[0];
    p.maille.tri[0] = [t[0], t[2], t[1]];
    ok(!G.verifier(p).ok, 'contrôle : une face retournée est refusée');
  }
  {
    const p = G.plaque(cal, 0, {});
    p.maille.tri.splice(20, 1);
    ok(!G.verifier(p).ok, 'contrôle : une face manquante est refusée');
  }
  ok(!G.verifier(G.plaque(cal, 0, { relief: 0 })).ok,
     'contrôle : un relief nul est refusé — la plaque sortirait vierge');
  ok(!G.verifier(G.plaque(cal, 0, { cellule: 26 })).ok,
     'contrôle : une plaque plus grande que le plateau est signalée');
}

/* ══════════ Verdict ══════════ */
if (failures.length) {
  console.error(`✗ Smoke-tests : ${failures.length} échec(s) sur ${assertions} assertions`);
  failures.forEach(f => console.error('  • ' + f));
  process.exit(1);
}
console.log(`✓ Smoke-tests OK (${assertions} assertions)`);
