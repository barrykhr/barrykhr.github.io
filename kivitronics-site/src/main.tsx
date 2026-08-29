import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'
import '@/styles/index.css'
import { injectStructuredData } from '@/lib/structuredData'

// Vite's BASE_URL always ends in "/" — react-router wants it without.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

injectStructuredData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
