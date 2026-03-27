#!/usr/bin/env node
/**
 * One-time CSS extraction script.
 * Reads src/styles.css and splits into modular files under src/css/.
 * Run: node scripts/split-css.js
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

const ROOT = process.cwd();
const src = readFileSync(join(ROOT, 'src/styles.css'), 'utf8');
const lines = src.split('\n');

// Helper: extract line range (1-indexed, inclusive)
function extract(start, end) {
  return lines.slice(start - 1, end).join('\n');
}

// Helper: write file, creating dirs as needed
function emit(relPath, content) {
  const abs = join(ROOT, 'src/css', relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content.trimStart() + '\n');
  console.log(`  ✓ ${relPath} (${content.split('\n').length} lines)`);
}

console.log('Splitting src/styles.css into modular CSS files...\n');

// ─── TOKENS ───
emit('tokens/colors.css', `:root {\n  /* Ethereal Ink-Wash Palette */\n${extract(12, 34)}\n}`);
emit('tokens/typography.css', `:root {\n  /* Typography */\n${extract(37, 41)}\n}`);
emit('tokens/spacing.css', `:root {\n  /* Spacing Scale */\n${extract(44, 56)}\n}`);
emit('tokens/shadows.css', `:root {\n  /* Shadows — soft, warm, ink-wash inspired */\n${extract(58, 72)}\n}`);
emit('tokens/animations.css', `:root {\n  /* Gold transparency scale */\n${extract(75, 88)}\n}`);

// ─── BASE ───
emit('base/reset.css', extract(1, 7) + '\n\n' + extract(90, 107));
emit('base/accessibility.css',
  extract(109, 135) + '\n\n' +
  '/* Screen reader only */\n' +
  '.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }'
);
emit('base/typography.css', extract(137, 233));
emit('base/i18n.css',
  '/* --- i18n Content Blocks --- */\n' +
  extract(2449, 2460)
);

// ─── LAYOUT ───
emit('layout/header.css',
  extract(234, 389) + '\n\n' +
  extract(2397, 2448) + '\n\n' +
  extract(2461, 2484)
);
emit('layout/footer.css', extract(1544, 1697));
emit('layout/article-layout.css', extract(755, 771) + '\n\n' + extract(893, 1028));

// ─── COMPONENTS ───
emit('components/hero.css', extract(403, 570) + '\n\n' + extract(2295, 2314));
emit('components/buttons.css', extract(571, 617) + '\n\n' + extract(4604, 4609));
emit('components/breadcrumbs.css', extract(390, 402));
emit('components/calculator.css', extract(618, 754) + '\n\n' + extract(2315, 2357));
emit('components/cards.css',
  extract(772, 892) + '\n\n' +
  extract(1029, 1097) + '\n\n' +
  extract(2087, 2143) + '\n\n' +
  extract(2174, 2262) + '\n\n' +
  extract(2270, 2285) + '\n\n' +
  extract(3829, 3873) + '\n\n' +
  extract(4137, 4186) + '\n\n' +
  extract(4257, 4277)
);
emit('components/faq.css', extract(1098, 1159));
emit('components/directory.css', extract(1160, 1282) + '\n\n' + extract(1698, 1956));
emit('components/newsletter.css', extract(1283, 1342));
emit('components/search.css', extract(1343, 1409) + '\n\n' + extract(5239, 5252));
emit('components/comments.css', extract(1410, 1425));
emit('components/tables.css', extract(1426, 1518));
emit('components/share-buttons.css', extract(1519, 1543));
emit('components/readings.css', extract(2485, 2549));
emit('components/bazi.css', extract(2550, 2903));
emit('components/trivia.css', extract(3362, 3696));
emit('components/content-elements.css',
  extract(1964, 2086) + '\n\n' +
  extract(2286, 2294) + '\n\n' +
  extract(2358, 2380) + '\n\n' +
  extract(3874, 3951) + '\n\n' +
  extract(3952, 4084) + '\n\n' +
  extract(4085, 4136) + '\n\n' +
  extract(4187, 4256)
);
emit('components/donate.css', extract(4334, 4564));
emit('components/embeds.css', extract(4565, 4603));
emit('components/popup.css', extract(5254, 5352));
emit('components/cross-sell.css', extract(5437, 5521));
emit('components/content-upgrade.css', extract(5377, 5436));
emit('components/compatibility.css', extract(5111, 5179));
emit('components/related.css', extract(5180, 5237));
emit('components/shop.css',
  extract(4610, 4690) + '\n\n' +
  extract(4691, 4808) + '\n\n' +
  extract(4809, 5014)
);

// ─── THEMES ───
// Big consolidated dark mode block + scattered dark-only sections
emit('themes/dark.css',
  extract(2904, 3361) + '\n\n' +
  extract(3697, 3828) + '\n\n' +
  extract(4278, 4333) + '\n\n' +
  '/* Dark mode — popup */\n' +
  extract(5354, 5375) + '\n\n' +
  '/* Dark mode — cross-sell */\n' +
  extract(5512, 5521) + '\n\n' +
  '/* Dark mode — compatibility matrix */\n' +
  extract(5164, 5178) + '\n\n' +
  '/* Dark mode — related content */\n' +
  extract(5223, 5237) + '\n\n' +
  extract(5015, 5110)
);
emit('themes/auto-dark.css', extract(5523, 5577));

// ─── UTILITIES ───
emit('utilities/spacing.css',
  '/* --- Utility --- */\n' +
  '.container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--sp-lg); }\n' +
  '.container-narrow { max-width: var(--max-width-narrow); margin: 0 auto; padding: 0 var(--sp-lg); }\n' +
  '.mt-sm { margin-top: var(--sp-sm); }\n' +
  '.mt-md { margin-top: var(--sp-md); }\n' +
  '.mt-lg { margin-top: var(--sp-lg); }\n' +
  '.mt-xl { margin-top: var(--sp-xl); }\n' +
  '.mb-md { margin-bottom: var(--sp-md); }\n' +
  '.mb-lg { margin-bottom: var(--sp-lg); }'
);
emit('utilities/text.css',
  extract(1957, 1963) + '\n\n' +
  '.text-center { text-align: center; }'
);
emit('utilities/animations.css', extract(2144, 2173));
emit('utilities/print.css', extract(2263, 2269));
emit('utilities/reduced-motion.css', extract(5579, 5591));

console.log('\nDone! Now create src/css/main.css with @import chain.');
