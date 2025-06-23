import {Glob} from 'bun';
import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import {minify as htmlmin} from 'html-minifier-terser';

const assetsToPass = [
  'src/assets/css',
  'src/assets/fonts',
  'src/assets/images',
  'src/assets/audio',
  'src/assets/js',
  'src/escoriasite',
  'src/pazzy',
  'src/aspen',
  'src/ivy',
  'src/sven',
];

export default (eleventyConfig) => {
  assetsToPass.forEach((dir) => eleventyConfig.addPassthroughCopy(dir));

  eleventyConfig.on('afterBuild', async () => {
    const outputDir = eleventyConfig.dir.output ?? '_site';

    const ignoredDirs = await Array.fromAsync(new Glob('**/{_unused,_unbuilt}').scan({
      cwd : outputDir,
      onlyFiles : false,
      absolute : true,
    }));

    await Promise.all(ignoredDirs.map(async (filePath) => {
      console.log(`Removing ignored directory: ${filePath}`);
      await fs.rm(filePath, {recursive : true, force : true});
    }));

    const filesToMinify = await Array.fromAsync(new Glob('**/*.{html,css,js}').scan({
      cwd : outputDir,
      absolute : true,
    }));

    await Promise.all(filesToMinify.map(async (filePath) => {
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        let minifiedContent;

        if (filePath.endsWith('.html')) {
          minifiedContent = await htmlmin(fileContent, {
            collapseWhitespace : true,
            removeComments : true,
            removeOptionalTags : true,
            removeRedundantAttributes : true,
            removeScriptTypeAttributes : true,
            removeTagWhitespace : true,
            useShortDoctype : true,
            minifyCSS : true,
            minifyJS : true,
            ignoreCustomFragments : [
              /\s+::\s+/,
              /<\/mono>\s/,
            ],
          });
        } else if (filePath.endsWith('.css')) {
          const result = await esbuild.transform(fileContent, {
            loader : 'css',
            minify : true,
          });
          minifiedContent = result.code;
          console.log(`Minified CSS: ${filePath}`);
        } else if (filePath.endsWith('.js')) {
          const result = await esbuild.transform(fileContent, {
            loader : 'js',
            minify : true,
          });
          minifiedContent = result.code;
          console.log(`Minified JS: ${filePath}`);
        }

        await fs.writeFile(filePath, minifiedContent);
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
      }
    }));
  });

  return {
    templateFormats : [ 'njk', 'liquid', 'md' ],
    dir : {
      input : 'src',
      output : '_site',
      includes : '_includes',
      data : '_data',
    },
  };
};