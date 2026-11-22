/**
 * PayPal SANDBOX read/create-only smoke test.
 * Explicitly fixed to api-m.sandbox.paypal.com; NEVER captures or approves
 * an order and NEVER sends production birth/customer information.
 *
 * Environment: PAYPAL_SANDBOX_CLIENT_ID and PAYPAL_SANDBOX_CLIENT_SECRET
 */
const base = 'https://api-m.sandbox.paypal.com';
const id = process.env.PAYPAL_SANDBOX_CLIENT_ID;
const secret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET;

if (!id || !secret) {
  console.error('Missing PAYPAL_SANDBOX_CLIENT_ID or PAYPAL_SANDBOX_CLIENT_SECRET GitHub Actions secrets.');
  process.exit(1);
}

const timeout = AbortSignal.timeout(15000);
const basic = Buffer.from(`${id}:${secret}`).toString('base64');
const auth = await fetch(`${base}/v1/oauth2/token`, {
  method: 'POST',
  headers: {
    Authorization: `Basic ${basic}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials',
  signal: timeout
});
if (!auth.ok) throw new Error(`Sandbox OAuth failed with HTTP ${auth.status}`);
const { access_token: token } = await auth.json();
if (!token) throw new Error('Sandbox OAuth returned no access token');
console.log('[ok] PayPal sandbox OAuth accepted configured sandbox credentials');

for (const item of [
  { sku: 'bazi-basic-en', value: '8.99' },
  { sku: 'compat-en', value: '4.99' }
]) {
  const amount = { currency_code: 'USD', value: item.value };
  const reference = `czy-smoke-${crypto.randomUUID()}`;
  const orderResponse = await fetch(`${base}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': reference
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: reference,
        description: `Chinese Zodiac Year Sandbox Test ${item.sku}`,
        amount
      }]
    }),
    signal: AbortSignal.timeout(15000)
  });
  if (!orderResponse.ok) {
    throw new Error(`Sandbox create-order failed for ${item.sku} with HTTP ${orderResponse.status}`);
  }
  const created = await orderResponse.json();
  if (!created.id || created.status !== 'CREATED') {
    throw new Error(`Unexpected sandbox order creation response for ${item.sku}`);
  }
  const detailResponse = await fetch(
    `${base}/v2/checkout/orders/${encodeURIComponent(created.id)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000)
    }
  );
  if (!detailResponse.ok) throw new Error(`Sandbox get-order HTTP ${detailResponse.status}`);
  const detail = await detailResponse.json();
  const seen = detail.purchase_units?.[0]?.amount;
  if (seen?.currency_code !== 'USD' || seen?.value !== item.value) {
    throw new Error(`Sandbox order price mismatch for ${item.sku}`);
  }
  if (detail.status !== 'CREATED') {
    throw new Error(`Sandbox order in unexpected state ${detail.status}`);
  }
  console.log(`[ok] ${item.sku}: sandbox order created, verified price USD ${item.value}; no approval or capture`);
}
console.log('[done] Sandbox-only no-charge smoke test passed. Full payment capture and report fulfilment NOT tested.');
