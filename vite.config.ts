import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  server: {
    open: '/examples/index.html'
  },
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'copify',
    },
    rollupOptions: {
      input: {
        lib: 'src/index.ts'
      },
      // If you use external libraries, list them here
      external: [],
      output: [
        // ESM output
        {
          format: 'es',
          dir: path.resolve(__dirname, 'dist'),
          entryFileNames: 'index.mjs',        // produces dist/index.mjs
          chunkFileNames: 'chunks/[name]-[hash].mjs',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
        // CJS output
        {
          format: 'cjs',
          dir: path.resolve(__dirname, 'dist'),
          entryFileNames: 'index.js',     // produces dist/index.js
          chunkFileNames: 'chunks/[name]-[hash].cjs.js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          exports: 'named'
        }
      ]
    },

  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});