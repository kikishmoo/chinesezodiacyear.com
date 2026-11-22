-- Minimal aggregate retention audit history; no birth data, email or PDF content.
CREATE TABLE IF NOT EXISTS retention_cleanup_runs (
  id TEXT PRIMARY KEY,
  executed_at TEXT NOT NULL,
  cutoff_at TEXT NOT NULL,
  raw_redacted INTEGER NOT NULL DEFAULT 0,
  files_deleted INTEGER NOT NULL DEFAULT 0,
  failures INTEGER NOT NULL DEFAULT 0,
  outcome TEXT NOT NULL CHECK(outcome IN ('success', 'partial', 'failed'))
);
CREATE INDEX IF NOT EXISTS idx_retention_cleanup_runs_executed_at
  ON retention_cleanup_runs(executed_at);
