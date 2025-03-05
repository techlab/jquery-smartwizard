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
import { readFileSync } from 'fs';
import sass from 'sass';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const banner = `/*!
 * jQuery SmartWizard v${packageJson.version}
 * The awesome jQuery step wizard plugin
 * http://www.techlaboratory.net/jquery-smartwizard
 *
 * Created by Dipu Raj
 * http://dipu.me
 *
 * Licensed under the terms of the MIT License
 * https://github.com/techlab/jquery-smartwizard/blob/master/LICENSE
 */`;

const production = !process.env.ROLLUP_WATCH;

const config = defineConfig([
  {
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
        rootDir: 'src/ts',
        sourceMap: true
      }),
      scss({
        processor: () => postcss([autoprefixer()]),
        output: {
          dir: 'dist/css',
          files: {
            'jquery.smartwizard.css': css => css,
            'jquery.smartwizard.min.css': css => css.replace(/\s+/g, ' ').trim()
          }
        },
        sourceMap: true,
        watch: ['src/scss'],
        includePaths: ['node_modules'],
        processor: async (css) => {
          const { css: processedCss } = await sass.compileStringAsync(css);
          return processedCss;
        }
      }),
      !production && serve({
        open: true,
        contentBase: ['dist', 'examples'],
        host: 'localhost',
        port: 3001
      }),
      !production && livereload({
        watch: 'dist'
      })
    ].filter(Boolean)
  }
]);

export default config;
