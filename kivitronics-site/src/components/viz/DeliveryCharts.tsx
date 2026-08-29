import { useInView } from '@/lib/hooks'
import { cx } from '@/lib/cx'

/**
 * Data visualisation for the delivery record. Hand-built SVG rather than a
 * charting dependency: four small, fixed charts do not justify 40kB of library,
 * and this way every mark matches the type system.
 */

/* ------------------------------------------------- Mandate closure — 72/100 */

export function ClosureDots({ tone = 'ivory' }: { tone?: 'ivory' | 'ink' }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })
  const onDark = tone === 'ivory'
  const total = 100
  const filled = 72

  return (
    <div ref={ref}>
      <div
        className="grid max-w-[15rem] grid-cols-10 gap-[3px]"
        role="img"
        aria-label="72 of every 100 mandates received are closed."
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cx(
              'aspect-square transition-opacity duration-500',
              i < filled
                ? 'bg-gold'
                : onDark
                  ? 'bg-ivory/12'
                  : 'bg-ink/10',
            )}
            style={{
              transitionDelay: `${inView ? Math.min(i * 7, 620) : 0}ms`,
              opacity: inView ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------- Offer → joining — 91% arc gauge */

export function ConversionArc({ tone = 'ivory' }: { tone?: 'ivory' | 'ink' }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 })
  const onDark = tone === 'ivory'
  const pct = 91
  const r = 84
  const circumference = Math.PI * r // half-circle

  return (
    <div ref={ref}>
      <svg
        viewBox="0 0 200 112"
        className="w-full max-w-[17rem]"
        role="img"
        aria-label="91 percent of offers convert to a candidate joining."
      >
        <path
          d={`M 16 100 A ${r} ${r} 0 0 1 184 100`}
          fill="none"
          stroke={onDark ? 'rgba(245,243,238,0.14)' : 'rgba(11,15,20,0.1)'}
          strokeWidth="10"
          strokeLinecap="butt"
        />
        <path
          d={`M 16 100 A ${r} ${r} 0 0 1 184 100`}
          fill="none"
          stroke="#C8A84E"
          strokeWidth="10"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={inView ? circumference * (1 - pct / 100) : circumference}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        <g aria-hidden="true">
          <text
            x="16"
            y="112"
            textAnchor="middle"
            fill={onDark ? 'rgba(245,243,238,0.58)' : 'rgba(11,15,20,0.6)'}
            style={{ fontSize: 8, letterSpacing: '0.1em' }}
          >
            0%
          </text>
          <text
            x="184"
            y="112"
            textAnchor="middle"
            fill={onDark ? 'rgba(245,243,238,0.58)' : 'rgba(11,15,20,0.6)'}
            style={{ fontSize: 8, letterSpacing: '0.1em' }}
          >
            100%
          </text>
        </g>
      </svg>
    </div>
  )
}

/* ------------------------------------------------- Time to close — range bar */

const AXIS_MAX = 60

export function TimeToCloseChart({ tone = 'ivory' }: { tone?: 'ivory' | 'ink' }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })
  const onDark = tone === 'ivory'

  const bars = [
    { label: 'Tech & non-tech', from: 20, to: 30, accent: '#C8A84E' },
    { label: 'Niche / difficult', from: 30, to: 45, accent: '#68758A' },
  ]

  return (
    <div ref={ref}>
      <div className="space-y-6">
        {bars.map((bar, i) => (
          <div key={bar.label}>
            <div className="flex items-baseline justify-between gap-4">
              <p className={cx('text-[0.875rem] font-medium', onDark ? 'text-ivory/85' : 'text-ink/85')}>
                {bar.label}
              </p>
              <p className={cx('tnum text-[0.8125rem]', onDark ? 'text-ivory/50' : 'text-ink/62')}>
                {i === 0 ? '20–30' : '~45'} days
              </p>
            </div>
            <div
              className={cx(
                'relative mt-2.5 h-2',
                onDark ? 'bg-ivory/10' : 'bg-ink/8',
              )}
            >
              <span
                className="absolute inset-y-0 block"
                style={{
                  left: `${(bar.from / AXIS_MAX) * 100}%`,
                  width: inView ? `${((bar.to - bar.from) / AXIS_MAX) * 100}%` : 0,
                  background: bar.accent,
                  transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 140}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className={cx(
          'mt-4 flex justify-between border-t pt-2 text-[0.6875rem] tracking-[0.08em]',
          onDark ? 'border-ivory/12 text-ivory/55' : 'border-ink/10 text-ink/62',
        )}
        aria-hidden="true"
      >
        <span>0</span>
        <span>20</span>
        <span>40</span>
        <span>60 days</span>
      </div>
    </div>
  )
}
