/**
 * Section 14 — editorial structure, ready for content.
 *
 * `articles` is intentionally empty of fabricated content. Each entry is a
 * declared editorial line with a `status`. Publish by adding real entries with
 * status: 'published', a slug and a body.
 */

export type InsightStatus = 'published' | 'coming-soon'

export type Insight = {
  id: string
  category: string
  title: string
  standfirst: string
  status: InsightStatus
  slug?: string
  date?: string
}

export const insightCategories = [
  'Hiring intelligence',
  'Talent market insights',
  'Interview intelligence',
  'Recruitment benchmarks',
  'Leadership hiring',
  'Candidate experience',
]

export const insights: Insight[] = [
  {
    id: 'leakage',
    category: 'Hiring intelligence',
    title: 'Where mandates actually fail',
    standfirst:
      'Sourcing gets the blame. The losses cluster at the handovers between stages.',
    status: 'coming-soon',
  },
  {
    id: 'counter-offer',
    category: 'Candidate experience',
    title: 'The counter-offer is a symptom, not an event',
    standfirst:
      'By the time a counter-offer lands, the decision has usually already been made.',
    status: 'coming-soon',
  },
  {
    id: 'notice-period',
    category: 'Recruitment benchmarks',
    title: 'The notice period is the riskiest stage in hiring',
    standfirst:
      'Thirty to ninety days of silence is where accepted offers quietly die.',
    status: 'coming-soon',
  },
  {
    id: 'seniority',
    category: 'Interview intelligence',
    title: 'Why senior interviews are lost on framing',
    standfirst:
      'Preparation that works at mid-level actively harms senior candidates.',
    status: 'coming-soon',
  },
  {
    id: 'calibration',
    category: 'Leadership hiring',
    title: 'Calibrating a brief before you search',
    standfirst:
      'A role specification is an opening position. Calibration is the real work.',
    status: 'coming-soon',
  },
  {
    id: 'market-map',
    category: 'Talent market insights',
    title: 'What a market map tells you before you start',
    standfirst:
      'Whether the brief is achievable — and what it will cost if it is.',
    status: 'coming-soon',
  },
]
