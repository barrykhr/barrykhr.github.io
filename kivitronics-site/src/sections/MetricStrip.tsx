import { headlineMetrics } from '@/data/metrics'
import { MetricFigure } from '@/components/Metric'
import { Container, Reveal } from '@/components/primitives'

/**
 * Section 02 — proof before persuasion. Sits directly under the hero so the
 * delivery record is the second thing a visitor reads.
 */
export function MetricStrip({ tone = 'ink' }: { tone?: 'ink' | 'ivory' }) {
  const onDark = tone === 'ink'
  return (
    <section
      aria-label="Delivery record"
      className={onDark ? 'on-ink border-t border-ivory/12 bg-ink' : 'bg-ivory'}
    >
      <Container width="wide" className="py-[clamp(2.75rem,2rem+2.5vw,4.5rem)]">
        <dl
          className={
            'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-10 ' +
            (onDark ? 'divide-ivory/12' : 'divide-ink/10')
          }
        >
          {headlineMetrics.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 80}>
              <div
                className={
                  'lg:border-l lg:pl-8 ' +
                  (onDark ? 'lg:border-ivory/12' : 'lg:border-ink/10') +
                  (i === 0 ? ' lg:border-l-0 lg:pl-0' : '')
                }
              >
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <MetricFigure {...metric} tone={onDark ? 'ivory' : 'ink'} />
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}
