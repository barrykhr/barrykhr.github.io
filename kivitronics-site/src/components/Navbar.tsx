import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'
import { brand, nav } from '@/data/content'
import { useScrolled, useScrollLock, useEscape } from '@/lib/hooks'
import { useActiveSection } from '@/lib/useActiveSection'
import { Logo } from '@/components/Logo'
import { ArrowRight } from '@/components/primitives'

const sectionIds = nav.map((n) => n.href.slice(1))

export function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(8)
  const active = useActiveSection(sectionIds)

  useScrollLock(open)
  useEscape(() => setOpen(false), open)

  // Close the drawer once a link has taken us somewhere.
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [open])

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
          scrolled || open
            ? 'border-b border-border bg-background/85 backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-gutter">
          <a href="#top" aria-label={`${brand.fullName} — top of page`} className="shrink-0">
            <Logo />
          </a>

          <nav aria-label="Primary" className="ml-8 hidden flex-1 lg:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1)
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? 'true' : undefined}
                      className={cx(
                        'relative flex h-9 items-center rounded-sm px-3 text-[0.875rem] font-medium transition-colors duration-[var(--duration-fast)]',
                        isActive ? 'text-foreground' : 'text-muted-strong hover:bg-surface-2 hover:text-foreground',
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute inset-x-3 bottom-1 h-px origin-left bg-primary transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)]',
                          isActive ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto hidden shrink-0 lg:block">
            <a
              href="#contact"
              className="group inline-flex h-9 items-center gap-2 rounded-sm bg-primary px-5 text-[0.8125rem] font-medium text-white shadow-xs transition-colors duration-[var(--duration-fast)] hover:bg-primary-hover"
            >
              Get in touch
              <ArrowRight />
            </a>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <a
              href="#contact"
              className="inline-flex h-9 items-center rounded-sm bg-primary px-4 text-[0.8125rem] font-medium text-white max-[400px]:hidden"
            >
              Get in touch
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-foreground"
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 7h14M3 13h14" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-background lg:hidden"
      >
        <nav aria-label="Primary mobile" className="px-gutter py-6">
          <ul className="divide-y divide-border border-y border-border">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 text-[1.125rem] font-medium text-foreground"
                >
                  {item.label}
                  <ArrowRight />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
