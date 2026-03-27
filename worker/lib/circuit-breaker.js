/**
 * Circuit Breaker — Per-host state machine for upstream resilience.
 *
 * States:
 *   CLOSED   → Normal operation. Failures increment counter.
 *   OPEN     → Upstream considered down. Requests fail fast with CircuitOpenError.
 *   HALF_OPEN → After recovery timeout, one probe request is allowed through.
 *
 * Configuration:
 *   - failureThreshold: 5 failures → open
 *   - recoveryTimeout: 30s before half-open probe
 *
 * State is stored in-memory (per Worker isolate). Cloudflare Workers
 * are stateless across isolates, so circuit state doesn't persist
 * across edge locations or restarts. This is acceptable: each edge
 * location independently discovers upstream failures.
 *
 * @module worker/lib/circuit-breaker
 */

import { CircuitOpenError } from '../models/errors.js';

export const STATE = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN'
};

const DEFAULT_FAILURE_THRESHOLD = 5;
const DEFAULT_RECOVERY_TIMEOUT_MS = 30_000;

/**
 * Create a circuit breaker for a named upstream service.
 *
 * @param {string} source — upstream identifier (e.g. 'zhouyi', 'windada')
 * @param {Object} [options]
 * @param {number} [options.failureThreshold=5]
 * @param {number} [options.recoveryTimeout=30000]
 * @returns {Object} — { execute, getState, reset }
 */
export function createCircuitBreaker(source, options = {}) {
  const {
    failureThreshold = DEFAULT_FAILURE_THRESHOLD,
    recoveryTimeout = DEFAULT_RECOVERY_TIMEOUT_MS
  } = options;

  let state = STATE.CLOSED;
  let failureCount = 0;
  let lastFailureTime = 0;

  /**
   * Get the current circuit state and metadata.
   * @returns {{ state: string, failureCount: number, lastFailureTime: number }}
   */
  function getState() {
    return { state, failureCount, lastFailureTime };
  }

  /**
   * Reset the circuit to CLOSED state.
   */
  function reset() {
    state = STATE.CLOSED;
    failureCount = 0;
    lastFailureTime = 0;
  }

  /**
   * Record a successful call — resets failure tracking.
   */
  function onSuccess() {
    if (state === STATE.HALF_OPEN || state === STATE.CLOSED) {
      reset();
    }
  }

  /**
   * Record a failed call — increments failure count, may trip the breaker.
   */
  function onFailure() {
    failureCount++;
    lastFailureTime = Date.now();

    if (failureCount >= failureThreshold) {
      state = STATE.OPEN;
    }
  }

  /**
   * Check if the circuit should transition from OPEN to HALF_OPEN.
   * @returns {boolean}
   */
  function shouldAttemptReset() {
    return state === STATE.OPEN &&
      (Date.now() - lastFailureTime) >= recoveryTimeout;
  }

  /**
   * Execute a function through the circuit breaker.
   *
   * @param {Function} fn — async function to protect
   * @returns {Promise<*>} — result of fn()
   * @throws {CircuitOpenError} if circuit is open and recovery timeout hasn't elapsed
   */
  async function execute(fn) {
    // OPEN state: check if we should probe
    if (state === STATE.OPEN) {
      if (shouldAttemptReset()) {
        state = STATE.HALF_OPEN;
      } else {
        throw new CircuitOpenError(source);
      }
    }

    // CLOSED or HALF_OPEN: attempt the call
    try {
      const result = await fn();
      onSuccess();
      return result;
    } catch (error) {
      // Only count retryable errors as circuit failures
      if (error.retryable !== false) {
        onFailure();
      }
      throw error;
    }
  }

  return { execute, getState, reset };
}

/**
 * Registry of circuit breakers, one per upstream source.
 * Persists across requests within the same Worker isolate.
 *
 * @type {Map<string, ReturnType<typeof createCircuitBreaker>>}
 */
const breakers = new Map();

/**
 * Get or create a circuit breaker for a named upstream.
 *
 * @param {string} source — upstream identifier
 * @param {Object} [options] — passed to createCircuitBreaker if creating
 * @returns {ReturnType<typeof createCircuitBreaker>}
 */
export function getBreaker(source, options) {
  if (!breakers.has(source)) {
    breakers.set(source, createCircuitBreaker(source, options));
  }
  return breakers.get(source);
}
