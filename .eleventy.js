module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/favicon-light.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-dark.svg");
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ ".nojekyll": ".nojekyll" });
  eleventyConfig.addPassthroughCopy({ "src/_data/about.json": "data/about.json" });
  eleventyConfig.addPassthroughCopy({ "src/_data/home.json": "data/home.json" });
  eleventyConfig.addPassthroughCopy({ "src/_data/films.json": "data/films.json" });
  eleventyConfig.addPassthroughCopy({ "src/_data/contact.json": "data/contact.json" });

  // Add global data for language prefix based on URL
  eleventyConfig.addGlobalData("eleventyComputed", {
    // Extract language prefix from URL for use in templates
    urlLangPrefix: (data) => {
      const url = data.page?.url || '';
      if (url.startsWith('/es/') || url === '/es') return '/es';
      if (url.startsWith('/ca/') || url === '/ca') return '/ca';
      return '';
    },
    // Extract language code from URL
    urlLang: (data) => {
      const url = data.page?.url || '';
      if (url.startsWith('/es/') || url === '/es') return 'es';
      if (url.startsWith('/ca/') || url === '/ca') return 'ca';
      return 'en';
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
