import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { ButtonLink, Container, Reveal, Section } from '@/components/primitives'
import { ContactForm } from '@/components/ContactForm'

/**
 * No open roles were supplied, so this page does not pretend there are any.
 * It states the position honestly and routes candidates looking for placement
 * to the page that actually serves them.
 */
export function Careers() {
  return (
    <>
      <Seo
        title="Careers — KiVitronics"
        description="Working at KiVitronics, and how to reach us if you are a recruiter or delivery lead."
        path="/careers"
      />
      <PageHero
        eyebrow="Careers"
        title="Work at KiVitronics."
        lede="We hire recruiters who want to own outcomes rather than hit submission targets. There are no open roles listed right now — if that sounds like how you already work, introduce yourself anyway."
        actions={
          <ButtonLink to="/for-talent" variant="secondary" size="lg" arrow>
            Looking for a role elsewhere? Start here
          </ButtonLink>
        }
      />

      <Section tone="background">
        <Container width="prose">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <Reveal>
                <h2 className="text-h2 text-foreground">Introduce yourself</h2>
              </Reveal>
              <Reveal delay={70}>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
                  Tell us what you have closed and how you work. We read everything that arrives here.
                </p>
              </Reveal>
            </div>
            <Reveal delay={110}>
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-7">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
