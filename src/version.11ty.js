const { version } = require("../package.json");

module.exports = {
  data: {
    permalink: "/version.json",
    eleventyExcludeFromCollections: true,
  },
  render: () => JSON.stringify({ version }),
};
