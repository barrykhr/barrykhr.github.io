import { journeyClosing, touchpoints } from '@/data/journey'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 09 — protecting the candidate journey.
 *
 * Eight touchpoints between the first conversation and day one. The rail runs
 * through each row so the sequence reads as continuous at every breakpoint
 * rather than as eight unrelated cards.
 */
export function ProtectingJourney() {
  return (
    <Section tone="paper" id="candidate-journey">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[38rem]">
            <Reveal>
              <Eyebrow>Candidate journey</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-d2 text-ink">
                The candidate doesn’t disappear
                <span className="text-ink/50"> between rounds.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-[24ch] font-display text-[1.5rem] leading-[1.2] tracking-[-0.025em] text-ink">
              {journeyClosing.line1}
              <span className="block text-gold-500">{journeyClosing.line2}</span>
            </p>
          </Reveal>
        </div>

        <ol className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {touchpoints.map((point, i) => (
            <li key={point.marker} className="relative">
              <Reveal delay={(i % 4) * 70}>
                {/* rail */}
                <div className="relative flex items-center">
                  <span aria-hidden="true" className="h-px flex-1 bg-ink/12" />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 h-2 w-2 rounded-full bg-gold"
                  />
                </div>

                <p className="tnum mt-5 text-[0.6875rem] font-semibold tracking-[0.12em] text-gold-600 uppercase">
                  {point.marker}
                </p>
                <h3 className="mt-2 font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                  {point.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/60">
                  {point.intervention}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <p className="mt-[clamp(2.5rem,2rem+2vw,4rem)] flex items-start gap-3 border-t border-ink/10 pt-8 text-[0.9375rem] text-ink/62">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <circle cx="8" cy="5" r="2.6" />
              <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
            </svg>
            <span className="max-w-[68ch]">
              Every one of these touchpoints is a person, not an automated status email. The
              candidate speaks to the same consultant at each of them.
            </span>
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
