/**
 * D1 binding access helpers for repository layer.
 *
 * Rule: all D1 usage should stay inside worker/repositories/* modules.
 */

/**
 * Resolve the D1 database binding from Cloudflare Worker env.
 * @param {Record<string, any>} env
 * @returns {D1Database}
 */
export function getDb(env) {
  if (!env || !env.DB || typeof env.DB.prepare !== 'function') {
    throw new Error('D1 binding `DB` is missing. Configure `wrangler.jsonc` d1_databases binding.');
  }

  return env.DB;
}
