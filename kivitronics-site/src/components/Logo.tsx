import { cx } from '@/lib/cx'

/**
 * Wordmark. The mark is a four-node path — requirement to joining — which is
 * the same idea the whole site is built on.
 */
export function Logo({
  className,
  tone = 'ink',
}: {
  className?: string
  tone?: 'ink' | 'ivory'
}) {
  const onDark = tone === 'ivory'
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 28 28"
        className="h-6 w-6 shrink-0"
        fill="none"
      >
        <path
          d="M4 20.5 10 13l5.5 4L24 6"
          stroke={onDark ? '#C8A84E' : '#C8A84E'}
          strokeWidth="1.6"
          strokeLinecap="square"
        />
        <circle cx="4" cy="20.5" r="1.9" fill={onDark ? '#68758A' : '#68758A'} />
        <circle cx="10" cy="13" r="1.9" fill={onDark ? '#68758A' : '#68758A'} />
        <circle cx="15.5" cy="17" r="1.9" fill={onDark ? '#68758A' : '#68758A'} />
        <circle cx="24" cy="6" r="2.6" fill="#C8A84E" />
      </svg>
      <span
        className={cx(
          'font-display text-[1.0625rem] font-semibold tracking-[-0.02em]',
          onDark ? 'text-ivory' : 'text-ink',
        )}
      >
        KiVitronics
      </span>
    </span>
  )
}
