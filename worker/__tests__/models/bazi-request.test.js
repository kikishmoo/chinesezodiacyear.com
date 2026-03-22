/**
 * Tests for BaZi request validation.
 */

import { describe, it, expect } from 'vitest';
import { validateBaziRequest } from '../../models/bazi-request.js';

describe('validateBaziRequest', () => {
  it('accepts minimal valid input (year/month/day)', () => {
    const result = validateBaziRequest({ year: 1990, month: 6, day: 15 });
    expect(result.year).toBe(1990);
    expect(result.month).toBe(6);
    expect(result.day).toBe(15);
    expect(result.hour).toBeNull();
    expect(result.sex).toBe('male'); // default
  });

  it('accepts full input with location', () => {
    const result = validateBaziRequest({
      year: 2026, month: 3, day: 15,
      hour: 14, minute: 30,
      lat: 39.9, lng: 116.4, tz: 'Asia/Shanghai',
      sex: 'female'
    });
    expect(result.hour).toBe(14);
    expect(result.minute).toBe(30);
    expect(result.lat).toBe(39.9);
    expect(result.sex).toBe('female');
  });

  it('coerces string numbers', () => {
    const result = validateBaziRequest({ year: '1990', month: '6', day: '15' });
    expect(result.year).toBe(1990);
  });

  it('throws on missing year', () => {
    expect(() => validateBaziRequest({ month: 6, day: 15 }))
      .toThrow('year, month, and day are required');
  });

  it('throws on invalid year range', () => {
    expect(() => validateBaziRequest({ year: 1800, month: 6, day: 15 }))
      .toThrow('year must be an integer between 1900 and 2100');
  });

  it('throws on invalid month', () => {
    expect(() => validateBaziRequest({ year: 1990, month: 13, day: 15 }))
      .toThrow('month must be an integer between 1 and 12');
  });

  it('throws on invalid hour', () => {
    expect(() => validateBaziRequest({ year: 1990, month: 6, day: 15, hour: 25 }))
      .toThrow('hour must be an integer between 0 and 23');
  });

  it('throws on invalid latitude', () => {
    expect(() => validateBaziRequest({ year: 1990, month: 6, day: 15, lat: 100 }))
      .toThrow('lat must be a number between -90 and 90');
  });

  it('throws on null body', () => {
    expect(() => validateBaziRequest(null))
      .toThrow('Request body must be a JSON object');
  });

  it('defaults sex to male', () => {
    const result = validateBaziRequest({ year: 1990, month: 6, day: 15, sex: 'invalid' });
    expect(result.sex).toBe('male');
  });
});
