/**
 * Report Service — Business Logic Orchestrator
 *
 * Coordinates report generation flow:
 *   1. Validate template exists and is active
 *   2. Compute idempotency hash from input
 *   3. Check for existing job (deduplication)
 *   4. Create job record
 *   5. Generate BaZi chart
 *   6. Assemble report content from template + chart
 *   7. Store PDF in R2
 *   8. Update job status
 *
 * Has no HTTP knowledge — receives typed input, returns typed output.
 * No SQL allowed — all data access via repositories.
 */

import { NotFoundError, ValidationError } from '../models/errors.js';
import { createReportTemplatesRepository } from '../repositories/report-templates-repository.js';
import { createReportJobsRepository } from '../repositories/report-jobs-repository.js';
import { calculate } from './bazi-service.js';
import { renderPdf } from '../lib/pdf-renderer.js';

/**
 * Generate a deterministic request hash for idempotency.
 * Same input → same hash → same report (no duplicate work).
 *
 * @param {string} templateSlug
 * @param {import('../models/report-request.js').ReportInput} input
 * @returns {Promise<string>}
 */
async function computeRequestHash(templateSlug, input) {
  const payload = JSON.stringify({
    t: templateSlug,
    y: input.year,
    m: input.month,
    d: input.day,
    h: input.hour,
    min: input.minute,
    lat: input.lat,
    lng: input.lng,
    tz: input.tz,
    sex: input.sex
  });

  const data = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a UUID v4 using the Web Crypto API.
 * @returns {string}
 */
function generateId() {
  return crypto.randomUUID();
}

/**
 * Request a report generation.
 *
 * Idempotent: if the same input was already submitted, returns the existing job.
 *
 * @param {Record<string, unknown>} env — Worker env bindings
 * @param {import('../models/report-request.js').ReportInput} input — validated input
 * @returns {Promise<{ jobId: string, status: string, templateSlug: string, isNew: boolean }>}
 */
export async function requestReport(env, input) {
  const templates = createReportTemplatesRepository(env);
  const jobs = createReportJobsRepository(env);

  // 1. Validate template exists and is active
  const template = await templates.getBySlug(input.templateSlug);
  if (!template || template.is_active !== 1) {
    throw new NotFoundError(`Report template "${input.templateSlug}" not found or inactive`);
  }

  // 2. Compute idempotency hash
  const requestHash = await computeRequestHash(input.templateSlug, input);

  // 3. Check for existing job (deduplication)
  const existingJob = await jobs.getByRequestHash(requestHash);
  if (existingJob) {
    return {
      jobId: existingJob.id,
      status: existingJob.status,
      templateSlug: input.templateSlug,
      isNew: false
    };
  }

  // 4. Create job record
  const jobId = generateId();
  const inputPayload = JSON.stringify({
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute,
    lat: input.lat,
    lng: input.lng,
    tz: input.tz,
    sex: input.sex,
    email: input.email
  });

  await jobs.create({
    id: jobId,
    templateId: template.id,
    requestHash,
    status: 'queued',
    inputPayloadJson: inputPayload
  });

  // 5. Process synchronously for MVP (future: queue + async)
  try {
    await jobs.updateStatus(jobId, 'processing');

    // 5a. Generate BaZi chart
    const chart = await calculate({
      year: input.year,
      month: input.month,
      day: input.day,
      hour: input.hour,
      minute: input.minute,
      lat: input.lat,
      lng: input.lng,
      tz: input.tz,
      sex: input.sex
    });

    // 5b. Assemble report from template + chart data
    const reportContent = assembleReport(template, chart, input);

    // 5c. Render to PDF
    const pdfBytes = await renderPdf(reportContent);

    // 5d. Store in R2
    const r2Key = `reports/${jobId}.pdf`;
    await storeReport(env, r2Key, pdfBytes);

    // 5d. Mark completed
    await jobs.updateStatus(jobId, 'completed', { outputR2Key: r2Key });

    return {
      jobId,
      status: 'completed',
      templateSlug: input.templateSlug,
      isNew: true
    };
  } catch (err) {
    // Record failure but don't lose the job
    await jobs.updateStatus(jobId, 'failed', {
      errorMessage: err.message || 'Unknown error during report generation'
    }).catch(() => {}); // swallow update errors

    throw err;
  }
}

/**
 * Get the status and download info for an existing report job.
 *
 * @param {Record<string, unknown>} env
 * @param {string} jobId
 * @returns {Promise<{ jobId: string, status: string, downloadUrl: string|null, error: string|null, createdAt: string }>}
 */
export async function getReportStatus(env, jobId) {
  const jobs = createReportJobsRepository(env);
  const job = await jobs.getById(jobId);

  if (!job) {
    throw new NotFoundError(`Report job "${jobId}" not found`);
  }

  let downloadUrl = null;
  if (job.status === 'completed' && job.output_r2_key) {
    // Return a pre-signed or direct URL
    // For MVP: return the R2 key; the route handler will generate a signed URL
    downloadUrl = job.output_r2_key;
  }

  return {
    jobId: job.id,
    status: job.status,
    downloadUrl,
    error: job.error_message || null,
    createdAt: job.created_at
  };
}

/**
 * Assemble a report document from template + chart data.
 * Returns a JSON structure that will later be rendered to PDF.
 *
 * @param {Object} template — report_templates row
 * @param {Object} chart — BaZi chart result
 * @param {import('../models/report-request.js').ReportInput} input
 * @returns {Object} — assembled report content
 */
function assembleReport(template, chart, input) {
  const templateData = JSON.parse(template.template_json);

  return {
    meta: {
      templateId: template.id,
      templateSlug: template.slug,
      templateVersion: template.version,
      generatedAt: new Date().toISOString(),
      locale: template.locale
    },
    subject: {
      birthDate: `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}`,
      birthTime: input.hour !== null ? `${String(input.hour).padStart(2, '0')}:${String(input.minute || 0).padStart(2, '0')}` : null,
      sex: input.sex
    },
    chart,
    sections: templateData.sections || [],
    title: template.title
  };
}

/**
 * Store rendered PDF report in R2.
 *
 * @param {Record<string, unknown>} env
 * @param {string} key — R2 object key
 * @param {Uint8Array} pdfBytes — rendered PDF bytes
 */
async function storeReport(env, key, pdfBytes) {
  const bucket = env.REPORTS_BUCKET;
  if (!bucket) {
    throw new ValidationError('R2 binding REPORTS_BUCKET is not configured');
  }

  await bucket.put(key, pdfBytes, {
    httpMetadata: { contentType: 'application/pdf' }
  });
}
