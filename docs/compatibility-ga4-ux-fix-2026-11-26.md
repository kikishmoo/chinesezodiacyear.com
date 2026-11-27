# Compatibility calculator localization and GA4 UX QA — 2026-11-26

## Evidence and limits
- OpenSEO property **Trial** was verified to contain web stream `G-2QWWBEW512` for `https://chinesezodiacyear.com/`, connected to the Chinese Zodiac Year project.
- Organic search GA4 landing-page report for 2026-10-29 through 2026-11-25: `/compatibility` 50 sessions, 19 engaged sessions, 38% engagement rate; `/bazi-calculator` 302 sessions, 241 engaged, 79.8% rate. These numbers reveal a candidate investigation, **not the causal reason** for lower engagement.
- Source inspection found that the Traditional and Simplified Chinese compatibility forms had inline `onsubmit` handlers that copied input values to the English form and dispatched an English-form submit. The only result target was `#compat-result` inside the English language block, so the Chinese form had no corresponding visible result container.

## Change
- Chinese forms receive their own accessible result containers (`#compat-result-tc`, `#compat-result-sc`), labels tied to inputs, and no inline submit forwarding.
- One existing JS calculator initializes three forms and renders each result to the matching block. Chinese relation labels and explanatory summaries are translated; English result logic remains functional. When no locale-specific relation exists, retain existing English fallback; no predictive probabilities are invented.
- Calculations remain the original **birth-year-only** branch relationship; no claims to calculate exact solar-term-boundary zodiac from year alone.
- Existing `compatibility_check` event is emitted once per successful form submit and does not include the birth years. **No new analytics event or tag**, no new tracking scope or vendor changes.
- Vitest checks all three form paths, local result display, and single tracking call; static HTML check confirms matching forms/results and absence of inline English forwarding.

## Further QA and privacy gates
- Browser testing on mobile and desktop (English, Traditional Chinese, Simplified Chinese), including form validity, page switching, result visibility, keyboard accessibility and optional upsell layout, remains useful after deployment.
- GA4 reports currently show only `purchase` as a key event, with zero recent conversions; **do not promote compatibility_check to a GA4 key event without separate conversion design and data governance approval**.
- Current base template loads GA4, Meta Pixel, Clarity and AdSense before a documented privacy consent gate. Track consent/privacy review independently before introducing additional behavioral tracking or ad personalization.
- Payment report PR #21 stays paused, and Worker deployment requires explicit manual release. Do not modify payment or Google Ads.

## Monitoring
Compare equivalent 28-day windows after recrawling/deployment, with segment-level device and language/path analysis. Do not infer improvements from small sample noise or misattribute to this change without follow-up.
