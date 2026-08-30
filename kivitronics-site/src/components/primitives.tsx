import type { ReactNode, ElementType, CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/lib/cx'
import { useInView } from '@/lib/hooks'

/* ═══════════════════════════════════════════════════════════ Layout ═══════ */

export function Container({
  children,
  className,
  width = 'default',
}: {
  children: ReactNode
  className?: string
  width?: 'default' | 'wide' | 'narrow' | 'prose'
}) {
  const max = {
    narrow: 'max-w-[780px]',
    prose: 'max-w-[920px]',
    default: 'max-w-[1200px]',
    wide: 'max-w-[1400px]',
  }[width]
  return <div className={cx('mx-auto w-full px-gutter', max, className)}>{children}</div>
}

export function Section({
  children,
  className,
  tone = 'background',
  id,
  spacing = 'default',
  ariaLabel,
}: {
  children: ReactNode
  className?: string
  tone?: 'background' | 'surface' | 'surface-2' | 'canvas'
  id?: string
  spacing?: 'default' | 'tight' | 'none'
  ariaLabel?: string
}) {
  const tones = {
    background: 'bg-background text-foreground',
    surface: 'bg-surface text-foreground',
    'surface-2': 'bg-surface-2 text-foreground',
    canvas: 'on-canvas bg-canvas text-canvas-fg',
  }
  const pad = { none: '', tight: 'py-[clamp(3rem,2rem+3vw,5rem)]', default: 'py-section' }[spacing]
  return (
    <section id={id} aria-label={ariaLabel} className={cx('relative', tones[tone], pad, className)}>
      {children}
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════ Motion ═══════ */

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  id,
}: {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
  id?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 })
  return (
    <Tag
      ref={ref}
      id={id}
      className={cx('reveal', inView && 'is-visible', className)}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

/* ═══════════════════════════════════════════════════════ Typography ═══════ */

export function Eyebrow({
  children,
  tone = 'primary',
  className,
  dot = true,
}: {
  children: ReactNode
  tone?: 'primary' | 'muted' | 'on-canvas'
  className?: string
  dot?: boolean
}) {
  const tones = {
    primary: 'text-primary',
    muted: 'text-muted',
    'on-canvas': 'text-primary-light',
  }
  return (
    <p className={cx('label flex items-center gap-2.5', tones[tone], className)}>
      {dot && (
        <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
          <span className="pulse-ring absolute inset-0 rounded-full bg-current" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = 'light',
  align = 'left',
  className,
  level: Heading = 'h2',
  action,
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  tone?: 'light' | 'canvas'
  align?: 'left' | 'center'
  className?: string
  level?: 'h1' | 'h2' | 'h3'
  action?: ReactNode
}) {
  const onCanvas = tone === 'canvas'
  return (
    <div
      className={cx(
        'flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16',
        className,
      )}
    >
      <header className={cx('max-w-[46rem]', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <Reveal>
            <Eyebrow
              tone={onCanvas ? 'on-canvas' : 'primary'}
              className={align === 'center' ? 'justify-center' : undefined}
            >
              {eyebrow}
            </Eyebrow>
          </Reveal>
        )}
        <Reveal delay={60}>
          <Heading
            className={cx('mt-5 text-h2', onCanvas ? 'text-canvas-fg' : 'text-foreground')}
          >
            {title}
          </Heading>
        </Reveal>
        {lede && (
          <Reveal delay={110}>
            <p
              className={cx(
                'mt-5 max-w-[54ch] text-lede',
                onCanvas ? 'text-canvas-muted' : 'text-muted',
                align === 'center' && 'mx-auto',
              )}
            >
              {lede}
            </p>
          </Reveal>
        )}
      </header>
      {action && (
        <Reveal delay={160} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ Buttons ═══════ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'on-canvas' | 'on-canvas-ghost'
type Size = 'sm' | 'md' | 'lg'

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[0.8125rem] rounded-sm gap-1.5',
  md: 'h-11 px-5 text-[0.875rem] rounded-md gap-2',
  lg: 'h-12 px-6 text-[0.9375rem] rounded-md gap-2',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white shadow-xs hover:bg-primary-hover active:bg-primary-press hover:shadow-sm',
  secondary:
    'bg-surface text-foreground border border-border shadow-xs hover:border-border-strong hover:bg-surface-2 active:bg-surface-3',
  ghost: 'text-foreground hover:bg-surface-2 active:bg-surface-3',
  'on-canvas': 'bg-canvas-fg text-canvas hover:bg-white active:bg-white/90',
  'on-canvas-ghost':
    'text-canvas-fg border border-canvas-line hover:border-canvas-muted hover:bg-canvas-2 active:bg-canvas-3',
}

const buttonBase =
  'group relative inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] active:translate-y-px disabled:pointer-events-none disabled:opacity-55'

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cx(
        'h-3.5 w-3.5 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-0.5',
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  )
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className,
  external,
}: {
  to: string
  children: ReactNode
  variant?: Variant
  size?: Size
  arrow?: boolean
  className?: string
  external?: boolean
}) {
  const classes = cx(buttonBase, sizes[size], variants[variant], className)
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight />}
    </>
  )
  return external ? (
    <a href={to} className={classes}>
      {inner}
    </a>
  ) : (
    <Link to={to} className={classes}>
      {inner}
    </Link>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className,
  type = 'button',
  ...rest
}: {
  children: ReactNode
  variant?: Variant
  size?: Size
  arrow?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cx(buttonBase, sizes[size], variants[variant], className)} {...rest}>
      {children}
      {arrow && <ArrowRight />}
    </button>
  )
}

/* ════════════════════════════════════════════════════════════ Cards ═══════ */

export function Card({
  children,
  className,
  interactive = false,
  tone = 'surface',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
  tone?: 'surface' | 'background' | 'canvas'
  as?: ElementType
}) {
  const tones = {
    surface: 'bg-surface border-border',
    background: 'bg-background border-border',
    canvas: 'bg-canvas-2 border-canvas-line',
  }
  return (
    <Tag
      className={cx(
        'relative rounded-lg border transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out)]',
        tones[tone],
        interactive &&
          (tone === 'canvas'
            ? 'hover:-translate-y-0.5 hover:border-canvas-muted/50'
            : 'hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md'),
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'primary' | 'accent' | 'canvas'
  className?: string
}) {
  const tones = {
    neutral: 'bg-surface-2 text-muted-strong border-border',
    primary: 'bg-primary-subtle text-primary border-primary-line',
    accent: 'bg-accent-subtle text-accent border-accent/20',
    canvas: 'bg-canvas-3 text-canvas-muted border-canvas-line',
  }
  return (
    <span
      className={cx(
        'label inline-flex items-center rounded-xs border px-2 py-1',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════ Divider ══════ */

export function Rule({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'canvas' }) {
  return (
    <hr className={cx('border-t', tone === 'canvas' ? 'border-canvas-line' : 'border-border', className)} />
  )
}
