import { getDb, queryAll, queryFirst } from './base-repository.js';

/**
 * Report template repository.
 *
 * Owns all SQL access for report template reads.
 */
export async function listActiveReportTemplates(env) {
  const db = getDb(env);

  return queryAll(
    db,
    `SELECT id, slug, title, price_cents, currency, is_active, updated_at
     FROM report_templates
     WHERE is_active = 1
     ORDER BY updated_at DESC`
  );
}

/**
 * @param {unknown} env
 * @param {string} slug
 */
export async function getReportTemplateBySlug(env, slug) {
  const db = getDb(env);

  return queryFirst(
    db,
    `SELECT id, slug, title, description, price_cents, currency, content_version, is_active, updated_at
     FROM report_templates
     WHERE slug = ?
     LIMIT 1`,
    [slug]
  );
}
