/**
 * Compatibility report request validation.
 *
 * Validates incoming compatibility report generation requests.
 * A compatibility report request wraps a pair slug + optional pair data.
 */

import { ValidationError } from './errors.js';

/**
 * @typedef {Object} CompatibilityReportInput
 * @property {string} templateSlug — report template identifier (e.g. 'compat-en')
 * @property {string} pairSlug — canonical pair slug (e.g. 'dragon-rooster')
 * @property {string} locale — 'en', 'tc', or 'sc'
 * @property {Object} pairData — pair content (animal traits, relationship, elements)
 */

const VALID_LOCALES = new Set(['en', 'tc', 'sc']);
const PAIR_SLUG_RE = /^[a-z]+-[a-z]+$/;
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Validate and normalise a compatibility report generation request.
 * @param {Object} body — raw JSON body
 * @returns {CompatibilityReportInput}
 * @throws {ValidationError}
 */
export function validateCompatibilityReportRequest(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body must be a JSON object');
  }

  const { templateSlug, pairSlug, locale, pairData } = body;

  // Template slug
  if (!templateSlug || typeof templateSlug !== 'string' || templateSlug.trim().length === 0) {
    throw new ValidationError('templateSlug is required and must be a non-empty string');
  }
  if (!SLUG_RE.test(templateSlug)) {
    throw new ValidationError('templateSlug must contain only lowercase letters, digits, and hyphens');
  }

  // Pair slug
  if (!pairSlug || typeof pairSlug !== 'string') {
    throw new ValidationError('pairSlug is required (e.g. "dragon-rooster")');
  }
  if (!PAIR_SLUG_RE.test(pairSlug)) {
    throw new ValidationError('pairSlug must be two lowercase animal names joined by a hyphen');
  }

  // Locale
  const normLocale = locale ? String(locale).trim() : 'en';
  if (!VALID_LOCALES.has(normLocale)) {
    throw new ValidationError('locale must be one of: en, tc, sc');
  }

  // Pair data — required but we accept partial (worker fills gaps)
  if (!pairData || typeof pairData !== 'object') {
    throw new ValidationError('pairData is required and must be an object');
  }

  // Minimal required fields in pairData
  const { animalA, animalB, relType } = pairData;
  if (!animalA || typeof animalA !== 'string') {
    throw new ValidationError('pairData.animalA is required');
  }
  if (!animalB || typeof animalB !== 'string') {
    throw new ValidationError('pairData.animalB is required');
  }
  if (!relType || typeof relType !== 'string') {
    throw new ValidationError('pairData.relType is required');
  }

  return {
    templateSlug: templateSlug.trim(),
    pairSlug: pairSlug.trim(),
    locale: normLocale,
    pairData
  };
}
