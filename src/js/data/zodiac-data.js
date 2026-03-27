/**
 * Zodiac Data — 12 Chinese zodiac animals with metadata.
 */

export const zodiacData = [
  { animal: 'Rat',     emoji: '🐀', cn: '鼠', traits: 'Quick-witted, resourceful, versatile' },
  { animal: 'Ox',      emoji: '🐂', cn: '牛', traits: 'Diligent, dependable, determined' },
  { animal: 'Tiger',   emoji: '🐅', cn: '虎', traits: 'Brave, confident, competitive' },
  { animal: 'Rabbit',  emoji: '🐇', cn: '兔', traits: 'Gentle, quiet, elegant' },
  { animal: 'Dragon',  emoji: '🐉', cn: '龍', traits: 'Confident, ambitious, charismatic' },
  { animal: 'Snake',   emoji: '🐍', cn: '蛇', traits: 'Enigmatic, wise, intuitive' },
  { animal: 'Horse',   emoji: '🐎', cn: '馬', traits: 'Energetic, free-spirited, warm' },
  { animal: 'Goat',    emoji: '🐐', cn: '羊', traits: 'Calm, gentle, sympathetic' },
  { animal: 'Monkey',  emoji: '🐒', cn: '猴', traits: 'Sharp, curious, inventive' },
  { animal: 'Rooster', emoji: '🐓', cn: '雞', traits: 'Observant, hardworking, courageous' },
  { animal: 'Dog',     emoji: '🐕', cn: '狗', traits: 'Loyal, honest, amiable' },
  { animal: 'Pig',     emoji: '🐖', cn: '豬', traits: 'Compassionate, generous, diligent' }
];

export const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];

export const heavenlyStems = ['Jia 甲', 'Yi 乙', 'Bing 丙', 'Ding 丁', 'Wu 戊', 'Ji 己', 'Geng 庚', 'Xin 辛', 'Ren 壬', 'Gui 癸'];

/**
 * Get zodiac animal for a given year.
 * @param {number} year
 * @returns {Object}
 */
export function getZodiac(year) {
  const idx = ((year - 4) % 12 + 12) % 12;
  return zodiacData[idx];
}

/**
 * Get the Five Element for a given year.
 * @param {number} year
 * @returns {string}
 */
export function getElement(year) {
  const idx = ((year - 4) % 10 + 10) % 10;
  return elements[idx];
}

/**
 * Get the Heavenly Stem for a given year.
 * @param {number} year
 * @returns {string}
 */
export function getHeavenlyStem(year) {
  const idx = ((year - 4) % 10 + 10) % 10;
  return heavenlyStems[idx];
}
