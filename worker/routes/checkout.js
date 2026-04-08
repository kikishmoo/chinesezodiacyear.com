/**
 * Checkout Routes — PayPal payment flow for BaZi reports
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
    description: `BaZi Report: ${template.title}`,
    referenceId
  });

  // Record pending transaction
  await createTransaction(env, {
    id: crypto.randomUUID(),
    provider: 'paypal',
    providerTransactionId: result.orderId,
    reportJobId: null,
    amountCents: template.price_cents,
    currency: template.currency || 'USD',
    status: 'pending',
    paidAt: null
  });

  return Response.json(
    {
      data: {
        orderId: result.orderId,
        status: result.status
      }
    },
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * POST /v1/checkout/capture-order
 *
 * Body: { orderId: string, baziData: { templateSlug, year, month, day, ... } }
 *
 * Captures the PayPal payment, then triggers report generation.
 * Returns the report jobId for the frontend to poll/download.
 */
export async function handleCaptureOrder(request, env, corsHeaders) {
  const body = await request.json();
  const { orderId, baziData } = body;

  if (!orderId || typeof orderId !== 'string') {
    throw new ValidationError('orderId is required');
  }
  if (!baziData || typeof baziData !== 'object') {
    throw new ValidationError('baziData is required');
  }

  // Prevent double-capture: check if already paid
  const existingTx = await getTransactionByProviderId(env, orderId);
  if (existingTx && existingTx.status === 'paid') {
    // Already captured — return existing data
    return Response.json(
      {
        data: {
          orderId,
          paymentStatus: 'paid',
          reportJobId: existingTx.report_job_id,
          message: 'Payment already captured'
        }
      },
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Capture the PayPal payment
  const capture = await captureOrder(env, orderId);

  if (capture.status !== 'COMPLETED') {
    return Response.json(
      {
        error: {
          code: 'PaymentNotCompleted',
          message: `Payment status: ${capture.status}. Expected COMPLETED.`,
          retryable: false
        }
      },
      { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Validate and trigger report generation
  const reportInput = validateReportRequest(baziData);
  const reportResult = await requestReport(env, reportInput);

  // Update transaction with paid status and link to report job
  if (existingTx) {
    await updateTransactionStatus(env, existingTx.id, 'paid', {
      paidAt: new Date().toISOString(),
      reportJobId: reportResult.jobId
    });
  } else {
    // Transaction wasn't created in create-order (edge case) — create it now
    await createTransaction(env, {
      id: crypto.randomUUID(),
      provider: 'paypal',
      providerTransactionId: orderId,
      reportJobId: reportResult.jobId,
      amountCents: parseInt(capture.amount * 100) || 899,
      currency: 'USD',
      status: 'paid',
      paidAt: new Date().toISOString()
    });
  }

  return Response.json(
    {
      data: {
        orderId,
        paymentStatus: 'paid',
        captureId: capture.captureId,
        reportJobId: reportResult.jobId,
        reportStatus: reportResult.status
      }
    },
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
