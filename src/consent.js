/**
 * Consent gate for optional site-wide third-party tags.
 * Versioned first-party preference; default is no optional tracking.
 * This is an engineering control, not a substitute for legal review/CMP certification.
 */
(() => {
  'use strict';
  const script = document.currentScript;
  const config = {
    ga4: script?.dataset.ga4Id || '',
    meta: script?.dataset.facebookPixelId || '',
    clarity: script?.dataset.clarityId || '',
    adsense: script?.dataset.adsenseId || ''
  };
  const key = 'czy-consent-v1';
  let preference = null;
  let loaded = false;
  const messages = {
    en: {
      title: 'Your privacy choices',
      detail: 'Optional analytics (Google Analytics and Microsoft Clarity) and advertising services (Google AdSense and Meta Pixel) load only after your choice. Essential site functions remain available.',
      analytics: 'Allow analytics', marketing: 'Allow advertising / marketing',
      reject: 'Reject optional', analyticsOnly: 'Analytics only', accept: 'Accept all',
      save: 'Save choices', settings: 'Privacy settings'
    },
    tc: {
      title: '您的私隱選擇',
      detail: '可選的分析服務（Google Analytics、Microsoft Clarity）及廣告服務（Google AdSense、Meta Pixel）僅在您同意後載入。網站基本功能不受影響。',
      analytics: '允許分析', marketing: '允許廣告／行銷',
      reject: '拒絕非必要服務', analyticsOnly: '僅允許分析', accept: '全部允許',
      save: '儲存選擇', settings: '私隱設定'
    },
    sc: {
      title: '您的隐私选择',
      detail: '可选的分析服务（Google Analytics、Microsoft Clarity）及广告服务（Google AdSense、Meta Pixel）仅在您同意后加载。网站基本功能不受影响。',
      analytics: '允许分析', marketing: '允许广告／营销',
      reject: '拒绝非必要服务', analyticsOnly: '仅允许分析', accept: '全部允许',
      save: '保存选择', settings: '隐私设置'
    }
  };
  const locale = document.documentElement.getAttribute('data-lang') || 'en';
  const strings = messages[locale] || messages.en;

  function read() {
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      if (stored?.version === 1 && typeof stored.analytics === 'boolean' && typeof stored.marketing === 'boolean') return stored;
    } catch (_) { /* storage may be blocked or corrupt */ }
    return null;
  }
  function loadScript(src, attrs = {}) {
    const el = document.createElement('script');
    el.async = true;
    el.src = src;
    Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
    document.head.appendChild(el);
  }
  function activate() {
    if (!preference || loaded) return;
    loaded = true;
    if (preference.analytics) {
      if (config.ga4) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', config.ga4, {
          allow_google_signals: false,
          allow_ad_personalization_signals: false
        });
        loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.ga4));
      }
      if (config.clarity) {
        window.clarity = window.clarity || function () {
          (window.clarity.q = window.clarity.q || []).push(arguments);
        };
        loadScript('https://www.clarity.ms/tag/' + encodeURIComponent(config.clarity));
      }
    }
    if (preference.marketing) {
      if (config.meta) {
        window.fbq = window.fbq || function () {
          (window.fbq.queue = window.fbq.queue || []).push(arguments);
        };
        window.fbq('init', config.meta);
        window.fbq('track', 'PageView');
        loadScript('https://connect.facebook.net/en_US/fbevents.js');
      }
      if (config.adsense) {
        loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(config.adsense),
          { crossorigin: 'anonymous' });
      }
    }
  }
  function store(next) {
    const changed = preference && (preference.analytics !== next.analytics || preference.marketing !== next.marketing);
    preference = { version: 1, analytics: next.analytics, marketing: next.marketing };
    try { localStorage.setItem(key, JSON.stringify(preference)); } catch (_) {}
    // Scripts already loaded cannot be reliably unloaded; restart to enforce revocation.
    if (changed) { window.location.reload(); return; }
    activate();
    const panel = document.getElementById('czy-consent-panel');
    if (panel) panel.hidden = true;
  }
  function render() {
    const panel = document.createElement('section');
    panel.id = 'czy-consent-panel';
    panel.className = 'czy-consent-panel';
    panel.setAttribute('aria-labelledby', 'czy-consent-heading');
    panel.innerHTML =
      '<h2 id="czy-consent-heading"></h2><p class="czy-consent-description"></p>' +
      '<div class="czy-consent-options">' +
      '<label><input id="czy-analytics" type="checkbox"> <span id="czy-analytics-label"></span></label>' +
      '<label><input id="czy-marketing" type="checkbox"> <span id="czy-marketing-label"></span></label></div>' +
      '<div class="czy-consent-actions">' +
      '<button type="button" data-choice="reject"></button>' +
      '<button type="button" data-choice="analytics"></button>' +
      '<button type="button" data-choice="accept"></button>' +
      '<button type="button" data-choice="save"></button></div>' +
      '<p><a href="/about/#privacy">Privacy policy / 隱私政策 / 隐私政策</a></p>';
    panel.querySelector('#czy-consent-heading').textContent = strings.title;
    panel.querySelector('.czy-consent-description').textContent = strings.detail;
    panel.querySelector('#czy-analytics-label').textContent = strings.analytics;
    panel.querySelector('#czy-marketing-label').textContent = strings.marketing;
    const labels = { reject: strings.reject, analytics: strings.analyticsOnly, accept: strings.accept, save: strings.save };
    Object.entries(labels).forEach(([name, text]) => {
      panel.querySelector('[data-choice="' + name + '"]').textContent = text;
    });
    function show() {
      panel.hidden = false;
      panel.querySelector('#czy-analytics').checked = !!preference?.analytics;
      panel.querySelector('#czy-marketing').checked = !!preference?.marketing;
    }
    panel.addEventListener('click', event => {
      const button = event.target.closest('[data-choice]');
      if (!button) return;
      if (button.dataset.choice === 'reject') store({ analytics: false, marketing: false });
      if (button.dataset.choice === 'analytics') store({ analytics: true, marketing: false });
      if (button.dataset.choice === 'accept') store({ analytics: true, marketing: true });
      if (button.dataset.choice === 'save') store({
        analytics: panel.querySelector('#czy-analytics').checked,
        marketing: panel.querySelector('#czy-marketing').checked
      });
    });
    document.body.appendChild(panel);
    const settings = document.getElementById('czy-consent-settings');
    if (settings) settings.addEventListener('click', show);
    if (!preference) show();
    else panel.hidden = true;
  }

  preference = read();
  if (preference) activate();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
