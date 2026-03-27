/**
 * D1 DB client helpers.
 *
 * Keeps env/DB guardrails in one place so services do not access SQL directly.
 */

import { ValidationError } from '../models/errors.js';

/**
 * @param {Record<string, unknown>} env
 * @returns {D1Database}
 */
export function getDb(env) {
  if (!env || typeof env !== 'object' || !('DB' in env) || !env.DB) {
    throw new ValidationError('Missing D1 binding `DB` in worker env');
  }
  return /** @type {D1Database} */ (env.DB);
}

/**
 * Run a SELECT query and return rows.
 * @param {D1Database} db
 * @param {string} sql
 * @param {unknown[]} [params]
 * @returns {Promise<unknown[]>}
 */
export async function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql).bind(...params);
  const result = await stmt.all();
  return result.results ?? [];
}

/**
 * Run a SELECT query and return the first row or null.
 * @param {D1Database} db
 * @param {string} sql
 * @param {unknown[]} [params]
 * @returns {Promise<unknown | null>}
 */
export async function queryOne(db, sql, params = []) {
  const rows = await queryAll(db, sql, params);
  return rows[0] ?? null;
}

/**
 * Execute a write statement.
 * @param {D1Database} db
 * @param {string} sql
 * @param {unknown[]} [params]
 * @returns {Promise<unknown>}
 */
export async function execute(db, sql, params = []) {
  const stmt = db.prepare(sql).bind(...params);
  return stmt.run();
}
