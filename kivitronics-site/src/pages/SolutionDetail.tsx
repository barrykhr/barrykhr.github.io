import { Link, Navigate, useParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { solutionBySlug, solutions } from '@/data/solutions'
import { cta } from '@/data/site'
import { ArrowRight, ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/primitives'
import { FinalCta } from '@/sections/FinalCta'

/** One template, five pages. Content comes entirely from src/data/solutions.ts. */
export function SolutionDetail() {
  const { slug } = useParams()
  const solution = slug ? solutionBySlug(slug) : undefined

  if (!solution) return <Navigate to="/solutions" replace />

  const others = solutions.filter((s) => s.slug !== solution.slug)

  return (
    <>
      <Seo
        title={`${solution.name} — KiVitronics`}
        description={solution.summary}
        path={`/solutions/${solution.slug}`}
      />

      <PageHero
        eyebrow={`Solutions · ${solution.index}`}
        title={solution.name}
        lede={solution.summary}
        actions={
          <>
            <ButtonLink to={cta.primary.href} size="lg" arrow>
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink to="/solutions" variant="secondary" size="lg">
              All solutions
            </ButtonLink>
          </>
        }
        aside={
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-7">
            <p className="label text-muted">What you get</p>
            <ul className="mt-5 space-y-3.5">
              {solution.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-[0.9375rem] leading-snug text-foreground">
                  <svg aria-hidden="true" viewBox="0 0 14 14" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 7.5 5.5 10.5 11.5 4" />
                  </svg>
                  {o}
                </li>
              ))}
            </ul>
            {solution.metric && (
              <div className="mt-7 border-t border-border pt-5">
                <p className="tnum text-[2rem] leading-none font-medium text-primary">
                  {solution.metric.display}
                </p>
                <p className="mt-2.5 text-[0.8125rem] text-muted">{solution.metric.label}</p>
              </div>
            )}
          </div>
        }
      />

      {/* ── The problem this solves ── */}
      <Section tone="background">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
            <Reveal>
              <h2 className="text-h2 text-foreground">The problem</h2>
            </Reveal>
            <Reveal delay={70}>
              <p className="max-w-[62ch] text-lede text-muted">{solution.problem}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── How we run it ── */}
      <Section tone="surface">
        <Container width="wide">
          <SectionHeading eyebrow="Approach" title="How we run it." />
          <ol className="mt-[clamp(2.5rem,2rem+2vw,4rem)] grid gap-4 md:grid-cols-2">
            {solution.approach.map((a, i) => (
              <li key={a.title}>
                <Reveal delay={i * 70} className="h-full">
                  <article className="flex h-full flex-col rounded-lg border border-border bg-background p-6 lg:p-7">
                    <span className="label tnum text-primary">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-5 text-h3 text-foreground">{a.title}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{a.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── Fit ── */}
      <Section tone="background">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
            <Reveal>
              <h2 className="text-h2 text-foreground">Best suited to</h2>
            </Reveal>
            <div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {solution.bestFor.map((b, i) => (
                  <li key={b}>
                    <Reveal delay={i * 60}>
                      <div className="rounded-md border border-border bg-surface px-5 py-4 text-[0.9375rem] text-foreground">
                        {b}
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Other solutions ── */}
      <Section tone="surface-2" spacing="tight">
        <Container width="wide">
          <p className="label text-muted">Other solutions</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  to={`/solutions/${o.slug}`}
                  className="group flex h-full items-center justify-between gap-4 rounded-md border border-border bg-surface px-5 py-4 transition-[border-color,transform] duration-[var(--duration-base)] hover:-translate-y-0.5 hover:border-border-strong"
                >
                  <span className="text-[0.9375rem] font-medium text-foreground">{o.shortName}</span>
                  <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
