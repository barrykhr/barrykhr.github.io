import { whatWeDo } from '@/data/content'
import { sectionMeta } from '@/data/sections'
import { Container, Reveal, Section, SectionMarker } from '@/components/primitives'

export function WhatWeDo() {
  const meta = sectionMeta('what-we-do')

  return (
    <Section tone="surface" meta={meta}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <SectionMarker meta={meta} />
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-h2 text-foreground">{whatWeDo.heading}</h2>
            </Reveal>
          </div>

          <div>
            <Reveal delay={110}>
              <p className="max-w-[60ch] text-lede text-muted">{whatWeDo.body}</p>
            </Reveal>

            <Reveal delay={170}>
              <dl className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
                <div>
                  <dt className="label text-muted">Career levels</dt>
                  <dd className="mt-4 flex flex-wrap gap-2">
                    {whatWeDo.levels.map((l) => (
                      <span
                        key={l}
                        className="hover:border-sx-line hover:bg-sx-soft rounded-sm border border-border bg-background px-3 py-1.5 text-[0.875rem] text-foreground transition-[background-color,border-color] duration-[var(--duration-fast)]"
                      >
                        {l}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="label text-muted">Leadership hiring</dt>
                  <dd className="mt-4 flex flex-wrap gap-2">
                    {whatWeDo.leadership.map((l) => (
                      <span
                        key={l}
                        className="hover:border-sx-line hover:bg-sx-soft rounded-sm border border-border bg-background px-3 py-1.5 text-[0.875rem] text-foreground transition-[background-color,border-color] duration-[var(--duration-fast)]"
                      >
                        {l}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
