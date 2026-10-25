/* Ernesto Musca — interazioni condivise (home e catalogo). Lo scroll resta nativo. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var data = window.EM || { lines: [], brands: [] };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var brandById = {};
  data.brands.forEach(function (b) { brandById[b.id] = b; });
  var el = function (tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  window.EMutil = { esc: esc, brandById: brandById };

  // Intro: decorativa, una volta per sessione; il contenuto non aspetta mai l'animazione.
  var introDelay = root.classList.contains('js-intro') ? 1650 : 60;
  setTimeout(function () { document.body.classList.add('is-ready'); }, introDelay);
  setTimeout(function () { root.classList.remove('js-intro'); }, 2600);

  /* Header: tono chiaro/scuro in base alla sezione sotto, si nasconde scendendo. */
  var header = $('.site-header');
  var darkZones = $$('[data-tone="dark"]').filter(function (n) { return n !== header; });
  var lastY = window.scrollY, travel = 0;
  function updateHeader() {
    var y = window.scrollY, d = y - lastY;
    if ((d > 0) !== (travel > 0)) travel = 0;
    travel += d;
    header.classList.toggle('is-scrolled', y > 10);
    var probe = 32, dark = false;
    for (var i = 0; i < darkZones.length; i++) {
      var r = darkZones[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { dark = true; break; }
    }
    header.classList.toggle('is-light', !dark);
    var menuOpen = document.body.classList.contains('menu-open');
    if (y < 120 || menuOpen || travel < -8) header.classList.remove('is-away');
    else if (travel > 40 && !header.contains(document.activeElement)) header.classList.add('is-away');
    document.body.classList.toggle('header-shown', !header.classList.contains('is-away') && y > 10);
    lastY = y;
  }

  /* Menu a tutto schermo */
  var toggle = $('.menu-toggle'), menu = $('#menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('is-open'); }); }
    else { menu.classList.remove('is-open'); setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 700); }
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); } });
  }

  /* Manifesto: le parole si accendono con lo scroll */
  var manifesto = $('[data-words]');
  var words = [];
  if (manifesto) {
    var accentFrom = manifesto.textContent.indexOf('Al necessario');
    var accentTo = manifesto.textContent.indexOf(':') + 1;
    var pos = 0, frag = document.createDocumentFragment();
    manifesto.textContent.split(/(\s+)/).forEach(function (part) {
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); pos += part.length; return; }
      var s = el('span', 'w' + (pos >= accentFrom && pos < accentTo ? ' accent' : ''));
      s.textContent = part; frag.appendChild(s); words.push(s); pos += part.length;
    });
    manifesto.replaceChildren(frag);
    if (reduced) words.forEach(function (w) { w.classList.add('on'); });
  }
  function updateWords() {
    if (!words.length || reduced) return;
    var r = manifesto.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp((vh * .85 - r.top) / (r.height * .7 + vh * .25), 0, 1);
    var lit = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
  }

  /* Hero: avanzamento dello scroll esposto come --p per CSS e scena 3D */
  var hero = $('.hero');
  function updateHero() {
    if (!hero) return;
    var r = hero.getBoundingClientRect();
    var p = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
    hero.style.setProperty('--p', p.toFixed(4));
    window.EMheroProgress = p;
  }

  /* Linee: card generate dai dati + scorrimento orizzontale agganciato allo scroll verticale */
  var linesSection = $('.lines'), track = $('#lines-track');
  var lineCards = [];
  if (track) {
    data.lines.forEach(function (line) {
      var ids = [];
      line.families.forEach(function (f) { f.brands.forEach(function (b) { if (ids.indexOf(b) < 0) ids.push(b); }); });
      var names = ids.map(function (id) { return brandById[id] ? brandById[id].name : id; });
      // Card sintetica: il dettaglio dei prodotti vive nel catalogo
      var card = el('a', 'line-card');
      card.href = 'catalogo.html#' + line.id;
      card.innerHTML =
        '<div class="line-media"><img src="' + line.image + '" alt="' + esc(line.title) + '" width="800" height="1000" loading="lazy"><span class="line-num">' + line.n + '</span></div>' +
        '<div class="line-body"><h3>' + esc(line.title) + '</h3><p class="line-lead">' + esc(line.lead) + '</p>' +
        '<div class="line-foot"><span class="line-brands">' + (names.length ? esc(names.join(' · ')) : 'Selezione multimarca') + '</span>' +
        '<span class="line-link" aria-hidden="true"><span>→</span></span></div></div>';
      track.appendChild(card); lineCards.push(card);
    });
    var end = el('article', 'line-card end');
    end.innerHTML = '<div><h3>Tutto in un posto,<br><em>sfoglialo.</em></h3><p>Famiglie di prodotto e marchi partner, linea per linea.</p></div><a class="btn btn-light" href="catalogo.html">Apri il catalogo <span class="btn-arrow" aria-hidden="true">→</span></a>';
    track.appendChild(end);
  }
  var pinLines = false, trackShift = 0;
  var count = $('.lines-count b'), bar = $('.lines-bar');
  function layoutLines() {
    if (!linesSection) return;
    pinLines = !reduced && window.innerWidth > 760;
    if (!pinLines) { linesSection.style.height = ''; track.style.transform = ''; return; }
    trackShift = Math.max(0, track.scrollWidth - window.innerWidth);
    linesSection.style.height = (window.innerHeight + trackShift) + 'px';
  }
  function updateLines() {
    if (!linesSection || !pinLines) return;
    var r = linesSection.getBoundingClientRect();
    var p = clamp(-r.top / Math.max(1, trackShift), 0, 1);
    track.style.transform = 'translate3d(' + (-p * trackShift).toFixed(1) + 'px,0,0)';
    if (bar) bar.style.setProperty('--lp', p.toFixed(4));
    if (count) count.textContent = String(Math.min(data.lines.length, 1 + Math.floor(p * data.lines.length * .999))).padStart(2, '0');
    lineCards.forEach(function (c) {
      var cr = c.getBoundingClientRect();
      var shift = clamp((cr.left + cr.width / 2 - window.innerWidth / 2) / window.innerWidth, -1, 1);
      c.style.setProperty('--shift', shift.toFixed(3));
    });
  }

  /* Marchi in home */
  var brandGrid = $('#brand-grid');
  if (brandGrid) {
    data.brands.forEach(function (b) {
      var card = el('a', 'brand-card reveal');
      card.href = 'marchi.html#marchio-' + b.id;
      card.innerHTML =
        '<div class="brand-top"><span>' + esc(b.since) + '</span><span class="brand-dots" aria-hidden="true">' +
        data.lines.map(function (l) { return '<i class="' + (b.lines.indexOf(l.id) >= 0 ? 'on' : '') + '"></i>'; }).join('') + '</span></div>' +
        '<div class="brand-logo">' + (b.logo ? '<img src="' + b.logo + '" alt="Logo ' + esc(b.name) + '" loading="lazy">' : '<span class="brand-wordmark">' + esc(b.name) + '</span>') + '</div>' +
        '<h3 class="brand-name">' + esc(b.name) + '</h3><p class="brand-place">' + esc(b.place) + '</p>' +
        '<div class="brand-reveal"><div><p>' + esc(b.text) + '</p></div></div>';
      brandGrid.appendChild(card);
    });
  }

  /* About: parallasse leggera */
  var aboutImg = $('.about-media img');
  function updateAbout() {
    if (!aboutImg || reduced) return;
    var r = aboutImg.parentNode.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
    aboutImg.style.setProperty('--py', (p * r.height * .16).toFixed(1));
  }

  /* Un solo ciclo per tutti gli effetti di scroll */
  var queued = false;
  function frame() { queued = false; updateHeader(); updateHero(); updateWords(); updateLines(); updateAbout(); }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', function () { layoutLines(); queue(); });
  window.addEventListener('load', function () { layoutLines(); queue(); });
  layoutLines(); frame();

  /* Comparsa progressiva e contatori */
  if ('IntersectionObserver' in window && !reduced) {
    root.classList.add('motion');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        var c = $('[data-count]', e.target);
        if (c) countUp(c);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (n) { io.observe(n); });
  }
  function countUp(n) {
    var target = +n.dataset.count, t0 = performance.now();
    (function step(t) { var k = clamp((t - t0) / 1200, 0, 1); n.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
  }

  /* Modulo richiesta: prepara un'email, nessun dato salvato */
  var chipsBox = $('#form-chips'), form = $('#request-form');
  if (chipsBox) {
    var pre = (new URLSearchParams(location.search)).get('linea');
    data.lines.concat([{ id: 'completa', title: 'Una fornitura completa' }]).forEach(function (l) {
      var lab = el('label', 'chip');
      lab.innerHTML = '<input type="checkbox" name="linee" value="' + esc(l.title) + '"' + (pre === l.id ? ' checked' : '') + '><span>' + esc(l.short || l.title) + '</span>';
      chipsBox.appendChild(lab);
    });
  }
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form), linee = fd.getAll('linee');
    var what = linee.length ? linee.join(', ') : 'Una fornitura per la mia attività';
    var subject = 'Richiesta informazioni — ' + what;
    var body = 'Buongiorno,\n\nsono ' + fd.get('name') + (fd.get('company') ? ' di ' + fd.get('company') : '') + '.\nMi interessa: ' + what + '.\n\n' + fd.get('message') + '\n\nEmail: ' + fd.get('email') + '\n\nGrazie,\n' + fd.get('name');
    location.href = 'mailto:info@ernestomusca.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    $('#form-status').textContent = 'Richiesta preparata: completa l’invio nella tua app email. Se non si apre, scrivi a info@ernestomusca.com.';
  });

  /* Contatti: il form email è il pannello di partenza; telefono mostra WhatsApp.
     Con il mouse basta passarci sopra, al tocco o al clic si sceglie il pannello. */
  var panels = $('.contact-panels');
  if (panels) {
    var panelLinks = $$('[data-panel]');
    var hoverable = matchMedia('(hover: hover) and (pointer: fine)').matches;
    var showPanel = function (name) {
      panels.dataset.active = name;
      panelLinks.forEach(function (a) { a.classList.toggle('is-active', a.dataset.panel === name); });
      $$('.contact-panels > *').forEach(function (p) {
        var on = (name === 'whatsapp') === p.classList.contains('wa-panel');
        p.setAttribute('aria-hidden', String(!on));
        $$('a, input, textarea, button', p).forEach(function (f) { if (on) f.removeAttribute('tabindex'); else f.setAttribute('tabindex', '-1'); });
      });
    };
    panelLinks.forEach(function (a) {
      if (hoverable) a.addEventListener('mouseenter', function () { showPanel(a.dataset.panel); });
      a.addEventListener('click', function (e) {
        // Su telefono un primo tocco mostra il pannello; se è già attivo, il link chiama o scrive.
        if (!hoverable && panels.dataset.active === a.dataset.panel) return;
        e.preventDefault();
        showPanel(a.dataset.panel);
        if (window.innerWidth <= 1100) panels.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    });
    showPanel('email');
  }

  /* Pagine legali: evidenzia nell'indice la sezione che si sta leggendo */
  var tocLinks = $$('.legal-toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var tocIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.legal-section').forEach(function (s) { tocIo.observe(s); });
  }

  /* Dialog */
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { var d = document.getElementById(b.dataset.open); if (d) d.showModal(); }); });
  $$('dialog').forEach(function (d) {
    var c = $('.dialog-close', d); if (c) c.addEventListener('click', function () { d.close(); });
    d.addEventListener('click', function (e) {
      if (e.target !== d) return;
      var r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
    });
  });
  $$('.year').forEach(function (y) { y.textContent = new Date().getFullYear(); });

  /* La scritta grande del footer riporta in cima */
  $$('[data-top]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  });
})();
