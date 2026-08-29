import { useState } from 'react'
import { cx } from '@/lib/cx'
import { leakIntro, leakStages } from '@/data/funnel'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 03 — where hiring leaks.
 *
 * The funnel is the storytelling device: each band is a stage, each gap between
 * bands is a handover, and every handover has a named failure mode. Selecting a
 * stage moves the explanation panel. Keyboard-operable; the panel is a live
 * region so the change is announced.
 */
export function ProblemFunnel() {
  const [active, setActive] = useState(0)
  const stage = leakStages[active]

  return (
    <Section tone="ivory" id="the-problem">
      <Container width="wide">
        <div className="max-w-[38rem]">
          <Reveal>
            <Eyebrow>The problem</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-d2 text-ink">
              {leakIntro.headline[0]}
              <span className="block text-ink/50">{leakIntro.headline[1]}</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-[56ch] text-lede text-ink/68">{leakIntro.body}</p>
          </Reveal>
        </div>

        <div className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* ---- Funnel ---- */}
          <Reveal>
            <ul className="flex flex-col gap-2.5" role="list">
              {leakStages.map((s, i) => {
                const isActive = i === active
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      aria-pressed={isActive}
                      className="group block w-full text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={cx(
                            'tnum w-8 shrink-0 text-[0.6875rem] font-semibold tracking-[0.1em] tabular-nums transition-colors',
                            isActive ? 'text-gold-600' : 'text-ink/62',
                          )}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        <span className="relative block flex-1">
                          <span
                            className={cx(
                              'flex h-[clamp(2.75rem,2rem+1.6vw,3.75rem)] items-center px-5 transition-[width,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                              isActive
                                ? 'bg-ink text-ivory'
                                : 'bg-ink/[0.055] text-ink/70 group-hover:bg-ink/10',
                            )}
                            style={{ width: `${Math.max(s.width * 100, 26)}%` }}
                          >
                            <span className="truncate font-display text-[clamp(0.9375rem,0.85rem+0.4vw,1.25rem)] font-medium tracking-[-0.015em]">
                              {s.label}
                            </span>
                          </span>
                        </span>

                        {s.leak && (
                          <span
                            className={cx(
                              'hidden shrink-0 items-center gap-2 text-[0.75rem] transition-colors sm:flex',
                              isActive ? 'text-gold-600' : 'text-ink/62',
                            )}
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 20 12"
                              className="h-3 w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.2"
                            >
                              <path d="M0 1h9c4 0 5 3 6 5m0 0-2.5-1.5M15 6l-1 2.8" strokeLinecap="round" />
                            </svg>
                            <span className="whitespace-nowrap">{s.leak.name}</span>
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Reveal>

          {/* ---- Explanation ---- */}
          <Reveal delay={100}>
            <div
              aria-live="polite"
              className="sticky top-28 border-t-2 border-gold bg-paper p-[clamp(1.5rem,1rem+2vw,2.75rem)]"
            >
              <p className="eyebrow text-ink/62">Leak point</p>
              <h3 className="mt-4 text-d4 text-ink">{stage.leak?.name ?? stage.label}</h3>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink/70">
                {stage.leak?.detail}
              </p>
              <div className="mt-8 border-t border-ink/10 pt-6">
                <p className="text-[0.9375rem] leading-relaxed text-ink/62">
                  Most recruitment is measured at stage two. We are measured at stage six.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
