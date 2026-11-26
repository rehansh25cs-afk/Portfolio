import { randomUUID } from 'node:crypto'
import { writeFile, unlink } from 'node:fs/promises'
import { build } from 'vite'
import config from '../vite.config.js'
import { getPage } from '../src/site.js'

const serverBuild = await build({
  configFile: false,
  build: { ssr: 'src/entry-server.jsx', write: false },
})
const entry = serverBuild.output.find((part) => part.type === 'chunk' && part.isEntry)
const temporaryEntry = new URL(`../node_modules/.portfolio-${randomUUID()}.mjs`, import.meta.url)
const root = '<div id="root"></div>'
await writeFile(temporaryEntry, entry.code, { flag: 'wx' })

try {
  const { render } = await import(temporaryEntry.href)
  await build({
    ...config,
    configFile: false,
    plugins: [...config.plugins, {
      name: 'prerender-portfolio',
      transformIndexHtml(html, { path }) {
        const page = getPage(path)
        if (!page) throw new Error(`No page configured for ${path}`)
        if (!html.includes(root)) throw new Error(`No prerender root found for ${path}`)

        const { head, markup } = render(page)
        return html
          .replace('</head>', () => `${head ? `  ${head}\n  ` : ''}</head>`)
          .replace(root, () => `<div id="root">${markup}</div>`)
      },
    }],
  })
} finally {
  await unlink(temporaryEntry)
}
