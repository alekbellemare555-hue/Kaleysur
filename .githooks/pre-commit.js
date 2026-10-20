/* Pre-commit Kaleysur
   1. Vérifie la syntaxe JS des fichiers HTML (blocs <script>) et .js stagés
   2. Bump automatique de CACHE_NAME dans service-worker.js si des assets sont stagés
      (élimine le piège n°1 : oublier le bump → les utilisateurs voient l'ancienne version) */
const { execSync } = require('child_process');
const fs = require('fs');

function sh(cmd) { return execSync(cmd, { encoding: 'utf8' }); }
function stagedContent(file) { return sh(`git show :"${file}"`); }

const staged = sh('git diff --cached --name-only --diff-filter=ACM')
  .split('\n').map(s => s.trim()).filter(Boolean);

if (!staged.length) process.exit(0);

/* ── 1. Vérification syntaxe ── */
let errors = 0;
for (const f of staged) {
  if (f.startsWith('.claude/')) continue;
  try {
    if (/\.html$/.test(f)) {
      const html = stagedContent(f);
      const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
      blocks.forEach((m, i) => {
        try { new Function(m[1]); }
        catch (e) { console.error(`✗ ${f} — bloc <script> ${i}: ${e.message}`); errors++; }
      });
    } else if (/\.js$/.test(f) && f !== 'service-worker.js') {
      /* Node tolère un shebang en tête d'un script exécutable, new Function non :
         sans ce retrait, un outil en ligne de commande parfaitement valide se
         faisait refuser au commit. */
      try { new Function(stagedContent(f).replace(/^#![^\n]*\n/, '')); }
      catch (e) { console.error(`✗ ${f}: ${e.message}`); errors++; }
    }
  } catch { /* fichier supprimé/binaire : ignorer */ }
}
/* Caracteres de controle parasites : un \b ou \f ecrit litteralement dans le
   source (accident d'echappement lors d'une edition scriptee) passe la syntaxe
   mais casse silencieusement les regex qui le contiennent. */
const CTRL = /[\x07\x08\x0b\x0c]/g;
for (const f of staged) {
  if (f.startsWith('.claude/')) continue;
  if (!/\.(html|js|json|css)$/.test(f)) continue;
  try {
    const txt = stagedContent(f);
    const hits = [...txt.matchAll(CTRL)];
    if (hits.length) {
      console.error(`✗ ${f} — ${hits.length} caractere(s) de controle parasite(s) :`);
      hits.slice(0, 3).forEach(m => {
        const line = txt.slice(0, m.index).split('\n').length;
        console.error(`   ligne ${line} : ...${JSON.stringify(txt.slice(Math.max(0, m.index - 40), m.index + 20))}`);
      });
      errors++;
    }
  } catch { /* fichier supprime/binaire */ }
}

if (errors) {
  console.error(`\n${errors} erreur(s) de syntaxe — commit annulé.`);
  process.exit(1);
}

/* ── 2. Smoke-tests des calculs purs ──
   Ne tourne que si un fichier couvert par les tests est stagé. js/rules-2024.js
   en fait partie depuis que les données de règles y ont été extraites : sans lui
   dans cette liste, changer une table de classe ne déclenchait plus rien. */
const TESTE = ['joueurs.html', 'dm.html', 'js/rules-2024.js', 'js/compendium.js',
               'spells-2024.json', 'service-worker.js', 'css/style.css', 'js/theme.js',
               '.githooks/smoke-tests.js',
               // Le générateur de plaques 3D lit calendrier.html : changer l'un
               // sans vérifier l'autre donne des plaques qui contredisent le site.
               'calendrier.html', 'tools/calendrier-3d.js'];
if (staged.some(f => TESTE.includes(f))) {
  try {
    execSync(`node "${__dirname}/smoke-tests.js"`, { stdio: 'inherit' });
  } catch {
    console.error('Commit annulé (smoke-tests).');
    process.exit(1);
  }
}

/* ── 3. Bump auto du SW ── */
// service-worker.js en fait partie : changer sa logique de cache mérite une
// génération de cache neuve, sinon l'ancienne survit avec ses vieilles données.
const ASSET_RE = /^(joueurs\.html|dm\.html|index\.html|carte\.html|chronologie\.html|calendrier\.html|editeur-carte\.html|service-worker\.js|css\/|js\/|img\/|icons\/|lore\/|astoryem\/|ayakan\/|musiyav\/)|\.json$/;
const assetsStaged = staged.some(f => ASSET_RE.test(f) && f !== 'manifest.json');

if (assetsStaged && fs.existsSync('service-worker.js')) {
  const sw = fs.readFileSync('service-worker.js', 'utf8');
  const cur = sw.match(/kaleysur-v(\d+)/);
  let headVer = null;
  try { headVer = sh('git show HEAD:service-worker.js').match(/kaleysur-v(\d+)/); } catch {}
  if (cur && headVer && cur[1] === headVer[1]) {
    const next = parseInt(cur[1]) + 1;
    fs.writeFileSync('service-worker.js', sw.replace(/kaleysur-v\d+/, `kaleysur-v${next}`));
    sh('git add service-worker.js');
    console.log(`✓ SW cache bumpé automatiquement : v${cur[1]} → v${next}`);
  }
}

/* ── 4. Sitemap ──
   Une page ajoutée sans sitemap à jour est une page invisible. Le hook le
   régénère dès qu'une page est stagée, comme il bumpe le cache du SW. */
const pageStagee = staged.some(f => f.endsWith('.html'));
if (pageStagee && fs.existsSync(__dirname + '/gen-sitemap.js')) {
  try {
    execSync(`node "${__dirname}/gen-sitemap.js"`, { stdio: 'pipe' });
    /* Au premier commit le fichier n'existe pas encore dans HEAD : git ecrit
       alors sur stderr, ce qui ressemble a une erreur sans en etre une. */
    const avant = (() => {
      try { return execSync('git show HEAD:sitemap.xml', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }); }
      catch { return ''; }
    })();
    if (fs.readFileSync('sitemap.xml', 'utf8') !== avant) {
      sh('git add sitemap.xml');
      console.log('✓ sitemap.xml régénéré');
    }
  } catch (e) {
    console.error('Sitemap non régénéré :', e.message);
  }
}

console.log('✓ Pre-commit OK');
