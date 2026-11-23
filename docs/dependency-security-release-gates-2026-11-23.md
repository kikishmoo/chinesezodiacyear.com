# Dependency security remediation / production deployment safeguard — 2026-11-23

## Evidence
GitHub Actions main workflow run 45072996557: `test=success`, `build=success`, `deploy-pages=success`, `security-audit=failure`, `deploy-worker=skipped`. Earlier run 45072174573 also failed tests; that separate Vitest issue was subsequently corrected in PR #29.

Security audit of main on Node 20 reports **19 vulnerabilities** (1 critical, 15 high, 2 moderate, 1 low). It includes `sharp`, `undici`, `source-map-js`, `vite`, and `ws`. The active main dependency lock includes `@11ty/eleventy-img 6.0.4` and `esbuild 0.27.4`, and its resolved versions include older indirect dependencies.

## Narrow candidate approach
- Copy **only** `package.json` and `package-lock.json` dependency bumps already present in the draft payment security PR #21 into this distinct PR, without any checkout/Worker/application business-logic changes.
- This is a **candidate** snapshot, not proof of vulnerability resolution. Some upgrades are major versions, `@11ty/eleventy-img 7.1.1` requires Node >=22, and the candidate lock has `miniflare 5.20261119.0-beta` as an indirect dependency. Confirm suitability with fresh `npm ci`, `npm audit --audit-level=high`, full tests, static site build and multilingual SEO output check. If the audit or regression checks fail, **do not merge the candidate**.
- Standardize CI on Node 24 to satisfy the supported engine constraints of the upgraded dependencies; existing setup-node@v4 with Node 24 is acceptable, despite GitHub warning that the action's own Node 20 runtime is deprecated.

## Critical Worker deployment safeguard
Existing `deploy-worker` ran automatically after successful `test` plus `security-audit` on any `main` push. That becomes **unsafe as soon as dependency vulnerabilities are fixed**, because the owner has deferred paid-report release and PR #21 remains unmerged.

This PR updates production Worker deployment to require an explicit manual GitHub Actions `workflow_dispatch` invocation from `main`, selecting `deploy_worker=true`. Normal pushes continue to publish tested GitHub Pages static assets without touching Cloudflare Worker or D1. Manual Worker deployments must also pass all tests and high-severity security audit.

**Never click the manual deploy input before completing PayPal sandbox, idempotent capture, recovery, ownership/access, PII retention, and production credentials gates.** This document does not authorize such a release. Existing remote D1 migrations must not be reapplied.

## Release verification checklist
- [ ] High/critical dependency audit returns success with no suppressions
- [ ] Full Vitest suite returns success
- [ ] Static site build + SEO validator return success
- [ ] Workflow shows production Worker gated to manual opt-in on `main`
- [ ] No changes to payment processing, production Worker or Cloudflare schema
- [ ] GitHub Pages deploy succeeds and production Worker job is skipped after merge
- [ ] Retain draft PR #21 unchanged and not merged

## Follow-up
If major dependency upgrades are not compatible or introduce unresolved advisories, split the blockers by package, pin safe stable versions, and validate in a separate PR. Avoid `npm audit --force` without review, suppression, or altering security policy merely to make the workflow green.
