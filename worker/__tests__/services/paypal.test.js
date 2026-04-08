/**
 * PayPal service unit tests.
 *
 * Mocks globalThis.fetch to avoid real API calls.
 * Tests token caching, order creation, and capture logic.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Reset module-level token cache between tests
let paypal;
beforeEach(async () => {
  vi.restoreAllMocks();
  // Re-import to reset module-level cachedToken / tokenExpiresAt
  vi.resetModules();
  paypal = await import('../../services/paypal.js');
});

const ENV = {
  PAYPAL_CLIENT_ID: 'test-client-id',
  PAYPAL_CLIENT_SECRET: 'test-secret',
  PAYPAL_MODE: 'sandbox'
};

function mockTokenResponse(expiresIn = 32400) {
  return new Response(JSON.stringify({
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_in: expiresIn
  }), { status: 200 });
}

describe('getAccessToken', () => {
  it('throws ValidationError when credentials are missing', async () => {
    await expect(paypal.getAccessToken({})).rejects.toThrow('PayPal credentials not configured');
  });

  it('fetches a token from sandbox URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockTokenResponse());

    const token = await paypal.getAccessToken(ENV);

    expect(token).toBe('mock-access-token');
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][0]).toContain('sandbox.paypal.com/v1/oauth2/token');
  });

  it('uses live URL when PAYPAL_MODE is live', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockTokenResponse());

    await paypal.getAccessToken({ ...ENV, PAYPAL_MODE: 'live' });

    expect(fetchSpy.mock.calls[0][0]).toContain('api-m.paypal.com/v1/oauth2/token');
  });

  it('caches the token on subsequent calls', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockTokenResponse());

    const t1 = await paypal.getAccessToken(ENV);
    const t2 = await paypal.getAccessToken(ENV);

    expect(t1).toBe(t2);
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it('throws UpstreamError on non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 })
    );

    await expect(paypal.getAccessToken(ENV)).rejects.toThrow('PayPal OAuth failed');
  });
});

describe('createOrder', () => {
  it('creates an order and returns orderId', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 'ORDER-123',
        status: 'CREATED',
        links: [{ rel: 'approve', href: 'https://paypal.com/approve/ORDER-123' }]
      }), { status: 201 }));

    const result = await paypal.createOrder(ENV, {
      priceCents: 899,
      currency: 'USD',
      description: 'BaZi Report: Basic',
      referenceId: 'czy-bazi-basic-en-123'
    });

    expect(result.orderId).toBe('ORDER-123');
    expect(result.status).toBe('CREATED');
    expect(result.approveUrl).toContain('approve');
  });

  it('sends correct amount (cents → dollars)', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 'ORDER-456',
        status: 'CREATED',
        links: []
      }), { status: 201 }));

    await paypal.createOrder(ENV, {
      priceCents: 899,
      currency: 'USD',
      description: 'Test',
      referenceId: 'ref-1'
    });

    const body = JSON.parse(fetchSpy.mock.calls[1][1].body);
    expect(body.purchase_units[0].amount.value).toBe('8.99');
    expect(body.purchase_units[0].amount.currency_code).toBe('USD');
  });

  it('throws UpstreamError on PayPal failure', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(new Response('Bad Request', { status: 400 }));

    await expect(paypal.createOrder(ENV, {
      priceCents: 899, currency: 'USD', description: 'Test', referenceId: 'ref-1'
    })).rejects.toThrow('PayPal create order failed');
  });
});

describe('captureOrder', () => {
  it('captures an order and returns details', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 'ORDER-123',
        status: 'COMPLETED',
        payer: { email_address: 'buyer@example.com' },
        purchase_units: [{
          payments: {
            captures: [{
              id: 'CAPTURE-789',
              amount: { value: '8.99', currency_code: 'USD' }
            }]
          }
        }]
      }), { status: 201 }));

    const result = await paypal.captureOrder(ENV, 'ORDER-123');

    expect(result.orderId).toBe('ORDER-123');
    expect(result.status).toBe('COMPLETED');
    expect(result.payerEmail).toBe('buyer@example.com');
    expect(result.captureId).toBe('CAPTURE-789');
    expect(result.amount).toBe('8.99');
  });

  it('handles missing capture details gracefully', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 'ORDER-999',
        status: 'COMPLETED',
        purchase_units: [{}]
      }), { status: 200 }));

    const result = await paypal.captureOrder(ENV, 'ORDER-999');

    expect(result.captureId).toBeNull();
    expect(result.payerEmail).toBeNull();
    expect(result.amount).toBeNull();
  });

  it('throws UpstreamError on capture failure', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(new Response('Server Error', { status: 500 }));

    await expect(paypal.captureOrder(ENV, 'ORDER-123')).rejects.toThrow('PayPal capture failed');
  });
});
