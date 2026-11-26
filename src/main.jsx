import React, { useRef } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { getPage, pages } from './site.js'
import { usePortfolioMotion } from './usePortfolioMotion.js'
import './styles.css'

function Portfolio({ page }) {
  const pageRef = useRef(null)
  usePortfolioMotion(pageRef)
  return <App page={page} pageRef={pageRef} />
}

const root = document.getElementById('root')
const page = getPage(window.location.pathname) ?? pages[0]
const app = <Portfolio page={page} />

if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
