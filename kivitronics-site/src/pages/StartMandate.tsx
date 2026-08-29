import { Seo } from '@/components/Seo'
import { Container, Reveal, Section } from '@/components/primitives'
import { MandateForm } from '@/components/MandateForm'
import { brand, contact } from '@/data/site'
import { stages } from '@/data/process'

export function StartMandate() {
  return (
    <>
      <Seo
        title="Start a hiring mandate — KiVitronics Consulting"
        description="Tell us the role and what has made it difficult. A delivery lead replies directly. Five fields, no qualification maze."
        path="/start-a-mandate"
      />

      <Section tone="ink" spacing="none" className="pt-[7.5rem] pb-section lg:pt-[10.5rem]">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <Container width="wide" className="relative">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-24">
            <div>
              <Reveal>
                <p className="eyebrow flex items-center gap-3 text-gold">
                  <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
                  Start a hiring mandate
                </p>
              </Reveal>
              <Reveal delay={70}>
                <h1 className="mt-7 max-w-[16ch] text-d1 font-semibold text-ivory">
                  Give us one mandate.
                  <span className="block text-gold">Let the delivery prove the model.</span>
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-9 max-w-[46ch] text-lede text-ivory/62">
                  {brand.promise.join(' ')}
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-14 border-t border-ivory/12 pt-8">
                  <p className="eyebrow text-ivory/55">What happens next</p>
                  <ol className="mt-6 space-y-4">
                    {[
                      'A delivery lead reads your requirement and comes back to you directly.',
                      'We calibrate the role and tell you honestly whether we can close it.',
                      'If we take it, that same person owns it through to joining.',
                    ].map((step, i) => (
                      <li key={step} className="flex gap-4 text-[0.9375rem] text-ivory/65">
                        <span className="tnum shrink-0 text-[0.6875rem] font-semibold tracking-[0.1em] text-gold">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  {contact.location && (
                    <p className="mt-8 text-[0.8125rem] text-ivory/55">{contact.location}</p>
                  )}
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <div className="border-t-2 border-gold pt-10" id="talk">
                <p className="eyebrow text-ivory/55">Talk to us</p>
                <p className="mt-4 mb-10 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ivory/60">
                  Tell us the role and what has made it difficult so far.
                </p>
                <MandateForm tone="ivory" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="paper" spacing="tight">
        <Container width="wide">
          <Reveal>
            <p className="eyebrow text-ink/62">What you are engaging</p>
          </Reveal>
          <ol className="mt-8 grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-5 lg:grid-cols-9">
            {stages.map((stage, i) => (
              <li key={stage.index}>
                <Reveal delay={i * 40}>
                  <p className="tnum text-[0.6875rem] font-semibold tracking-[0.1em] text-gold-600">
                    {stage.index}
                  </p>
                  <p className="mt-2 font-display text-[1rem] font-medium tracking-[-0.015em] text-ink">
                    {stage.name}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  )
}
