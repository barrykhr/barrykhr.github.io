import { cx } from '@/lib/cx'
import { useInView } from '@/lib/hooks'
import {
  relationshipBody,
  relationshipFacts,
  relationshipHeadline,
  relationshipWall,
} from '@/data/relationships'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'

/**
 * Section 08 — client relationships as a trust wall.
 *
 * No client names or logos were supplied, and we do not invent them. The wall
 * is built from the verified counts instead: twenty-five cells, fifteen of which
 * came back, three of which became the deepest relationships. It says the same
 * thing a logo grid would, and it is true.
 */
export function ClientRelationships() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 })

  // Repeat clients share one fill so the wall reads "15 of 25 came back"; the
  // three deepest relationships are marked inside that group, not split from it.
  const tiers = {
    deepest: 'bg-gold/35',
    repeat: 'bg-gold/35',
    single: 'bg-ink/12',
  } as const

  return (
    <Section tone="ivory" id="relationships">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Client relationships</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 max-w-[18ch] text-d2 text-ink">
                {relationshipHeadline.line1}
                <span className="block text-gold-500">{relationshipHeadline.line2}</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-8 max-w-[52ch] text-lede text-ink/68">{relationshipBody}</p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-10 border-t-2 border-ink pt-8">
                <p className="tnum font-display text-[clamp(2.5rem,1.8rem+2.6vw,4rem)] leading-none font-semibold tracking-[-0.045em] text-ink">
                  {relationshipFacts.deepestRelationshipHires}
                </p>
                <p className="mt-4 max-w-[34ch] text-[1.0625rem] text-ink/70">
                  hires across our three deepest client relationships.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ---- The wall ---- */}
          <div ref={ref}>
            <Reveal>
              <div
                className="grid grid-cols-5 gap-2 sm:gap-3"
                role="img"
                aria-label={`Twenty-five client relationships. Fifteen issued more than one mandate; three of those are our deepest relationships.`}
              >
                {relationshipWall.map((cell, i) => (
                  <div
                    key={cell.id}
                    className={cx(
                      'flex aspect-[4/3] items-center justify-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      tiers[cell.tier],
                    )}
                    style={{
                      transitionDelay: `${Math.min(i * 26, 700)}ms`,
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'none' : 'translateY(10px)',
                    }}
                  >
                    {cell.tier === 'deepest' && (
                      <span aria-hidden="true" className="h-1/2 w-1/3 bg-gold" />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { swatch: 'bg-gold', value: '3', label: 'Deepest relationships, 65+ hires' },
                  { swatch: 'bg-gold/35', value: '15', label: 'Gave more than one mandate' },
                  { swatch: 'bg-ink/12', value: '25', label: 'Companies served' },
                ].map((item) => (
                  <li key={item.label} className="border-t border-ink/15 pt-4">
                    <span className={cx('block h-1.5 w-8', item.swatch)} aria-hidden="true" />
                    <p className="tnum mt-4 font-display text-[1.75rem] leading-none font-semibold tracking-[-0.03em] text-ink">
                      {item.value}
                    </p>
                    <p className="mt-2 text-[0.8125rem] leading-snug text-ink/62">{item.label}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-8 flex items-baseline gap-3 text-[0.9375rem] text-ink/62">
                <span className="tnum font-display text-[1.5rem] font-semibold tracking-[-0.03em] text-gold-500">
                  {relationshipFacts.repeatRate}%
                </span>
                repeat-client rate.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
