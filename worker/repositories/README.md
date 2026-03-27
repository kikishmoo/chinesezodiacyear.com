# Worker Repository Layer (Phase 6 Step 3)

This directory owns **all SQL queries** for Worker runtime data access.

## Rule

- `worker/services/*` must not execute SQL directly.
- Use repository modules in this folder for D1 access.
- SQL boundary is CI-enforced via `npm run infra:boundaries:check`.

## Current repositories

- `report-templates-repository.js`
- `report-jobs-repository.js`
- `db-client.js`

Use `index.js` to construct repository dependencies from `env`.
