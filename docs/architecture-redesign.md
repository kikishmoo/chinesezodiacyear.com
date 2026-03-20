# Architecture Redesign Proposal: chinesezodiacyear.com

> **Date:** 2026-03-19
> **Author:** Architecture review (via MuleRun Super Agent)
> **Status:** Approved — pending implementation
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

| Phase | Scope | Risk | Can Parallel? | Revenue Impact |
|-------|-------|------|---------------|----------------|
| **1. Worker restructure** | `worker/` | Low | Yes (with Phase 2) | **Unblocks PDF reports** (Priority A) |
| **2. JS modularisation** | `src/js/` | Low–Med | Yes (with Phase 1) | Lazy-loading improves page speed |
| **3. CSS modularisation** | `src/css/` | Low | After Phase 2 | Maintainability |
| **4. Template/data refactor** | `src/_data/`, `partials/` | Low | After Phase 2 | Content velocity |
| **5. CI/CD unification** | `.github/workflows/` | Low | After 1+2 | Prevents regressions |

### Phase 1: Worker Restructure

1. Extract adapters (`windada-adapter.js`, `zhouyi-adapter.js`) from existing functions
2. Extract data constants (`stems.js`, `branches.js`)
3. Create service layer (`bazi-service.js`)
4. Add router in `index.js` with single route delegating to service
5. Add error classes and error handler
6. Update `wrangler.jsonc` main to `worker/index.js`
7. Save HTML fixtures, write parser tests
8. Add vitest

**Verification:** Compare response JSON from old vs new worker for same input. External API contract unchanged.

### Phase 2: JS Modularisation

1. Add esbuild to `eleventy.config.js` (`eleventy.before`)
2. Create `src/js/main.js` that re-exports current logic
3. Verify esbuild output matches terser output functionally
4. Extract features one at a time (simplest first: nav, faq, theme)
5. Extract data arrays into `src/js/data/`
6. Split trivia into lazy-loaded bundle
7. Create event bus + analytics layer last
8. Remove terser step, delete `src/site.js`

**Verification:** After each extraction, test in all 3 languages + both themes.

### Phase 3: CSS Modularisation

1. Create `src/css/main.css` with `@import` chain
2. Split by existing section comment headers
3. Extract all `[data-theme="dark"]` blocks into `themes/dark.css`
4. Extract `:root` tokens into `tokens/` files
5. Add esbuild CSS entry point
6. Diff minified output to verify no rules lost
7. Delete `src/styles.css`

**Verification:** Visual comparison across representative pages in both themes.

### Phase 4: Template/Data

1. Split `eleventyComputed.js` into `computed/` modules
2. Move partials into `layout/`, `content/`, `marketing/` subdirectories
3. Update all `{% include %}` paths
4. Add i18n validation to build

**Verification:** Diff build output HTML before/after.

### Phase 5: CI/CD

1. Add test job to `deploy.yml`
2. Gate build + deploy on test pass
3. Add worker deployment job with Cloudflare API token secret
4. Add i18n validation to build validation step

---

## 7. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Upstream HTML format change breaks parser | High | High | Parser tests against fixtures; defensive regex; non-empty validation |
| esbuild IIFE wrapping breaks DOMContentLoaded timing | Low | High | Test each extraction individually; IIFE format preserves scoping |
| CSS import order changes specificity cascade | Low | Medium | Maintain exact order from original; diff minified output |
| i18n stripping breaks on new patterns | Medium | Medium | Add validation step; extract to testable module |
| Trivia lazy-loading fails on old browsers | Low | Low | Graceful degradation — trivia doesn't appear |

---

## Critical Files

| File | Lines | Action |
|------|-------|--------|
| `worker/bazi-worker.js` | 359 | Decompose into router/service/adapter (Phase 1) |
| `src/site.js` | 1,313 | Decompose into ES modules (Phase 2) |
| `src/styles.css` | 5,531 | Split into component files (Phase 3) |
| `src/_data/eleventyComputed.js` | 545 | Split into testable modules (Phase 4) |
| `eleventy.config.js` | 375 | Update for esbuild + revised pipeline (Phases 2-3) |
| `.github/workflows/deploy.yml` | ~95 | Add test job + worker deploy (Phase 5) |
| `wrangler.jsonc` | ~15 | Update main entry point (Phase 1) |
