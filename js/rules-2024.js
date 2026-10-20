/* ════════════════════════════════════════════════════════════
   KALEYSUR — Données de règles D&D 2024 (PHB)
   Extrait de joueurs.html : classes, sous-classes, espèces, backgrounds,
   feats, emplacements de sorts, ressources, équipement de départ.
   Chargé en script classique AVANT le script principal — les const du
   global lexical environment restent visibles par les scripts suivants.
   ════════════════════════════════════════════════════════════ */
/* ── Classes D&D 2024 — hit die + spellcasting ability ── */
const DND_CLASSES = {
  'Artificer': { de: '1d8',  sort: 'INT' },
  'Barbarian': { de: '1d12', sort: '' },
  'Bard':      { de: '1d8',  sort: 'CHA' },
  'Cleric':    { de: '1d8',  sort: 'SAG' },
  'Druid':     { de: '1d8',  sort: 'SAG' },
  'Fighter':   { de: '1d10', sort: '' },
  'Monk':      { de: '1d8',  sort: '' },
  'Paladin':   { de: '1d10', sort: 'CHA' },
  'Psion':     { de: '1d6',  sort: 'INT' },   // Unearthed Arcana 2025 (playtest)
  'Ranger':    { de: '1d10', sort: 'SAG' },
  'Rogue':     { de: '1d8',  sort: '' },
  'Sorcerer':  { de: '1d6',  sort: 'CHA' },
  'Warlock':   { de: '1d8',  sort: 'CHA' },
  'Wizard':    { de: '1d6',  sort: 'INT' },
};

/* ── Sorts préparés par niveau de classe (PHB 2024) ──
   En 2024 ce n'est plus « niveau + modificateur » mais une table fixe par classe.
   Index 0 = niveau 1. Les classes absentes ne préparent pas de sorts. */
const PREPARED_SPELLS = {
  // Lanceurs complets « standard »
  'Bard':      [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
  'Cleric':    [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
  'Druid':     [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
  'Psion':     [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22], // UA 2025
  'Sorcerer':  [2,4,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
  'Wizard':    [4,5,6,7,9,10,11,12,14,15,16,16,17,18,19,21,22,23,24,25],
  // Demi-lanceurs et pacte
  'Warlock':   [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
  'Paladin':   [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15],
  'Ranger':    [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15],
  'Artificer': [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15],
};

/* ── Progression des sorts mineurs ──
   PHB 2024 : les lanceurs complets en gagnent un aux niveaux 4 et 10.
   Paladin et Rodeur n'en ont pas. Le Psion suit la meme cadence depuis la
   mise a jour d'octobre 2025 (2 au niveau 1, 3 au niveau 4, 4 au niveau 10).
   L'Artificier suit la progression Tasha's, faute de table 2024 publiee. */
const CANTRIPS_KNOWN = {
  'Artificer': [2,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,5,5,5],
  'Bard':      [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  'Cleric':    [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
  'Druid':     [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  'Paladin':   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  'Psion':     [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  'Ranger':    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  'Sorcerer':  [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],
  'Warlock':   [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  'Wizard':    [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
};

/* ── Style de préparation des sorts (PHB 2024) ──
   La 2024 a supprimé les « sorts connus » : toutes les classes préparent des sorts.
   Ce qui change, c'est QUAND on peut les échanger — et le Magicien garde un grimoire.
     swap : 'long'  → échange à chaque repos long
            'level' → liste fixe, échange seulement en montant de niveau
     book : true    → les sorts non préparés restent accessibles (grimoire) */
const SPELL_PREP_STYLE = {
  'Artificer': { swap:'long',  book:false },
  'Cleric':    { swap:'long',  book:false },
  'Druid':     { swap:'long',  book:false },
  'Paladin':   { swap:'long',  book:false },
  'Wizard':    { swap:'long',  book:true  },   // grimoire + sorts préparés du jour
  'Bard':      { swap:'level', book:false },
  'Psion':     { swap:'level', book:false },   // UA — Psion Update (oct. 2025)
  'Ranger':    { swap:'level', book:false },
  'Sorcerer':  { swap:'level', book:false },
  'Warlock':   { swap:'level', book:false },
};

/* ── Ce qu'un lanceur doit choisir au niveau 1 ──
   Le nombre de sorts préparés vient de PREPARED_SPELLS[classe][0] ; on ne stocke
   ici que les sorts mineurs et, pour le Magicien, la taille du grimoire de départ.
   La progression complète des sorts mineurs relèvera du monteur de niveau. */
const STARTING_SPELLS = {
  'Artificer': { cantrips: 2 },
  'Bard':      { cantrips: 2 },
  'Cleric':    { cantrips: 3 },
  'Druid':     { cantrips: 2 },
  'Paladin':   { cantrips: 0 },   // demi-lanceur sans sorts mineurs
  'Psion':     { cantrips: 2 },
  'Ranger':    { cantrips: 0 },   // idem — mais lanceur dès le niveau 1 en 2024
  'Sorcerer':  { cantrips: 4 },
  'Warlock':   { cantrips: 2 },
  'Wizard':    { cantrips: 3, spellbook: 6 },
};

/* ── Langues (PHB 2024) ── Commun est automatique, +2 au choix via l'origine. */
const LANGUAGES = {
  standard: ['Common Sign Language','Draconic','Dwarvish','Elvish','Giant','Gnomish','Goblin','Halfling','Orc'],
  rare:     ['Abyssal','Celestial','Deep Speech','Druidic','Infernal','Primordial','Sylvan','Thieves\' Cant','Undercommon'],
};

/* ── Outils laissés au choix par certains backgrounds ──
   La clé correspond au texte « … (choice) » de BACKGROUND_DATA.tool. */
const TOOL_CHOICES = {
  "Artisan's Tools (choice)": ["Alchemist's Supplies","Brewer's Supplies","Calligrapher's Supplies","Carpenter's Tools","Cartographer's Tools","Cobbler's Tools","Cook's Utensils","Glassblower's Tools","Jeweler's Tools","Leatherworker's Tools","Mason's Tools","Painter's Supplies","Potter's Tools","Smith's Tools","Tinker's Tools","Weaver's Tools","Woodcarver's Tools"],
  "Gaming Set (choice)":        ['Dice Set','Dragonchess Set','Playing Card Set','Three-Dragon Ante Set'],
  "Musical Instrument (choice)":['Bagpipes','Drum','Dulcimer','Flute','Horn','Lute','Lyre','Pan Flute','Shawm','Viol'],
};

/* ── Spell Slot Tables ── */
const FULL_CASTER_SLOTS = {
  1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0],
  4:[4,3,0,0,0,0,0,0,0], 5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0],
  7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0], 9:[4,3,3,3,1,0,0,0,0],
  10:[4,3,3,3,2,0,0,0,0], 11:[4,3,3,3,2,1,0,0,0], 12:[4,3,3,3,2,1,0,0,0],
  13:[4,3,3,3,2,1,1,0,0], 14:[4,3,3,3,2,1,1,0,0], 15:[4,3,3,3,2,1,1,1,0],
  16:[4,3,3,3,2,1,1,1,0], 17:[4,3,3,3,2,1,1,1,1], 18:[4,3,3,3,3,1,1,1,1],
  19:[4,3,3,3,3,2,1,1,1], 20:[4,3,3,3,3,2,2,1,1]
};
/* Paladin et Rodeur. En 2024 ils lancent des sorts des le niveau 1 : c'est le
   seul ecart avec la table 2014, qui commencait au niveau 2. */
const HALF_CASTER_SLOTS = {
  1:[2,0,0,0,0,0,0,0,0], 2:[2,0,0,0,0,0,0,0,0], 3:[3,0,0,0,0,0,0,0,0],
  4:[3,0,0,0,0,0,0,0,0], 5:[4,2,0,0,0,0,0,0,0], 6:[4,2,0,0,0,0,0,0,0],
  7:[4,3,0,0,0,0,0,0,0], 8:[4,3,0,0,0,0,0,0,0], 9:[4,3,2,0,0,0,0,0,0],
  10:[4,3,2,0,0,0,0,0,0], 11:[4,3,3,0,0,0,0,0,0], 12:[4,3,3,0,0,0,0,0,0],
  13:[4,3,3,1,0,0,0,0,0], 14:[4,3,3,1,0,0,0,0,0], 15:[4,3,3,2,0,0,0,0,0],
  16:[4,3,3,2,0,0,0,0,0], 17:[4,3,3,3,1,0,0,0,0], 18:[4,3,3,3,1,0,0,0,0],
  19:[4,3,3,3,2,0,0,0,0], 20:[4,3,3,3,2,0,0,0,0]
};
/* Chevalier Occulte et Filou Arcanique. Identique en 2014 et en 2024.
   A ne pas confondre avec leur apport au multiclassement, qui est le tiers du
   niveau arrondi a l'inferieur : les deux ne donnent pas le meme resultat. */
const THIRD_CASTER_SLOTS = {
  1:[0,0,0,0,0,0,0,0,0], 2:[0,0,0,0,0,0,0,0,0], 3:[2,0,0,0,0,0,0,0,0],
  4:[3,0,0,0,0,0,0,0,0], 5:[3,0,0,0,0,0,0,0,0], 6:[3,0,0,0,0,0,0,0,0],
  7:[4,2,0,0,0,0,0,0,0], 8:[4,2,0,0,0,0,0,0,0], 9:[4,2,0,0,0,0,0,0,0],
  10:[4,3,0,0,0,0,0,0,0], 11:[4,3,0,0,0,0,0,0,0], 12:[4,3,0,0,0,0,0,0,0],
  13:[4,3,2,0,0,0,0,0,0], 14:[4,3,2,0,0,0,0,0,0], 15:[4,3,2,0,0,0,0,0,0],
  16:[4,3,3,0,0,0,0,0,0], 17:[4,3,3,0,0,0,0,0,0], 18:[4,3,3,0,0,0,0,0,0],
  19:[4,3,3,1,0,0,0,0,0], 20:[4,3,3,1,0,0,0,0,0]
};
const WARLOCK_SLOTS = {
  1:[1,0,0,0,0,0,0,0,0], 2:[2,0,0,0,0,0,0,0,0], 3:[0,2,0,0,0,0,0,0,0],
  4:[0,2,0,0,0,0,0,0,0], 5:[0,0,2,0,0,0,0,0,0], 6:[0,0,2,0,0,0,0,0,0],
  7:[0,0,0,2,0,0,0,0,0], 8:[0,0,0,2,0,0,0,0,0], 9:[0,0,0,0,2,0,0,0,0],
  10:[0,0,0,0,2,0,0,0,0], 11:[0,0,0,0,3,0,0,0,0], 12:[0,0,0,0,3,0,0,0,0],
  13:[0,0,0,0,3,0,0,0,0], 14:[0,0,0,0,3,0,0,0,0], 15:[0,0,0,0,3,0,0,0,0],
  16:[0,0,0,0,3,0,0,0,0], 17:[0,0,0,0,4,0,0,0,0], 18:[0,0,0,0,4,0,0,0,0],
  19:[0,0,0,0,4,0,0,0,0], 20:[0,0,0,0,4,0,0,0,0]
};
const ARTIFICER_SLOTS = {
  1:[2,0,0,0,0,0,0,0,0], 2:[2,0,0,0,0,0,0,0,0], 3:[3,0,0,0,0,0,0,0,0],
  4:[3,0,0,0,0,0,0,0,0], 5:[4,2,0,0,0,0,0,0,0], 6:[4,2,0,0,0,0,0,0,0],
  7:[4,3,0,0,0,0,0,0,0], 8:[4,3,0,0,0,0,0,0,0], 9:[4,3,2,0,0,0,0,0,0],
  10:[4,3,2,0,0,0,0,0,0], 11:[4,3,3,0,0,0,0,0,0], 12:[4,3,3,0,0,0,0,0,0],
  13:[4,3,3,1,0,0,0,0,0], 14:[4,3,3,1,0,0,0,0,0], 15:[4,3,3,2,0,0,0,0,0],
  16:[4,3,3,2,0,0,0,0,0], 17:[4,3,3,3,1,0,0,0,0], 18:[4,3,3,3,1,0,0,0,0],
  19:[4,3,3,3,2,0,0,0,0], 20:[4,3,3,3,2,0,0,0,0]
};

/* ════════════════════════════════════════════════════════════
   MULTICLASS SPELL SLOTS  (PHB 5e / 2024 combined table)
   ════════════════════════════════════════════════════════════ */
const MULTICLASS_SLOTS = {
  1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0],
  4:[4,3,0,0,0,0,0,0,0], 5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0],
  7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0], 9:[4,3,3,3,1,0,0,0,0],
  10:[4,3,3,3,2,0,0,0,0],11:[4,3,3,3,2,1,0,0,0],12:[4,3,3,3,2,1,0,0,0],
  13:[4,3,3,3,2,1,1,0,0],14:[4,3,3,3,2,1,1,0,0],15:[4,3,3,3,2,1,1,1,0],
  16:[4,3,3,3,2,1,1,1,0],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],
  19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1]
};

/* ════════════════════════════════════════════════════════════
   QUI LANCE QUOI — source unique
   Trois ecrans decidaient chacun de leur cote, avec trois listes recopiees, et
   elles avaient divergé sur le Psion. Tout passe par ici desormais.
   ════════════════════════════════════════════════════════════ */

/* Qui lance quoi, en une table. Regroupee en un seul objet plutot qu'en
   plusieurs tableaux : le harnais de smoke-tests extrait les litteraux par
   appariement d'accolades et ne sait pas lire un tableau isole — la table
   serait alors recopiee dans les tests, ce qui ramenerait l'ecart qu'on vient
   de supprimer. */
const LANCEURS = {
  complet:    ['Bard', 'Cleric', 'Druid', 'Psion', 'Sorcerer', 'Wizard'],
  demi:       ['Paladin', 'Ranger'],
  pacte:      ['Warlock'],
  artificier: ['Artificer'],
  /* Ces sous-classes rendent lanceuse une classe qui ne l'est pas. */
  tiers:      { Fighter: ['Eldritch Knight'], Rogue: ['Arcane Trickster'] },
};

/** 'complet' | 'demi' | 'tiers' | 'pacte' | 'artificier' | null */
function typeLanceur(classe, sousClasse) {
  if (!classe) return null;
  for (const type of ['pacte', 'artificier', 'complet', 'demi']) {
    if (LANCEURS[type].includes(classe)) return type;
  }
  if ((LANCEURS.tiers[classe] || []).includes(sousClasse)) return 'tiers';
  return null;
}

/** La table de la classe elle-meme, pour un personnage qui n'a qu'elle. */
function emplacementsClasse(classe, sousClasse, niveau) {
  const n = Math.max(1, Math.min(20, parseInt(niveau, 10) || 1));
  switch (typeLanceur(classe, sousClasse)) {
    case 'complet':    return FULL_CASTER_SLOTS[n];
    case 'demi':       return HALF_CASTER_SLOTS[n];
    case 'tiers':      return THIRD_CASTER_SLOTS[n];
    case 'pacte':      return WARLOCK_SLOTS[n];
    case 'artificier': return ARTIFICER_SLOTS[n];
    default:           return null;
  }
}

/** Niveau de lanceur effectif pour la table multiclasse.
    2024 : Paladin et Rodeur comptent pour la moitie ARRONDIE AU SUPERIEUR. */
function niveauLanceurEffectif(classes) {
  let eff = 0;
  for (const cl of classes || []) {
    const n = parseInt(cl.niveau, 10) || 0;
    if (n <= 0) continue;
    switch (typeLanceur(cl.classe, cl.sousClasse)) {
      case 'complet':    eff += n; break;
      case 'demi':       eff += Math.ceil(n / 2); break;
      case 'artificier': eff += Math.ceil(n / 2); break;
      case 'tiers':      eff += Math.floor(n / 3); break;
      /* La Magie de Pacte ne se combine pas : elle s'affiche a part. */
    }
  }
  return eff;
}

/** Les emplacements d'un personnage, mono ou multiclasse.
    Un seul lanceur non-occultiste utilise SA table de classe, pas la table
    multiclasse : pour un demi-lanceur les deux coincident, mais pour un
    tiers-lanceur elles divergent nettement. */
function emplacementsPersonnage(classes) {
  const lanceurs = (classes || []).filter(cl =>
    (parseInt(cl.niveau, 10) || 0) > 0 && typeLanceur(cl.classe, cl.sousClasse));
  const horsPacte = lanceurs.filter(cl => typeLanceur(cl.classe, cl.sousClasse) !== 'pacte');
  if (!horsPacte.length) return null;
  if (horsPacte.length === 1) {
    const cl = horsPacte[0];
    return emplacementsClasse(cl.classe, cl.sousClasse, cl.niveau);
  }
  const eff = niveauLanceurEffectif(horsPacte);
  return eff > 0 ? (MULTICLASS_SLOTS[Math.min(eff, 20)] || null) : null;
}

/* ════════════════════════════════════════════════════════════
   D&D 2024 CLASS DATA  (PHB, base classes)
   Each feature: { name, desc, type }
   type: 'feature' | 'asi' | 'subclass' | 'epic'
   ════════════════════════════════════════════════════════════ */
/* ── Équipement de départ 2024 (PHB) — utilisé par l'assistant de création et le compendium ── */
/* ── Armes et armures de départ ──
   Sert à dériver la CA et les lignes d'attaque à la création du personnage.
   Les clés correspondent exactement aux `name` de STARTING_EQUIP.
   `mode`/`baseAC` alimentent c.armorConfig (voir calcAndSetAC dans joueurs.html). */
const STARTING_ARMOR = {
  'Leather Armor':          { mode:'light',  baseAC:11, armorName:'Leather' },
  'Studded Leather Armor':  { mode:'light',  baseAC:12, armorName:'Studded Leather' },
  'Chain Shirt':            { mode:'medium', baseAC:13, armorName:'Chain Shirt' },
  'Chain Mail':             { mode:'heavy',  baseAC:16, armorName:'Chain Mail' },
};

/* dmg = dé de base, abil = 'for' | 'dex', finesse = le joueur prend le meilleur des deux */
/* `cat` et `light` ne sont pas decoratifs : depuis que le Roublard et le Moine
   ont une maitrise conditionnelle — « Martial weapons that have the Finesse or
   Light property » — c'est la seule facon de repondre a la question. Sans eux,
   isProficientWith ne saurait pas si l'arme en main est concernee.
   La Serpe n'a pas Finesse en 2024 : elle est Simple, Legere, 1d4 tranchant. */
const STARTING_WEAPONS = {
  'Dagger':         { dmg:'1d4',  type:'piercing',    abil:'for', cat:'simple',  finesse:true, light:true },
  'Flail':          { dmg:'1d8',  type:'bludgeoning', abil:'for', cat:'martial' },
  'Greataxe':       { dmg:'1d12', type:'slashing',    abil:'for', cat:'martial' },
  'Greatsword':     { dmg:'2d6',  type:'slashing',    abil:'for', cat:'martial' },
  'Handaxe':        { dmg:'1d6',  type:'slashing',    abil:'for', cat:'simple',  light:true },
  'Javelin':        { dmg:'1d6',  type:'piercing',    abil:'for', cat:'simple' },
  'Light Crossbow': { dmg:'1d8',  type:'piercing',    abil:'dex', cat:'simple' },
  'Longbow':        { dmg:'1d8',  type:'piercing',    abil:'dex', cat:'martial' },
  'Longsword':      { dmg:'1d8',  type:'slashing',    abil:'for', cat:'martial' },
  'Mace':           { dmg:'1d6',  type:'bludgeoning', abil:'for', cat:'simple' },
  'Quarterstaff':   { dmg:'1d6',  type:'bludgeoning', abil:'for', cat:'simple' },
  'Scimitar':       { dmg:'1d6',  type:'slashing',    abil:'for', cat:'martial', finesse:true, light:true },
  'Shortbow':       { dmg:'1d6',  type:'piercing',    abil:'dex', cat:'simple' },
  'Shortsword':     { dmg:'1d6',  type:'piercing',    abil:'for', cat:'martial', finesse:true, light:true },
  'Sickle':         { dmg:'1d4',  type:'slashing',    abil:'for', cat:'simple',  light:true },
  'Spear':          { dmg:'1d6',  type:'piercing',    abil:'for', cat:'simple' },
};

const STARTING_EQUIP = {
  Artificer: [
    { label:'Option A', gold:8, items:[{qty:1,name:'Studded Leather Armor'},{qty:1,name:'Dagger'},{qty:1,name:'Light Crossbow'},{qty:20,name:'Bolt'},{qty:1,name:"Thieves' Tools"},{qty:1,name:"Artisan's Tools ou Instrument"},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option B — Or uniquement', gold:100, items:[] }
  ],
  Barbarian: [
    { label:'Option A', gold:15, items:[{qty:1,name:'Greataxe'},{qty:4,name:'Handaxe'},{qty:1,name:"Explorer's Pack"}] },
    { label:'Option B — Or uniquement', gold:75, items:[] }
  ],
  Bard: [
    { label:'Option A', gold:19, items:[{qty:1,name:'Leather Armor'},{qty:2,name:'Dagger'},{qty:1,name:'Musical Instrument'},{qty:1,name:"Entertainer's Pack"}] },
    { label:'Option B — Or uniquement', gold:90, items:[] }
  ],
  Cleric: [
    { label:'Option A', gold:7, items:[{qty:1,name:'Chain Shirt'},{qty:1,name:'Shield'},{qty:1,name:'Mace'},{qty:1,name:'Holy Symbol'},{qty:1,name:"Priest's Pack"}] },
    { label:'Option B — Or uniquement', gold:110, items:[] }
  ],
  Druid: [
    { label:'Option A', gold:9, items:[{qty:1,name:'Leather Armor'},{qty:1,name:'Shield'},{qty:1,name:'Sickle'},{qty:1,name:'Druidic Focus (Quarterstaff)'},{qty:1,name:"Explorer's Pack"},{qty:1,name:'Herbalism Kit'}] },
    { label:'Option B — Or uniquement', gold:50, items:[] }
  ],
  Fighter: [
    { label:'Option A', gold:4, items:[{qty:1,name:'Chain Mail'},{qty:1,name:'Greatsword'},{qty:1,name:'Flail'},{qty:8,name:'Javelin'},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option B', gold:11, items:[{qty:1,name:'Studded Leather Armor'},{qty:1,name:'Scimitar'},{qty:1,name:'Shortsword'},{qty:1,name:'Longbow'},{qty:20,name:'Arrow'},{qty:1,name:'Quiver'},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option C — Or uniquement', gold:155, items:[] }
  ],
  Monk: [
    { label:'Option A', gold:11, items:[{qty:1,name:'Spear'},{qty:5,name:'Dagger'},{qty:1,name:"Artisan's Tools ou Instrument"},{qty:1,name:"Explorer's Pack"}] },
    { label:'Option B — Or uniquement', gold:50, items:[] }
  ],
  Paladin: [
    { label:'Option A', gold:9, items:[{qty:1,name:'Chain Mail'},{qty:1,name:'Shield'},{qty:1,name:'Longsword'},{qty:6,name:'Javelin'},{qty:1,name:'Holy Symbol'},{qty:1,name:"Priest's Pack"}] },
    { label:'Option B — Or uniquement', gold:150, items:[] }
  ],
  Psion: [
    { label:'Option A', gold:6, items:[{qty:1,name:'Spear'},{qty:2,name:'Dagger'},{qty:1,name:'Light Crossbow'},{qty:20,name:'Bolt'},{qty:1,name:'Case'},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option B — Or uniquement', gold:50, items:[] }
  ],
  Ranger: [
    { label:'Option A', gold:7, items:[{qty:1,name:'Studded Leather Armor'},{qty:1,name:'Scimitar'},{qty:1,name:'Shortsword'},{qty:1,name:'Longbow'},{qty:20,name:'Arrow'},{qty:1,name:'Quiver'},{qty:1,name:'Druidic Focus (sprig of mistletoe)'},{qty:1,name:"Explorer's Pack"}] },
    { label:'Option B — Or uniquement', gold:150, items:[] }
  ],
  Rogue: [
    { label:'Option A', gold:8, items:[{qty:1,name:'Leather Armor'},{qty:2,name:'Dagger'},{qty:1,name:'Shortsword'},{qty:1,name:'Shortbow'},{qty:20,name:'Arrow'},{qty:1,name:'Quiver'},{qty:1,name:"Thieves' Tools"},{qty:1,name:"Burglar's Pack"}] },
    { label:'Option B — Or uniquement', gold:100, items:[] }
  ],
  Sorcerer: [
    { label:'Option A', gold:28, items:[{qty:1,name:'Spear'},{qty:2,name:'Dagger'},{qty:1,name:'Arcane Focus (crystal)'},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option B — Or uniquement', gold:50, items:[] }
  ],
  Warlock: [
    { label:'Option A', gold:15, items:[{qty:1,name:'Leather Armor'},{qty:1,name:'Sickle'},{qty:2,name:'Dagger'},{qty:1,name:'Arcane Focus (orb)'},{qty:1,name:'Book (occult lore)'},{qty:1,name:"Scholar's Pack"}] },
    { label:'Option B — Or uniquement', gold:100, items:[] }
  ],
  Wizard: [
    { label:'Option A', gold:5, items:[{qty:2,name:'Dagger'},{qty:1,name:'Arcane Focus (Quarterstaff)'},{qty:1,name:'Robe'},{qty:1,name:'Spellbook'},{qty:1,name:"Scholar's Pack"}] },
    { label:'Option B — Or uniquement', gold:55, items:[] }
  ]
};

/* ════════════════════════════════════════════════════════════
   D&D 2024 GENERAL FEATS (PHB) — disponibles aux niveaux 4/8/12/16
   (et 19 pour certaines classes) en remplacement d'un ASI.
   Un feat marqué asi:true donne aussi +1 dans une caractéristique.
   ════════════════════════════════════════════════════════════ */
const GENERAL_FEATS = {
  'Ability Score Improvement': { asi:false, prereq:'', desc:"Increase one ability score by 2, or two ability scores by 1 each (max 20). Can be taken multiple times." },
  'Actor':              { asi:true, abil:'CHA', prereq:'CHA 13+', desc:"Advantage on Deception and Performance checks when trying to pass yourself off as someone else. You can mimic a voice or sound you've heard (Insight vs your Deception to detect)." },
  'Athlete':            { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Standing up from Prone costs only 5 ft of movement. You can Climb without extra movement cost, and make a running Long/High Jump after moving only 5 ft." },
  'Charger':            { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"When you take the Dash action, you can make one melee attack as a Bonus Action: +1d8 damage if you moved 10+ ft straight, or push the target 10 ft." },
  'Chef':               { asi:true, abil:'CON or SAG', prereq:'CON or SAG 13+', desc:"Proficiency with Cook's Utensils. Short Rest: cook a meal for up to 4+PB creatures, each regains 1d8 extra HP. Long Rest: bake PB treats granting 1d8 Temp HP each." },
  'Crossbow Expert':    { asi:true, abil:'DEX', prereq:'DEX 13+', desc:"Ignore the Loading property of crossbows. Being within 5 ft of an enemy doesn't impose Disadvantage on your ranged attacks. When you use the Attack action with a one-handed weapon, you can attack with a Hand Crossbow as a Bonus Action." },
  'Crusher':            { asi:true, abil:'FOR or CON', prereq:'FOR or CON 13+', desc:"Once per turn when you deal Bludgeoning damage, move the target 5 ft. On a Critical Hit, attacks against that creature have Advantage until your next turn." },
  'Defensive Duelist':  { asi:true, abil:'DEX', prereq:'DEX 13+', desc:"Reaction when hit by a melee attack while wielding a Finesse weapon: add your Proficiency Bonus to AC, possibly causing the attack to miss." },
  'Dual Wielder':       { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"+1 AC while wielding a Melee weapon in each hand. You can use two-weapon fighting even with non-Light weapons. You can draw or stow two weapons at once." },
  'Durable':            { asi:true, abil:'CON', prereq:'CON 13+', desc:"When you roll a Hit Die to regain HP, the minimum equals twice your CON modifier (min 2). As a Bonus Action, spend a Hit Die to regain HP (PB times/Long Rest)." },
  'Elemental Adept':    { asi:true, abil:'INT, SAG or CHA', prereq:'Spellcasting/Pact Magic', desc:"Choose a damage type (Acid, Cold, Fire, Lightning, Thunder). Your spells ignore Resistance to it, and treat any 1 on a damage die as a 2." },
  'Fey-Touched':        { asi:true, abil:'INT, SAG or CHA', prereq:'', desc:"Learn Misty Step and one level-1 Divination or Enchantment spell. Cast each once per Long Rest without a slot, or with slots." },
  'Grappler':           { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Advantage on attacks against a creature you're grappling. Grappling doesn't cost extra movement. You can move a grappled creature of your size or smaller at full speed." },
  'Great Weapon Master':{ asi:true, abil:'FOR', prereq:'FOR 13+', desc:"When you score a Critical Hit or reduce a creature to 0 HP with a Heavy weapon, make one melee attack as a Bonus Action. When you hit with a Heavy weapon, add your Proficiency Bonus to the damage (once per turn)." },
  'Heavily Armored':    { asi:true, abil:'FOR', prereq:'Medium armor proficiency', desc:"Gain proficiency with Heavy armor." },
  'Heavy Armor Master': { asi:true, abil:'FOR or CON', prereq:'Heavy armor proficiency', desc:"While wearing Heavy armor, reduce Bludgeoning/Piercing/Slashing damage taken by your Proficiency Bonus." },
  'Inspiring Leader':   { asi:true, abil:'SAG or CHA', prereq:'SAG or CHA 13+', desc:"After a Rest, give up to 6 creatures (including yourself) Temp HP equal to your PB + your SAG or CHA modifier." },
  'Keen Mind':          { asi:true, abil:'INT', prereq:'INT 13+', desc:"You always know which way is north and the number of hours until sunrise/sunset. As a Magic action, gain Advantage on your next INT (History/Investigation/Nature/Religion) check (PB/Long Rest)." },
  'Lightly Armored':    { asi:true, abil:'FOR or DEX', prereq:'', desc:"Gain proficiency with Light armor and Shields." },
  'Mage Slayer':        { asi:true, abil:'FOR or DEX', prereq:'', desc:"Reaction: when a creature within 5 ft casts a spell, make one melee attack against it. Advantage on saves against spells cast by creatures within 5 ft." },
  'Martial Weapon Training': { asi:true, abil:'FOR or DEX', prereq:'', desc:"Gain proficiency with Martial weapons." },
  'Medium Armor Master':{ asi:true, abil:'FOR or DEX', prereq:'Medium armor proficiency', desc:"Wearing Medium armor doesn't impose Disadvantage on Stealth, and you can add 3 (instead of 2) to your AC from DEX." },
  'Moderately Armored': { asi:true, abil:'FOR or DEX', prereq:'Light armor proficiency', desc:"Gain proficiency with Medium armor." },
  'Mounted Combatant':  { asi:true, abil:'FOR, DEX or SAG', prereq:'', desc:"Advantage on melee attacks against unmounted creatures smaller than your mount. Your mount takes no damage on a successful DEX save (half on failure). You can force an attack targeting your mount to target you instead." },
  'Observant':          { asi:true, abil:'INT or SAG', prereq:'INT or SAG 13+', desc:"As a Bonus Action, make a WIS (Perception) or INT (Investigation) check (PB/Long Rest). You can read lips if you can see a creature's mouth and know the language." },
  'Piercer':            { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Once per turn when you deal Piercing damage, reroll one damage die. On a Critical Hit, roll one additional damage die." },
  'Poisoner':           { asi:true, abil:'DEX or INT', prereq:'', desc:"Proficiency with the Poisoner's Kit. Apply poison as a Bonus Action. Your poisons ignore Resistance to Poison. Craft doses that deal 2d8 Poison damage (CON save DC 14 or Poisoned)." },
  'Polearm Master':     { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Bonus Action: attack with the opposite end of a Quarterstaff/Spear/Glaive/Halberd/Pike (1d4 Bludgeoning). Opportunity attack when a creature enters your reach with these weapons." },
  'Resilient':          { asi:true, abil:'choice', prereq:'', desc:"Increase one ability score by 1 and gain proficiency in saving throws using that ability." },
  'Ritual Caster':      { asi:true, abil:'INT, SAG or CHA', prereq:'Spellcasting', desc:"Gain a ritual book with two level-1 ritual spells from a chosen class list. You can add more rituals found in your adventures." },
  'Sentinel':           { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"When you hit with an Opportunity Attack, the creature's Speed becomes 0 for the turn. Creatures provoke Opportunity Attacks even if they Disengage. Reaction: attack a creature within 5 ft that attacks a target other than you." },
  'Sharpshooter':       { asi:true, abil:'DEX', prereq:'DEX 13+', desc:"Attacking at Long Range doesn't impose Disadvantage. Your ranged attacks ignore Half and Three-Quarters Cover. When you hit with a ranged weapon, add your Proficiency Bonus to damage (once per turn)." },
  'Shield Master':      { asi:true, abil:'FOR', prereq:'Shield proficiency', desc:"Bonus Action: shove a creature within 5 ft with your Shield. Add your Shield's AC bonus to DEX saves against effects targeting only you. Reaction: take no damage on a successful DEX save." },
  'Skulker':            { asi:true, abil:'DEX', prereq:'DEX 13+', desc:"You can Hide when only Lightly Obscured. Missing with a ranged attack doesn't reveal your position. Dim light doesn't impose Disadvantage on Perception checks." },
  'Slasher':            { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Once per turn when you deal Slashing damage, reduce the target's Speed by 10 ft. On a Critical Hit, the target has Disadvantage on attacks until your next turn." },
  'Speedy':             { asi:true, abil:'DEX or CON', prereq:'DEX or CON 13+', desc:"Your Speed increases by 10 ft. Difficult Terrain doesn't slow your Dash. Opportunity attacks against you have Disadvantage when you Dash." },
  'Spell Sniper':       { asi:true, abil:'INT, SAG or CHA', prereq:'Spellcasting/Pact Magic', desc:"Your attack-roll spells have double range and ignore Half and Three-Quarters Cover. Learn one attack cantrip." },
  'Shadow-Touched':     { asi:true, abil:'INT, SAG or CHA', prereq:'', desc:"Learn Invisibility and one level-1 Illusion or Necromancy spell. Cast each once per Long Rest without a slot, or with slots." },
  'Telekinetic':        { asi:true, abil:'INT, SAG or CHA', prereq:'', desc:"Learn Mage Hand (invisible, cast without components). Bonus Action: telekinetically shove a creature 5 ft (STR save)." },
  'Telepathic':         { asi:true, abil:'INT, SAG or CHA', prereq:'', desc:"Speak telepathically to any creature within 60 ft that understands a language. You always have Detect Thoughts prepared — cast once per Long Rest without a slot." },
  'War Caster':         { asi:true, abil:'INT, SAG or CHA', prereq:'Spellcasting/Pact Magic', desc:"Advantage on CON saves to maintain Concentration. Perform somatic components with weapons/shield in hand. Cast a spell (1 action, targeting one creature) instead of an Opportunity Attack." },
  'Weapon Master':      { asi:true, abil:'FOR or DEX', prereq:'', desc:"You gain the Mastery property for one kind of weapon you're proficient with; you can change it on a Long Rest." },
  /* ── Arcana Unleashed (2026) ──
     Les huit « Adept » couvrent les huit ecoles de magie : memes sorts
     toujours prepares, effet propre a l'ecole. Les quatre dons de familier
     prolongent Familiar Friend. */
  'Abjuration Adept':   { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"Always have Shield, Lesser Restoration, Protection from Energy, Banishment and Mass Cure Wounds prepared as your slots allow. When you cast an Abjuration spell with a slot, you or a creature within 30 ft gains Temp HP equal to twice the slot level." },
  'Conjuration Adept':  { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"Always have Entangle, Misty Step, Conjure Animals, Dimension Door and Conjure Elemental prepared as your slots allow. Add the feat's ability modifier to CON saves to maintain Concentration on a Conjuration spell." },
  'Divination Adept':   { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"Always have Detect Evil and Good, Mind Spike, Clairvoyance, Divination and Scrying prepared as your slots allow. Reaction: give a creature within 60 ft Advantage or Disadvantage on a D20 Test — once per Long Rest, and regained whenever you cast a Divination spell with a slot." },
  'Enchantment Adept':  { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"Always have Dissonant Whispers, Enthrall, Hold Person, Dominate Beast and Modify Memory prepared as your slots allow. You can cast Enchantment spells with no components, except costed or consumed Material components." },
  'Evocation Adept':    { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"Always have Chromatic Orb, Shatter, Fireball, Vitriolic Sphere and Wall of Force prepared as your slots allow. Once per turn when an Evocation spell deals damage, expend up to two Hit Point Dice and add the roll to one damage roll." },
  'Illusion Adept':     { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"Always have Silent Image, Phantasmal Force, Major Image, Hallucinatory Terrain and Seeming prepared as your slots allow. You can cast Illusion spells with no components (except costed or consumed ones), and creatures have Disadvantage on Investigation checks to see through your illusions." },
  'Necromancy Adept':   { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"Always have Inflict Wounds, Ray of Enfeeblement, Vampiric Touch, Blight and Raise Dead prepared as your slots allow. When you cast a Necromancy spell with a slot, expend up to two Hit Point Dice and regain HP equal to the roll plus the slot level." },
  'Transmutation Adept':{ asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"Always have Jump, Spider Climb, Slow, Polymorph and Animate Objects prepared as your slots allow. On your turn, casting a Transmutation spell with a slot increases your Speed by 5 ft per slot level until the end of the turn." },
  'Elemental Familiar': { asi:true, abil:'choice', prereq:'Level 4+, Familiar Friend', desc:"Imbue your familiar with Acid, Cold, Fire, Lightning or Thunder: it gains Resistance to that type, and as a Bonus Action it can burst — DEX save in a 5-ft Emanation or 2d4 damage and Prone (Medium or smaller)." },
  'Otherworldly Familiar':{ asi:true, abil:'choice', prereq:'Level 4+, Familiar Friend', desc:"Your familiar gains Resistance to Necrotic, Poison, Psychic, Radiant or Thunder damage (your choice), and can move through creatures and objects as Difficult Terrain." },
  'Soothing Familiar':  { asi:true, abil:'choice', prereq:'Level 4+, Familiar Friend', desc:"While your familiar is within 120 ft, allies in a 5-ft Emanation around it treat a 1 or 2 as a 3 on any die rolled to restore Hit Points." },
  'Warlike Familiar':   { asi:true, abil:'choice', prereq:'Level 4+, Familiar Friend', desc:"You always have Battle Familiar prepared and can cast it once per Long Rest without a slot. Reaction: your battle familiar adds your Proficiency Bonus to the AC of a creature within 5 ft of it against one attack." },
  'Magic Connoisseur':  { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Magic Initiate', desc:"Choose a level-1 and a level-2 spell from your Magic Initiate list: they are always prepared and each can be cast once per Long Rest without a slot. You can swap one of them whenever you gain a level." },
  'Spell Resistant':    { asi:true, abil:'DEX or CON', prereq:'Level 4+', desc:"Resistance to Necrotic, Psychic, Radiant or Thunder damage (your choice). When you would fail a save against a spell or magical effect, add 1d6 to the roll (PB times per Long Rest)." },
  'Spell Subterfuge':   { asi:true, abil:'INT, SAG or CHA', prereq:'Level 4+, Spellcasting/Pact Magic', desc:"After casting a spell with the Magic action using a slot, take both Dash and Hide as one Bonus Action (the feat's ability modifier, times per Long Rest). Casting with a Verbal component or a spell attack doesn't end your Invisible condition if you end your turn with Three-Quarters or Total Cover." },
  /* ── Dons epiques ──
     Reserves au niveau 19, d'ou le drapeau. Tous portent un +1 dont le plafond
     monte a 30 et non 20 : c'est applyLevelUp qui lit ce drapeau pour le savoir.
     Les douze premiers sont ceux du Player's Handbook 2024 ; les trois derniers
     viennent d'Arcana Unleashed et sont signales comme tels par SOURCE_LIVRE. */
  'Boon of Combat Prowess':      { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. Peerless Aim: when you miss with an attack roll, you can hit instead. Once used, not again until the start of your next turn." },
  'Boon of Dimensional Travel':  { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. Blink Steps: immediately after you take the Attack action or the Magic action, you can teleport up to 30 ft to an unoccupied space you can see." },
  'Boon of Energy Resistance':   { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. Energy Resistances: pick two damage types among Acid, Cold, Fire, Lightning, Necrotic, Poison, Psychic, Radiant and Thunder — you have Resistance to both, and can change your picks on a Long Rest. Energy Redirection: Reaction, when you take damage of a chosen type, to send it at a creature you can see within 60 ft that isn't behind Total Cover — DEX save (DC 8 + CON modifier + Proficiency Bonus) or 2d12 + CON modifier damage of that type." },
  'Boon of Fate':                { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. Improve Fate: when you or a creature within 60 ft succeeds on or fails a D20 Test, you can roll 2d4 and apply the total as a bonus or a penalty to that roll. Once used, not again until you roll Initiative or finish a Short or Long Rest." },
  'Boon of Fortitude':           { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. Your Hit Point maximum increases by 40, and whenever you regain Hit Points you regain your CON modifier more — once per turn at most." },
  'Boon of Irresistible Offense':{ epic:true, asi:true, abil:'FOR or DEX', prereq:'Level 19+', desc:"The chosen score can rise to 30. Your Bludgeoning, Piercing and Slashing damage ignores Resistance. On a natural 20 on an attack roll, you can deal extra damage of the attack's type equal to the score this feat increased." },
  'Boon of Recovery':            { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. Last Stand: when you would drop to 0 Hit Points, you drop to 1 instead and regain half your Hit Point maximum — once per Long Rest. Recover Vitality: you have a pool of ten d10; as a Bonus Action, spend any number of them, roll them, and regain that many Hit Points. The pool is restored on a Long Rest." },
  'Boon of Skill':               { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. You gain proficiency in all skills, and Expertise in one skill of your choice in which you don't already have it." },
  'Boon of Speed':               { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. Escape Artist: Bonus Action to take the Disengage action, which also ends the Grappled condition on you. Quickness: your Speed increases by 30 ft." },
  'Boon of Spell Recall':        { epic:true, asi:true, abil:'INT, SAG or CHA', prereq:'Level 19+, Spellcasting/Pact Magic', desc:"The chosen score can rise to 30. Whenever you cast a spell with a level 1–4 spell slot, roll 1d4: if the result equals the slot's level, the slot isn't expended." },
  'Boon of the Night Spirit':    { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. Merge with Shadows: while in Dim Light or Darkness, Bonus Action to become Invisible — it ends as soon as you take an action, a Bonus Action or a Reaction. Shadowy Form: while in Dim Light or Darkness, you have Resistance to every damage type except Psychic and Radiant." },
  'Boon of Truesight':           { epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. You have Truesight out to 60 ft." },

  /* Arcana Unleashed (2026) */
  'Boon of Erupting Spellpower':{ epic:true, asi:true, abil:'INT, SAG or CHA', prereq:'Level 19+, Spellcasting/Pact Magic', desc:"The chosen score can rise to 30. When a spell you cast with a slot deals damage, treat any 1 or 2 on its damage dice as a 3, and creatures damaged by it also have the Prone condition. Once per Initiative roll or Rest." },
  'Boon of Magic School Mastery':{ epic:true, asi:true, abil:'INT, SAG or CHA', prereq:'Level 19+, Spellcasting/Pact Magic', desc:"The chosen score can rise to 30. Pick a school of magic: a level-1 spell from it is always prepared and castable with no slot or components, and a level-7-or-lower spell from it is always prepared and castable once per Long Rest without a slot. Repeatable with a different school." },
  'Boon of the Iron Mind':{ epic:true, asi:true, abil:'choice', prereq:'Level 19+', desc:"The chosen score can rise to 30. You lose Concentration only if you start another Concentration effect, gain the Petrified or Unconscious condition, or die." },
};
/** Dons proposables a ce niveau de personnage.
    Les dons epiques sont reserves au niveau 19 : les lister plus tot revient a
    proposer un choix que la regle refuse. */
function donsDisponibles(niveauTotal) {
  return Object.keys(GENERAL_FEATS)
    .filter(nom => !GENERAL_FEATS[nom].epic || (niveauTotal || 0) >= 19);
}

/* ── Capacites qui demandent un CHOIX (PHB 2024) ──
   Jusqu'ici l'assistant se contentait d'afficher « Fighting Style — Choose a
   fighting style: ... » sans jamais laisser choisir. Le joueur devait le noter
   a la main, ou l'oubliait.

   `pick`    : combien d'options retenir
   `options`       : liste commune a toutes les classes
   `perClassExtra` : ce qu'une classe ajoute EN PLUS de la liste commune
   `inherit` : reutilise les options d'une autre capacite (Champion niv.7) */
const FEATURE_CHOICES = {
  /* Les dix styles du PHB 2024 sont des dons de categorie « Fighting Style
     Feat », ouverts aux trois classes : « You gain a Fighting Style feat of your
     choice » chez le Guerrier comme chez le Paladin et le Rodeur. Seuls Blessed
     Warrior et Druidic Warrior restent des options exclusives de la capacite de
     classe — ce ne sont pas des dons. Arcane Warrior est un don, d'Arcana
     Unleashed, ouvert aux trois aussi. */
  'Fighting Style': {
    pick: 1,
    options: ['Archery','Blind Fighting','Defense','Dueling','Great Weapon Fighting',
              'Interception','Protection','Thrown Weapon Fighting','Two-Weapon Fighting',
              'Unarmed Fighting','Arcane Warrior'],
    perClassExtra: {
      Paladin: ['Blessed Warrior'],
      Ranger:  ['Druidic Warrior'],
    },
    desc: {
      'Archery':              '+2 to attack rolls with Ranged weapons.',
      'Blind Fighting':       'You have Blindsight out to 10 ft.',
      'Defense':              '+1 AC while wearing Light, Medium or Heavy armor.',
      'Dueling':              '+2 damage with a Melee weapon held in one hand, with no other weapon.',
      'Great Weapon Fighting':'Treat any 1 or 2 on a damage die as a 3, with a Melee weapon held in two hands (Two-Handed or Versatile).',
      'Interception':         'Reaction when a creature within 5 ft is hit: reduce the damage by 1d10 + your Proficiency Bonus.',
      'Protection':           'Reaction with a Shield: Disadvantage on the triggering attack against a creature within 5 ft, and on all other attacks against it until the start of your next turn while you stay within 5 ft.',
      'Thrown Weapon Fighting':'+2 damage when you hit with a weapon that has the Thrown property.',
      'Two-Weapon Fighting':  'Add your ability modifier to the damage of the extra attack made with a Light weapon.',
      'Unarmed Fighting':     'Your Unarmed Strike deals 1d6 + STR Bludgeoning damage, or 1d8 with both hands free. Once per turn, deal 1d4 Bludgeoning damage to a creature you have Grappled.',
      'Arcane Warrior':       'You learn two Wizard cantrips; INT, WIS or CHA is your spellcasting ability for them.',
      'Blessed Warrior':      'You learn two Cleric cantrips; Charisma is your spellcasting ability for them. Paladin only — not a feat.',
      'Druidic Warrior':      'You learn two Druid cantrips; Wisdom is your spellcasting ability for them. Ranger only — not a feat.',
    },
  },
  'Additional Fighting Style': { pick: 1, inherit: 'Fighting Style' },

  'Divine Order': {
    pick: 1,
    options: ['Protector','Thaumaturge'],
    desc: {
      'Protector':   'Proficiency with Martial weapons and training with Heavy armor.',
      /* Pas une Expertise : un bonus egal au modificateur de Sagesse. */
      'Thaumaturge': 'One extra Cleric cantrip, and a bonus to your Intelligence (Arcana or Religion) checks equal to your WIS modifier (minimum +1).',
    },
  },

  'Primal Order': {
    pick: 1,
    options: ['Magician','Warden'],
    desc: {
      /* Un sort mineur de DRUIDE, et un bonus aux jets d'Intelligence — pas un
         sort de Nature toujours prepare, qui n'existe pas dans cette option. */
      'Magician': 'One extra Druid cantrip, and a bonus to your Intelligence (Arcana or Nature) checks equal to your WIS modifier (minimum +1).',
      'Warden':   'Proficiency with Martial weapons and training with Medium armor.',
    },
  },

  'Elemental Fury': {
    pick: 1,
    options: ['Primal Strike','Potent Spellcasting'],
    desc: {
      'Primal Strike':       'Your Wild Shape melee attacks count as Magical for resistances.',
      'Potent Spellcasting': 'Add your WIS modifier to the damage of your Druid cantrips.',
    },
  },

  /* « Deft Explorer » n'est plus un choix : ses deux benefices sont cumules
     en 2024, et l'Expertise passe par expertise:1 sur la capacite elle-meme. */

  /* Les paliers 10 et 17 rejouent la meme liste. Sans ces deux entrees, la
     correspondance par nom exact echouait et aucune option n'etait proposee. */
  'Metamagic (2 more)':  { pick: 2, inherit: 'Metamagic' },
  'Metamagic (2 final)': { pick: 2, inherit: 'Metamagic' },

  'Metamagic': {
    pick: 2,
    options: ['Careful','Distant','Empowered','Extended','Heightened','Quickened','Seeking','Subtle','Transmuted','Twinned'],
    desc: {
      'Careful':    'Protect chosen allies from your own spell.',
      'Distant':    'Double the range of a spell.',
      'Empowered':  'Reroll damage dice.',
      'Extended':   'Double the duration.',
      'Heightened': 'One target has Disadvantage on its save.',
      'Quickened':  'Cast with a Bonus Action.',
      'Seeking':    'Reroll a missed spell attack.',
      'Subtle':     'Cast without Verbal or Somatic components.',
      'Transmuted': 'Change the damage type.',
      'Twinned':    'Target a second creature.',
    },
  },
};

const ASI_LEVELS = [4, 8, 12, 16, 19];

/* ── Prérequis de multiclassage (PHB 2024) ──
   Il faut 13 dans chacune des caractéristiques listées, à la fois pour la classe
   qu'on quitte et pour celle qu'on prend. `any: true` = une seule suffit. */
const MULTICLASS_PREREQ = {
  'Artificer':  { abils:['int'] },
  'Barbarian':  { abils:['for'] },
  'Bard':       { abils:['cha'] },
  'Cleric':     { abils:['sag'] },
  'Druid':      { abils:['sag'] },
  'Fighter':    { abils:['for','dex'], any:true },
  'Monk':       { abils:['dex','sag'] },
  'Paladin':    { abils:['for','cha'] },
  'Psion':      { abils:['int'] },
  'Ranger':     { abils:['dex','sag'] },
  'Rogue':      { abils:['dex'] },
  'Sorcerer':   { abils:['cha'] },
  'Warlock':    { abils:['cha'] },
  'Wizard':     { abils:['int'] },
};

/* ════════════════════════════════════════════════════════════
   D&D 2024 BACKGROUNDS (PHB) — chaque background donne :
   +2/+1 (ou +1/+1/+1) réparti sur 3 caractéristiques, un Origin Feat,
   2 compétences, 1 outil et un équipement de départ.
   ════════════════════════════════════════════════════════════ */
const ORIGIN_FEATS = {
  'Alert':            "Add your Proficiency Bonus to Initiative. You can swap your Initiative with a willing ally's.",
  'Crafter':          "Tool proficiency with three Artisan's Tools. 20% discount on nonmagical items. Craft one item from a list during a Long Rest.",
  'Healer':           "As a Utility action, use a Healer's Kit to let a creature spend a Hit Die: heal that die + its CON modifier (minimum 1). Also restores 1 HP on a 0-HP creature.",
  'Lucky':            "You have Luck Points equal to your Proficiency Bonus (regained on Long Rest). Spend one to gain Advantage on a d20 Test, or to impose Disadvantage on an attack against you.",
  'Magic Initiate':   "Learn 2 cantrips and one level-1 spell from a chosen class list (Cleric, Druid or Wizard). Cast the level-1 spell once per Long Rest for free, or with slots.",
  'Musician':         "Proficiency with three Musical Instruments. After a Rest, give Heroic Inspiration to allies equal to your Proficiency Bonus.",
  'Savage Attacker':  "Once per turn when you hit with a weapon, you can reroll the damage dice and use either total.",
  'Skilled':          "Proficiency in any combination of three skills or tools of your choice.",
  'Tavern Brawler':   "Unarmed Strike deals 1d4. Once per turn, deal extra damage equal to your Proficiency Bonus. You can push a creature 5 ft on an Unarmed Strike hit. Proficiency with improvised weapons.",
  'Tough':            "Your Hit Point maximum increases by twice your character level.",
  /* ── Arcana Unleashed (2026) — un don par faction du livre ── */
  'Arcane Artist':    "Learn Minor Illusion. When you cast an Illusion spell, one ally within 30 ft who can see you gains Heroic Inspiration (once per Long Rest).",
  'Arcane Eloquence': "Learn Vicious Mockery. Add 1d4 to your Deception, Intimidation and Persuasion checks.",
  'Arcane Infiltrator':"Learn Friends. You can take the Dodge action as a Bonus Action, a number of times equal to your Proficiency Bonus per Long Rest.",
  'Arcane Omens':     "Learn Guidance. Reaction when you or a creature within 30 ft fails a save: add 1d4 to the roll (PB times per Long Rest).",
  'Arcane Overload':  "Learn Fire Bolt. When an Evocation spell you cast deals damage, add your Proficiency Bonus to one damage roll (once per Long Rest).",
  'Arcane Safeguard': "Learn Resistance, castable as a Bonus Action (PB times per Long Rest). When you take the Help action on an ability check, the ally gains Temp HP equal to your Proficiency Bonus.",
  'Arcane Undertaker':"Learn a Necromancy cantrip from the Cleric or Wizard list. Add 1d4 to History and Medicine checks. Stabilising a creature at 0 HP with the Help action grants you Heroic Inspiration (once per Long Rest).",
  'Familiar Friend':  "You always have Find Familiar prepared and can cast it once per Long Rest without a slot or Material components.",
  'Portal Jumper':    "Resistance to Necrotic, Psychic or Radiant damage (your choice). Spend 15 ft of movement to teleport 15 ft (PB times per Long Rest, once per turn).",
  'Transmuted Anatomy':"+5 ft Speed. Advantage on saves against forced shape-shifting, and a Reaction to add 1d4 to a failed CON save (PB times per Long Rest).",
};
const BACKGROUND_DATA = {
  'Acolyte':      { abilities:['int','sag','cha'], feat:'Magic Initiate',  skills:'Insight, Religion',        skillKeys:['perspicacite','religion'],   tool:"Calligrapher's Supplies" },
  'Artisan':      { abilities:['for','dex','int'], feat:'Crafter',         skills:'Investigation, Persuasion', skillKeys:['investigation','persuasion'], tool:"Artisan's Tools (choice)" },
  'Charlatan':    { abilities:['dex','con','cha'], feat:'Skilled',         skills:'Deception, Sleight of Hand', skillKeys:['duperie','prestidig'],     tool:"Forgery Kit" },
  'Criminal':     { abilities:['dex','con','int'], feat:'Alert',           skills:'Sleight of Hand, Stealth',  skillKeys:['prestidig','discret'],       tool:"Thieves' Tools" },
  'Entertainer':  { abilities:['for','dex','cha'], feat:'Musician',        skills:'Acrobatics, Performance',   skillKeys:['acrobaties','performance'],  tool:"Musical Instrument (choice)" },
  'Farmer':       { abilities:['for','con','sag'], feat:'Tough',           skills:'Animal Handling, Nature',   skillKeys:['animaux','nature'],          tool:"Carpenter's Tools" },
  'Guard':        { abilities:['for','int','sag'], feat:'Alert',           skills:'Athletics, Perception',     skillKeys:['athletisme','perception'],   tool:"Gaming Set (choice)" },
  'Guide':        { abilities:['dex','con','sag'], feat:'Magic Initiate',  skills:'Stealth, Survival',         skillKeys:['discret','survie'],          tool:"Cartographer's Tools" },
  'Hermit':       { abilities:['con','sag','cha'], feat:'Healer',          skills:'Medicine, Religion',        skillKeys:['medecine','religion'],       tool:"Herbalism Kit" },
  'Merchant':     { abilities:['con','int','cha'], feat:'Lucky',           skills:'Animal Handling, Persuasion', skillKeys:['animaux','persuasion'],    tool:"Navigator's Tools" },
  'Noble':        { abilities:['for','int','cha'], feat:'Skilled',         skills:'History, Persuasion',       skillKeys:['histoire','persuasion'],     tool:"Gaming Set (choice)" },
  'Sage':         { abilities:['con','int','sag'], feat:'Magic Initiate',  skills:'Arcana, History',           skillKeys:['arcanes','histoire'],        tool:"Calligrapher's Supplies" },
  'Sailor':       { abilities:['for','dex','sag'], feat:'Tavern Brawler',  skills:'Acrobatics, Perception',    skillKeys:['acrobaties','perception'],   tool:"Navigator's Tools" },
  'Scribe':       { abilities:['dex','int','sag'], feat:'Skilled',         skills:'Investigation, Perception', skillKeys:['investigation','perception'], tool:"Calligrapher's Supplies" },
  'Soldier':      { abilities:['for','dex','con'], feat:'Savage Attacker', skills:'Athletics, Intimidation',   skillKeys:['athletisme','intimidation'], tool:"Gaming Set (choice)" },
  'Wayfarer':     { abilities:['dex','sag','cha'], feat:'Lucky',           skills:'Insight, Stealth',          skillKeys:['perspicacite','discret'],    tool:"Thieves' Tools" },
  /* ── Arcana Unleashed (2026) — chacun rattache a une faction du livre ── */
  'Agent of the Ninth Quill':     { abilities:['for','int','cha'], feat:'Arcane Infiltrator',  skills:'Arcana, Sleight of Hand',   skillKeys:['arcanes','prestidig'],        tool:"Thieves' Tools" },
  'Bejeweled Conclave Spy':       { abilities:['dex','sag','cha'], feat:'Arcane Eloquence',    skills:'Deception, Perception',     skillKeys:['duperie','perception'],       tool:'Disguise Kit' },
  'Cosmic Dawn Experiment':       { abilities:['for','dex','con'], feat:'Transmuted Anatomy',  skills:'Athletics, Survival',       skillKeys:['athletisme','survie'],        tool:"Artisan's Tools (choice)" },
  'Covenant of the Grave Recruit':{ abilities:['for','int','sag'], feat:'Arcane Undertaker',   skills:'History, Medicine',         skillKeys:['histoire','medecine'],        tool:'Herbalism Kit' },
  'Crucible Storm Chaser':        { abilities:['for','con','int'], feat:'Arcane Overload',     skills:'Athletics, Nature',         skillKeys:['athletisme','nature'],        tool:"Glassblower's Tools" },
  'Familiar Trainer':             { abilities:['con','int','sag'], feat:'Familiar Friend',     skills:'Animal Handling, Arcana',   skillKeys:['animaux','arcanes'],          tool:'Gaming Set (choice)' },
  'Horizon Weaver Initiate':      { abilities:['dex','con','sag'], feat:'Portal Jumper',       skills:'Acrobatics, Survival',      skillKeys:['acrobaties','survie'],        tool:"Weaver's Tools" },
  'Phantasmic Circus Trouper':    { abilities:['dex','con','cha'], feat:'Arcane Artist',       skills:'Deception, Performance',    skillKeys:['duperie','performance'],      tool:'Disguise Kit' },
  'Seer Apprentice':              { abilities:['int','sag','cha'], feat:'Arcane Omens',        skills:'History, Insight',          skillKeys:['histoire','perspicacite'],    tool:"Navigator's Tools" },
  'Ward of the Sheltering Hands': { abilities:['con','sag','cha'], feat:'Arcane Safeguard',    skills:'Insight, Medicine',         skillKeys:['perspicacite','medecine'],    tool:"Cook's Utensils" },
};

/* ════════════════════════════════════════════════════════════
   D&D 2024 SPECIES DATA (PHB)
   traits: { niveau: [{name, desc}] } — lineages: { nom: {niveau: [...]}}
   ════════════════════════════════════════════════════════════ */
const SPECIES_DATA = {

'Aasimar': {
  type: 'Humanoid', size: 'Medium or Small', speed: 30,
  traits: {
    1: [
      { name:'Celestial Resistance', desc:'You have Resistance to Necrotic and Radiant damage.' },
      { name:'Darkvision', desc:'Darkvision 60 ft.' },
      { name:'Healing Hands', desc:'Magic action: touch a creature — it regains HP equal to your Proficiency Bonus d4s. 1/Long Rest.' },
      { name:'Light Bearer', desc:'You know the Light cantrip (Charisma is your spellcasting ability for it).' }
    ],
    3: [
      { name:'Celestial Revelation', desc:'Bonus action (1/Long Rest, 1 minute): choose Heavenly Wings (fly speed = your speed), Inner Radiance (bright light 10 ft, Radiant damage = PB to creatures within 10 ft at end of your turn), or Necrotic Shroud (creatures within 10 ft make CHA save or Frightened until end of your next turn). While active, once per turn deal extra Radiant/Necrotic damage = your Proficiency Bonus.' }
    ]
  }
},

'Dragonborn': {
  type: 'Humanoid', size: 'Medium', speed: 30,
  traits: {
    1: [
      { name:'Draconic Ancestry', desc:'Choose a dragon type (Black/Copper: Acid · Blue/Bronze: Lightning · Brass/Gold/Red: Fire · Green: Poison · Silver/White: Cold). It sets your Breath Weapon and Damage Resistance.' },
      { name:'Breath Weapon', desc:'Replace one attack of the Attack action: exhale a 15-ft cone or 30×5-ft line (your choice). DEX save DC 8 + CON mod + PB; 1d10 damage of your ancestry type, half on success. Damage : 2d10 au niv.5, 3d10 au niv.11, 4d10 au niv.17. Uses = Proficiency Bonus / Long Rest.' },
      { name:'Damage Resistance', desc:'Resistance to the damage type of your Draconic Ancestry.' },
      { name:'Darkvision', desc:'Darkvision 60 ft.' }
    ],
    5: [
      { name:'Draconic Flight', desc:'Bonus action (1/Long Rest): spectral wings for 10 minutes — fly speed equal to your speed.' }
    ]
  }
},

'Dwarf': {
  type: 'Humanoid', size: 'Medium', speed: 30,
  // effects : valeurs mécaniques applicables en un clic à la fiche
  effects: { hpPerLevel: 1 },
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 120 ft.' },
      { name:'Dwarven Resilience', desc:'Resistance to Poison damage, and Advantage on saves to avoid or end the Poisoned condition.' },
      { name:'Dwarven Toughness', desc:'+1 HP maximum per level.' },
      { name:'Stonecunning', desc:'Bonus action (PB/Long Rest): Tremorsense 60 ft for 10 minutes while on a stone surface.' }
    ]
  }
},

'Elf': {
  type: 'Humanoid', size: 'Medium', speed: 30,
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 60 ft.' },
      { name:'Fey Ancestry', desc:'Advantage on saves to avoid or end the Charmed condition.' },
      { name:'Keen Senses', desc:'Proficiency in Insight, Perception, or Survival (choose one).' },
      { name:'Trance', desc:"You don't need sleep: 4 hours of trance give the benefits of a Long Rest." }
    ]
  },
  lineages: {
    'Drow': {
      1: [{ name:'Drow Lineage', desc:'Darkvision 120 ft. You know the Dancing Lights cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Faerie Fire', desc:'You always have Faerie Fire prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Darkness', desc:'You always have Darkness prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    },
    'High Elf': {
      1: [{ name:'High Elf Lineage', desc:'You know the Prestidigitation cantrip; on Long Rest you can swap it for another Wizard cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Detect Magic', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Misty Step', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    },
    'Wood Elf': {
      effects: { speed: 35 },
      1: [{ name:'Wood Elf Lineage', desc:'Speed 35 ft. You know the Druidcraft cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Longstrider', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Pass without Trace', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    }
  }
},

'Gnome': {
  type: 'Humanoid', size: 'Small', speed: 30,
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 60 ft.' },
      { name:'Gnomish Cunning', desc:'Advantage on Intelligence, Wisdom, and Charisma saving throws.' }
    ]
  },
  lineages: {
    'Forest Gnome': {
      1: [{ name:'Forest Gnome Lineage', desc:'You know the Minor Illusion cantrip. You always have Speak with Animals prepared — cast PB/Long Rest without a slot. Spellcasting: INT, WIS or CHA (choose).' }]
    },
    'Rock Gnome': {
      1: [{ name:'Rock Gnome Lineage', desc:'You know Mending and Prestidigitation. You can spend 10 min to create a Tiny clockwork device (up to 3) reproducing a Prestidigitation effect. Spellcasting: INT, WIS or CHA (choose).' }]
    }
  }
},

'Goliath': {
  type: 'Humanoid', size: 'Medium', speed: 35,
  effects: { speed: 35 },
  traits: {
    1: [
      { name:'Giant Ancestry', desc:"Choose a boon usable PB/Long Rest: Cloud's Jaunt (bonus action: teleport 30 ft) · Fire's Burn (+1d10 Fire on a hit) · Frost's Chill (+1d6 Cold + speed −10 on a hit) · Hill's Tumble (knock Prone a Large- creature you hit) · Stone's Endurance (reaction: reduce damage by 1d12 + CON) · Storm's Thunder (reaction: 1d8 Thunder to an attacker within 60 ft)." },
      { name:'Powerful Build', desc:'Advantage on saves to end the Grappled condition; you count as one size larger for carrying capacity.' }
    ],
    5: [
      { name:'Large Form', desc:'Bonus action (1/Long Rest, 10 min): become Large — Advantage on Strength checks, speed +10 ft.' }
    ]
  }
},

'Halfling': {
  type: 'Humanoid', size: 'Small', speed: 30,
  traits: {
    1: [
      { name:'Brave', desc:'Advantage on saves to avoid or end the Frightened condition.' },
      { name:'Halfling Nimbleness', desc:'You can move through the space of any creature larger than you (not a stopping place).' },
      { name:'Luck', desc:'When you roll a 1 on a d20 Test, reroll — you must use the new roll.' },
      { name:'Naturally Stealthy', desc:'You can take the Hide action even when only obscured by a creature one size larger than you.' }
    ]
  }
},

'Human': {
  type: 'Humanoid', size: 'Medium or Small', speed: 30,
  traits: {
    1: [
      { name:'Resourceful', desc:'You gain Heroic Inspiration whenever you finish a Long Rest.' },
      { name:'Skillful', desc:'Proficiency in one skill of your choice.' },
      { name:'Versatile', desc:'You gain an Origin feat of your choice (Skilled by default).' }
    ]
  }
},

/* Kalashtar — Eberron: Forge of the Artificer (2025).
   Seule espèce non-Humanoïde de la liste : Aberration, donc hors de portée des
   sorts qui ciblent les Humanoïdes (Charme-personne, Immobilisation de personne…). */
'Kalashtar': {
  type: 'Aberration', size: 'Medium', speed: 30,
  effects: { telepathyPerLevel: 10 },
  traits: {
    1: [
      { name:'Dual Mind', desc:'You have Advantage on Wisdom and Charisma saving throws.' },
      { name:'Mental Discipline', desc:'You have Resistance to Psychic damage.' },
      { name:'Mind Link', desc:"You have telepathy with a range in feet equal to 10 times your level. When you're using this trait to speak telepathically to a creature, you can take a Magic action to give that creature the ability to speak telepathically with you for 1 hour or until you take another Magic action to end this effect." },
      { name:'Severed from Dreams', desc:'You can\'t be the target of the Dream spell. In addition, when you finish a Long Rest, you gain proficiency in one skill of your choice. This proficiency lasts until you finish another Long Rest.' }
    ]
  }
},

'Orc': {
  type: 'Humanoid', size: 'Medium', speed: 30,
  traits: {
    1: [
      { name:'Adrenaline Rush', desc:'Bonus action: take the Dash action and gain Temp HP = your Proficiency Bonus. Uses = PB / Short or Long Rest.' },
      { name:'Darkvision', desc:'Darkvision 120 ft.' },
      { name:'Relentless Endurance', desc:'When reduced to 0 HP without being killed outright, drop to 1 HP instead. 1/Long Rest.' }
    ]
  }
},

'Tiefling': {
  type: 'Humanoid', size: 'Medium or Small', speed: 30,
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 60 ft.' },
      { name:'Otherworldly Presence', desc:'You know the Thaumaturgy cantrip (same spellcasting ability as your Fiendish Legacy).' }
    ]
  },
  lineages: {
    'Abyssal': {
      1: [{ name:'Abyssal Legacy', desc:'Resistance to Poison damage. You know the Poison Spray cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Ray of Sickness', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Hold Person', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    },
    'Chthonic': {
      1: [{ name:'Chthonic Legacy', desc:'Resistance to Necrotic damage. You know the Chill Touch cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'False Life', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Ray of Enfeeblement', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    },
    'Infernal': {
      1: [{ name:'Infernal Legacy', desc:'Resistance to Fire damage. You know the Fire Bolt cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Hellish Rebuke', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Darkness', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    }
  }
},

/* ════════════════════════════════════════════════════════════
   ESPÈCES UNEARTHED ARCANA — matériel de playtest, pas encore officiel.
   Sources : UA « Underdark Options 2 » (10 septembre 2026) pour cinq d'entre
   elles, playtest du PHB (2022) pour l'Ardling.

   Le drapeau `ua: true` suffit : nomUA() préfixe « (UA) » partout où le nom
   est proposé au joueur. La clé, elle, reste le nom nu — c'est ce qui est
   enregistré dans la fiche et ce qui sert d'index. Le jour où WotC publie
   l'espèce pour de bon, on retire le drapeau et aucune fiche ne bouge.

   Groupées en fin de liste pour ne pas hacher la liste officielle.
   ════════════════════════════════════════════════════════════ */

/* L'Ardling est le cas à part du lot : il a été joué en playtest en 2022,
   puis écarté du PHB 2024 faute d'accueil favorable, et n'est jamais reparu.
   Il n'est donc pas « à venir » comme les cinq autres — il est en suspens.
   Gardé quand même : c'est du contenu UA jamais publié, et il coûte une clé. */
'Ardling': {
  ua: true, uaSource: "Player's Handbook Playtest 3 (Dec. 2022) — dropped before the 2024 PHB",
  type: 'Humanoid', size: 'Medium or Small', speed: 30,
  traits: {
    1: [
      { name:'Animal Ancestry', desc:'Choose one celestial ancestry — Climber (bear, cat, lizard, squirrel): Climb Speed equal to your Speed, and once per turn you can add your Proficiency Bonus to the damage of an Unarmed Strike · Flyer (bat, eagle, owl, raven): when you fall at least 10 ft you can use your Reaction to glide down and take no falling damage, and you have Advantage on the check of the Jump action · Racer (deer, dog, horse, triceratops): when you take the Dash action, your Speed increases by ten times your Proficiency Bonus for that action · Swimmer (crocodile, dolphin, frog, shark): you can hold your breath for an hour, you have a Swim Speed equal to your Speed, and you have Resistance to Cold damage.' },
      { name:'Divine Magic', desc:'You know the Thaumaturgy cantrip; on a Long Rest you can swap it for another Cleric cantrip. Spellcasting: INT, WIS or CHA (choose when you pick this species).' },
      { name:'Keen Senses', desc:'You have proficiency in the Perception skill.' }
    ]
  }
},

'Deep Imaskari': {
  ua: true, uaSource: 'Underdark Options 2 (Sept. 2026)',
  type: 'Humanoid', size: 'Medium or Small', speed: 30,
  traits: {
    1: [
      { name:'Photoresistant', desc:'You have Resistance to Radiant damage.' },
      { name:'Resourceful', desc:'You gain Heroic Inspiration whenever you finish a Long Rest.' },
      { name:'Unluminescent', desc:'Action: the crystals in your skin glow with Unlight — you shed Bright Light in a 5-ft radius until you take an action to stop it. They go dark if you die or have the Unconscious condition.' }
    ],
    3: [
      { name:'Aura of Unlight', desc:'Bonus action (1/Long Rest, 1 minute): Bright Light in a 10-ft Emanation. Choose one effect each time you create it — Abjuring Unlight: you and your allies inside gain a bonus to AC equal to half your Proficiency Bonus (round down) · Brilliant Unlight: a creature that is not your ally and starts its turn inside makes a CON save (DC 8 + CHA mod + PB) or is Blinded until the end of your next turn · Corrupting Unlight: you can change the damage of your attacks and spells to Radiant, and roll one unexpended Hit Point Die to add that much extra Radiant damage (the die is spent).' }
    ]
  }
},

'Drider': {
  ua: true, uaSource: 'Underdark Options 2 (Sept. 2026)',
  type: 'Monstrosity', size: 'Medium', speed: 30,
  traits: {
    1: [
      { name:'Arachnid Build', desc:'You count as one size larger when determining your carrying capacity.' },
      { name:'Darkvision', desc:'Darkvision 120 ft.' },
      { name:'Spells of the Spider Queen', desc:'You know the Dancing Lights cantrip. Spellcasting: INT, WIS or CHA (choose when you pick this species).' },
      { name:'Spider Climb', desc:'You have a Climb Speed equal to your Speed.' },
      { name:'Web Walker', desc:'You ignore movement restrictions caused by webs, and you know the location of any other creature in contact with the same web.' }
    ],
    3: [
      { name:'Faerie Fire', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' },
      { name:'Spider Climb (improved)', desc:'You can move up, down and across vertical surfaces and along ceilings while leaving your hands free.' }
    ],
    5: [
      { name:'Web', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }
    ]
  }
},

'Illithidkin': {
  ua: true, uaSource: 'Underdark Options 2 (Sept. 2026)',
  type: 'Humanoid', size: 'Medium or Small', speed: 30,
  effects: { telepathy: 30 },
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 120 ft.' },
      { name:'Psionic Aptitude', desc:'You know the Mage Hand cantrip and can make the spectral hand Invisible. Spellcasting: INT, WIS or CHA (choose when you pick this species).' },
      { name:'Sharpened Mind', desc:'You have Resistance to Psychic damage, and Advantage on saving throws to avoid or end the Charmed condition.' },
      { name:'Telepathy', desc:'You have telepathy with a range of 30 ft.' }
    ],
    3: [
      { name:'Command', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }
    ],
    5: [
      { name:'Levitate', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }
    ]
  }
},

/* Kuo-toa : le document de playtest ne lui donne aucune vision dans le noir,
   si surprenant que ce soit pour un peuple des profondeurs. On s'en tient au
   texte publié — c'est le genre de trou qui se comble au prochain jet. */
'Kuo-toa': {
  ua: true, uaSource: 'Underdark Options 2 (Sept. 2026)',
  type: 'Humanoid', size: 'Medium', speed: 30,
  traits: {
    1: [
      { name:'Amphibious', desc:'You can breathe both air and water, and you have a Swim Speed equal to your Speed.' },
      { name:'Deific Manifestation', desc:'You always have Find Familiar prepared and cast it without material components — once per Long Rest without a spell slot. The familiar is a Celestial and can take one of the usual forms or that of a Homunculus or a Myconid Sprout; pick a second form as well, and the familiar gains one action, Reaction or trait from it.' },
      { name:'Slippery', desc:'Advantage on saving throws to avoid or end the Grappled and Restrained conditions.' }
    ]
  }
},

'Myconid': {
  ua: true, uaSource: 'Underdark Options 2 (Sept. 2026)',
  type: 'Plant', size: 'Medium or Small', speed: 30,
  effects: { telepathy: 30 },
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 120 ft.' },
      { name:'Rapport Spores', desc:'Action (1/Long Rest): spores fill a 30-ft Emanation. Creatures in it with an Intelligence score of 2 or higher that are not Constructs, Elementals or Undead gain telepathy within a range of 30 ft for 1 hour.' },
      { name:'Skill Meld', desc:'When you finish a Long Rest you can hold a melding ritual: choose up to six allies within 30 ft (yourself included if you wish) and one skill at least one participant is proficient in. All of them have proficiency in that skill until they finish a Long Rest.' },
      { name:'Telepathy', desc:'You have telepathy with a range of 30 ft.' }
    ]
  }
}
};

const CLASS_DATA = {

'Barbarian': {
  saves: ['for','con'],
  skillChoices: 2, skillList: ['animaux','athletisme','intimidation','nature','perception','survie'],
  armorProf: 'Light, Medium, Shields',
  weaponProf: 'Simple and Martial weapons',
  features: {
    1: [
      { name:'Rage', type:'feature', desc:"Bonus action. Gain advantage on STR checks and saves, resistance to Bludgeoning/Piercing/Slashing damage, and a damage bonus. You can't cast or concentrate spells while raging. Ends if you don't attack or take damage. Uses: 2/Long Rest, scaling with level." },
      { name:'Unarmored Defense', type:'feature', desc:"While wearing no armor, your AC = 10 + DEX modifier + CON modifier. You can use a shield and still gain this benefit." },
      /* MELEE : le Barbare ne choisit pas parmi les armes a distance. */
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 2 Simple or Martial Melee weapons, changing one of them on a Long Rest. You gain more at higher levels." }
    ],
    2: [
      { name:'Danger Sense', type:'feature', desc:"Advantage on DEX saving throws against effects you can see (traps, spells, etc.), as long as you are not Incapacitated." },
      { name:'Reckless Attack', type:'feature', desc:"Before making your first attack on your turn, choose to attack recklessly. You gain advantage on STR-based attacks this turn, but attack rolls against you have advantage until your next turn." }
    ],
    3: [
      { name:'Barbarian Subclass', type:'subclass', desc:"Choose a subclass: Berserker, Wild Heart, World Tree, or Zealot. You gain the first subclass feature." },
      { name:'Primal Knowledge', type:'feature', desc:"Gain proficiency in one skill from the Barbarian list: Athletics, Intimidation, Nature, Perception, or Survival." }
    ],
    4: [
      { name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." },
      { name:'Weapon Mastery (3 weapons)', type:'feature', desc:"You can now use the Mastery property of 3 kinds of weapons." }
    ],
    5: [
      { name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once whenever you take the Attack action on your turn." },
      { name:'Fast Movement', type:'feature', desc:"While not wearing heavy armor, your walking speed increases by 10 feet." }
    ],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Barbarian subclass." }],
    7: [
      { name:'Feral Instinct', type:'feature', desc:"You have advantage on Initiative rolls. If surprised, you can act normally on your first turn after entering your Rage as a Bonus Action." },
      { name:'Instinctive Pounce', type:'feature', desc:"When you enter your Rage, you can move up to half your speed as part of the same Bonus Action." }
    ],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Brutal Strike', type:'feature', desc:"When you use Reckless Attack, you can forgo advantage on one attack to make a Brutal Strike: deal extra 1d10 damage and choose an effect (Forceful Blow: push 15 ft; Hamstring Blow: target speed −15 ft until your next turn)." }],
    10: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Barbarian subclass." },
      { name:'Weapon Mastery (4 weapons)', type:'feature', desc:"You can now use the Mastery property of 4 kinds of weapons." }
    ],
    11: [{ name:'Relentless Rage', type:'feature', desc:"If reduced to 0 HP while Raging, make a DC 10 CON save to drop to 1 HP instead. DC increases by 5 each time you succeed; resets on Long Rest." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Improved Brutal Strike', type:'feature', desc:"Brutal Strike damage increases to 2d10, and you can choose two effects on a Brutal Strike." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Barbarian subclass." }],
    15: [{ name:'Persistent Rage', type:'feature', desc:"Your Rage can only end early if you choose to end it or you fall Unconscious. You no longer need to attack or take damage to maintain it." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Improved Brutal Strike', type:'feature', desc:"Brutal Strike damage increases to 3d10." }],
    18: [{ name:'Indomitable Might', type:'feature', desc:"If your total on a STR check is less than your STR score, use your STR score instead." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Primal Champion', type:'feature', desc:"Your STR score increases by 4 and your CON score increases by 4. Your maximum for those scores is also increased by 4." }]
  }
},

'Bard': {
  saves: ['dex','cha'],
  skillChoices: 3, skillList: ['acrobaties','animaux','arcanes','athletisme','discret','duperie','histoire','intimidation','investigation','medecine','nature','perception','performance','persuasion','prestidig','religion','survie','perspicacite'],
  armorProf: 'Light armor',
  /* « Simple weapons », rien d'autre en 2024 : epee longue, rapiere, epee
     courte et arbalete de poing appartenaient a la liste de 2014. C'est le
     College de la Vaillance qui les rend, au niveau 3. */
  weaponProf: 'Simple weapons',
  toolProf: "Musical Instrument (choice) ×3",
  features: {
    1: [
      { name:'Bardic Inspiration', type:'feature', desc:"Bonus action: give one creature within 60 ft a Bardic Inspiration die (d6). They can roll it and add it to one ability check, attack roll, or saving throw within the next 10 minutes. You can use this CHA modifier times (minimum 1), regaining uses on Long Rest." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Charisma. You know 2 cantrips and prepare 4 spells at level 1 (number set by your class table). Your prepared list is fixed: you may only swap a spell when you gain a level. Magical Secrets at level 10 opens any class's list." }
    ],
    2: [
      { name:'Expertise', type:'feature', desc:"Choose 2 skills you are proficient in. Your proficiency bonus is doubled for any check using those skills." },
      { name:'Jack of All Trades', type:'feature', desc:"Add half your proficiency bonus (rounded down) to ability checks that don't already use your proficiency bonus." }
    ],
    3: [{ name:'Bard Subclass', type:'subclass', desc:"Choose a Bard College: Dance, Glamour, Lore, Valor, or Whispers. You gain the first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Font of Inspiration', type:'feature', desc:"You now regain expended Bardic Inspiration uses when you finish a Short or Long Rest." }],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Bard College." }],
    7: [{ name:'Countercharm', type:'feature', desc:"As a Reaction, start a performance. Until the end of your next turn, you and allies within 30 ft have Advantage on saving throws to avoid or end the Frightened and Charmed conditions." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Expertise', type:'feature', desc:"Choose 2 more skills. Your proficiency bonus is doubled for checks using those skills (4 total)." }],
    10: [
      { name:'Magical Secrets', type:'feature', desc:"You can choose spells from any class's spell list when you learn or swap Bard spells." },
      { name:'Bardic Inspiration — d8', type:'feature', desc:"Your Bardic Inspiration die increases to a d8." }
    ],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Bard College." }],
    15: [{ name:'Bardic Inspiration — d10', type:'feature', desc:"Your Bardic Inspiration die increases to a d10." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [
      { name:'Superior Inspiration', type:'feature', desc:"When you roll Initiative and have no Bardic Inspiration uses, you regain 2 uses." },
      { name:'Bardic Inspiration — d12', type:'feature', desc:"Your Bardic Inspiration die increases to a d12." }
    ],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Words of Creation', type:'feature', desc:"Power Word Heal and Power Word Kill are always prepared for you and don't count against your prepared spells. You can cast each once without expending a spell slot, regaining those casts on a Long Rest." }]
  }
},

'Cleric': {
  saves: ['sag','cha'],
  skillChoices: 2, skillList: ['histoire','perspicacite','medecine','persuasion','religion'],
  armorProf: 'Light, Medium, Shields',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Divine Order', type:'feature', desc:"Choose Protector (proficiency with Martial weapons, Heavy armor) or Thaumaturge (one additional Cleric cantrip, Expertise in Arcana or Religion)." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Wisdom. You know 3 cantrips and prepare spells from the Cleric list — the number is set by your class table (4 at level 1), not by your WIS modifier. You may swap prepared spells on a Long Rest." }
    ],
    2: [{ name:'Channel Divinity', type:'feature', desc:"You gain Channel Divinity (2/Long Rest). Turn Undead: action, each Undead within 30 ft makes a WIS save or is Turned for 1 minute. Your subclass grants additional Channel Divinity options." }],
    3: [{ name:'Cleric Subclass', type:'subclass', desc:"Choose a Divine Domain: Life, Light, Trickery, War, Knowledge, Nature, Tempest, or others. You gain the domain spells and first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Smite Undead', type:'feature', desc:"When you use Turn Undead, any Undead that fails its save also takes Radiant damage equal to 2d8 + your WIS modifier." }],
    6: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Divine Domain." },
      { name:'Channel Divinity (3/Long Rest)', type:'feature', desc:"You can now use Channel Divinity 3 times per Long Rest." }
    ],
    7: [{ name:'Blessed Strikes', type:'feature', desc:"Once per turn when you hit a creature with a weapon or deal damage with a Cleric cantrip, you deal an extra 1d8 Radiant damage." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [{ name:'Divine Intervention', type:'feature', desc:"As an action, call on your deity. You can cast any Cleric spell of 5th level or lower without expending a spell slot. After use, you must finish a Long Rest before using it again." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Improved Blessed Strikes', type:'feature', desc:"Blessed Strikes now deals 2d8 extra Radiant damage instead of 1d8." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Divine Domain." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Greater Divine Intervention', type:'feature', desc:"Your Divine Intervention now works automatically — no roll required. In addition, you can cast any Cleric spell without preparing it. You can't use Divine Intervention again until 2d4 days have passed." }]
  }
},

'Druid': {
  saves: ['int','sag'],
  skillChoices: 2, skillList: ['arcanes','animaux','perspicacite','medecine','nature','perception','religion','survie'],
  /* Ni armure intermediaire, ni restriction sur le metal : la phrase de 2014
     sur le metal ne figure plus dans le livre, c'est devenu de la saveur. */
  armorProf: 'Light armor and Shields',
  weaponProf: 'Simple weapons',
  toolProf: "Herbalism Kit",
  features: {
    1: [
      /* Le sort manquait, et le jet n'est pas une Perception. */
      { name:'Druidic', type:'feature', langues:['Druidic'],
        desc:"You know Druidic, the secret language of Druids. Learning it also unlocked the magic of speaking with animals: you always have the Speak with Animals spell prepared. You can leave hidden messages in Druidic — anyone who knows it spots them automatically, others need a DC 15 Intelligence (Investigation) check to notice one and magic to read it." },
      { name:'Primal Order', type:'feature', desc:"Choose Magician (one extra cantrip from any list, Nature spell always prepared per level) or Warden (proficiency with Martial weapons and Medium Armor)." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Wisdom. You know 2 cantrips and prepare spells from the Druid list — the number is set by your class table (4 at level 1). You may swap prepared spells on a Long Rest." },
      { name:'Wild Shape', type:'feature', desc:"Bonus action: transform into a Beast you've seen, CR 1/4 or lower. Lasts 1 hour or until you drop to 0 HP. Regain uses (equal to WIS mod) on Long Rest, or 1 use on Short Rest." }
    ],
    2: [
      { name:'Wild Companion', type:'feature', desc:"You can cast Find Familiar as a Ritual without spell slot or components. The familiar is Fey, not a spirit." }
    ],
    3: [
      { name:'Druid Subclass', type:'subclass', desc:"Choose a Druid Circle: Land, Moon, Sea, Stars, or Wildfire. You gain subclass features that expand your Wild Shape and spellcasting." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Also, Wild Shape now allows CR 1/2 Beasts." }],
    5: [{ name:'Wild Resurgence', type:'feature', desc:"Once per Long Rest: spend a spell slot to regain 1 use of Wild Shape, or use Wild Shape to regain one 1st-level spell slot." }],
    6: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Druid Circle." },
      { name:'Elemental Fury', type:'feature', desc:"Choose Primal Strike (your Wild Shape melee attacks count as Magical for overcoming resistances) or Potent Spellcasting (add your WIS modifier to the damage of Druid cantrips)." }
    ],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Wild Shape now allows CR 1 Beasts." }],
    10: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Druid Circle." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Druid Circle. Wild Shape now allows CR 2 Beasts." }],
    15: [{ name:'Improved Elemental Fury', type:'feature', desc:"The damage from your Elemental Fury choice improves: Primal Strike adds +1d6 Elemental damage; Potent Spellcasting adds WIS modifier twice to cantrip damage." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Beast Spells', type:'feature', desc:"While in Wild Shape, you can cast Druid spells that don't require a free hand for material components. You can perform somatic components in Wild Shape form." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Archdruid', type:'feature', desc:"Your Wild Shape uses are unlimited. Choose Primal Beast (powerful Beast form with enhanced attacks) or Mighty Summoner (summoned creatures gain extra HP and attacks count as Magical)." }]
  }
},

'Fighter': {
  saves: ['for','con'],
  skillChoices: 2, skillList: ['acrobaties','animaux','athletisme','histoire','perspicacite','intimidation','persuasion','perception','survie'],
  armorProf: 'All armor, Shields',
  weaponProf: 'Simple and Martial weapons',
  features: {
    1: [
      { name:'Fighting Style', type:'feature', desc:"Choose a fighting style: Archery (+2 ranged attack rolls), Defense (+1 AC in armor), Dueling (+2 damage with one-handed weapon), Great Weapon Fighting (reroll 1s and 2s on damage), Protection (impose disadvantage on attacker vs ally), or Two-Weapon Fighting (add ability mod to off-hand)." },
      { name:'Second Wind', type:'feature', desc:"Bonus action: regain 1d10 + Fighter level HP. You can use this twice per Short Rest. Also, as a Bonus Action on your turn in combat, you can expend a Second Wind use without healing but to add 1d10 to a failed ability check (Tactical Mind)." },
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 3 kinds of Simple or Martial weapons, swapping your choices on a Long Rest. You gain more at higher levels." }
    ],
    2: [
      { name:'Action Surge', type:'feature', desc:"Once per Short Rest, on your turn you can take one additional Action. This extra action cannot be another Action Surge." },
      { name:'Tactical Mind', type:'feature', desc:"On a failed ability check, you can expend a Second Wind use to add 1d10 to the check. If this causes the check to succeed, you don't regain HP from Second Wind." }
    ],
    3: [{ name:'Fighter Subclass', type:'subclass', desc:"Choose a Martial Archetype: Battle Master, Champion, Eldritch Knight, Psi Warrior, or others. You gain your first subclass feature." }],
    4: [
      { name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." },
      { name:'Weapon Mastery (4 weapons)', type:'feature', desc:"You can now use the Mastery property of 4 kinds of weapons." }
    ],
    5: [{ name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once whenever you take the Attack action on your turn." }],
    6: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    7: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Fighter subclass." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [
      { name:'Indomitable', type:'feature', desc:"When you fail a saving throw, you can reroll it and must use the new result. 1/Long Rest (increases at higher levels)." },
      { name:'Tactical Shift', type:'feature', desc:"Whenever you use Action Surge, you can also move up to your speed and take one Object Interaction without using an action." }
    ],
    10: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Fighter subclass." },
      { name:'Weapon Mastery (5 weapons)', type:'feature', desc:"You can now use the Mastery property of 5 kinds of weapons." }
    ],
    11: [{ name:'Two Extra Attacks', type:'feature', desc:"You can attack three times whenever you take the Attack action on your turn." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Studied Attacks', type:'feature', desc:"When you miss an attack roll, you gain advantage on your next attack roll against the same target before the end of your turn." }],
    14: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    15: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Fighter subclass." }],
    16: [
      { name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." },
      { name:'Weapon Mastery (6 weapons)', type:'feature', desc:"You can now use the Mastery property of 6 kinds of weapons." }
    ],
    17: [
      { name:'Action Surge (2/Short Rest)', type:'feature', desc:"You can now use Action Surge twice per Short Rest." },
      { name:'Indomitable (2/Long Rest)', type:'feature', desc:"You can now use Indomitable twice per Long Rest." }
    ],
    18: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Fighter subclass." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Three Extra Attacks', type:'feature', desc:"You can attack four times whenever you take the Attack action on your turn." }]
  }
},

'Monk': {
  saves: ['for','dex'],
  skillChoices: 2, skillList: ['acrobaties','athletisme','histoire','perspicacite','religion','discret'],
  armorProf: 'None',
  /* Les armes de guerre Legeres, cimeterre compris — pas seulement l'epee
     courte, qui etait la formulation de 2014. */
  weaponProf: 'Simple weapons and Martial weapons that have the Light property',
  toolProf: "Artisan's Tools (choice) or Musical Instrument (choice)",
  features: {
    1: [
      { name:'Martial Arts', type:'feature', desc:"Gain these benefits while unarmored or wearing monk weapons: use DEX for attacks/damage, use the Martial Arts damage die (d6) for unarmed strikes, and make one Unarmed Strike as a Bonus Action after an Attack action." },
      { name:'Unarmored Defense', type:'feature', desc:"While wearing no armor and not using a shield, your AC = 10 + DEX modifier + WIS modifier." }
    ],
    2: [
      { name:"Monk's Focus", type:'feature', desc:"You have Focus Points = your Monk level. Spend them on: Flurry of Blows (2 pts, 2 extra Unarmed Strikes after Attack), Patient Defense (1 pt, Dodge as Bonus Action), Step of the Wind (1 pt, Disengage/Dash as Bonus Action; jump distance doubled)." },
      { name:'Unarmored Movement', type:'feature', desc:"Your speed increases by 10 ft while not wearing armor. This bonus increases at higher levels." },
      { name:'Uncanny Metabolism', type:'feature', desc:"When you roll Initiative and have no Focus Points, regain Focus Points equal to your Proficiency Bonus, and regain HP equal to one Martial Arts die roll." }
    ],
    3: [
      { name:'Deflect Attacks', type:'feature', desc:"Reaction: when hit by an attack, reduce damage by 1d10 + DEX modifier + Monk level. If damage is reduced to 0, you can spend 1 Focus Point to redirect it: make a ranged attack (20/60 ft) using the absorbed energy, dealing the original damage type." },
      { name:'Monk Subclass', type:'subclass', desc:"Choose a Monastic Tradition: Mercy, Open Hand, Shadow, or Four Elements. You gain the first subclass feature." }
    ],
    4: [
      { name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." },
      { name:'Slow Fall', type:'feature', desc:"Reaction: reduce fall damage by 5 × your Monk level." }
    ],
    5: [
      { name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once when you take the Attack action. Martial Arts die increases to d8." },
      { name:'Stunning Strike', type:'feature', desc:"After hitting a creature with a Monk weapon or Unarmed Strike, spend 1 Focus Point to attempt to stun it. Target makes a CON save (DC = 8 + PB + WIS modifier) or is Stunned until the start of your next turn." }
    ],
    6: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Monastic Tradition." },
      { name:'Empowered Strikes', type:'feature', desc:"Your Unarmed Strikes now count as Magical for the purpose of overcoming resistance and immunity." }
    ],
    7: [{ name:'Evasion', type:'feature', desc:"When you are subjected to an effect that allows a DEX save for half damage: success = no damage, failure = half damage. You must not be Incapacitated." }],
    8: [
      { name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." },
      { name:'Self-Restoration', type:'feature', desc:"At the end of your turn, end one effect on yourself: Frightened, Poisoned, or Stunned (free). Spend 1 Focus Point to also end Paralyzed, Poisoned (stronger), or remove disease." }
    ],
    9: [{ name:'Acrobatic Movement', type:'feature', desc:"While not Incapacitated, you can move across vertical surfaces and across liquids on your turn without falling. Martial Arts die increases to d10." }],
    10: [{ name:'Heightened Focus', type:'feature', desc:"Flurry of Blows can now impose effects: Burning (ongoing fire damage), Pushing (move target 15 ft), or Toppling (knock Prone)." }],
    11: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Monastic Tradition." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Deflect Energy', type:'feature', desc:"Deflect Attacks can now be used against all damage types, not just physical weapon attacks. Martial Arts die increases to d10." }],
    14: [{ name:'Disciplined Survivor', type:'feature', desc:"You are proficient in all saving throws. Additionally, when you succeed on a saving throw, you have advantage on the next saving throw you make before the start of your next turn." }],
    15: [{ name:'Perfect Focus', type:'feature', desc:"When you roll Initiative and have fewer than 4 Focus Points remaining, you regain points up to 4." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Monastic Tradition. Martial Arts die increases to d12." }],
    18: [{ name:'Superior Defense', type:'feature', desc:"When you spend a Focus Point, you gain resistance to all damage except Force until the start of your next turn." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Body and Mind', type:'feature', desc:"Your DEX score increases by 4 and your WIS score increases by 4. Your maximum for those scores is also increased by 4." }]
  }
},

'Paladin': {
  saves: ['sag','cha'],
  skillChoices: 2, skillList: ['athletisme','perspicacite','intimidation','medecine','persuasion','religion'],
  armorProf: 'All armor, Shields',
  weaponProf: 'Simple and Martial weapons',
  features: {
    1: [
      { name:'Lay on Hands', type:'feature', desc:"You have a pool of HP = 5 × your Paladin level. As a Bonus Action, restore HP to a creature you touch (any amount from your pool), or expend 5 HP to cure one disease or poison." },
      { name:'Spellcasting', type:'feature', desc:"You are a half-caster using Charisma, from level 1. No cantrips. The number of prepared spells is set by your class table (2 at level 1). You may swap prepared spells on a Long Rest." },
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 2 weapons. You can swap choices on Long Rest." }
    ],
    2: [
      { name:'Fighting Style', type:'feature', desc:"Choose a fighting style: Defense, Dueling, Great Weapon Fighting, or Protection. Blessed Warrior grants two Cleric cantrips." },
      { name:"Paladin's Smite", type:'feature', desc:"When you hit a creature with a melee or thrown weapon, you can expend a spell slot (no action required) to deal extra Radiant damage: 2d8 + 1d8 per slot level above 1st. Extra 1d8 vs Undead/Fiends. This is not a spell — no concentration. 1/turn." }
    ],
    3: [
      { name:'Channel Divinity', type:'feature', desc:"Use Channel Divinity 2/Short Rest. Sacred Weapon: bonus action, weapon sheds bright light 20 ft and dim 20 ft more, add CHA modifier to attack rolls for 1 minute. Your subclass grants additional options." },
      { name:'Paladin Subclass', type:'subclass', desc:"Swear your sacred oath: Ancients, Devotion, Glory, or Vengeance. You gain Oath Spells (always prepared) and the first subclass feature." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [
      { name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once whenever you take the Attack action." },
      { name:'Faithful Steed', type:'feature', desc:"Find Steed is always prepared for you. You can cast it as a Ritual without expending a spell slot." }
    ],
    6: [{ name:'Aura of Protection', type:'feature', desc:"While conscious, you and friendly creatures within 10 ft add your CHA modifier (minimum +1) to all saving throws." }],
    7: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your sacred Oath." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Abjure Foes', type:'feature', desc:"As an action, use Channel Divinity. Up to CHA modifier creatures within 60 ft must make a WIS save or become Frightened and have their speed reduced to 0 for 1 minute. Affected creatures repeat the save each turn." }],
    10: [{ name:'Aura of Courage', type:'feature', desc:"While conscious, you and friendly creatures within 10 ft cannot be Frightened." }],
    11: [{ name:'Radiant Strikes', type:'feature', desc:"Your weapon attacks (melee and Unarmed Strikes) deal an extra 1d8 Radiant damage on hit." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Restoring Touch', type:'feature', desc:"When you use Lay on Hands, you can also remove one condition affecting the target: Blinded, Deafened, Frightened, Paralyzed, Poisoned, or Stunned." }],
    15: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your sacred Oath." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Aura Expansion', type:'feature', desc:"Your Aura of Protection and Aura of Courage now extend to 30 ft radius instead of 10 ft." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Holy Nimbus', type:'feature', desc:"As an action: aura 10 ft emits bright light 10 ft and dim 10 ft more. Enemies starting their turn in the aura take 10 Radiant damage. You have advantage on saving throws against spells cast by Fiends and Undead. 1/Long Rest." }]
  }
},

/* ── Psion — Unearthed Arcana (matériel de playtest, non officiel) ──
   Aligné sur « Psion Update » (2 octobre 2025), qui remplace la version de
   mai 2025 : les Modes Psioniques disparaissent, les Disciplines arrivent
   plus tôt mais une à la fois, Réserves Psioniques est neuve, et les sorts
   mineurs se gagnent aux niveaux 4 et 10 au lieu de 10 et 14. */
'Psion': {
  ua: true, uaSource: 'Psion Update (Oct. 2025)',
  saves: ['int','sag'],
  skillChoices: 2, skillList: ['arcanes','perspicacite','intimidation','investigation','medecine','perception','persuasion'],
  armorProf: 'None',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Psionic Power', type:'feature', desc:"Psionic Energy Dice: <strong>4d6</strong> at level 1, 6d8 at 5, 8d8 at 9, 8d10 at 11, 10d10 at 13, 12d12 at 17. Regain one on a Short Rest, all on a Long Rest. Save DC = your spell save DC. Two powers: <em>Telekinetic Propel</em> (bonus action — a Large or smaller creature within 30 ft makes a STR save or is moved 5 ft straight toward or away from you; you may instead roll a Psionic Energy Die and move it 5 ft × the roll, and the die is expended only if the save fails). <em>Telepathic Connection</em> (you have telepathy 30 ft; as a bonus action roll a die to extend the range by 10 ft × the roll for 1 hour — the first use after each Long Rest doesn't expend the die)." },
      { name:'Spellcasting', type:'feature', desc:"Full spellcaster using Intelligence. You know 2 Psion cantrips (3 at level 4, 4 at level 10) and prepare Psion spells from your class table (4 at level 1). You may swap one prepared spell each time you gain a level. <em>Psionic Spellcasting</em>: your Psion spells need no Verbal or Material component, except Materials that are consumed or have a listed cost." },
      { name:'Subtle Telekinesis', type:'feature', desc:"You know Mage Hand. You can cast it without Somatic components and make the spectral hand Invisible." }
    ],
    2: [
      { name:'Psionic Discipline', type:'feature', desc:"You gain <strong>2</strong> disciplines fuelled by your Psionic Energy Dice — Biofeedback, Bolstering Precognition, Destructive Thoughts, Devilish Tongue, Expanded Awareness, Id Insinuation, Inerrant Aim, Observant Mind, Psionic Backlash, Psionic Guards, Sharpened Mind. One discipline per turn, once per turn (Psionic Guards and Sharpened Mind let you use another the same turn). You gain one more at levels 5, 10, 13 and 17, and can swap one each time you gain a level." }
    ],
    3: [{ name:'Psion Subclass', type:'subclass', desc:"Choose a subclass: Metamorph, Psi Warper, Psykinetic, or Telepath." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [
      { name:'Psionic Discipline', type:'feature', desc:"You learn one additional Psionic Discipline." },
      { name:'Psionic Restoration', type:'feature', desc:"A meditation of 1 minute restores your expended Psionic Energy Dice. Once per Long Rest." }
    ],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Psion subclass." }],
    7: [{ name:'Psionic Surge', type:'feature', desc:"After you roll one or more Psionic Energy Dice, you can expend one Hit Point Die and treat any roll of 1, 2 or 3 on those dice as a 4." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [
      { name:'Psionic Discipline', type:'feature', desc:"You learn one additional Psionic Discipline." },
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Psion subclass." }
    ],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Psionic Discipline', type:'feature', desc:"You learn one additional Psionic Discipline." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Psion subclass." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Psionic Discipline', type:'feature', desc:"You learn one additional Psionic Discipline." }],
    18: [{ name:'Psionic Reserves', type:'feature', desc:"When you roll Initiative, you regain expended Psionic Energy Dice until you have four, if you have fewer than that." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice. Boon of Energy Resistance is recommended." }],
    20: [{ name:'Enkindled Life Force', type:'feature', desc:"Once per turn, when you roll one or more Psionic Energy Dice for a Psion feature or Discipline, you can expend one or two Hit Point Dice. For each one, roll an additional Psionic Energy Die and add it to the total — those extra dice are not expended." }]
  }
},

'Ranger': {
  saves: ['for','dex'],
  skillChoices: 3, skillList: ['animaux','athletisme','perspicacite','investigation','nature','perception','discret','survie'],
  armorProf: 'Light, Medium, Shields',
  weaponProf: 'Simple and Martial weapons',
  features: {
    1: [
      { name:'Favored Enemy', type:'feature', desc:"Hunter's Mark is always prepared for you. You can cast it without expending a spell slot a number of times equal to your WIS modifier (minimum 1)/Long Rest." },
      { name:'Spellcasting', type:'feature', desc:"You are a half-caster using Wisdom, from level 1 (a 2024 change — spellcasting no longer waits for level 2). No cantrips. Prepared spells are set by your class table (2 at level 1) and can only be swapped when you gain a level." },
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 2 weapons. You can swap choices on Long Rest." }
    ],
    2: [
      /* Deux benefices cumules, pas un choix : « you gain the following
         benefits », au pluriel. « Canny » etait la formulation de 2014.
         expertise:1 dit au monteur de niveau combien de competences faire
         choisir — la capacite ne s'appelle pas « Expertise », elle en accorde
         une quand meme. */
      { name:'Deft Explorer', type:'feature', expertise:1, desc:"Two benefits: Expertise in one skill you are proficient in and lack Expertise in, and two languages of your choice." },
      { name:'Fighting Style', type:'feature', desc:"Choose a fighting style: Archery, Defense, Druidic Warrior (2 Druid cantrips), or Two-Weapon Fighting." }
    ],
    3: [{ name:'Ranger Subclass', type:'subclass', desc:"Choose a Ranger Archetype: Beast Master, Fey Wanderer, Gloom Stalker, or Hunter. You gain subclass features." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once whenever you take the Attack action." }],
    6: [{ name:'Roving', type:'feature', desc:"Your walking speed increases by 10 ft. You gain a Climb speed equal to your walking speed and a Swim speed equal to your walking speed." }],
    7: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Ranger Archetype." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Expertise', type:'feature', desc:"Double your proficiency bonus in 2 more skills (3 total, with the one from Deft Explorer)." }],
    10: [{ name:'Tireless', type:'feature', desc:"As an action, give yourself temporary HP equal to 1d8 + WIS modifier. Use this WIS modifier times/Long Rest. On Short Rest, reduce your exhaustion level by 1." }],
    11: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Ranger Archetype." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Relentless Hunter', type:'feature', desc:"Hunter's Mark no longer requires concentration from you." }],
    14: [{ name:"Nature's Veil", type:'feature', desc:"Bonus action: you become Invisible until the start of your next turn. You can use this WIS modifier times/Long Rest." }],
    15: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Ranger Archetype." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Precise Hunter', type:'feature', desc:"You have advantage on attack rolls against creatures marked by Hunter's Mark." }],
    18: [{ name:'Feral Senses', type:'feature', desc:"You are aware of Invisible creatures within 30 ft of you, provided you aren't Blinded or Deafened. You also don't need to see a creature to avoid disadvantage on attack rolls against it." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Foe Slayer', type:'feature', desc:"Hunter's Mark deals extra damage equal to your WIS modifier (instead of 1d6), and when it ends it no longer requires concentration." }]
  }
},

'Rogue': {
  saves: ['dex','int'],
  skillChoices: 4, skillList: ['acrobaties','athletisme','duperie','perspicacite','intimidation','investigation','perception','persuasion','prestidig','discret'],
  armorProf: 'Light armor',
  /* La maitrise est conditionnelle en 2024 : les armes de guerre Finesse ou
     Legeres, pas toutes. Le Roublard gagne la rapiere, le cimeterre, le fouet
     et l'arbalete de poing, et perd l'epee longue. isProficientWith lit cette
     forme — sans quoi le mot « Martial » lui ouvrirait l'epee a deux mains. */
  weaponProf: 'Simple weapons and Martial weapons that have the Finesse or Light property',
  toolProf: "Thieves' Tools",
  features: {
    1: [
      { name:'Expertise', type:'feature', desc:"Choose 2 skills you are proficient in. Your proficiency bonus is doubled for those skills." },
      { name:'Sneak Attack', type:'feature', desc:"Once per turn, deal 1d6 extra damage to one creature you hit with a Finesse or ranged weapon attack if you have advantage, or if an ally is adjacent to the target. Scales by 1d6 every odd level." },
      /* Deux langues, pas une : l'argot, et une autre « from the language
         tables in Chapter 2 » — au pluriel, donc la table rare est ouverte.
         C'est l'aptitude qui autorise ce que l'origine, elle, interdit. */
      { name:"Thieves' Cant", type:'feature',
        langues:["Thieves' Cant"], langueChoix:{ nb:1, tables:['standard','rare'] },
        desc:"You know Thieves' Cant, a secret mix of slang and signals used by criminals, plus one other language of your choice from either language table. You can hide messages in conversation that only other Cant speakers recognise." },
      /* « two kinds of weapons of your choice with which you have
         proficiency » : la restriction vient de ses maitrises, pas d'ici. */
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 2 kinds of weapons you are proficient with. You can change your choices on a Long Rest." }
    ],
    2: [{ name:'Cunning Action', type:'feature', desc:"Bonus action: Dash, Disengage, or Hide." }],
    3: [
      { name:'Rogue Subclass', type:'subclass', desc:"Choose a Roguish Archetype: Arcane Trickster, Assassin, Soulknife, Swashbuckler, or Thief. You gain the first subclass feature." },
      { name:'Steady Aim', type:'feature', desc:"Bonus action: give yourself advantage on your next attack roll this turn. Your speed becomes 0 for the rest of the turn if you use this." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [
      { name:'Cunning Strike', type:'feature', desc:"When you deal Sneak Attack damage, replace 1d6 of it to impose one effect: Disarm (target drops held item, STR save), Poison (target is Poisoned 1 min, CON save), Trip (target is Prone, DEX save), or Withdraw (Disengage as part of the attack)." },
      { name:'Uncanny Dodge', type:'feature', desc:"Reaction: when an attacker you can see hits you, halve the attack's damage." }
    ],
    6: [{ name:'Expertise', type:'feature', desc:"Double your proficiency bonus in 2 more skills (4 total)." }],
    7: [
      { name:'Evasion', type:'feature', desc:"When you are subjected to an effect that allows a DEX save for half damage: success = no damage, failure = half damage." },
      { name:'Reliable Talent', type:'feature', desc:"Whenever you make an ability check using a skill or tool you are proficient in, treat any d20 roll of 9 or lower as a 10." }
    ],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Roguish Archetype." }],
    10: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    11: [{ name:'Improved Cunning Strike', type:'feature', desc:"You can now use two Cunning Strike effects on the same Sneak Attack by replacing 2d6 instead of 1d6." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Roguish Archetype." }],
    14: [{ name:'Devious Strikes', type:'feature', desc:"New Cunning Strike options: Daze (target is Incapacitated until end of your next turn, CON save), Knock Out (target is Unconscious for 1 min or until damaged, CON save; works only on Sneak Attacks dealing damage), Obscure (target is Blinded until start of your next turn, DEX save)." }],
    15: [{ name:'Slippery Mind', type:'feature', desc:"You gain proficiency in WIS and CHA saving throws." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Roguish Archetype." }],
    18: [{ name:'Elusive', type:'feature', desc:"No attack roll has advantage against you while you are not Incapacitated." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Stroke of Luck', type:'feature', desc:"If you fail an ability check, you can turn the roll into a 20. If you miss an attack roll, you can turn the miss into a hit. Once used, you regain this ability after a Short or Long Rest." }]
  }
},

'Sorcerer': {
  saves: ['con','cha'],
  skillChoices: 2, skillList: ['arcanes','duperie','perspicacite','intimidation','persuasion','religion'],
  armorProf: 'None',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Innate Sorcery', type:'feature', desc:"Bonus action: unleash your inner power for 1 minute. Your spell save DC increases by 1 and you have advantage on Concentration saving throws. Uses = your Sorcerer level; regain all on Long Rest." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Charisma. You know 4 cantrips and prepare 2 spells at level 1 (number set by your class table). Your prepared list is fixed: you may only swap a spell when you gain a level." }
    ],
    2: [
      { name:'Font of Magic', type:'feature', desc:"You have Sorcery Points = your Sorcerer level. Flexible Casting: create spell slots from Sorcery Points (2 pts = 1st, 3 = 2nd, 4 = 3rd, 5 = 4th, 6 = 5th) or convert spell slots into Sorcery Points (slot level = points gained)." },
      { name:'Metamagic', type:'feature', desc:"Choose 2 Metamagic options: Careful (protect allies from spells), Distant (double range), Empowered (reroll damage dice), Extended (double duration), Heightened (disadvantage on save), Quickened (cast with Bonus Action), Seeking (reroll missed attacks), Subtle (no verbal/somatic components), Transmuted (change damage type), or Twinned (target two creatures)." }
    ],
    3: [{ name:'Sorcerous Origin', type:'subclass', desc:"Choose your magical origin: Aberrant Mind, Clockwork Soul, Draconic Bloodline, Shadow Magic, or Wild Magic. You gain spells and the first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Sorcerous Restoration', type:'feature', desc:"When you roll Initiative and have fewer Sorcery Points than half your Sorcerer level (rounded up), you regain Sorcery Points up to half your Sorcerer level. 1/Long Rest." }],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Sorcerous Origin." }],
    7: [{ name:'Sorcery Incarnate', type:'feature', desc:"While Innate Sorcery is active: you can use one Metamagic option that costs Sorcery Points without expending points once per turn. You can also apply one additional Metamagic option to a spell simultaneously." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [{ name:'Metamagic (2 more)', type:'feature', desc:"You learn 2 more Metamagic options (4 total)." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Sorcerous Origin." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    /* « You gain two more options at Sorcerer level 10 and two more at
       Sorcerer level 17 » : le 17 manquait entierement. Les deux portent un nom
       distinct du « Metamagic » du niveau 2, sans quoi les choix des trois
       paliers s'ecraseraient — la cle de stockage est « classe::nom ». */
    17: [{ name:'Metamagic (2 final)', type:'feature', desc:"You learn 2 more Metamagic options (6 total)." }],
    18: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Sorcerous Origin." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Arcane Apotheosis', type:'feature', desc:"While Innate Sorcery is active, once per turn when you cast a spell, you can apply a Metamagic option to the spell without expending Sorcery Points." }]
  }
},

'Warlock': {
  saves: ['sag','cha'],
  skillChoices: 2, skillList: ['arcanes','duperie','histoire','intimidation','investigation','nature','religion'],
  armorProf: 'Light armor',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Eldritch Invocations', type:'feature', desc:"You gain 1 Eldritch Invocation (gaining more at higher levels). Invocations grant permanent magical abilities such as Agonizing Blast (add CHA to Eldritch Blast damage), Devil's Sight (see in magical darkness), or Mask of Many Faces (cast Disguise Self at will)." },
      { name:'Pact Magic', type:'feature', desc:"You are a spellcaster using Charisma with a unique slot system. You know 2 cantrips and prepare 2 spells at level 1 (number set by your class table); your prepared list can only change when you gain a level. All your slots are the same level and recharge on a Short or Long Rest." }
    ],
    2: [{ name:'Magical Cunning', type:'feature', desc:"As an action (once per Long Rest), if you have expended all your Pact Magic slots, you can regain half your maximum Pact Magic slots (rounded up)." }],
    3: [{ name:'Warlock Subclass', type:'subclass', desc:"Choose your Otherworldly Patron: Archfey, Celestial, Fiend, Great Old One, or others. You gain Patron spells (always prepared) and the first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Contact Patron', type:'feature', desc:"Contact Other Plane is always prepared for you. You can cast it as a ritual targeting your patron without the risk of damage, once per Long Rest without expending a spell slot." }],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Otherworldly Patron." }],
    7: [{ name:'Eldritch Invocations', type:'feature', desc:"You gain additional Eldritch Invocations (total of 5). New invocations become available, including some that require a Pact Boon." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Otherworldly Patron." }],
    11: [{ name:'Mystic Arcanum — 6th Level', type:'feature', desc:"Choose one 6th-level spell from the Warlock spell list. You can cast it once per Long Rest without expending a spell slot." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Mystic Arcanum — 7th Level', type:'feature', desc:"Choose one 7th-level Warlock spell. Cast it once per Long Rest without a spell slot." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Otherworldly Patron." }],
    15: [{ name:'Mystic Arcanum — 8th Level', type:'feature', desc:"Choose one 8th-level Warlock spell. Cast it once per Long Rest without a spell slot." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Mystic Arcanum — 9th Level', type:'feature', desc:"Choose one 9th-level Warlock spell. Cast it once per Long Rest without a spell slot." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Eldritch Master', type:'feature', desc:"By spending 1 minute entreating your patron, you regain all expended Pact Magic slots. 1/Long Rest." }]
  }
},

'Wizard': {
  saves: ['int','sag'],
  /* Sept competences au choix, Nature comprise. Elle manquait. */
  skillChoices: 2, skillList: ['arcanes','histoire','perspicacite','investigation','medecine','nature','religion'],
  armorProf: 'None',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Arcane Recovery', type:'feature', desc:"Once per day when you finish a Short Rest, recover expended spell slots with a total level equal to half your Wizard level (rounded up). Can't recover 6th-level or higher slots this way." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Intelligence. You start with 3 cantrips and a spellbook of 6 level-1 spells. Each day you prepare a subset of your spellbook — the number is set by your class table (4 at level 1). Unprepared spells stay in the book." }
    ],
    2: [
      /* Six competences au choix, pas deux, et aucune langue : le livre dit
         « Arcana, History, Investigation, Medicine, Nature, or Religion ».
         expertise:1 pour la meme raison que Deft Explorer. */
      { name:'Scholar', type:'feature', expertise:1, desc:"Choose one skill you are proficient in among Arcana, History, Investigation, Medicine, Nature or Religion. You gain Expertise in it." }
    ],
    3: [
      { name:'Wizard Subclass', type:'subclass', desc:"Choose an Arcane Tradition: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, or Transmutation. You gain the first subclass feature." },
      { name:'Cantrip Formulas', type:'feature', desc:"When you finish a Long Rest, you can study your spellbook for 1 minute to swap one Wizard cantrip you know for another Wizard cantrip." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Memorize Spell', type:'feature', desc:"When you finish a Long Rest, choose one spell from your spellbook. That spell is always prepared and doesn't count against your number of prepared spells. You can change it each Long Rest." }],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Arcane Tradition." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Arcane Tradition." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Arcane Tradition." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Spell Mastery', type:'feature', desc:"Choose one 1st-level and one 2nd-level Wizard spell. You can cast each of them at their lowest level without expending a spell slot. You can change these spells on a Long Rest (taking 8 hours of study)." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Signature Spells', type:'feature', desc:"Choose two 3rd-level Wizard spells. They are always prepared and don't count against your prepared spells. You can cast each once per turn without expending a spell slot; regain these free casts on a Short or Long Rest." }]
  }
},

'Artificer': {
  saves: ['con','int'],
  skillChoices: 2, skillList: ['arcanes','histoire','investigation','medecine','nature','perception','prestidig'],
  armorProf: 'Light, Medium, Shields',
  weaponProf: 'Simple weapons',
  toolProf: "Thieves' Tools, Tinker's Tools, and one Artisan's Tools (choice)",
  features: {
    1: [
      { name:'Magical Tinkering', type:'feature', desc:"Touch a Tiny nonmagical object and give it a magical property: emit light, emit a recorded message, emit an odor, or display a static visual. You can have INT modifier such objects active at once." },
      { name:'Spellcasting', type:'feature', desc:"You are a spellcaster using Intelligence. You know 2 cantrips and prepare spells from the Artificer list — the number is set by your class table (2 at level 1). You may swap prepared spells on a Long Rest." }
    ],
    2: [
      { name:'Infuse Item', type:'feature', desc:"You gain 4 Infusion recipes (more at higher levels). After a Long Rest, infuse up to 2 items simultaneously (increasing as you level). Infused items count as magic items." },
      { name:'The Right Tool for the Job', type:'feature', desc:"In 1 hour, you can produce any artisan's tool in an unoccupied space using your own tools. It vanishes when you use this feature again." }
    ],
    3: [
      { name:'Artificer Subclass', type:'subclass', desc:"Choose your Artificer Specialist: Alchemist, Armorer, Artillerist, or Battle Smith. You gain Replicate Magic Item infusions and subclass features." },
      { name:'Subclass Feature', type:'subclass', desc:"You gain the first feature of your Artificer Specialist." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    // L'Artificier prend ses capacités de spécialiste aux niveaux 3, 5, 9 et 15 —
    // c'est ce que fait SUBCLASS_DATA. La ligne « Subclass Feature » était au 6.
    5: [
      { name:'Arcane Armament', type:'feature', desc:"You can now attune to up to 4 magic items at once (instead of the normal 3)." },
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Artificer Specialist." }
    ],
    6: [{ name:'Tool Expertise', type:'feature', desc:"Your Proficiency Bonus is doubled for any ability check you make that uses your proficiency with a tool." }],
    7: [{ name:'Flash of Genius', type:'feature', desc:"Reaction: when you or a creature you can see within 30 ft makes an ability check or saving throw, add your INT modifier to the roll. Uses = INT modifier/Long Rest." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Artificer Specialist." }],
    10: [{ name:'Magic Item Adept', type:'feature', desc:"You can attune to up to 5 magic items. If you craft a Common or Uncommon magic item, it takes 1/4 the normal time and costs 1/2 the gold." }],
    11: [{ name:'Spell-Storing Item', type:'feature', desc:"After a Long Rest, cast a 1st or 2nd level Artificer spell (1-action casting time) into an item you hold. A creature holding the item can use an action to cast the spell using your spell save DC. The item holds the spell until you use this feature again." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Magic Item Savant', type:'feature', desc:"Attune to up to 6 magic items. You can ignore class, race, spell, and level requirements for attuning to or using magic items." }],
    15: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Artificer Specialist." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Magic Item Master', type:'feature', desc:"You can now attune to up to 7 magic items at once." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Soul of Artifice', type:'feature', desc:"You gain a +1 bonus to all saving throws for each magic item you are currently attuned to. If reduced to 0 HP, use your Reaction to end one Artificer Infusion and drop to 1 HP instead." }]
  }
}

}; // end CLASS_DATA

/* ════════════════════════════════════════════════════════════
   SUBCLASS DATA  (D&D 2024 PHB)
   Keys match SUBCLASS_DATA[className][subclassName][level]
   ════════════════════════════════════════════════════════════ */
const SUBCLASS_DATA = {

'Barbarian': {
  'Path of the Berserker': {
    3:[{ name:'Frenzy', desc:'When you Rage, you can go into a Frenzy. For the duration, you can make one melee weapon attack as a Bonus Action each turn. When your Rage ends, gain 1 Exhaustion level.' }],
    6:[{ name:'Mindless Rage', desc:'You cannot be Charmed or Frightened while Raging. If you are when you enter Rage, the condition ends.' }],
    10:[{ name:'Retaliation', desc:'When you take damage from a creature within 5 ft, use your Reaction to make one melee weapon attack against that creature.' }],
    14:[{ name:'Intimidating Presence', desc:'Bonus Action: one creature within 30 ft makes a WIS save (DC 8+PB+STR) or becomes Frightened until end of your next turn.' }],
  },
  'Path of the Wild Heart': {
    3:[
      { name:'Animal Speaker', desc:'Cast Beast Sense and Speak with Animals once each per Long Rest without spell slots.' },
      { name:'Rage of the Wilds', desc:'Your Rage adds options: Ape (unarmed strikes deal 1d10 + 1d10 while Raging), Eagle (Fly speed = walk speed while Raging), Wolf (you and allies within 10 ft have advantage on attacks vs Prone).' }
    ],
    6:[{ name:'Aspect of the Wilds', desc:'Choose: Cheetah (+10 ft speed, STR adv.), Elephant (push/topple on Reckless hit), or Owl (Perception adv., dim light = bright, init. adv.).' }],
    10:[{ name:'Nature Speaker', desc:'Cast Commune with Nature once per Long Rest without a spell slot.' }],
    14:[{ name:'Power of the Wilds', desc:'Your Rage form upgrades: Ape (reckless damage), Eagle (full Fly during Rage), or Wolf (Large Beast form).' }],
  },
  'Path of the World Tree': {
    3:[{ name:'Vitality of the Tree', desc:'When you Rage, one creature within 10 ft regains HP equal to PB + CON. Also gain temp HP equal to Barbarian level at start of each Rage turn.' }],
    6:[{ name:'Branches of the Tree', desc:'While Raging, Reaction: when a creature moves within 10 ft, teleport to its side and make one melee weapon attack.' }],
    10:[{ name:'Battering Roots', desc:'Melee attacks deal extra 1d6 Force while Raging. Reckless Attack hits can push 15 ft.' }],
    14:[{ name:'Travel Along the Tree', desc:'When you activate Rage and at end of each Rage turn, teleport up to 60 ft. Once per Rage, bring up to 6 willing creatures.' }],
  },
  'Path of the Zealot': {
    3:[
      { name:'Divine Fury', desc:'While Raging, first hit each turn deals extra Radiant or Necrotic = 1d6 + half Barbarian level.' },
      { name:'Warrior of the Gods', desc:'Spells that solely restore you to life need no material components when targeting you.' }
    ],
    6:[{ name:'Fanatical Focus', desc:'Once per Rage, reroll a failed saving throw (must use new result).' }],
    10:[{ name:'Zealous Presence', desc:'Bonus Action: choose up to 10 creatures within 60 ft. They gain advantage on attacks and saves until start of your next turn. 1/Long Rest.' }],
    14:[{ name:'Rage Beyond Death', desc:'While Raging, 0 HP doesn\'t make you Unconscious. You still make death saves. Rage ends when you reach 0 HP.' }],
  },

  /* ── Unearthed Arcana ── */
  'Path of Lament': {
    3:[
      { name:"Banshee's Wail", desc:'When you activate your Rage or as a Bonus Action while Raging, each creature you choose in a 30-ft Emanation makes a CON save (DC 8 + your CON modifier + PB). On a failure it takes Psychic damage and has the Deafened condition for 1 minute; on a success it takes half damage only. Roll a number of d12s equal to your Rage Damage bonus for the damage. CON modifier uses (minimum of once) per Long Rest — you can also expend a use of Rage (no action) to regain all uses.' }
    ],
    6:[
      { name:'Commune with the Dead', desc:'You can cast Speak with Dead, but only as a Ritual. WIS is your spellcasting ability for it.' },
      { name:'Horrifying Strike', desc:'Once per turn when you hit a creature with a STR-based attack roll while your Rage is active, it must succeed on a WIS save (DC 8 + your CON modifier + PB) or have the Frightened condition until the start of your next turn.' }
    ],
    10:[
      { name:'Otherworldly Anguish', desc:"Your sorrow reaches beyond the realm of the living. <em>Deathly Wail</em>: a target that fails its save against Banshee's Wail and has HP equal to twice your Barbarian level or fewer drops to 0 HP instead of taking the damage. <em>Impenetrable Sorrow</em>: you can't be possessed. <em>Resistance</em>: you have Resistance to Cold and Necrotic damage while your Rage is active." }
    ],
    14:[
      { name:'Sorrow Form', desc:"When you activate your Rage, you can empower yourself with undeath for 1 minute or until you drop to 0 HP; once per Long Rest. <em>Immunities</em>: Immunity to the Charmed and Frightened conditions (those conditions end on you when you transform) and you can't gain Exhaustion levels. <em>Life-Draining Strike</em>: a creature that fails its save against your Horrifying Strike takes 2d10 Necrotic damage, and you regain HP equal to that damage. <em>Undead</em>: your creature type becomes Undead." }
    ],
  },
  'Path of the Spiritual Guardian': {
    3:[
      { name:'Spiritual Protectors', desc:"While your Rage is active, when you hit a creature with a weapon or an Unarmed Strike, spectral warriors mark it with one effect of your choice. <em>Distract</em>: until the start of your next turn it has Disadvantage on attack rolls against anyone but you or another Barbarian with this feature. <em>Protect</em>: the next time it hits a creature other than you before the end of its next turn, that creature has Resistance to the attack's damage. <em>Strike</em>: it takes an extra 1d6 Acid, Cold, Fire, Force, Lightning, or Thunder damage (your choice)." }
    ],
    6:[
      { name:'Spirit Shield', desc:'Reaction while your Rage is active, when another creature you can see within 30 ft takes damage: reduce that damage by the total of a number of d6s equal to your Rage Damage bonus.' }
    ],
    10:[
      { name:'Consult the Spirits', desc:'Cast Augury or Clairvoyance without expending a spell slot or needing Material components, using WIS as your spellcasting ability. This Clairvoyance invisibly summons a guardian spirit at the chosen location instead of creating a sensor. Recharges on a Short or Long Rest.' }
    ],
    14:[
      { name:'Vengeful Spirits', desc:'When you roll 18-20 on a Melee weapon attack roll made as part of the Attack action, you can make one additional attack roll with the same weapon as part of that action. Once used, it recharges at the start of your next turn.' }
    ],
  },
  'Path of the Storm Herald': {
    3:[
      { name:'Storm Aura', desc:"When you activate your Rage, choose <em>Desert</em>, <em>Sea</em>, or <em>Tundra</em> and extend a 10-ft Emanation for the Rage's duration. Its effect triggers when you Rage and again as a Bonus Action on each of your turns; save DC is 8 + PB + CON. <em>Desert</em>: each creature in the aura makes a DEX save or takes Fire damage equal to the total of a number of d4s equal to your Rage Damage bonus — one creature you see automatically succeeds. <em>Sea</em>: hurl lightning at one creature in the aura, DEX save for Lightning damage equal to the total of that many d6s (half on a success). <em>Tundra</em>: one other creature in the aura makes a STR save or subtracts the total of that many d4s from its next damage roll before your next turn." }
    ],
    6:[
      { name:'Storm Soul', desc:"You keep a benefit even when your aura isn't active, based on the environment chosen the last time you Raged. <em>Desert</em>: Fire Resistance, plus a Magic action to touch an unattended flammable object and set it burning. <em>Sea</em>: Lightning Resistance, you can breathe underwater, and you gain a Swim Speed equal to your Speed. <em>Tundra</em>: Cold Resistance, plus a Magic action to turn a 5-ft Cube of water you touch into ice for 1 minute (it fails if a creature is inside)." }
    ],
    10:[
      { name:'Shielding Storm', desc:'Each creature of your choice within your Storm Aura gains the damage Resistance you have from Storm Soul.' }
    ],
    14:[
      { name:'Raging Storm', desc:"Your aura's effect grows mightier, based on its environment. <em>Desert</em>: once per turn, a creature you can see that fails the save starts burning for 1 minute or until your Rage ends, taking an extra 1d4 Fire damage at the start of each of its turns. <em>Sea</em>: whether the target fails or succeeds, lightning leaps to a second target of your choice within 30 ft of it, which makes the same DEX save. <em>Tundra</em>: once per turn, a creature you can see that fails the save takes 2d4 Cold damage and has its Speed halved until the end of its next turn." }
    ],
  },
  'Path of Unlight': {
    3:[
      { name:'Radiant Rage', desc:'While your Rage is active, any creature that hits you with a melee attack roll takes Radiant damage equal to your Rage Damage bonus. You also shed Bright Light in a 20-ft radius for the duration of the Rage.' }
    ],
    6:[
      { name:'Unlight Revelation', desc:'You gain proficiency in Perception if you lack it, and Expertise in that skill. While your Rage is active, you have Blindsight with a range equal to the Bright Light shed by Radiant Rage.' }
    ],
    10:[
      { name:'Infectious Unlight', desc:'Damage from your Brutal Strike can be Radiant or its usual type (your choice), and you gain a new option. <em>Radiant Infection</em>: for 1 minute the target sheds Bright Light in a 10-ft radius and takes 1d6 Radiant damage at the start of each of its turns; it makes a CON save (DC 8 + your STR modifier + PB) at the end of each of its turns, ending the effect on a success.' },
      { name:'Harbinger of Unlight', desc:'The Unlight burning inside you no longer harms you: you gain Resistance to Radiant damage.' }
    ],
    14:[
      { name:'Brilliant Rage', desc:'While your Rage is active, you now shed Bright Light in a 30-ft radius. Bonus Action: each creature of your choice within 30 ft makes a CON save (DC 8 + your STR modifier + PB), taking 1d12 Radiant damage and the Blinded condition until the end of your next turn on a failure, or half damage only on a success. Once per Long Rest, unless you expend a use of your Rage (no action required) to restore it.' }
    ],
  },
},

'Bard': {
  'College of Dance': {
    3:[
      { name:'Dazzling Footwork', desc:"While you wear no armor and wield no Shield: <em>Dance Virtuoso</em> Advantage on Charisma (Performance) checks that involve dancing · <em>Unarmored Defense</em> base AC = 10 + DEX + CHA · <em>Agile Strikes</em> when you expend a Bardic Inspiration as part of an action, Bonus Action or Reaction, you can make one Unarmed Strike as part of it · <em>Bardic Damage</em> use DEX for the attack rolls of your Unarmed Strikes, and you can deal Bludgeoning damage equal to a roll of your Bardic Inspiration die + DEX instead of the normal damage — that roll doesn't expend the die." }
    ],
    6:[
      { name:'Inspiring Movement', desc:'Reaction when an enemy you can see ends its turn within 5 ft: expend one Bardic Inspiration to move up to half your Speed, then one ally of your choice within 30 ft can use its Reaction to move up to half its Speed. None of this movement provokes Opportunity Attacks.' },
      { name:'Tandem Footwork', desc:'When you roll Initiative without the Incapacitated condition, you can expend one Bardic Inspiration: roll the die, and you and each ally within 30 ft who can see or hear you add that much to Initiative.' }
    ],
    14:[
      { name:'Leading Evasion', desc:'When an effect lets you make a DEX save for half damage, you take none on a success and half on a failure. Creatures within 5 ft making that same save can share the benefit. Unusable while you have the Incapacitated condition.' }
    ],
  },
  'College of Glamour': {
    3:[
      { name:'Beguiling Magic', desc:'You always have Charm Person and Mirror Image prepared. Right after you cast an Enchantment or Illusion spell with a spell slot, a creature you can see within 60 ft makes a WIS save or has the Charmed or Frightened condition (your choice) for 1 minute, repeating the save at the end of each of its turns. Once per Long Rest — or restore the use by expending one Bardic Inspiration (no action required).' },
      { name:'Mantle of Inspiration', desc:'Bonus action: expend one Bardic Inspiration and roll the die. Choose up to your CHA modifier of other creatures within 60 ft (minimum one); each gains Temporary HP equal to twice the number rolled, and each can then use its Reaction to move up to its Speed without provoking Opportunity Attacks.' }
    ],
    6:[
      { name:'Mantle of Majesty', desc:'You always have Command prepared. Bonus action: cast Command without a spell slot and take on an unearthly appearance for 1 minute or until your Concentration ends; while it lasts you can cast Command as a Bonus Action without a slot, and a creature Charmed by you automatically fails its save against it. Once per Long Rest — or restore the use by expending a level 3+ spell slot (no action required).' }
    ],
    14:[
      { name:'Unbreakable Majesty', desc:'Bonus action: assume a magically majestic presence for 1 minute or until you have the Incapacitated condition. The first time a creature hits you with an attack roll on a turn, it must succeed on a CHA save or the attack misses instead. Once per Short or Long Rest.' }
    ],
  },
  'College of Lore': {
    3:[
      { name:'Bonus Proficiencies', desc:'You gain proficiency with three skills of your choice.' },
      { name:'Cutting Words', desc:'Reaction when a creature you can see within 60 ft makes a damage roll or succeeds on an ability check or an attack roll: expend one Bardic Inspiration and subtract the die roll from it, reducing the damage or turning the success into a failure.' }
    ],
    6:[
      { name:'Magical Discoveries', desc:'Learn two spells from the Cleric, Druid or Wizard lists, in any combination. Each must be a cantrip or of a level you have spell slots for. They are always prepared, and whenever you gain a Bard level you can swap one for another that meets the same conditions.' }
    ],
    14:[
      { name:'Peerless Skill', desc:"When you fail an ability check or an attack roll, you can expend one Bardic Inspiration and add the die roll to the d20, possibly turning the failure into a success. If it still fails, the Bardic Inspiration isn't expended." }
    ],
  },
  'College of Valor': {
    3:[
      { name:'Combat Inspiration', desc:"A creature holding a Bardic Inspiration die from you can spend it on one of two effects. <em>Defense</em>: when it is hit by an attack roll, it can use its Reaction to roll the die and add the result to its AC against that attack, possibly making it miss. <em>Offense</em>: right after it hits with an attack roll, it can roll the die and add the result to that attack's damage." },
      { name:'Martial Training', desc:'You gain proficiency with Martial weapons and training with Medium armor and Shields. You can also use a Simple or Martial weapon as a Spellcasting Focus for your Bard spells.' }
    ],
    6:[
      { name:'Extra Attack', desc:'You can attack twice instead of once whenever you take the Attack action. You can also cast one of your cantrips that has a casting time of an action in place of one of those attacks.' }
    ],
    14:[
      { name:'Battle Magic', desc:'After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.' }
    ],
  },
  /* Xanathar's Guide to Everything (2014). Seul collège de cette liste
     que le PHB 2024 n'a pas réédité — aucune version 2024 n'existe. */
  'College of Whispers': {
    3:[
      { name:'Psychic Blades', desc:'When you hit a creature with a weapon attack, you can expend one Bardic Inspiration to deal extra Psychic damage — 2d6, rising to 3d6 at level 5, 5d6 at level 10 and 8d6 at level 15. Once per round, on your turn.' },
      { name:'Words of Terror', desc:'Speak alone with a Humanoid for at least 1 minute: at the end of the conversation it makes a WIS save against your spell save DC or is Frightened of you, or of another creature of your choice, for 1 hour — until it is attacked or damaged, or sees its allies attacked or damaged. On a success it never suspects a thing. Once per Short or Long Rest.' }
    ],
    6:[
      { name:'Mantle of Whispers', desc:"Reaction when a Humanoid dies within 30 ft: capture its shadow, keeping it until you spend it or finish a Long Rest. Action to spend it: you take on the dead person's appearance, healthy and alive, for 1 hour (Bonus Action to end), with access to whatever they would freely tell a casual acquaintance. An Insight check to see through it is contested by your Deception, with a +5 bonus to your roll. Once per Short or Long Rest." }
    ],
    14:[
      { name:'Shadow Lore', desc:"Magic action: whisper a phrase that only one creature of your choice within 30 ft can hear. It makes a WIS save against your spell save DC, succeeding automatically if it shares no language with you or can't hear you. On a failure it is Charmed for 8 hours, or until you or your allies attack or damage it: convinced you know its most mortifying secret, it obeys your commands. Once per Long Rest." }
    ],
  },
  'College of the Moon': {
    3:[
      { name:'Moonlit Inspiration', desc:'When you grant Bardic Inspiration to an ally, they regain HP equal to your CHA mod (min 1). You can cast Invisibility on yourself once per Long Rest without a spell slot.' },
      { name:'Moon Spells', desc:'Always prepared: Faerie Fire, Moonbeam.' }
    ],
    6:[{ name:'Radiant Moonbeam', desc:'When you cast Moonbeam, the radius doubles to 10 ft and creatures that fail their save take maximum damage on the first roll.' }],
    14:[{ name:'Moonlit Mantle', desc:'You can cast Invisibility on another willing creature once per Long Rest. Whenever a creature uses your Bardic Inspiration, you or they regain HP equal to your Bard level without expending a spell slot or Inspiration die.' }],
  },


  /* ── Unearthed Arcana ── */
  'College of Spirits': {
    3:[
      { name:'Channeler', desc:'<em>Guiding Whispers</em>: you know the Guidance cantrip, and it has a 60-ft range when you cast it. <em>Spiritual Focus</em>: you gain a Gaming Set (Playing Cards) and proficiency with it, and you can use those cards, an Arcane Focus (Crystal or Orb), a Candle, or an Ink Pen as a Spellcasting Focus for your Bard spells.' },
      { name:'Spirits from Beyond', desc:"Bonus Action while holding a Spellcasting Focus: expend one Bardic Inspiration, roll the die, and bestow that spirit on one creature you can see within 30 ft (save DC = your Bard spell save DC). <em>Beloved</em> (1): the target regains HP equal to a die roll + CHA · <em>Sharpshooter</em> (2): Force damage equal to a die roll + CHA · <em>Avenger</em> (3): until the end of your next turn, anything hitting the target with a melee attack takes a die roll of Force damage · <em>Renegade</em> (4): the target can take a Reaction to teleport up to 30 ft · <em>Fortune Teller</em> (5): Advantage on D20 Tests until your next turn · <em>Wayfarer</em> (6): Temp HP equal to a die roll + your Bard level, and +10 ft Speed while they last · <em>Trickster</em> (7): WIS save or two die rolls of Psychic damage and Charmed until your next turn, half damage only on a success · <em>Shade</em> (8): Invisible until the end of its next turn or until it attacks, damages, or casts, then everyone in a 5-ft Emanation makes a CON save or takes two die rolls of Necrotic damage · <em>Arsonist</em> (9): DEX save for four die rolls of Fire damage, half on a success · <em>Coward</em> (10): the target and chosen creatures in a 30-ft Emanation make a WIS save or are Frightened until your next turn with halved Speed and only an action or a Bonus Action, not both · <em>Brute</em> (11): chosen creatures in a 30-ft Emanation make a STR save or take three die rolls of Thunder damage and fall Prone, half damage on a success · <em>Controlled Channeling</em> (12): choose any other row's effect." }
    ],
    6:[
      { name:'Empowered Channeling', desc:"<em>Power from Beyond</em>: once per turn when you cast a Bard spell that deals damage or restores HP, roll a d6 and add it to one of the spell's damage rolls or to the total HP restored. <em>Spiritual Manifestation</em>: Spirit Guardians is always prepared and you can cast it once per Long Rest without a spell slot; once per Short or Long Rest you can modify a casting so that you and allies inside its Emanation have Half Cover." }
    ],
    14:[
      { name:'Mystical Connection', desc:'Whenever you roll on the Spirits from Beyond table, you can roll the die twice and choose which of the two spirit effects to bestow.' }
    ],
  },
},

'Cleric': {
  'Life Domain': {
    3:[
      { name:'Disciple of Life', desc:'Healing spells of 1st level or higher restore extra HP = 2 + spell\'s level.' },
      { name:'Domain Spells', desc:'Always prepared: Bless, Cure Wounds (1st); Aid, Lesser Restoration (3rd); Mass Healing Word, Revivify (5th); Death Ward, Guardian of Faith (7th); Mass Cure Wounds, Raise Dead (9th).' }
    ],
    6:[{ name:'Blessed Healer', desc:'When you heal another creature with a 1st+ spell, you also regain HP = 2 + spell\'s level.' }],
    8:[{ name:'Supreme Healing', desc:'When you roll dice to restore HP with a spell, use the maximum possible result for each die.' }],
    17:[{ name:'Divine Intervention (Life)', desc:'Your Divine Intervention calls a 9th-level Cleric spell automatically.' }],
  },
  'Light Domain': {
    3:[
      { name:'Warding Flare', desc:'Reaction: when a creature attacks you within 30 ft, impose disadvantage on the roll. Uses = WIS mod/Long Rest.' },
      { name:'Domain Spells', desc:'Always prepared: Burning Hands, Faerie Fire (1st); Flaming Sphere, Scorching Ray (3rd); Daylight, Fireball (5th); Guardian of Faith, Wall of Fire (7th); Flame Strike, Scrying (9th).' }
    ],
    6:[{ name:'Radiance of the Dawn', desc:'Channel Divinity: each Hostile creature within 30 ft makes CON save or takes 2d10+Cleric level Radiant (half on success). Dispels magical darkness in the area.' }],
    8:[{ name:'Improved Warding Flare', desc:'Warding Flare now also deals Radiant damage = WIS mod to the attacker when it fires.' }],
    17:[{ name:'Corona of Light', desc:'Action: sunlight aura 60 ft bright / 30 ft dim for 1 minute. Enemies in bright light have disadvantage on saves vs Fire and Radiant spells.' }],
  },
  'Trickery Domain': {
    3:[
      { name:'Blessing of the Trickster', desc:'Action: touch a willing creature. It gains advantage on DEX (Stealth) checks until your next Long Rest.' },
      { name:'Domain Spells', desc:'Always prepared: Charm Person, Disguise Self (1st); Mirror Image, Pass Without Trace (3rd); Blink, Dispel Magic (5th); Dimension Door, Polymorph (7th); Dominate Person, Modify Memory (9th).' }
    ],
    6:[{ name:'Invoke Duplicity', desc:'Channel Divinity: create an illusory duplicate within 30 ft for 1 minute (Concentration). Cast spells as if in its space; advantage on attacks if adjacent to target.' }],
    8:[{ name:'Cloak of Shadows', desc:'Channel Divinity: become Invisible until end of next turn.' }],
    17:[{ name:'Improved Duplicity', desc:'Create 4 duplicates with Invoke Duplicity. Each can be the origin of your spells.' }],
  },
  'War Domain': {
    3:[
      { name:'War Priest', desc:'When you take the Attack action, make one weapon attack as a Bonus Action. Uses = WIS mod/Long Rest.' },
      { name:'Domain Spells', desc:'Always prepared: Divine Favor, Shield of Faith (1st); Magic Weapon, Spiritual Weapon (3rd); Crusader\'s Mantle, Spirit Guardians (5th); Fire Shield, Freedom of Movement (7th); Flame Strike, Hold Monster (9th).' }
    ],
    6:[{ name:'Guided Strike', desc:'Channel Divinity: when you or an ally within 30 ft misses an attack, add +10 to the roll after seeing it miss.' }],
    8:[{ name:'War God\'s Blessing', desc:'Reaction: Channel Divinity to grant an ally within 30 ft +10 to an attack roll.' }],
    17:[{ name:'Avatar of Battle', desc:'Resistance to Bludgeoning, Piercing, and Slashing damage from nonmagical attacks.' }],
  },
  'Knowledge Domain': {
    3:[
      { name:'Blessings of Knowledge', desc:'Learn 2 languages and gain Expertise in 2 of: Arcana, History, Nature, Religion.' },
      { name:'Domain Spells', desc:'Always prepared: Command, Identify (1st); Augury, Suggestion (3rd); Nondetection, Speak with Dead (5th); Arcane Eye, Confusion (7th); Legend Lore, Scrying (9th).' }
    ],
    6:[{ name:'Channel Divinity: Knowledge of the Ages', desc:'Gain proficiency with one Skill or Tool of your choice for 10 minutes.' }],
    8:[{ name:'Channel Divinity: Read Thoughts', desc:'Read the thoughts of one creature within 60 ft. It makes WIS save; on fail, read thoughts for 1 minute and can cast Suggestion without a slot.' }],
    17:[{ name:'Visions of the Past', desc:'Meditate 1 minute to see brief scenes from the history of an object held or a location you occupy.' }],
  },

  /* ── Unearthed Arcana ── */
  'Arcana Domain': {
    3:[
      { name:'Arcana Domain Spells', desc:"Always prepared — <strong>3</strong>: Detect Magic, Magic Missile, Magic Weapon, Nystul's Magic Aura · <strong>5</strong>: Counterspell, Dispel Magic · <strong>7</strong>: Arcane Eye, Leomund's Secret Chest · <strong>9</strong>: Bigby's Hand, Teleportation Circle." },
      { name:'Student of Arcana', desc:'<em>Magical Knowledge</em>: you gain proficiency in Arcana, or in one skill of your choice from the Cleric level-1 list if you already have Arcana. <em>Cantrips</em>: you learn two Wizard cantrips, and can swap one of them for another Wizard cantrip whenever you gain a Cleric level.' },
      { name:'Modify Magic', desc:'As you cast a spell, expend one use of Channel Divinity to alter it (no action required). <em>Fortifying Spell</em>: one target of the spell gains Temporary HP equal to 2d8 + your Cleric level. <em>Tenacious Spell</em>: when the spell forces a save, choose one target you can see and roll 1d6 as a penalty to that save.' }
    ],
    6:[
      { name:'Dispelling Recovery', desc:'Immediately after you cast a spell with a slot that restores HP to a creature or ends a condition on it, you can cast Dispel Magic on that creature as a Bonus Action without a slot. Uses equal to your WIS modifier (minimum once), all regained on a Long Rest.' }
    ],
    17:[
      { name:'Magical Mastery', desc:'Learn four Wizard spells, one each from levels 6, 7, 8, and 9, and always have them prepared. Whenever you gain a Cleric level, you can replace one of them with another Wizard spell of the same level.' }
    ],
  },
  'Freedom Domain': {
    3:[
      { name:'Freedom Domain Spells', desc:'Always prepared — <strong>3</strong>: Expeditious Retreat, Jump, Knock, Misty Step · <strong>5</strong>: Fly, Gaseous Form · <strong>7</strong>: Dimension Door, Freedom of Movement · <strong>9</strong>: Passwall, Tree Stride.' },
      { name:'Invoke Liberty', desc:'Magic action, presenting your Holy Symbol and expending a use of Channel Divinity: each ally in a 30-ft Emanation from you ends one condition of its choice on itself — <em>Frightened</em> · <em>Grappled</em> · <em>Paralyzed</em> · <em>Restrained</em> — then may use its Reaction to move up to its Speed without provoking Opportunity Attacks. At Cleric level 9 the list also includes Charmed and Petrified.' },
      { name:'Unencumbered Grace', desc:'While you wear no armor, your base AC equals 10 + DEX modifier + WIS modifier, and a Shield still works with it. You also gain Proficiency in Acrobatics, or Expertise in it if you are already proficient.' }
    ],
    6:[
      { name:'Unstoppable', desc:'Difficult Terrain no longer affects your movement. You also gain proficiency in DEX saves, or proficiency in one save you lack if you already have DEX.' }
    ],
    17:[
      { name:'Avatar of Freedom', desc:'Bonus Action: manifest a 30-ft Emanation around you for 10 minutes, ending early if you dismiss it or gain the Incapacitated condition. An ally entering it for the first time on a turn or starting its turn there gains +30 ft Speed until the end of its next turn; allies inside ignore Difficult Terrain and have Advantage on DEX checks. Once per Short or Long Rest.' }
    ],
  },
  'Grave Domain': {
    3:[
      { name:'Circle of Mortality', desc:"<em>Pull of Death</em>: once per turn, when you cast a spell or hit with an attack roll and damage a Bloodied creature, it takes an extra 1d4 Necrotic damage. <em>Return to Life</em>: when a spell or Channel Divinity of yours restores HP to a creature at 0 HP, don't roll the healing dice — use the maximum on each one." },
      { name:'Grave Domain Spells', desc:'Always prepared — <strong>3</strong>: Bane, Chill Touch, Detect Evil and Good, Gentle Repose, Ray of Enfeeblement · <strong>5</strong>: Revivify, Vampiric Touch · <strong>7</strong>: Blight, Dispel Evil and Good · <strong>9</strong>: Hold Monster, Raise Dead.' },
      { name:'Path to the Grave', desc:'Bonus Action: present your Holy Symbol and expend a use of Channel Divinity to curse a creature you can see within 30 ft until the start of your next turn, giving it Disadvantage on attack rolls and saves. When you or an ally you can see hits the cursed target, you can end the curse early (no action required) to make that attack deal an extra 1d8 + your Cleric level Necrotic or Radiant damage, your choice.' }
    ],
    6:[
      { name:"Sentinel at Death's Door", desc:"Reaction when you or a Bloodied creature you can see within 30 ft is hit by an attack roll: halve that attack's damage. Usable a number of times equal to your WIS modifier (min 1), regained on a Long Rest." }
    ],
    17:[
      { name:'Divine Reaper', desc:'<em>Enhanced Necromancy</em>: when you cast a single-target Necromancy spell of level 5 or lower, or any spell from the Grave Domain Spells table, expend a use of Channel Divinity to target a second creature within range — costly or consumed Material components must be provided for each target. <em>Keeper of Souls</em>: when an enemy dies within 60 ft of you, you or a creature you can see within 60 ft regains HP equal to three times your Cleric level; unusable while Incapacitated, and once per Short or Long Rest.' }
    ],
  },
  'Pestilence Domain': {
    3:[
      { name:'Blight Weaver', desc:"<em>Inoculated Soul</em>: you have Resistance to Necrotic and Poison damage and can't be infected by magical contagions. <em>Rot and Fester</em>: damage from your Cleric spells and Cleric features ignores Resistance to Necrotic and Poison damage, and when such a spell or feature deals Necrotic or Poison damage you can switch it to the other of those two types." },
      { name:'Pestilence Domain Spells', desc:'Always prepared — <strong>3</strong>: Detect Poison and Disease, Protection from Poison, Ray of Enfeeblement, Ray of Sickness · <strong>5</strong>: Stinking Cloud, Vampiric Touch · <strong>7</strong>: Blight, Giant Insect · <strong>9</strong>: Contagion, Insect Plague.' },
      { name:'Plague Blessing', desc:"Magic action, present your Holy Symbol and expend a use of Channel Divinity: a 5-ft Emanation of withering plague surrounds you or one willing creature you touch for 1 minute, ending early if you dismiss it, manifest it again, or are Incapacitated. Each creature of your choice that starts its turn in the Emanation makes a CON save against your spell save DC or gains 1 Exhaustion level — this can't push a creature past an Exhaustion level equal to your WIS modifier (minimum 1). Choose or roll the plague's symptom on the Plague Symptoms table." }
    ],
    6:[
      { name:'Virulent Burst', desc:'Reaction when an enemy within 60 ft is reduced to 0 HP: plague bursts from it in a 10-ft Emanation originating from that enemy, or 20 ft if it had at least 1 Exhaustion level. Each creature of your choice in the area makes a CON save against your spell save DC, and on a failure suffers one of these: <em>Putrid Shock</em> — Incapacitated until the end of its next turn, with Speed 0 while Incapacitated · <em>Toxic Infection</em> — 3d6 Necrotic or Poison damage (your choice). Uses equal to your WIS modifier (minimum once), regained on a Long Rest.' }
    ],
    17:[
      { name:'Vermin Form', desc:"Bonus Action: shape-shift into a Medium swarm of Tiny pests, keeping your shape, personality, memories, speech, and game statistics; your equipment doesn't transform but you can still use it. You gain Immunity to the Grappled, Paralyzed, Prone, and Restrained conditions, Resistance to Bludgeoning, Piercing, and Slashing damage, a Climb Speed equal to your Speed that scales difficult surfaces and ceilings without a check, and you can share other creatures' spaces. <em>Plague Bites</em>: a creature takes damage equal to your WIS modifier — Necrotic, Piercing, or Poison (your choice) — when you enter its space, or when it enters or ends its turn in yours, once per turn. You revert after 10 minutes, or if you end it (no action), are Incapacitated, or die; once per Long Rest, or restore the use by expending a level 5+ spell slot (no action required)." }
    ],
  },
},

'Druid': {
  'Circle of the Land': {
    3:[
      { name:'Circle Spells', desc:'Choose a terrain (Arctic, Coast, Desert, Forest, Grassland, Mountain, Swamp, Underdark). You always have terrain-specific spells prepared.' },
      { name:'Natural Recovery', desc:'Once per day after a Short Rest, recover spell slots totaling up to half your Druid level (rounded up). Cannot recover 6th+ slots.' }
    ],
    6:[{ name:'Land\'s Aid', desc:'Magic action: choose a point within 60 ft. One creature within 5 ft makes CON save or takes 2d6 Necrotic. One creature within 5 ft regains 2d6 HP.' }],
    10:[{ name:'Natural Ward', desc:'Immunity to poison and disease. Resistance to your terrain\'s associated damage type.' }],
    14:[{ name:'Nature\'s Sanctuary', desc:'Beasts and Plants must make WIS save to attack you, or they must choose a new target.' }],
  },
  'Circle of the Moon': {
    3:[
      { name:'Circle Forms', desc:'Wild Shape as a Bonus Action. Transform into Beasts with CR = Druid level ÷ 3 (min CR 1). Gain temp HP = 3× Beast\'s CR.' },
      { name:'Combat Wild Shape', desc:'While in Wild Shape, Bonus Action: expend a spell slot to regain 1d8 HP per slot level.' }
    ],
    6:[{ name:'Elemental Wild Shape', desc:'Expend 2 Wild Shape uses to transform into an Air, Earth, Fire, or Water Elemental.' }],
    10:[{ name:'Thousand Forms', desc:'Cast Alter Self at will without expending a spell slot.' }],
    14:[{ name:'Beast Spells (Moon)', desc:'Cast Druid spells in Wild Shape form as long as the form has a mouth and equivalent hands.' }],
  },
  'Circle of the Sea': {
    3:[
      { name:'Wrath of the Sea', desc:'Bonus Action: summon water spirits in a 5-ft sphere within 60 ft for 1 minute (Concentration). Creatures starting turn inside make CON save or take 1d6+WIS Cold and are pushed 15 ft.' },
      { name:'Ocean\'s Gift', desc:'Breathe underwater. Gain a Swim speed equal to your walking speed.' }
    ],
    6:[{ name:'Aquatic Affinity', desc:'Cast Water Walk at will. Wrath of the Sea sphere damage increases to 2d6+WIS.' }],
    10:[{ name:'Stormborn', desc:'Gain a Fly speed equal to your walking speed.' }],
    14:[{ name:'Oceanic Gift', desc:'Cast Control Water once per Long Rest without a spell slot.' }],
  },
  'Circle of Stars': {
    3:[
      { name:'Star Map', desc:'Your spellbook is a star chart. You can cast Guidance and Guiding Bolt (WIS mod uses/Long Rest) without spell slots. Both are always prepared.' },
      { name:'Starry Form', desc:'Wild Shape → starry form instead of a Beast: Archer (Bonus Action ranged attack, 1d8+WIS Radiant), Chalice (healing spells also heal self or ally for 1d8+WIS), Dragon (advantage on Concentration saves; spells deal +10 Radiant).' }
    ],
    6:[{ name:'Cosmic Omen', desc:'After Long Rest, roll d6: odd = Weal, even = Woe. Reaction: add d6 (Weal) or subtract d6 (Woe) from a creature\'s roll within 30 ft. Uses = WIS mod/Long Rest.' }],
    10:[{ name:'Twinkling Constellations', desc:'Starry Form upgrades: Archer shoots twice, Chalice heals on any spell slot, Dragon grants Fly speed = walk speed.' }],
    14:[{ name:'Full of Stars', desc:'While in Starry Form, gain resistance to Bludgeoning, Piercing, and Slashing damage.' }],
  },
  'Circle of Wildfire': {
    3:[
      { name:'Summon Wildfire Spirit', desc:'Expend a Wild Shape use to summon a wildfire spirit in an unoccupied space within 30 ft. It acts on your initiative, deals fire, and can move 30 ft. Its attacks count as magical.' },
      { name:'Wildfire Spells', desc:'Always prepared: Burning Hands, Cure Wounds (1st); Flaming Sphere, Scorching Ray (3rd); Plant Growth, Revivify (5th); Aura of Life, Fire Shield (7th); Flame Strike, Mass Cure Wounds (9th).' }
    ],
    6:[{ name:'Enhanced Bond', desc:'When you cast a spell that deals Fire or restores HP, roll a bonus 1d8 and add it to one roll (fire dmg or healing). Must be within 60 ft of your wildfire spirit.' }],
    10:[{ name:'Cauterizing Flames', desc:'When a Small or larger creature dies within 30 ft, a spectral flame appears at its space for 1 minute. You or an ally can enter that space to heal 2d10+WIS HP (once per flame). Number of flames = WIS mod/Long Rest.' }],
    14:[{ name:'Blazing Revival', desc:'When your wildfire spirit vanishes and you are at 0 HP, you can have the spirit explode: each creature within 10 ft takes 2d10 Fire (DEX save for half) and you regain 1 HP. 1/Long Rest.' }],
  },

  /* ── Unearthed Arcana ── */
  'Circle of Preservation': {
    3:[
      { name:'Circle of Preservation Spells', desc:'Always prepared — <strong>3</strong>: Bless, Lesser Restoration, Protection from Poison, Sanctuary · <strong>5</strong>: Beacon of Hope, Plant Growth · <strong>7</strong>: Aura of Life, Death Ward · <strong>9</strong>: Greater Restoration, Hallow.' },
      { name:'Preserved Land', desc:'Bonus Action, expend a use of Wild Shape: fill a 15-ft Cube from a point on the ground within 120 ft with revitalizing energy for 1 minute (ends early if you are Incapacitated, end more than 120 ft away, or die). When a creature ends its turn inside, you can grant it <em>Bolster</em>: Temp HP equal to 1d4 + your Druid level · <em>Purify</em>: end one effect giving it the Frightened or Poisoned condition. Nonmagical local vegetation sprouts inside, and a Bonus Action on later turns moves the Cube up to 30 ft.' },
      { name:'Student of Preservation', desc:"<em>Frugal Casting</em>: cast Druid spells without Material components, except those consumed or with a listed cost; a consumed component also has a 10 percent chance of not being used up. <em>Tool Proficiency</em>: gain proficiency with one type of Artisan's Tools." }
    ],
    6:[
      { name:'Improved Preservation', desc:'<em>Fortify Protectors</em>: you and your allies inside the Preserved Land Cube gain a bonus to CON saves equal to your WIS modifier (min +1). <em>Reject Desecrators</em>: an enemy whose space the Cube enters, or that enters the Cube or ends its turn there, makes a WIS save vs your spell save DC — on a failure it takes 2d10 Radiant damage and its Speed is halved until the end of its next turn, half damage only on a success. Each enemy saves only once per turn.' }
    ],
    10:[
      { name:'Facilitated Restoration', desc:'Cast Lesser Restoration or Greater Restoration without expending a spell slot or using components. You can do this a number of times equal to your WIS modifier (min once), regaining all uses on a Long Rest.' }
    ],
    14:[
      { name:'Sacrosanct Land', desc:"The Cube of your Preserved Land grows to a 30-ft Cube. Reaction when a creature you can see in that area is hit by an attack roll: halve that attack's damage against the creature." }
    ],
  },
  'Circle of Spores': {
    3:[
      { name:'Circle Spells', desc:'Always prepared — <strong>3</strong>: Blindness/Deafness, Charm Person, Chill Touch · <strong>5</strong>: Animate Dead · <strong>7</strong>: Confusion · <strong>9</strong>: Contagion.' },
      { name:'Halo of Spores', desc:'Invisible spores fill a 10-ft Emanation from you, granting telepathy out to 10 ft, or +10 ft of range if you already have telepathy. Reaction when a creature you can see moves into the Emanation or starts its turn there: it makes a CON save against your spell save DC, taking 1d4 Necrotic damage on a failure, or having Disadvantage on its next attack roll before the end of its turn on a success. The die becomes 1d6 at level 6, 1d8 at level 10, and 1d10 at level 14.' },
      { name:'Symbiotic Entity', desc:'Bonus Action: expend a use of Wild Shape to waken your spores instead of shape-shifting, gaining Temporary HP equal to four times your Druid level for 10 minutes — it ends early if you dismiss it, gain the Incapacitated condition, or use the feature again. <em>Deadly Halo</em>: roll your Halo of Spores damage die a second time and add it to the total. <em>Entropic Empowerment</em>: once per turn, deal an extra 1d6 Necrotic damage to a target you hit with a melee weapon or Unarmed Strike.' }
    ],
    6:[
      { name:'Fungal Infestation', desc:'Reaction when a Small or Medium Beast or Humanoid dies within 10 ft of you: it stands up immediately with 1 HP, and you may transfer any number of your Symbiotic Entity Temporary HP to it. It uses the Zombie stat block, is an ally, shares your Initiative but acts right after you, and obeys your mental commands, otherwise Dodging and moving away from danger. It lasts 1 hour, ending early if you end it as a Bonus Action or it drops to 0 HP. Uses equal to your WIS modifier (minimum 1), regained on a Long Rest.' }
    ],
    10:[
      { name:'Explosive Burst', desc:'When an Undead creature you created dies, it bursts with spores: each creature you choose within 10 ft of it makes a CON save against your spell save DC, taking 2d8 Necrotic damage on a failure or half as much on a success.' }
    ],
    14:[
      { name:'Fungal Body', desc:'You have Immunity to the Blinded, Deafened, Frightened, and Poisoned conditions, and any Critical Hit against you counts as a normal hit unless you have the Incapacitated condition. While you have the Unconscious condition, your spores drive your body: your Speed does not drop to 0, and on your turn they move you toward allies and away from danger.' }
    ],
  },
  'Circle of the Titan': {
    3:[
      { name:'Circle of the Titan Spells', desc:'Always prepared — <strong>3</strong>: Enlarge/Reduce, Thaumaturgy, Thunderwave · <strong>5</strong>: Fear · <strong>7</strong>: Fire Shield · <strong>9</strong>: Destructive Wave. You can also cast these spells while in your Titan Form.' },
      { name:'Titan Form', desc:'When you use Wild Shape you can take a Titan Form instead of a Beast, choosing <em>Behemoth</em>, <em>Leviathan</em>, or <em>Insectoid</em>. The form lasts 10 minutes rather than a number of hours. Each stat block gains extra benefits at the Druid levels it lists, and anything that applies to your Beast forms applies to your Titan Form.' },
      { name:'Behemoth', desc:'Titan Form option — Large (Huge at level 10+, Gargantuan at 14+), AC 13 + WIS, Temp HP equal to 4 × your Druid level, Speed 40 ft and Climb 40 ft, STR and DEX equal your WIS score, Darkvision 60 ft. <em>Siege Monster</em>: double damage to objects and structures. <em>Rend</em>: melee attack using your spell attack bonus, reach 10 ft, 1d8 + WIS Slashing, rising to 2d8 at level 6 and 3d8 at 12; two Rends per Attack at level 5+. <em>Incandescent Breath</em>: expend a level 1+ slot for a 5-ft-wide, 60-ft-long Line, DEX save, 2d10 Radiant per slot level (half on a success). <em>Rampager</em> (level 10+): Bonus Action, expend a level 1+ slot and move half your Speed without provoking; the first time each turn you enter the space of an enemy two sizes smaller, it makes a STR save or falls Prone, instead taking 1d10 Bludgeoning per slot level if already Prone.' },
      { name:'Leviathan', desc:'Titan Form option — Large (Huge at level 10+, Gargantuan at 14+), AC 13 + WIS, Temp HP equal to 4 × your Druid level, Speed 40 ft and Swim 40 ft, STR and DEX equal your WIS score, Darkvision 60 ft. <em>Amphibious</em>: you breathe air and water. <em>Siege Monster</em>: double damage to objects and structures. <em>Rend</em>: melee attack using your spell attack bonus, reach 10 ft, 1d8 + WIS Bludgeoning, rising to 2d8 at level 6 and 3d8 at 12; two Rends per Attack at level 5+. <em>Toxic Deluge</em> (level 10+): Bonus Action, expend a level 1+ slot; each creature you choose in a 10-ft Emanation makes a CON save or takes 2d4 Poison per slot level and is Poisoned until the start of your next turn.' },
      { name:'Insectoid', desc:"Titan Form option — Large (Huge at level 10+, Gargantuan at 14+), AC 13 + WIS, Temp HP equal to 4 × your Druid level, Speed 40 ft plus Fly 40 ft at level 10+, STR and DEX equal your WIS score, Darkvision 60 ft. <em>Flyby</em> (level 10+): you don't provoke Opportunity Attacks when you fly out of an enemy's reach. <em>Siege Monster</em>: double damage to objects and structures. <em>Rend</em>: melee attack using your spell attack bonus, reach 10 ft, 1d8 + WIS Piercing, rising to 2d8 at level 6 and 3d8 at 12; two Rends per Attack at level 5+. <em>Energizing Pollen</em>: expend a level 1+ slot and move up to half your Speed without provoking while trailing healing pollen; each creature you move within 5 ft of can regain 2d6 HP per slot level, once per turn each." }
    ],
    6:[
      { name:'Dire Impact', desc:"<em>Elemental Rend</em>: whenever you hit with your Titan Form's Rend, you can change its damage to Acid, Cold, Fire, Lightning, or Thunder. <em>Shock Wave</em>: once per turn, immediately after you move at least half your Speed, each creature in a 10-ft Emanation from you makes a CON save against your spell save DC or has the Prone condition." }
    ],
    10:[
      { name:'Primal Havoc', desc:"<em>Huge Size</em>: you can become Huge when you assume your Titan Form, if there's room. <em>Toughened Hide</em>: immediately after taking a Huge or larger Titan Form, expend a level 1+ slot to gain a bonus to AC equal to half the slot's level (round up) for the form's duration. <em>Above It All</em>: while Huge or larger in Titan Form, Difficult Terrain from heavy snow, ice, rubble, or undergrowth costs you no extra movement." }
    ],
    14:[
      { name:'Monstrous Appetite', desc:"<em>Gargantuan Size</em>: you can become Gargantuan when you assume your Titan Form, if there's room. <em>Grappling Rend</em>: once per turn while Huge or larger, a hit with your Rend can give the target the Grappled condition (escape DC equals your spell save DC), one target at a time. <em>Swallow</em>: Bonus Action while Gargantuan to make a Large or smaller creature you've Grappled attempt a STR save — on a failure you swallow it, ending the Grapple, and it is Blinded and Restrained with Total Cover, taking Acid damage at the start of each of your turns equal to a number of d12s equal to your WIS modifier. You can hold a number of creatures equal to your WIS modifier (minimum one) and must keep Concentration; losing it or leaving your Titan Form regurgitates them all Prone within 10 ft of you." }
    ],
  },
},

'Fighter': {
  'Battle Master': {
    3:[
      { name:'Combat Superiority', desc:'4 Superiority Dice (d8s), refill on Short or Long Rest. Save DC = 8+PB+STR or DEX.' },
      { name:'Maneuvers (3)', desc:'Choose 3: Commander\'s Strike, Disarming Strike, Distracting Strike, Evasive Footwork, Feinting Attack, Goading Attack, Lunging Attack, Maneuvering Attack, Menacing Attack, Parry, Precision Attack, Pushing Attack, Rally, Riposte, Sweeping Attack, Tactical Assessment, Trip Attack.' },
      { name:'Student of War', desc:'Gain proficiency with one Artisan\'s Tool of your choice.' }
    ],
    7:[
      { name:'Know Your Enemy', desc:'Bonus Action: study a creature for 1 minute. Learn if its STR/DEX/CON/AC/HP/levels are higher, lower, or equal to yours.' },
      { name:'Maneuvers (+2)', desc:'Choose 2 more Maneuvers (5 total). Superiority Dice become d10s.' }
    ],
    10:[
      { name:'Improved Combat Superiority', desc:'Gain 2 more Maneuvers (7 total). Once per Short Rest, regain 1 Superiority Die when you roll initiative with none remaining.' }
    ],
    15:[{ name:'Relentless', desc:'Superiority Dice become d12s. When you roll Initiative with none remaining, regain 1.' }],
  },
  'Champion': {
    3:[
      { name:'Improved Critical', desc:'Weapon attacks score a critical hit on 19-20.' },
      { name:'Remarkable Athlete', desc:'Add half PB (rounded up) to STR, DEX, CON checks without PB. Jump distance +STR mod.' }
    ],
    7:[{ name:'Additional Fighting Style', desc:'Choose a second Fighting Style.' }],
    10:[{ name:'Heroic Warrior', desc:'During a Short Rest, expend a Second Wind use to gain Inspiration.' }],
    15:[{ name:'Superior Critical', desc:'Weapon attacks score critical hits on 18-20.' }],
    18:[{ name:'Survivor', desc:'Start of your turn with < half max HP: regain 5+CON mod HP (if you have at least 1 HP).' }],
  },
  'Eldritch Knight': {
    3:[
      { name:'Spellcasting', desc:'INT-based Wizard spellcasting. Know 3 spells, at least 2 from Abjuration or Evocation.' },
      { name:'Weapon Bond', desc:'1-hour ritual to bond a weapon: can\'t be disarmed, teleport it to your hand as a Bonus Action.' }
    ],
    7:[{ name:'War Magic', desc:'When you cast a cantrip as an action, make one weapon attack as a Bonus Action.' }],
    10:[{ name:'Eldritch Strike', desc:'A creature hit by your weapon attack has disadvantage on saves vs the next spell you cast before end of your next turn.' }],
    15:[{ name:'Arcane Charge', desc:'When you use Action Surge, you can also teleport up to 30 ft to an unoccupied space you can see.' }],
    18:[{ name:'Improved War Magic', desc:'When you cast a spell as an action, make one weapon attack as a Bonus Action.' }],
  },
  'Psi Warrior': {
    3:[{ name:'Psionic Power', desc:'Psionic Energy Dice (d6s) = 2× PB. Spend on: Protective Field (Reaction: reduce damage 1d6+INT mod), Psionic Strike (after weapon hit: extra 1d6+INT Psychic), Mind Thrust (Bonus Action: target INT save or speed −10 ft, no Reactions).' }],
    7:[{ name:'Telekinetic Movement', desc:'Action: move a Large or smaller creature or object within 30 ft up to 30 ft in any direction. STR save to resist.' }],
    10:[{ name:'Guarded Mind', desc:'Resistance to Psychic damage. Spend a Psionic die to end Charmed or Frightened at start of your turn.' }],
    15:[{ name:'Bulwark of Force', desc:'Bonus Action: choose up to PB creatures within 30 ft. Each gains Half Cover until start of your next turn. Uses = INT mod/Long Rest.' }],
    18:[{ name:'Telekinetic Master', desc:'Cast Telekinesis (Concentration) without a slot. Still make weapon attacks while concentrating. 1/Long Rest.' }],
  },
  'Banneret': {
    3:[
      { name:'Banneret Proficiencies', desc:'Gain proficiency in one skill of your choice and one additional language. You can cast Comprehend Languages as a ritual without a spell slot.' },
      { name:'Quick Study', desc:'After observing a language for 1 hour, you can attempt to understand and speak it. After 7 days of study you learn the language permanently.' }
    ],
    7:[{ name:'Team Tactics', desc:'When you take the Attack action, choose an ally within 30 ft. Until the start of your next turn, that ally has Advantage on attack rolls against creatures you attacked this turn.' }],
    10:[{ name:'Rallying Surge', desc:'When you use Action Surge, one ally within 60 ft can immediately use their Reaction to make one weapon attack and move up to their speed.' }],
    15:[{ name:'Stalwart Spirit', desc:'When you fail a saving throw, you can reroll it with a +5 bonus. You must use the new result. 1/Long Rest.' }],
    18:[{ name:'Inspiring Leader', desc:'You are immune to the Charmed and Frightened conditions. Your Team Tactics and Rallying Surge now affect up to 2 allies simultaneously.' }],
  },


  /* ── Unearthed Arcana ── */
  'Arcane Archer': {
    3:[
      { name:'Arcane Archer Lore', desc:'You learn either the <em>Druidcraft</em> or <em>Prestidigitation</em> cantrip, using INT as your spellcasting ability for it. You also gain proficiency in Arcana and Nature; replace either one you already have with another skill of your choice.' },
      { name:'Arcane Shot', desc:'You learn two Arcane Shot options, gaining another at Fighter 7, 10, 15, and 18 and swapping one known option each time. Once per turn when you make a ranged attack with an Ammunition weapon you can apply one option, deciding on a hit that deals damage unless the option uses no attack roll. INT modifier uses (minimum 1), regained on a Short or Long Rest; the save DC is 8 + INT + PB. Your Arcane Shot Die is a d6, becoming a d8 at <strong>10</strong>, a d10 at <strong>15</strong>, and a d12 at <strong>18</strong>.' },
      { name:'Arcane Shot Options', desc:'<em>Banishing Shot</em>: +1 die Psychic, CHA save or banished to a harmless demiplane (Incapacitated, Speed 0) until the end of its next turn · <em>Beguiling Shot</em>: +2 dice Psychic, WIS save or Charmed until your next turn by you or an ally within 30 ft (ends early if the charmer harms it) · <em>Bursting Shot</em>: the target and each creature in a 10-ft Emanation from it take 2 dice Force · <em>Enfeebling Shot</em>: +2 dice Necrotic, CON save or Poisoned until the end of its next turn and its hits deal 1 die less damage · <em>Grasping Shot</em>: +1 die Slashing, STR save or Restrained for 1 minute (Athletics check vs your DC as an action to escape) · <em>Piercing Shot</em>: no attack roll — a 30-ft Line 1 ft wide ignoring cover, DEX save for damage as if hit plus 2 dice Piercing, half on a success · <em>Seeking Shot</em>: no attack roll — a creature seen in the last minute within long range makes a DEX save for damage as if hit plus 2 dice Force and you learn its location, half damage only on a success · <em>Shadow Shot</em>: +1 die Psychic, WIS save or Blinded until the end of its next turn.' }
    ],
    7:[
      { name:'Curving Shot', desc:"When you miss with an attack roll using an Ammunition weapon, you can take a Bonus Action immediately after to ricochet the shot at a new creature you can see within the weapon's range and within 60 ft of the original target, making a new attack roll against it." },
      { name:'Magical Ammunition', desc:'Magic action: imbue nonmagical ammunition with a property and fire it at a solid surface within range; on a hit it sticks there for the duration, then is destroyed. <em>Darkening Shot</em>: shadows fill a 15-ft Emanation for 1 minute, snuffing nonmagical flames and imposing a -5 penalty on WIS (Perception) checks and Passive Perception · <em>Unlocking Shot</em>: a loud knock audible 300 ft away unlocks, unsticks, or unbars one mundane closure per object in a 15-ft Emanation · <em>Vine Shot</em>: a 60-ft climbable vine grows and withers after 10 minutes. Once per Short or Long Rest, or by expending a use of Second Wind (no action required).' }
    ],
    10:[
      { name:'Ever-Ready Shot', desc:'When you roll Initiative, you can regain one expended use of Arcane Shot.' }
    ],
    15:[
      { name:'Indomitable Teleport', desc:'When you use your Indomitable feature and succeed on the saving throw, you can teleport up to 60 ft to an unoccupied space you can see.' }
    ],
    18:[
      { name:'Masterful Shots', desc:"Reaction when a creature you can see misses you with an attack roll: move up to half your Speed away from it without provoking Opportunity Attacks, then make a ranged attack roll against it if it is within your weapon's range." }
    ],
  },
  'Cavalier': {
    3:[
      { name:'Bonus Proficiency', desc:'Gain proficiency in one skill of your choice from Animal Handling, History, Insight, Performance, or Persuasion — or learn one language of your choice instead.' },
      { name:'Born to the Saddle', desc:'Advantage on saves made to avoid falling off your mount, and if you fall no more than 10 ft you land on your feet unless you have the Incapacitated condition. Mounting or dismounting costs only 5 ft of movement rather than half your Speed.' },
      { name:'Unwavering Mark', desc:'When you hit a creature with a Melee weapon, you can mark it until the end of your next turn; the mark ends early if you are Incapacitated, you die, or someone else marks the creature. While within 5 ft of you, a marked creature has Disadvantage on attack rolls against anyone but you, and if it hits another creature you have Advantage on attack rolls against it until the end of your next turn.' }
    ],
    7:[
      { name:'Warding Maneuver', desc:"Reaction while wielding a Melee weapon or a Shield, when you or a creature you can see within 5 ft is hit by an attack roll: roll 1d8 and add it to the target's AC against that attack. If the attack still hits, the target has Resistance to its damage. Uses equal to your CON modifier (minimum 1), regained on a Long Rest." }
    ],
    10:[
      { name:'Hold the Line', desc:'Creatures provoke an Opportunity Attack from you when they move 5 ft or more while within your reach, and a creature you hit with an Opportunity Attack has its Speed reduced to 0 until the end of the current turn.' }
    ],
    15:[
      { name:'Ferocious Charger', desc:"During the first round of each combat, you and your mount gain +10 ft Speed and your movement doesn't provoke Opportunity Attacks. When you move within 5 ft of a creature that round, it makes a STR save (DC 8 + STR + PB) or you push it 5 ft away or knock it Prone; a creature makes this save only once during a turn." }
    ],
    18:[
      { name:'Vigilant Defender', desc:"In combat you get a special Reaction usable once on every creature's turn except your own. It can only be used to make an Opportunity Attack, and not on a turn where you already took your normal Reaction." }
    ],
  },
  'Gladiator': {
    3:[
      { name:'Brutality', desc:"Once per turn when you hit with a Melee weapon attack roll, add one Brutality effect of your choice; you have CHA modifier uses (min once), regained on a Short or Long Rest. <em>Bleed</em>: activate Sap alongside a different mastery you are using, and deal extra damage of the weapon's type equal to your CHA modifier (min 1). <em>Bluff</em>: activate Vex alongside another mastery, and gain Advantage on your next save before the end of your next turn. <em>Stumble</em>: activate Topple alongside another mastery, and on its next turn the target can take only an action or a Bonus Action, not both." },
      { name:'Combat Theatrics', desc:'<em>Athletic Flair</em>: add your CHA modifier (min +1) to every DEX (Acrobatics) and STR (Athletics) check. <em>Bonus Proficiency</em>: gain proficiency in one of Acrobatics, Athletics, Deception, Intimidation, or Performance.' }
    ],
    7:[
      { name:'Flourish Parry', desc:"Reaction when an enemy hits you with a melee attack roll: add your CHA modifier (min +1) to your AC against that attack, possibly turning the hit into a miss. <em>Flourish Counter</em>: if the attack then misses, make a Melee weapon attack against that creature as part of the same Reaction, and on a hit you can apply a Brutality effect without spending a use. Once the counterattack hits, you can't counter again until a Long Rest or until you expend a use of Second Wind (no action required)." }
    ],
    10:[
      { name:'Bolder Brutalities', desc:'You add three options to Brutality. <em>Rive</em>: activate Cleave alongside a different mastery you are using, and add your ability modifier to the damage of the extra attack. <em>Rush</em>: activate Push alongside another mastery, then move up to your Speed without provoking Opportunity Attacks. <em>Stagger</em>: activate Slow alongside another mastery, and the target has Disadvantage on its next save before the end of your next turn.' }
    ],
    15:[
      { name:'Brutal Resurgence', desc:'You regain an expended use of Brutality whenever you use Second Wind to regain Hit Points, and again whenever you use Action Surge.' }
    ],
    18:[
      { name:'Mutilate', desc:"When you hit a Bloodied creature with an attack roll, it makes a CON save (DC 8 + your CHA modifier + PB). On a failure it is <em>Maimed</em> — it can make only one attack when it takes the Attack action — and <em>Sluggish</em> — its Speed is halved and it takes a -2 penalty to AC. The effects last until it regains Hit Points, and once a target fails this save you can't use the feature again until a Long Rest." }
    ],
  },
  'Hell Knight': {
    3:[
      { name:'Diabolical Gift', desc:"<em>Devil's Sight</em>: you see normally in Dim Light and Darkness, magical or not, within 120 ft. <em>Devil's Talents</em>: you know Infernal (another language of your choice if you already know it), and you gain proficiency in <em>Deception</em>, <em>Performance</em>, or <em>Sleight of Hand</em>." },
      { name:'Hell-Forged Weapon', desc:"When you take the Attack action, you can imbue every weapon you're holding with hellfire. A weapon stays transformed until you use this feature again, you fall Unconscious, it spends 1 minute or more beyond 5 ft of you, or you end the effect (no action required). A Hell-Forged Weapon sheds Dim Light in a 5-ft radius and can deal <em>Cold</em>, <em>Fire</em>, or <em>Necrotic</em> damage instead of its normal type — choose when you imbue it." },
      { name:'Infernal Wound', desc:'Your Infernal Wound Die is a d6. When you hit with your Hell-Forged Weapon, you can deal extra damage equal to one roll of the die, of the type chosen when you imbued the weapon, and give the target an infernal wound if it lacks one. A wounded creature takes another die roll of that damage at the start of each of its turns for 1 minute, until it regains HP, or until it or a creature within 5 ft takes an action to stanch the wound. CON modifier uses (minimum once), all regained on a Short or Long Rest.' }
    ],
    7:[
      { name:'Advanced Wounds', desc:"When you roll your Infernal Wound Die, you can apply one effect below; rolling a 6 adds its Devil's Luck rider. Usable once, then not again until the start of your next turn. <em>Purulence of Minauros</em>: each enemy in a 5-ft Emanation from the target takes Acid damage equal to your CON modifier and the target is Poisoned until the end of its next turn — Devil's Luck: each creature damaged takes a -1 penalty to AC until the end of your next turn. <em>Rupture of Cania</em>: the target takes Force damage equal to your CON modifier — Devil's Luck: it subtracts 1d6 from its next save before the end of your next turn. <em>Stygian Gangrene</em>: the target takes Cold damage equal to your CON modifier and can't take Reactions until the start of its next turn — Devil's Luck: its Speed is halved until the end of its next turn." },
      { name:'Infernal Equipment', desc:'<em>Infernal Resilience</em>: whenever you finish a Short or Long Rest, choose Cold, Fire, or Necrotic; while wearing Heavy armor or wielding a Shield you have Resistance to that type until you choose another. <em>Unholy Power</em>: you can treat a roll of 1 on your Infernal Wound Die as a 6.' }
    ],
    10:[
      { name:'Hellfire Surge', desc:'When you use Action Surge while holding a Hell-Forged Weapon, hellfire erupts in a 20-ft Emanation from you that lasts until the end of your next turn. A creature suffering an infernal wound that starts its turn inside the Emanation takes damage equal to two rolls of your Infernal Wound Die instead of one.' }
    ],
    15:[
      { name:"Devil's Misfortune", desc:'Reaction when a creature with an infernal wound hits you with an attack roll: roll your Infernal Wound Die and reduce the damage taken by the number rolled. On a 6 you roll again, to a maximum of three rolls, reducing the damage by the total. If the attack was a Critical Hit, it becomes a normal hit.' }
    ],
    18:[
      { name:'Infernal Bargain', desc:'When you roll a 6 on your Infernal Wound Die three or more times before the start of your next turn, you gain Heroic Inspiration. <em>Infernal Inspiration</em>: expend that Heroic Inspiration to force a creature you can see within 120 ft to reroll a d20 it rolled for a D20 Test. If the new roll makes it succeed, you regain an expended use of Indomitable or Second Wind (your choice); if the new roll makes it fail, you lose HP equal to 3d6 plus your Fighter level.' }
    ],
  },
},

'Monk': {
  'Warrior of Mercy': {
    3:[
      { name:'Hand of Harm', desc:'Once per turn, after hitting with Unarmed Strike spend 1 Focus Point: deal extra Necrotic = 1 Martial Arts die + WIS mod. Target must CON save or be Poisoned until your next turn.' },
      { name:'Hand of Healing', desc:'Magic action, 1 Focus Point: touch a creature to restore 1 Martial Arts die + WIS mod HP and end one condition (Blinded, Deafened, Paralyzed, Poisoned, or Stunned).' },
      { name:'Implements of Mercy', desc:'Proficiency with Healer\'s Kit, Insight, and Medicine.' }
    ],
    6:[{ name:'Physician\'s Touch', desc:'Hand of Healing can end Disease too. Hand of Harm can Paralyze until end of next turn (+1 Focus Point).' }],
    11:[{ name:'Flurry of Healing and Harm', desc:'Use Flurry of Blows without spending Focus Points if you also use Hand of Healing or Hand of Harm this turn.' }],
    17:[{ name:'Hand of Ultimate Mercy', desc:'Action, 5 Focus Points: touch a creature dead ≤24 hours. It returns to life with 4d10+WIS HP. 1/Long Rest.' }],
  },
  'Warrior of the Open Hand': {
    3:[{ name:'Open Hand Technique', desc:'Each hit of Flurry of Blows can impose one effect (target makes save): Push 15 ft (STR save), Topple (DEX save = Prone), or Stagger (can\'t take Reactions until your next turn).' }],
    6:[{ name:'Wholeness of Body', desc:'Bonus Action: regain HP = 3 Martial Arts die rolls. 1/Long Rest.' }],
    11:[{ name:'Fleet Step', desc:'Step of the Wind costs 0 Focus Points once per turn if you already used a Bonus Action.' }],
    17:[{ name:'Quivering Palm', desc:'4 Focus Points: set a creature vibrating on an Unarmed Strike hit. Within 1 day, action to trigger: CON save or drop to 0 HP; on success, 10d10 Necrotic damage.' }],
  },
  'Warrior of Shadow': {
    3:[{ name:'Shadow Arts', desc:'Know Minor Illusion. Cast Darkness, Darkvision, Pass Without Trace, or Silence by spending Focus Points = spell level. See through magical darkness.' }],
    6:[{ name:'Shadow Step', desc:'Bonus Action (from dim light/dark): teleport 60 ft to another dim/dark space. Advantage on first melee attack this turn.' }],
    11:[{ name:'Cloak of Shadows', desc:'Bonus Action, 3 Focus Points: become Invisible until end of turn (ends if you attack, cast, or enter bright light).' }],
    17:[{ name:'Opportunist', desc:'Reaction: when an ally hits a creature within 5 ft of you, make one Unarmed Strike against it.' }],
  },
  'Warrior of the Four Elements': {
    3:[
      { name:'Elemental Attunement', desc:'Learn 2 Elemental Disciplines. Many cost Focus Points to use (1 Focus Point = 1st-level equivalent). Examples: Fangs of the Fire Snake, Fist of Unbroken Air, Rush of the Gale Spirits, Shape the Flowing River, etc.' },
      { name:'Elemental Burst', desc:'When you hit with an Unarmed Strike, spend 1 Focus Point to deal extra elemental damage (Acid/Cold/Fire/Lightning/Thunder) = 1 Martial Arts die.' }
    ],
    6:[{ name:'Environmental Burst', desc:'Elemental Burst also creates a 5-ft radius at impact. Others in range make DEX save or take the same elemental damage (half on success).' }],
    11:[{ name:'Stride of the Elements', desc:'Spend 2 Focus Points: gain Fly or Swim speed = walking speed for 10 minutes.' }],
    17:[{ name:'Elemental Epitome', desc:'Spend 4 Focus Points: resistance to Acid, Cold, Fire, Lightning, Thunder for 1 minute. Once per turn, deal extra 1 Martial Arts die elemental damage on a hit.' }],
  },

  /* ── Unearthed Arcana ── */
  'Tattooed Warrior': {
    3:[
      { name:'Magic Tattoos', desc:'You gain the magic tattoos granted by this subclass, placed anywhere on your body and unaffected by damage or injury; they can look like brands, scars, birthmarks, scales, or any other marking. Tattoo save DCs equal 8 + WIS + PB, and WIS is your spellcasting ability for tattoo spells. On finishing a Long Rest you can reshape one tattoo, swapping its option for another on the same list.' },
      { name:'Beast Tattoos', desc:"You gain two animal tattoos of your choice. <em>Bat</em>: Dancing Lights, plus Blindsight out to 10 ft · <em>Butterfly</em>: Light, and you may use DEX instead of STR for a High Jump's height · <em>Crane</em>: Guidance, and missing with a Flurry of Blows attack gives Advantage on your next attack roll against that creature before the end of your next turn · <em>Horse</em>: Message, and spending 1 Focus Point on Step of the Wind raises your Speed by 10 ft until your next turn · <em>Tortoise</em>: Spare the Dying, and spending 1 Focus Point on Patient Defense gives +1 AC until your next turn." }
    ],
    6:[
      { name:'Celestial Tattoo', desc:'You gain one more tattoo depicting a celestial phenomenon, letting you spend 1 Focus Point to roll your Martial Arts die and add it to a check. <em>Comet</em>: the WIS check of the Search action · <em>Eclipse</em>: the DEX (Stealth) check of the Hide action · <em>Sunburst</em>: the INT check of the Study action.' }
    ],
    11:[
      { name:'Nature Tattoo', desc:'You gain one more tattoo depicting a natural feature, granting Resistance to a damage type you choose: <em>Sea Storm</em> — Cold, Lightning, or Thunder · <em>Volcano</em> — Acid, Fire, or Poison. You can change the chosen type whenever you finish a Short or Long Rest or use Uncanny Metabolism.' }
    ],
    17:[
      { name:'Monster Tattoo', desc:'You gain a tattoo of a mighty creature. <em>Beholder</em>: at the start of your turn spend 1 Focus Point for a hovering Fly Speed equal to your Speed for 10 minutes, and as a Magic action spend 1 Focus Point to fire four rays at targets within 120 ft, each a ranged spell attack (WIS) dealing 1 Martial Arts die + WIS Force damage · <em>Chromatic Dragon</em>: on the Attack action, spend 1 Focus Point to replace one attack with a 30-ft Cone of Acid, Cold, Fire, Lightning, or Poison — DEX save for 2 Martial Arts dice + WIS damage, half on a success · <em>Displacer Beast</em>: when you spend a Focus Point on Flurry of Blows or Step of the Wind, spend 1 more to cast Mirror Image as part of that Bonus Action · <em>Troll</em>: while Bloodied with at least 1 HP you regain 5 + WIS HP at the start of each of your turns, and severed body parts regrow after a Short or Long Rest.' }
    ],
  },
  'Warrior of Intoxication': {
    3:[
      { name:'Bonus Proficiencies', desc:"Gain proficiency in Performance — or, if you already have it, in one skill of your choice from the level 1 Monk list — and proficiency with Brewer's Supplies if you lack it." },
      { name:'Drunken Technique', desc:"Whenever you use Flurry of Blows, your Speed increases by 10 ft until the end of the current turn and your movement during that time doesn't provoke Opportunity Attacks." }
    ],
    6:[
      { name:'Tipsy Sway', desc:'<em>Leap to Your Feet</em>: while Prone, you can stand up by spending only 5 ft of movement rather than half your Speed. <em>Redirect Attack</em>: Reaction when a creature misses you with a melee attack roll — spend 1 Focus Point to make that attack hit one creature of your choice other than the attacker that you can see within 5 ft of yourself.' },
      { name:'Mystic Brew', desc:"On finishing a Short or Long Rest while holding Brewer's Supplies, magically produce one beverage: <em>Cinnamon Dragon</em>, <em>Heavenly Spirit</em>, or <em>Refreshing Dip</em>. Only you benefit; spend 1 minute drinking a pint to gain its effect for 1 hour, or 8 hours if you expend 1 Focus Point when creating it, and any leftover vanishes at your next rest. <em>Cinnamon Dragon</em>: Magic action to exhale toxic flames in a 30-ft Cone — DEX save (DC 8 + WIS + PB) or take Fire damage equal to four rolls of your Martial Arts die and be Poisoned until the end of its next turn, half damage only on a success. <em>Heavenly Spirit</em>: Resistance to Psychic and Radiant damage. <em>Refreshing Dip</em>: whenever you regain HP, regain extra HP equal to one roll of your Martial Arts die." }
    ],
    11:[
      { name:'Master Brewer', desc:"Two more options are added to Mystic Brew. <em>Blue Lightning</em>: whenever you take a Reaction that isn't an Opportunity Attack or casting a spell, make one Unarmed Strike as part of that Reaction. <em>Drunkard's Luck</em>: you gain Heroic Inspiration if you don't have it, and you can give yourself Heroic Inspiration when you roll Initiative without it." }
    ],
    17:[
      { name:'Intoxicated Frenzy', desc:'When you use Flurry of Blows, you can make up to three additional Unarmed Strikes with it — six in total — provided each strike targets a different creature this turn.' }
    ],
  },
  'Warrior of the Mystic Arts': {
    3:[
      { name:'Spellcasting', desc:'Third-caster progression on the Sorcerer list, using WIS as your spellcasting ability and an Arcane Focus as your Spellcasting Focus. You know two cantrips at <strong>3</strong> and a third at <strong>10</strong>, and you start with three prepared level 1 spells, rising to 13 prepared spells at level 20. Slots reach level 2 at <strong>7</strong>, level 3 at <strong>13</strong>, and level 4 at <strong>19</strong>. Each Monk level you can swap one cantrip and one prepared spell.' }
    ],
    6:[
      { name:'Mystic Focus', desc:'Expend a spell slot to regain Focus Points equal to its level (no action required). Bonus Action: spend Focus Points to recover one expended slot of level 4 or lower — <strong>1</strong>: 2 FP, Monk 6 · <strong>2</strong>: 3 FP, Monk 7 · <strong>3</strong>: 5 FP, Monk 13 · <strong>4</strong>: 6 FP, Monk 19.' },
      { name:'Mystic Fighting Style', desc:'When you take the Attack action on your turn, you can replace one of the attacks with a casting of one of your Sorcerer cantrips that has a casting time of an action.' }
    ],
    11:[
      { name:'Focused Strike', desc:'When you use Stunning Strike, whether the target succeeds or fails on the saving throw, it has Disadvantage on saving throws against your spells until the start of your next turn.' }
    ],
    17:[
      { name:'Improved Mystic Fighting Style', desc:'When you take the Attack action on your turn, you can replace two of the attacks with a casting of one of your level 1 or 2 Sorcerer spells that has a casting time of an action.' }
    ],
  },
  'Warrior of Venom': {
    3:[
      { name:'Envenom Weapon', desc:"At the start of your turn, expend 1 Focus Point to coat one Monk weapon you're holding with a toxin drawn from your blood, choosing its effect as you apply it. The toxin lasts 1 minute or until a creature takes damage from the weapon. <em>Slowing Toxin</em>: until the start of your next turn the target's Speed is halved, it can't take Reactions, and it can take either an action or a Bonus Action on its turn, not both. <em>Venom</em>: the target takes Poison damage equal to two rolls of your Martial Arts die." },
      { name:'Potent Arsenal', desc:"You gain a Poisoner's Kit and proficiency with it, and you can craft a Basic Poison in 1 day (8 hours of work). Whenever you deal Poison damage with a Monk feature or a Monk weapon, you can change that damage type to Acid." }
    ],
    6:[
      { name:'Toxic Touch', desc:"Magic action, 1 Focus Point: a creature you touch makes a CON save or has the Poisoned condition for 1 minute, affected by one option of your choice. <em>Intoxicant</em>: it is also Charmed for the duration or until you or an ally damages it. <em>Sedative</em>: it falls asleep and is Unconscious until another creature uses an action to shake it awake. <em>Truth Serum</em>: it can't knowingly tell a lie." }
    ],
    11:[
      { name:'Toxin Refiner', desc:"Your body filters poison: you gain Immunity to Poison damage. Whenever you are subjected to Poison damage, both Envenom Weapon options deal extra Poison damage equal to one roll of your Martial Arts die — you can't gain this benefit again until the end of your next turn. Whenever you ingest a poison, you regain HP equal to one roll of your Martial Arts die." },
      { name:'Toxic Blood', desc:'Whenever a creature hits you with a melee attack roll, the attacker takes 1d6 Poison damage. While you are Bloodied, it instead takes Poison damage equal to one roll of your Martial Arts die.' }
    ],
    17:[
      { name:'Hallucinogenic Breath', desc:'When you take the Attack action, you can expend 2 Focus Points and replace one attack with an exhalation of hallucinogenic vapors at one creature you can see within 30 ft. It makes a CON save, taking Poison damage equal to three rolls of your Martial Arts die and gaining the Frightened condition for 1 minute or until it takes damage (half damage only on a success). While Frightened this way, it must take the Dash action and move away from you by the safest route each turn unless there is nowhere to move.' }
    ],
  },
},

'Paladin': {
  'Oath of Ancients': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Ensnaring Strike, Speak with Animals (1st); Misty Step, Moonbeam (3rd); Plant Growth, Protection from Energy (5th); Ice Storm, Stoneskin (7th); Commune with Nature, Tree Stride (9th).' },
      { name:'Nature\'s Wrath', desc:'Channel Divinity: spectral vines restrain creatures you choose within 10 ft (STR or DEX save, their choice) until end of their next turn.' }
    ],
    7:[{ name:'Aura of Warding', desc:'You and friendly creatures within 10 ft (30 ft at 18th) resist damage from spells.' }],
    15:[{ name:'Undying Sentinel', desc:'When you would drop to 0 HP, drop to 1 HP instead. 1/Long Rest. You no longer age.' }],
    20:[{ name:'Elder Champion', desc:'Action: assume an ancient nature spirit form for 1 minute. Regain 10 HP/turn, cast Paladin spells as Bonus Actions, enemies save at disadvantage vs your spells within 10 ft. 1/Long Rest.' }],
  },
  'Oath of Devotion': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Protection from Evil and Good, Shield of Faith (1st); Aid, Zone of Truth (3rd); Beacon of Hope, Dispel Magic (5th); Freedom of Movement, Guardian of Faith (7th); Commune, Flame Strike (9th).' },
      { name:'Sacred Weapon', desc:'Channel Divinity: imbue a weapon for 1 minute. Add CHA mod to attack rolls. Weapon sheds light (20 ft bright, 20 ft dim).' }
    ],
    7:[{ name:'Aura of Devotion', desc:'You and friendly creatures within 10 ft (30 ft at 18th) cannot be Charmed while you are conscious.' }],
    15:[{ name:'Purity of Spirit', desc:'Permanently under the effects of Protection from Evil and Good.' }],
    20:[{ name:'Holy Nimbus', desc:'Action: sunlight aura 10 ft for 1 minute. Enemies in it take 10 Radiant/turn. Adv. on saves vs Fiend/Undead spells. 1/Long Rest.' }],
  },
  'Oath of Glory': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Guiding Bolt, Heroism (1st); Enhance Ability, Magic Weapon (3rd); Haste, Protection from Energy (5th); Compulsion, Freedom of Movement (7th); Legend Lore, Yolande\'s Regal Presence (9th).' },
      { name:'Inspiring Smite', desc:'After dealing damage with Paladin\'s Smite, distribute temp HP = 2d8+Paladin level among creatures within 30 ft.' },
      { name:'Peerless Athlete', desc:'Channel Divinity: advantage on Athletics and Acrobatics for 10 minutes. Double jump distances.' }
    ],
    7:[{ name:'Aura of Alacrity', desc:'+10 ft to your walking speed. Friendly creatures within 10 ft (30 ft at 18th) also get +10 ft.' }],
    15:[{ name:'Glorious Defense', desc:'Reaction when you or an ally within 10 ft is hit: add CHA mod to AC. If the attack misses, make one weapon attack against the attacker. Uses = CHA mod/Long Rest.' }],
    20:[{ name:'Living Legend', desc:'Bonus Action: legendary presence for 1 minute. Once per turn, a miss becomes a hit. Allies within 30 ft can reroll failed saves (CHA mod times). 1/Long Rest.' }],
  },
  'Oath of Vengeance': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Bane, Hunter\'s Mark (1st); Hold Person, Misty Step (3rd); Haste, Protection from Energy (5th); Banishment, Dimension Door (7th); Hold Monster, Scrying (9th).' },
      { name:'Vow of Enmity', desc:'Channel Divinity: Bonus Action, choose one creature within 10 ft. Advantage on attacks vs it for 1 minute.' }
    ],
    7:[{ name:'Relentless Avenger', desc:'When you hit with an opportunity attack, move up to half your speed immediately after (no OA).' }],
    15:[{ name:'Soul of Vengeance', desc:'Reaction: when a creature under your Vow of Enmity attacks, make one melee weapon attack against it.' }],
    20:[{ name:'Avenging Angel', desc:'Action: grow wings (Fly 60 ft), frightening aura 30 ft for 1 hour. Creatures entering the aura make WIS save or are Frightened. 1/Long Rest.' }],
  },
  'Oath of the Noble Genies': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Thunderwave, Burning Hands (3rd); Gust of Wind, Scorching Ray (5th); Call Lightning, Fly (9th); Conjure Minor Elementals, Fire Shield (13th); Conjure Elemental, Cloudkill (17th).' },
      { name:'Elemental Smite', desc:'When you hit with a weapon attack and expend a spell slot, choose one of four options: Tempest Smite (thunder damage, push 10 ft), Flame Smite (fire damage that jumps to adjacent creature), Stone Smite (bludgeoning damage, target Prone), or Wind Smite (teleport target up to 20 ft to unoccupied space).' },
      { name:'Channel Divinity: Elemental Command', desc:'As an Action, conjure an elemental aura of your choice: air (you and allies gain +10 ft speed), fire (enemies in 10 ft take fire damage on their turn), earth (you gain resistance to bludgeoning/piercing/slashing), or water (create difficult terrain zone).' }
    ],
    7:[{ name:'Elemental Resistance', desc:'You and allies within 10 ft gain resistance to fire, cold, lightning, and thunder damage while you are conscious.' }],
    15:[{ name:'Elemental Reaction', desc:'When a creature within 30 ft takes fire, cold, lightning, or thunder damage, use your Reaction to halve that damage. If the damage is halved, you regain HP equal to half the damage prevented.' }],
    20:[{ name:'Genie Apotheosis', desc:'For 1 minute, you gain a Fly speed equal to your walk speed, immunity to fire, cold, lightning, and thunder damage, and once per turn you can turn one failed D20 Test into a success.' }],
  },


  /* ── Unearthed Arcana ── */
  'Oath of the Spellguard': {
    3:[
      { name:'Guardian Bond', desc:'Magic action, one Channel Divinity use: forge a bond with a willing creature within 5 ft for 1 hour, ending early if you fall Unconscious, if you end it, or if you forge a new one. While the bonded creature is within your reach and is hit by an attack roll, Reaction: add your CHA modifier (minimum +1) to its AC, possibly turning the hit into a miss.' },
      { name:'Oath of the Spellguard Spells', desc:"Always prepared — <strong>3</strong>: Detect Magic, Shield · <strong>5</strong>: See Invisibility, Silence · <strong>9</strong>: Counterspell, Dispel Magic · <strong>13</strong>: Freedom of Movement, Otiluke's Resilient Sphere · <strong>17</strong>: Circle of Power, Hallow." },
      { name:'Spellguard Strike', desc:'Reaction when you see a creature within your reach cast a spell with Verbal, Somatic, or Material components: make one melee attack against it with a weapon or an Unarmed Strike.' }
    ],
    7:[
      { name:'Aura of Concentration', desc:'You and your allies in your Aura of Protection have Advantage on CON saves to maintain Concentration.' }
    ],
    15:[
      { name:'Spell-Breaking Blade', desc:"Immediately after your Spellguard Strike hits, you can cast Counterspell as part of the same Reaction. A slot spent on that Counterspell isn't expended if the spell fails to stop a spell." }
    ],
    20:[
      { name:'Eternal Spellguard', desc:'Bonus Action: empower your Aura of Protection for 1 minute or until you end it (no action required), once per Long Rest or by expending a level 5 spell slot. <em>Bodyguard</em>: your Guardian Bond target has Resistance to all damage while in the aura · <em>Protection from Magic</em>: you and your allies in the aura have Advantage on saves against spells · <em>Spell Ward</em>: spell attack rolls against you and your allies in the aura have Disadvantage.' }
    ],
  },
  'Oathbreaker': {
    3:[
      { name:'Conjure Undead', desc:'Bonus Action, one use of Channel Divinity: summon Skeletons or Zombies (your choice) equal to half your CHA modifier, rounded up, minimum one, in unoccupied spaces within 30 ft. They serve as allies for 1 minute before dissolving into ash, share your Initiative but act right after your turn, and obey your verbal commands — otherwise they Dodge and move to avoid danger.' },
      { name:'Dreadful Aspect', desc:'Immediately after you cast Divine Smite, expend one use of Channel Divinity: each creature of your choice in a 30-ft Emanation makes a WIS save or has the Frightened condition for 1 minute, repeating the save at the end of each of its turns.' },
      { name:'Oathbreaker Spells', desc:'Always prepared — <strong>3</strong>: Hellish Rebuke, Witch Bolt · <strong>5</strong>: Crown of Madness, Darkness · <strong>9</strong>: Fear, Summon Undead · <strong>13</strong>: Blight, Phantasmal Killer · <strong>17</strong>: Contagion, Steel Wind Strike.' }
    ],
    7:[
      { name:'Aura of Hate', desc:'When you — or any allied Fiend or Undead in your Aura of Protection — hits a creature with a melee attack, that attack deals extra Necrotic damage equal to your CHA modifier.' }
    ],
    15:[
      { name:'Supernatural Resistance', desc:'You gain Resistance to Bludgeoning, Piercing, and Slashing damage.' }
    ],
    20:[
      { name:'Dread Lord', desc:'Bonus Action: imbue your Aura of Protection with unholy gloom for 10 minutes or until you end it (no action required). <em>Darkness</em>: magical Darkness fills the aura, and you and your allies inside can see through it. <em>Fear</em>: a Frightened creature that starts its turn in the aura takes 4d10 Psychic damage. <em>Shadow Strike</em>: Bonus Action for a melee spell attack against one creature in the aura, dealing 3d10 + CHA Necrotic damage on a hit. Recharges on a Long Rest, or by expending a level 5 spell slot.' }
    ],
  },
},

/* ── Psion (Unearthed Arcana — playtest) ──
   Metamorph, Psykinetic et Telepath suivent « Psion Update » (oct. 2025).
   Le Psi Warper n'y est pas réimprimé : le document dit qu'il a si bien
   marqué au sondage qu'il n'a pas besoin d'un second passage. Sa version de
   mai 2025 reste donc valide, on la garde telle quelle. */
'Psion': {
  'Metamorph': {
    3:[
      { name:'Metamorph Spells', desc:'Always prepared — <strong>3</strong>: Alter Self, Cure Wounds, Inflict Wounds, Lesser Restoration · <strong>5</strong>: Aura of Vitality, Haste · <strong>7</strong>: Polymorph, Stoneskin · <strong>9</strong>: Contagion, Mass Cure Wounds.' },
      { name:'Mutable Form', desc:'Bonus action, expend one Psionic Energy Die: roll it and gain Temporary HP equal to the roll + your INT modifier (minimum 1). For 1 minute you also gain +5 ft reach, +5 ft Speed, and your Touch-range spells with a casting time of an action reach 10 ft.' },
      { name:'Organic Weapons', desc:'Magic action (or as part of the Attack action, before the roll): reshape a free hand into an organic weapon. It keeps that form until you change it, fall Unconscious, or revert it. Use INT for attack and damage. <em>Bone Blade</em>: Simple melee, Finesse, 1d8 Piercing — Advantage if a non-Incapacitated ally is within 5 ft of the target. <em>Flesh Maul</em>: Simple melee, 1d10 Bludgeoning — the target has Disadvantage on its next STR or CON save. <em>Viscera Launcher</em>: Simple ranged 30/90, 1d6 Acid — +1d6 Acid once per turn on a hit.' }
    ],
    6:[
      { name:'Extra Attack', desc:'Attack twice on the Attack action. You can replace one attack with a Psion cantrip that has a casting time of an action.' },
      { name:'Flesh Weaver', desc:'When you use Mutable Form, expend an additional Psionic Energy Die to gain, while it lasts: <em>Organic Defense</em> (+2 AC) and <em>Empowered Healing</em> (when a spell you cast with a slot restores HP, expend one die and add its roll to the HP regained).' }
    ],
    10:[{ name:'Improved Mutable Form', desc:'Mutable Form lasts 10 minutes and grants one benefit of your choice until it ends: <em>Stony Epidermis</em> (Advantage on CON saves to keep Concentration, plus Resistance to a damage type of your choice), <em>Superior Stride</em> (while unarmoured: Dash as a Bonus Action, and Climb and Swim Speed equal to your Speed), or <em>Unnatural Flexibility</em> (+1 AC, move through spaces as narrow as 1 inch, and spend 5 ft of movement to escape nonmagical restraints or end the Grappled condition).' }],
    14:[{ name:'Life-Bending Weapons', desc:'On a hit with your Organic Weapon, roll one Psionic Energy Die and deal that much extra Necrotic damage — this roll does not expend the die. Alternatively, expend one die: the target takes that much extra Necrotic damage and each creature of your choice in a 30-ft Emanation regains HP equal to the roll + your INT modifier. Once per turn.' }],
  },
  /* Psi Warper — version « The Psion » (mai 2025), non réimprimée dans la
     mise à jour : le document indique qu'elle n'a pas besoin d'un autre test. */
  'Psi Warper': {
    3:[
      { name:'Psi Warper Spells', desc:'Always prepared as you gain levels: Jump, Longstrider · Misty Step, Shatter · Blink, Thunder Step · Dimension Door · Far Step.' },
      { name:'Teleportation', desc:'Cast Misty Step without a spell slot once per Long Rest — or restore that use by expending one Psionic Energy Die (no action required).' },
      { name:'Warp Propel', desc:'When a target fails its save against your Telekinetic Propel, you can teleport it (instead of pushing) to an unoccupied space you can see within 30 ft, horizontal to you.' }
    ],
    6:[
      { name:'Warp Space', desc:'When you cast Shatter, expend one Psionic Energy Die to widen the Sphere to a 20-ft radius.' },
      { name:'Teleporter Combat', desc:'Right after casting Misty Step, you can cast a Psion cantrip with a casting time of an action as part of that Bonus Action.' }
    ],
    10:[{ name:'Duplicitous Target', desc:'Reaction when a creature you can see attacks you: expend a Psionic Energy Die and swap places with a willing, non-Incapacitated creature within 30 ft. That creature becomes the target of the attack.' }],
    14:[{ name:'Mass Teleportation', desc:'Magic action, expend four Psionic Energy Dice: teleport up to your INT modifier of Huge or smaller creatures within 30 ft to spaces you can see within 150 ft. An unwilling creature is unaffected on a successful WIS save.' }],
  },
  'Psykinetic': {
    3:[
      { name:'Psykinetic Spells', desc:'Always prepared — <strong>3</strong>: Cloud of Daggers, Levitate, Shield, Thunderwave · <strong>5</strong>: Slow, Telekinetic Crush · <strong>7</strong>: Otiluke\'s Resilient Sphere, Stone Shape · <strong>9</strong>: Telekinesis, Wall of Force.' },
      { name:'Stronger Telekinesis', desc:'When you cast Mage Hand, its range increases by 30 ft and the spectral hand can carry up to 20 pounds.' },
      { name:'Telekinetic Techniques', desc:'When you use Telekinetic Propel you can roll 1d4 and use that number instead of expending a Psionic Energy Die. When the target fails its save, add one effect: <em>Boost</em> (its Speed +10 ft until the start of your next turn), <em>Disorient</em> (no Opportunity Attacks until the start of its next turn), or <em>Telekinetic Bolt</em> (Force damage equal to the number rolled on the Psionic Energy Die).' }
    ],
    6:[
      { name:'Destructive Trance', desc:'At the start of your turn, expend one Psionic Energy Die: for 10 minutes you gain a Fly Speed of 20 ft and can hover, and when you cast a Psion spell with a spell slot you can roll a Psionic Energy Die and add it to one damage roll of that spell — that roll does not expend the die.' },
      { name:'Rebounding Field', desc:'When you cast Shield in response to being hit and the attack misses, expend one Psionic Energy Die: the attacker makes a DEX save, taking Force damage equal to a die roll + your INT modifier (half as much on a success). You gain Temporary HP equal to the damage dealt, whether the save succeeds or fails.' }
    ],
    10:[{ name:'Enhanced Telekinetic Crush', desc:'When you cast Telekinetic Crush, expend one Psionic Energy Die: the target\'s Speed is halved until the start of your next turn whether it saves or not, and you add the die\'s roll to one damage roll of the spell.' }],
    14:[{ name:'Heightened Telekinesis', desc:'Cast Telekinesis without a spell slot by expending four Psionic Energy Dice instead. Cast that way, you can drop Concentration — the duration becomes 1 minute — and you can target Gargantuan creatures and objects.' }],
  },
  'Telepath': {
    3:[
      { name:'Telepath Spells', desc:'Always prepared — <strong>3</strong>: Bane, Command, Detect Thoughts, Mind Spike · <strong>5</strong>: Counterspell, Slow · <strong>7</strong>: Compulsion, Confusion · <strong>9</strong>: Modify Memory, Yolande\'s Regal Presence.' },
      { name:'Mind Infiltrator', desc:'When you cast Detect Thoughts, expend one Psionic Energy Die so the spell needs no components and no Concentration. With its Read Thoughts effect, a target that fails its WIS save doesn\'t notice you probing its mind.' },
      { name:'Telepathic Distraction', desc:'Reaction when a creature you can see within range of your telepathy hits with an attack roll: roll one Psionic Energy Die and subtract it from the attack roll, possibly turning the hit into a miss. The die is expended only if the attack then misses.' }
    ],
    6:[
      { name:'Bulwark Mind', desc:'At the start of your turn, expend one Psionic Energy Die: for 10 minutes you have Resistance to Psychic damage, and you add a roll of your Psionic Energy Die to every INT, WIS and CHA saving throw — that roll does not expend the die. Unusable while you have the Incapacitated condition.' },
      { name:'Potent Thoughts', desc:'Your telepathy reaches 60 ft, and you add your INT modifier to the damage of any Psion cantrip.' }
    ],
    10:[{ name:'Telepathic Bolstering', desc:'Reaction when you, or a creature you can see within range of your telepathy, fails an ability check or misses an attack: expend one Psionic Energy Die and add its roll to the d20. The die is expended only if the check then succeeds or the attack hits.' }],
    14:[{ name:'Scramble Minds', desc:'Cast Confusion without a spell slot by expending four Psionic Energy Dice instead. Cast that way, the Sphere\'s radius becomes 30 ft and one creature you can see in the area automatically succeeds on its save. While the spell lasts, you choose each affected creature\'s behaviour from the table instead of it rolling.' }],
  },
},

'Ranger': {
  'Beast Master': {
    3:[{ name:'Primal Companion', desc:'Bond with a Primal Beast (Land, Sea, or Sky). Commands it as a Bonus Action. It uses your PB for attacks. Regains HP = 5× PB on Short Rest or when you use Wild Shape.' }],
    7:[{ name:'Exceptional Training', desc:'Your beast can take any action (not just listed ones). Its attacks count as Magical.' }],
    11:[{ name:'Bestial Fury', desc:'Your primal beast can attack twice when it takes the Attack action.' }],
    15:[{ name:'Share Spells', desc:'When you cast a spell targeting yourself, also target your primal beast with the same spell.' }],
  },
  'Fey Wanderer': {
    3:[
      { name:'Dreadful Strikes', desc:'Weapon hit: deal extra 1d4 Psychic damage (1d6 at Lv.11). 1/turn.' },
      { name:'Otherworldly Glamour', desc:'Add WIS mod to CHA checks. Proficiency in Deception, Performance, or Persuasion (your choice).' },
      { name:'Fey Wanderer Spells', desc:'Always prepared: Charm Person (1st); Misty Step (3rd); Dispel Magic (5th); Dimension Door (7th); Mislead (9th).' }
    ],
    7:[{ name:'Beguiling Twist', desc:'Reaction: when a creature within 120 ft succeeds on a Charm or Fright save, redirect that effect to another creature within 30 ft of the first (no save).' }],
    11:[{ name:'Fey Reinforcements', desc:'Cast Summon Fey once per Long Rest without a spell slot (no concentration for first minute). Always prepared.' }],
    15:[{ name:'Misty Wanderer', desc:'Cast Misty Step without a slot (WIS mod/Long Rest). When you do, bring one willing creature within 5 ft with you.' }],
  },
  'Gloom Stalker': {
    3:[
      { name:'Dread Ambusher', desc:'First turn in combat: +10 ft walking speed. When you use the Attack action, make one additional attack (deals +1d8 damage).' },
      { name:'Umbral Sight', desc:'Darkvision 60 ft (or +60 ft if you already have it). You are Invisible to creatures that rely on Darkvision to see you in darkness.' },
      { name:'Gloom Stalker Spells', desc:'Always prepared: Disguise Self (1st); Rope Trick (3rd); Fear (5th); Greater Invisibility (7th); Seeming (9th).' }
    ],
    7:[{ name:'Iron Mind', desc:'Proficiency in WIS saving throws (or INT/CHA if already proficient).' }],
    11:[{ name:'Stalker\'s Flurry', desc:'Once per turn, if you miss an attack, make one more attack against the same target as part of the same action.' }],
    15:[{ name:'Shadowy Dodge', desc:'Reaction: when a creature attacks you, impose disadvantage on that roll.' }],
  },
  'Hunter': {
    3:[
      { name:'Hunter\'s Prey', desc:'Choose one: Colossus Slayer (1d8 extra vs bloodied creatures, 1/turn), Giant Killer (Reaction attack vs Large+ creature that misses you), or Horde Breaker (attack a second adjacent creature).' },
      { name:'Hunter\'s Lore', desc:'Proficiency in 2 of: Animal Handling, Insight, Investigation, Nature, Perception, or Survival.' }
    ],
    7:[{ name:'Defensive Tactics', desc:'Choose one: Escape the Horde (no OA against you), Multiattack Defense (+4 AC after first hit), or Steel Will (advantage vs Frightened).' }],
    11:[{ name:'Multiattack', desc:'Choose: Volley (ranged attack all creatures in 10-ft radius) or Whirlwind Attack (melee attack all creatures within 5 ft).' }],
    15:[{ name:'Superior Hunter\'s Defense', desc:'Choose: Evasion, Stand Against the Tide (redirect misses to another creature), or Uncanny Dodge (halve damage from one attack).' }],
  },
  'Winter Walker': {
    3:[
      { name:'Cold Mastery', desc:'You have Resistance to Cold damage. Your attacks and spells ignore Cold Resistance (but not Immunity). Once per turn when you deal damage to a creature, you can deal an additional 1d6 Cold damage.' },
      { name:'Winter Walker Spells', desc:'Always prepared: Fog Cloud, Ice Knife (3rd); Hold Person, Snilloc\'s Snowball Swarm (5th); Sleet Storm, Slow (9th); Ice Storm, Freedom of Movement (13th); Cone of Cold, Hold Monster (17th).' }
    ],
    7:[{ name:'Winter\'s Cloak', desc:'You ignore difficult terrain caused by ice or snow. You can move across icy surfaces without falling Prone. You can Hide in lightly obscured areas created by blizzards, fog, or falling snow.' }],
    11:[{ name:'Blizzard Strike', desc:'When you hit a creature with a weapon attack, you can expend one spell slot to deal an additional 2d6 Cold damage per slot level. The target\'s speed is reduced by 10 ft until the start of your next turn.' }],
    15:[{ name:'Frozen Tundra', desc:'As an Action, you can create a 30-ft radius zone of supernatural cold centered on you for 1 minute (Concentration). Creatures entering or starting their turn in the zone take 2d8 Cold damage (CON save halves). The area is difficult terrain. 1/Long Rest.' }],
  },


  /* ── Unearthed Arcana ── */
  'Hollow Warden': {
    3:[
      { name:'Hollow Warden Spells', desc:'Always prepared — <strong>3</strong>: Wrathful Smite · <strong>5</strong>: Spike Growth · <strong>9</strong>: Phantom Steed · <strong>13</strong>: Hallucinatory Terrain · <strong>17</strong>: Awaken.' },
      { name:'Wrath of the Wild', desc:"When you cast Hunter's Mark you transform for the spell's duration, your body wreathed in rotten bark or beastly bristles. <em>Ancient Armor</em>: bonus to AC equal to your WIS modifier (min +1). <em>Unnerving Aura</em>: an enemy that starts its turn within a 10-ft Emanation from you makes a WIS save against your spell save DC, and on a failure it can take either an action or a Bonus Action that turn, not both." }
    ],
    7:[
      { name:'Hungering Might', desc:'You gain a bonus to CON saves equal to your WIS modifier (min +1). Once per turn while transformed by Wrath of the Wild and Bloodied, hitting a creature with an attack roll regains you 1d10 + your WIS modifier HP.' }
    ],
    11:[
      { name:'Rot and Violence', desc:"Extra benefits while transformed by Wrath of the Wild. <em>Eerie Aura</em>: a creature that fails its save against Unnerving Aura also takes Necrotic, Poison, or Psychic damage (your choice) equal to your Ranger level, ignoring Resistance. <em>Strangling Roots</em>: when you hit with a weapon attack, you can activate the Sap or Slow mastery property in addition to a different mastery you're already using with that weapon." }
    ],
    15:[
      { name:'Ancient Endurance', desc:"<em>Persistent Hunt</em>: if you drop to 0 HP while transformed by Wrath of the Wild and don't die outright, expend a level 4+ spell slot (no action required) to set your HP to five times the level of that slot instead. <em>Timeless</em>: you have Immunity to the Exhaustion condition." }
    ],
  },
},

'Rogue': {
  'Arcane Trickster': {
    3:[
      { name:'Spellcasting', desc:'INT-based Wizard spellcasting. 3 spells, at least 2 from Enchantment or Illusion. Minor Illusion is always known.' },
      { name:'Mage Hand Legerdemain', desc:'Your Mage Hand is Invisible and can pick locks, pick pockets, and use thieves\' tools.' }
    ],
    9:[{ name:'Magical Ambush', desc:'If hidden when you cast a spell, target has disadvantage on the initial saving throw.' }],
    13:[{ name:'Versatile Trickster', desc:'Bonus Action: designate a creature within 5 ft of your Mage Hand. Advantage on attacks vs it until end of your turn.' }],
    17:[{ name:'Spell Thief', desc:'Reaction when targeted by a spell: caster makes save or loses the spell for 8 hours, and you can cast it once. 1/Long Rest.' }],
  },
  'Assassin': {
    3:[
      { name:'Assassinate', desc:'Advantage on attacks vs creatures that haven\'t taken a turn yet. Hits against Surprised creatures are critical hits.' },
      { name:'Assassin\'s Tools', desc:'Proficiency with Disguise Kit and Poisoner\'s Kit.' }
    ],
    9:[{ name:'Infiltration Expertise', desc:'Spend 7 days + 25 gp to create a flawless false identity.' }],
    13:[{ name:'Impostor', desc:'Perfectly mimic a creature\'s speech, writing, and behavior after 3 hours of observation.' }],
    17:[{ name:'Death Strike', desc:'On a critical hit, double the damage dice before adding modifiers.' }],
  },
  'Soulknife': {
    3:[
      { name:'Psionic Power', desc:'Psionic Energy Dice = 2×PB. Use for: Psi-Bolstered Knack (add die to failed INT/WIS/CHA check) or Psychic Whispers (telepathic link PB creatures for 1 hour).' },
      { name:'Psychic Blades', desc:'Manifest Finesse/Thrown (60 ft) blades dealing 1d6 Psychic. Bonus Action after Attack: make one extra Psychic Blade attack.' }
    ],
    9:[{ name:'Soul Blades', desc:'New uses for Psionic Energy Dice: Homing Strikes (reroll missed attack) or Psychic Teleportation (teleport up to 10× die result in feet).' }],
    13:[{ name:'Psychic Veil', desc:'Invisible for 1 hour (until you deal damage or force a save). 1/Long Rest.' }],
    17:[{ name:'Rend Mind', desc:'Sneak Attack hit with Psychic Blade: target makes WIS save or Stunned until end of next turn. 1/Long Rest.' }],
  },
  'Swashbuckler': {
    3:[
      { name:'Fancy Footwork', desc:'If you melee attack a creature on your turn, it can\'t make opportunity attacks against you for the rest of the turn.' },
      { name:'Rakish Audacity', desc:'Add CHA mod to Initiative. Sneak Attack works when only you and the target are adjacent (no ally required).' }
    ],
    9:[{ name:'Panache', desc:'Bonus Action: Persuasion vs Insight. Hostile = Distracted (disadvantage on attacks vs non-you). Friendly = Charmed for 1 minute.' }],
    13:[{ name:'Elegant Maneuver', desc:'Bonus Action: advantage on your next Acrobatics or Athletics check this turn.' }],
    17:[{ name:'Master Duelist', desc:'Once per Short Rest, when you miss an attack, reroll with advantage.' }],
  },
  'Thief': {
    3:[
      { name:'Fast Hands', desc:'Cunning Action now also allows: Use an Object, pick locks with Thieves\' Tools, or use a magic item (including drinking a potion).' },
      { name:'Second-Story Work', desc:'Climb speed = walking speed. Add DEX mod to jump distances.' }
    ],
    9:[{ name:'Supreme Sneak', desc:'Move ≤ half speed: attempt to Hide as a Bonus Action even if observed.' }],
    13:[{ name:'Use Magic Device', desc:'Ignore class, species, and level requirements for attuning to and using magic items.' }],
    17:[{ name:'Thief\'s Reflexes', desc:'First round of combat: take two turns (normal Initiative and Initiative −10).' }],
  },
  'Scion of the Three': {
    3:[
      { name:'Dark Devotion', desc:'You serve the Dead Three—Bane, Bhaal, and Myrkul. When you use Sneak Attack against a creature that is Bloodied (at or below half its HP maximum), roll one additional Sneak Attack damage die.' },
      { name:'Three-Fold Curse', desc:'Once per Short or Long Rest, you can mark a creature you can see within 60 ft. Until the mark ends (1 hour), you deal maximum damage on Sneak Attacks against it.' }
    ],
    9:[{ name:'Fearful Presence', desc:'When you deal Sneak Attack damage, you can force the target to make a WIS save (DC 8 + PB + INT mod) or become Frightened of you for 1 minute. A Frightened creature repeats the save at the end of each of its turns. 1/Short or Long Rest.' }],
    13:[{ name:'Death\'s Touch', desc:'Once per turn when you deal Sneak Attack damage, you can add your INT modifier (min 1) to the damage roll as Necrotic damage. This damage ignores resistance.' }],
    17:[{ name:'Assassin of the Dead Three', desc:'Your Sneak Attack damage dice increase by one size (d6→d8). You regain one use of Fearful Presence on each Short Rest. When you reduce a creature to 0 HP with Sneak Attack, you regain HP equal to your PB + INT mod.' }],
  },


  /* ── Unearthed Arcana ── */
  'House Agent': {
    3:[
      { name:'House Insignia', desc:"You carry a magical brooch or coin bearing your sponsor's heraldry and can cast spells with it, using CHA as your spellcasting ability. You learn the Friends cantrip and can cast Find Familiar as a Ritual, choosing the Spider form — your sponsor supplies the Material component for the first casting. Once you cast a spell with the insignia, you can't cast that spell again until you finish a Long Rest. If you lose the insignia, your house delivers a replacement when you next finish a Long Rest." },
      { name:'Insignia Spells', desc:'Learned at the listed Rogue levels — <strong>3</strong>: Charm Person · <strong>5</strong>: Suggestion · <strong>9</strong>: Hypnotic Pattern.' },
      { name:'Charming Presence', desc:'You can take the Influence action as a Bonus Action. You also gain proficiency in one skill of your choice: <em>Deception</em> · <em>Intimidation</em> · <em>Performance</em> · <em>Persuasion</em>.' }
    ],
    9:[
      { name:'Backstab', desc:'You have Advantage on attack rolls against creatures within 5 ft of you that are Friendly to you or have the Charmed condition. New Cunning Strike option — <em>Stunning Betrayal</em> (Cost: 4d6): if the target was Friendly or Charmed when you hit it, it has the Stunned condition until the start of your next turn.' }
    ],
    13:[
      { name:'Infiltration Partner', desc:'The familiar you have through Find Familiar gains Darkvision with a range of 120 ft and Truesight with a range of 30 ft. When you cast Find Familiar, or finish a Short or Long Rest while you have a familiar, you can grant it Temporary HP equal to your Rogue level.' },
      { name:'Silver Tongue', desc:"A creature's Hostile attitude no longer imposes Disadvantage on your CHA checks to influence that creature." }
    ],
    17:[
      { name:'Subtle Manipulator', desc:"New Cunning Strike option — <em>Confound</em> (5d6): the target makes a WIS save against your spellcasting DC or has the Charmed condition for 1 minute, repeating the save whenever it takes damage. You can also cast Friends as a Bonus Action, and its target no longer automatically succeeds on the save for being a non-Humanoid or for fighting you. Finally, when a spell of yours that Charmed a target ends, the target doesn't know you Charmed it." }
    ],
  },
  'Magic Stealer': {
    3:[
      { name:'Empower Sneak Attack', desc:"Reaction when a creature you can see within 30 ft casts a level 1+ spell: absorb its energy. Until the end of your next turn, your next Sneak Attack hit deals extra Force damage, rolling a number of d6s equal to the spell's level. You have INT modifier uses (minimum 1), regained on a Long Rest." },
      { name:'Drain Magic', desc:'Magic action: touch a willing creature and end one ongoing level 1 or 2 spell on it; it immediately recovers one expended spell slot of level 2 or lower (its choice). Once per Short or Long Rest.' }
    ],
    9:[
      { name:'Magical Sabotage', desc:"New Cunning Strike options. <em>Spell Susceptibility</em> (2d6): the target has Disadvantage on its next save against a spell, until the start of your next turn · <em>Disrupt Spell</em> (3d6): until the start of your next turn, each spell the target casts requires an INT save or it dissipates with no effect and the action, Bonus Action, or Reaction is wasted — a slot spent on it isn't expended · <em>Steal Resistance</em> (2d6): name a damage type; if the target has Resistance to it, it loses that Resistance and you gain it until the start of your next turn." }
    ],
    13:[
      { name:'Occult Shroud', desc:'Whenever you finish a Long Rest, you can cast Nondetection using INT as your spellcasting ability, targeting only yourself, with the duration increased to 24 hours.' },
      { name:'Improved Drain Magic', desc:'Drain Magic becomes a Bonus Action, can end an ongoing spell of level 1, 2, or 3 on the target, and lets the target recover an expended spell slot of level 3 or lower (its choice).' }
    ],
    17:[
      { name:'Eldritch Implosion', desc:'When you use Empower Sneak Attack, you can force the caster to make a CON save (DC 8 + your DEX modifier + PB). On a failure, the spell dissipates with no effect and the target has the Stunned condition until the start of its next turn.' }
    ],
  },
  'Phantom': {
    3:[
      { name:'Wails from the Grave', desc:'Immediately after you deal Sneak Attack damage on your turn, target a second creature you can see within 30 ft of the first: roll half your Sneak Attack dice (round up) and deal that much Necrotic damage as the dead wail around it. Usable a number of times equal to your DEX modifier (min 1), regained on a Long Rest.' },
      { name:'Whispers of the Dead', desc:'Whenever you finish a Short or Long Rest, a ghostly presence grants you one skill or tool proficiency you lack. You lose it when you use this feature again to choose a different one.' }
    ],
    9:[
      { name:'Tokens of the Departed', desc:"Each Long Rest you gain two soul trinkets — Tiny objects that last until your next Long Rest and teleport back to you if you ever move more than 30 ft away; you gain three at Rogue level 13 and four at 17. <em>Death's Knell</em>: expend and destroy one when you deal Sneak Attack damage to use Wails from the Grave without spending a use. <em>Life Essence</em>: while you hold at least one, you have Advantage on Death Saves and CON saves. <em>Spirit Query</em>: Magic action, expend and destroy one to cast Augury with no components, using DEX. You can also take a Reaction when a creature you can see dies within 30 ft to regain one expended trinket." },
      { name:'Voice of Death', desc:'You can cast Speak with Dead once without a spell slot, requiring no components and using DEX as your spellcasting modifier. You regain this casting when you finish a Short or Long Rest.' }
    ],
    13:[
      { name:'Ghost Walk', desc:'Bonus Action: assume a spectral form for 10 minutes or until you end it (no action required). <em>Flight</em>: Fly Speed of 10 ft with hovering · <em>Hazy Form</em>: attack rolls against you have Disadvantage · <em>Incorporeal Movement</em>: you move through occupied spaces as Difficult Terrain, taking 1d10 Force damage if you end your turn in one. Once per Long Rest, unless you expend and destroy a soul trinket (no action required) to restore the use.' }
    ],
    17:[
      { name:"Death's Friend", desc:"<em>Death's Lament</em>: when you use Wails from the Grave, you can deal its Necrotic damage to the first creature as well as the second. <em>Draw of Death</em>: when you roll Initiative with no soul trinkets remaining, you regain one for Tokens of the Departed." }
    ],
  },
},

'Sorcerer': {
  'Draconic Bloodline': {
    3:[
      { name:'Draconic Resilience', desc:'AC = 13+DEX when unarmored. HP max increases by 1 per Sorcerer level.' },
      { name:'Elemental Affinity', desc:'Choose a damage type (Acid, Cold, Fire, Lightning, Poison). Add CHA mod to one damage roll of spells dealing that type.' }
    ],
    6:[{ name:'Elemental Affinity (Resistance)', desc:'Spend 1 Sorcery Point when using Elemental Affinity to gain resistance to the chosen damage type for 1 hour.' }],
    14:[{ name:'Dragon Wings', desc:'Bonus Action: sprout wings, gain Fly speed = walking speed for 1 hour. 1/Long Rest.' }],
    18:[{ name:'Draconic Presence', desc:'Spend 5 Sorcery Points: 60-ft aura of awe or fear. Creatures that enter or start their turn in it make WIS save or are Charmed (awe) or Frightened (fear) for 1 minute.' }],
  },
  'Wild Magic': {
    3:[
      { name:'Wild Magic Surge', desc:'When you cast a 1st+ spell, the DM can ask you to roll d20. On a 1, roll on the Wild Magic Surge table.' },
      { name:'Tides of Chaos', desc:'Gain advantage on one attack, ability check, or saving throw. The DM may trigger a Wild Magic Surge before you recharge it.' }
    ],
    6:[{ name:'Bend Luck', desc:'Reaction, 2 Sorcery Points: roll 1d4 and add or subtract it from any creature\'s roll within 60 ft.' }],
    14:[{ name:'Controlled Chaos', desc:'Roll twice on Wild Magic Surge table and choose which result to use.' }],
    18:[{ name:'Spell Bombardment', desc:'Once per turn, when you roll max damage on any spell damage die, roll that die again and add it.' }],
  },
  'Aberrant Mind': {
    3:[
      { name:'Psionic Spells', desc:'Always prepared: Arms of Hadar, Dissonant Whispers (1st); Calm Emotions, Detect Thoughts (3rd); Hunger of Hadar, Sending (5th); Evard\'s Black Tentacles, Summon Aberration (7th); Telepathic Bond, Wall of Force (9th).' },
      { name:'Telepathic Speech', desc:'Bonus Action: telepathic link with one creature within 30 ft for CHA mod minutes. Communicate over 1 mile.' }
    ],
    6:[{ name:'Psionic Sorcery', desc:'When casting a Psionic Spell, pay Sorcery Points = spell\'s level to remove all components (except expensive materials).' }],
    14:[{ name:'Revelation in Flesh', desc:'Bonus Action, spend 1+ Sorcery Points for 10 min: 1pt = see invisible; 2pts = swim + breathe water; 3pts = fly; 4pts = squeeze through Tiny spaces.' }],
    18:[{ name:'Warping Implosion', desc:'Action: teleport up to 120 ft. Creatures within 30 ft of origin make STR save or take 3d10 Force and are pulled to origin. 1/Long Rest or 5 Sorcery Points.' }],
  },
  'Clockwork Soul': {
    3:[
      { name:'Clockwork Spells', desc:'Always prepared: Alarm, Protection from Evil and Good (1st); Aid, Lesser Restoration (3rd); Dispel Magic, Protection from Energy (5th); Freedom of Movement, Summon Construct (7th); Greater Restoration, Wall of Force (9th).' },
      { name:'Restore Balance', desc:'Reaction: prevent advantage or disadvantage on any roll made by a creature within 60 ft. Uses = PB/Long Rest.' }
    ],
    6:[{ name:'Bastion of Law', desc:'Magic action, 1-5 Sorcery Points: create a ward on one creature within 30 ft with HP = 5× points spent. Absorbs damage before the creature does.' }],
    14:[{ name:'Trance of Order', desc:'Bonus Action: any d20 roll of 9 or lower = 10, for 1 minute. 1/Long Rest or 5 Sorcery Points.' }],
    18:[{ name:'Clockwork Cavalcade', desc:'In a 30-ft cube: restore 100 HP, repair magic items, dispel spells ≤6th level, deal 6d10 Force to hostiles (CON save half). 1/Long Rest.' }],
  },
  'Spellfire Sorcery': {
    3:[
      { name:'Spellfire Burst', desc:'As a Bonus Action, spend 1–5 Sorcery Points to unleash raw Weave energy. Spend 2 SP to deal 2d6 radiant or fire damage (your choice) to one creature within 60 ft (DEX save halves); or spend 1 SP to grant yourself or an ally within 30 ft temporary HP equal to your CHA mod + SP spent.' },
      { name:'Weave Sense', desc:'You can cast Detect Magic at will without a spell slot.' }
    ],
    6:[{ name:'Counterspell Mastery', desc:'Counterspell is always prepared and doesn\'t count against your spells known. When you successfully counter a spell, regain Sorcery Points equal to the countered spell\'s level (max 5).' }],
    14:[{ name:'Greater Spellfire', desc:'Your Spellfire Burst damage dice increase to d10s. When you spend 4+ Sorcery Points on Spellfire Burst, affected creatures also have Disadvantage on saving throws against your spells until the start of your next turn.' }],
    18:[{ name:'Spellfire Transcendence', desc:'You gain a Fly speed of 60 ft and resistance to fire, radiant, and force damage. When a spell of 5th level or lower targets you, you can use your Reaction to negate it entirely and regain Sorcery Points equal to the spell\'s level. 1/Long Rest.' }],
  },


  /* ── Unearthed Arcana ── */
  'Ancestral Sorcery': {
    3:[
      { name:"Ancestor's Lore", desc:'Add your CHA modifier (minimum +1) to every INT check you make. You also gain proficiency in one skill of your choice among Arcana, History, Investigation, Nature, or Religion.' },
      { name:'Ancestral Spells', desc:"Always prepared — <strong>3</strong>: Command, Guidance, Locate Object, Protection from Evil and Good, Resistance, Spiritual Weapon · <strong>5</strong>: Magic Circle, Spirit Guardians · <strong>7</strong>: Divination, Locate Creature · <strong>9</strong>: Legend Lore, Yolande's Regal Presence." },
      { name:'Visage of the Ancestor', desc:'Choose the form your ancestor takes, whether its likeness in life or a symbolic creature. While your Innate Sorcery is active, that form appears as a spectral haze around you and you have Advantage on any ability check made as part of the Influence action.' }
    ],
    6:[
      { name:'Superior Spell Disruption', desc:'You always have Counterspell and Dispel Magic prepared. While your Innate Sorcery is active, you can cast each of them without expending a spell slot: Counterspell then gives the target Disadvantage on its CON save, and Dispel Magic gives you Advantage on your checks to end ongoing spells. Once you cast one of them this way, you need a Long Rest before casting that spell this way again.' }
    ],
    14:[
      { name:'Ancestral Majesty', desc:'While your Innate Sorcery is active, a magical aura fills a 5-ft Emanation around you. When a creature you can see enters the Emanation or ends its turn there, you can force it to make a CHA save; on a failure it has the Prone condition or the Frightened condition until the end of your next turn (your choice). A creature makes this save only once per turn.' },
      { name:'Steady Spellcaster', desc:"Taking damage can't break your Concentration on Sorcerer spells." }
    ],
    18:[
      { name:"Ancestor's Ward", desc:'While your Innate Sorcery is active, you have Advantage on saves against spells. Once during a use of Innate Sorcery, when you fail a save against a spell, you can choose to succeed instead.' }
    ],
  },
  'Defiled Sorcery': {
    3:[
      { name:'Defile and Empower', desc:"Once per turn when you roll damage for a spell cast with a spell slot, roll unexpended Hit Point Dice up to half the slot's level (round up, min one die) and add the total to one damage roll; those dice are expended. <em>Life Steal</em>: instead target a creature you can see within 30 ft — it makes a CON save vs your spell save DC (creatures Immune to Exhaustion succeed automatically), and on a failure you roll and expend its Hit Point Dice instead, up to half the slot's level (round down, min one die). Once a creature fails that save, Life Steal is unavailable until a Long Rest unless you spend 3 Sorcery Points (no action required)." },
      { name:'Defiler Spells', desc:'Always prepared — <strong>3</strong>: Blindness/Deafness, Inflict Wounds, Ray of Enfeeblement, Ray of Sickness · <strong>5</strong>: Bestow Curse, Vampiric Touch · <strong>7</strong>: Blight, Hallucinatory Terrain · <strong>9</strong>: Antilife Shell, Contagion.' }
    ],
    6:[
      { name:'Corrupted Caster', desc:"<em>Defiler's Ward</em>: when you take a Bonus Action to turn Sorcery Points into a spell slot, gain Temp HP equal to the total of d6s rolled equal to the slot's level; while you have Temp HP, a creature that hits you with a melee attack roll takes Necrotic or Poison damage (your choice) equal to your CHA modifier. <em>Strengthened Rot</em>: damage from your Sorcerer spells and features ignores Resistance to Necrotic and Poison damage." }
    ],
    14:[
      { name:'Withering Aura', desc:"While your Innate Sorcery is active, a 15-ft Emanation of defiling magic surrounds you. <em>Defiling Shroud</em>: when an enemy in the aura hits you with an attack roll, reduce that attack's total damage by your CHA modifier. <em>Essence Siphon</em>: when an enemy dies in the aura, regain 1d4 Sorcery Points — only once until you use Innate Sorcery again." }
    ],
    18:[
      { name:'Superior Defiler', desc:"<em>Fouled Soul</em>: you have Immunity to the Poisoned and Exhaustion conditions. <em>Furthered Defilement</em>: your Withering Aura grows to a 30-ft Emanation, and enemies can't regain Hit Points while inside it." }
    ],
  },
  'Demonic Sorcery': {
    3:[
      { name:'Abyssal Rupture', desc:'When you use Innate Sorcery, you tear open a 10-ft-radius Sphere of Abyssal energy centered on a point you can see within 30 ft. On activation and as a Bonus Action while Innate Sorcery is active, choose one option below; at the start of each of your turns you can move the Sphere to another point you can see within 30 ft. <em>Demonic Lash</em>: melee spell attack against a target within 5 ft of the rupture — on a hit, 1d8 Slashing damage, and a Large or smaller target can be pulled up to 10 ft toward the center. <em>Terrifying Screams</em>: each creature in the rupture makes a WIS save against your spell save DC or takes 1d4 Psychic damage.' },
      { name:'Demonic Spells', desc:'Always prepared — <strong>3</strong>: Bane, Dissonant Whispers, Spike Growth, Web · <strong>5</strong>: Bestow Curse, Dispel Magic · <strong>7</strong>: Giant Insect, Hallucinatory Terrain · <strong>9</strong>: Contact Other Plane, Modify Memory.' }
    ],
    6:[
      { name:'Abyssal Realm', desc:"When you spend at least 1 Sorcery Point as part of a Magic action or a Bonus Action on your turn, you can flood either a 10-ft Emanation from yourself or the Sphere of your Abyssal Rupture with one layer of the Abyss (save DC equals your spell save DC). <em>Gaping Maw's Frenzy</em>: name a horizontal direction; each creature in the area that fails a CHA save must spend as much movement as possible going that way by the safest route at the start of its next turn. <em>Maze of Azzatar</em>: each creature makes an INT save, and on a failure you have the benefits of the Invisible condition against it until the start of your next turn. <em>Slime Pits' Haze</em>: each creature makes a CON save or gains your choice of the Charmed or Poisoned condition until the start of your next turn." }
    ],
    14:[
      { name:'Abyssal Conduit', desc:'<em>Rupture Expansion</em>: your Abyssal Rupture becomes a 30-ft-radius Sphere, and its area is Difficult Terrain for your enemies. <em>Fiendish Servant</em>: you always have Summon Fiend prepared, and you can cast it without Concentration — that casting lasts 1 minute and you must choose Demon. The summoned Fiend has Advantage on attack rolls while inside your Abyssal Rupture.' }
    ],
    18:[
      { name:'Abyssal Explosion', desc:"Magic action: fill a 30-ft-radius Sphere with an explosion of Abyssal energy. Each creature in it makes a CON save against your spell save DC; on a failure it takes 8d6 Force damage if it isn't a Fiend, and it has the Incapacitated condition until the start of your next turn. Once per Long Rest, unless you spend 7 Sorcery Points (no action required) to restore the use." }
    ],
  },
  'Faerzress Sorcery': {
    3:[
      { name:'Faerzress Spells', desc:'Always prepared — <strong>3</strong>: Faerie Fire, Magic Weapon, Misty Step, Witch Bolt · <strong>5</strong>: Nondetection, Sending · <strong>7</strong>: Arcane Eye, Stone Shape · <strong>9</strong>: Passwall, Scrying.' },
      { name:'Faerzress Zone', desc:'Magic action, 3 Sorcery Points: flood an area within 120 ft, no larger than a 40-ft Cube, with faerzress for 24 hours. Inside it, creatures automatically succeed on saves against Divination effects and magical sensors cannot enter, teleportation of 1 mile or more into or out of the area is blocked, and the area is lit by Dim Light in which Darkvision sees color and grants Advantage on WIS (Perception) checks relying on sight. Filling the same area every day for 365 days makes it permanent.' },
      { name:'Immunity to Faerzress', desc:'You ignore the detrimental effects of faerzress. Creatures in a faerzress area do not automatically succeed on saves against your Divination spells, and sensors created by your spells, such as Clairvoyance and Arcane Eye, can enter such an area. When you teleport yourself or others, those creatures may cross into or out of faerzress no matter the distance.' }
    ],
    6:[
      { name:'Faerzress Affinity', desc:'You gain Resistance to Lightning damage and Darkvision out to 60 ft, or +30 ft of range if you already have Darkvision, and you discern color in Darkness. You also have Advantage on WIS (Perception) checks to see in Dim Light or Darkness, and your Immunity to Faerzress extends to allies within 30 ft.' }
    ],
    14:[
      { name:'Faerzress Spell', desc:'When one or more creatures fail a save against a spell you cast, spend 1 Sorcery Point to lace one of those targets with faerzress for 1 minute: it cannot teleport, it cannot cast Divination spells, and it has Disadvantage on saves against Divination spells.' },
      { name:'Faerzress Step', desc:'You always have Teleport prepared and can cast it once without expending a spell slot, regaining that use on a Long Rest. In addition, whenever you roll on the Teleportation Outcome table, you may instead choose any outcome available for your familiarity.' }
    ],
    18:[
      { name:'Faerzress Form', desc:'When you use your Innate Sorcery, you can become pure faerzress energy for 1 minute, keeping your shape, personality, memories, speech, and game statistics; your equipment does not transform but stays usable. You gain Immunity to the Grappled, Paralyzed, Petrified, Poisoned, Prone, and Restrained conditions, Resistance to every damage type except Force and Psychic, and a Fly Speed equal to your Speed with hovering, moving through creatures and objects as Difficult Terrain but taking 1d10 Force damage if you end your turn inside an object. Once per Long Rest, or spend 7 Sorcery Points to restore the use.' }
    ],
  },
  'Shadow Sorcery': {
    3:[
      { name:'Eyes of the Dark', desc:'You have Darkvision out to 120 ft and Blindsight out to 10 ft. You can also see normally through the Darkness created by any spell you cast.' },
      { name:'Shadow Spells', desc:'Always prepared — <strong>3</strong>: Bane, Darkness, Inflict Wounds, Pass Without Trace · <strong>5</strong>: Hunger of Hadar, Summon Undead · <strong>7</strong>: Greater Invisibility, Phantasmal Killer · <strong>9</strong>: Contagion, Creation.' }
    ],
    6:[
      { name:'Spirits of Ill Omen', desc:'You can cast Summon Undead without its Material component, and once per Long Rest without a spell slot. Whenever you start casting it, you can modify it to require no Concentration; that casting then lasts 1 minute and ends early if you cast the spell again.' }
    ],
    14:[
      { name:'Shadow Walk', desc:'While you are in Dim Light or Darkness, you can take a Bonus Action to teleport up to 120 ft to an unoccupied space you can see that is also in Dim Light or Darkness.' }
    ],
    18:[
      { name:'Umbral Form', desc:'Bonus Action: adopt a shadowy form for 1 minute, until you have the Incapacitated condition, or until you end it (no action required). <em>Incorporeal Movement</em>: you move through occupied spaces as Difficult Terrain, taking 1d10 Force damage if you end your turn in one · <em>Shadow Resilience</em>: Resistance to all damage except Force and Radiant · <em>Strength of the Grave</em>: if you would drop to 0 HP without dying outright, make a CHA save (DC 5 + half the damage taken) to set your HP to three times your Sorcerer level instead. Once per Long Rest, unless you spend 6 Sorcery Points (no action required) to restore the use.' }
    ],
  },
},

'Warlock': {
  'The Archfey': {
    3:[
      { name:'Patron Spells', desc:'Always prepared: Calm Emotions, Faerie Fire, Misty Step, Phantasmal Force, Sleep.' },
      { name:'Steps of the Fey', desc:'When you cast Misty Step: also Charm one creature within 10 ft of your origin (CHA save) or Frighten one until end of your next turn.' }
    ],
    6:[{ name:'Misty Escape', desc:'Reaction when you take damage: become Invisible and teleport 60 ft. Invisibility lasts until start of your next turn. 1/Short or Long Rest.' }],
    10:[{ name:'Beguiling Defenses', desc:'Immune to Charmed. Reaction when a creature tries to Charm you: it must make WIS save or become Charmed by you for 1 minute. 1/Long Rest.' }],
    14:[{ name:'Bewitching Magic', desc:'When you cast an Enchantment or Illusion spell with a Pact slot, also cast Misty Step for free as part of the same action.' }],
  },
  'The Celestial': {
    3:[
      { name:'Patron Spells', desc:'Always prepared: Cure Wounds, Guiding Bolt (1st); Flaming Sphere, Lesser Restoration (3rd); Daylight, Revivify (5th); Guardian of Faith, Wall of Fire (7th); Flame Strike, Mass Cure Wounds (9th).' },
      { name:'Healing Light', desc:'Bonus Action: spend dice from a pool of d6s (= 1+Warlock level) to restore HP. Refills on Long Rest.' }
    ],
    6:[{ name:'Radiant Soul', desc:'Resistance to Radiant and Fire damage. Add CHA mod to one damage roll of spells dealing Radiant or Fire.' }],
    10:[{ name:'Celestial Resilience', desc:'After a Short or Long Rest, you and up to 5 allies gain temp HP = Warlock level + CHA mod.' }],
    14:[{ name:'Searing Vengeance', desc:'When you are restored from 0 HP, each creature within 30 ft makes DEX save or takes 2d8+CHA Radiant and is Blinded until end of your next turn. You can also fly half your speed.' }],
  },
  'The Fiend': {
    3:[
      { name:'Patron Spells', desc:'Always prepared: Burning Hands, Command (1st); Blindness/Deafness, Scorching Ray (3rd); Fireball, Stinking Cloud (5th); Fire Shield, Wall of Fire (7th); Flame Strike, Hallow (9th).' },
      { name:'Dark One\'s Blessing', desc:'When you reduce a hostile creature to 0 HP, gain temp HP = CHA mod + Warlock level.' }
    ],
    6:[{ name:'Dark One\'s Own Luck', desc:'Add 1d10 to one ability check or saving throw. 1/Short or Long Rest.' }],
    10:[{ name:'Fiendish Resilience', desc:'After a Short or Long Rest, choose a damage type. Gain resistance to it until next Short or Long Rest.' }],
    14:[{ name:'Hurl Through Hell', desc:'Reaction when you hit a creature: it disappears and travels through Hell. It returns at start of your next turn, Incapacitated, and takes 8d10 Psychic (if not a Fiend). 1/Long Rest.' }],
  },
  'The Great Old One': {
    3:[
      { name:'Patron Spells', desc:'Always prepared: Detect Thoughts, Dissonant Whispers (1st); Phantasmal Force, Sending (3rd); Hunger of Hadar, Telekinesis (5th); Summon Aberration, Black Tentacles (7th); Telepathic Bond, Weird (9th).' },
      { name:'Awakened Mind', desc:'Bonus Action: telepathic link with one creature within 30 ft for 10 minutes. No shared language required. 1/Long Rest.' }
    ],
    6:[{ name:'Entropic Ward', desc:'Reaction: impose disadvantage on one attack roll vs you. If it misses, advantage on your next attack vs it. 1/Short or Long Rest.' }],
    10:[{ name:'Thought Shield', desc:'Thoughts can\'t be read. Resistance to Psychic damage. When you take Psychic damage, the attacker takes the same amount.' }],
    14:[{ name:'Create Thrall', desc:'Action: touch an incapacitated Humanoid. It is Charmed (cured by Remove Curse) and you share a telepathic link with it over any distance on the same plane.' }],
  },

  /* ── Unearthed Arcana ── */
  'Hexblade Patron': {
    3:[
      { name:'Hexblade Spells', desc:'Always prepared — <strong>3</strong>: Arcane Vigor, Hex, Shield, Wrathful Smite · <strong>5</strong>: Bestow Curse, Conjure Barrage · <strong>7</strong>: Freedom of Movement, Staggering Smite · <strong>9</strong>: Animate Objects, Steel Wind Strike.' },
      { name:"Hexblade's Curse", desc:"Bonus Action: curse one creature you can see within 30 ft for 1 minute; it ends early if you use the feature again, dismiss it, or die. Casting a spell with a slot that curses a target can apply the curse instead of the Bonus Action, and the curse then lasts 1 minute or the spell's duration, whichever is longer. <em>Hungering Hex</em>: you regain 1d8 + CHA HP when the cursed target drops to 0 HP. <em>Accursed Shield</em>: +2 AC while wearing no armor and wielding no Shield, whenever you are within 10 ft of the cursed target. Uses equal to your CHA modifier (minimum once), all regained on a Long Rest." },
      { name:'Unyielding Will', desc:'When you succeed on a save to maintain Concentration, each creature of your choice in a 10-ft Emanation from you takes 2d6 Necrotic damage; usable again at the start of your next turn. When you fail such a save, you can choose to succeed instead and gain Temporary HP equal to 1d10 + your Warlock level, once per Long Rest.' }
    ],
    6:[
      { name:'Malign Brutality', desc:'<em>Harrowing Hex</em>: after casting a level 1+ spell with a casting time of an action, make one weapon attack as a Bonus Action. <em>Hindering Curse</em>: when you hit the cursed target with an attack roll, it has Disadvantage on its next save before the start of your next turn. <em>Inescapable Hex</em>: when the cursed target ends its turn 30 ft or further from you, you can move up to your Speed straight toward it.' }
    ],
    10:[
      { name:'Armor of Hexes', desc:"Reaction when you take damage from the target cursed by your Hexblade's Curse: reduce that damage by an amount equal to your Warlock level." }
    ],
    14:[
      { name:'Masterful Hex', desc:"<em>Accursed Critical</em>: your attack rolls against the cursed target score a Critical Hit on a 19 or 20. <em>Explosive Hex</em>: when you damage the cursed target, it and each creature of your choice in a 30-ft Emanation from it take 3d6 Necrotic, Psychic, or Radiant damage (your choice) and have their Speed reduced by 10 ft until the start of your next turn — once per Long Rest, or restored by expending a Pact Magic slot (no action required). <em>Hex Restoration</em>: regain one use of Hexblade's Curse on a Short Rest or when you use Magical Cunning." }
    ],
  },
  'Primordial Patron': {
    3:[
      { name:'Elemental Node', desc:"Choose an element, which sets the damage type of your subclass features (<em>Air</em> Thunder · <em>Earth</em> Acid · <em>Fire</em> Fire · <em>Water</em> Cold); you can change it whenever you gain a level. Magic action: create a 5-ft-radius Sphere of that element centered on a point within 60 ft, and move it up to 30 ft as a Bonus Action on later turns. A creature other than you makes a DEX save against your spell save DC — when the node appears, when it moves into its space, and when it enters the node or ends its turn there (once per turn) — taking 1d6 damage of your element's type, or half on a success. It lasts 1 minute, until you dismiss it (no action required), or until you create another node; once per Short or Long Rest, or expend a Pact Magic spell slot (no action) to restore the use. Damage rises to 2d6 at Warlock level 6 and 3d6 at level 14." },
      { name:'Elemental Spells', desc:"Always prepared, the primordial spells plus those of your chosen element — <strong>3</strong>: Chromatic Orb, Darkvision · <em>Air</em> Feather Fall, Shatter · <em>Earth</em> Entangle, Knock · <em>Fire</em> Burning Hands, Heat Metal · <em>Water</em> Alter Self, Ice Knife. <strong>5</strong>: Elemental Weapon · <em>Air</em> Fly · <em>Earth</em> Plant Growth · <em>Fire</em> Fireball · <em>Water</em> Water Walk. <strong>7</strong>: Summon Elemental (the spirit's element matches yours) · <em>Air</em> Freedom of Movement · <em>Earth</em> Vitriolic Sphere · <em>Fire</em> Wall of Fire · <em>Water</em> Control Water. <strong>9</strong>: Commune with Nature · <em>Air</em> Steel Wind Strike · <em>Earth</em> Wall of Stone · <em>Fire</em> Flame Strike · <em>Water</em> Cone of Cold." }
    ],
    6:[
      { name:'Elemental Haven', desc:'Your node shields you. <em>Elemental Protection</em>: while within your node, you gain a bonus to AC equal to your CHA modifier (minimum of 1). <em>Elemental Teleport</em>: Bonus Action to teleport into your node or the nearest unoccupied space within 5 ft of it, CHA modifier times (minimum of once) per Long Rest.' }
    ],
    10:[
      { name:'Primeval Protection', desc:"<em>Elemental Fortitude</em>: you have Resistance to your chosen element's damage type, and Immunity to it while within your Elemental Node. <em>Node Improvement</em>: your Elemental Node becomes a 10-ft-radius Sphere." }
    ],
    14:[
      { name:'Elemental Harbinger', desc:"<em>Elemental Vortex</em>: whenever you expend a Pact Magic spell slot while within your node, one creature you choose within 30 ft of the node must succeed on a STR save or be pulled up to 15 ft toward its center. <em>Node Improvement</em>: your node now lasts up to 1 hour. <em>Primordial Herald</em>: while within your node, you can cast Planar Ally without expending a spell slot by speaking your patron's name — usable again only after you finish 2d4 Long Rests." }
    ],
  },
  'Sorcerer-King Patron': {
    3:[
      { name:'Sorcerer-King Spells', desc:'Always prepared — <strong>3</strong>: Command, Compelled Duel, Hold Person, Mind Spike, Wrathful Smite · <strong>5</strong>: Fear, Sending · <strong>7</strong>: Compulsion, Staggering Smite · <strong>9</strong>: Dominate Person, Synaptic Static. <em>Psionic Casting</em>: cast spells from this table without Verbal or Material components, except Materials that are consumed or have a listed cost.' },
      { name:"Tyrant's Herald", desc:'<em>Intimidating Presence</em>: gain proficiency in Intimidation if you lack it, plus Expertise in that skill. <em>Voice of Tyranny</em>: cast Command as a Bonus Action without expending a spell slot, a number of times equal to your CHA modifier (min once), regaining all uses on a Long Rest.' }
    ],
    6:[
      { name:'Decisive Edict', desc:'When you cast a spell using a Pact Magic slot, profane power can erupt in a 30-ft Emanation from you; for each creature you can see in it, choose <em>Marshal</em>: it has Advantage on attack rolls until the end of its next turn · <em>Oppress</em>: it must succeed on a WIS save vs your spell save DC or be Frightened until the end of its next turn. Once per Short or Long Rest, and you also regain it when you use Magical Cunning.' }
    ],
    10:[
      { name:'Vindictive Rebuke', desc:'Reaction when an enemy hits you with an attack roll: it rerolls the d20 and must use the new roll. If the attack then misses, that creature takes Psychic damage equal to your Warlock level. You have CHA modifier uses (min once), regained on a Long Rest.' }
    ],
    14:[
      { name:'Absolute Tyranny', desc:"Whenever you cast Command, you can target one additional creature within the spell's range, and any creature Frightened by you automatically fails its save against your Command." }
    ],
  },
  'Undead Patron': {
    3:[
      { name:'Form of Dread', desc:"Bonus Action: become an avatar of your patron's dreadful power for 1 minute, until you have the Incapacitated condition, or until you end it (no action required); usable a number of times equal to your CHA modifier (min 1) per Long Rest. <em>Facsimile of Life</em>: Temp HP equal to 1d10 + your Warlock level. <em>Frightful Avatar</em>: Immunity to the Frightened condition, and once per turn when you hit a creature with an attack roll you can force a WIS save against your spell save DC or it is Frightened until the end of your next turn." },
      { name:'Undead Spells', desc:'Always prepared — <strong>3</strong>: Blindness/Deafness, False Life, Phantasmal Force, Ray of Sickness · <strong>5</strong>: Speak with Dead, Vampiric Touch · <strong>7</strong>: Death Ward, Phantasmal Killer · <strong>9</strong>: Antilife Shell, Cloudkill.' }
    ],
    6:[
      { name:'Grave Touched', desc:"<em>Arcane Necrosis</em>: Necrotic damage you deal with spells or attack rolls ignores Resistance to Necrotic damage, and once per turn while using Form of Dread you can change a damaging spell's damage type to Necrotic. <em>Undead Endurance</em>: you gain no Exhaustion from dehydration, malnutrition, or suffocation, you don't need to sleep, and magic can't put you to sleep." }
    ],
    10:[
      { name:'Necrotic Husk', desc:"<em>Necrotic Resilience</em>: Resistance to Necrotic damage, which becomes Immunity while you use Form of Dread. <em>Unholy Resuscitation</em>: if you drop to 0 HP and don't die outright, creatures of your choice in a 30-ft Emanation from you make a CON save against your spell save DC, taking 2d10 + your Warlock level Necrotic damage, half on a success; your HP then changes to 10 times your CHA modifier (min 10) and you gain 1 Exhaustion level. Once per Short or Long Rest." }
    ],
    14:[
      { name:'Superior Dread', desc:'Added benefits while you use Form of Dread. <em>Flight</em>: Fly Speed equal to your Speed, with hovering. <em>Profane Casting</em>: Warlock spells from the Conjuration or Necromancy schools need no Verbal, Somatic, or Material components, except components that are consumed or have a listed cost. <em>Vitality Siphon</em>: once per turn when you deal Necrotic damage, you regain HP equal to your CHA modifier (min 1).' }
    ],
  },
  'Vestige Patron': {
    3:[
      { name:'Vestige Companion', desc:"A Small Celestial, Fiend, or Undead companion (choose the type) with AC 13 + your CHA modifier, HP 4 + four times your Warlock level, Fly 30 ft (hover), and your PB added to its checks and saves. It acts on your turn but takes only the Dodge action unless you spend a Bonus Action to command it or sacrifice one of your attacks for its <em>Vestige's Strike</em> (your spell attack bonus, reach 5 ft or range 60 ft, 1d6 + 3 + CHA Fire, Necrotic, or Radiant by type). Once per day as a Bonus Action it uses <em>Divine Power</em> — <em>Cursed Invocation</em> (Undead): curse a creature within 30 ft for 1 minute, giving it Disadvantage on attacks against you and the vestige · <em>Fiendish Swap</em> (Fiend): you and the vestige teleport and swap places within 60 ft · <em>Healing Touch</em> (Celestial): a touched creature regains 2d8 + CHA HP and ends Blinded, Deafened, or Poisoned. At 0 HP it disappears until you spend 1 minute manifesting it again; a Magic action dismisses it to a pocket dimension or returns it within 30 ft, and each Long Rest you can resummon it in a new form and type." },
      { name:'Vestige Spells', desc:"Choose one Cleric Domain — <em>Life</em> · <em>Light</em> · <em>Trickery</em> · <em>War</em>. Its Domain Spells become Warlock spells for you and are always prepared once your Warlock level equals the Cleric level listed for them on that Domain's table." }
    ],
    6:[
      { name:'Vestige Power', desc:'Your Vestige Companion regains its use of Divine Power whenever you finish a Short or Long Rest, and whenever you use your Magical Cunning feature. While you are within 30 ft of the vestige, you also have Resistance to the same damage types it has.' }
    ],
    10:[
      { name:'Vestige Recovery', desc:'When your Vestige Companion would drop to 0 HP, you can take a Reaction and expend a Pact Magic spell slot to leave it at its Hit Point maximum instead and teleport it to an unoccupied space within 30 ft of you. Once per Long Rest.' }
    ],
    14:[
      { name:'Semblance of Life', desc:'Once per Long Rest, while the vestige is within 90 ft, cast Summon Celestial, Summon Fiend, or Summon Undead (matching its type) without a spell slot or Material components. The vestige becomes the summoned creature and uses that stat block for 1 minute, at a spell level equal to half your Warlock level (round down, maximum 9), then returns to its previous form.' }
    ],
  },
},

'Wizard': {
  'Abjurer': {
    3:[
      { name:'Abjuration Savant', desc:'Add two Wizard Abjuration spells of level 2 or lower to your spellbook for free, and one more Abjuration spell each time you gain access to a new level of spell slots.' },
      { name:'Arcane Ward', desc:"When you cast an Abjuration spell with a spell slot, you can raise a ward on yourself that lasts until your next Long Rest, with a HP maximum equal to twice your Wizard level + INT. It takes your damage for you — your Resistances and Vulnerabilities apply first — and once at 0 HP it stops absorbing but its magic remains. Casting an Abjuration spell with a slot restores twice the slot's level in HP; a Bonus Action spending a slot does the same. Once per Long Rest." }
    ],
    6:[
      { name:'Projected Ward', desc:"Reaction when a creature you can see within 30 ft takes damage: your Arcane Ward absorbs it instead. If that drops the ward to 0 HP, the warded creature takes what's left." }
    ],
    10:[
      { name:'Spell Breaker', desc:"You always have Counterspell and Dispel Magic prepared. You can cast Dispel Magic as a Bonus Action and add your PB to its ability check. When you cast either spell with a spell slot and it fails to stop a spell, the slot isn't expended." }
    ],
    14:[
      { name:'Spell Resistance', desc:'You have Advantage on saving throws against spells, and Resistance to the damage of spells.' }
    ],
  },
  'Diviner': {
    3:[
      { name:'Divination Savant', desc:'Add two Wizard Divination spells of level 2 or lower to your spellbook for free, and one more Divination spell each time you gain access to a new level of spell slots.' },
      { name:'Portent', desc:'When you finish a Long Rest, roll two d20s and record them. You can replace any D20 Test made by you or by a creature you can see with one of these rolls — decided before the roll, and only once per turn. Each is spent once, and unused rolls are lost at your next Long Rest.' }
    ],
    6:[
      { name:'Expert Divination', desc:'When you cast a Divination spell using a level 2+ spell slot, you regain one expended spell slot. It must be of a lower level than the one you spent, and no higher than level 5.' }
    ],
    10:[
      { name:'The Third Eye', desc:'Bonus action, once per Short or Long Rest — choose <em>Darkvision</em> (120 ft), <em>Greater Comprehension</em> (you can read any language), or <em>See Invisibility</em> (cast it without a spell slot). The benefit lasts until you start a Short or Long Rest.' }
    ],
    14:[
      { name:'Greater Portent', desc:'You roll three d20s for your Portent feature instead of two.' }
    ],
  },
  'Evoker': {
    3:[
      { name:'Evocation Savant', desc:'Add two Wizard Evocation spells of level 2 or lower to your spellbook for free, and one more Evocation spell each time you gain access to a new level of spell slots.' },
      { name:'Potent Cantrip', desc:"When you cast a damaging cantrip at a creature and miss with the attack roll, or the target succeeds on its saving throw, it still takes half the cantrip's damage — but suffers none of the cantrip's other effects." }
    ],
    6:[
      { name:'Sculpt Spells', desc:"When you cast an Evocation spell that affects other creatures you can see, choose a number of them equal to 1 + the spell's level. They automatically succeed on their saving throws against it, and take no damage where they would normally take half." }
    ],
    10:[
      { name:'Empowered Evocation', desc:'Whenever you cast a Wizard spell from the Evocation school, you can add your INT modifier to one of its damage rolls.' }
    ],
    14:[
      { name:'Overchannel', desc:'When you cast a damaging Wizard spell with a level 1–5 spell slot, you can deal maximum damage with it on that turn. The first use costs nothing; every further use before a Long Rest deals you 2d12 Necrotic per level of the slot, rising by 1d12 each time, and that damage ignores Resistance and Immunity.' }
    ],
  },
  'Illusionist': {
    3:[
      { name:'Illusion Savant', desc:'Add two Wizard Illusion spells of level 2 or lower to your spellbook for free, and one more Illusion spell each time you gain access to a new level of spell slots.' },
      { name:'Improved Illusions', desc:"You cast Illusion spells without Verbal components, and an Illusion spell of yours with a range of 10 ft or more gains 60 ft of range. You also know Minor Illusion — or another Wizard cantrip if you already know it, and it doesn't count against your total. You create both a sound and an image with a single casting of it, and you can cast it as a Bonus Action." }
    ],
    6:[
      { name:'Phantasmal Creatures', desc:"You always have Summon Beast and Summon Fey prepared. When you cast either, you can change its school to Illusion so the creature appears spectral — and you can cast that version once without a spell slot, which halves the creature's HP. Once per spell per Long Rest." }
    ],
    10:[
      { name:'Illusory Self', desc:'Reaction when a creature hits you with an attack roll: an illusory duplicate steps between you, the attack automatically misses, and the illusion dissipates. Once per Short or Long Rest — or restore the use by expending a level 2+ spell slot (no action required).' }
    ],
    14:[
      { name:'Illusory Reality', desc:'When you cast an Illusion spell with a spell slot, you can choose one inanimate, nonmagical object that is part of the illusion and make it real — a Bonus Action while the spell lasts. It stays real for 1 minute, during which it can neither deal damage nor impose conditions.' }
    ],
  },
  'Bladesinger': {
    3:[
      { name:'Bladesong', desc:"Bonus action, while you wear no armor and use no Shield: the Bladesong lasts 1 minute, ending early if you have the Incapacitated condition, don armor or a Shield, or use two hands to attack with a weapon. <em>Agility</em>: bonus to AC equal to your INT modifier (minimum +1), +10 ft Speed, and Advantage on Dexterity (Acrobatics) checks. <em>Bladework</em>: use INT for the attack and damage rolls of any weapon you're proficient with. <em>Focus</em>: add your INT modifier to CON saves made to keep Concentration. Uses = your INT modifier (minimum one), all regained on a Long Rest and one back whenever you use Arcane Recovery." },
      { name:'Training in War and Song', desc:"You gain proficiency with every Melee Martial weapon that has neither the Two-Handed nor the Heavy property, and you can use a Melee weapon you're proficient with as a Spellcasting Focus for your Wizard spells. You also gain proficiency in Acrobatics, Athletics, Performance or Persuasion." }
    ],
    6:[
      { name:'Extra Attack', desc:'You can attack twice instead of once whenever you take the Attack action. You can also cast one of your Wizard cantrips that has a casting time of an action in place of one of those attacks.' }
    ],
    10:[
      { name:'Song of Defense', desc:"Reaction when you take damage while your Bladesong is active: expend one spell slot and reduce the damage by five times the slot's level." }
    ],
    14:[
      { name:'Song of Victory', desc:'After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.' }
    ],
  },


  /* ── Unearthed Arcana ── */
  'Conjurer': {
    3:[
      { name:'Benign Transposition', desc:'Bonus Action: teleport up to 30 ft to an unoccupied space you can see, or swap places with a willing Medium or smaller creature in a space within range. INT modifier uses (minimum 1), regained on a Long Rest.' },
      { name:'Conjuration Savant', desc:'Add two Wizard Conjuration spells of level 2 or lower to your spellbook for free, and one more Conjuration spell each time you gain access to a new level of spell slots (of a level you have slots for).' }
    ],
    6:[
      { name:'Distant Transposition', desc:"Benign Transposition's range rises to 60 ft, and you now regain all of its expended uses on a Short or Long Rest." },
      { name:'Durable Summons', desc:'A creature you summon or create with a Conjuration spell cast using a spell slot gains Temporary HP equal to twice your Wizard level when it appears. While it has those Temporary HP it has Resistance to every damage type except Force, Necrotic, Psychic, and Radiant.' }
    ],
    10:[
      { name:'Focused Conjuration', desc:'Taking damage can never break your Concentration on a Conjuration spell.' }
    ],
    14:[
      { name:'Splintered Summons', desc:'When you cast Summon Aberration, Summon Construct, Summon Dragon, Summon Elemental, or Summon Fey with a spell slot, you can summon two creatures of the same kind instead of one, each in a space of your choice within range, but each has half the normal HP. Losing Concentration dismisses both. Once per Long Rest, or by expending a level 5+ spell slot (no action required).' }
    ],
  },
  'Enchanter': {
    3:[
      { name:'Enchanting Conversationalist', desc:'Gain proficiency in <em>Deception</em>, <em>Intimidation</em>, or <em>Persuasion</em>, and add your INT modifier (minimum +1) to ability checks made with that skill.' },
      { name:'Enchantment Savant', desc:'Add two Wizard Enchantment spells of level 2 or lower to your spellbook for free, and one more Enchantment spell each time you gain access to a new level of spell slots (of a level you have slots for).' },
      { name:'Hypnotic Presence', desc:'Magic action: one creature within 10 ft that can see or hear you makes a WIS save against your spell save DC or is Charmed for 1 minute, becoming Incapacitated with a Speed of 0. It ends early if your Concentration ends, the target moves more than 10 ft away, it can neither see nor hear you, or it takes damage. Once per Long Rest, or by expending a level 1+ spell slot (no action required).' }
    ],
    6:[
      { name:'Split Enchantment', desc:'When you cast an Enchantment spell that targets an extra creature at higher levels, such as Charm Person, you can raise its effective level by 1. INT modifier uses, regained on a Long Rest.' }
    ],
    10:[
      { name:'Instinctive Charm', desc:"Reaction when a creature you can see within 30 ft hits you with an attack roll: it makes a WIS save against your spell save DC. On a failure the attack misses you and instead targets another creature within the attack's range (your choice if several), using the same attack roll. Once per Long Rest, or by casting an Enchantment spell with a spell slot." }
    ],
    14:[
      { name:'Alter Memories', desc:"You always have Modify Memory prepared, and when you cast it you can target a second creature within the spell's range." }
    ],
  },
  'Imaskarcanist': {
    3:[
      { name:'Unlight Adept', desc:'When you cast a spell that deals Acid, Cold, Fire, Lightning, or Thunder damage, you can change that damage type to Radiant. Dim Light created by your spells is Bright Light instead.' },
      { name:'Unlight Invigoration', desc:'Bonus Action: choose a willing creature you can see within 30 ft and expend one or two of your Hit Point Dice. The target gains Temporary HP equal to the total rolled + your INT modifier, and until it has no Temporary HP left it has Advantage on STR checks and sheds Bright Light in a 10-ft radius.' }
    ],
    6:[
      { name:'Unlight Restoration', desc:'Bonus Action: choose a creature you can see within 30 ft and expend one or two of your Hit Point Dice. It regains HP equal to the total rolled and sheds Bright Light in a 10-ft radius until the end of its next turn. If you expended two dice, you may instead forgo the healing to end one condition on it: <em>Blinded</em> · <em>Deafened</em> · <em>Paralyzed</em> · <em>Poisoned</em>.' }
    ],
    10:[
      { name:'Secrets of Deep Imaskar', desc:'<em>Imaskarcana Lore</em>: attune to a magic item as a Magic action, once per Long Rest. <em>Piercing Unlight</em>: your spells ignore Resistance to Radiant damage. <em>Unlight Resilience</em>: you gain Resistance to Radiant damage. <em>Imaskar Seals</em>: Glyph of Warding is always prepared, and once per Long Rest you cast it without a slot or Material components, as if using your highest Wizard slot — any previous glyph made this way breaks, its spell ending untriggered.' }
    ],
    14:[
      { name:'Doom of Unlight', desc:'Reaction when a creature takes Radiant damage from a spell you cast: it makes a CON save against your spell save DC or is cursed. While cursed, it sheds Bright Light in a 20-ft radius, attack rolls against it have Advantage, it takes Radiant damage equal to your character level at the start of each of its turns, and it has Advantage on STR checks and melee attack rolls — hitting a creature with a melee attack lets it repeat the save to end the curse. If it drops to 0 HP it explodes: roll d8s equal to half your character level, and creatures in a 10-ft Emanation on it take that much Radiant damage. Once per Long Rest, unless you expend a level 6+ spell slot (no action required).' }
    ],
  },
  'Necromancer': {
    3:[
      { name:'Necromancy Savant', desc:'Add two Wizard Necromancy spells of level 2 or lower to your spellbook for free, and one more Necromancy spell each time you gain access to a new level of spell slots (of a level you have slots for).' },
      { name:'Necromancy Spellbook', desc:"<em>Necrotic Resistance</em>: you have Resistance to Necrotic damage · <em>Grim Harvest</em>: when you cast a Necromancy spell with a spell slot, an Undead you can see within 60 ft regains HP equal to the slot's level + your Wizard level · <em>Undead Familiar</em>: Find Familiar appears in your spellbook, and you can summon it as a Skeleton or Zombie in addition to the normal forms." }
    ],
    6:[
      { name:'Grave Power', desc:'While holding your spellbook: <em>Grave Resilience</em> — using Arcane Recovery lowers your Exhaustion level by 1 · <em>Overwhelming Necrosis</em> — damage from your Wizard spells and Wizard features ignores Resistance to Necrotic damage.' },
      { name:'Undead Thralls', desc:"You always have Animate Dead prepared and can cast it once without a spell slot, and you can raise its effective level by 1 when you start casting it. Undead you create or summon with a Necromancy spell cast using a spell slot gain <em>Undead Fortitude</em> — current and maximum HP increased by the slot's level + your INT modifier for the spell's duration — and <em>Withering Strike</em> — extra Necrotic damage equal to your INT modifier (minimum 1) on each of their hits." }
    ],
    10:[
      { name:'Harvest Undead', desc:'Reaction right after damage leaves you Bloodied without killing you: reduce an Undead you control that you can see to 0 HP, then regain HP equal to your Wizard level.' }
    ],
    14:[
      { name:"Death's Master", desc:"While holding your spellbook: <em>Bolster Undead</em> — Bonus Action to give any number of Undead you created or summoned within 60 ft Temporary HP equal to your Wizard level, once per Undead per 24 hours · <em>Extinguish Undead</em> — when an Undead you can see drops to 0 HP you can make it burst, rolling d6s equal to half its unexpended Hit Dice (round up, minimum 1d6); each creature in a 10-ft Emanation makes a DEX save, taking that much Necrotic damage and losing its Reactions until its next turn on a failure, half damage only on a success. Exploding an Undead you don't control costs a Reaction and a level 5+ spell slot." }
    ],
  },
  'Transmuter': {
    3:[
      { name:'Transmutation Savant', desc:'Add two Wizard Transmutation spells of level 2 or lower to your spellbook for free, and one more Transmutation spell each time you gain access to a new level of spell slots (of a level you have slots for).' },
      { name:"Transmuter's Stone", desc:'On a Long Rest, create a Tiny magic stone that lasts until you use this feature again and serves as a Spellcasting Focus for your Wizard spells. Whoever carries it gains proficiency in CON saves plus one benefit you choose: <em>Darkvision</em> 60 ft, or +60 ft to existing Darkvision · <em>Speed</em> +10 ft · <em>Resistance</em> to Acid, Cold, Fire, Lightning, Poison, or Thunder. You can change the benefit whenever you cast a Transmutation spell using a spell slot.' },
      { name:'Wondrous Alteration', desc:'You always have Alter Self prepared and can cast it once without a spell slot, regaining that use on a Long Rest. While under its effects each option gains more: <em>Aquatic Adaptation</em> — Dash as a Bonus Action while underwater · <em>Change Appearance</em> — Advantage on CHA (Deception) checks · <em>Natural Weapons</em> — your growth deals 2d6 of its damage type and you have Advantage on CON saves to maintain Concentration.' }
    ],
    6:[
      { name:'Empowered Transmutation', desc:'When you cast a Transmutation spell that deals no damage, such as Fly or Magical Weapon, using a spell slot, you can treat it as cast with a slot 1 level higher. INT modifier uses (minimum 1), regained on a Long Rest.' }
    ],
    10:[
      { name:'Potent Stone', desc:"Your Transmuter's Stone can carry up to two benefits, each option taken only once except Resistance, which must use different damage types; you can change either or both when you cast a Transmutation spell with a spell slot. Two new options join the list: <em>Mighty Build</em> — Advantage on STR saves and the bearer counts as one size larger for carrying capacity · <em>Tremorsense</em> — Tremorsense out to 30 ft." },
      { name:'Shape-Shifter', desc:'You always have Polymorph prepared and can cast it once without a spell slot, regaining that use on a Long Rest. When you target yourself you can modify the spell — once per Long Rest — to keep <em>Game Statistics</em> (personality, memories, speech, your INT, WIS, and CHA scores, class features, languages, and feats) and <em>Transmute Spells</em> (cast Transmutation spells while shape-shifted, except those with a costed or consumed Material component).' }
    ],
    14:[
      { name:'Master Transmuter', desc:"Magic action while carrying your Transmuter's Stone: consume its stored magic for one benefit, after which the stone crumbles to dust unless you expend a level 5+ spell slot as part of the action. <em>Major Transformation</em>: after 10 minutes of handling, turn one nonmagical object no larger than a 10-ft Cube (or eight connected 5-ft Cubes) into another of similar size and mass and equal or lesser value · <em>Panacea</em>: a creature you touch regains half its HP maximum (round down), is cured of magical contagions and curses including Attunement to a cursed item, and loses the Poisoned and Petrified conditions · <em>Restore Life</em>: cast Raise Dead without a spell slot, the stone replacing the Material components · <em>Restore Youth</em>: a willing creature you touch drops to 0 Exhaustion and permanently looks 3d10 years younger, to a minimum of young adulthood." }
    ],
  },
},

'Artificer': {
  'Alchemist': {
    3:[
      { name:'Tool Proficiency', desc:'Gain proficiency with Alchemist\'s Supplies if you don\'t already have it.' },
      { name:'Alchemist Spells', desc:'Always prepared (scales with level): Healing Word, Ray of Sickness (3rd); Flaming Sphere, Melf\'s Acid Arrow (5th); Gaseous Form, Mass Healing Word (9th); Blight, Death Ward (13th); Cloudkill, Raise Dead (17th).' },
      { name:'Experimental Elixir', desc:'When you finish a Long Rest, create 1 Experimental Elixir (more at higher levels). Roll a d6 on the table: Healing (2d4+INT), Swiftness (+10 ft speed), Resilience (temp HP = 2d6+INT), Boldness (Bless), Flight (Fly speed 10 ft), Transformation (Alter Self). Also brew as a Bonus Action using a spell slot.' }
    ],
    9:[{ name:'Restorative Reagents', desc:'Cast Lesser Restoration without a spell slot (INT mod/Long Rest). Experimental Elixirs also grant temp HP = 2d6+INT when consumed.' }],
    15:[{ name:'Chemical Mastery', desc:'Resistance to Acid and Poison damage. Immune to Poisoned. Cast Greater Restoration and Heal once each per Long Rest without spell slots.' }],
  },
  'Armorer': {
    3:[
      { name:'Arcane Armor', desc:'Imbue your armor with arcane power over a Long Rest. Your armor can\'t be removed without your permission, replaces a missing limb, and doesn\'t impose Stealth disadvantage (if you choose). Gain a Thunder Gauntlets or Force-Empowered Rend special attack.' },
      { name:'Armor Model', desc:'Choose Guardian (melee-focused: Thunder Gauntlets, unarmed strikes) or Infiltrator (stealth/ranged: Lightning Launcher, advantage on Stealth).' },
      { name:'Tool Proficiency', desc:'Gain proficiency with Heavy Armor and Smith\'s Tools if not already proficient.' }
    ],
    9:[{ name:'Armor Modifications', desc:'Your Armor can hold up to 4 infusions (instead of 1). The breastplate and boots each count as separate items for infusions.' }],
    15:[{ name:'Perfected Armor', desc:'Guardian: when a creature within 30 ft is hit, use Reaction to use Defensive Field (temp HP = INT mod). Infiltrator: when you hit with Lightning Launcher, the target must make STR save or be pulled 10 ft toward you.' }],
  },
  'Artillerist': {
    3:[
      { name:'Tool Proficiency', desc:'Gain proficiency with Woodcarver\'s Tools if not already.' },
      { name:'Artillerist Spells', desc:'Always prepared: Shield, Thunderwave (3rd); Scorching Ray, Shatter (5th); Fireball, Wind Wall (9th); Ice Storm, Wall of Fire (13th); Cone of Cold, Wall of Force (17th).' },
      { name:'Eldritch Cannon', desc:'Action (or 1 minute ritual): create a magical cannon in an unoccupied space within 5 ft. Choose: Flamethrower (15-ft cone, 2d8 Fire, DEX save half), Force Ballista (ranged spell attack, 2d8 Force + push 5 ft), or Protector (temp HP = 1d8+INT to you and allies within 10 ft). Lasts 1 hour or until destroyed. 1/Long Rest (or spend a spell slot).' }
    ],
    9:[{ name:'Explosive Cannon', desc:'Your cannon\'s damage increases to 3d8. Action: detonate it (60 ft range, 3d8 Force, DEX save DC = spell save DC, for half).' }],
    15:[{ name:'Fortified Position', desc:'Create 2 cannons at once with Eldritch Cannon. You and allies gain Half Cover while within 10 ft of a cannon.' }],
  },
  'Battle Smith': {
    3:[
      { name:'Tool Proficiency', desc:'Gain proficiency with Smith\'s Tools if not already.' },
      { name:'Battle Smith Spells', desc:'Always prepared: Heroism, Shield (3rd); Branding Smite, Warding Bond (5th); Aura of Vitality, Conjure Barrage (9th); Aura of Purity, Fire Shield (13th); Banishing Smite, Mass Cure Wounds (17th).' },
      { name:'Battle Ready', desc:'Gain proficiency with Martial weapons. Use INT instead of STR or DEX for attack and damage rolls with magic weapons.' },
      { name:'Steel Defender', desc:'Create a magical steel defender (companion). It acts on your turn (Bonus Action to command: Attack, Dash, Disengage, Dodge, Help). It uses your PB, your spell save DC, and INT mod for its attack bonus.' }
    ],
    9:[{ name:'Arcane Jolt', desc:'When you or your Steel Defender hits with a Magic weapon or the defender\'s attack, deal extra 2d6 Force or heal one creature within 30 ft for 2d6 HP. Uses = INT mod/Long Rest.' }],
    15:[{ name:'Improved Defender', desc:'Arcane Jolt damage/healing increases to 4d6. Your Steel Defender gains a +2 bonus to its AC.' }],
  },
  'Cartographer': {
    3:[
      { name:'Tool Proficiencies', desc:'You gain proficiency with Calligrapher\'s Supplies and Cartographer\'s Tools. You can scribe spell scrolls in half the normal time and cost.' },
      { name:'Magical Maps', desc:'After each Long Rest, create a number of magical maps equal to your INT modifier (min 1). Map holders: gain +1d4 to Initiative rolls; always know each other\'s locations (same plane); and can target each other with effects that require sight even if they can\'t see each other.' },
      { name:'Illuminated Cartography', desc:'You can cast Faerie Fire without a spell slot a number of times equal to your INT modifier per Long Rest.' }
    ],
    5:[{ name:'Guided Precision', desc:'Your Concentration on Faerie Fire can\'t be broken by taking damage. When a spell you cast deals damage to a creature affected by your Faerie Fire, add your INT modifier to the damage roll.' }],
    15:[
      { name:'Safe Haven', desc:'When a map holder drops to 0 HP, they can destroy the map to immediately regain HP equal to twice your Artificer level and teleport to within 5 ft of you or another map holder (no distance limit).' },
      { name:'Cartographer\'s Path', desc:'Each map holder can cast Find the Path once per Long Rest for free. When you use your Flash of Genius reaction, you or the map holder can additionally teleport up to 30 ft to an unoccupied space.' }
    ],
  },

  /* ── Unearthed Arcana ── */
  'Reanimator': {
    3:[
      { name:'Reanimator Spells', desc:'Always prepared — <strong>3</strong>: False Life, Spare the Dying, Witch Bolt · <strong>5</strong>: Blindness/Deafness, Enhance Ability · <strong>9</strong>: Animate Dead, Lightning Bolt · <strong>13</strong>: Blight, Death Ward · <strong>17</strong>: Antilife Shell, Raise Dead.' },
      { name:'Jolt to Life', desc:'When you cast Spare the Dying you can send a jolt of electricity through the target: it regains 1 HP, and each creature in a 10-ft Emanation from it makes a DEX save against your spell save DC, taking 1d4 + half your Artificer level (round up) Lightning damage, half as much on a success. Usable a number of times equal to your INT modifier, regained on a Long Rest.' },
      { name:'Reanimated Companion', desc:"Magic action with Artisan's Tools you're proficient with: assemble a Reanimated Companion in an unoccupied space within 5 ft. Small Undead — AC 10 + INT, HP 4 + four times your Artificer level, Speed 30 ft, Blindsight 60 ft, Resistance to Necrotic and Poison, Immunity to Lightning (it heals from Lightning instead), Immunity to Charmed, Exhaustion, and Poisoned. <em>Dreadful Swipe</em>: melee attack using your spell attack modifier, 1d4 + 2 + INT Necrotic, and the target can't take Opportunity Attacks until its next turn · <em>Death Burst</em>: when it dies, each creature in a 10-ft Emanation makes a DEX save vs your spell save DC or takes 2d6 Necrotic. It lasts until you finish a Long Rest or dismiss it, acts on your turn but only Dodges unless you spend a Bonus Action to command it, and can be created once per Long Rest or by expending a spell slot." }
    ],
    5:[
      { name:'Strange Modifications', desc:"Whenever you create your Reanimated Companion, give it one option of your choice. <em>Arcane Conduit</em>: you can cast spells as though from the companion's space (using your own senses), and once per turn when an Artificer Evocation or Necromancy spell of yours deals damage while the companion is within 120 ft, add your INT modifier to one of that spell's damage rolls. <em>Ferocity</em>: when you command the companion to take the Dreadful Swipe action, it uses that action twice." }
    ],
    9:[
      { name:'Improved Reanimation', desc:'Your companion gains a second option of your choice, picked when you create it. <em>Bloated</em>: it becomes Large or Medium, its Dreadful Swipe can push a Large or smaller target 10 ft away, and its Death Burst adds your INT modifier to the damage. <em>Gaunt</em>: Speed becomes 45 ft with an equal Climb Speed that handles ceilings without a check, and creatures of your choice starting their turn within a 10-ft Emanation make a WIS save vs your spell save DC or are Frightened until their next turn. <em>Moist</em>: it gains a Swim Speed equal to its Speed, and any creature within 10 ft that hits it takes Acid damage equal to your INT modifier.' }
    ],
    15:[
      { name:'Promethean Reanimation', desc:"<em>Facilitated Revival</em>: the Material component cost of Revivify and Raise Dead is halved. <em>Improved Companion</em>: your companion's Death Burst deals 4d6, and its Necrotic damage ignores Resistance. <em>Life Transfer</em>: Reaction when you take damage — your Reanimated Companion drops to 0 HP and dies, triggering Death Burst, and you regain HP equal to your Artificer level." }
    ],
  },
},

}; // end SUBCLASS_DATA

/* ── Ressources de classe par défaut ── */
const CLASS_RESOURCES = {
  Barbarian: lvl => [
    { name:'Rages', used:0, max:[2,2,3,3,4,4,4,4,4,4,4,5,5,5,5,5,6,6,6,99][Math.min(lvl,20)-1], reset:'long' }
  ],
  Bard: lvl => {
    const r = [{ name:'Bardic Inspiration', used:0, max:null, reset:'short', note:'= CHA mod' }];
    if (lvl >= 5) r.push({ name:'Font of Inspiration', used:0, max:1, reset:'short' });
    return r;
  },
  Cleric: lvl => [
    { name:'Channel Divinity', used:0, max:lvl>=18?3:lvl>=6?2:1, reset:'short' }
  ],
  Druid: lvl => {
    const r = [{ name:'Wild Shape', used:0, max:2, reset:'short' }];
    if (lvl >= 18) r.push({ name:'Beast Spells', used:0, max:1, reset:'long' });
    return r;
  },
  Fighter: lvl => {
    const r = [{ name:'Second Wind', used:0, max:1, reset:'short' }];
    if (lvl >= 2) r.push({ name:'Action Surge', used:0, max:lvl>=17?2:1, reset:'short' });
    if (lvl >= 9) r.push({ name:'Indomitable', used:0, max:lvl>=17?3:lvl>=13?2:1, reset:'long' });
    return r;
  },
  Monk: lvl => [
    { name:'Discipline Points', used:0, max:lvl, reset:'short' }
  ],
  Paladin: lvl => {
    const r = [{ name:'Lay on Hands', used:0, max:lvl*5, reset:'long' }];
    if (lvl >= 2) r.push({ name:'Channel Divinity', used:0, max:lvl>=11?3:lvl>=6?2:1, reset:'short' });
    return r;
  },
  Psion: lvl => [
    // Dés d'Énergie Psionique (Psion Update, oct. 2025) : 4d6 → 6d8 au niv. 5,
    // 8d8 au 9, 8d10 au 11, 10d10 au 13, 12d12 au 17. Les Modes Psioniques,
    // eux, ont été retirés de la classe.
    { name:'Psionic Energy Dice', used:0,
      max:[4,4,4,4,6,6,6,6,8,8,8,8,10,10,10,10,12,12,12,12][Math.min(lvl,20)-1], reset:'long' }
  ],
  Ranger: lvl => [
    { name:"Hunter's Mark", used:0, max:lvl>=17?3:lvl>=9?2:1, reset:'long' }
  ],
  Rogue: lvl => {
    const r = [];
    if (lvl >= 5) r.push({ name:'Uncanny Dodge', used:0, max:1, reset:'short' });
    if (lvl >= 7) r.push({ name:'Evasion', used:0, max:1, reset:'short' });
    return r;
  },
  Sorcerer: lvl => [
    { name:'Sorcery Points', used:0, max:lvl, reset:'long' }
  ],
  Warlock: lvl => [
    { name:'Spell Slots', used:0, max:lvl>=17?4:lvl>=11?3:lvl>=2?2:1, reset:'short' },
    { name:'Mystic Arcanum', used:0, max:lvl>=17?4:lvl>=15?3:lvl>=13?2:lvl>=11?1:0, reset:'long' }
  ],
  Wizard: lvl => [
    { name:'Arcane Recovery', used:0, max:1, reset:'long' }
  ],
  Artificer: lvl => [
    { name:'Infuse Item', used:0, max:Math.floor(lvl/2)+1, reset:'long' }
  ]
};


/* ── Sous-classes renommées ──
   Les écoles de magie portaient leur nom de 2014 (« School of Conjuration »).
   Le PHB 2024 les appelle autrement, et quatre d'entre elles n'ont de version
   2024 que sous un autre nom. La clé stockée dans la fiche est le nom : sans
   cette table, un magicien perdrait sa sous-classe au prochain chargement.
   Elle est appliquée une fois, au premier rendu, puis ne matche plus rien. */
const SUBCLASS_RENOMMEES = {
  'School of Abjuration':    'Abjurer',
  'School of Conjuration':   'Conjurer',
  'School of Divination':    'Diviner',
  'School of Enchantment':   'Enchanter',
  'School of Evocation':     'Evoker',
  'School of Illusion':      'Illusionist',
  'School of Necromancy':    'Necromancer',
  'School of Transmutation': 'Transmuter',
};

/* ════════════════════════════════════════════════════════════
   UNEARTHED ARCANA — étiquetage des options de playtest

   Une option UA n'est pas officielle : elle peut changer d'un document à
   l'autre, ou ne jamais sortir. Le joueur doit le voir au moment où il
   choisit, pas le découvrir en partie. D'où le préfixe « (UA) » partout où
   le nom est *proposé*.

   La clé d'une option UA reste le nom nu (« Psion », « Myconid ») : c'est
   elle qui part dans la fiche et qui sert d'index dans les tables. Si WotC
   publie l'option pour de bon, il suffit de retirer le drapeau — aucune
   fiche existante ne casse, aucune migration à écrire.

   Espèces et classes portent le drapeau sur l'entrée elle-même (`ua: true`).
   Les sous-classes, non : SUBCLASS_DATA[classe][sous-classe] est indexé par
   niveau, et une clé de métadonnée s'y ferait passer pour un palier. D'où
   cette table à côté, dont un smoke-test vérifie qu'elle ne dérive pas.
   ════════════════════════════════════════════════════════════ */

/* Sous-classe de playtest → document d'origine. Les noms de sous-classes
   sont uniques toutes classes confondues, la clé simple suffit. */
const UA_SUBCLASSES = {
  'Ancestral Sorcery': 'Arcane Subclasses (June 2025)',
  'Cavalier': 'Subclasses Update (Oct. 2025)',
  'Circle of Preservation': 'Apocalyptic Subclasses (Aug. 2025)',
  'Circle of Spores': 'Underdark Options 2 (Sept. 2026)',
  'Circle of the Titan': 'Villainous Options Update (June 2026)',
  'College of Spirits': 'Horror Subclasses (May 2025)',
  'Defiled Sorcery': 'Apocalyptic Subclasses (Aug. 2025)',
  'Demonic Sorcery': 'Villainous Options Update (June 2026)',
  'Faerzress Sorcery': 'Underdark Options 2 (Sept. 2026)',
  'Freedom Domain': 'Underdark Options 2 (Sept. 2026)',
  'Gladiator': 'Apocalyptic Subclasses (Aug. 2025)',
  'Grave Domain': 'Horror Subclasses (May 2025)',
  'Hell Knight': 'Villainous Options Update (June 2026)',
  'Hexblade Patron': 'Arcane Subclasses (June 2025)',
  'Hollow Warden': 'Horror Subclasses (May 2025)',
  'House Agent': 'Underdark Options (Aug. 2026)',
  'Imaskarcanist': 'Underdark Options (Aug. 2026)',
  'Magic Stealer': 'Mystic Subclasses (Jan. 2026)',
  'Oath of the Spellguard': 'Mystic Subclasses (Jan. 2026)',
  'Oathbreaker': 'Subclasses Update (Oct. 2025)',
  'Path of Lament': 'Villainous Options 2 (Apr. 2026)',
  'Path of the Spiritual Guardian': 'Subclasses Update (Oct. 2025)',
  'Path of the Storm Herald': 'Subclasses Update (Oct. 2025)',
  'Path of Unlight': 'Underdark Options (Aug. 2026)',
  'Pestilence Domain': 'Villainous Options (Apr. 2026)',
  'Phantom': 'Horror Subclasses (May 2025)',
  'Primordial Patron': 'Villainous Options 2 (Apr. 2026)',
  'Reanimator': 'Horror Subclasses (May 2025)',
  'Shadow Sorcery': 'Horror Subclasses (May 2025)',
  'Sorcerer-King Patron': 'Apocalyptic Subclasses (Aug. 2025)',
  'Tattooed Warrior': 'Arcane Updates (Sept. 2025)',
  'Undead Patron': 'Horror Subclasses (May 2025)',
  'Warrior of Intoxication': 'Subclasses Update (Oct. 2025)',
  'Warrior of Venom': 'Villainous Options 2 (Apr. 2026)',
};

/* ── Options officielles hors Manuel des joueurs ──
   Une option qui n'est plus du playtest n'est pas pour autant dans le PHB : il
   faut posseder le livre pour la jouer. L'infobulle le dit, a la place de
   l'avertissement de playtest qu'elle portait avant. */
const SOURCE_LIVRE = {};
['Arcana Domain', 'Arcane Archer', 'Conjurer', 'Enchanter', 'Necromancer', 'Transmuter', 'Vestige Patron', 'Warrior of the Mystic Arts',
 'Agent of the Ninth Quill', 'Bejeweled Conclave Spy', 'Cosmic Dawn Experiment',
 'Covenant of the Grave Recruit', 'Crucible Storm Chaser', 'Familiar Trainer',
 'Horizon Weaver Initiate', 'Phantasmic Circus Trouper', 'Seer Apprentice',
 'Ward of the Sheltering Hands',
  'Boon of Erupting Spellpower', 'Boon of Magic School Mastery', 'Boon of the Iron Mind',
 'Arcane Warrior',
].forEach(nom => { SOURCE_LIVRE[nom] = 'Arcana Unleashed (2026)'; });

/** Livre dont vient cette option, vide si elle est dans le PHB. */
function livreSource(nom) {
  return (nom && SOURCE_LIVRE[nom]) || '';
}

/** Cette espèce, cette classe ou cette sous-classe est-elle du playtest ? */
function estUA(nom) {
  if (!nom) return false;
  return !!(SPECIES_DATA[nom]?.ua || CLASS_DATA[nom]?.ua || UA_SUBCLASSES[nom]);
}

/** Nom tel qu'on l'affiche dans une liste de choix : « (UA) Myconid ». */
function nomUA(nom) {
  return estUA(nom) ? '(UA) ' + nom : nom;
}

/** Document de playtest d'origine, pour l'infobulle d'une option. */
function sourceUA(nom) {
  if (!nom) return '';
  return SPECIES_DATA[nom]?.uaSource || CLASS_DATA[nom]?.uaSource || UA_SUBCLASSES[nom] || '';
}

/** Texte d'infobulle pour une option de playtest (vide si l'option est officielle). */
function infoUA(nom) {
  const src = sourceUA(nom);
  return src ? `Unearthed Arcana — ${src} · playtest material, not official yet` : '';
}

/** Le même, prêt à coller comme attribut dans une <option>.
    A defaut d'avertissement de playtest, on indique le livre a posseder. */
function titreUA(nom) {
  const info = infoUA(nom) || livreSource(nom);
  return info ? ` title="${info}"` : '';
}
