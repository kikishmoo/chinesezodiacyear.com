# Prediction Log

> **Purpose:** Record predictions before making decisions. Fill in actuals after. The "Delta" column reveals systematic biases over time.
> **Rule:** Every major decision gets a prediction entry BEFORE execution. Don't skip this — it's the fastest way to calibrate agent judgement.
> **Last updated:** 2026-03-09

---

## Format

```
### [YYYY-MM-DD] — [Short description]

**Decision:** What you're about to do
**Prediction:** What you expect will happen
**Confidence:** Low / Medium / High
**Actual result:** (fill in after)
**Delta:** (what was different from prediction)
**Adjustment:** (what to do differently next time)
```

---

## Log Entries

### 2026-03-09 — GA4 event tracking implementation

**Decision:** Add 16 gtag event calls to site.js covering all interactive features
**Prediction:** Build will pass on first attempt; JS minification will handle the added ~2KB; no existing functionality will break
**Confidence:** High
**Actual result:** Build passed. JS went from ~50KB to ~52KB source (32.2KB minified). No regressions detected.
**Delta:** None — prediction was accurate
**Adjustment:** None needed

---

### 2026-03-09 — "No single lunar new year" argument addition

**Decision:** Add cross-cultural calendar comparison (Islamic, Hebrew, Hindu, Thai, Tibetan) to the CNY vs LNY article
**Prediction:** The argument will strengthen the article's position without making it too long; build will pass; no i18n impact since article is English-only
**Confidence:** High
**Actual result:** Build passed (302 pages). Read time increased from 10 to 12 min. Article remains English-only. Content fits naturally in the existing calendar-system section.
**Delta:** None significant
**Adjustment:** None needed

---

### 2026-03-09 — LNY terminology rejection across 4 files

**Decision:** Update all editorial-voice "Lunar New Year" references to reject the term, across 4 template files
**Prediction:** 92 instances found; most will be SEO/factual (keep intact), ~8-10 editorial-voice instances need updating
**Confidence:** Medium — uncertain about exact count of editorial vs factual instances
**Actual result:** Updated FAQ answers in 4 files + rewrote "What Should You Call It?" section. SEO keywords and factual VANK reporting preserved.
**Delta:** Fewer editorial instances than expected — most were already in factual/SEO context
**Adjustment:** When doing terminology audits, separate instances by context type (editorial/SEO/factual) before counting

---

### 2026-03-09 — Affiliate products expansion and repositioning

**Decision:** Expand from 10 to 27 affiliate products with 3 new categories (jewellery, decor, wellness), and move the affiliate section to the top of the shop page
**Prediction:** Adding 17 products and 3 new categories will work cleanly with the existing scoped filter JS. Moving the section to the top in all 3 language blocks will require careful surgery to avoid breaking the Nunjucks template. Build will pass.
**Confidence:** High — the filter scoping was already designed for extensibility; the template structure is straightforward cut-and-paste
**Actual result:** All 17 products added, 3 new filter buttons per language block. Affiliate section moved to top in EN/TC/SC. Build passed on first attempt (302 files, 596 variants, 0 errors).
**Delta:** None — prediction was accurate
**Adjustment:** None needed

---

### 2026-03-09 — Encyclopaedia translation completion (Yi Jing, Tea Culture, Qi Men Dun Jia)

**Decision:** Translate the 3 remaining untranslated encyclopaedia pages to TC/SC, completing the translation backlog
**Prediction:** Translations will follow the established three-block i18n pattern without issues; build will pass; all 3 pages will generate zh-hant and zh-hans variants correctly
**Confidence:** High — same pattern used successfully for 4 pages in session 1
**Actual result:** All 3 pages translated successfully. Build passed (302 pages, 596 i18n variants). All new zh-hant/zh-hans URLs confirmed working.
**Delta:** None — prediction was accurate
**Adjustment:** None needed

---

### 2026-03-09 — Affiliate products addition to shop page

**Decision:** Add 10 Amazon Associates affiliate products (6 books, 4 tools) to the shop page with trilingual support and independent filter controls
**Prediction:** The existing shop filter JS will need refactoring since it uses global selectors — adding a second filter group will cause cross-interference. Expect 1 build pass after the refactor. Affiliate links with `rel="noopener sponsored"` will be SEO-safe.
**Confidence:** Medium — confident about the need for JS refactoring, less certain about the exact scoping approach
**Actual result:** JS refactored to per-`.shop-filters` group scoping using `nextElementSibling`. Build passed on first attempt. All 10 products render correctly in EN/TC/SC with independent filter controls.
**Delta:** The `nextElementSibling` approach was simpler than anticipated — no need for explicit ID-based wiring between filter groups and grids
**Adjustment:** When adding parallel UI components that share JS behaviour, check for global selectors early and scope them per-instance from the start

---

### 2026-03-09 — Affiliate link fix: search URLs → direct product links

**Decision:** Replace all 16 Amazon search URLs (`/s?k=...`) in shop.json with direct product links (`/dp/ASIN`) for reliable affiliate commission attribution
**Prediction:** Finding real ASINs via web search will work for all 16 products. The URL format change is data-only (no template changes), so build will pass on first attempt with zero regressions.
**Confidence:** High — URL format is a simple string replacement in shop.json; template already renders whatever URL is in the data
**Actual result:** All 16 ASINs found via Amazon search. All URLs replaced. Build passed (302 files, 596 variants, 0 errors). Built shop page confirmed: 27 affiliate links with tag, 0 search URLs.
**Delta:** None — prediction was accurate
**Adjustment:** When adding affiliate products in future, always use direct `/dp/ASIN` links from the start, never search URLs

---

<!-- Add new entries above this line -->
