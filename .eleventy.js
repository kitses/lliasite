module.exports = function(eleventyConfig) {
  const assetsToPass = [
    "src/assets/css",
    "src/assets/fonts",
    "src/assets/images",
    "src/assets/audio",
    "src/assets/js",
    "src/escoriasite",
    "src/pazzy",
    "src/aspen",
    "src/ivy",
    "src/sven"
  ];

  assetsToPass.forEach(dir => {
    eleventyConfig.addPassthroughCopy(dir);
  });

  eleventyConfig.addTransform("htmlmin", async function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      try {
        return await require("html-minifier-terser").minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          ignoreCustomFragments: [/<h1\b[^>]*>[\s\S]*?<\/h1>/]
        });
      } catch (err) {
        console.error("HTML minification error:", err);
        return content;
      }
    }
    return content;
  });

  return {
    templateFormats: ["njk", "liquid", "md"], // exclude "html"
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
