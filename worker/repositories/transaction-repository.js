import { getDb } from './db-context.js';

/**
 * Insert a payment transaction row.
 * @param {Record<string, any>} env
 * @param {{id: string, provider: string, providerRef: string, status: string, amountCents: number, currency: string, customerEmail?: string|null, metadataJson?: string|null}} tx
 */
export async function createTransaction(env, tx) {
  const db = getDb(env);

  await db
    .prepare(
      `INSERT INTO transactions (
         id, provider, provider_ref, status, amount_cents, currency, customer_email, metadata_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      tx.id,
      tx.provider,
      tx.providerRef,
      tx.status,
      tx.amountCents,
      tx.currency,
      tx.customerEmail ?? null,
      tx.metadataJson ?? null
    )
    .run();
}
