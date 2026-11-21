/**
 * Bounded daily cleanup; called ONLY from the scheduled Worker event.
 * Raw data expires 30 days after job creation. PDFs expire 30 days
 * after report completion (falling back to creation for older records).
 * Transaction/accounting records are never deleted here.
 */
import { createReportRetentionRepository } from '../repositories/report-retention-repository.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 100;
const MAX_PAGES = 10;

export async function runReportRetention(env, now = new Date()) {
  if (!env?.REPORTS_BUCKET || typeof env.REPORTS_BUCKET.delete !== 'function') {
    throw new Error('Retention cleanup requires the REPORTS_BUCKET R2 binding');
  }
  const repo = createReportRetentionRepository(env);
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) throw new Error('Invalid retention time');
  const cutoff = new Date(now.getTime() - 30 * DAY_MS)
    .toISOString().replace('T', ' ').slice(0, 19);
  const summary = { rawRedacted: 0, filesDeleted: 0, failures: 0 };
  const failedIds = new Set();

  // Separate raw-data and PDF expiry: PDF may be generated after job creation.
  for (let page = 0; page < MAX_PAGES; page++) {
    const rows = await repo.listExpiredRaw(cutoff, PAGE_SIZE);
    if (!rows.length) break;
    for (const { id } of rows) {
      try {
        await repo.redactRaw(id, cutoff);
        summary.rawRedacted++;
      } catch {
        summary.failures++;
        failedIds.add(id);
      }
    }
    if (rows.length < PAGE_SIZE || summary.failures) break;
  }

  for (let page = 0; page < MAX_PAGES; page++) {
    const rows = await repo.listExpiredFiles(cutoff, PAGE_SIZE);
    if (!rows.length) break;
    for (const { id, output_r2_key: key } of rows) {
      if (!key || failedIds.has(id)) continue;
      try {
        // IMPORTANT: only clear the DB reference AFTER R2 deletion succeeds.
        await env.REPORTS_BUCKET.delete(key);
        await repo.markFileDeleted(id, key, cutoff);
        summary.filesDeleted++;
      } catch {
        summary.failures++;
        failedIds.add(id);
      }
    }
    if (rows.length < PAGE_SIZE || summary.failures) break;
  }

  const outcome = summary.failures ? 'partial' : 'success';
  // Fail closed if audit cannot be recorded; the scheduler retries at its next run.
  await repo.recordRun({
    id: crypto.randomUUID(),
    executedAt: now.toISOString(),
    cutoff,
    ...summary,
    outcome
  });
  console.log('[Retention] cleanup', { ...summary, outcome });
  if (summary.failures) throw new Error('Report retention cleanup partially failed; review audit records');
  return { ...summary, outcome };
}
