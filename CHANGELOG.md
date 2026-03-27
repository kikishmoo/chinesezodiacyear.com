# Changelog — chinesezodiacyear.com

> All notable changes to this project are documented in this file.
> Format: grouped by logical feature/fix, ordered newest-first.

---

## 2026-03-27 — Phase 6 Step 4 (partial): OpenAPI Contract Bootstrap (Session 22)

**Author:** Cody

### Contract-First API Spec + CI Check

Added a versioned OpenAPI contract for Worker `/v1/*` routes and gated CI with a contract check script so API route/schema drift is caught during test workflow runs.

**Changes:**
- Added `docs/openapi/worker-v1.openapi.json` with contracts for `GET /v1/health`, `POST /v1/bazi/calculate`, and planned `POST /v1/bazi/report`.
- Added `scripts/check-openapi-contract.js` to validate spec presence/shape (required paths + schemas).
- Added npm script `infra:openapi:check` and wired it into `.github/workflows/deploy.yml` test job.
- Updated `TODO.md` and `CLAUDE.md` to reflect Item M contract bootstrap completion and remaining governance focus.

---

## 2026-03-27 — Phase 6 Step 4: Birth-Data Governance Policy (Session 22)

**Author:** Cody

### Retention + Deletion Compliance Baseline (Item N)

Implemented Item N by adding a formal governance policy for sensitive birth-data handling in report workflows.

**Changes:**
- Added `docs/birth-data-governance-policy.md` with data classification, minimisation rules, retention windows, deletion SOP, access controls, audit-log requirements, and incident workflow.
- Updated `TODO.md` to mark item N as completed and note the policy asset in Phase 6 execution notes.
- Updated `CLAUDE.md` temporary attention point to reflect that policy documentation is complete and the next compliance step is enforcement wiring.
- Updated `docs/architecture-redesign.md` Definition of Done wording to reference the concrete governance policy document.

---

## 2026-03-27 — Phase 6 Step 3: Repository Layer Scaffold (Session 21)

**Author:** Cody

### Worker Repository Pattern + SQL Boundary Guard

Implemented the next architecture item by scaffolding repository ownership for D1 queries and adding a CI-enforced boundary that prevents SQL from being written in service files.

**Changes:**
- Added repository infrastructure: `worker/repositories/db-client.js`, `worker/repositories/report-templates-repository.js`, `worker/repositories/report-jobs-repository.js`, `worker/repositories/index.js`.
- Added SQL boundary guard script: `scripts/check-service-sql-boundary.sh`.
- Added npm script: `infra:boundaries:check`.
- Updated CI (`.github/workflows/deploy.yml`) to run boundary checks in the test job.
- Added repository unit tests in `worker/__tests__/repositories/` for report template/job query behavior.
- Updated `TODO.md`, `CLAUDE.md`, and `docs/architecture-redesign.md` with Step 3 progress status.

---

## 2026-03-27 — Phase 6 Step 2: Migration Workflow Bootstrap (Session 20)

**Author:** Cody

### D1 Migration Baseline + CI Scaffolding

Implemented Item 2 from the architecture priority order by introducing migration conventions, the first schema migration, and CI checks.

**Changes:**
- Added `migrations/202603271300_phase6_initial_schema.sql` with baseline Phase 6 tables: `report_templates`, `report_jobs`, `transactions`, `directory_listings`, `directory_leads`, `products`, plus supporting indexes.
- Added `migrations/README.md` with naming convention, append-only rules, apply commands, and rollback SOP.
- Added `scripts/check-migrations.sh` to validate migration filename format/order and execute SQL against in-memory SQLite as a syntax safety check.
- Added npm scripts in `package.json`: `infra:migrations:check`, `infra:migrations:apply:local`, `infra:migrations:apply:remote`.
- Updated `.github/workflows/deploy.yml` test job to run `npm run infra:migrations:check`.
- Updated `docs/d1-r2-bootstrap.md`, `TODO.md`, and `CLAUDE.md` to reflect Step 2 migration bootstrap completion.

---
## 2026-03-27 — Phase 6 Step 1: D1/R2 Bootstrap Assets (Session 19)

**Author:** Cody

### Infrastructure Bootstrap Preparation

Implemented the first architecture-priority item (D1 + R2 bootstrap) as executable project assets, so cloud provisioning can be run consistently without ad-hoc commands.

**Changes:**
- Added `scripts/bootstrap-d1-r2.sh` to validate Wrangler auth and create D1 (`czy-main`) + R2 (`czy-reports`) resources.
- Added `docs/d1-r2-bootstrap.md` runbook with scripted/manual creation commands, binding snippet for `wrangler.jsonc`, and verification steps.
- Added npm scripts in `package.json`: `infra:bootstrap`, `infra:d1:create`, `infra:r2:create`, `infra:list`.
- Updated `TODO.md` with Phase 6 execution note for item J status (bootstrap assets done; actual cloud resource IDs pending).
- Updated `CLAUDE.md` data-layer attention point to reflect bootstrap status and remaining provisioning action.

---

## 2026-03-27 — Onboarding Audit Revision (Session 18)

**Author:** Cody

### Follow-up Documentation Tightening

Refined the onboarding audit and architecture redesign docs to make recommendations implementation-specific and to remove stale action wording.

**Documentation updates:**
- `docs/onboarding-audit-2026-03-27.md` — Added explicit evidence reviewed section (worker files, wrangler config, CI workflow, architecture docs) and an industrial-standard scorecard with quantified maturity ratings.
- `docs/architecture-redesign.md` — Updated `Critical Files` table wording so completed Phase 1 modules are no longer shown as pending implementation; added Section 11 with a concrete Phase 6 D1/R2 execution blueprint and Definition of Done.
- `TODO.md` — Added item O to scaffold a repository layer and enforce no-SQL-in-services rule.

---

## 2026-03-27 — Onboarding Audit, Industrial-Standard Gap Review & Documentation Revision (Session 17)

**Author:** Cody

### Quick Audit + Business Execution Baseline

Completed an onboarding audit focused on minimum-fund business execution and production-readiness of the current architecture.

**Documentation updates:**
- `docs/onboarding-audit-2026-03-27.md` — New onboarding audit report covering business strengths, architecture gaps, D1 backend standards, 30-day execution plan, team-of-teams operating model, and decision requests.
- `docs/architecture-redesign.md` — Corrected stale Phase 1 audit table entries (cache/retry/circuit breaker/solar-time/response-schema now marked implemented), and added Section 10 industrial-standard backend gap checklist (repository pattern, migrations, OpenAPI, auth, observability, governance, async job model).
- `TODO.md` — Added items L/M/N for D1 migration workflow, Worker OpenAPI contract, and birth-data retention/deletion governance policy.
- `CLAUDE.md` — Added temporary attention point to track industrial-standard backend controls from onboarding audit.

---

## 2026-03-27 — Architecture Review & Documentation Update (Session 16, part 6)

**Author:** kiki.peiqi.greene

### Comprehensive Architecture Review + Data Layer Proposal

Reviewed the full codebase architecture. Identified the absence of a persistent database as the key structural gap blocking revenue initiatives. Documented the review findings and proposed Cloudflare D1 + R2 as the data layer solution.

**Documentation updates:**
- `docs/architecture.md` — Major version bump (v1.1 → v2.0). Updated: technology stack (esbuild replaces terser/CleanCSS), build pipeline (esbuild CSS + JS bundling), client-side architecture (22 JS modules, 43 CSS modules), Worker architecture (full resilience stack detail), CI/CD pipeline (4-job structure), deployment flow (automated Worker deploy). Added new Section 11: Data Layer Review & Database Plan (D1 schema, migration path, data classification).
- `docs/architecture-redesign.md` — Updated phase status: Phases 1, 2, 3, 5 marked COMPLETE. Phase 1 gaps marked RESOLVED. Added Phase 6: Data Layer + D1 Database (proposed). Retained original plans as reference.
- `TODO.md` — Added item J (D1 database + R2 setup) and item K (migrate revenue data to D1).
- `CLAUDE.md` — Added data layer attention point.

---

## 2026-03-27 — Phase 3: CSS Modularisation (Session 16, part 5)

**Author:** kiki.peiqi.greene

### Monolithic styles.css Decomposed into 43 Modular CSS Files

Replaced the 5,590-line monolithic `src/styles.css` with a modular CSS architecture bundled by esbuild:

**Directory structure:**
- `src/css/main.css` — Entry point with `@import` chain (cascade order preserved)
- `src/css/tokens/` — Design tokens: colors, typography, spacing, shadows, animations (5 files)
- `src/css/base/` — Reset, accessibility, typography, i18n (4 files)
- `src/css/layout/` — Header, footer, article layout (3 files)
- `src/css/components/` — 21 component files: hero, buttons, breadcrumbs, calculator, cards, faq, directory, newsletter, search, comments, tables, share-buttons, readings, bazi, trivia, content-elements, donate, embeds, popup, cross-sell, content-upgrade, compatibility, related, shop
- `src/css/themes/` — Consolidated dark mode + auto-dark (2 files)
- `src/css/utilities/` — Spacing, text, animations, print, reduced-motion (5 files)

**Build pipeline:**
- esbuild replaces CleanCSS for CSS bundling (44 files → single minified output, 131.6KB → 100.4KB)
- `clean-css` removed from devDependencies
- CI validation updated: minimum output size check (50KB) replaces source/output comparison

**Files changed:**
- `src/css/` — 43 new CSS module files + `main.css` entry point
- `eleventy.config.js` — esbuild CSS bundling replaces CleanCSS
- `.github/workflows/deploy.yml` — Updated CSS validation check
- `package.json` — Removed `clean-css` dependency
- `TODO.md` — Item H marked as completed
- `CLAUDE.md` — Updated CSS paths in Key File Locations

---

## 2026-03-27 — Phase 2: JS Modularisation (Session 16, part 4)

**Author:** kiki.peiqi.greene

### Monolithic site.js Decomposed into ES Modules

Replaced the 1,339-line monolithic `src/site.js` with a modular ES module architecture bundled by esbuild:

**Directory structure:**
- `src/js/main.js` — Entry point orchestrator
- `src/js/analytics.js` — Centralised GA4 tracking (`track()`)
- `src/js/utils/sanitise.js` — Unified `escapeHtml()` + `cleanText()` (replaces duplicate `esc()` and `escapeHtml()`)
- `src/js/utils/base-path.js` — GitHub Pages subpath detection
- `src/js/data/zodiac-data.js` — 12 zodiac animals + helper functions
- `src/js/data/famous-figures.js` — Historical figures array
- `src/js/data/lichun-dates.js` — 1900–2100 Lichun boundary table
- `src/js/data/compatibility-data.js` — Six Harmonies, Three Harmonies, Clashes, Harms
- `src/js/features/` — 12 feature modules: nav, theme, faq, calculator, compatibility, search, bazi-client, newsletter, filters, share-buttons, lightbox, language, popup, shop

**Build pipeline:**
- esbuild replaces terser for JS bundling (22 modules → single IIFE, 36.2KB minified)
- `terser` removed from devDependencies
- trivia.js also minified via esbuild with `charset: 'utf8'`
- CI validation updated for esbuild output checks

**XSS hardening:** Both `esc()` (DOM-based) and `escapeHtml()` (regex-based) replaced by single `escapeHtml()` in `utils/sanitise.js`, used consistently across all features.

**Files changed:** `src/js/` (22 new files), `eleventy.config.js`, `package.json`, `package-lock.json`, `.github/workflows/deploy.yml`, `CHANGELOG.md`, `TODO.md`

---

## 2026-03-27 — Phase 1 Completion: Cache, Retry, Circuit Breaker, Solar Time Service (Session 16, part 3)

**Author:** kiki.peiqi.greene

### Worker Resilience Stack

Implemented the 5 remaining Phase 1 gaps to complete the modular Worker architecture:

- **Cache middleware** (`worker/lib/cache.js`): Cloudflare Cache API wrapper. Keys on SHA-256 of canonical request JSON. 24h TTL. BaZi charts are deterministic — same input always returns same output, so caching is safe. Graceful degradation on cache errors.
- **Retry logic** (`worker/lib/retry.js`): Exponential backoff wrapper. Max 2 retries, 500ms/1s delays. Non-retryable errors (ValidationError) thrown immediately. Retryable errors (UpstreamError, TimeoutError) retried.
- **Circuit breaker** (`worker/lib/circuit-breaker.js`): Per-host state machine (CLOSED → OPEN → HALF_OPEN). 5 failures → OPEN, 30s recovery timeout. In-memory state per Worker isolate. Registry pattern via `getBreaker(source)`.
- **Solar time service** (`worker/services/solar-time-service.js`): Extracted True Solar Time logic from bazi-service.js into standalone module. Wraps windada adapter with retry + circuit breaker. Graceful degradation to clock time on any failure.
- **Response schema** (`worker/models/bazi-response.js`): JSDoc typedefs for full BaziResponse shape (pillars, dayMaster, daYun, readingSections, etc.) + `validateResponse()` function.

### Wiring

Updated `bazi-service.js` to use the full resilience stack:
- Cache check before any upstream calls
- Solar time via dedicated service (handles own retry/circuit)
- Zhouyi chart call wrapped in circuit breaker + retry
- Cache store after successful calculation (fire-and-forget)

### Tests

Added 24 new test cases (total: 64):
- `retry.test.js` (6 tests): success, retry-and-recover, non-retryable bail, exhaustion, zero-retry, default retryable
- `circuit-breaker.test.js` (10 tests): states, transitions, thresholds, recovery, half-open probe, reset
- `bazi-response.test.js` (8 tests): validation of all required fields, multiple error collection

**Files changed:** `worker/lib/cache.js` (new), `worker/lib/retry.js` (new), `worker/lib/circuit-breaker.js` (new), `worker/services/solar-time-service.js` (new), `worker/models/bazi-response.js` (new), `worker/services/bazi-service.js` (updated), `worker/__tests__/lib/retry.test.js` (new), `worker/__tests__/lib/circuit-breaker.test.js` (new), `worker/__tests__/models/bazi-response.test.js` (new)

---

## 2026-03-27 — Phase 5 CI/CD: Test Gate + Worker Auto-Deploy (Session 16, part 2)

**Author:** kiki.peiqi.greene

### CI/CD Pipeline Restructured (deploy.yml)

Rewrote `.github/workflows/deploy.yml` from 2 jobs to 4 jobs:

- **Job 1 (`test`):** Runs `npm test` (40 vitest cases) + `npm audit --audit-level=high`. Gates all downstream jobs.
- **Job 2 (`build`):** Eleventy build + output validation (page counts, CSS/JS minification, critical files). Depends on `test`.
- **Job 3 (`deploy-pages`):** GitHub Pages deployment. Depends on `build`.
- **Job 4 (`deploy-worker`):** Automated Cloudflare Worker deployment via `wrangler deploy`. Depends on `test`, runs in parallel with `build`. Uses `CLOUDFLARE_API_TOKEN` secret.

This resolves two CRITICAL audit findings: (1) tests never ran in CI, and (2) Worker was deployed manually only.

**Files changed:** `.github/workflows/deploy.yml`, `CLAUDE.md`, `TODO.md`, `CHANGELOG.md`, `docs/architecture-redesign.md`

---

## 2026-03-27 — Onboarding Audit + Architecture Phases 2–5 Detailed Planning (Session 16)

**Author:** kiki.peiqi.greene

### Full Codebase Audit

Conducted comprehensive audit across all layers: worker backend (1,888 LOC), frontend JS (1,339 LOC), frontend CSS (5,590 LOC), build config, CI/CD pipeline, and all documentation. Key findings:

- **CRITICAL:** Tests exist (55 vitest cases) but never run in CI — `deploy.yml` has no `npm test` step
- **CRITICAL:** Worker deployed manually only — no CI automation for `wrangler deploy`
- **HIGH:** Worker Phase 1 gaps: cache middleware, retry logic, and circuit breaker not implemented (per architecture-redesign.md spec)
- **MEDIUM:** Two duplicate escape functions in `site.js` (`esc()` line 761, `escapeHtml()` line 580) — inconsistent XSS mitigation
- **MEDIUM:** Solar time service logic embedded in windada adapter, not extracted as independent module
- All innerHTML usage audited — no exploitable XSS found (all data sources are hardcoded or sanitised), but architecture fragile for future changes

### Competitive Intelligence Research

Analysed top 10 competitors and keyword landscape. ChineseZodiacYear.com does not rank in top 10 for any of four target keyword clusters tested ("chinese zodiac 2026", "bazi calculator", "chinese zodiac compatibility", "feng shui 2026"). Does not appear in AI-generated answers despite having GEO infrastructure (llms.txt, permissive robots.txt). Domain authority is the primary bottleneck. Identified competitive feature gaps: Baby Gender Predictor, AI BaZi chat, daily horoscopes, Flying Star charts, advanced BaZi features.

### Architecture Phases 2–5 Detailed Planning

Expanded architecture-redesign.md from high-level bullet points to step-by-step execution plans with numbered tasks, verification criteria, and risk assessments:

- **Phase 1 Completion** (7 tasks): cache.js, retry.js, circuit-breaker.js, solar-time-service extraction, bazi-response schema, tests, wiring
- **Phase 2 JS Modularisation** (33 tasks): esbuild scaffolding → data extraction → feature-by-feature extraction → XSS hardening → event bus → trivia splitting → cleanup
- **Phase 3 CSS Modularisation** (43 tasks): file structure → token extraction → base styles → layout → 21 component files → dark mode consolidation → utilities → esbuild wiring → validation
- **Phase 4 Template/Data** (19 tasks): eleventyComputed splitting → partials reorganisation → i18n validation script → tests
- **Phase 5 CI/CD** (6 tasks): test job → build gate → worker deploy job → i18n validation step

Added new sections: Phase 1 Audit Summary table, updated Risks & Mitigations, Competitive Context section, updated Critical Files table.

**Files changed:** `docs/architecture-redesign.md`, `CHANGELOG.md`, `docs/prediction-log.md`

---

## 2026-03-24 — CSP Refinement + KV-backed Rate Limiting (Session 15)

**Author:** Claude (agent)

### CSP Refinement

Audited all external domains loaded by the site against the CSP policy. Added missing Google ad-tech domains (AdSense loads scripts/iframes from doubleclick, googleadservices, tpc.googlesyndication), GA4 beacon transport endpoint, and Facebook Pixel graph API. Added `upgrade-insecure-requests` directive for HTTPS-only enforcement.

**Files changed:** `src/_includes/layouts/base.njk`

### Upgrade Rate Limiting to Dual-Layer (In-Memory + Cloudflare KV)

Replaced the single in-memory rate limiter with a dual-layer system:
- **Layer 1 (in-memory):** Zero-latency burst protection within a single Worker isolate.
- **Layer 2 (KV):** Cross-edge persistent counters via Cloudflare KV namespace (`bazi-rate-limit`). Keys auto-expire after 120s. Graceful degradation if KV unavailable.

KV namespace ID: `bfd6972986044803961150f924c8f40f`, bound as `RATE_LIMIT_KV`.

**Files changed:** `worker/middleware/rate-limiter.js` (new), `worker/index.js`, `wrangler.jsonc`

---

## 2026-03-20 — AdSense "Low Value Content" Fix + SEO Audit (Session 14)

**Author:** kiki.peiqi.li

### AdSense — Fix "Low Value Content" Policy Violation

AdSense flagged the site with "Low value content" rejection. Root cause analysis identified 67% of indexed URLs were programmatic/thin content: 121 year pages generating duplicate English-only zh-hant/zh-hans variants (242 duplicate pages), plus 78 compatibility pair pages with only ~100 unique words each.

**Fix 1 — noI18n build system mechanism:**
- Added `noI18n: true` frontmatter flag and `<!-- no-i18n -->` HTML marker system
- Build system (`eleventy.config.js`) now skips zh-hant/zh-hans variant generation for pages with this marker
- Hreflang tags in `base.njk` made conditional — only emitted when `noI18n` is not set
- Sitemap (`sitemap.njk`) updated to exclude zh-hant/zh-hans entries for noI18n pages
- **Impact:** Removed 260 duplicate pages from index. Sitemap entries: ~906 → 505. Total HTML pages: ~895 → 635.

**Pages flagged as English-only (`noI18n: true`):**
- `src/year-pages.njk` (121 year pages — English-only, no lang-tc/lang-sc blocks)
- 7 English-only articles: article-2026-horse, chinese-new-year-global-celebration, chinese-new-year-traditions, chinese-new-year-vs-lunar-new-year, fifteen-days-chinese-new-year, heavenly-stems-earthly-branches, why-red-and-gold-chinese-new-year
- `src/pages/affiliate-disclosure.njk`, `src/pages/chinamaxxing.njk`

**Fix 2 — Enriched compatibility pair content:**
- Added per-animal personality trait dictionary (12 animals × 7 trait dimensions: strengths, challenges, loveStyle, workStyle, socialNeed, stressTrigger, classicalRef) with trilingual support
- Added `generatePairAnalysis()` function that combines both animals' traits into unique per-pair text
- New "Personality Dynamics" section added to compatibility pair template (EN/TC/SC)
- **Impact:** Each compatibility page gained ~340 words of unique content (~1,400 → ~1,740 words). Content is genuinely unique per pair (78 distinct combinations), not shared template text.

**Files changed:**
- `eleventy.config.js` — noI18n skip logic in i18n generation loop
- `src/_includes/layouts/base.njk` — conditional hreflang tags
- `src/sitemap.njk` — conditional zh-hant/zh-hans URL entries
- `src/year-pages.njk` — added `noI18n: true`
- `src/articles/*.njk` (7 files) — added `noI18n: true`
- `src/pages/affiliate-disclosure.njk` — added `noI18n: true`
- `src/pages/chinamaxxing.njk` — added `noI18n: true`
- `src/_data/compatibilityPairs.js` — animalTraits dictionary + generatePairAnalysis()
- `src/compatibility-pair-pages.njk` — new "Personality Dynamics" section (EN/TC/SC)

### SEO/GEO Technical Audit

Full 14-point technical SEO audit completed. **All checks passed (A+ grade):**

1. Sitemap — comprehensive trilingual coverage with priorities
2. robots.txt — AI/GEO crawlers allowed (GPTBot, anthropic-ai, PerplexityBot)
3. Hreflang — perfect trilingual implementation with x-default
4. Structured data — 8 JSON-LD schema types (Article, BreadcrumbList, FAQPage, CollectionPage, Organization, WebSite, Product, VideoObject)
5. Meta descriptions — unique per page, keyword-optimised
6. Canonical URLs — self-referential per language variant
7. Open Graph — all tags + Twitter Card
8. Page titles — unique, keyword-rich
9. Internal linking — extensive cross-linking
10. Image optimisation — WebP, lazy loading, async decoding, alt text
11. llms.txt — 23 topics, 21 key URLs
12. Core Web Vitals — font-display=swap, preconnect, deferred fonts, async scripts
13. 404 page — trilingual, helpful navigation
14. ads.txt — correct AdSense publisher ID

**No technical SEO issues found.** The only SEO problem was the thin/duplicate content ratio addressed above.

### Build Verification

- Build passes: 302 base pages, 336 i18n variants (was 596), zero errors, 6.34 seconds

---

## 2026-03-21 — Worker Architecture Restructure: Phase 1 (Session 15)

**Author:** Agent session (via MuleRun Super Agent)

### Architecture — Modular Worker API

Decomposed monolithic `worker/bazi-worker.js` (393 lines, single file) into a modular architecture with router, service layer, adapters, models, middleware, and tests. Implements Phase 1 of the approved architecture redesign (`docs/architecture-redesign.md`).

**New structure (17 files):**

| Layer | Files | Purpose |
|-------|-------|---------|
| Entry | `worker/index.js` | Router dispatch + CORS + error handler |
| Router | `worker/router.js` | Lightweight path/method router |
| Routes | `worker/routes/bazi.js`, `health.js` | Request handlers (v1 API + legacy `/` alias) |
| Services | `worker/services/bazi-service.js` | Business logic orchestrator |
| Adapters | `worker/adapters/windada-adapter.js`, `zhouyi-adapter.js` | Upstream scrapers with `fetch()` + `parse()` interface |
| Models | `worker/models/errors.js`, `bazi-request.js`, `pillar.js` | Typed errors, validation, data structures |
| Data | `worker/data/stems.js` | Heavenly Stems + Earthly Branches reference |
| Lib | `worker/lib/html-parser.js` | Shared `stripTags()`, `cleanText()` |
| Middleware | `worker/middleware/cors.js`, `error-handler.js` | CORS origin validation, structured error responses |
| Tests | `worker/__tests__/` (4 test files, 4 HTML fixtures) | 40 tests covering parsers, validation, routing |

**Key improvements:**
- **Typed errors:** `ValidationError` (400), `UpstreamError` (502), `TimeoutError` (504), `CircuitOpenError` (503) — each with `retryable` flag
- **Request validation:** Year 1900–2100 range, lat/lng bounds, type coercion
- **API versioning:** `POST /v1/bazi/calculate` (canonical), `POST /` (backwards-compatible alias), `GET /v1/health`
- **Parser tests:** Zhouyi adapter tested against HTML fixtures (addresses Regression #6)
- **Structured error responses:** `{ error: { code, message, retryable } }`

### Testing

- 40 vitest tests, all passing
- Eleventy build: 302 pages, 596 i18n variants, zero errors

### Files Changed

| File | Change |
|------|--------|
| `worker/index.js` | New — entry point with router wiring |
| `worker/router.js` | New — lightweight path/method router |
| `worker/routes/bazi.js` | New — BaZi calculate route handler |
| `worker/routes/health.js` | New — health check endpoint |
| `worker/services/bazi-service.js` | New — business logic orchestrator |
| `worker/adapters/windada-adapter.js` | New — True Solar Time adapter |
| `worker/adapters/zhouyi-adapter.js` | New — BaZi chart parser adapter |
| `worker/models/errors.js` | New — typed error classes |
| `worker/models/bazi-request.js` | New — request validation |
| `worker/models/pillar.js` | New — pillar data structure + Day Master |
| `worker/data/stems.js` | New — stems/branches reference data |
| `worker/lib/html-parser.js` | New — shared HTML utilities |
| `worker/middleware/cors.js` | New — CORS middleware |
| `worker/middleware/error-handler.js` | New — error-to-response mapper |
| `worker/__tests__/` | New — 4 test files + 4 HTML fixtures |
| `wrangler.jsonc` | Updated main entry to `worker/index.js` |
| `package.json` | Added vitest, test scripts |
| `CLAUDE.md` | Updated worker file locations |

---

## 2026-03-19 — BaZi Calculator: Fix Result Formatting (Session 13)

**Author:** yunneoi.yn

### Bug Fix — Upstream HTML Parser Broken by Class Name Changes

The upstream service (zhouyi.cc) changed its HTML class names, silently breaking the BaZi calculator's result parsing. Three parser fixes in the worker and three display fixes in the client.

**Worker fixes (`worker/bazi-worker.js`):**
- Pillar grid regex updated: `bazilist` → `bazilist1?` (upstream renamed class)
- Reading sections: replaced fragile `baziboxtop`+`baziboxmain3` pair regex with block-based extraction using `baziboxbg2` parent containers (now extracts 12 sections instead of 0)
- Five Elements: extract from `wuhfx` divs instead of broken heading-based regex (now returns 7 structured lines instead of just the header text)

**Client fixes (`src/site.js`):**
- Added `cleanText()` helper to strip `&nbsp;`, collapse whitespace, normalise line breaks
- Five Elements: split into individual `<div>` lines for readability
- Reading sections + rawExcerpt: clean text and convert newlines to `<br>` tags for proper paragraph formatting

**CSS (`src/styles.css`):**
- Added spacing rule for `.bazi-five-elements div` child elements

### Files Changed

| File | Change |
|------|--------|
| `worker/bazi-worker.js` | Updated `parseBaziHtml()` — pillar regex, reading sections, five elements extraction |
| `src/site.js` | Added `cleanText()`, improved `renderBaziChart()` display formatting |
| `src/styles.css` | Added `.bazi-five-elements div` spacing |

---

## 2026-03-19 — FAQ TC/SC Translations: All 16 Article Pages (Session 12)

**Author:** kiki.shmoo

### Content — Article FAQ Translations

Added Traditional Chinese (qTc/aTc) and Simplified Chinese (qSc/aSc) translations to all FAQ items across every article page. This completes the FAQ translation backlog for articles — all 16 files now have full trilingual FAQ support.

**Files edited (16):**
- `src/articles/article-2026-horse.njk` (5 FAQs)
- `src/articles/bazi-four-pillars-guide.njk` (5 FAQs)
- `src/articles/celebrity-chinese-zodiac-signs.njk` (4 FAQs)
- `src/articles/chinese-calendar-explained.njk` (5 FAQs)
- `src/articles/chinese-new-year-global-celebration.njk` (4 FAQs)
- `src/articles/chinese-new-year-spring-festival.njk` (5 FAQs)
- `src/articles/chinese-new-year-traditions.njk` (5 FAQs)
- `src/articles/chinese-new-year-vs-lunar-new-year.njk` (5 FAQs)
- `src/articles/chinese-zodiac-compatibility-guide.njk` (5 FAQs)
- `src/articles/feng-shui-2026-guide.njk` (5 FAQs)
- `src/articles/fifteen-days-chinese-new-year.njk` (5 FAQs)
- `src/articles/fire-horse-1966-2026.njk` (5 FAQs)
- `src/articles/heavenly-stems-earthly-branches.njk` (5 FAQs)
- `src/articles/lucky-colors-numbers-2026.njk` (5 FAQs)
- `src/articles/why-red-and-gold-chinese-new-year.njk` (5 FAQs)
- `src/articles/zodiac-years-chart.njk` (5 FAQs)

**Total:** 78 FAQ items translated (TC + SC = 312 new YAML fields)

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, zero errors

---

## 2026-03-19 — Architecture Redesign Proposal + CHANGELOG Author Cleanup

**Author:** Agent session (via MuleRun Super Agent)

### Documentation — Full-Stack Architecture Redesign Proposal

Created `docs/architecture-redesign.md` — a comprehensive proposal to restructure both backend and frontend from monolithic files into modular, testable architectures. Covers 5 migration phases:

1. **Backend (Worker):** Decompose `bazi-worker.js` (359 lines) into router/service/adapter layers with error handling, caching, retry logic, and vitest parser tests
2. **Frontend JS:** Split `site.js` (1,313 lines) into ES modules bundled by esbuild, with event bus, centralised analytics, and lazy-loaded trivia/BaZi
3. **Frontend CSS:** Split `styles.css` (5,531 lines) into component files with consolidated dark mode and design tokens
4. **Templates/Data:** Break `eleventyComputed.js` (545 lines) into testable modules; reorganise partials by function
5. **CI/CD:** Unified pipeline with test gating, automated worker deployment, and i18n validation

### Housekeeping — CHANGELOG Author Format

Removed `@gmail.com` from all author entries across the entire CHANGELOG (31 entries, 5 email addresses). Added author format convention to `docs/sop-agent-workflow.md` Section 10.

**Files changed:**
- `docs/architecture-redesign.md` — New file (architecture proposal)
- `docs/sop-agent-workflow.md` — Added author format convention
- `CHANGELOG.md` — Stripped `@gmail.com` from all authors + this entry

---

## 2026-03-17 — Monetisation Strategy Research + Doc Audit (Session 11)

**Author:** kiki.peiqi.li

### Strategy — Monetisation Analysis from YouTube Business Model Research

Analysed two YouTube business model videos against the site's current revenue channels:

1. **"Claude Code built me a $273/Day online directory"** — AI-curated directory model using Outscraper + Crawl4AI for data enrichment, monetised via lead generation. Validated directory expansion approach (TODO item C).
2. **"'Stupid Simple' Apps Are Making Millions"** — SaaS cloning model: give away free tool, monetise backend. Directly validates automated PDF report strategy (TODO items A & B): free BaZi calculator → paid PDF report download.

**Conclusion:** Automated BaZi PDF reports confirmed as #1 priority. Subscriptions/memberships explicitly rejected (no existing subscriber base, requires active content production). "Write templates once, sell forever" principle documented as guiding principle in CLAUDE.md and TODO.md.

### Documentation — Audit & Cleanup

- **CLAUDE.md:** Cleaned 2 expired temporary attention points (translation backlog — resolved, npm vulnerability — resolved). Updated revenue model section with YouTube research basis. Updated date to 2026-03-17.
- **TODO.md:** Added YouTube video research reference and key insight to monetisation strategy section. Added 4 completed items (#29–#32) from sessions 8–10. Updated date to 2026-03-17.
- **prediction-log.md:** Added monetisation strategy analysis prediction entry. Updated date to 2026-03-17.
- **Rebased** 5 local commits onto 14 new remote commits (sessions 7–10 work).

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, zero errors, 7.90 seconds

---

## 2026-03-16 — Calendar Naming History: Enhancements & New FAQ Items

**Author:** Agent session (via MuleRun Super Agent)

### Content — Enhanced "Naming the Calendar" Section

Enhanced the existing naming-history section on the Calendar encyclopaedia page based on reader feedback and in-depth research. Additions include:
- New subsection "Before 1912: Every Calendar Had Its Own Name" with dynastic names table (Taichu, Shoushi, Datong, Shixian) and 皇曆/黃曆/通書 context
- Added GB/T 33661-2017 standardisation and 1922 Zhejiang 農家曆 first-attestation detail to the 農曆 subsection
- Added scholarly citation: Zhu Wenzhe (朱文哲), "Rectification of Names of Calendars in Modern China," Shilin (史林), 2019

### Content — 2 New FAQ Items (Trilingual)

- "Why is it called 農曆 (nónglì) and when did this name originate?" (EN/TC/SC)
- "What was the Chinese calendar called before 1912?" (EN/TC/SC)

### Content — Calendar Explained Article Cross-Reference

Added callout box to `/chinese-calendar-explained/` linking to the naming-history section.

**Files changed:**
- `src/pages/calendar.njk` — Enhanced naming-history section + 2 new FAQ items
- `src/articles/chinese-calendar-explained.njk` — New callout box
- `CHANGELOG.md` — This entry

---

## 2026-03-20 — Rate Limiting on BaZi Worker (Session 9 cont.)

**Author:** Claude (via agent session)

### Security — In-memory sliding window rate limiter

Added rate limiting to `worker/bazi-worker.js` to prevent DOS attacks and automated scraping of upstream BaZi services. Implementation uses an in-memory sliding window (15 requests per 60 seconds per IP). Client IP is identified via `CF-Connecting-IP` header (set by Cloudflare edge). Exceeding the limit returns HTTP 429 with a `Retry-After: 60` header and a user-friendly error message. Includes periodic cleanup of stale entries to prevent memory growth in long-lived isolates.

**Files changed:**
- `worker/bazi-worker.js` — Added rate limiter (constants, `ipRequestLog` Map, `isRateLimited()` function, 429 response in handler)

---

## 2026-03-20 — Implement Quick Wins from Technical Audit (Session 9)

**Author:** Claude (via agent session)

### Security — npm audit in CI

Added `npm audit --audit-level=high` step to `.github/workflows/deploy.yml` between dependency install and Eleventy build. Deploys now fail if high-severity vulnerabilities exist in dependencies.

### Security — Content Security Policy

Added `<meta http-equiv="Content-Security-Policy">` to `base.njk` with directives covering all third-party services (AdSense, GA4, Facebook Pixel, Clarity, Giscus, Beehiiv, Nominatim, web-vitals). Key protections: `object-src 'none'`, `base-uri 'self'`, `form-action` restricted to known endpoints.

### Compatibility — Auto dark mode from OS preference

Added `@media (prefers-color-scheme: dark)` to `styles.css` with core dark-mode styles for `html:not([data-theme])` (users who haven't explicitly toggled). Updated inline theme-init script in `base.njk` to set `data-theme="dark"` from OS preference via `matchMedia`, activating the full existing `[data-theme="dark"]` ruleset automatically.

### Security — BaZi date range validation

Added client-side validation in `site.js` (year 1900–2100, valid calendar date) and server-side validation in `worker/bazi-worker.js` (integer checks, range checks, `Date` existence validation). Invalid dates are rejected with clear error messages before any upstream API calls.

### Security — security.txt

Created `src/.well-known/security.txt` per RFC 9116 with contact email, preferred languages, canonical URL, and 1-year expiry. Added `.well-known` passthrough in `eleventy.config.js`.

**Files changed:**
- `.github/workflows/deploy.yml` — Added npm audit step
- `src/_includes/layouts/base.njk` — Added CSP meta tag, updated theme-init script for OS dark mode
- `src/styles.css` — Added `prefers-color-scheme: dark` media query
- `src/site.js` — Added BaZi date range validation
- `worker/bazi-worker.js` — Added server-side date validation
- `eleventy.config.js` — Added `.well-known` passthrough
- `src/.well-known/security.txt` — New file

---

## 2026-03-18 — Technical Audit: Architecture, APIs, Deployment, Compatibility, Testing, Security (Session 8 cont.)

**Author:** Claude (via agent session)

### Audit — 7-area technical review

Full technical audit performed across architecture (架构), APIs/interfaces (接口), database (数据库), deployment (部署), compatibility (兼容), testing (测试), and security (安全). No code changes — findings documented in TODO.md as new action items.

**Key findings:**
- Architecture, data layer, CI/CD pipeline, i18n, CORS: all solid
- **Critical gaps:** No rate limiting on BaZi Worker, zero test coverage, no CSP headers, no npm audit in CI
- **Quick wins identified:** Add `npm audit` to deploy.yml, add CSP meta tag, add `prefers-color-scheme`, add BaZi input range validation, create security.txt

**Files changed:**
- `CHANGELOG.md` — This entry
- `TODO.md` — Added 6 new technical/security items from audit
- `CLAUDE.md` — Updated last-updated date, added audit attention point

---

## 2026-03-16 — BaZi Calculator Parser Fix + FAQ i18n Fallback (Session 8)

**Author:** Claude (via agent session)

### Bug Fix — BaZi Calculator Returns Empty Pillars

The upstream BaZi service (zhouyi.cc) renamed its HTML class from `bazilist f14` to `bazilist1 f14`, breaking the four-pillar parser. All chart results returned empty pillars and no Day Master. Da Yun (luck cycles) still worked because `bazilist2` was unchanged.

Additionally, the `basicInfo` regex patterns failed because the HTML label format changed from colon-separated (`生肖：属马`) to span-wrapped (`<span>命主生肖</span>属马`).

**Files changed:**
- `worker/bazi-worker.js` — Updated `bazilist` regex to `bazilist1?` (matches both old and new class names). Updated `basicInfo` patterns to accept `</span>` as alternative delimiter to colons.

**Requires:** Cloudflare Worker redeployment (`npx wrangler deploy`).

### Bug Fix — FAQ Empty in TC/SC Language Modes

FAQ accordion items on pages without TC/SC translations (e.g. Calendar) showed empty buttons (just "+" with no text) when viewed in Traditional or Simplified Chinese. The i18n build stripped `<span class="lang-en">` content, but no `lang-tc`/`lang-sc` spans existed as fallback.

**Files changed:**
- `src/_includes/layouts/article.njk` — FAQ template now only wraps English text in `lang-en` spans when TC/SC translations exist. If no translations are provided, English text renders as plain text (survives i18n stripping).

---

## 2026-03-15 — FAQ TC/SC Translations: Zodiac Animal Pages + YAML Fix (Session 10)

**Author:** kiki.shmoo

### Content — Trilingual FAQ for All 12 Zodiac Animal Pages

Added `qTc`/`aTc`/`qSc`/`aSc` fields to all 48 FAQ items (4 per animal) across the 12 zodiac animal profile pages. Each translation includes correct Heavenly Stem + Earthly Branch (干支) year labels, San He (三合) trio names, Liu He (六合) pairings, and fixed element correspondences. Translations follow classical pre-Qing terminology consistent with existing site style.

### Bug Fix — YAML Parse Errors in bazi.njk

Fixed 2 YAML parse errors in `bazi.njk` where Simplified Chinese FAQ answers contained unescaped ASCII double quotes (`"子平法"`, `"八个字"`) inside YAML double-quoted strings. Replaced with corner brackets (`「」`).

### Files Changed

| File | Change |
|------|--------|
| `src/zodiac/rat.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/ox.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/tiger.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/rabbit.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/dragon.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/snake.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/horse.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/goat.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/monkey.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/rooster.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/dog.njk` | Added TC/SC FAQ translations (4 items) |
| `src/zodiac/pig.njk` | Added TC/SC FAQ translations (4 items) |
| `src/pages/bazi.njk` | Fixed 2 YAML quoting errors in SC FAQ strings |

---

## 2026-03-15 — FAQ TC/SC Translations: Encyclopaedia & Hub Pages (Session 9)

**Author:** kiki.shmoo

### Content — Trilingual FAQ for 23 Encyclopaedia/Hub Pages

Added `qTc`/`aTc`/`qSc`/`aSc` fields to all FAQ items across 23 encyclopaedia and hub pages. This fixes the blank FAQ/Q&A sections that appeared on TC and SC language variants — the root cause was that FAQ items only had English `q`/`a` fields, so when build-time i18n stripping removed `lang-en` spans, accordion items were empty.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/calendar.njk` | Added TC/SC FAQ translations |
| `src/pages/fengshui.njk` | Added TC/SC FAQ translations |
| `src/pages/wuxing.njk` | Added TC/SC FAQ translations |
| `src/pages/spring-festival.njk` | Added TC/SC FAQ translations |
| `src/pages/taoism.njk` | Added TC/SC FAQ translations |
| `src/pages/yijing.njk` | Added TC/SC FAQ translations |
| `src/pages/tcm.njk` | Added TC/SC FAQ translations |
| `src/pages/hanfu.njk` | Added TC/SC FAQ translations |
| `src/pages/martial-arts.njk` | Added TC/SC FAQ translations |
| `src/pages/tea-culture.njk` | Added TC/SC FAQ translations |
| `src/pages/folk-arts.njk` | Added TC/SC FAQ translations |
| `src/pages/wuxia.njk` | Added TC/SC FAQ translations |
| `src/pages/qimen.njk` | Added TC/SC FAQ translations |
| `src/pages/chinamaxxing.njk` | Added TC/SC FAQ translations |
| `src/pages/whats-my-zodiac.njk` | Added TC/SC FAQ translations |
| `src/pages/bazi-calculator.njk` | Added TC/SC FAQ translations |
| `src/pages/premium-readings.njk` | Added TC/SC FAQ translations |
| `src/pages/shop.njk` | Added TC/SC FAQ translations |
| `src/pages/readings.njk` | Added TC/SC FAQ translations |
| `src/pages/compatibility.njk` | Added TC/SC FAQ translations |
| `src/pages/asian-new-year.njk` | Added TC/SC FAQ translations |
| `src/pages/zodiac.njk` | Added TC/SC FAQ translations |
| `src/pages/bazi.njk` | Added TC/SC FAQ translations |
---

## 2026-03-17 — Calendar Page: Naming History Section (EN/TC/SC)

**Author:** yunneoi.yn

### Content — New Section: "What's in a Name? The Naming History of the Chinese Calendar"

Added a comprehensive naming history section to the Chinese Calendar encyclopaedia page, covering the etymology and political history of every common name for the Chinese calendar. Full trilingual parity (EN/TC/SC).

**Topics covered:**
- Pre-1912 naming context (no generic label needed)
- 1912 Sun Yat-sen decree: two calendars require two names
- The 1928 calendar ban under Chiang Kai-shek (callout box)
- 農曆 (Nónglì) — official status from 1947, irony of the "agricultural" label
- 陰曆 (Yīnlì) — why "lunar calendar" is a misclassification (stat-highlight with 陰陽合曆)
- "Lunar Calendar" in English — a mistranslation of a misnomer
- The "Lunar New Year" VANK controversy (callout box, factual reporting)
- 9-row naming guide table (農曆, 陰曆, 陰陽合曆, 舊曆, 夏曆, 黃曆, 公曆, 陽曆, 國曆)
- Sun Yat-sen 1912 source quote

**Frontmatter updates:**
- Added `naming-history` to TOC between `lunisolar` and `solar-terms`
- Added new FAQ: "Why is the Chinese calendar called the 'lunar calendar' when it is actually lunisolar?" (EN/TC/SC)
- Updated `dateModified` to 2026-03-15

**Files changed:**
- `src/pages/calendar.njk` — +228 lines (naming history section in all three language blocks + frontmatter)

---

## 2026-03-10 — Calendar Page: Detailed Calendar Evolution History (Session 8 cont.)

**Author:** yunneoi.yn

### Content — New Section: "Evolution of the Calendar: From Oracle Bones to the Shoushi System"

Added comprehensive new section to the Chinese Calendar encyclopaedia page covering the full evolution of the Chinese calendar system from legendary origins through the Ming dynasty. Content spans 13 subsections covering every major calendar reform in Chinese history, with full trilingual parity (EN/TC/SC).

**Subsections added:**
- Legendary Origins & Xia Almanac
- Shang Dynasty oracle bone calendar (c. 1600–1046 BCE)
- Zhou Dynasty & the Six Ancient Calendars (with comparison table)
- Qin Unification — Zhuanxu Calendar
- Taichu Reform of 104 BCE (the most important reform)
- Han astronomers: Jia Kui, Liu Hong, Zhang Heng
- Zu Chongzhi's Daming Calendar — precession enters the calendar (462 CE)
- Sui Dynasty — Liu Zhuo's interpolation breakthrough
- Tang Dynasty — Yi Xing & the Dayan Calendar (727 CE), first meridian survey
- Li Chunfeng's Linde Calendar (665 CE)
- Song Dynasty — Shen Kuo, Su Song, Yang Zhongfu
- Guo Shoujing & the Shoushi Calendar (1281 CE) — the pinnacle
- Ming Dynasty — Datong Calendar & Jesuit encounter
- Summary table of 10 major calendar reforms
- Source citation from Shiji

All content follows pre-Qing classical scholarship priority (Shiji, Hanshu, Nan Qi Shu, etc.) as per site editorial rules. Build verified passing (302 pages, 10.31s).

### Files Changed

| File | Change |
|------|--------|
| `src/pages/calendar.njk` | New `calendar-evolution` section in EN/TC/SC blocks; updated TOC, FAQ, and dateModified in frontmatter |
| `src/pages/bazi.njk` | Fixed 2 YAML parse errors: unescaped ASCII double quotes in SC FAQ strings replaced with Chinese quotation marks `「」` |
| `CHANGELOG.md` | This entry |

---

## 2026-03-10 — Fix npm Vulnerability: liquidjs Path Traversal (Session 8 cont.)

**Author:** yunneoi.yn

### Security Fix — liquidjs Path Traversal Vulnerability

Resolved high-severity path traversal fallback vulnerability in `liquidjs <10.25.0` (GHSA-wmfp-5q7x-987x). Fixed via `npm audit fix`. Build verified passing (302 pages, 6.68s). 0 vulnerabilities remaining.

### Files Changed

| File | Change |
|------|--------|
| `package-lock.json` | Updated liquidjs to patched version |
| `CLAUDE.md` | Marked npm vulnerability attention point as RESOLVED |
| `CHANGELOG.md` | This entry |

---

## 2026-03-10 — Onboarding Audit & Document Corrections (Session 8)

**Author:** yunneoi.yn

### Audit — Full Codebase & Documentation Review

New CEO agent session. Complete onboarding audit of repository, live site, documentation, build pipeline, and GitHub state.

**Build verification:**
- Build passes: 302 base pages (299 HTML + 3 non-HTML), 596 i18n variants (298 zh-hant + 298 zh-hans), total 895 HTML files
- CSS minified: 126.7KB → 101.0KB
- JS minified: site.js 58.6KB → 35.4KB, trivia.js 130.5KB → 118.2KB
- Build time: 7.21 seconds
- Live site confirmed accessible and healthy

**npm vulnerability found:**
- `liquidjs <10.25.0` — high-severity path traversal fallback vulnerability (GHSA-wmfp-5q7x-987x)
- Fix available via `npm audit fix`

**Documentation corrections applied:**
- CLAUDE.md Section 6: Removed phantom `src/_data/zodiac.json` reference (file does not exist; zodiac data comes from `zodiacYears.js` and individual `.njk` files)
- CLAUDE.md Section 5: Added npm vulnerability attention point
- README.md: Corrected article count from 16 → 21 (5 CNY articles added 2026-03-09 were not reflected)
- Page counts updated: 302 base → 895 total (was documented as 293 → 879)

**Audit findings (no action taken yet — for board review):**
1. npm high-severity vulnerability in liquidjs needs `npm audit fix`
2. 21 article files exist but only 12 are in contentCalendar.json — 9 articles not tracked in calendar
3. CHANGELOG author emails inconsistent (5 different emails used across sessions)
4. docs/seo-performance.md dated 2026-03-07 has stale P0/P1 status markers that have since been resolved
5. No deployment runbook for Cloudflare Worker (separate from GitHub Pages deploy)
6. No translation QA checklist documented
7. Year 2026 readings will need 2027 versions created before Q4 2026

### Files Changed

| File | Change |
|------|--------|
| `CHANGELOG.md` | This entry |
| `CLAUDE.md` | Removed phantom zodiac.json ref; added npm vuln attention point |
| `README.md` | Corrected article count (16 → 21), page counts (293/879 → 302/895) |

---

## 2026-03-10 — BaZi Calculator Complete Fix: Frontend + Backend + Geocoding (Session 7 cont.)

**Author:** lavertenstyle

### Bug Fix — BaZi Calculator Non-Functional (3-layer fix)

The BaZi calculator was completely non-functional due to bugs across frontend, backend, and geocoding. All three layers have been fixed:

**Frontend fixes (src/site.js):**
- Fixed form ID mismatch: `getElementById('bazi-form')` corrected to `getElementById('bazi-calc-form')`
- Fixed checkbox ID mismatch: `getElementById('bazi-unknown-time')` corrected to `getElementById('bazi-no-time')`
- Fixed sex selector: `getElementById('bazi-sex')` replaced with `querySelector('input[name="bazi-sex"]:checked')` (radios use `name` not `id`)
- Fixed city data key references: `c.c`/`c.co`/`c.la`/`c.lo` corrected to `c.city`/`c.country`/`c.lat`/`c.lng` matching cities.json schema

**Geocoding upgrade (src/site.js):**
- Replaced city-only autocomplete (~200 major cities) with hybrid Nominatim + cities.json fallback
- Primary: OpenStreetMap Nominatim API (worldwide coverage, towns and villages)
- Fallback: cities.json offline search for Nominatim failures
- Added `resolveTimezone()` helper — finds nearest city in cities.json for IANA timezone lookup
- 350ms debounce with AbortController respects Nominatim 1 req/sec rate limit

**Backend fixes (worker/bazi-worker.js):**
- Added missing `FUNC: 'BDayInfo'` parameter to windada True Solar Time API call (was returning empty form)
- Fixed windada response regex to match actual HTML table format
- Added full date extraction (year/month/day) to handle True Solar Time crossing midnight
- Rewrote `parseBaziHtml()` to properly parse zhouyi.cc's structured grid (`<ul class='bazilist f14'>` 7x5 grid)
- Now extracts: Four Pillars, hidden stems, Na Yin, Da Yun luck cycles, basic info, Five Elements analysis, 23 reading sections, Day Master
- Added parser validation: clear error message if pillar extraction fails

**Chart renderer rewrite (src/site.js):**
- Enhanced Four Pillars grid with hidden stems and Na Yin rows per pillar
- Added basic info section (lunar date, zodiac, constellation)
- Added Five Elements balance display
- Added Da Yun major luck cycles as horizontal scrollable card row
- Added reading sections as collapsible `<details>` elements
- Added parse error display for upstream format changes
- All dynamic content wrapped in `esc()` for XSS safety

**CSS additions (src/styles.css):**
- New classes: `.pillar-hidden`, `.pillar-nayin`, `.bazi-info-grid`, `.bazi-five-elements`, `.bazi-dayun`, `.bazi-dayun-row`, `.bazi-dayun-card`, `.bazi-sections`
- Full dark mode support for all new elements

**HTML tweak (src/pages/bazi-calculator.njk):**
- Updated city field placeholder to "Start typing any city or town name…"
- Added note: "Covers cities and towns worldwide via OpenStreetMap."

### Files Changed

| File | Change |
|------|--------|
| `src/site.js` | 3 ID fixes, city key fixes, Nominatim geocoding, chart renderer rewrite |
| `worker/bazi-worker.js` | windada API fix, zhouyi.cc parser rewrite, enriched response JSON |
| `src/styles.css` | New BaZi result CSS classes + dark mode overrides |
| `src/pages/bazi-calculator.njk` | City field placeholder + OpenStreetMap note |
| `CHANGELOG.md` | This entry |

### Deployment Note

The Cloudflare Worker changes require `npx wrangler deploy` to go live. Frontend changes deploy with the normal Eleventy build to GitHub Pages.

---

## 2026-03-10 — Strategic Pivot: Automated PDF Revenue + Document Updates (Session 7)

**Author:** lavertenstyle

### Documentation — Strategic Monetisation Update

Updated core project documents to reflect the new revenue strategy agreed with the owner:

- **TODO.md:** Added new top-priority monetisation section (items A–D) covering automated BaZi PDF reports, compatibility PDF reports, directory lead-gen expansion, and embeddable API/widget. Cleaned up priority matrix — moved 14 completed items to a separate "Completed Items" table. Updated executive summary.
- **CLAUDE.md:** Updated Section 3 (Strategy Rules) with new revenue model details. Updated Section 5 (Temporary Attention Points) — Facebook Pixel now marked as installed, translation backlog resolved, added new attention point for BaZi PDF report system.
- **docs/content-strategy.md:** Section 6.8 added for automated PDF report products.

### Files Changed

| File | Change |
|------|--------|
| `TODO.md` | New monetisation strategy section; cleaned priority matrix; updated summary |
| `CLAUDE.md` | Revenue model update (Section 3); attention points update (Section 5) |
| `CHANGELOG.md` | This entry |

---

## 2026-03-09 — Full TC/SC Translation: Compatibility Hub, Zodiac Hub, 12 Animal Profiles (Session 6)

**Author:** kiki.peiqi.li

### Content — Compatibility Hub TC/SC Completion

Expanded the Compatibility hub page (`compatibility.njk`) TC/SC translations from ~60% to full parity:

- **Compatibility chart table** with all 12 animal interactions translated
- **Self-punishment section** (自刑) with explanations and examples
- **Elemental interactions** (Six Harmonies, Three Harmonies, Six Clashes, Six Harms) with closing paragraphs
- **Expanded truncated introductions** in existing sections
- **Premium CTA callout** translated for both TC and SC

### Content — Zodiac Hub TC/SC Completion

Expanded the Zodiac hub page (`zodiac.njk`) TC/SC translations from ~70% to full parity:

- **12 animal detail sections** after the zodiac grid (overview, personality traits, compatibility highlights for each animal)
- **Watch & Learn section** with Jackie Chan Adventures video embeds and social media content

### Content — 12 Zodiac Animal Profile Pages (Stub → Full)

Translated all 12 zodiac animal profile pages from stub (~14% — hero + summary only) to full 7-section TC/SC:

| Page | Key Cultural Content (TC/SC) |
|------|------------------------------|
| Rat (`rat.njk`) | Cang Jie legend, first-to-arrive myth, Zi hour |
| Ox (`ox.njk`) | Shennong agriculture, iron plough history, Lao Tzu's mount |
| Tiger (`tiger.njk`) | King of Beasts, 王 character on forehead, tiger-head shoes, Door Gods |
| Rabbit (`rabbit.njk`) | Jade Rabbit mythology, Taiping Yulan, Mid-Autumn Festival, Rabbit Lord figurines |
| Dragon (`dragon.njk`) | Hongshan jade dragons, Yijing Qian hexagram, imperial five-clawed dragon, Dragon Boat Festival |
| Snake (`snake.njk`) | "Little Dragon" folk name, Nuwa mythology, White Snake legend, Samantabhadra Bodhisattva |
| Horse (`horse.njk`) | Zhou Rites, blood-sweating horses, Xu Beihong paintings, 2026 Fire Horse year |
| Goat (`goat.njk`) | Shuowen Jiezi etymology, 三羊開泰, kneeling-to-nurse filial piety, Twenty-Four Filial Exemplars |
| Monkey (`monkey.njk`) | Sun Wukong/Journey to the West, Monkey Opera in Peking Opera, Qitian Dasheng temple worship |
| Rooster (`rooster.njk`) | Five Virtues from Hanshu, Dong Zhongshu's Chunqiu Fanlu, jī/jí homophone |
| Dog (`dog.njk`) | Hemudu culture domestication, Erya dictionary, Tiangou eclipse mythology |
| Pig (`pig.njk`) | 家 character etymology (roof + pig), Kuahuqiao archaeology, Zhu Bajie, 肥豬拱門 |

Each page follows the established 7-section structure: overview (with info-grid), personality (core strengths + potential challenges), earthly-branch (with data-table), compatibility (with data-table), years (with data-table + Lichun note), career (5 items), culture (2 paragraphs).

**Files changed:** `compatibility.njk`, `zodiac.njk`, `rat.njk`, `ox.njk`, `tiger.njk`, `rabbit.njk`, `dragon.njk`, `snake.njk`, `horse.njk`, `goat.njk`, `monkey.njk`, `rooster.njk`, `dog.njk`, `pig.njk` (14 files total)

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, zero errors, 7.13 seconds

---

## 2026-03-09 — Pinterest Domain Verification (Session 5, continued)

**Author:** kiki.peiqi.li

### Feature — Pinterest Domain Verification

Added Pinterest domain verification code (`d1ac131191ba6ba1d8f137aae6929019`) to `site.json`, activating the `<meta name="p:domain_verify">` tag on all pages. This enables Rich Pins and website claiming in Pinterest Business.

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Pinterest & TikTok Social Links (Session 5, continued)

**Author:** kiki.peiqi.li

### Feature — Pinterest & TikTok Social Integration

Added Pinterest Business and TikTok account links to `site.json`, activating the pre-existing conditional social icons in the footer across all pages:

- Pinterest: `https://www.pinterest.com/ChineseZodiacYear/`
- TikTok: `https://www.tiktok.com/@chinesezodiacyear`
- Both icons now render in the site footer on all 891 built pages (302 base + 596 i18n variants)
- TODO #9 and #11 updated to reflect account creation progress

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Favicon Consistency Fix (Session 5)

**Author:** kiki.peiqi.li

### Fix — Favicon Gold Color and Tilt

Regenerated all favicon raster files from the SVG source to ensure consistency with the webpage nav logo:
- Increased seal tilt from -2deg to -5deg for visibility at small sizes (16-32px)
- All raster files (favicon.ico, PNG 32/192/512, apple-touch-icon) regenerated via `rsvg-convert` with Noto Serif CJK SC Bold font
- CSS `.logo-seal` rotation updated from -2deg to -5deg to match

### Feature — Meta Pixel Installation

Installed Facebook/Meta Pixel (ID: `1461477519098003`) by setting `facebookPixelId` in `site.json`. The base template already had the conditional pixel code wired up — only the data value was missing.

- Pixel fires `PageView` on every page (302 base + 596 i18n variants)
- Noscript fallback image included for tracking without JavaScript
- TODO #1 (CRITICAL) marked complete

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Affiliate Recommended Reading Sidebars (Session 4, continued)

**Author:** kiki.peiqi.li

### Feature — Sidebar Book Recommendations on 12 Pages

Added "Recommended Reading" affiliate sidebar to 12 encyclopaedia pages that were missing them, linking to topically relevant books from the shop catalogue:

- **Yi Jing:** I Ching (Legge), Tao Te Ching (Mitchell)
- **Tea Culture:** The Classic of Tea (Carpenter)
- **Qi Men Dun Jia:** BaZi Destiny Code (Yap), Art of War (Sun Tzu)
- **TCM:** Web That Has No Weaver (Kaptchuk), Between Heaven and Earth (Beinfield)
- **Spring Festival:** Handbook of Chinese Horoscopes (Lau), Complete Book (Reid)
- **Calendar:** I Ching (Legge), Definitive Book of Chinese Astrology (Wu)
- **Folk Arts:** Complete Book of Chinese Horoscopes (Reid)
- **Hanfu:** Art of War (Sun Tzu)
- **Martial Arts:** Art of War (Sun Tzu), Tao Te Ching (Mitchell)
- **Dynasties:** Art of War (Sun Tzu), Tao Te Ching (Mitchell)
- **Wuxia:** Art of War (Sun Tzu)
- **Chinamaxxing:** Tao Te Ching (Mitchell), Art of War (Sun Tzu)

All links use `kikigreene-20` affiliate tag with direct `/dp/ASIN` URLs. Pages with sidebar recommendations: 19 → 31.

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Affiliate Link Fix: Search URLs → Direct Product Links (Session 4, continued)

**Author:** kiki.peiqi.li

### Fix — Affiliate Product URLs

Replaced all 16 Amazon search URLs (`/s?k=...`) with direct product links (`/dp/ASIN`) for reliable affiliate commission attribution. Search URLs can lose the affiliate tag during navigation; direct product links ensure the `kikigreene-20` tag is always passed to Amazon Associates.

**Products fixed:** Luo Pan Compass, Calligraphy Brush Set, Gongfu Tea Set, Red Envelopes, Jade Bangle, Pixiu Bracelet, Zodiac Pendant, Lucky Coin Set, Laughing Buddha, Bagua Mirror, Fortune Cat, Calligraphy Wall Scroll, Incense Burner, Acupressure Mat, Gua Sha Tool, Cupping Set.

All 27 affiliate products now point to concrete Amazon product pages. Zero search URLs remain.

---

## 2026-03-09 — Affiliate Products Expansion & Repositioning (Session 4, continued)

**Author:** kiki.peiqi.li

### Feature — Affiliate Products Expansion

Expanded the Amazon Associates affiliate catalogue from 10 to 27 products, adding 3 new categories:

**New categories:**
- **Jewellery (4):** Natural jade bangle, Pixiu feng shui bracelet, zodiac pendant necklace, lucky coin set
- **Decor (5):** Laughing Buddha statue, Bagua mirror, Maneki-Neko fortune cat, calligraphy wall scroll, Chinese incense burner set
- **Wellness (3):** Acupressure mat and pillow set, jade gua sha tool, Chinese cupping therapy set

**New books (5):** Chinese Astrology: Plain and Simple (Dee), Tao Te Ching (Laozi/Mitchell), The Art of War (Sun Tzu), Feng Shui Modern (Tan & Lee), Handbook of Chinese Horoscopes (Lau)

All 17 new products include trilingual names and subtitles (EN/TC/SC), category tags, and Amazon URLs with `kikigreene-20` affiliate tag.

### Layout — Affiliate Section Repositioned

Moved the "Recommended Books & Tools" section to the top of the shop page in all 3 language blocks (EN/TC/SC), ahead of Premium Readings and Digital Products. Added new filter buttons for jewellery (首飾/首饰), decor (擺設/摆设), and wellness (養生/养生).

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — Affiliate Products & Encyclopaedia Translations (Session 4)

**Author:** kiki.peiqi.li

### Content — Encyclopaedia TC/SC Translations

Translated 3 remaining encyclopaedia pages to Traditional Chinese (zh-hant) and Simplified Chinese (zh-hans), completing the translation backlog:

- **Yi Jing** (`yijing.njk`): Full TC/SC translation of all sections — origins, trigrams, hexagrams, divination methods, philosophical influence, modern applications.
- **Tea Culture** (`tea-culture.njk`): Full TC/SC translation — Lu Yu and the Classic of Tea, six tea types, gongfu ceremony, tea and health, regional traditions.
- **Qi Men Dun Jia** (`qimen.njk`): Full TC/SC translation — history, the nine stars, eight doors, cosmic board structure, modern applications.

### Feature — Amazon Associates Affiliate Products

Added 10 curated affiliate products to the shop page, creating a new "Recommended Books & Tools" section:

**Books (6):**
- The Complete Book of Chinese Horoscopes (Lori Reid)
- The Definitive Book of Chinese Astrology (Shelly Wu)
- BaZi — The Destiny Code (Joey Yap)
- The Living Earth Manual of Feng Shui (Stephen Skinner)
- I Ching: The Book of Changes (James Legge translation)
- The Classic of Tea by Lu Yu (Francis Ross Carpenter)

**Tools & Supplies (4):**
- Professional Luo Pan Feng Shui Compass
- Chinese Calligraphy Brush Set
- Gongfu Tea Set (ceramic)
- Chinese Red Envelopes (Hongbao) 50-pack

**Technical implementation:**
- `shop.json`: Added `affiliateProducts` array with trilingual names/subtitles (EN/TC/SC), categories, featured flags, and Amazon URLs with `kikigreene-20` affiliate tag.
- `shop.njk`: Added affiliate section in all 3 language blocks (EN/TC/SC) with independent filter buttons (All/Books/Tools), affiliate disclosure, and `rel="noopener sponsored"` links.
- `site.js`: Refactored shop filter JS from global selection to per-`.shop-filters` group scoping using `nextElementSibling`, so digital product and affiliate product filters operate independently. Added `data-scope` attribute for GA4 event label differentiation.
- `styles.css`: Added `.product-price--affiliate` and `.affiliate-disclosure` styles with dark mode variants.

### Documentation Updates

- `CLAUDE.md`: Translation backlog marked RESOLVED
- `TODO.md`: Translation audit table updated (0 ABSENT, all DONE), phases 1 & 2 complete
- `docs/architecture.md`: 3 known issues marked RESOLVED, search index count updated to ~302
- `docs/content-strategy.md`: All 7 translated pages marked Full parity EXCELLENT

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified (32.7KB), zero errors

---

## 2026-03-09 — BaZi Cloudflare Worker Deployment Fix

**Author:** chinesezodiacyear (session 3, continued)

### Infrastructure — Worker Deployment

- **`wrangler.jsonc`**: Replaced the Cloudflare autoconfig static-assets configuration with the actual BaZi API worker config. Changed `"assets": {"directory": "_site"}` to `"main": "worker/bazi-worker.js"` with `ALLOWED_ORIGINS` env var. The worker now correctly serves as an API proxy (fetching True Solar Time and BaZi chart data from upstream Chinese astrology services), not a static site host.
- **Cloudflare build settings**: Root directory changed from `/worker` to `/`, build command removed (worker needs no build step), deploy command remains `npx wrangler deploy`.
- **Worker verified live** at `bazi-calculator.kiki-peiqi-li.workers.dev` returning structured JSON with four pillars, Day Master, and Chinese reading text.

---

## 2026-03-09 — Chinese Character & Pinyin Annotations + BaZi Worker URL

**Author:** chinesezodiacyear (session 3)

### Content — Pinyin Annotations

Added `<span class="chinese-char">` and `<span class="pinyin">` markup to all Chinese terms in English content sections across 7 articles (~75 annotation gaps fixed). TC/SC sections untouched. All pinyin uses HTML entities for tone marks per site standard.

**Articles updated:**

- **`chinese-new-year-global-celebration.njk`** — 7 fixes (Chunyun, tusu wine, Zong Lin, Jingchu Suishi Ji, etc.)
- **`chinese-new-year-spring-festival.njk`** — 7 fixes (Yuanri, Zhengdan, Wang Anshi, Meng Yuanlao, etc.)
- **`chinese-new-year-traditions.njk`** — 7 fixes (shansao, bianpao, Shenshu/Yulei, Meng Chang, etc.)
- **`chinese-new-year-vs-lunar-new-year.njk`** — 2 fixes (Zhu Qiqian, Samguk Sagi)
- **`fifteen-days-chinese-new-year.njk`** — 6 fixes (nian gao, yusheng, tangyuan/yuanxiao, etc.)
- **`why-red-and-gold-chinese-new-year.njk`** — 11 fixes (Wu Xing, five elements, Shanhai Jing, yasuiqian, feng shui, etc.)
- **`qingming-festival-guide.njk`** — 17 fixes (Chunfen, Guyu, Jie Zitui, Duke Wen of Jin, Du Mu, Zuo Zhuan, food table, Guo Pu, Zangshu, etc.)

### Feature — BaZi Calculator Worker URL

- **`bazi-calculator.njk`**: Added `data-worker-url="https://bazi-calculator.kiki-peiqi-li.workers.dev"` to the calculator form element, connecting the frontend to the Cloudflare Worker proxy.

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified, zero errors

---

## 2026-03-09 — Adopt Classical "Encyclopaedia" Spelling

**Author:** chinesezodiacyear (session 2, continued)

### Content — Spelling Standardisation

- **Changed "encyclopedia" → "encyclopaedia"** in all user-facing prose across 41 files (titles, descriptions, hero overlines, button text, meta tags, manifest, llms.txt, nav labels, documentation).
- Code identifiers preserved: `category: "encyclopedia"` frontmatter, CMS config, collection filters, sitemap priority logic, CSS class comments, and JS fallback links remain unchanged to avoid breaking the build pipeline.
- **Files touched:** 30 source `.njk` files, `package.json`, `manifest.json`, `site.json`, `nav.json`, `llms.txt`, `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `TODO.md`, and 4 docs files.

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified, zero errors

---

## 2026-03-09 — MS Clarity Activation & British English Audit

**Author:** chinesezodiacyear (session 2)

### Features

- **Microsoft Clarity activated** (`src/_data/site.json`): Added Clarity tracking ID `vsv5yhdstc`. The conditional Clarity script block in `base.njk` was already wired up — setting the ID enables heatmap and session recording on all pages.

### Content Fixes — British English Spelling

- **`src/pages/index.njk`**: "Organizations" → "Organisations" (heading + card label, 2 instances)
- **`src/pages/zodiac.njk`**: 5 corrections:
  - "standardized" → "standardised" (FAQ answer)
  - "civilization" → "civilisation" (Ox description)
  - "emphasize" → "emphasise" (Rabbit description)
  - "symbolizes" → "symbolises" (Goat description)
  - "symbolizes" → "symbolises" (Dog description)
- **`src/pages/calendar.njk`**: Already correct British English — no changes needed
- **`src/pages/spring-festival.njk`**: Already correct British English — no changes needed
- **`src/pages/asian-new-year.njk`** (Chinese NY Influence): Already correct British English — no changes needed

### Build Verification

- Build passes: 302 base pages, 596 i18n variants, CSS/JS minified

---

## 2026-03-09 — Technical Stabilisation: BaZi, Newsletter, Analytics Placeholders

**Author:** chinesezodiacyear (onboarding audit session)

### Bug Fixes

- **BaZi Calculator graceful offline mode** (`src/site.js`): Replaced hardcoded placeholder Worker URL (`YOUR_SUBDOMAIN`) with a configurable `data-worker-url` attribute approach. When no Worker URL is configured, users now see a friendly "BaZi Calculator Offline" message instead of a silent fetch failure. Once the Cloudflare Worker is deployed, the template just needs the `data-worker-url` attribute set.

- **Newsletter popup stuck state fix** (`src/site.js`): Added an 8-second safety timeout to the Beehiiv newsletter iframe submission. Previously, if the iframe failed silently, the subscribe button would stay stuck on "Subscribing..." indefinitely (Regression #3). Now, after 8 seconds, the error state is shown with a retry option. The `beehiivDone` flag prevents the error from firing after a successful submission.

### Added

- **Facebook Pixel placeholder** (`src/_includes/layouts/base.njk`, `src/_data/site.json`): Added `facebookPixelId` config key (empty by default) and conditional Meta Pixel script block. When a Pixel ID is added to `site.json`, the standard `fbevents.js` loader and `PageView` tracking will activate automatically on all pages.

- **Microsoft Clarity placeholder** (`src/_includes/layouts/base.njk`, `src/_data/site.json`): Added `clarityId` config key (empty by default) and conditional Clarity tag script. Same activation pattern as Facebook Pixel.

### Verified

- **Hub page ItemList schemas**: Confirmed all four hub pages (`zodiac.njk`, `wuxing.njk`, `dynasties.njk`, `readings.njk`) already have correct `hubSchema` frontmatter with ItemList structured data. No changes needed.

- **Build validation**: Full build passes — 302 base pages, 596 i18n variants (898 total). CSS minified 123KB→98KB, JS minified 53KB→33KB.

**Files changed:** `src/site.js`, `src/_data/site.json`, `src/_includes/layouts/base.njk`

---

## 2026-03-09 — Meta-Learning Framework: Agent Boot File & SOPs

**Author:** kiki.shmoo

### Added Agent Self-Improvement Infrastructure

Implemented the "9 Meta-Learning Tips" framework (based on @AtlasForgeAI's article) to enable persistent learning across agent sessions.

**New files:**

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Agent boot file — loaded every session. Contains canonical rules (editorial identity, technical identity, content standards), strategy rules (quarterly review), regressions/"never again" list, temporary attention points, key file locations, and documentation requirements. |
| `docs/sop-agent-workflow.md` | Standard Operating Procedures — session start/end protocols, memory tiering (Tier 1 canonical / Tier 2 strategic / Tier 3 temporary), prediction-first decision making, contradiction resolution, creative vs. operational modes, structured iteration with exit criteria, nightly review checklist. |
| `docs/prediction-log.md` | Decision prediction log — record predictions before major decisions, fill in actuals after, analyse deltas to reveal systematic biases. Pre-populated with 3 entries from today's session. |
| `docs/contradiction-log.md` | Conflicting instruction log — when rules conflict, log both sides and the resolution rather than silently choosing. Pre-populated with 3 resolved contradictions. |

**Key principles implemented:**
1. **Regressions list** (Tip 1) — 5 historical mistakes documented with prevention rules
2. **Tiered memory** (Tip 2) — Canonical/Strategic/Temporary with confidence tags
3. **Prediction log** (Tip 3) — Forces think-before-act, reveals systematic biases
4. **Nightly review** (Tip 4) — Checklist for periodic maintenance
5. **Contradiction log** (Tip 5) — Prevents silent drift from conflicting instructions
6. **Temporary attention points** (Tip 6) — Time-boxed focus items with auto-expiry
7. **Self-labelling** (Tip 7) — Fact/observation/inference/speculation tagging
8. **Creative vs. operational modes** (Tip 8) — Different rules for different work types
9. **Structured iteration** (Tip 9) — Three-round rule with exit criteria

---

## 2026-03-09 — CNY vs LNY Article: "No Single Lunar New Year" Argument

**Author:** kiki.shmoo

### Strengthened Calendar-System Section with Cross-Cultural Evidence

Added a new subsection **"There Is No Single 'Lunar New Year'"** to `chinese-new-year-vs-lunar-new-year.njk`, within the existing Lunisolar Calendar section. The argument: multiple civilisations maintain their own lunar or lunisolar calendars with completely different new year dates — proving "Lunar New Year" is incoherent as a collective term.

**Comparison table added (7 calendars):**

| Calendar | Type | New Year | Approximate Date |
|---|---|---|---|
| Chinese | Lunisolar | Spring Festival | Late Jan – mid Feb |
| Islamic (Hijri) | Purely lunar | 1 Muharram | Drifts (~June 2026) |
| Hebrew | Lunisolar | Rosh Hashanah | Sept – Oct |
| Hindu (Vikram Samvat) | Lunisolar | Various regional | March – April |
| Hindu (Shalivahana Saka) | Lunisolar | Ugadi / Gudi Padwa | March – April |
| Thai (Buddhist) | Lunisolar | Songkran | 13–15 April |
| Tibetan | Lunisolar | Losar | Varies |

Also updated the "Lunar New Year" bullet in "What Should You Call It?" and the first FAQ answer to reference this argument. Read time updated 10 → 12 min.

---

## 2026-03-09 — CNY vs LNY Terminology Rejection (Site-Wide)

**Author:** kiki.shmoo

### Editorial Voice Updated Across 4 Files

Updated all editorial-voice references to "Lunar New Year" across the site. The site's position: "Lunar New Year" is a mistranslation (lunisolar ≠ lunar) and a deliberate erasure of Chinese origin. Recommended terms: "Chinese New Year" or "Spring Festival."

**Files updated:**
- `chinese-new-year-vs-lunar-new-year.njk` — "What Should You Call It?" section rewritten, FAQ updated, overview updated
- `chinese-new-year-spring-festival.njk` — FAQ answer updated
- `spring-festival.njk` — FAQ answer updated
- `asian-new-year.njk` — FAQ answer updated

SEO keywords and factual reporting (VANK campaign documentation, regional celebration names) kept intact.

---

## 2026-03-09 — GA4 Event Tracking in site.js

**Author:** kiki.shmoo

### Added gtag Event Calls to All Interactive Features

Added GA4 custom event tracking to `site.js` for all user-facing interactions. Events use a `track()` helper inside the DOMContentLoaded scope (wraps `if (window.gtag) gtag(...)`) and direct `if (window.gtag)` guards in standalone IIFEs.

**Events added:**

| Event Name | Category | Trigger |
|---|---|---|
| `zodiac_calculate` | Calculator | Zodiac calculator form submit |
| `faq_open` | Engagement | FAQ accordion item opened |
| `filter_apply` | Engagement | Directory/news category filter clicked |
| `newsletter_subscribe` | Newsletter | Successful email subscription |
| `newsletter_error` | Newsletter | Failed email subscription |
| `site_search` | Search | Search query executed (includes `search_term`, `results_count`) |
| `theme_toggle` | Preferences | Dark/light mode switched |
| `compatibility_check` | Calculator | Zodiac compatibility form submit |
| `social_share` | Social | Share button clicked (Twitter, Facebook, LinkedIn, email) |
| `bazi_calculate` | Calculator | BaZi Four Pillars chart calculated |
| `bazi_error` | Calculator | BaZi calculation failed |
| `shop_filter` | Shop | Product category filter clicked |
| `language_switch` | Preferences | EN/TC/SC language toggled |
| `qr_view` | Engagement | QR code lightbox opened (donate page) |
| `popup_shown` | Popup | Exit-intent email popup displayed |
| `popup_dismissed` | Popup | Exit-intent popup closed |

All events follow the pattern established by the existing Web Vitals tracking in `base.njk`. No new dependencies added.

---

## 2026-03-09 — Content Articles: Chinese New Year Series (5 articles)

**Author:** kiki.shmoo

### New Articles Published

Five new articles drafted and published, forming a Chinese New Year topical cluster:

1. **Chinese New Year vs Lunar New Year** (`chinese-new-year-vs-lunar-new-year.njk`)
   - Historical names for the lunisolar new year, calendar system (lunisolar ≠ lunar), the VANK campaign (2019–present), UNESCO 2024 inscription, regional celebrations (Seollal, Tết, Losar).
   - Permalink: `/chinese-new-year-vs-lunar-new-year/`

2. **Why Red and Gold Are the Colours of Chinese New Year** (`why-red-and-gold-chinese-new-year.njk`)
   - Wu Xing colour theory, peachwood charms → red paper evolution (Han → Ming), gold/Metal element and imperial symbolism, Nian beast myth debunked, colours to avoid, modern adaptations.
   - Permalink: `/why-red-and-gold-chinese-new-year/`

3. **The Fifteen Days of Chinese New Year** (`fifteen-days-chinese-new-year.njk`)
   - Day-by-day guide: New Year's Eve through Lantern Festival, Kitchen God, God of Wealth (Day 5), Renri/Birthday of Humanity (Day 7), Jade Emperor (Day 9), Lantern Festival (Day 15). Full taboos table.
   - Permalink: `/fifteen-days-chinese-new-year/`

4. **How Chinese New Year Became a Global Celebration** (`chinese-new-year-global-celebration.njk`)
   - Migration waves (Southeast Asia, Gold Rush, Europe, modern), Chinatown celebrations worldwide, public holidays table, brand/commerce involvement, cultural bridge function.
   - Permalink: `/chinese-new-year-global-celebration/`

5. **Chinese New Year Traditions — From Firecrackers to Family Dinners** (`chinese-new-year-traditions.njk`)
   - Each major tradition traced from origin to modern form: firecrackers (bamboo → gunpowder), red envelopes (Song coins → WeChat), reunion dinner, spring couplets (peachwood → red paper), lion/dragon dances, paper-cutting, evolution timeline table.
   - Permalink: `/chinese-new-year-traditions/`

### Content Calendar Updated

- Added all 5 articles to `contentCalendar.json` as `status: "published"`.
- Articles are English-only for now; TC/SC translations to follow.
- Build verified: 302 pages written, all 5 new article URLs confirmed.

---

## 2026-03-09 — Favicon Fix, Encyclopaedia Translations, Onboarding Audit

**Author:** kiki.shmoo

### Favicon Updated to Match Page Logo

- **Problem:** Browser tab favicon used ivory/white (`#FAF6EF`) text on red, while the page header logo uses imperial gold (`#BF9328`) text with a gold border — visual mismatch.
- **Fix:** Updated `favicon.svg` to use gold text, gold border stroke, and semi-transparent dark overlay matching the `.logo-seal` CSS styling. Added `-2deg` rotation (`1fbdc09`) to match the page logo's `transform: rotate(-2deg)`.
- Regenerated all favicon variants: `favicon.ico`, `favicon-32.png`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png`.

### Encyclopaedia Pages — TC/SC Translations (`c7c71fe`)

- Translated 4 encyclopaedia pages to Traditional Chinese (zh-hant) and Simplified Chinese (zh-hans):
  - **TCM** (`tcm.njk`): 11 sections — foundations, qi, zangfu, meridians, herbal medicine, food therapy, diagnosis, etc.
  - **Martial Arts** (`martial-arts.njk`): 8 sections — history, external/internal styles, five elements, animal styles, medicine connection.
  - **Folk Arts** (`folk-arts.njk`): 9 sections — lion dance, dragon dance, big-head buddha, yingge, deity procession, piaose, etc.
  - **Wuxia** (`wuxia.njk`): 11 sections — origins through modern wuxia, code of xia, weapons, Jackie Chan Adventures.
- All translations follow the established three-block i18n pattern (`lang-en`, `lang-tc`, `lang-sc`).
- Build verified: 586 i18n variant pages generated, all 8 new zh-hant/zh-hans pages confirmed.

---

## 2026-03-09 — Onboarding Audit & Codebase Review

**Author:** kiki.shmoo

### Full Codebase Audit

- Reviewed all documentation (README, TODO, CHANGELOG, architecture.md, content-strategy.md, seo-performance.md).
- Verified build pipeline: `npm ci` + `npx @11ty/eleventy` — 297 files built in 6.47s, 0 vulnerabilities, CSS/JS minification passing, i18n generating 586 variant pages from 293 sources.
- Confirmed CI/CD workflow (`deploy.yml`) validation step is robust: page count thresholds, minification assertions, critical file checks.
- Audited content calendar: 5/11 articles published, 6 queued (next deadline: Dragon Boat Festival Apr 20 target).
- Audited TODO roadmap: 12/25 items completed, 2 CRITICAL items remaining (Facebook Pixel, GA4 conversions).
- No new code vulnerabilities (`npm audit` clean).
- No broken build issues detected.

---

## 2026-03-08 — Hero TC/SC Consistency, Language Toggle Fix, CI Hardening

**Author:** lavertenstyle

### Hero Section TC/SC Translation Consistency (`7e46fe7`)

- **Problem:** 20 pages using the shared `hero.njk` partial showed English-only hero sections when viewing zh-hant/zh-hans variants, while 7 pages with custom inline heroes displayed correct translations.
- Updated `hero.njk` partial to accept optional trilingual frontmatter fields (`heroTitleTc/Sc`, `heroSubtitleTc/Sc`, `heroOverlineTc/Sc`) using `<div class="lang-XX">` wrappers compatible with build-time i18n stripping.
- Added TC/SC translations to all 20 article-layout pages: zodiac, bazi, fengshui, calendar, spring-festival, wuxing, bazi-calculator, asian-new-year, folk-arts, hanfu, dynasties, taoism, qimen, yijing, tcm, martial-arts, tea-culture, wuxia, chinamaxxing, compatibility.
- **Files:** `hero.njk`, 20 page frontmatters, `architecture.md`, `TODO.md`

### Language Toggle Navigation Bug Fix (`fa707d2`)

- **Problem:** Toggling to TC/SC on one page, then clicking a nav link, showed English content with the toggle stuck in TC/SC position.
- Fixed inline language detection in `base.njk` to derive language from URL path (not localStorage).
- Added language-aware nav link rewriting in `site.js` — on `/zh-hant/` or `/zh-hans/` pages, internal nav/footer links are rewritten to preserve the language prefix.
- **Files:** `base.njk`, `site.js`, `architecture.md`, `TODO.md`

### Translation Quality Audit (`ef1a889`)

- Audited all 27 main pages for TC/SC translation quality and completeness.
- Documented findings in `content-strategy.md` section 3.2.1 with per-page status table.
- Fixed hanfu page pinyin annotations.
- Identified 7 encyclopaedia pages with absent translations and created prioritized translation queue.
- **Files:** `content-strategy.md`, `hanfu.njk`

### CI Build Validation & Security Fix (`5d0555c`)

- Fixed npm vulnerability (minimatch ReDoS) by upgrading `@11ty/eleventy` 3.1.1 to 3.1.2.
- Added "Validate build output" step to GitHub Actions `deploy.yml` — asserts page counts, minification, critical file existence, and HTML structure before deployment.
- Expanded `llms.txt` with 13 additional key URLs for AI crawler discovery.
- **Files:** `package.json`, `package-lock.json`, `deploy.yml`, `llms.txt`

---

## Historical Changes (pre-2026-03-08)

> Changes made before the current development workflow was established.
> Listed in reverse chronological order, grouped by feature.

### 2026-03-08 — Video Embeds & Article Translations

- Moved contextual video embeds inline with relevant dynasty/topic sections across 8 encyclopaedia pages.
- Added X/Twitter video embed to Hanfu page with full oEmbed markup.
- Translated top 5 articles to Traditional and Simplified Chinese.
- Updated documentation for video embed system.

### 2026-03-07 — Content Pipeline, SEO, Compatibility Pages

- Added 78 compatibility pair pages for pillar-cluster SEO architecture.
- Added 5 keyword-targeted articles and Qingming Festival article.
- Added news pagination, category archive pages, and news filters.
- Added cross-sell CTA, directory credibility improvements.
- Added CollectionPage schema to compatibility hub, categorized year pages.
- Added strategic TODO roadmap.
- Fixed hero subtitle HTML rendering, newsletter form persistence, article card clickability.
- Enabled FormSubmit spam protection on newsletter fallback.

### 2026-03-07 — Build-Time i18n URL Structure

- Added i18n URL structure with `/zh-hant/` and `/zh-hans/` paths (build-time page generation).
- Stripped trilingual bloat from generated pages, added hub-to-subpage links.
- Added README.

### 2026-03-06 — Dynasty Content, Newsletter Fix, Year Pages

- Enriched dynasty data with trilingual FAQ and breadcrumb schema fix.
- Added 121 programmatic year pages with unique astrological content.
- Translated dynasties hub page to trilingual (EN/TC/SC) with tone-marked pinyin.
- Fixed newsletter popup "Subscribing..." stuck state.
- Improved mobile donate page layout and QR code lightbox.

### 2026-03-05 — SEO Fixes, Accessibility, Content Enrichment

- Fixed 4 critical SEO/structured-data issues (BreadcrumbList, schemas).
- Resolved 5 major SEO and performance issues.
- Sanitized BaZi innerHTML injections and corrected undefined CSS variables.
- Improved accessibility: aria-expanded on FAQ/nav, reduced motion, skip-to-content link.
- Moved Readings to More dropdown; renamed "Donate" to "Support Us".
- Added Buy Me a Coffee as primary donation method with inline embed.
- Expanded Lunisolar Mechanics section, Dream of the Red Chamber content, Calendar pinyin.
- Added favicon, apple-touch-icon, and web manifest.
- Fixed nav dropdown null safety, lang attribute; added RSS feed.
- Dark mode CSS gap fixes and innerHTML XSS hardening.
- Added email capture enhancements, useful 404 page, favicon improvements.

### 2026-03-05 — Hanfu & Spring Festival Deep Content

- Added pinyin annotations to all Chinese terms on Hanfu and Spring Festival pages.
- Added Niya archaeological clothing, Joseon Wangjo Sillok evidence, qipao history.
- Added Ming Lantern Festival, Korean folk customs, Hanfu revival content.
- Fixed missing Article schema on 2026 Fire Horse article.
- Added unique OG images for all 24 zodiac and reading pages.
- Added Chiang Kai-shek/ROC qipao institutionalisation history.
- Cross-referenced Hanfu and Spring Festival content to dynasty pages.

### 2026-03-04 — Authority, Search, Comments, SEO

- Added social links, verification meta tags (Bing, Google), IndexNow, Pinterest support.
- Shortened page titles for SEO (Bing Site Scan fix).
- Fixed BreadcrumbList schema.org validation.
- Added interactive compatibility calculator with 12x12 chart.
- Redesigned trivia game with gamified UI, added trilingual support (219 questions).
- Added OG images, structured data schemas, directory URL fixes, dynamic copyright.
- Added www-to-non-www redirect for canonical domain consolidation.
- Replaced 21 Unsplash hotlinks with self-hosted WebP images.
- Added programmatic internal linking system with content graph.
- Added 15 high-value pages: 5 element + 10 dynasty sub-pages.
- Added newsletter backend (Beehiiv + Formsubmit.co fallback).
- Added client-side search with build-time JSON index.
- Added giscus-based discussion system for article pages.
- GEO optimization: answer-ready sections, HowTo schema, FAQ expansion.

### 2026-03-03 — UI Redesign, Directory, Articles

- Refined UI to ethereal paper + East Asian ink-wash aesthetic.
- Built directory with data-driven template and 33 verified listings.
- Added 16 curated video embeds from partner YouTube channels.
- Trilingual translations for calendar, spring festival, CNY influence, and hanfu pages.
- Added 4 new trilingual articles: lucky colors, zodiac chart, fire horse history, celebrity signs.
- Made article cards fully clickable with stretched link pattern.
- SEO/GEO quick wins: canonicalize URLs, Twitter handle, defer CJK fonts.
- Added Purple Mountain Observatory, Kaifeng Jews, CNY vs LNY debate content.

### 2026-03-02 — Analytics, P0 Fixes, Language Toggle

- Enabled Google Analytics 4 (G-2QWWBEW512).
- Fixed P0 issues: www/non-www redirect, CMS path, broken links, sitemap, legacy files.
- Trilingual nav/footer, SEO improvements, minification, 12 zodiac pages.
- Fixed language toggle showing all three languages simultaneously.
- Reverted nav/footer to English-only, kept language toggle for content.

### 2026-03-01 — Trilingual System & Page Translations

- Trilingual toggle (EN/TC/SC) with PayPal payments and first page translations.
- Translated all 12 reading pages (rat through pig) to TC/SC.
- Translated BaZi, Wu Xing, Feng Shui encyclopaedia pages to TC/SC.
- TC/SC translations for shop, homepage, donate, and about pages.

### 2026-02-28 — Language Toggle, SEO Batch

- Added Traditional/Simplified Chinese language toggle.
- Added FAQ schema to shop pages, breadcrumbs to readings.
- SEO fixes: heading hierarchy, title lengths, Product schema, Twitter tags.
- Updated calendar price to $3.99 and added chinesenewyear.wiki cross-links.

### 2026-02-27 — Monetization System

- Added shop, premium readings, affiliate links, AdSense integration.
- Fixed contact emails and Amazon Associates tag.
- Updated Stripe payment links.
- Fixed sidebar scrollability and moved affiliate disclosure to sidebar.
- Updated shop.json with real Gumroad product URLs.
- Enabled Google AdSense (ca-pub-8962379324362674).
- Added AdSense verification: ads.txt, meta tag, and script.

### 2026-02-26 — Design & Content Overhaul

- Major design overhaul, 217 trivia questions with timer, famous figures, video embeds.
- Transformed encyclopaedia pages to infographic style with visual components.
- Fixed broken images, layout, news font; added donation page and social embeds.
- Rewrote CNY Influence page with Chinese origins, transmission dates, de-Sinicization.
- Added Jackie Chan Adventures content to wuxia, zodiac, and homepage.
- SEO/GEO overhaul: meta descriptions, keywords, OG images, enhanced schema.
- Fixed mobile nav menu scroll.

### 2026-02-25 — Core Content Expansion

- Added zodiac readings, BaZi calculator, Asian New Year page, enhanced zodiac calculator.
- Added 4 encyclopaedia pages, expanded existing content, fixed CSS and navigation.
- Added wuxia & chinamaxxing pages, trivia game, video embeds, cross-links.

### 2026-02-24 — SSG Migration & Branding

- Converted to Eleventy SSG with Decap CMS.
- Added GitHub Actions workflow for build and deploy.
- Renamed site to "Chinese Zodiac", renamed Calendar to "Chinese Calendar", expanded 24 Solar Terms.
- Fixed GitHub Pages subpath, redesigned CSS with Tang-Song-Ming aesthetics.

### 2026-02-23 — Phase 1 & 2

- Added dark mode, Beehiiv newsletter, and social sharing.
- Added 5 encyclopaedia pages, compatibility checker, nav dropdown.

### 2026-02-22 — Initial Upload

- Initial file upload to repository.

## 2026-03-27 (Session 22) — Repository Layer Scaffold + SQL Boundary Guard

- **Author:** Cody
- Added `worker/repositories/base-repository.js` and `worker/repositories/report-template-repository.js` to establish a dedicated D1 repository layer where SQL is owned.
- Added `worker/services/report-template-service.js` as a service-layer example consuming repositories without inline SQL.
- Added `scripts/check-no-sql-in-services.sh` and wired `npm run infra:architecture:check` to enforce the no-SQL-in-services rule.
- Updated CI (`.github/workflows/deploy.yml`) test job to run the architecture boundary check after migration validation.

