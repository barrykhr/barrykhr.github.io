import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { solutions } from '@/data/solutions'
import { ArrowRight, ButtonLink, Container, Reveal, Section } from '@/components/primitives'
import { cta } from '@/data/site'
import { HowItWorks } from '@/sections/HowItWorks'
import { FinalCta } from '@/sections/FinalCta'

export function Solutions() {
  return (
    <>
      <Seo
        title="Solutions — KiVitronics"
        description="RPO, IT recruitment, non-IT recruitment, global recruitment across the US and India, and structured talent matching."
        path="/solutions"
      />
      <PageHero
        eyebrow="Solutions"
        title="One delivery model, five ways to engage it."
        lede="Run your entire hiring function as a managed service, or hand us a single role that has already failed once. The process and the standard do not change."
        actions={
          <>
            <ButtonLink to={cta.primary.href} size="lg" arrow>
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink to="/how-we-work" variant="secondary" size="lg">
              See how we work
            </ButtonLink>
          </>
        }
        figures={[
          { value: '136', label: 'Roles closed' },
          { value: '91%', label: 'Offer to joining' },
          { value: '20–30', label: 'Days, standard closure' },
          { value: '500K+', label: 'Talent network' },
        ]}
      />

      <Section tone="background">
        <Container width="wide">
          <ul className="grid gap-4">
            {solutions.map((s, i) => (
              <li key={s.slug}>
                <Reveal delay={i * 60}>
                  <Link
                    to={`/solutions/${s.slug}`}
                    className="group grid gap-6 rounded-lg border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_auto] lg:items-center lg:gap-12 lg:p-8"
                  >
                    <div>
                      <span className="label tnum text-primary">{s.index}</span>
                      <h2 className="mt-4 text-h3 text-foreground">{s.name}</h2>
                    </div>

                    <div>
                      <p className="text-[0.9375rem] leading-relaxed text-muted">{s.summary}</p>
                      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                        {s.outcomes.map((o) => (
                          <li key={o} className="flex items-center gap-1.5 text-[0.8125rem] text-muted-strong">
                            <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 6.5 4.8 9 10 3.5" />
                            </svg>
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <span className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-primary lg:justify-self-end">
                      Explore
                      <ArrowRight />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <HowItWorks />
      <FinalCta />
    </>
  )
}
