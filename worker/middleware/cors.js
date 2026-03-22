/**
 * CORS Middleware
 *
 * Validates request origin against ALLOWED_ORIGINS env var.
 * Returns CORS headers for every response.
 */

const CORS_METHODS = 'POST, OPTIONS';
const CORS_ALLOWED_HEADERS = 'Content-Type';
const CORS_MAX_AGE = '86400';

/**
 * Resolve the allowed CORS origin for a request.
 * @param {Request} request
 * @param {Object} env — Cloudflare Worker env bindings
 * @returns {string}
 */
export function resolveCorsOrigin(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());

  if (allowed.includes(origin)) return origin;

  // Allow localhost for development
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
    return origin;
  }

  return allowed[0] || '*';
}

/**
 * Build CORS headers object.
 * @param {string} origin — resolved origin
 * @returns {Object}
 */
export function buildCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': CORS_METHODS,
    'Access-Control-Allow-Headers': CORS_ALLOWED_HEADERS,
    'Access-Control-Max-Age': CORS_MAX_AGE
  };
}

/**
 * Handle CORS preflight (OPTIONS) request.
 * @param {Object} corsHeaders
 * @returns {Response}
 */
export function handlePreflight(corsHeaders) {
  return new Response(null, { status: 204, headers: corsHeaders });
}
