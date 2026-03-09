# Site Architecture: chinesezodiacyear.com

> **Document version:** 1.1
> **Last updated:** 2026-03-08
> **Stack:** Eleventy 3.1.2 (ESM) | Nunjucks | GitHub Pages | Cloudflare Workers

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
| CSS                | Vanilla CSS                         | ~5,250 lines source, minified via CleanCSS |
| JavaScript         | Vanilla JS                          | site.js (~1,087 lines) + trivia.js (~526 lines), minified via Terser |
| Image Processing   | @11ty/eleventy-img                  | WebP + JPEG fallback at 400/800/1200px widths |
| Node Runtime       | Node.js 20                          | Specified in CI workflow                   |

### 1.3 Key Design Decisions

- **No frontend framework.** Vanilla CSS and JS keep the bundle small and eliminate framework churn. Total client JS is under 1,600 lines pre-minification.
- **Build-time i18n** rather than runtime translation. All three language variants (English, Traditional Chinese, Simplified Chinese) are pre-rendered as static HTML. No translation API calls at runtime.
- **Git-backed CMS.** Decap CMS writes directly to the repository. No external database or headless CMS API to maintain.
- **Single build config.** `eleventy.config.js` handles collections, filters, shortcodes, CSS/JS minification, and i18n page generation in one file via the `eleventy.after` hook.

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
                +-- 4a. CSS Minification
                |       - Read src/css/style.css (~5,260 lines)
                |       - Process through CleanCSS
                |       - Write to _site/css/style.css
                |
                +-- 4b. JS Minification
                |       - Read src/js/site.js (~1,087 lines)
                |       - Read src/js/trivia.js (~526 lines)
                |       - Process each through Terser
                |       - Write to _site/js/site.js and _site/js/trivia.js
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
  css/style.css                   # Minified CSS
  js/site.js                      # Minified site JS
  js/trivia.js                    # Minified trivia game JS
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

### 7.1 JavaScript Files

The site ships two JavaScript files, both minified by Terser during the build:

| File         | Source Lines | Purpose                                    | Loaded On          |
|--------------|-------------|--------------------------------------------|--------------------|
| `site.js`    | ~1,087      | Core site functionality                    | Every page (defer) |
| `trivia.js`  | ~526        | Trivia game engine                         | `/trivia/` only    |

No framework. No bundler. No npm runtime dependencies in the browser.

### 7.2 `site.js` Module Breakdown

```
site.js (~1,087 lines)
  |
  +-- Zodiac Calculator (~500 lines)
  |     - Lichun (Start of Spring) date table: 1900-2079
  |     - Determines zodiac animal for a given birth date
  |       (accounts for Lichun, not just Jan 1 or Lunar New Year)
  |     - Famous figures database for "born in the same year" feature
  |     - Heavenly Stem + Earthly Branch calculation
  |     - Element derivation from stem
  |     - Result display with trilingual output
  |
  +-- Language Toggle + Nav Rewriting (~80 lines)
  |     - Detect language from URL path (not localStorage)
  |     - Toggle button navigates between language URL variants
  |     - On /zh-hant/ or /zh-hans/ pages, rewrites nav/footer hrefs
  |       to preserve language prefix when navigating
  |
  +-- Theme Toggle (~40 lines)
  |     - Dark/light mode switch
  |     - Persisted to localStorage
  |     - Respects prefers-color-scheme on first visit
  |
  +-- FAQ Accordions (~50 lines)
  |     - Progressive enhancement on FAQ sections
  |     - Click-to-expand with ARIA attributes
  |     - Smooth height animation via max-height transition
  |
  +-- Client-Side Search (~200 lines)
  |     - Fetches /search-index.json on search page load
  |     - Weighted scoring algorithm:
  |         title match:       weight 10
  |         description match: weight 5
  |         keywords match:    weight 3
  |         body match:        weight 1
  |         category match:    weight 2
  |     - Debounced input (300ms)
  |     - Renders results with highlighted match snippets
  |
  +-- Newsletter Signup (~40 lines)
  |     - Beehiiv form submission handler
  |     - Email validation
  |     - Success/error state management
  |
  +-- Email Popup (~50 lines)
  |     - Triggered by: scroll depth (60%) OR exit intent (mouse leave viewport)
  |     - Suppressed for 7 days after dismiss (localStorage timestamp)
  |     - Suppressed permanently after successful signup
  |
  +-- Analytics Events (~80 lines)
        - Custom GA4 events for:
          calculator_use, language_switch, theme_toggle,
          newsletter_signup, search_query, trivia_start,
          faq_expand, share_click, outbound_link
```

### 7.3 `trivia.js` Module Breakdown

```
trivia.js (~526 lines)
  |
  +-- Question Bank: 72 trilingual questions
  |     - Each question has en/tc/sc text variants
  |     - 4 answer options per question (also trilingual)
  |     - Distributed across 5 categories:
  |         zodiac-basics, wu-xing, compatibility, culture, history
  |
  +-- Game Mechanics
  |     - Category selection (play all or pick category)
  |     - Randomized question order per session
  |     - 10-question rounds
  |     - Score tracking with percentage
  |     - Timer per question (15 seconds)
  |     - Streak counter for consecutive correct answers
  |
  +-- UI Rendering
  |     - Dynamic DOM construction (no template engine)
  |     - Progress bar
  |     - Answer feedback (correct/incorrect with explanation)
  |     - Final score screen with share prompt
  |
  +-- Language Integration
        - Reads active language from <html> class
        - Renders question text in the active language
        - Answer options displayed in the active language
```

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

The index contains one entry per English page (~213 entries). Chinese variant pages are not separately indexed; the search page uses the active language to display results but searches against English text.

### 7.5 CSS Architecture

Single file: `src/styles.css` (~5,250 lines). No preprocessor, no CSS modules.

Key sections:
- CSS custom properties (design tokens for colors, spacing, typography, border radii, transitions, gold transparency scale)
- Dark mode overrides via `[data-theme="dark"]` selector
- Language visibility rules (`.lang-en`, `.lang-tc`, `.lang-sc` show/hide)
- Responsive breakpoints: 500px, 600px, 700px, 800px, 900px
- Component styles: header, footer, hero, cards, accordion, sidebar, TOC, trivia, shop, directory
- Social embed grid: `.social-embed-grid` (auto-fit), `.social-embed-grid--1` (single video, max 640px), `.social-embed-grid--3` (3-column). Children: `.social-embed-card` → `.embed-responsive` → iframe + `.embed-caption`
- Tweet embed overrides: `.embed-responsive--tweet` (static positioning for Twitter widget.js hydrated iframes)
- Print styles
- Utility classes

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

### 8.6 Cloudflare Worker (BaZi Calculator)

| Property          | Value              |
|-------------------|--------------------|
| Integration Point | `site.js` Zodiac Calculator module |
| Purpose           | Server-side BaZi (Four Pillars) calculation |
| Protocol          | HTTPS fetch from browser to Worker endpoint |
| Deployment        | Separate from main site; deployed via `wrangler deploy` |

The BaZi calculator on the `/calculator/` page sends birth date/time to the Cloudflare Worker, which performs the complex Four Pillars calculation and returns structured results. This keeps the computation server-side to protect the algorithm and reduce client-side JS complexity.

```
Browser                    Cloudflare Worker
   |                             |
   |  POST /calculate            |
   |  { date, time, gender }     |
   |---------------------------->|
   |                             |  Compute Four Pillars:
   |                             |  - Year Pillar (stem + branch)
   |                             |  - Month Pillar
   |                             |  - Day Pillar
   |                             |  - Hour Pillar
   |                             |  - Element balance
   |                             |  - Day Master analysis
   |  200 OK                     |
   |  { pillars, elements,       |
   |    dayMaster, analysis }    |
   |<----------------------------|
   |                             |
   |  Render results in DOM      |
```

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

### 9.1 Primary Deployment (GitHub Pages)

Triggered automatically on every push to the `main` branch.

```
Developer / Decap CMS
        |
        | git push to main
        v
+-----------------------------------------------+
|  GitHub Actions: deploy.yml                    |
|                                                |
|  trigger: push to main                         |
|                                                |
|  jobs:                                         |
|    build:                                      |
|      1. actions/checkout@v4                    |
|      2. actions/setup-node@v4 (Node 20)        |
|      3. npm ci                                 |
|      4. npx @11ty/eleventy                     |
|         - Builds 293 base pages                |
|         - eleventy.after: minify CSS/JS        |
|         - eleventy.after: generate i18n pages  |
|         - Output: 879 files in _site/          |
|      5. Build validation step                  |
|         - Asserts base page count >= 250       |
|         - Asserts zh-hant/zh-hans >= 200 each  |
|         - Asserts CSS/JS minified (smaller)    |
|         - Asserts critical files present       |
|         - Spot-checks HTML structure           |
|      6. actions/upload-pages-artifact           |
|         - Uploads _site/ as deployment artifact|
|                                                |
|    deploy:                                     |
|      needs: build                              |
|      1. actions/deploy-pages                   |
|         - Deploys artifact to GitHub Pages     |
|         - Custom domain: chinesezodiacyear.com |
+-----------------------------------------------+
        |
        v
  GitHub Pages CDN
  (chinesezodiacyear.com)
```

### 9.2 Cloudflare Worker Deployment

Deployed separately from the main site. Not triggered by the GitHub Actions workflow.

```
Developer
    |
    | cd worker/ && wrangler deploy
    v
Cloudflare Edge Network
    |
    +-- BaZi Calculator Worker
        (accessible via configured URL in site.json)
```

The Worker has its own `wrangler.toml` configuration and is deployed manually or via a separate CI step. It does not depend on the Eleventy build.

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
| (worker/)      |  | (manual/separate) |  | (Worker runtime)  |
+----------------+  +-------------------+  +-------------------+
```

### 9.4 Build Performance

| Metric                         | Approximate Value     |
|--------------------------------|-----------------------|
| Eleventy template rendering    | ~2-4 seconds          |
| CSS minification (CleanCSS)    | < 1 second            |
| JS minification (Terser x 2)   | < 1 second            |
| i18n page generation (879 files) | ~3-6 seconds       |
| Image processing (if cache miss) | ~10-30 seconds      |
| **Total CI/CD pipeline**       | **~1-2 minutes**      |

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
| Monolithic build config | Low | `eleventy.config.js` handles collections, filters, shortcodes, CSS/JS minification, and i18n generation in a single file. As the site grows, this becomes harder to maintain. | Modularize into separate files: `config/collections.js`, `config/filters.js`, `config/shortcodes.js`, `config/i18n.js`, `config/minify.js`. Import them into the main config. |

### 10.2 Architecture Risks

**Single point of failure: `eleventy.after` hook.** The i18n generation and asset minification both run in the `eleventy.after` event. If either fails, the build succeeds (Eleventy considers the build complete before `after` runs) but the output is incomplete -- missing i18n pages or unminified assets.

**Mitigation (IMPLEMENTED):** A "Validate build output" step in the GitHub Actions workflow (`.github/workflows/deploy.yml`) runs after the Eleventy build and before artifact upload. It asserts:
- `_site/` contains ≥250 base HTML pages
- `_site/zh-hant/` contains ≥200 HTML files
- `_site/zh-hans/` contains ≥200 HTML files
- `_site/styles.css` is smaller than `src/styles.css` (confirms minification ran)
- `_site/site.js` is smaller than `src/site.js`
- Critical files exist: `sitemap.xml`, `robots.txt`, `feed.xml`, `search-index.json`, `llms.txt`
- Homepage has valid `<html>` tag

If any check fails, the workflow exits with a non-zero code and the deployment is blocked.

**i18n stripping correctness.** The balanced tag matcher for `<div>` language blocks assumes well-formed HTML. Malformed nesting (e.g., an unclosed `<div>` inside a language block) could cause the stripper to consume too much or too little content, resulting in broken output for a specific language variant. There are currently no automated tests for the i18n stripping logic.

**Mitigation:** Add integration tests that process known HTML inputs through the stripping function and assert expected output.

### 10.3 Scaling Considerations

| Threshold               | Current State       | Action Needed When Exceeded                          |
|--------------------------|--------------------|----------------------------------------------------|
| Total pages > 1,000     | ~879 (post-i18n)   | Evaluate build time; consider incremental builds    |
| Search index > 500 entries | ~293            | Move to Pagefind or server-side search              |
| CSS > 8,000 lines       | ~5,366             | Consider CSS modules or a utility framework         |
| JS > 3,000 lines        | ~1,594             | Consider ES module splitting with a bundler         |
| Data files > 20         | 12                 | Current approach is fine                             |
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
     minify.js         # CleanCSS + Terser processing
   ```

3. **JSON-LD automation.** Rather than manually adding schemas per page, generate JSON-LD programmatically in `eleventyComputed.js` based on page type (article, FAQ, product, etc.) and front matter fields.

4. **Content preview for Decap CMS.** Currently, Decap CMS authors cannot preview how trilingual content will render across all three language variants. A local preview proxy or Decap's custom preview feature could improve the authoring experience.

5. **Incremental builds.** Eleventy 3.x supports `--incremental` mode. Enabling this in the CI workflow (with proper cache configuration) would reduce build times as the page count grows.

---

*End of document.*
