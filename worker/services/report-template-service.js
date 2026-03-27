import {
  getReportTemplateBySlug,
  listActiveReportTemplates
} from '../repositories/report-template-repository.js';

/**
 * Service layer for report template business rules.
 * No SQL is allowed in this file.
 */
export async function getActiveTemplates(env) {
  return listActiveReportTemplates(env);
}

/**
 * @param {unknown} env
 * @param {string} slug
 */
export async function getTemplateForCheckout(env, slug) {
  const template = await getReportTemplateBySlug(env, slug);

  if (!template || template.is_active !== 1) {
    return null;
  }

  return template;
}
