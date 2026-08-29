import { cx } from '@/lib/cx'
import { insightCategories, insights } from '@/data/insights'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 14 — insights.
 *
 * The structure is real and CMS-ready; the articles are not written yet, so each
 * card carries an honest "Coming soon" state rather than fabricated content.
 * Add an entry to `src/data/insights.ts` with status 'published' and a slug and
 * it renders as a live card with no further changes here.
 */
export function Insights() {

  return (
    <Section tone="paper" id="insights">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[42rem]">
            <Reveal>
              <Eyebrow>Insights</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-d2 text-ink">
                What we learn from mandates,
                <span className="text-ink/50"> written down.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-[40ch] text-[1.0625rem] leading-relaxed text-ink/60">
              Hiring intelligence drawn from live mandates — market behaviour, interview patterns and
              the points where processes fail. Publishing shortly.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <ul className="mt-10 flex flex-wrap gap-2">
            {insightCategories.map((category) => (
              <li key={category}>
                <span className="inline-block border border-ink/15 px-3 py-1.5 text-[0.75rem] text-ink/62">
                  {category}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <ul className="mt-[clamp(2.5rem,2rem+2vw,4rem)] grid gap-px border border-ink/12 bg-ink/12 md:grid-cols-2 xl:grid-cols-3">
          {insights.map((item, i) => {
            const published = item.status === 'published' && item.slug
            const Inner = (
              <article className="flex h-full min-h-[15rem] flex-col justify-between p-[clamp(1.5rem,1rem+1.5vw,2.25rem)]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.6875rem] font-semibold tracking-[0.12em] text-gold-600 uppercase">
                    {item.category}
                  </span>
                  {!published && (
                    <span className="shrink-0 border border-ink/20 px-2 py-1 text-[0.5625rem] font-semibold tracking-[0.14em] text-ink/62 uppercase">
                      Coming soon
                    </span>
                  )}
                </div>
                <div className="mt-10">
                  <h3
                    className={cx(
                      'font-display text-[1.375rem] leading-[1.15] font-medium tracking-[-0.02em]',
                      published ? 'text-ink' : 'text-ink/70',
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/62">
                    {item.standfirst}
                  </p>
                </div>
              </article>
            )
            return (
              <li key={item.id} className="bg-paper transition-colors duration-500 hover:bg-ivory">
                <Reveal delay={(i % 3) * 70} className="h-full">
                  {published ? (
                    <a href={`/insights/${item.slug}`} className="block h-full">
                      {Inner}
                    </a>
                  ) : (
                    Inner
                  )}
                </Reveal>
              </li>
            )
          })}
        </ul>

      </Container>
    </Section>
  )
}
