const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
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

  assetsToPass.forEach((dir) => {
    eleventyConfig.addPassthroughCopy(dir);
  });

  eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
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

  eleventyConfig.on("afterBuild", () => {
    const outputDir = "_site";

    function traverseDirectory(dir) {
      fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          traverseDirectory(filePath);
        } else if (filePath.endsWith(".css")) {
          try {
            const cssContent = fs.readFileSync(filePath, "utf8");
            const minified = require("esbuild").transformSync(cssContent, {
              loader: "css",
              minify: true
            });
            fs.writeFileSync(filePath, minified.code, "utf8");
            console.log(`Minified CSS: ${filePath}`);
          } catch (error) {
            console.error(`Error minifying ${filePath}:`, error);
          }
        }
      });
    }

    traverseDirectory(outputDir);
  });

  return {
    templateFormats: ["njk", "liquid", "md"],
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
