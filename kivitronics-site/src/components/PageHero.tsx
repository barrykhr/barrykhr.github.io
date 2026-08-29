import type { ReactNode } from 'react'
import { Container, Eyebrow, Reveal } from '@/components/primitives'

/**
 * Interior-page opener. Deliberately quieter than the homepage hero — one
 * statement, one supporting paragraph, optional figures. No decoration.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  figures,
  children,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  figures?: Array<{ value: string; label: string }>
  children?: ReactNode
}) {
  return (
    <section className="on-ink relative isolate overflow-hidden bg-ink text-ivory">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container
        width="wide"
        className="relative pt-[7.5rem] pb-[clamp(3rem,2.5rem+3vw,5.5rem)] lg:pt-[10.5rem]"
      >
        <Reveal>
          <Eyebrow tone="on-dark">
            {eyebrow}
          </Eyebrow>
        </Reveal>
        <Reveal delay={70}>
          <h1 className="mt-7 max-w-[18ch] text-d1 font-semibold text-ivory">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={140}>
            <p className="mt-9 max-w-[54ch] text-lede text-ivory/62">{lede}</p>
          </Reveal>
        )}
        {children}
        {figures && (
          <Reveal delay={200}>
            <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-ivory/12 pt-8 sm:grid-cols-4">
              {figures.map((figure) => (
                <div key={figure.label}>
                  <dt className="sr-only">{figure.label}</dt>
                  <dd>
                    <p className="tnum font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-none font-semibold tracking-[-0.04em] text-ivory">
                      {figure.value}
                    </p>
                    <p className="mt-3 text-[0.8125rem] leading-snug text-ivory/55">
                      {figure.label}
                    </p>
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
