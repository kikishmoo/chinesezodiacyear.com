# Content Strategy: chinesezodiacyear.com

> **Last updated:** 2026-03-07
> **Scope:** 213 pages across 3 languages (English, Traditional Chinese, Simplified Chinese)
> **Editorial stance:** Pre-Qing Dynasty classical scholarship prioritized throughout

---

## Table of Contents

1. [Content Pillars](#1-content-pillars)
2. [Current Content Inventory](#2-current-content-inventory)
3. [Editorial Standards](#3-editorial-standards)
4. [Zodiac Readings Content Strategy](#4-zodiac-readings-content-strategy)
5. [Content Linking Strategy](#5-content-linking-strategy)
6. [Monetization Content](#6-monetization-content)
7. [Content Gaps & Opportunities](#7-content-gaps--opportunities)
8. [Content Production Workflow](#8-content-production-workflow)
9. [SEO Content Strategy](#9-seo-content-strategy)

---

## 1. Content Pillars

The site is organized around **7 content pillars**, each grounded in classical Chinese scholarship and supported by specific page types.

### 1.1 Chinese Zodiac

The foundational pillar. Covers the twelve-animal cycle, personality profiles, compatibility mechanics, and annual forecasts.

| Page Type | Count | Examples |
|-----------|-------|---------|
| Zodiac hub | 1 | `/zodiac/` |
| Animal profiles | 12 | `/zodiac/rat/` through `/zodiac/pig/` |
| Compatibility checker | 1 | `/compatibility/` |
| Zodiac calculator | 1 | `/zodiac/` (integrated widget) |
| Year chart article | 1 | `/articles/zodiac-years-chart/` |
| 2026 yearly readings | 12 | `/readings/2026-rat/` through `/readings/2026-pig/` |
| Year pages | 121 | `/zodiac-year/1924/` through `/zodiac-year/2044/` |

**Priority sources:** Sima Qian's *Shiji* (史記) for the Earthly Branches origin; *Huainanzi* (淮南子) for seasonal-animal correspondences.

### 1.2 BaZi / Four Pillars (八字)

Chinese destiny calculation based on the Four Pillars of birth year, month, day, and hour.

| Page Type | Count | Examples |
|-----------|-------|---------|
| BaZi hub | 1 | `/bazi/` |
| BaZi calculator | 1 | `/bazi-calculator/` (integrates with Cloudflare Worker at `/worker/`) |
| Guide article | 1 | `/articles/bazi-four-pillars-guide/` |

**Priority sources:** *San Ming Tong Hui* (三命通會) by Wan Minying (Ming dynasty); Xu Ziping's Song-era Day Pillar methodology.

### 1.3 Feng Shui (風水)

Spatial harmony and geomantic practices rooted in classical Form School and Compass School traditions.

| Page Type | Count | Examples |
|-----------|-------|---------|
| Feng shui hub | 1 | `/fengshui/` |
| 2026 guide article | 1 | `/articles/feng-shui-2026-guide/` |
| Qi Men Dun Jia page | 1 | `/qimen/` |

**Priority sources:** *Zangshu* (葬書) attributed to Guo Pu (Jin dynasty); *Kaogong Ji* (考工記) for spatial planning principles.

### 1.4 Chinese Calendar & Seasons

The lunisolar calendar system, Lichun dates, and year-by-year reference pages.

| Page Type | Count | Examples |
|-----------|-------|---------|
| Calendar hub | 1 | `/calendar/` |
| Calendar guide article | 1 | `/articles/chinese-calendar-explained/` |
| Year pages (data-generated) | 121 | `/zodiac-year/1924/` through `/zodiac-year/2044/` |

Year pages are generated from `src/_data/zodiacYears.js` via the pagination template `src/year-pages.njk`. Each page includes the animal, element, Heavenly Stem/Earthly Branch designation, and Lichun date for that year.

**Priority sources:** *Huainanzi* (淮南子) for solar term definitions; Tang dynasty *Linde Calendar* methodology; Yuan dynasty *Shoushi Calendar* (授時曆) by Guo Shoujing.

### 1.5 Wu Xing / Five Elements (五行)

The five-phase cosmological system: Wood, Fire, Earth, Metal, Water.

| Page Type | Count | Examples |
|-----------|-------|---------|
| Wu Xing hub | 1 | `/wuxing/` |
| Element sub-pages | 5 | `/wuxing/wood/`, `/wuxing/fire/`, `/wuxing/earth/`, `/wuxing/metal/`, `/wuxing/water/` |

Each element sub-page includes: direction, season, color, yin/yang organ correspondences, planet, taste, emotion, generating/overcoming cycle relationships, and associated zodiac animals. Data is sourced from `src/_data/elements.json`.

**Priority sources:** *Huangdi Neijing* (黃帝內經) for organ correspondences; *Shangshu Hongfan* (尚書洪範) for elemental definitions; *Lushi Chunqiu* (呂氏春秋) for Earth's central role.

### 1.6 Dynasties & History

Ten dynasties from Xia through Ming, covering the full span of pre-Qing classical Chinese civilization.

| Page Type | Count | Examples |
|-----------|-------|---------|
| Dynasties hub | 1 | `/dynasties/` |
| Dynasty sub-pages | 10 | `/dynasties/xia/`, `/dynasties/shang/`, `/dynasties/zhou/`, `/dynasties/qin/`, `/dynasties/han/`, `/dynasties/sui/`, `/dynasties/tang/`, `/dynasties/song/`, `/dynasties/yuan/`, `/dynasties/ming/` |

Dynasty sub-pages are generated from `src/_data/dynastiesData.json` via `src/dynasty-pages.njk`. Each entry includes trilingual descriptions, key contributions, and cross-linked related content sections (e.g., Shang links to Hanfu page, Qin links to Wu Xing page, Song links to BaZi).

**Editorial boundary:** The dynasty timeline deliberately ends at Ming (1368-1644). The site prioritizes pre-Qing classical scholarship; Qing and later periods are out of scope for the dynasty pillar.

### 1.7 Cultural Topics

Standalone encyclopedia pages covering traditional Chinese cultural subjects.

| Page | URL |
|------|-----|
| Spring Festival | `/spring-festival/` |
| Tea Culture | `/tea-culture/` |
| Hanfu & Silk Road | `/hanfu/` |
| Martial Arts | `/martial-arts/` |
| Wuxia | `/wuxia/` |
| Folk Arts | `/folk-arts/` |
| Traditional Chinese Medicine | `/tcm/` |
| Taoism | `/taoism/` |
| Yi Jing (Book of Changes) | `/yijing/` |
| Chinamaxxing | `/chinamaxxing/` |

Each page is a single long-form encyclopedia entry with trilingual content. These pages serve as topical authorities and link outward to related pillars (e.g., TCM links to Wu Xing, Taoism links to Yi Jing, Martial Arts links to Wuxia and Dynasties).

---

## 2. Current Content Inventory

### 2.1 Summary Table

| Content Type | Count | Source Location |
|-------------|-------|-----------------|
| Encyclopedia/utility pages | 34 | `src/pages/*.njk` |
| Zodiac animal profiles | 12 | `src/zodiac/*.njk` |
| 2026 yearly readings | 12 | `src/readings/2026-*.njk` |
| Long-form articles | 16 | `src/articles/*.njk` |
| Year pages (data-generated) | 121 | `src/year-pages.njk` + `zodiacYears.js` |
| Wu Xing element sub-pages | 5 | `src/wuxing-pages.njk` + `elements.json` |
| Dynasty sub-pages | 10 | `src/dynasty-pages.njk` + `dynastiesData.json` |
| Trivia quiz questions | 219 | `src/trivia.js` (15 topic sections, trilingual) |
| **Total estimated pages** | **~213** | *Includes feed, sitemap, search-index* |

### 2.2 Encyclopedia Pages (34 files in `src/pages/`)

**Hub/navigation pages:**
- `index.njk` (homepage), `zodiac.njk`, `bazi.njk`, `fengshui.njk`, `wuxing.njk`, `dynasties.njk`, `readings.njk`, `calendar.njk`, `compatibility.njk`

**Cultural topic pages:**
- `spring-festival.njk`, `tea-culture.njk`, `hanfu.njk`, `martial-arts.njk`, `wuxia.njk`, `folk-arts.njk`, `tcm.njk`, `taoism.njk`, `yijing.njk`, `chinamaxxing.njk`, `qimen.njk`

**Tool/interactive pages:**
- `bazi-calculator.njk`, `search.njk`

**Commerce/utility pages:**
- `shop.njk`, `premium-readings.njk`, `readings-thank-you.njk`, `directory.njk`, `donate.njk`, `about.njk`, `affiliate-disclosure.njk`, `404.njk`

**News/content aggregation:**
- `news.njk` (with client-side category filters, URL hash support, and no-results fallback), `news-category.njk`, `asian-new-year.njk`, `asian-new-year-redirect.njk`

### 2.3 Long-Form Articles (16)

| Article | Slug | Category Focus |
|---------|------|----------------|
| 2026 Fire Horse Year | `article-2026-horse` | Yearly outlook |
| BaZi Four Pillars Guide | `bazi-four-pillars-guide` | BaZi education |
| Celebrity Chinese Zodiac Signs | `celebrity-chinese-zodiac-signs` | Zodiac entertainment |
| Chinese Calendar Explained | `chinese-calendar-explained` | Calendar reference |
| Chinese New Year / Spring Festival | `chinese-new-year-spring-festival` | Cultural festival |
| Chinese Zodiac Compatibility Guide | `chinese-zodiac-compatibility-guide` | Zodiac relationships |
| Feng Shui 2026 Guide | `feng-shui-2026-guide` | Feng shui yearly |
| Fire Horse 1966 & 2026 | `fire-horse-1966-2026` | Historical/cultural |
| Lucky Colors & Numbers 2026 | `lucky-colors-numbers-2026` | Yearly outlook |
| Zodiac Years Chart | `zodiac-years-chart` | Reference/utility |
| Chinese Zodiac Elements Guide | `chinese-zodiac-elements-guide` | Zodiac/Wu Xing |
| Heavenly Stems & Earthly Branches | `heavenly-stems-earthly-branches` | Culture/calendar |
| Chinese Zodiac Personality Traits | `chinese-zodiac-personality-traits` | Zodiac profiles |
| Feng Shui Bedroom Guide | `feng-shui-bedroom-guide` | Feng shui practical |
| BaZi Reading Guide | `bazi-reading-guide` | BaZi education |
| Qingming Festival Guide | `qingming-festival-guide` | Culture/festival |

### 2.4 Trivia Quiz (219 Questions, 15 Sections)

All questions are trilingual (English, Traditional Chinese, Simplified Chinese) with explanatory answers.

| Section | Question Count |
|---------|---------------|
| Zodiac | 20 |
| Wu Xing / Five Elements | 15 |
| Dynasties | 25 |
| Calendar & Astronomy | 18 |
| Feng Shui | 15 |
| BaZi | 12 |
| Spring Festival | 15 |
| Literature & Philosophy | 20 |
| Martial Arts | 15 |
| Wuxia | 12 |
| Folk Arts | 12 |
| Tea Culture | 10 |
| Daoism & Yi Jing | 12 |
| TCM | 10 |
| Hanfu & Cultural Identity | 8 |

### 2.5 Directory

`src/_data/directory.json` contains **33 professional listings** across categories: feng shui organisations, education providers, practitioners, and cultural resources. Listings include name, category, badge type, location, specialties, description, and URL.

---

## 3. Editorial Standards

### 3.1 Source Hierarchy: Pre-Qing Classical Texts

All content prioritizes pre-Qing Dynasty (before 1644) classical scholarship. The following texts form the canonical reference library:

| Text | Chinese | Period | Primary Use |
|------|---------|--------|-------------|
| Shiji | 史記 | Han (c. 94 BCE) | Zodiac origins, Earthly Branches, historical chronology |
| Huangdi Neijing | 黃帝內經 | Han (compiled) | Wu Xing organ correspondences, TCM foundations |
| Zangshu | 葬書 | Jin (c. 300 CE) | Feng shui Form School principles |
| Yi Jing | 易經 | Zhou (c. 1000 BCE) | Divination framework, trigram cosmology |
| Huainanzi | 淮南子 | Han (139 BCE) | Solar terms, seasonal-animal correspondences |
| Kaogong Ji | 考工記 | Zhou (c. 500 BCE) | Spatial planning, craft cosmology |
| San Ming Tong Hui | 三命通會 | Ming (1550) | BaZi codification, destiny calculation |
| Shuo Wen Jie Zi | 說文解字 | Han (100 CE) | Character etymology for terminology |
| Dao De Jing | 道德經 | Zhou (c. 400 BCE) | Taoist philosophy, Water element metaphor |
| Shangshu Hongfan | 尚書洪範 | Zhou | Five element definitions (Wood, Fire, Earth, Metal, Water) |
| Lushi Chunqiu | 呂氏春秋 | Qin (c. 239 BCE) | Earth element's central mediating role |

**Guideline:** When citing sources, always reference the text name in English, Chinese characters, and the dynasty/period. Example: "As recorded in the *Shiji* (史記, Han dynasty)..."

### 3.2 Trilingual Parity

Every piece of content must exist in all three languages:

- **English** (en) -- primary authoring language
- **Traditional Chinese** (繁體中文, zh-Hant) -- for Taiwan, Hong Kong, Macau audiences
- **Simplified Chinese** (简体中文, zh-Hans) -- for mainland China, Singapore audiences

Language configuration is defined in `src/_data/languages.json`:
```json
{
  "en": { "hreflang": "en", "label": "English" },
  "tc": { "hreflang": "zh-Hant", "label": "繁體中文" },
  "sc": { "hreflang": "zh-Hans", "label": "简体中文" }
}
```

**Implementation:** Content blocks use CSS classes `lang-en`, `lang-tc`, `lang-sc` for client-side language switching. All three versions exist in the same HTML document (not separate URLs), toggled via a language selector in the header.

### 3.3 Terminology Pattern

All Chinese terminology follows the pattern: **English name (Chinese characters, pinyin)**

Examples:
- "BaZi (八字, Ba Zi) -- the Four Pillars of Destiny"
- "Wu Xing (五行, Wu Xing) -- the Five Elements"
- "Ben Ming Nian (本命年, Ben Ming Nian) -- birth zodiac year"
- "San He (三合, San He) -- Zodiac Harmony Triangle"
- "Liu He (六合, Liu He) -- Secret Friend pairing"

This pattern serves both accessibility (English readers learn the Chinese terms) and SEO (Chinese character searches land on the page).

### 3.4 E-E-A-T Compliance

To satisfy Google's Experience, Expertise, Authoritativeness, and Trustworthiness signals:

- **Cite classical sources** by name, dynasty, and author where known
- **Distinguish scholarly tradition from folk superstition** -- e.g., the Fire Horse (丙午) birth superstition is presented with its sociological context (Japan's 1966 birth rate drop) alongside the classical BaZi framework
- **Avoid unverifiable claims** -- present astrological concepts as traditional cultural frameworks, not as scientific predictions
- **Cross-reference across pillars** -- a claim about Wu Xing on the Zodiac page should be consistent with the Wu Xing hub page
- **Attribution on controversial claims** -- e.g., the Dream of the Red Chamber authorship debate on the Ming dynasty page is presented with both the Zhu Cizhao claim and the scholarly consensus (Cao Xueqin)

### 3.5 Content Block Structure

Every content page uses the following trilingual block pattern:

```html
<div class="lang-en">
  <h2>Section Title</h2>
  <p>English content with <strong>BaZi (八字, Ba Zi)</strong> terminology inline.</p>
</div>
<div class="lang-tc">
  <h2>段落標題</h2>
  <p>繁體中文內容。</p>
</div>
<div class="lang-sc">
  <h2>段落标题</h2>
  <p>简体中文内容。</p>
</div>
```

---

## 4. Zodiac Readings Content Strategy

The 12 yearly readings for 2026 (the Fire Horse year, Bing Wu 丙午) demonstrate the site's distinctive content approach: combining universal forecast sections with a **unique Five-Phase analysis section per animal** based on that animal's specific cosmological relationship with the year's ruling energy.

### 4.1 Common Sections (All 12 Readings)

Every reading follows this structure (visible in the `toc` frontmatter of each reading file):

1. **Year Overview** -- the animal's general position in 2026
2. **[Unique Five-Phase Section]** -- see 4.2 below
3. **Career & Finance** -- professional and financial outlook
4. **Love & Relationships** -- romantic and interpersonal forecast
5. **Health & Wellness** -- physical and mental health guidance
6. **Lucky Items** -- colors, numbers, directions, gemstones
7. **Monthly Forecast Table** -- month-by-month outlook
8. **FAQ** -- generates FAQPage JSON-LD schema for rich results

### 4.2 Unique Five-Phase Sections

Each animal's unique section is determined by its Earthly Branch relationship with Wu (午, Horse) and its elemental relationship with Bing-Fire (丙). This is what differentiates each reading from generic horoscope content.

| Animal | Earthly Branch | Unique Section | Classical Basis |
|--------|---------------|----------------|-----------------|
| **Rat** | Zi (子) | Zi-Wu Clash (子午沖) -- supreme axis opposition | The Zi-Wu axis is the most fundamental polarity in Chinese cosmology. Water (Rat) confronts Fire (Horse) across the cardinal north-south line. |
| **Ox** | Chou (丑) | Fire Generates Earth -- productive cycle | 2026 Fire feeds the Ox's Earth nature through the sheng (生) generating cycle. Expect nourishment and steady growth. |
| **Tiger** | Yin (寅) | San He Fire Triangle initiator (寅午戌三合) | Tiger is the initiator of the Yin-Wu-Xu Fire Triangle. In 2026, the Triangle is activated at its peak (Wu), amplifying Tiger's Fire affinity. |
| **Rabbit** | Mao (卯) | Wood Feeds Fire -- giving/draining cycle | Rabbit's Wood energy feeds 2026's Fire through the generating cycle, but from the giving position -- productive yet potentially draining. |
| **Dragon** | Chen (辰) | Three-element advantage | Dragon's Earth Branch, combined with its inherent Water reservoir and Wood-feeding capacity, gives it a unique multi-elemental position relative to Fire. |
| **Snake** | Si (巳) | Si-Wu Liu He Bond (巳午六合) -- secret friend | Snake and Horse are Liu He (secret friend) partners. 2026 activates this intimate bond, making it the most harmonious year for Snake since 2014. |
| **Horse** | Wu (午) | Ben Ming Nian (本命年) -- birth year | 2026 is Horse's own zodiac year. Tradition holds that "offending Tai Sui" (犯太歲) brings both risk and opportunity. Red garments recommended. |
| **Goat** | Wei (未) | Wu-Wei Liu He Bond (午未六合) -- secret friend | Horse and Goat are Liu He partners. Like Snake, Goat benefits from the intimate six-harmony bond with the year's ruling animal. |
| **Monkey** | Shen (申) | Fire Controls Metal -- overcoming cycle | 2026 Fire overcomes Monkey's Metal nature through the ke (克) controlling cycle. Pressure and external challenge are the defining themes. |
| **Rooster** | You (酉) | Bing-Xin Heavenly Stem combination | The Heavenly Stem Bing (丙, yang Fire) combines with Rooster's hidden stem Xin (辛, yin Metal) in the Bing-Xin heavenly combination -- a subtle alchemical bond. |
| **Dog** | Xu (戌) | San He Fire Triangle storage (寅午戌三合) | Dog is the storage position of the Yin-Wu-Xu Fire Triangle. In 2026, Dog consolidates and preserves the Fire energy generated this year. |
| **Pig** | Hai (亥) | Water Meets Fire -- controlling position | Pig's Water energy is in the controlling position over 2026's Fire. This grants strategic advantage but also the risk of overextension. |

### 4.3 Reading Content Approach

Each unique section:
- References **specific classical texts** (e.g., the Rat reading cites the Zi-Wu axis from cosmological models documented in the *Huainanzi*)
- Includes **Chinese characters and pinyin** for all technical terms
- Provides **practical advice** grounded in the theoretical framework
- Links to related pages (the animal's profile page, the Wu Xing hub, the BaZi calculator)

### 4.4 Reading File Structure

Each reading is a standalone `.njk` file in `src/readings/` with frontmatter including:
- `layout: "layouts/article.njk"`
- `animal`, `year`, `category: "readings"`
- `breadcrumbs` array (Home > Readings > 2026 [Animal])
- `toc` array for in-page navigation
- `faq` array for FAQ schema generation
- `relatedArticles` for sidebar links

---

## 5. Content Linking Strategy

### 5.1 Content Graph

`src/_data/contentGraph.json` defines the relationship topology of the entire site. It contains:

- **topicAffinity** -- maps each hub URL to an ordered list of related topic slugs (22 pages mapped)
- **zodiacAnimals** -- canonical ordering of the 12 animals
- **sanHe** -- the four Zodiac Harmony Triangles (三合)
- **liuHe** -- the six Secret Friend pairings (六合)
- **pageLabels** -- display labels for each hub URL (used in auto-generated link text)

Example affinity mapping:
```
"/zodiac/": ["bazi", "wuxing", "compatibility", "calendar", "readings"]
"/bazi/":   ["zodiac", "wuxing", "calendar", "compatibility", "yijing", "qimen"]
"/wuxing/": ["bazi", "zodiac", "fengshui", "tcm", "calendar", "yijing"]
```

### 5.2 Auto-Generated Links via eleventyComputed.js

`src/_data/eleventyComputed.js` automatically generates contextual "Related" and "Continue Exploring" links for every page at build time. The logic varies by page type:

| Page Type | Link Logic |
|-----------|-----------|
| **Zodiac animal pages** (`/zodiac/{animal}/`) | Links to: this animal's 2026 reading, San He allies, Liu He friend, recent year pages, zodiac hub, compatibility, Wu Xing, BaZi calculator |
| **Reading pages** (`/readings/2026-{animal}/`) | Links to: this animal's profile page, San He allies' readings, all readings hub, BaZi calculator, Wu Xing |
| **Element sub-pages** (`/wuxing/{element}/`) | Links to: Wu Xing hub, BaZi, TCM, Zodiac, Feng Shui |
| **Dynasty sub-pages** (`/dynasties/{dynasty}/`) | Links to: Dynasties hub, Calendar, Zodiac, BaZi, Hanfu, Spring Festival |
| **Year pages** (`/zodiac-year/{year}/`) | Links to: this animal's profile, 2026 reading, adjacent years, same-animal years (+/-12), zodiac hub, compatibility, Wu Xing, BaZi calculator |
| **Encyclopedia pages** | Uses topicAffinity from contentGraph.json |
| **Article pages** | Uses category-based mapping (zodiac, culture, fengshui, bazi, business) |

### 5.3 Linking Hierarchy

```
Hub Pages (zodiac, wuxing, dynasties, readings)
    |
    +--> Sub-pages (animal profiles, element pages, dynasty pages, reading pages)
    |        |
    |        +--> Cross-links to related topics (via contentGraph affinity)
    |        |
    |        +--> Back-links to parent hub
    |
    +--> Articles (long-form, linked from hubs and sub-pages)
             |
             +--> Sidebar related links (relatedArticles frontmatter)
             +--> Auto-generated "Continue Exploring" grid (eleventyComputed)
```

### 5.4 Navigation Components

- **Breadcrumbs** (`src/_includes/partials/breadcrumbs.njk`) -- present on every article page, generates BreadcrumbList JSON-LD
- **Article layout** (`src/_includes/layouts/article.njk`) -- includes sidebar related links, content grid, FAQ section, content upgrade CTA, and share buttons
- **Related content grid** -- rendered inline at the bottom of article content using either `autoRelated` (computed) or `relatedArticles` (manual frontmatter)

---

## 6. Monetization Content

### 6.1 Premium Readings (Service Tiers)

Three tiers defined in `src/_data/shop.json`, fulfilled via PayPal:

| Tier | Price | Deliverable | Delivery |
|------|-------|-------------|----------|
| **Basic** | $29 | 5-page PDF: zodiac profile + birth element + 2026 outlook | 3-5 business days |
| **Detailed** | $79 | 20-page PDF + 15-min video: full Four Pillars chart, Day Master, Ten Gods, Five Elements balance, career/relationship insights | 5-7 business days |
| **Comprehensive** | $149 | 40-page PDF + 30-min video consultation: everything in Detailed + compatibility analysis, feng shui recommendations, lucky directions, 10-year forecast | 7-10 business days |

Presented on `/premium-readings/` with trilingual descriptions.

### 6.2 Digital Products (6 Products)

Sold via Gumroad, listed in `src/_data/shop.json`:

| Product | Price | Type |
|---------|-------|------|
| 2026 Fire Horse Annual Forecast | $9.99 | All 12 animal forecasts + monthly breakdowns + lucky dates |
| Ultimate Zodiac Compatibility Guide | $14.99 | 144 pairing analyses with scores and advice |
| BaZi Starter Kit | $19.99 | Beginner guide + worksheets + reference charts |
| Feng Shui Home Checklist | $12.99 | Room-by-room guide + Bagua map + cure recommendations |
| Chinese Calendar 2026-2027 | $3.99 | Auspicious dates + lunar phases + festival reminders |
| Five Elements Balance Workbook | $16.99 | Self-assessment quiz + balance exercises + seasonal guide |

**Price range:** $3.99 - $19.99

### 6.3 Content Upgrade CTAs

`src/_includes/partials/content-upgrade.njk` is embedded in every article page via the article layout. Current offer: "Free: 2026 Zodiac Compatibility Chart" -- captures email via Beehiiv form with `utm_medium=content_upgrade` tracking.

### 6.4 Cross-Sell CTA

`src/_includes/partials/cross-sell-cta.njk` is auto-included after the main content (before FAQ) in all pages using the `article.njk` layout. Displays a two-card layout:

- **Reading card** -- drives to `/readings/` (from $29) with UTM tracking
- **Product card** -- drives to `/shop/` with UTM tracking

Supports a `variant` variable ("reading", "product", or "both" default). Opt-out via `crossSellHidden: true` in frontmatter. Fully trilingual.

### 6.5 Newsletter

- **Platform:** Beehiiv (publication ID: `9e7042b6-5250-429a-8f20-97b63322cd64`)
- **Capture points:** content upgrade CTA (inline in articles), newsletter partial (footer/sidebar), exit-intent popup (`src/_includes/partials/email-popup.njk`)
- **Lead magnet:** 2026 Zodiac Compatibility Chart download

### 6.6 Professional Directory

`src/_data/directory.json` contains **33 listings** of feng shui organisations, education providers, and practitioners. Displayed at `/directory/`. Three featured listings are verified real organisations (Kerby Kuek, SA Academy of Chinese Metaphysics, Yo San University). Currently no paid tier -- all listings are free.

### 6.7 Display Advertising & Affiliate

- **Google AdSense** enabled (publisher ID: `ca-pub-8962379324362674`), with ad unit partial at `src/_includes/partials/ad-unit.njk`
- **Amazon Associates** affiliate tag: `kikigreene-20`, with disclosure partial at `src/_includes/partials/affiliate-disclosure.njk`
- `ads.txt` file present at `src/ads.txt`

---

## 7. Content Gaps & Opportunities

### 7.1 High Priority

| Gap | Impact | Recommendation | Effort |
|-----|--------|----------------|--------|
| **No readings for years beyond 2026** | Limits annual traffic renewal; users searching "2027 zodiac" will find nothing | Create 2027 Fire Goat (Ding Wei 丁未) readings using same template structure. Begin authoring Q3 2026 for January 2027 launch. | HIGH -- 12 new reading pages + unique Five-Phase sections |
| **No per-pair compatibility pages** | `/compatibility/` is a single page covering all pairings; misses long-tail SEO for "Rat and Horse compatibility" queries | Create 66 unique compatibility pair pages (or start with the 12 most-searched pairings). Each page would cover San He, Liu He, and Six Clashes analysis for the pair. | HIGH -- 12-66 new pages |
| **Cultural topic pages lack depth** | Pages like `/hanfu/`, `/martial-arts/`, `/tea-culture/` are single encyclopedia entries without sub-pages | Expand top-traffic cultural pages into pillar structures with sub-pages (e.g., `/hanfu/tang-dynasty/`, `/tea-culture/gongfu-ceremony/`, `/martial-arts/tai-chi/`) | MEDIUM -- 3-5 sub-pages per expanded topic |

### 7.2 Medium Priority

| Gap | Impact | Recommendation | Effort |
|-----|--------|----------------|--------|
| **No regular publishing cadence** | All articles are evergreen; no blog/news rhythm for freshness signals | Establish a monthly article cadence tied to lunar calendar events (monthly zodiac energy shifts, solar terms, festival prep guides). Leverage the news page infrastructure (`/news/`, `/news-category/`) that already exists but has no content. | MEDIUM |
| **Year pages (1924-2044) are thin** | Data-generated pages with zodiac/element info but no historical context | Enrich year pages with notable historical events, celebrity births, and cultural milestones for that year. Start with years within living memory (1940-2025). | MEDIUM -- data enrichment in zodiacYears.js |
| **Directory has no monetization** | 33 listings with no revenue model | Introduce a paid featured listing tier ($49-99/year) with enhanced visibility, backlink, and badge. Grow directory to 50+ listings before launching paid tier. | LOW |

### 7.3 Lower Priority / Exploratory

| Gap | Impact | Recommendation | Effort |
|-----|--------|----------------|--------|
| **Trivia game could expand** | 219 questions across 15 categories is solid but could grow | Add questions for new cultural events, celebrity zodiac facts, and seasonal content. Target 300+ questions. Consider a "daily question" feature tied to the newsletter. | LOW |
| **No user-generated content strategy** | Comments exist via Giscus (GitHub Discussions) but no community contribution model | Explore user-submitted birth chart interpretations, compatibility stories, or cultural experience posts. Moderation overhead is the primary concern. | LOW |
| **No video content strategy** | Premium readings include video but no public video content | Create short-form zodiac explainer videos for TikTok/YouTube Shorts. The social accounts (Instagram, Facebook, X) exist but lack content integration. | MEDIUM |
| **Asian New Year redirect pages exist but lack content** | `asian-new-year.njk` and `asian-new-year-redirect.njk` suggest planned content | Develop an "Asian New Year" comparison page covering Chinese, Korean, Vietnamese, and Tibetan celebrations. Good for GEO capture. | LOW |

---

## 8. Content Production Workflow

### 8.1 CMS-Based Editing

- **Decap CMS** (formerly Netlify CMS) is configured at `/admin/` (`src/admin/config.yml` + `src/admin/index.html`)
- Editors authenticate via GitHub and edit content through a visual interface
- Changes commit directly to the repository

### 8.2 Manual Workflow (Primary)

For most content, the workflow is:

1. **Create** a new `.njk` file with YAML frontmatter (title, description, keywords, permalink, category, breadcrumbs, toc, faq, relatedArticles)
2. **Write** trilingual content blocks using `lang-en`, `lang-tc`, `lang-sc` CSS class pattern
3. **Add** Chinese characters + pinyin for all terminology following the "English (漢字, Pinyin)" pattern
4. **Cite** classical sources with text name, Chinese characters, and dynasty
5. **Commit and push** to `main` branch
6. **GitHub Actions** auto-builds with Eleventy and deploys

### 8.3 Data-Driven Pages

For paginated content (year pages, dynasty pages, element pages):

1. **Add/edit data** in the relevant JSON file (`zodiacYears.js`, `dynastiesData.json`, `elements.json`)
2. **Pagination template** (`year-pages.njk`, `dynasty-pages.njk`, `wuxing-pages.njk`) automatically generates pages
3. **11tydata.js** files (`dynasty-pages.11tydata.js`, `wuxing-pages.11tydata.js`) provide computed data per generated page
4. Push triggers rebuild with new/updated pages

### 8.4 Content Quality Checklist

Before publishing any new content:

- [ ] All three language versions are complete and consistent
- [ ] Chinese characters + pinyin included for all specialist terminology
- [ ] At least one classical source cited per major claim
- [ ] Folk beliefs/superstitions clearly distinguished from classical scholarship
- [ ] FAQ section included (minimum 2 questions) for FAQPage schema
- [ ] Breadcrumbs array defined in frontmatter
- [ ] Related articles or category specified for auto-linking
- [ ] Meta title under 60 characters, meta description under 160 characters
- [ ] OG image specified or default applied

---

## 9. SEO Content Strategy

### 9.1 On-Page SEO

Every page includes in its frontmatter:
- **title** -- unique, keyword-targeted, under 60 characters
- **description** -- unique meta description, under 160 characters
- **keywords** -- comma-separated target keywords
- **ogType** -- typically "article" for content pages
- **ogImage** -- custom Open Graph image per page (stored in `src/img/og/`)

### 9.2 Structured Data (JSON-LD)

| Schema Type | Where Applied | Purpose |
|-------------|---------------|---------|
| **FAQPage** | Every page with a `faq` frontmatter array | Rich FAQ results in search; each Q&A pair becomes a collapsible result |
| **BreadcrumbList** | Every article page (via `breadcrumbs.njk` partial) | Breadcrumb trail in search results |
| **Article** | Content pages using `article.njk` layout | Article rich results with author, date, description |

### 9.3 Hreflang & Multilingual SEO

The sitemap (`src/sitemap.njk`) includes hreflang annotations for all three language variants:
- `hreflang="en"` -- English (default)
- `hreflang="zh-Hant"` -- Traditional Chinese
- `hreflang="zh-Hans"` -- Simplified Chinese

Since all three languages exist on the same URL (client-side toggled), hreflang serves as a signal to search engines that the page serves all three language audiences.

### 9.4 Generative Engine Optimization (GEO)

The `robots.txt` explicitly **allows** all major AI crawlers:

```
User-agent: GPTBot          # OpenAI
User-agent: Google-Extended  # Google AI
User-agent: CCBot            # Common Crawl
User-agent: anthropic-ai     # Anthropic
User-agent: PerplexityBot    # Perplexity
User-agent: Bytespider       # ByteDance
Allow: /
```

**Rationale:** By allowing AI crawlers, the site's authoritative classical-source content can appear in AI-generated answers, driving referral traffic from ChatGPT, Perplexity, Google AI Overviews, and similar generative search products. The site's E-E-A-T compliance and source citations make it a preferred citation target for AI systems.

### 9.5 Client-Side Search Index

`src/search-index.njk` generates a JSON search index at build time containing:
- Page title, URL, description
- **500-character body text excerpts** per page
- Used by the client-side search at `/search/` for instant results without a server

### 9.6 SEO Content Recommendations

| Action | Priority | Expected Impact |
|--------|----------|-----------------|
| **Create 2027 readings by Q3 2026** | CRITICAL | Capture "2027 zodiac" search intent before Chinese New Year 2027 (Feb 6, 2027). Historical pattern: zodiac year searches spike 8-12 weeks before Lunar New Year. |
| **Build per-pair compatibility pages** | HIGH | Long-tail keywords like "Rat and Horse compatibility" have low competition and high commercial intent. Start with the 6 clash pairs (highest search volume). |
| **Expand FAQ sections** | MEDIUM | Every additional FAQ pair is a potential featured snippet. Target 4-6 questions per page, with questions matching "People Also Ask" queries. |
| **Publish monthly solar term content** | MEDIUM | 24 solar terms per year = 24 content opportunities. Each solar term post can link to calendar, Wu Xing, TCM, and seasonal feng shui advice. |
| **Enrich year pages with historical context** | MEDIUM | Thin data-generated pages risk being flagged as low-value. Adding 200-300 words of historical context per year page differentiates them from competing zodiac year calculators. |
| **Create video transcripts as standalone pages** | LOW | If video content is produced for premium readings or social media, publish transcripts as searchable pages to capture voice-search and long-tail queries. |

---

## Appendix: Content Architecture Map

```
chinesezodiacyear.com
|
+-- / (homepage)
|
+-- /zodiac/                    [HUB: 12 animal profiles]
|   +-- /zodiac/rat/
|   +-- /zodiac/ox/
|   +-- ... (12 animals)
|
+-- /readings/                  [HUB: 12 yearly readings]
|   +-- /readings/2026-rat/
|   +-- /readings/2026-ox/
|   +-- ... (12 readings)
|
+-- /wuxing/                    [HUB: 5 element sub-pages]
|   +-- /wuxing/wood/
|   +-- /wuxing/fire/
|   +-- /wuxing/earth/
|   +-- /wuxing/metal/
|   +-- /wuxing/water/
|
+-- /dynasties/                 [HUB: 10 dynasty sub-pages]
|   +-- /dynasties/xia/
|   +-- /dynasties/shang/
|   +-- ... (10 dynasties, Xia through Ming)
|
+-- /zodiac-year/               [121 data-generated year pages]
|   +-- /zodiac-year/1924/
|   +-- ...
|   +-- /zodiac-year/2044/
|
+-- /bazi/                      [Encyclopedia]
+-- /bazi-calculator/           [Interactive tool]
+-- /fengshui/                  [Encyclopedia]
+-- /calendar/                  [Encyclopedia]
+-- /compatibility/             [Interactive tool]
+-- /spring-festival/           [Cultural topic]
+-- /tea-culture/               [Cultural topic]
+-- /hanfu/                     [Cultural topic]
+-- /martial-arts/              [Cultural topic]
+-- /wuxia/                     [Cultural topic]
+-- /folk-arts/                 [Cultural topic]
+-- /tcm/                       [Cultural topic]
+-- /taoism/                    [Cultural topic]
+-- /yijing/                    [Cultural topic]
+-- /chinamaxxing/              [Cultural topic]
+-- /qimen/                     [Cultural topic]
|
+-- /articles/                  [16 long-form articles]
|   +-- article-2026-horse
|   +-- bazi-four-pillars-guide
|   +-- celebrity-chinese-zodiac-signs
|   +-- chinese-calendar-explained
|   +-- chinese-new-year-spring-festival
|   +-- chinese-zodiac-compatibility-guide
|   +-- feng-shui-2026-guide
|   +-- fire-horse-1966-2026
|   +-- lucky-colors-numbers-2026
|   +-- zodiac-years-chart
|   +-- chinese-zodiac-elements-guide
|   +-- heavenly-stems-earthly-branches
|   +-- chinese-zodiac-personality-traits
|   +-- feng-shui-bedroom-guide
|   +-- bazi-reading-guide
|   +-- qingming-festival-guide
|
+-- /shop/                      [Digital products]
+-- /premium-readings/          [Service tiers]
+-- /directory/                 [Professional listings]
+-- /search/                    [Client-side search]
+-- /news/                      [News aggregation]
+-- /about/                     [About page]
+-- /donate/                    [Donation page]
+-- /admin/                     [Decap CMS]
```
