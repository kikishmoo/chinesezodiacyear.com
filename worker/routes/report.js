/**
 * Report Routes
 *
 *   POST /v1/reports          → Request a new report generation
 *   GET  /v1/reports/:jobId   → Poll job status / get download info
 *   GET  /v1/reports/:jobId/download → Download completed report
 */

import { validateReportRequest } from '../models/report-request.js';
import { requestReport, getReportStatus } from '../services/report-service.js';
import { NotFoundError, ValidationError } from '../models/errors.js';

/**
 * POST /v1/reports — Request a new report.
 *
 * @param {Request} request
 * @param {Object} env
 * @param {Object} corsHeaders
 * @returns {Promise<Response>}
 */
export async function handleCreateReport(request, env, corsHeaders) {
  const body = await request.json();
  const input = validateReportRequest(body);
  const result = await requestReport(env, input);

  const status = result.isNew ? 201 : 200;

  return Response.json(
    {
      data: {
        jobId: result.jobId,
        status: result.status,
        templateSlug: result.templateSlug
      }
    },
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

/**
 * GET /v1/reports/:jobId — Poll report job status.
 *
 * @param {Request} request
 * @param {Object} env
 * @param {Object} corsHeaders
 * @param {Object} params — { jobId: string }
 * @returns {Promise<Response>}
 */
export async function handleGetReport(request, env, corsHeaders, params) {
  const { jobId } = params;

  if (!jobId || typeof jobId !== 'string') {
    throw new ValidationError('jobId path parameter is required');
  }

  const result = await getReportStatus(env, jobId);

  return Response.json(
    { data: result },
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

/**
 * GET /v1/reports/:jobId/download — Download a completed report PDF.
 *
 * Streams the rendered PDF from R2.
 *
 * @param {Request} request
 * @param {Object} env
 * @param {Object} corsHeaders
 * @param {Object} params — { jobId: string }
 * @returns {Promise<Response>}
 */
export async function handleDownloadReport(request, env, corsHeaders, params) {
  const { jobId } = params;

  if (!jobId || typeof jobId !== 'string') {
    throw new ValidationError('jobId path parameter is required');
  }

  const result = await getReportStatus(env, jobId);

  if (result.status !== 'completed' || !result.downloadUrl) {
    return Response.json(
      {
        error: {
          code: 'ReportNotReady',
          message: result.status === 'failed'
            ? 'Report generation failed'
            : 'Report is still being generated',
          retryable: result.status === 'processing' || result.status === 'queued'
        }
      },
      {
        status: result.status === 'failed' ? 422 : 202,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // Fetch from R2
  const bucket = env.REPORTS_BUCKET;
  if (!bucket) {
    throw new ValidationError('R2 binding REPORTS_BUCKET is not configured');
  }

  const object = await bucket.get(result.downloadUrl);
  if (!object) {
    throw new NotFoundError('Report file not found in storage');
  }

  return new Response(object.body, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bazi-report-${jobId}.pdf"`,
      'Cache-Control': 'private, max-age=3600'
    }
  });
}
