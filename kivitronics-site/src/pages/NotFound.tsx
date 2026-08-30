import { Seo } from '@/components/Seo'
import { ButtonLink, Container, Reveal, Section } from '@/components/primitives'
import { solutionsNav } from '@/data/site'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@/components/primitives'

export function NotFound() {
  return (
    <>
      <Seo title="Page not found — KiVitronics" description="That page isn’t here." path="/404" />
      <Section tone="background" spacing="none" className="pt-[9rem] pb-section lg:pt-[11rem]">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
        <Container width="wide" className="relative">
          <Reveal>
            <p className="label text-primary">Error 404</p>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="mt-6 max-w-[16ch] text-h1 text-foreground">
              This one didn’t make it through.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-[48ch] text-lede text-muted">
              The page you were looking for isn’t here. Everything else is one click away.
            </p>
          </Reveal>
          <Reveal delay={170}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/" size="lg" arrow>
                Back to the homepage
              </ButtonLink>
              <ButtonLink to="/contact" variant="secondary" size="lg">
                Talk to our team
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-16 border-t border-border pt-8">
              <p className="label text-muted">Solutions</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {solutionsNav.map((s) => (
                  <li key={s.href}>
                    <Link
                      to={s.href}
                      className="group flex items-center justify-between gap-4 rounded-md border border-border bg-surface px-4 py-3 text-[0.9375rem] text-foreground transition-[border-color,transform] duration-[var(--duration-base)] hover:-translate-y-0.5 hover:border-border-strong"
                    >
                      {s.label}
                      <ArrowRight />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
