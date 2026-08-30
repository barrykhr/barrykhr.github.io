import { pillars } from '@/data/narrative'
import { Container, Reveal, Section, SectionHeading } from '@/components/primitives'

/**
 * Not "why choose us" — four claims, each with the number that backs it. A
 * pillar without evidence would just be an adjective.
 */
export function WhyUs() {
  return (
    <Section tone="surface" id="why">
      <Container width="wide">
        <SectionHeading
          eyebrow="Why KiVitronics"
          title="Four claims, each with a number behind it."
          lede="Anyone can assert quality and speed. These are the measures we manage the business against."
        />

        <ul className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((p, i) => (
            <li key={p.key} className="bg-surface">
              <Reveal delay={i * 70} className="h-full">
                <article className="flex h-full flex-col p-6 transition-colors duration-[var(--duration-base)] hover:bg-background lg:p-7">
                  <h3 className="text-h4 font-medium text-foreground">{p.title}</h3>
                  <p className="mt-4 text-[1.0625rem] leading-snug font-medium text-foreground">
                    {p.statement}
                  </p>
                  <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-muted">{p.body}</p>
                  <div className="mt-8 border-t border-border pt-5">
                    <p className="tnum text-[1.75rem] leading-none font-medium text-primary">
                      {p.metric.display}
                    </p>
                    <p className="mt-2 text-[0.75rem] text-muted">{p.metric.label}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
