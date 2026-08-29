/**
 * Section 05 — the nine-stage operating model.
 * One owner from requirement through to joining.
 */

export type Stage = {
  index: string
  name: string
  summary: string
  detail: string
}

export const stages: Stage[] = [
  {
    index: '01',
    name: 'Requirement',
    summary: 'Calibrate the role before the search starts.',
    detail:
      'We interrogate the brief: the real capability bar, the trade-offs the business will accept, the profile the panel will actually approve. A mandate that starts vague ends in rejected shortlists.',
  },
  {
    index: '02',
    name: 'Map',
    summary: 'Map the market the role sits in.',
    detail:
      'Where this skill genuinely exists, which companies build it, what it costs today, and how deep the pool really is. Mapping tells us whether the brief is achievable before we spend anyone’s time.',
  },
  {
    index: '03',
    name: 'Source',
    summary: 'Search the mapped market, not a keyword.',
    detail:
      'Sourcing runs against the map — targeted, deliberate and directed at people doing the same work, not adjacent work that reads similarly on a CV.',
  },
  {
    index: '04',
    name: 'Qualify',
    summary: 'Five dimensions, not a CV scan.',
    detail:
      'Capability, relevance, motivation, expectations and risk are assessed before anything reaches you. Three of those five have nothing to do with the CV.',
  },
  {
    index: '05',
    name: 'Submit',
    summary: 'A curated shortlist with a point of view.',
    detail:
      'Fewer profiles, each with a written rationale: why this person, what the gaps are, what the compensation and notice reality is. Volume is not a strategy.',
  },
  {
    index: '06',
    name: 'Prepare',
    summary: 'Brief the candidate for this round.',
    detail:
      'Preparation is customised to the level, the role and the specific interview round — not a generic tips document sent to everyone.',
  },
  {
    index: '07',
    name: 'Engage',
    summary: 'Hold the candidate between rounds.',
    detail:
      'Debriefs both ways after every round. The candidate never sits in silence wondering where the process went, and the panel never waits for feedback.',
  },
  {
    index: '08',
    name: 'Offer',
    summary: 'Align before the number is issued.',
    detail:
      'Expectations, counter-offer exposure and competing processes are tested before an offer goes out — so the offer lands as a confirmation, not an opening bid.',
  },
  {
    index: '09',
    name: 'Join',
    summary: 'Stay engaged through the notice period.',
    detail:
      'The notice period is the highest-risk window in the whole process. We stay in contact through it and confirm joining. The mandate closes on day one, not at acceptance.',
  },
]

export const processClosing = {
  line1: 'Nine stages. One owner.',
  line2: 'No handover between sourcing and joining.',
}
