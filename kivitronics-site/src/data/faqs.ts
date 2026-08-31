/**
 * ── FAQ CONTENT ──────────────────────────────────────────────────────────────
 * Every answer is written from material that actually exists: the nine-stage
 * delivery model, the five qualification dimensions, the eight candidate
 * touchpoints, the published closure times, the two markets, and the service
 * lines in `solutions.ts`.
 *
 * `needsConfirmation` marks answers that could NOT be written from that
 * material — commercial terms we have no record of. Those answers are worded so
 * they state no figure, model or guarantee; they say the terms are agreed and
 * confirmed in writing. Have the business sign each one off before launch, then
 * delete the flag. The flag is not rendered — it exists so the list can be
 * audited from the codebase.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Faq = {
  q: string
  a: string
  /** True when the answer needs business sign-off before launch. */
  needsConfirmation?: boolean
}

export type FaqCategory = {
  id: 'clients' | 'candidates'
  label: string
  /** Contextual prompt shown under the list. */
  cta: { prompt: string; label: string; href: string }
  items: Faq[]
}

export const faqCategories: FaqCategory[] = [
  {
    id: 'clients',
    label: 'Clients',
    cta: { prompt: 'Have a hiring requirement?', label: 'Talk to our team', href: '/contact' },
    items: [
      {
        q: 'What types of roles and hiring requirements does KiVitronics support?',
        a: 'We recruit across two domains. Technology covers software engineering, data, platform, quality, product and technical leadership. Non-technology covers finance, sales, marketing, operations, HR and corporate functions. Engagements range from a single senior search to a full RPO where we run your hiring function. We operate in the United States and India.',
      },
      {
        q: 'How does KiVitronics source and screen candidates?',
        a: 'Before searching we calibrate the role, then map the market it sits in — where the skill genuinely exists, which companies build it, and what it costs today. Sourcing runs against that map rather than a keyword. Every candidate is then qualified across five dimensions before a profile reaches you.',
      },
      {
        q: 'How quickly can you provide qualified candidates?',
        a: 'Standard technology and non-technology mandates close in 20–30 days, measured from brief to the candidate joining. Niche and scarce-skill roles typically take around 45 days. Shortlists arrive well before closure — but we submit fewer, better-argued profiles rather than sending volume on day one.',
      },
      {
        q: 'What information do you need from us to start a search?',
        a: 'The role, the level, and what has made it difficult so far. From there we run an intake session to calibrate the brief: the real capability bar, the trade-offs the business will accept, and the profile your panel will actually approve. A brief that starts vague is the most common cause of rejected shortlists.',
      },
      {
        q: 'How does your recruitment fee structure work?',
        a: 'Fees are agreed per engagement and confirmed in writing before any search begins. The structure depends on scope — a single search and an ongoing RPO engagement are commercially different. Tell us what you are hiring for and we will set out the terms up front, before any work starts.',
        needsConfirmation: true,
      },
      {
        q: 'What happens if a candidate doesn’t work out after joining?',
        a: 'Replacement terms are agreed as part of the engagement and confirmed in writing before a search begins. What we can point to beforehand is the record: 91% of offers we manage convert to a joining, because expectations, competing processes and counter-offer exposure are tested before an offer is ever issued.',
        needsConfirmation: true,
      },
      {
        q: 'Can KiVitronics support bulk hiring or ongoing recruitment through RPO?',
        a: 'Ongoing recruitment is what our RPO engagements are built for. We take operational ownership of all or part of your hiring — intake, sourcing, qualification, scheduling, offer management and joining — under one delivery team, so quality does not vary by requisition. Volume and scope are agreed per engagement.',
      },
      {
        q: 'Can you handle confidential or hard-to-fill positions?',
        a: 'Hard-to-fill roles are a significant part of what we do: niche and scarce-skill searches typically close in around 45 days, and market mapping tells us early whether a brief is achievable at all rather than after a month of searching. For confidential searches, tell us the constraints when you brief the role.',
      },
      {
        q: 'How do you ensure candidates are a good fit beyond their resume?',
        a: 'A CV can answer two of our five qualification dimensions — capability and relevance. The other three cannot be read from a document: motivation (why this move and why now), expectations (compensation, role, location and notice), and risk (counter-offer exposure and competing processes). Those three are where hires are usually lost.',
      },
      {
        q: 'How do we get started with KiVitronics?',
        a: 'Send the role through the contact form — your name, company, work email and a sentence on what you are hiring for. A delivery lead reads it and replies directly. We calibrate the brief and tell you honestly whether we can close it. If we take it, that same person owns it through to joining.',
      },
    ],
  },
  {
    id: 'candidates',
    label: 'Candidates',
    cta: { prompt: 'Looking for your next opportunity?', label: 'Explore opportunities', href: '/for-talent' },
    items: [
      {
        q: 'Does KiVitronics charge candidates any fees?',
        a: 'Our fees are paid by the companies we recruit for, not by candidates. You are never asked to pay to be represented, to be submitted for a role, or to receive interview preparation.',
        needsConfirmation: true,
      },
      {
        q: 'How do I apply for jobs through KiVitronics?',
        a: 'We work from live client mandates rather than a public job board, so there is no application portal to work through. Send your details through the contact form and tell us the kind of role you are looking for. If it matches something we are running, a consultant will get in touch.',
      },
      {
        q: 'What happens after I submit my resume?',
        a: 'A consultant reviews it against the mandates we are currently running. If there is a match, the first step is a conversation — about what you actually do, why you are considering a move, and what you need from the next role. That happens before your profile goes anywhere.',
      },
      {
        q: 'How will I know if a job is a good fit for my experience?',
        a: 'We qualify on five dimensions and only two of them come off a CV. The conversation covers the rest: whether the work is genuinely the same rather than adjacent, why you are moving now, and whether compensation, role, location and notice actually line up. If it is not a fit, we will say so.',
      },
      {
        q: 'Will my resume and personal information be kept confidential?',
        a: 'Nothing is sent to a client without a conversation with you first and your explicit consent. We do not submit profiles blind, and we do not circulate your CV to build a pipeline. You always know which company your details are going to before they go.',
      },
      {
        q: 'Can I apply for multiple opportunities through KiVitronics?',
        a: 'Yes. If more than one live mandate fits, we will tell you which and let you decide what to pursue. We also keep track of processes you are running elsewhere, because competing timelines affect how a process should be paced.',
      },
      {
        q: 'What support do you provide during the interview process?',
        a: 'You are briefed before every round on the panel, the format and the bar for that specific round. Preparation is built for your level — fundamentals and structure at entry, ownership and impact at mid-level, strategy and executive presence at senior — and rebuilt between rounds based on what the last one revealed.',
      },
      {
        q: 'Who will contact me about interview and application updates?',
        a: 'The same consultant, from the first conversation through to your first day. There is no handover to an account manager and no coordinator picking up half the thread. Debriefs run in both directions after every round, within the day where we have the feedback.',
      },
      {
        q: 'What happens if I am not selected for a role?',
        a: 'You get feedback rather than silence. We tell you what the panel said and why the process ended, and we keep your profile in mind for mandates that fit better. Going quiet on candidates is the single most common failure in recruitment and it is one we deliberately design out.',
      },
      {
        q: 'Can I submit my resume even if I don’t see a suitable opening?',
        a: 'Yes, and it is worth doing. Mandates open continuously, and it helps to already know who you are and what you are looking for before one does. Send your details through the contact form with a line about the kind of roles you would consider.',
      },
    ],
  },
]

/** Answers still awaiting business sign-off. Used by the pre-launch check. */
export const faqsNeedingConfirmation = faqCategories.flatMap((c) =>
  c.items.filter((i) => i.needsConfirmation).map((i) => ({ category: c.label, question: i.q })),
)
