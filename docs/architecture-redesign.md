# Architecture Redesign Proposal: chinesezodiacyear.com

> **Date:** 2026-03-19
> **Author:** Architecture review (via MuleRun Super Agent)
> **Status:** Phases 1, 2, 3, and 5 COMPLETE (2026-03-27). Phase 4 (template/data refactor) planned. Phase 6 (data layer + D1 database) is IN PROGRESS: Steps 1-3 scaffolded (2026-03-27).
> **Audited:** 2026-03-27 by kiki.peiqi.greene (via MuleRun Super Agent). Full codebase audit + architecture review.
> **Scope:** Full stack (Cloudflare Worker backend + Eleventy frontend)

---

## Context

The site has grown organically from a simple zodiac encyclopaedia to a 900-page trilingual content platform with a Cloudflare Worker backend. Both frontend and backend suffer from monolithic file structures that impede maintainability, testability, and the ability to ship planned revenue features (automated PDF reports, API widgets). This proposal restructures both layers into modular, testable architectures while preserving the vanilla JS/CSS philosophy and SSG approach.

**Deliverable:** Architecture document (this file). No code changes.

---

## 1. Backend: Cloudflare Worker → Modular API

### Current State
Single file `worker/bazi-worker.js` (359 lines) — one POST endpoint, no router, no service layer, no tests, no caching. Scrapes 2 upstream services via fragile HTML parsing.

### Proposed Structure

```
worker/
  index.js                    # Entry: router dispatch + CORS + error handler
  router.js                   # Lightweight path/method router (no deps)
  middleware/
    cors.js                   # CORS origin validation
    error-handler.js          # Structured error responses + logging
    cache.js                  # Cache API wrapper
  routes/
    bazi.js                   # POST /v1/bazi/calculate
    health.js                 # GET /v1/health
    pdf-report.js             # POST /v1/bazi/report       (future)
    compatibility.js          # POST /v1/compatibility     (future)
    widget.js                 # GET  /v1/widget/embed.js   (future)
  services/
    bazi-service.js           # Orchestrates upstream calls, assembles chart
    solar-time-service.js     # True Solar Time calculation logic
  adapters/
    windada-adapter.js        # Scraper/parser for fate.windada.com
    zhouyi-adapter.js         # Scraper/parser for zhouyi.cc
  models/
    bazi-request.js           # Request validation schema
    bazi-response.js          # Response shape definition
    pillar.js                 # Pillar data structure
    errors.js                 # ValidationError, UpstreamError, TimeoutError, etc.
  data/
    stems.js                  # Heavenly Stems reference data
    branches.js               # Earthly Branches reference data
  lib/
    retry.js                  # Retry with exponential backoff (max 2 retries)
    circuit-breaker.js        # Open/half-open/closed per upstream host
    html-parser.js            # Shared stripTags, extractText utilities
  __tests__/
    fixtures/                 # Saved upstream HTML for deterministic testing
    adapters/                 # Parser unit tests against fixtures
    services/                 # Service tests with mocked adapters
    routes/                   # HTTP-level tests (CORS, status codes)
```

### Key Design Decisions

**Router:** Lightweight `{ method, path, handler }` table. API versioned via `/v1/` prefix. Current unversioned `POST /` kept as backwards-compatible alias during migration.

**Service layer:** Business logic with no HTTP knowledge. `BaziService.calculate(input)` validates → calls SolarTimeService → calls zhouyi adapter → returns typed response.

**Adapter interface:** Each adapter exports `{ fetch(params), parse(html) }`. Parsers testable against fixtures without network calls. Swapping upstream = writing a new adapter.

**Error handling:** Typed error classes (`ValidationError` 400, `UpstreamError` 502, `TimeoutError` 504, `CircuitOpenError` 503). Middleware maps to structured JSON: `{ error: { code, message, retryable } }`.

**Caching:** Cache API keyed on SHA-256 of canonical request JSON. TTL 24h. BaZi charts are deterministic — same input always yields same output.

**Testing:** vitest + saved HTML fixtures. Highest-value tests are parser tests (addresses Regression #6). Tests gate CI deployment.

---

## 2. Frontend JS: Modules + esbuild

### Current State
`src/site.js` (1,313 lines) — single DOMContentLoaded handler with nested IIFEs. `src/trivia.js` (199KB) — massive data-heavy file.

### Proposed Structure

```
src/js/
  main.js                     # Entry: imports + initialises features
  event-bus.js                # Lightweight pub/sub (~30 lines)
  analytics.js                # Centralised GA4 tracking layer
  features/
    nav.js                    # Mobile nav + dropdown toggles
    calculator.js             # Zodiac calculator form + results
    faq.js                    # FAQ accordion
    bazi-client.js            # BaZi API client + result renderer
    theme.js                  # Dark mode toggle + localStorage
    language.js               # Language toggle + URL rewriting
    newsletter.js             # Newsletter form (Beehiiv)
    popup.js                  # Exit-intent email popup
    filters.js                # Directory/shop/news filters
    lightbox.js               # QR code lightbox
    search.js                 # Search functionality
  data/
    zodiac-data.js            # 12-animal array (extracted from site.js)
    famous-figures.js         # Historical figures
    lichun-dates.js           # 1900–2100 Lichun table
  trivia/
    trivia-game.js            # Game logic only (~100 lines)
    trivia-data.js            # Quiz questions (lazy-loaded)
```

### Bundler: esbuild

Already a transitive dep of Eleventy. Sub-50ms builds. Runs in `eleventy.before` hook:

```js
await esbuild.build({
  entryPoints: ['src/js/main.js'],
  bundle: true, outfile: '_site/site.js',
  minify: true, format: 'iife', target: ['es2020'],
});
```

Replaces current terser post-build step.

### Cross-Feature Communication

Event bus (`on`, `off`, `emit`) replaces DOM-coupled communication. Examples:
- `bazi:calculated` → analytics tracks without coupling to BaZi client
- `language:changed` → theme module can react
- `popup:shown` → analytics tracks popup display

### Lazy Loading

Trivia and BaZi client loaded only when their containers exist on the page via dynamic `import()`. Keeps critical-path bundle small for content-only pages.

---

## 3. Frontend CSS: Component Files + esbuild

### Current State
`src/styles.css` (5,531 lines, 129KB). Well-organised with section comments but monolithic. 238 scattered `[data-theme="dark"]` selectors.

### Proposed Structure

```
src/css/
  main.css                    # @import chain (order matters for cascade)
  tokens/
    colors.css                # Colour palette custom properties
    typography.css            # Font stacks, sizes
    spacing.css               # Spacing scale
    shadows.css               # Shadow definitions
  base/
    reset.css                 # Box-sizing, margin reset
    body.css                  # Body defaults, paper texture
    typography.css            # Headings, paragraphs, lists
    accessibility.css         # Focus styles, reduced motion, sr-only
  layout/
    header.css                # Site header, nav, mobile menu
    footer.css                # Footer
    article-layout.css        # Article page grid + sidebar
  components/
    hero.css                  # Hero section
    cards.css                 # All card variants
    calculator.css            # Zodiac calculator
    bazi.css                  # BaZi chart display
    faq.css                   # FAQ accordion
    newsletter.css            # Newsletter form
    popup.css                 # Exit-intent popup
    buttons.css               # Button variants
    breadcrumbs.css           # Breadcrumb nav
    shop.css                  # Shop product grid
    directory.css             # Directory listings
    ... (one file per component)
  themes/
    dark.css                  # ALL 238 dark mode overrides consolidated
  utilities/
    spacing.css               # .mt-md, .mb-lg
    text.css                  # .text-center, .chinese-char, .pinyin
```

### Build

esbuild resolves `@import` and concatenates. Replaces CleanCSS post-build step:

```js
await esbuild.build({
  entryPoints: ['src/css/main.css'],
  bundle: true, outfile: '_site/styles.css', minify: true,
});
```

### Dark Mode Consolidation

All 238 `[data-theme="dark"]` selectors extracted from component files into `themes/dark.css`. Dark mode becomes a first-class concern instead of scattered overrides.

---

## 4. Template & Data Architecture

### eleventyComputed.js (545 lines → modular)

```
src/_data/
  eleventyComputed.js          # Slim orchestrator (~30 lines)
  computed/
    auto-related.js            # Related links per page type
    auto-faq.js                # FAQ orchestrator
    faq/
      zodiac-faq.js            # 12-animal FAQ data
      page-faq.js              # Hub page FAQ data
    related/
      zodiac-related.js        # /zodiac/{animal}/ links
      reading-related.js       # /readings/ links
      year-related.js          # /zodiac-year/ links
```

Each module independently testable. Zodiac FAQ data (200+ lines of text) moves to data files.

### Partials Reorganisation

```
src/_includes/partials/
  layout/       → header, footer, breadcrumbs, hero
  content/      → share-buttons, comments, affiliate-disclosure
  marketing/    → content-upgrade, cross-sell-cta, newsletter, email-popup, ad-unit
```

Requires bulk update of `{% include %}` paths across templates.

### i18n Improvements (without replacing the mechanism)

1. **Validation step:** After stripping, scan output for orphaned `lang-en/tc/sc` classes. Fail build if found.
2. **Extract stripping logic** to `scripts/i18n-strip.js` for independent unit testing.
3. **Consider `<template>` tags** instead of `<div>` for language blocks (cannot nest problematically).

---

## 5. Build Pipeline

### Updated Flow

```
eleventy.before:
  1. esbuild: src/js/main.js  → _site/site.js
  2. esbuild: src/js/trivia/  → _site/trivia.js
  3. esbuild: src/css/main.css → _site/styles.css

Eleventy build:
  4. Template rendering (302 pages)

eleventy.after:
  5. i18n stripping (generates /zh-hant/ + /zh-hans/)
  6. i18n validation (scan for orphaned lang-XX classes)
```

### CI/CD (deploy.yml)

```
test job:       npm test (vitest — worker parsers, JS modules)
build job:      Eleventy build + validation (gated on test)
deploy-pages:   GitHub Pages (gated on build)
deploy-worker:  wrangler deploy (gated on test, separate from frontend)
```

Worker and frontend deploy independently. Worker deployment automated in CI instead of manual.

### New Dev Dependencies

| Package | Purpose | Note |
|---------|---------|------|
| esbuild | JS + CSS bundling | Already transitive dep of Eleventy |
| vitest | Test runner | Dev only |

No new runtime dependencies.

---

## 6. Migration Strategy

### Phase Order

| Phase | Scope | Risk | Status | Revenue Impact |
|-------|-------|------|--------|----------------|
| **1. Worker restructure** | `worker/` | Low | **COMPLETE** (2026-03-27) | **Unblocks PDF reports** (Priority A) |
| **2. JS modularisation** | `src/js/` | Low–Med | **COMPLETE** (2026-03-27) | Lazy-loading improves page speed |
| **3. CSS modularisation** | `src/css/` | Low | **COMPLETE** (2026-03-27) | Maintainability |
| **4. Template/data refactor** | `src/_data/`, `partials/` | Low | Planned | Content velocity |
| **5. CI/CD unification** | `.github/workflows/` | Low | **COMPLETE** (2026-03-27) | Prevents regressions |
| **6. Data layer + D1 database** | `worker/`, `wrangler.jsonc` | Med | **IN PROGRESS** (2026-03-27) | **Unblocks revenue** (PDF reports, lead-gen) |

### Phase 1: Worker Restructure — COMPLETE (2026-03-21) + Gaps RESOLVED (2026-03-27)

**Completed:**

1. ✅ Extract adapters (`windada-adapter.js`, `zhouyi-adapter.js`)
2. ✅ Extract data constants (`stems.js` — branches merged here)
3. ✅ Create service layer (`bazi-service.js`)
4. ✅ Add router in `index.js` with `/v1/bazi/calculate` + `/v1/health`
5. ✅ Add error classes (`ValidationError`, `UpstreamError`, `TimeoutError`, `CircuitOpenError`)
6. ✅ Update `wrangler.jsonc` main to `worker/index.js`
7. ✅ Save HTML fixtures (4 files), write parser tests (55 test cases)
8. ✅ Add vitest
9. ✅ Add rate limiting (dual-layer: in-memory + KV)
10. ✅ Add CORS middleware with origin validation

**Gaps identified and RESOLVED in 2026-03-27 session:**

| Gap | File | Status |
|-----|------|--------|
| ~~Cache middleware not implemented~~ | `worker/lib/cache.js` | **RESOLVED** — Cache API wrapper with SHA-256 keying, 24h TTL |
| ~~Retry logic not implemented~~ | `worker/lib/retry.js` | **RESOLVED** — Exponential backoff, 2 retries, 500ms base |
| ~~Circuit breaker not implemented~~ | `worker/lib/circuit-breaker.js` | **RESOLVED** — Per-host state machine (5 failures → 30s recovery) |
| ~~Solar time logic embedded in windada adapter~~ | `worker/services/solar-time-service.js` | **RESOLVED** — Extracted with circuit breaker + retry wrapping |
| ~~Response schema not formalised~~ | `worker/models/bazi-response.js` | **RESOLVED** — JSDoc typedefs + validateResponse() |
| ~~Tests not running in CI~~ | `.github/workflows/deploy.yml` | **RESOLVED** — 4-job pipeline: test → build → deploy-pages + deploy-worker |
| ~~Worker not deployed via CI~~ | `.github/workflows/deploy.yml` | **RESOLVED** — deploy-worker job with CLOUDFLARE_API_TOKEN |
| ~~Two escape functions in site.js~~ | `src/js/utils/sanitise.js` | **RESOLVED** — Unified in Phase 2 JS modularisation |

**Phase 1 Completion Tasks — ALL RESOLVED (2026-03-27):**

1. ✅ `worker/lib/cache.js` — Cache API wrapper keyed on SHA-256 of canonical request JSON; 24h TTL
2. ✅ `worker/lib/retry.js` — Retry with exponential backoff (max 2 retries, 500ms/1s delays)
3. ✅ `worker/lib/circuit-breaker.js` — Per-host state machine (closed/open/half-open), 5 failures → open, 30s recovery
4. ✅ `worker/services/solar-time-service.js` — Extracted from windada adapter
5. ✅ `worker/models/bazi-response.js` — JSDoc-typed response shape definition
6. ✅ Tests for cache, retry, and circuit-breaker modules (24 new tests)
7. ✅ Wired cache + retry + circuit-breaker into `bazi-service.js`

**Verification:** Existing 55 tests still pass. New resilience tests pass. Manual comparison of response JSON before/after.

---

### Phase 2: JS Modularisation — COMPLETE (2026-03-27)

**Completed:** 22 ES modules extracted from monolithic `src/site.js` (1,339 lines). esbuild bundles into single IIFE (59.8KB → 36.2KB). terser removed. See CHANGELOG for full details.

**Original plan below retained for reference.**

**Current state (pre-modularisation):** `src/site.js` (1,339 lines), `src/trivia.js` (199KB). Single DOMContentLoaded handler with nested IIFEs. Two separate escape functions (`esc()` at line 761, `escapeHtml()` at line 580). Terser post-build minification.

**Target state:** ES module tree bundled by esbuild. Features isolated. Data extracted. Trivia lazy-loaded. Event bus for cross-feature communication. Single sanitisation utility.

#### Step-by-step execution order:

**2a. Scaffolding (no functional change)**

1. Create directory structure: `src/js/`, `src/js/features/`, `src/js/data/`, `src/js/trivia/`
2. Add esbuild to `eleventy.config.js` in `eleventy.before` hook:
   ```js
   const esbuild = await import('esbuild');
   await esbuild.build({
     entryPoints: ['src/js/main.js'],
     bundle: true, outfile: '_site/site.js',
     minify: production, format: 'iife', target: ['es2020'],
   });
   ```
3. Create `src/js/main.js` as thin orchestrator that imports and initialises features
4. Verify esbuild output loads correctly before proceeding

**2b. Extract data arrays (lowest risk)**

5. Extract `zodiacData` (12-animal array) → `src/js/data/zodiac-data.js`
6. Extract `famousFigures` → `src/js/data/famous-figures.js`
7. Extract `lichunDates` (1900–2100 table) → `src/js/data/lichun-dates.js`
8. Extract `relations` (compatibility data) → `src/js/data/compatibility-data.js`

**2c. Extract features one at a time (simplest → most complex)**

9. `src/js/features/theme.js` — Dark mode toggle + localStorage + `prefers-color-scheme` init
10. `src/js/features/nav.js` — Mobile nav toggle, dropdown menus, active state
11. `src/js/features/faq.js` — FAQ accordion open/close
12. `src/js/features/calculator.js` — Zodiac calculator form + result rendering
13. `src/js/features/compatibility.js` — Compatibility checker form + result rendering
14. `src/js/features/search.js` — Search index fetch, weighted scoring, result rendering
15. `src/js/features/bazi-client.js` — BaZi API client + chart result renderer
16. `src/js/features/newsletter.js` — Beehiiv form submission + popup
17. `src/js/features/popup.js` — Exit-intent email popup (30s delay + scroll trigger)
18. `src/js/features/filters.js` — Directory/shop/news filter buttons
19. `src/js/features/lightbox.js` — QR code lightbox (Alipay/WeChat)
20. `src/js/features/language.js` — Language toggle + URL rewriting

**2d. XSS hardening (during extraction)**

21. Create `src/js/utils/sanitise.js` — Single `escapeHtml()` function replacing both `esc()` and `escapeHtml()` in site.js
22. Migrate all `innerHTML` result renderers to use DOM API (`createElement`, `textContent`, `appendChild`) where user/API data is involved
23. Keep `innerHTML` only for static/hardcoded template strings (zodiac results from hardcoded data)

**2e. Cross-feature communication**

24. Create `src/js/event-bus.js` — Lightweight pub/sub (~30 lines: `on`, `off`, `emit`)
25. Create `src/js/analytics.js` — Centralised GA4 tracking layer wrapping `gtag()` calls
26. Wire events: `bazi:calculated`, `compatibility:checked`, `language:changed`, `popup:shown`, `newsletter:subscribed`

**2f. Trivia splitting**

27. Create `src/js/trivia/trivia-game.js` — Game logic only (~100 lines)
28. Create `src/js/trivia/trivia-data.js` — Quiz questions (data only)
29. Add separate esbuild entry point for trivia bundle
30. Lazy-load trivia via `import()` when `#trivia-container` exists on page

**2g. Cleanup**

31. Remove terser post-build step from `eleventy.config.js`
32. Delete `src/site.js` and `src/trivia.js`
33. Update `base.njk` script tag if path changes (should remain `_site/site.js`)

**Verification per step:** After each extraction (steps 9–20), verify:
- [ ] Build passes (`npx @11ty/eleventy`)
- [ ] Page loads correctly in English, zh-Hant, zh-Hans
- [ ] Light mode and dark mode both work
- [ ] No console errors
- [ ] Feature-specific interaction works (e.g., FAQ accordion opens/closes)

**Risk:** Medium. The monolithic IIFE structure means features may have hidden coupling (e.g., calculator depends on zodiacData which is also used by compatibility). Extract data first (step 5-8) to expose these dependencies.

---

### Phase 3: CSS Modularisation — COMPLETE (2026-03-27)

**Completed:** 43 modular CSS files extracted from monolithic `src/styles.css` (5,590 lines). esbuild bundles into single minified output (131.6KB → 100.4KB). CleanCSS removed. See CHANGELOG for full details.

**Original plan below retained for reference.**

**Current state (pre-modularisation):** `src/styles.css` (5,590 lines, ~129KB source). Well-organised with section comments. 258 `[data-theme="dark"]` selectors scattered throughout. CleanCSS Level 2 minification.

**Target state:** Component-based CSS files. Design tokens extracted. Dark mode consolidated. esbuild bundling.

#### Step-by-step execution order:

**3a. Create file structure**

1. Create directories: `src/css/`, `src/css/tokens/`, `src/css/base/`, `src/css/layout/`, `src/css/components/`, `src/css/themes/`, `src/css/utilities/`
2. Create `src/css/main.css` with `@import` chain (order matters for cascade)

**3b. Extract design tokens (`:root` custom properties)**

3. `src/css/tokens/colors.css` — All colour custom properties (~40 variables)
4. `src/css/tokens/typography.css` — Font stacks, sizes, line heights
5. `src/css/tokens/spacing.css` — Spacing scale
6. `src/css/tokens/shadows.css` — Shadow definitions
7. `src/css/tokens/animations.css` — Transition durations, easing functions

**3c. Extract base styles**

8. `src/css/base/reset.css` — Box-sizing, margin reset, border-box
9. `src/css/base/body.css` — Body defaults, paper texture background
10. `src/css/base/typography.css` — Headings (h1-h6), paragraphs, lists, links, blockquotes
11. `src/css/base/accessibility.css` — Focus styles, reduced motion, `.sr-only`, skip-to-content

**3d. Extract layout styles**

12. `src/css/layout/header.css` — Site header, primary nav, mobile menu, dropdowns
13. `src/css/layout/footer.css` — Footer columns, social icons, copyright
14. `src/css/layout/article-layout.css` — Article page grid, sidebar, TOC sidebar

**3e. Extract component styles (one file per component)**

15. `src/css/components/hero.css` — Hero section + variants
16. `src/css/components/cards.css` — All card variants (zodiac-card, reading-card, product-card, etc.)
17. `src/css/components/calculator.css` — Zodiac calculator form + results
18. `src/css/components/bazi.css` — BaZi chart display + pillar grid
19. `src/css/components/compatibility.css` — Compatibility checker results
20. `src/css/components/faq.css` — FAQ accordion
21. `src/css/components/newsletter.css` — Newsletter form + Beehiiv integration
22. `src/css/components/popup.css` — Exit-intent popup modal
23. `src/css/components/buttons.css` — Button variants (primary, secondary, ghost, CTA)
24. `src/css/components/breadcrumbs.css` — Breadcrumb nav
25. `src/css/components/shop.css` — Shop product grid + filter buttons
26. `src/css/components/directory.css` — Directory listings + badges
27. `src/css/components/share-buttons.css` — Social share buttons
28. `src/css/components/search.css` — Search form + results
29. `src/css/components/trivia.css` — Trivia game UI
30. `src/css/components/tables.css` — Data tables (sexagenary, elements, compatibility matrix)
31. `src/css/components/embeds.css` — Social embed grid (YouTube, Twitter)
32. `src/css/components/lightbox.css` — QR code lightbox
33. `src/css/components/comments.css` — Giscus comment wrapper
34. `src/css/components/cross-sell.css` — Cross-sell CTA cards
35. `src/css/components/content-upgrade.css` — Email capture CTA

**3f. Consolidate dark mode**

36. `src/css/themes/dark.css` — Extract ALL 258 `[data-theme="dark"]` selectors from component files into this single file. Each selector retains its original specificity.

**3g. Extract utilities**

37. `src/css/utilities/spacing.css` — `.mt-md`, `.mb-lg`, etc.
38. `src/css/utilities/text.css` — `.text-center`, `.chinese-char`, `.pinyin`

**3h. Wire esbuild**

39. Add esbuild CSS entry point in `eleventy.config.js`:
    ```js
    await esbuild.build({
      entryPoints: ['src/css/main.css'],
      bundle: true, outfile: '_site/styles.css', minify: true,
    });
    ```
40. Remove CleanCSS post-build step from `eleventy.config.js`

**3i. Validation and cleanup**

41. Diff minified output byte-for-byte against CleanCSS output — verify no rules lost
42. Visual comparison across 10 representative pages × 2 themes × 3 languages
43. Delete `src/styles.css`

**Verification:** After step 41, use a CSS diff tool or screenshot comparison to confirm zero visual regressions.

**Risk:** Low. CSS splitting is mechanical (cut along section comment headers). The main risk is import order affecting specificity cascade — maintain exact original order in `main.css`.

---

### Phase 4: Template/Data Refactor — DETAILED PLAN (2026-03-27)

**Current state:** `src/_data/eleventyComputed.js` (545 lines) — monolithic computed data orchestrator. 12 partials in flat `src/_includes/partials/` directory. No i18n validation step.

**Target state:** Modular computed data modules. Partials organised by function. i18n validation in build pipeline.

#### Step-by-step execution order:

**4a. Split eleventyComputed.js**

1. Create `src/_data/computed/` directory
2. Extract `auto-related.js` — Related links orchestrator per page type (~150 lines)
3. Extract `auto-faq.js` — FAQ orchestrator (~100 lines)
4. Create `src/_data/computed/faq/zodiac-faq.js` — 12-animal FAQ data (~200 lines of text)
5. Create `src/_data/computed/faq/page-faq.js` — Hub page FAQ data
6. Create `src/_data/computed/related/zodiac-related.js` — `/zodiac/{animal}/` link logic
7. Create `src/_data/computed/related/reading-related.js` — `/readings/` link logic
8. Create `src/_data/computed/related/year-related.js` — `/zodiac-year/` link logic
9. Slim `eleventyComputed.js` to ~30-line orchestrator that imports modules

**4b. Reorganise partials**

10. Create subdirectories: `src/_includes/partials/layout/`, `src/_includes/partials/content/`, `src/_includes/partials/marketing/`
11. Move partials:
    - `layout/` ← `header.njk`, `footer.njk`, `breadcrumbs.njk`, `hero.njk`
    - `content/` ← `share-buttons.njk`, `comments.njk`, `affiliate-disclosure.njk`
    - `marketing/` ← `content-upgrade.njk`, `cross-sell-cta.njk`, `newsletter.njk`, `email-popup.njk`, `ad-unit.njk`
12. Bulk-update all `{% include %}` paths across all templates:
    - `{% include "partials/header.njk" %}` → `{% include "partials/layout/header.njk" %}`
    - etc. for all 12 partials
13. Verify build output HTML identical before/after (diff `_site/`)

**4c. Add i18n validation**

14. Create `scripts/i18n-validate.js` — Post-build scanner that:
    - Reads all HTML files in `_site/zh-hant/` and `_site/zh-hans/`
    - Checks for orphaned `class="lang-en"` blocks (should have been stripped)
    - Checks for orphaned `class="lang-tc"` in zh-hans (should have been stripped)
    - Checks for orphaned `class="lang-sc"` in zh-hant (should have been stripped)
    - Fails build with specific file:line if any found
15. Extract i18n stripping logic from `eleventy.config.js` into `scripts/i18n-strip.js` for independent unit testing
16. Add i18n validation to `eleventy.after` hook (runs after stripping)

**4d. Write tests for computed modules**

17. Unit tests for `auto-related.js` — verify correct links for each page type
18. Unit tests for `auto-faq.js` — verify FAQ arrays for representative pages
19. Unit tests for `i18n-validate.js` — verify detection of orphaned lang classes

**Verification:** Diff build output HTML before/after refactoring. Zero differences expected (pure restructuring).

**Risk:** Low. The main complexity is the bulk `{% include %}` path update — use a script or find-and-replace to avoid missing any references.

---

### Phase 5: CI/CD Unification — COMPLETE (2026-03-27)

**Completed:** `deploy.yml` restructured into 4 jobs: test → build → deploy-pages + deploy-worker. Tests gate all deployments. Worker auto-deploys via `CLOUDFLARE_API_TOKEN` secret. 64 vitest tests running in CI.

**Original plan below retained for reference.**

**Current state (pre-unification):** Single `build` → `deploy` pipeline. No test job. No worker deployment. `npm test` not invoked. Vitest installed but never run in CI.

**Target state:** Test → Build → Deploy (frontend) + Test → Deploy (worker). Independent deployment tracks. Tests gate everything.

#### Updated deploy.yml structure:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # ── Job 1: Run all tests ──────────────────────
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm test
      - run: npm audit --audit-level=high

  # ── Job 2: Build frontend (gated on tests) ────
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx @11ty/eleventy
      - name: Validate build output
        run: |
          # ... existing validation script ...
      - name: i18n validation
        run: node scripts/i18n-validate.js
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: "_site"

  # ── Job 3: Deploy frontend (gated on build) ───
  deploy-pages:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  # ── Job 4: Deploy worker (gated on tests) ─────
  deploy-worker:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: Deploy Cloudflare Worker
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

#### Step-by-step execution order:

1. Add `test` job to `deploy.yml` — runs `npm ci` + `npm test` + `npm audit`
2. Add `needs: test` to existing `build` job
3. Rename existing `deploy` job to `deploy-pages` for clarity
4. Add `deploy-worker` job — runs `npx wrangler deploy` with Cloudflare API token from GitHub Secrets
5. Add `i18n validation` step to build job (requires Phase 4 `scripts/i18n-validate.js`)
6. **Owner action required:** Add `CLOUDFLARE_API_TOKEN` secret to GitHub repo settings

**Post-Phase 5 pipeline flow:**

```
push to main
  └─→ test (npm test + npm audit)
       ├─→ build (Eleventy + validation + i18n check)
       │    └─→ deploy-pages (GitHub Pages)
       └─→ deploy-worker (wrangler deploy to Cloudflare)
```

**Verification:** Trigger a push. Confirm test job runs vitest. Confirm build is gated on test pass. Confirm worker deploys independently.

**Risk:** Low. The main dependency is the `CLOUDFLARE_API_TOKEN` secret — owner must add this to the repo. Without it, the worker deploy job will fail (but frontend deploy is unaffected).

---

### Phase 6: Data Layer + D1 Database — PROPOSED (2026-03-27)

> **Full details in `docs/architecture.md` Section 11.**

**Current state:** All data in git-committed JSON/JS files. No persistent database. Revenue-critical data (directory listings, products, content calendar) cannot be updated at runtime. No transaction tracking. BaZi PDF report initiative (TODO items A/B) blocked — no storage for report templates or sales records.

**Target state:** Cloudflare D1 database for dynamic data. R2 object storage for generated PDFs. Repository layer in Worker between services and database. Admin API routes for data management without git commits.

**Proposed D1 tables:** `directory_listings`, `products`, `report_templates`, `transactions`

**New Worker layers:**
- `worker/repositories/` — Data access layer (SQL queries isolated from business logic)
- `worker/lib/db.js` — D1 connection helper
- `worker/lib/pdf.js` — PDF generation engine
- `worker/lib/storage.js` — R2 upload/download wrapper
- `worker/routes/directory.js`, `products.js`, `reports.js` — New API endpoints

**Migration priority (aligned with revenue TODO items):**

| Step | Action | Unblocks |
|------|--------|----------|
| 1 | `wrangler d1 create czy-main` + `wrangler r2 bucket create czy-reports` | Infrastructure |
| 2 | Create `report_templates` table + `report-repo.js` | BaZi PDF reports (item A) |
| 3 | Migrate `shop.json` → `products` table | Transaction tracking |
| 4 | Build `report-service.js` + PDF generation | **BaZi PDF revenue live** |
| 5 | Build compatibility report templates | **Compatibility PDF revenue live** (item B) |
| 6 | Migrate `directory.json` → `directory_listings` table | Dynamic lead-gen (item C) |
| 7 | Add admin API routes | Data management without git |

**What stays as files:** Static reference data (zodiac animals, stems/branches, compatibility rules, lichun dates), generated data (zodiacYears.js, compatibilityPairs.js), site configuration (site.json, nav.json, languages.json). These are small, deterministic, and have no query/update requirements.

**Risk:** Medium. D1 adds a persistence dependency. Mitigation: keep static site fully functional without D1 (database only serves API endpoints for dynamic features, not page rendering).

---

## 7. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Upstream HTML format change breaks parser | High | High | Parser tests against fixtures; defensive regex; non-empty validation |
| esbuild IIFE wrapping breaks DOMContentLoaded timing | Low | High | Test each extraction individually; IIFE format preserves scoping |
| CSS import order changes specificity cascade | Low | Medium | Maintain exact order from original; diff minified output |
| i18n stripping breaks on new patterns | Medium | Medium | Add validation step; extract to testable module |
| Trivia lazy-loading fails on old browsers | Low | Low | Graceful degradation — trivia doesn't appear |
| Upstream service sustained outage (no circuit breaker) | Medium | High | Phase 1 completion: implement circuit-breaker + retry + cache |
| Phase 2 feature extraction exposes hidden coupling | Medium | Medium | Extract data arrays first to reveal dependencies; test after each step |
| Cloudflare API token misconfiguration in CI | Low | Medium | Fail-safe: worker deploy job fails but frontend unaffected |
| i18n validation script false positives | Low | Low | Whitelist known edge cases; review first 3 builds manually |

---

## 8. Phase 1 Audit Summary (2026-03-27)

### Implemented vs. Planned

| Planned Component | Status | Notes |
|-------------------|--------|-------|
| Router (`index.js` + `router.js`) | ✅ Done | `/v1/bazi/calculate`, `/v1/health` |
| Adapters (windada, zhouyi) | ✅ Done | With HTML fixtures |
| Service layer (`bazi-service.js`) | ✅ Done | Validates → calls adapters → assembles response |
| Error classes (`errors.js`) | ✅ Done | 4 typed error classes |
| CORS middleware | ✅ Done | Origin validation from env var |
| Rate limiter | ✅ Done (bonus) | Dual-layer (in-memory + KV) — exceeded spec |
| Data constants (`stems.js`) | ✅ Done | Branches merged into stems.js |
| HTML parser utilities | ✅ Done | `stripTags`, `extractText` |
| Pillar model | ✅ Done | Data structure definition |
| Request validation | ✅ Done | Year/month/day/hour/lat/lon validation |
| Tests (55 cases) | ✅ Done | Adapters, models, routes tested |
| **Cache middleware** | ✅ Implemented | `worker/lib/cache.js` with SHA-256 keying + 24h TTL |
| **Retry logic** | ✅ Implemented | `worker/lib/retry.js` exponential backoff (max 2 retries) |
| **Circuit breaker** | ✅ Implemented | `worker/lib/circuit-breaker.js` per-host state machine |
| **Solar time service** | ✅ Implemented | Extracted to `worker/services/solar-time-service.js` |
| **Response schema** | ✅ Implemented | Formalised in `worker/models/bazi-response.js` |
| **PDF report route** | ❌ Missing | Still blocks revenue initiative A (next execution target) |
| **Compatibility route** | ❌ Missing | Still blocks revenue initiative B (next execution target) |
| **Widget route** | ❌ Missing | Low priority |

---

## Critical Files

| File | Lines | Action |
|------|-------|--------|
| ~~`worker/bazi-worker.js`~~ | ~~359~~ | ~~Decompose into router/service/adapter (Phase 1)~~ DONE |
| `worker/lib/cache.js` | implemented | Cache API wrapper complete; monitor hit ratio + key cardinality |
| `worker/lib/retry.js` | implemented | Retry logic complete; tune retryability map with production error data |
| `worker/lib/circuit-breaker.js` | implemented | Circuit breaker complete; add metric counters for open/half-open transitions |
| `src/site.js` | 1,339 | Decompose into ES modules (Phase 2) |
| `src/styles.css` | 5,590 | Split into component files (Phase 3) |
| `src/_data/eleventyComputed.js` | 545 | Split into testable modules (Phase 4) |
| `eleventy.config.js` | 375 | Update for esbuild + revised pipeline (Phases 2–3) |
| `.github/workflows/deploy.yml` | ~118 | Add test job + worker deploy (Phase 5) |
| `scripts/i18n-validate.js` | 0 (new) | Post-build i18n orphan scanner (Phase 4) |

---

## 9. Competitive Context (2026-03-27)

> For context on why these architecture improvements matter — the site currently does not rank in the top 10 for any of its four target keyword clusters ("chinese zodiac 2026", "bazi calculator", "chinese zodiac compatibility", "feng shui 2026"). Domain authority is the primary bottleneck, not content quality. Architecture improvements in Phases 2–3 directly improve page speed (Core Web Vitals), which is a confirmed Google ranking factor. Phase 5 (CI/CD) ensures the site can ship content and features faster, which compounds SEO gains over time.

### Competitive Advantages to Protect

1. **Pre-Qing classical scholarship** — No competitor frames content this way. Maintain this positioning.
2. **GEO readiness** — `llms.txt` + permissive AI crawler policy is ahead of all competitors. Maintain.
3. **Trilingual** — Most competitors are English-only. This is a moat for Chinese-language search.
4. **Practitioner directory** — Unique among zodiac-focused sites. Expand.
5. **Breadth of cultural content** — Wuxia, Hanfu, Tea, etc. create long-tail keyword surface area.

### Competitive Gaps to Address (Not Architecture — See TODO.md)

1. Baby Gender Predictor (high-traffic tool — chinesefortunecalendar.com's top driver)
2. AI-powered BaZi chat (mastertsai.com, fatemaster.ai adopting this)
3. Daily/weekly horoscopes (recurring engagement driver)
4. Flying Star annual charts (interactive feng shui tool)
5. Advanced BaZi features (symbolic stars, Na Yin, day master strength)



## 10. Industrial-Standard Gap Checklist (2026-03-27 Addendum)

To align with mature production backends, the current architecture should add:

1. **Repository layer standardisation** for all D1 access (`worker/repositories/*`) with query ownership separated from services.
2. **Database migration workflow** (`migrations/` + CI migration checks + rollback notes).
3. **Contract-first API docs** (OpenAPI spec for `/v1/*` routes, including error envelopes).
4. **Admin authN/authZ** for future write endpoints (JWT/service token, role-scoped permissions, audit trail).
5. **Observability baseline** (request IDs, structured JSON logs, route latency/error metrics, alert thresholds).
6. **Data governance controls** (PII minimisation for birth data, retention windows, deletion workflow, access policy).
7. **Asynchronous job model** for report generation (`report_jobs`) with retry/dead-letter semantics.

These controls are mandatory before scaling paid-report volume or opening partner-facing APIs.



## 11. Phase 6 Execution Blueprint (D1/R2)

To convert the proposed data layer into implementation-ready work, execute in this order:

1. **Schema + migration bootstrap**
   - Add `migrations/` directory and a migration naming convention (`YYYYMMDDHHMM_description.sql`).
   - First migration creates: `report_templates`, `report_jobs`, `transactions`, `directory_listings`, `directory_leads`, `products`.
2. **Repository layer scaffold**
   - Add `worker/repositories/` with one file per aggregate (`report-repository.js`, `transaction-repository.js`, etc.).
   - Rule: services cannot issue raw SQL directly.
3. **Route expansion (contract-first)**
   - Add OpenAPI spec for current `/v1/bazi/calculate`, `/v1/health` and upcoming `/v1/bazi/report` endpoints before implementation.
4. **Idempotent payment/report pipeline**
   - Payment webhook writes transaction event + idempotency key.
   - Report job queue/state machine transitions: `queued -> processing -> completed|failed`.
5. **Governance + compliance controls**
   - Define retention windows for birth data and generated reports.
   - Add deletion endpoint/SOP and audit-log entries for access/deletion operations.
6. **Observability and SLO baseline**
   - Add request IDs, per-route latency/error metrics, and alerts for report generation failures and upstream provider outages.

### Definition of Done for Phase 6

- D1 schema migrations run successfully in CI and production.
- At least one write endpoint and one read endpoint are backed by repository-layer D1 queries.
- OpenAPI file published and validated in CI.
- Retention/deletion policy documented and linked from docs + TODO.
- End-to-end paid-report happy path completes with persisted transaction + report job record.
