import { Container, Reveal, Section } from '@/components/primitives'
import { ContactForm } from '@/components/ContactForm'

export function FinalCta({ id = 'contact' }: { id?: string }) {
  return (
    <Section tone="canvas" id={id}>
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
      <Container width="wide" className="relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="label flex items-center gap-2.5 text-primary-light">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                Get started
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-7 max-w-[14ch] text-h1 text-canvas-fg">
                Let’s build your next great team.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-[46ch] text-lede text-canvas-muted">
                Tell us the role and what has made it difficult so far. We will tell you honestly
                whether we are the right people to close it.
              </p>
            </Reveal>
            <Reveal delay={170}>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-canvas-line pt-8">
                {[
                  { v: '136', l: 'Roles closed' },
                  { v: '91%', l: 'Offer to joining' },
                  { v: '60%', l: 'Repeat clients' },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="sr-only">{s.l}</dt>
                    <dd>
                      <p className="tnum text-[1.75rem] leading-none font-medium text-canvas-fg">{s.v}</p>
                      <p className="mt-2.5 text-[0.8125rem] text-canvas-muted">{s.l}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={110}>
            <div className="rounded-xl border border-canvas-line bg-canvas-2 p-6 lg:p-8">
              <ContactForm tone="canvas" />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
