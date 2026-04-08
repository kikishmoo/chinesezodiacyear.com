/**
 * BaZi Calculator & Report API — Cloudflare Worker Entry Point
 *
 * Wires router, middleware, and route handlers.
 * Backwards-compatible: POST / still works (alias for /v1/bazi/calculate).
 *
 * Routes:
 *   POST /                           → BaZi calculate (legacy, backwards-compat)
 *   POST /v1/bazi/calculate          → BaZi calculate (canonical)
 *   GET  /v1/health                  → Health check
 *   POST /v1/reports                 → Request report generation
 *   GET  /v1/reports/:jobId          → Poll report job status
 *   GET  /v1/reports/:jobId/download → Download completed report
 *   GET  /v1/checkout/client-id      → PayPal client ID for frontend SDK
 *   POST /v1/checkout/create-order   → Create PayPal order for report purchase
 *   POST /v1/checkout/capture-order  → Capture approved PayPal payment + trigger report
 */

import { Router } from './router.js';
import { resolveCorsOrigin, buildCorsHeaders, handlePreflight } from './middleware/cors.js';
import { checkRateLimit } from './middleware/rate-limiter.js';
import { errorToResponse } from './middleware/error-handler.js';
import { handleBaziCalculate } from './routes/bazi.js';
import { handleHealth } from './routes/health.js';
import { handleCreateReport, handleGetReport, handleDownloadReport } from './routes/report.js';
import { handleGetClientId, handleCreateOrder, handleCaptureOrder } from './routes/checkout.js';

/* ── Route table ──────────────────────────────────────── */

const router = new Router();

// Canonical v1 routes — BaZi
router.post('/v1/bazi/calculate', handleBaziCalculate);
router.get('/v1/health', handleHealth);

// Canonical v1 routes — Reports
router.post('/v1/reports', handleCreateReport);
router.get('/v1/reports/:jobId', handleGetReport);
router.get('/v1/reports/:jobId/download', handleDownloadReport);

// Canonical v1 routes — Checkout (PayPal)
router.get('/v1/checkout/client-id', handleGetClientId);
router.post('/v1/checkout/create-order', handleCreateOrder);
router.post('/v1/checkout/capture-order', handleCaptureOrder);

// Legacy: POST / → same handler (backwards-compatible)
router.post('/', handleBaziCalculate);

/* ── Worker entry ─────────────────────────────────────── */

export default {
  async fetch(request, env) {
    const corsOrigin = resolveCorsOrigin(request, env);
    const corsHeaders = buildCorsHeaders(corsOrigin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return handlePreflight(corsHeaders);
    }

    // Rate limiting (dual-layer: in-memory + KV)
    const rateLimited = await checkRateLimit(request, env, corsHeaders);
    if (rateLimited) return rateLimited;

    // Route dispatch
    const url = new URL(request.url);
    const matched = router.match(request.method, url.pathname);

    if (!matched) {
      return Response.json(
        { error: { code: 'NotFound', message: 'Route not found', retryable: false } },
        { status: 404, headers: corsHeaders }
      );
    }

    try {
      return await matched.route.handler(request, env, corsHeaders, matched.params);
    } catch (error) {
      return errorToResponse(error, corsHeaders);
    }
  }
};
