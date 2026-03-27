/**
 * Tests for worker/models/bazi-response.js
 */

import { describe, it, expect } from 'vitest';
import { validateResponse } from '../../models/bazi-response.js';

describe('validateResponse', () => {
  const validResponse = {
    pillars: {
      year: { stem: '甲', branch: '午' },
      month: { stem: '丙', branch: '寅' },
      day: { stem: '壬', branch: '子' },
      hour: { stem: '庚', branch: '戌' }
    },
    gender: 'male',
    hiddenStems: { year: '', month: '', day: '', hour: '' },
    naYin: { year: '', month: '', day: '', hour: '' },
    daYun: [{ combined: '乙丑', startAge: '3', startYear: '2029' }],
    readingSections: [{ title: '性格分析', content: 'test' }],
    dayMaster: { stem: '壬', pinyin: 'rén', element: 'Water', yinYang: 'yang' },
    rawExcerpt: 'test'
  };

  it('validates a correct response', () => {
    const { valid, errors } = validateResponse(validResponse);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it('rejects null', () => {
    const { valid, errors } = validateResponse(null);
    expect(valid).toBe(false);
    expect(errors).toContain('Response is not an object');
  });

  it('rejects missing pillars', () => {
    const { valid, errors } = validateResponse({ ...validResponse, pillars: undefined });
    expect(valid).toBe(false);
    expect(errors).toContain('Missing pillars object');
  });

  it('detects missing pillar position', () => {
    const bad = { ...validResponse, pillars: { year: {}, month: {}, day: {} } };
    const { valid, errors } = validateResponse(bad);
    expect(valid).toBe(false);
    expect(errors).toContain('Missing pillars.hour');
  });

  it('rejects missing gender', () => {
    const { valid, errors } = validateResponse({ ...validResponse, gender: undefined });
    expect(valid).toBe(false);
    expect(errors).toContain('Missing gender string');
  });

  it('rejects missing daYun array', () => {
    const { valid, errors } = validateResponse({ ...validResponse, daYun: 'not array' });
    expect(valid).toBe(false);
    expect(errors).toContain('Missing daYun array');
  });

  it('rejects missing readingSections array', () => {
    const { valid, errors } = validateResponse({ ...validResponse, readingSections: null });
    expect(valid).toBe(false);
    expect(errors).toContain('Missing readingSections array');
  });

  it('collects multiple errors', () => {
    const { valid, errors } = validateResponse({ foo: 'bar' });
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThan(1);
  });
});
