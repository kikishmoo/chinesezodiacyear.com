/**
 * Shared HTML parsing utilities.
 *
 * Used by adapter parsers to clean upstream HTML.
 */

/**
 * Strip all HTML tags from a string.
 * @param {string} s
 * @returns {string}
 */
export function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').trim();
}

/**
 * Clean text: strip &nbsp;, collapse whitespace, trim.
 * @param {string} s
 * @returns {string}
 */
export function cleanText(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
