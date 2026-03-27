/**
 * Popup — Exit-intent email popup with timing triggers.
 */

export function initPopup() {
  var popup = document.getElementById('email-popup');
  if (!popup) return;

  var STORAGE_KEY = 'czy-popup-dismissed';
  var SESSION_KEY = 'czy-popup-shown';

  var dismissed = localStorage.getItem(STORAGE_KEY);
  if (dismissed && (Date.now() - parseInt(dismissed, 10)) < 7 * 24 * 60 * 60 * 1000) return;
  if (sessionStorage.getItem(SESSION_KEY)) return;

  var closeBtn = document.getElementById('email-popup-close');
  var dismissBtn = document.getElementById('email-popup-dismiss');
  var shown = false;

  function showPopup() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    popup.classList.add('is-visible');
    popup.setAttribute('aria-hidden', 'false');
    if (window.gtag) window.gtag('event', 'popup_shown', {
      event_category: 'Popup',
      event_label: 'exit_intent',
      non_interaction: true
    });
    var firstInput = popup.querySelector('input[type="email"]');
    if (firstInput) setTimeout(function() { firstInput.focus(); }, 350);
  }

  function hidePopup(remember) {
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
    if (window.gtag) window.gtag('event', 'popup_dismissed', {
      event_category: 'Popup',
      event_label: 'exit_intent'
    });
    if (remember) {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', function() { hidePopup(true); });
  if (dismissBtn) dismissBtn.addEventListener('click', function() { hidePopup(true); });

  popup.addEventListener('click', function(e) {
    if (e.target === popup) hidePopup(true);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('is-visible')) hidePopup(true);
  });

  // Desktop: exit-intent
  var exitTriggered = false;
  document.addEventListener('mouseout', function(e) {
    if (exitTriggered) return;
    if (e.clientY <= 0 && e.relatedTarget === null) {
      exitTriggered = true;
      if (performance.now() < 15000) {
        setTimeout(showPopup, 15000 - performance.now());
      } else {
        showPopup();
      }
    }
  });

  // Mobile: inactivity + fallback timers
  var isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  if (isMobile) {
    var idleTimer;
    var resetIdle = function() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showPopup, 45000);
    };
    document.addEventListener('touchstart', resetIdle, { passive: true });
    document.addEventListener('scroll', resetIdle, { passive: true });
    resetIdle();
    setTimeout(function() { if (!shown) showPopup(); }, 60000);
  }
}
