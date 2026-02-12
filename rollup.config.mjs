import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const isDev = process.env.ROLLUP_WATCH;

// Banner for output files
const banner = `/*!
 * jQuery SmartWizard v7.0.1
 * The awesome step wizard plugin for jQuery
 * http://www.techlaboratory.net/jquery-smartwizard
 *
 * Created by Dipu Raj (http://dipu.me)
 *
 * Licensed under the terms of the MIT License
 * https://github.com/techlab/jquery-smartwizard/blob/master/LICENSE
 */`;

// ============================================================================
// JavaScript Build Configurations
// ============================================================================

const outputFileName = 'jquery.smartWizard';

// Main JS build (UMD, ESM, CJS) - non-minified
const jsConfig = {
    input: 'src/index.ts',
    external: ['jquery'],
    output: [
        {
            file: `dist/js/${outputFileName}.js`,
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
            file: `dist/js/${outputFileName}.esm.js`,
            format: 'es',
            banner,
            sourcemap: true
        },
        {
            file: `dist/js/${outputFileName}.cjs.js`,
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

// Minified builds - all formats in one config
const jsMinifiedConfigs = {
    input: 'src/index.ts',
    external: ['jquery'],
    output: [
        // UMD format
        {
            file: `dist/js/${outputFileName}.min.js`,
            format: 'umd',
            name: 'smartWizard',
            banner,
            sourcemap: true,
            globals: {
                jquery: 'jQuery'
            },
            exports: 'named'
        },
        // ESM format
        {
            file: `dist/js/${outputFileName}.esm.min.js`,
            format: 'es',
            banner,
            sourcemap: true
        },
        // CJS format
        {
            file: `dist/js/${outputFileName}.cjs.min.js`,
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
    input: `.rollup-cache/theme-entry-${theme.name}.js`,
    output: {
        file: `dist/css/themes/${theme.name}.css`,
        format: 'es',
    },
    watch: {
        exclude: ['dist/**', '.rollup-cache/**'],
    },
    plugins: [
        {
            name: 'theme-entry-generator',
            buildStart() {
                // Create temporary entry file for the theme
                const entryContent = `import '../${theme.path}';`;
                fs.mkdirSync('.rollup-cache', { recursive: true });
                fs.writeFileSync(`.rollup-cache/theme-entry-${theme.name}.js`, entryContent);
            },
            buildEnd() {
                // Clean up temporary entry file
                const entryFile = `.rollup-cache/theme-entry-${theme.name}.js`;
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
    input: `.rollup-cache/theme-entry-${theme.name}-min.js`,
    output: {
        file: `dist/css/themes/${theme.name}.min.css`,
        format: 'es',
    },
    watch: {
        exclude: ['dist/**', '.rollup-cache/**'],
    },
    plugins: [
        {
            name: 'theme-entry-generator-min',
            buildStart() {
                // Create temporary entry file for the theme
                const entryContent = `import '../${theme.path}';`;
                fs.mkdirSync('.rollup-cache', { recursive: true });
                fs.writeFileSync(`.rollup-cache/theme-entry-${theme.name}-min.js`, entryContent);
            },
            buildEnd() {
                // Clean up temporary entry file
                const entryFile = `.rollup-cache/theme-entry-${theme.name}-min.js`;
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
    input: '.rollup-cache/main-entry.js',
    output: {
        file: 'dist/css/smartwizard.css',
        format: 'es',
    },
    watch: {
        exclude: ['dist/**', '.rollup-cache/**'],
    },
    plugins: [
        {
            name: 'main-css-entry-generator',
            buildStart() {
                const entryContent = `import '../src/styles/main.scss';`;
                fs.mkdirSync('.rollup-cache', { recursive: true });
                fs.writeFileSync('.rollup-cache/main-entry.js', entryContent);
            },
            buildEnd() {
                const entryFile = '.rollup-cache/main-entry.js';
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
    input: '.rollup-cache/main-entry-min.js',
    output: {
        file: 'dist/css/smartwizard.min.css',
        format: 'es',
    },
    watch: {
        exclude: ['dist/**', '.rollup-cache/**'],
    },
    plugins: [
        {
            name: 'main-css-entry-generator-min',
            buildStart() {
                const entryContent = `import '../src/styles/main.scss';`;
                fs.mkdirSync('.rollup-cache', { recursive: true });
                fs.writeFileSync('.rollup-cache/main-entry-min.js', entryContent);
            },
            buildEnd() {
                const entryFile = '.rollup-cache/main-entry-min.js';
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
                sourcemap: false,  // Disabled to avoid path resolution issues in dev server
            },
            plugins: [
                resolve(),
                commonjs(),
                typescript({
                    tsconfig: './tsconfig.json',
                    declaration: false,
                    declarationMap: false
                }),
                serve({
                    open: false,
                    contentBase: ['dist', 'examples'],
                    port: 3001,
                }),
                livereload({
                    watch: ['dist/dev', 'dist/css', 'examples'],
                    verbose: true,
                    delay: 500,  // Add delay to ensure files are written before reload
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
    jsMinifiedConfigs,
    cssConfig,
    cssMinConfig,
    ...themeConfigs,
    ...themeMinConfigs,
    ...devServerConfig,
];
