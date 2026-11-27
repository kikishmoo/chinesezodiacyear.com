# Optional tracking and privacy consent engineering gate — 2026-11-27

## Source audit
Before this change, `src/_includes/layouts/base.njk` always loaded:
- GA4 tag `G-2QWWBEW512` from Google Tag Manager/Google Analytics
- Meta Pixel from `connect.facebook.net`, including a no-script image fallback
- Microsoft Clarity
- Google AdSense publisher script when `site.adsenseEnabled`
- An external Web Vitals script loaded after checking that `window.gtag` exists

The old trilingual `/about/#privacy` notice claimed, inaccurately, that no third-party advertiser tracking cookies were used and that personal data was not shared with any third party.

## Changes
- Introduce `/consent.js` as a first-party consent controller on all pages. It stores a versioned `czy-consent-v1` preference in localStorage; initial state and invalid/missing preferences default to **no optional tracking**.
- Separate optional categories: **analytics** (GA4 + Clarity) and **advertising/marketing** (AdSense + Meta Pixel). Reject, Analytics only, Accept all and granular Save choices are available in English, Traditional and Simplified Chinese.
- Expose **Privacy choices** in the global footer to revisit preferences. Revocation causes a full reload so dynamically loaded scripts from the previous selection do not continue running on the same page. Previously written third-party cookies are NOT automatically removed.
- When GA4 is enabled, explicitly disable Google Signals and Google ad-personalisation signals in `gtag('config')`. No new GA4 events are added and no Google Ads conversions or spending are enabled.
- The old unconditional Web Vitals external module is disabled rather than loaded before consent. The source `site.ga4Id`, `site.facebookPixelId`, `site.clarityId` and AdSense publisher ID remain unchanged.
- Update `/about/#privacy` in the three languages to explain the services, browser preferences and remaining third-party interactions. Do not assert legal compliance solely from implementation.

## QA
Unit tests cover zero network tag script insertion without consent, refusal, analytics-only, marketing-only and withdrawal/reload. Generated HTML is checked for the controller asset, missing unconditional vendor code, footer choice control and static asset shipping.

## Important limits / follow-up gates
- This is a **technical default-deny gate** for four global tags, **not a certified CMP** and not legal advice. A qualified jurisdictional privacy review must confirm adequacy of the choices, cookie disclosures, audience ages, recordkeeping, legal bases and any GDPR/ePrivacy/US-state-law requirements, including AdSense-certified CMP requirements where applicable.
- Google Fonts, embedded video, social comments (Giscus), newsletter, third-party forms, external links, PayPal, and potentially per-page scripts may still contact third parties. Audit those interactions separately before making any site-wide no-tracking claim.
- Some already-deposited cookies from visits before the update may persist; visitors may clear relevant cookies in browser settings. Preferences are browser-local, with no remote consent log.
- AdSense ad views and GA4 sessions may **decline** because scripts are no longer loaded for visitors who have not opted in. This is expected measurement coverage change, not necessarily a traffic or revenue change. Start a new measurement baseline from release date, segment by consent status only with privacy approval; do not conflate pre/post analytics totals.
- Accessibility: keyboard operation and screen-reader behavior are supported in markup but should receive manual browser and mobile QA. Users should be able to choose optional categories separately. Verify no UI conflict with promotional newsletter popups.
- Paywall/paid reports draft PR #21 remains paused, and production Worker stays manually gated. Do not change Ad campaigns or budgets, import conversion events, rerun D1 migrations, or trigger Worker deployments.

## Rollout and rollback
Merge only after Vitest, generated HTML checks and GitHub Pages build succeed. Confirm GitHub Pages deploy succeeds and Worker is skipped. On any regression affecting critical site content, revert the static frontend PR through GitHub without touching database or Worker.
