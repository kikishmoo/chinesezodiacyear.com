import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../repositories/report-templates-repository.js', () => ({
  createReportTemplatesRepository: vi.fn()
}));
vi.mock('../../repositories/report-jobs-repository.js', () => ({
  createReportJobsRepository: vi.fn()
}));
vi.mock('../../services/bazi-service.js', () => ({
  calculate: vi.fn(async () => ({ dayMaster: { element: 'Wood' } }))
}));
vi.mock('../../lib/pdf-renderer.js', () => ({
  renderPdf: vi.fn(async () => new Uint8Array([37, 80, 68, 70]))
}));

import { createReportTemplatesRepository } from '../../repositories/report-templates-repository.js';
import { createReportJobsRepository } from '../../repositories/report-jobs-repository.js';
import { calculate } from '../../services/bazi-service.js';
import { renderPdf } from '../../lib/pdf-renderer.js';
import { requestReport } from '../../services/report-service.js';

const template = {
  id: 'tpl-1', slug: 'bazi-basic-en', category: 'bazi',
  title: 'BaZi report', version: 1, locale: 'en', is_active: 1,
  template_json: '{"sections":[]}'
};
const payload = {
  templateSlug: 'bazi-basic-en', year: 1993, month: 1,
  day: 15, hour: 12, minute: 0, lat: null, lng: null,
  tz: null, sex: 'female', email: null
};
let jobs;
const env = { REPORTS_BUCKET: { put: vi.fn(async () => {}) } };

beforeEach(() => {
  vi.clearAllMocks();
  createReportTemplatesRepository.mockReturnValue({ getBySlug: vi.fn(async () => template) });
  jobs = {
    getByRequestHash: vi.fn(async () => null),
    create: vi.fn(async () => {}),
    updateStatus: vi.fn(async () => {})
  };
  createReportJobsRepository.mockReturnValue(jobs);
});

describe('report fulfilment purchase isolation', () => {
  it('uses different report-job deduplication hashes for different paid orders', async () => {
    await requestReport(env, { ...payload, purchaseId: 'tx-aaa' });
    await requestReport(env, { ...payload, purchaseId: 'tx-bbb' });
    const hashes = jobs.create.mock.calls.map(([x]) => x.requestHash);
    expect(hashes).toHaveLength(2);
    expect(hashes[0]).not.toBe(hashes[1]);
    expect(env.REPORTS_BUCKET.put).toHaveBeenCalledTimes(2);
  });

  it('reuses a completed report for the same purchase without rendering it again', async () => {
    jobs.getByRequestHash.mockResolvedValue({
      id: 'job-owned', status: 'completed', output_r2_key: 'reports/job-owned.pdf'
    });
    const report = await requestReport(env, { ...payload, purchaseId: 'tx-aaa' });
    expect(report.jobId).toBe('job-owned');
    expect(report.isNew).toBe(false);
    expect(calculate).not.toHaveBeenCalled();
    expect(renderPdf).not.toHaveBeenCalled();
  });

  it('regenerates a failed report for its existing paid order', async () => {
    jobs.getByRequestHash.mockResolvedValue({
      id: 'failed-job', status: 'failed', output_r2_key: null
    });
    const result = await requestReport(env, { ...payload, purchaseId: 'tx-aaa' });
    expect(result.status).toBe('completed');
    expect(result.jobId).toBe('failed-job');
    expect(result.isNew).toBe(false);
    expect(jobs.create).not.toHaveBeenCalled();
    expect(jobs.updateStatus).toHaveBeenCalledWith('failed-job', 'processing');
    expect(jobs.updateStatus).toHaveBeenCalledWith('failed-job', 'completed',
      { outputR2Key: 'reports/failed-job.pdf' });
  });
});
