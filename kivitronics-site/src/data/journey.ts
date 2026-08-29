/**
 * Section 09 — protecting the candidate journey.
 * Eight touchpoints between first conversation and day one.
 */

export type Touchpoint = {
  marker: string
  title: string
  intervention: string
}

export const touchpoints: Touchpoint[] = [
  {
    marker: 'Day 0',
    title: 'First conversation',
    intervention:
      'Motivation, expectations and risk are established in person — before a single profile is sent.',
  },
  {
    marker: 'Preparation',
    title: 'Interview briefing',
    intervention:
      'The candidate is briefed on the panel, the format and the bar for this specific round.',
  },
  {
    marker: 'Round 1',
    title: 'Interview',
    intervention:
      'We stay reachable on the day and confirm the interview actually happened.',
  },
  {
    marker: 'Between rounds',
    title: 'Debrief and feedback',
    intervention:
      'Feedback moves in both directions within the day. Silence is where candidates disengage.',
  },
  {
    marker: 'Round 2',
    title: 'Customised preparation',
    intervention:
      'Preparation is rebuilt around what round one revealed — not repeated from a template.',
  },
  {
    marker: 'Offer',
    title: 'Motivation and risk check',
    intervention:
      'Counter-offer exposure and competing processes are tested before the number is issued.',
  },
  {
    marker: 'Notice period',
    title: 'Continuous engagement',
    intervention:
      'Scheduled contact through the highest-risk window in the entire process.',
  },
  {
    marker: 'Day 1',
    title: 'Joining',
    intervention:
      'Joining is confirmed. Only then is the mandate complete.',
  },
]

export const journeyClosing = {
  line1: 'Eight touchpoints.',
  line2: 'Zero silent gaps.',
}

/** Section 10 — one accountable human. */
export const accountability = {
  chain: [
    { role: 'KiVitronics delivery lead', note: 'One named owner for the mandate' },
    { role: 'Hiring manager', note: 'Direct line — no account-management layer' },
    { role: 'Candidate', note: 'Same person, first call to last' },
    { role: 'The hire', note: 'Measured at joining' },
  ],
  interventions: [
    {
      when: 'Before interview',
      what: 'Panel, format and bar briefed to the candidate.',
    },
    { when: 'Between rounds', what: 'Two-way feedback inside the day.' },
    { when: 'Before offer', what: 'Expectations and counter-offer risk tested.' },
    { when: 'Before joining', what: 'Notice period actively held, joining confirmed.' },
  ],
  closing: [
    'No handoffs.',
    'No “the account manager will get back to you.”',
    'One name, start to finish.',
  ],
}

/** Section 12 — conversion to joining. */
export const conversionFunnel = [
  { label: 'Mandate', width: 1 },
  { label: 'Qualified candidate', width: 0.78 },
  { label: 'Interview', width: 0.58 },
  { label: 'Offer', width: 0.36 },
  { label: 'Joining', width: 0.33 },
]

export const riskShield = [
  'Expectation alignment',
  'Counter-offer discussion',
  'Notice-period engagement',
  'Joining confirmation',
]

export const conversionClosing = {
  line1: 'Most funnels are measured to the offer.',
  line2: 'Ours is measured to the desk.',
}
