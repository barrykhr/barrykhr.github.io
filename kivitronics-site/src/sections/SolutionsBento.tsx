import { Link } from 'react-router-dom'
import { solutions } from '@/data/solutions'
import { ArrowRight, ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/primitives'

/**
 * Bento, not a uniform grid: the first card is wide and carries a metric, the
 * rest are compact. Size encodes importance rather than decorating the layout.
 */
export function SolutionsBento() {
  const [lead, ...rest] = solutions

  return (
    <Section tone="surface" id="solutions">
      <Container width="wide">
        <SectionHeading
          eyebrow="Solutions"
          title="One delivery model, five ways to engage it."
          lede="Whether we run your whole hiring function or a single hard role, the process and the standard are the same."
          action={
            <ButtonLink to="/solutions" variant="secondary" arrow>
              All solutions
            </ButtonLink>
          }
        />

        <ul className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* Lead card — spans two columns from md up */}
          <li className="md:col-span-2">
            <Reveal className="h-full">
              <Link
                to={`/solutions/${lead.slug}`}
                className="group flex h-full flex-col justify-between gap-8 rounded-lg border border-border bg-background p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md lg:flex-row lg:items-end lg:p-8"
              >
                <div className="max-w-[42ch]">
                  <span className="label tnum text-primary">{lead.index}</span>
                  <h3 className="mt-5 text-h2 text-foreground">{lead.name}</h3>
                  <p className="mt-4 text-[1rem] leading-relaxed text-muted">{lead.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-medium text-primary">
                    Explore RPO
                    <ArrowRight />
                  </span>
                </div>
                {lead.metric && (
                  <div className="shrink-0 rounded-lg border border-border bg-surface p-5 lg:min-w-[13rem]">
                    <p className="tnum text-[clamp(2rem,1.6rem+1.4vw,2.75rem)] leading-none font-medium text-foreground">
                      {lead.metric.display}
                    </p>
                    <p className="mt-3 text-[0.8125rem] text-muted">{lead.metric.label}</p>
                  </div>
                )}
              </Link>
            </Reveal>
          </li>

          {rest.map((s, i) => (
            <li key={s.slug}>
              <Reveal delay={(i + 1) * 60} className="h-full">
                <Link
                  to={`/solutions/${s.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-background p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
                >
                  <span className="label tnum text-primary">{s.index}</span>
                  <h3 className="mt-5 text-h3 text-foreground">{s.name}</h3>
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{s.teaser}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-medium text-foreground">
                    Learn more
                    <ArrowRight />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
