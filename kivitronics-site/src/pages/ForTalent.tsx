import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { Container, Eyebrow, Reveal, Section } from '@/components/primitives'
import { forTalent } from '@/data/practice'
import { ProtectingJourney } from '@/sections/ProtectingJourney'
import { InterviewPreparation } from '@/sections/InterviewPreparation'
import { FinalCta } from '@/sections/FinalCta'

export function ForTalent() {
  return (
    <>
      <Seo
        title="For talent — KiVitronics Consulting"
        description="Represented properly: no blind CV submissions, briefing before every interview round, feedback in both directions, and contact maintained through your notice period."
        path="/for-talent"
      />
      <PageHero
        eyebrow="For talent"
        title={
          <>
            {forTalent.headline[0]}
            <span className="block text-ivory/45">{forTalent.headline[1]}</span>
          </>
        }
        lede={forTalent.body}
        figures={[
          { value: '8', label: 'Touchpoints, first call to day one' },
          { value: '0', label: 'Blind CV submissions' },
          { value: '91%', label: 'Of offers become joinings' },
          { value: '3', label: 'Preparation tiers by seniority' },
        ]}
      />

      <Section tone="paper">
        <Container width="wide">
          <div className="max-w-[40rem]">
            <Reveal>
              <Eyebrow>What you can expect</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-d2 text-ink">
                Four commitments,
                <span className="text-ink/50"> on every process.</span>
              </h2>
            </Reveal>
          </div>

          <ol className="mt-[clamp(3rem,2rem+3vw,5rem)] grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
            {forTalent.commitments.map((item, i) => (
              <li key={item.title} className="bg-paper">
                <Reveal delay={(i % 2) * 70}>
                  <div className="flex h-full flex-col p-[clamp(1.75rem,1.25rem+1.6vw,2.75rem)]">
                    <span className="tnum text-[0.6875rem] font-semibold tracking-[0.1em] text-gold-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-8 text-d4 text-ink">{item.title}</h3>
                    <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink/68">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <ProtectingJourney />
      <InterviewPreparation />
      <FinalCta />
    </>
  )
}
