# Worker repository layer (Item O)

This folder owns all D1 SQL for the Worker backend.

## Rule

- `worker/services/*` must not contain raw SQL.
- All SQL lives in `worker/repositories/*`.
- Services orchestrate business logic and call repositories.

## Current scaffolding

- `db-context.js` — canonical D1 binding resolver (`env.DB`).
- `report-template-repository.js` — read report templates.
- `report-job-repository.js` — create/update report jobs.
- `transaction-repository.js` — persist payment transactions.
- `directory-lead-repository.js` — persist practitioner leads.

## Next step

Wire upcoming `/v1/bazi/report` and webhook routes to these repositories.
