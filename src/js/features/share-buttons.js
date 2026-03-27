/**
 * Social Share — URL population for share buttons.
 */

import { track } from '../analytics.js';

export function initShareButtons() {
  document.querySelectorAll('.share-buttons').forEach(container => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    container.querySelectorAll('a[data-share]').forEach(btn => {
      const type = btn.dataset.share;
      btn.addEventListener('click', () => {
        track('social_share', {
          event_category: 'Social',
          event_label: type,
          share_method: type,
          content_url: window.location.pathname
        });
      });
      switch (type) {
        case 'twitter':
          btn.href = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title; break;
        case 'facebook':
          btn.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url; break;
        case 'linkedin':
          btn.href = 'https://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + title; break;
        case 'email':
          btn.href = 'mailto:?subject=' + title + '&body=' + url; break;
      }
    });
  });
}
