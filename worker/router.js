/**
 * Lightweight Router
 *
 * Matches { method, path } pairs to handler functions.
 * Supports exact paths and named parameters (e.g. /v1/reports/:jobId).
 * No dependencies. API versioned via /v1/ prefix.
 */

/**
 * @typedef {Object} Route
 * @property {string} method — HTTP method (uppercase)
 * @property {string} path — URL pathname pattern (exact or with :params)
 * @property {RegExp} _regex — compiled pattern
 * @property {string[]} _paramNames — ordered parameter names
 * @property {Function} handler — async (request, env, corsHeaders, params) => Response
 */

/**
 * Compile a path pattern into a regex + param name list.
 * Exact paths (no colons) compile to a simple equality check.
 * Parameterised paths (e.g. /v1/reports/:jobId) capture named segments.
 *
 * @param {string} path
 * @returns {{ regex: RegExp, paramNames: string[] }}
 */
function compilePath(path) {
  const paramNames = [];
  const regexStr = path.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_match, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  return { regex: new RegExp(`^${regexStr}$`), paramNames };
}

export class Router {
  constructor() {
    /** @type {Route[]} */
    this.routes = [];
  }

  /**
   * Register a route.
   * @param {string} method
   * @param {string} path — exact or parameterised (e.g. /v1/reports/:jobId)
   * @param {Function} handler
   */
  add(method, path, handler) {
    const { regex, paramNames } = compilePath(path);
    this.routes.push({
      method: method.toUpperCase(),
      path,
      _regex: regex,
      _paramNames: paramNames,
      handler
    });
  }

  /** Convenience methods */
  get(path, handler) { this.add('GET', path, handler); }
  post(path, handler) { this.add('POST', path, handler); }

  /**
   * Match a request to a registered route.
   * @param {string} method
   * @param {string} pathname
   * @returns {{ route: Route, params: Record<string, string> } | null}
   */
  match(method, pathname) {
    // Normalise: strip trailing slash (except root)
    const norm = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
    const upperMethod = method.toUpperCase();

    for (const route of this.routes) {
      if (route.method !== upperMethod) continue;

      const m = norm.match(route._regex);
      if (m) {
        /** @type {Record<string, string>} */
        const params = {};
        route._paramNames.forEach((name, i) => { params[name] = m[i + 1]; });
        return { route, params };
      }
    }

    return null;
  }
}
