import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
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

// ============================================================================
// JavaScript Build Configurations
// ============================================================================

// Main JS build config (UMD, ESM, CJS - non-minified)
const jsBuildConfig = {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/js/jquery.smartWizard.js',
            format: 'umd',
            name: 'SmartWizard',
            banner,
            sourcemap: true,
            exports: 'named',
            globals: {
                jquery: 'jQuery'
            }
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
    external: ['jquery'],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: false,
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

// Minified UMD build
const umdMinConfig = {
    input: 'src/index.ts',
    output: {
        file: 'dist/js/jquery.smartWizard.min.js',
        format: 'umd',
        name: 'SmartWizard',
        banner,
        sourcemap: true,
        exports: 'named',
        globals: {
            jquery: 'jQuery'
        }
    },
    external: ['jquery'],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json', declaration: false }),
        terser(),
    ],
};

// Minified ESM build
const esmMinConfig = {
    input: 'src/index.ts',
    output: {
        file: 'dist/js/jquery.smartWizard.esm.min.js',
        format: 'es',
        banner,
        sourcemap: true
    },
    external: ['jquery'],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json', declaration: false }),
        terser(),
    ],
};

// Minified CJS build
const cjsMinConfig = {
    input: 'src/index.ts',
    output: {
        file: 'dist/js/jquery.smartWizard.cjs.min.js',
        format: 'cjs',
        banner,
        sourcemap: true,
        exports: 'named'
    },
    external: ['jquery'],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json', declaration: false }),
        terser(),
    ],
};

// ============================================================================
// CSS Theme Build Configurations
// ============================================================================

// Get all theme files from the themes directory
const themesDir = 'src/styles/themes';
const themeFiles = fs.existsSync(themesDir)
    ? fs.readdirSync(themesDir)
        .filter(file => file.endsWith('.scss') && !file.startsWith('_'))
        .map(file => ({
            name: file.replace('.scss', ''),
            path: path.join(themesDir, file)
        }))
    : [];

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
const mainCssConfig = {
    input: 'src/styles/main-entry.js',
    output: {
        file: 'dist/css/smartwizard.css',
        format: 'es',
    },
    plugins: [
        {
            name: 'main-css-entry-generator',
            buildStart() {
                // Create temporary entry file for main CSS
                const entryContent = `import './main.scss';`;
                fs.writeFileSync('src/styles/main-entry.js', entryContent);
            },
            buildEnd() {
                // Clean up temporary entry file
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
const mainCssMinConfig = {
    input: 'src/styles/main-entry-min.js',
    output: {
        file: 'dist/css/smartwizard.min.css',
        format: 'es',
    },
    plugins: [
        {
            name: 'main-css-entry-generator-min',
            buildStart() {
                // Create temporary entry file for main CSS
                const entryContent = `import './main.scss';`;
                fs.writeFileSync('src/styles/main-entry-min.js', entryContent);
            },
            buildEnd() {
                // Clean up temporary entry file
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
// Export all configurations
// ============================================================================

export default defineConfig([
    jsBuildConfig,
    ...(!dev ? [umdMinConfig, esmMinConfig, cjsMinConfig] : []),
    mainCssConfig,
    ...(!dev ? [mainCssMinConfig] : []),
    ...themeConfigs,
    ...(!dev ? themeMinConfigs : [])
]);
