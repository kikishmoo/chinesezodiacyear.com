/**
 * Lightweight Router
 *
 * Matches { method, path } pairs to handler functions.
 * No dependencies. API versioned via /v1/ prefix.
 */

/**
 * @typedef {Object} Route
 * @property {string} method — HTTP method (uppercase)
 * @property {string} path — URL pathname (exact match)
 * @property {Function} handler — async (request, env, corsHeaders) => Response
 */

export class Router {
  constructor() {
    /** @type {Route[]} */
    this.routes = [];
  }

  /**
   * Register a route.
   * @param {string} method
   * @param {string} path
   * @param {Function} handler
   */
  add(method, path, handler) {
    this.routes.push({ method: method.toUpperCase(), path, handler });
  }

  /** Convenience methods */
  get(path, handler) { this.add('GET', path, handler); }
  post(path, handler) { this.add('POST', path, handler); }

  /**
   * Match a request to a registered route.
   * @param {string} method
   * @param {string} pathname
   * @returns {Route|null}
   */
  match(method, pathname) {
    // Normalise: strip trailing slash (except root)
    const norm = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;

    return this.routes.find(
      r => r.method === method.toUpperCase() && r.path === norm
    ) || null;
  }
}
