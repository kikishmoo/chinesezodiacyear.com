/**
 * PDF Renderer — Converts assembled report JSON into a styled PDF.
 *
 * Uses pdf-lib (pure JS, Cloudflare Workers compatible).
 *
 * Font strategy: Standard Helvetica for Latin text. Chinese characters
 * (stems/branches) are rendered alongside their pinyin + English
 * translations, ensuring full readability without CJK font embedding.
 * CJK font support can be added later by loading from R2.
 *
 * Page layout: A4 portrait (595.28 x 841.89 pt), 50pt margins.
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/* ── Design tokens ── */
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - 2 * MARGIN;

const COLOURS = {
  deepRed: rgb(0.545, 0, 0),        // #8B0000
  gold: rgb(0.722, 0.573, 0.216),    // #B89237
  black: rgb(0, 0, 0),
  darkGrey: rgb(0.2, 0.2, 0.2),
  midGrey: rgb(0.45, 0.45, 0.45),
  lightGrey: rgb(0.85, 0.85, 0.85),
  white: rgb(1, 1, 1),
  bgCream: rgb(0.98, 0.97, 0.95),
};

const FONT_SIZE = {
  title: 28,
  subtitle: 16,
  h2: 18,
  h3: 14,
  body: 11,
  small: 9,
  tiny: 7.5,
};

/**
 * Render an assembled report into a PDF buffer.
 *
 * @param {Object} report — assembled report from report-service
 * @param {Object} [options] — rendering options
 * @returns {Promise<Uint8Array>} — PDF bytes
 */
export async function renderPdf(report, options = {}) {
  const doc = await PDFDocument.create();
  doc.setTitle(report.title || 'BaZi Report');
  doc.setAuthor('ChineseZodiacYear.com');
  doc.setSubject('Personal BaZi Four Pillars Analysis');
  doc.setCreator('ChineseZodiacYear.com BaZi Report Generator');

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const fonts = { regular: helvetica, bold: helveticaBold, italic: helveticaOblique };
  const ctx = { doc, fonts, y: 0, page: null };

  // Page 1: Cover
  drawCoverPage(ctx, report);

  // Page 2+: Chart overview
  newPage(ctx);
  drawChartOverview(ctx, report);

  // Da Yun cycles
  drawDaYun(ctx, report);

  // Template sections
  drawTemplateSections(ctx, report);

  // Footer on every page
  addPageFooters(ctx);

  return doc.save();
}

/* ── Page management ── */

function newPage(ctx) {
  ctx.page = ctx.doc.addPage([PAGE_W, PAGE_H]);
  ctx.y = PAGE_H - MARGIN;
  return ctx.page;
}

function ensureSpace(ctx, needed) {
  if (ctx.y - needed < MARGIN + 30) {
    newPage(ctx);
  }
}

/* ── Cover page ── */

function drawCoverPage(ctx, report) {
  const page = newPage(ctx);
  const { bold, regular, italic } = ctx.fonts;

  // Background accent bar
  page.drawRectangle({
    x: 0, y: PAGE_H - 120, width: PAGE_W, height: 120,
    color: COLOURS.deepRed,
  });

  // Site name
  page.drawText('ChineseZodiacYear.com', {
    x: MARGIN, y: PAGE_H - 45,
    size: FONT_SIZE.small, font: regular, color: COLOURS.gold,
  });

  // Title
  const title = report.title || 'Your BaZi Report';
  page.drawText(title, {
    x: MARGIN, y: PAGE_H - 85,
    size: FONT_SIZE.title, font: bold, color: COLOURS.white,
    maxWidth: CONTENT_W,
  });

  // Subtitle
  page.drawText('Four Pillars of Destiny Analysis', {
    x: MARGIN, y: PAGE_H - 108,
    size: FONT_SIZE.subtitle, font: italic, color: COLOURS.gold,
  });

  // Subject info box
  ctx.y = PAGE_H - 180;
  const subject = report.subject || {};
  const chart = report.chart || {};

  const infoLines = [];
  if (subject.birthDate) infoLines.push(`Birth Date: ${subject.birthDate}`);
  if (subject.birthTime) infoLines.push(`Birth Time: ${subject.birthTime}`);
  if (subject.sex) infoLines.push(`Gender: ${subject.sex === 'female' ? 'Female' : 'Male'}`);
  if (chart.dayMaster) {
    infoLines.push(`Day Master: ${chart.dayMaster.pinyin} — ${chart.dayMaster.yinYang} ${chart.dayMaster.element}`);
  }

  // Info box background
  const boxH = infoLines.length * 22 + 20;
  page.drawRectangle({
    x: MARGIN, y: ctx.y - boxH, width: CONTENT_W, height: boxH,
    color: COLOURS.bgCream, borderColor: COLOURS.gold, borderWidth: 1,
  });

  let infoY = ctx.y - 18;
  for (const line of infoLines) {
    page.drawText(line, {
      x: MARGIN + 15, y: infoY,
      size: FONT_SIZE.body, font: regular, color: COLOURS.darkGrey,
    });
    infoY -= 22;
  }

  ctx.y = ctx.y - boxH - 30;

  // Decorative divider
  page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE_W - MARGIN, y: ctx.y },
    thickness: 0.5, color: COLOURS.gold,
  });

  ctx.y -= 30;

  // Disclaimer
  const disclaimer = 'This report is generated for informational and entertainment purposes. ' +
    'For a comprehensive reading, consult a qualified BaZi practitioner.';
  drawWrappedText(ctx, disclaimer, {
    size: FONT_SIZE.small, font: ctx.fonts.italic, color: COLOURS.midGrey,
  });

  // Generation date
  ctx.y -= 20;
  const genDate = report.meta?.generatedAt
    ? new Date(report.meta.generatedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  page.drawText(`Generated: ${genDate}`, {
    x: MARGIN, y: ctx.y,
    size: FONT_SIZE.small, font: regular, color: COLOURS.midGrey,
  });
}

/* ── Chart overview ── */

function drawChartOverview(ctx, report) {
  const chart = report.chart || {};
  const pillars = chart.pillars || {};

  // Section heading
  drawSectionHeading(ctx, 'Your Four Pillars');

  // Day Master highlight
  if (chart.dayMaster) {
    const dm = chart.dayMaster;
    ctx.y -= 5;
    drawWrappedText(ctx, `Day Master: ${dm.pinyin} — ${dm.yinYang} ${dm.element}`, {
      size: FONT_SIZE.h3, font: ctx.fonts.bold, color: COLOURS.deepRed,
    });
    ctx.y -= 10;
  }

  // Four Pillars table
  drawPillarsTable(ctx, pillars);
  ctx.y -= 15;

  // Basic info
  const info = chart.basicInfo || {};
  if (info.zodiac || info.constellation) {
    drawSectionHeading(ctx, 'Basic Information');
    const infoItems = [];
    if (info.zodiac) infoItems.push(`Zodiac: ${translateZodiac(info.zodiac)}`);
    if (info.constellation) infoItems.push(`Constellation: ${translateConstellation(info.constellation)}`);
    for (const item of infoItems) {
      drawWrappedText(ctx, item, {
        size: FONT_SIZE.body, font: ctx.fonts.regular, color: COLOURS.darkGrey,
      });
      ctx.y -= 4;
    }
    ctx.y -= 10;
  }
}

/* ── Pillars table ── */

function drawPillarsTable(ctx, pillars) {
  ensureSpace(ctx, 140);
  const page = ctx.page;
  const { regular, bold } = ctx.fonts;

  const colW = CONTENT_W / 4;
  const names = ['year', 'month', 'day', 'hour'];
  const labels = ['Year Pillar', 'Month Pillar', 'Day Pillar', 'Hour Pillar'];

  const tableTop = ctx.y;
  const rowH = 22;

  // Header row
  page.drawRectangle({
    x: MARGIN, y: tableTop - rowH, width: CONTENT_W, height: rowH,
    color: COLOURS.deepRed,
  });
  for (let i = 0; i < 4; i++) {
    page.drawText(labels[i], {
      x: MARGIN + i * colW + 8, y: tableTop - 16,
      size: FONT_SIZE.small, font: bold, color: COLOURS.white,
    });
  }

  // Stem row
  const stemY = tableTop - rowH;
  page.drawRectangle({
    x: MARGIN, y: stemY - rowH, width: CONTENT_W, height: rowH,
    color: COLOURS.bgCream,
  });
  for (let i = 0; i < 4; i++) {
    const p = pillars[names[i]] || {};
    const stemText = p.stemPinyin || latinize(p.stem) || '—';
    page.drawText(stemText, {
      x: MARGIN + i * colW + 8, y: stemY - 16,
      size: FONT_SIZE.body, font: bold, color: COLOURS.darkGrey,
    });
  }

  // Branch row
  const branchY = stemY - rowH;
  for (let i = 0; i < 4; i++) {
    const p = pillars[names[i]] || {};
    const branchText = p.branchPinyin || latinize(p.branch) || '—';
    page.drawText(branchText, {
      x: MARGIN + i * colW + 8, y: branchY - 16,
      size: FONT_SIZE.body, font: regular, color: COLOURS.darkGrey,
    });
  }

  // Element row
  const elY = branchY - rowH;
  page.drawRectangle({
    x: MARGIN, y: elY - rowH, width: CONTENT_W, height: rowH,
    color: COLOURS.bgCream,
  });
  for (let i = 0; i < 4; i++) {
    const p = pillars[names[i]] || {};
    const elText = [p.stemElement, p.branchAnimal].filter(Boolean).join(' / ');
    page.drawText(elText || '—', {
      x: MARGIN + i * colW + 8, y: elY - 16,
      size: FONT_SIZE.small, font: regular, color: COLOURS.midGrey,
    });
  }

  // Table border
  const tableBottom = elY - rowH;
  page.drawRectangle({
    x: MARGIN, y: tableBottom, width: CONTENT_W, height: tableTop - tableBottom,
    borderColor: COLOURS.lightGrey, borderWidth: 0.5,
  });

  // Column separators
  for (let i = 1; i < 4; i++) {
    page.drawLine({
      start: { x: MARGIN + i * colW, y: tableTop },
      end: { x: MARGIN + i * colW, y: tableBottom },
      thickness: 0.5, color: COLOURS.lightGrey,
    });
  }

  ctx.y = tableBottom;
}

/* ── Da Yun ── */

function drawDaYun(ctx, report) {
  const daYun = report.chart?.daYun;
  if (!daYun || daYun.length === 0) return;

  ensureSpace(ctx, 100);
  drawSectionHeading(ctx, 'Major Luck Cycles (Da Yun)');

  const page = ctx.page;
  const { regular, bold } = ctx.fonts;
  const cardW = Math.min(CONTENT_W / daYun.length, 62);

  for (let i = 0; i < daYun.length; i++) {
    const dy = daYun[i];
    const x = MARGIN + i * cardW;

    // Card background
    page.drawRectangle({
      x, y: ctx.y - 55, width: cardW - 4, height: 55,
      color: i % 2 === 0 ? COLOURS.bgCream : COLOURS.white,
      borderColor: COLOURS.lightGrey, borderWidth: 0.5,
    });

    // Combined stem-branch (as pinyin)
    page.drawText(combinedToPinyin(dy.combined) || '—', {
      x: x + 4, y: ctx.y - 15,
      size: FONT_SIZE.body, font: bold, color: COLOURS.deepRed,
    });

    // Age
    if (dy.startAge) {
      page.drawText(`Age ${dy.startAge}`, {
        x: x + 4, y: ctx.y - 30,
        size: FONT_SIZE.tiny, font: regular, color: COLOURS.midGrey,
      });
    }

    // Year
    if (dy.startYear) {
      page.drawText(String(dy.startYear), {
        x: x + 4, y: ctx.y - 42,
        size: FONT_SIZE.tiny, font: regular, color: COLOURS.midGrey,
      });
    }
  }

  ctx.y -= 70;
}

/* ── Template sections ── */

function drawTemplateSections(ctx, report) {
  const sections = report.sections || [];
  if (sections.length === 0) return;

  for (const section of sections) {
    ensureSpace(ctx, 80);
    drawSectionHeading(ctx, section.title || 'Analysis');

    if (section.content) {
      const paragraphs = section.content.split(/\n\n+/);
      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;
        ensureSpace(ctx, 40);
        drawWrappedText(ctx, trimmed, {
          size: FONT_SIZE.body, font: ctx.fonts.regular, color: COLOURS.darkGrey,
        });
        ctx.y -= 8;
      }
    }

    ctx.y -= 10;
  }
}

/* ── Page footers ── */

function addPageFooters(ctx) {
  const pages = ctx.doc.getPages();
  const { regular } = ctx.fonts;
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];

    // Page number
    page.drawText(`Page ${i + 1} of ${totalPages}`, {
      x: PAGE_W - MARGIN - 60, y: 25,
      size: FONT_SIZE.tiny, font: regular, color: COLOURS.midGrey,
    });

    // Site URL
    page.drawText('chinesezodiacyear.com', {
      x: MARGIN, y: 25,
      size: FONT_SIZE.tiny, font: regular, color: COLOURS.midGrey,
    });

    // Top border line (skip cover)
    if (i > 0) {
      page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 35 },
        end: { x: PAGE_W - MARGIN, y: PAGE_H - 35 },
        thickness: 0.5, color: COLOURS.gold,
      });
    }
  }
}

/* ── Shared drawing helpers ── */

function drawSectionHeading(ctx, text) {
  ensureSpace(ctx, 40);
  ctx.y -= 8;

  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y + 2 },
    end: { x: MARGIN + 30, y: ctx.y + 2 },
    thickness: 2, color: COLOURS.deepRed,
  });

  ctx.page.drawText(text, {
    x: MARGIN, y: ctx.y - 16,
    size: FONT_SIZE.h2, font: ctx.fonts.bold, color: COLOURS.deepRed,
    maxWidth: CONTENT_W,
  });

  ctx.y -= 32;
}

/**
 * Draw word-wrapped text, advancing ctx.y downward.
 * pdf-lib doesn't have native word-wrap, so we split manually.
 */
function drawWrappedText(ctx, text, { size, font, color }) {
  const lineHeight = size * 1.5;
  const words = text.split(/\s+/);
  let line = '';

  for (const word of words) {
    const testLine = line ? line + ' ' + word : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);

    if (testWidth > CONTENT_W && line) {
      ensureSpace(ctx, lineHeight);
      ctx.page.drawText(line, {
        x: MARGIN, y: ctx.y,
        size, font, color,
      });
      ctx.y -= lineHeight;
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ensureSpace(ctx, lineHeight);
    ctx.page.drawText(line, {
      x: MARGIN, y: ctx.y,
      size, font, color,
    });
    ctx.y -= lineHeight;
  }
}

/* ── CJK → Latin text helpers ── */

/**
 * Map of individual CJK characters to their pinyin/English equivalents.
 * Covers Heavenly Stems, Earthly Branches, and common BaZi terms.
 */
const CJK_PINYIN = {
  // Heavenly Stems
  '\u7532': 'Jia', '\u4E59': 'Yi', '\u4E19': 'Bing', '\u4E01': 'Ding',
  '\u620A': 'Wu', '\u5DF1': 'Ji', '\u5E9A': 'Geng', '\u8F9B': 'Xin',
  '\u58EC': 'Ren', '\u7678': 'Gui',
  // Earthly Branches
  '\u5B50': 'Zi', '\u4E11': 'Chou', '\u5BC5': 'Yin', '\u536F': 'Mao',
  '\u8FB0': 'Chen', '\u5DF3': 'Si', '\u5348': 'Wu', '\u672A': 'Wei',
  '\u7533': 'Shen', '\u9149': 'You', '\u620C': 'Xu', '\u4EA5': 'Hai',
};

const ZODIAC_MAP = {
  '\u9F20': 'Rat', '\u725B': 'Ox', '\u864E': 'Tiger', '\u5154': 'Rabbit',
  '\u9F99': 'Dragon', '\u9F8D': 'Dragon', '\u86C7': 'Snake',
  '\u9A6C': 'Horse', '\u99AC': 'Horse', '\u7F8A': 'Goat',
  '\u7334': 'Monkey', '\u9E21': 'Rooster', '\u96DE': 'Rooster',
  '\u72D7': 'Dog', '\u732A': 'Pig', '\u8C6C': 'Pig',
};

const CONSTELLATION_MAP = {
  '\u767D\u7F8A\u5EA7': 'Aries', '\u91D1\u725B\u5EA7': 'Taurus',
  '\u53CC\u5B50\u5EA7': 'Gemini', '\u96D9\u5B50\u5EA7': 'Gemini',
  '\u5DE8\u87F9\u5EA7': 'Cancer', '\u72EE\u5B50\u5EA7': 'Leo', '\u7345\u5B50\u5EA7': 'Leo',
  '\u5904\u5973\u5EA7': 'Virgo', '\u8655\u5973\u5EA7': 'Virgo', '\u5929\u79E4\u5EA7': 'Libra',
  '\u5929\u874E\u5EA7': 'Scorpio', '\u5929\u880D\u5EA7': 'Scorpio',
  '\u5C04\u624B\u5EA7': 'Sagittarius', '\u6469\u7FAF\u5EA7': 'Capricorn',
  '\u6C34\u74F6\u5EA7': 'Aquarius', '\u53CC\u9C7C\u5EA7': 'Pisces', '\u96D9\u9B5A\u5EA7': 'Pisces',
};

/**
 * Strip CJK characters from text, replacing them with pinyin where known.
 * Characters not in our lookup are dropped silently.
 */
function latinize(text) {
  if (!text) return '';
  let result = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code < 0x2E80) {
      // Latin / basic — keep as-is
      result += ch;
    } else if (CJK_PINYIN[ch]) {
      result += (result.length > 0 && result[result.length - 1] !== ' ' ? ' ' : '') + CJK_PINYIN[ch];
    } else {
      // Unknown CJK char — drop
    }
  }
  return result.trim();
}

/**
 * Convert a stem-branch combined string (e.g. "丙子") to pinyin (e.g. "Bing Zi").
 */
function combinedToPinyin(combined) {
  if (!combined || combined.length < 2) return latinize(combined);
  const stem = CJK_PINYIN[combined[0]] || combined[0];
  const branch = CJK_PINYIN[combined[1]] || combined[1];
  return `${stem} ${branch}`;
}

function translateZodiac(cn) {
  if (!cn) return cn;
  for (const k in ZODIAC_MAP) {
    if (cn.indexOf(k) !== -1) return ZODIAC_MAP[k];
  }
  return cn;
}

function translateConstellation(cn) {
  return CONSTELLATION_MAP[cn] || cn;
}
