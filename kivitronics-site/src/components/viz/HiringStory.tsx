import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * ── HERO MOTION GRAPHIC ──────────────────────────────────────────────────────
 * Six beats, looping calmly:
 *   1 role brief appears · 2 a scan line crosses it · 3 candidate cards enter
 *   4 connectors link role needs to candidate context · 5 a human-review marker
 *   6 settles, holds, fades, repeats.
 *
 * Deliberately not a "perfect match" effect: the connectors are drawn slowly,
 * they link context to context rather than producing a score, and the last
 * element to arrive is the human. Under `prefers-reduced-motion` the whole
 * thing renders once in its end state with no animation at all.
 *
 * All role and candidate detail is fictional and captioned as illustrative.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Beat durations in ms. Long enough to read, short enough not to drag. */
const BEATS = [1300, 1500, 1700, 1800, 1400, 4200, 700]
const LAST = BEATS.length - 1

const prompts = [
  { q: 'Why now?', a: 'Team doubled; no product owner' },
  { q: 'Team needs', a: 'Works with design and data' },
  { q: '90-day success', a: 'Roadmap agreed and shipping' },
]

const candidates = [
  {
    initials: 'PS',
    name: 'Priya S.',
    experience: '7 yrs · Product, SaaS',
    context: { label: 'Motivated by', value: 'Building 0→1 with a small team' },
  },
  {
    initials: 'DR',
    name: 'Daniel R.',
    experience: '9 yrs · Product, deep tech',
    context: { label: 'Interested in', value: 'Leading a function, not just a roadmap' },
  },
]

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      aria-hidden="true"
      className="bg-accent-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold text-white"
    >
      {initials}
    </span>
  )
}

function BriefCard({ show, scanning }: { show: boolean; scanning: boolean }) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-md transition-[opacity,transform] duration-700 ease-[var(--ease-out)]',
        show ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="label text-primary">Role brief</span>
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" aria-hidden="true" />
      </div>
      <p className="mt-2.5 text-[0.9375rem] font-semibold text-foreground">Senior Product Manager</p>

      <ul className="mt-3.5 space-y-2.5">
        {prompts.map((p) => (
          <li key={p.q} className="rounded-md bg-surface-2 px-3 py-2">
            <p className="text-[0.6875rem] font-medium text-primary">{p.q}</p>
            <p className="mt-0.5 text-[0.75rem] leading-snug text-muted-strong">{p.a}</p>
          </li>
        ))}
      </ul>

      {/* Beat 2 — AI-assisted initial screening, shown as a pass over the brief.
          Keyed so the animation restarts cleanly on every loop. */}
      {scanning && (
        <span
          key="scan"
          aria-hidden="true"
          className="animate-[scan_1.5s_cubic-bezier(0.4,0,0.2,1)_forwards] pointer-events-none absolute inset-x-0 top-0 h-20"
          style={{
            background:
              'linear-gradient(to bottom, rgba(31,69,224,0) 0%, rgba(31,69,224,0.09) 55%, rgba(109,40,217,0.16) 88%, rgba(109,40,217,0.95) 97%, rgba(109,40,217,0) 100%)',
          }}
        />
      )}
    </div>
  )
}

function CandidateCard({
  show,
  candidate,
}: {
  show: boolean
  candidate: (typeof candidates)[number]
}) {
  return (
    <div
      className={cx(
        'rounded-xl border border-border bg-surface p-3.5 shadow-md transition-[opacity,transform] duration-700 ease-[var(--ease-out)]',
        show ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0',
      )}
    >
      <div className="flex items-center gap-2.5">
        <Avatar initials={candidate.initials} />
        <div className="min-w-0">
          <p className="truncate text-[0.8125rem] font-semibold text-foreground">{candidate.name}</p>
          <p className="truncate text-[0.6875rem] text-muted">{candidate.experience}</p>
        </div>
      </div>
      <div className="mt-3 rounded-md bg-accent-gradient-soft px-3 py-2">
        <p className="text-[0.625rem] font-medium tracking-[0.06em] text-violet uppercase">
          {candidate.context.label}
        </p>
        <p className="mt-0.5 text-[0.75rem] leading-snug text-foreground">{candidate.context.value}</p>
      </div>
    </div>
  )
}

function HumanMarker({ show }: { show: boolean }) {
  return (
    <div
      className={cx(
        'inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 shadow-md transition-[opacity,transform] duration-700 ease-[var(--ease-out)]',
        show ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-violet" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="5.5" r="2.6" />
        <path d="M2.8 14c0-2.9 2.3-4.8 5.2-4.8s5.2 1.9 5.2 4.8" strokeLinecap="round" />
      </svg>
      <span className="text-[0.75rem] font-medium whitespace-nowrap text-foreground">
        Human review
      </span>
    </div>
  )
}

export function HiringStory({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [step, setStep] = useState(0)

  // `usePrefersReducedMotion` reads the media query in an effect, so it is
  // false on the first render. Without this the initial state stays at beat 0
  // and the timer never runs — a reduced-motion visitor sees the role brief
  // alone, frozen. Jump straight to the settled end state instead.
  useEffect(() => {
    if (reduced) setStep(LAST - 1)
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const id = window.setTimeout(
      () => setStep((s) => (s >= LAST ? 0 : s + 1)),
      BEATS[step] ?? 1500,
    )
    return () => window.clearTimeout(id)
  }, [step, reduced])

  // Beat 6 fades the composition out before it loops, so the restart is gentle.
  const fading = !reduced && step === LAST
  const at = (n: number) => step >= n && !fading

  return (
    <figure className={className}>
      <div
        className={cx(
          'relative transition-opacity duration-500',
          fading ? 'opacity-0' : 'opacity-100',
        )}
        role="img"
        aria-label="A role brief listing why the role exists, who it works with and what success looks like, linked by human review to two illustrative candidate profiles showing experience alongside motivation and interests."
      >
        {/* ── md and up: composed layout with drawn connectors ── */}
        <div className="relative hidden aspect-[5/4] md:block">
          <div className="absolute top-0 left-0 w-[46%]">
            <BriefCard show={at(0)} scanning={at(1) && step < LAST && !reduced} />
          </div>

          <div className="absolute top-0 right-0 w-[42%]">
            <CandidateCard show={at(2)} candidate={candidates[0]} />
          </div>
          <div className="absolute top-[40%] right-0 w-[42%]">
            <CandidateCard show={at(2)} candidate={candidates[1]} />
          </div>

          {/* Beat 4 — connectors drawn slowly, context to context */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 80"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="kv-connector" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1f45e0" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
            {[
              // role need → candidate context: symmetric, gentle, uncrossed
              { d: 'M46 17 C 52 17, 52 10, 58 10', len: 15 },
              { d: 'M46 33 C 52 33, 52 41, 58 41', len: 16 },
            ].map((line) => (
              <path
                key={line.d}
                d={line.d}
                fill="none"
                stroke="url(#kv-connector)"
                strokeWidth="0.45"
                strokeLinecap="round"
                strokeDasharray={line.len}
                strokeDashoffset={at(3) ? 0 : line.len}
                style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.16,1,0.3,1)' }}
              />
            ))}
          </svg>

          {/* Beat 5 — the human arrives last, at the foot of the connection */}
          <div className="absolute top-[76%] left-1/2 -translate-x-1/2">
            <HumanMarker show={at(4)} />
          </div>
        </div>

        {/* ── Below md: a static end state, per the brief's allowance for a
            still visual on mobile. Looping here reserved the full height and
            left a long void while the beats played, and it spends battery on
            the most constrained devices for a graphic that is often scrolled
            straight past. ── */}
        <div className="relative space-y-3 md:hidden">
          <BriefCard show scanning={false} />
          <div className="flex justify-center">
            <span aria-hidden="true" className="bg-accent-gradient h-6 w-px" />
          </div>
          <div className="flex justify-center">
            <HumanMarker show />
          </div>
          <CandidateCard show candidate={candidates[0]} />
        </div>
      </div>

      <figcaption className="mt-4 flex items-start gap-2 text-[0.75rem] leading-snug text-muted">
        <span className="label mt-0.5 shrink-0 rounded-xs border border-border bg-surface px-1.5 py-0.5 text-muted">
          Illustrative
        </span>
        <span>
          A sample role brief and candidate context. AI supports the screening; people make the
          hiring judgment.
        </span>
      </figcaption>
    </figure>
  )
}
