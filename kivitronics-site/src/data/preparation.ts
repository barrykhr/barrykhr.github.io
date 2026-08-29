/**
 * Section 11 — interview preparation changes with seniority.
 */

export type PrepTier = {
  level: string
  frame: string
  focus: string[]
  note: string
}

export const preparationTiers: PrepTier[] = [
  {
    level: 'Entry',
    frame: 'Prove the foundation',
    focus: [
      'Fundamentals',
      'Communication',
      'STAR structure',
      'Confidence',
      'Role understanding',
    ],
    note: 'The failure mode here is nerves and structure, not capability.',
  },
  {
    level: 'Mid',
    frame: 'Prove the ownership',
    focus: ['Ownership', 'Problem solving', 'Stakeholders', 'Impact', 'Ambiguity'],
    note: 'The panel is testing what the candidate decided, not what their team delivered.',
  },
  {
    level: 'Senior',
    frame: 'Prove the judgement',
    focus: [
      'Strategy',
      'Leadership',
      'Business impact',
      'Executive presence',
      'Transformation',
    ],
    note: 'Senior interviews are lost on framing and presence far more often than on knowledge.',
  },
]

export const preparationClosing = {
  equation: ['Same process', '≠', 'Same preparation'],
  body:
    'Preparation is customised to the candidate’s level, the role and the specific interview round.',
}
