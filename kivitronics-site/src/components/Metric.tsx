import { cx } from '@/lib/cx'
import { useCountUp, useInView } from '@/lib/hooks'

/**
 * A delivery figure. Counts once on entry; under reduced motion it resolves
 * immediately. The accessible name is always the final value.
 */
export function Stat({
  value,
  display,
  prefix,
  suffix,
  label,
  note,
  tone = 'light',
  size = 'md',
  className,
}: {
  value: number
  display: string
  prefix?: string
  suffix?: string
  label: string
  note?: string
  tone?: 'light' | 'canvas'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 })
  const counted = useCountUp(value, inView)
  const onCanvas = tone === 'canvas'

  const sizes = {
    lg: 'text-metric',
    md: 'text-[clamp(2rem,1.4rem+2.2vw,3rem)] leading-[0.92] tracking-[-0.042em]',
    sm: 'text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] leading-[0.95] tracking-[-0.035em]',
  }

  return (
    <div ref={ref} className={cx('flex flex-col', className)}>
      <p
        className={cx(
          'tnum font-medium',
          sizes[size],
          onCanvas ? 'text-canvas-fg' : 'text-foreground',
        )}
      >
        <span aria-hidden="true">
          {prefix}
          {inView ? counted : 0}
          {suffix}
        </span>
        <span className="sr-only">
          {prefix}
          {display}
          {suffix}
        </span>
      </p>
      <p
        className={cx(
          'mt-3 text-[0.875rem] leading-snug font-medium',
          onCanvas ? 'text-canvas-fg' : 'text-foreground',
        )}
      >
        {label}
      </p>
      {note && (
        <p className={cx('mt-1 text-[0.8125rem]', onCanvas ? 'text-canvas-muted' : 'text-muted')}>
          {note}
        </p>
      )}
    </div>
  )
}
