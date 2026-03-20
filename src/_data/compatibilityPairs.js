/**
 * Compatibility Pairs Data Generator
 *
 * Generates 66 unique zodiac pairing objects for programmatic
 * compatibility pair pages at /compatibility/{animal-a}-{animal-b}/
 *
 * Each pair includes: relationship type, element interaction,
 * classical source references, trilingual labels, and SEO data.
 */

const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const animalsCn = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
const animalsSc = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const animalEmojis = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];
const branches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
const branchesCn = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const fixedElements = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'];
const fixedElementsCn = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];

// Six Harmonies (六合) — pairs whose Earthly Branches combine to produce a new element
const liuHePairs = {
  'rat-ox': { combinedElement: 'Earth', combinedElementCn: '土' },
  'tiger-pig': { combinedElement: 'Wood', combinedElementCn: '木' },
  'rabbit-dog': { combinedElement: 'Fire', combinedElementCn: '火' },
  'dragon-rooster': { combinedElement: 'Metal', combinedElementCn: '金' },
  'snake-monkey': { combinedElement: 'Water', combinedElementCn: '水' },
  'horse-goat': { combinedElement: 'Fire', combinedElementCn: '火' },
};

// Six Clashes (六衝) — directly opposed on the zodiac wheel
const clashPairs = new Set([
  'rat-horse', 'ox-goat', 'tiger-monkey',
  'rabbit-rooster', 'dragon-dog', 'snake-pig'
]);

// Six Harms (六害) — subtle, erosive friction
const harmPairs = new Set([
  'rat-goat', 'ox-horse', 'tiger-snake',
  'rabbit-dragon', 'monkey-pig', 'rooster-dog'
]);

// Three Harmonies (三合) triads — each animal belongs to one elemental triad
const sanHeTriads = {
  water: ['rat', 'dragon', 'monkey'],
  fire: ['snake', 'rooster', 'ox'],
  wood: ['tiger', 'horse', 'dog'],
  metal: ['pig', 'rabbit', 'goat'],
};

// Self-punishment (自刑) animals
const selfPunishment = new Set(['rat', 'dragon', 'horse', 'rooster']);

// Three Punishments (三刑) pairs
const punishmentPairs = new Set([
  'ox-dog', 'ox-goat', 'dog-goat',         // Ungrateful punishment (恃勢之刑)
  'tiger-snake', 'tiger-monkey', 'snake-monkey', // Uncivil punishment (無禮之刑)
  'rabbit-rat',                              // Disrespectful punishment
]);

// Element interaction descriptions
const elementInteractions = {
  'Water-Earth': { cycle: 'overcoming', desc: 'Earth dams Water', descCn: '土剋水', descSc: '土克水' },
  'Earth-Water': { cycle: 'overcoming', desc: 'Earth dams Water', descCn: '土剋水', descSc: '土克水' },
  'Water-Wood': { cycle: 'generating', desc: 'Water nourishes Wood', descCn: '水生木', descSc: '水生木' },
  'Wood-Water': { cycle: 'generating', desc: 'Water nourishes Wood', descCn: '水生木', descSc: '水生木' },
  'Water-Fire': { cycle: 'overcoming', desc: 'Water quenches Fire', descCn: '水剋火', descSc: '水克火' },
  'Fire-Water': { cycle: 'overcoming', desc: 'Water quenches Fire', descCn: '水剋火', descSc: '水克火' },
  'Water-Metal': { cycle: 'generating', desc: 'Metal collects Water', descCn: '金生水', descSc: '金生水' },
  'Metal-Water': { cycle: 'generating', desc: 'Metal collects Water', descCn: '金生水', descSc: '金生水' },
  'Water-Water': { cycle: 'same', desc: 'Water meets Water — amplified', descCn: '水水相逢', descSc: '水水相逢' },
  'Wood-Wood': { cycle: 'same', desc: 'Wood meets Wood — amplified', descCn: '木木相逢', descSc: '木木相逢' },
  'Fire-Fire': { cycle: 'same', desc: 'Fire meets Fire — amplified', descCn: '火火相逢', descSc: '火火相逢' },
  'Earth-Earth': { cycle: 'same', desc: 'Earth meets Earth — amplified', descCn: '土土相逢', descSc: '土土相逢' },
  'Metal-Metal': { cycle: 'same', desc: 'Metal meets Metal — amplified', descCn: '金金相逢', descSc: '金金相逢' },
  'Wood-Fire': { cycle: 'generating', desc: 'Wood feeds Fire', descCn: '木生火', descSc: '木生火' },
  'Fire-Wood': { cycle: 'generating', desc: 'Wood feeds Fire', descCn: '木生火', descSc: '木生火' },
  'Wood-Earth': { cycle: 'overcoming', desc: 'Wood parts Earth', descCn: '木剋土', descSc: '木克土' },
  'Earth-Wood': { cycle: 'overcoming', desc: 'Wood parts Earth', descCn: '木剋土', descSc: '木克土' },
  'Wood-Metal': { cycle: 'overcoming', desc: 'Metal chops Wood', descCn: '金剋木', descSc: '金克木' },
  'Metal-Wood': { cycle: 'overcoming', desc: 'Metal chops Wood', descCn: '金剋木', descSc: '金克木' },
  'Fire-Earth': { cycle: 'generating', desc: 'Fire creates Earth', descCn: '火生土', descSc: '火生土' },
  'Earth-Fire': { cycle: 'generating', desc: 'Fire creates Earth', descCn: '火生土', descSc: '火生土' },
  'Fire-Metal': { cycle: 'overcoming', desc: 'Fire melts Metal', descCn: '火剋金', descSc: '火克金' },
  'Metal-Fire': { cycle: 'overcoming', desc: 'Fire melts Metal', descCn: '火剋金', descSc: '火克金' },
  'Earth-Metal': { cycle: 'generating', desc: 'Earth yields Metal', descCn: '土生金', descSc: '土生金' },
  'Metal-Earth': { cycle: 'generating', desc: 'Earth yields Metal', descCn: '土生金', descSc: '土生金' },
};

// Per-animal personality traits for generating unique pair-specific content
const animalTraits = {
  Rat: {
    strengths: ['resourceful', 'quick-witted', 'adaptable', 'socially perceptive'],
    challenges: ['opportunistic tendencies', 'restlessness', 'difficulty with long-term commitment'],
    loveStyle: 'charming and attentive, showing affection through thoughtful gestures and lively conversation',
    workStyle: 'strategic and opportunistic, excelling at spotting openings and navigating complex social dynamics',
    socialNeed: 'intellectual stimulation and variety',
    stressTrigger: 'monotony and feeling trapped in rigid routines',
    classicalRef: 'The Shiji (史記) associates the Rat with the Zi (子) hour (11pm–1am), the moment when Yin gives way to Yang — a symbol of new beginnings and quiet initiative.',
    classicalRefTc: '《史記》將鼠與子時（晚上11點至凌晨1點）聯繫——陰轉陽的時刻，象徵新的開始和靜默的主動。',
    classicalRefSc: '《史记》将鼠与子时（晚上11点至凌晨1点）联系——阴转阳的时刻，象征新的开始和静默的主动。',
  },
  Ox: {
    strengths: ['dependable', 'patient', 'methodical', 'physically and mentally enduring'],
    challenges: ['stubbornness', 'resistance to change', 'difficulty expressing emotions'],
    loveStyle: 'steady and loyal, demonstrating devotion through consistent actions rather than grand declarations',
    workStyle: 'diligent and systematic, preferring structured environments where effort is rewarded predictably',
    socialNeed: 'stability and predictability in relationships',
    stressTrigger: 'chaos, broken promises, and having their routine disrupted',
    classicalRef: 'The Ox represents Chou (丑), the second Earthly Branch, associated with pre-dawn agricultural labour. Classical texts praise the Ox for its tireless cultivation of the land — a metaphor for building lasting foundations.',
    classicalRefTc: '牛代表丑（第二地支），與黎明前的農耕勞作相關。古典文獻讚揚牛不知疲倦地耕耘——建立持久基礎的隱喻。',
    classicalRefSc: '牛代表丑（第二地支），与黎明前的农耕劳作相关。古典文献赞扬牛不知疲倦地耕耘——建立持久基础的隐喻。',
  },
  Tiger: {
    strengths: ['courageous', 'charismatic', 'competitive', 'natural leader'],
    challenges: ['impulsiveness', 'difficulty accepting authority', 'can be domineering'],
    loveStyle: 'passionate and protective, pursuing partners with intensity and expecting equal devotion',
    workStyle: 'bold and visionary, thriving when leading projects but struggling under micromanagement',
    socialNeed: 'respect, autonomy, and the freedom to act on instinct',
    stressTrigger: 'feeling controlled, disrespected, or forced into subordinate positions',
    classicalRef: 'The Tiger governs Yin (寅), the third Branch, marking the hour when predators are most active (3–5am). In the Huainanzi, the Tiger embodies martial courage (武勇) and the protective power of the forest king.',
    classicalRefTc: '虎主寅（第三地支），標誌著捕食者最活躍的時辰（凌晨3-5點）。《淮南子》中，虎體現武勇和森林之王的庇護力量。',
    classicalRefSc: '虎主寅（第三地支），标志着捕食者最活跃的时辰（凌晨3-5点）。《淮南子》中，虎体现武勇和森林之王的庇护力量。',
  },
  Rabbit: {
    strengths: ['diplomatic', 'refined', 'perceptive', 'conflict-averse peacemaker'],
    challenges: ['indecisiveness', 'avoidance of confrontation', 'can be overly cautious'],
    loveStyle: 'gentle and romantic, creating harmonious atmospheres and expressing love through aesthetic gestures',
    workStyle: 'diplomatic and detail-oriented, excelling in roles requiring negotiation and artistic sensibility',
    socialNeed: 'harmony, beauty, and emotional safety',
    stressTrigger: 'conflict, harsh criticism, and environments lacking refinement',
    classicalRef: 'The Rabbit occupies Mao (卯), the fourth Branch (5–7am), when morning light illuminates gently. Associated with the Moon in folklore (玉兔, the Jade Rabbit), this sign carries lunar grace and quiet wisdom.',
    classicalRefTc: '兔佔卯位（第四地支，早上5-7點），晨光柔和照耀之時。民間傳說中與月亮相關（玉兔），此生肖承載月之優雅與靜默智慧。',
    classicalRefSc: '兔占卯位（第四地支，早上5-7点），晨光柔和照耀之时。民间传说中与月亮相关（玉兔），此生肖承载月之优雅与静默智慧。',
  },
  Dragon: {
    strengths: ['ambitious', 'visionary', 'magnetic', 'naturally authoritative'],
    challenges: ['arrogance', 'unrealistic expectations', 'intolerance of perceived mediocrity'],
    loveStyle: 'grand and generous, showering partners with attention but expecting admiration in return',
    workStyle: 'entrepreneurial and commanding, drawn to leadership and large-scale ventures',
    socialNeed: 'recognition, purpose, and a sense of significance',
    stressTrigger: 'being ignored, restricted to small tasks, or forced into anonymity',
    classicalRef: 'The Dragon rules Chen (辰), the fifth Branch (7–9am), when morning mist rises — the hour of transformation. As the only mythical zodiac animal, the Dragon represents the imperial ideal (龍) and the power to command heaven and earth.',
    classicalRefTc: '龍主辰（第五地支，早上7-9點），晨霧升起之時——變化的時辰。作為唯一的神話生肖動物，龍代表帝王理想（龍）和統御天地的力量。',
    classicalRefSc: '龙主辰（第五地支，早上7-9点），晨雾升起之时——变化的时辰。作为唯一的神话生肖动物，龙代表帝王理想（龙）和统御天地的力量。',
  },
  Snake: {
    strengths: ['intuitive', 'strategic', 'enigmatic', 'deeply analytical'],
    challenges: ['secretiveness', 'jealousy', 'tendency to manipulate rather than confront directly'],
    loveStyle: 'intense and possessive, forming deep bonds but requiring trust and exclusivity',
    workStyle: 'calculated and observant, excelling in research, finance, and strategic planning',
    socialNeed: 'intellectual depth, privacy, and emotional exclusivity',
    stressTrigger: 'betrayal of trust, superficiality, and being forced into the spotlight',
    classicalRef: 'The Snake governs Si (巳), the sixth Branch (9–11am), when the sun warms the earth. In Daoist symbolism, the Snake represents transformation and hidden wisdom, coiled potential waiting for the right moment to strike.',
    classicalRefTc: '蛇主巳（第六地支，上午9-11點），太陽溫暖大地之時。道教象徵中，蛇代表轉化和隱藏的智慧，蟄伏的潛力等待適當時機。',
    classicalRefSc: '蛇主巳（第六地支，上午9-11点），太阳温暖大地之时。道教象征中，蛇代表转化和隐藏的智慧，蛰伏的潜力等待适当时机。',
  },
  Horse: {
    strengths: ['energetic', 'freedom-loving', 'charismatic', 'action-oriented'],
    challenges: ['impatience', 'commitment anxiety', 'can be self-centred when pursuing goals'],
    loveStyle: 'passionate and spontaneous, craving adventure and excitement in relationships',
    workStyle: 'fast-paced and independent, performing best with autonomy and variety',
    socialNeed: 'freedom, movement, and new experiences',
    stressTrigger: 'confinement, repetitive tasks, and emotional clinginess from partners',
    classicalRef: 'The Horse rules Wu (午), the seventh Branch (11am–1pm), the zenith of Yang energy. Classical texts describe the Horse as the embodiment of pure forward momentum — in warfare, commerce, and the Silk Road trade that connected civilisations.',
    classicalRefTc: '馬主午（第七地支，上午11點至下午1點），陽氣的頂峰。古典文獻形容馬為純粹前進動力的化身——在戰爭、商業和連結文明的絲綢之路貿易中。',
    classicalRefSc: '马主午（第七地支，上午11点至下午1点），阳气的顶峰。古典文献形容马为纯粹前进动力的化身——在战争、商业和连结文明的丝绸之路贸易中。',
  },
  Goat: {
    strengths: ['creative', 'empathetic', 'artistic', 'nurturing'],
    challenges: ['dependency', 'indecisiveness', 'vulnerability to pessimism under pressure'],
    loveStyle: 'tender and devoted, creating warm, aesthetically pleasing environments for loved ones',
    workStyle: 'imaginative and collaborative, thriving in creative and supportive team settings',
    socialNeed: 'emotional security, appreciation, and a sense of belonging',
    stressTrigger: 'harsh criticism, financial instability, and feeling unappreciated',
    classicalRef: 'The Goat occupies Wei (未), the eighth Branch (1–3pm), the hour of gentle afternoon warmth. The character 羊 (yang) is embedded in the word for auspiciousness (祥) and righteousness (義), reflecting the Goat\'s cultural role as a symbol of benevolence.',
    classicalRefTc: '羊佔未位（第八地支，下午1-3點），柔和午後溫暖的時辰。「羊」字嵌入「祥」和「義」中，反映羊在文化中作為仁慈象徵的角色。',
    classicalRefSc: '羊占未位（第八地支，下午1-3点），柔和午后温暖的时辰。"羊"字嵌入"祥"和"义"中，反映羊在文化中作为仁慈象征的角色。',
  },
  Monkey: {
    strengths: ['clever', 'versatile', 'entertaining', 'quick problem-solver'],
    challenges: ['dishonesty when cornered', 'restlessness', 'difficulty with sustained focus'],
    loveStyle: 'playful and witty, keeping relationships lively but sometimes struggling with emotional depth',
    workStyle: 'innovative and agile, excelling at improvisation and finding unconventional solutions',
    socialNeed: 'mental stimulation, variety, and an audience that appreciates their wit',
    stressTrigger: 'boredom, being outsmarted, and rigid hierarchies that limit creative freedom',
    classicalRef: 'The Monkey governs Shen (申), the ninth Branch (3–5pm), when alertness peaks. Sun Wukong (孫悟空) in Journey to the West embodies the Monkey archetype: brilliant, irrepressible, and ultimately redeemed through discipline.',
    classicalRefTc: '猴主申（第九地支，下午3-5點），警覺性達到頂峰之時。《西遊記》中的孫悟空體現猴的原型：才華橫溢、不可壓制，最終通過修行得到救贖。',
    classicalRefSc: '猴主申（第九地支，下午3-5点），警觉性达到顶峰之时。《西游记》中的孙悟空体现猴的原型：才华横溢、不可压制，最终通过修行得到救赎。',
  },
  Rooster: {
    strengths: ['observant', 'hardworking', 'forthright', 'impeccably organised'],
    challenges: ['critical nature', 'perfectionism', 'can be abrasive in communication'],
    loveStyle: 'devoted and practical, showing care through acts of service and maintaining high standards',
    workStyle: 'meticulous and efficient, excelling in structured environments that reward precision',
    socialNeed: 'order, recognition for competence, and honest communication',
    stressTrigger: 'disorganisation, dishonesty, and having their expertise questioned',
    classicalRef: 'The Rooster rules You (酉), the tenth Branch (5–7pm), the hour of sunset gathering. The cock\'s crow (雞鳴) was the ancient world\'s alarm clock, and Chinese culture venerates the Rooster\'s five virtues: literary, martial, courageous, benevolent, and trustworthy (文武勇仁信).',
    classicalRefTc: '雞主酉（第十地支，下午5-7點），日落聚集的時辰。雞鳴是古代的鬧鐘，中國文化尊崇雞的五德：文、武、勇、仁、信。',
    classicalRefSc: '鸡主酉（第十地支，下午5-7点），日落聚集的时辰。鸡鸣是古代的闹钟，中国文化尊崇鸡的五德：文、武、勇、仁、信。',
  },
  Dog: {
    strengths: ['loyal', 'honest', 'protective', 'strong sense of justice'],
    challenges: ['anxiety', 'pessimism', 'difficulty trusting until loyalty is proven'],
    loveStyle: 'faithful and protective, offering unwavering support but needing reassurance of reciprocal loyalty',
    workStyle: 'reliable and principled, excelling in roles that serve others and uphold ethical standards',
    socialNeed: 'trust, moral alignment, and a cause worth defending',
    stressTrigger: 'injustice, disloyalty, and environments where ethics are compromised',
    classicalRef: 'The Dog occupies Xu (戌), the eleventh Branch (7–9pm), the hour of guarding the home. The Dog\'s loyalty is proverbial in Chinese culture — the phrase "a faithful dog at the door" (義犬守門) represents incorruptible devotion.',
    classicalRefTc: '狗佔戌位（第十一地支，晚上7-9點），守護家園的時辰。狗的忠誠在中國文化中是典範——「義犬守門」代表不可腐蝕的忠誠。',
    classicalRefSc: '狗占戌位（第十一地支，晚上7-9点），守护家园的时辰。狗的忠诚在中国文化中是典范——"义犬守门"代表不可腐蚀的忠诚。',
  },
  Pig: {
    strengths: ['generous', 'warm-hearted', 'optimistic', 'enjoys life fully'],
    challenges: ['naivety', 'overindulgence', 'can be taken advantage of due to trusting nature'],
    loveStyle: 'affectionate and generous, creating comfortable, indulgent spaces for partners to relax',
    workStyle: 'enthusiastic and good-natured, excelling in collaborative settings that value harmony',
    socialNeed: 'comfort, genuine connection, and reciprocated generosity',
    stressTrigger: 'exploitation, meanness, and being forced into competitive confrontation',
    classicalRef: 'The Pig governs Hai (亥), the twelfth and final Branch (9–11pm), when the world settles into rest. Hai is the last stage before the cycle restarts at Zi — the Pig represents completion, contentment, and the wisdom of knowing when enough is enough.',
    classicalRefTc: '豬主亥（第十二也是最後一個地支，晚上9-11點），世界歸於安寧之時。亥是循環在子重新開始前的最後階段——豬代表圓滿、知足和懂得適可而止的智慧。',
    classicalRefSc: '猪主亥（第十二也是最后一个地支，晚上9-11点），世界归于安宁之时。亥是循环在子重新开始前的最后阶段——猪代表圆满、知足和懂得适可而止的智慧。',
  },
};

// Generate pair-specific personality analysis
function generatePairAnalysis(animalA, animalB, isSelf, relType) {
  const tA = animalTraits[animalA];
  const tB = animalTraits[animalB];

  if (isSelf) {
    return {
      en: `Both partners share the ${animalA}'s core qualities: ${tA.strengths.join(', ')}. This creates instant recognition and understanding. ${tA.classicalRef} In love, two ${animalA} people are both ${tA.loveStyle}. The shared approach means neither partner needs to explain themselves — but it also means shared blind spots (${tA.challenges.join(', ')}) may go unchallenged. At work, both gravitate toward being ${tA.workStyle}. The risk is competition for the same role rather than complementary division of labour. Both need ${tA.socialNeed}, so ensuring each partner has independent sources of fulfilment prevents the relationship from becoming claustrophobic. The shared stress trigger — ${tA.stressTrigger} — can affect both simultaneously, requiring external support systems.`,
      tc: `${tA.classicalRefTc} 兩個${animalTraits[animalA] ? animalA : animalA}人共享相同的核心品質：他們在愛情中都是${tA.loveStyle.split(',')[0]}的。這種共同方式意味著無需解釋——但共同的盲點可能不受挑戰。在工作中，兩人都傾向於相同的風格。確保每位伴侶有獨立的滿足來源，防止關係變得過於封閉。`,
      sc: `${tA.classicalRefSc} 两个${animalA}人共享相同的核心品质：他们在爱情中都是${tA.loveStyle.split(',')[0]}的。这种共同方式意味着无需解释——但共同的盲点可能不受挑战。在工作中，两人都倾向于相同的风格。确保每位伴侣有独立的满足来源，防止关系变得过于封闭。`,
    };
  }

  return {
    en: `The ${animalA} brings ${tA.strengths.slice(0, 2).join(' and ')} energy, while the ${animalB} contributes ${tB.strengths.slice(0, 2).join(' and ')} qualities. ${tA.classicalRef} ${tB.classicalRef} In romantic relationships, the ${animalA} is ${tA.loveStyle}, whereas the ${animalB} is ${tB.loveStyle}. ${relType === 'liuHe' || relType === 'sanHe' ? 'These complementary styles create a rich, multi-dimensional bond.' : relType === 'clash' ? 'These contrasting styles can spark intense attraction but also friction when expectations diverge.' : relType === 'harm' ? 'These different emotional languages may cause quiet misunderstandings if not explicitly discussed.' : 'Whether these styles mesh well depends on individual maturity and communication.'} In professional settings, the ${animalA} is ${tA.workStyle}, while the ${animalB} is ${tB.workStyle}. The ${animalA} needs ${tA.socialNeed}, whereas the ${animalB} craves ${tB.socialNeed}. Understanding these different needs is the foundation of a lasting connection. The ${animalA} becomes stressed by ${tA.stressTrigger}, while the ${animalB} struggles with ${tB.stressTrigger}. Recognising each other's triggers allows partners to provide support precisely when it matters most.`,
    tc: `${tA.classicalRefTc} ${tB.classicalRefTc} 在感情中，兩者展現不同但可能互補的風格。在職業環境中，雙方各有優勢。理解彼此的不同需求是建立持久連結的基礎。認識對方的壓力觸發點，能在最關鍵的時刻提供適當的支持。`,
    sc: `${tA.classicalRefSc} ${tB.classicalRefSc} 在感情中，两者展现不同但可能互补的风格。在职业环境中，双方各有优势。理解彼此的不同需求是建立持久连结的基础。认识对方的压力触发点，能在最关键的时刻提供适当的支持。`,
  };
}

// Detailed relationship descriptions per type
const relationshipContent = {
  liuHe: {
    en: (a, b, combined) => `The ${a} and ${b} form one of the Six Harmonies (六合, Liù Hé), the most naturally compatible pairings in Chinese astrology. Their Earthly Branches combine to produce ${combined} energy — a quiet, stabilising bond sometimes called a "secret friendship" (暗合). This concept was documented in the Huainanzi (淮南子, 2nd century BCE) and later codified in Tang Dynasty BaZi analysis. The harmony between these two signs operates at a deep, almost effortless level. Partners in a Liu He bond often share intuitive understanding and complementary strengths without needing to negotiate.`,
    tc: (a, b, combined) => `${a}與${b}是六合（Liù Hé）之一，是中國星命學中最自然和諧的配對。兩者的地支結合後產生${combined}能量——一種安靜而穩定的連結，有時被稱為「暗合」。此概念記載於《淮南子》（公元前2世紀），後在唐朝八字分析中進一步系統化。`,
    sc: (a, b, combined) => `${a}与${b}是六合（Liù Hé）之一，是中国星命学中最自然和谐的配对。两者的地支结合后产生${combined}能量——一种安静而稳定的连结，有时被称为"暗合"。此概念记载于《淮南子》（公元前2世纪），后在唐朝八字分析中进一步系统化。`,
  },
  sanHe: {
    en: (a, b, triadElement) => `The ${a} and ${b} belong to the same Three Harmonies (三合, Sān Hé) triad, sharing ${triadElement} elemental affinity. The Three Harmonies are among the oldest compatibility structures in Chinese astrology, predating the formalisation of BaZi. Animals within the same triad cooperate naturally and understand each other's motivations intuitively. Their bond is broader and more collaborative than the Six Harmonies — it operates well in friendships, business partnerships, and team dynamics.`,
    tc: (a, b, triadElement) => `${a}與${b}同屬三合（Sān Hé）局，共享${triadElement}五行親和力。三合是中國星命學中最古老的相容結構之一。同一三合局的生肖自然合作，直覺地理解彼此的動機。`,
    sc: (a, b, triadElement) => `${a}与${b}同属三合（Sān Hé）局，共享${triadElement}五行亲和力。三合是中国星命学中最古老的相容结构之一。同一三合局的生肖自然合作，直觉地理解彼此的动机。`,
  },
  clash: {
    en: (a, b) => `The ${a} and ${b} form one of the Six Clashes (六衝, Liù Chōng), sitting directly opposite each other on the zodiac wheel. Their energies are fundamentally opposed — separated by six positions, they embody contrasting life philosophies and temperaments. However, classical analysis emphasises that awareness of these dynamics can transform conflict into complementary growth. A clash does not doom a relationship — it signals where conscious effort and mutual understanding are essential. In BaZi practice, a clash can also indicate significant life changes and breakthroughs when the tension is channelled constructively.`,
    tc: (a, b) => `${a}與${b}是六衝（Liù Chōng）之一，在生肖輪盤上直接對立。兩者的能量根本對立——相隔六個位置，體現截然相反的人生觀和性情。然而，古典分析強調，認識這些動態能將衝突轉化為互補的成長。`,
    sc: (a, b) => `${a}与${b}是六冲（Liù Chōng）之一，在生肖轮盘上直接对立。两者的能量根本对立——相隔六个位置，体现截然相反的人生观和性情。然而，古典分析强调，认识这些动态能将冲突转化为互补的成长。`,
  },
  harm: {
    en: (a, b) => `The ${a} and ${b} form one of the Six Harms (六害, Liù Hài), a relationship where hidden resentments and misunderstandings tend to develop over time. Unlike clashes, which are overt, harms are insidious — they erode relationships gradually through subtle friction. The harm relationship derives from one animal interfering with its partner's Six Harmony bond. Open communication and awareness of these patterns are essential to prevent the gradual erosion of trust.`,
    tc: (a, b) => `${a}與${b}是六害（Liù Hài）之一，隱藏的怨恨和誤解會隨時間逐漸發展。與衝不同，害更為隱伏——通過細微的摩擦逐漸侵蝕關係。害的關係源於一方干擾另一方的六合連結。`,
    sc: (a, b) => `${a}与${b}是六害（Liù Hài）之一，隐藏的怨恨和误解会随时间逐渐发展。与冲不同，害更为隐伏——通过细微的摩擦逐渐侵蚀关系。害的关系源于一方干扰另一方的六合连结。`,
  },
  neutral: {
    en: (a, b) => `The ${a} and ${b} share a neutral relationship — they are neither direct allies nor antagonists in the classical Earthly Branch system. This means their compatibility depends more heavily on other factors: the specific elemental interaction between their fixed elements, the Heavenly Stems of their birth years, and the broader BaZi chart. Neutral pairings have the advantage of flexibility — without the strong pull of a harmony or the friction of a clash, these relationships are shaped primarily by individual character and effort.`,
    tc: (a, b) => `${a}與${b}在古典地支系統中屬於中性關係——既非直接盟友，也非對立。這意味著配對結果更依賴其他因素：固定五行的互動、出生年份的天干，以及完整的八字命盤。`,
    sc: (a, b) => `${a}与${b}在古典地支系统中属于中性关系——既非直接盟友，也非对立。这意味着配对结果更依赖其他因素：固定五行的互动、出生年份的天干，以及完整的八字命盘。`,
  },
  self: {
    en: (a, hasPunishment) => `Two ${a} people share identical zodiac energy, which brings deep mutual understanding and shared rhythms.${hasPunishment ? ` The ${a} carries a Self-Punishment (自刑, Zì Xíng) dynamic when doubled — this does not doom the pairing, but signals specific internal tensions that may be amplified when two people of the same sign interact. Awareness of these tendencies is the key to managing them constructively.` : ` While same-sign pairings lack the Self-Punishment (自刑) dynamic, the doubled energy can still create intensity — two individuals with the same strengths may compete rather than complement, and shared weaknesses may go unchecked.`}`,
    tc: (a, hasPunishment) => `兩個${a}人共享相同的生肖能量，帶來深層的相互理解和共同節奏。${hasPunishment ? `${a}在重複時帶有自刑（Zì Xíng）動態——這不會判定配對失敗，但信號著可能被放大的內在緊張。` : `雖然同生肖配對沒有自刑動態，但重複的能量仍可能產生強度。`}`,
    sc: (a, hasPunishment) => `两个${a}人共享相同的生肖能量，带来深层的相互理解和共同节奏。${hasPunishment ? `${a}在重复时带有自刑（Zì Xíng）动态——这不会判定配对失败，但信号着可能被放大的内在紧张。` : `虽然同生肖配对没有自刑动态，但重复的能量仍可能产生强度。`}`,
  },
};

// Advice per relationship type
const adviceContent = {
  liuHe: {
    en: "This is one of the strongest natural bonds in Chinese astrology. Trust the quiet harmony of this connection and build on your shared strengths. The combined elemental energy suggests an area of life where you naturally collaborate well.",
    tc: "這是中國星命學中最強的自然連結之一。信任這份安靜的和諧，在共同優勢上建設。合化的五行能量暗示你們自然合作的領域。",
    sc: "这是中国星命学中最强的自然连结之一。信任这份安静的和谐，在共同优势上建设。合化的五行能量暗示你们自然合作的领域。"
  },
  sanHe: {
    en: "Your triad connection gives you a natural foundation of understanding. This is an especially strong bond for collaborative work, shared projects, and long-term partnerships. Look for opportunities to work together toward common goals.",
    tc: "三合的連結為你們提供了自然的理解基礎。這種連結在合作項目和長期夥伴關係中特別有力。尋找共同目標的機會。",
    sc: "三合的连结为你们提供了自然的理解基础。这种连结在合作项目和长期伙伴关系中特别有力。寻找共同目标的机会。"
  },
  clash: {
    en: "Acknowledge your differences as strengths rather than threats. Where one partner is cautious, the other is bold — together you cover more ground than either alone. Set clear communication patterns and give each other space when tension rises. Many long-lasting relationships thrive on the dynamism of a clash.",
    tc: "將差異視為優勢而非威脅。一方謹慎，另一方大膽——合作比單獨行動更有效。建立清晰的溝通模式，緊張時給彼此空間。許多持久的關係在衝的活力中蓬勃發展。",
    sc: "将差异视为优势而非威胁。一方谨慎，另一方大胆——合作比单独行动更有效。建立清晰的沟通模式，紧张时给彼此空间。许多持久的关系在冲的活力中蓬勃发展。"
  },
  harm: {
    en: "The key to navigating a Harm relationship is transparency. Address small resentments before they compound. Schedule regular honest conversations about how you feel in the relationship. The Harm dynamic loses most of its power when both partners practise proactive communication rather than allowing friction to fester silently.",
    tc: "應對害的關鍵是透明度。在小怨恨累積之前解決。定期安排坦誠的對話。當雙方都主動溝通而非讓摩擦默默發酵時，害的動態會失去大部分威力。",
    sc: "应对害的关键是透明度。在小怨恨累积之前解决。定期安排坦诚的对话。当双方都主动沟通而非让摩擦默默发酵时，害的动态会失去大部分威力。"
  },
  neutral: {
    en: "A neutral pairing means you have a blank canvas — your relationship is shaped more by your individual characters, shared values, and life choices than by zodiac mechanics. Focus on understanding each other's elemental needs and communication styles. Consider a full BaZi reading for deeper insight into your specific dynamic.",
    tc: "中性配對意味著你們有一塊空白畫布——關係更多由個人性格、共同價值觀和生活選擇塑造。專注於理解彼此的五行需求和溝通方式。考慮完整的八字解讀以獲得更深入的洞察。",
    sc: "中性配对意味着你们有一块空白画布——关系更多由个人性格、共同价值观和生活选择塑造。专注于理解彼此的五行需求和沟通方式。考虑完整的八字解读以获得更深入的洞察。"
  },
  self: {
    en: "Same-sign pairings require conscious differentiation. Celebrate your shared understanding but cultivate individual interests and perspectives. Avoid competing over the same strengths — instead, recognise that you can alternate leadership roles depending on the situation.",
    tc: "同生肖配對需要有意識的差異化。慶祝共同的理解，但培養個人興趣和觀點。避免在相同優勢上競爭——認識到可以根據情況輪流領導。",
    sc: "同生肖配对需要有意识的差异化。庆祝共同的理解，但培养个人兴趣和观点。避免在相同优势上竞争——认识到可以根据情况轮流领导。"
  },
};

// Compatibility scores (indicative, 1-5 scale)
const compatScores = {
  liuHe: 5,
  sanHe: 4,
  neutral: 3,
  harm: 2,
  clash: 2,
  self: 3,
};

function getKey(a, b) {
  return [a, b].sort().join('-');
}

function getSanHeTriad(animal) {
  for (const [element, members] of Object.entries(sanHeTriads)) {
    if (members.includes(animal)) return { element, members };
  }
  return null;
}

function isSanHePair(a, b) {
  const triad = getSanHeTriad(a);
  return triad && triad.members.includes(b);
}

export default function () {
  const pairs = [];

  for (let i = 0; i < 12; i++) {
    for (let j = i; j < 12; j++) {
      const aSlug = animals[i].toLowerCase();
      const bSlug = animals[j].toLowerCase();
      const key = getKey(aSlug, bSlug);
      const isSelf = i === j;

      // Determine relationship type
      let relType = 'neutral';
      let relLabel = 'Neutral';
      let relLabelCn = '中性';
      let relLabelSc = '中性';
      let relIcon = '—';
      let combinedElement = null;
      let combinedElementCn = null;
      let triadElement = null;

      if (isSelf) {
        relType = 'self';
        relLabel = 'Same Sign';
        relLabelCn = '同生肖';
        relLabelSc = '同生肖';
        relIcon = '🔄';
      } else if (liuHePairs[key]) {
        relType = 'liuHe';
        relLabel = 'Six Harmony (六合)';
        relLabelCn = '六合';
        relLabelSc = '六合';
        relIcon = '♥';
        combinedElement = liuHePairs[key].combinedElement;
        combinedElementCn = liuHePairs[key].combinedElementCn;
      } else if (clashPairs.has(key)) {
        relType = 'clash';
        relLabel = 'Six Clash (六衝)';
        relLabelCn = '六衝';
        relLabelSc = '六冲';
        relIcon = '⚔';
      } else if (harmPairs.has(key)) {
        relType = 'harm';
        relLabel = 'Six Harm (六害)';
        relLabelCn = '六害';
        relLabelSc = '六害';
        relIcon = '⚠';
      } else if (isSanHePair(aSlug, bSlug)) {
        relType = 'sanHe';
        const triad = getSanHeTriad(aSlug);
        triadElement = triad.element.charAt(0).toUpperCase() + triad.element.slice(1);
        relLabel = `Three Harmony (三合) — ${triadElement} Triad`;
        relLabelCn = `三合 — ${triadElement}局`;
        relLabelSc = `三合 — ${triadElement}局`;
        relIcon = '★';
      }

      // Element interaction
      const elA = fixedElements[i];
      const elB = fixedElements[j];
      const elKey = `${elA}-${elB}`;
      const elInteraction = elementInteractions[elKey] || { cycle: 'same', desc: `${elA} meets ${elB}`, descCn: '', descSc: '' };

      // Generate content
      let descEn, descTc, descSc;
      if (isSelf) {
        const hasPunishment = selfPunishment.has(aSlug);
        descEn = relationshipContent.self.en(animals[i], hasPunishment);
        descTc = relationshipContent.self.tc(animalsCn[i], hasPunishment);
        descSc = relationshipContent.self.sc(animalsSc[i], hasPunishment);
      } else if (relType === 'liuHe') {
        descEn = relationshipContent.liuHe.en(animals[i], animals[j], combinedElement);
        descTc = relationshipContent.liuHe.tc(animalsCn[i], animalsCn[j], combinedElementCn);
        descSc = relationshipContent.liuHe.sc(animalsSc[i], animalsSc[j], combinedElementCn);
      } else if (relType === 'sanHe') {
        descEn = relationshipContent.sanHe.en(animals[i], animals[j], triadElement);
        descTc = relationshipContent.sanHe.tc(animalsCn[i], animalsCn[j], triadElement);
        descSc = relationshipContent.sanHe.sc(animalsSc[i], animalsSc[j], triadElement);
      } else if (relType === 'clash') {
        descEn = relationshipContent.clash.en(animals[i], animals[j]);
        descTc = relationshipContent.clash.tc(animalsCn[i], animalsCn[j]);
        descSc = relationshipContent.clash.sc(animalsSc[i], animalsSc[j]);
      } else if (relType === 'harm') {
        descEn = relationshipContent.harm.en(animals[i], animals[j]);
        descTc = relationshipContent.harm.tc(animalsCn[i], animalsCn[j]);
        descSc = relationshipContent.harm.sc(animalsSc[i], animalsSc[j]);
      } else {
        descEn = relationshipContent.neutral.en(animals[i], animals[j]);
        descTc = relationshipContent.neutral.tc(animalsCn[i], animalsCn[j]);
        descSc = relationshipContent.neutral.sc(animalsSc[i], animalsSc[j]);
      }

      const advice = adviceContent[relType];
      const score = compatScores[relType];

      // Generate pair-specific personality analysis
      const pairAnalysis = generatePairAnalysis(animals[i], animals[j], isSelf, relType);

      // Slug: always alphabetical for canonical URLs
      const slug = isSelf ? `${aSlug}-${bSlug}` : key;

      pairs.push({
        slug,
        animalA: animals[i],
        animalB: animals[j],
        animalACn: animalsCn[i],
        animalBCn: animalsCn[j],
        animalASc: animalsSc[i],
        animalBSc: animalsSc[j],
        emojiA: animalEmojis[i],
        emojiB: animalEmojis[j],
        branchA: branches[i],
        branchB: branches[j],
        branchACn: branchesCn[i],
        branchBCn: branchesCn[j],
        fixedElementA: fixedElements[i],
        fixedElementB: fixedElements[j],
        fixedElementACn: fixedElementsCn[i],
        fixedElementBCn: fixedElementsCn[j],
        isSelf,
        relType,
        relLabel,
        relLabelCn,
        relLabelSc,
        relIcon,
        combinedElement,
        combinedElementCn,
        triadElement,
        elInteraction,
        score,
        descEn,
        descTc,
        descSc,
        adviceEn: advice.en,
        adviceTc: advice.tc,
        adviceSc: advice.sc,
        pairAnalysisEn: pairAnalysis.en,
        pairAnalysisTc: pairAnalysis.tc,
        pairAnalysisSc: pairAnalysis.sc,
        permalink: `/compatibility/${slug}/`,
      });
    }
  }

  return pairs;
}
