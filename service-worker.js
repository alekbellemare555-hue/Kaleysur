const CACHE_NAME = 'kaleysur-v35';

const ASSETS = [
  'index.html',
  'joueurs.html',
  'carte.html',
  'chronologie.html',
  'calendrier.html',
  'editeur-carte.html',
  'css/style.css',
  'js/components.js',
  'js/wiki.js',
  'search-index.json',
  'manifest.json',
  'favicon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'img/carte-kaleysur.jpg',
  'lore/dieux.html',
  'lore/journal-arzi.html',
  'lore/organisations.html',
  'lore/personnages.html',
  'astoryem/arcanumbra.html',
  'astoryem/astoryem.html',
  'astoryem/cite-ombres.html',
  'astoryem/feymundi.html',
  'astoryem/ville-tempete.html',
  'astoryem/waterflow.html',
  'ayakan/armalak.html',
  'ayakan/ayakan.html',
  'ayakan/chaines-verre.html',
  'ayakan/comhan-de-na.html',
  'ayakan/creidak.html',
  'ayakan/creve-glace.html',
  'ayakan/curcodak.html',
  'ayakan/faran.html',
  'ayakan/fios.html',
  'ayakan/frayakin.html',
  'ayakan/grand-plateau.html',
  'ayakan/indelair.html',
  'ayakan/kasvir.html',
  'ayakan/kayadur.html',
  'ayakan/kolandur.html',
  'ayakan/laryok.html',
  'ayakan/leth.html',
  'ayakan/lukd-naek.html',
  'ayakan/lukd-oigrid.html',
  'ayakan/lukd-tagil.html',
  'ayakan/lukd-trenay.html',
  'ayakan/lukd-tuanak.html',
  'ayakan/mornea.html',
  'ayakan/ouestvir.html',
  'ayakan/portlune.html',
  'ayakan/pyrael.html',
  'ayakan/rusvar.html',
  'ayakan/selvend.html',
  'ayakan/solcara.html',
  'ayakan/sordas.html',
  'ayakan/staurdur.html',
  'ayakan/sunkur.html',
  'ayakan/thyrne.html',
  'ayakan/varask.html',
  'ayakan/yoklar.html',
  'ayakan/yokoki.html',
  'ayakan/zodory.html',
  'musiyav/akalima.html',
  'musiyav/anneau-dieux.html',
  'musiyav/archipel-ombres.html',
  'musiyav/aunthrevin.html',
  'musiyav/auranthil.html',
  'musiyav/bekai-keal.html',
  'musiyav/brastelma.html',
  'musiyav/briseneige.html',
  'musiyav/cairondel.html',
  'musiyav/callafhar.html',
  'musiyav/carroval.html',
  'musiyav/caudherra.html',
  'musiyav/clagrayn.html',
  'musiyav/creastail.html',
  'musiyav/cricrosal.html',
  'musiyav/darn-merath.html',
  'musiyav/darnobscur.html',
  'musiyav/dorvenkar.html',
  'musiyav/dusalain.html',
  'musiyav/eldmire.html',
  'musiyav/ellirhom.html',
  'musiyav/elvar-tyl.html',
  'musiyav/faelorrin.html',
  'musiyav/falstrein.html',
  'musiyav/fedhidom.html',
  'musiyav/forge-vivante.html',
  'musiyav/gouffre-ebrion.html',
  'musiyav/gravantempe.html',
  'musiyav/iles-hagruk.html',
  'musiyav/isvarun.html',
  'musiyav/kaelyth.html',
  'musiyav/kandor-zei.html',
  'musiyav/khaelbar.html',
  'musiyav/krelsum.html',
  'musiyav/linvelar.html',
  'musiyav/lunemiral.html',
  'musiyav/marolzhad.html',
  'musiyav/miriathael.html',
  'musiyav/mirsha-lu.html',
  'musiyav/munabenn.html',
  'musiyav/murblan.html',
  'musiyav/musiyav.html',
  'musiyav/narkun.html',
  'musiyav/naskarrem.html',
  'musiyav/saldromil.html',
  'musiyav/sarathiil.html',
  'musiyav/shurakai.html',
  'musiyav/sillu.html',
  'musiyav/solgirne.html',
  'musiyav/stasmoc.html',
  'musiyav/templum-triarii.html',
  'musiyav/terres-gelees.html',
  'musiyav/terres-pieuses.html',
  'musiyav/terres-sauvages.html',
  'musiyav/thylkarok.html',
  'musiyav/tinneas.html',
  'musiyav/tochion.html',
  'musiyav/tol-vekrah.html',
  'musiyav/treufloran.html',
  'musiyav/ukar-tal.html',
  'musiyav/uzzama.html',
  'musiyav/valacorra.html',
  'musiyav/valtendre.html',
  'musiyav/varnestal.html',
  'musiyav/vendrolis.html',
  'musiyav/vrekh-mhor.html',
  'musiyav/xakaril.html',
  'musiyav/xalatlal.html',
  'musiyav/xamaris.html',
  'musiyav/yabalta.html',
  'musiyav/yndarev.html'
];

/* ── Installation : mise en cache de tous les assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // On met en cache les fichiers un par un pour ne pas bloquer si un manque
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

/* ── Activation : suppression des anciens caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

const FONTS_CACHE = 'kaleysur-fonts-v1';
const FONTS_ORIGINS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/* ── Fetch : cache-first, fallback réseau ── */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Polices Google Fonts : stale-while-revalidate avec cache dédié
  if (FONTS_ORIGINS.some(o => url.hostname === o)) {
    event.respondWith(
      caches.open(FONTS_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          const fresh = fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached);
          return cached || fresh;
        })
      )
    );
    return;
  }

  // Ressources externes autres → ignorer (pas de cache)
  if (!url.hostname.includes(self.location.hostname)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      // Pas en cache → réseau, puis on l'ajoute au cache
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Hors ligne et pas en cache → page de fallback
        if (event.request.destination === 'document') {
          const indexUrl = new URL('index.html', self.registration.scope).href;
          return caches.match(indexUrl);
        }
      });
    })
  );
});

/* ── Message : forcer la mise à jour ── */
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
