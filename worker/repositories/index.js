import { ReportTemplateRepository } from './report-template-repository.js';
import { ReportJobRepository } from './report-job-repository.js';

/**
 * Repository factory to keep SQL access contained in worker/repositories/*.
 *
 * @param {{ DB?: D1Database }} env
 */
export function createRepositories(env = {}) {
  const db = env.DB;
  if (!db) {
    return {
      hasDatabase: false,
      reportTemplates: null,
      reportJobs: null
    };
  }

  return {
    hasDatabase: true,
    reportTemplates: new ReportTemplateRepository(db),
    reportJobs: new ReportJobRepository(db)
  };
}
