/* ── Compendium D&D 2024 (wikidot local + dnd5eapi fallback) ── */
(function () {
  const O5E  = 'https://api.open5e.com';
  const D5E  = 'https://www.dnd5eapi.co';
  const DOC  = 'srd-2024';
  const _cache = {};
  let _activeTab = 'spells';
  let _allItems  = [];
  let _searchTimer = null;

  const overlay = () => document.getElementById('compendium-overlay');
  const list    = () => document.getElementById('compendium-list');

  /* ── Follow pagination (used only for monsters & equipment) ── */
  async function _fetchAll(firstUrl) {
    const acc = [];
    let next = firstUrl;
    while (next) {
      const r = await fetch(next);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      acc.push(...(d.results || []));
      next = d.next || null;
      if (acc.length > 3000) break;
    }
    return acc;
  }

  window._openCompendiumReal = function (tab) {
    _activeTab = tab || 'spells';
    overlay().classList.add('open');
    document.querySelectorAll('.comp-tab-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.compTab === _activeTab)
    );
    document.getElementById('comp-filter-level').style.display = _activeTab === 'spells'    ? '' : 'none';
    document.getElementById('comp-filter-class').style.display = _activeTab === 'spells'    ? '' : 'none';
    document.getElementById('comp-filter-cat').style.display   = _activeTab === 'equipment' ? '' : 'none';
    document.getElementById('comp-filter-cr').style.display    = _activeTab === 'monsters'  ? '' : 'none';
    document.getElementById('btn-startequip').style.display           = _activeTab === 'equipment' ? '' : 'none';
    document.getElementById('comp-filter-startequip').style.display   = _activeTab === 'equipment' ? '' : 'none';
    document.getElementById('btn-comp-summons').style.display         = _activeTab === 'monsters'  ? 'inline-block' : 'none';
    if (_activeTab !== 'equipment') { document.getElementById('comp-startequip-panel').classList.remove('open'); document.getElementById('btn-startequip').classList.remove('open'); }
    if (_activeTab !== 'monsters') _toggleSummons(false);
    document.getElementById('comp-search').value = '';
    document.getElementById('comp-filter-level').value = '';
    document.getElementById('comp-filter-class').value = '';
    document.getElementById('comp-filter-cat').value   = '';
    document.getElementById('comp-filter-startequip').value = '';
    _loadTab(_activeTab);
  };

  function _closeCompendium() { overlay().classList.remove('open'); }

  /* ── Traductions catégories équipement ── */
  const CAT_FR = {
    'Adventuring Gear':'Équipement aventure', 'Armor':'Armures', 'Weapon':'Armes',
    'Tools':'Outils', 'Mounts and Vehicles':'Montures', 'Trade Goods':'Marchandises',
    'Wondrous Items':'Objets merveilleux', 'Magic Items':'Objets magiques',
    'Tack, Harness, and Drawn Vehicles':'Harnachement',
    'Mounts and Other Animals':'Animaux & Montures',
  };

  // Extrait la catégorie d'un item
  // Open5e v2 : item.category = { name:"Armor", key:"armor" }  (objet)
  // dnd5eapi   : item.equipment_category.name                   (string imbriquée)
  // local      : item.category = "Wondrous Items"               (string directe)
  function _itemCat(item) {
    const c = item.category;
    return (typeof c === 'string' ? c : c?.name) || item.equipment_category?.name || '';
  }

  function _populateCatFilter() {
    const cats = [...new Set(_allItems.map(_itemCat).filter(Boolean))].sort();
    const sel = document.getElementById('comp-filter-cat');
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '<option value="">Toute catégorie</option>' +
      cats.map(c => `<option value="${c}">${CAT_FR[c] || c}</option>`).join('');
    if (cats.includes(prev)) sel.value = prev;
  }

  /* ── Cache persistant (Cache API, TTL 24h) — évite de re-fetch Open5e à chaque session ── */
  const COMP_CACHE = 'kaleysur-compendium-v1';
  const COMP_TTL   = 24 * 60 * 60 * 1000;
  async function _persistGet(tab) {
    try {
      const c = await caches.open(COMP_CACHE);
      const r = await c.match('__comp__' + tab);
      if (!r) return null;
      const { ts, items } = await r.json();
      return (Date.now() - ts < COMP_TTL && Array.isArray(items)) ? items : null;
    } catch { return null; }
  }
  async function _persistPut(tab, items) {
    try {
      const c = await caches.open(COMP_CACHE);
      await c.put('__comp__' + tab, new Response(
        JSON.stringify({ ts: Date.now(), items }),
        { headers: { 'Content-Type': 'application/json' } }
      ));
    } catch {}
  }

  async function _loadTab(tab) {
    if (_cache[tab]) {
      _allItems = _cache[tab];
      if (tab === 'equipment') _populateCatFilter();
      _render(); return;
    }
    // Cache persistant pour les onglets API (equipment/monsters) — les sorts sont un fichier local déjà rapide
    if (tab !== 'spells') {
      const persisted = await _persistGet(tab);
      if (persisted) {
        _allItems = _cache[tab] = persisted;
        if (tab === 'equipment') _populateCatFilter();
        _render(); return;
      }
    }
    list().innerHTML = '<div class="comp-loading">Chargement 2024…</div>';
    try {
      if (tab === 'spells') {
        // Sorts 2024 — fichier local extrait depuis dnd2024.wikidot.com
        const r = await fetch('spells-2024.json');
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        _allItems = await r.json();
      } else if (tab === 'equipment') {
        // Items 2024 — Open5e v2 (même source que les monstres)
        _allItems = await _fetchAll(`${O5E}/v2/items/?document__key__in=${DOC}&limit=300&ordering=name`);
        // Suppléments locaux (Eberron, Héros de Faerûn…)
        for (const fname of ['items-eberron.json', 'items-faerun-heroes.json', 'items-faerun-adventures.json']) {
          try {
            const re = await fetch(fname);
            if (re.ok) { const local = await re.json(); _allItems = [...local, ..._allItems]; }
          } catch {}
        }
        _populateCatFilter();
      } else {
        _allItems = await _fetchAll(`${O5E}/v2/creatures/?document__key__in=${DOC}&limit=300`);
        // Suppléments locaux (Eberron, Héros de Faerûn…)
        for (const fname of ['monsters-eberron.json', 'monsters-faerun-heroes.json', 'monsters-faerun-adventures.json']) {
          try {
            const rm = await fetch(fname);
            if (rm.ok) { const local = await rm.json(); _allItems = [...local, ..._allItems]; }
          } catch {}
        }
      }
      _cache[tab] = _allItems;
      if (tab !== 'spells') _persistPut(tab, _allItems); // fire-and-forget
      _render();
    } catch(e) {
      list().innerHTML = '<div class="comp-empty">Impossible de charger le compendium. Vérifiez votre connexion.</div>';
    }
  }

  function _render() {
    const query       = (document.getElementById('comp-search')?.value || '').toLowerCase().trim();
    const levelFilter = document.getElementById('comp-filter-level')?.value;
    const classFilter = document.getElementById('comp-filter-class')?.value;
    const catFilter   = document.getElementById('comp-filter-cat')?.value;
    const crFilter    = document.getElementById('comp-filter-cr')?.value;
    const seFilter    = document.getElementById('comp-filter-startequip')?.value;

    let items = _allItems;
    if (query) items = items.filter(i => (i.name || '').toLowerCase().includes(query));
    if (_activeTab === 'spells' && levelFilter !== '') {
      items = items.filter(i => String(i.level) === levelFilter);
    }
    if (_activeTab === 'spells' && classFilter) {
      items = items.filter(i => (i.classes || []).includes(classFilter));
    }
    if (_activeTab === 'equipment' && catFilter) {
      items = items.filter(i => _itemCat(i) === catFilter);
    }
    if (_activeTab === 'equipment' && seFilter) {
      const opts = STARTING_EQUIP[seFilter] || [];
      const names = new Set();
      opts.forEach(opt => opt.items.forEach(it => names.add(it.name.toLowerCase())));
      items = items.filter(i => names.has((i.name || '').toLowerCase()));
    }
    if (_activeTab === 'monsters' && crFilter !== '' && crFilter !== undefined) {
      items = items.filter(i => {
        const cr = parseFloat(i.challenge_rating ?? i.cr ?? 99);
        if (crFilter === '0')  return cr === 0;
        if (crFilter === '1')  return cr >= 0.125 && cr <= 1;
        if (crFilter === '5')  return cr >= 2 && cr <= 5;
        if (crFilter === '10') return cr >= 6 && cr <= 10;
        if (crFilter === '20') return cr >= 11 && cr <= 20;
        if (crFilter === '21') return cr > 20;
        return true;
      });
    }

    if (!items.length) { list().innerHTML = '<div class="comp-empty">Aucun résultat.</div>'; return; }

    const frag = document.createDocumentFragment();
    items.slice(0, 100).forEach(item => {
      const div = document.createElement('div');
      div.className = 'comp-item';

      if (_activeTab === 'spells') {
        // Schéma wikidot local : level(number), school(string), classes(string[]),
        // castingTime, range, components, material, duration, concentration, ritual, desc
        const lvl      = item.level === 0 ? 'C' : item.level;
        const school   = item.school || '';
        const castTime = item.castingTime || '';
        const range    = item.range || '';
        const conc     = item.concentration ? ' · Conc.' : '';
        const ritual   = item.ritual ? ' · Ritual' : '';
        const classes  = (item.classes || []).join(', ');
        const mat      = item.material ? ` (${item.material})` : '';
        // Première phrase de la desc pour l'aperçu
        const preview  = (item.desc || '').split('\n')[0];
        div.innerHTML = `
          <div class="comp-level-badge">${lvl}</div>
          <div class="comp-item-info">
            <div class="comp-item-name">${item.name}</div>
            <div class="comp-item-meta">${school}${conc}${ritual} · ${castTime} · ${range} · ${item.components||''}${mat}</div>
            <div class="comp-item-meta" style="color:#888;font-size:0.7rem;">${classes}</div>
            <div class="comp-item-desc">${preview}</div>
          </div>
          <button class="btn-comp-add" data-comp-type="spell" data-comp-idx="${_allItems.indexOf(item)}">+ Add</button>`;

      } else if (_activeTab === 'equipment') {
        const catRaw  = _itemCat(item);
        const cat     = CAT_FR[catRaw] || catRaw;
        // cost : Open5e v2 → string "75.00" (sans unité) | local → "75 gp" / "—" | dnd5eapi → {quantity, unit}
        const rawCost = item.cost;
        const costStr = typeof rawCost === 'string'
          ? (/^\d/.test(rawCost) ? parseFloat(rawCost) + ' gp' : rawCost)
          : rawCost ? `${rawCost.quantity} ${rawCost.unit}` : '';
        const weight  = item.weight ? `${item.weight} lb` : '';
        div.innerHTML = `
          <div class="comp-item-info">
            <div class="comp-item-name">${item.name}</div>
            <div class="comp-item-meta">${[cat, costStr, weight].filter(Boolean).join(' · ')}</div>
          </div>
          <button class="btn-comp-add" data-comp-type="item" data-comp-idx="${_allItems.indexOf(item)}">+ Add</button>`;

      } else {
        const crDisplay = item.challenge_rating ?? item.cr ?? '?';
        // type : Open5e v2 → objet {name,key} | local/dnd5eapi → string
        const typeRaw   = item.creature_type?.name || (typeof item.type === 'string' ? item.type : item.type?.name) || '';
        const typeStr   = [typeRaw, item.subtype].filter(Boolean).join(', ');
        const hpDisplay = item.hit_points ? `· ${item.hit_points} HP` : '';
        div.innerHTML = `
          <div class="comp-item-info">
            <div class="comp-item-name">${item.name}</div>
            <div class="comp-item-meta">CR ${crDisplay} ${hpDisplay} · ${typeStr || 'Creature'}</div>
          </div>
          <button class="btn-comp-add" data-comp-type="monster" data-comp-key="${item.key||''}" data-comp-idx="${_allItems.indexOf(item)}" data-comp-name="${item.name}">⊕ Import</button>`;
      }
      frag.appendChild(div);
    });
    list().innerHTML = '';
    list().appendChild(frag);
    if (items.length > 100) {
      const more = document.createElement('div');
      more.className = 'comp-empty';
      more.textContent = `… ${items.length - 100} résultats supplémentaires — affinez la recherche.`;
      list().appendChild(more);
    }
  }

  /* ── Ajouter un sort (schéma wikidot local) ── */
  function _addSpell(item) {
    if (!playerData) return;
    const desc     = item.desc || '';
    const lvl      = item.level != null ? String(item.level) : '';
    const conc     = !!(item.concentration);
    const ritual   = !!(item.ritual);

    // Auto-détection des dégâts depuis la description
    const DMG_TYPES = 'acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder';
    const dmgMatch  = desc.match(new RegExp(`(\\d+d\\d+(?:\\s*[+\\-]\\s*\\d+)?)\\s+(${DMG_TYPES})`, 'i'));
    const degat     = dmgMatch ? dmgMatch[1].replace(/\s+/g, '') : '';
    const typeDegat = dmgMatch ? dmgMatch[2].charAt(0).toUpperCase() + dmgMatch[2].slice(1).toLowerCase() : '';

    // Construire une description complète avec le stat-block du sort
    const statBlock = [
      item.school ? `École : ${item.school}` : '',
      item.components ? `Composantes : ${item.components}${item.material ? ` (${item.material})` : ''}` : '',
      item.duration ? `Durée : ${item.duration}` : '',
      item.classes?.length ? `Classes : ${item.classes.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    const fullDesc = statBlock ? `${statBlock}\n\n${desc}` : desc;

    const spell = {
      level:    lvl,
      name:     item.name,
      degat,
      typeDegat,
      portee:   item.range || '',
      action:   [item.castingTime || 'Action', ritual ? '(Ritual)' : ''].filter(Boolean).join(' '),
      conc,
      desc:     fullDesc,
      _open:    false,
      prepared: true,
    };
    if (!C().spells) C().spells = [];
    C().spells.push(spell);
    renderSpells(); triggerSave();
  }

  /* ── Ajouter un item — triple schema :
       Open5e v2 2024 : weapon/armor sous-objets, category objet, cost "75.00"
       dnd5eapi v1    : damage/range/armor_class objets imbriqués, cost {quantity,unit}
       local Eberron  : category string, cost "X gp"/"—", desc string  ── */
  function _addItem(item) {
    if (!playerData) return;

    // ── Catégorie ──
    const catName = _itemCat(item);
    const CAT_MAP = { Weapon:'arme', Armor:'armure', 'Wondrous Items':'magique', 'Magic Items':'magique', Ring:'magique' };
    const cat = CAT_MAP[catName] || 'equipement';

    const parts = [];

    // ── Dégâts arme ──
    // v2 : item.weapon.damage_dice (string) + item.weapon.damage_type (objet ou string)
    // v1 : item.damage.damage_dice | local : item.damage_dice
    const wep      = item.weapon || {};
    const dmgDice  = wep.damage_dice  || item.damage_dice  || item.damage?.damage_dice  || '';
    const dmgTypeR = wep.damage_type  || item.damage_type  || item.damage?.damage_type  || '';
    const dmgType  = typeof dmgTypeR === 'object' ? (dmgTypeR?.name || '') : dmgTypeR;
    if (dmgDice) parts.push(`${dmgDice}${dmgType ? ' ' + dmgType : ''}`.trim());

    const twoHDice  = wep.two_handed_damage_dice || item.two_handed_damage_dice || item.two_handed_damage?.damage_dice || '';
    const twoHTypeR = wep.two_handed_damage_type || item.two_handed_damage_type || item.two_handed_damage?.damage_type || '';
    const twoHType  = typeof twoHTypeR === 'object' ? (twoHTypeR?.name || '') : twoHTypeR;
    if (twoHDice) parts.push(`(2H: ${twoHDice}${twoHType ? ' ' + twoHType : ''})`.trim());

    // ── Propriétés ──
    // v2 : item.weapon.properties[].property.name | v1 : item.properties[{name}] | local : string[]
    const propsArr = wep.properties?.length ? wep.properties : (item.properties || []);
    if (propsArr.length) {
      const propNames = propsArr
        .map(p => typeof p === 'string' ? p : (p.property?.name || p.name || ''))
        .filter(Boolean);
      if (propNames.length) parts.push(propNames.join(', '));
    }
    // Weapon Mastery 2024 : champ direct ou dans weapon.properties (type Mastery)
    if (item.weapon_mastery) {
      parts.push(`Maîtrise : ${item.weapon_mastery}`);
    } else {
      const mp = propsArr.find(p => p.property?.type === 'Mastery' || p.property?.name === 'Mastery');
      if (mp) parts.push(`Maîtrise : ${mp.detail || mp.property?.name || 'Mastery'}`);
    }

    // ── Portée ──
    // v2 : item.weapon.range_normal | v1 : item.range.normal | local : item.range_normal
    const rNorm = wep.range_normal ?? item.range_normal ?? item.range?.normal ?? null;
    const rLong = wep.range_long   ?? item.range_long   ?? item.range?.long   ?? null;
    if (rNorm) parts.push(`Portée ${rNorm}/${rLong || rNorm} ft`);

    // ── CA armure ──
    // v2 : item.armor.ac_base + ac_add_dexmod + ac_cap_dexmod
    // v1 : item.armor_class.base + .dex_bonus + .max_bonus | local : item.armor_class number
    const arm    = item.armor || {};
    const acBase = arm.ac_base ?? (typeof item.armor_class === 'number' ? item.armor_class : item.armor_class?.base ?? null);
    if (acBase != null) {
      const dexBonus = arm.ac_add_dexmod  ?? (typeof item.armor_class === 'object' ? item.armor_class.dex_bonus : item.armor_dex_bonus) ?? false;
      const maxDex   = arm.ac_cap_dexmod  ?? (typeof item.armor_class === 'object' ? item.armor_class.max_bonus : item.armor_max_dex)   ?? null;
      let acStr = `CA ${acBase}`;
      if (dexBonus) acStr += maxDex ? ` + DEX (max +${maxDex})` : ' + DEX';
      parts.push(acStr);
    }
    const strMin = arm.strength_score_required ?? item.str_minimum ?? item.strength_requirement;
    if (strMin) parts.push(`Force min. ${strMin}`);
    if (arm.grants_stealth_disadvantage || item.stealth_disadvantage) parts.push('Discrétion désavantage');

    // ── Poids + coût ──
    if (item.weight) parts.push(`${item.weight} lb`);
    const rawCost = item.cost;
    const costStr = typeof rawCost === 'string'
      ? (/^\d/.test(rawCost) ? parseFloat(rawCost) + ' gp' : rawCost)  // v2 "75.00" → "75 gp"
      : rawCost ? `${rawCost.quantity} ${rawCost.unit}` : '';           // v1 {quantity, unit}
    if (costStr && costStr !== '—') parts.push(costStr);

    // ── Rareté / attunement (items magiques locaux) ──
    if (item.rarity) parts.push(item.rarity);
    if (item.requires_attunement === true) parts.push('Nécessite un lien');

    // ── Description (première ligne) ──
    const descRaw = Array.isArray(item.desc) ? item.desc[0] : (item.desc || '');
    const descFirst = descRaw.split('\n').find(l => l.trim()) || '';
    if (descFirst) parts.push(descFirst.length > 120 ? descFirst.slice(0, 120) + '…' : descFirst);

    INV().items.push({ qty: 1, name: item.name, cat, notes: parts.join(' · ') });
    renderInventory(); triggerSave();
  }

  /* ── Add monster as familiar — triple schema :
       Open5e v2 2024 : type objet, ability_scores imbriqué, speed numbers,
                         senses absents (champs séparés), skill_bonuses, traits
       dnd5eapi v1    : proficiencies array, senses objet, armor_class [{value}]
       local Eberron  : schéma proche v1/code attendu (type string, scores top-level) ── */
  function _addMonsterAsFamiliar(data) {
    if (!playerData) return;
    const c = C();
    if (!c.familiars) c.familiars = [];
    const sizeMap = { Tiny:'Tiny', Small:'Small', Medium:'Medium', Large:'Large', Huge:'Huge', Gargantuan:'Gargantuan' };

    // ── Type ──
    // v2 : data.type = {name, key} | local/v1 : string
    const typeRaw = data.creature_type?.name || (typeof data.type === 'string' ? data.type : data.type?.name) || '';
    const typeStr = [typeRaw, data.subtype].filter(Boolean).join(', ');

    // ── AC ──
    // v2 : number | v1 : [{value, type}] | local : number
    const acVal  = typeof data.armor_class === 'number' ? data.armor_class
                 : data.armor_class?.[0]?.value ?? 10;
    const acNote = typeof data.armor_class === 'number' ? (data.armor_desc || '')
                 : data.armor_class?.[0]?.type ?? '';

    // ── Scores de caractéristiques ──
    // v2 : data.ability_scores.{strength,dexterity,...} | local/v1 : data.{strength,...}
    const ab    = data.ability_scores || data;
    const abStr = ab.strength     ?? 10;
    const abDex = ab.dexterity    ?? 10;
    const abCon = ab.constitution ?? 10;
    const abInt = ab.intelligence ?? 10;
    const abWis = ab.wisdom       ?? 10;
    const abCha = ab.charisma     ?? 10;

    // ── Vitesse ──
    // v2 : {walk:30, fly:60, unit:'feet'} (nombres) | local : {walk:'30 ft.'} (strings)
    const speeds = data.speed
      ? Object.entries(data.speed)
          .filter(([k, v]) => k !== 'unit' && v && v !== 0 && v !== '0 ft.')
          .map(([k, v]) => {
            const val = typeof v === 'number' ? `${v} ft.` : v;
            return k === 'walk' ? val : `${k} ${val}`;
          }).join(', ')
      : '';

    // ── Sens ──
    // v2 : champs séparés darkvision_range, blindsight_range, passive_perception
    // v1  : data.senses = objet {darkvision:'60 ft.',...}
    // local : data.senses = string directe
    let senses;
    if (typeof data.senses === 'string') {
      senses = data.senses;
    } else if (data.senses && typeof data.senses === 'object') {
      senses = Object.entries(data.senses).map(([k, v]) => `${k.replace(/_/g,' ')} ${v}`).join(', ');
    } else {
      const sp = [];
      if (data.darkvision_range)  sp.push(`darkvision ${data.darkvision_range} ft.`);
      if (data.blindsight_range)  sp.push(`blindsight ${data.blindsight_range} ft.`);
      if (data.tremorsense_range) sp.push(`tremorsense ${data.tremorsense_range} ft.`);
      if (data.truesight_range)   sp.push(`truesight ${data.truesight_range} ft.`);
      if (data.passive_perception) sp.push(`passive Perception ${data.passive_perception}`);
      senses = sp.join(', ');
    }

    // ── Jets de sauvegarde ──
    // v2 : {strength:5, dexterity:3} (clés longues, valeurs numériques)
    // local : {str:'+4', dex:'+2'} (clés courtes, strings)
    // v1 : proficiencies[]
    const SAVE_LONG  = { strength:'STR', dexterity:'DEX', constitution:'CON', intelligence:'INT', wisdom:'WIS', charisma:'CHA' };
    const SAVE_SHORT = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' };
    let savesNote = '';
    if (data.saving_throws && typeof data.saving_throws === 'object' && !Array.isArray(data.saving_throws)) {
      savesNote = Object.entries(data.saving_throws).map(([k, v]) => {
        const label = SAVE_SHORT[k] || SAVE_LONG[k] || k.toUpperCase();
        const val   = typeof v === 'number' ? (v >= 0 ? `+${v}` : `${v}`) : v;
        return `${label} ${val}`;
      }).join(', ');
    } else {
      savesNote = (data.proficiencies||[])
        .filter(p => p.proficiency?.index?.startsWith('saving-throw'))
        .map(p => `${p.proficiency.name?.replace('Saving Throw: ','')} +${p.value}`).join(', ');
    }

    // ── Compétences ──
    // v2 : data.skill_bonuses = {history:12} (clés lowercase, valeurs numériques)
    // local : data.skills = {perception:'+3'} (clés lowercase, strings)
    // v1 : proficiencies[]
    let skillsNote = '';
    const skillsObj = data.skills || data.skill_bonuses;
    if (skillsObj && typeof skillsObj === 'object' && !Array.isArray(skillsObj)) {
      skillsNote = Object.entries(skillsObj).map(([k, v]) => {
        const val = typeof v === 'number' ? (v >= 0 ? `+${v}` : `${v}`) : v;
        return `${k} ${val}`;
      }).join(', ');
    } else {
      skillsNote = (data.proficiencies||[])
        .filter(p => p.proficiency?.index?.startsWith('skill-'))
        .map(p => `${p.proficiency.name?.replace('Skill: ','')} +${p.value}`).join(', ');
    }

    // ── Résistances / immunités ──
    // v2 : data.resistances_and_immunities.damage_resistances | local/v1 : data.damage_resistances
    const ri = data.resistances_and_immunities || {};
    const _joinArr = arr => Array.isArray(arr) ? arr.join(', ') : (arr || '');

    const toList = arr => (arr||[]).map(x => ({ name: x.name||'', desc: x.desc||'' }));

    const fam = {
      name: data.name || 'Creature',
      type: typeStr || 'Beast',
      size: sizeMap[data.size] || data.size || 'Medium',
      alignment: data.alignment || 'Unaligned',
      ac: acVal, acNote,
      pvMax: data.hit_points || 4, pvActuel: data.hit_points || 4,
      speed: speeds,
      for: abStr, dex: abDex, con: abCon, int: abInt, sag: abWis, cha: abCha,
      savesNote, skillsNote,
      vulnerabilities: _joinArr(ri.damage_vulnerabilities || data.damage_vulnerabilities),
      resistances:     _joinArr(ri.damage_resistances     || data.damage_resistances),
      immunities:      _joinArr(ri.damage_immunities      || data.damage_immunities),
      senses, languages: data.languages || '—',
      cr: String(data.challenge_rating ?? data.cr ?? '0'),
      // v2 : traits | local/v1 : special_abilities
      traits:       toList(data.traits || data.special_abilities),
      actions:      toList(data.actions),
      bonusActions: toList(data.bonus_actions),
      reactions:    toList(data.reactions),
      notes: '', _collapsed: false
    };
    c.familiars.push(fam);
    if (typeof _tabDirty !== 'undefined') _tabDirty.familiers = true;
    renderFamiliars(); triggerSave();
    if (document.getElementById('screen-dashboard')?.classList.contains('active')) {
      document.querySelector('.tab-btn[data-tab="familiers"]')?.click();
    }
  }

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-comp-add');
    if (!btn) return;
    const type = btn.dataset.compType;

    if (type === 'monster') {
      btn.textContent = '…'; btn.disabled = true;
      try {
        // Try using already-cached full data first (v2 list may have full stats)
        const cachedIdx = parseInt(btn.dataset.compIdx);
        const cached = isNaN(cachedIdx) ? null : _allItems[cachedIdx];
        let data = (cached && cached.hit_points) ? cached : null;
        if (!data) {
          // Fetch individual creature — v2 direct, puis v1 (slug stable)
          const key = btn.dataset.compKey;
          if (!key) throw new Error('No key');
          const rv2 = await fetch(`${O5E}/v2/creatures/${key}/`).catch(() => null);
          if (rv2?.ok) {
            data = await rv2.json();
          } else {
            const rv1 = await fetch(`${O5E}/v1/monsters/${key}/`).catch(() => null);
            if (!rv1?.ok) throw new Error(`Not found: ${key}`);
            data = await rv1.json();
          }
        }
        _addMonsterAsFamiliar(data);
        btn.textContent = '✓ Imported';
        const metaEl = btn.closest('.comp-item')?.querySelector('.comp-item-meta');
        if (metaEl) metaEl.textContent = `CR ${data.challenge_rating??data.cr??'?'} · AC ${data.armor_class?.[0]?.value??data.armor_class??'?'} · ${data.hit_points??'?'} HP`;
        setTimeout(() => { btn.textContent = '⊕ Import'; btn.disabled = false; }, 2000);
      } catch {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = '⊕ Import'; btn.disabled = false; }, 2000);
      }
      return;
    }
    const idx  = parseInt(btn.dataset.compIdx);
    const item = _allItems[idx];
    if (!item) return;
    // Open5e v2 retourne les données complètes dans la liste — pas de fetch individuel
    if (type === 'spell') _addSpell(item);
    else _addItem(item);
    btn.textContent = '✓ Added'; btn.disabled = true;
    setTimeout(() => { btn.textContent = '+ Add'; btn.disabled = false; }, 1800);
  });

  function _debouncedRender() {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(_render, 200);
  }

  /* ── Délégation globale : tous les éléments du modal sont parsés après ce script ── */
  document.addEventListener('click', e => {
    /* fermer via bouton ✕ */
    if (e.target.closest('#btn-compendium-close')) { _closeCompendium(); return; }
    /* fermer via clic sur le fond */
    if (e.target.id === 'compendium-overlay') { _closeCompendium(); return; }
    /* onglets Sorts / Équipements / Monstres */
    const compTab = e.target.closest('.comp-tab-btn');
    if (compTab) {
      _activeTab = compTab.dataset.compTab;
      document.querySelectorAll('.comp-tab-btn').forEach(b => b.classList.toggle('active', b === compTab));
      document.getElementById('comp-filter-level').style.display = _activeTab === 'spells' ? '' : 'none';
      document.getElementById('comp-filter-class').style.display = _activeTab === 'spells' ? '' : 'none';
      document.getElementById('comp-filter-cat').style.display = _activeTab === 'equipment' ? '' : 'none';
      document.getElementById('comp-filter-cr').style.display = _activeTab === 'monsters' ? '' : 'none';
      document.getElementById('btn-startequip').style.display           = _activeTab === 'equipment' ? '' : 'none';
      document.getElementById('comp-filter-startequip').style.display   = _activeTab === 'equipment' ? '' : 'none';
      document.getElementById('btn-comp-summons').style.display         = _activeTab === 'monsters'  ? 'inline-block' : 'none';
      if (_activeTab !== 'equipment') { document.getElementById('comp-startequip-panel').classList.remove('open'); document.getElementById('btn-startequip').classList.remove('open'); }
      if (_activeTab !== 'monsters') _toggleSummons(false);
      document.getElementById('comp-search').value = '';
      document.getElementById('comp-filter-level').value = '';
      document.getElementById('comp-filter-class').value = '';
      document.getElementById('comp-filter-cat').value = '';
      document.getElementById('comp-filter-cr').value = '';
      document.getElementById('comp-filter-startequip').value = '';
      if (_cache[_activeTab]) { _allItems = _cache[_activeTab]; _render(); }
      else _loadTab(_activeTab);
    }
    /* bouton invocations */
    if (e.target.closest('#btn-comp-summons')) { _toggleSummons(); return; }
    /* boutons d'ouverture : gérés par le stub dans joueurs.html (lazy-load) */
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'comp-search') _debouncedRender();
  });

  document.addEventListener('change', e => {
    const ids = ['comp-filter-level', 'comp-filter-class', 'comp-filter-cat', 'comp-filter-cr', 'comp-filter-startequip'];
    if (ids.includes(e.target.id)) _render();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay()?.classList.contains('open')) _closeCompendium();
  });

  /* ── Invocations / Summon Creatures ── */
  let _summonsMode = false;

  // k = clé Open5e/dnd5eapi, n = nom affiché
  // spirit = objet stat-block inline pour les esprits scalants
  const SUMMON_SPELLS = [
    // ── Familiars & Steeds (PHB 2024) ──
    { spell:'Find Familiar', level:1, icon:'🐱',
      creatures:[
        {n:'Bat',k:'bat'},{n:'Cat',k:'cat'},{n:'Crab',k:'crab'},{n:'Frog',k:'frog'},
        {n:'Hawk',k:'hawk'},{n:'Lizard',k:'lizard'},{n:'Octopus',k:'octopus'},{n:'Owl',k:'owl'},
        {n:'Poisonous Snake',k:'poisonous-snake'},{n:'Quipper',k:'quipper'},{n:'Rat',k:'rat'},
        {n:'Raven',k:'raven'},{n:'Sea Horse',k:'sea-horse'},{n:'Spider',k:'spider'},{n:'Weasel',k:'weasel'},
      ]
    },
    { spell:'Find Steed', level:2, icon:'🐴', note:'Otherworldly Steed — scales with slot level',
      creatures:[
        { n:'Otherworldly Steed — Celestial', spirit:{
            name:'Otherworldly Steed (Celestial)', type:'Celestial', size:'Large',
            ac:12, acNote:'10 + spell slot level', hp:25, hpNote:'5 + 10 × slot level (d10s = slot level)',
            speed:'60 ft. (Fly 60 ft. if slot ≥ 4)',
            str:18, dex:12, con:14, int:6, wis:12, cha:8,
            cr:'—', languages:'Telepathy 1 mile (caster only)', senses:'Passive Perception 11',
            traits:[
              {name:'Life Bond', desc:'When you regain HP from a level 1+ spell, the steed regains the same number of HP if it is within 5 feet of you.'},
              {name:'Scaling', desc:'AC = 10 + slot level · HP = 5 + 10 × slot level · Fly 60 ft. only if slot ≥ 4'},
            ],
            actions:[{name:'Otherworldly Slam', desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + slot level Radiant damage.'}],
            bonus_actions:[{name:'Healing Touch (1/Long Rest)', desc:'One creature within 5 feet of the steed regains 2d8 + spell slot level Hit Points.'}]
          }
        },
        { n:'Otherworldly Steed — Fey', spirit:{
            name:'Otherworldly Steed (Fey)', type:'Fey', size:'Large',
            ac:12, acNote:'10 + spell slot level', hp:25, hpNote:'5 + 10 × slot level (d10s = slot level)',
            speed:'60 ft. (Fly 60 ft. if slot ≥ 4)',
            str:18, dex:12, con:14, int:6, wis:12, cha:8,
            cr:'—', languages:'Telepathy 1 mile (caster only)', senses:'Passive Perception 11',
            traits:[
              {name:'Life Bond', desc:'When you regain HP from a level 1+ spell, the steed regains the same number of HP if it is within 5 feet of you.'},
              {name:'Scaling', desc:'AC = 10 + slot level · HP = 5 + 10 × slot level · Fly 60 ft. only if slot ≥ 4'},
            ],
            actions:[{name:'Otherworldly Slam', desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + slot level Psychic damage.'}],
            bonus_actions:[{name:'Fey Step (1/Long Rest)', desc:'The steed teleports, along with its rider, to an unoccupied space of your choice up to 60 feet away from itself.'}]
          }
        },
        { n:'Otherworldly Steed — Fiend', spirit:{
            name:'Otherworldly Steed (Fiend)', type:'Fiend', size:'Large',
            ac:12, acNote:'10 + spell slot level', hp:25, hpNote:'5 + 10 × slot level (d10s = slot level)',
            speed:'60 ft. (Fly 60 ft. if slot ≥ 4)',
            str:18, dex:12, con:14, int:6, wis:12, cha:8,
            cr:'—', languages:'Telepathy 1 mile (caster only)', senses:'Passive Perception 11',
            traits:[
              {name:'Life Bond', desc:'When you regain HP from a level 1+ spell, the steed regains the same number of HP if it is within 5 feet of you.'},
              {name:'Scaling', desc:'AC = 10 + slot level · HP = 5 + 10 × slot level · Fly 60 ft. only if slot ≥ 4'},
            ],
            actions:[{name:'Otherworldly Slam', desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + slot level Necrotic damage.'}],
            bonus_actions:[{name:'Fell Glare (1/Long Rest)', desc:'WIS save (DC = your spell save DC), one creature within 60 feet the steed can see. On a failure, the target has the Frightened condition until the end of your next turn.'}]
          }
        },
      ]
    },
    { spell:'Find Greater Steed', level:4, icon:'🦅', note:'Spirit — CR ≤5, Large or smaller',
      creatures:[
        {n:'Griffon',k:'griffon'},{n:'Hippogriff',k:'hippogriff'},{n:'Pegasus',k:'pegasus'},
        {n:'Peryton',k:'peryton'},{n:'Saber-Toothed Tiger',k:'saber-toothed-tiger'},
      ]
    },
    // ── Conjure (PHB 2024 — spirit in creature form) ──
    { spell:'Conjure Animals', level:3, icon:'🐺', note:'Spirit in beast form — CR ≤2 examples',
      creatures:[
        {n:'Black Bear',k:'black-bear'},{n:'Brown Bear',k:'brown-bear'},{n:'Dire Wolf',k:'dire-wolf'},
        {n:'Giant Eagle',k:'giant-eagle'},{n:'Giant Owl',k:'giant-owl'},
        {n:'Giant Wolf Spider',k:'giant-wolf-spider'},{n:'Panther',k:'panther'},
        {n:'Reef Shark',k:'reef-shark'},{n:'Wolf',k:'wolf'},
        {n:'Allosaurus',k:'allosaurus'},{n:'Giant Constrictor Snake',k:'giant-constrictor-snake'},
      ]
    },
    { spell:'Conjure Elemental', level:5, icon:'🌀', note:'Spirit in elemental form — CR ≤5',
      creatures:[
        {n:'Air Elemental',k:'air-elemental'},{n:'Earth Elemental',k:'earth-elemental'},
        {n:'Fire Elemental',k:'fire-elemental'},{n:'Water Elemental',k:'water-elemental'},
      ]
    },
    { spell:'Conjure Fey', level:6, icon:'🧚', note:'Spirit in fey form — CR ≤5',
      creatures:[
        {n:'Dryad',k:'dryad'},{n:'Green Hag',k:'green-hag'},{n:'Night Hag',k:'night-hag'},
        {n:'Pixie',k:'pixie'},{n:'Satyr',k:'satyr'},{n:'Sprite',k:'sprite'},
      ]
    },
    // ── Undead ──
    { spell:'Animate Dead', level:3, icon:'💀',
      creatures:[{n:'Skeleton',k:'skeleton'},{n:'Zombie',k:'zombie'}]
    },
    { spell:'Create Undead', level:6, icon:'🦴',
      creatures:[
        {n:'Ghoul',k:'ghoul'},{n:'Ghast',k:'ghast'},{n:'Wight',k:'wight'},{n:'Mummy',k:'mummy'},
      ]
    },
    // ── Scaling Spirits (PHB 2024) ──
    { spell:'Summon Beast', level:2, icon:'🦁', note:'AC/HP scale with slot level',
      creatures:[
        { n:'Bestial Spirit — Air', spirit:{name:'Bestial Spirit (Air)',type:'Beast',size:'Small',
            ac:11,acNote:'11 + slot level',hp:20,hpNote:'20 (Air) + 5 per slot above 2nd',
            speed:'30 ft., fly 60 ft.',str:18,dex:11,con:16,int:4,wis:14,cha:5,
            cr:'—',languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 12',
            traits:[
              {name:'Flyby',desc:"The spirit doesn't provoke Opportunity Attacks when it flies out of an enemy's reach."},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 20 + 5 × (slot − 2)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Rend attacks equal to half this spell's level (round down)."},
              {name:'Rend',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 4 + slot level Piercing damage.'},
            ]
          }
        },
        { n:'Bestial Spirit — Land', spirit:{name:'Bestial Spirit (Land)',type:'Beast',size:'Small',
            ac:11,acNote:'11 + slot level',hp:30,hpNote:'30 (Land/Water) + 5 per slot above 2nd',
            speed:'30 ft., climb 30 ft.',str:18,dex:11,con:16,int:4,wis:14,cha:5,
            cr:'—',languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 12',
            traits:[
              {name:'Pack Tactics',desc:"The spirit has Advantage on an attack roll against a creature if at least one of the spirit's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition."},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 30 + 5 × (slot − 2)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Rend attacks equal to half this spell's level (round down)."},
              {name:'Rend',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 4 + slot level Piercing damage.'},
            ]
          }
        },
        { n:'Bestial Spirit — Water', spirit:{name:'Bestial Spirit (Water)',type:'Beast',size:'Small',
            ac:11,acNote:'11 + slot level',hp:30,hpNote:'30 (Land/Water) + 5 per slot above 2nd',
            speed:'30 ft., swim 30 ft.',str:18,dex:11,con:16,int:4,wis:14,cha:5,
            cr:'—',languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 12',
            traits:[
              {name:'Pack Tactics',desc:"The spirit has Advantage on an attack roll against a creature if at least one of the spirit's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition."},
              {name:'Water Breathing',desc:'The spirit can breathe only underwater.'},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 30 + 5 × (slot − 2)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Rend attacks equal to half this spell's level (round down)."},
              {name:'Rend',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 4 + slot level Piercing damage.'},
            ]
          }
        },
      ]
    },
    { spell:'Summon Fey', level:3, icon:'✨', note:'AC/HP scale with slot level',
      creatures:[
        { n:'Fey Spirit — Fuming', spirit:{name:'Fey Spirit (Fuming)',type:'Fey',size:'Small',
            ac:12,acNote:'12 + slot level',hp:30,hpNote:'30 + 10 per slot above 3rd',
            speed:'30 ft., fly 30 ft.',str:13,dex:16,con:14,int:14,wis:11,cha:16,cr:'—',
            immunities:'Charmed',
            languages:'Sylvan, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[{name:'Scaling',desc:'AC = 12 + slot level · HP = 30 + 10 × (slot − 3)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Fey Blade attacks equal to half this spell's level (round down)."},
              {name:'Fey Blade',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 2d6 + 3 + slot level Force damage.'},
            ],
            bonus_actions:[{name:'Fey Step',desc:'The spirit teleports up to 30 feet to an unoccupied space it can see. Fuming effect: The spirit has Advantage on the next attack roll it makes before the end of this turn.'}]
          }
        },
        { n:'Fey Spirit — Mirthful', spirit:{name:'Fey Spirit (Mirthful)',type:'Fey',size:'Small',
            ac:12,acNote:'12 + slot level',hp:30,hpNote:'30 + 10 per slot above 3rd',
            speed:'30 ft., fly 30 ft.',str:13,dex:16,con:14,int:14,wis:11,cha:16,cr:'—',
            immunities:'Charmed',
            languages:'Sylvan, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[{name:'Scaling',desc:'AC = 12 + slot level · HP = 30 + 10 × (slot − 3)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Fey Blade attacks equal to half this spell's level (round down)."},
              {name:'Fey Blade',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 2d6 + 3 + slot level Force damage.'},
            ],
            bonus_actions:[{name:'Fey Step',desc:'The spirit teleports up to 30 feet to an unoccupied space it can see. Mirthful effect: WIS save (DC = spell save DC), one creature within 10 feet the spirit can see. Failure: The target is Charmed by you and the spirit for 1 minute or until the target takes any damage.'}]
          }
        },
        { n:'Fey Spirit — Tricksy', spirit:{name:'Fey Spirit (Tricksy)',type:'Fey',size:'Small',
            ac:12,acNote:'12 + slot level',hp:30,hpNote:'30 + 10 per slot above 3rd',
            speed:'30 ft., fly 30 ft.',str:13,dex:16,con:14,int:14,wis:11,cha:16,cr:'—',
            immunities:'Charmed',
            languages:'Sylvan, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[{name:'Scaling',desc:'AC = 12 + slot level · HP = 30 + 10 × (slot − 3)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Fey Blade attacks equal to half this spell's level (round down)."},
              {name:'Fey Blade',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 2d6 + 3 + slot level Force damage.'},
            ],
            bonus_actions:[{name:'Fey Step',desc:'The spirit teleports up to 30 feet to an unoccupied space it can see. Tricksy effect: The spirit fills a 10-foot Cube within 5 feet of it with magical Darkness, which lasts until the end of its next turn.'}]
          }
        },
      ]
    },
    { spell:'Summon Undead', level:3, icon:'💀', note:'AC/HP scale with slot level',
      creatures:[
        { n:'Undead Spirit — Ghostly', spirit:{name:'Undead Spirit (Ghostly)',type:'Undead',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:30,hpNote:'30 (Ghostly/Putrid) + 10 per slot above 3rd',
            speed:'0 ft., fly 40 ft. (hover)',str:12,dex:16,con:15,int:4,wis:10,cha:9,cr:'—',
            immunities:'Necrotic, Poison; Exhaustion, Frightened, Paralyzed, Poisoned',
            languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Incorporeal Passage',desc:'The spirit can move through other creatures and objects as if they were Difficult Terrain. If it ends its turn inside an object, it is shunted to the nearest unoccupied space and takes 1d10 Force damage for every 5 feet traveled.'},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 30 + 10 × (slot − 3)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Deathly Touch',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 3 + slot level Necrotic, and the target has the Frightened condition until the end of its next turn.'},
            ]
          }
        },
        { n:'Undead Spirit — Putrid', spirit:{name:'Undead Spirit (Putrid)',type:'Undead',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:30,hpNote:'30 (Ghostly/Putrid) + 10 per slot above 3rd',
            speed:'30 ft.',str:12,dex:16,con:15,int:4,wis:10,cha:9,cr:'—',
            immunities:'Necrotic, Poison; Exhaustion, Frightened, Paralyzed, Poisoned',
            languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Festering Aura',desc:'CON save (DC = spell save DC), any creature (other than you) that starts its turn within a 5-foot Emanation originating from the spirit. Failure: The creature has the Poisoned condition until the start of its next turn.'},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 30 + 10 × (slot − 3)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Rotting Claw',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d6 + 3 + slot level Slashing. If the target has the Poisoned condition, it has the Paralyzed condition until the end of its next turn.'},
            ]
          }
        },
        { n:'Undead Spirit — Skeletal', spirit:{name:'Undead Spirit (Skeletal)',type:'Undead',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:20,hpNote:'20 (Skeletal) + 10 per slot above 3rd',
            speed:'30 ft.',str:12,dex:16,con:15,int:4,wis:10,cha:9,cr:'—',
            immunities:'Necrotic, Poison; Exhaustion, Frightened, Paralyzed, Poisoned',
            languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[{name:'Scaling',desc:'AC = 11 + slot level · HP = 20 + 10 × (slot − 3)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Grave Bolt',desc:'Ranged Attack: your spell attack modifier to hit, range 150 ft. Hit: 2d4 + 3 + slot level Necrotic damage.'},
            ]
          }
        },
      ]
    },
    { spell:'Summon Elemental', level:4, icon:'🌊', note:'AC/HP scale with slot level',
      creatures:[
        { n:'Elemental Spirit — Air', spirit:{name:'Elemental Spirit (Air)',type:'Elemental',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:50,hpNote:'50 + 10 per slot above 4th',
            speed:'40 ft., fly 40 ft. (hover)',str:18,dex:15,con:17,int:4,wis:10,cha:16,cr:'—',
            resistances:'Lightning, Thunder',
            immunities:'Poison; Exhaustion, Paralyzed, Petrified, Poisoned',
            languages:'Primordial, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Amorphous Form',desc:'The spirit can move through a space as narrow as 1 inch wide without it counting as Difficult Terrain.'},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 50 + 10 × (slot − 4)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Slam attacks equal to half this spell's level (round down)."},
              {name:'Slam',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d10 + 4 + slot level Lightning damage.'},
            ]
          }
        },
        { n:'Elemental Spirit — Earth', spirit:{name:'Elemental Spirit (Earth)',type:'Elemental',size:'Medium',
            ac:17,acNote:'17 (natural armor)',hp:50,hpNote:'50 + 10 per slot above 4th',
            speed:'40 ft., burrow 40 ft.',str:18,dex:15,con:17,int:4,wis:10,cha:16,cr:'—',
            resistances:'Piercing, Slashing',
            immunities:'Poison; Exhaustion, Paralyzed, Petrified, Poisoned',
            languages:'Primordial, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[{name:'Scaling',desc:'AC fixed 17 · HP = 50 + 10 × (slot − 4)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Slam attacks equal to half this spell's level (round down)."},
              {name:'Slam',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d10 + 4 + slot level Bludgeoning damage.'},
            ]
          }
        },
        { n:'Elemental Spirit — Fire', spirit:{name:'Elemental Spirit (Fire)',type:'Elemental',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:50,hpNote:'50 + 10 per slot above 4th',
            speed:'40 ft.',str:18,dex:15,con:17,int:4,wis:10,cha:16,cr:'—',
            immunities:'Fire, Poison; Exhaustion, Paralyzed, Petrified, Poisoned',
            languages:'Primordial, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Amorphous Form',desc:'The spirit can move through a space as narrow as 1 inch wide without it counting as Difficult Terrain.'},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 50 + 10 × (slot − 4)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Slam attacks equal to half this spell's level (round down)."},
              {name:'Slam',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d10 + 4 + slot level Fire damage.'},
            ]
          }
        },
        { n:'Elemental Spirit — Water', spirit:{name:'Elemental Spirit (Water)',type:'Elemental',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:50,hpNote:'50 + 10 per slot above 4th',
            speed:'40 ft., swim 40 ft.',str:18,dex:15,con:17,int:4,wis:10,cha:16,cr:'—',
            resistances:'Acid',
            immunities:'Poison; Exhaustion, Paralyzed, Petrified, Poisoned',
            languages:'Primordial, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Amorphous Form',desc:'The spirit can move through a space as narrow as 1 inch wide without it counting as Difficult Terrain.'},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 50 + 10 × (slot − 4)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Slam attacks equal to half this spell's level (round down)."},
              {name:'Slam',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d10 + 4 + slot level Cold damage.'},
            ]
          }
        },
      ]
    },
    { spell:'Summon Aberration', level:4, icon:'🐙', note:'AC/HP scale with slot level',
      creatures:[
        { n:'Aberrant Spirit — Beholderkin', spirit:{name:'Aberrant Spirit (Beholderkin)',type:'Aberration',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:40,hpNote:'40 + 10 per slot above 4th',
            speed:'0 ft., fly 30 ft. (hover)',str:16,dex:10,con:15,int:16,wis:10,cha:6,cr:'—',
            immunities:'Psychic',
            languages:'Deep Speech, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[{name:'Scaling',desc:'AC = 11 + slot level · HP = 40 + 10 × (slot − 4)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Eye Ray',desc:'Ranged Attack: your spell attack modifier to hit, range 150 ft. Hit: 1d8 + 3 + slot level Psychic damage.'},
            ]
          }
        },
        { n:'Aberrant Spirit — Mind Flayer', spirit:{name:'Aberrant Spirit (Mind Flayer)',type:'Aberration',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:40,hpNote:'40 + 10 per slot above 4th',
            speed:'30 ft.',str:16,dex:10,con:15,int:16,wis:10,cha:6,cr:'—',
            immunities:'Psychic',
            languages:'Deep Speech, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Whispering Aura',desc:"At the start of each of the spirit's turns, it emits psionic energy if it doesn't have the Incapacitated condition. WIS save (DC = spell save DC), each creature (other than you) within 5 feet. Failure: 2d6 Psychic damage."},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 40 + 10 × (slot − 4)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Psychic Slam',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 3 + slot level Psychic damage.'},
            ]
          }
        },
        { n:'Aberrant Spirit — Slaad', spirit:{name:'Aberrant Spirit (Slaad)',type:'Aberration',size:'Medium',
            ac:11,acNote:'11 + slot level',hp:40,hpNote:'40 + 10 per slot above 4th',
            speed:'30 ft.',str:16,dex:10,con:15,int:16,wis:10,cha:6,cr:'—',
            immunities:'Psychic',
            languages:'Deep Speech, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Regeneration',desc:'The spirit regains 5 Hit Points at the start of its turn if it has at least 1 Hit Point.'},
              {name:'Scaling',desc:'AC = 11 + slot level · HP = 40 + 10 × (slot − 4)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Claw',desc:"Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d10 + 3 + slot level Slashing. The target can't regain Hit Points until the start of the spirit's next turn."},
            ]
          }
        },
      ]
    },
    { spell:'Summon Construct', level:4, icon:'⚙️', note:'AC/HP scale with slot level',
      creatures:[
        { n:'Construct Spirit — Clay', spirit:{name:'Construct Spirit (Clay)',type:'Construct',size:'Medium',
            ac:13,acNote:'13 + slot level',hp:40,hpNote:'40 + 15 per slot above 4th',
            speed:'30 ft.',str:18,dex:10,con:18,int:14,wis:11,cha:5,cr:'—',
            resistances:'Poison',
            immunities:'Charmed, Exhaustion, Frightened, Paralyzed, Poisoned',
            languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[{name:'Scaling',desc:'AC = 13 + slot level · HP = 40 + 15 × (slot − 4)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Slam attacks equal to half this spell's level (round down)."},
              {name:'Slam',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 4 + slot level Bludgeoning damage.'},
            ],
            reactions:[{name:'Berserk Lashing',desc:'Trigger: The spirit takes damage from a creature. Response: The spirit makes a Slam attack against that creature if possible, or moves up to half its Speed toward that creature without provoking Opportunity Attacks.'}]
          }
        },
        { n:'Construct Spirit — Metal', spirit:{name:'Construct Spirit (Metal)',type:'Construct',size:'Medium',
            ac:13,acNote:'13 + slot level',hp:40,hpNote:'40 + 15 per slot above 4th',
            speed:'30 ft.',str:18,dex:10,con:18,int:14,wis:11,cha:5,cr:'—',
            resistances:'Poison',
            immunities:'Charmed, Exhaustion, Frightened, Paralyzed, Poisoned',
            languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Heated Body',desc:'A creature that hits the spirit with a melee attack or that starts its turn in a grapple with the spirit takes 1d10 Fire damage.'},
              {name:'Scaling',desc:'AC = 13 + slot level · HP = 40 + 15 × (slot − 4)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Slam attacks equal to half this spell's level (round down)."},
              {name:'Slam',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 4 + slot level Bludgeoning damage.'},
            ]
          }
        },
        { n:'Construct Spirit — Stone', spirit:{name:'Construct Spirit (Stone)',type:'Construct',size:'Medium',
            ac:13,acNote:'13 + slot level',hp:40,hpNote:'40 + 15 per slot above 4th',
            speed:'30 ft.',str:18,dex:10,con:18,int:14,wis:11,cha:5,cr:'—',
            resistances:'Poison',
            immunities:'Charmed, Exhaustion, Frightened, Paralyzed, Poisoned',
            languages:'Understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Stony Lethargy',desc:'When a creature starts its turn within 10 feet of the spirit, the spirit can target it with magical energy if the spirit can see it. WIS save (DC = spell save DC), the target. Failure: Until the start of its next turn, the target cannot make Opportunity Attacks, and its Speed is halved.'},
              {name:'Scaling',desc:'AC = 13 + slot level · HP = 40 + 15 × (slot − 4)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of Slam attacks equal to half this spell's level (round down)."},
              {name:'Slam',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 4 + slot level Bludgeoning damage.'},
            ]
          }
        },
      ]
    },
    { spell:'Summon Celestial', level:5, icon:'✨', note:'AC/HP scale with slot level',
      creatures:[
        { n:'Celestial Spirit — Avenger', spirit:{name:'Celestial Spirit (Avenger)',type:'Celestial',size:'Large',
            ac:11,acNote:'11 + slot level',hp:40,hpNote:'40 + 10 per slot above 5th',
            speed:'30 ft., fly 40 ft.',str:16,dex:14,con:16,int:10,wis:14,cha:16,cr:'—',
            resistances:'Radiant',
            immunities:'Charmed, Frightened',
            languages:'Celestial, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 12',
            traits:[{name:'Scaling',desc:'AC = 11 + slot level · HP = 40 + 10 × (slot − 5)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Radiant Bow',desc:'Ranged Attack: your spell attack modifier to hit, range 600 ft. Hit: 2d6 + 2 + slot level Radiant damage.'},
              {name:'Healing Touch (1/Day)',desc:'The spirit touches another creature. The target regains 2d8 + slot level Hit Points.'},
            ]
          }
        },
        { n:'Celestial Spirit — Defender', spirit:{name:'Celestial Spirit (Defender)',type:'Celestial',size:'Large',
            ac:13,acNote:'13 + slot level (11 + 2)',hp:40,hpNote:'40 + 10 per slot above 5th',
            speed:'30 ft., fly 40 ft.',str:16,dex:14,con:16,int:10,wis:14,cha:16,cr:'—',
            resistances:'Radiant',
            immunities:'Charmed, Frightened',
            languages:'Celestial, understands the languages you know',senses:'Darkvision 60 ft., Passive Perception 12',
            traits:[{name:'Scaling',desc:'AC = 13 + slot level · HP = 40 + 10 × (slot − 5)'}],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Radiant Mace',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d10 + 3 + slot level Radiant, and the spirit chooses itself or another creature it can see within 10 feet of the target; the chosen creature gains 1d10 Temporary Hit Points.'},
              {name:'Healing Touch (1/Day)',desc:'The spirit touches another creature. The target regains 2d8 + slot level Hit Points.'},
            ]
          }
        },
      ]
    },
    { spell:'Summon Fiend', level:6, icon:'😈', note:'AC/HP scale with slot level',
      creatures:[
        { n:'Fiendish Spirit — Demon', spirit:{name:'Fiendish Spirit (Demon)',type:'Fiend',size:'Large',
            ac:12,acNote:'12 + slot level',hp:50,hpNote:'50 (Demon) + 15 per slot above 6th',
            speed:'40 ft., climb 40 ft.',str:13,dex:16,con:15,int:10,wis:10,cha:16,cr:'—',
            resistances:'Fire',
            immunities:'Poison; Poisoned',
            languages:'Abyssal, Infernal, Telepathy 60 ft.',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Death Throes',desc:'When the spirit drops to 0 Hit Points or the spell ends, the spirit explodes. DEX save (DC = spell save DC), each creature in a 10-foot Emanation. Failure: 2d10 + slot level Fire damage. Success: Half damage.'},
              {name:'Magic Resistance',desc:'The spirit has Advantage on saving throws against spells and other magical effects.'},
              {name:'Scaling',desc:'AC = 12 + slot level · HP = 50 + 15 × (slot − 6)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Bite',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d12 + 3 + slot level Necrotic damage.'},
            ]
          }
        },
        { n:'Fiendish Spirit — Devil', spirit:{name:'Fiendish Spirit (Devil)',type:'Fiend',size:'Large',
            ac:12,acNote:'12 + slot level',hp:40,hpNote:'40 (Devil) + 15 per slot above 6th',
            speed:'40 ft., fly 60 ft.',str:13,dex:16,con:15,int:10,wis:10,cha:16,cr:'—',
            resistances:'Fire',
            immunities:'Poison; Poisoned',
            languages:'Abyssal, Infernal, Telepathy 60 ft.',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:"Devil's Sight",desc:"Magical Darkness doesn't impede the spirit's Darkvision."},
              {name:'Magic Resistance',desc:'The spirit has Advantage on saving throws against spells and other magical effects.'},
              {name:'Scaling',desc:'AC = 12 + slot level · HP = 40 + 15 × (slot − 6)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Fiery Strike',desc:'Melee or Ranged Attack: your spell attack modifier to hit, reach 5 ft. or range 150 ft. Hit: 2d6 + 3 + slot level Fire damage.'},
            ]
          }
        },
        { n:'Fiendish Spirit — Yugoloth', spirit:{name:'Fiendish Spirit (Yugoloth)',type:'Fiend',size:'Large',
            ac:12,acNote:'12 + slot level',hp:60,hpNote:'60 (Yugoloth) + 15 per slot above 6th',
            speed:'40 ft.',str:13,dex:16,con:15,int:10,wis:10,cha:16,cr:'—',
            resistances:'Fire',
            immunities:'Poison; Poisoned',
            languages:'Abyssal, Infernal, Telepathy 60 ft.',senses:'Darkvision 60 ft., Passive Perception 10',
            traits:[
              {name:'Magic Resistance',desc:'The spirit has Advantage on saving throws against spells and other magical effects.'},
              {name:'Scaling',desc:'AC = 12 + slot level · HP = 60 + 15 × (slot − 6)'},
            ],
            actions:[
              {name:'Multiattack',desc:"The spirit makes a number of attacks equal to half this spell's level (round down)."},
              {name:'Claws',desc:'Melee Attack: your spell attack modifier to hit, reach 5 ft. Hit: 1d8 + 3 + slot level Slashing. Immediately after the attack hits or misses, the spirit can teleport up to 30 feet to an unoccupied space it can see.'},
            ]
          }
        },
      ]
    },
  ];

  function _renderSummons() {
    const el = document.getElementById('comp-summons-list');
    if (!el) return;
    const frag = document.createDocumentFragment();
    SUMMON_SPELLS.forEach((grp, gi) => {
      const div = document.createElement('div');
      div.className = 'summon-group';
      const noteHtml = grp.note ? `<span class="summon-group-note">${grp.note}</span>` : '';
      const chipsHtml = grp.creatures.map((c, ci) => {
        const spiritBadge = c.spirit ? '<span class="summon-spirit-badge">esprit</span>' : '';
        return `<button class="summon-chip" data-sg="${gi}" data-sc="${ci}" title="${c.n}">
          <span class="summon-chip-icon">${grp.icon}</span>${c.n}${spiritBadge}
        </button>`;
      }).join('');
      div.innerHTML = `
        <div class="summon-group-hd">
          <span class="summon-group-lvl">Niv.${grp.level}</span>
          <span class="summon-group-name">${grp.spell}</span>
          ${noteHtml}
        </div>
        <div class="summon-chips">${chipsHtml}</div>`;
      frag.appendChild(div);
    });
    el.innerHTML = '';
    el.appendChild(frag);
  }

  function _toggleSummons(force) {
    _summonsMode = force !== undefined ? force : !_summonsMode;
    const btn     = document.getElementById('btn-comp-summons');
    const listEl  = document.getElementById('comp-summons-list');
    const mainEl  = document.getElementById('compendium-list');
    if (btn) btn.classList.toggle('active', _summonsMode);
    if (_summonsMode) {
      if (mainEl) mainEl.style.display = 'none';
      if (listEl) { listEl.style.display = ''; _renderSummons(); }
    } else {
      if (mainEl) mainEl.style.display = '';
      if (listEl) listEl.style.display = 'none';
      _loadTab('monsters');
    }
  }

  // Import d'un esprit scalant inline
  function _addSpiritAsFamiliar(s) {
    if (!playerData) return;
    const c = C();
    if (!c.familiars) c.familiars = [];
    const toList = arr => (arr||[]).map(x => ({name:x.name||'',desc:x.desc||''}));
    c.familiars.push({
      name: s.name, type: s.type, size: s.size, alignment: 'Neutre',
      ac: s.ac, acNote: s.acNote || '',
      pvMax: s.hp, pvActuel: s.hp, speed: s.speed,
      for: s.str||10, dex: s.dex||10, con: s.con||10, int: s.int||10, sag: s.wis||10, cha: s.cha||10,
      savesNote:'', skillsNote:'', vulnerabilities: s.vulnerabilities||'',
      resistances: s.resistances||'', immunities: s.immunities||'',
      senses: s.senses||'', languages: s.languages||'—', cr: s.cr||'?',
      traits: toList(s.traits), actions: toList(s.actions),
      bonusActions: toList(s.bonus_actions), reactions: toList(s.reactions),
      notes: `⚠️ ${s.acNote||''} · ${s.hpNote||''}`, _collapsed: false,
    });
    if (typeof _tabDirty !== 'undefined') _tabDirty.familiers = true;
    renderFamiliars(); triggerSave();
    document.querySelector('.tab-btn[data-tab="familiers"]')?.click();
  }

  // Listener : clic sur un chip d'invocation
  document.addEventListener('click', async e => {
    const chip = e.target.closest('.summon-chip');
    if (!chip) return;
    const gi = parseInt(chip.dataset.sg);
    const ci = parseInt(chip.dataset.sc);
    const grp = SUMMON_SPELLS[gi];
    if (!grp) return;
    const creature = grp.creatures[ci];
    if (!creature) return;

    chip.classList.add('importing');
    chip.textContent = '…';

    try {
      if (creature.spirit) {
        // Stat block inline
        _addSpiritAsFamiliar(creature.spirit);
        chip.classList.remove('importing');
        chip.classList.add('done');
        chip.textContent = '✓ ' + creature.n;
        setTimeout(() => { chip.classList.remove('done'); chip.innerHTML = `<span class="summon-chip-icon">${grp.icon}</span>${creature.n}<span class="summon-spirit-badge">esprit</span>`; }, 2500);
      } else {
        // Fetch depuis Open5e — v1 (slug simple, endpoint stable)
        let data = null;
        const rv1 = await fetch(`${O5E}/v1/monsters/${creature.k}/`).catch(() => null);
        if (rv1?.ok) {
          data = await rv1.json();
        } else {
          // Fallback : recherche par nom en v2
          const rname = await fetch(`${O5E}/v2/creatures/?name=${encodeURIComponent(creature.n)}&limit=1`).catch(() => null);
          if (rname?.ok) {
            const js = await rname.json();
            data = (js.results || [])[0] || null;
          }
        }
        if (!data) throw new Error(`Not found: ${creature.k}`);
        _addMonsterAsFamiliar(data);
        chip.classList.remove('importing');
        chip.classList.add('done');
        chip.textContent = '✓ ' + creature.n;
        setTimeout(() => { chip.classList.remove('done'); chip.innerHTML = `<span class="summon-chip-icon">${grp.icon}</span>${creature.n}`; }, 2500);
      }
    } catch {
      chip.classList.remove('importing');
      chip.textContent = '✗ Erreur';
      setTimeout(() => { chip.innerHTML = `<span class="summon-chip-icon">${grp.icon}</span>${creature.n}`; }, 2000);
    }
  });

  /* ── Équipement de départ 2024 (PHB) ── */
  const STARTING_EQUIP = {
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

  // Normalise le nom de classe vers la clé de STARTING_EQUIP
  function _matchClass(rawClass) {
    if (!rawClass) return null;
    const low = rawClass.toLowerCase().trim();
    return Object.keys(STARTING_EQUIP).find(k => k.toLowerCase() === low || low.startsWith(k.toLowerCase())) || null;
  }

  let _seSelectedIdx = 0;

  function _renderStartingEquip() {
    const panel = document.getElementById('comp-startequip-panel');
    if (!panel) return;
    const cls = playerData ? _matchClass(C().classe) : null;
    const options = cls ? STARTING_EQUIP[cls] : null;

    if (!options) {
      panel.innerHTML = `<div class="comp-se-title">Équipement de départ 2024</div>
        <p class="comp-se-note">Classe non reconnue — renseignez votre classe dans l'onglet Personnage pour voir les options.</p>`;
      return;
    }

    _seSelectedIdx = Math.min(_seSelectedIdx, options.length - 1);

    const optHtml = options.map((opt, i) => {
      const itemLines = opt.items.map(it => `<span>${it.qty > 1 ? it.qty + '× ' : ''}${it.name}</span>`).join('<br>');
      const goldLine = opt.gold ? `<span>${opt.gold} PO</span>` : '';
      const content = [itemLines, goldLine].filter(Boolean).join('<br>');
      return `<div class="comp-se-option${i === _seSelectedIdx ? ' selected' : ''}" data-se-opt="${i}">
        <div class="comp-se-opt-label">${opt.label}</div>
        <div class="comp-se-opt-items">${content || '<em>Or uniquement</em>'}</div>
      </div>`;
    }).join('');

    panel.innerHTML = `
      <div class="comp-se-title">⚔️ Équipement de départ — ${cls}</div>
      <div class="comp-se-options">${optHtml}</div>
      <div class="comp-se-footer">
        <button class="comp-se-apply" id="btn-se-apply">Appliquer l'option ${options[_seSelectedIdx]?.label?.split(' ')[1] || ''}</button>
        <span class="comp-se-note">Ajoute les items à l'inventaire et l'or au personnage.</span>
      </div>`;
  }

  function _applyStartingEquip() {
    if (!playerData) return;
    const cls = _matchClass(C().classe);
    if (!cls) return;
    const opt = STARTING_EQUIP[cls]?.[_seSelectedIdx];
    if (!opt) return;

    // Ajouter les items
    if (!INV().items) INV().items = [];
    opt.items.forEach(it => { INV().items.push({ qty: it.qty, name: it.name, notes: 'Équip. départ' }); });

    // Ajouter l'or
    if (opt.gold) {
      const current = parseFloat(C().gold) || 0;
      C().gold = String(Math.round((current + opt.gold) * 100) / 100);
      const goldEl = document.getElementById('char-gold');
      if (goldEl) goldEl.value = C().gold;
    }

    renderInventory();
    triggerSave();

    const btn = document.getElementById('btn-se-apply');
    if (btn) { btn.textContent = '✓ Appliqué !'; btn.disabled = true; setTimeout(() => { btn.textContent = `Appliquer l'option ${STARTING_EQUIP[cls][_seSelectedIdx]?.label?.split(' ')[1] || ''}`; btn.disabled = false; }, 2500); }
  }

  // Toggle du panneau
  document.addEventListener('click', e => {
    if (e.target.closest('#btn-startequip')) {
      const panel = document.getElementById('comp-startequip-panel');
      const btn   = document.getElementById('btn-startequip');
      const isOpen = panel.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      if (isOpen) _renderStartingEquip();
      return;
    }
    // Sélection d'une option
    const optEl = e.target.closest('[data-se-opt]');
    if (optEl) {
      _seSelectedIdx = parseInt(optEl.dataset.seOpt);
      _renderStartingEquip();
      return;
    }
    // Appliquer
    if (e.target.id === 'btn-se-apply') {
      _applyStartingEquip();
    }
  });
})();
