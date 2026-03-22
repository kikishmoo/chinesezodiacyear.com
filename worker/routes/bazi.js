/**
 * BaZi Route — POST /v1/bazi/calculate
 *
 * Validates request, delegates to service, returns chart JSON.
 */

import { validateBaziRequest } from '../models/bazi-request.js';
import { calculate } from '../services/bazi-service.js';

/**
 * @param {Request} request
 * @param {Object} env
 * @param {Object} corsHeaders
 * @returns {Promise<Response>}
 */
export async function handleBaziCalculate(request, env, corsHeaders) {
  const body = await request.json();
  const input = validateBaziRequest(body);
  const result = await calculate(input);

  return Response.json(result, {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
