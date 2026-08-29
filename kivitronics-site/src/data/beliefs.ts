export type Belief = {
  index: string
  title: string
  points: string[]
}

export const beliefs: Belief[] = [
  {
    index: '01',
    title: 'Right talent',
    points: ['Better-matched', 'Market-mapped', 'Curated, not bulk'],
  },
  {
    index: '02',
    title: 'Right fit',
    points: ['Capability', 'Motivation', 'Expectations'],
  },
  {
    index: '03',
    title: 'Right journey',
    points: ['Preparation', 'Communication', 'Continuity'],
  },
  {
    index: '04',
    title: 'Right outcome',
    points: ['Offer accepted', 'Notice survived', 'Candidate joined'],
  },
]

export const beliefClosing = {
  line1: 'A mandate is not delivered at submission.',
  line2: 'It is delivered on day one.',
}
