/**
 * Sanitise — Unified HTML escaping utility.
 *
 * Replaces both esc() (line 761) and escapeHtml() (line 580) from site.js.
 * Uses string replacement (faster than DOM-based approach for short strings).
 */

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Clean raw Chinese text: strip &nbsp;, collapse whitespace, normalise line breaks.
 * @param {string} s
 * @returns {string}
 */
export function cleanText(s) {
  if (!s) return '';
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
