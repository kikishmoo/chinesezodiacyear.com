/**
 * Checkout Routes — PayPal payment flow for reports
 *
 *   POST /v1/checkout/create-order   → Create PayPal order for a report template
 *   POST /v1/checkout/capture-order  → Capture approved PayPal payment + trigger report
 *   GET  /v1/checkout/client-id      → Return PayPal client ID for frontend SDK
 */

import { ValidationError } from '../models/errors.js';
import { createOrder, captureOrder } from '../services/paypal.js';
import { createReportTemplatesRepository } from '../repositories/report-templates-repository.js';
import { createTransaction, getTransactionByProviderId, updateTransactionStatus } from '../repositories/transaction-repository.js';
import { requestReport } from '../services/report-service.js';
import { validateReportRequest } from '../models/report-request.js';
import { validateCompatibilityReportRequest } from '../models/compatibility-report-request.js';
import { createCheckoutToken, hashCheckoutToken, checkoutTokenMatches } from '../lib/checkout-token.js';

/**
 * GET /v1/checkout/client-id
 *
 * Returns the PayPal client ID so the frontend can initialise the JS SDK.
 * No secrets exposed — client ID is public.
 */
export async function handleGetClientId(request, env, corsHeaders) {
  if (!env.PAYPAL_CLIENT_ID) {
    throw new ValidationError('PayPal is not configured');
  }

  return Response.json(
    {
      data: {
        clientId: env.PAYPAL_CLIENT_ID,
        mode: env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox'
      }
    },
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * POST /v1/checkout/create-order
 *
 * Body: { templateSlug: string }
 *
 * Looks up the template price, creates a PayPal order, returns orderId.
 */
export async function handleCreateOrder(request, env, corsHeaders) {
  const body = await request.json();
  const { templateSlug } = body;

  if (!templateSlug || typeof templateSlug !== 'string') {
    throw new ValidationError('templateSlug is required');
  }

  // Look up template to get price
  const templates = createReportTemplatesRepository(env);
  const template = await templates.getBySlug(templateSlug);

  if (!template || template.is_active !== 1) {
    throw new ValidationError(`Template "${templateSlug}" not found or inactive`);
  }

  if (!template.price_cents || template.price_cents <= 0) {
    throw new ValidationError(`Template "${templateSlug}" has no price configured`);
  }

  // Create PayPal order
  const referenceId = `czy-${templateSlug}-${Date.now()}`;
  const result = await createOrder(env, {
    priceCents: template.price_cents,
    currency: template.currency || 'USD',
    description: template.title,
    referenceId
  });

  // Browser-held bearer claim: do not persist the clear text token or put it in URLs.
  const checkoutToken = createCheckoutToken();
  const checkoutTokenHash = await hashCheckoutToken(checkoutToken);

  // Record pending transaction
  await createTransaction(env, {
    id: crypto.randomUUID(),
    provider: 'paypal',
    providerTransactionId: result.orderId,
    reportJobId: null,
    amountCents: template.price_cents,
    currency: template.currency || 'USD',
    status: 'pending',
    paidAt: null,
    checkoutTokenHash,
    templateSlug
  });

  return Response.json(
    {
      data: {
        orderId: result.orderId,
        checkoutToken,
        status: result.status
      }
    },
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * POST /v1/checkout/capture-order
 *
 * Body: { orderId: string, baziData?: {...}, compatibilityData?: {...} }
 *
 * Captures the PayPal payment, then triggers report generation.
 * Accepts either baziData (BaZi report) or compatibilityData (compatibility report).
 * Returns the report jobId for the frontend to poll/download.
 */
export async function handleCaptureOrder(request, env, corsHeaders) {
  const body = await request.json();
  const { orderId, checkoutToken, baziData, compatibilityData } = body;

  if (!orderId || typeof orderId !== 'string') {
    throw new ValidationError('orderId is required');
  }
  if (!baziData && !compatibilityData) {
    throw new ValidationError('baziData or compatibilityData is required');
  }
  if (baziData && compatibilityData) {
    throw new ValidationError('Provide only one report type');
  }

  // Validate all input BEFORE requesting payment capture.
  const reportInput = compatibilityData
    ? validateCompatibilityReportRequest(compatibilityData)
    : validateReportRequest(baziData);

  const existingTx = await getTransactionByProviderId(env, orderId);
  if (!existingTx || !await checkoutTokenMatches(checkoutToken, existingTx.checkout_token_hash)) {
    // Avoid revealing whether an order exists.
    return Response.json({ error: { code: 'NotFound', message: 'Order not found' } },
      { status: 404, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
  }
  // Prevent switching products after PayPal order creation.
  if (existingTx.template_slug !== reportInput.templateSlug) {
    throw new ValidationError('Report type does not match purchased product');
  }

  if (existingTx.status !== 'pending' && existingTx.status !== 'paid') {
    throw new ValidationError('Order is not eligible for capture');
  }

  let captureId = null;
  if (existingTx.status !== 'paid') {
    const capture = await captureOrder(env, orderId);
    if (capture.status !== 'COMPLETED') {
      return Response.json({
        error: {
          code: 'PaymentNotCompleted',
          message: `Payment status: ${capture.status}. Expected COMPLETED.`,
          retryable: false
        }
      }, { status: 422, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
    }

    // Cross-check the actual captured amount and currency against the
    // transaction established from the server-side product template.
    const amount = capture.amount;
    const cents = typeof amount === 'string' && /^\d+\.\d{2}$/.test(amount)
      ? Number(amount.replace('.', '')) : NaN;
    if (capture.orderId !== orderId ||
        cents !== existingTx.amount_cents ||
        capture.currency !== existingTx.currency) {
      // A captured payment requiring manual reconciliation must NOT fulfil
      // a mismatched order. Record the incident via operational logging.
      console.error('[Checkout] Captured PayPal order mismatch; reconciliation required', { orderId });
      throw new ValidationError('Captured payment does not match the purchased product; contact support');
    }

    captureId = capture.captureId;
    // Persist paid status BEFORE generating a PDF. A failed generation can
    // then be safely retried without capturing the customer twice.
    await updateTransactionStatus(env, existingTx.id, 'paid', {
      paidAt: new Date().toISOString()
    });
  }

  let reportJobId = existingTx.report_job_id;
  let reportStatus = 'completed';
  if (!reportJobId) {
    const reportResult = await requestReport(env, { ...reportInput, purchaseId: existingTx.id });
    reportJobId = reportResult.jobId;
    reportStatus = reportResult.status;
    await updateTransactionStatus(env, existingTx.id, 'paid', { reportJobId });
  }

  return Response.json({
    data: {
      orderId,
      paymentStatus: 'paid',
      captureId,
      reportJobId,
      reportStatus
    }
  }, {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
