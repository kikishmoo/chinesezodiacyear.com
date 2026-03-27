import { getDb } from './db-context.js';

/**
 * Fetch one report template by slug and template type.
 * @param {Record<string, any>} env
 * @param {{templateType: string, slug: string}} params
 */
export async function getReportTemplateBySlug(env, { templateType, slug }) {
  const db = getDb(env);

  return db
    .prepare(
      `SELECT id, template_type, slug, title, body_markdown, version, is_active, created_at, updated_at
       FROM report_templates
       WHERE template_type = ? AND slug = ? AND is_active = 1
       LIMIT 1`
    )
    .bind(templateType, slug)
    .first();
}
