# Changelog — chinesezodiacyear.com

> All notable changes to this project are documented in this file.
> Format: grouped by logical feature/fix, ordered newest-first.

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

## 2026-03-09 — Favicon Fix, Encyclopedia Translations, Onboarding Audit

**Author:** kiki.shmoo@gmail.com

### Favicon Updated to Match Page Logo

- **Problem:** Browser tab favicon used ivory/white (`#FAF6EF`) text on red, while the page header logo uses imperial gold (`#BF9328`) text with a gold border — visual mismatch.
- **Fix:** Updated `favicon.svg` to use gold text, gold border stroke, and semi-transparent dark overlay matching the `.logo-seal` CSS styling. Added `-2deg` rotation (`1fbdc09`) to match the page logo's `transform: rotate(-2deg)`.
- Regenerated all favicon variants: `favicon.ico`, `favicon-32.png`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png`.

### Encyclopedia Pages — TC/SC Translations (`c7c71fe`)

- Translated 4 encyclopedia pages to Traditional Chinese (zh-hant) and Simplified Chinese (zh-hans):
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
- Identified 7 encyclopedia pages with absent translations and created prioritized translation queue.
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

- Moved contextual video embeds inline with relevant dynasty/topic sections across 8 encyclopedia pages.
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
- Translated BaZi, Wu Xing, Feng Shui encyclopedia pages to TC/SC.
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
- Transformed encyclopedia pages to infographic style with visual components.
- Fixed broken images, layout, news font; added donation page and social embeds.
- Rewrote CNY Influence page with Chinese origins, transmission dates, de-Sinicization.
- Added Jackie Chan Adventures content to wuxia, zodiac, and homepage.
- SEO/GEO overhaul: meta descriptions, keywords, OG images, enhanced schema.
- Fixed mobile nav menu scroll.

### 2026-02-25 — Core Content Expansion

- Added zodiac readings, BaZi calculator, Asian New Year page, enhanced zodiac calculator.
- Added 4 encyclopedia pages, expanded existing content, fixed CSS and navigation.
- Added wuxia & chinamaxxing pages, trivia game, video embeds, cross-links.

### 2026-02-24 — SSG Migration & Branding

- Converted to Eleventy SSG with Decap CMS.
- Added GitHub Actions workflow for build and deploy.
- Renamed site to "Chinese Zodiac", renamed Calendar to "Chinese Calendar", expanded 24 Solar Terms.
- Fixed GitHub Pages subpath, redesigned CSS with Tang-Song-Ming aesthetics.

### 2026-02-23 — Phase 1 & 2

- Added dark mode, Beehiiv newsletter, and social sharing.
- Added 5 encyclopedia pages, compatibility checker, nav dropdown.

### 2026-02-22 — Initial Upload

- Initial file upload to repository.
