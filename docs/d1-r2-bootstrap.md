# D1 + R2 Bootstrap Runbook (Phase 6 — Step 1)

> Goal: provision Cloudflare D1 + R2 resources required for revenue data persistence.

## 1) Prerequisites

- Wrangler CLI installed (`npm ci` in repo root).
- Cloudflare account with permissions for D1 and R2.
- Authenticated CLI (`npx wrangler login` or API token with proper scopes).

## 2) Provision resources

### Option A — Scripted

```bash
npm run infra:bootstrap
```

Optional custom names:

```bash
./scripts/bootstrap-d1-r2.sh czy-main czy-reports
```

The script intentionally runs the repository-local Wrangler binary via `npx --no-install wrangler` (no global PATH dependency).

### Option B — Manual

```bash
npx wrangler d1 create czy-main
npx wrangler r2 bucket create czy-reports
```

## 3) Update `wrangler.jsonc`

After creation, wire bindings into `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "czy-main",
      "database_id": "<D1_DATABASE_ID>"
    }
  ],
  "r2_buckets": [
    {
      "binding": "REPORTS_BUCKET",
      "bucket_name": "czy-reports"
    }
  ]
}
```

## 4) Verify

```bash
npx wrangler d1 list
npx wrangler r2 bucket list
```

## 5) Migration bootstrap (Step 2)

After binding D1 in `wrangler.jsonc`, run the migration workflow:

```bash
export D1_DATABASE_BINDING=DB
npm run infra:migrations:check
npm run infra:migrations:apply:local
npm run infra:migrations:apply:remote
```

Migration naming rules and rollback SOP are documented in `migrations/README.md`.

## 6) Scope note

This runbook intentionally covers **infrastructure provisioning** (Step 1).
Migration workflow (Step 2) and repository boundary scaffold (Step 3) are now in-repo; OpenAPI contract + governance controls remain subsequent steps.
