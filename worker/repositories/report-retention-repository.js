/**
 * D1-only restricted report retention queries.
 * No birth-date values, emails, PDF bodies, or raw payloads leave this layer.
 */
import { getDb } from './db-context.js';

export function createReportRetentionRepository(env) {
  const db = getDb(env);
  return {
    async listExpiredRaw(cutoff, limit) {
      const { results = [] } = await db.prepare(
        `SELECT id FROM report_jobs
         WHERE created_at < ?
           AND (input_payload_json <> '{}' OR error_message IS NOT NULL)
         ORDER BY created_at, id LIMIT ?`
      ).bind(cutoff, limit).all();
      return results;
    },
    async redactRaw(id, cutoff) {
      return db.prepare(
        `UPDATE report_jobs SET input_payload_json = '{}',
           error_message = NULL, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND created_at < ?`
      ).bind(id, cutoff).run();
    },
    async listExpiredFiles(cutoff, limit) {
      const { results = [] } = await db.prepare(
        `SELECT id, output_r2_key FROM report_jobs
         WHERE output_r2_key IS NOT NULL
           AND COALESCE(completed_at, created_at) < ?
         ORDER BY created_at, id LIMIT ?`
      ).bind(cutoff, limit).all();
      return results;
    },
    async markFileDeleted(id, key, cutoff) {
      return db.prepare(
        `UPDATE report_jobs SET output_r2_key = NULL, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND output_r2_key = ?
           AND COALESCE(completed_at, created_at) < ?`
      ).bind(id, key, cutoff).run();
    },
    async recordRun({ id, executedAt, cutoff, rawRedacted, filesDeleted, failures, outcome }) {
      return db.prepare(
        `INSERT INTO retention_cleanup_runs
         (id, executed_at, cutoff_at, raw_redacted, files_deleted, failures, outcome)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(id, executedAt, cutoff, rawRedacted, filesDeleted, failures, outcome).run();
    }
  };
}
