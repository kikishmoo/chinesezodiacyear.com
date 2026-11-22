/**
 * Generated-site multilingual SEO guardrails. This is a build-output check,
 * not a live crawl or a substitute for Google Search Console performance.
 * Run after Eleventy finishes generating _site.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = '_site';
const origin = 'https://chinesezodiacyear.com';
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const fileFor = path => join(root, path === '/' ? 'index.html' : path.slice(1), path === '/' ? '' : 'index.html');
function htmlAt(path) {
  const file = fileFor(path);
  if (!existsSync(file)) {
    errors.push('Missing HTML: ' + file);
    return '';
  }
  return readFileSync(file, 'utf8');
}
function tagValue(html, name, attribute = 'href') {
  const pattern = new RegExp('<link\\s+rel="' + name + '"[^>]*\\b' + attribute + '="([^"]+)"', 'i');
  return html.match(pattern)?.[1] ?? null;
}
function alternates(html) {
  const found = new Map();
  for (const match of html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"[^>]*>/g)) {
    found.set(match[1], match[2]);
  }
  return found;
}
function schemas(html, path) {
  const all = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { all.push(JSON.parse(match[1])); }
    catch (error) { errors.push(path + ' contains invalid JSON-LD: ' + error.message); }
  }
  return all;
}

const xml = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
check(urls.length > 100, 'Sitemap contains unexpectedly few URLs: ' + urls.length);
check(new Set(urls).size === urls.length, 'Duplicate <loc> URL in sitemap');
check(!urls.includes(origin + '/search/'), 'Noindex internal search must not be in sitemap');
check(urls.every(url => url.startsWith(origin + '/')), 'Sitemap includes a noncanonical domain');

const translatedRoutes = ['/', '/zodiac/', '/readings/', '/readings/2026-rat/', '/chinese-new-year-2027/'];
for (const route of translatedRoutes) {
  for (const [prefix, language] of [['', 'en'], ['/zh-hant', 'zh-Hant'], ['/zh-hans', 'zh-Hans']]) {
    const path = prefix + route;
    const html = htmlAt(path);
    if (!html) continue;
    const canonical = origin + path;
    check(html.includes('<html lang="' + language + '"'), path + ' has wrong <html lang>');
    check(tagValue(html, 'canonical') === canonical, path + ' has incorrect canonical');
    const alt = alternates(html);
    for (const [locale, href] of [
      ['en', origin + route],
      ['zh-Hant', origin + '/zh-hant' + route],
      ['zh-Hans', origin + '/zh-hans' + route],
      ['x-default', origin + route]
    ]) check(alt.get(locale) === href, path + ' missing/mismatched hreflang ' + locale);
    check(urls.includes(canonical), path + ' absent from sitemap');
    if (route.includes('2026-rat') || route.includes('chinese-new-year-2027')) {
      const article = schemas(html, path).find(schema => schema['@type'] === 'Article');
      check(Boolean(article), path + ' missing Article schema');
      if (article) {
        check(article.url === canonical, path + ' Article URL differs from canonical');
        check(article.mainEntityOfPage?.['@id'] === canonical, path + ' Article @id differs from canonical');
        check(article.inLanguage === language, path + ' Article inLanguage differs from <html lang>');
      }
    } else {
      schemas(html, path);
    }
  }
}

// Related New Year articles and hubs must visibly link to the naming essay
// and the three major context pages, without fabricating a Chinese translation
// of the English-only naming essay.
const relatedPages = [
  '/spring-festival/',
  '/calendar/',
  '/chinese-new-year-influence/',
  '/chinese-new-year-2027/',
  '/chinese-new-year-spring-festival/',
  '/chinese-new-year-traditions/',
  '/fifteen-days-chinese-new-year/',
  '/chinese-new-year-global-celebration/',
  '/why-red-and-gold-chinese-new-year/'
];
for (const route of relatedPages) {
  const localized = ![
    '/chinese-new-year-global-celebration/',
    '/why-red-and-gold-chinese-new-year/',
    '/chinese-new-year-traditions/',
    '/fifteen-days-chinese-new-year/'
  ].includes(route);
  const prefixes = localized ? ['', '/zh-hant', '/zh-hans'] : [''];
  for (const prefix of prefixes) {
    const path = prefix + route;
    const html = htmlAt(path);
    if (!html) continue;
    check(html.includes('href="/chinese-new-year-vs-lunar-new-year/"'),
      path + ' missing naming essay crosslink');
    for (const destination of ['/spring-festival/', '/calendar/', '/chinese-new-year-influence/']) {
      check(html.includes('href="' + (prefix || '') + destination + '"'),
        path + ' missing cluster link to ' + destination);
    }
  }
}

// Search Console driven copy updates must be reflected in the built pages.
// These checks ensure the landing-page titles remain faithful to the functionality.
const baziLanding = htmlAt('/bazi-calculator/');
check(baziLanding.includes('Four Pillars Birth Chart by Year, Month, Day &amp; Hour') ||
      baziLanding.includes('Four Pillars Birth Chart by Year, Month, Day & Hour'),
  'BaZi calculator title must describe birth year/month/day/hour search intent');
check(baziLanding.includes('What the BaZi calculator shows'),
  'BaZi page missing the informational introduction');
const compatLanding = htmlAt('/compatibility/');
check(compatLanding.includes('Chinese Zodiac Compatibility Chart — All 12 Animals'),
  'Compatibility hub missing chart heading');
const dragonMonkey = htmlAt('/compatibility/dragon-monkey/');
check(dragonMonkey.includes('Chinese Zodiac Compatibility'),
  'Pair page missing Chinese zodiac context');
check(dragonMonkey.includes('complete Chinese zodiac compatibility chart'),
  'Pair page missing link back to main compatibility chart');

// Year pages are intentionally English-only; do not emit fictional translations.
const yearPath = '/zodiac-year/2027/';
const year = htmlAt(yearPath);
if (year) {
  check(year.includes('Fire Goat'), '2027 year page does not identify Fire Goat');
  check(tagValue(year, 'canonical') === origin + yearPath, '2027 year has wrong canonical');
  check(!year.includes('hreflang="zh-Hant"'), 'English-only 2027 year page advertises nonexistent translation');
}
check(!existsSync(fileFor('/zh-hant/zodiac-year/2027/')), 'English-only 2027 year page has an unexpected zh-Hant copy');
const search = htmlAt('/search/');
check(/<meta name="robots" content="noindex, follow">/.test(search), 'Internal search needs noindex');

if (errors.length) {
  for (const error of errors) console.error('[SEO ERROR]', error);
  process.exit(1);
}
console.log('[SEO OK] Validated sitemap and sample self-canonicals, hreflang clusters, article JSON-LD and index controls.');
