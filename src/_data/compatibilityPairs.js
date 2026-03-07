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
        permalink: `/compatibility/${slug}/`,
      });
    }
  }

  return pairs;
}
