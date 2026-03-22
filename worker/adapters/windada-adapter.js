/**
 * Windada Adapter — True Solar Time
 *
 * Fetches True Solar Time from fate.windada.com.
 * The BDayInfo endpoint accepts birth datetime + coordinates,
 * returns an HTML page with the corrected solar time.
 *
 * Adapter interface: { fetch(params), parse(html) }
 */

import { UpstreamError, TimeoutError } from '../models/errors.js';

const WINDADA_URL = 'https://fate.windada.com/cgi-bin/SolarTime_gb';
const USER_AGENT = 'Mozilla/5.0 (compatible; BaZiCalc/1.0)';

/**
 * Build the upstream request params.
 * @param {Object} params — { year, month, day, hour, minute, lat, lng, tz }
 * @returns {URLSearchParams}
 */
function buildParams({ year, month, day, hour, minute, lat, lng, tz }) {
  return new URLSearchParams({
    FUNC: 'BDayInfo',
    latitude: String(lat),
    longitude: String(lng),
    TZName: tz,
    Year: String(year),
    Month: String(month),
    Day: String(day),
    Hour: String(hour),
    Min: String(minute),
    Sec: '0'
  });
}

/**
 * Parse the True Solar Time from Windada's HTML response.
 *
 * Response format: 真太阳时:</td><td...>YYYY/MM/DD HH:MM:SS</td>
 *
 * @param {string} html — raw HTML response
 * @returns {{ year: number, month: number, day: number, hour: number, minute: number, second: number }|null}
 */
export function parse(html) {
  const match = html.match(
    /真太阳时[^<]*<\/td>\s*<td[^>]*>\s*(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/
  );

  if (!match) return null;

  return {
    year: parseInt(match[1]),
    month: parseInt(match[2]),
    day: parseInt(match[3]),
    hour: parseInt(match[4]),
    minute: parseInt(match[5]),
    second: parseInt(match[6])
  };
}

/**
 * Fetch True Solar Time from the Windada upstream service.
 *
 * @param {Object} params — { year, month, day, hour, minute, lat, lng, tz }
 * @returns {Promise<{ year: number, month: number, day: number, hour: number, minute: number, second: number }|null>}
 * @throws {UpstreamError|TimeoutError}
 */
export async function fetchSolarTime(params) {
  const body = buildParams(params);

  let resp;
  try {
    resp = await fetch(WINDADA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT
      },
      body: body.toString()
    });
  } catch (e) {
    if (e.name === 'AbortError' || e.message?.includes('timeout')) {
      throw new TimeoutError('Windada solar time request timed out', { source: 'windada' });
    }
    throw new UpstreamError(`Windada request failed: ${e.message}`, { source: 'windada', cause: e });
  }

  if (!resp.ok) {
    throw new UpstreamError(`Windada returned HTTP ${resp.status}`, { source: 'windada' });
  }

  const html = await resp.text();
  return parse(html);
}
