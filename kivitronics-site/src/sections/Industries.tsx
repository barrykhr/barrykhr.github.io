import { industries } from '@/data/content'
import { hueRotation, sectionMeta } from '@/data/sections'
import { Container, Reveal, Section, SectionMarker, accentStyle } from '@/components/primitives'

export function Industries() {
  const meta = sectionMeta('industries')

  return (
    <Section tone="background" meta={meta}>
      <Container>
        <div className="max-w-[46rem]">
          <Reveal>
            <SectionMarker meta={meta} />
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-h2 text-foreground">{industries.heading}</h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="mt-5 text-lede text-muted">{industries.body}</p>
          </Reveal>
        </div>

        {/* Seven items: self-contained cards rather than a lattice, so the
            odd count never leaves an empty cell at the end of a row.

            This is the one place where colour is per ITEM rather than per
            section: seven industries are seven categories, and distinguishing
            them is the actual job, so each card is keyed to its own hue of the
            family. The card stays a neutral white surface — only the dot, the
            hover border and the hover ground carry the hue, which is what keeps
            seven colours in one viewport legible instead of loud. */}
        <ul className="mt-[clamp(2.5rem,2rem+2vw,4rem)] flex flex-wrap gap-3">
          {industries.list.map((industry, i) => (
            <li
              key={industry}
              className="w-[calc(50%-0.375rem)] sm:w-auto"
              style={accentStyle(hueRotation[i % hueRotation.length])}
            >
              <Reveal delay={(i % 4) * 60} className="h-full">
                <div className="group hover:border-sx-line hover:bg-sx-soft flex h-full items-center gap-3 rounded-lg border border-border bg-surface px-6 py-5 transition-[background-color,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5">
                  <span
                    aria-hidden="true"
                    className="bg-sx h-2 w-2 shrink-0 rounded-full transition-transform duration-[var(--duration-base)] group-hover:scale-150"
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
