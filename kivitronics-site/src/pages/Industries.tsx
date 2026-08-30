import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { coverage } from '@/data/narrative'
import { cta } from '@/data/site'
import { ArrowRight, ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/primitives'
import { FinalCta } from '@/sections/FinalCta'

export function Industries() {
  return (
    <>
      <Seo
        title="Coverage — KiVitronics"
        description="The technology and non-technology role families we hire across, in the United States and India."
        path="/industries"
      />
      <PageHero
        eyebrow="Coverage"
        title="IT and non-IT. Both, properly."
        lede="Two hiring domains run on one process. Below is the scope we work across — stated as scope, not as a claim to specialise equally in every one of them."
        actions={
          <ButtonLink to={cta.primary.href} size="lg" arrow>
            {cta.primary.label}
          </ButtonLink>
        }
      />

      <Section tone="background">
        <Container width="wide">
          <div className="grid gap-4 lg:grid-cols-2">
            {coverage.domains.map((d, i) => (
              <Reveal key={d.key} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 lg:p-8">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={'h-2 w-2 rounded-full ' + (d.key === 'it' ? 'bg-primary' : 'bg-accent')}
                    />
                    <h2 className="text-h3 text-foreground">{d.label}</h2>
                  </div>

                  <ul className="mt-7 flex-1 divide-y divide-border border-t border-border">
                    {d.families.map((f) => (
                      <li key={f} className="py-3.5 text-[0.9375rem] text-foreground">
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={d.href}
                    className="group mt-7 inline-flex items-center gap-2 text-[0.875rem] font-medium text-primary"
                  >
                    How we hire here
                    <ArrowRight />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 rounded-lg border border-border bg-surface-2 p-6 lg:p-7">
              <p className="max-w-[62ch] text-[1rem] text-muted-strong">{coverage.note}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="surface">
        <Container width="wide">
          <SectionHeading
            eyebrow="Markets"
            title="United States and India."
            lede="Both markets are run by the same delivery team on the same process, so a shortlist means the same thing wherever the role sits."
            action={
              <ButtonLink to="/solutions/global-recruitment" variant="secondary" arrow>
                Global recruitment
              </ButtonLink>
            }
          />
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
