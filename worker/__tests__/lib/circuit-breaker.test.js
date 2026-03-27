/**
 * Tests for worker/lib/circuit-breaker.js
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCircuitBreaker, STATE } from '../../lib/circuit-breaker.js';

describe('CircuitBreaker', () => {
  let breaker;

  beforeEach(() => {
    breaker = createCircuitBreaker('test-upstream', {
      failureThreshold: 3,
      recoveryTimeout: 100 // 100ms for fast tests
    });
  });

  it('starts in CLOSED state', () => {
    expect(breaker.getState().state).toBe(STATE.CLOSED);
    expect(breaker.getState().failureCount).toBe(0);
  });

  it('passes through successful calls in CLOSED state', async () => {
    const result = await breaker.execute(() => Promise.resolve('ok'));
    expect(result).toBe('ok');
    expect(breaker.getState().state).toBe(STATE.CLOSED);
  });

  it('increments failure count on retryable errors', async () => {
    const error = new Error('upstream fail');
    error.retryable = true;

    await expect(breaker.execute(() => Promise.reject(error)))
      .rejects.toThrow('upstream fail');
    expect(breaker.getState().failureCount).toBe(1);
    expect(breaker.getState().state).toBe(STATE.CLOSED);
  });

  it('does not count non-retryable errors', async () => {
    const error = new Error('validation');
    error.retryable = false;

    await expect(breaker.execute(() => Promise.reject(error)))
      .rejects.toThrow('validation');
    expect(breaker.getState().failureCount).toBe(0);
  });

  it('opens after reaching failure threshold', async () => {
    const error = new Error('fail');
    error.retryable = true;

    for (let i = 0; i < 3; i++) {
      await expect(breaker.execute(() => Promise.reject(error)))
        .rejects.toThrow();
    }

    expect(breaker.getState().state).toBe(STATE.OPEN);
    expect(breaker.getState().failureCount).toBe(3);
  });

  it('throws CircuitOpenError when open', async () => {
    const error = new Error('fail');
    error.retryable = true;

    // Trip the breaker
    for (let i = 0; i < 3; i++) {
      await breaker.execute(() => Promise.reject(error)).catch(() => {});
    }

    // Next call should fail fast
    await expect(breaker.execute(() => Promise.resolve('ok')))
      .rejects.toThrow(/Circuit breaker open/);
  });

  it('transitions to HALF_OPEN after recovery timeout', async () => {
    const error = new Error('fail');
    error.retryable = true;

    // Trip the breaker
    for (let i = 0; i < 3; i++) {
      await breaker.execute(() => Promise.reject(error)).catch(() => {});
    }

    expect(breaker.getState().state).toBe(STATE.OPEN);

    // Wait for recovery timeout
    await new Promise(r => setTimeout(r, 150));

    // Next call should be allowed (half-open probe)
    const result = await breaker.execute(() => Promise.resolve('recovered'));
    expect(result).toBe('recovered');
    expect(breaker.getState().state).toBe(STATE.CLOSED);
    expect(breaker.getState().failureCount).toBe(0);
  });

  it('re-opens on failure during HALF_OPEN', async () => {
    const error = new Error('fail');
    error.retryable = true;

    // Trip the breaker
    for (let i = 0; i < 3; i++) {
      await breaker.execute(() => Promise.reject(error)).catch(() => {});
    }

    // Wait for recovery timeout
    await new Promise(r => setTimeout(r, 150));

    // Probe fails
    await expect(breaker.execute(() => Promise.reject(error)))
      .rejects.toThrow();

    // Should be back to OPEN (failureCount now 4, above threshold)
    expect(breaker.getState().state).toBe(STATE.OPEN);
  });

  it('reset() returns to CLOSED state', async () => {
    const error = new Error('fail');
    error.retryable = true;

    for (let i = 0; i < 3; i++) {
      await breaker.execute(() => Promise.reject(error)).catch(() => {});
    }

    expect(breaker.getState().state).toBe(STATE.OPEN);
    breaker.reset();
    expect(breaker.getState().state).toBe(STATE.CLOSED);
    expect(breaker.getState().failureCount).toBe(0);
  });

  it('resets failure count on success after failures', async () => {
    const error = new Error('fail');
    error.retryable = true;

    // 2 failures (below threshold)
    await breaker.execute(() => Promise.reject(error)).catch(() => {});
    await breaker.execute(() => Promise.reject(error)).catch(() => {});
    expect(breaker.getState().failureCount).toBe(2);

    // Success resets
    await breaker.execute(() => Promise.resolve('ok'));
    expect(breaker.getState().failureCount).toBe(0);
  });
});
