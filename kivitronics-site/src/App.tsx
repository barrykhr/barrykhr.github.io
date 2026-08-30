import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { redirects } from '@/data/redirects'
import { Home } from '@/pages/Home'
import { Solutions } from '@/pages/Solutions'
import { SolutionDetail } from '@/pages/SolutionDetail'
import { Industries } from '@/pages/Industries'
import { HowWeWork } from '@/pages/HowWeWork'
import { About } from '@/pages/About'
import { Insights } from '@/pages/Insights'
import { Contact } from '@/pages/Contact'
import { Careers } from '@/pages/Careers'
import { ForTalent } from '@/pages/ForTalent'
import { NotFound } from '@/pages/NotFound'

/**
 * Resets scroll on navigation but honours in-page hash targets, so a redirect
 * like /proof → /how-we-work#record lands on the right section.
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

          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />

          <Route path="/industries" element={<Industries />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="/about" element={<About />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/for-talent" element={<ForTalent />} />

          {/* Preserved URLs from the previous architecture. */}
          {redirects.map((r) => (
            <Route key={r.from} path={r.from} element={<Navigate to={r.to} replace />} />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
