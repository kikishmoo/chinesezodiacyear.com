import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../repositories/report-retention-repository.js', () => ({
  createReportRetentionRepository: vi.fn()
}));

import { createReportRetentionRepository } from '../../repositories/report-retention-repository.js';
import { runReportRetention } from '../../services/report-retention.js';

const NOW = new Date('2026-11-21T12:00:00Z');
const cutoff = '2026-10-22 12:00:00';
let repo;

beforeEach(() => {
  vi.clearAllMocks();
  repo = {
    listExpiredRaw: vi.fn().mockResolvedValue([]),
    redactRaw: vi.fn().mockResolvedValue({ success: true }),
    listExpiredFiles: vi.fn().mockResolvedValue([]),
    markFileDeleted: vi.fn().mockResolvedValue({ success: true }),
    recordRun: vi.fn().mockResolvedValue({ success: true })
  };
  createReportRetentionRepository.mockReturnValue(repo);
});

function env(deleteFn = vi.fn().mockResolvedValue(undefined)) {
  return { DB: {}, REPORTS_BUCKET: { delete: deleteFn } };
}

describe('30-day report retention', () => {
  it('redacts birth payloads 30 days after creation and records audit summary', async () => {
    repo.listExpiredRaw.mockResolvedValueOnce([{ id: 'old-job' }]);
    const result = await runReportRetention(env(), NOW);
    expect(repo.listExpiredRaw).toHaveBeenCalledWith(cutoff, 100);
    expect(repo.redactRaw).toHaveBeenCalledWith('old-job', cutoff);
    expect(result.rawRedacted).toBe(1);
    expect(repo.recordRun).toHaveBeenCalledWith(expect.objectContaining({
      rawRedacted: 1, filesDeleted: 0, failures: 0, cutoff, outcome: 'success'
    }));
  });

  it('deletes the R2 file before clearing its DB reference', async () => {
    repo.listExpiredFiles.mockResolvedValueOnce([{
      id: 'old-file', output_r2_key: 'reports/old-file.pdf'
    }]);
    const order = [];
    repo.markFileDeleted.mockImplementation(async () => order.push('db'));
    const result = await runReportRetention(env(vi.fn(async () => order.push('r2'))), NOW);
    expect(order).toEqual(['r2', 'db']);
    expect(result.filesDeleted).toBe(1);
    expect(repo.markFileDeleted).toHaveBeenCalledWith('old-file', 'reports/old-file.pdf', cutoff);
  });

  it('preserves the file reference when R2 deletion fails and audits failure', async () => {
    repo.listExpiredFiles.mockResolvedValueOnce([{
      id: 'failed-file', output_r2_key: 'reports/failed.pdf'
    }]);
    await expect(runReportRetention(env(vi.fn().mockRejectedValue(new Error('R2 unavailable'))), NOW))
      .rejects.toThrow('partially failed');
    expect(repo.markFileDeleted).not.toHaveBeenCalled();
    expect(repo.recordRun).toHaveBeenCalledWith(expect.objectContaining({
      filesDeleted: 0, failures: 1, outcome: 'partial'
    }));
  });

  it('leaves transaction/accounting tables untouched', async () => {
    await runReportRetention(env(), NOW);
    expect(repo.redactRaw).not.toHaveBeenCalled();
    expect(repo.markFileDeleted).not.toHaveBeenCalled();
  });

  it('requires an R2 binding to prevent losing references before deletion', async () => {
    await expect(runReportRetention({ DB: {} }, NOW)).rejects.toThrow('REPORTS_BUCKET');
    expect(repo.recordRun).not.toHaveBeenCalled();
  });
});
