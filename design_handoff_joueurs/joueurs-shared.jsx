/* global React */
const { useState } = React;

/* =====================================================================
   CHARACTER FIXTURE — used by all three variations
===================================================================== */
const CHAR = {
  name: "Vaelys Kaer",
  player: "Lior",
  classLine: "Sorcier 5 · Lignée Draconique",
  species: "Demi-elfe",
  background: "Sage",
  alignment: "Chaotique Bon",
  level: 5,
  xp: 6500,
  prof: 3,
  hp: 28, hpMax: 38, hpTemp: 4,
  ac: 14, init: 3, speed: 30,
  hd: "1d6", hdLeft: 3, hdMax: 5,
  abilities: [
    { k: "FOR", n: "Force",       sc: 8,  m: -1 },
    { k: "DEX", n: "Dextérité",   sc: 16, m: +3 },
    { k: "CON", n: "Constitution",sc: 14, m: +2 },
    { k: "INT", n: "Intelligence",sc: 12, m: +1 },
    { k: "SAG", n: "Sagesse",     sc: 11, m: 0  },
    { k: "CHA", n: "Charisme",    sc: 18, m: +4 },
  ],
  saves: [
    { n: "Force",        v: -1, p: false },
    { n: "Dextérité",    v: +3, p: false },
    { n: "Constitution", v: +5, p: true  },
    { n: "Intelligence", v: +1, p: false },
    { n: "Sagesse",      v: 0,  p: false },
    { n: "Charisme",     v: +7, p: true  },
  ],
  skills: [
    { n: "Arcanes",       a: "INT", v: +4, p: true },
    { n: "Histoire",      a: "INT", v: +4, p: true },
    { n: "Persuasion",    a: "CHA", v: +7, p: true },
    { n: "Tromperie",     a: "CHA", v: +7, p: true },
    { n: "Perception",    a: "SAG", v: 0,  p: false },
    { n: "Discrétion",    a: "DEX", v: +3, p: false },
    { n: "Athlétisme",    a: "FOR", v: -1, p: false },
    { n: "Investigation", a: "INT", v: +1, p: false },
  ],
  attacks: [
    { n: "Trait de feu",     bonus: "+7", dmg: "2d10",  type: "Feu" },
    { n: "Dague",            bonus: "+6", dmg: "1d4+3", type: "Perçant" },
    { n: "Boule de feu",     bonus: "DC 15", dmg: "8d6", type: "Feu (zone)" },
  ],
  spellSlots: [
    { lvl: 1, max: 4, used: 1 },
    { lvl: 2, max: 3, used: 2 },
    { lvl: 3, max: 2, used: 0 },
  ],
  resources: [
    { n: "Points de Sorcier", cur: 3, max: 5, reset: "Long" },
    { n: "Inspiration",       cur: 1, max: 1, reset: "—" },
  ],
  conditions: [
    { n: "Concentration", on: true, type: "conc" },
    { n: "Lié",           on: true, type: "neg" },
  ],
  features: [
    { n: "Origine arcanique : Draconique",  src: "Sorcier 1" },
    { n: "Métamagie (Distant, Subtil)",     src: "Sorcier 3" },
    { n: "Résilience draconique",           src: "Sorcier 1" },
  ],
  spells: [
    { lvl: "T", n: "Prestidigitation" },
    { lvl: "T", n: "Trait de feu" },
    { lvl: "T", n: "Lumière" },
    { lvl: 1,   n: "Bouclier" },
    { lvl: 1,   n: "Mains brûlantes" },
    { lvl: 2,   n: "Image-miroir" },
    { lvl: 2,   n: "Suggestion" },
    { lvl: 3,   n: "Boule de feu" },
    { lvl: 3,   n: "Contresort" },
  ],
  party: [
    { n: "Vaelys",  cls: "Sorc 5",  hp: 28, hpMax: 38, ico: "✦", color: "#c9a227", active: true },
    { n: "Brann",   cls: "Pal 4",   hp: 42, hpMax: 44, ico: "✚", color: "#e6d27a" },
    { n: "Mira",    cls: "Rogue 5", hp: 18, hpMax: 32, ico: "❂", color: "#7a9fd4" },
    { n: "Dorin",   cls: "Druid 4", hp: 30, hpMax: 30, ico: "❦", color: "#6aba6a" },
  ],
};

const sgn = n => (n >= 0 ? `+${n}` : `${n}`);

/* Hexagonal SVG used by Variation A */
const Hex = ({ size = 80, fill = "var(--k-card)", stroke = "var(--k-borderL)", sw = 1.4, children }) => (
  <svg viewBox="0 0 100 115" width={size} height={size * 1.15} style={{ display: "block" }}>
    <polygon points="50,2 96,28 96,87 50,113 4,87 4,28"
      fill={fill} stroke={stroke} strokeWidth={sw} />
    {children}
  </svg>
);

const Logo = ({ s = 22, c = "var(--k-gold)" }) => (
  <svg viewBox="0 0 100 88" width={s} height={s * 0.88} aria-hidden="true">
    <defs><mask id={`lm${s}`}>
      <rect width="100" height="88" fill="white" />
      <circle cx="50" cy="8" r="14" fill="black" />
      <circle cx="87" cy="74" r="14" fill="black" />
      <circle cx="13" cy="74" r="14" fill="black" />
      <circle cx="50" cy="52" r="10" fill="black" />
    </mask></defs>
    <polygon points="50,8 87,74 13,74" fill={c} mask={`url(#lm${s})`} />
  </svg>
);

window.CHAR = CHAR;
window.sgn = sgn;
window.Hex = Hex;
window.Logo = Logo;
