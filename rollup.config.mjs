import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.ROLLUP_WATCH;

// Banner for output files
const banner = `/*!
 * jQuery SmartWizard v6
 * The awesome step wizard plugin
 * http://www.techlaboratory.net/jquery-smartwizard
 *
 * Created by Dipu Raj
 * https://dipu.me
 *
 * Licensed under the terms of the MIT License
 * https://github.com/techlab/jquery-smartwizard/blob/master/LICENSE
 */`;

// ============================================================================
// JavaScript Build Configurations
// ============================================================================

// Main JS build (UMD, ESM, CJS) - non-minified
const jsConfig = {
    input: 'src/index.ts',
    external: ['jquery'],
    output: [
        {
            file: 'dist/js/jquery.smartWizard.js',
            format: 'umd',
            name: 'smartWizard',
            banner,
            sourcemap: true,
            globals: {
                jquery: 'jQuery'
            },
            exports: 'named'
        },
        {
            file: 'dist/js/jquery.smartWizard.esm.js',
            format: 'es',
            banner,
            sourcemap: true
        },
        {
            file: 'dist/js/jquery.smartWizard.cjs.js',
            format: 'cjs',
            banner,
            sourcemap: true,
            exports: 'named'
        }
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: false,
            declarationMap: false
        })
    ]
};

// Minified UMD build
const jsMinUmdConfig = {
    input: 'src/index.ts',
    external: ['jquery'],
    output: {
        file: 'dist/js/jquery.smartWizard.min.js',
        format: 'umd',
        name: 'smartWizard',
        banner,
        sourcemap: true,
        globals: {
            jquery: 'jQuery'
        },
        exports: 'named'
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: false,
            declarationMap: false
        }),
        terser()
    ]
};

// Minified ESM build
const jsMinEsmConfig = {
    input: 'src/index.ts',
    external: ['jquery'],
    output: {
        file: 'dist/js/jquery.smartWizard.esm.min.js',
        format: 'es',
        banner,
        sourcemap: true
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: false,
            declarationMap: false
        }),
        terser()
    ]
};

// Minified CJS build
const jsMinCjsConfig = {
    input: 'src/index.ts',
    external: ['jquery'],
    output: {
        file: 'dist/js/jquery.smartWizard.cjs.min.js',
        format: 'cjs',
        banner,
        sourcemap: true,
        exports: 'named'
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: false,
            declarationMap: false
        }),
        terser()
    ]
};

// ============================================================================
// Theme CSS Build Configurations
// ============================================================================

// Theme files to build
const themeFiles = [
    { name: 'arrows', path: 'src/styles/themes/arrows.scss' },
    { name: 'dots', path: 'src/styles/themes/dots.scss' },
    { name: 'basic', path: 'src/styles/themes/basic.scss' },
    { name: 'dark', path: 'src/styles/themes/dark.scss' },
    { name: 'progress', path: 'src/styles/themes/progress.scss' },
    { name: 'round', path: 'src/styles/themes/round.scss' },
    { name: 'square', path: 'src/styles/themes/square.scss' },
];

// Create configurations for each theme (non-minified)
const themeConfigs = themeFiles.map(theme => ({
    input: `src/styles/theme-entry-${theme.name}.js`,
    output: {
        file: `dist/css/themes/${theme.name}.css`,
        format: 'es',
    },
    plugins: [
        {
            name: 'theme-entry-generator',
            buildStart() {
                // Create temporary entry file for the theme
                const entryContent = `import './${path.relative('src/styles', theme.path)}';`;
                fs.mkdirSync('src/styles', { recursive: true });
                fs.writeFileSync(`src/styles/theme-entry-${theme.name}.js`, entryContent);
            },
            buildEnd() {
                // Clean up temporary entry file
                const entryFile = `src/styles/theme-entry-${theme.name}.js`;
                if (fs.existsSync(entryFile)) {
                    fs.unlinkSync(entryFile);
                }
            }
        },
        postcss({
            extract: true,
            sourceMap: true,
            minimize: false,
            plugins: [autoprefixer()],
            use: ['sass'],
        }),
    ],
}));

// Create minified configurations for each theme
const themeMinConfigs = themeFiles.map(theme => ({
    input: `src/styles/theme-entry-${theme.name}-min.js`,
    output: {
        file: `dist/css/themes/${theme.name}.min.css`,
        format: 'es',
    },
    plugins: [
        {
            name: 'theme-entry-generator-min',
            buildStart() {
                // Create temporary entry file for the theme
                const entryContent = `import './${path.relative('src/styles', theme.path)}';`;
                fs.mkdirSync('src/styles', { recursive: true });
                fs.writeFileSync(`src/styles/theme-entry-${theme.name}-min.js`, entryContent);
            },
            buildEnd() {
                // Clean up temporary entry file
                const entryFile = `src/styles/theme-entry-${theme.name}-min.js`;
                if (fs.existsSync(entryFile)) {
                    fs.unlinkSync(entryFile);
                }
            }
        },
        postcss({
            extract: true,
            sourceMap: true,
            minimize: true,
            plugins: [autoprefixer(), cssnano()],
            use: ['sass'],
        }),
    ],
}));

// ============================================================================
// Main CSS Build Configurations
// ============================================================================

// Main CSS (non-minified)
const cssConfig = {
    input: 'src/styles/main-entry.js',
    output: {
        file: 'dist/css/smartwizard.css',
        format: 'es',
    },
    plugins: [
        {
            name: 'main-css-entry-generator',
            buildStart() {
                const entryContent = `import './main.scss';`;
                fs.mkdirSync('src/styles', { recursive: true });
                fs.writeFileSync('src/styles/main-entry.js', entryContent);
            },
            buildEnd() {
                const entryFile = 'src/styles/main-entry.js';
                if (fs.existsSync(entryFile)) {
                    fs.unlinkSync(entryFile);
                }
            }
        },
        postcss({
            extract: true,
            sourceMap: true,
            minimize: false,
            plugins: [autoprefixer()],
            use: ['sass'],
        }),
    ],
};

// Main CSS (minified)
const cssMinConfig = {
    input: 'src/styles/main-entry-min.js',
    output: {
        file: 'dist/css/smartwizard.min.css',
        format: 'es',
    },
    plugins: [
        {
            name: 'main-css-entry-generator-min',
            buildStart() {
                const entryContent = `import './main.scss';`;
                fs.mkdirSync('src/styles', { recursive: true });
                fs.writeFileSync('src/styles/main-entry-min.js', entryContent);
            },
            buildEnd() {
                const entryFile = 'src/styles/main-entry-min.js';
                if (fs.existsSync(entryFile)) {
                    fs.unlinkSync(entryFile);
                }
            }
        },
        postcss({
            extract: true,
            sourceMap: true,
            minimize: true,
            plugins: [autoprefixer(), cssnano()],
            use: ['sass'],
        }),
    ],
};

// ============================================================================
// Development Server Configuration
// ============================================================================

const devServerConfig = isDev
    ? [
        {
            input: 'src/index.ts',
            output: {
                file: 'dist/dev/smartwizard.dev.js',
                format: 'umd',
                name: 'smartWizard',
                sourcemap: true,
            },
            plugins: [
                resolve(),
                commonjs(),
                typescript({
                    tsconfig: './tsconfig.json',
                }),
                serve({
                    open: false,
                    contentBase: ['dist', 'examples'],
                    port: 3001,
                }),
                livereload({
                    watch: ['dist', 'examples'],
                }),
            ],
        },
    ]
    : [];

// ============================================================================
// Export All Configurations
// ============================================================================

export default [
    jsConfig,
    jsMinUmdConfig,
    jsMinEsmConfig,
    jsMinCjsConfig,
    cssConfig,
    cssMinConfig,
    ...themeConfigs,
    ...themeMinConfigs,
    ...devServerConfig,
];
