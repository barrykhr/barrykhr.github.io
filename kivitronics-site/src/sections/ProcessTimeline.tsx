import { useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { processClosing, stages } from '@/data/process'
import { timeToClose } from '@/data/metrics'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 05 — the nine-stage operating model.
 *
 * Desktop renders a horizontal rail with tab semantics (arrow keys move between
 * stages). Below `lg` the same content becomes a vertical timeline with every
 * stage open — a horizontal scroller on a phone hides content behind a gesture
 * people don't know is there.
 */
export function ProcessTimeline() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const current = stages[active]

  function onKeyDown(e: React.KeyboardEvent) {
    const last = stages.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    if (next !== null) {
      e.preventDefault()
      setActive(next)
      tabRefs.current[next]?.focus()
    }
  }

  return (
    <Section tone="ink" id="how-we-work">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container width="wide" className="relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[40rem]">
            <Reveal>
              <Eyebrow tone="on-dark">
                How we work
              </Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-d2 text-ivory">
                From requirement to joining
                <span className="text-ivory/45"> — one accountable journey.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-[30ch] font-display text-[1.375rem] leading-[1.25] tracking-[-0.02em] text-ivory/75">
              {processClosing.line1}
              <span className="block text-gold">{processClosing.line2}</span>
            </p>
          </Reveal>
        </div>

        {/* ---------------- Desktop rail ---------------- */}
        <div className="mt-[clamp(3rem,2rem+3vw,5rem)] hidden lg:block">
          <Reveal>
            <div
              role="tablist"
              aria-label="The nine stages of a KiVitronics mandate"
              onKeyDown={onKeyDown}
              className="relative grid grid-cols-9"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-[0.4375rem] h-px bg-ivory/15"
              />
              <span
                aria-hidden="true"
                className="absolute top-[0.4375rem] left-0 h-px bg-gold transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${((active + 0.5) / stages.length) * 100}%` }}
              />
              {stages.map((stage, i) => {
                const isActive = i === active
                const isPast = i < active
                return (
                  <button
                    key={stage.index}
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    role="tab"
                    id={`stage-tab-${stage.index}`}
                    aria-selected={isActive}
                    aria-controls="stage-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className="group relative pt-0 pb-2 text-left"
                  >
                    <span className="relative z-10 flex h-3.5 w-3.5 items-center justify-center">
                      <span
                        className={cx(
                          'block rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                          isActive
                            ? 'h-3.5 w-3.5 bg-gold ring-4 ring-gold/20'
                            : isPast
                              ? 'h-2 w-2 bg-gold/70'
                              : 'h-2 w-2 bg-ivory/25 group-hover:bg-ivory/50',
                        )}
                      />
                    </span>
                    <span
                      className={cx(
                        'tnum mt-5 block text-[0.6875rem] font-semibold tracking-[0.1em] transition-colors',
                        isActive ? 'text-gold' : 'text-ivory/55',
                      )}
                    >
                      {stage.index}
                    </span>
                    <span
                      className={cx(
                        'mt-1.5 block pr-3 font-display text-[1.0625rem] font-medium tracking-[-0.015em] transition-colors',
                        isActive ? 'text-ivory' : 'text-ivory/50 group-hover:text-ivory/80',
                      )}
                    >
                      {stage.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div
              role="tabpanel"
              id="stage-panel"
              aria-labelledby={`stage-tab-${current.index}`}
              className="mt-12 grid gap-10 border-t border-ivory/12 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16"
            >
              <h3 className="text-d3 text-ivory">{current.summary}</h3>
              <p className="max-w-[58ch] text-lede text-ivory/62">{current.detail}</p>
            </div>
          </Reveal>
        </div>

        {/* ---------------- Mobile vertical timeline ---------------- */}
        <ol className="mt-12 lg:hidden">
          {stages.map((stage, i) => (
            <li key={stage.index} className="relative pb-10 pl-9 last:pb-0">
              <span
                aria-hidden="true"
                className={cx(
                  'absolute top-2 left-[0.3125rem] w-px bg-ivory/25',
                  i === stages.length - 1 ? 'h-0' : 'bottom-0',
                )}
              />
              <span
                aria-hidden="true"
                className="absolute top-[0.4375rem] left-0 h-2.5 w-2.5 rounded-full bg-gold"
              />
              <Reveal delay={40}>
                <p className="tnum text-[0.6875rem] font-semibold tracking-[0.1em] text-gold">
                  {stage.index}
                </p>
                <h3 className="mt-2 font-display text-[1.375rem] font-medium tracking-[-0.02em] text-ivory">
                  {stage.name}
                </h3>
                <p className="mt-2 text-[1rem] text-ivory/72">{stage.summary}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/55">
                  {stage.detail}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* ---------------- Timing evidence ---------------- */}
        <div className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-px border border-ivory/12 bg-ivory/12 sm:grid-cols-3">
          {timeToClose.map((item, i) => (
            <Reveal key={item.label} delay={i * 70} className="bg-ink">
              <div className="p-[clamp(1.5rem,1rem+1.5vw,2.25rem)]">
                <p className="tnum font-display text-[clamp(2rem,1.4rem+2vw,3rem)] leading-none font-semibold tracking-[-0.04em] text-ivory">
                  {item.range}
                  <span className="ml-2 text-[0.875rem] font-normal tracking-normal text-gold">
                    {item.unit}
                  </span>
                </p>
                <p className="mt-4 text-[0.9375rem] font-medium text-ivory/85">{item.label}</p>
                <p className="mt-1.5 text-[0.8125rem] text-ivory/55">{item.detail}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={140} className="bg-ink">
            <div className="p-[clamp(1.5rem,1rem+1.5vw,2.25rem)]">
              <p className="tnum font-display text-[clamp(2rem,1.4rem+2vw,3rem)] leading-none font-semibold tracking-[-0.04em] text-ivory">
                72<span className="text-gold">%</span>
              </p>
              <p className="mt-4 text-[0.9375rem] font-medium text-ivory/85">Mandates closed</p>
              <p className="mt-1.5 text-[0.8125rem] text-ivory/55">Of mandates received.</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
