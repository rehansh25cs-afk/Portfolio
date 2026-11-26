import React from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App.jsx'

export function render(page) {
  const html = renderToString(<App page={page} />)

  // React emits eager image preloads before the component markup.
  const head = html.match(/^(?:<link[^>]*>)+/)?.[0] ?? ''
  return { head, markup: html.slice(head.length) }
}
