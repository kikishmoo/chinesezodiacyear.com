/**
 * Compatibility Content — Worker-side pair content generator.
 *
 * Contains animal traits, relationship descriptions, and advice content
 * mirrored from src/_data/compatibilityPairs.js. Used by report-service
 * to fill in section content when the frontend sends minimal pair data
 * (e.g. from the compatibility checker, which lacks full pair analysis).
 *
 * No SQL, no HTTP — pure data + content generation.
 */

/* ── Placeholder: sections filled by Edit tool ── */

// Animal data arrays
const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const fixedElements = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'];

export const animalTraits = {
  Rat: {
    strengths: ['resourceful', 'quick-witted', 'adaptable', 'socially perceptive'],
    challenges: ['opportunistic tendencies', 'restlessness', 'difficulty with long-term commitment'],
    loveStyle: 'charming and attentive, showing affection through thoughtful gestures and lively conversation',
    workStyle: 'strategic and opportunistic, excelling at spotting openings and navigating complex social dynamics',
    socialNeed: 'intellectual stimulation and variety',
    stressTrigger: 'monotony and feeling trapped in rigid routines',
  },
  Ox: {
    strengths: ['dependable', 'patient', 'methodical', 'physically and mentally enduring'],
    challenges: ['stubbornness', 'resistance to change', 'difficulty expressing emotions'],
    loveStyle: 'steady and loyal, demonstrating devotion through consistent actions rather than grand declarations',
    workStyle: 'diligent and systematic, preferring structured environments where effort is rewarded predictably',
    socialNeed: 'stability and predictability in relationships',
    stressTrigger: 'chaos, broken promises, and having their routine disrupted',
  },
  Tiger: {
    strengths: ['courageous', 'charismatic', 'competitive', 'natural leader'],
    challenges: ['impulsiveness', 'difficulty accepting authority', 'can be domineering'],
    loveStyle: 'passionate and protective, pursuing partners with intensity and expecting equal devotion',
    workStyle: 'bold and visionary, thriving when leading projects but struggling under micromanagement',
    socialNeed: 'respect, autonomy, and the freedom to act on instinct',
    stressTrigger: 'feeling controlled, disrespected, or forced into subordinate positions',
  },
  Rabbit: {
    strengths: ['diplomatic', 'refined', 'perceptive', 'conflict-averse peacemaker'],
    challenges: ['indecisiveness', 'avoidance of confrontation', 'can be overly cautious'],
    loveStyle: 'gentle and romantic, creating harmonious atmospheres and expressing love through aesthetic gestures',
    workStyle: 'diplomatic and detail-oriented, excelling in roles requiring negotiation and artistic sensibility',
    socialNeed: 'harmony, beauty, and emotional safety',
    stressTrigger: 'conflict, harsh criticism, and environments lacking refinement',
  },
  Dragon: {
    strengths: ['ambitious', 'visionary', 'magnetic', 'naturally authoritative'],
    challenges: ['arrogance', 'unrealistic expectations', 'intolerance of perceived mediocrity'],
    loveStyle: 'grand and generous, showering partners with attention but expecting admiration in return',
    workStyle: 'entrepreneurial and commanding, drawn to leadership and large-scale ventures',
    socialNeed: 'recognition, purpose, and a sense of significance',
    stressTrigger: 'being ignored, restricted to small tasks, or forced into anonymity',
  },
  Snake: {
    strengths: ['intuitive', 'strategic', 'enigmatic', 'deeply analytical'],
    challenges: ['secretiveness', 'jealousy', 'tendency to manipulate rather than confront directly'],
    loveStyle: 'intense and possessive, forming deep bonds but requiring trust and exclusivity',
    workStyle: 'calculated and observant, excelling in research, finance, and strategic planning',
    socialNeed: 'intellectual depth, privacy, and emotional exclusivity',
    stressTrigger: 'betrayal of trust, superficiality, and being forced into the spotlight',
  },
  Horse: {
    strengths: ['energetic', 'freedom-loving', 'charismatic', 'action-oriented'],
    challenges: ['impatience', 'commitment anxiety', 'can be self-centred when pursuing goals'],
    loveStyle: 'passionate and spontaneous, craving adventure and excitement in relationships',
    workStyle: 'fast-paced and independent, performing best with autonomy and variety',
    socialNeed: 'freedom, movement, and new experiences',
    stressTrigger: 'confinement, repetitive tasks, and emotional clinginess from partners',
  },
  Goat: {
    strengths: ['creative', 'empathetic', 'artistic', 'nurturing'],
    challenges: ['dependency', 'indecisiveness', 'vulnerability to pessimism under pressure'],
    loveStyle: 'tender and devoted, creating warm, aesthetically pleasing environments for loved ones',
    workStyle: 'imaginative and collaborative, thriving in creative and supportive team settings',
    socialNeed: 'emotional security, appreciation, and a sense of belonging',
    stressTrigger: 'harsh criticism, financial instability, and feeling unappreciated',
  },
  Monkey: {
    strengths: ['clever', 'versatile', 'entertaining', 'quick problem-solver'],
    challenges: ['dishonesty when cornered', 'restlessness', 'difficulty with sustained focus'],
    loveStyle: 'playful and witty, keeping relationships lively but sometimes struggling with emotional depth',
    workStyle: 'innovative and agile, excelling at improvisation and finding unconventional solutions',
    socialNeed: 'mental stimulation, variety, and an audience that appreciates their wit',
    stressTrigger: 'boredom, being outsmarted, and rigid hierarchies that limit creative freedom',
  },
  Rooster: {
    strengths: ['observant', 'hardworking', 'forthright', 'impeccably organised'],
    challenges: ['critical nature', 'perfectionism', 'can be abrasive in communication'],
    loveStyle: 'devoted and practical, showing care through acts of service and maintaining high standards',
    workStyle: 'meticulous and efficient, excelling in structured environments that reward precision',
    socialNeed: 'order, recognition for competence, and honest communication',
    stressTrigger: 'disorganisation, dishonesty, and having their expertise questioned',
  },
  Dog: {
    strengths: ['loyal', 'honest', 'protective', 'strong sense of justice'],
    challenges: ['anxiety', 'pessimism', 'difficulty trusting until loyalty is proven'],
    loveStyle: 'faithful and protective, offering unwavering support but needing reassurance of reciprocal loyalty',
    workStyle: 'reliable and principled, excelling in roles that serve others and uphold ethical standards',
    socialNeed: 'trust, moral alignment, and a cause worth defending',
    stressTrigger: 'injustice, disloyalty, and environments where ethics are compromised',
  },
  Pig: {
    strengths: ['generous', 'warm-hearted', 'optimistic', 'enjoys life fully'],
    challenges: ['naivety', 'overindulgence', 'can be taken advantage of due to trusting nature'],
    loveStyle: 'affectionate and generous, creating comfortable, indulgent spaces for partners to relax',
    workStyle: 'enthusiastic and good-natured, excelling in collaborative settings that value harmony',
    socialNeed: 'comfort, genuine connection, and reciprocated generosity',
    stressTrigger: 'exploitation, meanness, and being forced into competitive confrontation',
  },
};

export const elementInteractions = {
  'Water-Earth': { cycle: 'overcoming', desc: 'Earth dams Water' },
  'Earth-Water': { cycle: 'overcoming', desc: 'Earth dams Water' },
  'Water-Wood': { cycle: 'generating', desc: 'Water nourishes Wood' },
  'Wood-Water': { cycle: 'generating', desc: 'Water nourishes Wood' },
  'Water-Fire': { cycle: 'overcoming', desc: 'Water quenches Fire' },
  'Fire-Water': { cycle: 'overcoming', desc: 'Water quenches Fire' },
  'Water-Metal': { cycle: 'generating', desc: 'Metal collects Water' },
  'Metal-Water': { cycle: 'generating', desc: 'Metal collects Water' },
  'Water-Water': { cycle: 'same', desc: 'Water meets Water — amplified' },
  'Wood-Wood': { cycle: 'same', desc: 'Wood meets Wood — amplified' },
  'Fire-Fire': { cycle: 'same', desc: 'Fire meets Fire — amplified' },
  'Earth-Earth': { cycle: 'same', desc: 'Earth meets Earth — amplified' },
  'Metal-Metal': { cycle: 'same', desc: 'Metal meets Metal — amplified' },
  'Wood-Fire': { cycle: 'generating', desc: 'Wood feeds Fire' },
  'Fire-Wood': { cycle: 'generating', desc: 'Wood feeds Fire' },
  'Wood-Earth': { cycle: 'overcoming', desc: 'Wood parts Earth' },
  'Earth-Wood': { cycle: 'overcoming', desc: 'Wood parts Earth' },
  'Wood-Metal': { cycle: 'overcoming', desc: 'Metal chops Wood' },
  'Metal-Wood': { cycle: 'overcoming', desc: 'Metal chops Wood' },
  'Fire-Earth': { cycle: 'generating', desc: 'Fire creates Earth' },
  'Earth-Fire': { cycle: 'generating', desc: 'Fire creates Earth' },
  'Fire-Metal': { cycle: 'overcoming', desc: 'Fire melts Metal' },
  'Metal-Fire': { cycle: 'overcoming', desc: 'Fire melts Metal' },
  'Earth-Metal': { cycle: 'generating', desc: 'Earth yields Metal' },
  'Metal-Earth': { cycle: 'generating', desc: 'Earth yields Metal' },
};

export const adviceContent = {
  liuHe: 'This is one of the strongest natural bonds in Chinese astrology. Trust the quiet harmony of this connection and build on your shared strengths. The combined elemental energy suggests an area of life where you naturally collaborate well.',
  sanHe: 'Your triad connection gives you a natural foundation of understanding. This is an especially strong bond for collaborative work, shared projects, and long-term partnerships. Look for opportunities to work together toward common goals.',
  clash: 'Acknowledge your differences as strengths rather than threats. Where one partner is cautious, the other is bold — together you cover more ground than either alone. Set clear communication patterns and give each other space when tension rises. Many long-lasting relationships thrive on the dynamism of a clash.',
  harm: 'The key to navigating a Harm relationship is transparency. Address small resentments before they compound. Schedule regular honest conversations about how you feel in the relationship. The Harm dynamic loses most of its power when both partners practise proactive communication rather than allowing friction to fester silently.',
  neutral: 'A neutral pairing means you have a blank canvas — your relationship is shaped more by your individual characters, shared values, and life choices than by zodiac mechanics. Focus on understanding each other\'s elemental needs and communication styles.',
  self: 'Same-sign pairings require conscious differentiation. Celebrate your shared understanding but cultivate individual interests and perspectives. Avoid competing over the same strengths — instead, recognise that you can alternate leadership roles depending on the situation.',
};

/**
 * Generate full section content for a compatibility report.
 *
 * Fills in any gaps from the frontend's pairData using the worker-side
 * animal traits and content. Returns an array of { key, title, content }
 * sections ready for the PDF renderer.
 *
 * @param {Object} pairData — partial or full pair data from frontend
 * @param {string} locale — 'en', 'tc', or 'sc'
 * @returns {Object[]} — array of { key, title, content } sections
 */
export function generateSectionContent(pairData, locale) {
  const { animalA, animalB, relType, relLabel } = pairData;
  const tA = animalTraits[animalA] || {};
  const tB = animalTraits[animalB] || {};
  const isSelf = animalA === animalB;

  const elA = pairData.fixedElementA || '';
  const elB = pairData.fixedElementB || '';
  const elKey = `${elA}-${elB}`;
  const elInt = pairData.elInteraction || elementInteractions[elKey] || {};

  const sections = [];

  // 1. Relationship Overview
  const descKey = locale === 'tc' ? 'descTc' : locale === 'sc' ? 'descSc' : 'descEn';
  const overview = pairData[descKey] || pairData.descEn || generateRelationshipOverview(animalA, animalB, relType, pairData);
  sections.push({
    key: 'relationship-overview',
    title: 'Relationship Overview',
    content: overview,
  });

  // 2. Element Interaction Analysis
  const elContent = generateElementSection(animalA, animalB, elA, elB, elInt, pairData);
  sections.push({
    key: 'element-interaction',
    title: 'Element Interaction Analysis',
    content: elContent,
  });

  // 3. Personality Dynamics
  const analysisKey = locale === 'tc' ? 'pairAnalysisTc' : locale === 'sc' ? 'pairAnalysisSc' : 'pairAnalysisEn';
  const personality = pairData[analysisKey] || pairData.pairAnalysisEn || generatePersonalitySection(animalA, animalB, tA, tB, isSelf);
  sections.push({
    key: 'personality-dynamics',
    title: 'Personality Dynamics',
    content: personality,
  });

  // 4. Love & Romance
  sections.push({
    key: 'love-romance',
    title: 'Love & Romance',
    content: generateLoveSection(animalA, animalB, tA, tB, relType, isSelf),
  });

  // 5. Career & Business Partnership
  sections.push({
    key: 'career-business',
    title: 'Career & Business Partnership',
    content: generateCareerSection(animalA, animalB, tA, tB, isSelf),
  });

  // 6. Communication Guide
  sections.push({
    key: 'communication-guide',
    title: 'Communication Guide',
    content: generateCommunicationSection(animalA, animalB, tA, tB, isSelf),
  });

  // 7. Challenges & Growth Areas
  const adviceKey = locale === 'tc' ? 'adviceTc' : locale === 'sc' ? 'adviceSc' : 'adviceEn';
  const adviceText = pairData[adviceKey] || pairData.adviceEn || adviceContent[relType] || '';
  sections.push({
    key: 'challenges-growth',
    title: 'Challenges & Growth Areas',
    content: generateChallengesSection(animalA, animalB, tA, tB, adviceText, isSelf),
  });

  // 8. Key Dates & Timing
  sections.push({
    key: 'key-dates',
    title: 'Key Dates & Timing',
    content: generateTimingSection(animalA, animalB, relType, elA, elB, pairData),
  });

  return sections;
}

/* ── Section content generators ── */

function generateRelationshipOverview(animalA, animalB, relType, pairData) {
  const label = pairData.relLabel || relType;
  if (relType === 'liuHe') {
    const combined = pairData.combinedElement || '';
    return `The ${animalA} and ${animalB} form one of the Six Harmonies (liu he), the most naturally compatible pairings in Chinese astrology. Their Earthly Branches combine to produce ${combined} energy — a quiet, stabilising bond sometimes called a "secret friendship". This harmony operates at a deep, almost effortless level. Partners in a Liu He bond often share intuitive understanding and complementary strengths.`;
  }
  if (relType === 'sanHe') {
    const triad = pairData.triadElement || '';
    return `The ${animalA} and ${animalB} belong to the same Three Harmonies (san he) triad, sharing ${triad} elemental affinity. Animals within the same triad cooperate naturally and understand each other's motivations intuitively. Their bond is broad and collaborative — it operates well in friendships, business partnerships, and team dynamics.`;
  }
  if (relType === 'clash') {
    return `The ${animalA} and ${animalB} form one of the Six Clashes (liu chong), sitting directly opposite each other on the zodiac wheel. Their energies are fundamentally opposed. However, awareness of these dynamics can transform conflict into complementary growth. A clash does not doom a relationship — it signals where conscious effort and mutual understanding are essential.`;
  }
  if (relType === 'harm') {
    return `The ${animalA} and ${animalB} form one of the Six Harms (liu hai), a relationship where hidden resentments and misunderstandings tend to develop over time. Unlike clashes, which are overt, harms are insidious — they erode relationships gradually through subtle friction. Open communication and awareness of these patterns are essential.`;
  }
  if (relType === 'self') {
    return `Two ${animalA} people share identical zodiac energy, which brings deep mutual understanding and shared rhythms. The doubled energy can create intensity — two individuals with the same strengths may compete rather than complement, and shared weaknesses may go unchecked. Awareness of these dynamics is the key to a thriving same-sign partnership.`;
  }
  return `The ${animalA} and ${animalB} share a neutral relationship — they are neither direct allies nor antagonists in the classical Earthly Branch system. This means their compatibility depends more heavily on individual character, shared values, and the broader BaZi chart. Neutral pairings have the advantage of flexibility.`;
}

function generateElementSection(animalA, animalB, elA, elB, elInt, pairData) {
  const cycle = elInt.cycle || 'same';
  const desc = elInt.desc || `${elA} meets ${elB}`;
  let content = `The ${animalA}'s fixed element is ${elA}, while the ${animalB}'s is ${elB}. `;

  if (cycle === 'generating') {
    content += `These elements share a generating (sheng) relationship: ${desc}. In the Five Elements cycle, one element naturally nourishes and supports the other. This creates a supportive dynamic where one partner energises the other. The generating cycle suggests a relationship where giving and receiving flow naturally — though partners should ensure the support is reciprocal rather than one-directional.`;
  } else if (cycle === 'overcoming') {
    content += `These elements share an overcoming (ke) relationship: ${desc}. In the Five Elements cycle, one element naturally controls or restrains the other. This creates a dynamic tension that can manifest as one partner feeling dominated or the other feeling restrained. However, the overcoming cycle also represents necessary boundaries and structure — when balanced, it prevents excess and maintains equilibrium.`;
  } else {
    content += `Both share the same element, creating an amplified ${elA} dynamic: ${desc}. When two people carry the same elemental energy, their shared qualities are magnified — both the strengths and the vulnerabilities. This amplification can create powerful resonance or overwhelming intensity, depending on awareness and balance.`;
  }

  if (pairData.combinedElement) {
    content += `\n\nAs a Six Harmony pair, your Earthly Branches combine to transform into ${pairData.combinedElement} energy. This combined element represents the alchemical product of your union — the qualities and opportunities that emerge specifically when you work together.`;
  }
  if (pairData.triadElement) {
    content += `\n\nAs members of the ${pairData.triadElement} Triad, you share a deep elemental resonance. This triad affinity means you instinctively understand each other's motivations and can coordinate efforts with minimal friction.`;
  }

  return content;
}

function generatePersonalitySection(animalA, animalB, tA, tB, isSelf) {
  if (isSelf) {
    return `Both partners share the ${animalA}'s core qualities: ${(tA.strengths || []).join(', ')}. This creates instant recognition and understanding. In love, two ${animalA} people are both ${tA.loveStyle || 'expressive'}. The shared approach means neither partner needs to explain themselves — but it also means shared blind spots (${(tA.challenges || []).join(', ')}) may go unchallenged. At work, both gravitate toward being ${tA.workStyle || 'collaborative'}. The risk is competition for the same role rather than complementary division of labour.`;
  }
  return `The ${animalA} brings ${(tA.strengths || []).slice(0, 2).join(' and ')} energy, while the ${animalB} contributes ${(tB.strengths || []).slice(0, 2).join(' and ')} qualities. In romantic relationships, the ${animalA} is ${tA.loveStyle || 'expressive'}, whereas the ${animalB} is ${tB.loveStyle || 'expressive'}. In professional settings, the ${animalA} is ${tA.workStyle || 'collaborative'}, while the ${animalB} is ${tB.workStyle || 'collaborative'}. The ${animalA} needs ${tA.socialNeed || 'connection'}, whereas the ${animalB} craves ${tB.socialNeed || 'connection'}. Understanding these different needs is the foundation of a lasting connection.`;
}

function generateLoveSection(animalA, animalB, tA, tB, relType, isSelf) {
  if (isSelf) {
    return `In romance, two ${animalA} people share an identical love language: both are ${tA.loveStyle || 'expressive'}. This means instant emotional recognition — you intuitively know what your partner needs because you need the same thing. The challenge lies in who gives and who receives. Both partners may wait for the other to initiate, or both may express love in the same way simultaneously, creating either beautiful synchrony or frustrating stalemate.\n\nTo thrive romantically, same-sign couples benefit from establishing turn-taking rituals — one partner leads date planning this week, the other next week. This prevents the relationship from falling into comfortable but uninspiring routine.`;
  }
  let content = `The ${animalA} approaches romance by being ${tA.loveStyle || 'expressive'}. The ${animalB}, by contrast, is ${tB.loveStyle || 'expressive'}.\n\n`;

  if (relType === 'liuHe' || relType === 'sanHe') {
    content += `Your harmonious connection means these different love languages tend to complement each other naturally. The ${animalA}'s style fills gaps the ${animalB} may not even realise they have, and vice versa. This creates a rich, multi-dimensional romantic bond where both partners feel seen and valued.`;
  } else if (relType === 'clash') {
    content += `These contrasting romantic styles can spark intense initial attraction — the ${animalA}'s approach feels exciting precisely because it differs from the ${animalB}'s. However, once the novelty fades, these differences require conscious negotiation. The key is appreciating what each partner brings rather than trying to change them into a mirror image of yourself.`;
  } else if (relType === 'harm') {
    content += `The subtle nature of a Harm dynamic means romantic misunderstandings may not surface immediately. The ${animalA} may not realise their approach is quietly frustrating the ${animalB}, and vice versa. Regular emotional check-ins are essential — ask not just "How was your day?" but "How do you feel about us right now?"`;
  } else {
    content += `Without a strong predetermined dynamic, your romantic compatibility depends heavily on how you actively choose to show up for each other. This is both a freedom and a responsibility — you have the space to create exactly the relationship you want, but it requires more intentional effort than a naturally harmonious pairing.`;
  }

  return content;
}

function generateCareerSection(animalA, animalB, tA, tB, isSelf) {
  if (isSelf) {
    return `In professional settings, two ${animalA} people share the same work approach: both are ${tA.workStyle || 'capable'}. This can be highly productive when tasks align with your shared strengths, but problematic when both partners compete for the same role. The most successful same-sign professional partnerships involve clear role differentiation — one handles strategy while the other executes, or one manages clients while the other manages operations.\n\nBoth need ${tA.socialNeed || 'fulfilment'}, so ensuring each person has their own domain of expertise prevents territorial friction.`;
  }
  return `The ${animalA} is ${tA.workStyle || 'capable'}, while the ${animalB} is ${tB.workStyle || 'capable'}. These different professional strengths can create a powerful partnership when roles are clearly defined.\n\nThe ${animalA} needs ${tA.socialNeed || 'fulfilment'} in the workplace, whereas the ${animalB} thrives with ${tB.socialNeed || 'fulfilment'}. Recognising these different professional drivers allows both partners to support each other's career growth rather than competing for the same opportunities.\n\nIn a business partnership, the ${animalA}'s strengths (${(tA.strengths || []).slice(0, 2).join(', ')}) complement the ${animalB}'s qualities (${(tB.strengths || []).slice(0, 2).join(', ')}), creating a well-rounded team.`;
}

function generateCommunicationSection(animalA, animalB, tA, tB, isSelf) {
  if (isSelf) {
    return `Communication between two ${animalA} people is typically effortless on the surface — you speak the same emotional language. Both need ${tA.socialNeed || 'connection'}, and both become stressed by ${tA.stressTrigger || 'certain situations'}. The risk is assumption: because you understand each other so well, you may skip the explicit communication that keeps relationships healthy.\n\nMake a habit of verbalising feelings and intentions even when you think your partner already knows. Same-sign partners often discover that their assumptions, while usually accurate, occasionally miss the mark — and those misses can create outsized resentment precisely because "you should have known."`;
  }
  return `The ${animalA} needs ${tA.socialNeed || 'connection'} and becomes stressed by ${tA.stressTrigger || 'certain situations'}. The ${animalB} needs ${tB.socialNeed || 'connection'} and struggles with ${tB.stressTrigger || 'certain situations'}.\n\nUnderstanding these different emotional needs is crucial for effective communication. When the ${animalA} is stressed, they need their partner to provide ${tA.socialNeed || 'support'}. When the ${animalB} is under pressure, they need ${tB.socialNeed || 'support'}. Recognising each other's stress triggers allows you to provide support precisely when it matters most, rather than inadvertently making things worse.\n\nPractical tip: when conflict arises, the ${animalA} should resist the urge to ${(tA.challenges || ['react'])[0]}, while the ${animalB} should be mindful of their tendency toward ${(tB.challenges || ['reaction'])[0]}.`;
}

function generateChallengesSection(animalA, animalB, tA, tB, adviceText, isSelf) {
  let content = '';
  if (isSelf) {
    content = `The primary challenge for two ${animalA} people is managing doubled weaknesses: ${(tA.challenges || []).join(', ')}. When both partners share the same blind spots, there is no natural corrective force in the relationship. External friendships, mentorship, or professional guidance can provide the perspective that same-sign couples lack internally.\n\n`;
  } else {
    content = `The ${animalA}'s challenges include ${(tA.challenges || []).join(', ')}. The ${animalB} faces ${(tB.challenges || []).join(', ')}. Where one partner's weakness triggers the other's stress response, a negative feedback loop can develop. Awareness of these patterns is the first step toward breaking them.\n\n`;
  }
  if (adviceText) {
    content += adviceText;
  }
  return content;
}

function generateTimingSection(animalA, animalB, relType, elA, elB, pairData) {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const cycleYears = {
    Wood: [2024, 2025, 2034, 2035],
    Fire: [2026, 2027, 2036, 2037],
    Earth: [2028, 2029, 2038, 2039],
    Metal: [2030, 2031, 2040, 2041],
    Water: [2032, 2033, 2042, 2043],
  };

  let content = `Timing plays a significant role in how zodiac dynamics manifest. The energy of each year is shaped by its Heavenly Stem element, which can either support or challenge your pairing.\n\n`;

  // Combined element years (for Liu He pairs)
  if (pairData.combinedElement && cycleYears[pairData.combinedElement]) {
    const years = cycleYears[pairData.combinedElement];
    content += `As a Six Harmony pair producing ${pairData.combinedElement} energy, you may find that ${pairData.combinedElement} years (${years.join(', ')}) bring particular opportunities for your partnership. The prevailing elemental energy aligns with your combined force, amplifying your natural harmony.\n\n`;
  }

  // Supportive element years
  if (elA && cycleYears[elA]) {
    content += `Years carrying ${elA} energy (${cycleYears[elA].join(', ')}) particularly support the ${animalA}'s native element. `;
  }
  if (elB && elB !== elA && cycleYears[elB]) {
    content += `${elB} years (${cycleYears[elB].join(', ')}) strengthen the ${animalB}'s foundation. `;
  }

  content += `\n\nThe current year, 2026, is a Fire Horse year. Fire energy favours passionate action, visibility, and transformation. `;
  if (relType === 'liuHe' || relType === 'sanHe') {
    content += `For harmonious pairings like yours, 2026 is a strong year to pursue shared goals and public commitments.`;
  } else if (relType === 'clash') {
    content += `For clashing pairings, the Fire Horse's intensity may amplify your dynamic — channel the energy into bold joint projects rather than letting it fuel friction.`;
  } else {
    content += `Focus on open communication and making deliberate choices together to harness the year's transformative potential.`;
  }

  return content;
}
