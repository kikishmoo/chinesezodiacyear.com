/**
 * Pillar data structure and helpers.
 *
 * A Pillar represents one of the Four Pillars (Year, Month, Day, Hour)
 * in a BaZi chart. Each pillar has a Heavenly Stem and Earthly Branch.
 */

import { STEMS, BRANCHES } from '../data/stems.js';

/**
 * Build a Pillar object from raw stem/branch characters.
 * @param {string} stemChar — single Chinese character (e.g. '甲')
 * @param {string} branchChar — single Chinese character (e.g. '子')
 * @returns {Object}
 */
export function buildPillar(stemChar, branchChar) {
  const stemIdx = STEMS.chars.indexOf(stemChar);
  const branchIdx = BRANCHES.chars.indexOf(branchChar);

  return {
    stem: stemChar,
    branch: branchChar,
    stemPinyin: stemIdx >= 0 ? STEMS.pinyin[stemIdx] : '',
    branchPinyin: branchIdx >= 0 ? BRANCHES.pinyin[branchIdx] : '',
    stemElement: stemIdx >= 0 ? STEMS.elements[stemIdx] : '',
    branchAnimal: branchIdx >= 0 ? BRANCHES.animals[branchIdx] : '',
    combined: stemChar + branchChar
  };
}

/**
 * Extract Day Master info from a day pillar.
 * @param {Object} dayPillar — pillar object with `stem` field
 * @returns {Object|null}
 */
export function extractDayMaster(dayPillar) {
  if (!dayPillar || !dayPillar.stem) return null;

  const idx = STEMS.chars.indexOf(dayPillar.stem);
  if (idx < 0) return null;

  return {
    stem: dayPillar.stem,
    pinyin: STEMS.pinyin[idx],
    element: STEMS.elements[idx],
    yinYang: idx % 2 === 0 ? 'Yang' : 'Yin'
  };
}
