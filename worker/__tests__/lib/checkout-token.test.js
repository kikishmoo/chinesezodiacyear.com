import { describe, it, expect } from 'vitest';
import { createCheckoutToken, hashCheckoutToken, checkoutTokenMatches,
  bearerCheckoutToken } from '../../lib/checkout-token.js';

describe('checkout bearer claims', () => {
  it('creates unique 256-bit random checkout tokens', () => {
    const a = createCheckoutToken();
    const b = createCheckoutToken();
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).not.toBe(b);
  });

  it('stores only a hash and rejects incorrect claims', async () => {
    const token = createCheckoutToken();
    const hash = await hashCheckoutToken(token);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toBe(token);
    expect(await checkoutTokenMatches(token, hash)).toBe(true);
    expect(await checkoutTokenMatches(createCheckoutToken(), hash)).toBe(false);
    expect(await checkoutTokenMatches('', hash)).toBe(false);
  });

  it('accepts only a well-formed Authorization bearer header', () => {
    const token = createCheckoutToken();
    expect(bearerCheckoutToken(new Request('https://example.com/', {
      headers: { Authorization: 'Bearer ' + token }
    }))).toBe(token);
    expect(bearerCheckoutToken(new Request('https://example.com/'))).toBe(null);
  });
});
