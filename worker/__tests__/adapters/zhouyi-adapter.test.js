/**
 * Tests for Zhouyi adapter parser.
 *
 * Uses saved HTML fixtures — no network calls.
 * These are the highest-value tests in the worker (Regression #6).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../../adapters/zhouyi-adapter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name) => readFileSync(resolve(__dirname, '../fixtures', name), 'utf-8');

describe('zhouyi-adapter parse()', () => {
  const html = fixture('zhouyi-bazi-chart.html');
  const result = parse(html);

  describe('Four Pillars', () => {
    it('extracts all four pillar stems', () => {
      expect(result.pillars.year.stem).toBe('庚');
      expect(result.pillars.month.stem).toBe('壬');
      expect(result.pillars.day.stem).toBe('癸');
      expect(result.pillars.hour.stem).toBe('戊');
    });

    it('extracts all four pillar branches', () => {
      expect(result.pillars.year.branch).toBe('午');
      expect(result.pillars.month.branch).toBe('午');
      expect(result.pillars.day.branch).toBe('巳');
      expect(result.pillars.hour.branch).toBe('午');
    });

    it('includes pinyin for stems', () => {
      expect(result.pillars.year.stemPinyin).toBe('Geng');
      expect(result.pillars.day.stemPinyin).toBe('Gui');
    });

    it('includes pinyin for branches', () => {
      expect(result.pillars.year.branchPinyin).toBe('Wu');
      expect(result.pillars.day.branchPinyin).toBe('Si');
    });

    it('includes elements for stems', () => {
      expect(result.pillars.year.stemElement).toBe('Metal');
      expect(result.pillars.day.stemElement).toBe('Water');
    });

    it('includes animals for branches', () => {
      expect(result.pillars.year.branchAnimal).toBe('Horse');
      expect(result.pillars.day.branchAnimal).toBe('Snake');
    });

    it('includes combined stem+branch', () => {
      expect(result.pillars.year.combined).toBe('庚午');
      expect(result.pillars.day.combined).toBe('癸巳');
    });

    it('does not set parseError when pillars are present', () => {
      expect(result.parseError).toBeUndefined();
    });
  });

  describe('Gender', () => {
    it('detects male (乾造)', () => {
      expect(result.gender).toBe('male');
    });
  });

  describe('Hidden Stems', () => {
    it('extracts hidden stems for each pillar', () => {
      expect(result.hiddenStems.year).toBe('己丁');
      expect(result.hiddenStems.day).toBe('庚丙戊');
    });
  });

  describe('Na Yin', () => {
    it('extracts Na Yin for each pillar', () => {
      expect(result.naYin.year).toBe('杨柳木');
      expect(result.naYin.day).toBe('长流水');
      expect(result.naYin.hour).toBe('天上火');
    });
  });

  describe('Da Yun (luck cycles)', () => {
    it('extracts 8 Da Yun periods', () => {
      expect(result.daYun).toHaveLength(8);
    });

    it('first Da Yun is 辛巳 starting age 3', () => {
      expect(result.daYun[0].combined).toBe('辛巳');
      expect(result.daYun[0].startAge).toBe('3');
      expect(result.daYun[0].startYear).toBe('1993');
    });
  });

  describe('Basic Info', () => {
    it('extracts zodiac', () => {
      expect(result.basicInfo.zodiac).toBe('马');
    });

    it('extracts constellation', () => {
      expect(result.basicInfo.constellation).toBe('双子座');
    });
  });

  describe('Five Elements', () => {
    it('extracts Five Elements text', () => {
      expect(result.fiveElements).toContain('五行个数');
      expect(result.fiveElements).toContain('日主天干为水');
    });
  });

  describe('Reading Sections', () => {
    it('extracts non-skipped reading sections', () => {
      // Should skip 基本信息 and 八字排盘, keep 性格分析 and 事业运势
      expect(result.readingSections.length).toBeGreaterThanOrEqual(2);
    });

    it('first section is 性格分析', () => {
      const section = result.readingSections.find(s => s.title === '性格分析');
      expect(section).toBeDefined();
      expect(section.content).toContain('癸水日主');
    });

    it('includes line-height styled content', () => {
      const section = result.readingSections.find(s => s.title === '性格分析');
      expect(section.content).toContain('心思细腻');
    });
  });

  describe('Day Master', () => {
    it('extracts Day Master from day pillar', () => {
      expect(result.dayMaster).not.toBeNull();
      expect(result.dayMaster.stem).toBe('癸');
      expect(result.dayMaster.pinyin).toBe('Gui');
      expect(result.dayMaster.element).toBe('Water');
      expect(result.dayMaster.yinYang).toBe('Yin');
    });
  });

  describe('Raw Excerpt', () => {
    it('builds rawExcerpt from reading sections', () => {
      expect(result.rawExcerpt).toBeTruthy();
      expect(result.rawExcerpt.length).toBeGreaterThan(0);
    });
  });
});

describe('zhouyi-adapter parse() — empty pillars', () => {
  it('sets parseError when pillars cannot be extracted', () => {
    const html = fixture('zhouyi-empty-pillars.html');
    const result = parse(html);

    expect(result.parseError).toBeDefined();
    expect(result.parseError).toContain('Could not extract BaZi pillars');
  });
});
