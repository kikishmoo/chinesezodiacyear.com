/**
 * Tests for compatibility report request validation.
 */

import { describe, it, expect } from 'vitest';
import { validateCompatibilityReportRequest } from '../../models/compatibility-report-request.js';

describe('validateCompatibilityReportRequest', () => {
  const validInput = {
    templateSlug: 'compat-en',
    pairSlug: 'dragon-rooster',
    locale: 'en',
    pairData: {
      animalA: 'Dragon',
      animalB: 'Rooster',
      relType: 'liuHe',
      relLabel: 'Six Harmony — Metal',
      emojiA: '\uD83D\uDC09',
      emojiB: '\uD83D\uDC13'
    }
  };

  it('accepts valid input', () => {
    const result = validateCompatibilityReportRequest(validInput);
    expect(result.templateSlug).toBe('compat-en');
    expect(result.pairSlug).toBe('dragon-rooster');
    expect(result.locale).toBe('en');
    expect(result.pairData.animalA).toBe('Dragon');
    expect(result.pairData.animalB).toBe('Rooster');
  });

  it('defaults locale to en when omitted', () => {
    const result = validateCompatibilityReportRequest({
      ...validInput,
      locale: undefined
    });
    expect(result.locale).toBe('en');
  });

  it('accepts tc locale', () => {
    const result = validateCompatibilityReportRequest({
      ...validInput,
      locale: 'tc'
    });
    expect(result.locale).toBe('tc');
  });

  it('accepts sc locale', () => {
    const result = validateCompatibilityReportRequest({
      ...validInput,
      locale: 'sc'
    });
    expect(result.locale).toBe('sc');
  });

  it('throws on null body', () => {
    expect(() => validateCompatibilityReportRequest(null))
      .toThrow('Request body must be a JSON object');
  });

  it('throws on missing templateSlug', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      templateSlug: undefined
    })).toThrow('templateSlug is required');
  });

  it('throws on empty templateSlug', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      templateSlug: ''
    })).toThrow('templateSlug is required');
  });

  it('throws on invalid templateSlug format', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      templateSlug: 'UPPERCASE'
    })).toThrow('templateSlug must contain only lowercase');
  });

  it('throws on missing pairSlug', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      pairSlug: undefined
    })).toThrow('pairSlug is required');
  });

  it('throws on invalid pairSlug format', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      pairSlug: 'Dragon-Rooster'
    })).toThrow('pairSlug must be two lowercase animal names');
  });

  it('throws on pairSlug without hyphen', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      pairSlug: 'dragonrooster'
    })).toThrow('pairSlug must be two lowercase animal names');
  });

  it('throws on invalid locale', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      locale: 'fr'
    })).toThrow('locale must be one of: en, tc, sc');
  });

  it('throws on missing pairData', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      pairData: undefined
    })).toThrow('pairData is required');
  });

  it('throws on pairData not an object', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      pairData: 'not-an-object'
    })).toThrow('pairData is required');
  });

  it('throws on missing pairData.animalA', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      pairData: { ...validInput.pairData, animalA: undefined }
    })).toThrow('pairData.animalA is required');
  });

  it('throws on missing pairData.animalB', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      pairData: { ...validInput.pairData, animalB: undefined }
    })).toThrow('pairData.animalB is required');
  });

  it('throws on missing pairData.relType', () => {
    expect(() => validateCompatibilityReportRequest({
      ...validInput,
      pairData: { ...validInput.pairData, relType: undefined }
    })).toThrow('pairData.relType is required');
  });

  it('accepts slug with digits', () => {
    const result = validateCompatibilityReportRequest({
      ...validInput,
      templateSlug: 'compat-v2'
    });
    expect(result.templateSlug).toBe('compat-v2');
  });
});
