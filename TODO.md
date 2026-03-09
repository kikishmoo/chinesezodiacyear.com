# ChineseZodiacYear.com -- Strategic TODO Roadmap

**Last updated:** 2026-03-09
**Planning horizon:** 90 days (March -- June 2026)
**Status:** Active

---

## Executive Summary

ChineseZodiacYear.com has a solid technical foundation (879 i18n pages, validated JSON-LD, GEO-ready infrastructure, CI build validation) with a cross-sell funnel now in place (CTA partial auto-included in all article layouts), interactive news hub filters, and contextual video embeds across 10+ encyclopedia pages (YouTube and Twitter/X). The immediate remaining priorities are closing the revenue attribution gap (GA4 conversions, Facebook Pixel), continuing seasonal content publishing, and activating marketing channels -- all achievable within 30 days with zero additional spend.

---

## Priority Matrix

| #  | Item                                                  | Priority   | Effort   | Impact   | Category   |
|----|-------------------------------------------------------|------------|----------|----------|------------|
| 1  | Install Facebook Pixel + conversion tracking          | CRITICAL   | 2 hours  | High     | Revenue    |
| 2  | ~~Upgrade 10+ directory listings to premium~~         | ~~CRITICAL~~   | ~~4 hours~~  | ~~High~~     | ~~Revenue~~    |
| 3  | ~~Build cross-sell funnel (content -> readings)~~     | ~~CRITICAL~~   | ~~8 hours~~  | ~~High~~     | ~~Revenue~~    |
| 4  | ~~Publish Qingming seasonal article (April 5 deadline)~~  | ~~CRITICAL~~   | ~~3 hours~~  | ~~High~~     | ~~Content~~    |
| 5  | ~~Set up GA4 conversion funnels + e-commerce events~~     | ~~CRITICAL~~   | ~~4 hours~~  | ~~High~~     | ~~Revenue~~    |
| 6  | Write and publish 6 remaining queued calendar articles          | HIGH       | 18 hours | High     | Content    |
| 7  | Translate encyclopedia page bodies to Chinese (3 pages ABSENT, 4 DONE + 2 partial) | HIGH       | 16 hours | High     | Content    |
| 8  | ~~Enable FormSubmit CAPTCHA on newsletter fallback~~  | ~~HIGH~~   | ~~30 min~~   | ~~Medium~~   | ~~Technical~~  |
| 9  | Set up Pinterest business account + first 20 pins     | HIGH       | 4 hours  | Medium   | Marketing  |
| 10 | ~~Make news hub filters interactive (JS filtering)~~  | ~~MEDIUM~~     | ~~6 hours~~  | ~~Medium~~   | ~~Technical~~  |
| 11 | Set up TikTok account + first 5 videos                | MEDIUM     | 8 hours  | Medium   | Marketing  |
| 12 | Set up YouTube channel + first 3 videos               | MEDIUM     | 12 hours | Medium   | Marketing  |
| 13 | ~~Install heatmap tracking (Microsoft Clarity)~~          | ~~MEDIUM~~     | ~~1 hour~~   | ~~Medium~~   | ~~Technical~~  |
| 14 | Create retargeting audiences (FB, Google)             | MEDIUM     | 3 hours  | High     | Marketing  |
| 15 | Build email drip sequence (Beehiiv automation)        | MEDIUM     | 6 hours  | High     | Revenue    |
| 16 | Develop 2 new Gumroad products for Q2 seasonality    | LOW        | 16 hours | Medium   | Revenue    |
| 17 | Add Dragon Boat Festival content (June 7 deadline)   | LOW        | 3 hours  | Medium   | Content    |
| 18 | Implement A/B testing on reading sales pages          | LOW        | 4 hours  | Medium   | Technical  |
| 19 | Create SOPs for content pipeline                      | LOW        | 4 hours  | Low      | Operations |
| 20 | Audit and optimize Cloudflare Worker caching rules    | LOW        | 3 hours  | Low      | Technical  |
| 21 | ~~Fix npm vulnerability (minimatch ReDoS)~~           | ~~HIGH~~   | ~~10 min~~   | ~~High~~     | ~~Technical~~  |
| 22 | ~~Add CI build validation step~~                      | ~~HIGH~~   | ~~30 min~~   | ~~High~~     | ~~Technical~~  |
| 23 | ~~Update llms.txt with missing URLs~~                 | ~~MEDIUM~~ | ~~15 min~~   | ~~Medium~~   | ~~GEO~~        |
| 24 | ~~Fix language toggle navigation bug~~                | ~~HIGH~~   | ~~30 min~~   | ~~High~~     | ~~Technical~~  |
| 25 | ~~Hero section TC/SC translation consistency~~        | ~~HIGH~~   | ~~1 hour~~   | ~~High~~     | ~~Technical~~  |

---

## Detailed Action Items by Category

### 1. REVENUE -- Immediate Money Impact

#### 1.1 Install Facebook Pixel + Social Retargeting [CRITICAL]

- **Priority:** CRITICAL
- **Effort:** 2 hours
- **Impact:** Enables all future paid acquisition and retargeting; without this, every visitor from social is untrackable
- **Deadline:** March 14, 2026

Action steps:

1. Create a Facebook Business Manager account (or verify the existing one tied to the active Facebook page).
2. Generate a new Meta Pixel from Events Manager.
3. Add the Pixel base code to the site's `<head>` partial (likely `_includes/layouts/base.njk` or equivalent Eleventy layout).
4. Configure standard events:
   - `PageView` on all pages (automatic with base code).
   - `ViewContent` on article pages -- pass `content_name` (article title) and `content_category` (zodiac sign / topic).
   - `AddToCart` when a user clicks a Gumroad product link.
   - `InitiateCheckout` when a user clicks a PayPal reading link.
   - `Lead` on newsletter signup confirmation.
5. Use the Meta Pixel Helper Chrome extension to verify all events fire correctly on production.
6. Create a Custom Audience of all website visitors (last 180 days) and a Lookalike Audience (1%) from that base.
7. No ad spend needed yet -- the pixel needs to collect data for 2--4 weeks before retargeting becomes effective.

#### 1.2 Fix Directory Listings [COMPLETED]

- **Priority:** CRITICAL
- **Status:** COMPLETED (2026-03-07)
- **Impact:** Three placeholder premium listings with example.com URLs have been replaced with real, verifiable organisations

Implementation details:

1. Replaced "Golden Dragon Feng Shui Consultancy" (fictional, example.com) with **Kerby Kuek -- Feng Shui Architect** (kerbykuek.com) -- real Hong Kong-based feng shui master and registered architect.
2. Replaced "Jade Pavilion BaZi Academy" (fictional, example.com) with **SA Academy of Chinese Metaphysics** (chinesemetaphysics.com) -- real education institution in Sydney/Online.
3. Replaced "Five Elements Wellness Centre" (fictional, example.com) with **Yo San University of Traditional Chinese Medicine** (yosan.edu) -- accredited US graduate school.
4. All three are now `free` tier with `featured: true` (no paid premium tier until real clients sign up).
5. All URLs point to real, operational websites.

#### 1.3 Build Cross-Sell Funnel [COMPLETED]

- **Priority:** CRITICAL
- **Status:** COMPLETED (2026-03-07)
- **Impact:** Structured path from free content to paid products is now in place

Implementation details:

1. Created `_includes/partials/cross-sell-cta.njk` -- a reusable trilingual cross-sell component with two cards:
   - **Reading card:** promotes BaZi readings ($29--$149), links to `/readings/` with UTM parameters.
   - **Product card:** promotes Gumroad digital products ($3.99--$19.99), links to `/shop/` with UTM parameters.
2. The partial supports three variants via a `variant` variable: `"reading"`, `"product"`, or `"both"` (default).
3. Integrated into `article.njk` layout -- automatically rendered on ALL pages using the article layout (16 articles, 12 zodiac pages, 12 readings, 34 encyclopedia pages, etc.) between the main content and the FAQ section.
4. Pages can opt out with `crossSellHidden: true` in frontmatter.
5. CSS: responsive two-column grid on desktop, single column on mobile (breakpoint: 640px). Dark mode support included.
6. UTM tracking: all CTA links include `utm_source=article&utm_medium=cross-sell&utm_campaign=reading-cta` or `product-cta`.
7. The existing `content-upgrade.njk` (email capture) remains at the bottom of articles, creating a two-tier conversion path: cross-sell for buyers, email capture for leads.

#### 1.4 Set Up GA4 Conversion Funnels + E-Commerce Events [COMPLETED]

- **Priority:** CRITICAL
- **Status:** COMPLETED (2026-03-09)
- **Impact:** Enables revenue attribution and conversion tracking across the entire site

Implementation details:

1. Added a `track()` helper function to `site.js` that wraps `gtag('event', ...)` with a `window.gtag` guard, matching the existing Web Vitals pattern in `base.njk`.
2. Implemented 16 custom events across all interactive features:
   - **Calculator events:** `zodiac_calculate`, `compatibility_check`, `bazi_calculate`, `bazi_error`
   - **Newsletter events:** `newsletter_subscribe`, `newsletter_error`
   - **Search event:** `site_search` (includes `search_term` and `results_count` parameters)
   - **Engagement events:** `faq_open`, `filter_apply`, `qr_view`
   - **Social event:** `social_share` (includes `share_method` and `content_url`)
   - **Preference events:** `theme_toggle`, `language_switch`
   - **Shop event:** `shop_filter`
   - **Popup events:** `popup_shown` (non-interaction), `popup_dismissed`
3. Events inside the DOMContentLoaded scope use the `track()` helper. Events in standalone IIFEs (shop filter, language toggle, QR lightbox, exit-intent popup) use direct `if (window.gtag)` guards.
4. **Remaining manual steps** (must be done in GA4 Admin, not code):
   - Mark `newsletter_subscribe`, `bazi_calculate`, and `zodiac_calculate` as conversion events in GA4 Admin > Events > Mark as conversion.
   - Create a funnel exploration report in GA4 Explore: `page_view` → `zodiac_calculate`/`bazi_calculate` → `newsletter_subscribe` → external checkout click.
   - Set up a weekly GA4 email report summarizing conversion counts.

#### 1.5 Build Email Drip Sequence in Beehiiv [MEDIUM]

- **Priority:** MEDIUM
- **Effort:** 6 hours
- **Impact:** Automated nurturing converts subscribers to buyers without ongoing manual effort
- **Deadline:** April 15, 2026

Action steps:

1. Design a 5-email welcome sequence:
   - **Email 1 (Day 0):** Welcome + free zodiac profile PDF (link to Gumroad freebie or hosted PDF). Subject: "Your zodiac profile is ready."
   - **Email 2 (Day 2):** Educational content -- "3 things most people get wrong about their Chinese zodiac." Builds credibility.
   - **Email 3 (Day 5):** Soft sell -- introduce the $3.99 compatibility guide. Frame as "only the cost of a coffee."
   - **Email 4 (Day 8):** Social proof -- share a testimonial or case study from a reading client (anonymized). Link to $29 reading.
   - **Email 5 (Day 12):** Direct offer -- 15% discount on the $79 reading for new subscribers (use a unique coupon code for tracking).
2. Set up automation triggers in Beehiiv:
   - Trigger: new subscriber.
   - Condition: has not purchased (if Beehiiv supports tagging via Gumroad/PayPal integration; otherwise, send to all).
3. Track open rates and click rates per email; iterate on subject lines after 200+ sends.

#### 1.6 Develop 2 New Gumroad Products for Q2 [LOW]

- **Priority:** LOW
- **Effort:** 16 hours
- **Impact:** Expands product catalog and captures seasonal buying intent
- **Deadline:** May 15, 2026

Action steps:

1. Product idea A: "2026 Mid-Year Zodiac Forecast" (PDF, 20--30 pages, $9.99). Covers all 12 animals for July--December 2026.
2. Product idea B: "Feng Shui Home Office Guide" (PDF + checklist, $7.99). Evergreen product with broad appeal.
3. Use Canva or a similar tool for layout. Keep production cost at $0 (time investment only).
4. List on Gumroad with a pre-launch page 2 weeks before publishing. Announce to newsletter list.

---

### 2. CONTENT -- SEO + Audience Growth

#### 2.1 Publish Qingming Seasonal Article [COMPLETED]

- **Priority:** CRITICAL
- **Status:** COMPLETED (published 2026-03-07)
- **Article:** `/qingming-festival-guide/`
- **Content:** ~2,500 words covering history, 2026 date/astrological context, traditional customs, Cold Food Festival, Five Elements connection, feng shui for ancestor spaces, modern observance. 5 FAQ items. References Huainanzi, Book of Rites, Zangshu, Du Mu's poem.

Action steps:

1. Use the scaffolding script to create the article: `node scripts/new-article.js` with slug `qingming-festival-2026`.
2. Target keywords: "Qingming Festival 2026," "Tomb Sweeping Day traditions," "Qingming feng shui."
3. Article structure:
   - What is Qingming Festival (history, cultural significance).
   - 2026 date and astrological context (tie to current zodiac year).
   - Feng shui practices for Qingming (altar setup, ancestor honoring).
   - CTA: link to relevant Gumroad product or reading.
4. Include structured data: Article schema (already templated), FAQ schema for 3--5 common questions.
5. Submit URL to Google Search Console immediately after publishing.
6. Share across all active social channels (Instagram, Facebook, Twitter) with platform-specific formatting.

#### 2.2 Write and Publish 6 Queued Calendar Articles [HIGH]

- **Priority:** HIGH
- **Effort:** 18 hours (approximately 3 hours per article)
- **Impact:** Each article is a new organic search entry point; 16 -> 22 articles is a 38% content increase
- **Deadline:** April 30, 2026 (stagger 2 per week)

Action steps:

1. Review `contentCalendar.json` and sort the 6 queued articles by:
   - Seasonal urgency (anything tied to upcoming dates goes first).
   - Keyword search volume (use Google Search Console queries or free tools like Ubersuggest).
   - Funnel position (articles that naturally lead to product CTAs rank higher).
2. For each article:
   - Run `node scripts/new-article.js` to scaffold.
   - Write 1,500--2,500 words targeting a primary keyword and 2--3 secondary keywords.
   - Include at least 1 cross-sell CTA (using the shortcode from item 1.3).
   - Add internal links to at least 3 existing articles.
   - Add FAQ schema for 3+ questions.
3. Publish on a Tuesday/Wednesday schedule (historically better for indexing velocity).
4. After each publish: submit to Search Console, share on social, send to newsletter if relevant.

#### 2.3 Translate Encyclopedia & Article Bodies to Chinese [HIGH]

- **Priority:** HIGH
- **Effort:** 24 hours (7 pages fully absent + 3 pages partial + articles)
- **Impact:** Unlocks the zh-Hans and zh-Hant audience segments; i18n infrastructure already exists
- **Deadline:** May 15, 2026

**Translation audit (2026-03-08) found:**

| Status | Pages |
|--------|-------|
| **ABSENT** (English-only, zero TC/SC) | Yi Jing, Tea Culture, Qi Men Dun Jia |
| **COMPLETED** (2026-03-09) | ~~TCM~~, ~~Martial Arts~~, ~~Folk Arts~~, ~~Wuxia~~ |
| **Partial** (~60-70%) | Compatibility hub (missing chart, self-punishment, elemental interactions), Zodiac hub (missing 12 detailed animal sections, Watch & Learn) |
| **Stub** (~14%) | 12 zodiac animal profile pages (hero + summary only) |
| **Full parity, EXCELLENT quality** | Homepage, BaZi, Feng Shui, Calendar, Spring Festival, Taoism, Hanfu, Dynasties, 12 readings, Readings hub, Wu Xing hub |

Where translations exist, quality is **publication-grade native Chinese** -- no machine-translation smell, correct TC/SC character sets, accurate domain terminology. The translated files (especially Taoism, Hanfu, Spring Festival) serve as style references.

Action steps:

1. Prioritize translation order by traffic impact:
   - **Phase 1** (highest impact): Yi Jing, TCM, Martial Arts, Compatibility hub gaps
   - **Phase 2**: Tea Culture, Wuxia, Folk Arts, Qi Men Dun Jia
   - **Phase 3**: Zodiac hub missing sections, 12 zodiac animal detailed sections
2. Translation workflow per page:
   - Draft in the established trilingual block pattern (`lang-en`, `lang-tc`, `lang-sc`)
   - Use domain-standard terminology (see existing Taoism/Hanfu/BaZi pages as reference)
   - Proofread by native speaker -- no machine-translate-and-publish
   - Include Chinese characters + pinyin for specialist terms per editorial standard
3. After each batch: rebuild, verify i18n stripping produces clean output, submit to Search Console
4. After Phase 1, assess zh traffic impact before committing to remaining phases

#### 2.4 Add Dragon Boat Festival Content [LOW]

- **Priority:** LOW
- **Effort:** 3 hours
- **Impact:** Captures seasonal search traffic for June 7 event
- **Deadline:** May 24, 2026 (2 weeks before event)

Action steps:

1. Scaffold article: "Dragon Boat Festival 2026: Traditions, Feng Shui, and Zodiac Connections."
2. Follow the same structure and promotion workflow as item 2.1.

---

### 3. TECHNICAL -- Site Improvements

#### 3.1 Enable FormSubmit CAPTCHA [COMPLETED]

- **Priority:** HIGH
- **Status:** COMPLETED (2026-03-07)
- **Impact:** Prevents spam submissions on the newsletter fallback form

Implementation details:

1. Added honeypot field (`_honey`) to the FormSubmit fallback form in `newsletter.njk` — bots fill hidden fields, humans don't, so submissions from bots are silently rejected.
2. Changed `_captcha` from `false` to `true` as a server-side safety net.
3. Updated the AJAX submission in `site.js` to include all hidden fields (honeypot, captcha, subject, template) in the JSON payload, not just the email.
4. Note: The FormSubmit form is a fallback that only activates if the Beehiiv publication ID is removed from `site.json`. The primary newsletter form uses Beehiiv directly.

#### 3.2 Install Heatmap Tracking -- Microsoft Clarity [MEDIUM]

- **Priority:** MEDIUM
- **Effort:** 1 hour
- **Impact:** Free tool that reveals exactly how users interact with pages; identifies UX friction before and after funnel changes
- **Deadline:** March 21, 2026

Action steps:

1. Create a free Microsoft Clarity account at clarity.microsoft.com.
2. Add the Clarity tracking script to the site's `<head>` partial (same location as GA4 and the future Facebook Pixel).
3. Enable session recordings and heatmaps.
4. After 1 week of data collection, review:
   - Scroll depth on article pages (are users reaching the CTA at 60%?).
   - Click patterns on the readings page (which tier gets the most clicks?).
   - Rage clicks or dead clicks indicating UX issues.
5. Clarity is free, GDPR-friendly (data stays in Azure), and has no impact on Core Web Vitals.

#### 3.3 Make News Hub Filters Interactive [COMPLETED]

- **Priority:** MEDIUM
- **Status:** COMPLETED (2026-03-07)
- **Impact:** Improved user experience on the news hub; reduced bounce rate from category browsing

Implementation details:

1. Converted filter `<a>` tags (which linked to non-existent `/news/zodiac/` etc.) to `<button>` elements with `data-filter` attributes across all three language blocks (EN, TC, SC).
2. Increased pagination size from 6 to 100 so all articles appear on a single page, enabling client-side filtering without missing articles on other pages.
3. Enhanced the existing directory filter JS in `site.js` to also handle article cards, with URL hash support (`#category=zodiac`) for shareable filtered views.
4. Added no-results state with trilingual "Show all articles" fallback button.
5. Filter reads URL hash on page load, so direct links like `/news/#category=fengshui` work.
6. Added CSS for `.news-no-results` and `.news-show-all-btn`.
7. Progressive enhancement: if JS fails, all articles are visible (buttons do nothing but content is still accessible).
8. Added ARIA attributes: `role="toolbar"` and `aria-label` on filter container for screen readers.

#### 3.4 Implement A/B Testing on Reading Sales Pages [LOW]

- **Priority:** LOW
- **Effort:** 4 hours
- **Impact:** Data-driven optimization of the highest-value pages on the site
- **Deadline:** May 15, 2026

Action steps:

1. Use a lightweight, free A/B testing approach (no third-party tool needed for a static site):
   - Create two versions of the readings landing page (variant A: current, variant B: new copy/layout).
   - Use a simple JS script that randomly assigns visitors to A or B (stored in `localStorage` for consistency).
   - Fire a custom GA4 event with the variant name on page load and on conversion click.
2. Test one variable at a time. Suggested first test: headline copy on the $79 reading page.
3. Run each test for a minimum of 200 unique visitors per variant before drawing conclusions.

#### 3.5 Audit Cloudflare Worker Caching Rules [LOW]

- **Priority:** LOW
- **Effort:** 3 hours
- **Impact:** Marginal performance improvement; site is already on GitHub Pages CDN
- **Deadline:** June 1, 2026

Action steps:

1. Review the current Cloudflare Worker code for caching logic.
2. Ensure static assets (CSS, JS, images) have `Cache-Control: public, max-age=31536000, immutable` headers.
3. Ensure HTML pages have `Cache-Control: public, max-age=3600` (or use `stale-while-revalidate`).
4. Verify the Worker is not interfering with GitHub Pages' own caching headers.
5. Test with `curl -I` to confirm correct headers on production.

#### 3.6 Fix npm Vulnerability [COMPLETED]

- **Priority:** HIGH
- **Status:** COMPLETED (2026-03-08)
- **Impact:** Resolved a high-severity ReDoS vulnerability in the minimatch dependency

Implementation details:

1. `npm audit` identified a high-severity ReDoS vulnerability in `minimatch <3.1.4` (GHSA-23c5-xmqv-rm74).
2. Ran `npm audit fix` which updated minimatch to a patched version.
3. Verified with `npm audit` -- 0 vulnerabilities remaining.
4. Full build confirmed passing after fix.

#### 3.7 Add CI Build Validation Step [COMPLETED]

- **Priority:** HIGH
- **Status:** COMPLETED (2026-03-08)
- **Impact:** Prevents deploying broken builds if the `eleventy.after` hook (i18n generation, CSS/JS minification) fails silently

Implementation details:

1. Added a "Validate build output" step to `.github/workflows/deploy.yml` between the Eleventy build and artifact upload.
2. The validation step checks:
   - Base HTML page count ≥ 250 (currently 293).
   - `zh-hant/` language variant ≥ 200 HTML files (currently 293).
   - `zh-hans/` language variant ≥ 200 HTML files (currently 293).
   - CSS minification succeeded (output smaller than source).
   - JS minification succeeded (output smaller than source).
   - Critical files present: `sitemap.xml`, `robots.txt`, `feed.xml`, `search-index.json`, `llms.txt`.
   - Homepage has valid `<html>` tag.
3. If any check fails, the workflow exits with a non-zero code and deployment is blocked.
4. Uses GitHub Actions `::error::` annotations for clear failure messages.

#### 3.8 Update llms.txt with Missing URLs [COMPLETED]

- **Priority:** MEDIUM
- **Status:** COMPLETED (2026-03-08)
- **Impact:** Improved AI crawler discoverability of all major site sections for Generative Engine Optimization (GEO)

Implementation details:

1. Added 13 missing URLs to `src/llms.txt` Key URLs section:
   - BaZi Calculator, Chinese Dynasties, Spring Festival, Professional Directory, Digital Products (Shop), News & Articles, Taoism, Yi Jing, Tea Culture, Hanfu, Martial Arts, Traditional Chinese Medicine, Qi Men Dun Jia.
2. Total key URLs now: 22 (was 9).
3. All major content pillars and commercial pages are now documented for AI crawlers.

#### 3.9 Fix Language Toggle Navigation Bug [COMPLETED]

- **Completed:** 2026-03-08
- **Commit:** (see latest commit on main)
- **Files changed:** `src/_includes/layouts/base.njk`, `src/site.js`, `docs/architecture.md`

**Problem:** When a user toggled to TC or SC on one page, then clicked a nav link to navigate to a different page, the new page displayed English content but the toggle button remained in TC/SC position. This happened because:
1. Nav links are plain hrefs (e.g., `/calendar/`) without language prefixes
2. The inline detection script in `base.njk` read `localStorage` on English pages, picking up the stale TC/SC preference
3. `data-lang` was set to TC/SC but the actual HTML only contained English content (TC/SC stripped at build time)

**Fix (two-part):**
1. **Inline script (`base.njk`):** Language is now always derived from the URL path, never from `localStorage`. On base English pages (no `/zh-hant/` or `/zh-hans/` prefix), `data-lang` is always set to `'en'`. `localStorage` is written (not read) to keep it in sync with the URL.
2. **Nav link rewriting (`site.js`):** On `/zh-hant/` or `/zh-hans/` pages, an IIFE rewrites all internal links in the header nav, logo, search link, and footer to include the current language prefix. This preserves the user's language when navigating. Non-HTML resources (e.g., `/sitemap.xml`) and external links are excluded.

**Result:** Navigating while on a Chinese variant page now stays in the same language. Visiting an English page always shows the toggle in EN position.

#### 3.10 Hero Section TC/SC Translation Consistency [COMPLETED]

- **Completed:** 2026-03-08
- **Files changed:** `src/_includes/partials/hero.njk` (shared partial), all 20 article-layout pages (frontmatter updates), `docs/architecture.md`

**Problem:** Pages using `layouts/base.njk` (7 pages) had custom inline heroes with trilingual TC/SC translations. Pages using `layouts/article.njk` (20 pages) shared a `hero.njk` partial that only rendered English — hero titles/subtitles stayed in English when viewing zh-hant/zh-hans variants.

**Fix:**
1. **Updated `hero.njk` partial** to accept optional `heroTitleTc`, `heroTitleSc`, `heroSubtitleTc`, `heroSubtitleSc`, `heroOverlineTc`, `heroOverlineSc` frontmatter fields. When present, the partial renders trilingual content wrapped in `<div class="lang-XX">` blocks (compatible with the existing build-time i18n stripping logic).
2. **Added TC/SC frontmatter** to all 20 article-layout pages: zodiac, bazi, fengshui, calendar, spring-festival, wuxing, bazi-calculator, asian-new-year, folk-arts, hanfu, dynasties, taoism, qimen, yijing, tcm, martial-arts, tea-culture, wuxia, chinamaxxing, compatibility.
3. **Key constraint:** The `stripLangBlocks` function in `eleventy.config.js` only handles `<div class="lang-XX">` (balanced tag matching) and `<span class="lang-XX">` (regex) with exact class attributes. Hero elements must be wrapped in `<div class="lang-XX">` containers rather than placing the lang class directly on `<h1>`, `<p>`, or multi-class elements.

**Result:** All 27 main pages now show translated hero sections (overline, title, subtitle) when viewing TC/SC variants. Consistent behaviour across both layout patterns.

---

### 4. MARKETING -- Traffic + Brand

#### 4.1 Set Up Pinterest Business Account [HIGH]

- **Priority:** HIGH
- **Effort:** 4 hours
- **Impact:** Pinterest is the highest-ROI organic social platform for visual, evergreen, female-skewing content (matches zodiac/feng shui audience)
- **Deadline:** March 28, 2026

Action steps:

1. Create a Pinterest Business account (or convert the existing empty account).
2. Claim the website to enable Rich Pins (will automatically pull article metadata).
3. Create 5 boards:
   - "Chinese Zodiac Signs" (pin for each of the 12 animals).
   - "Feng Shui Tips" (home, office, seasonal).
   - "BaZi & Chinese Astrology" (educational).
   - "Chinese Festivals & Traditions" (seasonal).
   - "Year of the Snake 2025/2026" (trending topic).
4. Create 20 initial pins:
   - Use Canva free tier for pin graphics (1000x1500px portrait).
   - Each pin links to a specific article on the site with UTM parameters.
   - Write keyword-rich pin descriptions (150--300 characters).
5. Pin 3--5 pins per day for the first 2 weeks (use a free scheduler like Canva's built-in scheduler or manual posting).
6. After 30 days, review Pinterest Analytics for top-performing pins and double down on those topics.

#### 4.2 Set Up TikTok Account [MEDIUM]

- **Priority:** MEDIUM
- **Effort:** 8 hours (account setup + 5 videos)
- **Impact:** TikTok has massive organic reach for niche educational content; Chinese zodiac content performs well on the platform
- **Deadline:** April 30, 2026

Action steps:

1. Create a TikTok Business account.
2. Develop a content format template (keep production simple):
   - Format A: "Did you know?" zodiac facts (15--30 seconds, text overlay on stock/Canva background).
   - Format B: "Your zodiac sign as..." trending format (30--60 seconds).
   - Format C: Monthly zodiac predictions (60 seconds, talking head or animated text).
3. Produce 5 initial videos using Canva Video or CapCut (both free).
4. Post 3x per week. Use trending sounds but keep content evergreen.
5. Bio link: use a link-in-bio page (Beehiiv landing page or a simple `/links/` page on the site) pointing to newsletter signup and top content.
6. Add TikTok Pixel to the site (similar process to Facebook Pixel, item 1.1).

#### 4.3 Set Up YouTube Channel [MEDIUM]

- **Priority:** MEDIUM
- **Effort:** 12 hours (channel setup + 3 videos)
- **Impact:** YouTube is the second-largest search engine; zodiac content has strong search intent on YouTube
- **Deadline:** May 15, 2026

Action steps:

1. Create a YouTube channel under the brand name.
2. Produce 3 initial videos:
   - Video 1: "Chinese Zodiac Explained: All 12 Animals" (5--8 minutes, foundational/evergreen).
   - Video 2: "Year of the Snake 2025: What It Means for You" (3--5 minutes, timely).
   - Video 3: "Feng Shui Basics for Beginners" (5--8 minutes, evergreen).
3. Production approach (zero budget):
   - Screen recording with voiceover using free tools (OBS + Audacity).
   - Or animated slideshows using Canva Video.
   - Thumbnail: Canva template, bright colors, large text, zodiac imagery.
4. Optimize each video:
   - Title: include primary keyword.
   - Description: 200+ words, include links to relevant articles and products.
   - Tags: 10--15 relevant keywords.
   - End screen: subscribe CTA + link to next video.
5. Embed YouTube videos in corresponding articles on the site (improves both YouTube SEO and article dwell time).

#### 4.4 Create Retargeting Audiences [MEDIUM]

- **Priority:** MEDIUM
- **Effort:** 3 hours
- **Impact:** Retargeting converts warm visitors at 3--5x the rate of cold traffic; prerequisite for any future paid ads
- **Deadline:** April 15, 2026 (requires Facebook Pixel from item 1.1 to have 2+ weeks of data)

Action steps:

1. In Facebook Ads Manager, create Custom Audiences:
   - All website visitors (last 180 days).
   - Visitors who viewed a reading page but did not click a PayPal link (last 90 days).
   - Newsletter subscribers (upload Beehiiv subscriber list as a Custom Audience).
2. In Google Ads, create remarketing audiences:
   - All website visitors (via GA4 audience export to Google Ads).
   - Visitors who triggered `begin_checkout` but not `purchase`.
3. No ad spend required yet -- audiences need to build to 1,000+ users before they are useful for campaigns.

---

### 5. OPERATIONS -- Sustainability + Scale

#### 5.1 Create SOPs for Content Pipeline [LOW]

- **Priority:** LOW
- **Effort:** 4 hours
- **Impact:** Enables delegation to freelancers or virtual assistants in the future; reduces bus factor
- **Deadline:** May 30, 2026

Action steps:

1. Document the end-to-end content creation workflow:
   - Step 1: Select next article from `contentCalendar.json`.
   - Step 2: Run `node scripts/new-article.js` with specified parameters.
   - Step 3: Write article following the style guide (create a brief style guide if one does not exist: tone, structure, word count targets, CTA placement rules).
   - Step 4: Add structured data (document which schemas to include and how).
   - Step 5: Internal linking checklist (minimum 3 internal links per article).
   - Step 6: Pre-publish QA (check JSON-LD validation, hreflang, Open Graph tags, mobile rendering).
   - Step 7: Publish and promote (Search Console submission, social sharing, newsletter inclusion).
2. Document the translation workflow (from item 2.3).
3. Document the social media posting workflow per platform.
4. Store all SOPs in a `/docs/` directory in the repo (or a shared Google Drive if collaborators are non-technical).

---

## 30 / 60 / 90 Day Milestones

### Days 1--30 (March 7 -- April 6, 2026)

**Theme: Fix the revenue foundation and capture seasonal traffic.**

| Week  | Deliverables                                                                                      |
|-------|---------------------------------------------------------------------------------------------------|
| Wk 1  | Enable FormSubmit CAPTCHA. **DONE.** Install Facebook Pixel. Set up GA4 conversion funnels. **DONE.** Fix directory placeholder listings. **DONE.** Build cross-sell CTA. **DONE.** Make news filters interactive. **DONE.** |
| Wk 2  | Install Microsoft Clarity. Publish Qingming article. **DONE.**                                     |
| Wk 3  | Set up Pinterest business account + 20 initial pins.                                               |
| Wk 4  | Publish 2 queued calendar articles.                                                                |

**Success criteria at Day 30:**
- Facebook Pixel actively collecting data (verify 500+ PageView events).
- GA4 shows conversion events firing correctly (generate_lead, begin_checkout).
- Directory listings fixed with real businesses. **DONE**
- Qingming article published and indexed. **DONE**
- Cross-sell CTA live on all article pages. **DONE**
- News hub filters interactive. **DONE**
- Pinterest account live with 20+ pins.
- Cross-sell CTAs present in all existing articles.
- 17+ total published articles (16 existing + 1 calendar article minimum).

### Days 31--60 (April 7 -- May 6, 2026)

**Theme: Scale content and activate automated nurturing.**

| Week  | Deliverables                                                                                       |
|-------|----------------------------------------------------------------------------------------------------|
| Wk 5  | Publish 2 more queued articles. Set up Beehiiv welcome drip sequence (5 emails).                    |
| Wk 6  | Translate top 5 articles to Chinese. Create retargeting audiences in Facebook and Google.            |
| Wk 7  | ~~Make news hub filters interactive.~~ **DONE (moved to Wk 1).** Set up TikTok account + produce first 3 videos. |
| Wk 8  | Publish 2 more queued articles. Review first month of Clarity heatmap data; adjust CTA placement.   |

**Success criteria at Day 60:**
- 21+ total published articles.
- 5 articles translated to zh-Hans/zh-Hant and live.
- Beehiiv drip sequence active and delivering.
- TikTok account live with 3+ videos.
- News hub filters are interactive.
- Retargeting audiences building (target: 500+ users in Facebook audience).

### Days 61--90 (May 7 -- June 5, 2026)

**Theme: Expand channels, optimize conversions, and begin planning for scale.**

| Week  | Deliverables                                                                                        |
|-------|-----------------------------------------------------------------------------------------------------|
| Wk 9  | Publish remaining queued articles (target: all 7 complete). Set up YouTube channel + first video.     |
| Wk 10 | Translate 5 more articles to Chinese. Produce 2 more YouTube videos. Publish Dragon Boat content.     |
| Wk 11 | Implement A/B testing on readings page. Develop 1 new Gumroad product. Create content pipeline SOPs.  |
| Wk 12 | Full audit: review all metrics (see below). Plan Q3 roadmap. Audit Cloudflare Worker caching.         |

**Success criteria at Day 90:**
- 22+ total published articles (all 6 remaining queued articles plus Dragon Boat).
- 10 articles translated to Chinese.
- YouTube channel live with 3+ videos.
- At least 1 A/B test completed on the readings page.
- Content pipeline SOPs documented.
- Clear data on which channels drive the most revenue (from GA4 attribution).

---

## Metrics to Track

### Revenue Metrics (review weekly)

| Metric                                | Tool               | Target (90-day)           |
|---------------------------------------|---------------------|---------------------------|
| Gumroad revenue (total)               | Gumroad dashboard   | Establish baseline + 25%  |
| PayPal readings revenue (total)       | PayPal dashboard    | Establish baseline + 25%  |
| Revenue per session                   | GA4 (calculated)    | Establish baseline        |
| Conversion rate: visitor -> lead      | GA4 funnel          | 2--3%                     |
| Conversion rate: lead -> customer     | GA4 + email metrics | 1--2%                     |
| Average order value                   | Manual calculation  | Track; optimize via upsell|
| Directory listing ROI                 | GA4 UTM tracking    | Positive ROI on 7/10+     |

### Content Metrics (review biweekly)

| Metric                                | Tool                | Target (90-day)           |
|---------------------------------------|----------------------|---------------------------|
| Total indexed pages                   | Google Search Console| 900+                      |
| Organic search sessions               | GA4                  | +50% from baseline        |
| Average position (target keywords)    | Google Search Console| Top 20 for 10+ keywords   |
| Articles published per month          | Internal tracking    | 4+                        |
| Chinese-language pageviews            | GA4 (language filter)| Establish baseline        |

### Technical Metrics (review monthly)

| Metric                                | Tool                | Target (ongoing)          |
|---------------------------------------|----------------------|---------------------------|
| Largest Contentful Paint (LCP)        | Web Vitals / GA4     | Under 2.5s               |
| Cumulative Layout Shift (CLS)         | Web Vitals / GA4     | Under 0.1                |
| Interaction to Next Paint (INP)       | Web Vitals / GA4     | Under 200ms              |
| Uptime                                | GitHub Pages status  | 99.9%                    |
| Build time (Eleventy)                 | GitHub Actions logs  | Under 60 seconds         |

### Marketing Metrics (review weekly)

| Metric                                | Tool                    | Target (90-day)          |
|---------------------------------------|--------------------------|--------------------------|
| Newsletter subscribers (total)        | Beehiiv                  | +200 from baseline       |
| Email open rate                       | Beehiiv                  | 35%+                     |
| Email click rate                      | Beehiiv                  | 3%+                      |
| Pinterest monthly impressions         | Pinterest Analytics      | 10,000+                  |
| TikTok video views (total)            | TikTok Analytics         | 5,000+                   |
| Social referral traffic               | GA4 (source/medium)      | +100% from baseline      |
| Facebook Pixel audience size          | Facebook Ads Manager     | 1,000+                   |

### Operational Metrics (review monthly)

| Metric                                | Tool                    | Target (ongoing)          |
|---------------------------------------|--------------------------|---------------------------|
| Hours spent on content creation       | Manual time tracking     | Track for efficiency      |
| Cost of premium directory listings    | Spreadsheet              | Under $200/month total    |
| Content pipeline throughput           | contentCalendar.json     | 0 overdue articles        |
| Time from draft to publish            | Git commit history       | Under 5 days              |

---

## Dependencies and Risk Notes

1. **~~Qingming article (item 2.1) is time-critical.~~** Published 2026-03-07. SEO window captured.
2. **Facebook Pixel (item 1.1) blocks retargeting (item 4.4).** Install the pixel in week 1; retargeting audiences need 2--4 weeks to build.
3. **GA4 conversion setup (item 1.4) blocks all revenue attribution.** Until this is done, every other revenue optimization is flying blind.
4. **Chinese translations (item 2.3) depend on the existing i18n infrastructure working correctly.** Validate with a single test article before committing to all 15.
5. **Directory premium upgrades (item 1.2) may have approval delays.** Submit applications early; some directories take 1--2 weeks to process upgrades.
6. **Zero-budget constraint** means all video content (TikTok, YouTube) must use free tools only. Quality will be lower than competitors using paid tools, but consistency and niche authority matter more than production value in this category.

---

## Quarterly Review Checkpoint

At Day 90 (June 5, 2026), conduct a full review:

1. Which 3 channels drove the most revenue? Double down on those in Q3.
2. Which directory upgrades had positive ROI? Keep those; cancel the rest.
3. What is the newsletter subscriber-to-customer conversion rate? If below 1%, revisit the drip sequence.
4. Are Chinese-language pages getting traffic? If minimal after 60 days live, deprioritize further translation.
5. What is the total monthly revenue? Set a Q3 target of 2x this number.
6. Is the content pipeline sustainable at 4 articles/month? If not, hire a freelance writer (budget: $50--$100/article).

---

*This document should be reviewed and updated at each 30-day milestone. Items may be reprioritized based on data collected during execution.*
