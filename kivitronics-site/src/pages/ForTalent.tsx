import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { preparationTiers, touchpoints } from '@/data/process'
import { ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/primitives'
import { FinalCta } from '@/sections/FinalCta'

const commitments = [
  { title: 'Your CV is not sent blind', body: 'Nothing goes to a client without a conversation with you first, and your consent.' },
  { title: 'You are briefed before every round', body: 'The panel, the format and the bar — tuned to your level and this specific round.' },
  { title: 'You hear back', body: 'Feedback after every round, in both directions, within the day where we have it.' },
  { title: 'You are not dropped after the offer', body: 'We stay in contact through your notice period, which is when most processes go quiet.' },
]

export function ForTalent() {
  return (
    <>
      <Seo
        title="For candidates — KiVitronics"
        description="Represented properly: no blind submissions, briefing before every round, feedback both ways, and contact maintained through your notice period."
        path="/for-talent"
      />
      <PageHero
        eyebrow="For candidates"
        title="We represent you properly, or we don’t represent you."
        lede="Being put forward by KiVitronics means someone has understood what you actually do, why you are moving, and what you need — before your profile goes anywhere."
        actions={
          <ButtonLink to="/contact" size="lg" arrow>
            Get in touch
          </ButtonLink>
        }
        figures={[
          { value: '8', label: 'Touchpoints, first call to day one' },
          { value: '0', label: 'Blind submissions' },
          { value: '91%', label: 'Of offers become joinings' },
          { value: '3', label: 'Preparation tiers by seniority' },
        ]}
      />

      <Section tone="background">
        <Container width="wide">
          <SectionHeading eyebrow="Our commitments" title="Four things, on every process." />
          <ol className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-4 md:grid-cols-2">
            {commitments.map((c, i) => (
              <li key={c.title}>
                <Reveal delay={(i % 2) * 70} className="h-full">
                  <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 lg:p-7">
                    <span className="label tnum text-primary">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-6 text-h3 text-foreground">{c.title}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{c.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="surface">
        <Container width="wide">
          <SectionHeading
            eyebrow="The journey"
            title="Eight touchpoints. Zero silent gaps."
            lede="The same consultant at every one of them."
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

      <Section tone="background">
        <Container width="wide">
          <SectionHeading
            eyebrow="Preparation"
            title="Briefed for your level, not from a template."
          />
          <div className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-4 lg:grid-cols-3">
            {preparationTiers.map((t, i) => (
              <Reveal key={t.level} delay={i * 70} className="h-full">
                <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 lg:p-7">
                  <h3 className="text-h3 text-foreground">{t.level}</h3>
                  <p className="mt-2 text-[0.9375rem] text-muted">{t.frame}</p>
                  <ul className="mt-7 flex-1 space-y-2.5">
                    {t.focus.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-[0.9375rem] text-foreground">
                        <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-7 text-[0.8125rem] leading-relaxed text-muted">{t.note}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
