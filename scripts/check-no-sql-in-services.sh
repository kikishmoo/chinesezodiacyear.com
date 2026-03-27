#!/usr/bin/env bash
set -euo pipefail

SERVICE_DIR="worker/services"

if [ ! -d "$SERVICE_DIR" ]; then
  echo "[check] $SERVICE_DIR not found; skipping"
  exit 0
fi

# SQL should be contained in repositories only.
if rg -n --glob '*.js' '(SELECT|INSERT|UPDATE|DELETE|REPLACE|UPSERT|CREATE TABLE|DROP TABLE|ALTER TABLE|\.prepare\()' "$SERVICE_DIR" >/tmp/sql_hits.txt; then
  echo "[error] SQL-like patterns found in worker/services. Move queries into worker/repositories." >&2
  cat /tmp/sql_hits.txt >&2
  exit 1
fi

echo "[ok] no SQL patterns found in worker/services"
