# CLAUDE.md — Agent Boot File for chinesezodiacyear.com

> Loaded at the start of every agent session. Rules, regressions, and context that persist across conversations.
> **Last updated:** 2026-04-09 | **Owner:** kiki.shmoo@gmail.com (Kiki Shmoo)

---

## 1. Project Identity

| Key | Value |
|-----|-------|
| Site | chinesezodiacyear.com — Chinese zodiac encyclopaedia, directory, readings |
| Stack | Eleventy 3.1.2 (ESM) + Nunjucks → GitHub Pages; Cloudflare Worker (BaZi API, reports, checkout) |
| Repo | github.com/kikishmoo/chinesezodiacyear.com |
| GA4 | G-2QWWBEW512 |
| Domain | chinesezodiacyear.com (non-www canonical) |
| Git | user.email `kiki.shmoo@gmail.com`, user.name `Kiki Shmoo` |

---

## 2. Hard Rules (Never Expire)

### 2.1 Editorial

- **Never use "Lunar New Year"** in editorial voice. The Chinese calendar is lunisolar. Use "Chinese New Year" or "Spring Festival". Allowed ONLY in: SEO meta tags, VANK reporting, direct quotes.
- **Historical sources:** Prioritise pre-Qing classical scholarship (Shiji, Huainanzi, Jingchu Suishi Ji). Nian beast (年獸) is a 20th-century invention (earliest: 1933) — never present as ancient.
- **British English** spelling throughout (colour, honour, organise).
- Pinyin with tone marks at first mention. Chinese chars in `<span class="chinese-char">`, pinyin in `<span class="pinyin">`. HTML entities for accented characters.
- FAQ items in YAML frontmatter `faq:` array. All articles use `layouts/article.njk`.

### 2.2 Technical Boundaries

- **i18n:** Three-block `<div class="lang-en/tc/sc">` with build-time stripping. Pages without translations: `noI18n: true` in frontmatter.
- **Build:** `npx @11ty/eleventy` — always verify build succeeds before committing.
- **Bundling:** esbuild (ES modules → IIFE). CSS: esbuild (44 modules → single minified).
- **Worker architecture:** Routes → Services → Repositories. **Services never execute SQL** (CI-enforced via `scripts/check-service-sql-boundary.sh`). All data access via `worker/repositories/`.
- **Security:** Never commit `.env`, credentials, API keys, or PATs. Never use `innerHTML` with user-supplied data. PayPal secrets via `wrangler secret put`.
- **GA4:** `track()` helper inside DOMContentLoaded; direct `if (window.gtag)` guards in standalone IIFEs.

---

## 3. Strategy (Tier 2 — Review Quarterly)

- **Revenue model:** Automated BaZi PDF reports ($8.99/download, zero marginal cost) is the primary initiative. Secondary: Compatibility PDFs ($3.99–$7.99). Existing: Gumroad, AdSense, Amazon Associates, manual readings ($29–$149), Beehiiv newsletter. Principle: passive automated revenue over content treadmills.
- **Translation:** All encyclopaedia + zodiac pages have TC/SC parity. 16 articles + 121 year pages are English-only (`noI18n: true`).
- **SEO:** Pillar-cluster model. 78 compatibility pair pages for long-tail.
- **TODO roadmap:** See `TODO.md` for prioritised tasks with effort/impact matrix.

---

## 4. Regressions — "Never Again" List

| # | What Happened | Rule |
|---|---------------|------|
| 1 | Agent tried `src/js/site.js` but actual path is `src/site.js` | Always verify file paths with `ls` or `glob` before editing. |
| 2 | "Lunar New Year" appeared in editorial voice | Audit every new article for "Lunar New Year" before commit. |
| 3 | Newsletter popup stuck on "Subscribing..." | All async UI: loading state + success state + error state with recovery. |
| 4 | BaZi calculator innerHTML XSS | Use `textContent` or sanitise. Never `innerHTML` with user data. |
| 5 | Language toggle showed English on TC/SC pages | Language detection from URL path (`/zh-hant/`, `/zh-hans/`), not localStorage. |
| 6 | Upstream CSS class change broke parser silently | Defensive regex, validate parsed pillars non-empty. Monitor upstream changes. |
| 7 | FAQ empty in TC/SC — English `lang-en` spans stripped by i18n | Only wrap in `lang-en` when alternative language content exists. |
| 8 | Upstream silently broke true solar time calculation | Never depend on upstream scrapers for core logic. BaZi pillars computed locally via `lunar-javascript`. |

---

## 5. Active Attention Points

> Remove when resolved. See `docs/attention-archive.md` for graduated items.

| Focus | Status | Expiry |
|-------|--------|--------|
| **BaZi PDF report system** | **MVP FEATURE-COMPLETE.** PDF rendering (pdf-lib), PayPal checkout (3 endpoints), frontend Smart Buttons CTA, GA4 conversion tracking (begin_checkout + purchase) all done. Remaining: end-to-end smoke test with PayPal sandbox, template content refinement. | 2026-05-10 |
| **GitHub Actions Node.js 20** | Upgrade `@v4` → `@v5` before 2 June 2026 forced migration. | 2026-06-01 |
| **Data layer (Phase 6)** | D1 `czy-main` + R2 `czy-reports` live. 6 tables, template seeded, PayPal checkout wired. 131 tests. Frontend checkout integration done (Smart Buttons CTA). Remaining: smoke test, template content polish. | 2026-06-27 |
| **Backend controls** | SQL boundary + OpenAPI contract CI-enforced. Birth-data governance documented. Remaining: deletion enforcement, audit-log wiring. | 2026-05-27 |

---

## 6. Key File Locations

### Frontend
| Purpose | Path |
|---------|------|
| JS entry | `src/js/main.js` → `_site/site.js` |
| JS features | `src/js/features/*.js` (12 modules) |
| JS data | `src/js/data/*.js` (zodiac, lichun, compatibility, figures) |
| CSS entry | `src/css/main.css` → `_site/styles.css` |
| CSS tokens/components/themes | `src/css/{tokens,components,themes}/*.css` |
| Base template | `src/_includes/layouts/base.njk` |
| Build config | `eleventy.config.js` |

### Worker (Cloudflare)
| Purpose | Path |
|---------|------|
| Config | `wrangler.jsonc` (D1, R2, KV bindings) |
| Entry + router | `worker/index.js` |
| BaZi routes | `worker/routes/bazi.js` |
| Report routes | `worker/routes/report.js` |
| Checkout routes | `worker/routes/checkout.js` (PayPal create/capture) |
| PayPal service | `worker/services/paypal.js` (OAuth + Orders v2) |
| Report service | `worker/services/report-service.js` |
| PDF renderer | `worker/lib/pdf-renderer.js` (pdf-lib) |
| Repositories | `worker/repositories/*.js` (D1 access layer) |
| OpenAPI spec | `docs/openapi/worker-v1.openapi.json` |

### Ops & Docs
| Purpose | Path |
|---------|------|
| CI/CD | `.github/workflows/deploy.yml` (test → build → deploy) |
| D1 migrations | `.github/workflows/migrate-d1.yml` + `migrations/*.sql` |
| TODO | `TODO.md` |
| Changelog | `CHANGELOG.md` |
| Architecture | `docs/architecture.md`, `docs/architecture-redesign.md` |

---

## 7. Documentation Protocol

After every task, update: (1) **CHANGELOG.md** — dated entry with files changed. (2) **TODO.md** — strikethrough completed items. (3) **This file** — new regressions in Section 4, remove resolved attention points. (4) **Prediction log** (`docs/prediction-log.md`). (5) **Contradiction log** (`docs/contradiction-log.md`).
