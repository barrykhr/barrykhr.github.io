import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'
import { engagement, mandates } from '@/data/practice'
import { QualificationModel } from '@/sections/QualificationModel'
import { ProblemFunnel } from '@/sections/ProblemFunnel'
import { FinalCta } from '@/sections/FinalCta'

export function WhatWeDo() {
  return (
    <>
      <Seo
        title="What we do — KiVitronics Consulting"
        description="Technology, non-technology, niche and leadership hiring, qualified across five dimensions and owned through to joining. Standard mandates close in 20–30 days."
        path="/what-we-do"
      />
      <PageHero
        eyebrow="What we do"
        title={
          <>
            We take mandates we can
            <span className="text-ivory/45"> actually close.</span>
          </>
        }
        lede="We are not a volume supplier. We take a smaller number of briefs, calibrate each one against the real market, and stay accountable for the person starting — across technology, commercial and leadership hiring."
        figures={[
          { value: '136', label: 'Roles closed' },
          { value: '72%', label: 'Mandate closure' },
          { value: '20–30', label: 'Days, standard closure' },
          { value: '~45', label: 'Days, niche hiring' },
        ]}
      />

      <Section tone="paper">
        <Container width="wide">
          <div className="max-w-[42rem]">
            <Reveal>
              <Eyebrow>Mandate types</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-d2 text-ink">
                Four kinds of brief,
                <span className="text-ink/50"> one standard of delivery.</span>
              </h2>
            </Reveal>
          </div>

          <ol className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-px border border-ink/12 bg-ink/12 lg:grid-cols-2">
            {mandates.map((mandate, i) => (
              <li key={mandate.index} className="bg-paper">
                <Reveal delay={(i % 2) * 70}>
                  <article className="flex h-full flex-col p-[clamp(1.75rem,1.25rem+2vw,3rem)]">
                    <span className="tnum text-[0.6875rem] font-semibold tracking-[0.1em] text-gold-600">
                      {mandate.index}
                    </span>
                    <h3 className="mt-8 text-d4 text-ink">{mandate.title}</h3>
                    <p className="mt-5 max-w-[46ch] flex-1 text-[1.0625rem] leading-relaxed text-ink/65">
                      {mandate.body}
                    </p>
                    <ul className="mt-8 flex flex-wrap gap-2">
                      {mandate.markers.map((marker) => (
                        <li
                          key={marker}
                          className="border border-ink/15 px-3 py-1.5 text-[0.75rem] text-ink/62"
                        >
                          {marker}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <ProblemFunnel />

      <Section tone="paper">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <Reveal>
                <Eyebrow>Engagement</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-5 max-w-[16ch] text-d2 text-ink">{engagement.headline}</h2>
              </Reveal>
            </div>
            <ol className="border-t border-ink/12">
              {engagement.points.map((point, i) => (
                <li key={point.title} className="border-b border-ink/12">
                  <Reveal delay={i * 60}>
                    <div className="flex gap-6 py-7">
                      <span className="tnum shrink-0 text-[0.6875rem] font-semibold tracking-[0.1em] text-gold-600">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                          {point.title}
                        </h3>
                        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink/60">
                          {point.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <QualificationModel />
      <FinalCta />
    </>
  )
}
