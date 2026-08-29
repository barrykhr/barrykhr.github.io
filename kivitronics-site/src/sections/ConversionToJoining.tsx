import { useInView } from '@/lib/hooks'
import { conversionClosing, conversionFunnel, riskShield } from '@/data/journey'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 12 — we stay in the funnel until the candidate joins.
 *
 * The funnel shape is illustrative of the sequence, not a plotted dataset; the
 * one measured figure — 91% offer to joining — is stated as a figure, next to it.
 */
export function ConversionToJoining() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 })

  return (
    <Section tone="ink" id="conversion">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container width="wide" className="relative">
        <div className="max-w-[40rem]">
          <Reveal>
            <Eyebrow tone="on-dark">
              Conversion
            </Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-d2 text-ivory">
              We stay in the funnel
              <span className="text-ivory/45"> until the candidate joins.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* ---- Funnel ---- */}
          <div ref={ref}>
            <ol className="space-y-3">
              {conversionFunnel.map((step, i) => {
                const last = i === conversionFunnel.length - 1
                return (
                  <li key={step.label} className="flex items-center gap-5">
                    <span className="tnum w-7 shrink-0 text-[0.6875rem] font-semibold tracking-[0.1em] text-ivory/55">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={
                        'flex h-[clamp(2.75rem,2rem+1.4vw,3.5rem)] items-center px-5 transition-[width] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ' +
                        (last ? 'bg-gold text-ink' : 'bg-ivory/8 text-ivory')
                      }
                      style={{
                        width: inView ? `${Math.max(step.width * 100, 30)}%` : '0%',
                        transitionDelay: `${i * 110}ms`,
                      }}
                    >
                      <span className="truncate font-display text-[clamp(0.9375rem,0.85rem+0.4vw,1.1875rem)] font-medium tracking-[-0.015em]">
                        {step.label}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* ---- The metric and the shield ---- */}
          <div>
            <Reveal>
              <div className="border-t-2 border-gold pt-8">
                <p className="tnum font-display text-num font-semibold text-ivory">
                  91<span className="text-gold">%</span>
                </p>
                <p className="mt-5 text-[0.9375rem] font-medium tracking-[0.12em] text-gold uppercase">
                  Offer → joining conversion
                </p>
                <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ivory/60">
                  Nine in ten offers we manage end with a person at a desk. That number exists
                  because of what happens after acceptance, not before it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-10">
                <p className="eyebrow text-ivory/55">The risk shield</p>
                <ul className="mt-5 grid gap-px border border-ivory/12 bg-ivory/12 sm:grid-cols-2">
                  {riskShield.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 bg-ink px-5 py-4 text-[0.9375rem] text-ivory/80"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 14 14"
                        className="h-3.5 w-3.5 shrink-0 text-gold"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M2 7.5 5.5 11 12 3.5" strokeLinecap="square" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <p className="mt-[clamp(3rem,2rem+3vw,5rem)] max-w-[24ch] font-display text-d3 font-semibold text-ivory">
            {conversionClosing.line1}
            <span className="block text-gold">{conversionClosing.line2}</span>
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
