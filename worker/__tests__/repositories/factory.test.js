import { describe, it, expect } from 'vitest';
import { createRepositories } from '../../repositories/index.js';

describe('repository factory', () => {
  it('returns null repositories when DB binding is missing', () => {
    const repositories = createRepositories({});
    expect(repositories.hasDatabase).toBe(false);
    expect(repositories.reportTemplates).toBeNull();
    expect(repositories.reportJobs).toBeNull();
  });

  it('creates repositories when DB binding exists', () => {
    const fakeDb = {
      prepare() {
        return {
          bind() {
            return {
              first: async () => null,
              all: async () => ({ results: [] }),
              run: async () => ({ success: true })
            };
          }
        };
      }
    };

    const repositories = createRepositories({ DB: fakeDb });
    expect(repositories.hasDatabase).toBe(true);
    expect(repositories.reportTemplates).toBeTruthy();
    expect(repositories.reportJobs).toBeTruthy();
  });
});
