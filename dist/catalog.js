/* Catalogo: linee e famiglie generate dai dati, filtro per linea e ricerca testuale. */
(function () {
  'use strict';
  var data = window.EM, util = window.EMutil;
  if (!data || !util) return;
  var esc = util.esc, brandById = util.brandById;
  var linesBox = document.getElementById('cat-lines');
  var filters = document.getElementById('cat-filters');
  var search = document.getElementById('cat-search');
  var empty = document.getElementById('cat-empty');
  var active = 'tutte';

  var countItems = function (l) { return l.families.reduce(function (n, f) { return n + f.items.length; }, 0); };
  var total = data.lines.reduce(function (n, l) { return n + countItems(l); }, 0);

  [{ id: 'tutte', short: 'Tutte', n: total }].concat(data.lines.map(function (l) { return { id: l.id, short: l.short, n: countItems(l) }; })).forEach(function (f) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cat-filter'; b.dataset.filter = f.id;
    b.setAttribute('aria-pressed', String(f.id === active));
    b.innerHTML = esc(f.short) + '<b>' + f.n + '</b>';
    b.addEventListener('click', function () { setFilter(f.id, true); });
    filters.appendChild(b);
  });

  data.lines.forEach(function (line) {
    var sec = document.createElement('section');
    sec.className = 'cat-line'; sec.id = line.id; sec.dataset.line = line.id;
    sec.setAttribute('aria-labelledby', 't-' + line.id);
    var html = '<aside class="cat-aside"><span class="num">' + line.n + '</span><h2 id="t-' + line.id + '">' + esc(line.title) + '</h2>' +
      '<p class="lead">' + esc(line.lead) + '</p><p>' + esc(line.text) + '</p>' +
      '<div class="cat-img"><img src="' + line.image + '" alt="' + esc(line.title) + '" width="800" height="1000" loading="lazy"></div></aside>' +
      '<div class="cat-families">';
    line.families.forEach(function (f, i) {
      var id = line.id + '-f' + i;
      html += '<div class="family' + (i === 0 ? ' open' : '') + '" data-text="' + esc((f.name + ' ' + f.items.join(' ') + ' ' + f.brands.map(function (b) { return brandById[b] ? brandById[b].name : ''; }).join(' ')).toLowerCase()) + '">' +
        '<button class="family-head" type="button" aria-expanded="' + (i === 0) + '" aria-controls="' + id + '"><h3>' + esc(f.name) + '</h3><span class="count">' + f.items.length + ' prodotti</span><span class="pm" aria-hidden="true"></span></button>' +
        '<div class="family-body" id="' + id + '"><div><div class="family-inner">' +
        '<ul class="family-items">' + f.items.map(function (t) { return '<li data-item="' + esc(t) + '">' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<div class="family-brands"><small>Marchi</small>' +
        (f.brands.length ? f.brands.map(function (b) { var br = brandById[b]; return br ? '<a href="marchi.html#marchio-' + br.id + '">' + esc(br.name) + '<span>' + esc(br.place) + '</span></a>' : ''; }).join('') : '<p class="none">Selezione multimarca, scelta in base all’uso.</p>') +
        '<a class="family-cta" href="index.html?linea=' + line.id + '#contatti">Richiedi informazioni →</a></div>' +
        '</div></div></div></div>';
    });
    sec.innerHTML = html + '</div>';
    linesBox.appendChild(sec);
  });

  linesBox.addEventListener('click', function (e) {
    var head = e.target.closest('.family-head'); if (!head) return;
    var fam = head.parentNode, open = !fam.classList.contains('open');
    fam.classList.toggle('open', open); head.setAttribute('aria-expanded', String(open));
  });

  function apply() {
    var q = search.value.trim().toLowerCase();
    var any = false;
    document.querySelectorAll('.cat-line').forEach(function (sec) {
      var lineOk = active === 'tutte' || sec.dataset.line === active;
      var shown = 0;
      sec.querySelectorAll('.family').forEach(function (fam) {
        var match = !q || fam.dataset.text.indexOf(q) >= 0;
        fam.hidden = !(lineOk && match);
        fam.querySelectorAll('li').forEach(function (li) {
          var t = li.dataset.item;
          var i = q ? t.toLowerCase().indexOf(q) : -1;
          li.innerHTML = i >= 0 ? esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length)) : esc(t);
        });
        if (q && match) { fam.classList.add('open'); fam.querySelector('.family-head').setAttribute('aria-expanded', 'true'); }
        if (!fam.hidden) shown++;
      });
      sec.hidden = !lineOk || shown === 0;
      if (!sec.hidden) any = true;
    });
    empty.hidden = any;
  }
  function setFilter(id, scroll) {
    active = id;
    filters.querySelectorAll('.cat-filter').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === id)); });
    apply();
    if (scroll) scrollToLine(id);
  }
  // Porta all'inizio della linea scelta, sotto la barra filtri (e l'header, se ricompare)
  function scrollToLine(id) {
    var target = id === 'tutte' ? document.querySelector('.cat-line:not([hidden])') : document.getElementById(id);
    if (!target) return;
    var tools = document.querySelector('.cat-tools').offsetHeight;
    var headerH = document.querySelector('.site-header').offsetHeight;
    var top = target.getBoundingClientRect().top + window.scrollY - tools - headerH + 1;
    window.scrollTo({ top: top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  search.addEventListener('input', apply);

  // Un link da fuori (catalogo.html#carta) apre direttamente la linea
  var hash = location.hash.slice(1);
  if (data.lines.some(function (l) { return l.id === hash; })) {
    setFilter(hash, false);
    requestAnimationFrame(function () { scrollToLine(hash); });
  }
})();
