/**
 * Shop — Product card filter buttons.
 */

export function initShopFilters() {
  var filterGroups = document.querySelectorAll('.shop-filters');
  if (!filterGroups.length) return;

  filterGroups.forEach(function(group) {
    var scope = group.querySelector('[data-scope]');
    var scopeVal = scope ? scope.getAttribute('data-scope') : null;
    var btns = group.querySelectorAll('.shop-filter-btn');
    var grid = group.nextElementSibling;
    var cards = grid ? grid.querySelectorAll('.product-card[data-category]') : [];

    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        btns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        cards.forEach(function(card) {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.classList.remove('product-card--hidden');
          } else {
            card.classList.add('product-card--hidden');
          }
        });
        if (window.gtag) window.gtag('event', 'shop_filter', {
          event_category: 'Shop',
          event_label: (scopeVal ? scopeVal + ':' : '') + cat
        });
      });
    });
  });
}

/**
 * AdSense — Dynamic ad loading.
 */
export function initAdsense() {
  var ads = document.querySelectorAll('.adsbygoogle');
  if (ads.length && window.adsbygoogle) {
    ads.forEach(function() {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    });
  }
}
