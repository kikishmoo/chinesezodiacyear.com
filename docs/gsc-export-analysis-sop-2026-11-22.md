# Free Google Search Console performance export workflow

Purpose: turn actual search results into prioritized editorial decisions without granting Google credentials to the repository or buying a reporting tool.

## Before collecting data

1. Sign in to [Google Search Console](https://search.google.com/search-console). A Google Ads account is **not** the same as Search Console and does not grant automatic access. Select or verify the domain property for `chinesezodiacyear.com`.
2. In **Performance > Search results**, choose **Search type: Web**, then a **3-month date range ending on a complete day**. Note the exact dates and whether filters were used. Never combine differently filtered periods.
3. Use the **Export** control. Google's CSV option normally provides a ZIP with dimensional tables, including `Queries.csv` and `Pages.csv`. Other dimensions can be inspected separately. Google documents the format here: https://support.google.com/webmasters/answer/12919797
4. Keep any exported data in a secure local folder, not a publicly visible GitHub branch or Actions artifact.

## Offline analysis

Node 20+ already supports the analysis script; no npm installation or new paid service is required.

```bash
node scripts/analyze-gsc-export.mjs /private/path/to/Queries.csv /private/path/to/Pages.csv > /private/path/to/seo-priorities.md
# or pass the extracted CSV directory:
node scripts/analyze-gsc-export.mjs /private/path/to/gsc-export/ > /private/path/to/seo-priorities.md
```

The script validates CSV headers, parses quoted cells, checks that CTR and basic metrics are plausible, and lists up to 25 review candidates for queries and pages. It outputs to standard output, not the repository. Its sorting is a **review heuristic**: not a predicted uplift, not earnings, and not a complete dataset. Queries and pages use different aggregations; do not add their metrics together. Query privacy filters, sampling/top-row limits, filtered exports and canonical attribution can change interpretation.

If you prefer, upload the Search Console ZIP or `Queries.csv` and `Pages.csv` directly into the ChatGPT conversation. The agent can then perform the comparison and prioritize content. You do **not** need to install an external marketing app or share a Google login.

## Further validation

- Export the prior comparable date range for seasonality and trend assessment.
- Check **Indexing > Pages** and **Sitemaps**. Prioritize crawl/indexing fixes before titles if a page is not indexed.
- Use the GA4 property linked to web stream `G-2QWWBEW512` for organic landing-page engagement, **but verify it is collecting data and respects applicable consent rules before using the statistics**.
- Keep the Google Ads account inactive for spending purposes unless the board separately approves campaigns, budgets, conversion import settings, privacy compliance and the paid-checkout security release.
- Never publish user query exports, raw conversion IDs, birth dates, emails, buyer tokens or analytics credentials to the site.

## First review questions

- Which URLs have impressions and positions 5–20 with a matching target query?
- Are low CTR pages relevant to the query intent, and do their title/description accurately describe their content?
- Which 2027 Fire Goat, calendar, Spring Festival and terminology pages already receive demand?
- Are English, Traditional and Simplified Chinese landing pages indexed and earning impressions?
- Do existing internal links to `/spring-festival/`, `/calendar/`, `/chinese-new-year-influence/` and `/chinese-new-year-vs-lunar-new-year/` help users navigate the topic cluster?

**Reporting cadence:** monthly or after major publishing updates; use the same date window, search type and filters for fair comparisons.
