import { useState } from 'react'
import { cx } from '@/lib/cx'
import { contactChannels, ctas } from '@/data/content'
import { ArrowRight, Button } from '@/components/primitives'

/**
 * The three calls to action.
 *
 * Each renders as a real button whether or not its destination is configured.
 * While `contactChannels.bookingUrl` / `.email` are null the button still works
 * — pressing it explains that the link is not set up yet and points at the
 * brief form. It is deliberately NOT `aria-disabled`: the button does respond,
 * so marking it disabled would hide a working control from assistive tech.
 *
 * Fill in `contactChannels` in src/data/content.ts and every one of these
 * becomes live with no further change here.
 */

type Variant = 'primary' | 'secondary' | 'ghost'

function PendingNote({ children }: { children: string }) {
  return (
    <p role="status" className="mt-3 text-[0.8125rem] text-muted">
      {children}
    </p>
  )
}

export function CtaGroup({
  className,
  size = 'lg',
  onBrief,
}: {
  className?: string
  size?: 'md' | 'lg'
  /** Scrolls to the brief form. Omitted on the contact section itself. */
  onBrief?: () => void
}) {
  const [note, setNote] = useState<string | null>(null)

  const book = contactChannels.bookingUrl
  const email = contactChannels.email

  const buttons: Array<{ key: string; label: string; variant: Variant; action: () => void; href: string | null; pending: boolean }> = [
    {
      key: 'book',
      label: ctas.book,
      variant: 'primary',
      href: book,
      pending: !book,
      action: () => setNote('The booking link isn’t set up yet — use “Share a hiring brief” below for now.'),
    },
    {
      key: 'brief',
      label: ctas.brief,
      variant: 'secondary',
      href: null,
      pending: false,
      action: () => (onBrief ? onBrief() : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })),
    },
    {
      key: 'email',
      label: ctas.email,
      variant: 'ghost',
      href: email ? `mailto:${email}` : null,
      pending: !email,
      action: () => setNote('The email address isn’t published yet — use “Share a hiring brief” below for now.'),
    },
  ]

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {buttons.map((b) =>
          b.href ? (
            <a
              key={b.key}
              href={b.href}
              className={cx(
                'group inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] active:translate-y-px',
                size === 'lg' ? 'h-12 px-6 text-[0.9375rem]' : 'h-11 px-5 text-[0.875rem]',
                b.variant === 'primary' && 'bg-primary text-white shadow-xs hover:bg-primary-hover',
                b.variant === 'secondary' &&
                  'border border-border bg-surface text-foreground shadow-xs hover:border-border-strong hover:bg-surface-2',
                b.variant === 'ghost' && 'text-foreground hover:bg-surface-2',
              )}
            >
              {b.label}
              <ArrowRight />
            </a>
          ) : (
            <Button
              key={b.key}
              size={size}
              variant={b.variant}
              arrow
              onClick={b.action}
            >
              {b.label}
            </Button>
          ),
        )}
      </div>
      {note && <PendingNote>{note}</PendingNote>}
    </div>
  )
}

/** A single inline CTA, used at the foot of the FAQ. */
export function InlineCta({ label }: { label: string }) {
  const [note, setNote] = useState<string | null>(null)
  const book = contactChannels.bookingUrl
  const email = contactChannels.email
  const href = label === ctas.email ? (email ? `mailto:${email}` : null) : book

  if (href) {
    return (
      <a href={href} className="group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-primary">
        {label}
        <ArrowRight />
      </a>
    )
  }

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={() =>
          setNote('Not set up yet — share a hiring brief below and we’ll come back to you.')
        }
        className="group inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] font-medium text-primary"
      >
        {label}
        <ArrowRight />
      </button>
      {note && (
        <span role="status" className="text-[0.8125rem] text-muted">
          {note}
        </span>
      )}
    </span>
  )
}
