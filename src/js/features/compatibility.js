/**
 * Compatibility — Zodiac compatibility checker form + result rendering.
 */

import { track } from '../analytics.js';
import { basePath } from '../utils/base-path.js';
import { zodiacData, getZodiac, getElement } from '../data/zodiac-data.js';
import { sixHarmonies, threeHarmonies, sixClashes, sixHarms, selfPenalty } from '../data/compatibility-data.js';

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

export function initCompatibility() {
  const compatForm = document.getElementById('compat-form');
  const compatResult = document.getElementById('compat-result');
  if (!compatForm || !compatResult) return;

  compatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ya = parseInt(document.getElementById('year-a').value);
    const yb = parseInt(document.getElementById('year-b').value);
    if (isNaN(ya)||isNaN(yb)||ya<1900||ya>2100||yb<1900||yb>2100) {
      alert('Please enter valid years between 1900 and 2100.'); return;
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
      html += '<div style="background:var(--parchment);border-radius:8px;padding:1.2rem 1.5rem;margin-bottom:1rem;border-left:4px solid var(--imperial-gold);">';
      html += '<div style="margin-bottom:0.5rem;"><span class="article-tag '+r.cls+'" style="font-size:0.8rem;">'+r.icon+' '+r.label+'</span></div>';
      html += '<p style="margin:0;color:var(--graphite);line-height:1.6;">'+r.desc+'</p>';
      html += '</div>';
    });

    html += '<p style="margin-top:1.5rem;font-size:0.9rem;color:var(--graphite);text-align:center;">For a comprehensive analysis, a full <a href="' + basePath + '/bazi/">BaZi chart</a> comparison is recommended.</p>';

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
  });
}
