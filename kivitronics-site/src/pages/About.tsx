import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { aboutBrief, pillars } from '@/data/narrative'
import { brand, contact } from '@/data/site'
import { deliveryMetrics } from '@/data/metrics'
import { Stat } from '@/components/Metric'
import { cta } from '@/data/site'
import { ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/primitives'
import { FinalCta } from '@/sections/FinalCta'

export function About() {
  return (
    <>
      <Seo
        title="About — KiVitronics"
        description="KiVitronics is a talent partner for IT and non-IT hiring across the US and India, built around outcomes measured at joining."
        path="/about"
      />
      <PageHero
        eyebrow="About"
        title="Built around the outcome, not the submission."
        lede={aboutBrief.body[1]}
        actions={
          <ButtonLink to={cta.primary.href} size="lg" arrow>
            {cta.primary.label}
          </ButtonLink>
        }
      />

      <Section tone="background">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
            <Reveal>
              <h2 className="text-h2 text-foreground">What we do</h2>
            </Reveal>
            <div>
              <Reveal delay={70}>
                <p className="max-w-[62ch] text-lede text-muted">{aboutBrief.body[0]}</p>
              </Reveal>
              <Reveal delay={130}>
                <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-3">
                  <div>
                    <dt className="label text-muted">Entity</dt>
                    <dd className="mt-2.5 text-[0.9375rem] text-foreground">{brand.legalName}</dd>
                  </div>
                  <div>
                    <dt className="label text-muted">Based in</dt>
                    <dd className="mt-2.5 text-[0.9375rem] text-foreground">{contact.location}</dd>
                  </div>
                  <div>
                    <dt className="label text-muted">Markets</dt>
                    <dd className="mt-2.5 text-[0.9375rem] text-foreground">
                      {contact.markets.join(' · ')}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface">
        <Container width="wide">
          <SectionHeading
            eyebrow="How we operate"
            title="Four commitments, each with a number behind it."
          />
          <ul className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((p, i) => (
              <li key={p.key} className="bg-surface">
                <Reveal delay={i * 70} className="h-full">
                  <article className="flex h-full flex-col p-6 lg:p-7">
                    <h3 className="text-h4 font-medium text-foreground">{p.title}</h3>
                    <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-muted">{p.body}</p>
                    <div className="mt-7 border-t border-border pt-5">
                      <p className="tnum text-[1.5rem] leading-none font-medium text-primary">
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

      <Section tone="background">
        <Container width="wide">
          <SectionHeading eyebrow="The record" title="Measured at joining." />
          <dl className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 xl:grid-cols-7">
            {deliveryMetrics.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <Stat {...m} size="sm" />
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
