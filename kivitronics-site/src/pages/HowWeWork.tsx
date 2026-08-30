import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { dimensions, preparationTiers, stages, touchpoints } from '@/data/process'
import { deliveryMetrics } from '@/data/metrics'
import { Stat } from '@/components/Metric'
import { cx } from '@/lib/cx'
import { cta } from '@/data/site'
import { Badge, ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/primitives'
import { FinalCta } from '@/sections/FinalCta'

const phases = ['Understand', 'Source', 'Evaluate', 'Deliver'] as const

export function HowWeWork() {
  return (
    <>
      <Seo
        title="How we work — KiVitronics"
        description="Nine stages under one accountable owner, five qualification dimensions, and eight candidate touchpoints between the first conversation and day one."
        path="/how-we-work"
      />
      <PageHero
        eyebrow="How we work"
        title="Nine stages. One accountable owner."
        lede="Hiring breaks at the handovers — between sourcing and submission, between interview and offer, between acceptance and joining. The model removes the handovers rather than managing them."
        actions={
          <>
            <ButtonLink to={cta.primary.href} size="lg" arrow>
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink to="/solutions" variant="secondary" size="lg">
              Explore solutions
            </ButtonLink>
          </>
        }
        figures={[
          { value: '9', label: 'Delivery stages' },
          { value: '5', label: 'Qualification dimensions' },
          { value: '8', label: 'Candidate touchpoints' },
          { value: '91%', label: 'Offer to joining' },
        ]}
      />

      {/* ── The nine stages, grouped by phase ── */}
      <Section tone="background" id="model">
        <Container width="wide">
          <SectionHeading
            eyebrow="Delivery model"
            title="From requirement to joining."
            lede="Four phases, nine stages. The same person owns all of them — there is no handover between sourcing and joining."
          />

          <div className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] space-y-4">
            {phases.map((phase, pi) => {
              const inPhase = stages.filter((s) => s.phase === phase)
              return (
                <Reveal key={phase} delay={pi * 60}>
                  <div className="rounded-lg border border-border bg-surface p-5 lg:p-7">
                    <div className="flex items-center gap-3">
                      <Badge tone="primary">{`Phase ${pi + 1}`}</Badge>
                      <h3 className="text-h4 font-medium text-foreground">{phase}</h3>
                    </div>

                    <ol className="mt-6 grid gap-x-8 gap-y-7 md:grid-cols-2 xl:grid-cols-3">
                      {inPhase.map((s) => (
                        <li key={s.index} className="border-t border-border pt-5">
                          <div className="flex items-baseline gap-3">
                            <span className="tnum label text-primary">{s.index}</span>
                            <h4 className="text-[1.0625rem] font-medium text-foreground">{s.name}</h4>
                          </div>
                          <p className="mt-2.5 text-[0.9375rem] font-medium text-foreground">{s.summary}</p>
                          <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">{s.detail}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* ── Five dimensions ── */}
      <Section tone="surface" id="qualification">
        <Container width="wide">
          <SectionHeading
            eyebrow="Qualification"
            title="Five dimensions. Three of them are invisible on a CV."
            lede="Capability and relevance can be read from a document. Motivation, expectations and risk decide whether the hire actually happens — and they are where processes fail."
          />

          <ul className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 xl:grid-cols-5">
            {dimensions.map((d, i) => (
              <li key={d.index} className="bg-surface">
                <Reveal delay={i * 60} className="h-full">
                  <article className="flex h-full flex-col p-6">
                    <div className="flex items-center justify-between gap-2">
                      <span className="tnum label text-primary">{d.index}</span>
                      <Badge tone={d.onCv ? 'neutral' : 'accent'}>{d.onCv ? 'On CV' : 'Off CV'}</Badge>
                    </div>
                    <h3 className="mt-6 text-h3 text-foreground">{d.name}</h3>
                    <p className="mt-3 text-[0.9375rem] font-medium text-foreground">{d.question}</p>
                    <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-muted">{d.detail}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Eight touchpoints ── */}
      <Section tone="background" id="journey">
        <Container width="wide">
          <SectionHeading
            eyebrow="Candidate journey"
            title="Eight touchpoints. Zero silent gaps."
            lede="Every one of these is a person, not an automated status email — and it is the same person each time."
          />

          <ol className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-4">
            {touchpoints.map((t, i) => (
              <li key={t.marker}>
                <Reveal delay={(i % 4) * 70}>
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span aria-hidden="true" className="h-px flex-1 bg-border" />
                  </div>
                  <p className="label mt-5 text-primary">{t.marker}</p>
                  <h3 className="mt-2 text-[1.0625rem] font-medium text-foreground">{t.title}</h3>
                  <p className="mt-2.5 text-[0.875rem] leading-relaxed text-muted">{t.intervention}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── Preparation ── */}
      <Section tone="surface-2" id="preparation">
        <Container width="wide">
          <SectionHeading
            eyebrow="Preparation"
            title="Preparation changes with seniority."
            lede="What works for a mid-level candidate actively harms a senior one. Briefing is rebuilt per level, per role and per round."
          />

          <div className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-4 lg:grid-cols-3">
            {preparationTiers.map((t, i) => (
              <Reveal key={t.level} delay={i * 70} className="h-full">
                <article
                  className={cx(
                    'flex h-full flex-col rounded-lg border p-6 lg:p-7',
                    i === 2 ? 'border-foreground/12 bg-foreground text-white' : 'border-border bg-surface',
                  )}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className={cx('text-h3', i === 2 ? 'text-white' : 'text-foreground')}>{t.level}</h3>
                    <span className={cx('label tnum', i === 2 ? 'text-white/50' : 'text-muted')}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className={cx('mt-2 text-[0.9375rem]', i === 2 ? 'text-white/70' : 'text-muted')}>
                    {t.frame}
                  </p>
                  <ul className="mt-7 flex-1 space-y-2.5">
                    {t.focus.map((f) => (
                      <li
                        key={f}
                        className={cx(
                          'flex items-center gap-2.5 text-[0.9375rem]',
                          i === 2 ? 'text-white/90' : 'text-foreground',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cx('h-1 w-1 shrink-0 rounded-full', i === 2 ? 'bg-primary-light' : 'bg-primary')}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className={cx('mt-7 text-[0.8125rem] leading-relaxed', i === 2 ? 'text-white/55' : 'text-muted')}>
                    {t.note}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── The record ── */}
      <Section tone="background" id="record">
        <Container width="wide">
          <SectionHeading
            eyebrow="The record"
            title="What the model has produced."
            lede="Every figure is counted at joining. Submissions, shortlists and interviews are activity — they are not a result."
          />
          <dl className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 xl:grid-cols-7">
            {deliveryMetrics.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <Stat {...m} size="sm" />
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
