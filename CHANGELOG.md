# Changelog — chinesezodiacyear.com

> All notable changes to this project are documented in this file.
> Format: grouped by logical feature/fix, ordered newest-first.

---

## 2026-03-10 — Onboarding Audit & Document Corrections (Session 8)

**Author:** yunneoi.yn@gmail.com

### Audit — Full Codebase & Documentation Review

New CEO agent session. Complete onboarding audit of repository, live site, documentation, build pipeline, and GitHub state.

**Build verification:**
- Build passes: 302 base pages (299 HTML + 3 non-HTML), 596 i18n variants (298 zh-hant + 298 zh-hans), total 895 HTML files
- CSS minified: 126.7KB → 101.0KB
- JS minified: site.js 58.6KB → 35.4KB, trivia.js 130.5KB → 118.2KB
- Build time: 7.21 seconds
- Live site confirmed accessible and healthy

**npm vulnerability found:**
- `liquidjs <10.25.0` — high-severity path traversal fallback vulnerability (GHSA-wmfp-5q7x-987x)
- Fix available via `npm audit fix`

**Documentation corrections applied:**
- CLAUDE.md Section 6: Removed phantom `src/_data/zodiac.json` reference (file does not exist; zodiac data comes from `zodiacYears.js` and individual `.njk` files)
- CLAUDE.md Section 5: Added npm vulnerability attention point
- README.md: Corrected article count from 16 → 21 (5 CNY articles added 2026-03-09 were not reflected)
- Page counts updated: 302 base → 895 total (was documented as 293 → 879)

**Audit findings (no action taken yet — for board review):**
1. npm high-severity vulnerability in liquidjs needs `npm audit fix`
2. 21 article files exist but only 12 are in contentCalendar.json — 9 articles not tracked in calendar
3. CHANGELOG author emails inconsistent (5 different emails used across sessions)
4. docs/seo-performance.md dated 2026-03-07 has stale P0/P1 status markers that have since been resolved
5. No deployment runbook for Cloudflare Worker (separate from GitHub Pages deploy)
6. No translation QA checklist documented
7. Year 2026 readings will need 2027 versions created before Q4 2026

### Files Changed

| File | Change |
|------|--------|
| `CHANGELOG.md` | This entry |
| `CLAUDE.md` | Removed phantom zodiac.json ref; added npm vuln attention point |
| `README.md` | Corrected article count (16 → 21), page counts (293/879 → 302/895) |

---

## 2026-03-10 — BaZi Calculator Complete Fix: Frontend + Backend + Geocoding (Session 7 cont.)

**Author:** lavertenstyle@gmail.com

### Bug Fix — BaZi Calculator Non-Functional (3-layer fix)

The BaZi calculator was completely non-functional due to bugs across frontend, backend, and geocoding. All three layers have been fixed:

**Frontend fixes (src/site.js):**
- Fixed form ID mismatch: `getElementById('bazi-form')` corrected to `getElementById('bazi-calc-form')`
- Fixed checkbox ID mismatch: `getElementById('bazi-unknown-time')` corrected to `getElementById('bazi-no-time')`
- Fixed sex selector: `getElementById('bazi-sex')` replaced with `querySelector('input[name="bazi-sex"]:checked')` (radios use `name` not `id`)
- Fixed city data key references: `c.c`/`c.co`/`c.la`/`c.lo` corrected to `c.city`/`c.country`/`c.lat`/`c.lng` matching cities.json schema

**Geocoding upgrade (src/site.js):**
- Replaced city-only autocomplete (~200 major cities) with hybrid Nominatim + cities.json fallback
- Primary: OpenStreetMap Nominatim API (worldwide coverage, towns and villages)
- Fallback: cities.json offline search for Nominatim failures
- Added `resolveTimezone()` helper — finds nearest city in cities.json for IANA timezone lookup
- 350ms debounce with AbortController respects Nominatim 1 req/sec rate limit

**Backend fixes (worker/bazi-worker.js):**
- Added missing `FUNC: 'BDayInfo'` parameter to windada True Solar Time API call (was returning empty form)
- Fixed windada response regex to match actual HTML table format
- Added full date extraction (year/month/day) to handle True Solar Time crossing midnight
- Rewrote `parseBaziHtml()` to properly parse zhouyi.cc's structured grid (`<ul class='bazilist f14'>` 7x5 grid)
- Now extracts: Four Pillars, hidden stems, Na Yin, Da Yun luck cycles, basic info, Five Elements analysis, 23 reading sections, Day Master
- Added parser validation: clear error message if pillar extraction fails

**Chart renderer rewrite (src/site.js):**
- Enhanced Four Pillars grid with hidden stems and Na Yin rows per pillar
- Added basic info section (lunar date, zodiac, constellation)
- Added Five Elements balance display
- Added Da Yun major luck cycles as horizontal scrollable card row
- Added reading sections as collapsible `<details>` elements
- Added parse error display for upstream format changes
- All dynamic content wrapped in `esc()` for XSS safety

**CSS additions (src/styles.css):**
- New classes: `.pillar-hidden`, `.pillar-nayin`, `.bazi-info-grid`, `.bazi-five-elements`, `.bazi-dayun`, `.bazi-dayun-row`, `.bazi-dayun-card`, `.bazi-sections`
- Full dark mode support for all new elements

**HTML tweak (src/pages/bazi-calculator.njk):**
- Updated city field placeholder to "Start typing any city or town name…"
- Added note: "Covers cities and towns worldwide via OpenStreetMap."

### Files Changed

| File | Change |
|------|--------|
| `src/site.js` | 3 ID fixes, city key fixes, Nominatim geocoding, chart renderer rewrite |
| `worker/bazi-worker.js` | windada API fix, zhouyi.cc parser rewrite, enriched response JSON |
| `src/styles.css` | New BaZi result CSS classes + dark mode overrides |
| `src/pages/bazi-calculator.njk` | City field placeholder + OpenStreetMap note |
| `CHANGELOG.md` | This entry |

### Deployment Note

The Cloudflare Worker changes require `npx wrangler deploy` to go live. Frontend changes deploy with the normal Eleventy build to GitHub Pages.

---

## 2026-03-10 — Strategic Pivot: Automated PDF Revenue + Document Updates (Session 7)

**Author:** lavertenstyle@gmail.com

### Documentation — Strategic Monetisation Update

Updated core project documents to reflect the new revenue strategy agreed with the owner:

- **TODO.md:** Added new top-priority monetisation section (items A–D) covering automated BaZi PDF reports, compatibility PDF reports, directory lead-gen expansion, and embeddable API/widget. Cleaned up priority matrix — moved 14 completed items to a separate "Completed Items" table. Updated executive summary.
- **CLAUDE.md:** Updated Section 3 (Strategy Rules) with new revenue model details. Updated Section 5 (Temporary Attention Points) — Facebook Pixel now marked as installed, translation backlog resolved, added new attention point for BaZi PDF report system.
- **docs/content-strategy.md:** Section 6.8 added for automated PDF report products.

### Files Changed

| File | Change |
|------|--------|
| `TODO.md` | New monetisation strategy section; cleaned priority matrix; updated summary |
| `CLAUDE.md` | Revenue model update (Section 3); attention points update (Section 5) |
| `CHANGELOG.md` | This entry |

---

## 2026-03-09 — Full TC/SC Translation: Compatibility Hub, Zodiac Hub, 12 Animal Profiles (Session 6)

**Author:** kiki.peiqi.li@gmail.com

### Content — Compatibility Hub TC/SC Completion

Expanded the Compatibility hub page (`compatibility.njk`) TC/SC translations from ~60% to full parity:

- **Compatibility chart table** with all 12 animal interactions translated
- **Self-punishment section** (自刑) with explanations and examples
- **Elemental interactions** (Six Harmonies, Three Harmonies, Six Clashes, Six Harms) with closing paragraphs
- **Expanded truncated introductions** in existing sections
- **Premium CTA callout** translated for both TC and SC

### Content — Zodiac Hub TC/SC Completion

Expanded the Zodiac hub page (`zodiac.njk`) TC/SC translations from ~70% to full parity:

- **12 animal detail sections** after the zodiac grid (overview, personality traits, compatibility highlights for each animal)
- **Watch & Learn section** with Jackie Chan Adventures video embeds and social media content

### Content — 12 Zodiac Animal Profile Pages (Stub → Full)

Translated all 12 zodiac animal profile pages from stub (~14% — hero + summary only) to full 7-section TC/SC:

| Page | Key Cultural Content (TC/SC) |
|------|------------------------------|
| Rat (`rat.njk`) | Cang Jie legend, first-to-arrive myth, Zi hour |
| Ox (`ox.njk`) | Shennong agriculture, iron plough history, Lao Tzu's mount |
| Tiger (`tiger.njk`) | King of Beasts, 王 character on forehead, tiger-head shoes, Door Gods |
| Rabbit (`rabbit.njk`) | Jade Rabbit mythology, Taiping Yulan, Mid-Autumn Festival, Rabbit Lord figurines |
| Dragon (`dragon.njk`) | Hongshan jade dragons, Yijing Qian hexagram, imperial five-clawed dragon, Dragon Boat Festival |
| Snake (`snake.njk`) | "Little Dragon" folk name, Nuwa mythology, White Snake legend, Samantabhadra Bodhisattva |
| Horse (`horse.njk`) | Zhou Rites, blood-sweating horses, Xu Beihong paintings, 2026 Fire Horse year |
| Goat (`goat.njk`) | Shuowen Jiezi etymology, 三羊開泰, kneeling-to-nurse filial piety, Twenty-Four Filial Exemplars |
| Monkey (`monkey.njk`) | Sun Wukong/Journey to the West, Monkey Opera in Peking Opera, Qitian Dasheng temple worship |
| Rooster (`rooster.njk`) | Five Virtues from Hanshu, Dong Zhongshu's Chunqiu Fanlu, jī/jí homophone |
| Dog (`dog.njk`) | Hemudu culture domestication, Erya dictionary, Tiangou eclipse mythology |
| Pig (`pig.njk`) | 家 character etymology (roof + pig), Kuahuqiao archaeology, Zhu Bajie, 肥豬拱門 |

Each page follows the established 7-section structure: overview (with info-grid), personality (core strengths + potential challenges), earthly-branch (with data-table), compatibility (with data-table), years (with data-table + Lichun note), career (5 items), culture (2 paragraphs).

**Files changed:** `compatibility.njk`, `zodiac.njk`, `rat.njk`, `ox.njk`, `tiger.njk`, `rabbit.njk`, `dragon.njk`, `snake.njk`, `horse.njk`, `goat.njk`, `monkey.njk`, `rooster.njk`, `dog.njk`, `pig.njk` (14 files total)

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, zero errors, 7.13 seconds

---

## 2026-03-09 — Pinterest Domain Verification (Session 5, continued)

**Author:** kiki.peiqi.li@gmail.com

### Feature — Pinterest Domain Verification

Added Pinterest domain verification code (`d1ac131191ba6ba1d8f137aae6929019`) to `site.json`, activating the `<meta name="p:domain_verify">` tag on all pages. This enables Rich Pins and website claiming in Pinterest Business.

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Pinterest & TikTok Social Links (Session 5, continued)

**Author:** kiki.peiqi.li@gmail.com

### Feature — Pinterest & TikTok Social Integration

Added Pinterest Business and TikTok account links to `site.json`, activating the pre-existing conditional social icons in the footer across all pages:

- Pinterest: `https://www.pinterest.com/ChineseZodiacYear/`
- TikTok: `https://www.tiktok.com/@chinesezodiacyear`
- Both icons now render in the site footer on all 891 built pages (302 base + 596 i18n variants)
- TODO #9 and #11 updated to reflect account creation progress

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Favicon Consistency Fix (Session 5)

**Author:** kiki.peiqi.li@gmail.com

### Fix — Favicon Gold Color and Tilt

Regenerated all favicon raster files from the SVG source to ensure consistency with the webpage nav logo:
- Increased seal tilt from -2deg to -5deg for visibility at small sizes (16-32px)
- All raster files (favicon.ico, PNG 32/192/512, apple-touch-icon) regenerated via `rsvg-convert` with Noto Serif CJK SC Bold font
- CSS `.logo-seal` rotation updated from -2deg to -5deg to match

### Feature — Meta Pixel Installation

Installed Facebook/Meta Pixel (ID: `1461477519098003`) by setting `facebookPixelId` in `site.json`. The base template already had the conditional pixel code wired up — only the data value was missing.

- Pixel fires `PageView` on every page (302 base + 596 i18n variants)
- Noscript fallback image included for tracking without JavaScript
- TODO #1 (CRITICAL) marked complete

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Affiliate Recommended Reading Sidebars (Session 4, continued)

**Author:** kiki.peiqi.li@gmail.com

### Feature — Sidebar Book Recommendations on 12 Pages

Added "Recommended Reading" affiliate sidebar to 12 encyclopaedia pages that were missing them, linking to topically relevant books from the shop catalogue:

- **Yi Jing:** I Ching (Legge), Tao Te Ching (Mitchell)
- **Tea Culture:** The Classic of Tea (Carpenter)
- **Qi Men Dun Jia:** BaZi Destiny Code (Yap), Art of War (Sun Tzu)
- **TCM:** Web That Has No Weaver (Kaptchuk), Between Heaven and Earth (Beinfield)
- **Spring Festival:** Handbook of Chinese Horoscopes (Lau), Complete Book (Reid)
- **Calendar:** I Ching (Legge), Definitive Book of Chinese Astrology (Wu)
- **Folk Arts:** Complete Book of Chinese Horoscopes (Reid)
- **Hanfu:** Art of War (Sun Tzu)
- **Martial Arts:** Art of War (Sun Tzu), Tao Te Ching (Mitchell)
- **Dynasties:** Art of War (Sun Tzu), Tao Te Ching (Mitchell)
- **Wuxia:** Art of War (Sun Tzu)
- **Chinamaxxing:** Tao Te Ching (Mitchell), Art of War (Sun Tzu)

All links use `kikigreene-20` affiliate tag with direct `/dp/ASIN` URLs. Pages with sidebar recommendations: 19 → 31.

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Affiliate Link Fix: Search URLs → Direct Product Links (Session 4, continued)

**Author:** kiki.peiqi.li@gmail.com

### Fix — Affiliate Product URLs

Replaced all 16 Amazon search URLs (`/s?k=...`) with direct product links (`/dp/ASIN`) for reliable affiliate commission attribution. Search URLs can lose the affiliate tag during navigation; direct product links ensure the `kikigreene-20` tag is always passed to Amazon Associates.

**Products fixed:** Luo Pan Compass, Calligraphy Brush Set, Gongfu Tea Set, Red Envelopes, Jade Bangle, Pixiu Bracelet, Zodiac Pendant, Lucky Coin Set, Laughing Buddha, Bagua Mirror, Fortune Cat, Calligraphy Wall Scroll, Incense Burner, Acupressure Mat, Gua Sha Tool, Cupping Set.

All 27 affiliate products now point to concrete Amazon product pages. Zero search URLs remain.

---

## 2026-03-09 — Affiliate Products Expansion & Repositioning (Session 4, continued)

**Author:** kiki.peiqi.li@gmail.com

### Feature — Affiliate Products Expansion

Expanded the Amazon Associates affiliate catalogue from 10 to 27 products, adding 3 new categories:

**New categories:**
- **Jewellery (4):** Natural jade bangle, Pixiu feng shui bracelet, zodiac pendant necklace, lucky coin set
- **Decor (5):** Laughing Buddha statue, Bagua mirror, Maneki-Neko fortune cat, calligraphy wall scroll, Chinese incense burner set
- **Wellness (3):** Acupressure mat and pillow set, jade gua sha tool, Chinese cupping therapy set

**New books (5):** Chinese Astrology: Plain and Simple (Dee), Tao Te Ching (Laozi/Mitchell), The Art of War (Sun Tzu), Feng Shui Modern (Tan & Lee), Handbook of Chinese Horoscopes (Lau)

All 17 new products include trilingual names and subtitles (EN/TC/SC), category tags, and Amazon URLs with `kikigreene-20` affiliate tag.

### Layout — Affiliate Section Repositioned

Moved the "Recommended Books & Tools" section to the top of the shop page in all 3 language blocks (EN/TC/SC), ahead of Premium Readings and Digital Products. Added new filter buttons for jewellery (首飾/首饰), decor (擺設/摆设), and wellness (養生/养生).

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Affiliate Products & Encyclopaedia Translations (Session 4)

**Author:** kiki.peiqi.li@gmail.com

### Content — Encyclopaedia TC/SC Translations

Translated 3 remaining encyclopaedia pages to Traditional Chinese (zh-hant) and Simplified Chinese (zh-hans), completing the translation backlog:

- **Yi Jing** (`yijing.njk`): Full TC/SC translation of all sections — origins, trigrams, hexagrams, divination methods, philosophical influence, modern applications.
- **Tea Culture** (`tea-culture.njk`): Full TC/SC translation — Lu Yu and the Classic of Tea, six tea types, gongfu ceremony, tea and health, regional traditions.
- **Qi Men Dun Jia** (`qimen.njk`): Full TC/SC translation — history, the nine stars, eight doors, cosmic board structure, modern applications.

### Feature — Amazon Associates Affiliate Products

Added 10 curated affiliate products to the shop page, creating a new "Recommended Books & Tools" section:

**Books (6):**
- The Complete Book of Chinese Horoscopes (Lori Reid)
- The Definitive Book of Chinese Astrology (Shelly Wu)
- BaZi — The Destiny Code (Joey Yap)
- The Living Earth Manual of Feng Shui (Stephen Skinner)
- I Ching: The Book of Changes (James Legge translation)
- The Classic of Tea by Lu Yu (Francis Ross Carpenter)

**Tools & Supplies (4):**
- Professional Luo Pan Feng Shui Compass
- Chinese Calligraphy Brush Set
- Gongfu Tea Set (ceramic)
- Chinese Red Envelopes (Hongbao) 50-pack

**Technical implementation:**
- `shop.json`: Added `affiliateProducts` array with trilingual names/subtitles (EN/TC/SC), categories, featured flags, and Amazon URLs with `kikigreene-20` affiliate tag.
- `shop.njk`: Added affiliate section in all 3 language blocks (EN/TC/SC) with independent filter buttons (All/Books/Tools), affiliate disclosure, and `rel="noopener sponsored"` links.
- `site.js`: Refactored shop filter JS from global selection to per-`.shop-filters` group scoping using `nextElementSibling`, so digital product and affiliate product filters operate independently. Added `data-scope` attribute for GA4 event label differentiation.
- `styles.css`: Added `.product-price--affiliate` and `.affiliate-disclosure` styles with dark mode variants.

### Documentation Updates

- `CLAUDE.md`: Translation backlog marked RESOLVED
- `TODO.md`: Translation audit table updated (0 ABSENT, all DONE), phases 1 & 2 complete
- `docs/architecture.md`: 3 known issues marked RESOLVED, search index count updated to ~302
- `docs/content-strategy.md`: All 7 translated pages marked Full parity EXCELLENT

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — BaZi Cloudflare Worker Deployment Fix

**Author:** CEO Agent (session 3, continued)

### Infrastructure — Worker Deployment

- **`wrangler.jsonc`**: Replaced the Cloudflare autoconfig static-assets configuration with the actual BaZi API worker config. Changed `"assets": {"directory": "_site"}` to `"main": "worker/bazi-worker.js"` with `ALLOWED_ORIGINS` env var. The worker now correctly serves as an API proxy (fetching True Solar Time and BaZi chart data from upstream Chinese astrology services), not a static site host.
- **Cloudflare build settings**: Root directory changed from `/worker` to `/`, build command removed (worker needs no build step), deploy command remains `npx wrangler deploy`.
- **Worker verified live** at `bazi-calculator.kiki-peiqi-li.workers.dev` returning structured JSON with four pillars, Day Master, and Chinese reading text.

---

## 2026-03-09 — Chinese Character & Pinyin Annotations + BaZi Worker URL

**Author:** CEO Agent (session 3)

### Content — Pinyin Annotations

Added `<span class="chinese-char">` and `<span class="pinyin">` markup to all Chinese terms in English content sections across 7 articles (~75 annotation gaps fixed). TC/SC sections untouched. All pinyin uses HTML entities for tone marks per site standard.

**Articles updated:**

- **`chinese-new-year-global-celebration.njk`** — 7 fixes (Chunyun, tusu wine, Zong Lin, Jingchu Suishi Ji, etc.)
- **`chinese-new-year-spring-festival.njk`** — 7 fixes (Yuanri, Zhengdan, Wang Anshi, Meng Yuanlao, etc.)
- **`chinese-new-year-traditions.njk`** — 7 fixes (shansao, bianpao, Shenshu/Yulei, Meng Chang, etc.)
- **`chinese-new-year-vs-lunar-new-year.njk`** — 2 fixes (Zhu Qiqian, Samguk Sagi)
- **`fifteen-days-chinese-new-year.njk`** — 6 fixes (nian gao, yusheng, tangyuan/yuanxiao, etc.)
- **`why-red-and-gold-chinese-new-year.njk`** — 11 fixes (Wu Xing, five elements, Shanhai Jing, yasuiqian, feng shui, etc.)
- **`qingming-festival-guide.njk`** — 17 fixes (Chunfen, Guyu, Jie Zitui, Duke Wen of Jin, Du Mu, Zuo Zhuan, food table, Guo Pu, Zangshu, etc.)

### Feature — BaZi Calculator Worker URL

- **`bazi-calculator.njk`**: Added `data-worker-url="https://bazi-calculator.kiki-peiqi-li.workers.dev"` to the calculator form element, connecting the frontend to the Cloudflare Worker proxy.

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified, zero errors

---

## 2026-03-09 — Adopt Classical "Encyclopaedia" Spelling

**Author:** CEO Agent (session 2, continued)

### Content — Spelling Standardisation

- **Changed "encyclopedia" → "encyclopaedia"** in all user-facing prose across 41 files (titles, descriptions, hero overlines, button text, meta tags, manifest, llms.txt, nav labels, documentation).
- Code identifiers preserved: `category: "encyclopedia"` frontmatter, CMS config, collection filters, sitemap priority logic, CSS class comments, and JS fallback links remain unchanged to avoid breaking the build pipeline.
- **Files touched:** 30 source `.njk` files, `package.json`, `manifest.json`, `site.json`, `nav.json`, `llms.txt`, `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `TODO.md`, and 4 docs files.

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified, zero errors

---

## 2026-03-09 — MS Clarity Activation & British English Audit

**Author:** CEO Agent (session 2)

### Features

- **Microsoft Clarity activated** (`src/_data/site.json`): Added Clarity tracking ID `vsv5yhdstc`. The conditional Clarity script block in `base.njk` was already wired up — setting the ID enables heatmap and session recording on all pages.

### Content Fixes — British English Spelling

- **`src/pages/index.njk`**: "Organizations" → "Organisations" (heading + card label, 2 instances)
- **`src/pages/zodiac.njk`**: 5 corrections:
  - "standardized" → "standardised" (FAQ answer)
  - "civilization" → "civilisation" (Ox description)
  - "emphasize" → "emphasise" (Rabbit description)
  - "symbolizes" → "symbolises" (Goat description)
  - "symbolizes" → "symbolises" (Dog description)
- **`src/pages/calendar.njk`**: Already correct British English — no changes needed
- **`src/pages/spring-festival.njk`**: Already correct British English — no changes needed
- **`src/pages/asian-new-year.njk`** (Chinese NY Influence): Already correct British English — no changes needed

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified

---

## 2026-03-09 — Technical Stabilisation: BaZi, Newsletter, Analytics Placeholders

**Author:** CEO Agent (onboarding audit session)

### Bug Fixes

- **BaZi Calculator graceful offline mode** (`src/site.js`): Replaced hardcoded placeholder Worker URL (`YOUR_SUBDOMAIN`) with a configurable `data-worker-url` attribute approach. When no Worker URL is configured, users now see a friendly "BaZi Calculator Offline" message instead of a silent fetch failure. Once the Cloudflare Worker is deployed, the template just needs the `data-worker-url` attribute set.

- **Newsletter popup stuck state fix** (`src/site.js`): Added an 8-second safety timeout to the Beehiiv newsletter iframe submission. Previously, if the iframe failed silently, the subscribe button would stay stuck on "Subscribing..." indefinitely (Regression #3). Now, after 8 seconds, the error state is shown with a retry option. The `beehiivDone` flag prevents the error from firing after a successful submission.

### Added

- **Facebook Pixel placeholder** (`src/_includes/layouts/base.njk`, `src/_data/site.json`): Added `facebookPixelId` config key (empty by default) and conditional Meta Pixel script block. When a Pixel ID is added to `site.json`, the standard `fbevents.js` loader and `PageView` tracking will activate automatically on all pages.

- **Microsoft Clarity placeholder** (`src/_includes/layouts/base.njk`, `src/_data/site.json`): Added `clarityId` config key (empty by default) and conditional Clarity tag script. Same activation pattern as Facebook Pixel.

### Verified

- **Hub page ItemList schemas**: Confirmed all four hub pages (`zodiac.njk`, `wuxing.njk`, `dynasties.njk`, `readings.njk`) already have correct `hubSchema` frontmatter with ItemList structured data. No changes needed.

- **Build validation**: Full build passes — 302 base pages, 596 i18n variants (898 total). CSS minified 123KB→98KB, JS minified 53KB→33KB.

**Files changed:** `src/site.js`, `src/_data/site.json`, `src/_includes/layouts/base.njk`

---

## 2026-03-09 — Meta-Learning Framework: Agent Boot File & SOPs

**Author:** kiki.shmoo@gmail.com

### Added Agent Self-Improvement Infrastructure

Implemented the "9 Meta-Learning Tips" framework (based on @AtlasForgeAI's article) to enable persistent learning across agent sessions.

**New files:**

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Agent boot file — loaded every session. Contains canonical rules (editorial identity, technical identity, content standards), strategy rules (quarterly review), regressions/"never again" list, temporary attention points, key file locations, and documentation requirements. |
| `docs/sop-agent-workflow.md` | Standard Operating Procedures — session start/end protocols, memory tiering (Tier 1 canonical / Tier 2 strategic / Tier 3 temporary), prediction-first decision making, contradiction resolution, creative vs. operational modes, structured iteration with exit criteria, nightly review checklist. |
| `docs/prediction-log.md` | Decision prediction log — record predictions before major decisions, fill in actuals after, analyse deltas to reveal systematic biases. Pre-populated with 3 entries from today's session. |
| `docs/contradiction-log.md` | Conflicting instruction log — when rules conflict, log both sides and the resolution rather than silently choosing. Pre-populated with 3 resolved contradictions. |

**Key principles implemented:**
1. **Regressions list** (Tip 1) — 5 historical mistakes documented with prevention rules
2. **Tiered memory** (Tip 2) — Canonical/Strategic/Temporary with confidence tags
3. **Prediction log** (Tip 3) — Forces think-before-act, reveals systematic biases
4. **Nightly review** (Tip 4) — Checklist for periodic maintenance
5. **Contradiction log** (Tip 5) — Prevents silent drift from conflicting instructions
6. **Temporary attention points** (Tip 6) — Time-boxed focus items with auto-expiry
7. **Self-labelling** (Tip 7) — Fact/observation/inference/speculation tagging
8. **Creative vs. operational modes** (Tip 8) — Different rules for different work types
9. **Structured iteration** (Tip 9) — Three-round rule with exit criteria

---

## 2026-03-09 — CNY vs LNY Article: "No Single Lunar New Year" Argument

**Author:** kiki.shmoo@gmail.com

### Strengthened Calendar-System Section with Cross-Cultural Evidence

Added a new subsection **"There Is No Single 'Lunar New Year'"** to `chinese-new-year-vs-lunar-new-year.njk`, within the existing Lunisolar Calendar section. The argument: multiple civilisations maintain their own lunar or lunisolar calendars with completely different new year dates — proving "Lunar New Year" is incoherent as a collective term.

**Comparison table added (7 calendars):**

| Calendar | Type | New Year | Approximate Date |
|---|---|---|---|
| Chinese | Lunisolar | Spring Festival | Late Jan – mid Feb |
| Islamic (Hijri) | Purely lunar | 1 Muharram | Drifts (~June 2026) |
| Hebrew | Lunisolar | Rosh Hashanah | Sept – Oct |
| Hindu (Vikram Samvat) | Lunisolar | Various regional | March – April |
| Hindu (Shalivahana Saka) | Lunisolar | Ugadi / Gudi Padwa | March – April |
| Thai (Buddhist) | Lunisolar | Songkran | 13–15 April |
| Tibetan | Lunisolar | Losar | Varies |

Also updated the "Lunar New Year" bullet in "What Should You Call It?" and the first FAQ answer to reference this argument. Read time updated 10 → 12 min.

---

## 2026-03-09 — CNY vs LNY Terminology Rejection (Site-Wide)

**Author:** kiki.shmoo@gmail.com

### Editorial Voice Updated Across 4 Files

Updated all editorial-voice references to "Lunar New Year" across the site. The site's position: "Lunar New Year" is a mistranslation (lunisolar ≠ lunar) and a deliberate erasure of Chinese origin. Recommended terms: "Chinese New Year" or "Spring Festival."

**Files updated:**
- `chinese-new-year-vs-lunar-new-year.njk` — "What Should You Call It?" section rewritten, FAQ updated, overview updated
- `chinese-new-year-spring-festival.njk` — FAQ answer updated
- `spring-festival.njk` — FAQ answer updated
- `asian-new-year.njk` — FAQ answer updated

SEO keywords and factual reporting (VANK campaign documentation, regional celebration names) kept intact.

---

## 2026-03-09 — GA4 Event Tracking in site.js

**Author:** kiki.shmoo@gmail.com

### Added gtag Event Calls to All Interactive Features

Added GA4 custom event tracking to `site.js` for all user-facing interactions. Events use a `track()` helper inside the DOMContentLoaded scope (wraps `if (window.gtag) gtag(...)`) and direct `if (window.gtag)` guards in standalone IIFEs.

**Events added:**

| Event Name | Category | Trigger |
|---|---|---|
| `zodiac_calculate` | Calculator | Zodiac calculator form submit |
| `faq_open` | Engagement | FAQ accordion item opened |
| `filter_apply` | Engagement | Directory/news category filter clicked |
| `newsletter_subscribe` | Newsletter | Successful email subscription |
| `newsletter_error` | Newsletter | Failed email subscription |
| `site_search` | Search | Search query executed (includes `search_term`, `results_count`) |
| `theme_toggle` | Preferences | Dark/light mode switched |
| `compatibility_check` | Calculator | Zodiac compatibility form submit |
| `social_share` | Social | Share button clicked (Twitter, Facebook, LinkedIn, email) |
| `bazi_calculate` | Calculator | BaZi Four Pillars chart calculated |
| `bazi_error` | Calculator | BaZi calculation failed |
| `shop_filter` | Shop | Product category filter clicked |
| `language_switch` | Preferences | EN/TC/SC language toggled |
| `qr_view` | Engagement | QR code lightbox opened (donate page) |
| `popup_shown` | Popup | Exit-intent email popup displayed |
| `popup_dismissed` | Popup | Exit-intent popup closed |

All events follow the pattern established by the existing Web Vitals tracking in `base.njk`. No new dependencies added.

---

## 2026-03-09 — Content Articles: Chinese New Year Series (5 articles)

**Author:** kiki.shmoo@gmail.com

### New Articles Published

Five new articles drafted and published, forming a Chinese New Year topical cluster:

1. **Chinese New Year vs Lunar New Year** (`chinese-new-year-vs-lunar-new-year.njk`)
   - Historical names for the lunisolar new year, calendar system (lunisolar ≠ lunar), the VANK campaign (2019–present), UNESCO 2024 inscription, regional celebrations (Seollal, Tết, Losar).
   - Permalink: `/chinese-new-year-vs-lunar-new-year/`

2. **Why Red and Gold Are the Colours of Chinese New Year** (`why-red-and-gold-chinese-new-year.njk`)
   - Wu Xing colour theory, peachwood charms → red paper evolution (Han → Ming), gold/Metal element and imperial symbolism, Nian beast myth debunked, colours to avoid, modern adaptations.
   - Permalink: `/why-red-and-gold-chinese-new-year/`

3. **The Fifteen Days of Chinese New Year** (`fifteen-days-chinese-new-year.njk`)
   - Day-by-day guide: New Year's Eve through Lantern Festival, Kitchen God, God of Wealth (Day 5), Renri/Birthday of Humanity (Day 7), Jade Emperor (Day 9), Lantern Festival (Day 15). Full taboos table.
   - Permalink: `/fifteen-days-chinese-new-year/`

4. **How Chinese New Year Became a Global Celebration** (`chinese-new-year-global-celebration.njk`)
   - Migration waves (Southeast Asia, Gold Rush, Europe, modern), Chinatown celebrations worldwide, public holidays table, brand/commerce involvement, cultural bridge function.
   - Permalink: `/chinese-new-year-global-celebration/`

5. **Chinese New Year Traditions — From Firecrackers to Family Dinners** (`chinese-new-year-traditions.njk`)
   - Each major tradition traced from origin to modern form: firecrackers (bamboo → gunpowder), red envelopes (Song coins → WeChat), reunion dinner, spring couplets (peachwood → red paper), lion/dragon dances, paper-cutting, evolution timeline table.
   - Permalink: `/chinese-new-year-traditions/`

### Content Calendar Updated

- Added all 5 articles to `contentCalendar.json` as `status: "published"`.
- Articles are English-only for now; TC/SC translations to follow.
- Build verified: 302 pages written, all 5 new article URLs confirmed.

---

## 2026-03-09 — Favicon Fix, Encyclopaedia Translations, Onboarding Audit

**Author:** kiki.shmoo@gmail.com

### Favicon Updated to Match Page Logo

- **Problem:** Browser tab favicon used ivory/white (`#FAF6EF`) text on red, while the page header logo uses imperial gold (`#BF9328`) text with a gold border — visual mismatch.
- **Fix:** Updated `favicon.svg` to use gold text, gold border stroke, and semi-transparent dark overlay matching the `.logo-seal` CSS styling. Added `-2deg` rotation (`1fbdc09`) to match the page logo's `transform: rotate(-2deg)`.
- Regenerated all favicon variants: `favicon.ico`, `favicon-32.png`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png`.

### Encyclopaedia Pages — TC/SC Translations (`c7c71fe`)

- Translated 4 encyclopaedia pages to Traditional Chinese (zh-hant) and Simplified Chinese (zh-hans):
  - **TCM** (`tcm.njk`): 11 sections — foundations, qi, zangfu, meridians, herbal medicine, food therapy, diagnosis, etc.
  - **Martial Arts** (`martial-arts.njk`): 8 sections — history, external/internal styles, five elements, animal styles, medicine connection.
  - **Folk Arts** (`folk-arts.njk`): 9 sections — lion dance, dragon dance, big-head buddha, yingge, deity procession, piaose, etc.
  - **Wuxia** (`wuxia.njk`): 11 sections — origins through modern wuxia, code of xia, weapons, Jackie Chan Adventures.
- All translations follow the established three-block i18n pattern (`lang-en`, `lang-tc`, `lang-sc`).
- Build verified: 586 i18n variant pages generated, all 8 new zh-hant/zh-hans pages confirmed.

---

## 2026-03-09 — Onboarding Audit & Codebase Review

**Author:** kiki.shmoo@gmail.com

### Full Codebase Audit

- Reviewed all documentation (README, TODO, CHANGELOG, architecture.md, content-strategy.md, seo-performance.md).
- Verified build pipeline: `npm ci` + `npx @11ty/eleventy` — 297 files built in 6.47s, 0 vulnerabilities, CSS/JS minification passing, i18n generating 586 variant pages from 293 sources.
- Confirmed CI/CD workflow (`deploy.yml`) validation step is robust: page count thresholds, minification assertions, critical file checks.
- Audited content calendar: 5/11 articles published, 6 queued (next deadline: Dragon Boat Festival Apr 20 target).
- Audited TODO roadmap: 12/25 items completed, 2 CRITICAL items remaining (Facebook Pixel, GA4 conversions).
- No new code vulnerabilities (`npm audit` clean).
- No broken build issues detected.

---

## 2026-03-08 — Hero TC/SC Consistency, Language Toggle Fix, CI Hardening

**Author:** lavertenstyle@gmail.com

### Hero Section TC/SC Translation Consistency (`7e46fe7`)

- **Problem:** 20 pages using the shared `hero.njk` partial showed English-only hero sections when viewing zh-hant/zh-hans variants, while 7 pages with custom inline heroes displayed correct translations.
- Updated `hero.njk` partial to accept optional trilingual frontmatter fields (`heroTitleTc/Sc`, `heroSubtitleTc/Sc`, `heroOverlineTc/Sc`) using `<div class="lang-XX">` wrappers compatible with build-time i18n stripping.
- Added TC/SC translations to all 20 article-layout pages: zodiac, bazi, fengshui, calendar, spring-festival, wuxing, bazi-calculator, asian-new-year, folk-arts, hanfu, dynasties, taoism, qimen, yijing, tcm, martial-arts, tea-culture, wuxia, chinamaxxing, compatibility.
- **Files:** `hero.njk`, 20 page frontmatters, `architecture.md`, `TODO.md`

### Language Toggle Navigation Bug Fix (`fa707d2`)

- **Problem:** Toggling to TC/SC on one page, then clicking a nav link, showed English content with the toggle stuck in TC/SC position.
- Fixed inline language detection in `base.njk` to derive language from URL path (not localStorage).
- Added language-aware nav link rewriting in `site.js` — on `/zh-hant/` or `/zh-hans/` pages, internal nav/footer links are rewritten to preserve the language prefix.
- **Files:** `base.njk`, `site.js`, `architecture.md`, `TODO.md`

### Translation Quality Audit (`ef1a889`)

- Audited all 27 main pages for TC/SC translation quality and completeness.
- Documented findings in `content-strategy.md` section 3.2.1 with per-page status table.
- Fixed hanfu page pinyin annotations.
- Identified 7 encyclopaedia pages with absent translations and created prioritized translation queue.
- **Files:** `content-strategy.md`, `hanfu.njk`

### CI Build Validation & Security Fix (`5d0555c`)

- Fixed npm vulnerability (minimatch ReDoS) by upgrading `@11ty/eleventy` 3.1.1 to 3.1.2.
- Added "Validate build output" step to GitHub Actions `deploy.yml` — asserts page counts, minification, critical file existence, and HTML structure before deployment.
- Expanded `llms.txt` with 13 additional key URLs for AI crawler discovery.
- **Files:** `package.json`, `package-lock.json`, `deploy.yml`, `llms.txt`

---

## Historical Changes (pre-2026-03-08)

> Changes made before the current development workflow was established.
> Listed in reverse chronological order, grouped by feature.

### 2026-03-08 — Video Embeds & Article Translations

- Moved contextual video embeds inline with relevant dynasty/topic sections across 8 encyclopaedia pages.
- Added X/Twitter video embed to Hanfu page with full oEmbed markup.
- Translated top 5 articles to Traditional and Simplified Chinese.
- Updated documentation for video embed system.

### 2026-03-07 — Content Pipeline, SEO, Compatibility Pages

- Added 78 compatibility pair pages for pillar-cluster SEO architecture.
- Added 5 keyword-targeted articles and Qingming Festival article.
- Added news pagination, category archive pages, and news filters.
- Added cross-sell CTA, directory credibility improvements.
- Added CollectionPage schema to compatibility hub, categorized year pages.
- Added strategic TODO roadmap.
- Fixed hero subtitle HTML rendering, newsletter form persistence, article card clickability.
- Enabled FormSubmit spam protection on newsletter fallback.

### 2026-03-07 — Build-Time i18n URL Structure

- Added i18n URL structure with `/zh-hant/` and `/zh-hans/` paths (build-time page generation).
- Stripped trilingual bloat from generated pages, added hub-to-subpage links.
- Added README.

### 2026-03-06 — Dynasty Content, Newsletter Fix, Year Pages

- Enriched dynasty data with trilingual FAQ and breadcrumb schema fix.
- Added 121 programmatic year pages with unique astrological content.
- Translated dynasties hub page to trilingual (EN/TC/SC) with tone-marked pinyin.
- Fixed newsletter popup "Subscribing..." stuck state.
- Improved mobile donate page layout and QR code lightbox.

### 2026-03-05 — SEO Fixes, Accessibility, Content Enrichment

- Fixed 4 critical SEO/structured-data issues (BreadcrumbList, schemas).
- Resolved 5 major SEO and performance issues.
- Sanitized BaZi innerHTML injections and corrected undefined CSS variables.
- Improved accessibility: aria-expanded on FAQ/nav, reduced motion, skip-to-content link.
- Moved Readings to More dropdown; renamed "Donate" to "Support Us".
- Added Buy Me a Coffee as primary donation method with inline embed.
- Expanded Lunisolar Mechanics section, Dream of the Red Chamber content, Calendar pinyin.
- Added favicon, apple-touch-icon, and web manifest.
- Fixed nav dropdown null safety, lang attribute; added RSS feed.
- Dark mode CSS gap fixes and innerHTML XSS hardening.
- Added email capture enhancements, useful 404 page, favicon improvements.

### 2026-03-05 — Hanfu & Spring Festival Deep Content

- Added pinyin annotations to all Chinese terms on Hanfu and Spring Festival pages.
- Added Niya archaeological clothing, Joseon Wangjo Sillok evidence, qipao history.
- Added Ming Lantern Festival, Korean folk customs, Hanfu revival content.
- Fixed missing Article schema on 2026 Fire Horse article.
- Added unique OG images for all 24 zodiac and reading pages.
- Added Chiang Kai-shek/ROC qipao institutionalisation history.
- Cross-referenced Hanfu and Spring Festival content to dynasty pages.

### 2026-03-04 — Authority, Search, Comments, SEO

- Added social links, verification meta tags (Bing, Google), IndexNow, Pinterest support.
- Shortened page titles for SEO (Bing Site Scan fix).
- Fixed BreadcrumbList schema.org validation.
- Added interactive compatibility calculator with 12x12 chart.
- Redesigned trivia game with gamified UI, added trilingual support (219 questions).
- Added OG images, structured data schemas, directory URL fixes, dynamic copyright.
- Added www-to-non-www redirect for canonical domain consolidation.
- Replaced 21 Unsplash hotlinks with self-hosted WebP images.
- Added programmatic internal linking system with content graph.
- Added 15 high-value pages: 5 element + 10 dynasty sub-pages.
- Added newsletter backend (Beehiiv + Formsubmit.co fallback).
- Added client-side search with build-time JSON index.
- Added giscus-based discussion system for article pages.
- GEO optimization: answer-ready sections, HowTo schema, FAQ expansion.

### 2026-03-03 — UI Redesign, Directory, Articles

- Refined UI to ethereal paper + East Asian ink-wash aesthetic.
- Built directory with data-driven template and 33 verified listings.
- Added 16 curated video embeds from partner YouTube channels.
- Trilingual translations for calendar, spring festival, CNY influence, and hanfu pages.
- Added 4 new trilingual articles: lucky colors, zodiac chart, fire horse history, celebrity signs.
- Made article cards fully clickable with stretched link pattern.
- SEO/GEO quick wins: canonicalize URLs, Twitter handle, defer CJK fonts.
- Added Purple Mountain Observatory, Kaifeng Jews, CNY vs LNY debate content.

### 2026-03-02 — Analytics, P0 Fixes, Language Toggle

- Enabled Google Analytics 4 (G-2QWWBEW512).
- Fixed P0 issues: www/non-www redirect, CMS path, broken links, sitemap, legacy files.
- Trilingual nav/footer, SEO improvements, minification, 12 zodiac pages.
- Fixed language toggle showing all three languages simultaneously.
- Reverted nav/footer to English-only, kept language toggle for content.

### 2026-03-01 — Trilingual System & Page Translations

- Trilingual toggle (EN/TC/SC) with PayPal payments and first page translations.
- Translated all 12 reading pages (rat through pig) to TC/SC.
- Translated BaZi, Wu Xing, Feng Shui encyclopaedia pages to TC/SC.
- TC/SC translations for shop, homepage, donate, and about pages.

### 2026-02-28 — Language Toggle, SEO Batch

- Added Traditional/Simplified Chinese language toggle.
- Added FAQ schema to shop pages, breadcrumbs to readings.
- SEO fixes: heading hierarchy, title lengths, Product schema, Twitter tags.
- Updated calendar price to $3.99 and added chinesenewyear.wiki cross-links.

### 2026-02-27 — Monetization System

- Added shop, premium readings, affiliate links, AdSense integration.
- Fixed contact emails and Amazon Associates tag.
- Updated Stripe payment links.
- Fixed sidebar scrollability and moved affiliate disclosure to sidebar.
- Updated shop.json with real Gumroad product URLs.
- Enabled Google AdSense (ca-pub-8962379324362674).
- Added AdSense verification: ads.txt, meta tag, and script.

### 2026-02-26 — Design & Content Overhaul

- Major design overhaul, 217 trivia questions with timer, famous figures, video embeds.
- Transformed encyclopaedia pages to infographic style with visual components.
- Fixed broken images, layout, news font; added donation page and social embeds.
- Rewrote CNY Influence page with Chinese origins, transmission dates, de-Sinicization.
- Added Jackie Chan Adventures content to wuxia, zodiac, and homepage.
- SEO/GEO overhaul: meta descriptions, keywords, OG images, enhanced schema.
- Fixed mobile nav menu scroll.

### 2026-02-25 — Core Content Expansion

- Added zodiac readings, BaZi calculator, Asian New Year page, enhanced zodiac calculator.
- Added 4 encyclopaedia pages, expanded existing content, fixed CSS and navigation.
- Added wuxia & chinamaxxing pages, trivia game, video embeds, cross-links.

### 2026-02-24 — SSG Migration & Branding

- Converted to Eleventy SSG with Decap CMS.
- Added GitHub Actions workflow for build and deploy.
- Renamed site to "Chinese Zodiac", renamed Calendar to "Chinese Calendar", expanded 24 Solar Terms.
- Fixed GitHub Pages subpath, redesigned CSS with Tang-Song-Ming aesthetics.

### 2026-02-23 — Phase 1 & 2

- Added dark mode, Beehiiv newsletter, and social sharing.
- Added 5 encyclopaedia pages, compatibility checker, nav dropdown.

### 2026-02-22 — Initial Upload

- Initial file upload to repository.
