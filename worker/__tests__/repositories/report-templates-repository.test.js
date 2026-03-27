import { describe, it, expect } from 'vitest';
import { createReportTemplatesRepository } from '../../repositories/report-templates-repository.js';

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
              return { results: [{ slug: 'bazi-basic-en', category: 'bazi' }] };
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

describe('report-templates-repository', () => {
  it('queries by slug', async () => {
    const DB = mockDb();
    const repo = createReportTemplatesRepository({ DB });

    const row = await repo.getBySlug('bazi-basic-en');

    expect(row).toEqual({ slug: 'bazi-basic-en', category: 'bazi' });
    expect(DB.calls[0].sql).toContain('FROM report_templates');
    expect(DB.calls[0].params).toEqual(['bazi-basic-en']);
  });

  it('creates a template and re-queries by slug', async () => {
    const DB = mockDb();
    const repo = createReportTemplatesRepository({ DB });

    await repo.create({
      id: 'tpl_1',
      slug: 'bazi-basic-en',
      title: 'BaZi Basic EN',
      category: 'bazi',
      templateJson: '{"sections":[]}'
    });

    expect(DB.calls[0].sql).toContain('INSERT INTO report_templates');
    expect(DB.calls[1].sql).toContain('FROM report_templates');
  });
});
