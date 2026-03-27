# Site Architecture: chinesezodiacyear.com

> **Document version:** 2.0
> **Last updated:** 2026-03-27
> **Timestamp:** 2026-03-27 — Author: kiki.peiqi.greene (architecture review)
> **Stack:** Eleventy 3.1.2 (ESM) | Nunjucks | GitHub Pages | Cloudflare Workers (D1 planned)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Build Pipeline](#2-build-pipeline)
3. [Data Architecture](#3-data-architecture)
4. [Template Hierarchy](#4-template-hierarchy)
5. [Page Types & Collections](#5-page-types--collections)
6. [i18n Architecture](#6-i18n-architecture)
7. [Client-Side Architecture](#7-client-side-architecture)
8. [Integration Points](#8-integration-points)
9. [Deployment Flow](#9-deployment-flow)
10. [Current Limitations & Future Considerations](#10-current-limitations--future-considerations)
11. [Data Layer Review & Database Plan](#11-data-layer-review--database-plan)

---

## 1. System Overview

### 1.1 High-Level Architecture Diagram

```
                          +---------------------+
                          |   Content Authors    |
                          |   (Decap CMS /       |
                          |    direct Git push)  |
                          +----------+----------+
                                     |
                                     v
+------------------+      +----------+----------+      +-------------------+
|  GitHub Repo     |----->| GitHub Actions CI   |----->| GitHub Pages      |
|  (main branch)   |      | (deploy.yml)        |      | (Static hosting)  |
|                  |      |                     |      |                   |
|  src/            |      | 1. Checkout         |      | _site/            |
|  eleventy.config |      | 2. Node 20 + npm ci |      |   293 base pages  |
|  src/_data/      |      | 3. Eleventy build   |      |   879 with i18n   |
|                  |      | 4. Build validation |      |                   |
+------------------+      | 5. Upload artifact  |      +--------+----------+
                          | 6. Deploy to Pages  |      +--------+----------+
                          +---------------------+               |
                                                                |
                          +---------------------+               |
                          | Cloudflare Worker   |<--- API calls from browser
                          | (BaZi Calculator    |
                          |  proxy)             |
                          +---------------------+

  Fonts: Google Fonts CDN (Playfair Display, Source Sans 3, Noto Serif SC/TC)
  Comments: Giscus (GitHub Discussions)
  Newsletter: Beehiiv
  Analytics: GA4 (G-2QWWBEW512) + AdSense
```

### 1.2 Technology Stack

| Layer              | Technology                          | Version / Detail                          |
|--------------------|-------------------------------------|-------------------------------------------|
| Static Site Gen    | Eleventy                            | 3.1.2, ESM configuration                  |
| Templating         | Nunjucks                            | Default template engine for all layouts    |
| Hosting            | GitHub Pages                        | Custom domain via CNAME                    |
| CI/CD              | GitHub Actions                      | `deploy.yml`, triggered on push to `main`  |
| Serverless API     | Cloudflare Worker                   | BaZi calculator proxy, deployed via Wrangler |
| CMS                | Decap CMS                           | Git-backed, commits directly to repo       |
| CSS                | esbuild CSS bundling              | 43 modular CSS files → single minified bundle          |
| JavaScript         | esbuild JS bundling               | 22 ES modules → single IIFE bundle (`site.js`), `trivia.js` minified separately |
| Image Processing   | @11ty/eleventy-img                  | WebP + JPEG fallback at 400/800/1200px widths |
| Node Runtime       | Node.js 20                          | Specified in CI workflow                   |

### 1.3 Key Design Decisions

- **No frontend framework.** Vanilla CSS and JS keep the bundle small and eliminate framework churn. Total client JS is 22 ES modules bundled to ~36KB minified. Total CSS is 43 files bundled to ~100KB minified.
- **Build-time i18n** rather than runtime translation. All three language variants (English, Traditional Chinese, Simplified Chinese) are pre-rendered as static HTML. No translation API calls at runtime.
- **Git-backed CMS.** Decap CMS writes directly to the repository. No external database or headless CMS API to maintain.
- **Modular build.** esbuild handles both JS and CSS bundling/minification in the `eleventy.after` hook. Single build config file `eleventy.config.js`.
- **No persistent database yet.** All data lives in JSON/JS files at build time. Revenue-critical data (directory, shop, reports) is planned for migration to Cloudflare D1 — see Section 11.

---

## 2. Build Pipeline

### 2.1 Build Process Flow

```
eleventy.config.js
        |
        +-- 1. CONFIGURE ELEVENTY
        |       - Set input: "src", output: "_site"
        |       - Set Nunjucks as default template engine
        |       - Register filters and shortcodes
        |       - Define collections from tags and glob patterns
        |
        +-- 2. COLLECTIONS ASSEMBLY
        |       - articles (all + 5 category sub-collections)
        |       - encyclopedia (34 pages)
        |       - readings, yearlyReadings (12 each)
        |       - Pagination-generated: 121 year pages, 5 wu xing, 10 dynasties
        |
        +-- 3. TEMPLATE RENDERING (Eleventy core)
        |       - Nunjucks processes all .njk files
        |       - Data cascade: _data/ files -> front matter -> computed data
        |       - Shortcodes expand (respimg for responsive images)
        |       - Output: 293 HTML pages in _site/
        |
        +-- 4. eleventy.after HOOK (post-build)
                |
                +-- 4a. CSS Bundling (esbuild)
                |       - Entry: src/css/main.css (43 @import files)
                |       - esbuild bundles + minifies
                |       - Write to _site/styles.css
                |       - 131.6KB source → 100.4KB minified
                |
                +-- 4b. JS Bundling (esbuild)
                |       - Entry: src/js/main.js (22 ES modules)
                |       - esbuild bundles into single IIFE
                |       - Write to _site/site.js
                |       - 59.8KB source → 36.2KB minified
                |
                +-- 4b2. Trivia JS (esbuild)
                |       - Entry: src/trivia.js (standalone)
                |       - esbuild minifies (no bundling)
                |       - Write to _site/trivia.js
                |
                +-- 4c. i18n Page Generation
                        - For each HTML file in _site/:
                          1. Clone to /zh-hant/ path (Traditional Chinese)
                          2. Clone to /zh-hans/ path (Simplified Chinese)
                          3. Strip non-active language blocks:
                             - Balanced tag matching for <div class="lang-*">
                             - Regex for <span class="lang-*">
                          4. Update <html lang="..."> attribute
                          5. Update canonical URL and og:url
                        - Output: 293 x 3 = 879 pages total
```

### 2.2 Registered Filters

| Filter       | Purpose                                                | Example Usage                            |
|--------------|--------------------------------------------------------|------------------------------------------|
| `readableDate` | Formats dates for human display                      | `{{ page.date \| readableDate }}`         |
| `isoDate`    | ISO 8601 format for `<time>` elements and sitemaps     | `{{ page.date \| isoDate }}`              |
| `jsonify`    | Serializes objects to JSON for inline `<script>` blocks | `{{ data \| jsonify }}`                   |
| `jsonLdSafe` | JSON-stringifies with HTML-safe escaping for JSON-LD   | `{{ schema \| jsonLdSafe \| safe }}`      |
| `slug`       | URL-safe slug generation                               | `{{ title \| slug }}`                     |
| `limit`      | Truncates arrays to N items                            | `{{ collection \| limit(6) }}`            |
| `striptags`  | Removes HTML tags from strings                         | `{{ content \| striptags }}`              |
| `truncate`   | Truncates text to character limit with ellipsis        | `{{ description \| truncate(160) }}`      |

### 2.3 Shortcodes

| Shortcode  | Purpose                                           | Output                                              |
|------------|---------------------------------------------------|------------------------------------------------------|
| `respimg`  | Generates responsive `<picture>` elements via @11ty/eleventy-img | `<picture>` with WebP + JPEG `<source>` at 400/800/1200px widths |

### 2.4 Build Output Structure

```
_site/
  index.html                      # Homepage
  styles.css                      # Bundled + minified CSS (esbuild)
  site.js                         # Bundled + minified site JS (esbuild)
  trivia.js                       # Minified trivia game JS (esbuild)
  search-index.json               # Client-side search index
  sitemap.xml                     # Auto-generated sitemap
  pages/                          # Encyclopaedia pages (34)
  zodiac/                         # Zodiac animal pages (12)
  readings/                       # Yearly readings (12)
  articles/                       # Long-form articles (16)
  year/                           # Individual year pages (121)
  wuxing/                         # Wu Xing element pages (5)
  dynasties/                      # Dynasty pages (10)
  shop/                           # Shop pages
  directory/                      # Professional directory
  search/                         # Search page
  img/                            # Processed responsive images
  zh-hant/                        # Traditional Chinese mirror (all paths)
  zh-hans/                        # Simplified Chinese mirror (all paths)
```

---

## 3. Data Architecture

All global data lives in `src/_data/`. Eleventy's data cascade makes these files available to every template as their filename (minus extension).

### 3.1 Data File Inventory

```
src/_data/
  site.json              # Global site configuration
  nav.json               # Trilingual navigation structure
  dynastiesData.json     # 10 Chinese dynasties (Xia through Ming)
  elements.json          # 5 Wu Xing elements with attributes
  contentGraph.json      # Topic affinity map for internal linking
  directory.json         # 50+ professional practitioner listings
  shop.json              # Premium readings + digital products catalog
  zodiacYears.js         # Generates 1924-2044 year data (computed at build)
  newsCategories.json    # 5 article categories, trilingual labels
  languages.json         # Language definitions and hreflang codes
  eleventyComputed.js    # Auto-generates related/contextual links per page
  buildInfo.js           # Exposes current year for copyright/footer
```

### 3.2 Detailed File Schemas

#### `site.json` -- Global Configuration

Contains all external service identifiers and site-wide settings.

```
{
  "url": "https://chinesezodiacyear.com",
  "title": "...",
  "description": "...",
  "ga4Id": "G-2QWWBEW512",
  "adSenseId": "...",
  "giscus": {
    "repo": "...",
    "repoId": "...",
    "category": "...",
    "categoryId": "..."
  },
  "beehiiv": {
    "publicationId": "...",
    "embedUrl": "..."
  },
  "social": {
    "twitter": "...",
    "facebook": "..."
  },
  "apiKeys": {
    "cloudflareWorkerUrl": "..."
  }
}
```

**Consumers:** `base.njk` (analytics, AdSense, meta tags), `comments.njk` (Giscus config), `newsletter.njk` (Beehiiv), `site.js` (API calls to Cloudflare Worker).

#### `nav.json` -- Trilingual Navigation

Defines the full navigation structure across all three languages. Three tiers of navigation:

| Tier        | Item Count | Examples                                                       |
|-------------|------------|----------------------------------------------------------------|
| Primary     | 6 items    | Home, Zodiac Animals, Wu Xing, Calculator, Readings, Articles  |
| More        | 16 items   | Dynasty pages, specific encyclopaedia topics, compatibility     |
| Secondary   | 4 items    | Shop, Directory, Trivia, Newsletter                            |
| Footer      | 3 columns  | About/Legal, Resources, Connect                                |

Each nav item has `en`, `tc`, and `sc` label variants plus a `url` field. The active language determines which label renders.

#### `dynastiesData.json` -- Dynasty Reference Data

Array of 10 dynasty objects spanning Xia through Ming:

| Field              | Type     | Example (Tang Dynasty)                                  |
|--------------------|----------|--------------------------------------------------------|
| `slug`             | string   | `"tang"`                                               |
| `name`             | object   | `{ "en": "Tang Dynasty", "tc": "...", "sc": "..." }`  |
| `dates`            | string   | `"618-907 CE"`                                          |
| `capital`          | string   | `"Chang'an (Xi'an)"`                                   |
| `keyContributions` | array    | `["Poetry golden age", "Civil service exams", ...]`    |
| `relatedContent`   | array    | Links to related encyclopaedia/article pages            |
| `videos`           | array?   | Optional YouTube video embeds: `[{ id, title, caption, captionTc, captionSc }]` |

**Consumer:** Pagination template generates 10 dynasty pages at `/dynasties/{slug}/`. When `videos` is present, a Watch section is rendered and the computed TOC in `dynasty-pages.11tydata.js` dynamically includes it.

#### `elements.json` -- Wu Xing (Five Elements)

Array of 5 element objects. Each contains:

| Field          | Type    | Values (Wood example)                          |
|----------------|---------|------------------------------------------------|
| `slug`         | string  | `"wood"`                                       |
| `name`         | object  | Trilingual name                                |
| `direction`    | string  | `"East"`                                       |
| `season`       | string  | `"Spring"`                                     |
| `color`        | string  | `"Green"`                                      |
| `organ`        | string  | `"Liver"`                                      |
| `planet`       | string  | `"Jupiter"`                                    |
| `taste`        | string  | `"Sour"`                                       |
| `emotion`      | string  | `"Anger"`                                      |
| `interactions` | object  | `{ "generates": "Fire", "overcomes": "Earth" }` |

**Consumer:** Pagination template generates 5 pages at `/wuxing/{slug}/`.

#### `contentGraph.json` -- Internal Linking Map

A topic affinity graph used by `eleventyComputed.js` to auto-generate contextual links.

```
{
  "topicAffinities": {
    "zodiac-rat": ["zodiac-ox", "zodiac-dragon", "zodiac-monkey", ...],
    "wuxing-water": ["zodiac-rat", "zodiac-pig", ...],
    ...
  },
  "zodiacCompatibility": {
    "sanHe": [                          // Three Harmonies triads
      ["rat", "dragon", "monkey"],
      ["ox", "snake", "rooster"],
      ["tiger", "horse", "dog"],
      ["rabbit", "goat", "pig"]
    ],
    "liuHe": [                          // Six Harmonies pairs
      ["rat", "ox"],
      ["tiger", "pig"],
      ["rabbit", "dog"],
      ["dragon", "rooster"],
      ["snake", "monkey"],
      ["horse", "goat"]
    ]
  },
  "pageLabels": {
    "zodiac-rat": { "en": "Rat", "tc": "...", "sc": "..." },
    ...
  }
}
```

**Consumer:** `eleventyComputed.js` reads this at build time and injects `related` and `contextualLinks` arrays into each page's data.

#### `directory.json` -- Professional Listings

Array of 50+ practitioner/service entries:

```
{
  "name": "...",
  "specialty": "Feng Shui Consultation",
  "location": "...",
  "url": "...",
  "description": "..."
}
```

#### `shop.json` -- Product Catalog

Two product tiers:

| Category          | Count | Price Range     | Examples                                    |
|-------------------|-------|-----------------|---------------------------------------------|
| Premium Readings  | 3     | $29 / $79 / $149 | Personal BaZi, Relationship, Annual Forecast |
| Digital Products  | 6     | $3.99 -- $19.99  | Zodiac Guide PDF, Compatibility Chart, etc.  |

#### `zodiacYears.js` -- Year Data Generator

A JavaScript module (not JSON) that computes and exports an array of 121 year objects (1924--2044). Each entry contains:

| Field      | Type    | Example (2024)           |
|------------|---------|--------------------------|
| `year`     | number  | `2024`                   |
| `animal`   | string  | `"Dragon"`               |
| `element`  | string  | `"Wood"`                 |
| `stem`     | string  | `"Jia"` (Heavenly Stem)  |
| `yinYang`  | string  | `"Yang"`                 |

The 12-year animal cycle and 10-year stem cycle combine to produce the full 60-year sexagenary cycle. The generator calculates these programmatically rather than hardcoding all 121 entries.

**Consumer:** Pagination template generates 121 pages at `/year/{year}/`.

#### `newsCategories.json` -- Article Taxonomy

```
[
  { "slug": "zodiac-basics", "en": "Zodiac Basics", "tc": "...", "sc": "..." },
  { "slug": "feng-shui",     "en": "Feng Shui",     "tc": "...", "sc": "..." },
  { "slug": "compatibility", "en": "Compatibility",  "tc": "...", "sc": "..." },
  { "slug": "culture",       "en": "Culture",        "tc": "...", "sc": "..." },
  { "slug": "predictions",   "en": "Predictions",    "tc": "...", "sc": "..." }
]
```

Used to build category-specific article collections (e.g., `articles_feng_shui`).

#### `languages.json` -- i18n Configuration

```
[
  { "code": "en",      "hreflang": "en",      "label": "English",              "pathPrefix": "" },
  { "code": "tc",      "hreflang": "zh-Hant", "label": "Traditional Chinese",  "pathPrefix": "/zh-hant" },
  { "code": "sc",      "hreflang": "zh-Hans", "label": "Simplified Chinese",   "pathPrefix": "/zh-hans" }
]
```

#### `eleventyComputed.js` -- Computed Data

Runs for every page at build time. Reads `contentGraph.json` and the current page's tags/metadata to inject:

- `related`: Array of 3--6 related page objects (based on topic affinity scores)
- `contextualLinks`: Array of in-content link suggestions for the page body

This automates internal linking without requiring authors to manually curate related content.

#### `buildInfo.js` -- Build Metadata

```js
export default {
  currentYear: new Date().getFullYear()   // e.g., 2026
};
```

Used in footer copyright text: `(c) 2023-{{ buildInfo.currentYear }}`

### 3.3 Data Flow Diagram

```
                   src/_data/
                       |
    +------------------+------------------+
    |                  |                  |
    v                  v                  v
 Static JSON       JS Modules        Computed
 (site, nav,       (zodiacYears,     (eleventyComputed)
  dynasties,        buildInfo)             |
  elements,             |                  | reads contentGraph.json
  contentGraph,         | generates        | + page front matter
  directory,            | array at         |
  shop,                 | build time       v
  newsCategories,       |            per-page related
  languages)            |            & contextualLinks
    |                   |                  |
    +-------------------+------------------+
                        |
                        v
              Eleventy Data Cascade
              (merged with front matter)
                        |
                        v
               Nunjucks Templates
```

---

## 4. Template Hierarchy

### 4.1 Layout Inheritance Chain

```
base.njk
  |
  +-- article.njk (extends base.njk)
  |     Used by: encyclopaedia pages, zodiac pages, readings,
  |              articles, year pages, wuxing pages, dynasty pages
  |
  +-- (direct use of base.njk)
        Used by: homepage, search, shop, directory, trivia,
                 calculator, 404, legal pages
```

### 4.2 `base.njk` -- Root Layout

Provides the full HTML document shell. Every page on the site ultimately renders through this layout.

**Block structure:**

```html
<!DOCTYPE html>
<html lang="{{ lang | default('en') }}">
<head>
    <!-- Meta: charset, viewport, description, canonical, og:*, twitter:* -->
    <!-- Hreflang tags (en, zh-Hant, zh-Hans, x-default) -->
    <!-- Google Fonts: Playfair Display, Source Sans 3, Noto Serif SC/TC -->
    <!-- CSS: /css/style.css -->
    <!-- JSON-LD structured data (Article, FAQPage, BreadcrumbList, etc.) -->
    <!-- GA4 gtag snippet (G-2QWWBEW512) -->
    <!-- AdSense script -->
</head>
<body>
    <script>/* Inline: theme + language init from localStorage */</script>

    {% include "partials/header.njk" %}

    {% block content %}{% endblock %}

    {% include "partials/email-popup.njk" %}
    {% include "partials/footer.njk" %}

    <script src="/js/site.js" defer></script>
    {% block extraScripts %}{% endblock %}
    {% if twitterEmbed %}<script async src="https://platform.twitter.com/widgets.js"></script>{% endif %}
</body>
</html>
```

**Key details:**
- The inline `<script>` in `<body>` runs before paint to set theme class and language class on `<html>`, preventing flash of wrong theme/language.
- JSON-LD schemas are conditionally rendered based on front matter flags and page type.
- Hreflang links are generated from `languages.json` using the page's URL path.

### 4.3 `article.njk` -- Content Page Layout

Extends `base.njk`. Provides the standard content page structure used by the majority of the site's pages.

```
{% extends "base.njk" %}

{% block content %}
  {% include "partials/breadcrumbs.njk" %}
  {% include "partials/hero.njk" %}

  <main class="content-wrapper">
    <article>
      {% include "partials/affiliate-disclosure.njk" %}   {# conditional #}

      {{ content | safe }}                                 {# page body #}

      {% if faq %}
        <!-- FAQ accordion section -->
      {% endif %}

      {% include "partials/cross-sell-cta.njk" %}           {# conditional: crossSellHidden !== true #}
      {% include "partials/content-upgrade.njk" %}           {# conditional #}
    </article>

    <aside class="sidebar">
      <!-- Table of Contents (auto-generated from h2/h3) -->
      {% include "partials/ad-unit.njk" %}
      {% include "partials/newsletter.njk" %}
    </aside>
  </main>

  {% include "partials/share-buttons.njk" %}
  {% include "partials/comments.njk" %}

  <!-- Related content cards (from eleventyComputed) -->
  {% if related | length %}
    <section class="related-cards">
      {% for item in related | limit(6) %}
        <!-- Card with title, description, link -->
      {% endfor %}
    </section>
  {% endif %}
{% endblock %}
```

### 4.4 Partial Templates

| Partial                      | Location                              | Description                                                        |
|------------------------------|---------------------------------------|--------------------------------------------------------------------|
| `header.njk`                 | `src/_includes/partials/header.njk`   | Site header with logo, primary nav, language toggle, theme toggle, search trigger |
| `footer.njk`                 | `src/_includes/partials/footer.njk`   | 3-column footer with nav links, newsletter signup, copyright       |
| `breadcrumbs.njk`            | `src/_includes/partials/breadcrumbs.njk` | Breadcrumb trail; also outputs BreadcrumbList JSON-LD            |
| `hero.njk`                   | `src/_includes/partials/hero.njk`     | Page hero with overline, title, subtitle; supports trilingual TC/SC via optional `heroTitleTc/Sc`, `heroSubtitleTc/Sc`, `heroOverlineTc/Sc` frontmatter fields wrapped in `<div class="lang-XX">` blocks for build-time stripping |
| `ad-unit.njk`                | `src/_includes/partials/ad-unit.njk`  | AdSense ad container (sidebar and in-content placements)           |
| `affiliate-disclosure.njk`   | `src/_includes/partials/affiliate-disclosure.njk` | FTC disclosure notice for pages with affiliate links  |
| `share-buttons.njk`          | `src/_includes/partials/share-buttons.njk` | Social sharing links (Twitter, Facebook, email, copy link)    |
| `newsletter.njk`             | `src/_includes/partials/newsletter.njk` | Beehiiv newsletter signup form (sidebar widget)                  |
| `content-upgrade.njk`        | `src/_includes/partials/content-upgrade.njk` | In-article lead magnet / content upgrade CTA                |
| `cross-sell-cta.njk`         | `src/_includes/partials/cross-sell-cta.njk` | Product/reading cross-sell CTA (two-card layout: readings + shop). Variants: `reading`, `product`, `both` (default). Auto-included in article layout; opt out with `crossSellHidden: true`. |
| `email-popup.njk`            | `src/_includes/partials/email-popup.njk` | Modal newsletter popup (triggered by scroll depth or exit intent) |
| `comments.njk`               | `src/_includes/partials/comments.njk` | Giscus comment widget (loads GitHub Discussions iframe)            |

### 4.5 Template Directory Structure

```
src/_includes/
  layouts/
    base.njk
    article.njk
  partials/
    header.njk
    footer.njk
    breadcrumbs.njk
    hero.njk
    ad-unit.njk
    affiliate-disclosure.njk
    share-buttons.njk
    newsletter.njk
    content-upgrade.njk
    cross-sell-cta.njk
    email-popup.njk
    comments.njk
```

---

## 5. Page Types & Collections

### 5.1 Page Inventory

| Page Type          | Count | Source Path            | Output Path            | Data Source                | Layout        |
|--------------------|-------|------------------------|------------------------|----------------------------|---------------|
| Encyclopaedia       | 34    | `src/pages/*.njk`      | `/pages/{slug}/`       | Front matter               | `article.njk` |
| Zodiac Animals     | 12    | `src/zodiac/*.njk`     | `/zodiac/{animal}/`    | Front matter               | `article.njk` |
| Yearly Readings    | 12    | `src/readings/*.njk`   | `/readings/{animal}/`  | Front matter (unique astro section per animal) | `article.njk` |
| Long-form Articles | 16    | `src/articles/*.njk`   | `/articles/{slug}/`    | Front matter + newsCategories | `article.njk` |
| Compatibility Pairs | 78   | Pagination template    | `/compatibility/{pair}/` | `compatibilityPairs.js`  | `article.njk` |
| Year Pages         | 121   | Pagination template    | `/year/{1924-2044}/`   | `zodiacYears.js`           | `article.njk` |
| Wu Xing Pages      | 5     | Pagination template    | `/wuxing/{element}/`   | `elements.json`            | `article.njk` |
| Dynasty Pages      | 10    | Pagination template    | `/dynasties/{slug}/`   | `dynastiesData.json`       | `article.njk` |
| Homepage           | 1     | `src/index.njk`        | `/`                    | Multiple data files        | `base.njk`    |
| Search             | 1     | `src/search.njk`       | `/search/`             | Client-side JSON index     | `base.njk`    |
| Calculator         | 1     | `src/calculator.njk`   | `/calculator/`         | Cloudflare Worker API      | `base.njk`    |
| Shop               | 1     | `src/shop.njk`         | `/shop/`               | `shop.json`                | `base.njk`    |
| Directory          | 1     | `src/directory.njk`    | `/directory/`          | `directory.json`           | `base.njk`    |
| Trivia             | 1     | `src/trivia.njk`       | `/trivia/`             | Inline + `trivia.js`       | `base.njk`    |
| Legal/About        | ~4    | `src/pages/`           | `/about/`, `/privacy/`, etc. | Front matter          | `base.njk`    |
| **Total (pre-i18n)** | **~293** |                    |                        |                            |               |
| **Total (post-i18n)** | **~879** |                  | + `/zh-hant/*` + `/zh-hans/*` |                       |               |

### 5.2 Collections Defined in `eleventy.config.js`

| Collection Name        | Source                               | Tag / Glob                | Count |
|------------------------|--------------------------------------|---------------------------|-------|
| `articles`             | All articles                         | Tag: `articles`           | 10    |
| `articles_zodiac_basics` | Articles in zodiac-basics category | Tag: `articles_zodiac_basics` | varies |
| `articles_feng_shui`  | Articles in feng-shui category       | Tag: `articles_feng_shui` | varies |
| `articles_compatibility` | Articles in compatibility category | Tag: `articles_compatibility` | varies |
| `articles_culture`    | Articles in culture category         | Tag: `articles_culture`   | varies |
| `articles_predictions` | Articles in predictions category    | Tag: `articles_predictions` | varies |
| `encyclopedia`         | All encyclopedia pages               | Tag: `encyclopedia`       | 34    |
| `readings`             | Zodiac reading pages                 | Tag: `readings`           | 12    |
| `yearlyReadings`       | Yearly reading pages (alias/subset)  | Tag: `yearlyReadings`     | 12    |

### 5.3 Pagination-Generated Pages

These pages do not exist as individual `.njk` files. A single template uses Eleventy's pagination feature to generate multiple output pages from a data array.

**Year Pages (121 pages)**
```
---
pagination:
  data: zodiacYears
  size: 1
  alias: yearData
permalink: "/year/{{ yearData.year }}/"
---
```
Generates `/year/1924/` through `/year/2044/`. Each page displays the animal, element, Heavenly Stem, and yin/yang for that year.

**Wu Xing Pages (5 pages)**
```
---
pagination:
  data: elements
  size: 1
  alias: element
permalink: "/wuxing/{{ element.slug }}/"
---
```
Generates `/wuxing/wood/`, `/wuxing/fire/`, `/wuxing/earth/`, `/wuxing/metal/`, `/wuxing/water/`.

**Dynasty Pages (10 pages)**
```
---
pagination:
  data: dynastiesData
  size: 1
  alias: dynasty
permalink: "/dynasties/{{ dynasty.slug }}/"
---
```
Generates `/dynasties/xia/` through `/dynasties/ming/`.

### 5.4 Readings -- Unique Astrological Sections

Each of the 12 yearly reading pages (`src/readings/*.njk`) contains a unique astrological analysis section specific to that zodiac animal. These are hand-authored, not generated from data. They include:

- Annual element interaction with the animal's native element
- Monthly highlights and challenging periods
- Career, health, and relationship forecasts
- Lucky numbers, colors, and directions for the year

---

## 6. i18n Architecture

### 6.1 Design Philosophy

The site uses a **build-time i18n approach** rather than runtime translation. All three language variants are embedded in the same source template using CSS class markers. The `eleventy.after` hook then strips non-active languages and generates separate output directories for each locale.

This means:
- No translation API calls at runtime
- No JavaScript needed for language rendering (only for the toggle UI)
- Every language variant is a fully static, self-contained HTML page
- SEO-friendly: each language gets its own URL path, canonical, and hreflang

### 6.2 Source Authoring Pattern

Content authors write trilingual blocks inline using CSS classes:

```html
<!-- Block-level content (divs) -->
<div class="lang-en">
  <h2>The Five Elements</h2>
  <p>Wood, Fire, Earth, Metal, and Water form the foundation...</p>
</div>
<div class="lang-tc">
  <h2>...</h2>    <!-- Traditional Chinese -->
  <p>...</p>
</div>
<div class="lang-sc">
  <h2>...</h2>    <!-- Simplified Chinese -->
  <p>...</p>
</div>

<!-- Inline content (spans) -->
<span class="lang-en">Year of the Dragon</span>
<span class="lang-tc">...</span>
<span class="lang-sc">...</span>
```

During the initial Eleventy build, all three variants are present in the output HTML. CSS hides non-active languages by default (only `lang-en` visible). The client-side language toggle switches visibility via a class on `<html>`.

### 6.3 Build-Time Stripping Process

The `eleventy.after` hook performs the following for each HTML file:

```
For each .html file in _site/:
  |
  +-- Read file content
  |
  +-- Generate /zh-hant/ variant:
  |     1. Strip <div class="lang-en">...</div> (balanced tag matching)
  |     2. Strip <div class="lang-sc">...</div>
  |     3. Strip <span class="lang-en">...</span> (regex)
  |     4. Strip <span class="lang-sc">...</span>
  |     5. Unwrap <div class="lang-tc">...</div> (keep inner content)
  |     6. Unwrap <span class="lang-tc">...</span>
  |     7. Replace <html lang="en"> with <html lang="zh-Hant">
  |     8. Update canonical URL to include /zh-hant/ prefix
  |     9. Update og:url to include /zh-hant/ prefix
  |    10. Write to _site/zh-hant/{original-path}
  |
  +-- Generate /zh-hans/ variant:
  |     (same process but keeping lang-sc, stripping lang-en and lang-tc)
  |     Replace lang with "zh-Hans", prefix with /zh-hans/
  |
  +-- English variant:
        The original file at its original path IS the English variant.
        No additional processing needed (CSS already shows lang-en by default).
```

**Balanced tag matching:** For `<div>` elements, the stripper tracks nesting depth to handle divs inside language blocks correctly. It does not use a simple regex for divs because language blocks can contain arbitrary nested HTML.

**Regex matching:** For `<span>` elements, a regex is sufficient because language spans are always leaf-level (no nested spans inside).

### 6.4 URL Structure

| Language             | Path Prefix  | Example URL                                      |
|----------------------|--------------|--------------------------------------------------|
| English (default)    | (none)       | `https://chinesezodiacyear.com/zodiac/dragon/`   |
| Traditional Chinese  | `/zh-hant`   | `https://chinesezodiacyear.com/zh-hant/zodiac/dragon/` |
| Simplified Chinese   | `/zh-hans`   | `https://chinesezodiacyear.com/zh-hans/zodiac/dragon/` |

### 6.5 Hreflang Implementation

Every page outputs hreflang tags for all three variants plus `x-default`:

```html
<link rel="alternate" hreflang="en" href="https://chinesezodiacyear.com/zodiac/dragon/" />
<link rel="alternate" hreflang="zh-Hant" href="https://chinesezodiacyear.com/zh-hant/zodiac/dragon/" />
<link rel="alternate" hreflang="zh-Hans" href="https://chinesezodiacyear.com/zh-hans/zodiac/dragon/" />
<link rel="alternate" hreflang="x-default" href="https://chinesezodiacyear.com/zodiac/dragon/" />
```

Generated in `base.njk` by iterating over `languages.json`.

### 6.6 Client-Side Language Toggle

#### Language Detection (inline `<script>` in `base.njk`)

A blocking inline script runs before render to prevent FOUC:

1. Detects current language **from the URL path** (`/zh-hant/` → TC, `/zh-hans/` → SC, everything else → EN)
2. Sets `data-lang` attribute on `<html>` to control CSS visibility of `lang-en`/`lang-tc`/`lang-sc` blocks
3. Writes the detected language to `localStorage` key `czy-lang` (syncing storage to URL, not the other way around)
4. Sets `lang` attribute on `<html>` for accessibility (`en`, `zh-Hant`, or `zh-Hans`)

**Important:** The language is always derived from the URL, never from localStorage. This prevents a mismatch where localStorage remembers TC/SC but the page URL serves English content.

#### Toggle Button (`site.js`)

The toggle button cycles EN → TC → SC → EN and **navigates** to the corresponding URL:

1. Reads current language from `data-lang` attribute
2. Computes next language in the cycle
3. Strips any existing `/zh-hant/` or `/zh-hans/` prefix from the path
4. Navigates to the new language-prefixed URL (or bare path for EN)

#### Language-Aware Navigation (`site.js`)

When the page is on a language-prefixed path (`/zh-hant/` or `/zh-hans/`), an IIFE rewrites all internal navigation links (header nav, logo, search link, footer links) to include the current language prefix. This ensures clicking a nav link preserves the user's language selection instead of falling back to the English base URL. Non-HTML resources (e.g., `/sitemap.xml`) and external links are excluded from rewriting.

### 6.7 Page Count Multiplication

```
Base pages (pre-i18n):     293
  x 3 language variants:   879
  + search-index.json:       1
  + sitemap.xml, etc.:      ~5
                           -----
Total output files:        880+
```

---

## 7. Client-Side Architecture

### 7.1 JavaScript Architecture

The site ships two JavaScript bundles, both built by esbuild during the `eleventy.after` hook:

| File         | Architecture | Purpose                                    | Loaded On          |
|--------------|-------------|--------------------------------------------|--------------------|
| `site.js`    | 22 ES modules → single IIFE (36.2KB) | Core site functionality  | Every page (defer) |
| `trivia.js`  | Standalone minified | Trivia game engine                 | `/trivia/` only    |

No framework. No npm runtime dependencies in the browser.

### 7.2 JS Module Structure

```
src/js/
  main.js                         # Entry point — imports + initialises all features
  analytics.js                    # Centralised GA4 tracking (track() helper)
  utils/
    sanitise.js                   # Unified escapeHtml() + cleanText()
    base-path.js                  # GitHub Pages subpath detection
  data/
    zodiac-data.js                # 12 zodiac animals + getZodiac(), getElement(), getHeavenlyStem()
    famous-figures.js             # Historical figures array (one per animal)
    lichun-dates.js               # 1900-2100 Lichun boundary table + getZodiacYear()
    compatibility-data.js         # Six Harmonies, Three Harmonies, Clashes, Harms, Self-Penalty
  features/
    nav.js                        # Mobile nav toggle, dropdown menus, active state
    theme.js                      # Dark mode toggle + localStorage + prefers-color-scheme
    faq.js                        # FAQ accordion open/close with ARIA
    calculator.js                 # Zodiac calculator form + result rendering
    compatibility.js              # Compatibility checker form + result rendering
    search.js                     # Search index fetch, weighted scoring, results
    bazi-client.js                # BaZi API client + chart result renderer
    newsletter.js                 # Beehiiv form submission (loading/success/error states)
    popup.js                      # Exit-intent email popup (desktop + mobile triggers)
    filters.js                    # Directory/shop/news filter buttons
    lightbox.js                   # QR code lightbox (donate page)
    language.js                   # Language toggle + URL rewriting + nav link preservation
    share-buttons.js              # Social share buttons
    shop.js                       # Shop filters + AdSense init
```

**Legacy:** `src/site.js` (1,339-line monolithic) remains in the repo but is no longer used by the build. esbuild's output overwrites `_site/site.js`.

### 7.3 CSS Architecture

43 modular CSS files under `src/css/`, bundled by esbuild into a single `_site/styles.css` (100.4KB minified):

```
src/css/
  main.css                        # @import chain — cascade order preserved
  tokens/                         # Design tokens (5 files)
    colors.css                    # Colour palette (~25 custom properties)
    typography.css                # Font stacks (5 families)
    spacing.css                   # Spacing scale + layout vars
    shadows.css                   # Shadows, transitions, border radii
    animations.css                # Gold scale, paper texture, ink-wash mist
  base/                           # Foundation (4 files)
    reset.css                     # Box-sizing, html, body
    accessibility.css             # Skip-to-content, .sr-only
    typography.css                # Headings, paragraphs, links, decorative dividers
    i18n.css                      # .lang-en/.lang-tc/.lang-sc visibility rules
  layout/                         # Page structure (3 files)
    header.css                    # Site header, nav, mobile menu, dropdowns, toggles
    footer.css                    # Footer columns, pagination
    article-layout.css            # Article grid, sidebar, TOC
  components/                     # UI components (21 files)
    hero.css, buttons.css, breadcrumbs.css, calculator.css,
    cards.css, faq.css, directory.css, newsletter.css, search.css,
    comments.css, tables.css, share-buttons.css, readings.css,
    bazi.css, trivia.css, content-elements.css, donate.css,
    embeds.css, popup.css, cross-sell.css, content-upgrade.css,
    compatibility.css, related.css, shop.css
  themes/                         # Dark mode (2 files)
    dark.css                      # All [data-theme="dark"] overrides consolidated
    auto-dark.css                 # prefers-color-scheme: dark (OS-level)
  utilities/                      # Helper classes (5 files)
    spacing.css, text.css, animations.css, print.css, reduced-motion.css
```

**Legacy:** `src/styles.css` (5,590-line monolithic) remains in the repo but is no longer used by the build.

### 7.4 Search Index

Built at build time, output to `/search-index.json`. Each entry:

```json
{
  "url": "/zodiac/dragon/",
  "title": "Year of the Dragon",
  "description": "Everything about the Dragon zodiac sign...",
  "category": "zodiac",
  "keywords": ["dragon", "zodiac", "chen", "..."],
  "body": "First 500 characters of page body text, stripped of HTML tags..."
}
```

The index contains one entry per English page (~293 entries). Chinese variant pages are not separately indexed; the search page uses the active language to display results but searches against English text.

---

## 8. Integration Points

### 8.1 Integration Map

```
+-----------------------------------------------------------+
|                  chinesezodiacyear.com                     |
|                     (GitHub Pages)                         |
+------+--------+--------+--------+--------+--------+-------+
       |        |        |        |        |        |
       v        v        v        v        v        v
   +------+ +------+ +------+ +------+ +------+ +------+
   | GA4  | | Ad-  | | Bee- | | Gis- | | CF   | | Decap|
   |      | | Sense| | hiiv | | cus  | | Work-| | CMS  |
   |      | |      | |      | |      | | er   | |      |
   +------+ +------+ +------+ +------+ +------+ +------+
    Client   Client   Client   Client   Client   Admin
    Side     Side     Side     Side     Side     Panel
```

### 8.2 Google Analytics 4

| Property          | Value              |
|-------------------|--------------------|
| Measurement ID    | `G-2QWWBEW512`    |
| Integration Point | `base.njk` `<head>` via gtag.js snippet |
| Custom Events     | `calculator_use`, `language_switch`, `theme_toggle`, `newsletter_signup`, `search_query`, `trivia_start`, `faq_expand`, `share_click`, `outbound_link` |

The gtag snippet loads asynchronously in `<head>`. Custom events are fired from `site.js` via `gtag('event', ...)`.

### 8.3 Google AdSense

| Property          | Value              |
|-------------------|--------------------|
| Integration Point | `base.njk` `<head>` (auto ads script) + `ad-unit.njk` partial |
| Placement Types   | Auto ads (site-wide) + manual placements (sidebar, in-content) |

The `ad-unit.njk` partial renders `<ins class="adsbygoogle">` containers at specific positions in the article layout (sidebar and between content sections).

### 8.4 Beehiiv Newsletter

| Property          | Value              |
|-------------------|--------------------|
| Integration Point | `newsletter.njk` partial (sidebar), `email-popup.njk` (modal), `footer.njk` |
| Method            | Embedded form posting to Beehiiv's subscription endpoint |
| Configuration     | Publication ID and embed URL stored in `site.json` |

Three signup entry points: sidebar widget on article pages, exit-intent/scroll popup, and footer signup form. All submit to the same Beehiiv publication.

### 8.5 Giscus Comments

| Property          | Value              |
|-------------------|--------------------|
| Integration Point | `comments.njk` partial |
| Backend           | GitHub Discussions on the site's repository |
| Configuration     | Repo, repo ID, category, and category ID stored in `site.json` |
| Loading           | Lazy-loaded iframe (only loads when scrolled into view) |

Each page's discussion thread is mapped by its URL pathname. Comments are stored as GitHub Discussion replies.

### 8.6 Cloudflare Worker (BaZi Calculator API)

| Property          | Value              |
|-------------------|--------------------|
| Integration Point | `src/js/features/bazi-client.js` → Worker endpoint |
| Purpose           | Server-side BaZi (Four Pillars) calculation with resilience |
| Protocol          | HTTPS POST from browser to Worker endpoint |
| Runtime Entrypoint| `wrangler.jsonc` → `main: "worker/index.js"` |
| Deployment        | Automated via CI (`deploy.yml` → `wrangler deploy`) |
| Bindings          | `RATE_LIMIT_KV` (KV namespace), `ALLOWED_ORIGINS` (env var) |

#### Worker Directory Structure

```
worker/
  index.js                    # Entry: router dispatch + CORS + error handler
  router.js                   # Lightweight path/method router (no deps)
  routes/
    bazi.js                   # POST /v1/bazi/calculate
    health.js                 # GET /v1/health
  services/
    bazi-service.js           # Orchestrates: cache → solar time → chart → cache
    solar-time-service.js     # True Solar Time wrapper with circuit breaker + retry
  adapters/
    windada-adapter.js        # Scraper: fate.windada.com (True Solar Time)
    zhouyi-adapter.js         # Scraper: zhouyi.cc (BaZi chart parsing)
  models/
    bazi-request.js           # Request validation & normalization
    bazi-response.js          # Response schema typedefs + validation
    pillar.js                 # Four Pillars helpers (buildPillar, extractDayMaster)
    errors.js                 # ValidationError, UpstreamError, TimeoutError, CircuitOpenError
  middleware/
    cors.js                   # CORS origin resolution (ALLOWED_ORIGINS env var)
    rate-limiter.js           # Dual-layer: in-memory (15 req/min) + KV (cross-edge)
    error-handler.js          # Typed error → structured JSON response mapping
  lib/
    cache.js                  # Cache API wrapper (SHA-256 keyed, 24h TTL)
    circuit-breaker.js        # Per-upstream state machine (5 failures → 30s recovery)
    retry.js                  # Exponential backoff (2 retries, 500ms base)
    html-parser.js            # stripTags(), cleanText() utilities
  data/
    stems.js                  # Heavenly Stems + Earthly Branches reference
  __tests__/                  # 64 vitest tests (parsers, models, resilience)
    adapters/, models/, lib/, routes/
    fixtures/                 # Saved upstream HTML for deterministic testing
```

#### API Endpoints

| Method | Path | Handler | Description |
|--------|------|---------|-------------|
| POST | `/v1/bazi/calculate` | `handleBaziCalculate` | Calculate BaZi chart |
| POST | `/` | `handleBaziCalculate` | Legacy backwards-compatible alias |
| GET | `/v1/health` | `handleHealth` | Health check |
| OPTIONS | `*` | `handlePreflight` | CORS preflight (204) |

#### Request Processing Pipeline

```
fetch(request, env)
  → resolveCorsOrigin() → buildCorsHeaders()
  → handlePreflight() [if OPTIONS]
  → checkRateLimit() [Layer 1: in-memory | Layer 2: KV]
  → router.match(method, pathname)
  → handler()
    → validateBaziRequest()
    → bazi-service.calculate(input)
      → cacheGet(input)                  [Cache API, SHA-256 key]
      → getSolarTime(params)             [circuit breaker + retry]
        → windada-adapter.fetchSolarTime()
      → fetchChart()                     [circuit breaker + retry]
        → zhouyi-adapter.fetchChart()
      → cachePut(input, result)          [async, fire-and-forget]
    → Response.json(result)
    → errorToResponse(error)             [on failure]
```

#### Resilience Stack

| Layer | Mechanism | Configuration |
|-------|-----------|---------------|
| Caching | Cache API (deterministic BaZi charts) | SHA-256 keyed, 24h TTL, graceful degradation |
| Circuit breaker | Per-upstream state machine | 5 failures → OPEN, 30s recovery → HALF_OPEN probe |
| Retry | Exponential backoff | 2 retries, 500ms/1s delays, non-retryable errors bail immediately |
| Rate limiting | Dual-layer (in-memory + KV) | 15 req/IP/min, ~60s cross-edge consistency |
| Graceful degradation | Solar time fallback | If windada fails → use clock time instead |

#### Error Mapping

| Error Type | HTTP Status | Retryable |
|-----------|-------------|-----------|
| ValidationError | 400 | No |
| UpstreamError | 502 | Yes |
| TimeoutError | 504 | Yes |
| CircuitOpenError | 503 | Yes |
| Unrecognised | 500 | No |

```
Browser                    Cloudflare Worker            Upstream Services
   |                             |                            |
   |  POST /v1/bazi/calculate    |                            |
   |  { year, month, day, hour,  |                            |
   |    minute, lat, lng, tz,    |                            |
   |    sex }                    |                            |
   |---------------------------->|                            |
   |                             |  1. Check cache (SHA-256)  |
   |                             |  2. If miss:               |
   |                             |     GET solar time -------->| fate.windada.com
   |                             |     (circuit breaker+retry) |
   |                             |     POST BaZi chart ------->| www.zhouyi.cc
   |                             |     (circuit breaker+retry) |
   |                             |  3. Store in cache (async)  |
   |  200 OK                     |                            |
   |  { pillars, dayMaster,      |                            |
   |    hiddenStems, naYin,      |                            |
   |    daYun, basicInfo,        |                            |
   |    fiveElements,            |                            |
   |    readingSections,         |                            |
   |    trueSolarTime }          |                            |
   |<----------------------------|                            |
```

**Legacy file status:** `worker/bazi-worker.js` and `worker/wrangler.toml` are legacy files superseded by the modular structure. Production uses `worker/index.js` configured in root `wrangler.jsonc`.

### 8.7 Decap CMS

| Property          | Value              |
|-------------------|--------------------|
| Integration Point | `/admin/` path on the site |
| Backend           | Git (commits directly to GitHub repository) |
| Authentication    | GitHub OAuth                               |
| Content Model     | Configured to edit encyclopaedia pages, articles, readings |

Decap CMS provides a web-based editing interface at `/admin/`. Content editors authenticate via GitHub, and edits are committed directly to the repository. Pushing to `main` triggers the CI/CD pipeline to rebuild and deploy.

### 8.8 Google Fonts

| Font               | Weight(s)     | Usage                                      |
|--------------------|---------------|--------------------------------------------|
| Playfair Display   | 400, 700      | Headings (h1-h4)                           |
| Source Sans 3      | 300, 400, 600 | Body text, navigation, UI elements         |
| Noto Serif TC      | 400, 700      | Traditional Chinese content                |
| Noto Serif SC      | 400, 700      | Simplified Chinese content                 |

Loaded via Google Fonts CDN with `display=swap` to prevent FOIT (flash of invisible text). Chinese fonts are subset by the CDN based on the characters used on the page.

---

## 9. Deployment Flow

### 9.1 CI/CD Pipeline (GitHub Actions)

Triggered automatically on every push to the `main` branch. Four-job pipeline with dependency gates:

```
Developer / Decap CMS
        |
        | git push to main
        v
+-------------------------------------------------------+
|  GitHub Actions: deploy.yml                            |
|                                                        |
|  Job 1: TEST                                           |
|    1. actions/checkout@v4                               |
|    2. actions/setup-node@v4 (Node 20)                  |
|    3. npm ci                                            |
|    4. npm test (vitest — 64 tests)                     |
|    5. npm audit --audit-level=high                     |
|                                                        |
|  Job 2: BUILD (needs: test)                            |
|    1. actions/checkout@v4                               |
|    2. npm ci                                            |
|    3. npx @11ty/eleventy                                |
|       - Builds 298 base pages                          |
|       - eleventy.after: esbuild CSS (44 files → 1)    |
|       - eleventy.after: esbuild JS (22 modules → 1)   |
|       - eleventy.after: generate i18n pages            |
|       - Output: 634 pages in _site/                    |
|    4. Build validation step                            |
|       - Asserts base page count >= 250                 |
|       - Asserts zh-hant/zh-hans >= 150 each           |
|       - Asserts CSS bundle >= 50KB (esbuild ran)      |
|       - Asserts JS bundle >= 1KB (esbuild ran)        |
|       - Asserts critical files present                 |
|       - Spot-checks HTML structure                     |
|    5. actions/upload-pages-artifact                     |
|                                                        |
|  Job 3: DEPLOY-PAGES (needs: build)                   |
|    1. actions/deploy-pages                              |
|       - Deploys artifact to GitHub Pages               |
|       - Custom domain: chinesezodiacyear.com           |
|                                                        |
|  Job 4: DEPLOY-WORKER (needs: test)                   |
|    1. wrangler deploy                                   |
|       - Deploys worker/index.js to Cloudflare Edge     |
|       - Uses CLOUDFLARE_API_TOKEN secret               |
+-------------------------------------------------------+
        |                          |
        v                          v
  GitHub Pages CDN         Cloudflare Edge Network
  (static frontend)        (BaZi Calculator API)
```

### 9.2 Deployment Architecture

Frontend and Worker deploy independently but share the test gate:

```
                    +-------------------+
                    |   npm packages    |
                    | (package-lock.json)|
                    +--------+----------+
                             |
                    +--------v----------+
                    |  TEST (vitest +   |
                    |  npm audit)       |
                    +---+----------+----+
                        |          |
               +--------v---+  +--v-----------+
               | BUILD      |  | DEPLOY-WORKER|
               | (Eleventy) |  | (wrangler)   |
               +-----+------+  +------+-------+
                     |                 |
               +-----v------+  +------v-------+
               | DEPLOY-     |  | Cloudflare   |
               | PAGES       |  | Edge Network |
               +-----+------+  +--------------+
                     |
               +-----v------+
               | GitHub      |
               | Pages CDN   |
               +-------------+
```

The Worker is configured by root `wrangler.jsonc` (with `main: worker/index.js`) and is deployed manually or via a separate CI step. It does not depend on the Eleventy build.

### 9.3 Deployment Dependencies

```
                    +-------------------+
                    |   npm packages    |
                    | (package-lock.json)|
                    +--------+----------+
                             |
                             v
+----------------+  +--------+----------+  +-------------------+
| Source files   |->| Eleventy Build    |->| GitHub Pages      |
| (src/)         |  | (GitHub Actions)  |  | (Static hosting)  |
+----------------+  +-------------------+  +-------------------+

+----------------+  +-------------------+  +-------------------+
| Worker source  |->| wrangler deploy   |->| Cloudflare Edge   |
| (worker/)      |  | (GitHub Actions)  |  | (worker/index.js) |
+----------------+  +-------------------+  +-------------------+
```

### 9.4 Build Performance

| Metric                            | Approximate Value        |
|-----------------------------------|--------------------------|
| Eleventy template rendering       | ~2-4 seconds             |
| CSS bundling (esbuild, 44 files)  | < 100ms                  |
| JS bundling (esbuild, 22 modules) | < 100ms                  |
| Trivia minification (esbuild)     | < 50ms                   |
| i18n page generation (634 files)  | ~3-6 seconds             |
| Image processing (if cache miss)  | ~10-30 seconds           |
| **Total CI/CD pipeline**          | **~1-2 minutes**         |

Image processing via `@11ty/eleventy-img` is cached between builds. First builds or builds with new images take longer.

### 9.5 Environment Requirements

| Requirement       | Specification                        |
|-------------------|--------------------------------------|
| Node.js           | 20.x (specified in CI workflow)      |
| npm               | Ships with Node 20                   |
| Eleventy          | 3.1.2 (pinned in package.json)       |
| GitHub Pages      | Enabled on repository, custom domain |
| Wrangler CLI      | For Cloudflare Worker deployments    |

---

## 10. Current Limitations & Future Considerations

### 10.1 Known Issues (from Audit)

| Issue | Severity | Detail | Recommendation |
|-------|----------|--------|----------------|
| ~~Missing JSON-LD on hub pages~~ | ~~Medium~~ | ~~Zodiac index, Wu Xing index, and Dynasties index lack structured data schemas.~~ | **RESOLVED** -- All 5 hubs now emit CollectionPage + ItemList JSON-LD via `hubSchema` frontmatter. |
| ~~Empty search index categories~~ | ~~Low~~ | ~~15 search index entries had empty `category` strings.~~ | **RESOLVED** -- Year pages now have `category: "encyclopedia"`; only homepage remains uncategorized (expected). |
| ~~No `noindex` on `/search/`~~ | ~~Low~~ | ~~The `/search/` page was indexable by search engines.~~ | **RESOLVED** -- `noindex: true` in frontmatter; `base.njk` renders `<meta name="robots" content="noindex, follow">`. |
| Client-side search scalability | Low (future) | Search loads the full JSON index (~302 entries, ~250KB) into memory and performs linear scanning. This works well at the current scale but will degrade past ~500 pages. | If page count grows significantly, consider a server-side search solution (e.g., Pagefind, Lunr pre-built index, or Algolia). |
| Monolithic build config | Low | `eleventy.config.js` handles collections, filters, shortcodes, CSS/JS bundling, and i18n generation in a single file. As the site grows, this becomes harder to maintain. | Modularize into separate files: `config/collections.js`, `config/filters.js`, `config/shortcodes.js`, `config/i18n.js`, `config/build.js`. Import them into the main config. |

### 10.2 Architecture Risks

**Single point of failure: `eleventy.after` hook.** The i18n generation and asset bundling both run in the `eleventy.after` event. If either fails, the build succeeds (Eleventy considers the build complete before `after` runs) but the output is incomplete — missing i18n pages or unbundled assets.

**Mitigation (IMPLEMENTED):** A 4-job CI pipeline in `deploy.yml` runs tests before build, and validates build output before deployment:
- CSS bundle size >= 50KB (confirms esbuild CSS ran)
- JS bundle size >= 1KB (confirms esbuild JS ran)
- Base pages >= 250, i18n pages >= 150 each
- Critical files exist: `sitemap.xml`, `robots.txt`, `feed.xml`, `search-index.json`, `llms.txt`

**i18n stripping correctness.** The balanced tag matcher for `<div>` language blocks assumes well-formed HTML. Malformed nesting (e.g., an unclosed `<div>` inside a language block) could cause the stripper to consume too much or too little content.

**Mitigation (PLANNED):** Phase 4 includes adding i18n validation and extracting stripping logic for independent unit testing.

**No persistent database.** Revenue-critical data (directory listings, product catalog, content calendar) lives in git-committed JSON files. This prevents runtime updates, dynamic pricing, or transaction tracking without code deployment. See Section 11 for the migration plan.

### 10.3 Scaling Considerations

| Threshold               | Current State       | Action Needed When Exceeded                          |
|--------------------------|--------------------|----------------------------------------------------|
| Total pages > 1,000     | ~634 (post-i18n)   | Evaluate build time; consider incremental builds    |
| Search index > 500 entries | ~293            | Move to Pagefind or server-side search              |
| CSS modules > 60        | 43                 | Current approach is fine                             |
| JS modules > 40         | 22                 | Current approach is fine                             |
| Data files > 20         | 14                 | Consider D1 database for dynamic data               |
| Images > 500            | Current count TBD  | Ensure eleventy-img cache is working in CI          |

### 10.4 Potential Improvements

1. **Pagefind integration.** Replace the custom client-side search with [Pagefind](https://pagefind.app/), which generates a compressed search index at build time with sub-millisecond search performance. It supports multilingual search natively, which would cover the Chinese variants.

2. **Build config modularization.** Split `eleventy.config.js` into focused modules:
   ```
   config/
     collections.js    # All collection definitions
     filters.js        # All Nunjucks filters
     shortcodes.js     # respimg and future shortcodes
     i18n.js           # Language block stripping logic
     build.js          # esbuild JS + CSS bundling
   ```

3. **JSON-LD automation.** Rather than manually adding schemas per page, generate JSON-LD programmatically in `eleventyComputed.js` based on page type (article, FAQ, product, etc.) and front matter fields.

4. **Content preview for Decap CMS.** Currently, Decap CMS authors cannot preview how trilingual content will render across all three language variants. A local preview proxy or Decap's custom preview feature could improve the authoring experience.

5. **Incremental builds.** Eleventy 3.x supports `--incremental` mode. Enabling this in the CI workflow (with proper cache configuration) would reduce build times as the page count grows.

---

## 11. Data Layer Review & Database Plan

> **Added:** 2026-03-27 (architecture review)
> **Status:** Planned — not yet implemented

### 11.1 Current Data Storage

All data lives in files committed to git. There is no persistent database.

| Storage Layer | What's Stored | Limitations |
|---------------|---------------|-------------|
| `src/_data/*.json` | Directory listings, products, content calendar, elements, dynasties | Read-only at runtime; changes require git commit + deploy |
| `src/_data/*.js` | Generated data (zodiac years, compatibility pairs, computed links) | Deterministic; no limitation |
| `src/js/data/*.js` | Client-side reference (zodiac, compatibility, famous figures, lichun) | Static; bundled into JS |
| `worker/data/stems.js` | Heavenly Stems + Earthly Branches | Static reference; no limitation |
| Cloudflare KV | Rate limit counters only | Underutilised |
| Cloudflare Cache API | BaZi calculation results (24h TTL) | Ephemeral read-only cache |

### 11.2 Data Classification

| File | Size | Category | Database Candidate | Priority |
|------|------|----------|-------------------|----------|
| `directory.json` | 20 KB | Business listings | **YES — CRITICAL** | Revenue (lead-gen) |
| `shop.json` | 26 KB | Product catalog + pricing | **YES — CRITICAL** | Revenue (sales tracking) |
| `contentCalendar.json` | 7.3 KB | Editorial workflow | **YES — HIGH** | Ops (publication tracking) |
| `elements.json` | 8.8 KB | Encyclopedic reference | Maybe | Low |
| `cities.json` | 22 KB | Geolocation reference (183 cities) | Maybe | Low (if scaling) |
| `dynastiesData.json` | 41 KB | Encyclopedic reference | Maybe | Low |
| `site.json` | 1.4 KB | Configuration | No | — |
| `nav.json` | 6.7 KB | Navigation structure | No | — |
| `languages.json` | 315 B | i18n config | No | — |
| `newsCategories.json` | 1.7 KB | Taxonomy | No | — |
| `zodiacYears.js` | 3.3 KB | Generated (deterministic) | No | — |
| `compatibilityPairs.js` | 41 KB | Generated (deterministic) | No | — |
| `zodiac-data.js` (JS) | 2.1 KB | Static reference | No | — |
| `compatibility-data.js` (JS) | 479 B | Static reference | No | — |
| `famous-figures.js` (JS) | 3.9 KB | Static reference | No | — |
| `lichun-dates.js` (JS) | 3.0 KB | Astronomical reference | No | — |

### 11.3 Recommended Database: Cloudflare D1

**Why D1:**
- Same deployment pipeline as existing Worker (`wrangler deploy`)
- SQLite at the edge — sub-millisecond reads
- SQL queries for filtering, sorting, aggregation
- Transactions for payment/order records
- Free tier: 5M reads/day, 100K writes/day
- No additional infrastructure or billing accounts

**Supplementary: Cloudflare R2** (object storage) for generated PDF reports.

### 11.4 Proposed Schema

```sql
-- Directory listings (currently directory.json)
CREATE TABLE directory_listings (
  id              INTEGER PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  tier            TEXT NOT NULL DEFAULT 'free',  -- free | premium | featured
  category        TEXT NOT NULL,
  location        TEXT,
  specialties     TEXT,  -- JSON array
  description     TEXT,
  url             TEXT,
  contact         TEXT,
  tier_expires_at TEXT,  -- ISO date, NULL for free tier
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

-- Products (currently shop.json)
CREATE TABLE products (
  id              INTEGER PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  type            TEXT NOT NULL,  -- reading | digital | physical
  name            TEXT NOT NULL,
  name_tc         TEXT,
  name_sc         TEXT,
  description     TEXT,
  price_cents     INTEGER NOT NULL,
  currency        TEXT DEFAULT 'USD',
  payment_url     TEXT,
  active          INTEGER DEFAULT 1,
  created_at      TEXT DEFAULT (datetime('now'))
);

-- PDF report templates (for BaZi PDF revenue initiative)
CREATE TABLE report_templates (
  id              INTEGER PRIMARY KEY,
  report_type     TEXT NOT NULL,  -- bazi_natal | compatibility
  section_key     TEXT NOT NULL,
  condition       TEXT,  -- JSON: matching criteria for template selection
  content_en      TEXT NOT NULL,
  content_tc      TEXT,
  content_sc      TEXT,
  sort_order      INTEGER DEFAULT 0
);

-- Transactions (track sales)
CREATE TABLE transactions (
  id              INTEGER PRIMARY KEY,
  product_id      INTEGER REFERENCES products(id),
  report_type     TEXT,
  amount_cents    INTEGER NOT NULL,
  currency        TEXT DEFAULT 'USD',
  email           TEXT,
  status          TEXT DEFAULT 'pending',  -- pending | completed | refunded
  metadata        TEXT,  -- JSON
  created_at      TEXT DEFAULT (datetime('now'))
);
```

### 11.5 Worker Route Expansion (with D1)

```
worker/
  routes/
    bazi.js              # POST /v1/bazi/calculate        (existing)
    health.js            # GET  /v1/health                (existing)
    directory.js         # GET  /v1/directory              (planned)
    products.js          # GET  /v1/products               (planned)
    reports.js           # POST /v1/reports/generate       (planned)

  services/
    bazi-service.js      # BaZi calculation                (existing)
    solar-time-service.js # Solar time                     (existing)
    directory-service.js  # Directory CRUD + tier management (planned)
    product-service.js    # Product catalog queries         (planned)
    report-service.js     # PDF generation + template assembly (planned)

  repositories/          # NEW — data access layer
    directory-repo.js    # D1 queries for directory_listings
    product-repo.js      # D1 queries for products
    report-repo.js       # D1 queries for report_templates + transactions

  lib/
    db.js                # D1 connection helper             (planned)
    pdf.js               # PDF generation                   (planned)
    storage.js           # R2 wrapper for PDF uploads       (planned)
```

### 11.6 Wrangler Bindings (planned additions)

```jsonc
// wrangler.jsonc — additions needed
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "czy-main",
      "database_id": "<via wrangler d1 create>"
    }
  ],
  "r2_buckets": [
    {
      "binding": "REPORTS_BUCKET",
      "bucket_name": "czy-reports"
    }
  ]
}
```

### 11.7 Migration Path

| Step | Action | Revenue Impact |
|------|--------|----------------|
| 1 | Create D1 database + R2 bucket via Wrangler CLI | None (infrastructure) |
| 2 | Add `repositories/` layer, starting with `report-repo.js` | Unblocks BaZi PDF reports (item A) |
| 3 | Migrate `shop.json` → `products` table | Enables transaction tracking |
| 4 | Build `report-service.js` + PDF generation | **BaZi PDF revenue live** |
| 5 | Build compatibility report templates | **Compatibility PDF revenue live** |
| 6 | Migrate `directory.json` → `directory_listings` table | Enables dynamic lead-gen |
| 7 | Add admin routes for managing listings/products | Removes need for git commits to update data |

Steps 1–4 directly support the BaZi PDF revenue initiative (TODO items A and B). Step 6 supports directory lead-gen expansion (TODO item C).

### 11.8 What Stays as Files

The following data is correctly stored as files and should NOT migrate to a database:

- **Reference data** (zodiac animals, compatibility rules, stems/branches, famous figures, lichun dates) — small, deterministic, frontend-cacheable
- **Generated data** (zodiacYears.js, compatibilityPairs.js) — computed from deterministic logic
- **Configuration** (site.json, nav.json, languages.json, newsCategories.json) — rarely changes, no query benefit
- **Content graph** (contentGraph.json) — static topology for build-time link generation

---

*End of document.*
