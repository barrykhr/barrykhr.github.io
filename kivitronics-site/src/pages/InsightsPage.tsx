import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { Insights } from '@/sections/Insights'
import { FinalCta } from '@/sections/FinalCta'

export function InsightsPage() {
  return (
    <>
      <Seo
        title="Insights — KiVitronics Consulting"
        description="Hiring intelligence, talent market insights, interview intelligence and recruitment benchmarks from live mandates."
        path="/insights"
      />
      <PageHero
        eyebrow="Insights"
        title={
          <>
            Hiring intelligence,
            <span className="text-ivory/45"> from live mandates.</span>
          </>
        }
        lede="We publish what the work teaches us: where processes break, how markets are actually behaving, and what separates an interview that converts from one that does not. Nothing here is written until we have the evidence for it."
      />
      <Insights />
      <FinalCta />
    </>
  )
}
