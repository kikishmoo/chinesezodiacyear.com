import { BaseD1Repository } from './base-d1-repository.js';

export class ReportTemplateRepository extends BaseD1Repository {
  /**
   * @param {'bazi'|'compatibility'} type
   */
  listActiveByType(type) {
    return this.all(
      `SELECT id, type, section_key, locale, title, body_markdown, version, is_active, created_at, updated_at
       FROM report_templates
       WHERE type = ? AND is_active = 1
       ORDER BY section_key ASC, locale ASC, version DESC`,
      [type]
    );
  }

  /**
   * @param {number} templateId
   */
  findById(templateId) {
    return this.first(
      `SELECT id, type, section_key, locale, title, body_markdown, version, is_active, created_at, updated_at
       FROM report_templates
       WHERE id = ?`,
      [templateId]
    );
  }
}
