/**
 * Repository: report_templates
 */

import { getDb, queryAll, queryOne, execute } from './db-client.js';

const BASE_COLUMNS = `
  id,
  slug,
  title,
  description,
  locale,
  category,
  version,
  price_cents,
  currency,
  template_json,
  is_active,
  created_at,
  updated_at
`;

/**
 * @param {Record<string, unknown>} env
 */
export function createReportTemplatesRepository(env) {
  const db = getDb(env);

  return {
    /**
     * @param {string} slug
     */
    async getBySlug(slug) {
      return queryOne(
        db,
        `SELECT ${BASE_COLUMNS}
         FROM report_templates
         WHERE slug = ?
         LIMIT 1`,
        [slug]
      );
    },

    /**
     * @param {string} category
     * @param {string} [locale='en']
     */
    async listActiveByCategory(category, locale = 'en') {
      return queryAll(
        db,
        `SELECT ${BASE_COLUMNS}
         FROM report_templates
         WHERE category = ?
           AND locale = ?
           AND is_active = 1
         ORDER BY version DESC, created_at DESC`,
        [category, locale]
      );
    },

    /**
     * @param {{
     *  id: string,
     *  slug: string,
     *  title: string,
     *  locale?: string,
     *  category: string,
     *  version?: number,
     *  templateJson: string,
     *  isActive?: number
     * }} input
     */
    async create(input) {
      const {
        id,
        slug,
        title,
        locale = 'en',
        category,
        version = 1,
        templateJson,
        isActive = 1
      } = input;

      await execute(
        db,
        `INSERT INTO report_templates (
           id, slug, title, locale, category, version, template_json, is_active
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, slug, title, locale, category, version, templateJson, isActive]
      );

      return this.getBySlug(slug);
    }
  };
}
