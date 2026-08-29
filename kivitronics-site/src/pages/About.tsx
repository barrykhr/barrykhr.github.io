import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { AboutSection } from '@/sections/AboutSection'
import { TechnologyVision } from '@/sections/TechnologyVision'
import { FinalCta } from '@/sections/FinalCta'

export function About() {
  return (
    <>
      <Seo
        title="About — KiVitronics Consulting"
        description="KiVitronics is a specialist recruitment consultancy built around outcomes: selective mandates, five-dimension qualification, and accountability measured at joining."
        path="/about"
      />
      <PageHero
        eyebrow="About"
        title={
          <>
            Built to own
            <span className="block text-ivory/45">the outcome.</span>
          </>
        }
        lede="KiVitronics exists because hiring is measured in the wrong place. Shortlists, submissions and interview counts describe effort. We built the firm around the only measure a business actually cares about — whether the right person started."
      />
      <AboutSection />
      <TechnologyVision />
      <FinalCta />
    </>
  )
}
