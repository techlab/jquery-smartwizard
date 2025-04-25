import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { readFileSync, writeFileSync, rmSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const banner = `/*!
 * ${packageJson.title} v${packageJson.version}
 * ${packageJson.description}
 * ${packageJson.homepage}
 *
 * Created by Dipu Raj
 * http://dipu.me
 *
 * Licensed under the terms of the MIT License
 * https://github.com/techlab/jquery-smartwizard/blob/master/LICENSE
 */`;

const dev = process.env.ROLLUP_WATCH;

// Cleanup function
// if (!dev) {
//   // Clean dist folder before production build
//   try {
//     rmSync('./dist', { recursive: true, force: true });
//     console.log('Cleaned dist folder');
//   } catch (error) {
//     console.error('Error while cleaning dist folder:', error);
//   }
// }

const jsBuildConfig = {
    input: 'src/ts/index.ts',
    output: [
      {
        file: 'dist/js/jquery.smartWizard.js',
        format: 'umd',
        name: 'SmartWizard',
        banner,
        sourcemap: true,
        globals: {
          jquery: 'jQuery'
        }
      },
      {
        file: 'dist/js/jquery.smartWizard.min.js',
        format: 'umd',
        name: 'SmartWizard',
        banner,
        plugins: [terser()],
        sourcemap: true,
        globals: {
          jquery: 'jQuery'
        }
      },
      {
        file: 'dist/js/jquery.smartWizard.esm.js',
        format: 'es',
        banner,
        sourcemap: true
      }
    ],
    external: ['jquery'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/types',
        sourceMap: true
      }),
      dev && serve({
        open: true,
        contentBase: ['dist', 'examples', './'],
        host: 'localhost',
        port: 3001,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }),
      dev && livereload({
        watch: 'dist'
      })
    ].filter(Boolean)
};

// Create separate configs for individual theme files
const cssBuildConfigs = [
  'smart_wizard_all.scss',
  // 'smart_wizard.scss',
  // 'smart_wizard_arrows.scss',
  // 'smart_wizard_dots.scss',
  // 'smart_wizard_round.scss',
  // 'smart_wizard_square.scss'
].map(file => ({
  input: `src/scss/${file}`,
  output: {
    file: `dist/css/${file.replace('.scss', '.css')}`,
    format: 'es'
  },
  plugins: [
    scss({
      api: "modern",
      fileName: file.replace('.scss', '.css'),
      outputStyle: 'expanded',
      sourceMap: true,
      watch: 'src/scss',

      output: function(styles, styleNodes) {
        const baseName = file.replace('.scss', '');
        // Write normal CSS
        writeFileSync(`dist/css/${baseName}.css`, styles);
        
        // Process and write minified CSS
        postcss([autoprefixer(), cssnano({ preset: 'default' })])
          .process(styles, { 
            from: `src/scss/${file}`,
            to: `dist/css/${baseName}.min.css`,
            map: { inline: false }
          })
          .then(result => {
            writeFileSync(`dist/css/${baseName}.min.css`, result.css);
            if (result.map) {
              writeFileSync(`dist/css/${baseName}.min.css.map`, result.map.toString());
            }
          });
      }
    }),
      
    //   processor: css => postcss([
    //     autoprefixer(),
    //     cssnano({ preset: 'default' })
    //   ])
    //     .process(css, { 
    //       from: `src/scss/${file}`,
    //       to: `dist/css/${file.replace('.scss', '.css')}`,
    //       map: { inline: false }
    //     })
    //     .then(result => result.css)
    // })

      // scss({
      //   fileName: file.replace('.scss', '.css'),
      //   processor: () => postcss([autoprefixer()]),
      //     output: {
      //       dir: 'dist/css',
      //       files: {
      //         'jquery.smartwizard.css': css => css,
      //         'jquery.smartwizard.min.css': css => css.replace(/\s+/g, ' ').trim()
      //       }
      //     },
      //     sourceMap: true,
      //     watch: ['src/scss'],
      //     includePaths: ['node_modules'],
      //     processor: async (css) => {
      //       const { css: processedCss } = await sass.compileStringAsync(css);
      //       return processedCss;
      // }})
  ]
}));

export default defineConfig([
  jsBuildConfig,
  ...cssBuildConfigs
]);
