/**
 * Single source of truth for brand-level facts and site chrome.
 *
 * VERIFIED-FACTS ONLY. Nothing in this file is invented. Fields we could not
 * verify are `null` and simply do not render — fill them in and they appear.
 */

export const brand = {
  name: 'KiVitronics',
  fullName: 'KiVitronics Consulting',
  legalName: 'KiVi-Tronics Consulting LLP',
  domain: 'kivitronicsconsulting.com',
  url: 'https://kivitronicsconsulting.com',
  promise: ['The right talent.', 'Properly qualified.', 'Personally managed.'],
  principle: 'Recruitment should be measured by outcomes — not activity.',
  descriptor:
    'A specialist recruitment consultancy that owns the hiring outcome from requirement to joining.',
} as const

/**
 * Contact channels. Set to `null` where unverified — the UI skips null values
 * rather than rendering a placeholder. Replace with the real values before launch.
 */
export const contact = {
  location: 'Chennai, India',
  email: null as string | null,
  phone: null as string | null,
  linkedin: null as string | null,
} as const

export const nav = [
  { label: 'What we do', href: '/what-we-do' },
  { label: 'How we work', href: '/how-we-work' },
  { label: 'Proof', href: '/proof' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
] as const

export const audienceNav = [
  { label: 'For employers', href: '/what-we-do' },
  { label: 'For talent', href: '/for-talent' },
] as const

export const cta = {
  primary: { label: 'Start a hiring mandate', href: '/start-a-mandate' },
  secondary: { label: 'Talk to us', href: '/start-a-mandate#talk' },
} as const
