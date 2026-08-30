import { aboutBrief } from '@/data/narrative'
import { ButtonLink, Container, Eyebrow, Reveal, Section } from '@/components/primitives'

export function AboutBrief() {
  return (
    <Section tone="surface-2" id="about">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>{aboutBrief.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 max-w-[18ch] text-h2 text-foreground">{aboutBrief.headline}</h2>
            </Reveal>
          </div>

          <div>
            {aboutBrief.body.map((para, i) => (
              <Reveal key={para.slice(0, 24)} delay={80 + i * 70}>
                <p className={'max-w-[62ch] text-lede text-muted' + (i > 0 ? ' mt-5' : '')}>{para}</p>
              </Reveal>
            ))}
            <Reveal delay={220}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/about" variant="secondary" arrow>
                  About the firm
                </ButtonLink>
                <ButtonLink to="/for-talent" variant="ghost" arrow>
                  For candidates
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
