/**
 * BaZi Service — Business Logic Orchestrator
 *
 * Coordinates the flow: cache check → solar time correction → chart fetch → cache store.
 * Has no HTTP knowledge — receives typed input, returns typed output.
 *
 * Resilience stack:
 *   - Cache: deterministic results cached 24h (Cache API)
 *   - Retry: exponential backoff (2 retries, 500ms/1s)
 *   - Circuit breaker: per-host state machine (5 failures → 30s open)
 */

import { fetchChart } from '../adapters/zhouyi-adapter.js';
import { getSolarTime } from './solar-time-service.js';
import { cacheGet, cachePut } from '../lib/cache.js';
import { withRetry } from '../lib/retry.js';
import { getBreaker } from '../lib/circuit-breaker.js';

/**
 * Calculate a BaZi chart for the given input.
 *
 * @param {import('../models/bazi-request.js').BaziInput} input — validated input
 * @returns {Promise<import('../models/bazi-response.js').BaziResponse>}
 */
export async function calculate(input) {
  // Step 0: Check cache (BaZi charts are deterministic)
  const cached = await cacheGet(input);
  if (cached) return cached;

  const { year, month, day, hour, minute, lat, lng, tz, sex } = input;

  const hasTime = hour !== null;
  const hasLocation = lat !== null && lng !== null && tz !== null;

  let solarYear = year;
  let solarMonth = month;
  let solarDay = day;
  let solarHour = hasTime ? hour : null;
  let solarMinute = hasTime ? minute : null;

  // Step 1: Get True Solar Time if location + time provided
  //         (solar-time-service handles retry + circuit breaker + graceful degradation)
  if (hasTime && hasLocation) {
    const solarTime = await getSolarTime({
      year, month, day, hour: solarHour, minute: solarMinute, lat, lng, tz
    });

    if (solarTime) {
      solarHour = solarTime.hour;
      solarMinute = solarTime.minute;
      if (solarTime.year) solarYear = solarTime.year;
      if (solarTime.month) solarMonth = solarTime.month;
      if (solarTime.day) solarDay = solarTime.day;
    }
  }

  // Step 2: Get BaZi chart (with retry + circuit breaker)
  const zhBreaker = getBreaker('zhouyi');
  const chart = await zhBreaker.execute(() =>
    withRetry(
      () => fetchChart({
        year: solarYear,
        month: solarMonth,
        day: solarDay,
        hour: solarHour,
        minute: solarMinute,
        sex,
        useTrueSolarTime: (hasTime && hasLocation) ? 1 : 0
      }),
      { maxRetries: 2, baseDelay: 500, label: 'zhouyi-chart' }
    )
  );

  // Step 3: Assemble response
  const result = {
    ...chart,
    trueSolarTime: (hasTime && hasLocation) ? {
      hour: solarHour,
      minute: solarMinute,
      year: solarYear,
      month: solarMonth,
      day: solarDay
    } : null,
    input: { year, month, day, hour, minute, lat, lng, tz, sex }
  };

  // Step 4: Store in cache (fire-and-forget)
  cachePut(input, result).catch(() => {});

  return result;
}
