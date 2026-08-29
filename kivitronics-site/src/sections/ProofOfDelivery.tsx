import { deliveryMetrics } from '@/data/metrics'
import { MetricFigure } from '@/components/Metric'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'
import { ClosureDots, ConversionArc, TimeToCloseChart } from '@/components/viz/DeliveryCharts'

/** Section 07 — delivery, quantified. Three charts, then the full record. */
export function ProofOfDelivery() {
  const secondary = deliveryMetrics.filter((m) => m.value !== 136)

  return (
    <Section tone="ink" id="proof">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container width="wide" className="relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow tone="on-dark">
                Proof
              </Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-d2 text-ivory">Delivery, quantified.</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 max-w-[52ch] text-lede text-ivory/62">
                Every number below is measured at joining. Submissions, shortlists and interviews
                are activity — they are not a result.
              </p>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="lg:text-right">
              <p className="tnum font-display text-num font-semibold text-ivory">136</p>
              <p className="mt-4 text-[0.9375rem] font-medium tracking-[0.02em] text-gold uppercase">
                Roles closed
              </p>
            </div>
          </Reveal>
        </div>

        {/* ---- Charts ---- */}
        <div className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-px border border-ivory/12 bg-ivory/12 lg:grid-cols-3">
          <Reveal className="bg-ink">
            <div className="flex h-full flex-col p-[clamp(1.5rem,1rem+1.6vw,2.5rem)]">
              <p className="eyebrow text-ivory/55">Mandate closure</p>
              <p className="mt-3 max-w-[26ch] text-[0.9375rem] text-ivory/62">
                Of every hundred mandates we accept, seventy-two are closed.
              </p>
              <div className="mt-8 flex-1">
                <ClosureDots />
              </div>
              <p className="tnum mt-6 font-display text-[2rem] leading-none font-semibold tracking-[-0.04em] text-ivory">
                72<span className="text-gold">%</span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={80} className="bg-ink">
            <div className="flex h-full flex-col p-[clamp(1.5rem,1rem+1.6vw,2.5rem)]">
              <p className="eyebrow text-ivory/55">Offer → joining</p>
              <p className="mt-3 max-w-[26ch] text-[0.9375rem] text-ivory/62">
                The conversion most agencies never publish, because it is measured after their
                involvement ends.
              </p>
              <div className="mt-8 flex flex-1 items-end">
                <ConversionArc />
              </div>
              <p className="tnum mt-6 font-display text-[2rem] leading-none font-semibold tracking-[-0.04em] text-ivory">
                91<span className="text-gold">%</span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={160} className="bg-ink">
            <div className="flex h-full flex-col p-[clamp(1.5rem,1rem+1.6vw,2.5rem)]">
              <p className="eyebrow text-ivory/55">Time to close</p>
              <p className="mt-3 max-w-[26ch] text-[0.9375rem] text-ivory/62">
                Standard mandates close inside a month. Scarce-skill briefs take about six weeks.
              </p>
              <div className="mt-8">
                <TimeToCloseChart />
              </div>
              <p className="tnum mt-auto pt-6 font-display text-[2rem] leading-none font-semibold tracking-[-0.04em] text-ivory">
                20–30
                <span className="ml-2 text-[0.875rem] font-normal tracking-normal text-gold">
                  days, standard
                </span>
              </p>
            </div>
          </Reveal>
        </div>

        {/* ---- The full record ---- */}
        <dl className="mt-[clamp(3rem,2rem+3vw,5rem)] grid grid-cols-2 gap-x-8 gap-y-12 border-t border-ivory/12 pt-12 lg:grid-cols-3">
          {secondary.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 60}>
              <div>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <MetricFigure {...metric} tone="ivory" size="compact" />
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
