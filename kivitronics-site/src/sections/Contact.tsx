import { contact } from '@/data/content'
import { Container, Reveal, Section } from '@/components/primitives'
import { CtaGroup } from '@/components/Cta'
import { ContactForm } from '@/components/ContactForm'

export function Contact() {
  return (
    <Section tone="background" id="contact">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="label text-primary">{contact.eyebrow}</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-7 max-w-[14ch] text-h1 text-foreground">{contact.heading}</h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-6 max-w-[48ch] text-lede text-muted">{contact.body}</p>
            </Reveal>
            <Reveal delay={170}>
              <CtaGroup className="mt-9" onBrief={() => document.getElementById('brief-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />
            </Reveal>
          </div>

          <Reveal delay={110}>
            <div id="brief-form" className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-8">
              <p className="label text-muted">Share a hiring brief</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
