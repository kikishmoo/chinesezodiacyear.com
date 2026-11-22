# Acquisition and measurement baseline — 2026-11-22

## Scope / evidence
Read-only repository audit of source analytics, checkout events and previously merged SEO checks. No authenticated Google Search Console, Google Analytics 4 or Google Ads access. **No measured clicks, rankings, sessions, CPA, orders or revenue are asserted.** Having a Google Ads account does **not** establish GA4 or Search Console access or imply campaigns are active.

## Source findings
- `src/_data/site.json` includes GA4 web stream ID `G-2QWWBEW512`. `src/_includes/layouts/base.njk` loads `gtag.js` and calls `gtag('config', ...)`.
- `src/js/analytics.js` provides `track()`; `src/js/features/report-checkout.js` invokes `begin_checkout` during PayPal order creation and `purchase` upon a successful application capture response. Revenue and items are configured in source; verify in GA4 DebugView, Realtime and transaction deduplication before relying on them. Purchase delivery and secure recovery remain gated by draft PR #21.
- GA4, Meta Pixel and Microsoft Clarity appear to load by default from the base template. No consent management is apparent in the audited sections. **Privacy/legal review required**: applicable jurisdictions, lawful basis, opt-out/consent behavior, visitor notices and whether ad-personalization or remarketing should stay disabled. Do not enable remarketing, conversion imports or Ads campaigns before review.
- `src/_data/site.json` includes an AdSense identifier. **AdSense publisher advertising is different from Google Ads advertiser campaigns**; neither implies live spend or revenue.
- Technical SEO build checks and trilingual 2027 Fire Goat content were completed in PRs #22/#23. This is a source/CI result, not evidence of search indexing or organic traffic gains.
- The static Pages website may deploy on main even when the Worker dependency audit fails; maintain the security release gate and do not treat an overall red workflow as proof the Pages deployment failed.

## Recommended zero-spend Google data setup

1. Open Search Console `https://search.google.com/search-console` and confirm verified **Domain property** `chinesezodiacyear.com`. If absent, create it and use Google's DNS TXT verification through the existing DNS provider; do not send passwords/verification tokens to chat. Inspect indexing/sitemap and performance.
2. Open GA4 `https://analytics.google.com/`, select the property with web stream measurement ID `G-2QWWBEW512`, verify Realtime page views and page path, web stream hostname, and whether user consent/personalization settings are compliant.
3. Optionally link Search Console and GA4 only after identifying the correct property and appropriate permission. **Do not link Google Ads or import conversions automatically**: account exists, but campaign spend is intentionally paused pending owner approval.
4. Export GSC Search Results reports for last complete 3 months and comparable prior period: queries, landing pages, countries, devices, clicks, impressions, CTR and average position. Include date range and search type. Export Indexing > Pages and Sitemaps coverage too. Do not expose private account IDs or user information publicly.
5. From GA4 export Traffic acquisition (sessions, default channel group, engaged sessions) and Landing page (sessions, engagement) for the same period, excluding payment order identifiers, birth data and any personal dimensions.
6. Google Ads, if already running: export **read-only** existing campaign status, costs, clicks, conversions and conversion actions for the same period. No new campaigns, budgets, targeting or imports without the board's permission.

## First decision framework
- Page/query with high impressions and low CTR: inspect SERP intent and title/description accuracy before editing; avoid keyword stuffing.
- Queries where relevant existing page ranks around positions 5–20: audit answer quality, authority, primary citations and internal links before creating a duplicate.
- Page indexed but low demand: do not prioritise solely from low traffic. Verify seasonal relevance (2027 Fire Goat) and whether there is a useful query cluster.
- Identify bilingual/Chinese performance by page path prefix, not nationality or assumed visitor identity.
- Compare GA4 ecommerce purchase values with actual verified paid PayPal transactions **only after** end-to-end fulfilment and refund reconciliation pass; browser events are not accounting records.

## Measurement QA / privacy release gates
- Confirm Analytics DebugView receives `page_view`, `begin_checkout`, `purchase` with expected parameters without birth information, names, emails or client secrets.
- Prevent duplicate purchases from repeat captures or network retries using stable transaction IDs and clear event ownership; do not count a checkout approval as settled revenue without server verification.
- Check consent handling before allowing tag-based remarketing or Ads conversion imports; audit privacy policy, data retention and visitor choices.
- Keep paid advertising budget at $0 until security PR #21 is deployed and sandbox purchase/refund/delivery QA passes.

## Next operator action
Ask owner to confirm Search Console Domain property access, then use a read-only connector or downloadable GSC/GA4 exports. Plugin connection, if chosen, requires user authorisation and may have its own price; check before subscribing. No paid integration is required for manual exports.
