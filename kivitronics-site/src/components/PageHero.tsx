import type { ReactNode } from 'react'
import { Container, Eyebrow, Reveal } from '@/components/primitives'

/**
 * Interior-page opener. Light, structural and quiet — the homepage hero is the
 * only place that gets a product surface.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  figures,
  aside,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  actions?: ReactNode
  figures?: Array<{ value: string; label: string }>
  aside?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <Container width="wide" className="relative pt-[7.5rem] pb-[clamp(3rem,2.5rem+3vw,4.5rem)] lg:pt-[9.5rem]">
        <div className={aside ? 'grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16' : ''}>
          <div>
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-6 max-w-[20ch] text-h1 text-foreground">{title}</h1>
            </Reveal>
            {lede && (
              <Reveal delay={110}>
                <p className="mt-6 max-w-[58ch] text-lede text-muted">{lede}</p>
              </Reveal>
            )}
            {actions && (
              <Reveal delay={160}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>
              </Reveal>
            )}
          </div>
          {aside && <Reveal delay={140}>{aside}</Reveal>}
        </div>

        {figures && (
          <Reveal delay={200}>
            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 md:grid-cols-4">
              {figures.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd>
                    <p className="tnum text-[clamp(1.5rem,1.2rem+1.2vw,2.125rem)] leading-none font-medium text-foreground">
                      {f.value}
                    </p>
                    <p className="mt-2.5 text-[0.8125rem] leading-snug text-muted">{f.label}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
