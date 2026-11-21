/**
 * Transaction repository — D1 access for the `transactions` table.
 *
 * Schema columns:
 *   id, provider, provider_transaction_id (UNIQUE), report_job_id (FK),
 *   amount_cents, currency, status, paid_at, created_at
 */

import { getDb } from './db-context.js';

/**
 * Insert a payment transaction row.
 *
 * @param {Record<string, any>} env
 * @param {{
 *   id: string,
 *   provider: string,
 *   providerTransactionId: string,
 *   reportJobId: string|null,
 *   amountCents: number,
 *   currency: string,
 *   status: string,
 *   paidAt: string|null,
 *   checkoutTokenHash: string,
 *   templateSlug: string
 * }} tx
 */
export async function createTransaction(env, tx) {
  const db = getDb(env);

  await db
    .prepare(
      `INSERT INTO transactions (
         id, provider, provider_transaction_id, report_job_id,
         amount_cents, currency, status, paid_at, checkout_token_hash, template_slug
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      tx.id,
      tx.provider,
      tx.providerTransactionId,
      tx.reportJobId ?? null,
      tx.amountCents,
      tx.currency,
      tx.status,
      tx.paidAt ?? null,
      tx.checkoutTokenHash,
      tx.templateSlug
    )
    .run();
}

/**
 * Update transaction status and optionally link a report job.
 *
 * @param {Record<string, any>} env
 * @param {string} id
 * @param {string} status
 * @param {{ paidAt?: string|null, reportJobId?: string|null }} [opts]
 */
export async function updateTransactionStatus(env, id, status, opts = {}) {
  const db = getDb(env);

  await db
    .prepare(
      `UPDATE transactions
       SET status = ?,
           paid_at = COALESCE(?, paid_at),
           report_job_id = COALESCE(?, report_job_id)
       WHERE id = ?`
    )
    .bind(status, opts.paidAt ?? null, opts.reportJobId ?? null, id)
    .run();
}

/**
 * Look up a transaction by PayPal order/capture ID.
 *
 * @param {Record<string, any>} env
 * @param {string} providerTransactionId
 */
export async function getTransactionByProviderId(env, providerTransactionId) {
  const db = getDb(env);

  const stmt = db
    .prepare(
      `SELECT id, provider, provider_transaction_id, report_job_id,
              amount_cents, currency, status, paid_at, created_at,
              checkout_token_hash, template_slug
       FROM transactions
       WHERE provider_transaction_id = ?
       LIMIT 1`
    )
    .bind(providerTransactionId);

  return stmt.first();
}

/** Look up a paid report claim; this query never exposes the claim hash to clients. */
export async function getPaidTransactionByReportJobId(env, jobId, tokenHash) {
  return getDb(env)
    .prepare(`SELECT report_job_id, status, checkout_token_hash
              FROM transactions
              WHERE report_job_id = ? AND checkout_token_hash = ? AND status = 'paid'
              LIMIT 1`)
    .bind(jobId, tokenHash)
    .first();
}
