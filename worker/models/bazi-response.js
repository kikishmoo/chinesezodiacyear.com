/**
 * BaZi Response Schema — Formalised API response shape.
 *
 * Defines the canonical structure returned by POST /v1/bazi/calculate.
 * Uses JSDoc typedefs for documentation and IDE support.
 *
 * @module worker/models/bazi-response
 */

/**
 * @typedef {Object} Pillar
 * @property {string} stem — Heavenly Stem character (e.g. '甲')
 * @property {string} branch — Earthly Branch character (e.g. '子')
 * @property {string} stemPinyin — Stem pinyin (e.g. 'jiǎ')
 * @property {string} branchPinyin — Branch pinyin (e.g. 'zǐ')
 * @property {string} stemElement — Stem element (e.g. 'Wood')
 * @property {string} branchElement — Branch element (e.g. 'Water')
 * @property {string} animal — Zodiac animal (e.g. 'Rat')
 * @property {string} combined — Combined display (e.g. '甲子')
 */

/**
 * @typedef {Object} DayMaster
 * @property {string} stem — Day stem character
 * @property {string} pinyin — Day stem pinyin
 * @property {string} element — Day stem element
 * @property {string} yinYang — 'yin' or 'yang'
 */

/**
 * @typedef {Object} DaYunPeriod
 * @property {string} combined — Stem-Branch pair (e.g. '乙丑')
 * @property {string} startAge — Age when period begins
 * @property {string} startYear — Calendar year when period begins
 */

/**
 * @typedef {Object} ReadingSection
 * @property {string} title — Section title (e.g. '性格分析')
 * @property {string} content — Section text (max 3000 chars)
 */

/**
 * @typedef {Object} TrueSolarTime
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number} hour
 * @property {number} minute
 */

/**
 * @typedef {Object} BaziInput
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number|null} hour
 * @property {number|null} minute
 * @property {number|null} lat
 * @property {number|null} lng
 * @property {string|null} tz
 * @property {string} sex — 'male' or 'female'
 */

/**
 * @typedef {Object} BaziResponse
 * @property {Object} pillars
 * @property {Pillar} pillars.year
 * @property {Pillar} pillars.month
 * @property {Pillar} pillars.day
 * @property {Pillar} pillars.hour
 * @property {string} gender — 'male' or 'female'
 * @property {Object} hiddenStems — { year, month, day, hour } hidden stem strings
 * @property {Object} naYin — { year, month, day, hour } Na Yin strings
 * @property {DaYunPeriod[]} daYun — 8 luck periods
 * @property {Object} basicInfo — { trueSolarTimeStr?, lunarDate?, zodiac?, constellation? }
 * @property {string} fiveElements — Five Elements summary text
 * @property {ReadingSection[]} readingSections — Analysis sections
 * @property {DayMaster|null} dayMaster
 * @property {string} rawExcerpt — Fallback text excerpt
 * @property {string} [parseError] — Set if pillar extraction failed
 * @property {TrueSolarTime|null} trueSolarTime — Corrected solar time, or null
 * @property {BaziInput} input — Original request input (echoed back)
 * @property {boolean} [_cached] — True if served from cache
 */

/**
 * Validate that a response object has the minimum required fields.
 *
 * @param {Object} data — response object to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateResponse(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Response is not an object'] };
  }

  if (!data.pillars || typeof data.pillars !== 'object') {
    errors.push('Missing pillars object');
  } else {
    for (const pos of ['year', 'month', 'day', 'hour']) {
      if (!data.pillars[pos] || typeof data.pillars[pos] !== 'object') {
        errors.push(`Missing pillars.${pos}`);
      }
    }
  }

  if (typeof data.gender !== 'string') {
    errors.push('Missing gender string');
  }

  if (!Array.isArray(data.daYun)) {
    errors.push('Missing daYun array');
  }

  if (!Array.isArray(data.readingSections)) {
    errors.push('Missing readingSections array');
  }

  return { valid: errors.length === 0, errors };
}
