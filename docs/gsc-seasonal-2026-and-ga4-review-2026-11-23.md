# GSC-driven seasonal article improvement and GA4 discovery — 2026-11-23

## First-party measurement scope
OpenSEO connection named **google search console**; GSC verified domain property `sc-domain:chinesezodiacyear.com`. Search type Web, final data, 2026-10-24 through 2026-11-20 (Pacific Time).

| Page | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| `/bazi-calculator/` | 291 | 5,885 | 4.94% | 10.5 |
| `/lucky-colors-numbers-2026/` | 41 | 6,195 | 0.66% | 7.6 |
| `/compatibility/dragon-monkey/` | 39 | 3,170 | 1.23% | 6.3 |
| `/compatibility/` | 30 | 2,839 | 1.06% | 8.5 |

Selected query examples for the seasonal lucky-colors page: `2026 lucky` has broad intent and `lucky color 2026` has high impressions but low clicks; a short factual answer may help match user intent, but CTR is influenced by rank, device, SERP appearance and competition. These rows must not be summed with page-level metrics, and no uplift is projected.

## Editorial changes
- Shorten the distance from page heading to direct answer for "2026 lucky colors / lucky numbers" in English, Traditional and Simplified Chinese.
- Explicitly identify red/purple/orange as Fire correspondences, green as Wood, Hetu 2/7 as Fire and 3/8 as Wood **within traditional interpretation**, avoiding claims that symbolism produces measurable success or health outcomes.
- Contextual links to `/wuxing/` and `/calendar/`, plus `/chinese-new-year-2027/` to distinguish the next Fire Goat year from 2026 Fire Horse.
- Improve English page title and snippet description and update dateModified truthfully; add static build checks.
- No automatic advertisement changes, payment/Worker deployment, user data changes, or extra publishing costs.

## GA4 read-only connection check
OpenSEO `list_google_analytics_properties` on the connected GSC account returned one GA4 property with **displayName="Trial"**, not selected for the project. The repository specifies the GA4 measurement stream ID `G-2QWWBEW512`; **a property display name does not prove this is the corresponding GA4 property**. Do not bind "Trial" to the website or state sessions/conversions until a web stream measurement-health check establishes the match. The owner may confirm GA4 stream ID in the Google Analytics interface, or connect the correct property in OpenSEO. Keep these distinct from Google Ads advertiser campaign accounts and from AdSense.

## Next operating steps
1. Monitor GSC query+page after Google recrawling using comparable complete 28-day windows, ensuring device and country shifts are considered; no causal claims without more evidence.
2. Identify GA4 property containing the expected web stream; read measurement health and acquisition once verified, and conduct visitor-consent review before relying on marketing tags.
3. Preserve the manual production Worker deploy gate from PR #30. Draft paid-report PR #21 remains paused.
