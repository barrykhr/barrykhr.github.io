import { howWeWork } from '@/data/content'
import { cx } from '@/lib/cx'
import { useInView } from '@/lib/hooks'
import { Container, Reveal, Section } from '@/components/primitives'

/**
 * How we work — a thesis, four principles on a drawn spine, and a coverage
 * block that hands off to the Industries section below.
 *
 * The principles sit in a single column rather than a grid so the connector
 * between them is an actual sequence: each segment draws downward as its step
 * enters view. A 2x2 grid would have needed a snaking line that reads as
 * decoration rather than continuity.
 */

function Principle({
  index,
  heading,
  body,
  last,
}: {
  index: number
  heading: string
  body: readonly string[]
  last: boolean
}) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.3 })

  return (
    <li ref={ref} className="relative pb-10 pl-16 last:pb-0 sm:pl-20">
      {/* the spine segment, drawn as this step arrives */}
      {!last && (
        <span
          aria-hidden="true"
          className={cx(
            'bg-accent-gradient absolute top-11 bottom-0 left-[1.1875rem] w-px origin-top transition-transform duration-[900ms] ease-[var(--ease-out)] sm:left-[1.4375rem]',
            inView ? 'scale-y-100' : 'scale-y-0',
          )}
        />
      )}

      <span
        aria-hidden="true"
        className={cx(
          'absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border text-[0.75rem] font-semibold transition-[background-color,border-color,color,transform] duration-500 ease-[var(--ease-out)] sm:h-12 sm:w-12 sm:text-[0.8125rem]',
          inView
            ? 'bg-accent-gradient scale-100 border-transparent text-white'
            : 'scale-95 border-border bg-surface text-faint',
        )}
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="pt-1.5 sm:pt-2.5">
        <h3 className="max-w-[26ch] text-h3 text-foreground">{heading}</h3>
        {body.map((para) => (
          <p
            key={para.slice(0, 24)}
            className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-muted"
          >
            {para}
          </p>
        ))}
      </div>
    </li>
  )
}

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

        <ol className="mt-[clamp(3rem,2.5rem+2vw,4.5rem)]">
          {principles.map((block, i) => (
            <Principle
              key={block.id}
              index={i + 1}
              heading={block.heading}
              body={block.body}
              last={i === principles.length - 1}
            />
          ))}
        </ol>

        {/* ── Coverage: leads into the Industries section below ── */}
        <Reveal>
          <div className="mt-[clamp(2.5rem,2rem+2vw,4rem)] grid gap-8 rounded-xl border border-border bg-background p-[clamp(1.75rem,1.25rem+2vw,3rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
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
                    className="rounded-md border border-border bg-surface px-3.5 py-2 text-[0.875rem] text-foreground"
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
