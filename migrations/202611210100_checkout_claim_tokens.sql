-- Separate unauthenticated order IDs from secret, customer-held checkout claims.
-- Old orders have no claim and require support-led reconciliation, not public access.
ALTER TABLE transactions ADD COLUMN checkout_token_hash TEXT;
ALTER TABLE transactions ADD COLUMN template_slug TEXT;
CREATE INDEX IF NOT EXISTS idx_transactions_report_job_paid
  ON transactions(report_job_id, status);
