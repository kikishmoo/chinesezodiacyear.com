/**
 * Health Route — GET /v1/health
 *
 * Simple health check endpoint for monitoring.
 */

/**
 * @param {Request} request
 * @param {Object} env
 * @param {Object} corsHeaders
 * @returns {Response}
 */
export function handleHealth(request, env, corsHeaders) {
  return Response.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
