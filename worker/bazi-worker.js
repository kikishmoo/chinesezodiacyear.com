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

      // Step 1: Get True Solar Time if location + time are provided
      if (hasTime && lat && lng && tz) {
        try {
          const solarTime = await getTrueSolarTime({
            year, month, day, hour: solarHour, minute: solarMinute, lat, lng, tz
          });
          if (solarTime) {
            solarHour = solarTime.hour;
            solarMinute = solarTime.minute;
          }
        } catch (e) {
          // Fall back to clock time if solar time API fails
          console.error('Solar time API error:', e.message);
        }
      }

      // Step 2: Get BaZi chart from zhouyi.cc
      const baziResult = await getBaziChart({
        year, month, day,
        hour: solarHour,
        minute: solarMinute,
        sex: sex || 'male',
        useTrueSolarTime: (hasTime && lat && lng && tz) ? 1 : 0
      });

      return Response.json({
        ...baziResult,
        trueSolarTime: (hasTime && lat && lng) ? { hour: solarHour, minute: solarMinute } : null,
        input: { year, month, day, hour, minute, lat, lng, tz, sex }
      }, { headers: { ...headers, 'Content-Type': 'application/json' } });

    } catch (e) {
      return Response.json({ error: e.message || 'Internal error' }, { status: 500, headers });
    }
  }
};

/**
 * Fetch True Solar Time from fate.windada.com
 */
async function getTrueSolarTime({ year, month, day, hour, minute, lat, lng, tz }) {
  const params = new URLSearchParams({
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
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const html = await resp.text();

  // Parse the True Solar Time from the response HTML
  // The page returns the adjusted time in a specific format
  const timeMatch = html.match(/真太阳时[^0-9]*(\d{1,2})[^\d]+(\d{1,2})/);
  if (timeMatch) {
    return { hour: parseInt(timeMatch[1]), minute: parseInt(timeMatch[2]) };
  }

  // Alternative parsing pattern
  const altMatch = html.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*(\d{1,2})\s*[时時:]\s*(\d{1,2})/);
  if (altMatch) {
    return { hour: parseInt(altMatch[4]), minute: parseInt(altMatch[5]) };
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
 * Parse BaZi chart HTML from zhouyi.cc into structured JSON
 */
function parseBaziHtml(html) {
  const result = {
    pillars: { year: {}, month: {}, day: {}, hour: {} },
    elements: {},
    reading: '',
    rawExcerpt: ''
  };

  // Heavenly Stems and Earthly Branches lookup
  const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const stemPinyin = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui'];
  const branchPinyin = ['Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai'];
  const stemElements = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
  const branchAnimals = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];

  // Try to extract four pillars from the HTML
  // zhouyi.cc outputs pillars in a table or structured div
  const pillarNames = ['year', 'month', 'day', 'hour'];

  // Pattern: look for stem-branch pairs in the HTML
  // Common format: 天干地支 in table cells
  const stemBranchPattern = new RegExp(`([${stems.join('')}])\\s*([${branches.join('')}])`, 'g');
  const pairs = [];
  let match;
  while ((match = stemBranchPattern.exec(html)) !== null) {
    pairs.push({ stem: match[1], branch: match[2] });
  }

  // Take the first 4 unique pairs as the four pillars (Year, Month, Day, Hour)
  const usedPairs = pairs.slice(0, 4);
  usedPairs.forEach((pair, i) => {
    if (i < 4) {
      const stemIdx = stems.indexOf(pair.stem);
      const branchIdx = branches.indexOf(pair.branch);
      const pillarName = pillarNames[i];
      result.pillars[pillarName] = {
        stem: pair.stem,
        branch: pair.branch,
        stemPinyin: stemIdx >= 0 ? stemPinyin[stemIdx] : '',
        branchPinyin: branchIdx >= 0 ? branchPinyin[branchIdx] : '',
        stemElement: stemIdx >= 0 ? stemElements[stemIdx] : '',
        branchAnimal: branchIdx >= 0 ? branchAnimals[branchIdx] : '',
        combined: pair.stem + pair.branch
      };
    }
  });

  // Extract reading text — look for main content sections
  // Remove HTML tags for the reading text
  const readingMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (readingMatch) {
    result.reading = readingMatch[1]
      .replace(/<[^>]+>/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .substring(0, 5000);
  }

  // Extract a broader text excerpt for display
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Find the section after the pillars table
  const readingStart = bodyText.indexOf('日主');
  if (readingStart > -1) {
    result.rawExcerpt = bodyText.substring(readingStart, readingStart + 3000).trim();
  } else {
    result.rawExcerpt = bodyText.substring(0, 2000).trim();
  }

  // Extract Day Master element
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

  return result;
}
