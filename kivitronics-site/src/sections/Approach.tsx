import { approach } from '@/data/content'
import { Container, Reveal, Section } from '@/components/primitives'

export function Approach() {
  return (
    <Section tone="surface" id="approach">
      <Container>
        <Reveal>
          <p className="label text-primary">{approach.eyebrow}</p>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-2">
          {approach.blocks.map((block, i) => (
            <div key={block.id} className="bg-surface">
              <Reveal delay={i * 80} className="h-full">
                <article className="flex h-full flex-col p-[clamp(1.75rem,1.25rem+2vw,3rem)]">
                  <span className="label tnum text-faint">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="mt-6 max-w-[20ch] text-h3 text-foreground">{block.heading}</h2>
                  <p className="mt-5 max-w-[52ch] text-[1rem] leading-relaxed text-muted">
                    {block.body}
                  </p>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
