/**
 * Zhouyi Adapter — BaZi Chart Parser
 *
 * Fetches and parses the BaZi chart from zhouyi.cc.
 * The upstream returns an HTML page with the Four Pillars grid,
 * Da Yun cycles, basic info, Five Elements, and reading sections.
 *
 * Adapter interface: { fetch(params), parse(html) }
 */

import { UpstreamError, TimeoutError } from '../models/errors.js';
import { buildPillar, extractDayMaster } from '../models/pillar.js';
import { STEMS, BRANCHES } from '../data/stems.js';
import { stripTags, cleanText } from '../lib/html-parser.js';

const ZHOUYI_URL = 'https://www.zhouyi.cc/bazi/sm/BaZi.php';
const USER_AGENT = 'Mozilla/5.0 (compatible; BaZiCalc/1.0)';

/* ── Fetch ────────────────────────────────────────────── */

/**
 * Build the upstream request params.
 */
function buildParams({ year, month, day, hour, minute, sex, useTrueSolarTime }) {
  return new URLSearchParams({
    data_type: '0',
    cboYear: String(year),
    cboMonth: String(month),
    cboDay: String(day),
    cboHour: hour !== null ? String(hour) : '-1',
    cboMinute: minute !== null ? String(minute) : '0',
    pid: '0',
    cid: '0',
    zty: String(useTrueSolarTime),
    txtName: '',
    rdoSex: sex === 'female' ? '0' : '1'
  });
}

/**
 * Fetch the BaZi chart HTML from zhouyi.cc.
 *
 * @param {Object} params
 * @returns {Promise<Object>} — parsed chart data
 * @throws {UpstreamError|TimeoutError}
 */
export async function fetchChart(params) {
  const body = buildParams(params);

  let resp;
  try {
    resp = await fetch(ZHOUYI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT
      },
      body: body.toString()
    });
  } catch (e) {
    if (e.name === 'AbortError' || e.message?.includes('timeout')) {
      throw new TimeoutError('Zhouyi BaZi request timed out', { source: 'zhouyi' });
    }
    throw new UpstreamError(`Zhouyi request failed: ${e.message}`, { source: 'zhouyi', cause: e });
  }

  if (!resp.ok) {
    throw new UpstreamError(`Zhouyi returned HTTP ${resp.status}`, { source: 'zhouyi' });
  }

  const html = await resp.text();
  return parse(html);
}

/* ── Parser ───────────────────────────────────────────── */

/**
 * Parse BaZi chart HTML into structured JSON.
 *
 * The response contains a <ul class='bazilist(1?) f14'> with 35 <li> items
 * arranged in a 7-row x 5-column grid:
 *   Row 1 (0-4):   Ten Gods labels
 *   Row 2 (5-9):   [5]=gender, [6-9]=Heavenly Stems
 *   Row 3 (10-14): [10]=label, [11-14]=Earthly Branches
 *   Row 4 (15-19): [15]=label, [16-19]=Hidden Stems
 *   Row 5 (20-24): Hidden Gods
 *   Row 6 (25-29): Life Stages
 *   Row 7 (30-34): [30]=label, [31-34]=Na Yin
 *
 * @param {string} html — raw HTML from zhouyi.cc
 * @returns {Object}
 */
export function parse(html) {
  const result = {
    pillars: { year: {}, month: {}, day: {}, hour: {} },
    gender: '',
    hiddenStems: { year: '', month: '', day: '', hour: '' },
    naYin: { year: '', month: '', day: '', hour: '' },
    daYun: [],
    basicInfo: {},
    fiveElements: '',
    readingSections: [],
    dayMaster: null,
    rawExcerpt: ''
  };

  // --- Parse the bazilist grid (Four Pillars) ---
  // Defensive regex: class can be 'bazilist' or 'bazilist1' (Regression #6)
  const bazilistMatch = html.match(/<ul\s+class=['"]bazilist1?\s+f14['"]>([\s\S]*?)<\/ul>/);
  if (bazilistMatch) {
    const liItems = extractListItems(bazilistMatch[1]);

    if (liItems.length >= 15) {
      result.gender = parseGender(liItems[5]);

      const pillarNames = ['year', 'month', 'day', 'hour'];
      for (let i = 0; i < 4; i++) {
        const stemChar = liItems[6 + i] || '';
        const branchChar = liItems[11 + i] || '';
        result.pillars[pillarNames[i]] = buildPillar(stemChar, branchChar);
      }

      // Hidden stems (Row 4, items 16-19)
      if (liItems.length >= 20) {
        for (let i = 0; i < 4; i++) {
          result.hiddenStems[pillarNames[i]] = liItems[16 + i] || '';
        }
      }

      // Na Yin (Row 7, items 31-34)
      if (liItems.length >= 35) {
        for (let i = 0; i < 4; i++) {
          result.naYin[pillarNames[i]] = liItems[31 + i] || '';
        }
      }
    }
  }

  // --- Da Yun (luck cycles) ---
  result.daYun = parseDaYun(html);

  // --- Basic info ---
  result.basicInfo = parseBasicInfo(html);

  // --- Five Elements ---
  result.fiveElements = parseFiveElements(html);

  // --- Reading sections ---
  result.readingSections = parseReadingSections(html);

  // --- Day Master ---
  result.dayMaster = extractDayMaster(result.pillars.day);

  // --- Raw excerpt fallback ---
  result.rawExcerpt = buildRawExcerpt(result, html);

  // --- Validation (Regression #6): flag if pillars are empty ---
  const hasPillars = Object.values(result.pillars).some(p => p.stem);
  if (!hasPillars) {
    result.parseError = 'Could not extract BaZi pillars from upstream service. The service may have changed its response format.';
  }

  return result;
}

/* ── Parser helpers ───────────────────────────────────── */

function extractListItems(ulContent) {
  const items = [];
  const regex = /<li[^>]*>([\s\S]*?)<\/li>/g;
  let m;
  while ((m = regex.exec(ulContent)) !== null) {
    items.push(stripTags(m[1]));
  }
  return items;
}

function parseGender(text) {
  if (!text) return '';
  if (text.includes('乾造')) return 'male';
  if (text.includes('坤造')) return 'female';
  return '';
}

function parseDaYun(html) {
  const daYun = [];
  const match = html.match(/<ul\s+class=['"]bazilist2\s+f14['"]>([\s\S]*?)<\/ul>/);
  if (!match) return daYun;

  const items = extractListItems(match[1]);

  // 45 items in 5x9 grid: label + 8 periods
  // Row 2 (items 9-17): Da Yun stem-branch
  // Row 4 (items 27-35): start age
  // Row 5 (items 36-44): start year
  if (items.length >= 45) {
    for (let i = 1; i < 9; i++) {
      const combined = items[9 + i] || '';
      const age = items[27 + i] || '';
      const yr = items[36 + i] || '';
      if (combined) {
        daYun.push({ combined, startAge: age, startYear: yr });
      }
    }
  }

  return daYun;
}

function parseBasicInfo(html) {
  const info = {};
  const patterns = [
    { key: 'trueSolarTimeStr', regex: /真太阳时[间間）)]*(?:<\/span>|[：:])\s*([^\n<]+)/ },
    { key: 'lunarDate',        regex: /农历(?:<\/span>|[：:])\s*([^\n<]+)/ },
    { key: 'zodiac',           regex: /生肖(?:<\/span>|[：:])\s*([^\n<]+)/ },
    { key: 'constellation',    regex: /星座(?:<\/span>|[：:])\s*([^\n<]+)/ }
  ];

  for (const { key, regex } of patterns) {
    const m = html.match(regex);
    if (m) info[key] = m[1].trim();
  }

  return info;
}

function parseFiveElements(html) {
  const regex = /<div\s+class=['"]wuhfx[^'"]*['"][^>]*>([\s\S]*?)<\/div>/g;
  const parts = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    const text = cleanText(stripTags(m[1]));
    if (text) parts.push(text);
  }
  return parts.length > 0 ? parts.join('\n') : '';
}

function parseReadingSections(html) {
  const sections = [];
  const skipTitles = new Set(['基本信息', '八字排盘', '']);

  const blockRegex = /<div\s+class=['"]baziboxbg2['"]>([\s\S]*?)(?=<div\s+class=['"]baziboxbg2['"]>|<div\s+class=['"]bazism)/g;
  let bm;
  while ((bm = blockRegex.exec(html)) !== null) {
    const block = bm[1];
    const titleMatch = block.match(/<div\s+class=['"]baziboxtop cf[^'"]*['"][^>]*>([\s\S]*?)<\/div>/);
    const title = titleMatch ? stripTags(titleMatch[1]).trim() : '';
    if (skipTitles.has(title)) continue;

    const contentParts = [];

    // Explanatory notes from baziboxmain3
    const mainRegex = /<div\s+class=['"]baziboxmain3[^'"]*['"][^>]*>([\s\S]*?)<\/div>/g;
    let mm;
    while ((mm = mainRegex.exec(block)) !== null) {
      const t = cleanText(stripTags(mm[1]));
      if (t) contentParts.push(t);
    }

    // Detailed content from line-height styled divs
    const extraRegex = /<div\s+style=['"]line-height:24px[^'"]*['"][^>]*>([\s\S]*?)<\/div>/g;
    let em;
    while ((em = extraRegex.exec(block)) !== null) {
      const t = cleanText(stripTags(em[1]));
      if (t) contentParts.push(t);
    }

    if (contentParts.length > 0) {
      sections.push({
        title,
        content: contentParts.join('\n\n').substring(0, 3000)
      });
    }
  }

  return sections;
}

function buildRawExcerpt(result, html) {
  if (result.readingSections.length > 0) {
    return result.readingSections
      .slice(0, 5)
      .map(s => s.title + '\n' + s.content)
      .join('\n\n')
      .substring(0, 3000);
  }

  // Fallback: extract body text
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const readingStart = bodyText.indexOf('日主');
  return readingStart > -1
    ? bodyText.substring(readingStart, readingStart + 3000).trim()
    : bodyText.substring(0, 2000).trim();
}
