/**
 * BaZi Client — BaZi API client + chart result renderer.
 */

import { track } from '../analytics.js';
import { basePath } from '../utils/base-path.js';
import { escapeHtml, cleanText } from '../utils/sanitise.js';

let citiesData = null;
let selectedCity = null;

function resolveTimezone(lat, lng) {
  if (citiesData) {
    var best = null, bestDist = Infinity;
    for (var i = 0; i < citiesData.length; i++) {
      var c = citiesData[i];
      var d = Math.abs(c.lat - lat) + Math.abs(c.lng - lng);
      if (d < bestDist) { bestDist = d; best = c; }
    }
    if (best && bestDist < 5) return best.tz;
  }
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch(_) {}
  return null;
}

function renderBaziChart(data, baziResult) {
  var pillars = data.pillars || {};
  var names = ['hour', 'day', 'month', 'year'];
  var labels = ['Hour Pillar', 'Day Pillar', 'Month Pillar', 'Year Pillar'];
  var cnLabels = ['\u65F6\u67F1', '\u65E5\u67F1', '\u6708\u67F1', '\u5E74\u67F1'];
  var hiddenStems = data.hiddenStems || {};
  var naYin = data.naYin || {};

  var html = '';

  // Day Master
  if (data.dayMaster) {
    var dm = data.dayMaster;
    html += '<div class="bazi-day-master">';
    html += '<h4>Your Day Master (\u65E5\u4E3B)</h4>';
    html += '<span style="font-family:var(--font-chinese);font-size:2.4rem;color:var(--deep-red);">' + escapeHtml(dm.stem) + '</span>';
    html += '<p style="margin:0.5rem 0 0;">' + escapeHtml(dm.pinyin) + ' \u2014 ' + escapeHtml(dm.yinYang) + ' ' + escapeHtml(dm.element) + '</p>';
    html += '</div>';
  }

  // Four Pillars grid
  html += '<div class="bazi-pillars">';
  names.forEach(function(name, i) {
    var p = pillars[name] || {};
    html += '<div class="bazi-pillar">';
    html += '<div class="pillar-label">' + labels[i] + '<br><span style="font-family:var(--font-chinese);">' + cnLabels[i] + '</span></div>';
    if (p.stem) {
      var elClass = p.stemElement ? 'element-' + escapeHtml(p.stemElement.toLowerCase()) : '';
      html += '<div class="pillar-stem">' + escapeHtml(p.stem) + '</div>';
      html += '<div class="pillar-branch">' + escapeHtml(p.branch) + '</div>';
      html += '<div class="pillar-pinyin">' + escapeHtml(p.stemPinyin || '') + ' ' + escapeHtml(p.branchPinyin || '') + '</div>';
      if (p.stemElement) html += '<span class="pillar-element ' + elClass + '">' + escapeHtml(p.stemElement) + '</span>';
      if (p.branchAnimal) html += '<div class="pillar-animal">' + escapeHtml(p.branchAnimal) + '</div>';
      if (hiddenStems[name]) html += '<div class="pillar-hidden">\u85CF\u5E72: ' + escapeHtml(hiddenStems[name]) + '</div>';
      if (naYin[name]) html += '<div class="pillar-nayin">' + escapeHtml(naYin[name]) + '</div>';
    } else {
      html += '<div style="color:var(--stone);font-size:0.9rem;padding:1rem 0;">Not available</div>';
    }
    html += '</div>';
  });
  html += '</div>';

  // True Solar Time
  if (data.trueSolarTime) {
    var tst = data.trueSolarTime;
    html += '<div class="lichun-note lichun-note-ok" style="max-width:100%;">';
    html += '<strong>True Solar Time:</strong> Your birth time was adjusted to ' +
      String(tst.hour).padStart(2, '0') + ':' + String(tst.minute).padStart(2, '0') +
      ' (true solar time) for accurate Hour Pillar calculation.';
    html += '</div>';
  }

  // Basic info
  if (data.basicInfo && Object.keys(data.basicInfo).length > 0) {
    var info = data.basicInfo;
    html += '<div class="bazi-info-grid">';
    if (info.lunarDate) html += '<div><strong>\u8FB2\u66C6:</strong> ' + escapeHtml(info.lunarDate) + '</div>';
    if (info.zodiac) html += '<div><strong>\u751F\u8096:</strong> ' + escapeHtml(info.zodiac) + '</div>';
    if (info.constellation) html += '<div><strong>\u661F\u5EA7:</strong> ' + escapeHtml(info.constellation) + '</div>';
    if (info.trueSolarTimeStr) html += '<div><strong>\u771F\u592A\u9633\u65F6:</strong> ' + escapeHtml(info.trueSolarTimeStr) + '</div>';
    html += '</div>';
  }

  // Five Elements
  if (data.fiveElements) {
    var feText = cleanText(data.fiveElements);
    html += '<div class="bazi-five-elements">';
    html += '<h4>Five Elements Balance (\u4E94\u884C\u529B\u91CF)</h4>';
    feText.split('\n').forEach(function(line) {
      if (line.trim()) html += '<div>' + escapeHtml(line.trim()) + '</div>';
    });
    html += '</div>';
  }

  // Da Yun
  if (data.daYun && data.daYun.length > 0) {
    html += '<div class="bazi-dayun">';
    html += '<h4>Major Luck Cycles (\u5927\u8FD0)</h4>';
    html += '<div class="bazi-dayun-row">';
    data.daYun.forEach(function(dy) {
      html += '<div class="bazi-dayun-card">';
      html += '<div class="dayun-combo">' + escapeHtml(dy.combined) + '</div>';
      if (dy.startAge) html += '<div class="dayun-age">Age ' + escapeHtml(dy.startAge) + '</div>';
      if (dy.startYear) html += '<div class="dayun-year">' + escapeHtml(dy.startYear) + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  // Reading sections
  if (data.readingSections && data.readingSections.length > 0) {
    html += '<div class="bazi-sections">';
    html += '<h4 style="font-family:var(--font-display);color:var(--deep-red);margin-bottom:var(--sp-md);">Chart Analysis</h4>';
    data.readingSections.forEach(function(section) {
      var cleaned = cleanText(section.content);
      html += '<details>';
      html += '<summary>' + escapeHtml(section.title) + '</summary>';
      html += '<div class="section-content">' + escapeHtml(cleaned).replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>') + '</div>';
      html += '</details>';
    });
    html += '</div>';
  } else if (data.rawExcerpt) {
    var cleanExcerpt = cleanText(data.rawExcerpt).substring(0, 2000);
    html += '<div style="margin-top:var(--sp-xl);">';
    html += '<h4 style="font-family:var(--font-display);color:var(--deep-red);margin-bottom:var(--sp-md);">Chart Analysis</h4>';
    html += '<div class="bazi-reading-text">' + escapeHtml(cleanExcerpt).replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>') + '</div>';
    html += '</div>';
  }

  // Parse error
  if (data.parseError) {
    html += '<div class="bazi-error" style="margin-top:var(--sp-lg);">' + escapeHtml(data.parseError) + '</div>';
  }

  html += '<p style="margin-top:var(--sp-xl);font-size:0.85rem;color:var(--stone);text-align:center;">For a comprehensive reading, consult a qualified BaZi practitioner. <a href="' + basePath + '/directory/">Find one in our directory.</a></p>';

  baziResult.innerHTML = html;
}

export function initBaziClient() {
  const baziForm = document.getElementById('bazi-calc-form');
  const baziResult = document.getElementById('bazi-result');
  const baziCityInput = document.getElementById('bazi-city');
  const citySuggestions = document.getElementById('city-suggestions');
  const unknownTimeCheck = document.getElementById('bazi-no-time');

  if (!baziForm) return;

  // Load cities lazily
  fetch(basePath + '/cities.json')
    .then(r => r.json())
    .then(data => { citiesData = data; })
    .catch(() => {});

  // Unknown time toggle
  if (unknownTimeCheck) {
    unknownTimeCheck.addEventListener('change', () => {
      const hourField = document.getElementById('bazi-hour');
      const minField = document.getElementById('bazi-minute');
      if (unknownTimeCheck.checked) {
        hourField.disabled = true; hourField.value = '';
        minField.disabled = true; minField.value = '';
      } else {
        hourField.disabled = false;
        minField.disabled = false;
      }
    });
  }

  // City autocomplete
  if (baziCityInput && citySuggestions) {
    let acTimeout;
    let acController = null;

    function searchCitiesJson(q) {
      if (!citiesData) return [];
      return citiesData.filter(function(c) {
        return c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
      }).slice(0, 8).map(function(c) {
        return { city: c.city, country: c.country, lat: c.lat, lng: c.lng, tz: c.tz, displayName: c.city + ', ' + c.country };
      });
    }

    function renderSuggestions(matches) {
      if (!matches || matches.length === 0) { citySuggestions.hidden = true; return; }
      citySuggestions.innerHTML = matches.map(function(c, i) {
        return '<div class="city-option" data-idx="' + i + '">' + escapeHtml(c.displayName) + '</div>';
      }).join('');
      citySuggestions.hidden = false;
      citySuggestions._matches = matches;
    }

    baziCityInput.addEventListener('input', function() {
      clearTimeout(acTimeout);
      acTimeout = setTimeout(async function() {
        var q = baziCityInput.value.trim().toLowerCase();
        if (q.length < 2) { citySuggestions.hidden = true; return; }
        if (acController) { try { acController.abort(); } catch(_) {} }
        acController = new AbortController();
        try {
          var url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6'
            + '&accept-language=en&featuretype=city&q=' + encodeURIComponent(q);
          var resp = await fetch(url, {
            headers: { 'User-Agent': 'ChineseZodiacYear-BaZi/1.0 (chinesezodiacyear.com)' },
            signal: acController.signal
          });
          if (resp.ok) {
            var data = await resp.json();
            var results = data
              .filter(function(r) { return r.class === 'place' || r.class === 'boundary'; })
              .slice(0, 6)
              .map(function(r) {
                var parts = r.display_name.split(',');
                return {
                  city: parts[0].trim(),
                  country: parts[parts.length - 1].trim(),
                  lat: parseFloat(r.lat),
                  lng: parseFloat(r.lon),
                  tz: null,
                  displayName: r.display_name
                };
              });
            if (results.length > 0) { renderSuggestions(results); return; }
          }
        } catch (_) {}
        renderSuggestions(searchCitiesJson(q));
      }, 350);
    });

    citySuggestions.addEventListener('click', function(e) {
      var opt = e.target.closest('.city-option');
      if (!opt) return;
      var idx = parseInt(opt.dataset.idx);
      var city = citySuggestions._matches[idx];
      selectedCity = city;
      baziCityInput.value = city.displayName;
      citySuggestions.hidden = true;
      if (!city.tz && city.lat && city.lng) {
        selectedCity.tz = resolveTimezone(city.lat, city.lng);
      }
    });

    document.addEventListener('click', function(e) {
      if (!baziCityInput.contains(e.target) && !citySuggestions.contains(e.target)) {
        citySuggestions.hidden = true;
      }
    });
  }

  // Form submit
  baziForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const year = parseInt(document.getElementById('bazi-year').value);
    const month = parseInt(document.getElementById('bazi-month').value);
    const day = parseInt(document.getElementById('bazi-day').value);
    const hour = document.getElementById('bazi-hour').value;
    const minute = document.getElementById('bazi-minute').value;
    const sexRadio = document.querySelector('input[name="bazi-sex"]:checked');
    const sex = sexRadio ? sexRadio.value : 'male';

    if (!year || !month || !day) {
      alert('Please enter your birth year, month, and day.');
      return;
    }
    if (year < 1900 || year > 2100) {
      alert('Birth year must be between 1900 and 2100.');
      return;
    }
    var testDate = new Date(year, month - 1, day);
    if (testDate.getFullYear() !== year || testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
      alert('The date entered is not valid.');
      return;
    }

    baziResult.innerHTML = '<div class="bazi-loading">Calculating your BaZi chart</div>';
    baziResult.classList.add('show');
    baziResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const payload = {
      year, month, day,
      hour: hour !== '' ? parseInt(hour) : null,
      minute: minute !== '' ? parseInt(minute) : null,
      lat: selectedCity ? selectedCity.lat : null,
      lng: selectedCity ? selectedCity.lng : null,
      tz: selectedCity ? selectedCity.tz : null,
      sex
    };

    try {
      const WORKER_URL = baziForm.dataset.workerUrl || '';
      if (!WORKER_URL) {
        baziResult.innerHTML = '<div class="bazi-error"><strong>BaZi Calculator Offline</strong><br><small>The BaZi calculation service is being set up. Please check back soon, or try our <a href="/zodiac/">zodiac calculator</a> instead.</small></div>';
        return;
      }
      const resp = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error('Server error: ' + resp.status);
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      renderBaziChart(data, baziResult);
      track('bazi_calculate', {
        event_category: 'Calculator',
        event_label: (data.dayMaster ? data.dayMaster.element + ' ' + data.dayMaster.stem : 'chart'),
        birth_year: payload.year,
        has_time: payload.hour !== null
      });
    } catch (err) {
      baziResult.innerHTML = '<div class="bazi-error"><strong>Error:</strong> ' + escapeHtml(err.message) +
        '<br><small>The BaZi calculation service may be temporarily unavailable. Please try again later.</small></div>';
      track('bazi_error', {
        event_category: 'Calculator',
        event_label: err.message.substring(0, 80)
      });
    }
  });
}
