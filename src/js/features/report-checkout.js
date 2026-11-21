/**
 * Report Checkout — PayPal Smart Buttons for PDF report purchases.
 *
 * Supports two report types:
 *   - BaZi report ($8.99): showReportOffer()
 *   - Compatibility report ($4.99): showCompatibilityOffer()
 *
 * Flow: CTA → PayPal buttons → create-order → approve → capture-order
 *       → poll report status → download PDF.
 *
 * English-only: skips entirely on zh-hant / zh-hans pages.
 */

import { track } from '../analytics.js';
import { escapeHtml } from '../utils/sanitise.js';

/* ── Constants ── */
const TEMPLATE_SLUG = 'bazi-basic-en';
const PRICE = '8.99';
const CURRENCY = 'USD';
const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 30;

/* ── PayPal SDK loader (singleton) ── */
let sdkPromise = null;

/**
 * Load the PayPal JS SDK once, returning a Promise that resolves
 * when window.paypal is available.
 *
 * @param {string} clientId — PayPal client ID
 * @returns {Promise<void>}
 */
function loadPayPalSdk(clientId) {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise(function (resolve, reject) {
    if (window.paypal) { resolve(); return; }

    var script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=' +
      encodeURIComponent(clientId) +
      '&currency=' + CURRENCY +
      '&intent=capture&disable-funding=credit,card';
    script.async = true;
    script.onload = function () { resolve(); };
    script.onerror = function () {
      sdkPromise = null;
      reject(new Error('Failed to load PayPal SDK'));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}

/* ── Language detection ── */
function detectLang() {
  var path = window.location.pathname;
  if (path.indexOf('/zh-hant/') === 0) return 'tc';
  if (path.indexOf('/zh-hans/') === 0) return 'sc';
  return 'en';
}

/* ── API helpers ── */
async function apiGet(url, checkoutToken) {
  var resp = await fetch(url, checkoutToken ? { headers: { Authorization: 'Bearer ' + checkoutToken } } : undefined);
  if (!resp.ok) throw new Error('Request failed: ' + resp.status);
  return resp.json();
}

async function apiPost(url, body) {
  var resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    var text = '';
    try { var errData = await resp.json(); text = errData.error?.message || resp.status; } catch (_) { text = resp.status; }
    throw new Error(text);
  }
  return resp.json();
}

/* ── DOM state helpers ── */
function setVisible(el, show) {
  if (el) el.style.display = show ? '' : 'none';
}

function setState(container, state, message) {
  var ctaContent = container.querySelector('.rc-cta-content');
  var loadingEl = container.querySelector('.rc-state-loading');
  var successEl = container.querySelector('.rc-state-success');
  var errorEl = container.querySelector('.rc-state-error');

  setVisible(ctaContent, state === 'idle');
  setVisible(loadingEl, state === 'loading');
  setVisible(successEl, state === 'success');
  setVisible(errorEl, state === 'error');

  if (state === 'loading' && loadingEl) {
    loadingEl.querySelector('.rc-loading-text').textContent = message || 'Processing\u2026';
  }
  if (state === 'error' && errorEl) {
    errorEl.querySelector('.rc-error-text').textContent = message || 'Something went wrong. Please try again.';
  }
}

/* ── Poll for report completion ── */
async function pollReport(workerUrl, jobId, checkoutToken, container) {
  var attempts = 0;

  while (attempts < MAX_POLL_ATTEMPTS) {
    attempts++;
    setState(container, 'loading', 'Generating your report\u2026 (' + attempts + '/' + MAX_POLL_ATTEMPTS + ')');

    try {
      var result = await apiGet(workerUrl + '/v1/reports/' + jobId, checkoutToken);
      var data = result.data;

      if (data.status === 'completed') {
        return workerUrl + '/v1/reports/' + jobId + '/download';
      }
      if (data.status === 'failed') {
        throw new Error(data.error || 'Report generation failed');
      }
    } catch (err) {
      if (attempts >= MAX_POLL_ATTEMPTS) throw err;
    }

    await new Promise(function (r) { setTimeout(r, POLL_INTERVAL_MS); });
  }

  throw new Error('Report generation timed out. Please contact support.');
}

/* ── Authenticated PDF download; never put checkout secrets in URLs ── */
function attachReportDownload(wrapper, url, checkoutToken) {
  var link = wrapper.querySelector('.rc-download-link');
  link.href = '#';
  link.onclick = async function (event) {
    event.preventDefault();
    try {
      var response = await fetch(url, {
        headers: { Authorization: 'Bearer ' + checkoutToken }
      });
      if (!response.ok) throw new Error('Download failed: ' + response.status);
      var blob = await response.blob();
      var objectUrl = URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'chinese-zodiac-report.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 60000);
    } catch (err) {
      setState(wrapper, 'error', 'PDF download failed. Please contact support.');
    }
  };
}

/* ── Main entry point ── */

/**
 * Show the report purchase CTA after a BaZi chart result.
 *
 * @param {string} workerUrl — Worker base URL (no trailing slash)
 * @param {Object} baziPayload — original birth data from the form
 * @param {HTMLElement} containerEl — the #bazi-result element to append to
 */
export function showReportOffer(workerUrl, baziPayload, containerEl) {
  // English-only
  if (detectLang() !== 'en') return;

  // Normalise worker URL
  var baseUrl = workerUrl.replace(/\/+$/, '');

  // Remove any previous CTA
  var existing = containerEl.querySelector('.report-checkout');
  if (existing) existing.remove();

  // Build CTA DOM
  var wrapper = document.createElement('div');
  wrapper.className = 'report-checkout';
  wrapper.innerHTML =
    '<div class="rc-cta-content">' +
      '<div class="rc-header">' +
        '<h4>Get Your Personal BaZi Report</h4>' +
        '<p class="rc-price">$' + PRICE + ' <span class="rc-currency">' + CURRENCY + '</span></p>' +
      '</div>' +
      '<ul class="rc-features">' +
        '<li>Detailed Day Master personality analysis</li>' +
        '<li>Career, relationship, and health insights</li>' +
        '<li>Major Luck Cycles (Da Yun) breakdown</li>' +
        '<li>2026 forecast for your chart</li>' +
        '<li>Professional PDF download \u2014 yours to keep</li>' +
      '</ul>' +
      '<div id="paypal-button-container" class="rc-paypal-buttons"></div>' +
      '<p class="rc-guarantee">Instant delivery \u00B7 Secure PayPal checkout</p>' +
    '</div>' +
    '<div class="rc-state-loading" style="display:none">' +
      '<div class="bazi-loading rc-loading-text">Processing\u2026</div>' +
    '</div>' +
    '<div class="rc-state-success" style="display:none">' +
      '<div class="rc-success-content">' +
        '<div class="rc-success-icon">\u2713</div>' +
        '<h4>Payment Successful!</h4>' +
        '<p>Your personal BaZi report is ready.</p>' +
        '<a class="btn btn-primary rc-download-link" download>Download Your Report (PDF)</a>' +
      '</div>' +
    '</div>' +
    '<div class="rc-state-error" style="display:none">' +
      '<div class="rc-error-content">' +
        '<p class="rc-error-text">Something went wrong.</p>' +
        '<button class="btn btn-primary rc-retry-btn" type="button">Try Again</button>' +
      '</div>' +
    '</div>';

  containerEl.appendChild(wrapper);

  // Retry button resets to idle
  wrapper.querySelector('.rc-retry-btn').addEventListener('click', function () {
    setState(wrapper, 'idle');
  });

  // Fetch client ID and initialise PayPal buttons
  initPayPalButtons(baseUrl, baziPayload, wrapper);
}

async function initPayPalButtons(baseUrl, baziPayload, wrapper) {
  try {
    // Fetch PayPal client ID
    var clientData = await apiGet(baseUrl + '/v1/checkout/client-id');
    var clientId = clientData.data.clientId;

    if (!clientId) {
      setState(wrapper, 'error', 'Payment system is not available. Please try again later.');
      return;
    }

    // Load PayPal SDK
    await loadPayPalSdk(clientId);

    var buttonContainer = wrapper.querySelector('#paypal-button-container');
    if (!buttonContainer || !window.paypal) return;

    // Render Smart Buttons
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        height: 45
      },

      createOrder: async function () {
        // GA4: begin_checkout
        track('begin_checkout', {
          currency: CURRENCY,
          value: parseFloat(PRICE),
          items: [{ item_name: 'BaZi Four Pillars Report', price: PRICE, quantity: 1 }]
        });

        var result = await apiPost(baseUrl + '/v1/checkout/create-order', {
          templateSlug: TEMPLATE_SLUG
        });
        wrapper.dataset.checkoutToken = result.data.checkoutToken;
        return result.data.orderId;
      },

      onApprove: async function (data) {
        setState(wrapper, 'loading', 'Capturing payment\u2026');

        try {
          var captureResult = await apiPost(baseUrl + '/v1/checkout/capture-order', {
            orderId: data.orderID,
            checkoutToken: wrapper.dataset.checkoutToken,
            baziData: {
              templateSlug: TEMPLATE_SLUG,
              year: baziPayload.year,
              month: baziPayload.month,
              day: baziPayload.day,
              hour: baziPayload.hour,
              minute: baziPayload.minute,
              lat: baziPayload.lat,
              lng: baziPayload.lng,
              tz: baziPayload.tz,
              sex: baziPayload.sex
            }
          });

          var captureData = captureResult.data;

          // GA4: purchase
          track('purchase', {
            transaction_id: captureData.captureId || captureData.orderId,
            value: parseFloat(PRICE),
            currency: CURRENCY,
            items: [{ item_name: 'BaZi Four Pillars Report', price: PRICE, quantity: 1 }]
          });

          // Get download URL
          var downloadUrl;
          if (captureData.reportStatus === 'completed') {
            downloadUrl = baseUrl + '/v1/reports/' + captureData.reportJobId + '/download';
          } else {
            // Poll for completion
            downloadUrl = await pollReport(baseUrl, captureData.reportJobId, wrapper.dataset.checkoutToken, wrapper);
          }

          // Show success + download link
          var dlLink = wrapper.querySelector('.rc-download-link');
          attachReportDownload(wrapper, downloadUrl, wrapper.dataset.checkoutToken);
          setState(wrapper, 'success');

          track('report_download_ready', {
            event_category: 'Revenue',
            event_label: TEMPLATE_SLUG,
            job_id: captureData.reportJobId
          });

        } catch (err) {
          setState(wrapper, 'error', 'Payment was processed but report generation failed: ' + err.message + '. Please contact support.');
          track('report_generation_error', {
            event_category: 'Revenue',
            event_label: err.message.substring(0, 80)
          });
        }
      },

      onCancel: function () {
        track('checkout_cancelled', {
          event_category: 'Revenue',
          event_label: TEMPLATE_SLUG
        });
      },

      onError: function (err) {
        setState(wrapper, 'error', 'Payment could not be completed. Please try again.');
        track('checkout_error', {
          event_category: 'Revenue',
          event_label: String(err).substring(0, 80)
        });
      }

    }).render('#paypal-button-container');

  } catch (err) {
    setState(wrapper, 'error', 'Could not load payment system. Please try again later.');
  }
}

/* ── Compatibility Report ── */
const COMPAT_TEMPLATE_SLUG = 'compat-en';
const COMPAT_PRICE = '4.99';

/**
 * Show the compatibility report purchase CTA on a pair page or after
 * the compatibility checker result.
 *
 * @param {string} workerUrl — Worker base URL (no trailing slash)
 * @param {Object} pairData — pair data object (animalA, animalB, relType, etc.)
 * @param {HTMLElement} containerEl — element to append the CTA to
 */
export function showCompatibilityOffer(workerUrl, pairData, containerEl) {
  // English-only
  if (detectLang() !== 'en') return;

  var baseUrl = workerUrl.replace(/\/+$/, '');

  // Remove any previous CTA
  var existing = containerEl.querySelector('.report-checkout');
  if (existing) existing.remove();

  // Derive pair slug from animal names
  var pairSlug = (pairData.animalA + '-' + pairData.animalB).toLowerCase();

  // Build CTA DOM
  var wrapper = document.createElement('div');
  wrapper.className = 'report-checkout report-checkout--compat';
  wrapper.innerHTML =
    '<div class="rc-cta-content">' +
      '<div class="rc-header">' +
        '<h4>Get Your Detailed Compatibility Report</h4>' +
        '<p class="rc-price">$' + COMPAT_PRICE + ' <span class="rc-currency">' + CURRENCY + '</span></p>' +
      '</div>' +
      '<ul class="rc-features">' +
        '<li>In-depth relationship dynamics analysis</li>' +
        '<li>Five Element interaction breakdown</li>' +
        '<li>Love &amp; romance compatibility guide</li>' +
        '<li>Career &amp; business partnership insights</li>' +
        '<li>Communication &amp; conflict resolution tips</li>' +
        '<li>Professional PDF download \u2014 yours to keep</li>' +
      '</ul>' +
      '<div id="paypal-compat-buttons" class="rc-paypal-buttons"></div>' +
      '<p class="rc-guarantee">Instant delivery \u00B7 Secure PayPal checkout</p>' +
    '</div>' +
    '<div class="rc-state-loading" style="display:none">' +
      '<div class="bazi-loading rc-loading-text">Processing\u2026</div>' +
    '</div>' +
    '<div class="rc-state-success" style="display:none">' +
      '<div class="rc-success-content">' +
        '<div class="rc-success-icon">\u2713</div>' +
        '<h4>Payment Successful!</h4>' +
        '<p>Your compatibility report is ready.</p>' +
        '<a class="btn btn-primary rc-download-link" download>Download Your Report (PDF)</a>' +
      '</div>' +
    '</div>' +
    '<div class="rc-state-error" style="display:none">' +
      '<div class="rc-error-content">' +
        '<p class="rc-error-text">Something went wrong.</p>' +
        '<button class="btn btn-primary rc-retry-btn" type="button">Try Again</button>' +
      '</div>' +
    '</div>';

  containerEl.appendChild(wrapper);

  // Retry button resets to idle
  wrapper.querySelector('.rc-retry-btn').addEventListener('click', function () {
    setState(wrapper, 'idle');
  });

  // Fetch client ID and initialise PayPal buttons
  initCompatPayPalButtons(baseUrl, pairSlug, pairData, wrapper);
}

async function initCompatPayPalButtons(baseUrl, pairSlug, pairData, wrapper) {
  try {
    var clientData = await apiGet(baseUrl + '/v1/checkout/client-id');
    var clientId = clientData.data.clientId;

    if (!clientId) {
      setState(wrapper, 'error', 'Payment system is not available. Please try again later.');
      return;
    }

    await loadPayPalSdk(clientId);

    var buttonContainer = wrapper.querySelector('#paypal-compat-buttons');
    if (!buttonContainer || !window.paypal) return;

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        height: 45
      },

      createOrder: async function () {
        track('begin_checkout', {
          currency: CURRENCY,
          value: parseFloat(COMPAT_PRICE),
          items: [{ item_name: 'Compatibility Report', price: COMPAT_PRICE, quantity: 1 }]
        });

        var result = await apiPost(baseUrl + '/v1/checkout/create-order', {
          templateSlug: COMPAT_TEMPLATE_SLUG
        });
        wrapper.dataset.checkoutToken = result.data.checkoutToken;
        return result.data.orderId;
      },

      onApprove: async function (data) {
        setState(wrapper, 'loading', 'Capturing payment\u2026');

        try {
          var captureResult = await apiPost(baseUrl + '/v1/checkout/capture-order', {
            orderId: data.orderID,
            checkoutToken: wrapper.dataset.checkoutToken,
            compatibilityData: {
              templateSlug: COMPAT_TEMPLATE_SLUG,
              pairSlug: pairSlug,
              locale: 'en',
              pairData: pairData
            }
          });

          var captureData = captureResult.data;

          track('purchase', {
            transaction_id: captureData.captureId || captureData.orderId,
            value: parseFloat(COMPAT_PRICE),
            currency: CURRENCY,
            items: [{ item_name: 'Compatibility Report', price: COMPAT_PRICE, quantity: 1 }]
          });

          var downloadUrl;
          if (captureData.reportStatus === 'completed') {
            downloadUrl = baseUrl + '/v1/reports/' + captureData.reportJobId + '/download';
          } else {
            downloadUrl = await pollReport(baseUrl, captureData.reportJobId, wrapper.dataset.checkoutToken, wrapper);
          }

          var dlLink = wrapper.querySelector('.rc-download-link');
          attachReportDownload(wrapper, downloadUrl, wrapper.dataset.checkoutToken);
          setState(wrapper, 'success');

          track('report_download_ready', {
            event_category: 'Revenue',
            event_label: COMPAT_TEMPLATE_SLUG,
            job_id: captureData.reportJobId
          });

        } catch (err) {
          setState(wrapper, 'error', 'Payment was processed but report generation failed: ' + err.message + '. Please contact support.');
          track('report_generation_error', {
            event_category: 'Revenue',
            event_label: err.message.substring(0, 80)
          });
        }
      },

      onCancel: function () {
        track('checkout_cancelled', {
          event_category: 'Revenue',
          event_label: COMPAT_TEMPLATE_SLUG
        });
      },

      onError: function (err) {
        setState(wrapper, 'error', 'Payment could not be completed. Please try again.');
        track('checkout_error', {
          event_category: 'Revenue',
          event_label: String(err).substring(0, 80)
        });
      }

    }).render('#paypal-compat-buttons');

  } catch (err) {
    setState(wrapper, 'error', 'Could not load payment system. Please try again later.');
  }
}
