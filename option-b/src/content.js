/**
 * KiVitronics — Option B
 * Content source of truth.
 *
 * RULES FOR EDITING THIS FILE
 *  - Only verified KiVitronics facts belong here.
 *  - Anything unconfirmed must use `todo('...')` so it renders as a visible
 *    placeholder on the page instead of becoming an invented claim.
 *  - Keep copy short. One idea per section, stated once.
 */

/** Marks copy that is NOT yet verified. Rendered as a visible placeholder. */
export const todo = (label) => ({ __placeholder: true, label });

export const site = {
  name: 'KiVitronics Consulting',
  shortName: 'KiVitronics',
  url: 'https://kivitronicsconsulting.com',
  // Where this build is published for review.
  canonical: 'https://barrykhr.github.io/option-b/',
  title: 'KiVitronics Consulting — Talent, in motion.',
  description:
    'A talent delivery engine. Nine stages from requirement to day one, run by one accountable owner. 136 roles closed. 91% offer-to-joining.',
  ogImage: 'assets/og.png',
  locale: 'en',
  themeColor: '#F4F2EE',
};

export const nav = {
  links: [
    { label: 'Proof', href: '#proof' },
    { label: 'How we work', href: '#how' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Clients', href: '#clients' },
    { label: 'FAQ', href: '#faq' },
  ],
  cta: { label: 'Talk to us', href: '#contact' },
};

export const hero = {
  eyebrow: 'Talent delivery engine',
  // Explored against "Build better teams." and "Better talent. Better outcomes."
  // "Talent, in motion." wins: it names the mechanism, not the category, and it
  // is the only one the page can actually demonstrate rather than assert.
  headline: ['Talent,', 'in motion.'],
  lede: 'Human-led delivery, from requirement to day one.',
  primary: { label: 'Talk to our team', href: '#contact' },
  secondary: { label: 'See how we work', href: '#how' },
  // Labels on the drifting talent tiles. Kept role-generic on purpose:
  // no client names, no invented placements.
  tiles: [
    'Backend', 'Data', 'QA', 'Platform', 'Finance', 'SRE',
    'Product', 'Frontend', 'HR', 'Security', 'Cloud', 'Analyst',
  ],
  slot: { role: 'Open mandate', idle: 'Unfilled', matched: 'Matched' },
  scrollHint: 'Scroll',
};

export const proof = {
  id: 'proof',
  chapter: 'Proof',
  eyebrow: 'Delivery to date',
  headline: ['The numbers', 'behind the work.'],
  metrics: [
    { value: 136, suffix: '', label: 'Roles closed' },
    { value: 72, suffix: '%', label: 'Mandate closure' },
    { value: 91, suffix: '%', label: 'Offer → joining' },
    { value: 60, suffix: '%', label: 'Repeat clients' },
  ],
  footnote: 'Figures reflect delivery to date and are verified internally.',
};

export const problem = {
  id: 'problem',
  chapter: 'The gap',
  headline: 'Hiring doesn’t end at the shortlist.',
  lede: 'The real outcome is getting the right person to day one.',
  // Stages of the industry-standard funnel used by the leak visual.
  // No KiVitronics metrics are attached to this — it illustrates the problem.
  stages: ['Requirement', 'Shortlist', 'Interview', 'Offer', 'Day one'],
  caption: 'Every stage after the shortlist is where hiring quietly leaks.',
};

export const model = {
  id: 'how',
  chapter: 'The model',
  eyebrow: 'How we work',
  headline: ['One journey.', 'One owner.'],
  lede: 'Nine stages, with no handover between sourcing and joining.',
  stages: [
    { n: '01', name: 'Requirement', note: 'Understand the role before the search.' },
    { n: '02', name: 'Map', note: 'Locate where the talent actually sits.' },
    { n: '03', name: 'Source', note: 'Approach it directly.' },
    { n: '04', name: 'Qualify', note: 'Test fit across five dimensions.' },
    { n: '05', name: 'Submit', note: 'Send only what stands up.' },
    { n: '06', name: 'Prepare', note: 'Brief before every interview.' },
    { n: '07', name: 'Engage', note: 'Stay in contact throughout.' },
    { n: '08', name: 'Offer', note: 'Close on what matters to them.' },
    { n: '09', name: 'Join', note: 'Follow through to day one.' },
  ],
};

export const qualification = {
  id: 'qualification',
  chapter: 'Qualification',
  headline: 'The resume is only the beginning.',
  lede: 'Five dimensions decide whether a hire holds.',
  dimensions: [
    { name: 'Capability', question: 'Can they do the work at this level?' },
    { name: 'Relevance', question: 'Is the experience genuinely aligned?' },
    { name: 'Motivation', question: 'Why this move, and why now?' },
    { name: 'Expectations', question: 'Are pay, role, location and notice aligned?' },
    { name: 'Risk', question: 'What could stop them from joining?' },
  ],
};

export const journey = {
  id: 'journey',
  chapter: 'Candidates',
  headline: 'We stay involved until day one.',
  lede: 'Eight touchpoints. Zero silent gaps.',
  steps: ['Prepare', 'Interview', 'Debrief', 'Offer', 'Engage', 'Join'],
};

export const solutions = {
  id: 'solutions',
  chapter: 'Solutions',
  eyebrow: 'What we take on',
  headline: 'Five ways in.',
  items: [
    {
      name: 'Talent acquisition',
      line: 'Matching capability, motivation and expectations to the role — not keywords to a resume.',
      tag: 'Core',
    },
    {
      name: 'RPO',
      line: 'End-to-end recruitment support, run as an extension of your team.',
      tag: 'Embedded',
    },
    {
      name: 'Technology',
      line: 'Specialist technology hiring for teams that need depth, not volume.',
      tag: 'Specialist',
    },
    {
      name: 'Non-IT',
      line: 'Hiring across business and corporate functions.',
      tag: 'Breadth',
    },
    {
      name: 'US & India',
      line: 'Delivery across both markets, on one process.',
      tag: 'Markets',
    },
  ],
};

export const clients = {
  id: 'clients',
  chapter: 'Clients',
  headline: ['The strongest proof', 'isn’t the first mandate.', 'It’s the second.'],
  metrics: [
    { value: 25, suffix: '', label: 'Companies served' },
    { value: 15, suffix: '', label: 'Clients with more than one mandate' },
    { value: 65, suffix: '+', label: 'Hires across our three deepest relationships' },
  ],
  // The mark field renders 25 companies; 15 are marked as repeat clients.
  field: { total: 25, repeat: 15 },
  fieldNote: 'Each mark is a company. The filled ones came back.',
  // Logos are deliberately absent — none are approved for public use yet.
  logosNote: todo('Approved client logos'),
};

export const intelligence = {
  id: 'about',
  chapter: 'Direction',
  headline: ['Human-led today.', 'Increasingly intelligent tomorrow.'],
  lede: 'Technology should remove administration — not human judgement.',
  roadmapLabel: 'Roadmap — not live today',
  roadmap: [
    'Talent mapping',
    'Candidate matching',
    'Risk detection',
    'Engagement',
    'Interview preparation',
  ],
};

export const faq = {
  id: 'faq',
  chapter: 'Questions',
  headline: 'Answered.',
  tabs: [
    {
      id: 'clients',
      label: 'Clients',
      items: [
        {
          q: 'What roles do you support?',
          a: 'Technology and non-IT roles across business and corporate functions, in the US and India.',
        },
        {
          q: 'How do you find candidates?',
          a: 'We map where the talent sits and approach it directly, rather than waiting on applications.',
        },
        {
          q: 'How do you judge fit beyond the resume?',
          a: 'Five dimensions: capability, relevance, motivation, expectations and risk.',
        },
        {
          q: 'What do you need from us to start?',
          a: 'The role, the interview process, and who decides. Mapping starts from there.',
        },
        {
          q: 'How quickly can you send qualified candidates?',
          a: todo('Turnaround commitment — confirm before publishing'),
        },
        {
          q: 'How does your fee structure work?',
          a: todo('Commercial terms — confirm before publishing'),
        },
        {
          q: 'What happens if a hire doesn’t work out after joining?',
          a: todo('Replacement terms — confirm before publishing'),
        },
        {
          q: 'Can you support ongoing hiring through RPO?',
          a: 'Yes. RPO covers end-to-end recruitment across a continuing hiring plan.',
        },
        {
          q: 'Can you handle confidential or hard-to-fill roles?',
          a: 'Yes. Mapping and direct approach are built for roles that don’t respond to advertising.',
        },
        {
          q: 'How do we get started?',
          a: 'Send us a mandate. One consultant owns it from requirement to joining.',
        },
      ],
    },
    {
      id: 'candidates',
      label: 'Candidates',
      items: [
        {
          q: 'Do you charge candidates a fee?',
          a: todo('Candidate fee policy — confirm before publishing'),
        },
        {
          q: 'How do I apply?',
          a: todo('Application route — confirm careers page or inbox'),
        },
        {
          q: 'What happens after I send my resume?',
          a: 'If there is a match, a consultant talks to you about capability, motivation and expectations before anything is submitted.',
        },
        {
          q: 'How will I know whether a role fits?',
          a: 'You get the role, the team, the process and the expectations before you interview.',
        },
        {
          q: 'Is my information kept confidential?',
          a: todo('Data and consent policy — confirm before publishing'),
        },
        {
          q: 'Can I be considered for more than one role?',
          a: 'Yes.',
        },
        {
          q: 'What support do I get during interviews?',
          a: 'A briefing before each interview and a debrief after it.',
        },
        {
          q: 'Who contacts me with updates?',
          a: 'The consultant who qualified you stays with you through to joining.',
        },
        {
          q: 'What if I’m not selected?',
          a: 'We tell you where the process ended.',
        },
        {
          q: 'Can I send my resume without an open role?',
          a: 'Yes.',
        },
      ],
    },
  ],
};

export const contact = {
  id: 'contact',
  chapter: 'Start',
  headline: ['Give us a mandate.', 'Let the delivery prove the model.'],
  lede: 'One role is enough to see how this works.',
  cta: 'Talk to our team',
  // No endpoint is invented here — the form is wired at build time only if
  // `formEndpoint` is set to a verified URL.
  formEndpoint: null,
  fields: [
    { name: 'name', label: 'Name', type: 'text', autocomplete: 'name', required: true },
    { name: 'company', label: 'Company', type: 'text', autocomplete: 'organization', required: true },
    { name: 'email', label: 'Work email', type: 'email', autocomplete: 'email', required: true },
    { name: 'role', label: 'Role you’re hiring for', type: 'text', required: false },
  ],
  message: { name: 'message', label: 'Anything we should know', rows: 3 },
  direct: {
    label: 'Prefer email?',
    value: todo('Verified contact address'),
  },
};

export const footer = {
  tagline: 'Talent, in motion.',
  links: [
    { label: 'Website', href: 'https://kivitronicsconsulting.com', external: true },
  ],
  legal: todo('Registered entity details, privacy policy, terms'),
  note: 'Option B — independent creative direction, for review.',
};

export const chapters = [
  { id: 'top', label: 'Talent' },
  { id: 'proof', label: 'Proof' },
  { id: 'problem', label: 'Gap' },
  { id: 'how', label: 'Model' },
  { id: 'qualification', label: 'Fit' },
  { id: 'journey', label: 'Journey' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'clients', label: 'Clients' },
  { id: 'about', label: 'Direction' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Start' },
];
