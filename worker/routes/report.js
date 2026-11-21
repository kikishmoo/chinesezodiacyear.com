/**
 * Report Routes
 *
 *   POST /v1/reports          → Request a new report generation
 *   GET  /v1/reports/:jobId   → Poll job status / get download info
 *   GET  /v1/reports/:jobId/download → Download completed report
 */

import { getReportStatus } from '../services/report-service.js';
import { getPaidTransactionByReportJobId } from '../repositories/transaction-repository.js';
import { bearerCheckoutToken, hashCheckoutToken } from '../lib/checkout-token.js';
import { NotFoundError, ValidationError } from '../models/errors.js';

/** Paid checkout is the only route allowed to invoke report generation. */
async function requirePaidReportClaim(request, env, jobId) {
  const token = bearerCheckoutToken(request);
  if (!token) return false;
  const tokenHash = await hashCheckoutToken(token);
  if (!tokenHash) return false;
  const tx = await getPaidTransactionByReportJobId(env, jobId, tokenHash);
  return Boolean(tx);
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

  if (!await requirePaidReportClaim(request, env, jobId)) {
    return Response.json({ error: { code: 'NotFound', message: 'Report not found' } },
      { status: 404, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
  }
  const result = await getReportStatus(env, jobId);

  // Internal R2 object keys must never be returned by the status endpoint.
  const { downloadUrl: _internalR2Key, ...publicStatus } = result;
  return Response.json(
    { data: publicStatus },
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
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

  if (!await requirePaidReportClaim(request, env, jobId)) {
    return Response.json({ error: { code: 'NotFound', message: 'Report not found' } },
      { status: 404, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
  }
  const result = await getReportStatus(env, jobId);

  if (result.status === 'completed' && !result.downloadUrl) {
    return Response.json({ error: { code: 'ReportExpired', message: 'Report is no longer available; contact support', retryable: false } },
      { status: 410, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
  }
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
      'Cache-Control': 'private, no-store',
      'Referrer-Policy': 'no-referrer'
    }
  });
}
