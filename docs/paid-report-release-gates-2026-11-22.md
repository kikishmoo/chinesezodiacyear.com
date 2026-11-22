# Paid digital report release gate — 2026-11-22

## Current state (verified from GitHub)
- **D1 production schema:** Both security migrations `202611210100_checkout_claim_tokens.sql` and `202611210200_retention_audit.sql` were applied and verified in successful GitHub Action run [45054555404](https://github.com/kikishmoo/chinesezodiacyear.com/actions/runs/45054555404). Reapply neither migration.
- **Source candidate:** Draft PR #21, rebased on post-migration `main`. PR #13 is superseded by this clean branch and must not be merged.
- **Sandbox no-charge OAuth/order smoke:** Standalone, manual-only workflow `PayPal Sandbox Order Smoke Test (No Capture)` merged in PR #20. Requires repository Actions secrets `PAYPAL_SANDBOX_CLIENT_ID` and `PAYPAL_SANDBOX_CLIENT_SECRET`. Never use live credentials for that workflow. It tests sandbox OAuth and creation/GET of unapproved $8.99 and $4.99 orders only, never captures charges.
- **No sandbox API execution has been confirmed** and **no PayPal purchase, capture, refund or real-customer end-to-end verification has been conducted** as of this document.

## Release stop conditions
1. Manually run no-charge sandbox smoke from `main`; inspect OAuth/order results. An OAuth+create/GET pass is not evidence capture/fulfilment works.
2. Prepare separate isolated sandbox Worker/D1/R2 environment, **not** production bindings. Ensure PayPal sandbox credentials and mode, and test approved sandbox buyer flow, server-side capture, report rendering and authenticated download with synthetic birth data.
3. Test declines, retries, duplicate capture, wrong amount, unknown order, wrong product, expired/invalid claims, missing or expired reports, and two buyers with identical inputs.
4. Implement and test **customer recovery after losing browser-held checkout token**; don't assume a closed tab can restore the token. Avoid putting secret claims in URLs, query strings, analytics, logs, or plaintext email.
5. Verify R2 30-day expiry and D1 redaction in sandbox with controlled synthetic records. Verify any request-driven deletion flow and alerting separately.
6. Review simultaneous frontend/Worker release impact, cancellation/refund escalation and customer support communications. **The main branch deploys automatically upon merge**, so release PR #21 must stay a draft until all gates pass.
7. Confirm successful PR #21 CI, dependency audit and build. Do not weaken security audit gate to force deployment.

## Release workstreams
- **Engineering/QA:** integration environment and PayPal sandbox approved-order capture test.
- **Data governance:** retention and deletion integration tests, access audit plan.
- **Customer operations:** secure order recovery and support escalation.
- **CEO/board decision:** approve production merge only when evidence is collected and risks are accepted.

## Scope
Only static, written digital PDF reports are delivered. No video, livestream, live chat or telephone consultation is included. No new recurring expenses approved.
