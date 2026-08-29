import { useState } from 'react'
import { cx } from '@/lib/cx'
import { comparison, cvInsight, dimensions } from '@/data/qualification'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Pentagon geometry — five vertices, top-first. The viewBox is padded well
 * beyond the polygon so the vertex labels have room and never clip.
 */
const R = 132
const CX = 200
const CY = 186
const VIEW_BOX = '-48 -8 496 372'
const points = dimensions.map((_, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / dimensions.length
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) }
})
const polygon = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

function StepChain({
  label,
  steps,
  tone,
}: {
  label: string
  steps: readonly string[]
  tone: 'muted' | 'brand'
}) {
  const brand = tone === 'brand'
  return (
    <div
      className={cx(
        'flex h-full flex-col p-[clamp(1.5rem,1rem+1.6vw,2.25rem)]',
        brand ? 'bg-ink text-ivory' : 'bg-ink/[0.04] text-ink',
      )}
    >
      <p className={cx('eyebrow', brand ? 'text-gold' : 'text-ink/62')}>{label}</p>
      <ol className="mt-7 flex flex-1 flex-wrap items-start gap-x-2 gap-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cx(
                'inline-flex items-center px-3 py-2 text-[0.8125rem] font-medium',
                brand ? 'bg-ivory/8 text-ivory' : 'bg-paper text-ink/60',
              )}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <svg
                aria-hidden="true"
                viewBox="0 0 12 8"
                className={cx('h-2 w-3', brand ? 'text-gold' : 'text-ink/62')}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M0 4h10M7 1l3 3-3 3" strokeLinecap="square" />
              </svg>
            )}
          </li>
        ))}
      </ol>
      <p className={cx('mt-8 text-[0.8125rem]', brand ? 'text-ivory/55' : 'text-ink/62')}>
        {brand
          ? 'Six deliberate steps. The role is calibrated and the market is understood before anyone is contacted.'
          : 'Three steps, all of them downstream of a brief nobody interrogated.'}
      </p>
    </div>
  )
}

/**
 * Section 06 — the five-dimension qualification model.
 *
 * Above `lg` the five dimensions sit on a pentagon so the three that are not
 * visible on a CV read as a contiguous arc. Below `lg` the pentagon collapses to
 * a list: a 320px-wide radial diagram is unreadable, not simplified.
 */
export function QualificationModel() {
  const [active, setActive] = useState(0)
  const offCv = dimensions.filter((d) => !d.onCv).length

  return (
    <Section tone="paper" id="qualification">
      <Container width="wide">
        <div className="max-w-[46rem]">
          <Reveal>
            <Eyebrow>Qualification</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-d2 text-ink">
              The quality of the hire starts
              <span className="text-ink/50"> before the search.</span>
            </h2>
          </Reveal>
        </div>

        {/* ---- Traditional vs KiVitronics ---- */}
        <Reveal>
          <div className="mt-[clamp(2.5rem,2rem+2vw,4rem)] grid gap-px border border-ink/10 bg-ink/10 lg:grid-cols-2">
            <StepChain label={comparison.traditional.label} steps={comparison.traditional.steps} tone="muted" />
            <StepChain label={comparison.kivitronics.label} steps={comparison.kivitronics.steps} tone="brand" />
          </div>
        </Reveal>

        {/* ---- The five dimensions ---- */}
        <div className="mt-[clamp(3.5rem,2.5rem+3vw,6rem)] grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* Radial (desktop) */}
          <Reveal className="hidden lg:block">
            <svg
              viewBox={VIEW_BOX}
              className="w-full"
              role="img"
              aria-label="The five qualification dimensions arranged on a pentagon: capability, relevance, motivation, expectations and risk."
            >
              {[0.34, 0.67, 1].map((scale) => (
                <polygon
                  key={scale}
                  points={points
                    .map(
                      (p) =>
                        `${(CX + (p.x - CX) * scale).toFixed(1)},${(CY + (p.y - CY) * scale).toFixed(1)}`,
                    )
                    .join(' ')}
                  fill="none"
                  stroke="#0B0F14"
                  strokeOpacity={0.08}
                />
              ))}
              <polygon points={polygon} fill="#C8A84E" fillOpacity={0.05} stroke="none" />

              {points.map((p, i) => (
                <line
                  key={`spoke-${dimensions[i].index}`}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  stroke={i === active ? '#C8A84E' : '#0B0F14'}
                  strokeOpacity={i === active ? 0.9 : 0.12}
                  strokeWidth={i === active ? 1.4 : 1}
                />
              ))}

              <circle cx={CX} cy={CY} r={4} fill="#0B0F14" />
              <text
                x={CX}
                y={CY + 26}
                textAnchor="middle"
                className="fill-ink/62"
                style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}
              >
                Qualified
              </text>

              {points.map((p, i) => {
                const d = dimensions[i]
                const isActive = i === active
                const labelY = p.y < CY ? p.y - 26 : p.y + 34
                const anchor = Math.abs(p.x - CX) < 12 ? 'middle' : p.x > CX ? 'start' : 'end'
                const labelX = anchor === 'middle' ? p.x : p.x > CX ? p.x + 14 : p.x - 14
                return (
                  <g
                    key={d.index}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
                    {isActive && (
                      <circle cx={p.x} cy={p.y} r={14} fill="#C8A84E" fillOpacity={0.16} />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 7 : 5}
                      fill={d.onCv ? '#68758A' : '#C8A84E'}
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor={anchor}
                      className={isActive ? 'fill-ink' : 'fill-ink/62'}
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {d.name}
                    </text>
                  </g>
                )
              })}
            </svg>

            <div className="mt-6 flex items-center gap-6 text-[0.75rem] text-ink/62">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-slate" />
                Visible on the CV
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold" />
                Not visible on the CV
              </span>
            </div>
          </Reveal>

          {/* Dimension list — the control on desktop, the whole thing on mobile */}
          <div>
            <ul className="border-t border-ink/10">
              {dimensions.map((d, i) => {
                const isActive = i === active
                return (
                  <li key={d.index} className="border-b border-ink/10">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      aria-expanded={isActive}
                      className="group block w-full py-6 text-left"
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={cx(
                            'tnum text-[0.6875rem] font-semibold tracking-[0.1em]',
                            isActive ? 'text-gold-600' : 'text-ink/62',
                          )}
                        >
                          {d.index}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3
                            className={cx(
                              'font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] font-medium tracking-[-0.02em] transition-colors',
                              isActive ? 'text-ink' : 'text-ink/62 group-hover:text-ink/75',
                            )}
                          >
                            {d.name}
                          </h3>
                          <p
                            className={cx(
                              'mt-1.5 text-[0.9375rem]',
                              isActive ? 'text-ink/70' : 'text-ink/62',
                            )}
                          >
                            {d.question}
                          </p>
                          <div
                            className={cx(
                              'grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                              isActive ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                            )}
                          >
                            <div className="overflow-hidden">
                              <p className="max-w-[46ch] border-l-2 border-gold pl-4 text-[0.9375rem] leading-relaxed text-ink/60">
                                {d.detail}
                              </p>
                            </div>
                          </div>
                        </div>
                        {!d.onCv && (
                          <span className="shrink-0 self-start bg-gold/12 px-2 py-1 text-[0.625rem] font-semibold tracking-[0.1em] text-gold-600 uppercase">
                            Off CV
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* ---- The point ---- */}
        <Reveal>
          <div className="mt-[clamp(3rem,2rem+3vw,5rem)] border-t-2 border-ink pt-10">
            <p className="max-w-[26ch] font-display text-d3 font-semibold text-ink">
              <span className="tnum text-gold-500">{offCv === 3 ? 'Three' : offCv}</span> of the five
              dimensions have nothing to do with the CV — and they are where hires are lost.
            </p>
            <p className="sr-only">{cvInsight.headline}</p>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
