const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const animalsCn = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
const animalsSc = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const animalEmojis = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];
const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
const elementsCn = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
const stems = ['Jia 甲', 'Yi 乙', 'Bing 丙', 'Ding 丁', 'Wu 戊', 'Ji 己', 'Geng 庚', 'Xin 辛', 'Ren 壬', 'Gui 癸'];
const branches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
const branchesCn = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const stemPinyin = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
const stemCn = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const fixedElements = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'];
const fixedElementsCn = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
const sanHeMap = {
  rat: ['dragon', 'monkey'], ox: ['snake', 'rooster'], tiger: ['horse', 'dog'], rabbit: ['goat', 'pig'],
  dragon: ['rat', 'monkey'], snake: ['ox', 'rooster'], horse: ['tiger', 'dog'], goat: ['rabbit', 'pig'],
  monkey: ['rat', 'dragon'], rooster: ['ox', 'snake'], dog: ['tiger', 'horse'], pig: ['rabbit', 'goat']
};
const liuHeMap = { rat: 'ox', ox: 'rat', tiger: 'pig', rabbit: 'dog', dragon: 'rooster', snake: 'monkey', horse: 'goat', goat: 'horse', monkey: 'snake', rooster: 'dragon', dog: 'rabbit', pig: 'tiger' };
const clashMap = { rat: 'horse', ox: 'goat', tiger: 'monkey', rabbit: 'rooster', dragon: 'dog', snake: 'pig', horse: 'rat', goat: 'ox', monkey: 'tiger', rooster: 'rabbit', dog: 'dragon', pig: 'snake' };

export default function () {
  const years = [];

  for (let year = 1924; year <= 2044; year++) {
    const animalIndex = ((year - 4) % 12 + 12) % 12;
    const stemIndex = ((year - 4) % 10 + 10) % 10;

    years.push({
      year,
      animal: animals[animalIndex],
      animalCn: animalsCn[animalIndex],
      animalSc: animalsSc[animalIndex],
      animalEmoji: animalEmojis[animalIndex],
      slug: animals[animalIndex].toLowerCase(),
      element: elements[stemIndex],
      elementCn: elementsCn[stemIndex],
      elementSc: elementsCn[stemIndex],
      stem: stems[stemIndex],
      yinYang: stemIndex % 2 === 0 ? 'Yang' : 'Yin',
      branch: branches[animalIndex],
      branchCn: branchesCn[animalIndex],
      pillar: stemPinyin[stemIndex] + branches[animalIndex].toLowerCase(),
      pillarCn: stemCn[stemIndex] + branchesCn[animalIndex],
      fixedElement: fixedElements[animalIndex],
      fixedElementCn: fixedElementsCn[animalIndex],
      sanHe: sanHeMap[animals[animalIndex].toLowerCase()],
      liuHe: liuHeMap[animals[animalIndex].toLowerCase()],
      clash: clashMap[animals[animalIndex].toLowerCase()],
      permalink: `/zodiac-year/${year}/`,
    });
  }

  return years;
}
