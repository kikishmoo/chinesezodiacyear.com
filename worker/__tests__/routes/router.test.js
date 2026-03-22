/**
 * Tests for the Router.
 */

import { describe, it, expect } from 'vitest';
import { Router } from '../../router.js';

describe('Router', () => {
  it('matches exact path and method', () => {
    const router = new Router();
    const handler = () => {};
    router.post('/v1/bazi/calculate', handler);

    const match = router.match('POST', '/v1/bazi/calculate');
    expect(match).not.toBeNull();
    expect(match.handler).toBe(handler);
  });

  it('returns null for unregistered route', () => {
    const router = new Router();
    router.post('/v1/bazi/calculate', () => {});

    expect(router.match('GET', '/v1/bazi/calculate')).toBeNull();
    expect(router.match('POST', '/v1/nonexistent')).toBeNull();
  });

  it('strips trailing slash', () => {
    const router = new Router();
    const handler = () => {};
    router.get('/v1/health', handler);

    const match = router.match('GET', '/v1/health/');
    expect(match).not.toBeNull();
    expect(match.handler).toBe(handler);
  });

  it('matches root path', () => {
    const router = new Router();
    const handler = () => {};
    router.post('/', handler);

    const match = router.match('POST', '/');
    expect(match).not.toBeNull();
  });

  it('is case-insensitive for method', () => {
    const router = new Router();
    router.post('/test', () => {});

    expect(router.match('post', '/test')).not.toBeNull();
    expect(router.match('Post', '/test')).not.toBeNull();
  });
});
