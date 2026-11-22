# Google Search Console evidence-led landing-page optimization — 2026-11-22

## Data basis
Connected OpenSEO's **google search console** account (not Primary) for verified domain property `sc-domain:chinesezodiacyear.com`. Search type Web, final daily data, August 19–November 19, 2026 (Pacific Time). These are first-party search metrics, not visitors, orders, revenue or predicted ranking changes.

Selected Search Console **page-dimension** observations:

| URL | Clicks | Impressions | CTR | Avg. position |
| --- | ---: | ---: | ---: | ---: |
| /bazi-calculator/ | 929 | 20,311 | 4.57% | 8.9 |
| /compatibility/ | 144 | 20,050 | 0.72% | 8.9 |
| /compatibility/dragon-monkey/ | 219 | 11,886 | 1.84% | 4.9 |
| /calendar/ | 32 | 7,170 | 0.45% | 9.4 |
| /lucky-colors-numbers-2026/ | 180 | 21,108 | 0.85% | 7.9 |

Selected **query-dimension** observations:
- “chinese zodiac calculator year, month, day hour”: 270 clicks / 1,157 impressions / average position 2.2.
- “bazi calculator”: 50 clicks / 604 impressions / average position 31.0.
- “chinese zodiac compatibility chart”: 7 clicks / 431 impressions / average position 8.3.
- “dragon and monkey compatibility”: 22 clicks / 1,070 impressions / average position 4.6.

Query and page breakdowns are separate aggregations and must never be summed. Only reviewed high-signal rows are recorded; Google Search Console can suppress/omit some queries and its row retrieval may be limited.

## Completed in this PR
- Improve BaZi calculator title/description and add a brief, factual explanation of year/month/day/hour inputs, time adjustment and scope; no algorithm or sensitive data flow changes.
- Improve compatibility chart page description and heading, aligned with actual chart/interactive functionality.
- Adjust dynamic pair-page title, description and section heading to explicitly describe *Chinese zodiac compatibility*, and link to the all-animals chart. This is a template used by all pair URLs, so QA checks a representative high-traffic pair.
- Add output-level SEO build checks.

## QA and constraints
- No promises of more clicks, rank position, revenue or scientific efficacy.
- No paid advertisements; no Google Ads account changes, tag changes or customer-birth-data collection changes.
- No changes to payment Worker or draft release gate PR #21.
- Review Search Console on comparable complete 28-day windows after the new pages are indexed; record before/after ranges, search demand, devices and seasonality. Avoid declaring causation from a simple temporal change.
- Next investigation: determine the *actual* page/query breakdown for /calendar/ and /lucky-colors-numbers-2026/ before changing their metadata; total page impressions alone do not identify the search intent.
