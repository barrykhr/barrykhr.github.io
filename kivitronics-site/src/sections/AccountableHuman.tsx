import { accountability } from '@/data/journey'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 10 — one accountable human.
 * A four-link chain, then the four moments where that person intervenes.
 */
export function AccountableHuman() {
  return (
    <Section tone="ivory" id="accountability">
      <Container width="wide">
        <div className="max-w-[42rem]">
          <Reveal>
            <Eyebrow>Accountability</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-d2 text-ink">
              One accountable human keeps the candidate
              <span className="text-ink/50"> moving.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          {/* ---- The chain ---- */}
          <Reveal>
            <ol className="relative">
              {accountability.chain.map((link, i) => {
                const last = i === accountability.chain.length - 1
                return (
                  <li key={link.role} className="relative pb-8 pl-10 last:pb-0">
                    {!last && (
                      <span
                        aria-hidden="true"
                        className="absolute top-4 bottom-0 left-[0.4375rem] w-px bg-ink/15"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={
                        'absolute top-2 left-0 h-3.5 w-3.5 rounded-full ' +
                        (last ? 'bg-gold ring-4 ring-gold/20' : 'bg-ink')
                      }
                    />
                    <p
                      className={
                        'font-display text-[1.25rem] font-medium tracking-[-0.02em] ' +
                        (last ? 'text-gold-600' : 'text-ink')
                      }
                    >
                      {link.role}
                    </p>
                    <p className="mt-1 text-[0.9375rem] text-ink/62">{link.note}</p>
                  </li>
                )
              })}
            </ol>
          </Reveal>

          {/* ---- Intervention points ---- */}
          <div>
            <Reveal>
              <p className="eyebrow text-ink/62">Four intervention points</p>
            </Reveal>
            <ul className="mt-7 grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
              {accountability.interventions.map((item, i) => (
                <li key={item.when} className="bg-ivory">
                  <Reveal delay={i * 70}>
                    <div className="p-[clamp(1.25rem,1rem+1vw,1.875rem)]">
                      <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-gold-600 uppercase">
                        {item.when}
                      </p>
                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/70">
                        {item.what}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal delay={140}>
              <div className="mt-10 border-l-2 border-gold pl-6">
                {accountability.closing.map((line, i) => (
                  <p
                    key={line}
                    className={
                      'font-display text-[clamp(1.125rem,1rem+0.7vw,1.5rem)] leading-[1.35] tracking-[-0.02em] ' +
                      (i === accountability.closing.length - 1 ? 'text-ink' : 'text-ink/62')
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
