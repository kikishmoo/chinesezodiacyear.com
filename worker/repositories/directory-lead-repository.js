import { getDb } from './db-context.js';

/**
 * Store a new practitioner lead request.
 * @param {Record<string, any>} env
 * @param {{id: string, listingId: string, name: string, email: string, message?: string|null, sourcePath?: string|null}} lead
 */
export async function createDirectoryLead(env, lead) {
  const db = getDb(env);

  await db
    .prepare(
      `INSERT INTO directory_leads (
         id, listing_id, requester_name, requester_email, message, source_path
       ) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(lead.id, lead.listingId, lead.name, lead.email, lead.message ?? null, lead.sourcePath ?? null)
    .run();
}
