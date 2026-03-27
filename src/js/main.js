/**
 * Main — Entry point that imports and initialises all features.
 *
 * This is the esbuild entry point. It bundles into a single IIFE
 * that replaces the monolithic src/site.js.
 */

// Features
import { initNav } from './features/nav.js';
import { initTheme } from './features/theme.js';
import { initFaq } from './features/faq.js';
import { initCalculator } from './features/calculator.js';
import { initCompatibility } from './features/compatibility.js';
import { initSearch } from './features/search.js';
import { initBaziClient } from './features/bazi-client.js';
import { initNewsletter } from './features/newsletter.js';
import { initFilters } from './features/filters.js';
import { initShareButtons } from './features/share-buttons.js';
import { initLightbox } from './features/lightbox.js';
import { initLanguageToggle, initLanguageAwareLinks } from './features/language.js';
import { initPopup } from './features/popup.js';
import { initShopFilters, initAdsense } from './features/shop.js';

document.addEventListener('DOMContentLoaded', () => {
  // Core UI
  initNav();
  initTheme();
  initFaq();
  initLanguageAwareLinks();

  // Calculators
  initCalculator();
  initCompatibility();
  initBaziClient();

  // Content features
  initSearch();
  initFilters();
  initShareButtons();
  initNewsletter();

  // Page-specific
  initLightbox();
});

// Features that run outside DOMContentLoaded (self-contained IIFEs in original)
initShopFilters();
initAdsense();
initLanguageToggle();
initPopup();
