/**
 * Base repository helpers for D1 access.
 *
 * Repositories are the only layer that may execute SQL.
 */

/**
 * @param {unknown} env
 * @returns {D1Database}
 */
export function getDb(env) {
  const db = env?.DB;
  if (!db) {
    throw new Error('D1 binding "DB" is not configured in environment');
  }
  return db;
}

/**
 * Execute a read query and return rows.
 * @param {D1Database} db
 * @param {string} sql
 * @param {unknown[]} [params]
 */
export async function queryAll(db, sql, params = []) {
  const statement = db.prepare(sql).bind(...params);
  const result = await statement.all();
  return result.results || [];
}

/**
 * Execute a single-row read query.
 * @param {D1Database} db
 * @param {string} sql
 * @param {unknown[]} [params]
 */
export async function queryFirst(db, sql, params = []) {
  const statement = db.prepare(sql).bind(...params);
  const result = await statement.first();
  return result || null;
}
