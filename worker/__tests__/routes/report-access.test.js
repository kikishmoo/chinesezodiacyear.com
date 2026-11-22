import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../repositories/transaction-repository.js', () => ({
  getPaidTransactionByReportJobId: vi.fn()
}));
vi.mock('../../services/report-service.js', () => ({
  getReportStatus: vi.fn()
}));
import { getPaidTransactionByReportJobId } from '../../repositories/transaction-repository.js';
import { getReportStatus } from '../../services/report-service.js';
import { handleGetReport, handleDownloadReport } from '../../routes/report.js';
import app from '../../index.js';

const token = 'a'.repeat(64);
const jobId = 'job-owned';
const req = (claim = token) => new Request('https://worker.example/v1/reports/' + jobId, {
  headers: claim ? { Authorization: 'Bearer ' + claim } : {}
});
const env = {};
const cors = { 'Access-Control-Allow-Origin': 'https://chinesezodiacyear.com' };

beforeEach(() => {
  vi.clearAllMocks();
  getPaidTransactionByReportJobId.mockResolvedValue({ report_job_id: jobId, status: 'paid' });
  getReportStatus.mockResolvedValue({
    jobId, status: 'completed', downloadUrl: 'reports/private.pdf', createdAt: '2026-11-21'
  });
});

describe('paid report access', () => {
  it('disables the free report-generation endpoint', async () => {
    const response = await app.fetch(new Request('https://worker.example/v1/reports', {
      method: 'POST', headers: { 'CF-Connecting-IP': 'test-report-access' },
      body: '{}'
    }), { ALLOWED_ORIGINS: 'https://chinesezodiacyear.com' });
    expect(response.status).toBe(404);
  });

  it('rejects report status without a token and does not read report data', async () => {
    const response = await handleGetReport(req(null), env, cors, { jobId });
    expect(response.status).toBe(404);
    expect(getReportStatus).not.toHaveBeenCalled();
  });

  it('rejects guessed or invalid tokens', async () => {
    const response = await handleGetReport(req('bad'), env, cors, { jobId });
    expect(response.status).toBe(404);
    expect(getReportStatus).not.toHaveBeenCalled();
  });

  it('returns status to a purchaser with a paid, matching claim', async () => {
    const response = await handleGetReport(req(), env, cors, { jobId });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.jobId).toBe(jobId);
    expect(body.data.downloadUrl).toBeUndefined();
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('rejects a claim that belongs to another report', async () => {
    getPaidTransactionByReportJobId.mockResolvedValue(null);
    const response = await handleGetReport(req(), env, cors, { jobId });
    expect(response.status).toBe(404);
    expect(getReportStatus).not.toHaveBeenCalled();
  });

  it('does not download a paid report without the claim', async () => {
    const response = await handleDownloadReport(req(null), env, cors, { jobId });
    expect(response.status).toBe(404);
    expect(getReportStatus).not.toHaveBeenCalled();
  });

  it('allows PDF access only with a valid paid claim', async () => {
    const response = await handleDownloadReport(req(), {
      REPORTS_BUCKET: { get: vi.fn().mockResolvedValue({
        body: new Response('pdf-data').body
      }) }
    }, cors, { jobId });
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
  });
});
