#!/usr/bin/env bash
set -euo pipefail

# Guardrail: services should not execute raw SQL.
# SQL must stay in worker/repositories/*.

SERVICE_DIR="worker/services"

if [[ ! -d "${SERVICE_DIR}" ]]; then
  echo "[ok] ${SERVICE_DIR} not found; nothing to check"
  exit 0
fi

# Look for likely SQL execution calls / SQL literals in services.
if rg -n "\.prepare\(|SELECT |INSERT |UPDATE |DELETE |FROM " "${SERVICE_DIR}" >/dev/null; then
  echo "[error] SQL-like patterns found in ${SERVICE_DIR}. Move DB access into worker/repositories/*"
  rg -n "\.prepare\(|SELECT |INSERT |UPDATE |DELETE |FROM " "${SERVICE_DIR}"
  exit 1
fi

echo "[ok] no SQL patterns found in ${SERVICE_DIR}"
