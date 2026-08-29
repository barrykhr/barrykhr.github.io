import { Link } from 'react-router-dom'
import { brand, contact, nav } from '@/data/site'
import { Logo } from '@/components/Logo'
import { Container } from '@/components/primitives'

const secondary = [
  { label: 'For employers', href: '/what-we-do' },
  { label: 'For talent', href: '/for-talent' },
  { label: 'Start a hiring mandate', href: '/start-a-mandate' },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-ink bg-ink text-ivory">
      <Container width="wide" className="py-[clamp(3.5rem,2.5rem+3vw,6rem)]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <Logo tone="ivory" />
            <p className="mt-7 max-w-[34ch] font-display text-[1.5rem] leading-[1.15] tracking-[-0.025em] text-ivory">
              {brand.promise.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow text-ivory/55">Explore</h2>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-[0.9375rem] text-ivory/70 transition-colors hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-ivory/55">Get in touch</h2>
            <ul className="mt-6 space-y-3">
              {secondary.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-[0.9375rem] text-ivory/70 transition-colors hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[0.9375rem] text-ivory/70 transition-colors hover:text-gold-400"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="text-[0.9375rem] text-ivory/70 transition-colors hover:text-gold-400"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.linkedin && (
                <li>
                  <a
                    href={contact.linkedin}
                    className="text-[0.9375rem] text-ivory/70 transition-colors hover:text-gold-400"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ivory/12 pt-8 text-[0.8125rem] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.legalName}. {contact.location}.
          </p>
          <p className="text-ivory/55">{brand.principle}</p>
        </div>
      </Container>
    </footer>
  )
}
