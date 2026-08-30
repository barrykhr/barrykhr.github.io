import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cx } from '@/lib/cx'
import { cta, primaryNav, solutionsNav } from '@/data/site'
import { useEscape, useScrollLock, useScrolled } from '@/lib/hooks'
import { Logo } from '@/components/Logo'
import { ArrowRight, ButtonLink } from '@/components/primitives'

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cx(
        'h-2.5 w-2.5 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)]',
        open && 'rotate-180',
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const scrolled = useScrolled(8)
  const location = useLocation()
  const megaId = useId()
  const mobileId = useId()
  const closeTimer = useRef<number | undefined>(undefined)
  const megaWrap = useRef<HTMLLIElement>(null)
  // Whether the menu is open because of a hover or because it was clicked open.
  // Without this, hovering then clicking toggles it shut the moment you click.
  const openedBy = useRef<'hover' | 'click' | null>(null)

  useScrollLock(mobileOpen)
  useEscape(
    useCallback(() => {
      openedBy.current = null
      setMegaOpen(false)
      setMobileOpen(false)
    }, []),
    megaOpen || mobileOpen,
  )

  useEffect(() => {
    setMobileOpen(false)
    openedBy.current = null
    setMegaOpen(false)
  }, [location.pathname])

  // Close the mega-menu when focus or a click leaves it entirely.
  useEffect(() => {
    if (!megaOpen) return
    const onDocument = (e: Event) => {
      if (!megaWrap.current?.contains(e.target as Node)) closeMega()
    }
    document.addEventListener('mousedown', onDocument)
    document.addEventListener('focusin', onDocument)
    return () => {
      document.removeEventListener('mousedown', onDocument)
      document.removeEventListener('focusin', onDocument)
    }
  }, [megaOpen])

  const openMega = (source: 'hover' | 'click') => {
    window.clearTimeout(closeTimer.current)
    openedBy.current = source
    setMegaOpen(true)
  }

  const closeMega = () => {
    window.clearTimeout(closeTimer.current)
    openedBy.current = null
    setMegaOpen(false)
  }

  /** Leaving with the pointer only closes a menu the pointer opened. */
  const scheduleClose = () => {
    if (openedBy.current === 'click') return
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(closeMega, 120)
  }

  /** Click pins an open menu rather than toggling it shut. */
  const onTriggerClick = () => {
    if (megaOpen && openedBy.current === 'click') closeMega()
    else openMega('click')
  }

  const isSolutions = location.pathname.startsWith('/solutions')

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2.5 focus:text-[0.8125rem] focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-base)]',
          scrolled || mobileOpen || megaOpen
            ? 'border-b border-border bg-background/85 backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-gutter">
          <Link to="/" aria-label="KiVitronics Consulting — home" className="shrink-0">
            <Logo />
          </Link>

          {/* ── Desktop navigation ── */}
          <nav aria-label="Primary" className="ml-6 hidden flex-1 lg:block">
            <ul className="flex items-center gap-0.5">
              <li ref={megaWrap} className="relative" onMouseEnter={() => openMega('hover')} onMouseLeave={scheduleClose}>
                <button
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls={megaId}
                  onClick={onTriggerClick}
                  className={cx(
                    'flex h-9 items-center gap-1.5 rounded-sm px-3 text-[0.875rem] font-medium transition-colors duration-[var(--duration-fast)]',
                    isSolutions || megaOpen
                      ? 'text-foreground'
                      : 'text-muted-strong hover:bg-surface-2 hover:text-foreground',
                  )}
                >
                  Solutions
                  <Chevron open={megaOpen} />
                </button>

                <div
                  id={megaId}
                  hidden={!megaOpen}
                  className="absolute top-full left-0 pt-2"
                >
                  <div className="w-[34rem] overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
                    <ul className="grid grid-cols-1 gap-0.5 p-2">
                      {solutionsNav.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="group flex items-start gap-3 rounded-md p-3 transition-colors duration-[var(--duration-fast)] hover:bg-surface-2"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5 text-[0.875rem] font-medium text-foreground">
                                {item.label}
                                <ArrowRight className="opacity-0 transition-opacity group-hover:opacity-100" />
                              </span>
                              <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">
                                {item.description}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-border bg-surface-2 px-5 py-3">
                      <p className="text-[0.8125rem] text-muted">
                        Not sure which fits? Describe the role.
                      </p>
                      <Link
                        to={cta.primary.href}
                        className="group inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-primary"
                      >
                        Talk to our team
                        <ArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              {primaryNav.slice(1).map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cx(
                        'flex h-9 items-center rounded-sm px-3 text-[0.875rem] font-medium transition-colors duration-[var(--duration-fast)]',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-strong hover:bg-surface-2 hover:text-foreground',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Desktop actions ── */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            <Link
              to="/for-talent"
              className="flex h-9 items-center rounded-sm px-3 text-[0.875rem] font-medium text-muted-strong transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              For candidates
            </Link>
            <ButtonLink to={cta.primary.href} size="sm" arrow>
              {cta.primary.label}
            </ButtonLink>
          </div>

          {/* ── Mobile ── */}
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <ButtonLink to={cta.primary.href} size="sm" className="max-[400px]:hidden">
              Talk to us
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls={mobileId}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground"
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                {mobileOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 7h14M3 13h14" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        id={mobileId}
        hidden={!mobileOpen}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-background lg:hidden"
      >
        <nav aria-label="Primary mobile" className="px-gutter py-6">
          <p className="label text-muted">Solutions</p>
          <ul className="mt-3 grid gap-1.5">
            {solutionsNav.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3.5 text-[0.9375rem] font-medium text-foreground"
                >
                  {item.label}
                  <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-8 divide-y divide-border border-t border-border">
            {primaryNav.slice(1).map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center justify-between py-4 text-[1.125rem] font-medium',
                      isActive ? 'text-foreground' : 'text-muted-strong',
                    )
                  }
                >
                  {item.label}
                  <ArrowRight />
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/for-talent"
                className="flex items-center justify-between py-4 text-[1.125rem] font-medium text-muted-strong"
              >
                For candidates
                <ArrowRight />
              </NavLink>
            </li>
          </ul>

          <div className="mt-8 grid gap-2.5">
            <ButtonLink to={cta.primary.href} size="lg" arrow className="w-full">
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink to={cta.secondary.href} variant="secondary" size="lg" className="w-full">
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </>
  )
}
