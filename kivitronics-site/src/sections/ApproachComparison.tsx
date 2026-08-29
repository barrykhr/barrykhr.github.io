import { cx } from '@/lib/cx'
import { comparison } from '@/data/qualification'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

function StepChain({
  label,
  steps,
  tone,
  note,
}: {
  label: string
  steps: readonly string[]
  tone: 'muted' | 'brand'
  note: string
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
                brand ? 'bg-ivory/8 text-ivory' : 'bg-paper text-ink/62',
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
      <p className={cx('mt-8 text-[0.8125rem]', brand ? 'text-ivory/55' : 'text-ink/62')}>{note}</p>
    </div>
  )
}

/**
 * The positioning contrast: where a search starts decides what it can deliver.
 * Lives on What we do — it is an argument about the offer, not about method.
 */
export function ApproachComparison() {
  return (
    <Section tone="ivory" id="approach">
      <Container width="wide">
        <div className="max-w-[42rem]">
          <Reveal>
            <Eyebrow>Approach</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-d2 text-ink">
              Most searches start at the CV.
              <span className="block text-ink/50">Ours starts at the role.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-[56ch] text-lede text-ink/68">
              Three of the six steps below happen before anyone is contacted. That is the whole
              difference: by the time a profile reaches you, the role has been interrogated and the
              market has been tested.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-[clamp(2.5rem,2rem+2vw,4rem)] grid gap-px border border-ink/10 bg-ink/10 lg:grid-cols-2">
            <StepChain
              label={comparison.traditional.label}
              steps={comparison.traditional.steps}
              tone="muted"
              note="Three steps, all of them downstream of a brief nobody interrogated."
            />
            <StepChain
              label={comparison.kivitronics.label}
              steps={comparison.kivitronics.steps}
              tone="brand"
              note="Six deliberate steps. The role is calibrated and the market is understood before anyone is contacted."
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
