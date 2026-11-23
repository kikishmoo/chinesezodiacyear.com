# CEO onboarding delta audit — 2026-11-20

**Scope:** Read-only GitHub inventory and selected code/docs review, plus public homepage/search checks. **Not** a penetration test, complete code review, local test run, payment transaction, or access to GA4/GSC/PayPal/Cloudflare consoles. Findings below describe visible code and repository state; production status must be confirmed separately.

## Executive conclusion
Preserve the Eleventy + GitHub Pages + Cloudflare Worker + D1/R2 low-cost architecture. The April 2026 implementation already contains paid BaZi and compatibility PDF checkout components. **Security and end-to-end verification precede revenue launch or growth spend.** Do not rebuild or buy new infrastructure before validating existing assets.

## Critical / P0 — verify and remediate before enabling paid traffic

1. **Unauthorised report creation:** `worker/index.js` publicly registers `POST /v1/reports`; `worker/routes/report.js:handleCreateReport` calls `requestReport` without a purchase/entitlement check. `worker/services/report-service.js` renders and stores a PDF. This appears to permit free generation of nominally paid report templates and imposes potentially avoidable compute/storage costs. Require server-verified purchase entitlement (or authenticated internal service role) before generation; remove or restrict the public direct route. Add negative and positive authorisation tests.
2. **Report access control:** `GET /v1/reports/:jobId` and `GET /v1/reports/:jobId/download` appear to lack explicit customer/session/entitlement verification. UUID opacity is not authorisation. Scope each report to an approved purchaser or short-lived signed delivery token, with expiry and no sensitive metadata leakage.
3. **Payment-state robustness:** `worker/routes/checkout.js` captures payment before report input validation/generation, and relies on follow-on job creation to update the local transaction. If report validation/generation fails, reconciliation and customer recovery require special care. Validate inputs and selected product before capture; persist captured payments durably, add reliable retry and fulfilment/reconciliation paths, check order amount/currency/template association server-side, and exercise sandbox scenarios for replays, mismatched inputs, failures and double capture.
4. **Birth-data retention enforcement:** `docs/birth-data-governance-policy.md` sets 30-day raw-data and report retention but lists scheduled deletion, access audit and deletion tooling unchecked. Confirm implementation and test it before taking real customer birth data.

The above are **code-review findings, not evidence of a demonstrated live exploit**. Do not test production with personal information or real charges without a controlled plan.

## High-priority current-state discrepancies

- `docs/onboarding-audit-2026-03-27.md` still says there is no D1 database, migration process, or OpenAPI specification. Subsequent `wrangler.jsonc`, `migrations/*`, and `docs/openapi/worker-v1.openapi.json` contradict that historical snapshot. Preserve that audit as historical; use this delta as the current working baseline.
- `TODO.md` still has March–June 2026 planning deadlines. `CLAUDE.md` attention items expired May–June 2026. Verify remaining work and move to a new operating period, without treating stale statuses as fresh confirmations.
- `src/_data/contentCalendar.json` currently has 11 published / 6 queued entries; some target dates are in the past. Cross-check queue against actual article paths before changing statuses.
- `README.md` contains earlier architectural descriptions and page counts; verify generated output in CI instead of assuming the stated counts are current.
- Workflow uses `actions/checkout@v4`, `actions/setup-node@v4` and Node 20; review supported runtimes, action upgrade plans, CI status and dependency audit before changes.

## Editorial, SEO/GEO and commercial baseline

- Valuable differentiated positioning: pre-Qing-first scholarship, English / Traditional Chinese / Simplified Chinese pages, classical calendar and zodiac tools. Include later history when explicitly labelled, as the owner requires.
- Maintain primary-source citations by work, passage, original Chinese and translation; separate historical attestation from later folklore, current belief and entertainment. For disputed attributions, record uncertainty, including text date and provenance.
- Verify canonical/hreflang, indexing, Web Vitals, structured data and Search Console performance; sitemap and robots files are present in source, but their live endpoints were not validated by this audit. `llms.txt` is discoverability aid, not a ranking guarantee.
- Existing BaZi $8.99 and compatibility $4.99 report code is the low-CAPEX monetisation hypothesis; verify checkout/delivery, refunds and economics before spending on ads or building more products.
- Do not assume existing directory entries are verified current businesses or that payment/analytics services are production active without operational evidence.

## Next 14 days (recommended sequence)

1. **Security + QA:** restrict unpaid creation and report access; add entitlement, isolation, replay and payment-failure tests; verify data-retention implementation.
2. **Controlled smoke tests:** CI tests/build, PayPal sandbox purchase/capture, PDF generation and download, transaction recovery, D1/R2 bindings, email/support channel; no production payments until approved.
3. **Measurements:** obtain consented, least-privilege read access to GA4, Search Console, PayPal and hosting metrics; baseline organic clicks, sessions, checkout starts, paid orders, refund rate, revenue, hosting expenditure, and privacy/deletion operations.
4. **Editorial operations:** select a small backlog of source-checked evergreen pieces and seasonal updates; include English + Chinese editorial reviews, culture/period/source attestations and accessibility/SEO checklist.
5. **Commercial decision gate:** only then select a single product funnel experiment and directory partnership validation pilot.

## Operating model and decision rights

CEO orchestration covers research, classical-source SME review, English/Chinese editorial, proofreading/translation, web and UX, code review, QA, data governance, SEO/GEO, product, marketing and business development as distinct review passes. These are workstreams, **not a claim of autonomous staffed agents or unattended work**.

Owner/board approves: spend, production deployments, privacy/legal policy, payment configuration, new external accounts, and material positioning changes. Reversible documentation and draft PRs may be prepared without deployment. Keep changes small, tested, auditable and reviewable.

## Verification log

- Confirmed in repo: 368 file entries from recursive tree (including the directories excluded from file count by type filtering), 12 direct `docs/` files, D1/R2 bindings declared, checkout/report routes, CI, content calendar and editorial rules. The 368 figure refers to blobs/files counted during inventory, not generated web pages.
- Public homepage accessible and recent search-engine crawl results show indexed content. No access to revenue metrics or web console dashboards; no tests run locally.
- Update this document after verified CI, checkout and telemetry results. Avoid representing repository configuration as operational proof.
