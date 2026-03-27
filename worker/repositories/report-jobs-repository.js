/**
 * Repository: report_jobs
 */

import { getDb, queryOne, execute } from './db-client.js';

const BASE_COLUMNS = `
  id,
  template_id,
  request_hash,
  status,
  input_payload_json,
  output_r2_key,
  error_message,
  started_at,
  completed_at,
  created_at,
  updated_at
`;

/**
 * @param {Record<string, unknown>} env
 */
export function createReportJobsRepository(env) {
  const db = getDb(env);

  return {
    /**
     * @param {string} requestHash
     */
    async getByRequestHash(requestHash) {
      return queryOne(
        db,
        `SELECT ${BASE_COLUMNS}
         FROM report_jobs
         WHERE request_hash = ?
         LIMIT 1`,
        [requestHash]
      );
    },

    /**
     * @param {{
     *  id: string,
     *  templateId: string,
     *  requestHash: string,
     *  status: 'queued' | 'processing' | 'completed' | 'failed',
     *  inputPayloadJson: string
     * }} input
     */
    async create(input) {
      const { id, templateId, requestHash, status, inputPayloadJson } = input;

      await execute(
        db,
        `INSERT INTO report_jobs (
           id, template_id, request_hash, status, input_payload_json
         ) VALUES (?, ?, ?, ?, ?)`,
        [id, templateId, requestHash, status, inputPayloadJson]
      );

      return this.getByRequestHash(requestHash);
    },

    /**
     * @param {string} id
     * @param {'queued' | 'processing' | 'completed' | 'failed'} status
     * @param {{ outputR2Key?: string|null, errorMessage?: string|null }} [meta]
     */
    async updateStatus(id, status, meta = {}) {
      const outputR2Key = meta.outputR2Key ?? null;
      const errorMessage = meta.errorMessage ?? null;

      await execute(
        db,
        `UPDATE report_jobs
         SET status = ?,
             output_r2_key = ?,
             error_message = ?,
             updated_at = CURRENT_TIMESTAMP,
             started_at = CASE WHEN ? = 'processing' AND started_at IS NULL THEN CURRENT_TIMESTAMP ELSE started_at END,
             completed_at = CASE WHEN ? IN ('completed', 'failed') THEN CURRENT_TIMESTAMP ELSE completed_at END
         WHERE id = ?`,
        [status, outputR2Key, errorMessage, status, status, id]
      );
    }
  };
}
