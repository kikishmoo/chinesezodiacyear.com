import { describe, it, expect } from 'vitest';
import { createRepositories } from '../../repositories/index.js';
import { ValidationError } from '../../models/errors.js';

describe('repository factory', () => {
  it('throws validation error when DB binding is missing', () => {
    expect(() => createRepositories({})).toThrow(ValidationError);
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
    expect(repositories.reportTemplates).toBeTruthy();
    expect(repositories.reportJobs).toBeTruthy();
  });
});
