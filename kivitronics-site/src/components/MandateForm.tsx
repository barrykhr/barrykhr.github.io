import { useId, useState } from 'react'
import { cx } from '@/lib/cx'
import { ButtonAction } from '@/components/primitives'

/**
 * ── BEFORE LAUNCH ────────────────────────────────────────────────────────────
 * Set this to the URL that should receive submissions (Formspree, Basin, a
 * Netlify/Cloudflare function, your own API — anything that accepts a JSON POST).
 * While it is null the form validates and reports clearly that delivery is not
 * yet connected, rather than silently dropping an enquiry.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const FORM_ENDPOINT: string | null = null

type Field = 'name' | 'company' | 'email' | 'requirement' | 'phone'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const initial: Values = { name: '', company: '', email: '', requirement: '', phone: '' }

/** Rejects the obvious free-mail domains — this is a business enquiry form. */
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud|proton(mail)?)\./i

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Please tell us your name.'
  if (!values.company.trim()) errors.company = 'Please tell us which company you’re hiring for.'
  if (!values.email.trim()) errors.email = 'We need an email address to reply to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'That doesn’t look like a valid email address.'
  else if (FREE_MAIL.test(values.email.trim()))
    errors.email = 'Please use your work email address.'
  if (!values.requirement.trim()) errors.requirement = 'A sentence on the role is enough.'
  return errors
}

export function MandateForm({ tone = 'ivory' }: { tone?: 'ivory' | 'ink' }) {
  const onDark = tone === 'ivory'
  const formId = useId()
  const [values, setValues] = useState<Values>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`${formId}-${Object.keys(found)[0]}`)?.focus()
      return
    }
    if (!FORM_ENDPOINT) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error(String(response.status))
      setStatus('sent')
      setValues(initial)
    } catch {
      setStatus('error')
    }
  }

  const labelClass = cx(
    'block text-[0.75rem] font-semibold tracking-[0.1em] uppercase',
    onDark ? 'text-ivory/50' : 'text-ink/62',
  )
  const fieldClass = cx(
    'mt-3 block w-full border-0 border-b bg-transparent px-0 py-3 text-[1rem] outline-none transition-colors',
    onDark
      ? 'border-ivory/20 text-ivory placeholder:text-ivory/55 focus:border-gold'
      : 'border-ink/20 text-ink placeholder:text-ink/62 focus:border-gold',
  )
  const errorClass = 'mt-2 text-[0.8125rem] text-gold'

  if (status === 'sent') {
    return (
      <div
        role="status"
        className={cx(
          'border-t-2 border-gold p-8',
          onDark ? 'bg-ivory/5 text-ivory' : 'bg-ivory text-ink',
        )}
      >
        <h3 className="font-display text-[1.5rem] font-medium tracking-[-0.02em]">
          Thank you — that’s with us.
        </h3>
        <p className={cx('mt-3 text-[0.9375rem]', onDark ? 'text-ivory/60' : 'text-ink/60')}>
          A delivery lead will come back to you directly. Not a coordinator, and not a bot.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2">
      <div>
        <label htmlFor={`${formId}-name`} className={labelClass}>
          Name
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={set('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={fieldClass}
          placeholder="Your name"
        />
        {errors.name && (
          <p id={`${formId}-name-error`} className={errorClass}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-company`} className={labelClass}>
          Company
        </label>
        <input
          id={`${formId}-company`}
          name="company"
          autoComplete="organization"
          value={values.company}
          onChange={set('company')}
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? `${formId}-company-error` : undefined}
          className={fieldClass}
          placeholder="Where you’re hiring"
        />
        {errors.company && (
          <p id={`${formId}-company-error`} className={errorClass}>
            {errors.company}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className={labelClass}>
          Work email
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={set('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={fieldClass}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p id={`${formId}-email-error`} className={errorClass}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-phone`} className={labelClass}>
          Phone <span className="font-normal normal-case opacity-60">(optional)</span>
        </label>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={set('phone')}
          className={fieldClass}
          placeholder="Direct line"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${formId}-requirement`} className={labelClass}>
          Hiring requirement
        </label>
        <textarea
          id={`${formId}-requirement`}
          name="requirement"
          rows={3}
          value={values.requirement}
          onChange={set('requirement')}
          aria-invalid={Boolean(errors.requirement)}
          aria-describedby={errors.requirement ? `${formId}-requirement-error` : undefined}
          className={cx(fieldClass, 'resize-y')}
          placeholder="The role, the level, and what’s made it hard so far."
        />
        {errors.requirement && (
          <p id={`${formId}-requirement-error`} className={errorClass}>
            {errors.requirement}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <ButtonAction
          type="submit"
          variant={onDark ? 'gold' : 'primary'}
          arrow
          disabled={status === 'sending'}
          className="w-full disabled:opacity-60 sm:w-auto"
        >
          {status === 'sending' ? 'Sending…' : 'Start a hiring mandate'}
        </ButtonAction>

        {status === 'error' && (
          <p
            role="alert"
            className={cx('mt-5 max-w-[52ch] text-[0.875rem]', onDark ? 'text-gold-400' : 'text-gold-600')}
          >
            {FORM_ENDPOINT
              ? 'That didn’t send. Please try again in a moment.'
              : 'This form isn’t connected to an inbox yet — set FORM_ENDPOINT in src/components/MandateForm.tsx before launch.'}
          </p>
        )}

        <p className={cx('mt-5 max-w-[46ch] text-[0.8125rem]', onDark ? 'text-ivory/55' : 'text-ink/62')}>
          Five fields. We read every one — a delivery lead replies, not an auto-responder.
        </p>
      </div>
    </form>
  )
}
