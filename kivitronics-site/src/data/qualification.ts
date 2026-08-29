/**
 * Section 06 — the five-dimension qualification model.
 */

export type Dimension = {
  index: string
  name: string
  question: string
  detail: string
  /** Whether the dimension can be assessed from a CV at all. */
  onCv: boolean
}

export const dimensions: Dimension[] = [
  {
    index: '01',
    name: 'Capability',
    question: 'Can they actually do the work at this level?',
    detail:
      'Not what the title says. What the person has personally built, owned, decided and shipped at the seniority this role demands.',
    onCv: true,
  },
  {
    index: '02',
    name: 'Relevance',
    question: 'Is the experience adjacent, or genuinely the same?',
    detail:
      'Adjacent experience reads well and interviews badly. We separate the two before submission, not after a rejected panel.',
    onCv: true,
  },
  {
    index: '03',
    name: 'Motivation',
    question: 'Why this move, and why now?',
    detail:
      'A candidate without a real reason to move is a candidate who will accept an offer and then not move.',
    onCv: false,
  },
  {
    index: '04',
    name: 'Expectations',
    question: 'Compensation, role, location and notice aligned?',
    detail:
      'Every unspoken expectation becomes a renegotiation at offer stage. We surface them at qualification instead.',
    onCv: false,
  },
  {
    index: '05',
    name: 'Risk',
    question: 'Counter-offer, competing process and drop-off signals?',
    detail:
      'Tenure patterns, employer retention behaviour, live processes elsewhere. Risk is assessed early, then managed all the way to joining.',
    onCv: false,
  },
]

export const cvInsight = {
  headline:
    'Three of the five dimensions have nothing to do with the CV — and they are where hires are lost.',
}

export const comparison = {
  traditional: {
    label: 'Traditional',
    steps: ['JD received', 'CV search', 'CV submission'],
  },
  kivitronics: {
    label: 'KiVitronics',
    steps: [
      'Role',
      'Calibration',
      'Market',
      'Search',
      'Qualification',
      'Curated submission',
    ],
  },
}
