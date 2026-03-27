import { getDb } from './db-context.js';

/**
 * Create a report job row.
 * @param {Record<string, any>} env
 * @param {{jobId: string, transactionId: string, reportType: string, status?: string, requestPayload?: string|null}} input
 */
export async function createReportJob(env, input) {
  const db = getDb(env);
  const status = input.status ?? 'queued';

  await db
    .prepare(
      `INSERT INTO report_jobs (
         id, transaction_id, report_type, status, request_payload
       ) VALUES (?, ?, ?, ?, ?)`
    )
    .bind(input.jobId, input.transactionId, input.reportType, status, input.requestPayload ?? null)
    .run();
}

/**
 * Update report job processing state.
 * @param {Record<string, any>} env
 * @param {{jobId: string, status: string, reportPath?: string|null, errorCode?: string|null, errorMessage?: string|null}} input
 */
export async function updateReportJobStatus(env, input) {
  const db = getDb(env);

  await db
    .prepare(
      `UPDATE report_jobs
       SET status = ?, report_path = ?, error_code = ?, error_message = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .bind(
      input.status,
      input.reportPath ?? null,
      input.errorCode ?? null,
      input.errorMessage ?? null,
      input.jobId
    )
    .run();
}
