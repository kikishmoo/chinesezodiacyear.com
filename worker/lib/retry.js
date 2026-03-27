/**
 * Retry — Exponential backoff retry wrapper.
 *
 * Retries a function on transient failures (UpstreamError, TimeoutError)
 * with exponential delays. Non-retryable errors (ValidationError) are
 * thrown immediately.
 *
 * @module worker/lib/retry
 */

const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_BASE_DELAY_MS = 500;

/**
 * Execute a function with exponential backoff retry.
 *
 * @param {Function} fn — async function to execute
 * @param {Object} [options]
 * @param {number} [options.maxRetries=2] — maximum retry attempts
 * @param {number} [options.baseDelay=500] — base delay in ms (doubles each retry)
 * @param {string} [options.label=''] — label for log messages
 * @returns {Promise<*>} — result of fn()
 * @throws — last error if all retries exhausted
 */
export async function withRetry(fn, options = {}) {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelay = DEFAULT_BASE_DELAY_MS,
    label = ''
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry non-retryable errors (e.g. ValidationError)
      if (error.retryable === false) {
        throw error;
      }

      // Don't retry if we've exhausted attempts
      if (attempt >= maxRetries) {
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      if (label) {
        console.warn(`[retry] ${label} attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms.`);
      }

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Sleep for a given number of milliseconds.
 * Extracted for testability (can be mocked).
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
