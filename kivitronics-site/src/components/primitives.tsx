import type { ReactNode, ElementType } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/lib/cx'
import { useInView } from '@/lib/hooks'

/* ---------------------------------------------------------------- Container */

export function Container({
  children,
  className,
  width = 'default',
}: {
  children: ReactNode
  className?: string
  width?: 'default' | 'wide' | 'narrow'
}) {
  const max =
    width === 'wide' ? 'max-w-[1560px]' : width === 'narrow' ? 'max-w-[820px]' : 'max-w-[1280px]'
  return <div className={cx('mx-auto w-full px-gutter', max, className)}>{children}</div>
}

/* ------------------------------------------------------------------ Section */

export function Section({
  children,
  className,
  tone = 'paper',
  id,
  spacing = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: 'paper' | 'ivory' | 'ink'
  id?: string
  spacing?: 'default' | 'tight' | 'none'
}) {
  const tones = {
    paper: 'bg-paper text-ink',
    ivory: 'bg-ivory text-ink',
    ink: 'on-ink bg-ink text-ivory',
  }
  const pad =
    spacing === 'none' ? '' : spacing === 'tight' ? 'py-[clamp(3rem,2rem+3vw,5rem)]' : 'py-section'
  return (
    <section id={id} className={cx('relative', tones[tone], pad, className)}>
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ Reveal */

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  threshold,
  id,
}: {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
  threshold?: number
  id?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold })
  return (
    <Tag
      ref={ref}
      id={id}
      className={cx('reveal', inView && 'is-visible', className)}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

/* ----------------------------------------------------------------- Eyebrow */

export function Eyebrow({
  children,
  tone = 'gold',
  className,
}: {
  children: ReactNode
  /** `gold` reads on ivory, `on-dark` on ink; both clear AA at this size. */
  tone?: 'gold' | 'on-dark' | 'muted'
  className?: string
}) {
  const tones = {
    gold: 'text-gold-600',
    'on-dark': 'text-gold-400',
    muted: 'text-ink/62',
  }
  return (
    <p className={cx('eyebrow flex items-center gap-3', tones[tone], className)}>
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {children}
    </p>
  )
}

/* ------------------------------------------------------------ SectionHeader */

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = 'left',
  tone = 'ink',
  className,
  level: Heading = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  align?: 'left' | 'center'
  tone?: 'ink' | 'ivory'
  className?: string
  level?: 'h1' | 'h2' | 'h3'
}) {
  const onDark = tone === 'ivory'
  return (
    <header
      className={cx(
        'max-w-[62ch]',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow
            tone={onDark ? 'on-dark' : 'gold'}
            className={cx(align === 'center' && 'justify-center', '')}
          >
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <Reveal delay={60}>
        <Heading
          className={cx(
            'mt-5 text-d3',
            onDark ? 'text-ivory' : 'text-ink',
          )}
        >
          {title}
        </Heading>
      </Reveal>
      {lede && (
        <Reveal delay={120}>
          <div
            className={cx(
              'mt-6 text-lede',
              onDark ? 'text-ivory/62' : 'text-ink/68',
              align === 'center' && 'mx-auto',
            )}
          >
            {lede}
          </div>
        </Reveal>
      )}
    </header>
  )
}

/* ------------------------------------------------------------------ Button */

type ButtonVariant = 'primary' | 'ghost' | 'ghost-dark' | 'gold'

const buttonBase =
  'group inline-flex items-center justify-center gap-2.5 whitespace-nowrap px-6 py-3.5 text-[0.8125rem] font-medium tracking-[0.01em] transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-px'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-ivory hover:bg-ink-700',
  gold: 'bg-gold text-ink hover:bg-gold-400',
  ghost: 'border border-ink/20 text-ink hover:border-ink/60 hover:bg-ink/[0.03]',
  'ghost-dark': 'border border-ivory/25 text-ivory hover:border-gold hover:text-gold-400',
}

function Arrow() {
  return (
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
  )
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  arrow = true,
  className,
  external = false,
}: {
  to: string
  children: ReactNode
  variant?: ButtonVariant
  arrow?: boolean
  className?: string
  external?: boolean
}) {
  const classes = cx(buttonBase, buttonVariants[variant], className)
  if (external) {
    return (
      <a href={to} className={classes}>
        {children}
        {arrow && <Arrow />}
      </a>
    )
  }
  return (
    <Link to={to} className={classes}>
      {children}
      {arrow && <Arrow />}
    </Link>
  )
}

export function ButtonAction({
  children,
  variant = 'primary',
  arrow = false,
  className,
  type = 'button',
  ...rest
}: {
  children: ReactNode
  variant?: ButtonVariant
  arrow?: boolean
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cx(buttonBase, buttonVariants[variant], className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

/* -------------------------------------------------------------------- Rule */

export function Rule({ className }: { className?: string }) {
  return <hr className={cx('rule border-t', className)} />
}
