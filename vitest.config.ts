/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  test: {
    include: ['./test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['./test/utils/**/*.ts', './test/**/*.init.ts'],
    deps: {
      inline: ['vitest-canvas-mock']
    },
    setupFiles: ['./test/setup'],
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { resources: 'usable' }
    },
    threads: false,
    globals: true
  },
  resolve: {
    alias: {
      'effect-canvas/test': path.resolve(__dirname, '/test'),
      'effect-canvas': path.resolve(__dirname, '/src')
    }
  }
})
