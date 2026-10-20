#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   Calendrier de Kaleysur → plaques imprimables en 3D, un fichier STL par mois

   Pourquoi cet outil existe : le calendrier de Kaleysur compte 9 mois de 31 à
   41 jours, une semaine de 9 jours et 3 lunes. Aucun calendrier du commerce ne
   fait ça, et aucun générateur en ligne non plus.

   Deux décisions de dessin, qui expliquent tout le reste :

   1. LA GRILLE VIENT DES LUNES. La semaine de 9 jours est 3 lunes × 3 jours.
      Les colonnes sont donc groupées par trois, séparées par une nervure plus
      épaisse, et chaque groupe porte le nom de sa lune. Les colonnes sont
      numérotées I·II·III à l'intérieur du groupe : « Lune Bleue, jour II », et
      c'est Segael. Écrire « SEGAEL » en toutes lettres demanderait 36 mm dans
      une case de 14 — et « PRE… » ne distinguerait pas Precia de Pregael ni de
      Presgard. La lune plus l'ordinal, c'est à la fois lisible et exactement la
      structure du calendrier.

   2. TOUT SORT D'UN MASQUE 2D. Le relief, la plaque, le trou d'accroche : une
      seule grille de pixels par couche, découpée en rectangles maximaux, puis
      extrudée. Le mode creusé n'est alors que le masque inversé — pas une
      soustraction booléenne à écrire. C'est ce qui garde le fichier court.

   Le générateur LIT calendrier.html. Les mois, les jours et les lunes ne sont
   pas recopiés ici : si le calendrier du site change, les plaques suivent.

   Usage :
     node tools/calendrier-3d.js                 les 9 mois dans tools/out/
     node tools/calendrier-3d.js --mois 6        seulement Soillse
     node tools/calendrier-3d.js --creux         chiffres gravés au lieu de saillants
     node tools/calendrier-3d.js --cellule 16    cases plus grandes
     node tools/calendrier-3d.js --aide
   ══════════════════════════════════════════════════════════════════════════ */

'use strict';
const fs = require('fs');
const path = require('path');

/* ════════════════════════════════════════════════════════════
   1. Données — lues depuis le site, jamais recopiées
   ════════════════════════════════════════════════════════════ */

/** Extrait un littéral `const NOM = [...]` ou `{...}` d'un fichier source. */
function litteral(src, nom) {
  const debut = src.indexOf('const ' + nom + ' =');
  if (debut === -1) throw new Error(`« ${nom} » introuvable dans calendrier.html`);
  const ouvrant = src.slice(debut).search(/[[{]/);
  if (ouvrant === -1) throw new Error(`« ${nom} » : pas de littéral après le =`);
  const from = debut + ouvrant;
  const paires = { '[': ']', '{': '}' };
  const fin = paires[src[from]];
  let prof = 0, dansChaine = null;
  for (let i = from; i < src.length; i++) {
    const ch = src[i];
    if (dansChaine) {
      if (ch === '\\') i++;
      else if (ch === dansChaine) dansChaine = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { dansChaine = ch; continue; }
    if (ch === src[from]) prof++;
    else if (ch === fin && --prof === 0) {
      return new Function('return ' + src.slice(from, i + 1))();
    }
  }
  throw new Error(`« ${nom} » : littéral non refermé`);
}

/* `analyser` prend la source, `chargerCalendrier` prend un chemin : les
   smoke-tests travaillent sur la version STAGÉE de calendrier.html, pas sur
   celle du disque, et sans cette séparation ils testeraient le mauvais
   fichier. */
function analyser(src) {
  const MONTHS = litteral(src, 'MONTHS');
  const WEEK_DAYS = litteral(src, 'WEEK_DAYS');
  const MOONS = litteral(src, 'MOONS');
  const SPECIAL_DAYS = litteral(src, 'SPECIAL_DAYS');

  /* Le décalage du premier jour de chaque mois se recalcule ici plutôt que de
     se relire : c'est la seule façon de savoir que la page et les plaques
     parlent du même calendrier. */
  let cum = 0;
  const mois = MONTHS.map(m => {
    const depart = cum % WEEK_DAYS.length;
    const premierJourAbsolu = cum + 1;
    cum += m.days;
    return { ...m, depart, premierJourAbsolu };
  });

  if (cum !== MONTHS.reduce((n, m) => n + m.days, 0)) throw new Error('total de jours incohérent');
  return { mois, semaine: WEEK_DAYS, lunes: MOONS, speciaux: SPECIAL_DAYS, total: cum };
}

function chargerCalendrier(fichier) {
  return analyser(fs.readFileSync(fichier, 'utf8'));
}

/* ════════════════════════════════════════════════════════════
   2. Police 5×7 — les accents comptent : Réolta, Brònair, Cogadhán
   ════════════════════════════════════════════════════════════ */

/* Une ligne par rang, et pas une chaîne de 35 signes : une police écrite à la
   main se trompe, et sur une seule chaîne l'erreur décale tout ce qui suit sans
   rien casser de visible. La validation plus bas REFUSE une taille fausse au
   lieu de la rembourrer — un rembourrage silencieux avait déjà laissé passer
   dix-sept glyphes déformés. */
const GLYPHES = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#..##', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '....#', '....#', '....#', '....#', '#...#', '.###.'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '#####'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  3: ['.###.', '#...#', '....#', '..##.', '....#', '#...#', '.###.'],
  4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  '·': ['.....', '.....', '.....', '..#..', '.....', '.....', '.....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
};

/* Accents : on dessine la lettre de base, puis la marque deux rangs au-dessus. */
const ACCENTS = {
  'É': ['E', '..##.', 1], 'È': ['E', '.##..', 1], 'Ê': ['E', '.#.#.', 0],
  'Á': ['A', '..##.', 1], 'À': ['A', '.##..', 1], 'Â': ['A', '.#.#.', 0],
  'Ò': ['O', '.##..', 1], 'Ó': ['O', '..##.', 1], 'Ô': ['O', '.#.#.', 0],
  'Ù': ['U', '.##..', 1], 'Ú': ['U', '..##.', 1], 'Î': ['I', '.#.#.', 0],
  'Ï': ['I', '#...#', 0], 'Ç': ['C', null, 0],
};

const LARGEUR_G = 5, HAUTEUR_G = 7, MARGE_ACCENT = 2;

/* Refus immédiat d'une police mal formée : une lettre de travers se verrait au
   déballage de l'impression, pas avant. */
for (const [c, rangs] of Object.entries(GLYPHES)) {
  if (rangs.length !== HAUTEUR_G)
    throw new Error(`glyphe « ${c} » : ${rangs.length} rangs au lieu de ${HAUTEUR_G}`);
  rangs.forEach((r, i) => {
    if (r.length !== LARGEUR_G)
      throw new Error(`glyphe « ${c} » rang ${i} : ${r.length} colonnes au lieu de ${LARGEUR_G}`);
    if (/[^.#]/.test(r))
      throw new Error(`glyphe « ${c} » rang ${i} : seuls « . » et « # » sont admis`);
  });
}

/** Pixels allumés d'un caractère, en coordonnées (col, ligne) depuis le haut. */
function pixelsGlyphe(ch) {
  const maj = ch.toUpperCase();
  const acc = ACCENTS[maj];
  const base = acc ? acc[0] : maj;
  const rangs = GLYPHES[base];
  if (!rangs) return null;
  const px = [];
  for (let y = 0; y < HAUTEUR_G; y++)
    for (let x = 0; x < LARGEUR_G; x++)
      if (rangs[y][x] === '#') px.push([x, y + MARGE_ACCENT]);
  if (acc && acc[1]) {
    for (let x = 0; x < LARGEUR_G; x++)
      if (acc[1][x] === '#') px.push([x, acc[2]]);
  }
  if (maj === 'Ç') px.push([2, HAUTEUR_G + MARGE_ACCENT], [2, HAUTEUR_G + MARGE_ACCENT + 1]);
  return px;
}

const HAUTEUR_TOTALE = HAUTEUR_G + MARGE_ACCENT;          // rangs occupés par un glyphe accentué
function largeurTexte(txt) {
  return txt.length * (LARGEUR_G + 1) - 1;                 // 1 pixel de chasse entre lettres
}

/* ════════════════════════════════════════════════════════════
   3. Masque 2D — une grille de pixels par couche
   ════════════════════════════════════════════════════════════ */

class Masque {
  constructor(largeurMm, hauteurMm, pas) {
    this.pas = pas;
    this.w = Math.round(largeurMm / pas);
    this.h = Math.round(hauteurMm / pas);
    this.bits = new Uint8Array(this.w * this.h);
  }
  /** Rectangle plein, en millimètres, origine en bas à gauche. */
  rect(x, y, dx, dy, valeur = 1) {
    const x0 = Math.max(0, Math.round(x / this.pas));
    const y0 = Math.max(0, Math.round(y / this.pas));
    const x1 = Math.min(this.w, Math.round((x + dx) / this.pas));
    const y1 = Math.min(this.h, Math.round((y + dy) / this.pas));
    for (let j = y0; j < y1; j++) this.bits.fill(valeur, j * this.w + x0, j * this.w + x1);
  }
  /** Disque plein — sert au trou d'accroche. */
  disque(cx, cy, r, valeur = 1) {
    const rp = r / this.pas, cxp = cx / this.pas, cyp = cy / this.pas;
    const y0 = Math.max(0, Math.floor(cyp - rp)), y1 = Math.min(this.h, Math.ceil(cyp + rp));
    for (let j = y0; j < y1; j++) {
      const dy = j + 0.5 - cyp;
      const demi = Math.sqrt(Math.max(0, rp * rp - dy * dy));
      const x0 = Math.max(0, Math.floor(cxp - demi)), x1 = Math.min(this.w, Math.ceil(cxp + demi));
      for (let i = x0; i < x1; i++) this.bits[j * this.w + i] = valeur;
    }
  }
  /** Anneau — marque les jours spéciaux sans masquer le chiffre. */
  anneau(cx, cy, rExt, epaisseur) {
    const plein = new Masque(this.w * this.pas, this.h * this.pas, this.pas);
    plein.disque(cx, cy, rExt);
    plein.disque(cx, cy, rExt - epaisseur, 0);
    for (let i = 0; i < this.bits.length; i++) if (plein.bits[i]) this.bits[i] = 1;
  }
  /** Texte, ancré par `ancre` : 'gauche' | 'centre' | 'droite'. */
  texte(txt, xMm, yMm, taille, ancre = 'gauche') {
    const largeur = largeurTexte(txt) * taille;
    const x0 = ancre === 'centre' ? xMm - largeur / 2 : ancre === 'droite' ? xMm - largeur : xMm;
    let avance = 0;
    for (const ch of txt) {
      const px = pixelsGlyphe(ch);
      if (px) {
        for (const [gx, gy] of px) {
          /* gy compte depuis le haut du glyphe : on retourne pour un repère
             dont l'origine est en bas, comme le reste de la plaque. */
          const x = x0 + (avance + gx) * taille;
          const y = yMm + (HAUTEUR_TOTALE - 1 - gy) * taille;
          this.rect(x, y, taille, taille);
        }
      }
      avance += LARGEUR_G + 1;
    }
    return largeur;
  }
  /** Découpe le masque en rectangles maximaux — moins de triangles, mailles plus saines. */
  rectangles() {
    const { w, h, bits, pas } = this;
    const vu = new Uint8Array(w * h);
    const out = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!bits[y * w + x] || vu[y * w + x]) continue;
        let x2 = x;
        while (x2 + 1 < w && bits[y * w + x2 + 1] && !vu[y * w + x2 + 1]) x2++;
        let y2 = y;
        pousse: while (y2 + 1 < h) {
          for (let i = x; i <= x2; i++)
            if (!bits[(y2 + 1) * w + i] || vu[(y2 + 1) * w + i]) break pousse;
          y2++;
        }
        for (let j = y; j <= y2; j++) vu.fill(1, j * w + x, j * w + x2 + 1);
        out.push([x * pas, y * pas, (x2 - x + 1) * pas, (y2 - y + 1) * pas]);
      }
    }
    return out;
  }
  /** Masque inversé, limité à une zone — c'est tout le mode « creusé ». */
  inverse(x, y, dx, dy) {
    const m = new Masque(this.w * this.pas, this.h * this.pas, this.pas);
    m.rect(x, y, dx, dy);
    for (let i = 0; i < m.bits.length; i++) if (this.bits[i]) m.bits[i] = 0;
    return m;
  }
}

/* ════════════════════════════════════════════════════════════
   4. Maillage et écriture STL
   ════════════════════════════════════════════════════════════ */

class Maillage {
  constructor() { this.tri = []; }

  boite(x, y, z, dx, dy, dz) {
    if (dx <= 0 || dy <= 0 || dz <= 0) return;
    const X = x + dx, Y = y + dy, Z = z + dz;
    const s = [x, y, z], e = [X, Y, Z];
    const quad = (a, b, c, d) => { this.tri.push([a, b, c], [a, c, d]); };
    const p = (i, j, k) => [i ? e[0] : s[0], j ? e[1] : s[1], k ? e[2] : s[2]];
    quad(p(0,0,0), p(0,1,0), p(1,1,0), p(1,0,0));   // dessous  (-Z)
    quad(p(0,0,1), p(1,0,1), p(1,1,1), p(0,1,1));   // dessus   (+Z)
    quad(p(0,0,0), p(1,0,0), p(1,0,1), p(0,0,1));   // devant   (-Y)
    quad(p(1,0,0), p(1,1,0), p(1,1,1), p(1,0,1));   // droite   (+X)
    quad(p(1,1,0), p(0,1,0), p(0,1,1), p(1,1,1));   // derrière (+Y)
    quad(p(0,1,0), p(0,0,0), p(0,0,1), p(0,1,1));   // gauche   (-X)
  }

  /** Extrude un masque entre deux hauteurs. */
  /** Extrude un masque entre deux hauteurs. Renvoie le volume ajouté, qui sert
      de référence au contrôle d'intégrité. */
  extruder(masque, z0, z1) {
    let v = 0;
    for (const [x, y, dx, dy] of masque.rectangles()) {
      this.boite(x, y, z0, dx, dy, z1 - z0);
      v += dx * dy * (z1 - z0);
    }
    return v;
  }

  /** Volume signé (théorème de la divergence) — négatif si une face est retournée. */
  volume() {
    let v = 0;
    for (const [a, b, c] of this.tri) {
      v += (a[0] * (b[1] * c[2] - c[1] * b[2])
          - a[1] * (b[0] * c[2] - c[0] * b[2])
          + a[2] * (b[0] * c[1] - c[0] * b[1])) / 6;
    }
    return v;
  }

  boite3D() {
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (const t of this.tri) for (const p of t) for (let i = 0; i < 3; i++) {
      if (p[i] < min[i]) min[i] = p[i];
      if (p[i] > max[i]) max[i] = p[i];
    }
    return { min, max, taille: max.map((v, i) => v - min[i]) };
  }

  /** STL binaire : 84 octets d'en-tête puis 50 par triangle. */
  stl(titre) {
    const buf = Buffer.alloc(84 + this.tri.length * 50);
    buf.write(titre.slice(0, 79), 0, 'ascii');
    buf.writeUInt32LE(this.tri.length, 80);
    let o = 84;
    for (const [a, b, c] of this.tri) {
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const len = Math.hypot(n[0], n[1], n[2]) || 1;
      n = n.map(x => x / len);
      for (const f of [...n, ...a, ...b, ...c]) { buf.writeFloatLE(f, o); o += 4; }
      buf.writeUInt16LE(0, o); o += 2;
    }
    return buf;
  }
}

/* ════════════════════════════════════════════════════════════
   5. La plaque d'un mois
   ════════════════════════════════════════════════════════════ */

const DEFAUTS = {
  cellule: 14,        // côté d'une case, mm
  marge: 8,           // bordure autour de la grille
  base: 3,            // épaisseur de la plaque
  relief: 1.2,        // hauteur des chiffres et des nervures
  pas: 0.2,           // résolution du masque
  nervure: 0.8,       // largeur d'une séparation de colonnes
  nervureLune: 1.8,   // séparation entre deux lunes : plus épaisse, c'est le repère
  trou: 4,            // diamètre du trou d'accroche (0 = pas de trou)
  creux: false,
  lit: 220,           // taille du plateau, pour l'avertissement
};

function plaque(cal, indexMois, opt) {
  const o = { ...DEFAUTS, ...opt };
  const m = cal.mois[indexMois];
  const colonnes = cal.semaine.length;                  // 9
  const parLune = colonnes / cal.lunes.length;          // 3
  const lignes = Math.ceil((m.depart + m.days) / colonnes);

  const grilleL = colonnes * o.cellule;
  const bandeauLune = o.cellule * 0.62;                 // bande des noms de lune
  const bandeauJour = o.cellule * 0.52;                 // bande des ordinaux I·II·III
  const titreH = o.cellule * 2.0;                       // nom du mois, saison, trinité
  const grilleH = lignes * o.cellule;

  const L = grilleL + 2 * o.marge;
  const H = grilleH + bandeauJour + bandeauLune + titreH + 2 * o.marge;

  const gx = o.marge;                                   // bord gauche de la grille
  const gyHaut = H - o.marge - titreH;                  // sous le titre
  const yLune = gyHaut - bandeauLune;
  const yJour = yLune - bandeauJour;
  const gy = yJour - grilleH;                           // bas de la grille

  /* ── Couche 1 : la plaque ── */
  const plateau = new Masque(L, H, o.pas);
  plateau.rect(0, 0, L, H);
  const rTrou = o.trou / 2;
  if (o.trou > 0) plateau.disque(L / 2, H - o.marge / 2 - rTrou * 0.2, rTrou, 0);

  /* ── Couche 2 : le relief ── */
  const relief = new Masque(L, H, o.pas);

  // Cadre
  const c = o.nervure;
  relief.rect(0, 0, L, c); relief.rect(0, H - c, L, c);
  relief.rect(0, 0, c, H); relief.rect(L - c, 0, c, H);

  /* Nom du mois, puis deux lignes de contexte. La trinité a sa ligne : c'est du
     monde de Kaleysur, pas de la décoration, et c'est ce qui distingue cette
     plaque d'une grille de chiffres. */
  const tailleTitre = o.cellule / 14;                   // 1 px = 1 mm à la taille par défaut
  relief.texte(m.name.toUpperCase(), L / 2, gyHaut + titreH * 0.52, tailleTitre * 1.25, 'centre');
  const SAISONS = { hiver: 'HIVER', ete: 'ÉTÉ', automne: 'AUTOMNE' };
  relief.texte(`${m.days} JOURS · ${SAISONS[m.saison] || m.saison.toUpperCase()}`,
               L / 2, gyHaut + titreH * 0.26, tailleTitre * 0.62, 'centre');
  relief.texte(m.trinite.toUpperCase(), L / 2, gyHaut + titreH * 0.05, tailleTitre * 0.55, 'centre');

  // Bandeau des lunes : un nom par groupe de trois colonnes
  cal.lunes.forEach((lune, i) => {
    const x0 = gx + i * parLune * o.cellule;
    const court = lune.name.replace(/^Lune\s+/i, '').toUpperCase();
    relief.texte(court, x0 + parLune * o.cellule / 2, yLune + bandeauLune * 0.22,
                 tailleTitre * 0.62, 'centre');
  });

  // Ordinaux I·II·III sous chaque colonne
  const ORDINAUX = ['I', 'II', 'III'];
  for (let col = 0; col < colonnes; col++) {
    relief.texte(ORDINAUX[col % parLune], gx + (col + 0.5) * o.cellule,
                 yJour + bandeauJour * 0.22, tailleTitre * 0.62, 'centre');
  }

  // Nervures : fines entre colonnes, épaisses entre lunes
  for (let col = 1; col < colonnes; col++) {
    const large = col % parLune === 0;
    const e = large ? o.nervureLune : o.nervure;
    relief.rect(gx + col * o.cellule - e / 2, gy, e, grilleH + bandeauJour + bandeauLune * (large ? 1 : 0));
  }
  for (let r = 1; r < lignes; r++) relief.rect(gx, gy + r * o.cellule - o.nervure / 2, grilleL, o.nervure);
  relief.rect(gx, gy, grilleL, o.nervure);                       // bas de grille
  relief.rect(gx, yJour, grilleL, o.nervure);                    // haut de grille
  relief.rect(gx, yLune, grilleL, o.nervure);                    // sous les lunes

  // Les chiffres
  const speciaux = new Set();
  for (const abs of Object.keys(cal.speciaux)) {
    const n = +abs - m.premierJourAbsolu + 1;
    if (n >= 1 && n <= m.days) speciaux.add(n);
  }
  for (let j = 1; j <= m.days; j++) {
    const idx = m.depart + j - 1;
    const col = idx % colonnes;
    const ligne = Math.floor(idx / colonnes);
    const cx = gx + (col + 0.5) * o.cellule;
    const cy = yJour - (ligne + 1) * o.cellule;
    relief.texte(String(j), cx, cy + o.cellule * 0.3, tailleTitre * 0.9, 'centre');
    if (speciaux.has(j)) relief.anneau(cx, cy + o.cellule * 0.5, o.cellule * 0.42, o.nervure);
  }

  /* ── Extrusion ──
     On note au passage le volume que la pièce DOIT avoir. Le comparer au volume
     calculé sur les triangles vérifie d'un coup que rien n'a été oublié et que
     rien n'est retourné : une face manquante ou inversée change le résultat,
     alors qu'un simple « volume > 0 » laisserait passer les deux. */
  const maille = new Maillage();
  let volumeAttendu = maille.extruder(plateau, 0, o.base);
  if (o.creux) {
    /* Creusé : la plaque garde son épaisseur pleine en dessous, et la couche du
       dessus est le masque du plateau MOINS le relief. */
    const dessus = relief.inverse(0, 0, L, H);
    for (let i = 0; i < dessus.bits.length; i++) if (!plateau.bits[i]) dessus.bits[i] = 0;
    volumeAttendu += maille.extruder(dessus, o.base, o.base + o.relief);
  } else {
    for (let i = 0; i < relief.bits.length; i++) if (!plateau.bits[i]) relief.bits[i] = 0;
    volumeAttendu += maille.extruder(relief, o.base, o.base + o.relief);
  }

  return { maille, mois: m, L, H, lignes, epaisseur: o.base + o.relief, options: o,
           masqueRelief: relief, masquePlaque: plateau, volumeAttendu };
}

/* ════════════════════════════════════════════════════════════
   6. Contrôles avant impression
   ════════════════════════════════════════════════════════════ */

function verifier(p) {
  const bb = p.maille.boite3D();
  const ennuis = [];

  /* Le contrôle qui vaut vraiment la peine : le volume calculé sur les triangles
     doit retomber sur celui des boîtes empilées. Une face retournée le rend
     négatif ou trop petit, une face oubliée le fausse aussi — alors qu'un
     simple « volume > 0 » laisserait passer les deux. Le trancheur, lui, ne
     dit pas toujours non : il imprime la pièce à l'envers. */
  const vol = p.maille.volume();
  const ecart = Math.abs(vol - p.volumeAttendu);
  if (!(vol > 0)) ennuis.push(`volume signé ${vol.toFixed(1)} mm³ — des faces sont retournées`);
  else if (ecart > Math.max(1e-6, p.volumeAttendu * 1e-9))
    ennuis.push(`volume ${vol.toFixed(3)} mm³ au lieu de ${p.volumeAttendu.toFixed(3)} — maillage incomplet`);

  if (p.maille.tri.length % 12 !== 0) ennuis.push('le maillage ne se décompose pas en boîtes');
  if (p.maille.tri.some(t => t.some(v => v.some(x => !Number.isFinite(x)))))
    ennuis.push('coordonnées non finies');

  /* Le volume a un angle mort : une face retournée dont le plan passe par
     l'origine ne change pas la somme. On vérifie donc chaque boîte pour
     elle-même — sa normale doit s'éloigner de son propre centre. Là, il n'y a
     plus de point aveugle. */
  const retournees = [];
  for (let b = 0; b * 12 < p.maille.tri.length; b++) {
    const groupe = p.maille.tri.slice(b * 12, b * 12 + 12);
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (const t of groupe) for (const v of t) for (let i = 0; i < 3; i++) {
      if (v[i] < min[i]) min[i] = v[i];
      if (v[i] > max[i]) max[i] = v[i];
    }
    const centre = min.map((v, i) => (v + max[i]) / 2);
    for (const [a, bb, c] of groupe) {
      const u = [bb[0] - a[0], bb[1] - a[1], bb[2] - a[2]];
      const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      const g = [(a[0] + bb[0] + c[0]) / 3 - centre[0],
                 (a[1] + bb[1] + c[1]) / 3 - centre[1],
                 (a[2] + bb[2] + c[2]) / 3 - centre[2]];
      if (n[0] * g[0] + n[1] * g[1] + n[2] * g[2] <= 0) { retournees.push(b); break; }
    }
  }
  if (retournees.length)
    ennuis.push(`${retournees.length} boîte(s) avec une face retournée (première : n°${retournees[0]})`);

  /* Un relief nul donne une plaque lisse : elle passe tous les contrôles
     géométriques et ne porte aucun chiffre. */
  if (!(p.options.relief > 0)) ennuis.push('relief nul — la plaque sortirait vierge');

  const lit = p.options.lit;
  if (lit && (bb.taille[0] > lit || bb.taille[1] > lit))
    ennuis.push(`${bb.taille[0].toFixed(0)}×${bb.taille[1].toFixed(0)} mm : plus grand que le plateau (${lit} mm)`);

  /* Le relief doit vraiment dépasser : sans ça on imprime une plaque nue. */
  if (Math.abs(bb.taille[2] - p.epaisseur) > 0.01)
    ennuis.push(`épaisseur ${bb.taille[2].toFixed(2)} mm au lieu de ${p.epaisseur}`);

  return { ok: ennuis.length === 0, ennuis, volume: vol, bb, triangles: p.maille.tri.length };
}

/* ════════════════════════════════════════════════════════════
   7. Aperçu ASCII — voir la plaque avant de lancer trois heures d'impression
   ════════════════════════════════════════════════════════════ */

/** Le masque du relief, réduit à la largeur d'un terminal. */
function apercu(masque, colonnes = 108) {
  const ech = Math.max(1, Math.ceil(masque.w / colonnes));
  /* Un caractère de terminal est environ deux fois plus haut que large : on
     échantillonne deux fois moins finement en hauteur, sinon la plaque paraît
     étirée et on croit à un défaut de mise en page. */
  const echY = ech * 2;
  const out = [];
  for (let y = masque.h - 1; y >= 0; y -= echY) {
    let ligne = '';
    for (let x = 0; x < masque.w; x += ech) {
      let plein = 0, total = 0;
      for (let j = Math.max(0, y - echY + 1); j <= y; j++)
        for (let i = x; i < Math.min(masque.w, x + ech); i++) { total++; plein += masque.bits[j * masque.w + i]; }
      const r = total ? plein / total : 0;
      ligne += r > 0.6 ? '#' : r > 0.3 ? '+' : r > 0.08 ? '.' : ' ';
    }
    out.push(ligne);
  }
  return out.join('\n');
}

/** Aperçu fidèle, à l'échelle réelle : un SVG s'ouvre dans n'importe quel
    navigateur et montre exactement ce que le trancheur va voir. L'aperçu ASCII
    sert à jeter un œil dans le terminal, celui-ci sert à décider. */
function svg(p) {
  const rects = (masque, couleur) => masque.rectangles()
    .map(([x, y, dx, dy]) =>
      `<rect x="${x.toFixed(2)}" y="${(p.H - y - dy).toFixed(2)}" `
      + `width="${dx.toFixed(2)}" height="${dy.toFixed(2)}" fill="${couleur}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${p.L}mm" height="${p.H}mm" `
    + `viewBox="0 0 ${p.L} ${p.H}">`
    + `<rect width="${p.L}" height="${p.H}" fill="#1b1410"/>`
    + rects(p.masquePlaque, '#2e2419')
    + rects(p.masqueRelief, '#d9b444')
    + `</svg>`;
}

/* ════════════════════════════════════════════════════════════
   8. Ligne de commande
   ════════════════════════════════════════════════════════════ */

function lireOptions(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const cle = a.slice(2);
    if (cle === 'creux' || cle === 'aide' || cle === 'apercu') { o[cle] = true; continue; }
    const v = argv[++i];
    o[cle] = /^-?\d+(\.\d+)?$/.test(v) ? parseFloat(v) : v;
  }
  return o;
}

const AIDE = `
Calendrier de Kaleysur → plaques STL, un fichier par mois.

  node tools/calendrier-3d.js [options]

  --mois <n|all>    numéro de mois 1-9, ou « all » (défaut : all)
  --sortie <dir>    dossier de sortie (défaut : tools/out)
  --cellule <mm>    côté d'une case (défaut : 14)
  --base <mm>       épaisseur de la plaque (défaut : 3)
  --relief <mm>     hauteur des chiffres (défaut : 1.2)
  --marge <mm>      bordure (défaut : 8)
  --trou <mm>       diamètre du trou d'accroche, 0 pour aucun (défaut : 4)
  --creux           chiffres gravés au lieu de saillants
  --apercu          dessine la plaque dans le terminal, sans rien écrire
  --pas <mm>        finesse du maillage (défaut : 0.2)
  --lit <mm>        taille du plateau, pour l'avertissement (défaut : 220)
  --aide

Impression : à plat, sans support. Le relief fait 1,2 mm — un changement de
filament à cette hauteur donne des chiffres d'une autre couleur.
`;

function principal(argv) {
  const o = lireOptions(argv);
  if (o.aide) { console.log(AIDE); return 0; }

  const racine = path.resolve(__dirname, '..');
  const cal = chargerCalendrier(path.join(racine, 'calendrier.html'));
  const sortie = path.resolve(racine, o.sortie || 'tools/out');
  fs.mkdirSync(sortie, { recursive: true });

  const voulu = o.mois === undefined || o.mois === 'all' ? null : parseInt(o.mois, 10);
  if (voulu !== null && (!(voulu >= 1) || voulu > cal.mois.length)) {
    console.error(`--mois doit être entre 1 et ${cal.mois.length}, ou « all »`);
    return 1;
  }
  const indices = voulu === null ? cal.mois.map((_, i) => i) : [voulu - 1];

  console.log(`Calendrier : ${cal.mois.length} mois · ${cal.total} jours · `
            + `semaine de ${cal.semaine.length} · ${cal.lunes.length} lunes`);
  console.log(o.creux ? 'Chiffres gravés' : 'Chiffres saillants');
  console.log('');

  let souci = 0;
  for (const i of indices) {
    const p = plaque(cal, i, o);
    const v = verifier(p);
    const nom = `${String(i + 1).padStart(2, '0')}-${p.mois.name.normalize('NFD').replace(/[̀-ͯ]/g, '')}.stl`;

    if (o.apercu) {
      console.log(`── ${p.mois.name} ──`);
      console.log(apercu(p.masqueRelief));
      console.log('');
      continue;
    }

    fs.writeFileSync(path.join(sortie, nom), p.maille.stl(`Kaleysur ${p.mois.name}`));

    console.log(`${nom.padEnd(18)} ${p.mois.days} jours · ${p.lignes} lignes · `
              + `${p.L.toFixed(0)}×${p.H.toFixed(0)}×${p.epaisseur.toFixed(1)} mm · `
              + `${v.triangles.toLocaleString('fr')} triangles`);
    if (!v.ok) { souci++; v.ennuis.forEach(e => console.log(`   ⚠ ${e}`)); }
  }

  console.log('');
  console.log(souci ? `${souci} plaque(s) à vérifier avant impression` : `→ ${sortie}`);
  return souci ? 1 : 0;
}

module.exports = {
  litteral, analyser, chargerCalendrier, pixelsGlyphe, largeurTexte,
  Masque, Maillage, plaque, verifier, apercu, svg, DEFAUTS, GLYPHES, ACCENTS,
};

if (require.main === module) process.exit(principal(process.argv.slice(2)));
