import { brand } from '@/data/content'
import { Container, Eyebrow, Reveal } from '@/components/primitives'
import { CtaGroup } from '@/components/Cta'
import { HiringStory } from '@/components/viz/HiringStory'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0" />

      <Container width="wide" className="relative pt-[6.5rem] pb-[clamp(3rem,2rem+4vw,5rem)] lg:pt-[8.5rem]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          <div>
            <Reveal>
              <Eyebrow>{brand.fullName}</Eyebrow>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="mt-7 max-w-[16ch] text-display text-foreground">{brand.tagline}</h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="mt-7 max-w-[54ch] text-lede text-muted">{brand.description}</p>
            </Reveal>

            <Reveal delay={190}>
              <CtaGroup className="mt-9" />
            </Reveal>
          </div>

          <Reveal delay={200}>
            <HiringStory />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
