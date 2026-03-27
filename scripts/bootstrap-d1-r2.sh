#!/usr/bin/env bash
set -euo pipefail

# Phase 6 — Step 1 infrastructure bootstrap
# Creates Cloudflare D1 + R2 resources for revenue data plane.

DB_NAME="${1:-czy-main}"
BUCKET_NAME="${2:-czy-reports}"

if ! command -v npx >/dev/null 2>&1; then
  echo "[error] npx is not available. Run: npm ci"
  exit 1
fi

if ! npx --no-install wrangler --version >/dev/null 2>&1; then
  echo "[error] local Wrangler CLI not found. Run: npm ci"
  exit 1
fi

WRANGLER=(npx --no-install wrangler)

echo "[info] Checking Wrangler authentication..."
if ! "${WRANGLER[@]}" whoami >/dev/null 2>&1; then
  echo "[error] Wrangler is not authenticated. Run: npx wrangler login"
  exit 1
fi

echo "[step] Creating D1 database: ${DB_NAME}"
"${WRANGLER[@]}" d1 create "${DB_NAME}"

echo "[step] Creating R2 bucket: ${BUCKET_NAME}"
"${WRANGLER[@]}" r2 bucket create "${BUCKET_NAME}"

echo "[next] Copy returned IDs into wrangler.jsonc"
echo "[next] Use docs/d1-r2-bootstrap.md for exact binding snippets"
