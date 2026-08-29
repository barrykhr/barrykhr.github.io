import { useState } from 'react'
import { cx } from '@/lib/cx'
import { preparationClosing, preparationTiers } from '@/data/preparation'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 11 — preparation changes with seniority.
 * Three columns; the active one expands. On mobile all three are open.
 */
export function InterviewPreparation() {
  const [active, setActive] = useState(1)

  return (
    <Section tone="paper" id="preparation">
      <Container width="wide">
        <div className="max-w-[40rem]">
          <Reveal>
            <Eyebrow>Preparation</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-d2 text-ink">
              Interview preparation changes
              <span className="text-ink/50"> with seniority.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-px border border-ink/12 bg-ink/12 lg:grid-cols-3">
          {preparationTiers.map((tier, i) => {
            const isActive = i === active
            return (
              <Reveal key={tier.level} delay={i * 80} className="bg-paper">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={cx(
                    'flex h-full w-full flex-col p-[clamp(1.5rem,1rem+1.6vw,2.5rem)] text-left transition-colors duration-500',
                    isActive ? 'bg-ink text-ivory' : 'bg-paper hover:bg-ivory',
                  )}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className={cx(
                        'font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-semibold tracking-[-0.03em]',
                        isActive ? 'text-ivory' : 'text-ink',
                      )}
                    >
                      {tier.level}
                    </span>
                    <span
                      className={cx(
                        'text-[0.6875rem] font-semibold tracking-[0.12em] uppercase',
                        isActive ? 'text-gold' : 'text-ink/62',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p
                    className={cx(
                      'mt-2 text-[0.9375rem]',
                      isActive ? 'text-gold-400' : 'text-ink/62',
                    )}
                  >
                    {tier.frame}
                  </p>

                  <ul className="mt-8 flex-1 space-y-3">
                    {tier.focus.map((item) => (
                      <li
                        key={item}
                        className={cx(
                          'flex items-baseline gap-3 border-b pb-3 text-[0.9375rem] last:border-b-0',
                          isActive
                            ? 'border-ivory/12 text-ivory/85'
                            : 'border-ink/8 text-ink/65',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cx(
                            'h-1 w-1 shrink-0 translate-y-[-2px] rounded-full',
                            isActive ? 'bg-gold' : 'bg-ink/25',
                          )}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p
                    className={cx(
                      'mt-8 text-[0.8125rem] leading-relaxed',
                      isActive ? 'text-ivory/50' : 'text-ink/62',
                    )}
                  >
                    {tier.note}
                  </p>
                </button>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <div className="mt-[clamp(2.5rem,2rem+2vw,4rem)] flex flex-col gap-6 border-t-2 border-ink pt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-d3 font-semibold text-ink">
              <span>{preparationClosing.equation[0]}</span>
              <span className="text-gold-500">{preparationClosing.equation[1]}</span>
              <span>{preparationClosing.equation[2]}</span>
            </p>
            <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink/60">
              {preparationClosing.body}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
