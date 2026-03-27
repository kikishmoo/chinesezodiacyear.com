/**
 * FAQ — Accordion open/close with GA4 tracking.
 */

import { track } from '../analytics.js';

export function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      // Close all siblings
      item.parentElement.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        var b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        track('faq_open', {
          event_category: 'Engagement',
          event_label: btn.textContent.trim().substring(0, 80)
        });
      }
    });
  });
}
