import { everySize } from '@/data/content'
import { Container, Reveal, Section } from '@/components/primitives'

export function EverySize() {
  return (
    <Section tone="canvas" id="every-size">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="label flex items-center gap-2.5 text-primary-light">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                {everySize.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-7 max-w-[16ch] text-h1 text-canvas-fg">{everySize.heading}</h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-[56ch] text-lede text-canvas-muted lg:mt-4">{everySize.body}</p>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
