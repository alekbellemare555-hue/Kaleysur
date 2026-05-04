/* ============================================================
   KALEYSUR WIKI — Script principal
   ============================================================ */

// --- Chemin de base (gère les sous-dossiers) ---------------
// Les URL dans SEARCH_INDEX sont relatives à la racine du wiki.
// Cette fonction calcule le préfixe à ajouter selon la profondeur de la page courante.
function getWikiRoot() {
  const path = window.location.pathname;
  const subdirs = ['astoryem', 'ayakan', 'musiyav', 'lore'];
  const parts = path.split('/').filter(p => p);
  const currentDir = parts.length >= 2 ? parts[parts.length - 2] : '';
  return subdirs.includes(currentDir) ? '../' : '';
}

// --- Données de recherche ----------------------------------
// Les URL sont relatives à la racine du wiki (ex: "astoryem/feymundi.html")
const SEARCH_INDEX = [
  // Continents
  { title: 'Astoryem', category: 'Continent', url: 'astoryem/astoryem.html' },
  { title: 'Ayakan', category: 'Continent', url: 'ayakan/ayakan.html' },

  // Ayakan — Grand Plateau
  { title: 'Grand Plateau', category: 'Région · Ayakan', url: 'ayakan/grand-plateau.html' },
  { title: 'Comhan De Na', category: 'Hub Technologique · Grand Plateau', url: 'ayakan/comhan-de-na.html' },
  { title: 'Armalak', category: 'Cité-Guilde Militaire · Grand Plateau', url: 'ayakan/armalak.html' },
  { title: 'Fios', category: 'Cité de la Recherche · Grand Plateau', url: 'ayakan/fios.html' },
  { title: 'Indelair', category: 'Cité des Artisans · Grand Plateau', url: 'ayakan/indelair.html' },
  { title: 'Lukd Oigrid', category: 'Mine Naine · Grand Plateau', url: 'ayakan/lukd-oigrid.html' },
  { title: 'Lukd Naek', category: 'Atelier de Tissage · Grand Plateau', url: 'ayakan/lukd-naek.html' },
  { title: 'Lukd Tagil', category: 'Cité de Construction · Grand Plateau', url: 'ayakan/lukd-tagil.html' },
  { title: 'Lukd Trenay', category: 'Cité Équestre · Grand Plateau', url: 'ayakan/lukd-trenay.html' },
  { title: 'Lukd Tuanak', category: 'Grenier du Plateau · Grand Plateau', url: 'ayakan/lukd-tuanak.html' },
  { title: 'Creidak', category: 'Cité Diplomatique · Grand Plateau', url: 'ayakan/creidak.html' },
  { title: 'Curcodak', category: 'Cité des Arts · Grand Plateau', url: 'ayakan/curcodak.html' },

  // Ayakan — Ouestvir
  { title: 'Ouestvir', category: 'Région · Ayakan', url: 'ayakan/ouestvir.html' },
  { title: 'Yokoki', category: 'Village Naturiste · Ouestvir', url: 'ayakan/yokoki.html' },
  { title: 'Laryok', category: 'Ville des Archives · Ouestvir', url: 'ayakan/laryok.html' },
  { title: 'Yoklar', category: 'Ville Cosmopolite · Ouestvir', url: 'ayakan/yoklar.html' },
  { title: 'Kasvir', category: 'Centre Intellectuel · Ouestvir', url: 'ayakan/kasvir.html' },
  { title: 'Rusvar', category: 'Ville des Arts et Festivals · Ouestvir', url: 'ayakan/rusvar.html' },
  { title: 'Sordas', category: 'Ville Marchande · Ouestvir', url: 'ayakan/sordas.html' },
  { title: 'Sunkur', category: 'Port Mystique · Ouestvir', url: 'ayakan/sunkur.html' },
  { title: 'Portlune', category: 'Port Commercial · Ouestvir', url: 'ayakan/portlune.html' },
  { title: 'Kayadur', category: 'Région des Ruines Ombreuses · Ouestvir', url: 'ayakan/kayadur.html' },
  { title: 'Zodory', category: 'Région des Diamants · Ouestvir', url: 'ayakan/zodory.html' },
  { title: 'Kolandur', category: 'Côtes du Delta · Ouestvir', url: 'ayakan/kolandur.html' },
  { title: 'Staurdur', category: 'Région des Vents · Ouestvir', url: 'ayakan/staurdur.html' },

  // Ayakan — Crève Glace
  { title: 'Crève Glace', category: 'Région Arctique · Ayakan', url: 'ayakan/creve-glace.html' },
  { title: 'Varask', category: 'Ville-Verrou · Crève Glace', url: 'ayakan/varask.html' },
  { title: 'Mornea', category: 'Port Arctique · Crève Glace', url: 'ayakan/mornea.html' },
  { title: 'Thyrne', category: 'Ville Thermale · Crève Glace', url: 'ayakan/thyrne.html' },
  { title: 'Selvend', category: 'Marché Saisonnier · Crève Glace', url: 'ayakan/selvend.html' },

  // Ayakan — Frayakin
  { title: 'Frayakin', category: 'Région du Feu Sacré · Ayakan', url: 'ayakan/frayakin.html' },
  { title: 'Solcara', category: 'Capitale Temple · Frayakin', url: 'ayakan/solcara.html' },
  { title: 'Pyraël', category: 'Cité des Verrières · Frayakin', url: 'ayakan/pyrael.html' },
  { title: 'Leth', category: 'Sainte Oasis · Frayakin', url: 'ayakan/leth.html' },
  { title: 'Faran', category: 'Citadelle Frontière · Frayakin', url: 'ayakan/faran.html' },
  { title: 'Chaînes de Verre', category: 'Site Sacré · Frayakin', url: 'ayakan/chaines-verre.html' },

  { title: 'Musiyav', category: 'Continent', url: 'musiyav/musiyav.html' },
  { title: "Anneau des Dieux", category: 'Lieu', url: 'musiyav/anneau-dieux.html' },
  { title: "Archipel des Ombres", category: 'Lieu', url: 'musiyav/archipel-ombres.html' },

  // Musiyav — Nord
  { title: 'Terres Gelées', category: 'Région · Musiyav Nord', url: 'musiyav/terres-gelees.html' },
  { title: 'Munabenn', category: 'Région Naine · Musiyav Nord', url: 'musiyav/munabenn.html' },
  { title: 'Creastail', category: 'Capitale Naine · Munabenn', url: 'musiyav/creastail.html' },
  { title: 'Stasmoc', category: 'Centre Métallurgique · Munabenn', url: 'musiyav/stasmoc.html' },
  { title: 'Clagrayn', category: 'Port Nain · Munabenn', url: 'musiyav/clagrayn.html' },
  { title: 'Fedhidom', category: 'Ville Souterraine · Munabenn', url: 'musiyav/fedhidom.html' },
  { title: 'Cricrosal', category: 'Poste Frontalier · Munabenn', url: 'musiyav/cricrosal.html' },
  { title: 'Cairondel', category: 'Royaume Goliath · Musiyav Nord', url: 'musiyav/cairondel.html' },
  { title: 'Gravantempe', category: 'Forteresse Royale · Cairondel', url: 'musiyav/gravantempe.html' },
  { title: 'Treufloran', category: 'Village Druides · Cairondel', url: 'musiyav/treufloran.html' },
  { title: 'Valtendre', category: 'Cité des Guérisseurs · Cairondel', url: 'musiyav/valtendre.html' },
  { title: 'Éllirhom', category: 'Forêt Ancestrale · Musiyav Nord', url: 'musiyav/ellirhom.html' },
  { title: 'Sarathiil', category: 'Région Côtière · Musiyav Nord', url: 'musiyav/sarathiil.html' },
  { title: 'Akalima', category: 'Grand Port · Sarathiil', url: 'musiyav/akalima.html' },
  { title: 'Yndarev', category: 'Village des Vents · Sarathiil', url: 'musiyav/yndarev.html' },
  { title: 'Sillu', category: 'Village Agricole · Sarathiil', url: 'musiyav/sillu.html' },

  // Musiyav — Centre
  { title: 'Murblan', category: 'Région · Musiyav Centre', url: 'musiyav/murblan.html' },
  { title: 'Bekai Keal', category: 'Cité · Murblan', url: 'musiyav/bekai-keal.html' },
  { title: 'Thylkarok', category: 'Cité des Arts · Murblan', url: 'musiyav/thylkarok.html' },
  { title: 'Carroval', category: 'Ville-Monument · Murblan', url: 'musiyav/carroval.html' },
  { title: 'Valacorra', category: 'Région Nobiliaire · Musiyav Centre', url: 'musiyav/valacorra.html' },
  { title: 'Aunthrevin', category: 'Cité Neutre · Valacorra', url: 'musiyav/aunthrevin.html' },
  { title: 'Vendrolis', category: 'Ville des Masques · Valacorra', url: 'musiyav/vendrolis.html' },
  { title: 'Darn Merath', category: 'Bastion des Duels · Valacorra', url: 'musiyav/darn-merath.html' },
  { title: 'Brastelma', category: 'Région Jungle · Musiyav Centre', url: 'musiyav/brastelma.html' },
  { title: 'Xalatlal', category: 'Cité du Masque · Brastelma', url: 'musiyav/xalatlal.html' },
  { title: 'Tochion', category: 'La Gueule Peinte · Brastelma', url: 'musiyav/tochion.html' },
  { title: 'Yabalta', category: 'Perchoir de Cendre · Brastelma', url: 'musiyav/yabalta.html' },
  { title: 'Caudherra', category: 'Région Nomade · Musiyav Centre', url: 'musiyav/caudherra.html' },
  { title: 'Saldromil', category: 'Seule Cité Sédentaire · Caudherra', url: 'musiyav/saldromil.html' },
  { title: 'Kandor-Zeï', category: 'Forteresse Nomade · Caudherra', url: 'musiyav/kandor-zei.html' },
  { title: 'Mirsha Lû', category: 'Cité des Parfums · Caudherra', url: 'musiyav/mirsha-lu.html' },
  { title: 'Ukar Tal', category: 'Justice Itinérante · Caudherra', url: 'musiyav/ukar-tal.html' },
  { title: 'Solgirne', category: 'Région Lacustre · Musiyav Centre', url: 'musiyav/solgirne.html' },
  { title: 'Varnestal', category: 'Capitale Lacustre · Solgirne', url: 'musiyav/varnestal.html' },
  { title: 'Linvelar', category: 'Hameau Forestier · Solgirne', url: 'musiyav/linvelar.html' },
  { title: 'Eldmire', category: 'Village sur Pilotis · Solgirne', url: 'musiyav/eldmire.html' },

  // Musiyav — Est
  { title: 'Viremarche', category: 'Région · Musiyav Est', url: 'musiyav/kaelyth.html' },
  { title: 'Briseneige', category: 'Bastion du Lys · Viremarche', url: 'musiyav/briseneige.html' },
  { title: 'Terres Pieuses', category: 'Région Sacrée · Musiyav Est', url: 'musiyav/terres-pieuses.html' },
  { title: 'Templum Triarii', category: 'Temple aux Neuf Sommets · Terres Pieuses', url: 'musiyav/templum-triarii.html' },
  { title: 'Forge Vivante', category: 'Sanctuaire · Terres Pieuses', url: 'musiyav/forge-vivante.html' },
  { title: 'Isvarun', category: 'Cité du Crépuscule · Terres Pieuses', url: 'musiyav/isvarun.html' },
  { title: 'Callafhar', category: 'Académie des Doutes · Terres Pieuses', url: 'musiyav/callafhar.html' },
  { title: 'Auranthil', category: 'Royaume Elfique · Musiyav Est', url: 'musiyav/auranthil.html' },
  { title: "Elvarë Tyl", category: 'Capitale Elfique · Auranthil', url: 'musiyav/elvar-tyl.html' },
  { title: 'Lunemiral', category: 'Cité des Astres · Auranthil', url: 'musiyav/lunemiral.html' },
  { title: 'Mirithaël', category: 'Ville Suspendue · Auranthil', url: 'musiyav/miriathael.html' },
  { title: 'Faelorrin', category: 'Cité de Résistance · Auranthil', url: 'musiyav/faelorrin.html' },
  { title: 'Xamaris', category: 'Empire du Reniement · Musiyav Est', url: 'musiyav/xamaris.html' },
  { title: 'Xakaril', category: 'Capitale · Xamaris', url: 'musiyav/xakaril.html' },
  { title: 'Marolzhad', category: 'Centre Administratif · Xamaris', url: 'musiyav/marolzhad.html' },
  { title: 'Dorvenkar', category: 'Arsenal Industriel · Xamaris', url: 'musiyav/dorvenkar.html' },
  { title: 'Naskarrem', category: 'Prison-Mine · Xamaris', url: 'musiyav/naskarrem.html' },
  { title: 'Khaëlbar', category: "Cité d'Entraînement · Xamaris", url: 'musiyav/khaelbar.html' },
  { title: 'Tol Vekrah', category: 'Centre Idéologique · Xamaris', url: 'musiyav/tol-vekrah.html' },
  { title: 'Krelsum', category: 'Forteresse-Frontière · Xamaris', url: 'musiyav/krelsum.html' },
  { title: 'Falstrein', category: 'Port Impérial · Xamaris', url: 'musiyav/falstrein.html' },

  // Musiyav — Terres Isolées
  { title: 'Terres Sauvages', category: 'Région · Musiyav Terres Isolées', url: 'musiyav/terres-sauvages.html' },
  { title: 'Dusalain', category: 'Désert de Sel · Musiyav', url: 'musiyav/dusalain.html' },
  { title: "Gouffre d'Ébrion", category: 'Lieu Sacré · Dusalain', url: 'musiyav/gouffre-ebrion.html' },
  { title: "Tinneas A'Bhàis", category: 'Île · Musiyav', url: 'musiyav/tinneas.html' },
  { title: 'Shurakai', category: 'Ville Mystérieuse · Musiyav', url: 'musiyav/shurakai.html' },
  { title: 'Narkûn', category: 'Désert des Exilés · Musiyav', url: 'musiyav/narkun.html' },
  { title: 'Uzzama', category: 'Cité des Exilés · Narkûn', url: 'musiyav/uzzama.html' },
  { title: 'Vrekh Mhor', category: 'Fourmilière-Cité · Narkûn', url: 'musiyav/vrekh-mhor.html' },

  // Régions Éloignées
  { title: 'Îles Hagruk', category: 'Archipel · Régions Éloignées', url: 'musiyav/iles-hagruk.html' },
  { title: 'Clan Grakh-Ul', category: 'Clan · Îles Hagruk', url: 'musiyav/iles-hagruk.html#clans' },
  { title: 'Clan Vorgrul', category: 'Clan · Îles Hagruk', url: 'musiyav/iles-hagruk.html#clans' },
  { title: 'Clan Dhurrek', category: 'Clan · Îles Hagruk', url: 'musiyav/iles-hagruk.html#clans' },
  { title: 'Clan Hral-Gur', category: 'Clan · Îles Hagruk', url: 'musiyav/iles-hagruk.html#clans' },
  { title: 'Darnobscur', category: 'Ville · Archipel des Ombres', url: 'musiyav/darnobscur.html' },
  { title: 'Roklune', category: 'Village · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Fort-Sépulcre', category: 'Lieu · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Tour de Benedicte le Gris', category: 'Donjon · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Néralith', category: 'Cité sous-marine · Archipel', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Lac des Sirènes', category: 'Lieu · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Coven des Trois Bouches', category: 'Groupe · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Morbhan le Scellé', category: 'Personnage · Anneau des Dieux', url: 'musiyav/anneau-dieux.html#ile4' },
  { title: 'Zargothrak', category: 'Personnage · Anneau des Dieux', url: 'musiyav/anneau-dieux.html#iles-detail' },

  // Personnages
  { title: 'Arzi Barmene', category: 'Personnage', url: 'lore/personnages.html#arzi-barmene' },
  { title: 'Journal d\'Arzi Barmene', category: 'Document', url: 'lore/journal-arzi.html' },
  { title: 'Myriel Topaz', category: 'Personnage · Feymundi', url: 'lore/personnages.html#myriel-topaz' },
  { title: 'Silitiama', category: 'Personnage · Feymundi', url: 'lore/personnages.html#silitiama' },
  { title: 'Arynn Sylfir', category: 'Personnage · Astoryem', url: 'lore/personnages.html#arynn-sylfir' },
  { title: 'Morwen la Tatouée', category: 'Personnage · Astoryem', url: 'lore/personnages.html#morwen' },
  { title: 'Rupert', category: 'Personnage · Astoryem', url: 'lore/personnages.html#rupert' },
  { title: 'Thokk Pok', category: 'Personnage · Astoryem', url: 'lore/personnages.html#thokk-pok' },
  { title: 'Udasa', category: 'Personnage · Astoryem', url: 'lore/personnages.html#udasa' },
  { title: 'Ellear Belkam', category: 'Personnage historique', url: 'lore/personnages.html#ellear-belkam' },
  { title: 'Les Sœurs du Temps', category: 'Personnage · Arcanumbra', url: 'lore/personnages.html#soeurs-du-temps' },

  // Organisations
  { title: "Ordre du Soleil Radiant", category: 'Organisation', url: 'lore/organisations.html#ordre-soleil' },
  { title: "Cercle de Myriel", category: 'Organisation · Feymundi', url: 'lore/organisations.html#cercle-myriel' },
  { title: "Conseil des Silencieux", category: 'Organisation · Waterflow', url: 'lore/organisations.html#conseil-silencieux' },
  { title: "Arc du Nord", category: 'Organisation · Astoryem', url: 'lore/organisations.html#arc-du-nord' },
  { title: "Hache de Sang", category: 'Organisation · Astoryem', url: 'lore/organisations.html#hache-de-sang' },
  { title: "Conseil de Ville Tempête", category: 'Organisation · Ville Tempête', url: 'lore/organisations.html#conseil-ville-tempete' },
  { title: "Résistances de l'Ombre", category: 'Organisation · Cité des Ombres', url: 'lore/organisations.html#resistances-ombre' },
  { title: "Conseil Astral", category: 'Organisation · Ouestvir', url: 'lore/organisations.html#conseil-astral' },

  // Chronologie
  { title: "Âge des Mythes", category: 'Chronologie', url: 'chronologie.html#age-mythes' },
  { title: "Ère du Silence", category: 'Chronologie', url: 'chronologie.html#ere-silence' },
  { title: "Invasion des Illithids", category: 'Chronologie', url: 'chronologie.html#invasion' },
  { title: "Ascension des 27 Élus", category: 'Chronologie', url: 'chronologie.html#ascension' },
  { title: "Création des Trinités", category: 'Chronologie', url: 'chronologie.html#trinites' },
  { title: "Calendrier de Kaleysur", category: 'Chronologie', url: 'chronologie.html#calendrier' },
  { title: "Les Trois Lunes", category: 'Chronologie · Lore', url: 'chronologie.html#lunes' },
  { title: "Lune Blanche", category: 'Lune · Kaleysur', url: 'chronologie.html#lunes' },
  { title: "Lune Bleue", category: 'Lune · Kaleysur', url: 'chronologie.html#lunes' },
  { title: "Lune Rouge", category: 'Lune · Kaleysur', url: 'chronologie.html#lunes' },
  { title: "Réolta", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Togail", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Amrean", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Brònair", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Féasach", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Soillse", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Cogadhán", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Fiadhra", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Sealbh", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Zénith de l'Année", category: 'Fête · 3 Soillse', url: 'chronologie.html#saisons' },

  // Dieux & Trinités
  { title: 'Cïaaïn', category: 'Dieu · Trinité de l\'Existence', url: 'lore/dieux.html#trinite-existence' },
  { title: 'Gealshaï', category: 'Déesse · Trinité de l\'Existence', url: 'lore/dieux.html#trinite-existence' },
  { title: 'Sgarlaïd', category: 'Déesse · Trinité de l\'Existence', url: 'lore/dieux.html#trinite-existence' },
  { title: 'Ritehakd', category: 'Dieu · Trinité du Corps', url: 'lore/dieux.html#trinite-corps' },
  { title: 'Seakad', category: 'Déesse · Trinité du Corps', url: 'lore/dieux.html#trinite-corps' },
  { title: 'Seo', category: 'Dieu · Trinité du Corps', url: 'lore/dieux.html#trinite-corps' },
  { title: 'Breith', category: 'Déesse · Trinité de la Naissance', url: 'lore/dieux.html#trinite-naissance' },
  { title: 'Beatha', category: 'Déesse · Trinité de la Naissance', url: 'lore/dieux.html#trinite-naissance' },
  { title: 'Crihok', category: 'Dieu · Trinité de la Naissance', url: 'lore/dieux.html#trinite-naissance' },
  { title: 'Dachaigheil', category: 'Dieu · Trinité de la Connaissance', url: 'lore/dieux.html#trinite-connaissance' },
  { title: 'Gintinn', category: 'Déesse · Trinité de la Connaissance', url: 'lore/dieux.html#trinite-connaissance' },
  { title: 'Sealg', category: 'Dieu · Trinité de la Connaissance', url: 'lore/dieux.html#trinite-connaissance' },
  { title: 'Talahmn', category: 'Dieu · Trinité de la Nature', url: 'lore/dieux.html#trinite-nature' },
  { title: 'Cuatan', category: 'Dieu · Trinité de la Nature', url: 'lore/dieux.html#trinite-nature' },
  { title: 'Néamnh', category: 'Déesse · Trinité de la Nature', url: 'lore/dieux.html#trinite-nature' },
  { title: 'Falahm', category: 'Dieu · Trinité des Arts', url: 'lore/dieux.html#trinite-arts' },
  { title: 'Foblath', category: 'Dieu · Trinité des Arts', url: 'lore/dieux.html#trinite-arts' },
  { title: 'Miforthan', category: 'Dieu · Trinité des Arts', url: 'lore/dieux.html#trinite-arts' },
  { title: 'Mathair', category: 'Déesse · Trinité de la Terre', url: 'lore/dieux.html#trinite-terre' },
  { title: 'Ciuin', category: 'Dieu · Trinité de la Terre', url: 'lore/dieux.html#trinite-terre' },
  { title: 'Gorta', category: 'Dieu · Trinité de la Terre', url: 'lore/dieux.html#trinite-terre' },
  { title: 'Ciarahd', category: 'Dieu · Trinité du Temps', url: 'lore/dieux.html#trinite-temps' },
  { title: 'Latha', category: 'Déesse · Trinité du Temps', url: 'lore/dieux.html#trinite-temps' },
  { title: 'Oidhche', category: 'Dieu · Trinité du Temps', url: 'lore/dieux.html#trinite-temps' },
  { title: 'Aonta', category: 'Déesse · Trinité de la Guerre', url: 'lore/dieux.html#trinite-guerre' },
  { title: 'Cogadh', category: 'Dieu · Trinité de la Guerre', url: 'lore/dieux.html#trinite-guerre' },
  { title: 'Ionnsaig', category: 'Dieu · Trinité de la Guerre', url: 'lore/dieux.html#trinite-guerre' },
  { title: 'Meora', category: 'Dieu Inférieur · Panthéon', url: 'lore/dieux.html#dieux-inferieurs' },
  { title: 'Spiaos', category: 'Dieu Inférieur · Panthéon', url: 'lore/dieux.html#dieux-inferieurs' },
  { title: 'Naluin', category: 'Dieu Inférieur · Panthéon', url: 'lore/dieux.html#dieux-inferieurs' },

  // Pages générales
  { title: 'Carte du Monde', category: 'Page', url: 'carte.html' },
  { title: 'Calendrier de Kaleysur', category: 'Page', url: 'calendrier.html' },
  { title: 'Chronologie', category: 'Page', url: 'chronologie.html' },
  { title: 'Personnages', category: 'Page', url: 'lore/personnages.html' },
  { title: 'Organisations & Guildes', category: 'Page', url: 'lore/organisations.html' },
  { title: 'Dieux & Trinités', category: 'Page', url: 'lore/dieux.html' },
];

// --- Recherche -----------------------------------------
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const ROOT = getWikiRoot();

if (searchInput && searchResults) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (q.length < 2) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('visible');
      return;
    }

    const results = SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    ).slice(0, 10);

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item">Aucun résultat trouvé.</div>';
    } else {
      searchResults.innerHTML = results.map(r => `
        <a class="search-result-item" href="${ROOT}${r.url}">
          <span class="search-result-category">${r.category}</span>
          ${r.title}
        </a>
      `).join('');
    }

    searchResults.classList.add('visible');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) {
      searchResults.classList.remove('visible');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchResults.classList.remove('visible');
      searchInput.blur();
    }
  });
}

// --- Thème sauvegardé (par joueurs.html) ---------------
(function applyStoredTheme() {
  try {
    const t = JSON.parse(localStorage.getItem('kaleysur_theme') || 'null');
    if (t && t.gold) document.documentElement.style.setProperty('--gold', t.gold);
    if (t && t.dark) document.documentElement.style.setProperty('--gold-dark', t.dark);
  } catch(e) {}
})();

// --- Indicateur utilisateur connecté ------------------
(function showUserBadge() {
  const kUser = localStorage.getItem('kaleysur_user');
  if (!kUser) return;
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;
  const root = getWikiRoot();
  const badge = document.createElement('a');
  badge.href = root + 'joueurs.html';
  badge.className = 'nav-user-badge';
  badge.innerHTML = `👤 <span>${kUser}</span>`;
  badge.title = 'Ma fiche joueur · ' + kUser;
  const ham = document.getElementById('hamburger');
  if (ham) navRight.insertBefore(badge, ham);
  else navRight.appendChild(badge);
})();

// --- Sidebar mobile -------------------------------------
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

if (hamburger && sidebar && overlay) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });
}

// --- Lien actif + sidebar déroulante -----------------
(function initSidebar() {
  // 1. Marquer le lien actif
  const pathParts = window.location.pathname.split('/').filter(p => p);
  const current = pathParts.pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const hrefFile = href.split('/').pop();
    if (hrefFile === current || (current === '' && hrefFile === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 2. Sections repliables
  const sections = document.querySelectorAll('.sidebar-section');
  sections.forEach(section => {
    const title = section.querySelector('.sidebar-section-title');
    if (!title) return;

    const titleText = title.textContent.trim();
    const hasActive = section.querySelector('.sidebar-link.active');

    // Navigation toujours ouverte ; sections avec lien actif ouvertes ; reste replié
    if (titleText !== 'Navigation' && !hasActive) {
      section.classList.add('collapsed');
    }

    // Toggle au clic
    title.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });
  });
})();

// --- Table des matières auto ---------------------------
(function buildTOC() {
  const toc = document.getElementById('auto-toc');
  if (!toc) return;

  const content = document.querySelector('.main-content');
  if (!content) return;

  const headings = content.querySelectorAll('h2, h3');
  if (headings.length < 2) { toc.remove(); return; }

  let html = '<ul>';
  let lastH2 = null;

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'section-' + i;
    if (h.tagName === 'H2') {
      if (lastH2 !== null) html += '</ul></li>';
      html += `<li><a href="#${h.id}">${h.textContent}</a><ul>`;
      lastH2 = i;
    } else {
      html += `<li><a href="#${h.id}">${h.textContent}</a></li>`;
    }
  });

  if (lastH2 !== null) html += '</ul></li>';
  html += '</ul>';
  toc.innerHTML = html;
})();

// --- Smooth scroll for anchor links --------------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Les Trois Lunes — Logo & Icônes sidebar ----------------
(function initMoonIcons() {
  // 1. Remplacer l'icône ⚜ de la barre de navigation par l'icône officielle de l'app
  var brandIcon = document.querySelector('.nav-brand-icon');
  if (brandIcon) {
    var root = getWikiRoot();
    brandIcon.style.cssText = 'display:flex;align-items:center;font-size:0;line-height:1';
    brandIcon.innerHTML = '<img src="' + root + 'icons/icon-192.png" alt="Les Trois Lunes de Kaleysur" width="28" height="28" style="border-radius:50%;display:block;">';
  }

  // 2. Appliquer data-moon à chaque section de la sidebar
  var moonMap = {
    'Navigation':        'white',
    'Astoryem':          'blue',
    'Ayakan':            'white',
    'Musiyav':           'red',
    'Régions Éloignées': 'red',
    'Personnages & Lore':'gold'
  };
  document.querySelectorAll('.sidebar-section').forEach(function(section) {
    var titleEl = section.querySelector('.sidebar-section-title');
    if (!titleEl) return;
    // Retirer le chevron ▾ injecté en CSS ::after
    var text = titleEl.textContent.replace('▾','').trim();
    var moon = moonMap[text];
    if (moon) section.setAttribute('data-moon', moon);
  });
})();

// --- Bibliothèque d'icônes SVG — remplace les emojis dans .icon, .card-icon, .infobox-image --------
(function initIconSet() {
  var s  = 'stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"';
  var fc = 'fill="currentColor" stroke="none"';

  function p(d)            { return '<path '  + s  + ' d="'    + d  + '"/>'; }
  function pf(d)           { return '<path '  + fc + ' d="'    + d  + '"/>'; }
  function c(cx,cy,r)      { return '<circle '+ s  + ' cx="'   + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
  function cf(cx,cy,r)     { return '<circle '+ fc + ' cx="'   + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
  function l(x1,y1,x2,y2) { return '<line '  + s  + ' x1="'   + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; }
  function r(x,y,w,h,rx)  { return '<rect '  + s  + ' x="'    + x  + '" y="'  + y  + '" width="' + w + '" height="' + h + '"' + (rx ? ' rx="' + rx + '"' : '') + '/>'; }

  var ICON_MAP = {
    // — Temps / Magie —
    '⌛': p('M3 2h10M3 14h10M3.5 2C5.5 6 10.5 6 12.5 2M3.5 14C5.5 10 10.5 10 12.5 14') + p('M5.5 10L8 8l2.5 2'),
    '⏳': p('M3 2H13M3 14H13') + p('M4 2C4 5 7 7 8 8C9 9 12 11 12 14') + p('M12 2C12 5 9 7 8 8C7 9 4 11 4 14') + cf(8,9,1),
    '✨': p('M8 1L9 6.3 14 7 9 7.7 8 13 7 7.7 2 7 7 6.3z') + cf(13,3,1) + cf(3.5,12,0.8),
    '⚡': pf('M10 1.5L4 8.5H8.5L6 14.5L14 7.5H9.5z'),
    '🌙': p('M11 3.5C11 3.5 8 4.5 8 8C8 11.5 11 12.5 11 12.5C11 12.5 4.5 13 4.5 8C4.5 3 11 3.5 11 3.5z'),
    '🌑': cf(8,8,5.5),
    '🌒': p('M8 2C8 2 10 4 10 8C10 12 8 14 8 14C7 11 7 5 8 2Z') + p('M8 2C7 4 6 6 6 8C6 10 7 12 8 14'),
    '🌕': cf(8,8,5.5),
    '🌟': p('M8 1L9.2 6.2 14.5 7 9.8 8.2 8 14 6.2 8.2 1.5 7 6.8 6.2z'),

    // — Armes / Combat —
    '⚔️': l(2,14,14,2) + l(2,2,14,14) + p('M11.5 2H14V4.5') + p('M2 11.5V14H4.5') + p('M4.5 2H2V4.5') + p('M14 11.5V14H11.5'),
    '⚒️': p('M3 13L9 7M9 7C10 6 11.5 4.5 13 3.5L14.5 5L13 8') + p('M13 13L7 7M7 7C6 6 4.5 4.5 3 3.5L1.5 5L3 8'),
    '⛏️': p('M2.5 14L9 7.5') + p('M9 7.5L12 4.5L14 2.5L15.5 4L13.5 6.5') + p('M9 7.5L11.5 10'),
    '🛡️': p('M8 1.5L2 4.5V9.5C2 12.5 5 14.5 8 15C11 14.5 14 12.5 14 9.5V4.5z'),
    '🗡️': pf('M8 2L9.5 6L8 14L6.5 6Z') + r(5.5,5.5,5,1.2,0.3),
    '🏹': p('M3 13C2 8 4 4 8 4') + p('M8 4L8 8') + l(4,13,14,3) + p('M11 3L14 3L14 6'),
    '🔨': pf('M2 6H8V10H2Z') + l(8,8,13,13),
    '🪣': p('M4 12L9 5L13 7L11 10L8 10L7 13Z') + l(8,10,14,14),
    '🛠️': l(3,13,9,7) + p('M9 7L11 5L13 3L15 5L13 7L11 5') + p('M3 13L1 15H3Z'),

    // — Symboles d'avertissement / état —
    '⚠️': pf('M8 2L15 14H1Z') + cf(8,12,0.8) + l(8,6,8,10),
    '⚫': cf(8,8,5.5),
    '⚪': c(8,8,5.5),
    '⬛': r(2,2,12,12,0.5),
    '⬜': r(2,2,12,12,0.5),
    '🔴': cf(8,8,5.5),
    '🔵': cf(8,8,5.5),
    '🟡': cf(8,8,5.5),
    '🚫': c(8,8,6) + l(3.5,3.5,12.5,12.5),

    // — Nature / Éléments —
    '❄️': l(8,1,8,15) + l(1,8,15,8) + l(3,3,13,13) + l(13,3,3,13) + p('M6 2.5L8 4.5L10 2.5M6 13.5L8 11.5L10 13.5') + p('M2 6L4 8L2 10M14 6L12 8L14 10'),
    '🌊': p('M1 8.5C3 6.5 5 10.5 7 8.5S11 6.5 13 8.5C14.3 9.5 15 9 15 9') + p('M1 12C3 10 5 14 7 12S11 10 13 12C14.3 13 15 12.5 15 12.5'),
    '🌋': p('M8 1L4.5 9H11.5z') + p('M4.5 9L1 15H15L11.5 9') + p('M7 5.5L6 8H10L9 5.5'),
    '🌾': l(8,14,8,4) + p('M8 4L5.5 6M8 4L10.5 6') + p('M8 6.5L5.5 8.5M8 6.5L10.5 8.5') + p('M8 9L6 11M8 9L10 11'),
    '🌿': p('M3 14C3 14 4 8 8.5 6C13 4 14.5 6 14.5 6C14.5 6 11 8 8 10.5C5 13 3 14 3 14z') + l(3,14,9,9),
    '🍃': p('M4.5 14C4.5 14 4 8.5 8 5.5C12 2.5 14.5 4 14.5 4C14.5 4 12 8 8.5 10.5C5 13 4.5 14 4.5 14z') + l(4.5,14,10.5,8),
    '🌲': p('M8 1.5L4.5 7H6L3 11H6V14.5H10V11H13L10 7H11.5z'),
    '🌳': p('M8 1.5C8 1.5 3.5 4.5 4.5 8C5 10 7 11 7 11V14.5H9V11C9 11 11 10 11.5 8C12.5 4.5 8 1.5 8 1.5z'),
    '🌅': p('M2.5 10.5A5.5 5.5 0 0 1 13.5 10.5') + l(1,12,15,12) + l(8,3,8,6) + p('M3.5 5L5.5 7M12.5 5L10.5 7'),
    '🌫️': p('M1 6C2.5 5 3.5 7 5 6S7.5 5 9 6S12 5 13.5 6') + p('M1 9.5C2.5 8.5 3.5 10.5 5 9.5S7.5 8.5 9 9.5S12 8.5 13.5 9.5') + p('M3 13H12'),
    '💨': p('M1 7C3 7 5 5.5 5 7.5C5 9.5 3 9 2.5 8.5') + p('M3 10.5C5 10.5 7 9 8 11') + p('M1.5 13C4.5 13 6.5 11.5 7.5 13'),
    '💧': p('M8 2C8 2 3.5 7 3.5 10.5C3.5 12.5 5.5 14 8 14C10.5 14 12.5 12.5 12.5 10.5C12.5 7 8 2 8 2z'),
    '🔥': p('M8 2C9 5 11.5 6 11.5 9C11.5 11.5 10 13.5 8 13.5C6 13.5 4.5 12 4.5 10C4.5 8.5 5.5 8 5.5 8C5.5 10 7 10 7 10C7 7.5 5 5.5 6.5 2C6.5 2 7 5 9 6.5C10 7.5 10 9.5 9 9.5C9 7 8 5 8 2z'),
    '♨️': p('M4 12C3.5 10.5 4.5 9.5 4 8C3.5 6.5 4.5 5.5 4 4M8 12C7.5 10.5 8.5 9.5 8 8C7.5 6.5 8.5 5.5 8 4M12 12C11.5 10.5 12.5 9.5 12 8C11.5 6.5 12.5 5.5 12 4'),
    '☀️': c(8,8,3.5) + l(8,1,8,3) + l(8,13,8,15) + l(1,8,3,8) + l(13,8,15,8) + l(3.5,3.5,5,5) + l(11,5,12.5,3.5) + l(11,11,12.5,12.5) + l(3.5,12.5,5,11),
    '☁️': p('M3 11C1.5 11 1.5 8.5 3 8.5C3 6.5 5 5.5 7 6.5C7.5 4.5 10 4 11.5 5.5C14 5.5 14 8.5 12 8.5H3V11Z'),
    '⛈️': p('M3 9C1.5 9 1.5 6.5 3 6.5C3 4.5 5 3.5 7 4.5C7.5 2.5 10 2 11.5 3.5C14 3.5 14 6.5 12 6.5H3Z') + l(6,9,5,13) + l(9,9,8,13) + l(12,9,11,13),
    '🌪️': p('M9 2C12 2 14 4 14 6C14 8 12 9 10 9C8 9 7 10 7 12C7 13 8 14 9 14C11 14 12 13 12 12'),
    '🌨️': p('M3 9C1.5 9 1.5 6.5 3 6.5C3 4.5 5 3.5 7 4.5C7.5 2.5 10 2 11.5 3.5C14 3.5 14 6.5 12 6.5H3Z') + cf(5,11,0.8) + cf(8,12,0.8) + cf(11,11,0.8) + cf(5,13,0.8) + cf(8,14,0.8),
    '🌬️': p('M1 6C3 6 4 5 5 6C6 7 7 6 8 6') + p('M1 9C4 9 6 8 8 9C10 10 12 9 14 10C15 10.5 15 9 14 9') + p('M1 12C3 12 5 11 7 11'),
    '🌱': l(8,14,8,9) + p('M8 9C7 8 5 7 5 5C5 3 6.5 2 8 3C9.5 2 11 3 11 5C11 7 9 8 8 9'),
    '🌸': cf(8,8,1.5) + p('M8 4.5C7.2 5.5 8.8 5.5 8 4.5') + p('M11.5 6C10.5 7.2 10.5 5.8 11.5 6') + p('M11 11C10 10 9 11.5 11 11') + p('M5 11C6 10 7 11.5 5 11') + p('M4.5 6C5.5 7.2 5.5 5.8 4.5 6'),
    '🍂': p('M8 14C7 12 4 10 3 7C2 4 4 2 6 3C7 3.5 8 5 8 5C8 5 9 3.5 10 3C12 2 14 4 13 7C12 10 9 12 8 14') + p('M8 5L5 9M8 5L11 9'),

    // — Bâtiments / Lieux —
    '⛪': p('M1 14H15M3 14V9L8 5L13 9V14') + l(8,2,8,5) + l(6,3.5,10,3.5) + r(6,11,4,3),
    '🏛️': p('M1 13H15M2 11H14M4 11V7M8 11V7M12 11V7') + p('M3 7H13M8 3L4 7H12z'),
    '🏙️': p('M1 14H15M2 14V8H5V14M7 14V5H10V14M12 14V9H14V14') + l(7,8,10,8),
    '🏠': p('M1 8.5L8 2.5L15 8.5') + p('M3.5 7V14H6V11H10V14H12.5V7'),
    '🏰': p('M1 14H15M2 14V7H5V5H11V7H14V14') + p('M2 7V5H3V3H4V5H5M11 7V5H12V3H13V5H14') + r(6,10,4,4),
    '🏗️': l(2,14,2,2) + l(2,2,11,2) + l(11,2,11,10) + l(2,6,11,6) + p('M2 10L8 6'),
    '🏜️': p('M1 13H15') + p('M2 13C3 11 5 12 7 10C9 8 10 11 12 9.5C13 9 14 10 15 9') + p('M10 5C10 5 9 7 10 7.5C11 8 12 7 12 5.5C12 4 10.5 5 10 5z'),
    '🏯': r(3,7,10,7,0.3) + r(5,4,6,3) + l(5,4,5,7) + l(11,4,11,7) + l(7,4,7,7) + l(9,4,9,7) + l(3,14,13,14) + l(3,7,3,14) + l(13,7,13,14),
    '🎮': r(4,2,8,9,0.5) + l(4,2,3,1) + l(12,2,13,1),
    '🏕️': cf(8,7,3) + p('M3 11C4 9 12 9 13 11') + p('M2 12C4 10 12 10 14 12') + p('M1 13H15') + l(8,4,7,2) + p('M7 2C7 2 6 3 5.5 2C5 1 6 1 6 2'),
    '🏟️': p('M2 13C2 9 4 6 8 5C12 6 14 9 14 13') + l(2,13,14,13) + l(4,7,4,13) + l(12,7,12,13) + l(6,6,6,13) + l(10,6,10,13),
    '🏥': r(2,4,12,10,0.5) + l(2,8,14,8) + r(4,2,3,2) + r(9,2,3,2) + l(7,5,7,8) + l(10,5,10,8) + l(8,9,8,14),
    '🏭': p('M2 14H14V6L11 9V6L8 9V6L5 9V6L2 9Z') + r(4,10,3,4) + r(9,10,3,4),
    '🏪': r(2,5,12,9,0.5) + r(2,2,12,3) + p('M5 14V9H11V14') + l(5,11,11,11),
    '🏫': r(2,4,12,10,0.5) + l(2,8,14,8) + r(4,2,3,2) + r(9,2,3,2) + r(6,10,4,4),
    '🏡': p('M1 9L8 3L15 9') + p('M3 8.5V14H13V8.5') + r(6,10,4,4) + r(3.5,11,2,3),
    '🏘️': p('M1 14H15') + p('M2 14V9L5 7L8 9V14') + p('M8 14V9L11 7L14 9V14') + l(5,9,5,14) + l(11,9,11,14),
    '🏚️': p('M2 14H14') + p('M3 14V9L8 5L13 9V14') + p('M6 14V10H10V14') + l(5,9,5,10) + l(11,9,11,10),
    '🛖': p('M8 1L2 7H5V14H11V7H14Z') + r(6.5,9,3,5),
    '🚪': r(3,2,10,12,0.5) + r(10,7,1.5,2,0.5),
    '🎮': r(4,2,8,9,0.5) + l(4,2,3,1) + l(12,2,13,1),

    // — Géographie —
    '🌐': c(8,8,6) + p('M8 2C8 2 5 5 5 8C5 11 8 14 8 14M8 2C8 2 11 5 11 8C11 11 8 14 8 14') + l(2,8,14,8) + p('M2.5 5H13.5M2.5 11H13.5'),
    '🏔️': p('M8 1.5L3 13H13z') + p('M8 1.5L5.5 7L8 6L10.5 7L8 1.5'),
    '🗺️': p('M1 3.5L5.5 4.5L10 2.5L14.5 4.5L15 3V12.5L10 11L5.5 12.5L1 11z') + l(5.5,4.5,5.5,12.5) + l(10,2.5,10,11),
    '🗻': p('M8 1L3 10H13Z') + p('M8 1L6 5L8 6L10 5L8 1') + p('M4.5 8H11.5'),
    '🏝️': cf(8,7,3) + p('M3 11C4 9 12 9 13 11') + p('M2 12C4 10 12 10 14 12') + p('M1 13H15') + l(8,4,7,2),
    '🌇': p('M1 14H15M2 14V9H5V14M7 14V6H10V14M12 14V9H14V14') + p('M1 8C3 6 5 8 8 6C11 8 13 6 15 8'),
    '🌉': l(1,14,15,14) + l(4,7,4,14) + l(12,7,12,14) + p('M1 7C4 4 12 4 15 7') + l(6,10,6,7) + l(8,10,8,7) + l(10,10,10,7),

    // — Objets / Artisanat —
    '⚓': c(8,4.5,2) + l(8,6.5,8,14) + l(3,8.5,13,8.5) + p('M3.5 11.5C3.5 13.5 5.5 14 8 14C10.5 14 12.5 13.5 12.5 11.5'),
    '⚖️': l(8,2,8,14) + l(3,14,13,14) + l(4,6,12,6) + p('M4 6L2 11H6z') + p('M12 6L10 11H14z'),
    '⚗️': p('M6.5 2V7L3 13H13L9.5 7V2') + l(5.5,2,10.5,2) + cf(6.5,11,1),
    '⚙️': c(8,8,2.5) + p('M8 1.5V3.5M8 12.5V14.5M1.5 8H3.5M12.5 8H14.5M3.4 3.4L4.8 4.8M11.2 11.2L12.6 12.6M12.6 3.4L11.2 4.8M4.8 11.2L3.4 12.6'),
    '⚜️': p('M8 2C8 2 5.5 4.5 5.5 7C5.5 9 7 10 8 10C9 10 10.5 9 10.5 7C10.5 4.5 8 2 8 2z') + p('M8 10V14M5 11.5H11M6 14H10') + p('M5.5 7C4 7 2.5 6 2.5 7.5C2.5 9 4 9.5 5.5 9M10.5 7C12 7 13.5 6 13.5 7.5C13.5 9 12 9.5 10.5 9'),
    '📅': r(2,3,12,11,1) + l(2,7,14,7) + l(5,2,5,5) + l(11,2,11,5) + cf(5.5,10,0.8) + cf(8,10,0.8) + cf(10.5,10,0.8),
    '📖': p('M2 3.5C2 3.5 5 3 8 5C11 3 14 3.5 14 3.5V12.5C11 12.5 8 11 8 11C5 12.5 2 12.5 2 12.5V3.5z') + l(8,5,8,11),
    '📚': r(1,5,3,9,0.5) + r(5,3,3,11,0.5) + r(9,5,3,9,0.5) + r(13,6,2,8,0.5),
    '📜': p('M5 2C3.5 2 2.5 3 2.5 4.5V11.5C2.5 11.5 2.5 14 5 14H11.5C13 14 13 12.5 13 11.5V5L10 2z') + p('M10 2V5H13') + l(5,7.5,11,7.5) + l(5,9.5,11,9.5) + l(5,11.5,9,11.5),
    '🔔': p('M8 1.5C8 1.5 5 3 5 7V11H11V7C11 3 8 1.5 8 1.5z') + l(3.5,11,12.5,11) + p('M6.5 11C6.5 12.5 9.5 12.5 9.5 11') + l(8,1,8,2),
    '🔬': l(7,3,11,7) + l(9,5,4.5,9.5) + c(6.5,10,2.5) + l(4,14,12,14) + l(8,12.5,8,14),
    '🔶': pf('M8 2L14.5 8L8 14L1.5 8z'),
    '🛒': p('M1.5 2.5H3L5 10H12L13.5 5.5H5') + c(6,12.5,1.2) + c(11,12.5,1.2),
    '🦴': p('M4 4C3 4 2.5 5 2.5 6C2.5 7 3.5 8 4.5 8L8 12C8 13 9 14 10 14C11 14 12 13 12 12C12 11 11 10 10 10L6 6C7 6 8 5 8 4C8 3 7 2.5 6 2.5C5 2.5 4 3 4 4z'),
    '🧱': r(1,5,5,3,0.3) + r(7,5,5,3,0.3) + r(13,5,2,3,0.3) + r(1,9,3,3,0.3) + r(5,9,5,3,0.3) + r(11,9,4,3,0.3),
    '🪡': c(8,5.5,3) + l(8,8.5,8,14) + p('M5.5 11.5C6.5 13 9.5 13 10.5 11.5'),
    '💡': p('M5.5 10C5 8 5 6 6 5C7 4 9 4 10 5C11 6 11 8 10.5 10H5.5') + l(5.5,10,10.5,10) + l(6.5,11,9.5,11) + l(7,12,9,12) + l(8,2,8,3),
    '💰': c(8,9,4.5) + p('M5.5 5.5C5.5 3 10.5 3 10.5 5.5') + p('M7.5 3C7.5 1 8.5 1 8.5 3') + l(6.5,9,9.5,9),
    '🔒': r(4,7,8,7,1) + p('M6 7V5C6 3 10 3 10 5V7'),
    '🔐': r(4,7,8,7,1) + p('M6 7V5C6 3 10 3 10 5V7') + cf(8,11,1) + l(8,12,8,14),
    '🔍': c(7,7,4) + l(10,10,14,14),
    '🔭': l(2,13,10,7) + p('M2 13L4 12L4 14Z') + l(10,7,14,3) + p('M10 7L13 7') + l(7,10,7,15),
    '🔮': c(8,8.5,5) + p('M5.5 5.5C6 4 8 3.5 9.5 4.5') + cf(9,6,1),
    '🔑': p('M13 6.5C13 9 11 11 8.5 11C6 11 4 9 4 6.5C4 4 6 2 8.5 2C11 2 13 4 13 6.5Z') + l(6,11,3.5,14) + l(3.5,12.5,5.5,12.5),
    '🔧': p('M4 13L9.5 7.5L10.5 8.5C11 7 11 5 10 4C9 3 7 3 6 4C5.5 4.5 5.5 5 6 5.5L7 5L8 6L6 7C4.5 6 4 4.5 4 4C3 5 3 7 4 8C5 9 7 9 8.5 8.5L10.5 10.5L9.5 11.5Z'),
    '🔩': c(8,8,4) + c(8,8,2) + l(4,4,12,12) + l(12,4,4,12),
    '📦': p('M2 5H14V14H2Z') + l(2,5,8,2) + l(14,5,8,2) + l(8,2,8,5) + l(5,5,5,8),
    '📋': r(3,3,10,11,0.5) + r(6,1,4,3,0.5) + l(5,7,11,7) + l(5,9,11,9) + l(5,11,9,11),
    '📏': p('M2 12L12 2L14 4L4 14Z') + l(6,8,8,6) + l(4,10,6,8) + l(8,6,10,4),
    '📐': p('M2 14H14V2Z') + l(2,14,8,8) + l(8,8,8,14) + l(8,8,14,8),
    '📒': r(3,2,10,12,0.5) + l(3,2,3,14) + l(5,2,5,14) + l(6,6,12,6) + l(6,9,12,9),
    '💣': r(2,8,12,6,1) + p('M8 8V4') + c(8,3,1.5),
    '📣': p('M2 10H6L12 13V3L6 6H2Z') + p('M6 6V10') + l(12,8,15,8),
    '📱': r(4,2,8,12,1) + l(6,3,10,3) + cf(8,12.5,0.8),
    '💻': r(2,4,12,9,1) + p('M1 13H15M5 13V14H11V13'),
    '🔎': c(6.5,6.5,4) + l(9.5,9.5,14,14),
    '🗄️': r(2,5,12,9,0.5) + r(2,2,12,3) + l(5,5,5,7) + l(8,5,8,7) + l(11,5,11,7),
    '📁': p('M2 5H5L7 3H14V13H2Z') + l(2,6,14,6),
    '🔄': p('M3 9C3 6 5 4 8 4C10 4 12 5 13 7') + p('M13 7L13 4L11 7') + p('M13 7C13 10 11 12 8 12C6 12 4 11 3 9') + p('M3 9L3 12L5 9'),
    '🔇': pf('M1 6H4.5L8 3V13L4.5 10H1Z') + l(10,6,14,10) + l(14,6,10,10),
    '🔈': pf('M1 6H4.5L8 3V13L4.5 10H1Z') + p('M10 6C11.5 7 11.5 9 10 10'),
    '🔊': pf('M1 6H4.5L8 3V13L4.5 10H1Z') + p('M10 6C11.5 7 11.5 9 10 10') + p('M12 4.5C14.5 6 14.5 10 12 11.5'),
    '✏️': p('M3 14L8 8L11 5L13 3C14 2 14 3 13 4L11 6L8 9L6 12Z') + p('M3 14L2 15') + pf('M11 5L13 3L14 4L12 6Z'),
    '✅': p('M2 8L6 12L14 4'),
    '✋': p('M5 14V7M8 14V5M11 14V7M5 7C4 7 3 8 3 9V14') + p('M11 7C12 7 13 8 13 9V14') + p('M5 5C5 4 6 3 7 4C7.5 3 8.5 3 9 4C9.5 3 11 3 11 5'),
    '✌️': p('M6 14V7M9 14V5') + p('M6 7C5 7 4 8 4 9V14') + p('M9 5C9 4 10 3 11 4C12 3 13 4 13 5V9C13 10 12 11 9 11L6 11'),
    '💪': p('M6 13C4.5 12 3 10 4 7C5 5 7 5 8 6C9 7 9 9 10 8C11 7 12 5 13 6C14 7 13 10 11 11C10 11.5 9.5 11 9 12C8.5 13 7.5 14 6 13'),
    '🤝': p('M1 8L4 5L7 7L9 7L12 5L15 8') + p('M7 7C7 9 9 9 9 7') + l(4,5,3,7) + l(12,5,13,7),
    '💯': p('M4 3H12M5 7H11M6 11H10') + cf(8,14,1.5),
    '🏆': p('M4 2H12V8C12 11 10 13 8 13C6 13 4 11 4 8Z') + l(4,14,12,14) + l(6,13,6,14) + l(10,13,10,14) + p('M2 4C2 4 2 7 4 7') + p('M14 4C14 4 14 7 12 7'),
    '🏋️': l(2,8,14,8) + r(1,6,3,4,0.5) + r(12,6,3,4,0.5) + r(4,7,8,2,0.5) + c(8,5,1.5),
    '✍️': p('M8 12L5 14H11L8 12Z') + p('M5 14V9M11 14V9') + p('M5 9C4 9 3 8 3 7V4C3 3 4 2 5 2C6 2 7 3 7 4V9') + p('M11 9C12 9 13 8 13 7V6C13 5 12 4 11 4') + l(7,4,11,4),

    // — Morts / Sombre —
    '💀': c(8,7,4.5) + cf(5.5,6.5,1.5) + cf(10.5,6.5,1.5) + cf(8,8.5,0.9) + p('M5.5 11.5H10.5M6.5 11.5V13M8 11.5V13M9.5 11.5V13'),
    '👻': p('M3 14C3 12 4 12 4 11C4 10 3 10 3 9V6C3 3 5 2 8 2C11 2 13 3 13 6V9C13 10 12 10 12 11C12 12 13 12 13 14L11 13L9 14L8 13L7 14L5 13Z') + cf(6,7,1) + cf(10,7,1),
    '💀️': c(8,7,4.5) + cf(5.5,6.5,1.5) + cf(10.5,6.5,1.5) + cf(8,8.5,0.9) + p('M5.5 11.5H10.5M6.5 11.5V13M8 11.5V13M9.5 11.5V13'),
    '⚰️': p('M4 5H12V13H4Z') + p('M4 5C4 3 6 2 8 2C10 2 12 3 12 5') + l(4,8,12,8) + p('M6 5.5H10'),
    '🪦': p('M5 14H11V8.5C11 5.5 9.5 3 8 3C6.5 3 5 5.5 5 8.5Z') + l(6,9,10,9) + l(8,7,8,12),
    '🪨': p('M5 4C3 4 2 6 2 8C2 11 3 13 5 13H11C13 13 14 11 14 8C14 6 13 4 11 4C10 2 6 2 5 4Z'),
    '💥': p('M8 8L6.5 2L9.5 6L13 1L11.5 6L15 5L11 8L15 11L11 9.5L13 14L9.5 10L8 14L6.5 10L3 14L4.5 9.5L1 11L5 8L1 5L4.5 6L3 1Z'),
    '🦷': p('M4 13L9 5L13 7L11 10L8 10L7 13Z') + l(8,10,14,14),
    '🗣️': c(7,6,3) + p('M9.5 8C10.5 10 10.5 12 8 13') + p('M10 8.5C12 10 12.5 13 10 14'),

    // — Lumière / Mystique —
    '🕯️': r(6.5,8,3,6,0.5) + p('M8 8C7 5 9 4.5 8 2'),
    '🖳️': p('M5 10C5 8 5 6 6 5C7 4 9 4 10 5C11 6 11 8 10.5 10H5.5') + l(5.5,10,10.5,10) + l(6,11,10,11) + l(6.5,12,9.5,12),
    '🕳️': p('M3 9C3 12 13 12 13 9C13 6 3 6 3 9Z') + pf('M5 9C5 11 11 11 11 9C11 7 5 7 5 9Z'),
    '💮': pf('M8 2L9 6.3 14 7 9 7.7 8 13 7 7.7 2 7 7 6.3Z') + cf(13,3,1) + cf(3.5,12,0.8),
    '🧿': c(8,8,5) + c(8,8,3) + c(8,8,1.5) + p('M3 3L5 5M11 5L13 3M13 13L11 11M5 11L3 13'),

    // — Chaînes / Liens —
    '⛓️': c(5.5,6,2.5) + c(10.5,10,2.5) + l(7.5,6,8.5,10),

    // — Animaux —
    '🐆': p('M5 13.5V10C3.5 9.5 2.5 8.5 2.5 7C2.5 5 4.5 3.5 8 3.5C11.5 3.5 13.5 5 13.5 7C13.5 8.5 12.5 9.5 11 10V13.5') + cf(5.5,7.5,0.8) + cf(10.5,7.5,0.8) + p('M6.5 10C7.3 11 8.7 11 9.5 10') + l(5,13.5,7,13.5) + l(9,13.5,11,13.5),
    '🐎': p('M6 14V9C4.5 9 3.5 8 3.5 7C3.5 5.5 4.5 4 6 3.5C7.5 3 9 3.5 10 5.5L13 4L12 7C12.5 7.5 13 8.5 12 9V14') + l(6,14,8,14) + l(10,14,12,14),
    '🐘': p('M5.5 14V10C4 9.5 2.5 8 2.5 6C2.5 4 4 3 6 3C7.5 3 8 4 8.5 3C10 2.5 12.5 4 12.5 6C12.5 8 11.5 9.5 10 10V14') + p('M2.5 6C1.5 7.5 1.5 9.5 3 10') + l(5.5,14,7.5,14) + l(9,14,11,14),
    '🐟': p('M12 8C12 8 8 5.5 4.5 6.5C4.5 6.5 2.5 8 4.5 9.5C8 10.5 12 8 12 8z') + p('M12 8L14.5 5.5M12 8L14.5 10.5') + cf(6,8,0.8),
    '🕊️': p('M8 8.5L3 6C3 6 3 10 5 11L3 14H7L8 12L10 14L8 8.5z') + p('M8 8.5C8 8.5 11.5 7 14.5 8C13 9 11.5 10 10.5 11'),
    '🐺': c(8,9,4) + p('M5.5 5.5C4 3.5 2 3 2.5 4.5') + p('M10.5 5.5C12 3.5 14 3 13.5 4.5') + cf(6,9,0.8) + cf(10,9,0.8) + cf(8,11.5,1.2),
    '🐮': c(8,9,4) + p('M5 5.5C4 3 2 3 2 5') + p('M11 5.5C12 3 14 3 14 5') + cf(6,9,0.8) + cf(10,9,0.8) + cf(8,11.5,1.5),
    '🐻': c(8,9,4.5) + cf(5,5.5,2) + cf(11,5.5,2) + cf(6.5,8.5,1) + cf(9.5,8.5,1) + cf(8,11,1.5),
    '🐍': p('M14 3C14 3 15 5 13 6C11 7 9 6 8 8C7 10 8 12 6 13C4 14 3 12 3 11') + cf(13.5,4,1.5) + cf(13,3.5,0.7),
    '🦌': c(8,8,2.5) + l(8,5.5,7,3) + l(8,5.5,9,3) + l(7,3,5.5,1.5) + l(7,3,7.5,1.5) + l(9,3,10.5,1.5) + l(9,3,8.5,1.5) + l(8,10.5,7,14) + l(8,10.5,9,14),
    '🦊': p('M4 13V8C4 5.5 6 4 8 4C10 4 12 5.5 12 8V13') + p('M4 8C3 6 1.5 4 2.5 3C3.5 2.5 5 4.5 6 5') + p('M12 8C13 6 14.5 4 13.5 3C12.5 2.5 11 4.5 10 5') + cf(6,8.5,0.8) + cf(10,8.5,0.8) + cf(8,11,1),
    '🦅': p('M2 9C4 7 7 7 8 8') + p('M14 9C12 7 9 7 8 8') + p('M8 8L7.5 14M8 8L8.5 14') + cf(8,5,1.5) + p('M8 6.5L9.5 7'),
    '🦴': p('M4 4C3 4 2.5 5 2.5 6C2.5 7 3.5 8 4.5 8L8 12C8 13 9 14 10 14C11 14 12 13 12 12C12 11 11 10 10 10L6 6C7 6 8 5 8 4C8 3 7 2.5 6 2.5C5 2.5 4 3 4 4z'),
    '🐌': p('M3 12C2 10 2 7 4 5C5.5 4 8 3 11 4L13 3L14 5L13 7C14 9 13 12 11 13C9 14 7 14 5 13C4 12.5 3.5 12.5 3 12') + cf(7,7,1),
    '🐢': c(8,9,4) + p('M5 7C5 5 7 4 8 4C9 4 11 5 11 7') + l(6,13,5,15) + l(10,13,11,15) + l(8,13,8,15),
    '🦎': p('M3 8C3 8 4 5 7 4C9 3 11 5 13 8L14 11C14 12 13 13 11 13L7 11C5 10 3 9 3 8Z') + l(13,8,15,7) + cf(5,6,0.7) + p('M3 8L2 10'),
    '🎣': c(7,7,4) + l(10,10,14,14) + p('M10 10L13 8'),
    '🐚': p('M8 14C5 14 2 11 2 8C2 5 5 2 8 2C11 2 12 4 12 7C12 10 10 11 8 11C7 11 6 10 6 8C6 7 7 6 8 6'),
    '🦍': c(8,8,5) + p('M3 5L8 3L13 5') + p('M3 11L8 13L13 11') + l(3,5,3,11) + l(13,5,13,11),
    '🦢': c(9,4,2) + p('M9 6C9 8 8 9 7 10C6 11 5 12 5 14') + p('M9 5.5C12 5 14 7 13 10C12 12 10 13 8 13') + p('M7 5L5 4'),
    '🦦': p('M4 13V8C4 5.5 6 4 8 4C10 4 12 5.5 12 8V13') + p('M4 8C3 6 2 4 3 3C4 2 5 4 6 5') + p('M12 8C13 6 14 4 13 3C12 2 11 4 10 5') + cf(6,8.5,0.8) + cf(10,8.5,0.8) + p('M6 11L4 14M10 11L12 14'),
    '🦋': p('M8 8C8 8 5 6 4.5 4C4 2 5 1 6 2C6.5 2.5 6 4 7 4C8 4 9 2 10 2C11 2 11.5 3 11 4L14 7L13 9L10 8C9.5 9 9 10 9 11L10 14H8L9 11C9 10 8.5 9 8 8') + c(8,5,1),

    // — Personnages / Figures —
    '🧙': p('M8 1L6 5H10L8 1z') + c(8,7,1.8) + p('M5.5 9L4.5 14.5H11.5L10.5 9C9.5 9.5 8.5 10 8 10C7.5 10 6.5 9.5 5.5 9z'),
    '🧙‍♀️': p('M8 1L6 5H10L8 1z') + c(8,7,1.8) + p('M5.5 9L4.5 14.5H11.5L10.5 9C9.5 9.5 8.5 10 8 10C7.5 10 6.5 9.5 5.5 9z'),
    '🧜': c(7,4,2.5) + p('M7 6.5C5 8 3 10 3 12C3 14 5 14 7 13C9 12 11 10 11 8C11 6 9 5 7 6.5') + p('M3 12C3 14 5 15 7 14C9 13 11 12 11 10'),
    '🕵️': c(8,5,2.5) + p('M5 8H11C12 8 13 9 13 10V14H3V10C3 9 4 8 5 8') + p('M6 8V7') + p('M10 8V7') + l(8,3,8,5),
    '🧘': c(8,4.5,2) + p('M8 6.5C8 8 6 9 4 9') + p('M8 6.5C8 8 10 9 12 9') + l(4,9,4,12) + l(12,9,12,12) + l(2,12,14,12),
    '👤': c(8,6,2.5) + p('M2 14C2 10 5 8 8 8C11 8 14 10 14 14'),
    '👥': c(6,5.5,2) + c(10,5.5,2) + p('M1 14C1 10 3.5 8 6 8') + p('M10 8C12.5 8 15 10 15 14'),
    '🧠': p('M8 3C6 3 4.5 4.5 4 6C2.5 6.5 2 8 3 9.5C2 11 2.5 12.5 4 13C4.5 14.5 6.5 14.5 7.5 13C8 14.5 10 14.5 10.5 13C12 14.5 13.5 13 13 11.5C14.5 10 14.5 8 13 7C14 5.5 12.5 4 11 4C10.5 3.5 9.5 3 8 3Z') + l(8,3,8,13),

    // — Coeurs —
    '❤️': p('M8 14C4 10 2 9 2 6.5C2 4.5 3.5 3 5.5 3C6.8 3 8 4 8 4C8 4 9.2 3 10.5 3C12.5 3 14 4.5 14 6.5C14 9 12 10 8 14Z'),
    '🧡': p('M8 14C4 10 2 9 2 6.5C2 4.5 3.5 3 5.5 3C6.8 3 8 4 8 4C8 4 9.2 3 10.5 3C12.5 3 14 4.5 14 6.5C14 9 12 10 8 14Z'),
    '💛': p('M8 14C4 10 2 9 2 6.5C2 4.5 3.5 3 5.5 3C6.8 3 8 4 8 4C8 4 9.2 3 10.5 3C12.5 3 14 4.5 14 6.5C14 9 12 10 8 14Z'),
    '🖤': p('M8 14C4 10 2 9 2 6.5C2 4.5 3.5 3 5.5 3C6.8 3 8 4 8 4C8 4 9.2 3 10.5 3C12.5 3 14 4.5 14 6.5C14 9 12 10 8 14Z'),
    '🤍': p('M8 14C4 10 2 9 2 6.5C2 4.5 3.5 3 5.5 3C6.8 3 8 4 8 4C8 4 9.2 3 10.5 3C12.5 3 14 4.5 14 6.5C14 9 12 10 8 14Z'),
    '💢': p('M8 2C8 2 3 5 3 9C3 12 5.5 13 8 13C10.5 13 13 12 13 9C13 5 8 2 8 2Z') + l(6,9,10,9) + l(8,7,8,11),

    // — Nourriture / Boissons —
    '🍺': r(5,3,7,11,1) + l(5,8,12,8) + p('M12 5C14 5 14 8 12 8'),
    '🍵': r(4,6,8,8,1) + p('M12 7C14 7 14 10 12 10') + l(5,14,11,14) + p('M6 4C5.5 2 6.5 1 6.5 1M8 4C7.5 2 8.5 1 8.5 1M10 4C9.5 2 10.5 1 10.5 1'),
    '🍲': r(3,7,10,7,1) + p('M3 7C3 5 5 3 8 3C11 3 13 5 13 7') + l(3,14,13,14),
    '🥖': p('M4 10C4 7 6 5 8 5C10 5 12 7 12 10C12 12 10 13 8 13C6 13 4 12 4 10') + p('M6 6C7 5 9 5 10 6') + l(4.5,11.5,11.5,8.5),
    '🧂': r(5,3,6,10,1) + l(5,7,11,7) + cf(7,5,0.8) + cf(9,5,0.8),

    // — Artisanat / Science —
    '🧪': p('M6 2V8L3 14H13L10 8V2') + l(5,2,11,2) + l(4,11,12,11),
    '🧬': p('M6 2C8 4 8 6 6 8C8 10 8 12 6 14') + p('M10 2C8 4 8 6 10 8C8 10 8 12 10 14') + l(7,5,9,5) + l(7,8,9,8) + l(7,11,9,11),
    '🧵': c(8,5,3) + l(8,8,8,14) + p('M5.5 12C7 13.5 9 13.5 10.5 12') + l(6.5,5,9.5,5),
    '🧹': p('M3 13L13 3L14 4L4 14Z') + p('M4 14L3 15') + pf('M11 5L13 3L14 4L12 6Z'),
    '🧳': r(2,4,12,10,0.5) + l(2,4,2,14) + l(14,4,14,14) + l(5,4,5,14) + l(5,8,14,8),

    // — Transports —
    '🚢': p('M3.5 11L5.5 7H10.5L12.5 11H3.5z') + p('M5.5 7V4.5H10.5V7') + r(7,2.5,2,2) + p('M1.5 12.5C4.5 14.5 11.5 14.5 14.5 12.5'),
    '🚂': r(2,5,12,7,0.5) + c(4,12,1.5) + c(10,12,1.5) + r(10,3,4,2,0.5) + l(2,9,14,9),
    '🚉': p('M2 14H14') + r(4,4,8,9,0.5) + l(4,8,12,8) + r(5.5,5,3,3,0.3) + r(7.5,5,3,3,0.3) + l(4,12,5,14) + l(12,12,11,14),
    '🚣': p('M1 13C5 11 11 11 15 13') + l(8,3,3,13) + p('M3 8H13') + c(8,5,2.5),
    '🛤️': l(5,2,4,14) + l(11,2,12,14) + l(5,5,11,5) + l(4.5,8,11.5,8) + l(4,11,12,11),
    '⛵': p('M2 12H14') + p('M8 3V12') + p('M8 3L3 12H8Z') + p('M8 3L13 8L8 8Z'),
    '🛁': p('M2 10H14V12C14 13 13 13 12 13H4C3 13 2 13 2 12Z') + p('M4 10V6C4 5 5 4 6 4V10') + l(2,12,1,14) + l(14,12,15,14),

    // — Arts / Culture —
    '🎨': p('M8 2C5 2 2.5 4.5 2.5 7.5C2.5 10 4 11.5 6 11C7.5 10.5 8 11.5 8 12.5C8 13.5 9 14 10 14C12.5 14 13.5 11.5 13.5 9.5C13.5 5.5 11 2 8 2z') + cf(5.5,7,1) + cf(9,5,1),
    '🎪': p('M8 1.5L1 12H15z') + l(1,12,15,12) + l(8,1.5,8,12) + l(4.5,12,4.5,9.5) + l(11.5,12,11.5,9.5),
    '🎭': p('M2.5 5.5C2.5 5.5 2 9.5 5 11C8 12.5 9.5 10 9.5 10') + p('M8 4.5C8 4.5 9 8.5 12 9C15 9.5 15 6.5 15 6.5') + p('M3.5 7.5C4 9 7 9.5 8 8.5') + p('M10 7.5C10.5 6.5 13 6.5 13.5 7.5'),
    '🎵': p('M10 2.5V10.5') + c(8,11.5,2) + p('M10 2.5L14 1.5V5.5L10 6'),
    '🎶': p('M4 5V11.5') + c(2.5,12.5,1.5) + l(4,5,10.5,4) + p('M10.5 4V10.5') + c(9,11.5,1.5),
    '🎼': l(3,5,13,3) + l(3,7,13,5) + l(3,9,13,7) + l(3,9,3,13) + cf(3,13,1.5) + l(13,7,13,11) + cf(13,11,1.5),
    '🎯': c(8,8,6) + c(8,8,4) + c(8,8,2) + cf(8,8,1),
    '🎠': c(8,6,4) + l(8,2,8,10) + l(4,9,12,9) + l(4,9,3,14) + l(8,9,8,14) + l(12,9,13,14),
    '🎗️': r(2,3,12,11,1) + l(2,7,14,7) + l(5,2,5,5) + l(11,2,11,5),
    '🎻': p('M4 14V6L12 4V12') + c(2.5,13.5,1.5) + c(10.5,11.5,1.5),

    // — Éducation / Savoir —
    '🎓': pf('M8 4L1 8L8 12L15 8Z') + p('M12 10V13.5') + cf(12,14,0.8) + p('M5 9.5V12C5 12 6.5 13.5 8 13.5C9.5 13.5 11 12 11 12V9.5'),
    '🧑‍🎓': pf('M8 4L1 8L8 12L15 8Z') + p('M12 10V13.5') + cf(12,14,0.8),
    '📰': r(2,3,12,11,0.5) + l(4,6,12,6) + l(4,8,12,8) + l(4,10,10,10),
    '🗞️': r(2,3,12,11,0.5) + l(4,6,12,6) + l(4,8,12,8) + l(4,10,10,10),
    '📈': p('M2 12L6 8L9 10L14 4') + p('M12 4H14V6'),
    '📉': p('M2 4L6 8L9 6L14 12') + p('M12 12H14V10'),

    // — Symboles divers —
    '🦴️': p('M4 4C3 4 2.5 5 2.5 6C2.5 7 3.5 8 4.5 8L8 12C8 13 9 14 10 14C11 14 12 13 12 12C12 11 11 10 10 10L6 6C7 6 8 5 8 4C8 3 7 2.5 6 2.5C5 2.5 4 3 4 4z'),
    '🧱': r(1,5,5,3,0.3) + r(7,5,5,3,0.3) + r(13,5,2,3,0.3) + r(1,9,3,3,0.3) + r(5,9,5,3,0.3) + r(11,9,4,3,0.3),
    '🌉': l(1,14,15,14) + l(4,7,4,14) + l(12,7,12,14) + p('M1 7C4 4 12 4 15 7') + l(6,10,6,7) + l(8,10,8,7) + l(10,10,10,7),
    '🌅': p('M2.5 10.5A5.5 5.5 0 0 1 13.5 10.5') + l(1,12,15,12) + l(8,3,8,6) + p('M3.5 5L5.5 7M12.5 5L10.5 7'),
    '🎰': c(8,8,5.5) + c(8,8,3) + l(5,5,11,11) + l(11,5,5,11),
    '🌞': c(8,8,4) + l(8,1,8,3) + l(8,13,8,15) + l(1,8,3,8) + l(13,8,15,8) + l(3.5,3.5,5,5) + l(11,5,12.5,3.5),
    '🦤': p('M8 13C8 13 5 11 4 9C3 7 4 5 6 5C7 5 8 6 8 6C8 6 9 5 10 5C12 5 13 7 12 9C11 11 8 13 8 13Z') + l(8,2,8,6),

    // — Trident / Symbole —
    '🔱': l(8,6,8,14) + l(4,6,4,10) + l(12,6,12,10) + p('M4 6C4 3 6 2 8 4C10 2 12 3 12 6') + p('M2 9L4 10M12 10L14 9') + l(2,14,14,14),

    // — Météo / Lumière —
    '💫': p('M4 5C4 4 5 3 6 3L10 3C11 3 12 4 12 5L12 11C12 12 11 13 10 13L6 13C5 13 4 12 4 11Z') + l(4,7,12,7) + l(8,3,8,13) + cf(8,8,2),
    '🌒': p('M8 2C8 2 10 4 10 8C10 12 8 14 8 14C7 11 7 5 8 2Z') + p('M8 2C7 4 6 6 6 8C6 10 7 12 8 14'),
    '🌕': cf(8,8,5.5),
    '🌀': c(8,8,2) + c(8,8,4) + c(8,8,6),

    // — Géographie/Nature supplément—
    '🧊': p('M8 2L14 5.5L14 11.5L8 14L2 11.5L2 5.5Z') + l(8,2,8,7) + l(2,5.5,8,7) + l(14,5.5,8,7),
    '🏔️': p('M8 1.5L3 13H13z') + p('M8 1.5L5.5 7L8 6L10.5 7L8 1.5') + p('M4.5 8H11.5'),
    '🪨': p('M5 4C3 4 2 6 2 8C2 11 3 13 5 13H11C13 13 14 11 14 8C14 6 13 4 11 4C10 2 6 2 5 4Z'),

    // — Ancien / Civilisation —
    '🗿': p('M6 1.5C4.5 1.5 3 3.5 3 6.5C3 9.5 5 11 5 13.5H11C11 11 13 9.5 13 6.5C13 3.5 11.5 1.5 10 1.5z') + p('M6 6.5C6 6.5 7 5.5 8 5.5C9 5.5 10 6.5 10 6.5') + l(6,8.5,10,8.5),

    // — Divers—
    '🧲': c(8,8,5.5) + l(3,3,13,13) + l(3,8,13,8) + l(8,3,8,13),
    '🎱': p('M8 1L9.2 6.2 14.5 7 9.8 8.2 8 14 6.2 8.2 1.5 7 6.8 6.2z') + c(8,8,3),
    '🧩': p('M3 3H8C8 2 9 1.5 9 3C9 4.5 8 4 8 5H13V9.5C12 9.5 11 10 11.5 11C12 12 13 11.5 13 11V14H8C8 13 9 12.5 9 11C9 9.5 8 9 8 10H3Z'),
    '💠': p('M8 2L14.5 8L8 14L1.5 8Z') + cf(8,8,2),
    '🔫': p('M5 14C4 12 3 10 4 7C4.5 5.5 6 4 7 5C7.5 5.5 7 7 8 7') + l(8,7,14,7) + p('M11 4L14 7L11 10') + p('M5 14L4 15L5 15L6 14'),
    '🧿️': c(8,8,5) + c(8,8,3) + c(8,8,1.5) + p('M3 3L5 5M11 5L13 3M13 13L11 11M5 11L3 13'),
    '📻': p('M2 7H8V11H2Z') + l(8,9,14,6) + l(8,9,14,12) + l(8,6,8,7) + l(2,6,2,7),
    '🛶': r(6,3,4,10,1) + p('M6 9H10') + p('M8 13V15'),
    '💎': p('M5.5 2H10.5L14 6.5L8 14L2 6.5z') + l(2,6.5,14,6.5) + p('M5.5 2L2 6.5M10.5 2L14 6.5M5.5 2L8 6.5L10.5 2'),
    '🦸': c(8,5,2) + p('M8 7L6 12L4 10L2 14') + p('M8 7L10 12L12 10L14 14') + p('M5 3L3 1M11 3L13 1'),
    '🦹': c(8,5,2) + p('M8 7L6 12L4 10L2 14') + p('M8 7L10 12L12 10L14 14'),
    '🌚': cf(8,8,5.5),
    '🌛': c(8,8,5.5) + p('M8 3C8 3 10 5 10 8C10 11 8 13 8 13'),
    '🦟': c(5,9,2.5) + p('M5 6.5C5 5 4 3.5 3 3.5C2 3.5 2 4.5 3 5') + p('M5 6.5C6 5 7 5 8 5C10 5 12 6 13 7C14 9 14 11 13 12C12 14 11 14 11 13') + cf(5,9,1.5),
    '🪖': p('M6 12L10 5L14 7L12 10L9 10L8 13Z') + l(9,10,14,14),
    '🪣': p('M4 12L9 5L13 7L11 10L8 10L7 13Z') + l(8,10,14,14),

    // — Icônes de base —
    '⭐': p('M8 1L9.2 6.2 14.5 7 9.8 8.2 8 14 6.2 8.2 1.5 7 6.8 6.2z'),
    '🦴': p('M4 4C3 4 2.5 5 2.5 6C2.5 7 3.5 8 4.5 8L8 12C8 13 9 14 10 14C11 14 12 13 12 12C12 11 11 10 10 10L6 6C7 6 8 5 8 4C8 3 7 2.5 6 2.5C5 2.5 4 3 4 4z'),
    '🧱': r(1,5,5,3,0.3) + r(7,5,5,3,0.3) + r(13,5,2,3,0.3) + r(1,9,3,3,0.3) + r(5,9,5,3,0.3) + r(11,9,4,3,0.3),
    '🪡': c(8,5.5,3) + l(8,8.5,8,14) + p('M5.5 11.5C6.5 13 9.5 13 10.5 11.5'),
    '🧶': c(8,5,3) + l(8,8,8,14) + p('M5.5 12C7 13.5 9 13.5 10.5 12') + l(6.5,5,9.5,5),
    '💩': c(8,9,4) + cf(6,8,1) + cf(10,8,1) + p('M6 11C6 12 10 12 10 11') + p('M8 5L7 3M8 5L9 3'),    '✒️': p('M3 14L8 8L11 5L13 3C14 2 14 3 13 4L11 6L8 9L6 12Z') + p('M3 14L2 15') + pf('M11 5L13 3L14 4L12 6Z'),

    // — Emojis supplémentaires (28 manquants) —
    '✏️': p('M3 14L8 8L11 5L13 3C14 2 14 3 13 4L11 6L8 9L6 12Z') + p('M3 14L2 15') + pf('M11 5L13 3L14 4L12 6Z'),
    '🌡️': r(7,3,2,10,1) + cf(8,13,2.5) + l(8,11,8,7),
    '🏮': c(8,8,5) + l(8,3,8,1) + l(8,13,8,15) + p('M4 5L4 11') + p('M12 5L12 11'),
    '🏴': l(2,2,2,14) + p('M2 2L14 5L2 8'),
    '🏴‍☠️': l(2,2,2,14) + p('M2 2L14 5L2 8') + cf(8,5.5,1.5) + l(6,5.5,10,5.5),
    '🏺': p('M5 2H11C13 2 14 5 14 8C14 11 13 13 11 14H5C3 13 2 11 2 8C2 5 3 2 5 2Z') + l(5,2,4,1) + l(11,2,12,1),
    '🐛': c(4,9,2.5) + c(8,8,2.5) + c(12,9,2.5) + l(4,6.5,4,5) + l(12,6.5,12,5) + cf(4,5,1) + cf(12,5,1),
    '🐾': cf(5,5.5,1.5) + cf(8,4.5,1.5) + cf(11,5.5,1.5) + p('M5 8C5 8 6 13 8 13C10 13 11 8 11 8'),
    '👂': p('M11 6C11 3 9 2 8 2C5 2 3 5 3 8C3 11 4 12 6 13C8 14 10 13 11 11') + p('M11 11C11 9 9 9 9 11C9 12 10 13 11 12'),
    '👅': p('M5 7C5 6 11 6 11 7C11 9 10 11 8 12C6 11 5 9 5 7Z') + cf(7,9,1) + cf(9,9,1),
    '👣': p('M5 5H9C10 5 10 7 9 7C10 7 10 9 9 9H5C4 9 4 7 5 7C4 7 4 5 5 5') + p('M11 9H14C15 9 15 11 14 11C15 11 15 13 14 13H11C10 13 10 11 11 11C10 11 10 9 11 9'),
    '🕸️': l(8,1,8,15) + l(1,8,15,8) + l(3,3,13,13) + l(13,3,3,13) + c(8,8,3.5) + c(8,8,6),
    '🗼': p('M6 2H10L11 14H5Z') + l(5.5,6,10.5,6) + l(5,10,11,10) + l(6,2,7,14) + l(10,2,9,14),
    '😬': c(8,7,5) + p('M5 10H11V11H5Z') + cf(5.5,6,0.8) + cf(10.5,6,0.8),
    '😱': c(8,7,5) + c(8,10,2) + cf(6,6,0.8) + cf(10,6,0.8) + l(6,3.5,10,3.5),
    '😶': c(8,7,5) + l(5,10,11,10) + cf(6,6,0.8) + cf(10,6,0.8),
    '🚶': c(9,3.5,1.5) + p('M9 5L8 8L6 12') + p('M8 8L11 11') + l(6,12,5,15) + l(6,12,8,15),
    '🤜': p('M5 5C4 5 3 6 3 8V12C3 13 4 14 5 14H11C13 14 14 12 14 10C14 9 13 8 12 8H10V6C10 5 9 4 8 4') + cf(6,9,0.8),
    '🤫': c(8,7,5) + p('M5 10C5 8 11 8 11 10C10 12 6 12 5 10') + cf(9.5,10,0.8) + p('M13 4L14 2'),
    '🦖': c(5,5,2.5) + p('M5 7.5C6 8 8 8.5 10 8C12 7.5 14 6 15 7') + p('M5 5C5 5 7 4 8 3') + l(5,10,4,14) + l(7,10,7,14),
    '🦜': c(5,6,2.5) + p('M5 8.5C5 11 7 12 9 11C11 10 11 8 10 7') + p('M7 5C8 3 10 3 10 5') + cf(6,5.5,0.8) + p('M4 7.5L2 8.5'),
    '🦾': p('M8 2C10 2 11 4 11 6H12C13 6 13 9 12 9H11C11 11 10 12 9 12C9 12 9 14 7 14C6 14 5 13 5 12C5 11 6 10 6 9C5 8 4 7 4 6C4 4 5 2 7 2') + l(5,12,4,14),
    '🧗': l(7,14,7,10) + p('M7 10C7 9 8 7 8 5') + c(8,4,2) + p('M10 6C11 5 13 6 13 8') + l(7,11,10,9),
    '🩸': p('M8 2.5C8 2.5 4.5 7 4.5 10.5C4.5 12.5 6 14 8 14C10 14 11.5 12.5 11.5 10.5C11.5 7 8 2.5 8 2.5z') + cf(8,10.5,1.5),
    '🪓': p('M5 12L10 4L14 7L12 10L9 10L7.5 13Z') + l(9,10,14,14),
    '🪔': p('M8 7C7 4 9 3 8 1') + r(5,7,6,6,1) + p('M5 9C3 10 3 12 5 12') + p('M11 9C13 10 13 12 11 12') + l(5,12,11,12),
    '🪞': r(4,2,8,12,1) + l(5,3,12,3) + l(5,3,4,5) + l(6,14,10,14),
    '🪟': r(2,2,12,12,0.5) + l(8,2,8,14) + l(2,8,14,8),

    // — Emojis manquants critiques —
    '👑': pf('M2 12L2 8L5 10.5L8 5L11 10.5L14 8L14 12Z'),
    '🐉': p('M5 5.5C3.5 5 2.5 4 2.5 3C2.5 2 4 2 4 3') + c(6,5,2.5) + p('M6 7.5C6 9 4 11 4 14') + p('M8.5 5C12 4 14 6 12 9C10 12 8 11 8.5 9') + p('M5 3.5L4.5 2'),
    '👁️': p('M2 8C5 4 11 4 14 8C11 12 5 12 2 8Z') + c(8,8,2.2) + cf(8,8,1),
    '🦂': c(5,9,2.5) + p('M5 6.5C5 5 4 3.5 3 3.5C2 3.5 2 4.5 3 5') + p('M5 6.5C6 5 7 5 8 5C10 5 12 6 13 7C14 9 14 11 13 12C12 14 11 14 11 13'),
    '💮': pf('M8 2L9 6.3 14 7 9 7.7 8 13 7 7.7 2 7 7 6.3Z') + cf(13,3,1) + cf(3.5,12,0.8),
    '🦴': p('M4 4C3 4 2.5 5 2.5 6C2.5 7 3.5 8 4.5 8L8 12C8 13 9 14 10 14C11 14 12 13 12 12C12 11 11 10 10 10L6 6C7 6 8 5 8 4C8 3 7 2.5 6 2.5C5 2.5 4 3 4 4z'),

  };

  function makeSvg(emoji, w, h) {
    if (!ICON_MAP[emoji]) return null;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"'
      + ' width="' + w + '" height="' + h + '" aria-hidden="true">'
      + ICON_MAP[emoji] + '</svg>';
  }

  // 1. Remplace .icon (sidebar) — comportement original
  document.querySelectorAll('.icon').forEach(function(el) {
    var emoji = el.textContent.trim();
    var svg = makeSvg(emoji, '100%', '100%');
    if (!svg) return;
    el.innerHTML = svg;
  });

  // 2. Remplace .card-icon
  document.querySelectorAll('.card-icon').forEach(function(el) {
    var emoji = el.textContent.trim();
    var svg = makeSvg(emoji, '100%', '100%');
    if (!svg) return;
    var inLink = el.closest('.card-link') !== null;
    if (inLink) {
      el.style.cssText = 'display:block;width:36px;height:36px;margin:0 auto 0.5rem;';
    } else {
      el.style.cssText = 'display:inline-block;width:16px;height:16px;vertical-align:middle;margin-right:0.35rem;flex-shrink:0;';
    }
    el.innerHTML = svg;
  });

  // 3. Remplace .infobox-image (quand le contenu est un emoji pur)
  document.querySelectorAll('.infobox-image').forEach(function(el) {
    var text = el.textContent.trim();
    if (el.querySelector('img,svg')) return; // déjà une image réelle
    var svg = makeSvg(text, '72', '72');
    if (!svg) return;
    el.style.color = 'var(--gold-dark)';
    el.innerHTML = svg;
  });

  // 4. Remplace l'emoji en tête de .page-title
  document.querySelectorAll('h1.page-title').forEach(function(el) {
    var html = el.innerHTML;
    // Cherche un emoji connu au début du texte
    for (var emoji in ICON_MAP) {
      if (html.startsWith(emoji) || html.startsWith(emoji + '&nbsp;') || html.startsWith(emoji + ' ')) {
        var svg = '<span style="display:inline-block;width:0.85em;height:0.85em;vertical-align:middle;margin-right:0.2em;">'
          + makeSvg(emoji, '100%', '100%') + '</span>';
        el.innerHTML = html.replace(emoji, svg);
        break;
      }
    }
  });

})();

console.log('✦ Kaleysur Wiki chargé ✦');
