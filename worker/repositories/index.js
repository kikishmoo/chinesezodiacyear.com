import { createReportTemplatesRepository } from './report-templates-repository.js';
import { createReportJobsRepository } from './report-jobs-repository.js';

/**
 * Repository factory for worker routes/services.
 *
 * Usage:
 *   const repos = createRepositories(env)
 *   const template = await repos.reportTemplates.getBySlug('bazi-basic-en')
 */
export function createRepositories(env) {
  return {
    reportTemplates: createReportTemplatesRepository(env),
    reportJobs: createReportJobsRepository(env)
  };
}
