#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="worker/services"

if [ ! -d "$TARGET_DIR" ]; then
  echo "[error] Missing directory: $TARGET_DIR"
  exit 1
fi

# SQL access must stay in repositories. Guard services from D1 statement usage.
if rg --line-number --color=never "\\.prepare\\(|\\.batch\\(|\\.exec\\(" "$TARGET_DIR" >/tmp/no-sql-check.out; then
  echo "[error] SQL-like database calls found in services. Move data access into worker/repositories/*"
  cat /tmp/no-sql-check.out
  exit 1
fi

echo "[ok] No SQL-like calls found in $TARGET_DIR"
