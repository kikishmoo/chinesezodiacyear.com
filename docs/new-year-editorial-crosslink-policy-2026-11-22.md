# New Year editorial crosslink policy — 2026-11-22

**Owner decision:** Every substantive article focused on Chinese New Year / Spring Festival, New Year names or calendars, or the influence of Chinese New Year on other regional New Year traditions should contextually crosslink to the naming-history explainer and these three related hubs:

1. [Chinese New Year vs. Lunar New Year — terms and naming history](/chinese-new-year-vs-lunar-new-year/) — presently **English-only** (`noI18n: true`).
2. [Spring Festival — history and customs](/spring-festival/).
3. [Chinese Calendar — lunisolar structure and solar terms](/calendar/).
4. [Chinese New Year’s influence across Asia](/chinese-new-year-influence/).

## Editorial implementation
- Opt in via front matter `newYearNamingCrossLink: true`; the article layout renders `src/_includes/partials/new-year-naming-crosslink.njk` after the body. Use only for relevant articles, not unrelated site pages or commercial reports.
- English, Traditional Chinese and Simplified Chinese hub links point to their existing translated routes. The English-only naming essay always uses its English root URL; describe it as an English-language explainer in Chinese copy rather than linking to nonexistent translations.
- Add **contextual in-body links** where useful; the shared block supplies consistent related navigation but does not replace an editorially meaningful reference.
- The shared block presents naming questions as a historical and terminology topic; do not assert that every usage of “Lunar New Year” intentionally obscures Chinese origins. Distinguish Chinese Spring Festival history from Korean, Vietnamese and other distinct New Year customs and preserve source-based attribution.
- Never insert the block on the naming essay itself; avoid self-linking where possible when editing article bodies.
- Build validator checks hub and naming links in representative generated English and Chinese pages. Respect `noI18n: true` articles.
- Before publishing future New Year articles, check the destination pages and cite Purple Mountain Observatory for modern Chinese calendar computation and specific dated records for pre-Qing history.

## 2026-11-22 rollout
Added this opt-in to 12 existing relevant articles/hubs including Spring Festival, Chinese Calendar, Chinese New Year influence, 2027 Fire Goat guide and festivals/traditions posts. No product, payment or advertising changes.
