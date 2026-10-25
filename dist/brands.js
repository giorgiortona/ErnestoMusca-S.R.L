/* Pagina marchi: un blocco per marchio, con logo, specialità e linee in cui compare. */
(function () {
  'use strict';
  var data = window.EM, util = window.EMutil;
  var list = document.getElementById('brand-list');
  if (!data || !util || !list) return;
  var esc = util.esc;

  data.brands.forEach(function (b) {
    var row = document.createElement('article');
    row.className = 'brand-row'; row.id = 'marchio-' + b.id;
    var lines = data.lines.filter(function (l) { return b.lines.indexOf(l.id) >= 0; });
    row.innerHTML =
      '<div><span class="brand-row-logo">' + (b.logo ? '<img src="' + b.logo + '" alt="Logo ' + esc(b.name) + '" loading="lazy">' : '<span class="brand-wordmark">' + esc(b.name) + '</span>') + '</span>' +
      '<h3 class="sr-only">' + esc(b.name) + '</h3><span class="full-name">' + esc(b.full) + '</span></div>' +
      '<p>' + esc(b.text) + '</p>' +
      '<div class="brand-meta"><dl><dt>Dove</dt><dd>' + esc(b.place) + '</dd><dt>' + (/^\d{4}$/.test(b.since) ? 'Dal' : 'Profilo') + '</dt><dd>' + esc(b.since) + '</dd><dt>Linee</dt><dd>' +
      lines.map(function (l) { return '<a href="catalogo.html#' + l.id + '" style="text-decoration:underline;text-underline-offset:3px">' + esc(l.short) + '</a>'; }).join(', ') + '</dd></dl>' +
      '<div class="tags">' + b.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div></div>';
    list.appendChild(row);
  });

  // Arrivando da un link (marchi.html#marchio-leone) il blocco esiste solo ora: ci si porta lì
  var target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) requestAnimationFrame(function () {
    var headerH = document.querySelector('.site-header').offsetHeight;
    window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - headerH - 16);
  });
})();
