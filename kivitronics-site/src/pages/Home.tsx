import { Seo } from '@/components/Seo'
import { Hero } from '@/sections/Hero'
import { MetricStrip } from '@/sections/MetricStrip'
import { ProblemFunnel } from '@/sections/ProblemFunnel'
import { Beliefs } from '@/sections/Beliefs'
import { Pathways } from '@/sections/Pathways'
import { FinalCta } from '@/sections/FinalCta'

/**
 * The homepage makes the argument and then gets out of the way: promise, proof,
 * the problem we exist for, what we believe, and three doors into the detail.
 * Every framework and dataset lives on the page that owns it.
 */
export function Home() {
  return (
    <>
      <Seo
        title="KiVitronics Consulting — The right talent. Properly qualified. Personally managed."
        description="A specialist recruitment consultancy that owns the hiring outcome from requirement to joining. 136 roles closed, 72% mandate closure, 91% offer-to-joining conversion."
        path="/"
      />
      <Hero />
      <MetricStrip />
      <ProblemFunnel />
      <Beliefs />
      <Pathways />
      <FinalCta />
    </>
  )
}
