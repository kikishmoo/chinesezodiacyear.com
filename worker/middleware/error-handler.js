/**
 * Error Handler Middleware
 *
 * Maps typed errors to structured JSON responses.
 * Unrecognised errors become 500s.
 */

import { ValidationError, UpstreamError, TimeoutError, CircuitOpenError } from '../models/errors.js';

/**
 * Map an error to a structured JSON response.
 * @param {Error} error
 * @param {Object} corsHeaders — CORS headers to include
 * @returns {Response}
 */
export function errorToResponse(error, corsHeaders) {
  const status = error.status || 500;
  const retryable = error.retryable ?? false;
  const code = error.name || 'InternalError';
  const message = error.message || 'Internal error';

  // Log upstream/timeout errors for observability
  if (error instanceof UpstreamError || error instanceof TimeoutError) {
    console.error(`[${code}] source=${error.source} message=${message}`);
  }

  return Response.json(
    {
      error: {
        code,
        message,
        retryable
      }
    },
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
