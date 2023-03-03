import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    target: 'es2020',
    outDir: "../dist/example/",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'example/index.html'),
        spiral: resolve(__dirname, 'example/prime-spiral.html'),
        snowflake: resolve(__dirname, 'example/snowflake.html'),
      }
    }
  },
  base: "/graphics-ts/example/",
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    }
  }
})
