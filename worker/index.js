/**
 * BaZi Calculator — Cloudflare Worker Entry Point
 *
 * Wires router, middleware, and route handlers.
 * Backwards-compatible: POST / still works (alias for /v1/bazi/calculate).
 *
 * Routes:
 *   POST /                    → BaZi calculate (legacy, backwards-compat)
 *   POST /v1/bazi/calculate   → BaZi calculate (canonical)
 *   GET  /v1/health           → Health check
 */

import { Router } from './router.js';
import { resolveCorsOrigin, buildCorsHeaders, handlePreflight } from './middleware/cors.js';
import { errorToResponse } from './middleware/error-handler.js';
import { handleBaziCalculate } from './routes/bazi.js';
import { handleHealth } from './routes/health.js';

/* ── Route table ──────────────────────────────────────── */

const router = new Router();

// Canonical v1 routes
router.post('/v1/bazi/calculate', handleBaziCalculate);
router.get('/v1/health', handleHealth);

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

    // Route dispatch
    const url = new URL(request.url);
    const route = router.match(request.method, url.pathname);

    if (!route) {
      return Response.json(
        { error: { code: 'NotFound', message: 'Route not found', retryable: false } },
        { status: 404, headers: corsHeaders }
      );
    }

    try {
      return await route.handler(request, env, corsHeaders);
    } catch (error) {
      return errorToResponse(error, corsHeaders);
    }
  }
};
