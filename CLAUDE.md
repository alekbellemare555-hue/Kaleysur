# CLAUDE.md — Kaleysur

Contexte de travail pour Claude Code. À lire au début de chaque session.

---

## Vue d'ensemble

Site web statique pour une campagne D&D 5e (monde de Kaleysur). Pages de lore + **fiche de personnage joueur interactive** (`joueurs.html`).

---

## Fichier principal : `joueurs.html`

~9700 lignes, tout-en-un : HTML + CSS inline (`<style>`) + JS inline en bas de page. **Toutes les modifications se font dans ce fichier.**

### Structure interne

```
<head>
  <style>          ← CSS global + composants (lignes ~1–1705)
  </style>
</head>
<body>
  <!-- HTML : nav, sidebar, écrans (auth / dashboard / view) -->

  <script>
    /* ── Section ── */   ← chaque bloc JS identifié par ce pattern
  </script>
</body>
```

### Écrans JS (`j-screen`)
- `#screen-auth` — login Firebase
- `#screen-dashboard` — fiche de personnage (actif par défaut après login)
- `#screen-view` — lecture seule partagée

### Onglets du dashboard (`.tab-btn[data-tab="…"]`)
| data-tab | Contenu |
|----------|---------|
| `personnage` | Stats, attaques, sorts, inventaire |
| `identite` | Backstory, personnalité |
| `inventaire` | Items |
| `notes` | Canvas + texte |
| `parametres` | Thème, fond de page/personnage |

---

## Modèle de données

```javascript
playerData = {
  uid, avatar, email,
  activeCharId: "char_0",          // ID du personnage actif
  characters: {
    "char_0": {
      name: "Nom affiché",
      character: { /* données fiche */ }
    }
  }
}
```

### Accesseurs clés

```javascript
C()           // → character object du personnage actif (for, dex, …)
activeSlot()  // → { name, character } du slot actif
pb(niveau)    // → bonus de maîtrise (Math.ceil(niveau/4)+1)
mod(score)    // → modificateur ability (Math.floor((score-10)/2))
abilScore(key)// → parseInt(C()[key]) || 10
```

### Champs du character object (C())
`for, dex, con, int, sag, cha` — scores de caractéristiques (number)  
`pvMax, pvActuel, pvTemp` — HP  
`classe, niveau, race, background` — infos de base  
`attaques[]` — tableau d'attaques `{name, degats, typeDegat, atkType, prof, bonus}`  
`sorts[]`, `ressources[]`, `conditions[]`, `inventory[]`  
`bgImage` — image de fond personnage (base64 ou URL)  
`bgPageImage` — image fond de page  
`gold, theme` — couleur thème (hex)

---

## Conventions CSS

### Variables CSS (définies sur `:root` via JS `applyTheme()`)
```css
--bg-primary    /* fond principal du body/main */
--bg-nav        /* fond topbar + sidebar */
--bg-card       /* fond des cards/sections */
--bg-secondary  /* fond intermédiaire */
--border        /* couleur bordures */
--gold          /* couleur accent principale */
--gold-dark     /* variante sombre de gold */
--j-panel       /* fond panels fiche */
--j-input       /* fond inputs */
--j-border-col  /* bordures dans la fiche */
--j-text        /* texte principal fiche */
```

**Règle absolue** : ne jamais hardcoder `#0e0a04` ou autre couleur — toujours utiliser `var(--bg-primary, #0e0a04)`.

### Classes importantes
- `.j-screen` / `.j-screen.active` — écrans (display:none / block)
- `.sheet-section` — sections de la fiche (content-visibility: auto)
- `.roll-trigger` — élément cliquable pour lancer un dé (besoin de `data-roll-label` + `data-roll-bonus`)
- `.tab-panel` — panneaux d'onglets
- `.vb-topbar` — barre fixe sous la nav (position:fixed, top:60px, left:var(--sidebar-w))

---

## Conventions JS

### Sauvegarde
```javascript
triggerSave()        // toujours appeler après mutation de C() ou playerData
```

### Render functions (toujours appeler après modification des données)
```javascript
renderAttacks()      // section attaques
renderSpells()       // sorts
renderSkills()       // compétences
renderSaves()        // jets de sauvegarde
renderResources()    // ressources
renderInventory()    // inventaire
renderCharCards()    // cards de personnage (sidebar / ribbon)
renderCharSelector() // dropdown sélecteur de personnage dans la topbar
updateHpBar()        // barre HP
updateModifier(key)  // modificateur d'une stat (ex: 'dex')
updateSpellCalcs()   // DC sort, bonus attaque de sort
```

### Debounce pour les recalculs lourds
```javascript
debouncedStats(fn)   // retarde les recalculs coûteux (skills, saves, attacks)
```

### Dés
```javascript
showDiceRoll(label, bonus)    // toast d20 + bonus
rollDiceExpr('2d6+3')         // → {total, detail}
```

### Multi-personnage
```javascript
switchCharacter(charId)   // change de personnage actif
openNewCharModal()        // ouvre la modal de création
```

---

## Layout

```
[top-nav fixed 60px]
[topbar fixed 60→112px : brand | char-selector | tabs | actions]
[sidebar fixed 260px gauche | main.main-content]
  [page-wrapper margin-top:60px]
    [main padding: 25px 21px]
      [screen-dashboard padding-top:52px]
        [layout-grid : col-gauche | col-centre | col-droite]
```

**Gotcha sticky** : `main.main-content` a `overflow-x: hidden` qui casse `position:sticky`. La topbar est donc `position:fixed`.

---

## Service worker

`service-worker.js` — **toujours bumper `CACHE_NAME`** après chaque modification de `joueurs.html` ou assets.

```javascript
const CACHE_NAME = 'kaleysur-vXX';  // incrémenter XX
```

Stratégie actuelle : network-first pour HTML, cache-first pour assets (CSS/JS/images).

---

## Procédure de deploy

1. Modifier `joueurs.html`
2. Bumper `CACHE_NAME` dans `service-worker.js` (vXX → vXX+1)
3. `git add joueurs.html service-worker.js`
4. `git commit -m "fix/feat: description courte"`
5. `git push`

---

## Firebase / Auth

- Authentification Firebase (email/password)
- Données stockées dans Firestore : `players/{uid}`
- `playerData` est chargé au login et sauvegardé via `triggerSave()` (debounced)

---

## Pièges connus

- **Hardcoded colors** : tout fond doit utiliser `var(--bg-primary)` etc., jamais de hex direct dans le CSS inline
- **`height: auto !important`** sur `.vb-topbar` : supprimé — gardé à `52px !important; flex-wrap: nowrap !important`
- **Sticky cassé** : `overflow-x: hidden` sur `main.main-content` → utiliser `position:fixed` pour les éléments qui doivent rester visibles
- **Cache SW** : oublier de bumper → les utilisateurs voient l'ancienne version
- **`flex-wrap: wrap`** hérité de `.dash-header` → override explicite sur `.vb-topbar`
