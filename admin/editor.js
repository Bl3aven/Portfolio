/**
 * Visual content editor — tournayre.ovh
 * Loaded only when ?edit=1 is present in the URL.
 */
(function () {
  'use strict';

  // ── Editable elements & SEO fields ─────────────────────────────────────────
  const EDIT_MAP = [
    { key: 'hero.title',   sel: 'header .hero h1',    label: 'Hero — titre principal', html: true },
    { key: 'hero.desc',    sel: 'header .hero p',      label: 'Hero — sous-titre / tagline' },
    { key: 'hero.cta',     sel: '.hero-btn-primary',   label: 'Hero — bouton principal' },
    { key: 'hero.cv',      sel: '.hero-btn-ghost',     label: 'Hero — bouton CV' },
    { key: 'about.text',   sel: '#about .about-text',  label: 'Section About — paragraphe' },
    { key: 'contact.text', sel: '#contact .contact p', label: 'Section Contact — texte' },
  ];

  const SEO_MAP = [
    { key: 'meta.description',    label: 'Meta description (snippet Google)' },
    { key: 'meta.og.description', label: 'OG description (partage réseaux sociaux)' },
  ];

  // Default values (fallback when no override exists)
  const DEFAULTS = {
    'meta.description':    { fr: 'Mathys Tournayre — Alternant ingénieur ISEN chez Oxeegen France. DevOps, Cloud, IA locale, infrastructure & automatisation.', en: 'DevOps, Cloud & AI Engineer. I design modern, automated and secure platforms for cloud and enterprise environments. Explore my projects and CV.' },
    'meta.og.description': { fr: 'Découvrez mon portfolio DevOps, Cloud & IA : automatisation, sécurité, CI/CD, infrastructures modernes et IA locale.', en: 'Discover my DevOps, Cloud & AI portfolio: automation, security, CI/CD, modern infrastructure and local AI.' },
    'hero.title':   { fr: 'DevOps, Cloud & <span>IA Engineer</span>', en: 'DevOps, Cloud & <span>AI Engineer</span>' },
    'hero.desc':    { fr: 'Je conçois des plateformes modernes, automatisées et sécurisées pour les environnements cloud et professionnels.', en: 'I design modern, automated and secure platforms for cloud and enterprise environments.' },
    'hero.cta':     { fr: 'Explorer mes projets', en: 'Explore my projects' },
    'hero.cv':      { fr: 'Voir le CV →', en: 'View CV →' },
    'about.text':   { fr: 'Alternant ingénieur ISEN chez Oxeegen France, spécialisé en automatisation, infrastructure moderne, DevOps et IA locale. Je conçois des systèmes fiables, maintenables et sécurisés, avec une approche orientée production : documentation, monitoring, durcissement, automatisation des opérations et intégration raisonnée d\'outils IA.', en: 'ISEN engineering apprentice at Oxeegen France, specialized in automation, modern infrastructure, DevOps and local AI. I design reliable, maintainable and secure systems with a production-oriented approach: documentation, monitoring, hardening, operations automation and thoughtful integration of AI tools.' },
    'contact.text': { fr: 'Ouvert aux opportunités professionnelles Cloud, DevOps, infrastructure & IA locale.', en: 'Open to professional opportunities in Cloud, DevOps, infrastructure & local AI.' },
  };

  // ── State ───────────────────────────────────────────────────────────────────
  const changes = {}; // { key: { fr: 'val', en: 'val' } }

  function getVal(key, lang) {
    const ov = window.__contentOverrides || {};
    if (ov[key] && ov[key][lang] !== undefined) return ov[key][lang];
    return (DEFAULTS[key] && DEFAULTS[key][lang]) || '';
  }

  function setChange(key, lang, val) {
    if (!changes[key]) changes[key] = {};
    changes[key][lang] = val;
    refreshBadge();
    markDirty(key);
  }

  function countChanges() {
    return Object.values(changes).reduce((n, v) => {
      return n + (v.fr !== undefined ? 1 : 0) + (v.en !== undefined ? 1 : 0);
    }, 0);
  }

  function markDirty(key) {
    EDIT_MAP.forEach(d => {
      if (d.key !== key) return;
      const el = document.querySelector(d.sel);
      if (el) el.setAttribute('data-edit-dirty', '1');
    });
  }

  // ── Auth preflight ──────────────────────────────────────────────────────────
  function checkAuth(cb) {
    fetch('/admin/api.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check' })
    })
    .then(r => r.json())
    .then(d => {
      if (d.ok) cb();
      else window.location.href = '/admin/?redirect=' + encodeURIComponent(location.href);
    })
    .catch(() => window.location.href = '/admin/');
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  function injectStyles() {
    const css = `
/* ── Editor toolbar ── */
#__editbar{
  position:fixed;top:0;left:0;right:0;z-index:99999;height:48px;
  background:rgba(8,8,11,.97);border-bottom:1px solid rgba(255,140,66,.28);
  backdrop-filter:blur(14px);display:flex;align-items:center;
  gap:.6rem;padding:0 1.2rem;font-family:Inter,-apple-system,sans-serif;font-size:13px;
}
#__editbar *{box-sizing:border-box}
.__eb-badge{
  background:rgba(255,140,66,.12);color:#ff8c42;
  border:1px solid rgba(255,140,66,.3);padding:.18rem .65rem;
  border-radius:5px;font-size:.66rem;font-weight:700;letter-spacing:.08em;white-space:nowrap;
}
.__eb-sep{width:1px;height:22px;background:rgba(255,255,255,.08);margin:0 .15rem}
.__eb-lang{display:flex;gap:.25rem}
.__eb-lang button{
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
  color:rgba(255,255,255,.45);padding:.2rem .55rem;border-radius:5px;
  cursor:pointer;font-size:.7rem;font-family:inherit;transition:all .15s;
}
.__eb-lang button.active{
  background:rgba(255,140,66,.12);color:#ff8c42;border-color:rgba(255,140,66,.35);
}
.__eb-sp{flex:1}
#__eb-count{color:rgba(255,140,66,.7);font-size:.72rem;font-weight:600}
.__eb-btn{
  background:transparent;border:1px solid rgba(255,255,255,.12);
  color:rgba(255,255,255,.5);padding:.26rem .8rem;border-radius:6px;
  cursor:pointer;font-size:.72rem;font-family:inherit;transition:all .15s;white-space:nowrap;
}
.__eb-btn:hover{border-color:rgba(255,255,255,.28);color:#eaeaec}
.__eb-btn.primary{background:rgba(255,140,66,.1);color:#ff8c42;border-color:rgba(255,140,66,.3)}
.__eb-btn.primary:hover{background:rgba(255,140,66,.2);border-color:rgba(255,140,66,.6)}
.__eb-btn:disabled{opacity:.4;cursor:not-allowed}
.__eb-btn.exit-btn{color:rgba(255,107,107,.65);border-color:rgba(255,107,107,.18)}
.__eb-btn.exit-btn:hover{color:#ff6b6b;border-color:rgba(255,107,107,.45)}

/* ── Editable elements ── */
body.__edit-mode{padding-top:48px !important}
[data-edit-key]{
  outline:1px dashed rgba(255,140,66,.3) !important;
  outline-offset:5px !important;
  cursor:pointer !important;
}
[data-edit-key]:hover{
  outline:2px dashed rgba(255,140,66,.65) !important;
  outline-offset:5px !important;
  background:rgba(255,140,66,.04) !important;
}
[data-edit-key][data-edit-dirty]{
  outline:2px solid rgba(255,140,66,.75) !important;
  outline-offset:5px !important;
}

/* ── Edit modal ── */
#__modal-bg{
  position:fixed;inset:0;z-index:999998;
  background:rgba(0,0,0,.65);backdrop-filter:blur(5px);
  display:flex;align-items:center;justify-content:center;padding:1rem;
}
#__modal{
  background:#0e0e12;border:1px solid rgba(255,255,255,.1);
  border-radius:14px;width:100%;max-width:600px;
  max-height:88vh;overflow-y:auto;
  box-shadow:0 28px 70px rgba(0,0,0,.75);
  font-family:Inter,-apple-system,sans-serif;
}
.__m-head{
  display:flex;align-items:center;padding:1rem 1.3rem .8rem;
  border-bottom:1px solid rgba(255,255,255,.08);gap:.6rem;
}
.__m-title{font-size:.85rem;font-weight:600;color:#eaeaec}
.__m-key{
  font-size:.65rem;background:rgba(255,255,255,.06);color:rgba(255,255,255,.35);
  padding:.1rem .4rem;border-radius:4px;font-family:'JetBrains Mono',monospace;
}
.__m-close{
  margin-left:auto;background:none;border:none;color:rgba(255,255,255,.4);
  font-size:1.1rem;cursor:pointer;padding:.2rem .4rem;line-height:1;transition:color .15s;
}
.__m-close:hover{color:#eaeaec}
.__m-body{padding:1.1rem 1.3rem}
.__m-html-note{
  font-size:.68rem;color:rgba(255,255,255,.3);margin-bottom:.85rem;
  background:rgba(255,255,255,.04);padding:.45rem .7rem;border-radius:6px;
}
.__m-lang-row{
  display:flex;align-items:center;gap:.5rem;
  font-size:.7rem;font-weight:600;letter-spacing:.06em;
  color:rgba(255,255,255,.4);margin-bottom:.4rem;margin-top:.85rem;
}
.__m-lang-row:first-child{margin-top:0}
.__m-ta{
  width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
  border-radius:8px;color:#eaeaec;font-family:inherit;font-size:.82rem;
  padding:.65rem .85rem;outline:none;resize:vertical;min-height:72px;line-height:1.6;
  transition:border-color .2s;
}
.__m-ta:focus{border-color:rgba(255,140,66,.45)}
.__m-footer{
  display:flex;justify-content:flex-end;gap:.5rem;
  padding:.8rem 1.3rem;border-top:1px solid rgba(255,255,255,.08);
}

/* ── SEO drawer ── */
#__seo-drawer{
  position:fixed;top:48px;right:0;bottom:0;z-index:99997;
  width:360px;background:#0c0c10;
  border-left:1px solid rgba(255,255,255,.09);
  transform:translateX(100%);transition:transform .28s cubic-bezier(.16,1,.3,1);
  overflow-y:auto;padding:1.3rem;
  font-family:Inter,-apple-system,sans-serif;
}
#__seo-drawer.open{transform:translateX(0)}
.__sd-head{
  font-size:.65rem;font-weight:700;letter-spacing:.12em;color:#ff8c42;
  text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.07);
  padding-bottom:.6rem;margin-bottom:1.1rem;
}
.__sd-field{margin-bottom:1.2rem}
.__sd-label{font-size:.7rem;color:rgba(255,255,255,.4);margin-bottom:.35rem;font-weight:500}
.__sd-save{
  width:100%;margin-top:.5rem;padding:.55rem;
  background:rgba(255,140,66,.1);color:#ff8c42;border:1px solid rgba(255,140,66,.28);
  border-radius:7px;font-size:.78rem;font-weight:600;cursor:pointer;font-family:inherit;
  transition:all .2s;
}
.__sd-save:hover{background:rgba(255,140,66,.2)}

/* ── Toast ── */
#__toast{
  position:fixed;bottom:1.5rem;left:50%;
  transform:translateX(-50%) translateY(64px);z-index:999999;
  background:#111115;border:1px solid rgba(54,211,153,.3);
  color:#36d399;font-family:Inter,sans-serif;font-size:.78rem;font-weight:500;
  padding:.55rem 1.2rem;border-radius:8px;white-space:nowrap;
  transition:transform .3s ease,opacity .3s ease;opacity:0;pointer-events:none;
}
#__toast.show{transform:translateX(-50%) translateY(0);opacity:1}
#__toast.err{border-color:rgba(255,107,107,.3);color:#ff6b6b}
    `;
    const s = document.createElement('style');
    s.id = '__editstyles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ── Toolbar ─────────────────────────────────────────────────────────────────
  function buildToolbar() {
    const bar = document.createElement('div');
    bar.id = '__editbar';
    bar.innerHTML = `
      <span class="__eb-badge">✏ EDIT MODE</span>
      <div class="__eb-sep"></div>
      <div class="__eb-lang">
        <button data-lang="fr">🇫🇷 FR</button>
        <button data-lang="en">🇬🇧 EN</button>
      </div>
      <div class="__eb-sep"></div>
      <button id="__eb-seo" class="__eb-btn">SEO / Meta</button>
      <div class="__eb-sp"></div>
      <span id="__eb-count" style="display:none"></span>
      <button id="__eb-save" class="__eb-btn primary">✓ Sauvegarder</button>
      <button id="__eb-exit" class="__eb-btn exit-btn">✕ Quitter</button>
    `;
    document.body.insertAdjacentElement('afterbegin', bar);
    document.body.classList.add('__edit-mode');

    // Language toggle — sync with current i18n lang
    const curLang = (window.__i18n && window.__i18n.lang) || 'fr';
    bar.querySelector(`[data-lang="${curLang}"]`).classList.add('active');

    bar.querySelectorAll('.__eb-lang button').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.__eb-lang button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (window.__i18n) window.__i18n.lang = btn.dataset.lang;
      });
    });

    document.getElementById('__eb-seo').addEventListener('click', toggleSEO);
    document.getElementById('__eb-save').addEventListener('click', saveAll);
    document.getElementById('__eb-exit').addEventListener('click', () => {
      if (countChanges() && !confirm('Des modifications non sauvegardées seront perdues. Quitter quand même ?')) return;
      window.location.href = '/';
    });
  }

  function refreshBadge() {
    const n = countChanges();
    const el = document.getElementById('__eb-count');
    if (!el) return;
    el.style.display = n ? '' : 'none';
    el.textContent = n + ' modification' + (n > 1 ? 's' : '');
  }

  // ── SEO drawer ──────────────────────────────────────────────────────────────
  function buildSEODrawer() {
    const d = document.createElement('div');
    d.id = '__seo-drawer';
    let html = `<div class="__sd-head">SEO &amp; Meta</div>`;
    SEO_MAP.forEach(def => {
      const k = def.key.replace(/\./g, '_');
      html += `
        <div class="__sd-field">
          <div class="__sd-label">${def.label}</div>
          <div class="__m-lang-row" style="margin-top:0">🇫🇷 FR</div>
          <textarea class="__m-ta" rows="3" data-seo="${def.key}" data-lang="fr">${esc(getVal(def.key,'fr'))}</textarea>
          <div class="__m-lang-row">🇬🇧 EN</div>
          <textarea class="__m-ta" rows="3" data-seo="${def.key}" data-lang="en">${esc(getVal(def.key,'en'))}</textarea>
        </div>`;
    });
    html += `<button class="__sd-save" id="__seo-apply">Appliquer les champs SEO</button>`;
    d.innerHTML = html;
    document.body.appendChild(d);

    document.getElementById('__seo-apply').addEventListener('click', () => {
      d.querySelectorAll('[data-seo]').forEach(ta => {
        const val = ta.value.trim();
        if (val) setChange(ta.dataset.seo, ta.dataset.lang, val);
      });
      toast('Champs SEO mis à jour — cliquez Sauvegarder pour publier');
    });
  }

  function toggleSEO() {
    document.getElementById('__seo-drawer').classList.toggle('open');
  }

  // ── Bind editable elements ──────────────────────────────────────────────────
  function bindEditables() {
    let count = 0;
    EDIT_MAP.forEach(def => {
      const el = document.querySelector(def.sel);
      if (!el) return;
      el.setAttribute('data-edit-key', def.key);
      // capture:true fires before any existing page handlers (links, buttons, etc.)
      el.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openModal(def);
      }, { capture: true });
      count++;
    });
    toast('✏ ' + count + ' élément' + (count > 1 ? 's' : '') + ' éditables — cliquez pour modifier');
  }

  // ── Edit modal ──────────────────────────────────────────────────────────────
  function openModal(def) {
    closeModal();
    const bg = document.createElement('div');
    bg.id = '__modal-bg';

    const modal = document.createElement('div');
    modal.id = '__modal';
    modal.innerHTML = `
      <div class="__m-head">
        <span class="__m-title">${def.label}</span>
        <code class="__m-key">${def.key}</code>
        <button class="__m-close" id="__m-x">✕</button>
      </div>
      <div class="__m-body">
        ${def.html ? `<p class="__m-html-note">HTML autorisé — utilisez <code>&lt;span&gt;mot&lt;/span&gt;</code> pour mettre un mot en couleur accent.</p>` : ''}
        <div class="__m-lang-row">🇫🇷 Français</div>
        <textarea class="__m-ta" id="__m-fr" rows="${def.html ? 2 : 3}">${esc(getVal(def.key,'fr'))}</textarea>
        <div class="__m-lang-row">🇬🇧 English</div>
        <textarea class="__m-ta" id="__m-en" rows="${def.html ? 2 : 3}">${esc(getVal(def.key,'en'))}</textarea>
      </div>
      <div class="__m-footer">
        <button class="__eb-btn" id="__m-cancel">Annuler</button>
        <button class="__eb-btn primary" id="__m-apply">Appliquer</button>
      </div>`;

    bg.appendChild(modal);
    document.body.appendChild(bg);

    document.getElementById('__m-x').addEventListener('click', closeModal);
    document.getElementById('__m-cancel').addEventListener('click', closeModal);
    bg.addEventListener('click', e => { if (e.target === bg) closeModal(); });

    document.getElementById('__m-apply').addEventListener('click', () => {
      const fr = document.getElementById('__m-fr').value.trim();
      const en = document.getElementById('__m-en').value.trim();
      if (fr) setChange(def.key, 'fr', fr);
      if (en) setChange(def.key, 'en', en);

      // Live preview — update visible element
      const el = document.querySelector(def.sel);
      if (el) {
        const lang = (window.__i18n && window.__i18n.lang) || 'fr';
        const v = lang === 'fr' ? fr : en;
        if (v) { if (def.html) el.innerHTML = v; else el.textContent = v; }
      }
      closeModal();
      toast('Modifié — cliquez ✓ Sauvegarder pour publier');
    });

    setTimeout(() => { const ta = document.getElementById('__m-fr'); if (ta) ta.focus(); }, 60);
  }

  function closeModal() {
    const bg = document.getElementById('__modal-bg');
    if (bg) bg.remove();
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  function saveAll() {
    if (!countChanges()) { toast('Aucune modification à sauvegarder'); return; }
    const btn = document.getElementById('__eb-save');
    btn.textContent = 'Publication…';
    btn.disabled = true;

    fetch('/admin/api.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', changes })
    })
    .then(r => r.json())
    .then(d => {
      if (d.ok) {
        // Merge into live overrides
        const ov = window.__contentOverrides || {};
        Object.keys(changes).forEach(k => {
          if (!ov[k]) ov[k] = {};
          Object.assign(ov[k], changes[k]);
          delete changes[k];
        });
        window.__contentOverrides = ov;
        document.querySelectorAll('[data-edit-dirty]').forEach(el => el.removeAttribute('data-edit-dirty'));
        refreshBadge();
        toast('✓ Publié avec succès — modifications en ligne');
      } else {
        toast(d.error || 'Erreur lors de la sauvegarde', true);
      }
    })
    .catch(() => toast('Erreur réseau — modifications non sauvegardées', true))
    .finally(() => { btn.textContent = '✓ Sauvegarder'; btn.disabled = false; });
  }

  // ── Toast ─────────────────────────────────────────────────────────────────────
  function toast(msg, isErr) {
    let el = document.getElementById('__toast');
    if (!el) { el = document.createElement('div'); el.id = '__toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.className = isErr ? 'err' : '';
    requestAnimationFrame(() => {
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 3200);
    });
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Boot ─────────────────────────────────────────────────────────────────────
  function boot() {
    injectStyles();
    buildToolbar();
    buildSEODrawer();

    // The intro modal (z-index:5000) blocks all page interaction and body.loading
    // keeps all content at opacity:0. Auto-dismiss so the editor is immediately usable.
    const enterBtn = document.getElementById('enterBtn');
    const introModal = document.getElementById('introModal');
    if (enterBtn) {
      enterBtn.click();
    } else if (introModal) {
      introModal.style.display = 'none';
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    }

    // 1s delay: intro modal animation (~850ms) + content fade-in (CSS 1s transition)
    setTimeout(bindEditables, 1000);
  }

  checkAuth(() => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  });

})();
