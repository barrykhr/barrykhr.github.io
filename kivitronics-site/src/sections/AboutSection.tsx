import { brand } from '@/data/site'
import { ButtonLink, Container, Eyebrow, Reveal, Section } from '@/components/primitives'

const pillars = [
  {
    label: 'What we believe',
    body: 'Recruitment should be measured by outcomes, not activity. A shortlist is not a result; a person at a desk is.',
  },
  {
    label: 'How we work',
    body: 'Nine stages under one named owner, from calibrating the requirement through to confirming the candidate joined.',
  },
  {
    label: 'Why the model differs',
    body: 'We qualify across five dimensions — three of which never appear on a CV — and we stay in the process through the notice period.',
  },
  {
    label: 'What we are building',
    body: 'Technology around what already works: better pipeline visibility and earlier risk signals, supporting human judgement rather than replacing it.',
  },
]

/** Section 15 — about, deliberately short. */
export function AboutSection() {
  return (
    <Section tone="ivory" id="about">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>About</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 max-w-[18ch] text-d2 text-ink">
                A specialist consultancy that owns the outcome.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-8 max-w-[46ch] text-lede text-ink/68">
                KiVitronics is built for companies that have stopped believing volume solves hiring.
                We take fewer mandates, qualify harder, and stay accountable to the only date that
                matters — the day the person starts.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-9">
                <ButtonLink to="/about" variant="ghost">
                  More about the firm
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <dl className="grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
            {pillars.map((pillar, i) => (
              <div key={pillar.label} className="bg-ivory">
                <Reveal delay={i * 70}>
                  <div className="p-[clamp(1.375rem,1rem+1.2vw,2rem)]">
                    <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] text-gold-600 uppercase">
                      {pillar.label}
                    </dt>
                    <dd className="mt-4 text-[0.9375rem] leading-relaxed text-ink/70">
                      {pillar.body}
                    </dd>
                  </div>
                </Reveal>
              </div>
            ))}
          </dl>
        </div>

        <Reveal>
          <p className="mt-[clamp(3rem,2rem+3vw,5rem)] border-t-2 border-ink pt-10 font-display text-d3 font-semibold text-ink">
            {brand.promise.map((line, i) => (
              <span key={line} className={i === 2 ? 'block text-gold-500' : 'block'}>
                {line}
              </span>
            ))}
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
