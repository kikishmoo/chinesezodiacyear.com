# GSC content optimisation and CI recovery — 2026-11-22

## Verified live first-party evidence
- Property: `sc-domain:chinesezodiacyear.com`, Web Search, final data, 2026-08-19 through 2026-11-19 (Pacific Time). OpenSEO's Google Search Console connection.
- Dragon–Monkey page: 219 clicks / 11,886 impressions / 1.84% CTR / 4.9 average position. High-demand queries include “dragon and monkey compatibility” (22 clicks / 1,068 impressions, position 4.6) and “monkey and dragon compatibility” (16 clicks / 1,113 impressions, position 4.7).
- Dragon–Rooster page: 92 clicks / 5,284 impressions / 1.74% CTR / 6.5 average position. Queries include “dragon and rooster compatibility” (9 clicks / 433 impressions, position 7.9) and reverse order “rooster and dragon compatibility” (5 clicks / 500 impressions, position 8.9).
- Calendar hub: 32 clicks / 7,170 impressions / 0.45% CTR / 9.4 average position. The visible query breakdown is sparse and includes queries with very low counts, so do not infer that most of the page's impressions are specifically for “chinese calendar”. Postpone title rewrites until query-intent evidence improves.
- 2026 lucky colors: 180 clicks / 21,108 impressions / 0.85% CTR / 7.9 average position. Impressions include “2026 lucky” and “lucky color 2026”, but the queries are broad; do not promise a high CTR simply by changing titles.

## Confirmed deploy failure and correction
The main `Build and Deploy` workflow run `45072174573` failed its test job because `scripts/analyze-gsc-export.test.mjs` used `node:test` inside Vitest's default file discovery: `No test suite found`. The dedicated SEO PR workflow had previously passed because it ran `node --test`. This PR changes the test import to Vitest and the dedicated workflow to run tests with Vitest consistently. These changes must pass both the SEO CI and the main full test workflow.

An **independent high/critical npm audit** failure is present in the main workflow. This PR does NOT override `npm audit`, upgrade dependencies blindly or deploy draft paid-reports PR #21. Track remediation in a separate dependency security branch with full test, build and Worker safety review.

## Editorial change
Adds specific English, Traditional and Simplified Chinese contextual sections to only two high-demand compatibility pairing pages through the shared Nunjucks template:
- Dragon (辰) and Monkey (申) join Rat (子) in `申子辰` / Water Three Harmonies, without invented compatibility percentages; links to Dragon–Rat and Monkey–Rat and the five-element reference.
- Dragon (辰) and Rooster (酉) are traditionally categorized as `辰酉六合`, with the Metal association in the branch-combination scheme. Both query orderings and the Rooster/Chicken English synonyms are explained.
- These are cultural interpretations, not empirical predictions. No birth data collection, quiz algorithm, checkout or ad changes.

## Outcome measurement
After Google recrawls, compare complete 28-day windows at query/page granularity for specific URLs and query orderings; do not use immediate post-merge days to assess uplift. Record impression changes, CTR, position, and device before attributing impact.
