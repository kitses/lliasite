const fs = require("fs/promises");
const fastGlob = require("fast-glob");
const htmlmin = require("html-minifier-terser").minify;
const esbuild = require("esbuild");

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
  "src/sven",
];

module.exports = (eleventyConfig) => {
  assetsToPass.forEach((dir) => eleventyConfig.addPassthroughCopy(dir));

  eleventyConfig.on("afterBuild", async () => {
    const outputDir = eleventyConfig.dir.output ?? "_site";

    const ignoredDirs = await fastGlob(["**/_unused", "**/_unbuilt"], {
      cwd: outputDir,
      onlyDirectories: true,
      absolute: true,
    });

    await Promise.all(
      ignoredDirs.map(async (filePath) => {
        console.log(`Removing ignored directory: ${filePath}`);
        await fs.rm(filePath, {
          recursive: true,
          force: true
        });
      })
    );

    const filesToMinify = await fastGlob(["**/*.html", "**/*.css", "**/*.js"], {
      cwd: outputDir,
      absolute: true,
    });

    await Promise.all(
      filesToMinify.map(async (filePath) => {
        try {
          const fileContent = await fs.readFile(filePath, "utf8");
          let minifiedContent;

          if (filePath.endsWith(".html")) {
            minifiedContent = await htmlmin(fileContent, {
              collapseWhitespace: true,
              removeComments: true,
              removeOptionalTags: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeTagWhitespace: true,
              useShortDoctype: true,
              minifyCSS: true,
              minifyJS: true,
              ignoreCustomFragments: [/<h1\b[^>]*>[\s\S]*?<\/h1>/],
            });
          } else if (filePath.endsWith(".css")) {
            const result = await esbuild.transform(fileContent, {
              loader: "css",
              minify: true,
            });
            minifiedContent = result.code;
            console.log(`Minified CSS: ${filePath}`);
          } else if (filePath.endsWith(".js")) {
            const result = await esbuild.transform(fileContent, {
              loader: "js",
              minify: true,
            });
            minifiedContent = result.code;
            console.log(`Minified JS: ${filePath}`);
          }

          await fs.writeFile(filePath, minifiedContent);
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
        }
      })
    );
  });

  return {
    templateFormats: ["njk", "liquid", "md"],
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
