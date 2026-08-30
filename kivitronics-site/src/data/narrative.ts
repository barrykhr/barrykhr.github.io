/** Homepage narrative content: problem, process, pillars, coverage. */

/* ── 03 The problem ───────────────────────────────────────────────────────── */

export const problem = {
  eyebrow: 'The problem',
  headline: 'Scaling a team is harder than finding résumés.',
  lede:
    'Most companies do not have a sourcing problem. They have an execution problem — spread across vendors, inboxes and hiring managers, with nobody accountable for the outcome.',
  points: [
    {
      index: '01',
      title: 'Fragmented hiring',
      body: 'Three agencies, an internal team and a spreadsheet. Every requisition runs differently and quality depends on who picked it up.',
    },
    {
      index: '02',
      title: 'Slow access to qualified talent',
      body: 'Volume arrives quickly; qualified candidates do not. Screening cost moves onto your hiring managers, who are the most expensive people to spend it.',
    },
    {
      index: '03',
      title: 'Inconsistent execution',
      body: 'Candidates go dark between rounds, offers are negotiated rather than confirmed, and accepted offers quietly expire during the notice period.',
    },
  ],
}

/* ── 05 How it works ──────────────────────────────────────────────────────── */

export const steps = [
  {
    index: '01',
    title: 'Understand',
    body: 'We interrogate the brief before the search opens — the real bar, the trade-offs, the profile your panel will actually approve.',
    marker: 'Intake and calibration',
  },
  {
    index: '02',
    title: 'Source',
    body: 'Search runs against a mapped market rather than a keyword, targeting people doing the work rather than adjacent to it.',
    marker: 'Mapped market search',
  },
  {
    index: '03',
    title: 'Evaluate',
    body: 'Five dimensions per candidate: capability, relevance, motivation, expectations and risk. Three of them are invisible on a CV.',
    marker: 'Five-dimension qualification',
  },
  {
    index: '04',
    title: 'Deliver',
    body: 'Preparation, feedback and engagement through every round, the offer, the notice period, and confirmation that the person joined.',
    marker: 'Owned to joining',
  },
]

export const stepsClosing = 'Nine stages sit behind these four. One person owns all of them.'

/* ── 09 Why KiVitronics ───────────────────────────────────────────────────── */

export const pillars = [
  {
    key: 'quality',
    title: 'Quality',
    statement: 'Fewer profiles, each with a written argument.',
    body: 'Submission is a judgement, not a forward. Every candidate arrives with a rationale — including the gaps.',
    metric: { display: '91%', label: 'Offer to joining' },
  },
  {
    key: 'speed',
    title: 'Speed',
    statement: 'Fast because the brief was right, not because the volume was high.',
    body: 'Calibration and market mapping happen before the search, which is why standard mandates close inside a month.',
    metric: { display: '20–30', label: 'Days, standard closure' },
  },
  {
    key: 'precision',
    title: 'Precision',
    statement: 'Five dimensions, assessed before anything reaches you.',
    body: 'Capability and relevance come off the CV. Motivation, expectations and risk come from the conversation — and decide the outcome.',
    metric: { display: '5', label: 'Qualification dimensions' },
  },
  {
    key: 'partnership',
    title: 'Partnership',
    statement: 'The second mandate is the only review that counts.',
    body: 'Sixty percent of our clients came back with more work. That is the number we manage the business against.',
    metric: { display: '60%', label: 'Repeat client rate' },
  },
]

/* ── 08 Coverage ──────────────────────────────────────────────────────────── */

export const coverage = {
  eyebrow: 'Coverage',
  headline: 'IT and non-IT. Both, properly.',
  lede:
    'We run two hiring domains on one process. The role families below are the scope we work across — not a claim to specialise in every one of them equally.',
  domains: [
    {
      key: 'it',
      label: 'Technology',
      href: '/solutions/it-recruitment',
      families: [
        'Software engineering',
        'Data and analytics',
        'Platform and infrastructure',
        'Quality engineering',
        'Product management',
        'Technical leadership',
      ],
    },
    {
      key: 'non-it',
      label: 'Non-technology',
      href: '/solutions/non-it-recruitment',
      families: [
        'Finance and accounting',
        'Sales and business development',
        'Marketing',
        'Operations and supply chain',
        'Human resources',
        'Corporate functions',
      ],
    },
  ],
  note: 'Working in a domain not listed here? Tell us the role — we will say honestly whether we can close it.',
}

/* ── 11 How we create value ───────────────────────────────────────────────── */

export const valueProof = {
  eyebrow: 'How we create value',
  headline: 'We publish process, not case studies.',
  lede:
    'We have not published client case studies, because we have not been cleared to name clients. What we can show is the delivery record and the process that produced it.',
  proofs: [
    {
      title: 'The record is measured at joining',
      body: '136 roles closed, counted on the day the person started — not at submission and not at offer.',
    },
    {
      title: 'Clients come back',
      body: '25 companies served; 15 issued more than one mandate. Our three deepest accounts have produced 65+ hires between them.',
    },
    {
      title: 'The process is inspectable',
      body: 'Nine stages, five qualification dimensions, eight candidate touchpoints. All of it is documented and none of it changes per client.',
    },
  ],
}

/* ── 12 About ─────────────────────────────────────────────────────────────── */

export const aboutBrief = {
  eyebrow: 'About',
  headline: 'A talent partner built around the outcome, not the submission.',
  body: [
    'KiVitronics is a recruitment consultancy working across IT and non-IT hiring in the United States and India. We run RPO engagements, specialist searches and structured talent matching.',
    'The firm exists because hiring is usually measured in the wrong place. Shortlists and interview counts describe effort. We built the delivery model around the only measure a business actually cares about — whether the right person started.',
  ],
}
