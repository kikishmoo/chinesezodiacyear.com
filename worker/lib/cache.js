/**
 * Cache — Cloudflare Cache API wrapper for BaZi calculations.
 *
 * BaZi charts are deterministic: same input → same output.
 * Cache key is SHA-256 of the canonical JSON request body.
 *
 * Uses Cloudflare's Cache API (caches.default), which is available
 * in Workers but NOT in local dev (miniflare provides a stub).
 *
 * @module worker/lib/cache
 */

const DEFAULT_TTL = 86400; // 24 hours
const CACHE_NAMESPACE = 'https://bazi-cache.chinesezodiacyear.com/';

/**
 * Generate a SHA-256 hex digest of the input for cache keying.
 *
 * @param {Object} input — validated BaZi request input
 * @returns {Promise<string>} — hex digest
 */
async function hashKey(input) {
  // Canonical JSON: sorted keys ensure identical inputs produce identical hashes
  const canonical = JSON.stringify(input, Object.keys(input).sort());
  const encoded = new TextEncoder().encode(canonical);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Build a synthetic Request URL for the Cache API.
 *
 * Cloudflare Cache API requires a Request/URL as key, not arbitrary strings.
 * We use a synthetic URL under our namespace.
 *
 * @param {string} hash — SHA-256 hex digest
 * @returns {string}
 */
function cacheUrl(hash) {
  return `${CACHE_NAMESPACE}${hash}`;
}

/**
 * Look up a cached BaZi response.
 *
 * @param {Object} input — validated BaZi request input
 * @returns {Promise<Object|null>} — cached chart data, or null on miss
 */
export async function cacheGet(input) {
  try {
    const hash = await hashKey(input);
    const cache = caches.default;
    const response = await cache.match(cacheUrl(hash));

    if (!response) return null;

    const data = await response.json();
    data._cached = true;
    return data;
  } catch (e) {
    // Cache failures must never block a calculation
    console.error('Cache GET error:', e.message);
    return null;
  }
}

/**
 * Store a BaZi response in the cache.
 *
 * @param {Object} input — validated BaZi request input (used as key)
 * @param {Object} data — chart data to cache
 * @param {number} [ttl=86400] — TTL in seconds (default 24h)
 * @returns {Promise<void>}
 */
export async function cachePut(input, data, ttl = DEFAULT_TTL) {
  try {
    const hash = await hashKey(input);
    const cache = caches.default;
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `s-maxage=${ttl}`
      }
    });

    await cache.put(cacheUrl(hash), response);
  } catch (e) {
    // Cache failures must never block a calculation
    console.error('Cache PUT error:', e.message);
  }
}

// Exported for testing
export { hashKey };
