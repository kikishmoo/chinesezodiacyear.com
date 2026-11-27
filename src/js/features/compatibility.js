/**
 * Compatibility — Zodiac compatibility checker form + result rendering.
 */

import { track } from '../analytics.js';
import { basePath } from '../utils/base-path.js';
import { zodiacData, getZodiac, getElement } from '../data/zodiac-data.js';
import { sixHarmonies, threeHarmonies, sixClashes, sixHarms, selfPenalty } from '../data/compatibility-data.js';
import { showCompatibilityOffer } from './report-checkout.js';

function findRelation(a, b) {
  const relations = [];
  if (a === b) {
    relations.push({type:'same', label:'Same Animal', icon:'&#9775;', cls:'tag-culture',
      desc:'You share the same zodiac animal. This can mean deep understanding and natural rapport, but also shared blind spots. During a Ben Ming Nian (本命年), both may face similar challenges simultaneously.'});
    if (selfPenalty.includes(a)) {
      relations.push({type:'self-penalty', label:'Self-Punishment', icon:'&#9888;', cls:'tag-bazi',
        desc:'This animal carries a self-punishment (自刑) relationship. When doubled, the tendency toward self-sabotage or internal conflict may be amplified. Awareness is the key to managing this energy.'});
    }
  }
  for (const [x,y] of sixHarmonies) {
    if ((a===x&&b===y)||(a===y&&b===x)) {
      relations.push({type:'harmony6', label:'Six Harmony (六合)', icon:'&#9829;', cls:'tag-zodiac',
        desc:'This is one of the six most compatible pairings in Chinese astrology. Your Earthly Branches combine to create harmonious elemental energy. This relationship is characterised by natural ease, mutual support, and complementary strengths.'});
    }
  }
  for (const triad of threeHarmonies) {
    if (triad.includes(a) && triad.includes(b)) {
      const triNames = triad.map(i => zodiacData[i].animal);
      const elMap = {0:'Water',1:'Wood',2:'Fire',3:'Metal'};
      const triEl = elMap[threeHarmonies.indexOf(triad)];
      relations.push({type:'harmony3', label:'Three Harmony (三合)', icon:'&#9733;', cls:'tag-fengshui',
        desc:'You belong to the same Three Harmony triad ('+triNames.join(', ')+'), sharing '+triEl+' elemental affinity. This creates natural cooperation, shared goals, and intuitive understanding between you.'});
    }
  }
  for (const [x,y] of sixClashes) {
    if ((a===x&&b===y)||(a===y&&b===x)) {
      relations.push({type:'clash', label:'Six Clash (六衝)', icon:'&#9876;', cls:'tag-bazi',
        desc:'Your animals sit directly opposite each other on the zodiac wheel. This clash can produce tension, disagreements, and opposing life philosophies. However, awareness of these dynamics allows you to transform conflict into complementary growth.'});
    }
  }
  for (const [x,y] of sixHarms) {
    if ((a===x&&b===y)||(a===y&&b===x)) {
      relations.push({type:'harm', label:'Six Harm (六害)', icon:'&#9888;', cls:'tag-business',
        desc:'This pairing falls under the Six Harms — subtle friction that develops gradually rather than overt conflict. Hidden resentments or misunderstandings may build over time. Open communication is essential to prevent erosion of trust.'});
    }
  }
  if (relations.length === 0) {
    relations.push({type:'neutral', label:'Neutral Relationship', icon:'&#9676;', cls:'tag-culture',
      desc:'No specific classical relationship (harmony, clash, or harm) exists between these two animals. This means neither strong natural affinity nor inherent friction — the relationship depends more on individual character and effort than zodiac dynamics.'});
  }
  return relations;
}

// Every language form must render its result in the same visible language panel.
// Do not forward a Chinese submission to an English form hidden by language CSS.
const RELATION_TRANSLATIONS = {
  tc: {
    same: ['同生肖', '兩人屬於相同生肖。此分類僅提供傳統象徵的參考，不決定實際關係。'],
    'self-penalty': ['自刑', '傳統地支分類中的自刑提示自我省察，並非關係必然不順。'],
    harmony6: ['六合', '兩個地支在傳統分類中屬六合配對。是否相處融洽仍取決於雙方個人情況。'],
    harmony3: ['三合', '兩個生肖同屬三合局。此為傳統地支象徵關係，不能據此預測關係結果。'],
    clash: ['六衝', '兩個地支在傳統分類中彼此相衝。這不代表關係注定失敗。'],
    harm: ['六害', '兩個地支在傳統分類中屬六害。這並非對真實人際關係的科學診斷。'],
    neutral: ['一般關係', '兩個生肖不屬本工具所列的六合、三合、六衝或六害組合。']
  },
  sc: {
    same: ['同生肖', '两人属于相同生肖。此分类仅提供传统象征参考，不决定实际关系。'],
    'self-penalty': ['自刑', '传统地支分类中的自刑提示自我省察，并非关系必然不顺。'],
    harmony6: ['六合', '两个地支在传统分类中属六合配对。是否相处融洽仍取决于双方个人情况。'],
    harmony3: ['三合', '两个生肖同属三合局。这是传统地支象征关系，不能据此预测关系结果。'],
    clash: ['六冲', '两个地支在传统分类中彼此相冲。这不代表关系注定失败。'],
    harm: ['六害', '两个地支在传统分类中属六害。这并非对真实人际关系的科学诊断。'],
    neutral: ['一般关系', '两个生肖不属于本工具所列的六合、三合、六冲或六害组合。']
  }
};

export function initCompatibility() {
  const formConfigs = [
    { formId: 'compat-form', resultId: 'compat-result', aId: 'year-a', bId: 'year-b', locale: 'en' },
    { formId: 'compat-form-tc', resultId: 'compat-result-tc', aId: 'year-a-tc', bId: 'year-b-tc', locale: 'tc' },
    { formId: 'compat-form-sc', resultId: 'compat-result-sc', aId: 'year-a-sc', bId: 'year-b-sc', locale: 'sc' }
  ];

  for (const { formId, resultId, aId, bId, locale } of formConfigs) {
    const compatForm = document.getElementById(formId);
    const compatResult = document.getElementById(resultId);
    if (!compatForm || !compatResult) continue;

    compatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ya = Number(document.getElementById(aId).value);
    const yb = Number(document.getElementById(bId).value);
    if (!Number.isInteger(ya)||!Number.isInteger(yb)||ya<1900||ya>2100||yb<1900||yb>2100) {
      alert(locale === 'tc' ? '請輸入1900至2100年間的有效年份。' : locale === 'sc' ? '请输入1900至2100年间的有效年份。' : 'Please enter valid years between 1900 and 2100.');
      return;
    }
    const zA = getZodiac(ya), zB = getZodiac(yb);
    const eA = getElement(ya), eB = getElement(yb);
    const iA = ((ya-4)%12+12)%12, iB = ((yb-4)%12+12)%12;
    const relations = findRelation(iA, iB);

    let html = '<div style="text-align:center;margin-bottom:1.5rem;">';
    html += '<div style="display:flex;justify-content:center;align-items:center;gap:1.5rem;flex-wrap:wrap;">';
    html += '<div><span style="font-size:3rem;">'+zA.emoji+'</span><div style="font-weight:700;margin-top:0.3rem;">'+eA+' '+zA.animal+'</div><div style="color:var(--graphite);font-size:0.9rem;">'+ya+' <span class="chinese-char">'+zA.cn+'</span></div></div>';
    html += '<div style="font-size:2rem;color:var(--imperial-gold);">&amp;</div>';
    html += '<div><span style="font-size:3rem;">'+zB.emoji+'</span><div style="font-weight:700;margin-top:0.3rem;">'+eB+' '+zB.animal+'</div><div style="color:var(--graphite);font-size:0.9rem;">'+yb+' <span class="chinese-char">'+zB.cn+'</span></div></div>';
    html += '</div></div>';

    relations.forEach(r => {
      const translated = RELATION_TRANSLATIONS[locale]?.[r.type];
      const label = translated ? translated[0] : r.label;
      const description = translated ? translated[1] : r.desc;
      html += '<div style="background:var(--parchment);border-radius:8px;padding:1.2rem 1.5rem;margin-bottom:1rem;border-left:4px solid var(--imperial-gold);">';
      html += '<div style="margin-bottom:0.5rem;"><span class="article-tag '+r.cls+'" style="font-size:0.8rem;">'+r.icon+' '+label+'</span></div>';
      html += '<p style="margin:0;color:var(--graphite);line-height:1.6;">'+description+'</p>';
      html += '</div>';
    });

    const nextStep = locale === 'tc'
      ? '生肖配對只是一種傳統文化參考。若要深入了解四柱，請參閱'
      : locale === 'sc'
        ? '生肖配对只是一种传统文化参考。如需深入了解四柱，请参阅'
        : 'For a comprehensive analysis, a full';
    const linkLabel = locale === 'tc' ? '八字入門' : locale === 'sc' ? '八字入门' : 'BaZi chart';
    html += '<p style="margin-top:1.5rem;font-size:0.9rem;color:var(--graphite);text-align:center;">' + nextStep + ' <a href="' + basePath + '/bazi/">' + linkLabel + '</a>' + (locale === 'en' ? ' comparison is recommended.' : '。') + '</p>';


    compatResult.innerHTML = html;
    compatResult.classList.add('show');
    compatResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    track('compatibility_check', {
      event_category: 'Calculator',
      event_label: zA.animal + ' + ' + zB.animal,
      animal_a: zA.animal,
      animal_b: zB.animal,
      result_type: relations[0].type
    });

    // Show compatibility report CTA after result
    var checkerCta = document.getElementById('compat-report-cta-' + locale);
    if (!checkerCta) {
      checkerCta = document.createElement('div');
      checkerCta.id = 'compat-report-cta-' + locale;
      compatResult.parentNode.insertBefore(checkerCta, compatResult.nextSibling);
    }
    var workerUrl = 'https://bazi-calculator.kiki-peiqi-li.workers.dev';
    var relTypeMap = { harmony6: 'liuHe', harmony3: 'sanHe', clash: 'clash', harm: 'harm', same: 'self', neutral: 'neutral', 'self-penalty': 'self' };
    showCompatibilityOffer(workerUrl, {
      animalA: zA.animal,
      animalB: zB.animal,
      emojiA: zA.emoji,
      emojiB: zB.emoji,
      relType: relTypeMap[relations[0].type] || 'neutral',
      relLabel: relations[0].label
    }, checkerCta);
    });
  }

  // Pair page CTA: read embedded pair data
  initPairPageCta();
}

function initPairPageCta() {
  var pairDataEl = document.getElementById('pair-data');
  var ctaContainer = document.getElementById('compatibility-report-cta');
  if (!pairDataEl || !ctaContainer) return;

  try {
    var pair = JSON.parse(pairDataEl.textContent);
    var workerUrl = ctaContainer.dataset.workerUrl || 'https://bazi-calculator.kiki-peiqi-li.workers.dev';
    showCompatibilityOffer(workerUrl, pair, ctaContainer);
  } catch (_) {
    // Silently fail if pair data is malformed
  }
}
