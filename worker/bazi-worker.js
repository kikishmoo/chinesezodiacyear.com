/**
 * BaZi Calculator — Cloudflare Worker Proxy
 *
 * Accepts a birth datetime + location, fetches True Solar Time from
 * fate.windada.com, then retrieves the BaZi chart from zhouyi.cc
 * using the corrected time. Returns parsed chart data as JSON.
 *
 * POST /  →  { year, month, day, hour, minute, lat, lng, tz, sex }
 *         ←  { pillars, reading, trueSolarTime, ... }
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function getCorsOrigin(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
  if (allowed.includes(origin)) return origin;
  // Allow localhost for development
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return origin;
  return allowed[0] || '*';
}

export default {
  async fetch(request, env) {
    const corsOrigin = getCorsOrigin(request, env);
    const headers = { ...CORS_HEADERS, 'Access-Control-Allow-Origin': corsOrigin };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
    }

    try {
      const body = await request.json();
      const { year, month, day, hour, minute, lat, lng, tz, sex } = body;

      if (!year || !month || !day) {
        return Response.json({ error: 'year, month, and day are required' }, { status: 400, headers });
      }

      const hasTime = (hour !== undefined && hour !== null && hour !== '');
      let solarHour = hasTime ? hour : null;
      let solarMinute = hasTime ? (minute || 0) : null;
      let solarYear = year;
      let solarMonth = month;
      let solarDay = day;

      // Step 1: Get True Solar Time if location + time are provided
      if (hasTime && lat && lng && tz) {
        try {
          const solarTime = await getTrueSolarTime({
            year, month, day, hour: solarHour, minute: solarMinute, lat, lng, tz
          });
          if (solarTime) {
            solarHour = solarTime.hour;
            solarMinute = solarTime.minute;
            // True Solar Time may cross a day boundary
            if (solarTime.year) solarYear = solarTime.year;
            if (solarTime.month) solarMonth = solarTime.month;
            if (solarTime.day) solarDay = solarTime.day;
          }
        } catch (e) {
          // Fall back to clock time if solar time API fails
          console.error('Solar time API error:', e.message);
        }
      }

      // Step 2: Get BaZi chart from zhouyi.cc
      const baziResult = await getBaziChart({
        year: solarYear, month: solarMonth, day: solarDay,
        hour: solarHour,
        minute: solarMinute,
        sex: sex || 'male',
        useTrueSolarTime: (hasTime && lat && lng && tz) ? 1 : 0
      });

      return Response.json({
        ...baziResult,
        trueSolarTime: (hasTime && lat && lng) ? {
          hour: solarHour, minute: solarMinute,
          year: solarYear, month: solarMonth, day: solarDay
        } : null,
        input: { year, month, day, hour, minute, lat, lng, tz, sex }
      }, { headers: { ...headers, 'Content-Type': 'application/json' } });

    } catch (e) {
      return Response.json({ error: e.message || 'Internal error' }, { status: 500, headers });
    }
  }
};

/**
 * Fetch True Solar Time from fate.windada.com
 * Uses the BDayInfo function which returns a static result table.
 */
async function getTrueSolarTime({ year, month, day, hour, minute, lat, lng, tz }) {
  const params = new URLSearchParams({
    FUNC: 'BDayInfo',
    latitude: String(lat),
    longitude: String(lng),
    TZName: tz,
    Year: String(year),
    Month: String(month),
    Day: String(day),
    Hour: String(hour),
    Min: String(minute),
    Sec: '0'
  });

  const resp = await fetch('https://fate.windada.com/cgi-bin/SolarTime_gb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (compatible; BaZiCalc/1.0)'
    },
    body: params.toString()
  });

  const html = await resp.text();

  // Response format: 真太阳时:</td><td...>YYYY/MM/DD HH:MM:SS</td>
  const tsMatch = html.match(
    /真太阳时[^<]*<\/td>\s*<td[^>]*>\s*(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/
  );
  if (tsMatch) {
    return {
      year: parseInt(tsMatch[1]),
      month: parseInt(tsMatch[2]),
      day: parseInt(tsMatch[3]),
      hour: parseInt(tsMatch[4]),
      minute: parseInt(tsMatch[5]),
      second: parseInt(tsMatch[6])
    };
  }

  return null;
}

/**
 * Fetch BaZi chart from zhouyi.cc
 */
async function getBaziChart({ year, month, day, hour, minute, sex, useTrueSolarTime }) {
  const params = new URLSearchParams({
    data_type: '0',          // 0 = solar calendar
    cboYear: String(year),
    cboMonth: String(month),
    cboDay: String(day),
    cboHour: hour !== null ? String(hour) : '-1',
    cboMinute: minute !== null ? String(minute) : '0',
    pid: '0',
    cid: '0',
    zty: String(useTrueSolarTime),  // 1 = use true solar time
    txtName: '',
    rdoSex: sex === 'female' ? '0' : '1'
  });

  const resp = await fetch('https://www.zhouyi.cc/bazi/sm/BaZi.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (compatible; BaZiCalc/1.0)'
    },
    body: params.toString()
  });

  const html = await resp.text();
  return parseBaziHtml(html);
}

/**
 * Parse BaZi chart HTML from zhouyi.cc into structured JSON.
 *
 * The response contains a <ul class='bazilist f14'> with 35 <li> items
 * arranged in a 7-row × 5-column grid:
 *   Row 1 (0-4):   Ten Gods labels
 *   Row 2 (5-9):   [5]=gender, [6-9]=Heavenly Stems (Year,Month,Day,Hour)
 *   Row 3 (10-14): [10]=label, [11-14]=Earthly Branches
 *   Row 4 (15-19): [15]=label, [16-19]=Hidden Stems
 *   Row 5 (20-24): Hidden Gods
 *   Row 6 (25-29): Life Stages
 *   Row 7 (30-34): [30]=label, [31-34]=Na Yin
 */
function parseBaziHtml(html) {
  const result = {
    pillars: { year: {}, month: {}, day: {}, hour: {} },
    gender: '',
    hiddenStems: { year: '', month: '', day: '', hour: '' },
    naYin: { year: '', month: '', day: '', hour: '' },
    daYun: [],
    basicInfo: {},
    fiveElements: '',
    readingSections: [],
    dayMaster: null,
    rawExcerpt: ''
  };

  const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const stemPinyin = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
  const branchPinyin = ['Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai'];
  const stemElements = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  const branchAnimals = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];

  function stripTags(s) { return s.replace(/<[^>]+>/g, '').trim(); }

  // --- Parse the bazilist grid (Four Pillars) ---
  const bazilistMatch = html.match(/<ul\s+class=['"]bazilist\s+f14['"]>([\s\S]*?)<\/ul>/);
  if (bazilistMatch) {
    const liItems = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;
    let m;
    while ((m = liRegex.exec(bazilistMatch[1])) !== null) {
      liItems.push(stripTags(m[1]));
    }

    if (liItems.length >= 15) {
      // Gender indicator
      const genderText = liItems[5] || '';
      result.gender = genderText.includes('乾造') ? 'male'
                    : genderText.includes('坤造') ? 'female' : '';

      const pillarNames = ['year', 'month', 'day', 'hour'];
      for (let i = 0; i < 4; i++) {
        const stemChar = liItems[6 + i] || '';
        const branchChar = liItems[11 + i] || '';
        const stemIdx = stems.indexOf(stemChar);
        const branchIdx = branches.indexOf(branchChar);

        result.pillars[pillarNames[i]] = {
          stem: stemChar,
          branch: branchChar,
          stemPinyin: stemIdx >= 0 ? stemPinyin[stemIdx] : '',
          branchPinyin: branchIdx >= 0 ? branchPinyin[branchIdx] : '',
          stemElement: stemIdx >= 0 ? stemElements[stemIdx] : '',
          branchAnimal: branchIdx >= 0 ? branchAnimals[branchIdx] : '',
          combined: stemChar + branchChar
        };
      }

      // Hidden stems (Row 4, items 16-19)
      if (liItems.length >= 20) {
        for (let i = 0; i < 4; i++) {
          result.hiddenStems[pillarNames[i]] = liItems[16 + i] || '';
        }
      }

      // Na Yin (Row 7, items 31-34)
      if (liItems.length >= 35) {
        for (let i = 0; i < 4; i++) {
          result.naYin[pillarNames[i]] = liItems[31 + i] || '';
        }
      }
    }
  }

  // --- Parse Da Yun (luck cycles) from bazilist2 ---
  const dayunMatch = html.match(/<ul\s+class=['"]bazilist2\s+f14['"]>([\s\S]*?)<\/ul>/);
  if (dayunMatch) {
    const dayunItems = [];
    const liRegex2 = /<li[^>]*>([\s\S]*?)<\/li>/g;
    let m2;
    while ((m2 = liRegex2.exec(dayunMatch[1])) !== null) {
      dayunItems.push(stripTags(m2[1]));
    }
    // 45 items in 5×9 grid: label + 8 periods
    // Row 2 (items 9-17): Da Yun stem-branch
    // Row 4 (items 27-35): start age
    // Row 5 (items 36-44): start year
    if (dayunItems.length >= 45) {
      for (let i = 1; i < 9; i++) {
        const combined = dayunItems[9 + i] || '';
        const age = dayunItems[27 + i] || '';
        const yr = dayunItems[36 + i] || '';
        if (combined) {
          result.daYun.push({ combined, startAge: age, startYear: yr });
        }
      }
    }
  }

  // --- Parse basic info ---
  const infoPatterns = [
    { key: 'trueSolarTimeStr', regex: /真太阳时[间間）)]*[：:]\s*([^\n<]+)/ },
    { key: 'lunarDate',        regex: /农历[：:]\s*([^\n<]+)/ },
    { key: 'zodiac',           regex: /生肖[：:]\s*([^\n<]+)/ },
    { key: 'constellation',    regex: /星座[：:]\s*([^\n<]+)/ }
  ];
  for (const { key, regex } of infoPatterns) {
    const m = html.match(regex);
    if (m) result.basicInfo[key] = m[1].trim();
  }

  // --- Parse Five Elements analysis ---
  const wuhfxMatch = html.match(/五行力量[^<]*([\s\S]*?)(?=<div\s+class=['"]baziboxtop|<ul\s+class)/);
  if (wuhfxMatch) {
    result.fiveElements = stripTags(wuhfxMatch[0]).substring(0, 1000);
  }

  // --- Parse reading sections ---
  const sectionRegex = /<div\s+class=['"]baziboxtop['"][^>]*>([\s\S]*?)<\/div>\s*<div\s+class=['"]baziboxmain3[^'"]*['"][^>]*>([\s\S]*?)<\/div>/g;
  let sMatch;
  while ((sMatch = sectionRegex.exec(html)) !== null) {
    const title = stripTags(sMatch[1]);
    const content = stripTags(sMatch[2]).substring(0, 2000);
    if (title && content) {
      result.readingSections.push({ title, content });
    }
  }

  // --- Extract Day Master ---
  const dayPillar = result.pillars.day;
  if (dayPillar && dayPillar.stem) {
    const dayIdx = stems.indexOf(dayPillar.stem);
    if (dayIdx >= 0) {
      result.dayMaster = {
        stem: dayPillar.stem,
        pinyin: stemPinyin[dayIdx],
        element: stemElements[dayIdx],
        yinYang: dayIdx % 2 === 0 ? 'Yang' : 'Yin'
      };
    }
  }

  // --- Build rawExcerpt fallback ---
  if (result.readingSections.length > 0) {
    result.rawExcerpt = result.readingSections
      .slice(0, 5)
      .map(s => s.title + '\n' + s.content)
      .join('\n\n')
      .substring(0, 3000);
  } else {
    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    const readingStart = bodyText.indexOf('日主');
    result.rawExcerpt = readingStart > -1
      ? bodyText.substring(readingStart, readingStart + 3000).trim()
      : bodyText.substring(0, 2000).trim();
  }

  // Validation: if all pillars are empty, the parser likely failed
  const hasPillars = Object.values(result.pillars).some(p => p.stem);
  if (!hasPillars) {
    result.parseError = 'Could not extract BaZi pillars from upstream service. The service may have changed its response format.';
  }

  return result;
}
