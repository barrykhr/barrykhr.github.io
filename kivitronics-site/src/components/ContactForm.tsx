import { useId, useState } from 'react'
import { cx } from '@/lib/cx'
import { Button } from '@/components/primitives'

/**
 * ── BEFORE LAUNCH ────────────────────────────────────────────────────────────
 * Point this at whatever should receive enquiries (Formspree, Basin, a
 * serverless function, your own API — anything accepting a JSON POST). While it
 * is null the form validates and then says plainly that delivery is not
 * connected, rather than silently dropping a lead.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const FORM_ENDPOINT: string | null = null

type Field = 'name' | 'company' | 'email' | 'requirement' | 'phone'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const initial: Values = { name: '', company: '', email: '', requirement: '', phone: '' }
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud|proton(mail)?)\./i

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Please tell us your name.'
  if (!v.company.trim()) e.company = 'Which company are you hiring for?'
  if (!v.email.trim()) e.email = 'We need an address to reply to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That address doesn’t look valid.'
  else if (FREE_MAIL.test(v.email.trim())) e.email = 'Please use your work email.'
  if (!v.requirement.trim()) e.requirement = 'A sentence about the role is enough.'
  return e
}

export function ContactForm({ tone = 'light' }: { tone?: 'light' | 'canvas' }) {
  const dark = tone === 'canvas'
  const id = useId()
  const [values, setValues] = useState<Values>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [f]: e.target.value }))
    if (errors[f]) setErrors((p) => ({ ...p, [f]: undefined }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus()
      return
    }
    if (!FORM_ENDPOINT) return setStatus('error')
    setStatus('sending')
    try {
      const r = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })
      if (!r.ok) throw new Error(String(r.status))
      setStatus('sent')
      setValues(initial)
    } catch {
      setStatus('error')
    }
  }

  const labelCls = cx('block text-[0.8125rem] font-medium', dark ? 'text-canvas-fg' : 'text-foreground')
  const fieldCls = cx(
    'mt-2 block w-full rounded-md border px-3.5 py-2.5 text-[0.9375rem] outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)]',
    dark
      ? 'border-canvas-line bg-canvas-2 text-canvas-fg placeholder:text-canvas-faint focus:border-primary-light focus:ring-2 focus:ring-primary-light/25'
      : 'border-border bg-surface text-foreground placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/15',
  )
  const errCls = cx('mt-1.5 text-[0.8125rem]', dark ? 'text-primary-light' : 'text-error')

  if (status === 'sent') {
    return (
      <div
        role="status"
        className={cx(
          'rounded-lg border p-6',
          dark ? 'border-canvas-line bg-canvas-2' : 'border-border bg-surface shadow-sm',
        )}
      >
        <h3 className={cx('text-h3', dark ? 'text-canvas-fg' : 'text-foreground')}>
          Thank you — that’s with us.
        </h3>
        <p className={cx('mt-2 text-[0.9375rem]', dark ? 'text-canvas-muted' : 'text-muted')}>
          A delivery lead will reply directly. Not a coordinator, and not an auto-responder.
        </p>
      </div>
    )
  }

  const field = (
    f: Field,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> & { optional?: boolean } = {},
  ) => {
    const { optional, ...rest } = props
    return (
      <div>
        <label htmlFor={`${id}-${f}`} className={labelCls}>
          {label}
          {optional && <span className={cx('ml-1.5 font-normal', dark ? 'text-canvas-faint' : 'text-muted')}>(optional)</span>}
        </label>
        <input
          id={`${id}-${f}`}
          name={f}
          value={values[f]}
          onChange={set(f)}
          aria-invalid={Boolean(errors[f])}
          aria-describedby={errors[f] ? `${id}-${f}-error` : undefined}
          className={fieldCls}
          {...rest}
        />
        {errors[f] && (
          <p id={`${id}-${f}-error`} className={errCls}>
            {errors[f]}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {field('name', 'Name', { autoComplete: 'name', placeholder: 'Your name' })}
      {field('company', 'Company', { autoComplete: 'organization', placeholder: 'Where you’re hiring' })}
      {field('email', 'Work email', { type: 'email', inputMode: 'email', autoComplete: 'email', placeholder: 'you@company.com' })}
      {field('phone', 'Phone', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: 'Direct line', optional: true })}

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-requirement`} className={labelCls}>
          What are you hiring for?
        </label>
        <textarea
          id={`${id}-requirement`}
          name="requirement"
          rows={3}
          value={values.requirement}
          onChange={set('requirement')}
          aria-invalid={Boolean(errors.requirement)}
          aria-describedby={errors.requirement ? `${id}-requirement-error` : undefined}
          className={cx(fieldCls, 'resize-y')}
          placeholder="The role, the level, and what’s made it hard so far."
        />
        {errors.requirement && (
          <p id={`${id}-requirement-error`} className={errCls}>
            {errors.requirement}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <Button
          type="submit"
          size="lg"
          arrow
          variant={dark ? 'on-canvas' : 'primary'}
          disabled={status === 'sending'}
          className="w-full sm:w-auto"
        >
          {status === 'sending' ? 'Sending…' : 'Talk to our team'}
        </Button>

        {status === 'error' && (
          <p role="alert" className={cx('mt-4 max-w-[54ch] text-[0.875rem]', dark ? 'text-primary-light' : 'text-error')}>
            {FORM_ENDPOINT
              ? 'That didn’t send. Please try again in a moment.'
              : 'This form isn’t connected to an inbox yet — set FORM_ENDPOINT in src/components/ContactForm.tsx before launch.'}
          </p>
        )}

        <p className={cx('mt-4 text-[0.8125rem]', dark ? 'text-canvas-muted' : 'text-muted')}>
          Five fields. A delivery lead reads every one and replies directly.
        </p>
      </div>
    </form>
  )
}
