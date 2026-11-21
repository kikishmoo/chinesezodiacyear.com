/**
 * Checkout route handler unit tests.
 *
 * Mocks PayPal service, repositories, and report service
 * to test HTTP-level behaviour of each handler.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────
vi.mock('../../services/paypal.js', () => ({
  createOrder: vi.fn(),
  captureOrder: vi.fn()
}));

vi.mock('../../repositories/report-templates-repository.js', () => ({
  createReportTemplatesRepository: vi.fn()
}));

vi.mock('../../repositories/transaction-repository.js', () => ({
  createTransaction: vi.fn(),
  getTransactionByProviderId: vi.fn(),
  updateTransactionStatus: vi.fn()
}));

vi.mock('../../services/report-service.js', () => ({
  requestReport: vi.fn()
}));

vi.mock('../../models/report-request.js', () => ({
  validateReportRequest: vi.fn((data) => data)
}));

vi.mock('../../models/compatibility-report-request.js', () => ({
  validateCompatibilityReportRequest: vi.fn((data) => data)
}));

vi.mock('../../lib/checkout-token.js', () => ({
  createCheckoutToken: vi.fn(() => 'a'.repeat(64)),
  hashCheckoutToken: vi.fn(async () => 'b'.repeat(64)),
  checkoutTokenMatches: vi.fn(async (token, hash) =>
    token === 'a'.repeat(64) && hash === 'b'.repeat(64))
}));
import { handleGetClientId, handleCreateOrder, handleCaptureOrder } from '../../routes/checkout.js';
import { createOrder, captureOrder } from '../../services/paypal.js';
import { createReportTemplatesRepository } from '../../repositories/report-templates-repository.js';
import { createTransaction, getTransactionByProviderId, updateTransactionStatus } from '../../repositories/transaction-repository.js';
import { requestReport } from '../../services/report-service.js';

const CORS = { 'Access-Control-Allow-Origin': '*' };

const TOKEN = 'a'.repeat(64);
const HASH = 'b'.repeat(64);
const pending = { id: 'tx-1', status: 'pending', template_slug: 'bazi-basic-en',
  checkout_token_hash: HASH, amount_cents: 899, currency: 'USD' };
function makeRequest(body) {
  return { json: () => Promise.resolve(body) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── handleGetClientId ──────────────────────────────────

describe('handleGetClientId', () => {
  it('returns client ID and mode', async () => {
    const env = { PAYPAL_CLIENT_ID: 'CLIENT-123', PAYPAL_MODE: 'sandbox' };
    const resp = await handleGetClientId({}, env, CORS);
    const data = await resp.json();

    expect(resp.status).toBe(200);
    expect(data.data.clientId).toBe('CLIENT-123');
    expect(data.data.mode).toBe('sandbox');
  });

  it('returns live mode when configured', async () => {
    const env = { PAYPAL_CLIENT_ID: 'CLIENT-LIVE', PAYPAL_MODE: 'live' };
    const resp = await handleGetClientId({}, env, CORS);
    const data = await resp.json();

    expect(data.data.mode).toBe('live');
  });

  it('throws when PAYPAL_CLIENT_ID is missing', async () => {
    await expect(handleGetClientId({}, {}, CORS)).rejects.toThrow('PayPal is not configured');
  });
});

// ── handleCreateOrder ──────────────────────────────────

describe('handleCreateOrder', () => {
  const mockTemplate = {
    id: 'tpl_1',
    slug: 'bazi-basic-en',
    title: 'BaZi Basic',
    is_active: 1,
    price_cents: 899,
    currency: 'USD'
  };

  it('creates a PayPal order for a valid template', async () => {
    const mockRepo = { getBySlug: vi.fn().mockResolvedValue(mockTemplate) };
    createReportTemplatesRepository.mockReturnValue(mockRepo);
    createOrder.mockResolvedValue({ orderId: 'ORDER-1', status: 'CREATED' });
    createTransaction.mockResolvedValue();

    const req = makeRequest({ templateSlug: 'bazi-basic-en' });
    const resp = await handleCreateOrder(req, {}, CORS);
    const data = await resp.json();

    expect(resp.status).toBe(201);
    expect(data.data.orderId).toBe('ORDER-1');
    expect(createOrder).toHaveBeenCalledOnce();
    expect(createTransaction).toHaveBeenCalledOnce();
  });

  it('throws when templateSlug is missing', async () => {
    const req = makeRequest({});
    await expect(handleCreateOrder(req, {}, CORS)).rejects.toThrow('templateSlug is required');
  });

  it('throws when template not found', async () => {
    const mockRepo = { getBySlug: vi.fn().mockResolvedValue(null) };
    createReportTemplatesRepository.mockReturnValue(mockRepo);

    const req = makeRequest({ templateSlug: 'nonexistent' });
    await expect(handleCreateOrder(req, {}, CORS)).rejects.toThrow('not found or inactive');
  });

  it('throws when template has no price', async () => {
    const noPriceTemplate = { ...mockTemplate, price_cents: 0 };
    const mockRepo = { getBySlug: vi.fn().mockResolvedValue(noPriceTemplate) };
    createReportTemplatesRepository.mockReturnValue(mockRepo);

    const req = makeRequest({ templateSlug: 'bazi-basic-en' });
    await expect(handleCreateOrder(req, {}, CORS)).rejects.toThrow('no price configured');
  });

  it('records a pending transaction with correct amount', async () => {
    const mockRepo = { getBySlug: vi.fn().mockResolvedValue(mockTemplate) };
    createReportTemplatesRepository.mockReturnValue(mockRepo);
    createOrder.mockResolvedValue({ orderId: 'ORDER-2', status: 'CREATED' });
    createTransaction.mockResolvedValue();

    const req = makeRequest({ templateSlug: 'bazi-basic-en' });
    await handleCreateOrder(req, {}, CORS);

    const txArg = createTransaction.mock.calls[0][1];
    expect(txArg.amountCents).toBe(899);
    expect(txArg.currency).toBe('USD');
    expect(txArg.status).toBe('pending');
    expect(txArg.providerTransactionId).toBe('ORDER-2');
  });
});

// ── handleCaptureOrder ─────────────────────────────────

describe('handleCaptureOrder', () => {
  const baziData = {
    templateSlug: 'bazi-basic-en',
    year: 1990, month: 6, day: 15,
    hour: 14, minute: 30
  };

  it('captures payment and triggers report generation', async () => {
    getTransactionByProviderId.mockResolvedValue(pending);
    captureOrder.mockResolvedValue({ orderId: 'ORDER-1', status: 'COMPLETED', captureId: 'CAP-1', amount: '8.99', currency: 'USD' });
    requestReport.mockResolvedValue({ jobId: 'job-1', status: 'queued' });
    updateTransactionStatus.mockResolvedValue();

    const req = makeRequest({ orderId: 'ORDER-1', checkoutToken: TOKEN, baziData });
    const resp = await handleCaptureOrder(req, {}, CORS);
    const data = await resp.json();

    expect(resp.status).toBe(200);
    expect(data.data.paymentStatus).toBe('paid');
    expect(data.data.captureId).toBe('CAP-1');
    expect(data.data.reportJobId).toBe('job-1');
    expect(updateTransactionStatus).toHaveBeenCalledWith({}, 'tx-1', 'paid', expect.objectContaining({
      reportJobId: 'job-1'
    }));
  });

  it('returns existing data if already captured', async () => {
    getTransactionByProviderId.mockResolvedValue({ ...pending, status: 'paid', report_job_id: 'job-existing' });

    const req = makeRequest({ orderId: 'ORDER-1', checkoutToken: TOKEN, baziData });
    const resp = await handleCaptureOrder(req, {}, CORS);
    const data = await resp.json();

    expect(resp.status).toBe(200);
    expect(data.data.message).toBe('Payment already captured');
    expect(data.data.reportJobId).toBe('job-existing');
    expect(captureOrder).not.toHaveBeenCalled();
  });

  it('returns 422 when payment not completed', async () => {
    getTransactionByProviderId.mockResolvedValue(pending);
    captureOrder.mockResolvedValue({ status: 'PENDING', captureId: null });

    const req = makeRequest({ orderId: 'ORDER-1', checkoutToken: TOKEN, baziData });
    const resp = await handleCaptureOrder(req, {}, CORS);
    const data = await resp.json();

    expect(resp.status).toBe(422);
    expect(data.error.code).toBe('PaymentNotCompleted');
  });

  it('throws when orderId is missing', async () => {
    const req = makeRequest({ baziData });
    await expect(handleCaptureOrder(req, {}, CORS)).rejects.toThrow('orderId is required');
  });

  it('throws when both baziData and compatibilityData are missing', async () => {
    const req = makeRequest({ orderId: 'ORDER-1' });
    await expect(handleCaptureOrder(req, {}, CORS)).rejects.toThrow('baziData or compatibilityData is required');
  });

  it('captures payment with compatibilityData', async () => {
    const compatibilityData = {
      templateSlug: 'compat-en',
      pairSlug: 'dragon-rooster',
      locale: 'en',
      pairData: { animalA: 'Dragon', animalB: 'Rooster', relType: 'liuHe' }
    };

    getTransactionByProviderId.mockResolvedValue({ ...pending, id: 'tx-c1', template_slug: 'compat-en', amount_cents: 499 });
    captureOrder.mockResolvedValue({ orderId: 'ORDER-C1', status: 'COMPLETED', captureId: 'CAP-C1', amount: '4.99', currency: 'USD' });
    requestReport.mockResolvedValue({ jobId: 'job-c1', status: 'queued' });
    updateTransactionStatus.mockResolvedValue();

    const req = makeRequest({ orderId: 'ORDER-C1', checkoutToken: TOKEN, compatibilityData });
    const resp = await handleCaptureOrder(req, {}, CORS);
    const data = await resp.json();

    expect(resp.status).toBe(200);
    expect(data.data.paymentStatus).toBe('paid');
    expect(data.data.reportJobId).toBe('job-c1');
    expect(requestReport).toHaveBeenCalledWith({}, compatibilityData);
  });

  it('rejects orders not created on the site', async () => {
    getTransactionByProviderId.mockResolvedValue(null);
    const resp = await handleCaptureOrder(makeRequest({
      orderId: 'unknown', checkoutToken: TOKEN, baziData
    }), {}, CORS);
    expect(resp.status).toBe(404);
    expect(captureOrder).not.toHaveBeenCalled();
  });

  it('rejects a mismatched checkout claim without payment', async () => {
    getTransactionByProviderId.mockResolvedValue(pending);
    const resp = await handleCaptureOrder(makeRequest({
      orderId: 'ORDER-1', checkoutToken: 'wrong', baziData
    }), {}, CORS);
    expect(resp.status).toBe(404);
    expect(captureOrder).not.toHaveBeenCalled();
  });

  it('blocks changing the product after the order is created', async () => {
    getTransactionByProviderId.mockResolvedValue(pending);
    await expect(handleCaptureOrder(makeRequest({
      orderId: 'ORDER-1', checkoutToken: TOKEN,
      compatibilityData: { templateSlug: 'compat-en' }
    }), {}, CORS)).rejects.toThrow('Report type does not match');
    expect(captureOrder).not.toHaveBeenCalled();
  });

  it('keeps the paid state if PDF generation fails', async () => {
    getTransactionByProviderId.mockResolvedValue(pending);
    captureOrder.mockResolvedValue({ orderId: 'ORDER-1', status: 'COMPLETED',
      amount: '8.99', currency: 'USD' });
    requestReport.mockRejectedValue(new Error('R2 failure'));
    await expect(handleCaptureOrder(makeRequest({
      orderId: 'ORDER-1', checkoutToken: TOKEN, baziData
    }), {}, CORS)).rejects.toThrow('R2 failure');
    expect(updateTransactionStatus).toHaveBeenCalledWith({},
      'tx-1', 'paid', expect.objectContaining({ paidAt: expect.any(String) }));
  });

  it('rejects the wrong captured amount without delivering a PDF', async () => {
    getTransactionByProviderId.mockResolvedValue(pending);
    captureOrder.mockResolvedValue({ orderId: 'ORDER-1', status: 'COMPLETED',
      amount: '4.99', currency: 'USD' });
    await expect(handleCaptureOrder(makeRequest({
      orderId: 'ORDER-1', checkoutToken: TOKEN, baziData
    }), {}, CORS)).rejects.toThrow('Captured payment does not match');
    expect(requestReport).not.toHaveBeenCalled();
  });

  it('retries an already-paid order without recapturing payment', async () => {
    getTransactionByProviderId.mockResolvedValue({ ...pending, status: 'paid', report_job_id: null });
    requestReport.mockResolvedValue({ jobId: 'recovered-job', status: 'completed' });
    const resp = await handleCaptureOrder(makeRequest({
      orderId: 'ORDER-1', checkoutToken: TOKEN, baziData
    }), {}, CORS);
    expect((await resp.json()).data.reportJobId).toBe('recovered-job');
    expect(captureOrder).not.toHaveBeenCalled();
  });

});
