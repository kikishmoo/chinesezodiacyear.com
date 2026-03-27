/**
 * Theme — Dark mode toggle with localStorage persistence.
 */

import { track } from '../analytics.js';

export function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('czy-theme', next);
    track('theme_toggle', {
      event_category: 'Preferences',
      event_label: next
    });
  });
}
