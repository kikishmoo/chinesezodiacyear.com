# CLAUDE.md — Agent Boot File for chinesezodiacyear.com

> **Purpose:** This file is loaded at the start of every agent session. It contains rules, preferences, regressions, and context that must persist across conversations.
> **Last updated:** 2026-03-09
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
- **Git config:** user.email `kiki.shmoo@gmail.com`, user.name `Kiki Shmoo`.
- **Build command:** `npx @11ty/eleventy` — always verify build succeeds before committing.
- **JS minification:** terser (post-build). CSS: clean-css.
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
- **Revenue model:** Gumroad digital products ($3.99–$19.99), AdSense, Amazon Associates, Beehiiv newsletter → premium readings funnel.
- **Translation priority:** English first, then TC/SC. Three remaining encyclopaedia pages need translation (Yi Jing, Tea Culture, Qi Men Dun Jia).
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

---

## 5. Temporary Attention Points

> Time-boxed items that need special focus during a specific period. Remove when resolved.

| Focus | Content | Set Date | Expiry | Remove When |
|-------|---------|----------|--------|-------------|
| Facebook Pixel | TODO item #1 — CRITICAL priority, not yet installed | 2026-03-09 | 2026-04-06 | Pixel is installed and verified |
| Translation backlog | 3 encyclopaedia pages need TC/SC: Yi Jing, Tea Culture, Qi Men Dun Jia | 2026-03-09 | 2026-04-15 | All 3 pages translated |

---

## 6. Key File Locations

| Purpose | Path |
|---------|------|
| Main JS | `src/site.js` |
| Main CSS | `src/styles.css` |
| Base template | `src/_includes/layouts/base.njk` |
| Article layout | `src/_includes/layouts/article.njk` |
| Hero partial | `src/_includes/partials/hero.njk` |
| Site data | `src/_data/site.json` |
| Zodiac data | `src/_data/zodiac.json` |
| Content calendar | `src/_data/contentCalendar.json` |
| Build config | `eleventy.config.js` |
| CI/CD | `.github/workflows/deploy.yml` |
| Architecture docs | `docs/architecture.md` |
| Content strategy | `docs/content-strategy.md` |
| SEO docs | `docs/seo-performance.md` |
| TODO roadmap | `TODO.md` |
| Changelog | `CHANGELOG.md` |
| Worker config | `wrangler.jsonc` (root — deploys `worker/bazi-worker.js`) |
| Worker source | `worker/bazi-worker.js` |
| Worker legacy config | `worker/wrangler.toml` (superseded by root `wrangler.jsonc`) |

---

## 7. Documentation Requirements

After completing any task, update the relevant documents:

1. **CHANGELOG.md** — Every code/content change gets a dated entry with author, description, and files changed.
2. **TODO.md** — Mark completed items with strikethrough. Add new items as discovered.
3. **This file (CLAUDE.md)** — Add new regressions to Section 4 when mistakes occur. Update Tier 2 rules when strategy changes. Remove expired Temporary Attention Points.
4. **Prediction log** (`docs/prediction-log.md`) — Before major decisions, record your prediction and rationale. Fill in actual results after.
5. **Contradiction log** (`docs/contradiction-log.md`) — When encountering conflicting instructions, record and resolve here rather than silently choosing.
