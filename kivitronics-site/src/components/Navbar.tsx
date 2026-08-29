import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cx } from '@/lib/cx'
import { cta, nav } from '@/data/site'
import { useEscape, useScrollLock, useScrolled } from '@/lib/hooks'
import { Logo } from '@/components/Logo'
import { ButtonLink } from '@/components/primitives'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(8)
  // Every route opens on a dark hero, so the header starts inverted and only
  // switches to light chrome once the page has scrolled past it.
  const light = scrolled || open
  const location = useLocation()
  const panelId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  useScrollLock(open)
  useEscape(() => setOpen(false), open)

  // Close the drawer on navigation and return focus to the toggle.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:bg-ink focus:px-4 focus:py-2.5 focus:text-[0.8125rem] focus:text-ivory"
      >
        Skip to content
      </a>

      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          open
            ? 'border-b border-ink/10 bg-paper'
            : light
              ? 'border-b border-ink/10 bg-paper/88 backdrop-blur-xl'
              : 'on-ink border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1560px] items-center justify-between gap-6 px-gutter md:h-[4.5rem]">
          <Link to="/" aria-label="KiVitronics Consulting — home" className="shrink-0">
            <Logo tone={light ? 'ink' : 'ivory'} />
          </Link>

          {/* Desktop: navigation centred */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cx(
                        'relative px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-200',
                        light
                          ? isActive
                            ? 'text-ink'
                            : 'text-ink/62 hover:text-ink'
                          : isActive
                            ? 'text-ivory'
                            : 'text-ivory/60 hover:text-ivory',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={cx(
                            'absolute inset-x-4 bottom-0.5 h-px origin-left bg-gold transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                            isActive ? 'scale-x-100' : 'scale-x-0',
                          )}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop: actions right */}
          <div className="hidden shrink-0 items-center gap-5 lg:flex">
            <Link
              to="/for-talent"
              className={cx(
                'text-[0.8125rem] font-medium transition-colors',
                light ? 'text-ink/62 hover:text-ink' : 'text-ivory/60 hover:text-ivory',
              )}
            >
              For talent
            </Link>
            <ButtonLink
              to={cta.primary.href}
              variant={light ? 'primary' : 'gold'}
              className="px-5 py-3 text-[0.75rem]"
            >
              {cta.primary.label}
            </ButtonLink>
          </div>

          {/* Mobile: CTA + menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <ButtonLink
              to={cta.primary.href}
              arrow={false}
              variant={light ? 'primary' : 'gold'}
              className="px-4 py-2.5 text-[0.75rem] max-[420px]:hidden"
            >
              Start a mandate
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className={cx(
                'flex h-11 w-11 items-center justify-center border transition-colors',
                light ? 'border-ink/15 text-ink' : 'border-ivory/25 text-ivory',
              )}
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                {open ? (
                  <path d="M4 4l12 12M16 4L4 16" strokeLinecap="square" />
                ) : (
                  <path d="M2 6h16M2 14h16" strokeLinecap="square" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-ink/10 bg-paper lg:hidden"
      >
        <nav aria-label="Primary mobile" className="px-gutter pt-4 pb-10">
          <ul className="divide-y divide-ink/10">
            {nav.map((item, i) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cx(
                      'flex items-baseline gap-4 py-5 font-display text-[1.75rem] tracking-[-0.03em] transition-colors',
                      isActive ? 'text-ink' : 'text-ink/70',
                    )
                  }
                >
                  <span className="eyebrow tnum text-gold-600">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/for-talent"
                className="flex items-baseline gap-4 py-5 font-display text-[1.75rem] tracking-[-0.03em] text-ink/70"
              >
                <span className="eyebrow tnum text-gold-600">06</span>
                For talent
              </NavLink>
            </li>
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink to={cta.primary.href} className="w-full">
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink to={cta.secondary.href} variant="ghost" arrow={false} className="w-full">
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </>
  )
}
