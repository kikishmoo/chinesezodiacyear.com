/**
 * Calculator — Zodiac calculator form + result rendering.
 */

import { track } from '../analytics.js';
import { basePath } from '../utils/base-path.js';
import { zodiacData, getZodiac, getElement, getHeavenlyStem } from '../data/zodiac-data.js';
import { lichunDates, getZodiacYear } from '../data/lichun-dates.js';
import { famousFigures } from '../data/famous-figures.js';

export function initCalculator() {
  const calcForm = document.getElementById('zodiac-calc-form');
  const calcResult = document.getElementById('calc-result');
  if (!calcForm) return;

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const yearInput = document.getElementById('birth-year');
    const monthSelect = document.getElementById('birth-month');
    const dayInput = document.getElementById('birth-day');
    const year = parseInt(yearInput.value);
    const month = monthSelect ? parseInt(monthSelect.value) || 0 : 0;
    const day = dayInput ? parseInt(dayInput.value) || 0 : 0;

    if (isNaN(year) || year < 1900 || year > 2100) {
      alert('Please enter a valid year between 1900 and 2100.');
      return;
    }

    const zodiacYear = getZodiacYear(year, month, day);
    const yearOnlyZodiac = getZodiac(year);
    const zodiac = getZodiac(zodiacYear);
    const element = getElement(zodiacYear);
    const stem = getHeavenlyStem(zodiacYear);
    const elementClass = 'element-' + element.toLowerCase();
    const lichunAdjusted = (month && day && zodiacYear !== year);

    let lichunNote = '';
    if (lichunAdjusted) {
      const lc = lichunDates[year];
      const lcDateStr = 'February ' + lc[1];
      lichunNote = `
        <div class="lichun-note">
          <strong>Lichun Adjustment (立春):</strong> Your birthday falls before Lichun (${lcDateStr}, ${year}), the traditional start of the Chinese zodiac year in BaZi astrology. Based on your birth year alone, you would be a ${yearOnlyZodiac.animal} (${yearOnlyZodiac.cn}). However, since you were born before the solar new year transition, your zodiac animal is the ${zodiac.animal} (${zodiac.cn}) of ${zodiacYear}. This follows the classical BaZi convention used in Four Pillars of Destiny calculations, where the year pillar changes at Lichun rather than at Chinese New Year.
        </div>`;
    } else if (month && day && month <= 2) {
      lichunNote = `
        <div class="lichun-note lichun-note-ok">
          <strong>Lichun Check (立春):</strong> Your birthday falls on or after Lichun for ${year}, so your zodiac animal matches the year. No adjustment needed.
        </div>`;
    }

    const zodiacIdx = ((zodiacYear - 4) % 12 + 12) % 12;
    const figure = famousFigures[zodiacIdx];
    const figureCard = figure ? `
      <div class="famous-person-card">
        <div class="famous-person-label">Famous ${zodiac.animal} in History</div>
        <div class="famous-person-info">
          <h4>${figure.name} <span class="chinese-char">${figure.cn}</span></h4>
          <div class="famous-person-dates">${figure.title} &middot; ${figure.born}</div>
          <p class="famous-person-story">${figure.story}</p>
        </div>
      </div>` : '';

    calcResult.innerHTML = `
      <div class="calc-result-animal">${zodiac.emoji}</div>
      <h3>${zodiac.animal} <span class="chinese-char">${zodiac.cn}</span></h3>
      <p class="calc-result-element ${elementClass}">${element} ${zodiac.animal}</p>
      <p class="mt-md" style="color:var(--graphite);font-size:0.95rem;margin:1rem auto 0;max-width:400px;">
        <strong>Heavenly Stem:</strong> ${stem}<br>
        <strong>Traits:</strong> ${zodiac.traits}
      </p>
      ${lichunNote}
      ${figureCard}
      <p style="margin-top:1rem;"><a href="${basePath}/zodiac/" style="font-weight:600;">Read more about the ${zodiac.animal} &rarr;</a></p>
    `;
    calcResult.classList.add('show');
    calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    track('zodiac_calculate', {
      event_category: 'Calculator',
      event_label: element + ' ' + zodiac.animal,
      zodiac_animal: zodiac.animal,
      zodiac_element: element,
      birth_year: year,
      lichun_adjusted: lichunAdjusted
    });
  });
}
