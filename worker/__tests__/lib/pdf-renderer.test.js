/**
 * Tests for the PDF renderer.
 *
 * Verifies that renderPdf() produces valid PDF bytes from report data.
 */

import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { renderPdf } from '../../lib/pdf-renderer.js';

/** Minimal report fixture matching assembleReport() output shape. */
function makeReport(overrides = {}) {
  return {
    meta: {
      templateId: 'tpl-001',
      templateSlug: 'bazi-basic-en',
      templateVersion: 1,
      generatedAt: '2026-04-06T12:00:00.000Z',
      locale: 'en',
    },
    subject: {
      birthDate: '1996-09-20',
      birthTime: '16:04',
      sex: 'female',
    },
    chart: {
      pillars: {
        year: { stem: '丙', branch: '子', stemPinyin: 'Bing', branchPinyin: 'Zi', stemElement: 'Fire', branchAnimal: 'Rat', combined: '丙子' },
        month: { stem: '丁', branch: '酉', stemPinyin: 'Ding', branchPinyin: 'You', stemElement: 'Fire', branchAnimal: 'Rooster', combined: '丁酉' },
        day: { stem: '庚', branch: '申', stemPinyin: 'Geng', branchPinyin: 'Shen', stemElement: 'Metal', branchAnimal: 'Monkey', combined: '庚申' },
        hour: { stem: '甲', branch: '申', stemPinyin: 'Jia', branchPinyin: 'Shen', stemElement: 'Wood', branchAnimal: 'Monkey', combined: '甲申' },
      },
      dayMaster: { stem: '庚', pinyin: 'Geng', element: 'Metal', yinYang: 'Yang' },
      hiddenStems: { year: '癸', month: '辛', day: '庚壬戊', hour: '庚壬戊' },
      naYin: { year: '涧下水', month: '山下火', day: '石榴木', hour: '泉中水' },
      daYun: [
        { combined: '丙申', startAge: '5', startYear: '2001' },
        { combined: '乙未', startAge: '15', startYear: '2011' },
        { combined: '甲午', startAge: '25', startYear: '2021' },
      ],
      basicInfo: { zodiac: '鼠', constellation: '处女座' },
      gender: 'female',
    },
    sections: [
      { title: 'Day Master Analysis', content: 'Geng Metal is strong and decisive. As a Yang Metal Day Master, you possess an innate sense of justice and determination.\n\nYour chart shows a strong Metal element, balanced by the presence of Water and Fire in your pillars.' },
      { title: 'Career Outlook', content: 'Your Day Master suggests aptitude for leadership roles. Metal energy favours careers in technology, finance, and law enforcement.' },
    ],
    title: 'Your Personal BaZi Report',
    ...overrides,
  };
}

describe('pdf-renderer renderPdf()', () => {
  it('produces valid PDF bytes', async () => {
    const report = makeReport();
    const pdfBytes = await renderPdf(report);

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);

    // PDF magic bytes: %PDF-
    const header = String.fromCharCode(...pdfBytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });

  it('produces multi-page output for reports with sections', async () => {
    const report = makeReport();
    const pdfBytes = await renderPdf(report);

    const loaded = await PDFDocument.load(pdfBytes);
    expect(loaded.getPageCount()).toBeGreaterThanOrEqual(2);
  });

  it('handles empty chart gracefully', async () => {
    const report = makeReport({
      chart: { pillars: {}, daYun: [], basicInfo: {} },
      sections: [],
    });
    const pdfBytes = await renderPdf(report);

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    const header = String.fromCharCode(...pdfBytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });

  it('handles missing sections gracefully', async () => {
    const report = makeReport({ sections: [] });
    const pdfBytes = await renderPdf(report);

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(500);
  });

  it('handles very long section content without crashing', async () => {
    const longContent = 'This is a test sentence for pagination. '.repeat(200);
    const report = makeReport({
      sections: [{ title: 'Long Section', content: longContent }],
    });
    const pdfBytes = await renderPdf(report);

    expect(pdfBytes).toBeInstanceOf(Uint8Array);

    // Should create extra pages for long content
    const loaded = await PDFDocument.load(pdfBytes);
    expect(loaded.getPageCount()).toBeGreaterThanOrEqual(3);
  });
});
