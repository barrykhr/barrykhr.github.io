/**
 * Brand-level facts and site chrome.
 *
 * VERIFIED FACTS ONLY. Fields we could not verify are `null` and do not render.
 */

export const brand = {
  name: 'KiVitronics',
  fullName: 'KiVitronics Consulting',
  legalName: 'KiVi-Tronics Consulting LLP',
  url: 'https://kivitronicsconsulting.com',
  positioning: 'Talent infrastructure for companies that are scaling.',
  descriptor:
    'A talent partner for IT and non-IT hiring across the US and India — RPO, specialist recruitment and talent matching, owned from requirement to joining.',
} as const

/** Replace with real values before launch; null values simply do not render. */
export const contact = {
  location: 'Chennai, India',
  markets: ['United States', 'India'],
  email: null as string | null,
  phone: null as string | null,
  linkedin: null as string | null,
} as const

export type NavItem = {
  label: string
  href: string
  description?: string
}

export const solutionsNav: NavItem[] = [
  { label: 'Recruitment Process Outsourcing', href: '/solutions/rpo', description: 'Your hiring function, run as a managed service.' },
  { label: 'IT recruitment', href: '/solutions/it-recruitment', description: 'Engineering, data, product and platform roles.' },
  { label: 'Non-IT recruitment', href: '/solutions/non-it-recruitment', description: 'Commercial, finance and operations hiring.' },
  { label: 'Global recruitment', href: '/solutions/global-recruitment', description: 'US and India hiring under one delivery team.' },
  { label: 'Talent matching', href: '/solutions/talent-matching', description: 'Five-dimension qualification before submission.' },
]

export const primaryNav: NavItem[] = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'How we work', href: '/how-we-work' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
]

export const cta = {
  primary: { label: 'Talk to our team', href: '/contact' },
  secondary: { label: 'Explore solutions', href: '/solutions' },
} as const

export const footerNav = [
  {
    heading: 'Solutions',
    links: solutionsNav.map(({ label, href }) => ({ label, href })),
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'How we work', href: '/how-we-work' },
      { label: 'Industries', href: '/industries' },
      { label: 'Insights', href: '/insights' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    heading: 'Get started',
    links: [
      { label: 'Talk to our team', href: '/contact' },
      { label: 'For candidates', href: '/for-talent' },
    ],
  },
]
