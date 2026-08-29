import { cx } from '@/lib/cx'
import { useCountUp, useInView } from '@/lib/hooks'

/**
 * A single delivery figure. Animates once on entry; with reduced motion the
 * final value is rendered immediately. The accessible name is always the
 * finished value, never the intermediate count.
 */
export function MetricFigure({
  value,
  display,
  suffix,
  label,
  note,
  tone = 'ink',
  size = 'default',
  className,
}: {
  value: number
  display: string
  suffix?: string
  label: string
  note?: string
  tone?: 'ink' | 'ivory'
  size?: 'default' | 'hero' | 'compact'
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.45 })
  const counted = useCountUp(value, inView)
  const onDark = tone === 'ivory'

  const sizes = {
    hero: 'text-num',
    default: 'text-[clamp(2.25rem,1.4rem+2.6vw,3.75rem)] leading-[0.9] tracking-[-0.04em]',
    compact: 'text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-[0.9] tracking-[-0.035em]',
  }

  return (
    <div ref={ref} className={cx('flex flex-col', className)}>
      <p
        className={cx(
          'tnum font-display font-semibold',
          sizes[size],
          onDark ? 'text-ivory' : 'text-ink',
        )}
      >
        <span aria-hidden="true">{inView ? counted : 0}</span>
        {suffix && <span aria-hidden="true" className={onDark ? 'text-gold' : 'text-gold-600'}>{suffix}</span>}
        <span className="sr-only">
          {display}
          {suffix}
        </span>
      </p>
      <p
        className={cx(
          'mt-4 text-[0.9375rem] leading-snug font-medium',
          onDark ? 'text-ivory/85' : 'text-ink/85',
        )}
      >
        {label}
      </p>
      {note && (
        <p className={cx('mt-1.5 text-[0.8125rem]', onDark ? 'text-ivory/55' : 'text-ink/62')}>
          {note}
        </p>
      )}
    </div>
  )
}
