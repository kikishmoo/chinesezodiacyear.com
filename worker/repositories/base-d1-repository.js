/**
 * Base D1 repository helper.
 *
 * Repositories are the only layer allowed to run SQL directly.
 */
export class BaseD1Repository {
  /**
   * @param {D1Database} db
   */
  constructor(db) {
    if (!db || typeof db.prepare !== 'function') {
      throw new Error('D1 database binding is required for repository usage');
    }
    this.db = db;
  }

  /**
   * @template T
   * @param {string} sql
   * @param {Array<unknown>} [bindings]
   * @returns {Promise<T | null>}
   */
  async first(sql, bindings = []) {
    return this.db.prepare(sql).bind(...bindings).first();
  }

  /**
   * @template T
   * @param {string} sql
   * @param {Array<unknown>} [bindings]
   * @returns {Promise<T[]>}
   */
  async all(sql, bindings = []) {
    const result = await this.db.prepare(sql).bind(...bindings).all();
    return result?.results ?? [];
  }

  /**
   * @param {string} sql
   * @param {Array<unknown>} [bindings]
   */
  async run(sql, bindings = []) {
    return this.db.prepare(sql).bind(...bindings).run();
  }
}
