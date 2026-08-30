import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * ── TALENT OS ────────────────────────────────────────────────────────────────
 * A conceptual product surface for the hero. KiVitronics is a services
 * business, so this is explicitly labelled as illustrative and it invents no
 * statistics: the only figures shown (91%, 20–30 days, 136) are the real
 * delivery record. Role titles and pipeline counts are stand-ins for shape,
 * which is why the panel carries a visible "Illustrative interface" badge.
 * ─────────────────────────────────────────────────────────────────────────────
 */

type Req = { role: string; market: string; stage: number; kind: 'tech' | 'non-tech' }

const requisitions: Req[] = [
  { role: 'Senior Backend Engineer', market: 'India', stage: 3, kind: 'tech' },
  { role: 'Data Platform Engineer', market: 'United States', stage: 2, kind: 'tech' },
  { role: 'Financial Analyst', market: 'India', stage: 2, kind: 'non-tech' },
  { role: 'Engineering Manager', market: 'United States', stage: 1, kind: 'tech' },
  { role: 'Operations Lead', market: 'India', stage: 1, kind: 'non-tech' },
]

const stages = ['Mapped', 'Qualified', 'Interview', 'Offer'] as const

/** Column heights are proportional, not measured — the shape of a funnel. */
const funnel = [
  { label: 'Mapped', pct: 100 },
  { label: 'Qualified', pct: 58 },
  { label: 'Interview', pct: 34 },
  { label: 'Offer', pct: 18 },
  { label: 'Joined', pct: 16 },
]

const clusters = ['Go', 'Kubernetes', 'React', 'Data eng', 'FP&A', 'SQL', 'Node', 'Controllership']

export function TalentOS({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)

  // A slow rotation through the requisition list — the only motion in the panel
  // besides the live dot. It reads as a system doing work, not as a carousel.
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % requisitions.length), 3200)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <figure className={cx('relative', className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
        {/* ── Chrome ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-border bg-surface-2/70 px-4 py-3">
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-xs bg-foreground">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
              <path d="M6 5.5 12 12M6 12h6M6 18.5 12 12" stroke="#FBFAF9" strokeWidth="2" strokeLinecap="round" />
              <circle cx="17" cy="12" r="2.8" fill="#1F45E0" />
            </svg>
          </span>
          <span className="text-[0.8125rem] font-medium text-foreground">Talent OS</span>
          <span className="hidden items-center gap-1.5 text-[0.8125rem] text-muted sm:flex">
            <span aria-hidden="true">/</span> Delivery
          </span>
          <span className="ml-auto flex items-center gap-2">
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              {!reduced && <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />}
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="label hidden text-muted sm:inline">Live</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          {/* ── Requisitions ───────────────────────────────────────────── */}
          <div className="border-b border-border p-4 md:border-r md:border-b-0">
            <div className="flex items-center justify-between">
              <p className="label text-muted">Open requisitions</p>
              <span className="tnum text-[0.75rem] text-muted">{requisitions.length}</span>
            </div>

            <ul className="mt-3 space-y-1">
              {requisitions.map((req, i) => {
                const isActive = i === active
                return (
                  <li key={req.role}>
                    <div
                      className={cx(
                        'rounded-md border px-3 py-2.5 transition-[background-color,border-color] duration-[var(--duration-slow)] ease-[var(--ease-out)]',
                        isActive
                          ? 'border-primary-line bg-primary-subtle'
                          : 'border-transparent bg-transparent',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={cx(
                            'h-1.5 w-1.5 shrink-0 rounded-full',
                            req.kind === 'tech' ? 'bg-primary' : 'bg-accent',
                          )}
                        />
                        <span className="truncate text-[0.8125rem] font-medium text-foreground">
                          {req.role}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2.5">
                        <span className="text-[0.6875rem] text-muted">{req.market}</span>
                        <span aria-hidden="true" className="h-2.5 w-px bg-border-strong" />
                        <span className="flex items-center gap-1" aria-label={`${stages[req.stage]} stage`}>
                          {stages.map((s, si) => (
                            <span
                              key={s}
                              className={cx(
                                'h-1 rounded-full transition-colors duration-[var(--duration-slow)]',
                                si <= req.stage ? 'w-4 bg-primary' : 'w-2 bg-border-strong',
                              )}
                            />
                          ))}
                        </span>
                        <span className="ml-auto text-[0.6875rem] text-muted">{stages[req.stage]}</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-4 border-t border-border pt-4">
              <p className="label text-muted">Skill clusters</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {clusters.map((c) => (
                  <li
                    key={c}
                    className="rounded-xs border border-border bg-surface-2 px-2 py-1 text-[0.6875rem] text-muted-strong"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Pipeline + record ──────────────────────────────────────── */}
          <div className="flex flex-col p-4">
            <div className="flex items-center justify-between">
              <p className="label text-muted">Pipeline</p>
              <p className="text-[0.6875rem] text-muted">Requirement → joining</p>
            </div>

            <div className="mt-4 flex h-[132px] items-end gap-1.5 sm:h-[152px]">
              {funnel.map((f, i) => {
                const last = i === funnel.length - 1
                return (
                  <div key={f.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <div
                      className={cx(
                        'w-full rounded-t-sm transition-[height] duration-[900ms] ease-[var(--ease-out)]',
                        last ? 'bg-primary' : 'bg-primary/16',
                      )}
                      style={{ height: `${f.pct}%`, transitionDelay: `${i * 90}ms` }}
                    />
                    <span className="truncate text-center text-[0.625rem] text-muted">{f.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
              {[
                { value: '91%', label: 'Offer to joining' },
                { value: '20–30', label: 'Days to close' },
                { value: '136', label: 'Roles closed' },
                { value: '5', label: 'Qualification checks' },
              ].map((m) => (
                <div key={m.label} className="rounded-md border border-border bg-background px-3 py-2.5">
                  <p className="tnum text-[1.125rem] leading-none font-medium text-foreground">
                    {m.value}
                  </p>
                  <p className="mt-1.5 text-[0.6875rem] leading-tight text-muted">{m.label}</p>
                </div>
              ))}
            </div>

            {/* The real nine-stage model, shown as coverage rather than as data. */}
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <p className="label text-muted">Delivery stages</p>
                <p className="tnum text-[0.6875rem] text-muted">9</p>
              </div>
              <div className="mt-3 flex items-end gap-[3px]">
                {Array.from({ length: 9 }, (_, i) => (
                  <span
                    key={i}
                    className={cx(
                      'flex-1 rounded-xs',
                      i < 5 ? 'h-4 bg-primary' : 'h-2.5 bg-primary/25',
                    )}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[0.625rem] text-muted">
                <span>Understand</span>
                <span>Source</span>
                <span>Evaluate</span>
                <span>Deliver</span>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2.5 pt-4">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <p className="truncate text-[0.75rem] text-muted">
                <span className="text-foreground">Qualification complete</span> · moved to Offer
              </p>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 flex items-center gap-2 text-[0.75rem] text-muted">
        <span className="label rounded-xs border border-border bg-surface px-1.5 py-0.5 text-muted">
          Illustrative
        </span>
        A conceptual view of how we track delivery. Figures shown are our real record; role data is
        representative.
      </figcaption>
    </figure>
  )
}
