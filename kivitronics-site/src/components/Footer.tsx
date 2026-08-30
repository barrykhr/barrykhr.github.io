import { Link } from 'react-router-dom'
import { brand, contact, footerNav } from '@/data/site'
import { Logo } from '@/components/Logo'
import { Container } from '@/components/primitives'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-canvas border-t border-canvas-line bg-canvas text-canvas-fg">
      <Container width="wide" className="py-[clamp(3rem,2rem+3vw,4.5rem)]">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2.5fr] lg:gap-20">
          <div>
            <Logo tone="canvas" />
            <p className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed text-canvas-muted">
              {brand.descriptor}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              {contact.markets.map((market) => (
                <span key={market} className="flex items-center gap-2 text-[0.8125rem] text-canvas-muted">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary-light" />
                  {market}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="label text-canvas-faint">{group.heading}</h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-[0.875rem] text-canvas-muted transition-colors duration-[var(--duration-fast)] hover:text-canvas-fg"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-canvas-line pt-7 text-[0.8125rem] text-canvas-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.legalName}
            {contact.location ? ` · ${contact.location}` : ''}
          </p>
          {(contact.email || contact.phone || contact.linkedin) && (
            <p className="flex flex-wrap gap-x-6 gap-y-1">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-canvas-fg">
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-canvas-fg">
                  {contact.phone}
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} rel="noreferrer" className="transition-colors hover:text-canvas-fg">
                  LinkedIn
                </a>
              )}
            </p>
          )}
        </div>
      </Container>
    </footer>
  )
}
