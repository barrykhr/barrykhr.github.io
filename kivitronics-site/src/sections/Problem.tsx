import { problem } from '@/data/narrative'
import { Container, Reveal, Section, SectionHeading } from '@/components/primitives'

export function Problem() {
  return (
    <Section tone="background" id="problem">
      <Container width="wide">
        <SectionHeading eyebrow={problem.eyebrow} title={problem.headline} lede={problem.lede} />

        <ol className="mt-[clamp(3rem,2rem+2.5vw,4.5rem)] grid gap-6 md:grid-cols-3">
          {problem.points.map((p, i) => (
            <li key={p.index}>
              <Reveal delay={i * 80} className="h-full">
                <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-6 shadow-xs lg:p-7">
                  <span className="label tnum text-primary">{p.index}</span>
                  <h3 className="mt-6 text-h3 text-foreground">{p.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{p.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
