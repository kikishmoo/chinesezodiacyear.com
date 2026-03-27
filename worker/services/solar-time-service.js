/**
 * Solar Time Service — True Solar Time correction.
 *
 * Extracted from bazi-service.js for independent testability.
 * Wraps the windada adapter with resilience (retry + circuit breaker)
 * and provides a clean interface for solar time correction.
 *
 * @module worker/services/solar-time-service
 */

import { fetchSolarTime } from '../adapters/windada-adapter.js';
import { withRetry } from '../lib/retry.js';
import { getBreaker } from '../lib/circuit-breaker.js';

/**
 * Correct birth time to True Solar Time using geographic coordinates.
 *
 * Returns corrected datetime components, or null if:
 * - Solar time API fails (graceful degradation to clock time)
 * - Circuit breaker is open (upstream known-down)
 * - Parse returns no result
 *
 * @param {Object} params
 * @param {number} params.year
 * @param {number} params.month
 * @param {number} params.day
 * @param {number} params.hour
 * @param {number} params.minute
 * @param {number} params.lat — latitude
 * @param {number} params.lng — longitude
 * @param {string} params.tz — timezone name (e.g. 'Asia/Shanghai')
 * @returns {Promise<{ year: number, month: number, day: number, hour: number, minute: number, second: number }|null>}
 */
export async function getSolarTime(params) {
  const breaker = getBreaker('windada');

  try {
    return await breaker.execute(() =>
      withRetry(
        () => fetchSolarTime(params),
        { maxRetries: 2, baseDelay: 500, label: 'windada-solar-time' }
      )
    );
  } catch (e) {
    // Graceful degradation: solar time failure should never block chart calculation
    console.error('Solar time correction failed:', e.message);
    return null;
  }
}
