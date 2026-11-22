# Paid report access controls — 2026-11-21

## Scope
This PR is a security hardening change for the Cloudflare Worker and its PayPal-based digital PDF checkout flow. No physical goods, video, live consultations or chat services are introduced.

## Controls
- Disable public `POST /v1/reports` to prevent bypassing checkout and generating a paid PDF for free.
- Generate a cryptographically random per-order checkout claim; store only its SHA-256 hash in D1. The browser receives the clear claim at checkout creation and retains it in the payment flow.
- Require matching checkout claim, product slug and a locally created transaction before attempting capture.
- Validate report inputs before capture and verify PayPal's captured amount, currency and order ID against the locally priced transaction.
- Persist paid state before PDF fulfilment so failed fulfilment can be retried without an automatic second capture.
- Require a paid transaction and valid claim for report status and PDF download; load the PDF using an authenticated fetch rather than exposing a token in the URL.
- Allow multiple separate purchasers of identical, deduplicated report content to access their report with their own checkout claim.
- Keep the dependency audit as a mandatory gate for Worker deployment; allow review-only PR CI and save audit evidence.

## Deployment gate (do not deploy prematurely)
1. Apply migration `202611210100_checkout_claim_tokens.sql` to the **remote D1 database** before deploying this Worker.
2. **Dependency audit gate cleared on review branch:** `npm audit --audit-level=high` passes after upgrading Node 24, Eleventy Image v7.1.1, esbuild v0.28.2, and compatible dependencies. Do not bypass this gate on main.
3. Run all GitHub CI checks; test PayPal sandbox create/capture, duplicate capture, mismatch rejection, report download, and failure/retry before production.
4. Coordinate the frontend and Worker release; older frontend checkout sessions cannot use the changed protocol after the Worker is deployed.
5. **Pre-existing order data:** old `transactions` records have no checkout claim and cannot pass new report access checks. Customer support must reconcile prior orders through a secure manual process; do not grant blanket unauthenticated access.
6. **Open issue:** a buyer whose tab is closed loses the in-memory claim, so a verified email-based secure recovery flow is required before broad launch. Do not include the claim in analytics, URLs or customer-service logs.
7. **Open issue:** synchronous generation, report-job deduplication of failed jobs, and capture/network concurrency need additional reliability testing and recovery design. Neither this PR nor a unit-test pass proves production readiness.

## CI verification (21 November 2026)
- The latest completed PR run passed test, dependency-security audit and Eleventy build checks. GitHub Pages and Worker deployments were deliberately skipped for the PR.
- The temporary GitHub Actions jobs used to regenerate the dependency lockfile were removed and are not part of the proposed merge.
- This is **not** PayPal sandbox certification or a production privacy/security penetration test.

## Outstanding data governance
The separate 30-day retention/deletion policy still requires confirmed scheduled cleanup, authenticated deletion handling and audit records; treat those as launch blockers for personally identifiable birth data.

## Test intent
Negative tests: POST /v1/reports disabled; status and download without token denied; unrelated/malformed token denied; product switching and unknown order denied; mismatched price denied.
Positive tests: purchase claim creation, already-paid retry without recapture, valid paid download, unique checkout claim generation.


## Scheduled retention implementation (draft PR; not deployed)
- Added a daily 03:00 UTC Worker cron for bounded 30-day cleanup (up to 1,000 raw jobs and 1,000 report objects per invocation).
- Raw birth inputs and error text in `report_jobs` are redacted 30 days after creation.
- PDF objects are deleted 30 days after completion or creation fallback, and R2 deletion must succeed before the corresponding D1 reference is cleared.
- `retention_cleanup_runs` records counts, outcome, and cutoff timestamps without copying birth data or transaction details. Accounting rows are retained.
- Partial failures are recorded and surfaced to Worker observability for remediation; job IDs and request payloads are not printed.
- **Unverified:** Production schedule, live D1/R2 expiry, alert delivery, access audit, user-requested deletion, and prior over-retention cleanup. Do not mark these operationally complete until Cloudflare validation.
- Require both migrations `202611210100_checkout_claim_tokens.sql` and `202611210200_retention_audit.sql` before Worker deployment. This branch has not run any remote migrations.
- Read-only `Security Release Preflight` workflow added for future manual use once present on the default branch.
