# chinesezodiacyear.com

Encyclopaedia, directory, readings, and news platform for Chinese zodiac, BaZi, feng shui, and traditional Chinese culture rooted in classical pre-Qing scholarship.

**Live site:** https://chinesezodiacyear.com

## Tech Stack

| Layer | Technology |
|---|---|
| Static Site Generator | [Eleventy](https://www.11ty.dev/) v3.1.2 (ESM config, Nunjucks templates) |
| Hosting | GitHub Pages (via GitHub Actions) |
| Edge Functions | Cloudflare Worker (BaZi calculator proxy) |
| CMS | [Decap CMS](https://decapcms.org/) v3 (Git-backed) |
| CSS | Vanilla CSS (~5,350 lines, minified by CleanCSS at build). Design tokens for colors, spacing, radii, transitions, and gold transparency scale. |
| JS | Vanilla JS (~1,600 lines across 2 files, minified by Terser at build) |
| Images | `@11ty/eleventy-img` (WebP/JPEG at 400/800/1200px) |
| Search | Client-side JSON index with body text excerpts (build-time generated) |
| Newsletter | Beehiiv |
| Comments | Giscus (GitHub Discussions) |
| Analytics | Google Analytics 4 |
| Performance Monitoring | Web Vitals (CLS, LCP, INP → GA4) |

## Quick Start

```bash
# Install dependencies
npm ci

# Start dev server with hot reload
npm run dev

# Production build
npm run build
```

The dev server runs at `http://localhost:8080`. The production build outputs to `_site/`.

**Requirements:** Node.js 20+

## Project Structure

```
src/
├── _data/                  # Global data files (14 files: JSON + JS)
│   ├── site.json           # Site config (URLs, API keys, social)
│   ├── nav.json            # Trilingual navigation structure
│   ├── dynastiesData.json  # 10 Chinese dynasties (Xia–Ming)
│   ├── elements.json       # 5 Wu Xing elements with correspondences
│   ├── contentGraph.json   # Topic affinity map for auto-linking
│   ├── compatibilityPairs.js # Generates 78 zodiac compatibility pair objects
│   ├── contentCalendar.json # Editorial content calendar and pipeline
│   ├── directory.json      # Professional directory listings (50+)
│   ├── shop.json           # Products and premium readings
│   ├── zodiacYears.js      # Generates 1924–2044 year data
│   ├── newsCategories.json # Article categories (trilingual)
│   ├── languages.json      # Language config (en, tc, sc)
│   ├── eleventyComputed.js # Auto-generates related links + FAQ per page
│   └── buildInfo.js        # Build-time computed data
├── _includes/
│   ├── layouts/
│   │   ├── base.njk        # Master HTML layout (head, structured data, scripts, conditional Twitter widget.js)
│   │   └── article.njk     # Article layout (sidebar, TOC, FAQ, cross-sell CTA, related content)
│   └── partials/           # 12 reusable components
│       ├── header.njk      # Navigation, search, language/theme toggles
│       ├── footer.njk      # Social links, nav columns, copyright
│       ├── breadcrumbs.njk # Breadcrumb nav + BreadcrumbList JSON-LD
│       ├── hero.njk        # Page header (overline, title, subtitle)
│       ├── ad-unit.njk     # Google AdSense integration
│       ├── affiliate-disclosure.njk
│       ├── share-buttons.njk  # Facebook, Twitter, LinkedIn, copy URL
│       ├── newsletter.njk  # Beehiiv email signup CTA
│       ├── content-upgrade.njk  # Mid-article email capture CTA
│       ├── cross-sell-cta.njk   # Product/reading cross-sell CTA (auto-included in article layout)
│       ├── email-popup.njk # Exit-intent email capture modal
│       └── comments.njk    # Giscus GitHub Discussions
├── admin/                  # Decap CMS admin panel
├── articles/               # Long-form articles (16 files)
├── pages/                  # Encyclopaedia and utility pages (34 files)
├── readings/               # Yearly zodiac readings (12 files, each unique)
├── zodiac/                 # Individual animal pages (12 files)
├── img/                    # Images and OG media
├── styles.css              # Master stylesheet (~5,350 lines, incl. social embed grid variants)
├── site.js                 # Main client-side JS (~1,020 lines)
├── trivia.js               # Homepage trivia game (72 questions, trilingual)
├── search-index.njk        # Build-time JSON search index with body text
├── sitemap.njk             # XML sitemap with hreflang
├── feed.njk                # Atom/RSS feed
├── robots.txt              # Crawler permissions (incl. AI crawlers)
├── compatibility-pair-pages.njk # Generates /compatibility/{pair}/ pages (78 pairs)
├── dynasty-pages.njk       # Generates /dynasties/{slug}/ pages from data
├── wuxing-pages.njk        # Generates /wuxing/{slug}/ pages from data
└── year-pages.njk          # Generates /zodiac-year/{year}/ pages (121 years)

worker/
├── bazi-worker.js          # Cloudflare Worker for BaZi calculator
└── wrangler.toml           # Worker config

eleventy.config.js          # Eleventy build config (collections, filters, i18n, minification)

scripts/
└── new-article.js          # Article scaffolding CLI tool
```

## Data Files

| File | Purpose |
|---|---|
| `site.json` | Site config (URLs, API keys, social links, GA4, AdSense) |
| `nav.json` | Trilingual navigation (primary, more, secondary, footer) |
| `dynastiesData.json` | 10 Chinese dynasties (Xia–Ming) with dates, capitals, contributions, optional `videos` array |
| `elements.json` | 5 Wu Xing elements with full correspondences |
| `contentGraph.json` | Topic affinity map for auto-generated related links |
| `compatibilityPairs.js` | Generates 78 zodiac compatibility pair objects (Six Harmonies, Clashes, Harms, neutral, self) |
| `contentCalendar.json` | Editorial content calendar with article pipeline |
| `directory.json` | 40+ professional directory listings (free tier, with featured placement for verified organisations) |
| `shop.json` | 3 premium reading tiers + 6 digital products |
| `zodiacYears.js` | Generates 1924–2044 year data (animal, element, stem, yin-yang) |
| `newsCategories.json` | 5 article categories with trilingual labels |
| `languages.json` | Language config (en, tc, sc) with hreflang codes |
| `eleventyComputed.js` | Auto-generates related/contextual links per page |
| `buildInfo.js` | Build-time computed data (current year) |

## Content Architecture

The site generates **293 pages** (879 after i18n) across these content types:

| Type | Count | Source |
|---|---|---|
| Encyclopaedia pages | 35 | `src/pages/*.njk` |
| Zodiac animal pages | 12 | `src/zodiac/*.njk` |
| Yearly readings | 12 | `src/readings/*.njk` (each with unique astrological section) |
| Compatibility pair pages | 78 | Generated from `compatibilityPairs.js` (66 unique + 12 same-sign) |
| Long-form articles | 16 | `src/articles/*.njk` |
| Year pages | 121 | Generated from `zodiacYears.js` (1924–2044) |
| Wu Xing element pages | 5 | Generated from `elements.json` |
| Dynasty pages | 10 | Generated from `dynastiesData.json` |
| Utility pages | ~11 | Search, shop, directory, donate, about, 404 |

All content is published in **three languages**: English (default), Traditional Chinese (`/zh-hant/`), and Simplified Chinese (`/zh-hans/`).

### Zodiac Readings Differentiation

Each of the 12 zodiac readings includes a unique section based on its specific Five-Phase (Wu Xing) relationship with the current year:

| Animal | Unique Section | Astrological Concept |
|---|---|---|
| Rat | The Zi-Wu Clash | Direct opposition (子午沖) |
| Ox | Fire Generates Earth | Productive cycle |
| Tiger | Fire Triangle (initiator) | San He triangle (寅午戌三合) |
| Rabbit | Wood Feeds Fire | Giving/draining cycle |
| Dragon | Elemental Advantage | Three-element simultaneous cycle |
| Snake | Si-Wu Liu He Bond | Secret friend alliance |
| Horse | Ben Ming Nian | Birth year (本命年) |
| Goat | Wu-Wei Liu He Bond | Secret friend alliance |
| Monkey | Fire Controls Metal | Overcoming cycle |
| Rooster | Bing-Xin Combination | Heavenly Stem combination |
| Dog | Fire Triangle (storage) | San He triangle (寅午戌三合) |
| Pig | Water Meets Fire | Controlling position |

## i18n (Internationalization)

The site uses a **build-time i18n** approach:

1. Source templates contain all three languages using CSS class-based blocks:
   - `<div class="lang-en">` / `<span class="lang-en">` — English
   - `<div class="lang-tc">` / `<span class="lang-tc">` — Traditional Chinese
   - `<div class="lang-sc">` / `<span class="lang-sc">` — Simplified Chinese

2. At build time (`eleventy.after` hook in `eleventy.config.js`):
   - English pages have TC/SC content stripped, keeping only English
   - `/zh-hant/` copies have EN/SC content stripped, keeping only Traditional Chinese
   - `/zh-hans/` copies have EN/TC content stripped, keeping only Simplified Chinese
   - `<html lang>`, canonical URLs, and og:url are updated per variant

3. Client-side language toggle allows switching between languages (persisted to `localStorage`)

4. Hreflang tags and sitemap annotations connect all language variants for search engines

## SEO & Structured Data

The site implements comprehensive SEO:

- **JSON-LD schemas:** Article (with author as Person, articleSection, keywords), FAQPage, BreadcrumbList, HowTo, Product, WebSite, Organization (with logo, sameAs, foundingDate), VideoObject, ItemList, CollectionPage
- **Meta tags:** Title, description, keywords, canonical, OG (with per-page images), Twitter Cards per page
- **Sitemap:** XML with hreflang for all 3 languages, priority and changefreq per page type
- **RSS:** Atom feed at `/feed.xml`
- **IndexNow:** Bing instant indexing
- **AI crawler access:** robots.txt allows GPTBot, anthropic-ai, PerplexityBot, etc. (GEO-friendly)
- **GEO (Generative Engine Optimization):** `llms.txt` file at root providing AI crawlers with structured site overview and citation guidelines
- **Search:** Client-side JSON index at `/search-index.json` with 500-char body text excerpts; weighted scoring (title: 15, keywords: 4, description: 2, body: 1)

## Build Pipeline

The `eleventy.after` hook in `eleventy.config.js` performs these post-build steps:

1. **CSS minification** — CleanCSS (Level 2) compresses `styles.css`
2. **JS minification** — Terser compresses `site.js` and `trivia.js`
3. **i18n generation** — Copies all HTML pages into `/zh-hant/` and `/zh-hans/` directories, strips non-active language blocks, updates `<html lang>`, canonical URLs, and og:url
4. **English stripping** — Strips TC/SC language blocks from base English pages

Build output: ~293 HTML files pre-i18n, ~879 after i18n generation.

## Adding Content

### Via Decap CMS

Navigate to `https://chinesezodiacyear.com/admin/` and authenticate with GitHub. The CMS supports three collections: Articles, Encyclopaedia Pages, and Zodiac Readings.

### Via the scaffolding script

```bash
# Create a new article with default sections
node scripts/new-article.js \
  --slug "my-article" \
  --title "My Article Title" \
  --category zodiac

# Create with custom sections and date
node scripts/new-article.js \
  --slug "fire-horse-meaning" \
  --title "Fire Horse Meaning" \
  --category zodiac \
  --sections "overview:Overview,symbolism:Symbolism,modern:Modern Interpretation" \
  --date 2026-04-01

# Preview without writing (dry run)
node scripts/new-article.js --dry-run --slug "test" --title "Test" --category culture
```

Categories: `zodiac`, `culture`, `fengshui`, `bazi`, `business`

The editorial content calendar is in `src/_data/contentCalendar.json` — it tracks planned articles, target keywords, and publication status.

### Manually

1. Create a new `.njk` file in the appropriate directory (`articles/`, `pages/`, `readings/`)
2. Add frontmatter (title, description, keywords, layout, category, breadcrumbs, TOC, FAQ, etc.)
3. Write content using the trilingual block pattern:
   ```html
   <div class="lang-en">English content here</div>
   <div class="lang-tc">繁體中文內容</div>
   <div class="lang-sc">简体中文内容</div>
   ```
4. For inline labels use spans: `<span class="lang-en">Label</span><span class="lang-tc">標籤</span><span class="lang-sc">标签</span>`
5. Commit and push — GitHub Actions will build and deploy automatically

### Adding a new data-driven page type

1. Add data to a JSON file in `src/_data/`
2. Create a pagination template (see `dynasty-pages.njk` or `wuxing-pages.njk` as examples)
3. Optionally add a `.11tydata.js` companion for computed data (breadcrumbs, FAQ)

### Video Embeds

Videos are embedded inline near their related content sections rather than grouped in a standalone "Watch" section (except when no contextually appropriate section exists).

**YouTube embed pattern:**
```html
<div class="social-embed-grid social-embed-grid--1">
  <div class="social-embed-card">
    <div class="embed-responsive">
      <iframe src="https://www.youtube.com/embed/{VIDEO_ID}" title="..." loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>
    <div class="embed-caption">
      <span class="lang-en">Caption</span>
      <span class="lang-tc">字幕</span>
      <span class="lang-sc">字幕</span>
    </div>
  </div>
</div>
```

**Grid variants:** `social-embed-grid--1` (single video, max 640px), `social-embed-grid--3` (3-column), default (auto-fit).

**Twitter/X embed:** Add `twitterEmbed: true` to frontmatter. Use full blockquote markup from the [Twitter oEmbed API](https://publish.twitter.com/) with `omit_script=true`. The `base.njk` layout conditionally loads `widgets.js` when the flag is set.

**Data-driven dynasty videos:** Add a `videos` array to a dynasty entry in `dynastiesData.json`. The `dynasty-pages.njk` template renders a conditional Watch section and `dynasty-pages.11tydata.js` adds it to the computed TOC.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Checkout → Node 20 setup → `npm ci` → `npx @11ty/eleventy`
2. Build validation — asserts i18n page counts (≥250 base, ≥200 per language variant), CSS/JS minification, and presence of critical files (sitemap, robots.txt, feed.xml, search-index.json, llms.txt)
3. Upload `_site/` as GitHub Pages artifact
4. Deploy via `actions/deploy-pages@v4`

The Cloudflare Worker (`worker/`) is deployed separately via `wrangler deploy`.

## DNS & Domain Configuration

The site uses a custom domain via GitHub Pages with Cloudflare DNS.

**Required DNS records:**

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `chinesezodiacyear.com` |

**www redirect:** GitHub Pages handles `www` → non-www redirect when the CNAME file is set to the apex domain and DNS is configured correctly. A client-side JS redirect in `base.njk` serves as the primary fallback, with a `<noscript><meta http-equiv="refresh">` tag for crawlers that do not execute JavaScript.

**Required Cloudflare configuration (server-side 301):**

1. **Page Rule (www → non-www 301):**
   - URL: `www.chinesezodiacyear.com/*`
   - Setting: Forwarding URL (301 Permanent Redirect)
   - Destination: `https://chinesezodiacyear.com/$1`

2. **Cloudflare SSL:** Set to "Full" (not "Flexible") for GitHub Pages compatibility.

3. **Caching:** Set Browser Cache TTL to at least 4 hours for static assets.

**Search Console verification:** The site includes a `<meta name="google-site-verification">` tag configured via `site.json` → `googleVerification` field.

## Monetization

| Channel | Integration |
|---|---|
| Display ads | Google AdSense |
| Affiliate | Amazon Associates |
| Digital products | Gumroad (6 products, $3.99–$19.99) |
| Premium readings | PayPal ($29/$79/$149) |
| Newsletter | Beehiiv (monetizable at scale) |
| Directory | Professional listings (free/premium/featured tiers, $9.99-$29.99/mo) |
| Donations | PayPal, Buy Me a Coffee, Alipay, WeChat Pay |

## Editorial Guidelines

- **Historical accuracy:** Content should reference pre-Qing Dynasty classical sources where possible (Shiji, Huangdi Neijing, Zangshu, etc.). Post-Ming and contemporary adaptations are noted as such.
- **Trilingual parity:** All user-facing content must be provided in English, Traditional Chinese, and Simplified Chinese.
- **Terminology:** Always include Chinese characters and pinyin alongside English terms (e.g., "BaZi (八字, Bā Zì)").
- **E-E-A-T:** Cite specific classical sources. Distinguish scholarly tradition from folk superstition.

## License

All rights reserved. Content and code are proprietary.
