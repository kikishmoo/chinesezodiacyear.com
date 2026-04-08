/**
 * Lunar Adapter — Local BaZi Four Pillars Calculator
 *
 * Replaces the upstream zhouyi.cc HTML scraper with a local calculation
 * using the lunar-javascript library (by 6tail, 34k weekly downloads).
 *
 * This eliminates the fragile upstream dependency that broke twice
 * (Regression #6, and the 2026-03-27 true solar time bug).
 *
 * Adapter interface: { calculateChart(params) }
 */

import { Solar } from 'lunar-javascript';
import { buildPillar, extractDayMaster } from '../models/pillar.js';

/**
 * Calculate a BaZi chart locally using lunar-javascript.
 *
 * @param {Object} params
 * @param {number} params.year
 * @param {number} params.month
 * @param {number} params.day
 * @param {number|null} params.hour — 0-23 or null
 * @param {number|null} params.minute — 0-59 or null
 * @param {string} params.sex — 'male' or 'female'
 * @returns {Object} — same shape as zhouyi-adapter parse() output
 */
export function calculateChart({ year, month, day, hour, minute, sex }) {
  const h = hour !== null ? hour : 12;
  const m = minute !== null ? minute : 0;

  const solar = Solar.fromYmdHms(year, month, day, h, m, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  // --- Four Pillars ---
  const pillars = {
    year:  buildPillar(ec.getYearGan(), ec.getYearZhi()),
    month: buildPillar(ec.getMonthGan(), ec.getMonthZhi()),
    day:   buildPillar(ec.getDayGan(), ec.getDayZhi()),
    hour:  buildPillar(ec.getTimeGan(), ec.getTimeZhi())
  };

  // --- Hidden Stems ---
  const hiddenStems = {
    year:  formatHiddenStems(ec.getYearHideGan()),
    month: formatHiddenStems(ec.getMonthHideGan()),
    day:   formatHiddenStems(ec.getDayHideGan()),
    hour:  formatHiddenStems(ec.getTimeHideGan())
  };

  // --- Na Yin ---
  const naYin = {
    year:  ec.getYearNaYin(),
    month: ec.getMonthNaYin(),
    day:   ec.getDayNaYin(),
    hour:  ec.getTimeNaYin()
  };

  // --- Da Yun (Luck Cycles) ---
  const isFemale = sex === 'female';
  const daYun = buildDaYun(ec, isFemale);

  // --- Basic Info ---
  const basicInfo = {
    lunarDate: lunar.getYearInChinese() + '年' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese(),
    zodiac: lunar.getYearShengXiao()
  };

  // --- Five Elements ---
  const fiveElements = [
    ec.getYearWuXing(),
    ec.getMonthWuXing(),
    ec.getDayWuXing(),
    ec.getTimeWuXing()
  ].join(' ');

  // --- Day Master ---
  const dayMaster = extractDayMaster(pillars.day);

  // --- Gender ---
  const gender = sex === 'female' ? 'female' : 'male';

  return {
    pillars,
    gender,
    hiddenStems,
    naYin,
    daYun,
    basicInfo,
    fiveElements,
    readingSections: [],
    dayMaster,
    rawExcerpt: '',
    source: 'local'
  };
}

/* ── Helpers ─────────────────────────────────────────── */

/**
 * Format hidden stems array into a comma-separated string.
 * @param {string[]} arr — e.g. ['庚', '壬', '戊']
 * @returns {string} — e.g. '庚壬戊'
 */
function formatHiddenStems(arr) {
  if (!Array.isArray(arr)) return '';
  return arr.join('');
}

/**
 * Build Da Yun (大运) luck cycle periods.
 * @param {Object} ec — EightChar instance
 * @param {boolean} isFemale
 * @returns {Array<Object>}
 */
function buildDaYun(ec, isFemale) {
  const yun = ec.getYun(isFemale ? 0 : 1);
  const periods = yun.getDaYun();

  return periods
    .filter((_, i) => i > 0) // skip the first entry (current period)
    .slice(0, 8) // max 8 periods
    .map(d => ({
      combined: d.getGanZhi(),
      startAge: String(d.getStartAge()),
      startYear: String(d.getStartYear())
    }));
}
