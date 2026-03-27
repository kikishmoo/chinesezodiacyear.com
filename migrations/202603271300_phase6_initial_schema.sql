-- Phase 6 / Item L bootstrap migration
-- Creates core revenue and operations tables for D1.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS report_templates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  category TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  template_json TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS report_jobs (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  request_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('queued', 'processing', 'completed', 'failed')),
  input_payload_json TEXT NOT NULL,
  output_r2_key TEXT,
  error_message TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES report_templates(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_transaction_id TEXT NOT NULL UNIQUE,
  report_job_id TEXT,
  amount_cents INTEGER NOT NULL CHECK(amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK(status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_job_id) REFERENCES report_jobs(id)
);

CREATE TABLE IF NOT EXISTS directory_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  website_url TEXT,
  country_code TEXT,
  city TEXT,
  categories_json TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK(verification_status IN ('pending', 'verified', 'rejected')),
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS directory_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  note TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES directory_listings(id)
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK(price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'archived')),
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_report_jobs_status_created_at ON report_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status_created_at ON transactions(status, created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_report_job_id ON transactions(report_job_id);
CREATE INDEX IF NOT EXISTS idx_directory_leads_listing_id ON directory_leads(listing_id);
CREATE INDEX IF NOT EXISTS idx_directory_leads_status_created_at ON directory_leads(status, created_at);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
