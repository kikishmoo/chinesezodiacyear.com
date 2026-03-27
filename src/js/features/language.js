/**
 * Language — Three-language toggle (EN / TC / SC) with URL navigation.
 */

export function initLanguageToggle() {
  var CYCLE = ['en', 'tc', 'sc'];
  var PREFIXES = { en: '', tc: '/zh-hant', sc: '/zh-hans' };

  var langBtn = document.querySelector('.lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-lang') || 'en';
      var idx = CYCLE.indexOf(current);
      var next = CYCLE[(idx + 1) % 3];
      localStorage.setItem('czy-lang', next);
      if (window.gtag) window.gtag('event', 'language_switch', {
        event_category: 'Preferences',
        event_label: next,
        language_from: current,
        language_to: next
      });
      var path = location.pathname;
      path = path.replace(/^\/(zh-hant|zh-hans)(\/|$)/, '/');
      var target = PREFIXES[next] + (path || '/');
      if (target === '') target = '/';
      location.href = target;
    });
  }
}

/**
 * Language-Aware Nav Links — Rewrite nav links to preserve language prefix.
 */
export function initLanguageAwareLinks() {
  var prefix = '';
  var p = window.location.pathname;
  if (p.indexOf('/zh-hant') === 0) prefix = '/zh-hant';
  else if (p.indexOf('/zh-hans') === 0) prefix = '/zh-hans';
  if (!prefix) return;
  document.querySelectorAll('.main-nav a, .site-logo, .header-search-link, .site-footer a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) !== '/' || href.indexOf('/zh-hant') === 0 || href.indexOf('/zh-hans') === 0) return;
    if (/\.\w{2,4}$/.test(href)) return;
    link.setAttribute('href', prefix + href);
  });
}
