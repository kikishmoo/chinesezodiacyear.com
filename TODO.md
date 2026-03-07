# ChineseZodiacYear.com -- Strategic TODO Roadmap

**Last updated:** 2026-03-07
**Planning horizon:** 90 days (March -- June 2026)
**Status:** Active

---

## Executive Summary

ChineseZodiacYear.com has a solid technical foundation (885+ i18n pages, validated JSON-LD, GEO-ready infrastructure) but is leaving significant revenue on the table due to missing conversion tracking, underutilized directory monetization (3/36 premium), and an empty cross-sell funnel between free content and paid readings ($29--$149). The immediate priority is to close the revenue attribution gap, continue publishing seasonal content, and activate the 33 non-premium directory listings -- all achievable within 30 days with zero additional spend.

---

## Priority Matrix

| #  | Item                                                  | Priority   | Effort   | Impact   | Category   |
|----|-------------------------------------------------------|------------|----------|----------|------------|
| 1  | Install Facebook Pixel + conversion tracking          | CRITICAL   | 2 hours  | High     | Revenue    |
| 2  | Upgrade 10+ directory listings to premium             | CRITICAL   | 4 hours  | High     | Revenue    |
| 3  | Build cross-sell funnel (content -> readings)         | CRITICAL   | 8 hours  | High     | Revenue    |
| 4  | ~~Publish Qingming seasonal article (April 5 deadline)~~  | ~~CRITICAL~~   | ~~3 hours~~  | ~~High~~     | ~~Content~~    |
| 5  | Set up GA4 conversion funnels + e-commerce events     | CRITICAL   | 4 hours  | High     | Revenue    |
| 6  | Write and publish 6 remaining queued calendar articles          | HIGH       | 18 hours | High     | Content    |
| 7  | Translate article bodies to Chinese (zh-Hans/zh-Hant) | HIGH       | 16 hours | High     | Content    |
| 8  | ~~Enable FormSubmit CAPTCHA on newsletter fallback~~  | ~~HIGH~~   | ~~30 min~~   | ~~Medium~~   | ~~Technical~~  |
| 9  | Set up Pinterest business account + first 20 pins     | HIGH       | 4 hours  | Medium   | Marketing  |
| 10 | Make news hub filters interactive (JS filtering)      | MEDIUM     | 6 hours  | Medium   | Technical  |
| 11 | Set up TikTok account + first 5 videos                | MEDIUM     | 8 hours  | Medium   | Marketing  |
| 12 | Set up YouTube channel + first 3 videos               | MEDIUM     | 12 hours | Medium   | Marketing  |
| 13 | Install heatmap tracking (Microsoft Clarity)          | MEDIUM     | 1 hour   | Medium   | Technical  |
| 14 | Create retargeting audiences (FB, Google)             | MEDIUM     | 3 hours  | High     | Marketing  |
| 15 | Build email drip sequence (Beehiiv automation)        | MEDIUM     | 6 hours  | High     | Revenue    |
| 16 | Develop 2 new Gumroad products for Q2 seasonality    | LOW        | 16 hours | Medium   | Revenue    |
| 17 | Add Dragon Boat Festival content (June 7 deadline)   | LOW        | 3 hours  | Medium   | Content    |
| 18 | Implement A/B testing on reading sales pages          | LOW        | 4 hours  | Medium   | Technical  |
| 19 | Create SOPs for content pipeline                      | LOW        | 4 hours  | Low      | Operations |
| 20 | Audit and optimize Cloudflare Worker caching rules    | LOW        | 3 hours  | Low      | Technical  |

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

#### 1.2 Upgrade Directory Listings to Premium [CRITICAL]

- **Priority:** CRITICAL
- **Effort:** 4 hours (research + applications)
- **Impact:** Premium listings typically 3--10x the visibility of free listings; 33 untapped upgrade opportunities
- **Deadline:** March 21, 2026

Action steps:

1. Export the current 36 directory listings into a spreadsheet with columns: directory name, current tier (free/premium), monthly cost of premium, estimated monthly traffic from that directory, upgrade URL.
2. Score each directory on a simple ROI formula: (estimated monthly visitors from premium) / (monthly cost). Prioritize directories where premium costs under $20/month.
3. Upgrade the top 10 highest-ROI directories first. Target directories with the following attributes:
   - Niche relevance (astrology, Chinese culture, spirituality, feng shui).
   - Do-follow backlinks included in premium tier.
   - Featured placement or category sponsorship available.
4. For each upgraded listing, ensure the description includes:
   - A primary call-to-action driving to the highest-converting landing page (likely the BaZi reading page at $79 midpoint).
   - Consistent NAP (Name, Address, Phone/contact) formatting if applicable.
   - The site's primary keyword in the listing title.
5. Track referral traffic from each directory using UTM parameters: `?utm_source=[directory-name]&utm_medium=directory&utm_campaign=premium-listing`.
6. Reassess in 60 days; drop any premium listings that produced zero conversions.

#### 1.3 Build Cross-Sell Funnel [CRITICAL]

- **Priority:** CRITICAL
- **Effort:** 8 hours
- **Impact:** Currently there is no structured path from free content to paid products; this is the single biggest revenue leak
- **Deadline:** March 28, 2026

Action steps:

1. Map the funnel stages:
   - **Top:** Free article (e.g., "Year of the Snake 2025 Predictions") -> in-article CTA for free zodiac profile (newsletter signup via Beehiiv).
   - **Middle:** Newsletter welcome sequence (3--5 emails over 10 days) -> introduces Gumroad mini-products ($3.99--$9.99) as low-commitment entry.
   - **Bottom:** Post-purchase email (triggered by Gumroad webhook or manual tag) -> upsell to premium PayPal reading ($29 -> $79 -> $149).
2. Create in-article CTA components:
   - Build a reusable Eleventy shortcode or partial (e.g., `_includes/components/cta-reading.njk`) that renders a styled callout box.
   - Variant A: "Get your personalized BaZi reading" (links to $29 reading).
   - Variant B: "Download your zodiac compatibility guide" (links to $3.99 Gumroad product).
   - Insert into all 15 existing articles at the 60% scroll point and at article end.
3. Create dedicated landing pages:
   - `/readings/` -- comparison page for all 3 PayPal tiers ($29/$79/$149) with clear feature differentiation.
   - `/guides/` -- catalog page for all 6 Gumroad products with "most popular" badge on the highest seller.
4. Add exit-intent popup (lightweight JS, no third-party tool needed):
   - Trigger: mouse leaves viewport on desktop, or 60-second timer on mobile.
   - Offer: "Before you go -- get your free 2026 zodiac forecast" (newsletter signup).
   - Limit display to once per session using `sessionStorage`.
5. Implement UTM tracking on every internal CTA link to attribute conversions to specific articles.

#### 1.4 Set Up GA4 Conversion Funnels + E-Commerce Events [CRITICAL]

- **Priority:** CRITICAL
- **Effort:** 4 hours
- **Impact:** Without this, it is impossible to know which content drives revenue or which channels to invest in
- **Deadline:** March 14, 2026

Action steps:

1. Define conversion events in GA4:
   - `generate_lead` -- newsletter signup (fire on Beehiiv confirmation or FormSubmit success redirect).
   - `begin_checkout` -- click on any PayPal reading link.
   - `purchase` -- PayPal IPN callback or thank-you page load (pass `value`, `currency`, `transaction_id`).
   - `select_item` -- click on any Gumroad product link.
2. Implement events using `gtag()` calls or Google Tag Manager (GTM is recommended for maintainability):
   - If using GTM: create a new GTM container, add it to the base layout, and configure triggers for each event above.
   - If using inline gtag: add event calls directly to onclick handlers or a small event-delegation script.
3. Mark `generate_lead`, `begin_checkout`, and `purchase` as conversion events in GA4 Admin > Events > Mark as conversion.
4. Create a funnel exploration report in GA4 Explore:
   - Steps: `page_view` (article) -> `generate_lead` (signup) -> `select_item` (product click) -> `begin_checkout` (reading click) -> `purchase`.
5. Set up a weekly GA4 email report summarizing conversion counts and revenue attribution.

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

#### 2.2 Write and Publish 7 Queued Calendar Articles [HIGH]

- **Priority:** HIGH
- **Effort:** 21 hours (approximately 3 hours per article)
- **Impact:** Each article is a new organic search entry point; 16 -> 22 articles is a 38% content increase
- **Deadline:** April 30, 2026 (stagger 2 per week)

Action steps:

1. Review `contentCalendar.json` and sort the 7 queued articles by:
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

#### 2.3 Translate Article Bodies to Chinese [HIGH]

- **Priority:** HIGH
- **Effort:** 16 hours (for 15 articles, approximately 1 hour each including review)
- **Impact:** Unlocks the zh-Hans and zh-Hant audience segments; i18n infrastructure already exists but serves no translated content
- **Deadline:** May 15, 2026

Action steps:

1. Prioritize translation order by traffic: check GA4 for top 5 articles by pageviews; translate those first.
2. Translation workflow per article:
   - Use AI translation (DeepL or similar) for the initial draft.
   - Manual review by a native speaker (if budget allows, use Fiverr for $5--$15 per article; otherwise self-review).
   - Place translated content in the appropriate i18n directory structure per the existing Eleventy setup.
3. Verify hreflang tags are automatically generated correctly (the system already handles this per the current state).
4. Test translated pages on staging before deploying: check for encoding issues, layout breaks with CJK characters, and correct font rendering.
5. Submit translated URLs to Google Search Console.
6. After the first 5 translations, assess traffic impact before committing to the remaining 10.

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

#### 3.3 Make News Hub Filters Interactive [MEDIUM]

- **Priority:** MEDIUM
- **Effort:** 6 hours
- **Impact:** Improves user experience on the news hub; reduces bounce rate from category browsing
- **Deadline:** April 15, 2026

Action steps:

1. Identify the current static filter implementation (likely `<a>` tags that navigate to filtered category pages).
2. Replace with a client-side JavaScript filter:
   - On page load, read all article cards and their `data-category` attributes.
   - Render filter buttons for each unique category.
   - On button click, toggle visibility of non-matching cards using CSS `display: none` or a class toggle.
   - Update the URL hash (`#category=feng-shui`) for shareability without page reload.
3. Ensure progressive enhancement: if JavaScript fails, the static links should still work as fallback.
4. Keep the JS lightweight (vanilla JS, no framework) to preserve the current Core Web Vitals scores.
5. Test on mobile: ensure filter buttons are tap-friendly (minimum 44x44px touch targets).

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
| Wk 1  | Enable FormSubmit CAPTCHA. Install Facebook Pixel. Set up GA4 conversion funnels.                  |
| Wk 2  | Install Microsoft Clarity. Publish Qingming article. Upgrade first 5 directory listings.           |
| Wk 3  | Build cross-sell CTA component and insert into all 15 articles. Upgrade 5 more directory listings. |
| Wk 4  | Set up Pinterest business account + 20 initial pins. Publish 2 queued calendar articles.           |

**Success criteria at Day 30:**
- Facebook Pixel actively collecting data (verify 500+ PageView events).
- GA4 shows conversion events firing correctly (generate_lead, begin_checkout).
- 10+ directory listings upgraded to premium.
- Qingming article published and indexed. **DONE**
- Pinterest account live with 20+ pins.
- Cross-sell CTAs present in all existing articles.
- 17+ total published articles (16 existing + 1 calendar article minimum).

### Days 31--60 (April 7 -- May 6, 2026)

**Theme: Scale content and activate automated nurturing.**

| Week  | Deliverables                                                                                       |
|-------|----------------------------------------------------------------------------------------------------|
| Wk 5  | Publish 2 more queued articles. Set up Beehiiv welcome drip sequence (5 emails).                    |
| Wk 6  | Translate top 5 articles to Chinese. Create retargeting audiences in Facebook and Google.            |
| Wk 7  | Make news hub filters interactive. Set up TikTok account + produce first 3 videos.                  |
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
