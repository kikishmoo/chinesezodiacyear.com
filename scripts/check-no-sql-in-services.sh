#!/usr/bin/env bash
set -euo pipefail

SERVICE_DIR="worker/services"

if [ ! -d "$SERVICE_DIR" ]; then
  echo "[ok] $SERVICE_DIR not found; skipping check"
  exit 0
fi

# Guardrail: services should not embed SQL or invoke D1 prepare/exec APIs.
# SQL keywords are case-insensitive and matched as whole words.
if rg -n -i --glob '*.js' "\\b(select|insert|update|delete|create table|alter table|drop table)\\b|\\.prepare\\(|\\.exec\\(" "$SERVICE_DIR" >/tmp/service-sql-hits.txt; then
  echo "[error] SQL patterns detected in $SERVICE_DIR. Move data access to worker/repositories/*."
  cat /tmp/service-sql-hits.txt
  exit 1
fi

echo "[ok] no SQL patterns found in $SERVICE_DIR"
