import { Seo } from '@/components/Seo'
import { ButtonLink, Container, Reveal, Section } from '@/components/primitives'

export function NotFound() {
  return (
    <>
      <Seo
        title="Page not found — KiVitronics Consulting"
        description="The page you were looking for isn’t here."
        path="/404"
      />
      <Section tone="ink" spacing="none" className="pt-[9rem] pb-section lg:pt-[12rem]">
        <Container width="wide" className="relative">
          <Reveal>
            <p className="tnum font-display text-num font-semibold text-gold">404</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-8 max-w-[18ch] text-d2 text-ivory">
              This one didn’t make it through.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-7 max-w-[48ch] text-lede text-ivory/62">
              The page you were looking for isn’t here. Everything else is one click away.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/" variant="gold">
                Back to the homepage
              </ButtonLink>
              <ButtonLink to="/start-a-mandate" variant="ghost-dark">
                Start a hiring mandate
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
