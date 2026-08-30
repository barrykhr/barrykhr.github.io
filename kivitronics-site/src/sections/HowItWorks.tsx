import { steps, stepsClosing } from '@/data/narrative'
import { ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/primitives'

/**
 * Four steps on a connected rail. The rail is drawn with a border rather than
 * an SVG so it reflows correctly when the grid collapses on mobile.
 */
export function HowItWorks() {
  return (
    <Section tone="background" id="how-it-works">
      <Container width="wide">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps. One team. Measured at joining."
          lede="The same sequence runs on every mandate, whether it is a single senior hire or a full RPO engagement."
          action={
            <ButtonLink to="/how-we-work" variant="secondary" arrow>
              See the full model
            </ButtonLink>
          }
        />

        <ol className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.index} className="relative">
              <Reveal delay={i * 80}>
                {/* connector rail */}
                <div className="flex items-center gap-3">
                  <span className="tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-line bg-primary-subtle text-[0.75rem] font-medium text-primary">
                    {s.index}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-border" />
                </div>

                <h3 className="mt-6 text-h3 text-foreground">{s.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{s.body}</p>
                <p className="label mt-5 text-faint">{s.marker}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <p className="mt-[clamp(2.5rem,2rem+2vw,3.5rem)] border-t border-border pt-7 text-[1rem] text-muted">
            {stepsClosing}
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
