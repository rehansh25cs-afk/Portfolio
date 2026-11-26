import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { pages } from './src/site.js'
import { portfolioSeo } from './scripts/seo.js'

export default defineConfig({
  appType: 'mpa',
  plugins: [portfolioSeo()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map(({ id, path }) => [
        id,
        fileURLToPath(new URL(`.${path}index.html`, import.meta.url)),
      ])),
    },
  },
})
