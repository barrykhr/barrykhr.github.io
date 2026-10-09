import { whatWeDo } from '@/data/content'
import { Container, Reveal, Section } from '@/components/primitives'

export function WhatWeDo() {
  return (
    <Section tone="surface" id="what-we-do">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="label text-primary">{whatWeDo.eyebrow}</p>
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
                        className="rounded-sm border border-border bg-background px-3 py-1.5 text-[0.875rem] text-foreground"
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
                        className="rounded-sm border border-border bg-background px-3 py-1.5 text-[0.875rem] text-foreground"
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
