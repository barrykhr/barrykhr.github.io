import { valueProof } from '@/data/narrative'
import { deliveryMetrics } from '@/data/metrics'
import { Stat } from '@/components/Metric'
import { ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/primitives'

/** The three figures the trust bar does not already carry. */
const relationshipMetrics = deliveryMetrics.filter((m) =>
  ['Companies served', 'Issued more than one mandate', 'Hires across our three deepest accounts'].includes(
    m.label,
  ),
)

export function ValueProof() {
  return (
    <Section tone="background" id="proof">
      <Container width="wide">
        <SectionHeading
          eyebrow={valueProof.eyebrow}
          title={valueProof.headline}
          lede={valueProof.lede}
          action={
            <ButtonLink to="/how-we-work" variant="secondary" arrow>
              Inspect the process
            </ButtonLink>
          }
        />

        <div className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-4 lg:grid-cols-3">
          {valueProof.proofs.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="h-full">
              <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 shadow-xs lg:p-7">
                <h3 className="text-h3 text-foreground">{p.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-4 grid gap-4 rounded-lg border border-border bg-surface p-6 shadow-xs lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16 lg:p-8">
            <p className="max-w-[24ch] text-h3 text-foreground">
              The second mandate is the only client review that cannot be written for you.
            </p>
            <dl className="grid grid-cols-3 gap-x-8">
              {relationshipMetrics.map((m) => (
                <div key={m.label}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd>
                    <Stat {...m} size="sm" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
