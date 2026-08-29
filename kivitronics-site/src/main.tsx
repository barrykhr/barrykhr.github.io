import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { App } from '@/App'
import '@/styles/index.css'
import { injectStructuredData } from '@/lib/structuredData'

// Vite's BASE_URL always ends in "/" — react-router wants it without.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

// The single-file preview build has no server to route paths, so it ships with
// a hash router instead. Production always uses real URLs.
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter
const routerProps = import.meta.env.VITE_ROUTER === 'hash' ? {} : { basename }

injectStructuredData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router {...routerProps}>
      <App />
    </Router>
  </StrictMode>,
)
