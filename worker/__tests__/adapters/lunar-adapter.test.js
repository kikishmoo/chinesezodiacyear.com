/**
 * Tests for Lunar adapter — local BaZi calculation.
 *
 * No network calls, no fixtures — pure local computation.
 */

import { describe, it, expect } from 'vitest';
import { calculateChart } from '../../adapters/lunar-adapter.js';

describe('lunar-adapter calculateChart()', () => {
  it('computes correct four pillars for 1996-09-20 16:04 female', () => {
    // Known test case: user reported time pillar should be 甲申, not 庚辰
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: 16, minute: 4, sex: 'female'
    });

    expect(result.pillars.year.combined).toBe('丙子');
    expect(result.pillars.month.combined).toBe('丁酉');
    expect(result.pillars.day.combined).toBe('庚申');
    expect(result.pillars.hour.combined).toBe('甲申');
  });

  it('enriches pillar metadata correctly', () => {
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: 16, minute: 4, sex: 'female'
    });

    // Year pillar: 丙子
    expect(result.pillars.year.stem).toBe('丙');
    expect(result.pillars.year.branch).toBe('子');
    expect(result.pillars.year.stemPinyin).toBe('Bing');
    expect(result.pillars.year.branchPinyin).toBe('Zi');
    expect(result.pillars.year.stemElement).toBe('Fire');
    expect(result.pillars.year.branchAnimal).toBe('Rat');
  });

  it('computes correct pillars for 1990-01-15 10:30 male', () => {
    const result = calculateChart({
      year: 1990, month: 1, day: 15, hour: 10, minute: 30, sex: 'male'
    });

    expect(result.pillars.year.combined).toBe('己巳');
    expect(result.pillars.month.combined).toBe('丁丑');
    expect(result.pillars.day.combined).toBe('庚辰');
    expect(result.pillars.hour.combined).toBe('辛巳');
  });

  it('extracts hidden stems', () => {
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: 16, minute: 4, sex: 'female'
    });

    expect(result.hiddenStems.year).toBe('癸');
    expect(result.hiddenStems.month).toBe('辛');
    expect(result.hiddenStems.day).toBe('庚壬戊');
    expect(result.hiddenStems.hour).toBe('庚壬戊');
  });

  it('extracts Na Yin', () => {
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: 16, minute: 4, sex: 'female'
    });

    expect(result.naYin.year).toBe('涧下水');
    expect(result.naYin.month).toBe('山下火');
    expect(result.naYin.day).toBe('石榴木');
    expect(result.naYin.hour).toBe('泉中水');
  });

  it('extracts Day Master', () => {
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: 16, minute: 4, sex: 'female'
    });

    expect(result.dayMaster).not.toBeNull();
    expect(result.dayMaster.stem).toBe('庚');
    expect(result.dayMaster.pinyin).toBe('Geng');
    expect(result.dayMaster.element).toBe('Metal');
    expect(result.dayMaster.yinYang).toBe('Yang');
  });

  it('builds Da Yun for female', () => {
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: 16, minute: 4, sex: 'female'
    });

    expect(result.daYun.length).toBeGreaterThanOrEqual(1);
    expect(result.daYun.length).toBeLessThanOrEqual(8);
    // First Da Yun period for this female chart
    expect(result.daYun[0].combined).toBe('丙申');
    expect(result.daYun[0].startAge).toBeDefined();
    expect(result.daYun[0].startYear).toBeDefined();
  });

  it('returns gender correctly', () => {
    const female = calculateChart({
      year: 2000, month: 6, day: 15, hour: 12, minute: 0, sex: 'female'
    });
    expect(female.gender).toBe('female');

    const male = calculateChart({
      year: 2000, month: 6, day: 15, hour: 12, minute: 0, sex: 'male'
    });
    expect(male.gender).toBe('male');
  });

  it('handles null hour (defaults to noon)', () => {
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: null, minute: null, sex: 'female'
    });

    // Should still produce valid year/month/day pillars
    expect(result.pillars.year.combined).toBe('丙子');
    expect(result.pillars.month.combined).toBe('丁酉');
    expect(result.pillars.day.combined).toBe('庚申');
    // Hour pillar defaults to noon (午时)
    expect(result.pillars.hour.stem).toBeTruthy();
    expect(result.pillars.hour.branch).toBeTruthy();
  });

  it('includes source field', () => {
    const result = calculateChart({
      year: 2000, month: 1, day: 1, hour: 0, minute: 0, sex: 'male'
    });

    expect(result.source).toBe('local');
  });

  it('handles solar term boundary (立春 determines year pillar)', () => {
    // 2024-02-03 is before 立春 (Feb 4), so year pillar should be 癸卯 (2023), not 甲辰 (2024)
    const before = calculateChart({
      year: 2024, month: 2, day: 3, hour: 12, minute: 0, sex: 'male'
    });
    expect(before.pillars.year.combined).toBe('癸卯');

    // 2024-02-04 is after 立春, so year pillar should be 甲辰 (2024)
    const after = calculateChart({
      year: 2024, month: 2, day: 5, hour: 12, minute: 0, sex: 'male'
    });
    expect(after.pillars.year.combined).toBe('甲辰');
  });

  it('returns basic info with lunar date and zodiac', () => {
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: 16, minute: 4, sex: 'female'
    });

    expect(result.basicInfo.lunarDate).toContain('年');
    expect(result.basicInfo.zodiac).toBe('鼠');
  });

  it('returns five elements string', () => {
    const result = calculateChart({
      year: 1996, month: 9, day: 20, hour: 16, minute: 4, sex: 'female'
    });

    expect(result.fiveElements).toContain('火水');
  });
});
