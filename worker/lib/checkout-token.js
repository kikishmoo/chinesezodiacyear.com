/**
 * A checkout claim is an unguessable, per-order bearer credential.
 * Only its SHA-256 hash is persisted in D1. The clear token is returned
 * once to the browser on order creation and never logged or put in URLs.
 */
export function createCheckoutToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashCheckoutToken(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function checkoutTokenMatches(token, expectedHash) {
  const actualHash = await hashCheckoutToken(token);
  if (!actualHash || typeof expectedHash !== 'string' || expectedHash.length !== 64) return false;
  let mismatch = 0;
  for (let i = 0; i < 64; i++) mismatch |= actualHash.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  return mismatch === 0;
}

export function bearerCheckoutToken(request) {
  const header = request.headers.get('Authorization') || '';
  const match = /^Bearer ([a-f0-9]{64})$/.exec(header);
  return match ? match[1] : null;
}
