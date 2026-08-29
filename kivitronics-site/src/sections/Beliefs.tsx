import { beliefClosing, beliefs } from '@/data/beliefs'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/** Section 04 — what we believe. Four dimensions of a hire, then the point. */
export function Beliefs() {
  return (
    <Section tone="paper" id="what-we-believe">
      <Container width="wide">
        <div className="max-w-[44rem]">
          <Reveal>
            <Eyebrow>What we believe</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-d2 text-ink">
              Recruitment should be measured by outcomes
              <span className="text-ink/50"> — not activity.</span>
            </h2>
          </Reveal>
        </div>

        <ol className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 xl:grid-cols-4">
          {beliefs.map((belief, i) => (
            <li key={belief.index} className="bg-paper">
              <Reveal delay={i * 70}>
                <article className="group flex h-full flex-col justify-between p-[clamp(1.5rem,1rem+1.6vw,2.5rem)] transition-colors duration-500 sm:min-h-[clamp(15rem,12rem+8vw,20rem)] hover:bg-ivory">
                  <div className="flex items-start justify-between gap-4">
                    <span className="tnum font-display text-[0.8125rem] font-semibold tracking-[0.08em] text-gold-600">
                      {belief.index}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px w-8 bg-ink/15 transition-[width,background-color] duration-500 group-hover:w-14 group-hover:bg-gold"
                    />
                  </div>

                  <div className="mt-8 sm:mt-12">
                    <h3 className="text-d4 text-ink">{belief.title}</h3>
                    <ul className="mt-6 space-y-2.5">
                      {belief.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-baseline gap-3 text-[0.9375rem] text-ink/60"
                        >
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 shrink-0 translate-y-[-2px] rounded-full bg-gold"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <p className="mt-[clamp(3rem,2rem+3vw,5rem)] max-w-[22ch] font-display text-d3 font-semibold text-ink">
            {beliefClosing.line1}
            <span className="block text-gold-500">{beliefClosing.line2}</span>
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
