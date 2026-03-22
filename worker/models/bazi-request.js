/**
 * BaZi request validation.
 *
 * Validates and normalises incoming request bodies before
 * they reach the service layer.
 */

import { ValidationError } from './errors.js';

/**
 * @typedef {Object} BaziInput
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number|null} hour
 * @property {number|null} minute
 * @property {number|null} lat
 * @property {number|null} lng
 * @property {string|null} tz
 * @property {string} sex
 */

/**
 * Validate and normalise a raw request body into a BaziInput.
 * @param {Object} body — raw JSON body from the request
 * @returns {BaziInput}
 * @throws {ValidationError}
 */
export function validateBaziRequest(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body must be a JSON object');
  }

  const { year, month, day, hour, minute, lat, lng, tz, sex } = body;

  if (!year || !month || !day) {
    throw new ValidationError('year, month, and day are required');
  }

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (!Number.isInteger(y) || y < 1900 || y > 2100) {
    throw new ValidationError('year must be an integer between 1900 and 2100');
  }
  if (!Number.isInteger(m) || m < 1 || m > 12) {
    throw new ValidationError('month must be an integer between 1 and 12');
  }
  if (!Number.isInteger(d) || d < 1 || d > 31) {
    throw new ValidationError('day must be an integer between 1 and 31');
  }

  const hasTime = hour !== undefined && hour !== null && hour !== '';
  const h = hasTime ? Number(hour) : null;
  const min = hasTime ? Number(minute || 0) : null;

  if (hasTime && (!Number.isInteger(h) || h < 0 || h > 23)) {
    throw new ValidationError('hour must be an integer between 0 and 23');
  }
  if (hasTime && min !== null && (!Number.isInteger(min) || min < 0 || min > 59)) {
    throw new ValidationError('minute must be an integer between 0 and 59');
  }

  const parsedLat = lat != null ? Number(lat) : null;
  const parsedLng = lng != null ? Number(lng) : null;

  if (parsedLat !== null && (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90)) {
    throw new ValidationError('lat must be a number between -90 and 90');
  }
  if (parsedLng !== null && (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180)) {
    throw new ValidationError('lng must be a number between -180 and 180');
  }

  const validSex = (sex === 'female') ? 'female' : 'male';

  return {
    year: y,
    month: m,
    day: d,
    hour: h,
    minute: min,
    lat: parsedLat,
    lng: parsedLng,
    tz: tz || null,
    sex: validSex
  };
}
