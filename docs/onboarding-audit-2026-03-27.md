# Onboarding Audit — Business & Architecture Baseline

> **Date:** 2026-03-27  
> **Author:** Cody (CEO agent team)  
> **Scope:** Quick onboarding audit of product, architecture, data layer, SEO/GEO readiness, and business-operating baseline.

---

## 1) Executive Summary

The project has moved from a fragile monolith to a strong modular baseline (frontend + worker + CI). The highest-risk structural gap is still **data persistence**: there is no production database for revenue-critical workflows (PDF report inventory, transactions, directory lead lifecycle, CRM metadata). The fastest path to low-capital monetisation is to ship **automated BaZi/compatibility report sales** on top of D1 + R2, while preserving static content SEO velocity.

---

## 2) Current Strengths (Keep and Exploit)

1. **Strong content moat**: trilingual + pre-Qing-first positioning is differentiated.
2. **Modern delivery pipeline**: test-gated CI, modular JS/CSS, resilient worker stack.
3. **SEO/GEO foundations already present**: broad topical surface area, llms.txt, rich internal linking potential.
4. **Low-CAPEX stack fit**: Eleventy + Cloudflare Worker + GitHub Pages is cost-efficient.


## 2.1 Evidence Reviewed During Onboarding

The audit was based on the currently implemented code and docs, with direct inspection of:

- Worker entry/router/middleware wiring (`worker/index.js`, `worker/router.js`, `worker/middleware/*`).
- Service/adapters/models contracts (`worker/services/*`, `worker/adapters/*`, `worker/models/*`).
- Cloudflare runtime config (`wrangler.jsonc`).
- CI gates and deployment dependencies (`.github/workflows/deploy.yml`).
- Strategic and architecture docs (`CLAUDE.md`, `TODO.md`, `docs/architecture.md`, `docs/architecture-redesign.md`).

This makes the recommendations implementation-linked (not generic).

---

## 3) Quick Architecture Audit (Industrial-Standard Lens)

### 3.1 What already meets good practice

- Modular worker with router, middleware, service, adapter, model separation.
- Error typing, retry and circuit breaker resilience.
- Test suite integrated into CI gates.
- Backwards-compatible route alias (`POST /`) retained during migration.

### 3.2 Remaining gaps to reach industrial baseline

1. **No persistent OLTP layer** for runtime business data (must add D1).
2. **No migration framework/process** documented for schema evolution.
3. **No authN/authZ layer** documented for future admin routes.
4. **No explicit OpenAPI contract** for public/partner endpoints.
5. **No SLO/SLI runbook** (availability/error budget, incident handling, rollback).
6. **No transaction/event model** for purchases, report generation status, refunds.
7. **Data governance controls incomplete** (retention/deletion policy for personal birth data).


### 3.3 Industrial-Standard Scorecard (Current)

| Domain | Score | Status |
|---|---:|---|
| API modularity (router/service/adapter/model) | 8/10 | Strong baseline live |
| Reliability patterns (retry/circuit/cache/rate-limit) | 8/10 | Implemented for current BaZi path |
| CI/CD quality gates | 8/10 | Tests + audit + build + dual deploy jobs |
| Data persistence architecture | 3/10 | D1/R2 planned, not operational |
| Contract governance (OpenAPI/versioning discipline) | 4/10 | Versioned routes exist, spec missing |
| Security + compliance for personal data | 4/10 | Guardrails partial, retention/deletion policy missing |
| Observability + operations runbook | 4/10 | Basic logs available, no formal SLO/incident model |

**Overall:** 5.6/10 production maturity for a monetising data product. Infrastructure is solid; governance/data-plane work is now the bottleneck.

---

## 4) Database & Backend Organisation Recommendations

### 4.1 D1 schema priorities (phase order)

- `report_templates`
- `transactions`
- `report_jobs`
- `directory_listings`
- `directory_leads`
- `products`

### 4.2 Backend layering standard

- **router**: HTTP contract only.
- **service**: business rules, idempotency, orchestration.
- **repository**: D1 SQL only (no business logic).
- **model/schema**: runtime validation + response shaping.
- **events**: analytics + audit log emission at service boundary.

### 4.3 Operational guardrails

- Add request IDs, structured logs, and per-route latency/error metrics.
- Add idempotency keys for payment webhooks/report generation.
- Add dead-letter/retry policy for failed report jobs.

---

## 5) Minimum-Fund Business Execution Plan (Next 30 Days)

### Week 1
- Finalise report product specs (BaZi + compatibility) and template matrix.
- Stand up D1 + R2 and seed initial template data.
- Implement transaction + job status tables.

### Week 2
- Launch paid BaZi report endpoint (MVP PDF output).
- Add checkout flow and post-payment fulfilment.
- Add conversion analytics and revenue dashboard queries.

### Week 3
- Launch compatibility report product.
- Add directory lead capture and lead routing workflow.
- Implement weekly KPI review cadence.

### Week 4
- Start GEO-focused publishing cadence (daily incremental updates).
- Improve category hubs for internal-link authority flow.
- Run first conversion optimisation pass on CTA blocks.

---

## 6) Team-of-Teams Operating Model (Agent Execution)

- **Research + SME (Chinese history/culture):** source validation, pre-Qing integrity review.
- **English/Chinese copy + translation + proofreading:** trilingual publishing pipeline.
- **Web dev + design + UI/UX + QA + audit:** feature shipping with quality gates.
- **Data governance + SEO + GEO:** metadata, schema, crawlability, LLM discoverability.
- **Marketing + product + business development:** demand capture, partnership directory growth, monetisation experiments.

---

## 7) Decisions Needed from Board (User)

1. Payment rail priority for MVP: Stripe vs Gumroad checkout flow.
2. Jurisdiction/privacy baseline for report data retention (default recommendation: minimise + auto-delete).
3. Directory monetisation model priority: per-lead fee vs subscription.

---

## 8) Success Metrics (first 60 days)

- Report purchase conversion rate from calculator traffic.
- Revenue per 1,000 calculator sessions.
- Lead-to-booked-consultation rate for directory listings.
- Indexed pages growth and non-brand organic clicks.
- GEO discoverability checks in major AI answer engines.

