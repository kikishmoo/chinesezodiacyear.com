/**
 * BaZi Service — Business Logic Orchestrator
 *
 * Coordinates the flow: validate → solar time correction → chart fetch.
 * Has no HTTP knowledge — receives typed input, returns typed output.
 */

import { fetchSolarTime } from '../adapters/windada-adapter.js';
import { fetchChart } from '../adapters/zhouyi-adapter.js';

/**
 * Calculate a BaZi chart for the given input.
 *
 * @param {import('../models/bazi-request.js').BaziInput} input — validated input
 * @returns {Promise<Object>} — chart data + trueSolarTime + original input
 */
export async function calculate(input) {
  const { year, month, day, hour, minute, lat, lng, tz, sex } = input;

  const hasTime = hour !== null;
  const hasLocation = lat !== null && lng !== null && tz !== null;

  let solarYear = year;
  let solarMonth = month;
  let solarDay = day;
  let solarHour = hasTime ? hour : null;
  let solarMinute = hasTime ? minute : null;

  // Step 1: Get True Solar Time if location + time provided
  if (hasTime && hasLocation) {
    try {
      const solarTime = await fetchSolarTime({
        year, month, day, hour: solarHour, minute: solarMinute, lat, lng, tz
      });

      if (solarTime) {
        solarHour = solarTime.hour;
        solarMinute = solarTime.minute;
        if (solarTime.year) solarYear = solarTime.year;
        if (solarTime.month) solarMonth = solarTime.month;
        if (solarTime.day) solarDay = solarTime.day;
      }
    } catch (e) {
      // Fall back to clock time if solar time API fails
      console.error('Solar time API error:', e.message);
    }
  }

  // Step 2: Get BaZi chart
  const chart = await fetchChart({
    year: solarYear,
    month: solarMonth,
    day: solarDay,
    hour: solarHour,
    minute: solarMinute,
    sex,
    useTrueSolarTime: (hasTime && hasLocation) ? 1 : 0
  });

  // Step 3: Assemble response
  return {
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
}
