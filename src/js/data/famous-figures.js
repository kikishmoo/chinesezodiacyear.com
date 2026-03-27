/**
 * Famous Figures — Historical figures for each zodiac animal.
 *
 * Index 0=Rat, 1=Ox, ... 11=Pig.
 * Birth years verified via ((year-4)%12+12)%12.
 */

export const famousFigures = [
  /* 0 Rat */   { name: 'Du Fu', cn: '杜甫', born: '712-770 CE', title: 'The Poet Sage (詩聖)', story: 'Du Fu is revered as the greatest realist poet in Chinese history. His works document the devastation of the An Lushan Rebellion and the suffering of common people with unmatched compassion and technical mastery.' },
  /* 1 Ox */    { name: 'Su Shi', cn: '蘇軾', born: '1037-1101 CE', title: 'Song Dynasty Polymath', story: 'Su Shi (Su Dongpo) was a poet, painter, calligrapher, statesman, and gastronome. He is considered one of the greatest poets of the Song Dynasty and invented Dongpo Pork, still beloved today.' },
  /* 2 Tiger */ { name: 'Qin Shi Huang', cn: '秦始皇', born: '259-210 BCE', title: 'First Emperor of China', story: 'Qin Shi Huang unified China, standardised writing, weights, and currency, built the Great Wall, and created the Terracotta Army. He ended centuries of warring states to forge one empire.' },
  /* 3 Rabbit */{ name: 'Emperor Qianlong', cn: '乾隆帝', born: '1711-1799 CE', title: 'Qing Dynasty Zenith Emperor', story: 'The Qianlong Emperor presided over the height of Qing power and prosperity. A prolific poet and art collector, his 60-year reign saw territorial expansion and cultural flourishing.' },
  /* 4 Dragon */{ name: 'Zhu Yuanzhang', cn: '朱元璋', born: '1328-1398 CE', title: 'Ming Dynasty Founder (洪武帝)', story: 'From orphaned beggar monk to Emperor. Zhu Yuanzhang overthrew the Mongol Yuan Dynasty and founded the Ming, one of the greatest rags-to-riches stories in world history.' },
  /* 5 Snake */ { name: 'Zhu Xi', cn: '朱熹', born: '1130-1200 CE', title: 'Neo-Confucian Philosopher', story: 'Zhu Xi synthesised Confucian thought into Neo-Confucianism, which became China\'s state ideology for 700 years. He compiled the Four Books that shaped East Asian education.' },
  /* 6 Horse */ { name: 'Emperor Taizong', cn: '唐太宗 李世民', born: '598-649 CE', title: 'Tang Dynasty Golden Age Ruler', story: 'Li Shimin established the Zhenguan era, widely regarded as the pinnacle of Chinese civilisation. His openness to foreign cultures and meritocratic governance made Tang Chang\'an the world\'s greatest city.' },
  /* 7 Goat */  { name: 'Cao Cao', cn: '曹操', born: '155-220 CE', title: 'Warlord, Poet & Strategist', story: 'Cao Cao unified northern China during the Three Kingdoms era. Beyond his military genius, he was also one of the finest poets of the Jian\'an period, bringing emotional depth to verse.' },
  /* 8 Monkey */{ name: 'Li Bai', cn: '李白', born: '701-762 CE', title: 'The Immortal of Poetry (詩仙)', story: 'Li Bai is the most celebrated Romantic poet in Chinese history. His vivid imagination, love of wine and moonlight, and spontaneous genius produced some of the most beloved poems ever written in Chinese.' },
  /* 9 Rooster*/{ name: 'Zhuge Liang', cn: '諸葛亮', born: '181-234 CE', title: 'The Sleeping Dragon (臥龍)', story: 'Zhuge Liang was the legendary strategist of Shu Han during the Three Kingdoms. His brilliance in statecraft and warfare made him the Chinese archetype of wisdom and loyalty.' },
  /* 10 Dog */  { name: 'Emperor Wu of Han', cn: '漢武帝', born: '156-87 BCE', title: 'Expansionist Emperor', story: 'Emperor Wu (漢武帝) transformed the Han Dynasty into a continental power, opening the Silk Road, establishing Confucianism as state ideology, and extending Chinese influence deep into Central Asia.' },
  /* 11 Pig */  { name: 'Bao Zheng', cn: '包拯', born: '999-1062 CE', title: 'Incorruptible Judge (包青天)', story: 'Bao Zheng (包青天, "Blue Sky Bao") is China\'s legendary symbol of justice and incorruptibility. As a Song Dynasty official, he was famed for his impartial judgements regardless of rank or power.' }
];
