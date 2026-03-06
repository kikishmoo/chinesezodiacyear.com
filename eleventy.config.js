import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import Image from '@11ty/eleventy-img';
import CleanCSS from 'clean-css';
import { minify as terserMinify } from 'terser';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export default function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/ads.txt");
  eleventyConfig.addPassthroughCopy("src/czy2026indexnow.txt");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy("src/cities.json");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/manifest.json");

  // HTML Base Plugin for URL handling
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Responsive image shortcode — generates srcset with multiple sizes
  eleventyConfig.addAsyncShortcode("respimg", async function(src, alt, sizes) {
    const inputPath = src.startsWith('/') ? join('src', src) : src;
    try {
      const metadata = await Image(inputPath, {
        widths: [400, 800, 1200],
        formats: ['webp', 'jpeg'],
        outputDir: '_site/img/opt/',
        urlPath: '/img/opt/',
        filenameFormat: function (id, src, width, format) {
          const name = src.split('/').pop().split('.')[0];
          return `${name}-${width}.${format}`;
        }
      });
      const imageAttributes = {
        alt: alt || '',
        sizes: sizes || '(max-width: 800px) 100vw, 800px',
        loading: 'lazy',
        decoding: 'async',
      };
      return Image.generateHTML(metadata, imageAttributes);
    } catch (e) {
      // Fallback: return a standard img tag if image processing fails
      return `<img src="${src}" alt="${alt || ''}" loading="lazy" decoding="async">`;
    }
  });

  // Articles collection — sorted by date descending
  eleventyConfig.addCollection("articles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/articles/*").sort((a, b) => {
      return (b.data.date || 0) - (a.data.date || 0);
    });
  });

  // Articles by category — for category archive pages
  const articleCategories = ["zodiac", "culture", "fengshui", "bazi", "business"];
  articleCategories.forEach(cat => {
    eleventyConfig.addCollection(`articles_${cat}`, function(collectionApi) {
      return collectionApi.getFilteredByGlob("src/articles/*")
        .filter(item => item.data.category === cat)
        .sort((a, b) => (b.data.date || 0) - (a.data.date || 0));
    });
  });

  // Encyclopedia collection
  eleventyConfig.addCollection("encyclopedia", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.njk").filter(item => {
      return item.data.category === "encyclopedia";
    });
  });

  // Readings collection — all readings sorted by animal name
  eleventyConfig.addCollection("readings", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/readings/*").sort((a, b) => {
      return (a.data.animal || '').localeCompare(b.data.animal || '');
    });
  });

  // Yearly readings sub-collection
  eleventyConfig.addCollection("yearlyReadings", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/readings/*").filter(item => {
      return item.data.readingType === "yearly";
    });
  });

  // Custom filter: format date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  });

  // ISO date filter
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return "";
    return new Date(dateObj).toISOString().split("T")[0];
  });

  // JSON stringify filter for Schema.org
  eleventyConfig.addFilter("jsonify", (obj) => JSON.stringify(obj));

  // JSON-LD safe filter: produces a string safe for embedding in JSON-LD values.
  // 1. Decode HTML entities that Nunjucks auto-escapes
  // 2. Escape characters that would break JSON strings (backslash, double quotes, control chars)
  // Chain with | safe in templates to prevent Nunjucks from re-escaping the output.
  eleventyConfig.addFilter("jsonLdSafe", (str) => {
    if (!str) return "";
    return String(str)
      // First decode HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/")
      // Then escape for JSON string context (backslash first, then quotes)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
  });

  // Slug filter (already built in, but explicit)
  eleventyConfig.addFilter("slug", (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  });

  // Limit filter for arrays
  eleventyConfig.addFilter("limit", (arr, count) => arr.slice(0, count));

  // Watch targets
  eleventyConfig.addWatchTarget("src/styles.css");
  eleventyConfig.addWatchTarget("src/site.js");
  eleventyConfig.addWatchTarget("src/trivia.js");

  // Minify CSS and JS after build
  eleventyConfig.on('eleventy.after', async () => {
    const outputDir = '_site';

    // Minify CSS
    try {
      const cssPath = join(outputDir, 'styles.css');
      const cssInput = readFileSync(join('src', 'styles.css'), 'utf8');
      const cssOutput = new CleanCSS({ level: 2 }).minify(cssInput);
      if (cssOutput.styles) {
        writeFileSync(cssPath, cssOutput.styles);
        console.log('[Minify] styles.css:', (cssInput.length / 1024).toFixed(1) + 'KB →', (cssOutput.styles.length / 1024).toFixed(1) + 'KB');
      }
    } catch (e) {
      console.error('[Minify] CSS error:', e.message);
    }

    // Minify JS (site.js)
    try {
      const jsPath = join(outputDir, 'site.js');
      const jsInput = readFileSync(join('src', 'site.js'), 'utf8');
      const jsOutput = await terserMinify(jsInput, { compress: true, mangle: true });
      if (jsOutput.code) {
        writeFileSync(jsPath, jsOutput.code);
        console.log('[Minify] site.js:', (jsInput.length / 1024).toFixed(1) + 'KB →', (jsOutput.code.length / 1024).toFixed(1) + 'KB');
      }
    } catch (e) {
      console.error('[Minify] JS error:', e.message);
    }

    // Minify JS (trivia.js — homepage only)
    try {
      const triviaPath = join(outputDir, 'trivia.js');
      const triviaInput = readFileSync(join('src', 'trivia.js'), 'utf8');
      const triviaOutput = await terserMinify(triviaInput, { compress: true, mangle: true });
      if (triviaOutput.code) {
        writeFileSync(triviaPath, triviaOutput.code);
        console.log('[Minify] trivia.js:', (triviaInput.length / 1024).toFixed(1) + 'KB →', (triviaOutput.code.length / 1024).toFixed(1) + 'KB');
      }
    } catch (e) {
      console.error('[Minify] trivia.js error:', e.message);
    }
  });

  return {
    pathPrefix: "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
