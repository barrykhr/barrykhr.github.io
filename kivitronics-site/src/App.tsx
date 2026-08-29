import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { WhatWeDo } from '@/pages/WhatWeDo'
import { HowWeWork } from '@/pages/HowWeWork'
import { Proof } from '@/pages/Proof'
import { InsightsPage } from '@/pages/InsightsPage'
import { About } from '@/pages/About'
import { ForTalent } from '@/pages/ForTalent'
import { StartMandate } from '@/pages/StartMandate'
import { NotFound } from '@/pages/NotFound'

/**
 * Resets scroll on navigation, but honours in-page hash targets so links like
 * /start-a-mandate#talk still land where they should.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export function App() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="/proof" element={<Proof />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/for-talent" element={<ForTalent />} />
          <Route path="/start-a-mandate" element={<StartMandate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
