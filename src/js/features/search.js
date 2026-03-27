/**
 * Search — Site search with weighted scoring and debounced input.
 */

import { track } from '../analytics.js';
import { basePath } from '../utils/base-path.js';
import { escapeHtml } from '../utils/sanitise.js';

export function initSearch() {
  const searchForm = document.getElementById('site-search-form');
  const siteSearchInput = document.getElementById('site-search-input');
  const searchResults = document.getElementById('search-results');
  const searchStatus = document.getElementById('search-status');

  if (!searchForm || !siteSearchInput || !searchResults) return;

  let searchIndex = null;

  const loadIndex = () => {
    if (searchIndex) return Promise.resolve(searchIndex);
    return fetch(basePath + '/search-index.json')
      .then(r => r.json())
      .then(data => { searchIndex = data; return data; });
  };

  const scoreMatch = (item, terms) => {
    let score = 0;
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const keywords = (item.keywords || '').toLowerCase();
    const body = (item.body || '').toLowerCase();
    for (const t of terms) {
      if (title.includes(t)) score += 10;
      if (title.startsWith(t) || title.includes(' ' + t)) score += 5;
      if (keywords.includes(t)) score += 4;
      if (desc.includes(t)) score += 2;
      if (body.includes(t)) score += 1;
    }
    return score;
  };

  const runSearch = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = '';
      if (searchStatus) searchStatus.hidden = true;
      return;
    }
    const terms = q.split(/\s+/).filter(Boolean);
    loadIndex().then(data => {
      const scored = data
        .map(item => ({ ...item, score: scoreMatch(item, terms) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

      track('site_search', {
        event_category: 'Search',
        search_term: query.trim(),
        event_label: query.trim(),
        results_count: scored.length
      });

      if (searchStatus) {
        searchStatus.hidden = false;
        searchStatus.textContent = scored.length
          ? scored.length + ' result' + (scored.length > 1 ? 's' : '') + ' for \u201c' + query.trim() + '\u201d'
          : 'No results for \u201c' + query.trim() + '\u201d';
      }

      searchResults.innerHTML = scored.length
        ? scored.map(item =>
          '<a href="' + item.url + '" class="search-result-card">' +
            '<span class="search-result-title">' + escapeHtml(item.title) + '</span>' +
            (item.description ? '<span class="search-result-desc">' + escapeHtml(item.description.slice(0, 160)) + '</span>' : '') +
            '<span class="search-result-url">' + item.url + '</span>' +
          '</a>'
        ).join('')
        : '<p class="search-no-results">Try different keywords or browse the <a href="/zodiac/">encyclopedia</a>.</p>';
    }).catch(() => {
      if (searchStatus) { searchStatus.hidden = false; searchStatus.textContent = 'Search unavailable. Please try again later.'; }
    });
  };

  // Handle ?q= on page load
  const params = new URLSearchParams(window.location.search);
  const initialQ = params.get('q');
  if (initialQ) {
    siteSearchInput.value = initialQ;
    runSearch(initialQ);
  }

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = siteSearchInput.value.trim();
    if (q) {
      window.history.replaceState(null, '', '/search?q=' + encodeURIComponent(q));
      runSearch(q);
    }
  });

  // Live search with debounce
  let debounceTimer;
  siteSearchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = siteSearchInput.value.trim();
      if (q.length >= 2) runSearch(q);
      else { searchResults.innerHTML = ''; if (searchStatus) searchStatus.hidden = true; }
    }, 300);
  });
}
