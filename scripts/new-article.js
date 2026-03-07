#!/usr/bin/env node

/**
 * new-article.js — Article scaffolding tool
 *
 * Generates a new article .njk file in src/articles/ with correct
 * frontmatter, trilingual structure, section scaffolding, and FAQ.
 *
 * Usage:
 *   node scripts/new-article.js --slug "my-article-slug" --title "My Article Title" --category zodiac
 *
 * Options:
 *   --slug        URL slug (required)
 *   --title       Article title (required)
 *   --category    One of: zodiac, culture, fengshui, bazi, business (required)
 *   --description SEO meta description (optional — prompts if missing)
 *   --keywords    Comma-separated keywords (optional)
 *   --sections    Comma-separated section IDs (optional, defaults to standard set)
 *   --trilingual  Generate full trilingual structure (default: false, EN-only)
 *   --date        Publication date YYYY-MM-DD (default: today)
 *   --dry-run     Print to stdout instead of writing file
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CATEGORIES = {
  zodiac:   { label: 'Zodiac',    overline: 'Zodiac' },
  culture:  { label: 'Culture',   overline: 'Culture' },
  fengshui: { label: 'Feng Shui', overline: 'Feng Shui' },
  bazi:     { label: 'BaZi',      overline: 'BaZi' },
  business: { label: 'Business',  overline: 'Business' },
};

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function estimateReadTime(sectionCount) {
  // ~2-3 min per section, minimum 4 min
  return Math.max(4, sectionCount * 2);
}

function generateArticle(opts) {
  const {
    slug, title, category, description, keywords,
    sections, trilingual, date, author
  } = opts;

  const cat = CATEGORIES[category];
  const pubDate = date || todayISO();
  const readTime = estimateReadTime(sections.length);

  // --- Frontmatter ---
  let fm = `---
layout: "layouts/article.njk"
title: "${title}"
description: "${description}"
keywords: "${keywords}"
date: ${pubDate}
datePublished: "${pubDate}"
dateModified: "${pubDate}"
ogType: "article"
tags: ["article", "${category}"]
category: "${category}"
categoryLabel: "${cat.label}"
permalink: "/${slug}/"
author: "${author || 'Editorial Staff'}"
readTime: "${readTime} min read"
heroOverline: "${cat.overline} · ${formatDate(pubDate)}"
heroTitle: "${title}"
heroSubtitle: "<!-- TODO: Add subtitle with Chinese characters and pinyin -->"
breadcrumbs:
  - label: "Home"
    url: "/"
  - label: "News"
    url: "/news/"
  - label: "${title}"
toc:
${sections.map(s => `  - id: "${s.id}"\n    label: "${s.label}"`).join('\n')}
  - id: "faq"
    label: "FAQ"
faq:
  - q: "<!-- TODO: FAQ question 1 -->"
    a: "<!-- TODO: FAQ answer 1 -->"
  - q: "<!-- TODO: FAQ question 2 -->"
    a: "<!-- TODO: FAQ answer 2 -->"
  - q: "<!-- TODO: FAQ question 3 -->"
    a: "<!-- TODO: FAQ answer 3 -->"
relatedArticles:
  - label: "Zodiac Animals"
    url: "/zodiac/"
  - label: "Wu Xing — Five Elements"
    url: "/wuxing/"
  - label: "BaZi — Four Pillars"
    url: "/bazi/"
---
`;

  // --- Content ---
  let content = '';

  if (trilingual) {
    // Full trilingual structure
    for (const lang of [
      { code: 'en', comment: 'English' },
      { code: 'tc', comment: 'Traditional Chinese' },
      { code: 'sc', comment: 'Simplified Chinese' },
    ]) {
      content += `<div class="lang-${lang.code}">\n`;
      for (const section of sections) {
        content += `  <section id="${section.id}">\n`;
        content += `    <h2>${section.label}</h2>\n`;
        content += `    <!-- TODO: ${lang.comment} content for "${section.label}" -->\n`;
        content += `    <p></p>\n`;
        content += `  </section>\n\n`;
      }
      content += `</div>\n\n`;
    }
  } else {
    // English-only (default for speed; TC/SC added later)
    for (const section of sections) {
      content += `<section id="${section.id}">\n`;
      content += `  <h2>${section.label}</h2>\n`;
      content += `  <!-- TODO: Write content for "${section.label}" -->\n`;
      content += `  <p></p>\n`;
      content += `</section>\n\n`;
    }
  }

  return fm + content;
}

// --- Main ---
const args = parseArgs(process.argv);

if (!args.slug || !args.title || !args.category) {
  console.error('Usage: node scripts/new-article.js --slug "slug" --title "Title" --category zodiac');
  console.error('');
  console.error('Required: --slug, --title, --category (zodiac|culture|fengshui|bazi|business)');
  console.error('Optional: --description, --keywords, --sections, --trilingual, --date, --author, --dry-run');
  process.exit(1);
}

if (!CATEGORIES[args.category]) {
  console.error(`Invalid category "${args.category}". Must be one of: ${Object.keys(CATEGORIES).join(', ')}`);
  process.exit(1);
}

// Parse sections: "overview:Overview,history:History" or default
const defaultSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'Historical Context' },
  { id: 'significance', label: 'Cultural Significance' },
  { id: 'modern', label: 'Modern Relevance' },
  { id: 'practical', label: 'Practical Guidance' },
];

let sections = defaultSections;
if (args.sections) {
  sections = args.sections.split(',').map(s => {
    const [id, ...rest] = s.trim().split(':');
    return { id: id.trim(), label: rest.join(':').trim() || id.trim() };
  });
}

const opts = {
  slug: args.slug,
  title: args.title,
  category: args.category,
  description: args.description || `${args.title} — comprehensive guide covering history, cultural significance, and practical guidance in Chinese astrology and traditional culture.`,
  keywords: args.keywords || `${args.title.toLowerCase()}, Chinese zodiac, Chinese astrology, ${CATEGORIES[args.category].label.toLowerCase()}`,
  sections,
  trilingual: args.trilingual === true || args.trilingual === 'true',
  date: args.date,
  author: args.author,
};

const output = generateArticle(opts);
const filePath = join('src', 'articles', `${opts.slug}.njk`);

if (args['dry-run']) {
  console.log(output);
  console.log(`\n--- Would write to: ${filePath} ---`);
} else {
  if (existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }
  writeFileSync(filePath, output);
  console.log(`Created: ${filePath}`);
  console.log(`  Title:    ${opts.title}`);
  console.log(`  Category: ${opts.category}`);
  console.log(`  Sections: ${sections.length}`);
  console.log(`  URL:      /${opts.slug}/`);
}
