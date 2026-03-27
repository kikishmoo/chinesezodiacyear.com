/**
 * Tests for worker/lib/retry.js
 */

import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../../lib/retry.js';

describe('withRetry', () => {
  it('returns result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await withRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on retryable error and succeeds', async () => {
    const error = new Error('upstream down');
    error.retryable = true;
    const fn = vi.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('recovered');

    const result = await withRetry(fn, { maxRetries: 2, baseDelay: 1 });
    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws immediately on non-retryable error', async () => {
    const error = new Error('validation');
    error.retryable = false;
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxRetries: 2, baseDelay: 1 }))
      .rejects.toThrow('validation');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throws last error after exhausting retries', async () => {
    const error1 = new Error('fail 1');
    error1.retryable = true;
    const error2 = new Error('fail 2');
    error2.retryable = true;
    const error3 = new Error('fail 3');
    error3.retryable = true;

    const fn = vi.fn()
      .mockRejectedValueOnce(error1)
      .mockRejectedValueOnce(error2)
      .mockRejectedValueOnce(error3);

    await expect(withRetry(fn, { maxRetries: 2, baseDelay: 1 }))
      .rejects.toThrow('fail 3');
    expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it('respects maxRetries=0 (no retries)', async () => {
    const error = new Error('fail');
    error.retryable = true;
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxRetries: 0, baseDelay: 1 }))
      .rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries errors without retryable property (default retryable)', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValue('ok');

    const result = await withRetry(fn, { maxRetries: 1, baseDelay: 1 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
