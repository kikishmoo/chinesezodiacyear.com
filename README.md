# chinesezodiacyear.com

Encyclopedia, directory, readings, and news platform for Chinese zodiac, BaZi, feng shui, and traditional Chinese culture rooted in classical pre-Qing scholarship.

**Live site:** https://chinesezodiacyear.com

## Tech Stack

| Layer | Technology |
|---|---|
| Static Site Generator | [Eleventy](https://www.11ty.dev/) v3 (ESM config, Nunjucks templates) |
| Hosting | GitHub Pages (via GitHub Actions) |
| Edge Functions | Cloudflare Worker (BaZi calculator proxy) |
| CMS | [Decap CMS](https://decapcms.org/) v3 (Git-backed) |
| CSS | Vanilla CSS (hand-written, minified by CleanCSS at build) |
| JS | Vanilla JS (minified by Terser at build) |
| Images | `@11ty/eleventy-img` (WebP/JPEG at 400/800/1200px) |
| Newsletter | Beehiiv |
| Comments | Giscus (GitHub Discussions) |
| Analytics | Google Analytics 4 |

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
├── _data/                  # Global data files (JSON + JS)
│   ├── site.json           # Site config (URLs, API keys, social)
│   ├── dynastiesData.json  # 10 Chinese dynasties (Xia–Ming)
│   ├── elements.json       # 5 Wu Xing elements
│   ├── contentGraph.json   # Topic affinity map for auto-linking
│   ├── directory.json      # Professional directory listings
│   ├── nav.json            # Trilingual navigation structure
│   ├── shop.json           # Products and premium readings
│   └── zodiacYears.js      # Generates 1924–2044 year data
├── _includes/
│   ├── layouts/
│   │   ├── base.njk        # Master HTML layout (head, structured data, scripts)
│   │   └── article.njk     # Article layout (sidebar, TOC, FAQ, related content)
│   └── partials/           # Reusable components (header, footer, newsletter, etc.)
├── admin/                  # Decap CMS admin panel
├── articles/               # Long-form articles (news/guides)
├── pages/                  # Encyclopedia and utility pages
├── readings/               # Yearly zodiac readings (per animal)
├── zodiac/                 # Individual animal pages (12)
├── styles.css              # Master stylesheet (~5,200 lines)
├── site.js                 # Main client-side JS (~1,000 lines)
├── trivia.js               # Homepage trivia game
├── sitemap.njk             # XML sitemap with hreflang
├── feed.njk                # Atom/RSS feed
├── robots.txt              # Crawler permissions (incl. AI crawlers)
├── dynasty-pages.njk       # Generates /dynasties/{slug}/ pages from data
├── wuxing-pages.njk        # Generates /wuxing/{slug}/ pages from data
└── year-pages.njk          # Generates /zodiac-year/{year}/ pages (121 years)

worker/
├── bazi-worker.js          # Cloudflare Worker for BaZi calculator
└── wrangler.toml           # Worker config

eleventy.config.js          # Eleventy build config (collections, filters, i18n, minification)
```

## Content Architecture

The site generates **200+ pages** across these content types:

| Type | Count | Source |
|---|---|---|
| Encyclopedia pages | 20+ | `src/pages/*.njk` |
| Zodiac animal pages | 12 | `src/zodiac/*.njk` |
| Yearly readings | 12 | `src/readings/*.njk` |
| Long-form articles | 10 | `src/articles/*.njk` |
| Year pages | 121 | Generated from `zodiacYears.js` (1924–2044) |
| Wu Xing element pages | 5 | Generated from `elements.json` |
| Dynasty pages | 10 | Generated from `dynastiesData.json` |
| Utility pages | ~10 | Search, shop, directory, donate, about, 404 |

All content is published in **three languages**: English (default), Traditional Chinese (`/zh-hant/`), and Simplified Chinese (`/zh-hans/`).

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

- **JSON-LD schemas:** Article, FAQPage, BreadcrumbList, HowTo, Product, WebSite, Organization, VideoObject, ItemList
- **Meta tags:** Title, description, keywords, canonical, OG, Twitter Cards per page
- **Sitemap:** XML with hreflang for all 3 languages
- **RSS:** Atom feed at `/feed.xml`
- **IndexNow:** Bing instant indexing
- **AI crawler access:** robots.txt allows GPTBot, anthropic-ai, PerplexityBot, etc. (GEO-friendly)

## Adding Content

### Via Decap CMS

Navigate to `https://chinesezodiacyear.com/admin/` and authenticate with GitHub. The CMS supports three collections: Articles, Encyclopedia Pages, and Zodiac Readings.

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

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Checkout → Node 20 setup → `npm ci` → `npx @11ty/eleventy`
2. Upload `_site/` as GitHub Pages artifact
3. Deploy via `actions/deploy-pages@v4`

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

**www redirect:** GitHub Pages handles `www` → non-www redirect when the CNAME file is set to the apex domain and DNS is configured correctly. A client-side JS redirect in `base.njk` serves as a fallback. If using Cloudflare, add a Page Rule:

- URL: `www.chinesezodiacyear.com/*`
- Setting: Forwarding URL (301 Permanent Redirect)
- Destination: `https://chinesezodiacyear.com/$1`

## Monetization

| Channel | Integration |
|---|---|
| Display ads | Google AdSense |
| Affiliate | Amazon Associates |
| Digital products | Gumroad (6 products, $3.99–$19.99) |
| Premium readings | PayPal ($29/$79/$149) |
| Newsletter | Beehiiv (monetizable at scale) |
| Directory | Professional listings (potential paid tier) |
| Donations | PayPal, Buy Me a Coffee, Alipay, WeChat Pay |

## Editorial Guidelines

- **Historical accuracy:** Content should reference pre-Qing Dynasty classical sources where possible (Shiji, Huangdi Neijing, Zangshu, etc.). Post-Ming and contemporary adaptations are noted as such.
- **Trilingual parity:** All user-facing content must be provided in English, Traditional Chinese, and Simplified Chinese.
- **Terminology:** Always include Chinese characters and pinyin alongside English terms (e.g., "BaZi (八字, Bā Zì)").
- **E-E-A-T:** Cite specific classical sources. Distinguish scholarly tradition from folk superstition.

## License

All rights reserved. Content and code are proprietary.
