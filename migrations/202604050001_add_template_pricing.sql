-- Add pricing and description columns to report_templates.
-- Fixes mismatch: report-template-repository.js references these columns
-- but the Phase 6 initial schema omitted them.

ALTER TABLE report_templates ADD COLUMN description TEXT NOT NULL DEFAULT '';
ALTER TABLE report_templates ADD COLUMN price_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE report_templates ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';
