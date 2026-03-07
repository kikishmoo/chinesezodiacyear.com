# Technical SEO & Performance: chinesezodiacyear.com

> **Document version:** 1.0
> **Last updated:** 2026-03-07
> **Audited pages:** Homepage `/`, `/readings/`, `/readings/2026-rat/`, `/zodiac/`, `/search/`, `/wuxing/`, `/dynasties/`, `/search-index.json`, `/sitemap.xml`, `/robots.txt`
> **Stack:** Eleventy 3.1.2 (ESM) | Nunjucks | GitHub Pages | Cloudflare Workers

---

## Table of Contents

1. [Current SEO Status (Audit Results)](#1-current-seo-status-audit-results)
2. [Structured Data Implementation](#2-structured-data-implementation)
3. [Meta Tag Strategy](#3-meta-tag-strategy)
4. [Performance Optimization](#4-performance-optimization)
5. [Crawling & Indexing](#5-crawling--indexing)
6. [Internal Linking](#6-internal-linking)
7. [Multilingual SEO](#7-multilingual-seo)
8. [Search Implementation](#8-search-implementation)
9. [Action Items (Prioritized)](#9-action-items-prioritized)

---

## 1. Current SEO Status (Audit Results)

### 1.1 Overall Assessment

The site has a strong technical SEO foundation. Meta tags, hreflang, canonical URLs, OG/Twitter tags, and accessibility attributes are consistently implemented across all audited pages. The primary gap is **missing JSON-LD structured data on hub pages**.

### 1.2 Per-Page Audit Matrix

| Page | Title | Meta Desc | Canonical | Hreflang | OG Tags | Twitter | JSON-LD | Accessibility |
|------|-------|-----------|-----------|----------|---------|---------|---------|---------------|
| `/` (Homepage) | PASS | PASS | PASS | PASS | PASS | PASS | PASS (WebSite + Organization) | PASS |
| `/readings/` | PASS | PASS | PASS | PASS | PASS | PASS | **WARN** (FAQ only, no BreadcrumbList/ItemList) | PASS |
| `/readings/2026-rat/` | PASS | PASS | PASS | PASS | PASS | PASS | PASS (Article + BreadcrumbList + FAQPage) | PASS |
| `/zodiac/` | PASS | PASS | PASS | PASS | PASS | PASS | **FAIL** (no JSON-LD despite breadcrumbs data) | PASS |
| `/wuxing/` | PASS | PASS | PASS | PASS | PASS | PASS | **FAIL** (no JSON-LD despite breadcrumbs data) | PASS |
| `/dynasties/` | PASS | PASS | PASS | PASS | PASS | PASS | **FAIL** (no JSON-LD despite breadcrumbs data) | PASS |
| `/search/` | PASS | PASS | PASS | PASS | PASS | PASS | N/A | PASS |
| `/search-index.json` | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| `/sitemap.xml` | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| `/robots.txt` | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |

**Legend:** PASS = correctly implemented | FAIL = missing required element | WARN = partially implemented

### 1.3 What Is Working Well

1. **Unique meta tags per page** -- every page has its own title, description, viewport, keywords, and full OG/Twitter tag sets
2. **Canonical URLs** properly set via `<link rel="canonical">` in `src/_includes/layouts/base.njk` line 11
3. **Hreflang** -- all four variants present on every page: `en`, `zh-Hant`, `zh-Hans`, `x-default` (base.njk lines 22-25)
4. **Homepage JSON-LD** -- WebSite schema with SearchAction and Organization schema with logo, sameAs social profiles, and foundingDate (base.njk lines 103-106)
5. **Article page JSON-LD** -- Article (with author as Person, articleSection, keywords), BreadcrumbList, and FAQPage schemas emitted conditionally (base.njk lines 70-79)
6. **Accessibility** -- skip-to-content link (base.njk line 118), ARIA labels on forms and navigation, `role` attributes on header/nav/footer, `aria-expanded` on toggles, `aria-live="polite"` on dynamic results
7. **Performance fundamentals** -- font preloading/preconnect, lazy loading images, deferred scripts, noscript fallbacks
8. **www redirect** -- JS redirect for browsers with `<noscript><meta http-equiv="refresh">` fallback for no-JS crawlers, plus `<link rel="canonical">` pointing to non-www
8. **Internal linking** -- breadcrumbs on article pages, nav/footer link grids, content graph auto-generated related links
9. **Search index** -- 85 entries with body text for client-side search
10. **Sitemap** -- comprehensive with priorities, changefreq, and hreflang annotations per URL
11. **AI crawler permissions** -- robots.txt explicitly allows GPTBot, anthropic-ai, PerplexityBot, Google-Extended, CCBot, and Bytespider for Generative Engine Optimization (GEO)

### 1.4 Issues Found

| ID | Severity | Description | Affected Page(s) |
|----|----------|-------------|-------------------|
| SEO-001 | **MEDIUM** | No JSON-LD structured data (should have BreadcrumbList + ItemList) | `/zodiac/` |
| SEO-002 | **MEDIUM** | No JSON-LD structured data (should have BreadcrumbList + ItemList) | `/wuxing/` |
| SEO-003 | **MEDIUM** | No JSON-LD structured data (should have BreadcrumbList + ItemList) | `/dynasties/` |
| SEO-004 | **LOW** | Likely missing JSON-LD (same hub pattern as above) | `/readings/` |
| SEO-005 | **LOW** | 15 search index entries have empty `category` string | `/search-index.json` |
| SEO-006 | **LOW** | Body text truncated at 500 characters (design choice -- acceptable) | `/search-index.json` |
| SEO-007 | **INFO** | No `noindex` directive on search page (thin content risk) | `/search/` |
| SEO-008 | **INFO** | Hub pages use shared OG image (`zodiac-stone-carving.webp`) vs reading pages which have custom images (`/img/og/2026-rat.png`) | `/zodiac/`, `/wuxing/`, `/readings/` |
| SEO-009 | **INFO** | Homepage title "Encyclopedia, Directory & News \| Chinese Zodiac" does not lead with the primary keyword "Chinese Zodiac" | `/` |

---

## 2. Structured Data Implementation

### 2.1 Current JSON-LD Coverage

All structured data is emitted in `src/_includes/layouts/base.njk` inside `<head>`, using conditional Nunjucks blocks.

| Schema Type | Where Emitted | Trigger Condition | Status |
|-------------|---------------|-------------------|--------|
| `WebSite` (with `SearchAction`) | Homepage only | `page.url == "/"` (base.njk line 105) | Active |
| `Organization` (with logo, sameAs, foundingDate) | Homepage only | `page.url == "/"` (base.njk line 106) | Active |
| `Article` (with author Person, articleSection, keywords) | Article/reading pages | `ogType == "article"` (base.njk line 70) | Active |
| `BreadcrumbList` | Pages with `breadcrumbs` front matter | `{% if breadcrumbs %}` (base.njk line 73) | Active |
| `FAQPage` | Pages with `faq` front matter | `{% if faq %}` (base.njk line 77) | Active |
| `HowTo` | Pages with `howTo` front matter | `{% if howTo %}` (base.njk line 80) | Active |
| `Product` | Shop page | `{% if shopSchema %}` (base.njk line 83) | Active |
| `VideoObject` | Pages with `videos` front matter | `{% if videos %}` (base.njk line 91) | Active |
| `CollectionPage` | Hub pages with `hubSchema` front matter | `{% if hubSchema %}` (base.njk line 96) | Active |
| `ItemList` (directory) | Directory page | `{% if directorySchema %}` (base.njk line 99) | Active |

### 2.2 The Hub Page Gap

Hub pages (`/zodiac/`, `/wuxing/`, `/dynasties/`, `/readings/`) function as index/listing pages that link to multiple sub-pages. These pages have `breadcrumbs` defined in their front matter but the JSON-LD is not being rendered because of a subtle issue:

- `/zodiac/` sets `ogType: "article"` in its front matter, which triggers the `Article` schema -- but as a hub/index page, it should be treated differently. The BreadcrumbList should render (it has `breadcrumbs` data), yet the current `Article` schema conflates hub pages with leaf content pages. There is **no `ItemList` schema** to represent the collection of sub-pages.
- `/wuxing/` and `/dynasties/` follow the same pattern.
- `/readings/` uses `ogType: "website"` so it does not get the Article schema, but it also lacks an ItemList.

**Root cause analysis:** The `base.njk` template checks for `breadcrumbs` data to emit BreadcrumbList JSON-LD. The `/zodiac/`, `/wuxing/`, and `/dynasties/` pages do define `breadcrumbs` in front matter. However, these pages use `layout: "layouts/article.njk"` which extends `base.njk`, and the breadcrumbs data appears to be present. The Article schema fires because `ogType: "article"`. The BreadcrumbList *should* fire given the conditional on line 71. **The missing piece is the `ItemList` schema** -- there is no template logic to emit an `ItemList` for hub pages that enumerate their child links.

### 2.3 Recommended Fix: Add ItemList to Hub Pages

Add a new front matter flag `hubSchema: true` and an `itemList` array to hub pages, then add a conditional block in `base.njk`.

**Step 1 -- Add to front matter** (example for `/zodiac/` in `src/pages/zodiac.njk`):

```yaml
hubSchema: true
itemList:
  - name: "Rat"
    url: "/zodiac/rat/"
  - name: "Ox"
    url: "/zodiac/ox/"
  - name: "Tiger"
    url: "/zodiac/tiger/"
  # ... all 12 animals
```

**Step 2 -- Add JSON-LD block to `base.njk`** (after the existing `directorySchema` block, around line 95):

```html
{% if hubSchema and itemList %}
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "{{ title | jsonLdSafe | safe }}",
  "description": "{{ description | jsonLdSafe | safe }}",
  "numberOfItems": {{ itemList | length }},
  "itemListElement": [
    {% for item in itemList %}{
      "@type": "ListItem",
      "position": {{ loop.index }},
      "name": "{{ item.name | jsonLdSafe | safe }}",
      "url": "{{ site.url }}{{ item.url }}"
    }{% if not loop.last %},{% endif %}{% endfor %}
  ]
}</script>
{% endif %}
```

**Step 3 -- Apply to all hub pages:**

| Hub Page | File | itemList Contents |
|----------|------|-------------------|
| `/zodiac/` | `src/pages/zodiac.njk` | 12 zodiac animal sub-pages |
| `/wuxing/` | `src/pages/wuxing.njk` | 5 element sub-pages |
| `/dynasties/` | `src/pages/dynasties.njk` | Dynasty sub-pages (Xia, Shang, Zhou, Qin, Han, etc.) |
| `/readings/` | `src/pages/readings.njk` | 12 yearly reading pages |

**Effort estimate:** 2-3 hours (template change + front matter updates + validation with Google Rich Results Test).

---

## 3. Meta Tag Strategy

### 3.1 Title Tags

**Pattern:** `{{ title }} | {{ site.name }}`

Rendered in `src/_includes/layouts/base.njk` line 8:
```html
<title>{{ title }} | {{ site.name }}</title>
```

Where `site.name` = "Chinese Zodiac" (from `src/_data/site.json`).

**Examples from audited pages:**

| Page | Rendered Title |
|------|---------------|
| Homepage | `Encyclopedia, Directory & News \| Chinese Zodiac` |
| `/zodiac/` | `Chinese Zodiac Animals \| Chinese Zodiac` |
| `/readings/2026-rat/` | `2026 Rat Reading -- Fire Horse \| Chinese Zodiac` |
| `/wuxing/` | `Wu Xing -- The Five Elements Theory \| Chinese Zodiac` |
| `/dynasties/` | `Chinese Dynasties -- Xia to Ming \| Chinese Zodiac` |
| `/readings/` | `2026 Zodiac Readings \| Chinese Zodiac` |
| `/search/` | `Search \| Chinese Zodiac` |

**Issue SEO-009:** The homepage title places "Encyclopedia, Directory & News" before the brand name. For SEO, the primary keyword should lead:
- Current: `Encyclopedia, Directory & News | Chinese Zodiac`
- Recommended: `Chinese Zodiac Encyclopedia, Directory & News | ChineseZodiacYear.com`

### 3.2 Meta Descriptions

Unique per page, set in front matter `description` field. Length range: 80-160 characters (within Google's typical display range).

| Page | Description |
|------|-------------|
| Homepage | "Chinese zodiac encyclopedia: zodiac animals, BaZi four pillars, feng shui, the Chinese calendar, and Spring Festival traditions from classical sources." |
| `/zodiac/` | "The 12 Chinese zodiac animals: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig -- origins, traits, and compatibility." |
| `/readings/2026-rat/` | "Complete 2026 forecast for the Rat. Career, love, health, and monthly outlook for Rat-born people in the Fire Horse year." |

### 3.3 Keywords

Set per page in front matter. Comma-separated terms relevant to the page topic. While Google no longer uses meta keywords as a ranking signal, they feed into the search index and may be used by other engines.

### 3.4 Canonical URLs

```html
<link rel="canonical" href="{{ site.url }}{{ page.url }}">
```

For language variants, the `eleventy.after` hook in `eleventy.config.js` (line 330) rewrites canonicals:
```js
out = out.replace(
  /<link rel="canonical" href="(https?:\/\/[^/"]+)(\/[^"]*)">/,
  `<link rel="canonical" href="$1/${variant.prefix}$2">`
);
```

This means `/zh-hant/zodiac/` canonicals to `https://chinesezodiacyear.com/zh-hant/zodiac/` (correct -- each language variant is its own canonical).

### 3.5 Open Graph Tags

Defined in `base.njk` lines 35-45:

| Property | Value | Notes |
|----------|-------|-------|
| `og:type` | `{{ ogType \| default('website') }}` | `"article"` for content pages, `"website"` for hub/home |
| `og:title` | `{{ ogTitle \| default(title) }}` | Falls back to page title |
| `og:description` | `{{ ogDescription \| default(description) }}` | Falls back to meta description |
| `og:url` | `{{ site.url }}{{ page.url }}` | Updated for language variants |
| `og:image` | Resolved from `ogImage` front matter or `/img/og-default.png` | Custom per reading page, shared for hubs |
| `og:image:width` | `1200` | Hardcoded |
| `og:image:height` | `630` | Hardcoded |
| `og:locale` | `en_US` | Plus `og:locale:alternate` for `zh_TW` and `zh_CN` |

**OG image coverage:**
- Reading pages: custom images (e.g., `/img/og/2026-rat.png`)
- Hub pages: shared images (e.g., `/img/photos/zodiac-stone-carving.webp` for `/zodiac/`, `/img/photos/garden-pavilion.webp` for `/wuxing/`, `/img/photos/great-wall.webp` for `/dynasties/`)
- Homepage: `/img/photos/zodiac-stone-carving.webp`

### 3.6 Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ ogTitle | default(title) }}">
<meta name="twitter:description" content="{{ ogDescription | default(description) }}">
<meta name="twitter:image" content="{{ resolvedOgImage }}">
<meta name="twitter:site" content="@chinesezodiacyr">
<meta name="twitter:creator" content="@chinesezodiacyr">
```

All cards use `summary_large_image` format. Twitter handle is configured in `src/_data/site.json`.

---

## 4. Performance Optimization

### 4.1 CSS

| Metric | Value |
|--------|-------|
| Source file | `src/styles.css` (~5,350 lines) |
| Minification | CleanCSS Level 2 |
| Output | `_site/styles.css` |
| Estimated output size | ~96KB minified |
| Loading | Render-blocking `<link rel="stylesheet">` (acceptable for single CSS file) |

Minification is handled in the `eleventy.after` hook in `eleventy.config.js` (lines 165-175):

```js
const cssOutput = new CleanCSS({ level: 2 }).minify(cssInput);
```

### 4.2 JavaScript

| File | Source Lines | Minification | Estimated Output | Loading |
|------|-------------|--------------|------------------|---------|
| `site.js` | ~1,070 | Terser (compress + mangle) | ~30KB minified | `<script src="/site.js">` at body end |
| `trivia.js` | ~526 | Terser (compress + mangle) | ~118KB minified | `<script src="/trivia.js" defer>` homepage only |

Both JS files are minified in `eleventy.config.js` lines 177-201. No framework overhead -- everything is vanilla JavaScript.

**Key observation:** The `site.js` script is loaded without `defer` or `async` attributes (base.njk line 123). While placing it at the end of `<body>` mitigates render-blocking, adding `defer` would be a minor improvement. The `trivia.js` script already uses `defer`.

### 4.3 Fonts

The site loads two sets of web fonts from Google Fonts CDN:

**Latin fonts** (base.njk lines 56-58):
- DM Serif Display (ital: 0, 1)
- Playfair Display (ital/weight: 0,400; 0,600; 0,700; 1,400)
- Source Sans 3 (weight: 400; 500; 600; 700)
- Cormorant Garamond (ital/weight: 0,400; 0,600; 1,400)

**CJK fonts** (base.njk lines 60-62):
- Noto Serif SC (weight: 400, 700)
- Noto Serif TC (weight: 400, 700)

**Loading strategy:**
1. `<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com`
2. `<link rel="preload" as="style">` for the CSS URLs
3. `<link rel="stylesheet" media="print" onload="this.media='all'">` -- defers loading until after paint
4. `<noscript><link rel="stylesheet">` -- fallback for JS-disabled browsers

This is a well-implemented font loading strategy that avoids render-blocking while maintaining graceful degradation.

### 4.4 Images

Handled by `@11ty/eleventy-img` via the `respimg` shortcode in `eleventy.config.js` (lines 25-49):

| Setting | Value |
|---------|-------|
| Widths | 400px, 800px, 1200px |
| Formats | WebP, JPEG (fallback) |
| Output directory | `_site/img/opt/` |
| Loading | `lazy` (via `loading="lazy"`) |
| Decoding | `async` (via `decoding="async"`) |
| Sizes | `(max-width: 800px) 100vw, 800px` (default) |

Images use `<picture>` elements with `srcset` for responsive delivery. Fallback `<img>` tags are emitted if image processing fails.

**Note:** Many content images in `.njk` templates use direct `<img>` tags with `loading="lazy"` rather than the `respimg` shortcode. These still benefit from lazy loading but do not get WebP conversion or responsive srcsets.

### 4.5 Third-Party Scripts

| Script | Loading | Impact |
|--------|---------|--------|
| Google Analytics (gtag.js) | `async` | Minimal render impact |
| Google AdSense | `async` | Moderate render impact |
| Google Fonts CSS | Deferred via `media="print"` trick | Non-blocking |

### 4.6 No Framework Overhead

The site is built entirely with vanilla CSS and JavaScript. There is no React, Vue, or other SPA framework. Total pre-minification client JS is under 1,600 lines. This is a significant performance advantage:
- No hydration cost
- No virtual DOM overhead
- No framework bundle to download
- Full content visible in initial HTML (critical for SEO)

---

## 5. Crawling & Indexing

### 5.1 robots.txt

Located at `src/robots.txt`, passed through to `_site/robots.txt`.

```
User-agent: *
Allow: /
Sitemap: https://chinesezodiacyear.com/sitemap.xml
Crawl-delay: 1
```

**Search engine crawlers allowed:** Googlebot, Bingbot, Slurp (Yahoo), DuckDuckBot.

**AI/GEO crawlers explicitly allowed:**
- GPTBot (OpenAI)
- Google-Extended
- CCBot (Common Crawl)
- anthropic-ai (Anthropic)
- PerplexityBot (Perplexity)
- Bytespider (ByteDance)

**Also allowed:** Pinterest, Pinterestbot (for Rich Pins).

This is a deliberate GEO (Generative Engine Optimization) strategy -- allowing AI crawlers ensures the site's content is indexed by LLM-powered search engines.

### 5.2 XML Sitemap

Generated from `src/sitemap.njk`. Features:
- Includes all pages from `collections.all` (excludes admin, 404)
- Three `<url>` entries per page: English, zh-Hant, zh-Hans
- `<xhtml:link>` hreflang annotations in each URL block
- `<lastmod>` using ISO date format
- `<changefreq>`: daily (homepage), monthly (articles), weekly (everything else)
- `<priority>`: 1.0 (homepage), 0.9 (encyclopedia), 0.8 (readings/other), 0.7 (articles)

**Estimated URL count:** ~213 base pages x 3 languages = **639+ URLs** in the sitemap.

### 5.3 Atom/RSS Feed

Generated from `src/feed.njk`. Available at `/feed.xml`. Linked in `<head>`:
```html
<link rel="alternate" type="application/atom+xml" title="Chinese Zodiac Feed" href="/feed.xml">
```

### 5.4 Bing IndexNow

- IndexNow key file: `src/czy2026indexnow.txt` (passed through to `_site/`)
- Key configured in `src/_data/site.json`: `"indexNowKey": "czy2026indexnow"`
- Enables near-instant indexing on Bing, Yandex, and other participating engines

### 5.5 Page Count

| Content Type | Approximate Count |
|-------------|-------------------|
| Encyclopedia pages | ~25 |
| Zodiac animal pages | 12 |
| Year pages | ~120 (zodiac-year/YYYY) |
| Dynasty sub-pages | ~10 |
| Element sub-pages | 5 |
| Reading pages | 12 |
| Article pages | ~10 |
| Utility pages (search, 404, etc.) | ~10 |
| **Base pages total** | **~213** |
| **x3 languages** | **~640+** |

---

## 6. Internal Linking

### 6.1 Automated Content Graph

The site uses a content relationship system defined in two files:

1. **`src/_data/contentGraph.json`** -- stores zodiac relationships (San He trios, Liu He pairs), topic affinity maps, and page labels
2. **`src/_data/eleventyComputed.js`** -- auto-generates `autoRelated` links for every page based on the content graph

This system produces contextual "Related" and "Also Explore" link sections. The logic handles:
- **Zodiac animal pages** (`/zodiac/{animal}/`): links to the animal's 2026 reading, San He allies, Liu He friend, nearby year pages, and core topics
- **Reading pages** (`/readings/2026-{animal}/`): links to the animal's encyclopedia page and San He allies' readings
- **Element sub-pages** (`/wuxing/{element}/`): links to parent hub and related topics
- **Dynasty sub-pages** (`/dynasties/{dynasty}/`): links to parent hub and related topics
- **Year pages** (`/zodiac-year/{year}/`): links to animal profile, adjacent years, and 12-year cycle years
- **Encyclopedia pages**: uses topic affinity from the content graph
- **Articles**: uses category mapping to find related encyclopedia pages

### 6.2 Navigation Structure

**Header** (defined in `src/_data/nav.json`, rendered in `src/_includes/partials/header.njk`):

| Section | Link Count | Examples |
|---------|-----------|----------|
| Primary nav | 6 | Home, Zodiac, BaZi, Feng Shui, Calendar, Spring Festival |
| "More" dropdown | 16 | Readings, Five Elements, BaZi Calculator, Dynasties, Taoism, etc. |
| Secondary nav | 4 | News, Directory, Shop, Support Us |
| **Total header links** | **26** | |

**Footer** (rendered in `src/_includes/partials/footer.njk`):

| Column | Link Count | Content |
|--------|-----------|---------|
| Encyclopedia | 13 | Zodiac, BaZi, Feng Shui, Calendar, etc. |
| Community | 5 | News, Directory, About, Donate, Contribute |
| Resources | 9 | Calculators, Readings, Shop, Sitemap, Privacy, etc. |
| **Total footer links** | **~27** | Plus social media links |

### 6.3 Breadcrumbs

Implemented via `src/_includes/partials/breadcrumbs.njk` and front matter `breadcrumbs` arrays. Example from `/readings/2026-rat/`:

```yaml
breadcrumbs:
  - label: "Home"
    url: "/"
  - label: "Readings"
    url: "/readings/"
  - label: "2026 Rat"
```

Breadcrumbs serve double duty:
1. **Visual breadcrumbs** rendered in the article layout
2. **BreadcrumbList JSON-LD** emitted in `<head>` when `breadcrumbs` data is present

### 6.4 Hub-to-Sub-Page Linking

| Hub | Sub-Pages | Linking Method |
|-----|-----------|----------------|
| `/zodiac/` | 12 animal pages (`/zodiac/rat/`, etc.) | Zodiac grid cards with emoji, name, years, traits |
| `/wuxing/` | 5 element pages (generated by `src/wuxing-pages.njk`) | Element cards with links |
| `/dynasties/` | ~10 dynasty pages (generated by `src/dynasty-pages.njk`) | Dynasty timeline with links |
| `/readings/` | 12 reading pages (`/readings/2026-rat/`, etc.) | Reading card grid |

### 6.5 Contextual Cross-Links

Article pages include `relatedArticles` in front matter for explicit cross-linking. Example from `/zodiac/`:

```yaml
relatedArticles:
  - label: "BaZi & Four Pillars of Destiny"
    url: "/bazi/"
  - label: "Wu Xing -- Five Elements"
    url: "/wuxing/"
  - label: "The Chinese Calendar"
    url: "/calendar/"
  - label: "Spring Festival & Chinese New Year"
    url: "/spring-festival/"
```

These are rendered in the sidebar and complement the auto-generated `autoRelated` links.

---

## 7. Multilingual SEO

### 7.1 Architecture

The site supports three language variants:
- **English** (`en`) -- base pages at `/`
- **Traditional Chinese** (`zh-Hant`) -- generated at `/zh-hant/`
- **Simplified Chinese** (`zh-Hans`) -- generated at `/zh-hans/`

Translation is handled at **build time**, not runtime. All three variants are pre-rendered as static HTML.

### 7.2 Build-Time Language Stripping

The `eleventy.after` hook in `eleventy.config.js` (lines 203-359) implements language variant generation:

1. **Source pages** contain all three languages wrapped in `<div class="lang-en">`, `<div class="lang-tc">`, `<div class="lang-sc">` (and corresponding `<span>` elements for inline content)
2. **For each HTML file**, the hook:
   - Creates `/zh-hant/` and `/zh-hans/` copies
   - Sets the `<html lang="">` attribute to `zh-Hant` or `zh-Hans`
   - Updates canonical URL and `og:url` to include the language prefix
   - **Strips non-active language blocks** using balanced tag matching (`removeLangDiv` / `unwrapLangDiv` functions)
3. **English base pages** are also stripped of TC/SC content blocks

**SEO benefit:** Crawlers receive clean, single-language HTML. No JavaScript dependency for language detection. Each variant is independently indexable.

### 7.3 Hreflang Implementation

Defined in `base.njk` lines 22-25:

```html
<link rel="alternate" hreflang="en" href="{{ site.url }}{{ page.url }}">
<link rel="alternate" hreflang="zh-Hant" href="{{ site.url }}/zh-hant{{ page.url }}">
<link rel="alternate" hreflang="zh-Hans" href="{{ site.url }}/zh-hans{{ page.url }}">
<link rel="alternate" hreflang="x-default" href="{{ site.url }}{{ page.url }}">
```

The `x-default` hreflang points to the English version, which is the correct default for an English-primary site.

### 7.4 Canonical URLs per Language

Each language variant has its own canonical URL:
- English: `https://chinesezodiacyear.com/zodiac/`
- Traditional Chinese: `https://chinesezodiacyear.com/zh-hant/zodiac/`
- Simplified Chinese: `https://chinesezodiacyear.com/zh-hans/zodiac/`

This is correctly handled by the regex replacement in the `eleventy.after` hook (line 330-333).

### 7.5 Sitemap Hreflang Annotations

The sitemap (`src/sitemap.njk`) includes `<xhtml:link>` hreflang annotations for every URL, ensuring search engines can discover all language variants:

```xml
<url>
  <loc>https://chinesezodiacyear.com/zodiac/</loc>
  <xhtml:link rel="alternate" hreflang="en" href="..." />
  <xhtml:link rel="alternate" hreflang="zh-Hant" href="..." />
  <xhtml:link rel="alternate" hreflang="zh-Hans" href="..." />
</url>
```

---

## 8. Search Implementation

### 8.1 Architecture

Client-side search using a JSON index file.

| Component | File | Details |
|-----------|------|---------|
| Search index | `src/search-index.njk` -> `/search-index.json` | Generated at build time |
| Search page | `src/pages/search.njk` -> `/search/` | Minimal HTML shell |
| Search logic | `src/site.js` | Client-side JS with weighted scoring |

### 8.2 Search Index Structure

Generated from `collections.all`, excluding `/search/`, `/404.html`, `/sitemap.xml`, `/feed.xml`, and pages without titles.

Each entry contains:

```json
{
  "url": "/zodiac/",
  "title": "Chinese Zodiac Animals",
  "description": "The 12 Chinese zodiac animals...",
  "category": "encyclopedia",
  "keywords": "Chinese zodiac animals, 12 zodiac signs...",
  "body": "Origins & History 2,000+ Years of Living Tradition..."
}
```

| Field | Source | Notes |
|-------|--------|-------|
| `url` | `item.url` | Page URL path |
| `title` | `item.data.title` | From front matter |
| `description` | `item.data.description` | From front matter |
| `category` | `item.data.category` | From front matter; **15 entries have empty string** |
| `keywords` | `item.data.keywords` | From front matter |
| `body` | `item.content \| striptags \| truncate(500)` | HTML stripped, truncated to 500 chars |

**Current entry count:** 85 entries.

### 8.3 Search Scoring

The search logic in `site.js` uses weighted field matching:

| Field | Weight | Rationale |
|-------|--------|-----------|
| `title` | 15 | Highest relevance signal |
| `keywords` | 4 | Curated relevance terms |
| `description` | 2 | Secondary context |
| `body` | 1 | Broad content matching |

### 8.4 Accessibility

- Search form uses `role="search"` and `aria-label="Site search"`
- Results container uses `aria-live="polite"` for screen reader announcements
- Status messages are announced via `aria-live` region

### 8.5 Limitations

| Limitation | Impact | When to Address |
|------------|--------|-----------------|
| Client-side only | All 85 entries (~200KB) loaded in browser | When content exceeds ~500 pages |
| No fuzzy matching | Exact substring matching only | Low priority; current content is small |
| Body truncated to 500 chars | May miss relevant content deep in articles | Acceptable design trade-off |
| English index only | Chinese language variants not indexed | When Chinese search demand is validated |

---

## 9. Action Items (Prioritized)

### P0 -- Critical

None currently. The site has no broken SEO elements or critical performance issues.

### Completed Items (March 2026 Sprint)

| Action | Status | Details |
|--------|--------|---------|
| **Google Search Console verification** | DONE | Meta tag added via `site.json` → `googleVerification` |
| **Auto-generated FAQ schema on 30+ pages** | DONE | `eleventyComputed.js` → `autoFaq` property; covers all encyclopedia, zodiac, and year pages |
| **SEO-optimized title tags** | DONE | 20+ pages updated with long-tail keywords and Chinese characters |
| **Enriched year pages (121 pages)** | DONE | Sexagenary cycle, element interactions, compatibility, BaZi, FAQ sections |
| **High-volume landing page** | DONE | `/whats-my-zodiac/` targeting "what is my chinese zodiac sign" |
| **Premium directory tiers** | DONE | Free/premium/featured tiers in `directory.json` |
| **Web Vitals monitoring** | DONE | CLS, LCP, FCP, TTFB, INP → GA4 via web-vitals@4 |
| **GEO optimization** | DONE | `llms.txt` for AI crawlers, robots.txt allows all AI bots |
| **Image alt text improvement** | DONE | Homepage images updated with descriptive, keyword-rich alt text |
| **Front-load homepage title keyword** | DONE | Changed to "Chinese Zodiac — Shēngxiào Encyclopedia, Directory & News" |
| **Pillar-cluster: Compatibility pair pages (78 pages)** | DONE | `compatibilityPairs.js` generates 66 unique + 12 same-sign pair pages at `/compatibility/{pair}/`; each includes Six Harmony/Clash/Harm/neutral analysis, element interaction, trilingual content, FAQ schema, auto-related links |
| **Pillar-cluster: Hub→cluster linking** | DONE | Compatibility hub page now links to all key pair pages (H6, Clash, Harm categories); zodiac animal pages link to their specific pair pages |
| **Pillar-cluster: Cross-cluster linking** | DONE | `eleventyComputed.js` auto-generates related links between pair pages, animal profiles, readings, and the compatibility hub |
| **JSON-LD CollectionPage + ItemList on hub pages** | DONE | All 5 hubs (`/zodiac/`, `/wuxing/`, `/dynasties/`, `/readings/`, `/compatibility/`) emit CollectionPage + ItemList JSON-LD via `hubSchema` frontmatter |
| **Cross-sell CTA partial in article layout** | DONE | `cross-sell-cta.njk` auto-included in all article-layout pages (articles, readings, zodiac, encyclopedia). Two-card layout (reading + product) with UTM tracking. Opt-out via `crossSellHidden: true` frontmatter. |
| **News hub interactive filters** | DONE | `/news/` page now has client-side JS category filters with `<button>` elements, URL hash support (`#category=zodiac`), no-results state with "Show all" fallback, ARIA accessibility attributes. Pagination increased to 100 to show all articles on one page. |
| **noindex on /search/ page** | DONE | Already had `noindex: true` in frontmatter; `base.njk` renders `<meta name="robots" content="noindex, follow">` |
| **Categorize search index entries** | DONE | Year pages (121) now have `category: "encyclopedia"`; only homepage remains uncategorized (expected) |
| **Homepage title keyword front-loaded** | DONE | Already changed to "Chinese Zodiac — Shēngxiào Encyclopedia, Directory & News" |

### P1 -- High Priority (Remaining)

All P1 items have been completed.

### P2 -- Medium Priority

| Action | Issue(s) | Files to Modify | Effort |
|--------|----------|-----------------|--------|
| **Create custom OG images for hub pages** | SEO-008 | Design work + `ogImage` front matter in hub `.njk` files | 4-6 hours |

### P3 -- Low Priority / Future

| Action | Trigger | Effort |
|--------|---------|--------|
| **Server-side search** | Content exceeds ~500 pages | Significant (requires API endpoint or Algolia/Pagefind integration) |
| **Core Web Vitals monitoring** | After reaching >1,000 monthly organic sessions | 2-4 hours (set up CrUX dashboard or web-vitals library) |
| **Add `defer` to `site.js` script tag** | Minor performance win | 5 minutes (change base.njk line 123) |
| **Modularize `eleventy.config.js`** | When build config exceeds ~500 lines | 4-8 hours (extract i18n, minification, collections into separate modules) |
| **Add Chinese language search index** | When Chinese search demand is validated | 2-4 hours (generate separate index for zh-Hant/zh-Hans content) |
| **Implement incremental builds** | When build time exceeds 60 seconds | Depends on Eleventy 3.x incremental build support |

---

## Appendix A: File Reference

| Purpose | File Path |
|---------|-----------|
| Eleventy config (build, minification, i18n) | `eleventy.config.js` |
| Base HTML template (all meta/SEO tags) | `src/_includes/layouts/base.njk` |
| Article layout | `src/_includes/layouts/article.njk` |
| Site configuration | `src/_data/site.json` |
| Navigation data | `src/_data/nav.json` |
| Content graph (internal links) | `src/_data/contentGraph.json` |
| Computed data (auto-related links) | `src/_data/eleventyComputed.js` |
| Header partial | `src/_includes/partials/header.njk` |
| Footer partial | `src/_includes/partials/footer.njk` |
| Breadcrumbs partial | `src/_includes/partials/breadcrumbs.njk` |
| Search index template | `src/search-index.njk` |
| Sitemap template | `src/sitemap.njk` |
| Atom feed template | `src/feed.njk` |
| robots.txt | `src/robots.txt` |
| Homepage | `src/pages/index.njk` |
| Zodiac hub page | `src/pages/zodiac.njk` |
| Wuxing hub page | `src/pages/wuxing.njk` |
| Dynasties hub page | `src/pages/dynasties.njk` |
| Readings hub page | `src/pages/readings.njk` |
| Search page | `src/pages/search.njk` |
| Example reading page | `src/readings/2026-rat.njk` |
| CSS source | `src/styles.css` |
| Main JS source | `src/site.js` |
| Trivia JS source | `src/trivia.js` |

## Appendix B: Structured Data Validation Checklist

After implementing the P1 changes, validate each page type:

- [ ] Homepage `/` -- WebSite (SearchAction) + Organization
- [ ] Reading page `/readings/2026-rat/` -- Article + BreadcrumbList + FAQPage
- [ ] Zodiac hub `/zodiac/` -- Article + BreadcrumbList + **ItemList** (new)
- [ ] Wuxing hub `/wuxing/` -- Article + BreadcrumbList + **ItemList** (new)
- [ ] Dynasties hub `/dynasties/` -- Article + BreadcrumbList + **ItemList** (new)
- [ ] Readings hub `/readings/` -- BreadcrumbList + FAQPage + **ItemList** (new)
- [ ] Directory `/directory/` -- ItemList (existing)
- [ ] Shop `/shop/` -- Product schemas (existing)

**Tools:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Bing Markup Validator](https://www.bing.com/toolbox/markup-validator)
