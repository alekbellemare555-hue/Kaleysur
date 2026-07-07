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
      try { new Function(stagedContent(f)); }
      catch (e) { console.error(`✗ ${f}: ${e.message}`); errors++; }
    }
  } catch { /* fichier supprimé/binaire : ignorer */ }
}
if (errors) {
  console.error(`\n${errors} erreur(s) de syntaxe — commit annulé.`);
  process.exit(1);
}

/* ── 2. Smoke-tests des calculs purs (joueurs.html + dm.html) ──
   Ne tourne que si un des deux fichiers est stagé — sinon rien n'a pu casser. */
if (staged.some(f => f === 'joueurs.html' || f === 'dm.html')) {
  try {
    execSync(`node "${__dirname}/smoke-tests.js"`, { stdio: 'inherit' });
  } catch {
    console.error('Commit annulé (smoke-tests).');
    process.exit(1);
  }
}

/* ── 3. Bump auto du SW ── */
const ASSET_RE = /^(joueurs\.html|dm\.html|index\.html|carte\.html|chronologie\.html|calendrier\.html|editeur-carte\.html|css\/|js\/|img\/|icons\/|lore\/|astoryem\/|ayakan\/|musiyav\/)|\.json$/;
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

console.log('✓ Pre-commit OK');
