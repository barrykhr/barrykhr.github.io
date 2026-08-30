import { cta } from '@/data/site'
import { ButtonLink, Container, Eyebrow, Reveal } from '@/components/primitives'
import { TalentOS } from '@/components/viz/TalentOS'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0" />

      <Container width="wide" className="relative pt-[6.5rem] pb-[clamp(3rem,2rem+4vw,5rem)] lg:pt-[8.5rem]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 xl:gap-20">
          {/* ── Statement ── */}
          <div>
            <Reveal>
              <Eyebrow>Talent supply chain · RPO · Global recruitment</Eyebrow>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="mt-7 max-w-[17ch] text-display text-foreground">
                Talent infrastructure for companies that are scaling.
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="mt-7 max-w-[52ch] text-lede text-muted">
                RPO, specialist recruitment and structured talent matching across the US and India —
                run by one accountable delivery team. We measure the work at joining, not at
                submission.
              </p>
            </Reveal>

            <Reveal delay={190}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink to={cta.primary.href} size="lg" arrow>
                  {cta.primary.label}
                </ButtonLink>
                <ButtonLink to={cta.secondary.href} variant="secondary" size="lg">
                  {cta.secondary.label}
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <dl className="mt-12 grid grid-cols-3 gap-x-6 border-t border-border pt-7">
                {[
                  { v: '500K+', l: 'Talent network' },
                  { v: 'US · India', l: 'Markets served' },
                  { v: 'IT + Non-IT', l: 'Hiring domains' },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="sr-only">{s.l}</dt>
                    <dd>
                      <p className="tnum text-[1.125rem] leading-none font-medium text-foreground">
                        {s.v}
                      </p>
                      <p className="mt-2 text-[0.8125rem] text-muted">{s.l}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* ── Product surface ── */}
          <Reveal delay={200}>
            <TalentOS />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
