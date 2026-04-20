const MONTHS_SHORT = {
  en: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
  es: ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"],
  ca: ["GEN","FEB","MAR","ABR","MAI","JUN","JUL","AGO","SET","OCT","NOV","DES"]
};

function parseISODate(str) {
  const parts = (str || "").split("-");
  return {
    year: parseInt(parts[0], 10),
    monthIdx: parseInt(parts[1], 10) - 1,
    day: parts[2] || ""
  };
}

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/press-kit");
  eleventyConfig.addPassthroughCopy("src/favicon-light.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-dark.svg");
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ ".nojekyll": ".nojekyll" });
  eleventyConfig.addPassthroughCopy({ "src/_data/about.json": "data/about.json" });
  eleventyConfig.addPassthroughCopy({ "src/_data/home.json": "data/home.json" });
  eleventyConfig.addPassthroughCopy({ "src/_data/films.json": "data/films.json" });
  eleventyConfig.addPassthroughCopy({ "src/_data/contact.json": "data/contact.json" });
  eleventyConfig.addPassthroughCopy({ "src/_data/live.json": "data/live.json" });
  eleventyConfig.addPassthroughCopy({ "src/_data/presskit.json": "data/presskit.json" });

  // Live date part filters
  eleventyConfig.addFilter("liveDay", (date) => {
    const { day } = parseISODate(date);
    return day;
  });
  eleventyConfig.addFilter("liveMonth", (date, lang) => {
    const { monthIdx } = parseISODate(date);
    const months = MONTHS_SHORT[lang] || MONTHS_SHORT.en;
    return months[monthIdx] || "";
  });
  eleventyConfig.addFilter("liveYear", (date) => {
    const { year } = parseISODate(date);
    return isNaN(year) ? "" : String(year);
  });
  // Short date for the home pill — "8 MAY"
  eleventyConfig.addFilter("liveDateShort", (date, lang) => {
    const { day, monthIdx } = parseISODate(date);
    const months = MONTHS_SHORT[lang] || MONTHS_SHORT.en;
    const d = String(parseInt(day, 10) || "").trim();
    return `${d} ${months[monthIdx] || ""}`.trim();
  });
  // Filter upcoming events: only those with date >= today
  eleventyConfig.addFilter("upcomingOnly", (events) => {
    if (!Array.isArray(events)) return [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events.filter(ev => {
      const d = new Date(ev.date);
      return !isNaN(d) && d >= now;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  // Sort past descending
  eleventyConfig.addFilter("pastDesc", (events) => {
    if (!Array.isArray(events)) return [];
    return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Add global data for language prefix based on URL
  eleventyConfig.addGlobalData("eleventyComputed", {
    urlLangPrefix: (data) => {
      const url = data.page?.url || '';
      if (url.startsWith('/es/') || url === '/es') return '/es';
      if (url.startsWith('/ca/') || url === '/ca') return '/ca';
      return '';
    },
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
    templateFormats: ["njk", "html", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
