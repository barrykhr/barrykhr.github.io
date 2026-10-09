/**
 * ── SITE COPY ────────────────────────────────────────────────────────────────
 * Every string the site renders. The body text here is the client-supplied copy
 * reproduced verbatim; nothing has been added, embellished or inferred.
 *
 * Rule for this file: if a claim is not in the supplied copy, it does not go on
 * the site. That is why there are no delivery figures, no named service lines
 * and no geographic specifics beyond "around the world".
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const brand = {
  name: 'Kivitronics',
  fullName: 'Kivitronics Consulting',
  /** Registered entity, kept for the footer notice. Not marketing copy. */
  legalName: 'KiVi-Tronics Consulting LLP',
  url: 'https://kivitronicsconsulting.com',
  tagline: 'Global hiring, built around people and context',
  description:
    'Kivitronics Consulting helps companies of every size hire across junior, mid-level, senior, and executive roles. We combine AI-assisted initial screening with human judgment and diverse industry experience to make hiring more focused and responsive.',
} as const

/**
 * ── BEFORE LAUNCH ────────────────────────────────────────────────────────────
 * Each CTA renders as a real button. While its destination is null the button
 * is present but inert and says so when pressed, rather than silently going
 * nowhere or being hidden. Fill these three in and every CTA on the site works.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const contactChannels = {
  /** Scheduling URL — Calendly, Cal.com, Google Appointments, anything. */
  bookingUrl: null as string | null,
  /** Public enquiry address. */
  email: null as string | null,
  /** The in-page brief form posts here. See ContactForm.tsx. */
  briefFormEndpoint: null as string | null,
} as const

export const ctas = {
  book: 'Book a discovery call',
  brief: 'Share a hiring brief',
  email: 'Email us',
} as const

export const nav = [
  { label: 'What we do', href: '#what-we-do' },
  { label: 'Industries', href: '#industries' },
  { label: 'Approach', href: '#approach' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
] as const

/* ── Sections, in page order ───────────────────────────────────────────────── */

export const whatWeDo = {
  eyebrow: 'What we do',
  heading: 'Recruitment for the roles that move your business forward',
  body: 'We provide permanent recruitment across career levels, along with executive and leadership hiring for director, VP, and other roles above senior manager. We work with companies around the world, taking time to understand the position, your business, and the context behind your hiring needs.',
  /** Drawn from the sentence above; no level is claimed that it does not name. */
  levels: ['Junior', 'Mid-level', 'Senior', 'Executive'],
  leadership: ['Director', 'VP', 'Above senior manager'],
}

export const industries = {
  eyebrow: 'Industries',
  heading: 'Experience across industries',
  body: 'Our team brings experience across:',
  list: ['Manufacturing', 'Retail', 'SaaS', 'Deep tech', 'EdTech', 'Software and IT', 'AI'],
}

export const approach = {
  eyebrow: 'Approach',
  blocks: [
    {
      id: 'screening',
      heading: 'AI-assisted screening. Human-led hiring.',
      body: 'We use AI to support initial screening, followed by human review shaped by the role, the company, and the wider hiring context. This approach helps us work toward quick turnaround while keeping people and fit central to the process.',
    },
    {
      id: 'success',
      heading: 'Hiring shaped by what success looks like',
      body: 'We look beyond the job description to understand the team’s needs and how the role contributes to the organization. We also explore what success should look like for the person in their first 90 days, as well as what success means for the organization. That context helps guide how we approach each search.',
    },
  ],
}

export const everySize = {
  eyebrow: 'Who we work with',
  heading: 'A hiring partner for companies of every size',
  body: 'Hiring needs vary from one company to another. Kivitronics Consulting brings a diverse team and a contextual approach to each search, working with companies across industries and at every stage of growth.',
}

export const contact = {
  eyebrow: 'Contact',
  heading: 'Let’s talk about your hiring needs',
  body: 'Tell us about the role you’re looking to fill. We’ll start a conversation about how Kivitronics Consulting can support your hiring.',
}
