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
    expect(match.route.handler).toBe(handler);
    expect(match.params).toEqual({});
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
    expect(match.route.handler).toBe(handler);
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

  it('matches path parameters', () => {
    const router = new Router();
    const handler = () => {};
    router.get('/v1/reports/:jobId', handler);

    const match = router.match('GET', '/v1/reports/abc-123');
    expect(match).not.toBeNull();
    expect(match.route.handler).toBe(handler);
    expect(match.params).toEqual({ jobId: 'abc-123' });
  });

  it('matches multiple path parameters', () => {
    const router = new Router();
    const handler = () => {};
    router.get('/v1/:resource/:id', handler);

    const match = router.match('GET', '/v1/reports/xyz');
    expect(match).not.toBeNull();
    expect(match.params).toEqual({ resource: 'reports', id: 'xyz' });
  });

  it('does not match partial path segments', () => {
    const router = new Router();
    router.get('/v1/reports/:jobId', () => {});

    // Too few segments
    expect(router.match('GET', '/v1/reports')).toBeNull();
    // Too many segments (unless another route handles it)
    expect(router.match('GET', '/v1/reports/abc/extra')).toBeNull();
  });

  it('distinguishes parameterised from exact routes', () => {
    const router = new Router();
    const exactHandler = () => 'exact';
    const paramHandler = () => 'param';
    router.get('/v1/reports/latest', exactHandler);
    router.get('/v1/reports/:jobId', paramHandler);

    // Exact match takes priority (registered first)
    const exactMatch = router.match('GET', '/v1/reports/latest');
    expect(exactMatch.route.handler).toBe(exactHandler);

    // Param match for non-exact
    const paramMatch = router.match('GET', '/v1/reports/abc-123');
    expect(paramMatch.route.handler).toBe(paramHandler);
  });

  it('matches nested parameterised path with suffix', () => {
    const router = new Router();
    const handler = () => {};
    router.get('/v1/reports/:jobId/download', handler);

    const match = router.match('GET', '/v1/reports/abc-123/download');
    expect(match).not.toBeNull();
    expect(match.params).toEqual({ jobId: 'abc-123' });
  });
});
