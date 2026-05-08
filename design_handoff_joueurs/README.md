# Handoff — Espace Joueurs (Variation B · Carnet d'Aventurier)

## Aperçu
Refonte de la page `joueurs.html` du wiki Kaleysur : un **espace joueur D&D** unifié, lisible à la fois comme fiche de référence (entre les sessions) et comme outil rapide en jeu (au bord de la table). Direction retenue : **« Carnet d'Aventurier »** — éditoriale, portrait-led, rythme horizontal, palette gold/parchment fidèle au reste du wiki.

## À propos des fichiers livrés
**Les fichiers HTML/JSX dans ce paquet sont des références de design**, pas du code de production à intégrer tel quel. Le travail consiste à **recréer ce design dans l'environnement existant du wiki Kaleysur** (HTML/CSS vanilla — pas de framework), en réutilisant les patterns déjà établis (`css/style.css`, structure de `joueurs.html`, helpers `js/wiki.js`). Si à terme le projet migre vers un framework, recréer dans le framework choisi en gardant les tokens de design listés plus bas.

## Fidélité
**High-fidelity (hifi).** Couleurs, typographie, espacements, hiérarchie sont définitifs. Les chiffres exemples (Vaelys Kaer, Sorcier 5, etc.) sont des **données de démo** — les remplacer par les données réelles du joueur.

## Structure de la page (un seul écran)

Largeur de design : **1280px**. Responsive : sur < 900px, replier le rail droit sous le bloc principal puis empiler en une colonne.

### 1. Header (60px)
- Logo Kaleysur (SVG triangle troué — voir `joueurs-shared.jsx > Logo`) + mot « Kaleysur » en Cinzel 16px gold
- Séparateur · puis tag « CARNET D'AVENTURIER » en Cinzel 9px uppercase letter-spacing 0.12em color `#8a6e1a`
- À droite : **onglets** (Personnage / Inventaire / Sorts / Notes / Aide) — onglet actif = soulignement gold 2px, autres = transparent
- Border-bottom 1px `#4a3510`

### 2. Ruban de la compagnie (~50px)
- Liste horizontale des personnages du groupe (4–6)
- Chaque entrée : icône colorée + nom (Cinzel 12px) + sous-ligne (`Classe Niv · pv/pvMax` 9px mute)
- Personnage actif : fond `linear-gradient(180deg, transparent, rgba(201,162,39,0.06))` + soulignement gold 2px
- Bouton « + Nouveau personnage » à droite, dashed border, pill shape

### 3. Hero (3 colonnes : 260 / 1fr / 320, gap 28px, padding 32 40)

**Colonne 1 — Portrait**
- Carré 260×~347 (ratio 3/4), background `linear-gradient(135deg, #1f1709 0%, #0d0905 100%)`, border 1px `#6b4f1e`, border-radius 4px
- 4 ornements ✦ aux coins (font-size 0.75rem, opacity 0.55, color `#8a6e1a`)
- Placeholder : sigil SVG centré opacity 0.3 — à remplacer par image joueur quand disponible
- Sous le portrait : grille 3 colonnes CA / INIT / VIT (label Cinzel 8px mute, valeur Cinzel 20px gold)

**Colonne 2 — Identité (lead)**
- Mini-eyebrow `FOLIO · AN 287` (Cinzel 9px, gold-dark)
- **Nom du personnage** : Cinzel 48px gold, line-height 1.05, text-shadow `0 0 30px rgba(201,162,39,0.2)`
- Sous-titre italique Lora 16px parchment-dim : `Sorcier 5 · Lignée Draconique`
- Bandeau de **6 faits** style journal (Espèce, Background, Alignement, Niveau, XP, Maîtrise), séparés par border-left 1px, padding-left 16px chacun
  - label : Cinzel uppercase 8px mute
  - valeur : Cinzel 13px parchment
- **Caractéristiques** : grille 6 colonnes
  - chaque carte : padding 12 4 10, border 1px `#4a3510`, border-radius 3px
  - clé (FOR/DEX/...) : Cinzel 8px gold-dark
  - modificateur (ex `+4`) : Cinzel 26px gold, font-weight 600
  - score (ex `18`) : 9px mute, séparé par `border-top: 1px dashed rgba(74,53,16,0.5)`

**Colonne 3 — Vitalité (rail droit)**
- Carte gradient `linear-gradient(180deg, #1a1308, #0e0a04)`, border 1px borderL, border-radius 4px, padding 18 18 16
- Eyebrow « VITALITÉ » Cinzel 9px gold-dark
- Affichage HP : `<span 44px gold-light>{hp}</span> / {hpMax} <span class=eyebrow>PV</span>` text-shadow gold
- Barre HP linéaire 8px, fond `#0a0703`, fill = vert/jaune/rouge selon %, sur-couche bleue (`#3d7abf`) à droite pour PV temporaires
- Ligne de boutons : `Blesser` (rouge translucide) | input number 50px | `Soigner` (vert translucide)
- Footer : Dés de Vie + Death Saves (3 cercles success outline + 3 cercles danger outline)
- Sous-cartes : « Statuts actifs » (chips colorés : violet pour Concentration, rouge pour conditions négatives), « Ressources » (case à cocher gold + boutons Repos Court / Repos Long)

### 4. Trois colonnes inférieures (gap 28px, padding 0 40 32)

Chaque colonne a un titre stylé : barre 18px gold-dark + Cinzel 13px gold letter-spacing 0.06em, border-bottom 1px borderL, padding-bottom 8px.

**Col 1 · Sauvegardes & Compétences**
- Sous-titre Cinzel 9px gold-dark, border-bottom dashed
- Liste : `[pip 9px] {nom} … [val Cinzel gold]`
  - pip plein gold = maîtrise active, vide = non-maîtrisé
  - texte parchment si maîtrise, text2 sinon

**Col 2 · Attaques + Traits**
- Table fine : Nom / Bonus / Dégâts / Type
- En-tête Cinzel uppercase 8px gold-dark, border-bottom 1px
- Lignes border-bottom dashed
- Bonus en Cinzel gold ; Type italique mute 10px
- Section « Traits & Capacités » : nom + source (Cinzel 8px mute)

**Col 3 · Magie**
- Sous-titre « Emplacements » : pour chaque niveau, label `Niv. 1` + cercles 14px (`border: 2px solid gold-dark`, fill = utilisé, vide = disponible)
- Sous-titre « Sorts préparés » groupés par niveau (Tours / Niveau 1 / 2 / 3)
- Chaque sort = chip Cinzel 10px parchment, border 1px, padding 3px 9px, fond `rgba(201,162,39,0.04)`

### 5. Footer ornement
- Centré, color gold-dark, opacity 0.4, letter-spacing 0.5rem, padding 14 0 24, contenu : `✦ ✦ ✦`

## Interactions

- **Onglets header** : navigation entre vues (Personnage par défaut). Inventaire/Sorts/Notes/Aide à mocker pour l'instant.
- **Sélection compagnie** : cliquer un personnage du ruban charge sa fiche dans le hero
- **Damage / Heal** : valeur saisie dans l'input → applique au HP courant, clamp [0, hpMax+hpTemp]
- **Boutons Repos** : court = restaure ressources `reset:"Court"` ; long = restaure tout sauf inspiration et reset les Dés de Vie de moitié
- **Pip de maîtrise** : cliquable pour basculer (mode édition)
- **Sort cliqué** : ouvre détail (description, composantes, portée, durée) — modal ou panneau latéral
- **Hover** : bordures passent de `#4a3510` à `#8a6e1a`, transition 0.25s ease (cf. `--transition` du CSS existant)

## État (à gérer côté app)
- `activeCharId` (sélection compagnie)
- `chars[id] = { ...CHAR }` (map de personnages — voir `joueurs-shared.jsx > CHAR` pour le shape complet)
- `chars[id].hp`, `.hpTemp`, `.hdLeft`, `.spellSlots[].used`, `.resources[].cur`, `.deathSaves`, `.conditions`
- Persistance : `localStorage` (le wiki est PWA, pas de backend) — clé `kaleysur:chars:v1`
- Le ruban de compagnie est partagé entre joueurs si auth est en place (cf. `js/wiki.js` badge utilisateur)

## Tokens de design (extraits dans `joueurs-variations.css`)

| Token | Valeur | Usage |
|---|---|---|
| `--k-bg` | `#110d07` | fond global |
| `--k-bg2` | `#1c1409` | fond secondaire |
| `--k-card` | `#221a0e` | fond carte |
| `--k-nav` | `#0f0b05` | fond header/sidebar |
| `--k-border` | `#4a3510` | bordures par défaut |
| `--k-borderL` | `#6b4f1e` | bordures accentuées (hover/actif) |
| `--k-gold` | `#c9a227` | accent principal, titres |
| `--k-goldL` | `#e8c84a` | gold éclatant (gros chiffres) |
| `--k-goldD` | `#8a6e1a` | gold éteint (eyebrows, ornements) |
| `--k-parchment` | `#e8d5b0` | texte mis en valeur |
| `--k-parchD` | `#b8a880` | sous-titres italiques |
| `--k-text` | `#e2cfa0` | texte courant |
| `--k-text2` | `#a89060` | texte secondaire |
| `--k-mute` | `#6e5530` | labels, micro-texte |
| `--k-success` | `#6aba6a` | HP > 50%, soigner |
| `--k-danger` | `#c97a7a` | HP < 25%, blesser |
| `--k-radiant` | `#e6d27a` | HP 25–50% |
| `--k-ft` | `'Cinzel', serif` | titres / chiffres / labels |
| `--k-fb` | `'Lora', serif` | corps / italiques |

**Échelle d'espacement** : 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 24 / 28 / 32 / 40 px.
**Border-radius** : 3 / 4 / 6 / 99 (pills) px.
**Transitions** : 0.25s ease pour border-color, background, transform.

## Règles de typographie
- Tous les uppercase utilisent `letter-spacing: 0.08em` à `0.12em` selon taille (plus petit = plus serré dans la base, plus letter-spaced visuellement)
- Italique → couleur `parchD`, jamais le gold
- Pas de drop-shadow sur les corps de texte ; uniquement sur les gros chiffres or et le titre de personnage

## Assets
- **Logo Kaleysur** : SVG inline (triangle troué de 3 cercles) — voir `joueurs-shared.jsx > Logo`
- **Hex stones** : SVG inline `polygon points="50,2 96,28 96,87 50,113 4,87 4,28"` — voir `Hex` (utilisé seulement par variation A, pas B, mais conservé pour cohérence)
- **Polices** : Google Fonts — `Cinzel: 400/500/600/700` + `Lora: 400/600 + 400 italic`
- **Portrait** : placeholder à remplacer par upload joueur (prévoir `img/joueurs/{playerId}.{ext}` ou data-URL en localStorage)
- **Carte du monde** : non utilisée ici

## Fichiers fournis
- `preview.html` — version standalone navigable (ouvrir dans un navigateur pour voir le design en taille réelle)
- `joueurs-variation-b.jsx` — JSX commenté de référence — **structure et hiérarchie**, pas un composant à intégrer
- `joueurs-shared.jsx` — fixture `CHAR` complète (shape de données + valeurs d'exemple) + helpers `Logo`, `Hex`, `sgn`
- `joueurs-variations.css` — tokens + helpers réutilisables (`.k-mono-cap`, `.k-corner`)

## Référence dans le wiki existant
- `css/style.css` (1486 lignes) — palette et patterns déjà en place ; **réutiliser** les variables existantes (`--gold`, `--bg-card`, etc.) plutôt que d'introduire les `--k-*` ; ils sont équivalents
- `js/wiki.js` — sidebar, recherche, badge user
- `joueurs.html` — point d'entrée à remplacer
- `manifest.json` + `service-worker.js` — PWA, à ne pas casser
