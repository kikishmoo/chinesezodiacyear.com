import { BaseD1Repository } from './base-d1-repository.js';

export class ReportJobRepository extends BaseD1Repository {
  /**
   * @param {{
   *  jobId: string,
   *  userEmail: string,
   *  reportType: string,
   *  status?: string,
   *  paidAt?: string|null,
   *  expiresAt?: string|null,
   *  payloadJson?: string|null,
   *  outputUrl?: string|null
   * }} data
   */
  create(data) {
    const {
      jobId,
      userEmail,
      reportType,
      status = 'queued',
      paidAt = null,
      expiresAt = null,
      payloadJson = null,
      outputUrl = null
    } = data;

    return this.run(
      `INSERT INTO report_jobs
       (job_id, user_email, report_type, status, paid_at, expires_at, payload_json, output_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [jobId, userEmail, reportType, status, paidAt, expiresAt, payloadJson, outputUrl]
    );
  }

  /**
   * @param {string} jobId
   */
  findByJobId(jobId) {
    return this.first(
      `SELECT id, job_id, user_email, report_type, status, paid_at, expires_at, payload_json, output_url, created_at, updated_at
       FROM report_jobs
       WHERE job_id = ?`,
      [jobId]
    );
  }

  /**
   * @param {string} jobId
   * @param {'queued'|'processing'|'completed'|'failed'|'expired'} status
   * @param {string|null} outputUrl
   */
  updateStatus(jobId, status, outputUrl = null) {
    return this.run(
      `UPDATE report_jobs
       SET status = ?, output_url = COALESCE(?, output_url), updated_at = CURRENT_TIMESTAMP
       WHERE job_id = ?`,
      [status, outputUrl, jobId]
    );
  }
}
