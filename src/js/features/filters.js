/**
 * Filters — Directory/news filter buttons + directory search.
 */

import { track } from '../analytics.js';

export function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const listingCards = document.querySelectorAll('.directory-card[data-category], .article-card[data-category]');
  const noResultsMsgs = document.querySelectorAll('.news-no-results');

  if (!filterBtns.length) return;

  function applyFilter(cat) {
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === cat);
    });
    var visibleCount = 0;
    listingCards.forEach(card => {
      var show = (cat === 'all' || card.dataset.category === cat);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    noResultsMsgs.forEach(msg => {
      msg.hidden = (visibleCount > 0);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      var cat = btn.dataset.filter;
      applyFilter(cat);
      track('filter_apply', {
        event_category: 'Engagement',
        event_label: cat
      });
      if (cat && cat !== 'all') {
        history.replaceState(null, '', '#category=' + cat);
      } else {
        history.replaceState(null, '', window.location.pathname);
      }
    });
  });

  // Apply filter from URL hash on load
  var hash = window.location.hash;
  if (hash && hash.indexOf('#category=') === 0) {
    var cat = hash.replace('#category=', '');
    if (cat) applyFilter(cat);
  }

  // "Show all" buttons
  document.querySelectorAll('.news-show-all-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyFilter('all');
      history.replaceState(null, '', window.location.pathname);
    });
  });

  // Directory search input
  const searchInput = document.getElementById('directory-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      listingCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
}
