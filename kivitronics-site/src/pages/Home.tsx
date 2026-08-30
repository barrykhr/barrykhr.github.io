import { Seo } from '@/components/Seo'
import { Hero } from '@/sections/Hero'
import { TrustBar } from '@/sections/TrustBar'
import { Problem } from '@/sections/Problem'
import { SolutionsBento } from '@/sections/SolutionsBento'
import { HowItWorks } from '@/sections/HowItWorks'
import { Scale } from '@/sections/Scale'
import { Coverage } from '@/sections/Coverage'
import { WhyUs } from '@/sections/WhyUs'
import { ValueProof } from '@/sections/ValueProof'
import { AboutBrief } from '@/sections/AboutBrief'
import { FinalCta } from '@/sections/FinalCta'

/** The homepage follows the buyer journey: what, why care, how, why us, next. */
export function Home() {
  return (
    <>
      <Seo
        title="KiVitronics — Talent infrastructure for companies that are scaling"
        description="RPO, IT and non-IT recruitment, and global hiring across the US and India. 136 roles closed, 91% offer-to-joining conversion, a 500K+ talent network."
        path="/"
      />
      <Hero />
      <TrustBar />
      <Problem />
      <SolutionsBento />
      <HowItWorks />
      <Scale />
      <Coverage />
      <WhyUs />
      <ValueProof />
      <AboutBrief />
      <FinalCta />
    </>
  )
}
