import { brand, contactChannels, nav } from '@/data/content'
import { Logo } from '@/components/Logo'
import { Container } from '@/components/primitives'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-canvas border-t border-canvas-line bg-canvas text-canvas-fg">
      <Container width="wide" className="py-[clamp(2.5rem,2rem+2vw,4rem)]">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div>
            <Logo tone="canvas" />
            <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-canvas-muted">
              {brand.tagline}.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="label text-canvas-faint">Explore</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[0.875rem] text-canvas-muted transition-colors duration-[var(--duration-fast)] hover:text-canvas-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-canvas-line pt-7 text-[0.8125rem] text-canvas-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.legalName}
          </p>
          {contactChannels.email && (
            <a href={`mailto:${contactChannels.email}`} className="inline-flex min-h-11 items-center transition-colors hover:text-canvas-fg">
              {contactChannels.email}
            </a>
          )}
        </div>
      </Container>
    </footer>
  )
}
