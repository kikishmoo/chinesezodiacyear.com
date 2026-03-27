# D1 migration workflow bootstrap (Item L)

## Naming convention

Migration files must follow:

`YYYYMMDDHHMM_description.sql`

Examples:
- `202603271300_phase6_initial_schema.sql`
- `202604011030_add_report_job_retry_count.sql`

## Write rules

1. One logical change per migration file.
2. Migrations are append-only (never edit previously merged migration files).
3. Always add explicit indexes for expected query patterns.
4. Use `CHECK` constraints for status enums where possible.

## Apply commands

Set your D1 database binding name once per shell:

```bash
export D1_DATABASE_BINDING=DB
```

Then run:

```bash
npm run infra:migrations:check
npm run infra:migrations:apply:local
npm run infra:migrations:apply:remote
```

## Rollback SOP (until down-migrations are introduced)

D1 uses forward-only migrations by default. For rollback:

1. Create a new corrective migration (preferred).
2. If an emergency destructive rollback is unavoidable:
   - restore from Cloudflare backup/snapshot,
   - apply the last known-good migration set,
   - verify row counts and critical query smoke tests.
3. Record incident + corrective migration in `CHANGELOG.md`.
