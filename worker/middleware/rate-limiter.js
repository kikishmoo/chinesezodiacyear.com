/**
 * Rate Limiter Middleware — Dual-layer (in-memory + KV)
 *
 * Layer 1: In-memory sliding window (catches instant bursts, zero latency)
 * Layer 2: Cloudflare KV counter (cross-edge persistence, ~60s eventual consistency)
 *
 * Both layers must pass for a request to proceed.
 * If KV is unavailable, falls back to in-memory only (graceful degradation).
 *
 * KV key format: `rl:<IP>:<minute-bucket>`
 * KV TTL: 120 seconds (auto-expires stale keys)
 */

/* ── Configuration ────────────────────────────────────── */

const RATE_LIMIT = 15;             // max requests per window per IP
const RATE_WINDOW_MS = 60 * 1000;  // 60-second sliding window (in-memory)
const CLEANUP_INTERVAL_MS = 120 * 1000;

/* ── Layer 1: In-memory sliding window ────────────────── */

const ipLog = new Map();           // IP → [timestamp, …]
let lastCleanup = Date.now();

/**
 * Check and record a request against the in-memory window.
 * @param {string} ip
 * @returns {boolean} true if over limit
 */
function isMemoryLimited(ip) {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;

  // Periodic cleanup to prevent memory growth
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    for (const [key, ts] of ipLog) {
      const fresh = ts.filter(t => t > cutoff);
      if (fresh.length === 0) ipLog.delete(key);
      else ipLog.set(key, fresh);
    }
    lastCleanup = now;
  }

  let ts = ipLog.get(ip);
  if (!ts) {
    ts = [];
    ipLog.set(ip, ts);
  }

  // Drop expired entries
  while (ts.length > 0 && ts[0] <= cutoff) ts.shift();

  if (ts.length >= RATE_LIMIT) return true;

  ts.push(now);
  return false;
}

/* ── Layer 2: KV-backed counter ───────────────────────── */

/**
 * Get the current minute bucket key for an IP.
 * Buckets rotate every 60 seconds.
 * @param {string} ip
 * @returns {string}
 */
function kvKey(ip) {
  const bucket = Math.floor(Date.now() / 60000);
  return `rl:${ip}:${bucket}`;
}

/**
 * Check and increment the KV counter.
 * @param {KVNamespace} kv — RATE_LIMIT_KV binding
 * @param {string} ip
 * @returns {Promise<boolean>} true if over limit
 */
async function isKvLimited(kv, ip) {
  const key = kvKey(ip);

  // Read current count (string or null)
  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) : 0;

  if (count >= RATE_LIMIT) return true;

  // Increment. TTL of 120s ensures auto-cleanup (covers current + next bucket).
  await kv.put(key, String(count + 1), { expirationTtl: 120 });
  return false;
}

/* ── Public API ───────────────────────────────────────── */

/**
 * Resolve client IP from Cloudflare headers.
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  return request.headers.get('CF-Connecting-IP')
      || request.headers.get('X-Forwarded-For')
      || 'unknown';
}

/**
 * Run rate limit check. Returns null if allowed, or a 429 Response if blocked.
 * @param {Request} request
 * @param {Object} env — Worker env bindings (expects env.RATE_LIMIT_KV)
 * @param {Object} corsHeaders
 * @returns {Promise<Response|null>}
 */
export async function checkRateLimit(request, env, corsHeaders) {
  const ip = getClientIp(request);

  // Layer 1: instant in-memory check (no I/O)
  if (isMemoryLimited(ip)) {
    return rateResponse(corsHeaders);
  }

  // Layer 2: KV cross-edge check (graceful degradation if KV unavailable)
  if (env.RATE_LIMIT_KV) {
    try {
      if (await isKvLimited(env.RATE_LIMIT_KV, ip)) {
        return rateResponse(corsHeaders);
      }
    } catch (e) {
      // KV failure → allow through (in-memory still enforcing)
      console.error('[RateLimiter] KV error:', e.message);
    }
  }

  return null; // allowed
}

/**
 * Build a 429 response.
 * @param {Object} corsHeaders
 * @returns {Response}
 */
function rateResponse(corsHeaders) {
  return Response.json(
    {
      error: {
        code: 'RateLimited',
        message: 'Too many requests. Please wait a minute before trying again.',
        retryable: true
      }
    },
    {
      status: 429,
      headers: { ...corsHeaders, 'Retry-After': '60' }
    }
  );
}
