/**
 * Analytics — Centralised GA4 tracking layer.
 *
 * Wraps gtag() calls with a guard so features don't need to
 * check for GA4 availability themselves.
 */

/**
 * Send a GA4 event if gtag is loaded.
 * @param {string} name — event name
 * @param {Object} [params] — event parameters
 */
export function track(name, params) {
  if (window.gtag) window.gtag('event', name, params || {});
}
