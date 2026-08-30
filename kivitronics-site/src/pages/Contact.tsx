import { Seo } from '@/components/Seo'
import { Container, Reveal, Section } from '@/components/primitives'
import { ContactForm } from '@/components/ContactForm'
import { contact } from '@/data/site'
import { steps } from '@/data/narrative'

export function Contact() {
  return (
    <>
      <Seo
        title="Talk to our team — KiVitronics"
        description="Tell us the role and what has made it difficult. A delivery lead replies directly."
        path="/contact"
      />

      <Section
        tone="background"
        spacing="none"
        className="border-b border-border pt-[7rem] pb-section lg:pt-[9.5rem]"
      >
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
        <Container width="wide" className="relative">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
            <div>
              <Reveal>
                <p className="label flex items-center gap-2.5 text-primary">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                  Talk to our team
                </p>
              </Reveal>
              <Reveal delay={70}>
                <h1 className="mt-7 max-w-[15ch] text-h1 text-foreground">
                  Let’s build your next great team.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-[48ch] text-lede text-muted">
                  Tell us the role and what has made it difficult so far. We will tell you honestly
                  whether we are the right people to close it.
                </p>
              </Reveal>

              <Reveal delay={170}>
                <div className="mt-12 border-t border-border pt-8">
                  <p className="label text-muted">What happens next</p>
                  <ol className="mt-6 space-y-4">
                    {[
                      'A delivery lead reads your requirement and replies directly.',
                      'We calibrate the role and say honestly whether we can close it.',
                      'If we take it, that same person owns it through to joining.',
                    ].map((s, i) => (
                      <li key={s} className="flex gap-4 text-[0.9375rem] text-muted-strong">
                        <span className="tnum label shrink-0 pt-0.5 text-primary">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  {contact.location && (
                    <p className="mt-8 text-[0.8125rem] text-muted">
                      {contact.location} · Serving {contact.markets.join(' and ')}
                    </p>
                  )}
                </div>
              </Reveal>
            </div>

            <Reveal delay={110}>
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-8">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="tight">
        <Container width="wide">
          <p className="label text-muted">What you are engaging</p>
          <ol className="mt-7 grid grid-cols-2 gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.index}>
                <Reveal>
                  <p className="tnum label text-primary">{s.index}</p>
                  <p className="mt-2.5 text-[1rem] font-medium text-foreground">{s.title}</p>
                  <p className="mt-1.5 text-[0.8125rem] text-muted">{s.marker}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  )
}
