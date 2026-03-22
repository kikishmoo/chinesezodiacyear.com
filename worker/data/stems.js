/**
 * Heavenly Stems and Earthly Branches reference data.
 *
 * Used by pillar builders, parsers, and any module that needs
 * to look up stem/branch metadata.
 */

export const STEMS = {
  chars:    ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  pinyin:   ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'],
  elements: ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water']
};

export const BRANCHES = {
  chars:   ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  pinyin:  ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'],
  animals: ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
};
