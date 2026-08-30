import { Link } from 'react-router-dom'
import { coverage } from '@/data/narrative'
import { ArrowRight, Container, Reveal, Section, SectionHeading } from '@/components/primitives'

export function Coverage() {
  return (
    <Section tone="background" id="coverage">
      <Container width="wide">
        <SectionHeading eyebrow={coverage.eyebrow} title={coverage.headline} lede={coverage.lede} />

        <div className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-4 md:grid-cols-2">
          {coverage.domains.map((d, i) => (
            <Reveal key={d.key} delay={i * 80} className="h-full">
              <Link
                to={d.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md lg:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-h3 text-foreground">{d.label}</h3>
                  <span
                    aria-hidden="true"
                    className={
                      'h-2 w-2 rounded-full ' + (d.key === 'it' ? 'bg-primary' : 'bg-accent')
                    }
                  />
                </div>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {d.families.map((f) => (
                    <li
                      key={f}
                      className="rounded-sm border border-border bg-background px-3 py-1.5 text-[0.8125rem] text-muted-strong transition-colors duration-[var(--duration-fast)] group-hover:border-border-strong"
                    >
                      {f}
                    </li>
                  ))}
                </ul>

                <span className="mt-8 inline-flex items-center gap-2 text-[0.875rem] font-medium text-primary">
                  See how we hire here
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-[0.9375rem] text-muted">{coverage.note}</p>
        </Reveal>
      </Container>
    </Section>
  )
}
