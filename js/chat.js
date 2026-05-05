/* ============================================================
   KALEYSUR — Chat Widget
   Supabase Realtime broadcast + presence (sans table DB)
   ============================================================ */
(function () {
  'use strict';

  const SB_URL  = 'https://hevwgdsvgepiieuvhclg.supabase.co';
  const SB_KEY  = 'sb_publishable_TDTCogCSFP-Lvus2x3rAAg_60l036tq';
  const ME      = localStorage.getItem('kaleysur_user');
  if (!ME) return;

  /* ── État ──────────────────────────────────────────────── */
  let sb            = null;
  let globalChan    = null;
  let dmChan        = null;
  let onlineUsers   = new Set();
  let groupMsgs     = [];
  let dmConvs       = {};   // { peer: [{from,to,text,ts}] }
  let activePeer    = null;
  let unreadGroup   = 0;
  let unreadDm      = {};   // { peer: count }
  let panelOpen     = false;
  let activeTab     = 'group';

  /* ── Bootstrap ─────────────────────────────────────────── */
  function boot() {
    if (window.__supabase_loaded) { setup(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
    s.onload  = () => { window.__supabase_loaded = true; setup(); };
    s.onerror = () => console.warn('[Kaleysur Chat] Impossible de charger Supabase SDK');
    document.head.appendChild(s);
  }

  function setup() {
    sb = window.supabase.createClient(SB_URL, SB_KEY);
    buildDOM();
    wireEvents();
    connectChannels();
  }

  /* ── DOM ────────────────────────────────────────────────── */
  function buildDOM() {
    const w = document.createElement('div');
    w.id = 'klc';
    w.innerHTML = `
<button id="klc-btn" aria-label="Chat">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
  </svg>
  <span id="klc-badge"></span>
</button>

<div id="klc-panel">
  <div class="klc-header">
    <div class="klc-tabs">
      <button class="klc-tab klc-tab-on" data-tab="group">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
        </svg>
        Groupe
      </button>
      <button class="klc-tab" data-tab="dm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
        </svg>
        Privé
        <span id="klc-dm-badge"></span>
      </button>
    </div>
    <button id="klc-close" aria-label="Fermer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <!-- Groupe -->
  <div id="klc-pgroup" class="klc-pane">
    <div id="klc-gmsgs" class="klc-msgs" role="log" aria-live="polite"></div>
    <div class="klc-inputrow">
      <input id="klc-ginput" type="text" placeholder="Message au groupe…" maxlength="400" autocomplete="off">
      <button id="klc-gsend">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Privé -->
  <div id="klc-pdm" class="klc-pane klc-hidden">
    <!-- Liste utilisateurs -->
    <div id="klc-ulist">
      <div class="klc-section-lbl">En ligne</div>
      <div id="klc-online"></div>
      <div class="klc-section-lbl klc-section-lbl2">Récents</div>
      <div id="klc-recent"></div>
    </div>
    <!-- Conversation -->
    <div id="klc-conv" class="klc-hidden">
      <div class="klc-conv-hd">
        <button id="klc-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>
        </button>
        <span id="klc-peer"></span>
        <span id="klc-peer-dot"></span>
      </div>
      <div id="klc-dmsgs" class="klc-msgs" role="log" aria-live="polite"></div>
      <div class="klc-inputrow">
        <input id="klc-dminput" type="text" placeholder="Message privé…" maxlength="400" autocomplete="off">
        <button id="klc-dmsend">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(w);
  }

  /* ── Events ─────────────────────────────────────────────── */
  function wireEvents() {
    $('klc-btn').addEventListener('click', togglePanel);
    $('klc-close').addEventListener('click', closePanel);
    document.querySelectorAll('.klc-tab').forEach(b =>
      b.addEventListener('click', () => switchTab(b.dataset.tab)));

    $('klc-gsend').addEventListener('click', sendGroup);
    $('klc-ginput').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendGroup(); }
    });

    $('klc-dmsend').addEventListener('click', sendDM);
    $('klc-dminput').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendDM(); }
    });

    $('klc-back').addEventListener('click', () => {
      activePeer = null;
      $('klc-conv').classList.add('klc-hidden');
      $('klc-ulist').classList.remove('klc-hidden');
    });
  }

  /* ── Supabase Realtime ──────────────────────────────────── */
  function connectChannels() {
    /* Canal global — messages groupe + présence */
    globalChan = sb.channel('kaleysur-global', {
      config: {
        broadcast: { self: false },
        presence:  { key: ME }
      }
    });
    globalChan
      .on('broadcast', { event: 'gmsg' }, ({ payload }) => {
        pushGroupMsg(payload, false);
      })
      .on('presence', { event: 'sync' }, () => {
        onlineUsers = new Set();
        Object.values(globalChan.presenceState()).forEach(arr =>
          arr.forEach(p => { if (p.u && p.u !== ME) onlineUsers.add(p.u); })
        );
        renderOnline();
        renderRecent();
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await globalChan.track({ u: ME });
          sysMsg('klc-gmsgs', '✦ Connecté au chat de groupe ✦');
        }
      });

    /* Canal DM — tous les messages privés */
    dmChan = sb.channel('kaleysur-dms', {
      config: { broadcast: { self: false } }
    });
    dmChan
      .on('broadcast', { event: 'dm' }, ({ payload }) => {
        const { from, to, text, ts } = payload;
        if (to !== ME) return;
        if (!dmConvs[from]) dmConvs[from] = [];
        dmConvs[from].push({ from, to, text, ts });
        if (activePeer === from && panelOpen && activeTab === 'dm') {
          renderDmMsgs(from);
        } else {
          unreadDm[from] = (unreadDm[from] || 0) + 1;
          updateBadge();
        }
        renderRecent();
      })
      .subscribe();
  }

  /* ── Groupe ─────────────────────────────────────────────── */
  function sendGroup() {
    const inp = $('klc-ginput');
    const text = inp.value.trim();
    if (!text || !globalChan) return;
    inp.value = '';
    const msg = { user: ME, text, ts: Date.now() };
    pushGroupMsg(msg, true);
    globalChan.send({ type: 'broadcast', event: 'gmsg', payload: msg });
  }

  function pushGroupMsg(msg, mine) {
    groupMsgs.push(msg);
    if (groupMsgs.length > 150) groupMsgs.shift();
    const c = $('klc-gmsgs');
    c.appendChild(msgEl(msg.user, msg.text, msg.ts, mine));
    c.scrollTop = c.scrollHeight;
    if (!panelOpen || activeTab !== 'group') { unreadGroup++; updateBadge(); }
  }

  /* ── DM ─────────────────────────────────────────────────── */
  function openDM(peer) {
    activePeer = peer;
    $('klc-peer').textContent = peer;
    $('klc-peer-dot').innerHTML = onlineUsers.has(peer)
      ? '<span class="klc-dot klc-dot-on"></span>'
      : '<span class="klc-dot"></span>';
    $('klc-ulist').classList.add('klc-hidden');
    $('klc-conv').classList.remove('klc-hidden');
    unreadDm[peer] = 0;
    updateBadge();
    renderDmMsgs(peer);
    setTimeout(() => $('klc-dminput').focus(), 50);
  }

  function sendDM() {
    if (!activePeer || !dmChan) return;
    const inp = $('klc-dminput');
    const text = inp.value.trim();
    if (!text) return;
    inp.value = '';
    const msg = { from: ME, to: activePeer, text, ts: Date.now() };
    if (!dmConvs[activePeer]) dmConvs[activePeer] = [];
    dmConvs[activePeer].push(msg);
    renderDmMsgs(activePeer);
    renderRecent();
    dmChan.send({ type: 'broadcast', event: 'dm', payload: msg });
  }

  function renderDmMsgs(peer) {
    const c = $('klc-dmsgs');
    const msgs = dmConvs[peer] || [];
    c.innerHTML = '';
    if (!msgs.length) {
      c.innerHTML = '<div class="klc-empty">Commencez la conversation…</div>';
      return;
    }
    msgs.forEach(m => c.appendChild(msgEl(m.from, m.text, m.ts, m.from === ME)));
    c.scrollTop = c.scrollHeight;
  }

  /* ── Présence ────────────────────────────────────────────── */
  function renderOnline() {
    const c = $('klc-online');
    const users = [...onlineUsers];
    if (!users.length) {
      c.innerHTML = '<div class="klc-empty">Personne d\'autre en ligne.</div>';
      return;
    }
    c.innerHTML = users.map(u => userBtn(u, true)).join('');
    c.querySelectorAll('.klc-ubtn').forEach(b =>
      b.addEventListener('click', () => openDM(b.dataset.u)));
  }

  function renderRecent() {
    const c = $('klc-recent');
    const peers = Object.keys(dmConvs);
    if (!peers.length) { c.innerHTML = ''; return; }
    peers.sort((a, b) => (dmConvs[b].at(-1)?.ts || 0) - (dmConvs[a].at(-1)?.ts || 0));
    c.innerHTML = peers.map(u => userBtn(u, onlineUsers.has(u), dmConvs[u].at(-1)?.text)).join('');
    c.querySelectorAll('.klc-ubtn').forEach(b =>
      b.addEventListener('click', () => openDM(b.dataset.u)));
  }

  function userBtn(u, online, preview) {
    const ud = unreadDm[u] || 0;
    return `<button class="klc-ubtn" data-u="${esc(u)}">
      <span class="klc-dot ${online ? 'klc-dot-on' : ''}"></span>
      <span class="klc-uname">${esc(u)}</span>
      ${preview ? `<span class="klc-preview">${esc(trunc(preview, 20))}</span>` : ''}
      ${ud ? `<span class="klc-ubadge">${ud}</span>` : ''}
    </button>`;
  }

  /* ── UI ─────────────────────────────────────────────────── */
  function togglePanel() {
    panelOpen ? closePanel() : openPanel();
  }
  function openPanel() {
    panelOpen = true;
    $('klc-panel').classList.add('klc-open');
    if (activeTab === 'group') { unreadGroup = 0; }
    if (activeTab === 'dm' && activePeer) { unreadDm[activePeer] = 0; }
    updateBadge();
    setTimeout(() => {
      const msgs = $(activeTab === 'group' ? 'klc-gmsgs' : 'klc-dmsgs');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
      const inp = $(activeTab === 'group' ? 'klc-ginput' : (activePeer ? 'klc-dminput' : null));
      if (inp) inp.focus();
    }, 60);
  }
  function closePanel() {
    panelOpen = false;
    $('klc-panel').classList.remove('klc-open');
  }

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.klc-tab').forEach(b =>
      b.classList.toggle('klc-tab-on', b.dataset.tab === tab));
    $('klc-pgroup').classList.toggle('klc-hidden', tab !== 'group');
    $('klc-pdm').classList.toggle('klc-hidden', tab !== 'dm');
    if (tab === 'group') {
      unreadGroup = 0;
      updateBadge();
      const m = $('klc-gmsgs'); if (m) m.scrollTop = m.scrollHeight;
      $('klc-ginput').focus();
    } else {
      renderOnline();
      renderRecent();
    }
  }

  function updateBadge() {
    const dmTotal = Object.values(unreadDm).reduce((a, b) => a + b, 0);
    const total   = unreadGroup + dmTotal;
    const b = $('klc-badge');
    b.textContent = total > 99 ? '99+' : total || '';
    b.style.display = total ? 'flex' : 'none';
    const db = $('klc-dm-badge');
    if (db) { db.textContent = dmTotal || ''; db.style.display = dmTotal ? 'flex' : 'none'; }
    // Petite animation sur le bouton si nouveau message et panel fermé
    if (total && !panelOpen) $('klc-btn').classList.add('klc-btn-ping');
    else $('klc-btn').classList.remove('klc-btn-ping');
  }

  /* ── Helpers ────────────────────────────────────────────── */
  function msgEl(author, text, ts, mine) {
    const d = document.createElement('div');
    d.className = 'klc-msg ' + (mine ? 'klc-mine' : 'klc-theirs');
    const t = new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    d.innerHTML =
      (!mine ? `<div class="klc-author">${esc(author)}</div>` : '') +
      `<div class="klc-bubble">${esc(text)}</div>` +
      `<div class="klc-time">${t}</div>`;
    return d;
  }

  function sysMsg(cid, text) {
    const c = $(cid);
    if (!c) return;
    const d = document.createElement('div');
    d.className = 'klc-sys';
    d.textContent = text;
    c.appendChild(d);
  }

  function $(id)       { return document.getElementById(id); }
  function esc(s)      { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function trunc(s, n) { return s && s.length > n ? s.slice(0, n) + '…' : s || ''; }

  /* ── Start ───────────────────────────────────────────────── */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
