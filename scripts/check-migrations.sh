#!/usr/bin/env bash
set -euo pipefail

MIGRATIONS_DIR="${1:-migrations}"

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "[error] Missing migrations directory: $MIGRATIONS_DIR"
  exit 1
fi

mapfile -t files < <(find "$MIGRATIONS_DIR" -maxdepth 1 -type f -name '*.sql' | sort)

if [ "${#files[@]}" -eq 0 ]; then
  echo "[error] No SQL migrations found in $MIGRATIONS_DIR"
  exit 1
fi

prev_ts=""
declare -A seen_timestamps=()

for file in "${files[@]}"; do
  base="$(basename "$file")"

  if [[ ! "$base" =~ ^[0-9]{12}_[a-z0-9_]+\.sql$ ]]; then
    echo "[error] Invalid migration filename: $base"
    echo "[hint] Use YYYYMMDDHHMM_description.sql"
    exit 1
  fi

  timestamp="${base%%_*}"

  if [[ -n "${seen_timestamps[$timestamp]:-}" ]]; then
    echo "[error] Duplicate migration timestamp: $timestamp"
    exit 1
  fi
  seen_timestamps[$timestamp]=1

  if [[ -n "$prev_ts" && "$timestamp" -le "$prev_ts" ]]; then
    echo "[error] Migrations out of order: $base"
    exit 1
  fi
  prev_ts="$timestamp"


  echo "[ok] $base"
done

# Validate the complete migration sequence against one in-memory SQLite database.
# Later migrations depend on the schema/columns established by earlier files.
python3 - "${files[@]}" <<'PY'
import sqlite3
import sys

conn = sqlite3.connect(':memory:')
try:
    for path in sys.argv[1:]:
        with open(path, 'r', encoding='utf-8') as handle:
            sql = handle.read()
        try:
            conn.executescript(sql)
        except sqlite3.Error as exc:
            print(f"[error] SQL migration failed for {path}: {exc}")
            raise SystemExit(1)
    print(f"[ok] Migration sequence applied successfully ({len(sys.argv) - 1} file(s))")
finally:
    conn.close()
PY

echo "[ok] Migration checks passed (${#files[@]} file(s))"
