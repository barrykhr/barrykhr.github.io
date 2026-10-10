/**
 * ── FAQ CONTENT ──────────────────────────────────────────────────────────────
 * Rewritten against the supplied site copy and nothing else. Every earlier
 * answer was removed: they relied on delivery figures, a nine-stage model, five
 * qualification dimensions and named service lines, none of which the new copy
 * contains.
 *
 * `needsConfirmation` marks an answer the supplied copy cannot support. Those
 * answers state no figure, timeline, fee, guarantee or commitment — they say
 * only what is knowable and offer to answer directly. Confirm each with the
 * business, rewrite it, then delete the flag.
 *
 * NOTE ON THE CANDIDATES TAB: the supplied copy is entirely client-facing. It
 * says nothing about how candidates apply, how their data is handled, what
 * support they receive, or whether they are ever charged. Eight of its ten
 * answers are therefore flagged. This tab needs candidate-side copy before it
 * should go live.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Faq = {
  q: string
  a: string
  /** True when the supplied copy cannot support this answer. */
  needsConfirmation?: boolean
}

export type FaqCategory = {
  id: 'clients' | 'candidates'
  label: string
  cta: { prompt: string; label: string }
  items: Faq[]
}

export const faqCategories: FaqCategory[] = [
  {
    id: 'clients',
    label: 'Clients',
    cta: { prompt: 'Have a role you’re looking to fill?', label: 'Book a discovery call' },
    items: [
      {
        q: 'What types of roles and hiring requirements does Kivitronics Consulting support?',
        a: 'We provide permanent recruitment across career levels — junior, mid-level, senior and executive — including engineering, product, sales and customer success roles. We also handle executive and leadership hiring for director, VP and other roles above senior manager, for companies of every size around the world.',
      },
      {
        q: 'How does Kivitronics Consulting source and screen candidates?',
        a: 'We use AI to support initial screening, followed by human review. That review is shaped by the role itself, by your company, and by the wider context behind the hiring need — rather than by the job description alone.',
      },
      {
        q: 'How quickly can you provide qualified candidates?',
        a: 'Timelines depend on the role, the level and how specific the requirement is. Combining AI-assisted screening with human review is how we work toward a quick turnaround. We will give you a realistic timeline for your particular search rather than a standard one.',
        needsConfirmation: true,
      },
      {
        q: 'What information do you need from us to start a search?',
        a: 'The position itself, context on your business, and what sits behind the hiring need. We will also ask what success should look like for the person in their first 90 days, and what success means for the organization. That context shapes how we approach the search.',
      },
      {
        q: 'How does your recruitment fee structure work?',
        a: 'Fees depend on the engagement and are confirmed with you before any search begins. Tell us what you are hiring for and we will set out the terms up front, before any work starts.',
        needsConfirmation: true,
      },
      {
        q: 'What happens if a candidate doesn’t work out after joining?',
        a: 'Terms covering this are agreed as part of the engagement and confirmed in writing before a search begins. Raise it on the discovery call and we will walk you through how it would work for your search.',
        needsConfirmation: true,
      },
      {
        q: 'Can you support ongoing hiring or several roles at once?',
        a: 'Hiring needs vary from one company to another, and we work with companies at every stage of growth. Tell us the shape of what you need — a single search, several roles together, or hiring that runs continuously — and we will talk through how we would approach it.',
      },
      {
        q: 'Can you handle confidential or hard-to-fill positions?',
        a: 'Share the constraints when you send the brief, including anything that needs to stay confidential. We will tell you honestly how we would approach the search and whether we are the right people for it.',
        needsConfirmation: true,
      },
      {
        q: 'How do you ensure candidates are a good fit beyond their resume?',
        a: 'We look beyond the job description. Human review considers the team’s needs, how the role contributes to the organization, and what success should look like in the first 90 days. That context is what the fit judgement is built on, rather than a keyword match.',
      },
      {
        q: 'How do we get started with Kivitronics Consulting?',
        a: 'Book a discovery call, share a hiring brief, or email us. All three start the same conversation — about the role you are looking to fill, your business, and the context behind the hire.',
      },
    ],
  },
  {
    id: 'candidates',
    label: 'Candidates',
    cta: { prompt: 'Exploring your next opportunity?', label: 'Email us' },
    items: [
      {
        q: 'Does Kivitronics Consulting charge candidates any fees?',
        a: 'Our work is commissioned by the companies we recruit for. If you have any question about costs before engaging with us, ask us directly and we will answer it plainly.',
        needsConfirmation: true,
      },
      {
        q: 'How do I apply for jobs through Kivitronics Consulting?',
        a: 'Get in touch and tell us the kind of role you are looking for, along with your experience and what you want from your next move. We will come back to you about where that fits.',
        needsConfirmation: true,
      },
      {
        q: 'What happens after I submit my resume?',
        a: 'Your profile goes through an initial screening supported by AI, followed by human review shaped by the role and the company it is for. A person makes the judgement about fit, not an automated score.',
        needsConfirmation: true,
      },
      {
        q: 'How will I know if a job is a good fit for my experience?',
        a: 'Because we look beyond the job description. We work from what the team actually needs, how the role contributes to the organization, and what success should look like in the first 90 days — so we can tell you specifically why a role does or does not fit.',
      },
      {
        q: 'Will my resume and personal information be kept confidential?',
        a: 'Ask us how your information will be handled before you share it and we will tell you exactly what happens to it and who sees it.',
        needsConfirmation: true,
      },
      {
        q: 'Can I apply for multiple opportunities through Kivitronics Consulting?',
        a: 'Tell us what you are open to and we will talk through which of the roles we are working on are worth pursuing.',
        needsConfirmation: true,
      },
      {
        q: 'What support do you provide during the interview process?',
        a: 'Ask us what support to expect for the specific process you are in and we will set it out before you go into it.',
        needsConfirmation: true,
      },
      {
        q: 'Who will contact me about interview and application updates?',
        a: 'Someone from our team will be your point of contact. Ask who that is when you first speak to us so you know exactly who to come back to.',
        needsConfirmation: true,
      },
      {
        q: 'What happens if I am not selected for a role?',
        a: 'Ask us for feedback and what else we are working on that might suit you better.',
        needsConfirmation: true,
      },
      {
        q: 'Can I submit my resume even if I don’t see a suitable opening?',
        a: 'Yes. Roles open at different times, and it helps to already know who you are and what you are looking for. Send us your details and tell us the kind of role you would consider.',
        needsConfirmation: true,
      },
    ],
  },
]

/** Answers awaiting business sign-off. Surfaced by the pre-launch check. */
export const faqsNeedingConfirmation = faqCategories.flatMap((c) =>
  c.items.filter((i) => i.needsConfirmation).map((i) => ({ category: c.label, question: i.q })),
)
