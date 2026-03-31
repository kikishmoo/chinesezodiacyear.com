/**
 * Typed error classes for the BaZi Worker API.
 *
 * Each error maps to a specific HTTP status code and includes
 * a `retryable` flag for client-side retry logic.
 */

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.retryable = false;
  }
}

export class UpstreamError extends Error {
  constructor(message, { source = 'unknown', cause = null } = {}) {
    super(message);
    this.name = 'UpstreamError';
    this.status = 502;
    this.retryable = true;
    this.source = source;
    if (cause) this.cause = cause;
  }
}

export class TimeoutError extends Error {
  constructor(message, { source = 'unknown' } = {}) {
    super(message);
    this.name = 'TimeoutError';
    this.status = 504;
    this.retryable = true;
    this.source = source;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
    this.retryable = false;
  }
}

export class CircuitOpenError extends Error {
  constructor(source) {
    super(`Circuit breaker open for ${source} — upstream temporarily unavailable`);
    this.name = 'CircuitOpenError';
    this.status = 503;
    this.retryable = true;
    this.source = source;
  }
}
