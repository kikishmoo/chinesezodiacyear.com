import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/site.js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/ads.txt");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy("src/cities.json");
  eleventyConfig.addPassthroughCopy("src/img");

  // HTML Base Plugin for URL handling
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Articles collection — sorted by date descending
  eleventyConfig.addCollection("articles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/articles/*").sort((a, b) => {
      return (b.data.date || 0) - (a.data.date || 0);
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

  // Slug filter (already built in, but explicit)
  eleventyConfig.addFilter("slug", (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  });

  // Limit filter for arrays
  eleventyConfig.addFilter("limit", (arr, count) => arr.slice(0, count));

  // Watch targets
  eleventyConfig.addWatchTarget("src/styles.css");
  eleventyConfig.addWatchTarget("src/site.js");

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
