const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const animalsCn = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
const animalsSc = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const animalEmojis = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];
const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
const elementsCn = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
const stems = ['Jia 甲', 'Yi 乙', 'Bing 丙', 'Ding 丁', 'Wu 戊', 'Ji 己', 'Geng 庚', 'Xin 辛', 'Ren 壬', 'Gui 癸'];

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
      permalink: `/zodiac-year/${year}/`,
    });
  }

  return years;
}
