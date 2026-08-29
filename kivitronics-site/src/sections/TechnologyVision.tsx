import { cx } from '@/lib/cx'
import {
  roadmapCapabilities,
  technologyHorizons,
  technologyStance,
} from '@/data/technology'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 13 — the intelligence layer.
 *
 * The single most important rule on this page: nothing here may read as shipped
 * software. Every forward-looking item carries a visible status label, and the
 * roadmap block states in plain words that it is not live product.
 */

const statusStyle = {
  live: 'bg-gold text-ink',
  building: 'bg-ink text-ivory',
  roadmap: 'border border-ink/25 text-ink/60',
} as const

export function TechnologyVision() {
  return (
    <Section tone="paper" id="technology">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>The intelligence layer</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 max-w-[21ch] text-d2 text-ink">
                {technologyStance.headline[0]}
                <span className="block text-ink/50">{technologyStance.headline[1]}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-[52ch] text-lede text-ink/68 lg:mt-4">{technologyStance.body}</p>
          </Reveal>
        </div>

        {/* ---- Three horizons ---- */}
        <ol className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-px border border-ink/12 bg-ink/12 lg:grid-cols-3">
          {technologyHorizons.map((horizon, i) => (
            <li key={horizon.tag} className="bg-paper">
              <Reveal delay={i * 80}>
                <div className="flex h-full flex-col p-[clamp(1.5rem,1rem+1.6vw,2.5rem)]">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={cx(
                        'px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase',
                        statusStyle[horizon.status],
                      )}
                    >
                      {horizon.tag}
                    </span>
                    <span className="tnum text-[0.6875rem] font-semibold tracking-[0.1em] text-ink/62">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-8 font-display text-[1.375rem] font-medium tracking-[-0.02em] text-ink">
                    {horizon.title}
                  </h3>

                  <ul className="mt-6 flex-1 space-y-3">
                    {horizon.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-3 text-[0.9375rem] text-ink/65"
                      >
                        <span
                          aria-hidden="true"
                          className={cx(
                            'h-1 w-1 shrink-0 translate-y-[-2px] rounded-full',
                            horizon.status === 'live' ? 'bg-gold' : 'bg-ink/25',
                          )}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {horizon.status !== 'live' && (
                    <p className="mt-8 border-t border-ink/10 pt-4 text-[0.75rem] text-ink/62">
                      Not a live capability today.
                    </p>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* ---- Roadmap ---- */}
        <Reveal>
          <div className="mt-[clamp(3rem,2rem+3vw,5rem)] on-ink bg-ink p-[clamp(1.75rem,1.25rem+2vw,3.5rem)] text-ivory">
            <div className="flex flex-col gap-6 border-b border-ivory/12 pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <div>
                <span className="inline-block border border-gold px-3 py-1.5 text-[0.625rem] font-semibold tracking-[0.16em] text-gold uppercase">
                  What we are building toward
                </span>
                <h3 className="mt-6 max-w-[22ch] text-d4 text-ivory">
                  An intelligent recruitment operating system — decision support, not automation.
                </h3>
              </div>
              <p className="max-w-[44ch] text-[0.9375rem] leading-relaxed text-ivory/55">
                {technologyStance.disclaimer}
              </p>
            </div>

            <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {roadmapCapabilities.map((capability, i) => (
                <li key={capability.name}>
                  <Reveal delay={i * 60}>
                    <div className="flex items-baseline gap-3">
                      <span className="tnum text-[0.6875rem] font-semibold tracking-[0.1em] text-gold">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-display text-[1.125rem] font-medium tracking-[-0.015em] text-ivory">
                        {capability.name}
                      </h4>
                    </div>
                    <p className="mt-3 pl-8 text-[0.875rem] leading-relaxed text-ivory/55">
                      {capability.detail}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <p className="mt-10 border-t border-ivory/12 pt-6 text-[0.8125rem] text-ivory/55">
              Roadmap items. KiVitronics is a recruitment consultancy, not a software vendor —
              delivery today is human-led.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
