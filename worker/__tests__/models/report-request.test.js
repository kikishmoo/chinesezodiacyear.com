/**
 * Tests for report request validation.
 */

import { describe, it, expect } from 'vitest';
import { validateReportRequest } from '../../models/report-request.js';

describe('validateReportRequest', () => {
  const validInput = {
    templateSlug: 'bazi-basic-en',
    year: 1990,
    month: 6,
    day: 15,
    sex: 'female'
  };

  it('accepts minimal valid input', () => {
    const result = validateReportRequest(validInput);
    expect(result.templateSlug).toBe('bazi-basic-en');
    expect(result.year).toBe(1990);
    expect(result.month).toBe(6);
    expect(result.day).toBe(15);
    expect(result.sex).toBe('female');
    expect(result.hour).toBeNull();
    expect(result.email).toBeNull();
  });

  it('accepts full input with email and time', () => {
    const result = validateReportRequest({
      ...validInput,
      hour: 14,
      minute: 30,
      lat: 39.9,
      lng: 116.4,
      tz: 'Asia/Shanghai',
      email: 'TEST@Example.com'
    });
    expect(result.hour).toBe(14);
    expect(result.minute).toBe(30);
    expect(result.email).toBe('test@example.com'); // normalised
  });

  it('throws on missing templateSlug', () => {
    expect(() => validateReportRequest({ year: 1990, month: 6, day: 15 }))
      .toThrow('templateSlug is required');
  });

  it('throws on empty templateSlug', () => {
    expect(() => validateReportRequest({ ...validInput, templateSlug: '' }))
      .toThrow('templateSlug is required');
  });

  it('throws on invalid templateSlug format', () => {
    expect(() => validateReportRequest({ ...validInput, templateSlug: 'UPPERCASE' }))
      .toThrow('templateSlug must contain only lowercase');
  });

  it('throws on invalid templateSlug with spaces', () => {
    expect(() => validateReportRequest({ ...validInput, templateSlug: 'has spaces' }))
      .toThrow('templateSlug must contain only lowercase');
  });

  it('throws on missing year', () => {
    expect(() => validateReportRequest({ templateSlug: 'bazi-basic-en', month: 6, day: 15 }))
      .toThrow('year, month, and day are required');
  });

  it('throws on invalid year range', () => {
    expect(() => validateReportRequest({ ...validInput, year: 1800 }))
      .toThrow('year must be an integer between 1900 and 2100');
  });

  it('throws on invalid email', () => {
    expect(() => validateReportRequest({ ...validInput, email: 'not-an-email' }))
      .toThrow('email must be a valid email address');
  });

  it('accepts null email', () => {
    const result = validateReportRequest({ ...validInput, email: null });
    expect(result.email).toBeNull();
  });

  it('throws on null body', () => {
    expect(() => validateReportRequest(null))
      .toThrow('Request body must be a JSON object');
  });

  it('defaults sex to male', () => {
    const result = validateReportRequest({ ...validInput, sex: undefined });
    expect(result.sex).toBe('male');
  });

  it('accepts template slugs with digits', () => {
    const result = validateReportRequest({ ...validInput, templateSlug: 'bazi-v2-report' });
    expect(result.templateSlug).toBe('bazi-v2-report');
  });
});
