/**
 * Base Path — Detects GitHub Pages subpath prefix.
 *
 * Looks at the stylesheet link href to determine if the site
 * is served from a subpath (e.g. /repo-name/).
 */

export const basePath = (function () {
  const link = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');
  if (link) {
    const m = link.getAttribute('href').match(/^(\/[^/]+\/)?styles\.css/);
    if (m && m[1]) return m[1].replace(/\/$/, '');
  }
  return '';
})();
