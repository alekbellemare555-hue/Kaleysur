# Kaleysur — Wiki du Monde

Wiki interactif du monde de campagne D&D **Kaleysur**, construit comme une Progressive Web App (PWA) en HTML/CSS/JS pur, sans framework ni build step.

## Structure du projet

```
/
├── index.html              # Page d'accueil
├── chronologie.html        # Frise chronologique
├── carte.html              # Carte interactive
├── calendrier.html         # Calendrier du monde
├── joueurs.html            # Fiches de personnage D&D
├── editeur-carte.html      # Éditeur de carte
│
├── astoryem/               # Continent 1 (~6 pages)
├── ayakan/                 # Continent 2 (~44 pages)
├── musiyav/                # Continent 3 (~80 pages)
├── lore/                   # Personnages, organisations, dieux
│
├── css/style.css           # Feuille de style unique
├── js/
│   ├── components.js       # Nav + sidebar injectées dynamiquement
│   └── wiki.js             # Recherche, thème, auth, sidebar toggle
│
├── search-index.json       # Index de recherche (source de vérité)
├── service-worker.js       # Cache PWA (v26)
└── manifest.json           # Métadonnées PWA
```

## Lancer le projet

Comme site statique, il suffit d'un serveur HTTP local :

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code : extension Live Server
```

Ouvrir ensuite `http://localhost:8080`.

## Architecture technique

### Nav & Sidebar centralisées (`js/components.js`)

La navigation et la sidebar ne sont définies **qu'en un seul endroit** : `js/components.js`. Chaque page HTML contient des conteneurs vides :

```html
<nav class="top-nav" id="main-nav"></nav>
<aside class="sidebar" id="sidebar"></aside>
```

`components.js` injecte le HTML au chargement, en calculant automatiquement les préfixes de chemin selon la profondeur de la page (`''` à la racine, `'../'` dans les sous-dossiers).

**Pour modifier le menu ou la sidebar :** éditer uniquement `js/components.js`.

### Index de recherche (`search-index.json`)

Toutes les entrées searchables sont dans `search-index.json`. `wiki.js` charge ce fichier en async au démarrage. Un fallback inline existe dans `wiki.js` pour le premier chargement hors ligne.

**Pour ajouter une page à la recherche :** ajouter une entrée dans `search-index.json` avec le format :

```json
{ "title": "Nom de la page", "category": "Type · Région", "url": "dossier/page.html" }
```

### PWA & Service Worker

Le service worker (`service-worker.js`, version `kaleysur-v26`) met en cache :
- Tous les assets statiques (HTML, CSS, JS, images)
- `search-index.json`
- Les polices Google Fonts (cache dédié, stale-while-revalidate)

**Après toute modification**, incrémenter `CACHE_NAME` dans `service-worker.js` pour forcer la mise à jour chez les utilisateurs.

### Authentification joueurs

L'authentification (`joueurs.html`) utilise `localStorage`. Les données sont locales au navigateur — adaptées pour un usage entre joueurs de confiance.

## Thème

Le thème dark fantasy est défini via CSS custom properties dans `css/style.css` :

| Variable | Valeur | Usage |
|---|---|---|
| `--gold` | `#c9a227` | Accent principal |
| `--gold-dark` | `#8a6e1a` | Bordures, liens |
| `--bg-primary` | `#110d07` | Fond principal |
| `--font-title` | Cinzel | Titres |
| `--font-body` | Lora | Corps de texte |

## Contenu du monde

| Continent | Pages | Description |
|---|---|---|
| **Astoryem** | ~6 | Continent réapparu, Éladrins immortels |
| **Ayakan** | ~44 | Quatre factions en guerre froide technologique |
| **Musiyav** | ~80 | Ancien continent marqué par l'Âge du Sang |

**Année courante** : 287 de l'Ère des Trinités.  
**Divinités** : 27 Élus ascendés, organisés en 9 trinités.
