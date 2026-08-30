import { cx } from '@/lib/cx'

/**
 * The mark is a convergence: three inbound paths resolving into one filled
 * node. That is the business — many candidates considered, one person hired.
 */
export function Logo({
  className,
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'canvas'
}) {
  const onCanvas = tone === 'canvas'
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className={cx(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-sm',
          onCanvas ? 'bg-canvas-fg' : 'bg-foreground',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
          <path
            d="M6 5.5 12 12M6 12h6M6 18.5 12 12"
            stroke={onCanvas ? '#101318' : '#FBFAF9'}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="17" cy="12" r="2.6" fill="#1F45E0" />
        </svg>
      </span>
      <span
        className={cx(
          'text-[1.0625rem] font-semibold tracking-[-0.028em]',
          onCanvas ? 'text-canvas-fg' : 'text-foreground',
        )}
      >
        KiVitronics
      </span>
    </span>
  )
}
