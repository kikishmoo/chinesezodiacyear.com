# CLAUDE.md — Agent Boot File for chinesezodiacyear.com

> **Purpose:** This file is loaded at the start of every agent session. It contains rules, preferences, regressions, and context that must persist across conversations.
> **Last updated:** 2026-03-27
> **Owner:** kiki.shmoo@gmail.com (Kiki Shmoo)

---

## 1. Project Identity

- **Site:** chinesezodiacyear.com — Chinese zodiac encyclopaedia, directory, readings, and cultural reference
- **Stack:** Eleventy 3.1.2 (ESM), Nunjucks templates, GitHub Pages, Cloudflare Workers (BaZi API)
- **Repo:** github.com/kikishmoo/chinesezodiacyear.com
- **GA4:** G-2QWWBEW512
- **Domain:** chinesezodiacyear.com (non-www canonical)

---

## 2. Canonical Rules (Tier 1 — Never Expire)

These are absolute rules. Security, hard constraints, and identity-level decisions. No exceptions.

### 2.1 Editorial Identity

- **The site does NOT accept or promote the term "Lunar New Year."** The Chinese calendar is lunisolar, not lunar. "Lunar New Year" is both a mistranslation and a deliberate erasure of Chinese origin. Use "Chinese New Year" or "Spring Festival" only.
- **"Chinese Lunar New Year"** is acknowledged as imprecise but tolerable if used from ignorance. Once informed, use the correct terms.
- The term "Lunar New Year" may appear in the codebase ONLY in: (a) SEO keyword meta tags, (b) factual reporting about the VANK campaign, (c) direct quotes. It must NEVER appear in editorial voice.
- **Historical content prioritises pre-Qing Dynasty classical scholarship.** Primary sources (Shiji, Huainanzi, Jingchu Suishi Ji, etc.) over modern secondary sources.
- The Nian beast (年獸) story is a **20th-century invention** (earliest: 1933). Never present it as ancient tradition.

### 2.2 Technical Identity

- **i18n pattern:** Three-block `<div class="lang-en/tc/sc">` with build-time stripping in `eleventy.config.js` `eleventy.after` hook.
- **noI18n pattern:** Pages without Chinese translations must set `noI18n: true` in frontmatter. This: (a) emits `<!-- no-i18n -->` marker instead of hreflang tags, (b) skips zh-hant/zh-hans variant generation, (c) excludes from sitemap language entries. Always check for lang-tc/lang-sc blocks before deciding.
- **Git config:** user.email `kiki.shmoo@gmail.com`, user.name `Kiki Shmoo`.
- **Build command:** `npx @11ty/eleventy` — always verify build succeeds before committing.
- **JS bundling:** esbuild (ES modules → single IIFE bundle). CSS: esbuild (43 CSS modules → single minified bundle).
- **GA4 event pattern:** `track()` helper inside DOMContentLoaded; direct `if (window.gtag)` guards in standalone IIFEs.
- **Never commit** `.env`, credentials, API keys, or PATs to the repo.

### 2.3 Content Standards

- British English spelling throughout (colour, honour, organise, etc.).
- Pinyin with tone marks on all Chinese terms at first mention.
- Chinese characters in `<span class="chinese-char">` wrappers.
- Pinyin in `<span class="pinyin">` wrappers.
- HTML entities for accented characters (not raw UTF-8 diacritics in source).
- All articles use the `layouts/article.njk` layout.
- FAQ items go in YAML frontmatter `faq:` array (rendered by template).

---

## 3. Strategy Rules (Tier 2 — Review Quarterly)

Current project direction. Stable for months but may shift based on data.

- **Content calendar:** See `src/_data/contentCalendar.json` for queued articles and deadlines.
- **Revenue model (updated 2026-03-17):**
  - **Primary new initiative:** Automated BaZi PDF report generation — templated reports assembled from pre-written sections per user's birth data. $5–$9 per download. Zero marginal cost per sale. Converts existing free BaZi calculator traffic into revenue.
  - **Secondary new initiative:** Automated Compatibility PDF reports — same model, $3.99–$7.99 per download, built from existing 78 compatibility pair page content.
  - **Existing channels (retain):** Gumroad digital products ($3.99–$19.99), AdSense, Amazon Associates (27 products), premium manual readings ($29–$149 via PayPal), Beehiiv newsletter → funnel.
  - **Future plays (medium-term):** Directory lead-gen expansion (scrape + enrich → sell consultation leads to practitioners), embeddable BaZi API widget for third-party sites.
  - **Guiding principle:** Prioritise passive, automated revenue over content-treadmill models (subscriptions, paid newsletters). Write templates once, sell forever.
  - **Research basis (2026-03-17):** Strategy informed by two YouTube analyses — (1) "Claude Code built me a $273/Day online directory" (AI-curated directory + lead-gen model) and (2) "'Stupid Simple' Apps Are Making Millions" (clone existing SaaS, give away free tool, monetise backend). Both models validated the approach of converting free tools into revenue via automated reports rather than pursuing subscriptions or content treadmills.
- **Translation status:** All encyclopaedia pages and zodiac profiles now have full TC/SC parity (completed 2026-03-09). Remaining: 16 long-form articles are English-only (flagged with `noI18n: true` to prevent duplicate zh-hant/zh-hans variants). 121 year pages are also English-only (`noI18n: true`).
- **SEO architecture:** Pillar-cluster model. Hub pages → sub-pages. 78 compatibility pair pages for long-tail.
- **Cross-sell:** `content-upgrade.njk` (email capture) + `cross-sell.njk` (product/reading CTA) on all article-layout pages.
- **TODO roadmap:** See `TODO.md` for prioritised task list with effort/impact matrix.

---

## 4. Regressions — "Never Again" List

> Every item below is a real mistake that happened. Each entry = one rule to prevent recurrence. This list is loaded every session.

| # | Date | What Happened | Rule |
|---|------|---------------|------|
| 1 | 2026-03-08 | Agent tried `src/js/site.js` but actual path is `src/site.js` | Always verify file paths with `ls` or `glob` before editing. The main JS file is `src/site.js`, not `src/js/site.js`. |
| 2 | 2026-03-09 | "Lunar New Year" appeared in editorial voice after article drafting | Every new article must be audited for "Lunar New Year" in editorial voice before commit. The term is only permitted in SEO keywords, VANK reporting, and direct quotes. |
| 3 | 2026-03-08 | Newsletter popup got stuck on "Subscribing..." with no error feedback | All async UI operations must have: (a) loading state, (b) success state, (c) error state with recovery. Never leave users in a dead-end loading state. |
| 4 | 2026-03-05 | BaZi calculator had innerHTML XSS vulnerability | Never use `innerHTML` with user-supplied data. Use `textContent` or sanitise first. |
| 5 | 2026-03-08 | Language toggle showed English content when navigating between pages on TC/SC | Language detection must derive from URL path (`/zh-hant/`, `/zh-hans/`), not localStorage. Nav links must be rewritten to preserve language prefix. |
| 6 | 2026-03-16 | BaZi upstream service (zhouyi.cc) changed CSS class `bazilist` → `bazilist1`, breaking parser silently | Upstream HTML scrapers are fragile. Use defensive regex (e.g. `bazilist1?`) and always validate that parsed pillars are non-empty before returning results. Monitor upstream format changes. |
| 7 | 2026-03-16 | FAQ items rendered empty in TC/SC when no translations existed — English text wrapped in `lang-en` spans got stripped by i18n build | When content may lack translations, only wrap in `lang-en` spans when alternative language content exists. Untranslated content must render as plain text to survive i18n stripping. |

---

## 5. Temporary Attention Points

> Time-boxed items that need special focus during a specific period. Remove when resolved.

| Focus | Content | Set Date | Expiry | Remove When |
|-------|---------|----------|--------|-------------|
| Facebook Pixel | Installed 2026-03-09. Pixel ID: 1461477519098003. Verify events are firing in Meta Events Manager. | 2026-03-09 | 2026-04-06 | Verified 500+ PageView events in Events Manager |
| Automated BaZi PDF reports | **CRITICAL new revenue initiative.** Build server-side PDF generation from BaZi calculator output. Template-based, zero marginal cost per sale. See TODO.md for full spec. | 2026-03-10 | 2026-05-10 | PDF report system live and processing sales |
| FAQ translation backlog | **NEARLY COMPLETE 2026-03-19.** Encyclopaedia/hub pages (23), zodiac animal pages (12), readings pages (12), and article pages (16) ALL DONE. Only remaining: `eleventyComputed.js` autoFaq function (English-only). | 2026-03-15 | 2026-04-15 | All FAQ items have TC/SC translations site-wide |
| Technical audit follow-ups | **2026-03-18 audit completed.** All HIGH-priority items resolved 2026-03-20: CSP meta tag, `npm audit` in CI, `prefers-color-scheme`, BaZi date validation, security.txt, rate limiting on BaZi Worker. CSP refined 2026-03-24 (AdSense sub-resources). Rate limiting upgraded to dual-layer (in-memory + KV) 2026-03-24. ~~**Remaining:** Zero test coverage (no automated tests).~~ **RESOLVED 2026-03-27:** 40 vitest tests now gated in CI via `deploy.yml` test job. | 2026-03-18 | 2026-05-18 | All HIGH-priority audit items resolved |
| CI/CD Phase 5 | **2026-03-27:** `deploy.yml` restructured into 4 jobs: test → build → deploy-pages + deploy-worker. Tests gate all deployments. Worker auto-deploys via `CLOUDFLARE_API_TOKEN` secret. Verify first workflow run succeeds after push. | 2026-03-27 | 2026-04-10 | First successful 4-job workflow run confirmed |
| Data layer (Phase 6) | **2026-03-27 architecture review:** No persistent database. Revenue-critical data (directory, shop, report templates, transactions) needs Cloudflare D1. R2 needed for PDF reports. See `docs/architecture.md` Section 11 and `docs/architecture-redesign.md` Phase 6. Items J + K in TODO. | 2026-03-27 | 2026-06-27 | D1 tables created and first API endpoint live |
| Industrial-standard backend controls | **2026-03-27 onboarding audit:** Add repository layer pattern for D1, migration SOP, OpenAPI contract, and birth-data retention/deletion policy before paid-report scale. See `docs/onboarding-audit-2026-03-27.md` and TODO items L/M/N/O. | 2026-03-27 | 2026-05-27 | D1 migrations + OpenAPI + governance SOP merged |

---

## 6. Key File Locations

| Purpose | Path |
|---------|------|
| Main JS (entry) | `src/js/main.js` (esbuild bundles → `_site/site.js`) |
| Main JS (legacy) | `src/site.js` (monolithic, superseded by `src/js/`) |
| JS features | `src/js/features/*.js` (12 feature modules) |
| JS data | `src/js/data/*.js` (zodiac, lichun, compatibility, figures) |
| JS utils | `src/js/utils/*.js` (sanitise, base-path), `src/js/analytics.js` |
| Main CSS (entry) | `src/css/main.css` (esbuild bundles → `_site/styles.css`) |
| CSS tokens | `src/css/tokens/*.css` (colors, typography, spacing, shadows, animations) |
| CSS components | `src/css/components/*.css` (21 component files) |
| CSS themes | `src/css/themes/*.css` (dark, auto-dark) |
| Main CSS (legacy) | `src/styles.css` (monolithic, superseded by `src/css/`) |
| Base template | `src/_includes/layouts/base.njk` |
| Article layout | `src/_includes/layouts/article.njk` |
| Hero partial | `src/_includes/partials/hero.njk` |
| Site data | `src/_data/site.json` |
| Zodiac year data | `src/_data/zodiacYears.js` |
| Content calendar | `src/_data/contentCalendar.json` |
| Build config | `eleventy.config.js` |
| CI/CD | `.github/workflows/deploy.yml` |
| Architecture docs | `docs/architecture.md` |
| Architecture redesign | `docs/architecture-redesign.md` |
| Content strategy | `docs/content-strategy.md` |
| SEO docs | `docs/seo-performance.md` |
| TODO roadmap | `TODO.md` |
| Changelog | `CHANGELOG.md` |
| Worker config | `wrangler.jsonc` (root — deploys `worker/index.js`) |
| Worker entry | `worker/index.js` (router + middleware wiring) |
| Worker legacy | `worker/bazi-worker.js` (monolithic, superseded by modular structure) |
| Worker legacy config | `worker/wrangler.toml` (superseded by root `wrangler.jsonc`) |

---

## 7. Documentation Requirements

After completing any task, update the relevant documents:

1. **CHANGELOG.md** — Every code/content change gets a dated entry with author, description, and files changed.
2. **TODO.md** — Mark completed items with strikethrough. Add new items as discovered.
3. **This file (CLAUDE.md)** — Add new regressions to Section 4 when mistakes occur. Update Tier 2 rules when strategy changes. Remove expired Temporary Attention Points.
4. **Prediction log** (`docs/prediction-log.md`) — Before major decisions, record your prediction and rationale. Fill in actual results after.
5. **Contradiction log** (`docs/contradiction-log.md`) — When encountering conflicting instructions, record and resolve here rather than silently choosing.
