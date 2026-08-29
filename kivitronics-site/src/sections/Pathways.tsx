import { Link } from 'react-router-dom'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * The three doors out of the homepage. Each figure is the single number that
 * page is built on, so the choice is made on evidence rather than on a label.
 */
const doors = [
  {
    figure: '9',
    suffix: '',
    href: '/how-we-work',
    title: 'How we work',
    body: 'Nine stages under one named owner, from calibrating the requirement to confirming the candidate joined.',
    detail: 'Stages, one owner',
  },
  {
    figure: '91',
    suffix: '%',
    href: '/proof',
    title: 'The proof',
    body: 'The delivery record in full — closure rates, time to close, and the conversion most firms never publish.',
    detail: 'Offer → joining',
  },
  {
    figure: '8',
    suffix: '',
    href: '/for-talent',
    title: 'For talent',
    body: 'What representation by KiVitronics actually means if you are the one interviewing.',
    detail: 'Touchpoints, no silent gaps',
  },
]

export function Pathways() {
  return (
    <Section tone="ivory" id="explore">
      <Container width="wide">
        <div className="max-w-[46rem]">
          <Reveal>
            <Eyebrow>Where to next</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-d2 text-ink">
              Everything above is a claim.
              <span className="block text-ink/50">Here is where it gets checked.</span>
            </h2>
          </Reveal>
        </div>

        <ul className="mt-[clamp(2.5rem,2rem+2vw,4rem)] grid gap-px border border-ink/12 bg-ink/12 lg:grid-cols-3">
          {doors.map((door, i) => (
            <li key={door.href} className="bg-ivory">
              <Reveal delay={i * 80} className="h-full">
                <Link
                  to={door.href}
                  className="group flex h-full flex-col p-[clamp(1.75rem,1.25rem+2vw,3rem)] transition-colors duration-500 hover:bg-paper"
                >
                  <div>
                    <p className="tnum font-display text-[clamp(2.75rem,2rem+2.4vw,4rem)] leading-none font-semibold tracking-[-0.045em] text-ink">
                      {door.figure}
                      <span className="text-gold-500">{door.suffix}</span>
                    </p>
                    <p className="mt-3 text-[0.8125rem] tracking-[0.02em] text-ink/62">
                      {door.detail}
                    </p>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-d4 text-ink">{door.title}</h3>
                    <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink/68">
                      {door.body}
                    </p>
                  </div>

                  <span className="mt-auto inline-flex items-center gap-2.5 pt-10 text-[0.8125rem] font-medium text-ink">
                    Read on
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
