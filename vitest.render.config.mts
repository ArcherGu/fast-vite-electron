import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: fileURLToPath(new URL('./src/render', import.meta.url)),
  plugins: [vue()],
  resolve: {
    alias: {
      '@render': fileURLToPath(new URL('./src/render', import.meta.url)),
      '@main': fileURLToPath(new URL('./src/main', import.meta.url)),
      '@common': fileURLToPath(new URL('./src/common', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
