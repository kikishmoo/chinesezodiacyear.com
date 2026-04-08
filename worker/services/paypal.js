/**
 * PayPal REST API Service
 *
 * Handles OAuth token management, order creation, and order capture.
 * Uses PayPal Orders v2 API.
 *
 * Env vars (Wrangler secrets):
 *   PAYPAL_CLIENT_ID     — REST API app client ID
 *   PAYPAL_CLIENT_SECRET — REST API app client secret
 *   PAYPAL_MODE          — 'sandbox' or 'live' (default: 'sandbox')
 */

import { ValidationError, UpstreamError } from '../models/errors.js';

const SANDBOX_URL = 'https://api-m.sandbox.paypal.com';
const LIVE_URL = 'https://api-m.paypal.com';

/** In-memory token cache (per isolate). */
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Get the PayPal API base URL.
 * @param {Record<string, unknown>} env
 * @returns {string}
 */
function getBaseUrl(env) {
  return env.PAYPAL_MODE === 'live' ? LIVE_URL : SANDBOX_URL;
}

/**
 * Validate PayPal credentials are configured.
 * @param {Record<string, unknown>} env
 */
function requireCredentials(env) {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    throw new ValidationError(
      'PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET as Wrangler secrets.'
    );
  }
}

/**
 * Get an OAuth2 access token from PayPal.
 * Cached in-memory until 5 minutes before expiry.
 *
 * @param {Record<string, unknown>} env
 * @returns {Promise<string>} access token
 */
export async function getAccessToken(env) {
  requireCredentials(env);

  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const baseUrl = getBaseUrl(env);
  const credentials = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);

  const resp = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new UpstreamError(
      `PayPal OAuth failed: ${resp.status} ${text.substring(0, 200)}`,
      { source: 'paypal' }
    );
  }

  const data = await resp.json();
  cachedToken = data.access_token;
  // Cache until 5 minutes before expiry
  tokenExpiresAt = now + (data.expires_in - 300) * 1000;

  return cachedToken;
}

/**
 * Create a PayPal order for a BaZi report purchase.
 *
 * @param {Record<string, unknown>} env
 * @param {{ priceCents: number, currency: string, description: string, referenceId: string }} opts
 * @returns {Promise<{ orderId: string, status: string, approveUrl: string|null }>}
 */
export async function createOrder(env, { priceCents, currency, description, referenceId }) {
  const token = await getAccessToken(env);
  const baseUrl = getBaseUrl(env);
  const amount = (priceCents / 100).toFixed(2);

  const orderPayload = {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: referenceId,
      description: description.substring(0, 127),
      amount: {
        currency_code: currency,
        value: amount
      }
    }],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: 'Chinese Zodiac Year',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: 'https://chinesezodiacyear.com/bazi-calculator/',
          cancel_url: 'https://chinesezodiacyear.com/bazi-calculator/'
        }
      }
    }
  };

  const resp = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': referenceId
    },
    body: JSON.stringify(orderPayload)
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new UpstreamError(
      `PayPal create order failed: ${resp.status} ${text.substring(0, 300)}`,
      { source: 'paypal' }
    );
  }

  const order = await resp.json();
  const approveLink = (order.links || []).find(l => l.rel === 'approve');

  return {
    orderId: order.id,
    status: order.status,
    approveUrl: approveLink ? approveLink.href : null
  };
}

/**
 * Capture an approved PayPal order (collect payment).
 *
 * @param {Record<string, unknown>} env
 * @param {string} orderId — PayPal order ID
 * @returns {Promise<{ orderId: string, status: string, payerEmail: string|null, captureId: string|null, amount: string|null }>}
 */
export async function captureOrder(env, orderId) {
  const token = await getAccessToken(env);
  const baseUrl = getBaseUrl(env);

  const resp = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new UpstreamError(
      `PayPal capture failed: ${resp.status} ${text.substring(0, 300)}`,
      { source: 'paypal' }
    );
  }

  const order = await resp.json();

  // Extract capture details from first purchase unit
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];

  return {
    orderId: order.id,
    status: order.status,
    payerEmail: order.payer?.email_address || null,
    captureId: capture?.id || null,
    amount: capture?.amount?.value || null
  };
}
