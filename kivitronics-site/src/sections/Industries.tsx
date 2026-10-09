import { industries } from '@/data/content'
import { Container, Reveal, Section } from '@/components/primitives'

export function Industries() {
  return (
    <Section tone="background" id="industries">
      <Container>
        <div className="max-w-[46rem]">
          <Reveal>
            <p className="label text-primary">{industries.eyebrow}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-h2 text-foreground">{industries.heading}</h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="mt-5 text-lede text-muted">{industries.body}</p>
          </Reveal>
        </div>

        {/* Seven items: self-contained cards rather than a lattice, so the
            odd count never leaves an empty cell at the end of a row. */}
        <ul className="mt-[clamp(2.5rem,2rem+2vw,4rem)] flex flex-wrap gap-3">
          {industries.list.map((industry, i) => (
            <li key={industry} className="w-[calc(50%-0.375rem)] sm:w-auto">
              <Reveal delay={(i % 4) * 60} className="h-full">
                <div className="group flex h-full items-center gap-3 rounded-lg border border-border bg-surface px-6 py-5 transition-[border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-border-strong">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary transition-transform duration-[var(--duration-base)] group-hover:scale-150"
                  />
                  <span className="text-[1rem] font-medium whitespace-nowrap text-foreground">
                    {industry}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
