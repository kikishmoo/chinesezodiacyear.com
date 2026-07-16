/**
 * Report Service — Business Logic Orchestrator
 *
 * Coordinates report generation flow:
 *   1. Validate template exists and is active
 *   2. Compute idempotency hash from input
 *   3. Check for existing job (deduplication)
 *   4. Create job record
 *   5. Generate content (BaZi chart OR compatibility assembly)
 *   6. Assemble report content from template + data
 *   7. Store PDF in R2
 *   8. Update job status
 *
 * Supports two report categories:
 *   - 'bazi': computes a BaZi chart, then assembles a personalised report
 *   - 'compatibility': assembles pair content from frontend data + worker traits
 *
 * Has no HTTP knowledge — receives typed input, returns typed output.
 * No SQL allowed — all data access via repositories.
 */

import { NotFoundError, ValidationError } from '../models/errors.js';
import { createReportTemplatesRepository } from '../repositories/report-templates-repository.js';
import { createReportJobsRepository } from '../repositories/report-jobs-repository.js';
import { calculate } from './bazi-service.js';
import { renderPdf } from '../lib/pdf-renderer.js';
import { generateSectionContent } from '../data/compatibility-content.js';

/**
 * Generate a deterministic request hash for idempotency.
 * Same input → same hash → same report (no duplicate work).
 *
 * For BaZi: hashes birth data fields.
 * For compatibility: hashes pairSlug + locale (deterministic content).
 *
 * @param {string} templateSlug
 * @param {Object} input — validated input (BaZi or compatibility)
 * @returns {Promise<string>}
 */
async function computeRequestHash(templateSlug, input) {
  const payload = input.pairSlug
    ? JSON.stringify({ t: templateSlug, pair: input.pairSlug, locale: input.locale })
    : JSON.stringify({
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
 * @param {Object} input — validated input (BaZi ReportInput or CompatibilityReportInput)
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

  // Determine report category
  const isCompatibility = template.category === 'compatibility';

  // 4. Create job record
  const jobId = generateId();
  const inputPayload = isCompatibility
    ? JSON.stringify({ pairSlug: input.pairSlug, locale: input.locale, pairData: input.pairData })
    : JSON.stringify({
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

    let reportContent;

    if (isCompatibility) {
      // 5a. Assemble compatibility report (no calculation needed)
      reportContent = assembleCompatibilityReport(template, input);
    } else {
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

      // 5b. Assemble BaZi report from template + chart data
      reportContent = assembleReport(template, chart, input);
    }

    // 5c. Render to PDF
    const pdfBytes = await renderPdf(reportContent);

    // 5d. Store in R2
    const r2Key = `reports/${jobId}.pdf`;
    await storeReport(env, r2Key, pdfBytes);

    // 5e. Mark completed
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
 * Assemble a BaZi report document from template + chart data.
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
 * Assemble a compatibility report from template + pair data.
 * Uses generateSectionContent() to fill section content from pairData.
 *
 * @param {Object} template — report_templates row
 * @param {import('../models/compatibility-report-request.js').CompatibilityReportInput} input
 * @returns {Object} — assembled report content (with `pair` instead of `chart`)
 */
function assembleCompatibilityReport(template, input) {
  const { pairData, locale } = input;

  const sections = generateSectionContent(pairData, locale || 'en');

  return {
    meta: {
      templateId: template.id,
      templateSlug: template.slug,
      templateVersion: template.version,
      generatedAt: new Date().toISOString(),
      locale: locale || template.locale
    },
    pair: {
      animalA: pairData.animalA,
      animalB: pairData.animalB,
      emojiA: pairData.emojiA || '',
      emojiB: pairData.emojiB || '',
      relType: pairData.relType,
      relLabel: pairData.relLabel || pairData.relType,
      fixedElementA: pairData.fixedElementA || '',
      fixedElementB: pairData.fixedElementB || '',
      combinedElement: pairData.combinedElement || null,
      triadElement: pairData.triadElement || null,
      elInteraction: pairData.elInteraction || null
    },
    sections,
    title: `${pairData.animalA} & ${pairData.animalB} Compatibility Report`
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
