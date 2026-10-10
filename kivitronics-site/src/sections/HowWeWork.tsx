import { howWeWork } from '@/data/content'
import { Container, Reveal, Section } from '@/components/primitives'

/**
 * How we work — a thesis block, four principles, and a coverage strip that
 * hands off to the Industries section directly below it.
 */
export function HowWeWork() {
  const { eyebrow, lead, principles, coverage } = howWeWork

  return (
    <Section tone="surface" id="how-we-work">
      <Container>
        {/* The thesis is the section heading — repeating "How we work" as both
            an eyebrow and an h2 said the same thing twice. */}
        <div className="max-w-[46rem]">
          <Reveal>
            <p className="label text-primary">{eyebrow}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-h2 text-foreground">{lead.heading}</h2>
          </Reveal>
          {lead.body.map((para, i) => (
            <Reveal key={para.slice(0, 24)} delay={110 + i * 50}>
              <p className="mt-5 max-w-[58ch] text-lede text-muted">{para}</p>
            </Reveal>
          ))}
        </div>

        {/* ── Principles ── */}
        <ul className="mt-[clamp(2.5rem,2rem+2vw,4rem)] grid gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-2">
          {principles.map((block, i) => (
            <li key={block.id} className="bg-surface">
              <Reveal delay={i * 70} className="h-full">
                <article className="flex h-full flex-col p-[clamp(1.5rem,1.25rem+1.5vw,2.5rem)]">
                  <span className="label tnum text-faint">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-5 max-w-[24ch] text-h3 text-foreground">{block.heading}</h3>
                  {block.body.map((para) => (
                    <p
                      key={para.slice(0, 24)}
                      className="mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted"
                    >
                      {para}
                    </p>
                  ))}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* ── Coverage: leads into the Industries section below ── */}
        <Reveal>
          <div className="mt-4 grid gap-8 rounded-lg border border-border bg-background p-[clamp(1.75rem,1.25rem+2vw,3rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
            <div>
              <h3 className="max-w-[20ch] text-h3 text-foreground">{coverage.heading}</h3>
              <p className="mt-5 max-w-[56ch] text-[1rem] leading-relaxed text-muted">
                {coverage.body}
              </p>
            </div>
            <div>
              <p className="label text-muted">Functions</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {coverage.functions.map((fn) => (
                  <li
                    key={fn}
                    className="rounded-sm border border-border bg-surface px-3 py-1.5 text-[0.875rem] text-foreground"
                  >
                    {fn}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
