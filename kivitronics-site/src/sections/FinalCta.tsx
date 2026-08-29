import { brand } from '@/data/site'
import { Container, Reveal, Section } from '@/components/primitives'
import { MandateForm } from '@/components/MandateForm'

/** Section 16 — the ask. One sentence, one form, five fields. */
export function FinalCta({ id = 'start' }: { id?: string }) {
  return (
    <Section tone="ink" id={id}>
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container width="wide" className="relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-24">
          <div>
            <Reveal>
              <h2 className="max-w-[16ch] text-d2 text-ivory">
                Give us one mandate.
                <span className="block text-gold">Let the delivery prove the model.</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-8 max-w-[42ch] text-lede text-ivory/62">
                {brand.promise.join(' ')}
              </p>
            </Reveal>
            <Reveal delay={140}>
              <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-ivory/12 pt-8">
                {[
                  { value: '72%', label: 'of mandates closed' },
                  { value: '91%', label: 'offer → joining' },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="sr-only">{item.label}</dt>
                    <dd>
                      <p className="tnum font-display text-[clamp(2rem,1.5rem+1.8vw,3rem)] leading-none font-semibold tracking-[-0.04em] text-ivory">
                        {item.value}
                      </p>
                      <p className="mt-3 text-[0.875rem] text-ivory/50">{item.label}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={100} id="talk">
            <div className="border-t-2 border-gold pt-10">
              <p className="eyebrow text-ivory/55">Talk to us</p>
              <p className="mt-4 mb-10 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ivory/60">
                Tell us the role and what has made it difficult. We will tell you honestly whether
                we are the right people for it.
              </p>
              <MandateForm tone="ivory" />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
