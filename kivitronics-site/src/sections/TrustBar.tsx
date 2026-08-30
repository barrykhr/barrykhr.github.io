import { headlineMetrics } from '@/data/metrics'
import { Stat } from '@/components/Metric'
import { Container, Reveal, Section } from '@/components/primitives'

/**
 * Proof before persuasion. No client logos — none were supplied, and inventing
 * them is the fastest way to lose the credibility this section exists to build.
 */
export function TrustBar() {
  return (
    <Section tone="surface" spacing="none" ariaLabel="Delivery record" className="border-b border-border">
      <Container width="wide" className="py-[clamp(2.5rem,2rem+2vw,4rem)]">
        <Reveal>
          <p className="label text-muted">
            Delivered across IT and non-IT hiring in the United States and India
          </p>
        </Reveal>
        <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {headlineMetrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 70}>
              <div className="md:border-l md:border-border md:pl-6 md:first:border-l-0 md:first:pl-0">
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <Stat {...m} size="sm" />
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
