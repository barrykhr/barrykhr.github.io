import { cx } from '@/lib/cx'
import { industries, whatWeDo } from '@/data/content'

/**
 * Hero visual. Everything in it comes from the supplied copy: the four career
 * levels, the leadership bands, the two-stage screening flow and its three
 * context inputs, and the industry list. No figures, because the copy has none.
 */
export function ContextPanel({ className }: { className?: string }) {
  const inputs = ['The role', 'Your business', 'The hiring context']

  return (
    <figure className={cx('relative', className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
        <div className="flex items-center gap-3 border-b border-border bg-surface-2/70 px-4 py-3">
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-xs bg-foreground">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
              <path d="M6 5.5 12 12M6 12h6M6 18.5 12 12" stroke="#FBFAF9" strokeWidth="2" strokeLinecap="round" />
              <circle cx="17" cy="12" r="2.8" fill="#1F45E0" />
            </svg>
          </span>
          <span className="text-[0.8125rem] font-medium text-foreground">How a search is shaped</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* ── Career levels ── */}
          <div className="border-b border-border p-5 md:border-r md:border-b-0">
            <p className="label text-muted">Career levels</p>
            <ul className="mt-4 space-y-2">
              {whatWeDo.levels.map((level, i) => (
                <li key={level} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    style={{ opacity: 0.35 + i * 0.22 }}
                  />
                  <span className="text-[0.875rem] text-foreground">{level}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-border pt-4">
              <p className="label text-muted">Leadership hiring</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {whatWeDo.leadership.map((l) => (
                  <li
                    key={l}
                    className="rounded-xs border border-border bg-surface-2 px-2 py-1 text-[0.6875rem] text-muted-strong"
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Screening flow ── */}
          <div className="flex flex-col p-5">
            <p className="label text-muted">Screening</p>

            <ol className="mt-4 space-y-2.5">
              <li className="rounded-md border border-border bg-background px-4 py-3">
                <p className="text-[0.875rem] font-medium text-foreground">AI-assisted initial screening</p>
              </li>
              <li aria-hidden="true" className="flex justify-center py-0.5">
                <svg viewBox="0 0 12 16" className="h-4 w-3 text-border-strong" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 1v13M2.5 10.5 6 14l3.5-3.5" />
                </svg>
              </li>
              <li className="rounded-md border border-primary-line bg-primary-subtle px-4 py-3">
                <p className="text-[0.875rem] font-medium text-primary">Human review</p>
                <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
                  {inputs.map((input) => (
                    <li key={input} className="text-[0.6875rem] text-muted-strong">
                      {input}
                    </li>
                  ))}
                </ul>
              </li>
            </ol>

            <div className="mt-5 border-t border-border pt-4">
              <p className="label text-muted">Industry experience</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {industries.list.map((industry) => (
                  <li
                    key={industry}
                    className="rounded-xs border border-border bg-surface-2 px-2 py-1 text-[0.6875rem] text-muted-strong"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}
