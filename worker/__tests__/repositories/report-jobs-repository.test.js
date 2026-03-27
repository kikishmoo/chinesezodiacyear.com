import { describe, it, expect } from 'vitest';
import { createReportJobsRepository } from '../../repositories/report-jobs-repository.js';

function mockDb() {
  const calls = [];

  return {
    calls,
    prepare(sql) {
      return {
        bind(...params) {
          calls.push({ sql, params });
          return {
            async all() {
              return { results: [{ id: 'job_1', request_hash: 'hash_1' }] };
            },
            async run() {
              return { success: true };
            }
          };
        }
      };
    }
  };
}

describe('report-jobs-repository', () => {
  it('creates and fetches by request hash', async () => {
    const DB = mockDb();
    const repo = createReportJobsRepository({ DB });

    await repo.create({
      id: 'job_1',
      templateId: 'tpl_1',
      requestHash: 'hash_1',
      status: 'queued',
      inputPayloadJson: '{"sample":1}'
    });

    expect(DB.calls[0].sql).toContain('INSERT INTO report_jobs');
    expect(DB.calls[1].sql).toContain('WHERE request_hash = ?');
    expect(DB.calls[1].params).toEqual(['hash_1']);
  });

  it('updates status and timestamps', async () => {
    const DB = mockDb();
    const repo = createReportJobsRepository({ DB });

    await repo.updateStatus('job_1', 'processing', {});

    expect(DB.calls[0].sql).toContain('UPDATE report_jobs');
    expect(DB.calls[0].params[0]).toBe('processing');
  });
});
