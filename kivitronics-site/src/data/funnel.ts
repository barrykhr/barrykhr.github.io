/**
 * Section 03 — where hiring leaks.
 * Six funnel stages; each handover carries its own failure mode.
 */

export type FunnelStage = {
  id: string
  label: string
  /** Relative width of the funnel band, 0–1. Illustrative of shape, not a metric. */
  width: number
  /** The leak that occurs on the way OUT of this stage. */
  leak?: { name: string; detail: string }
}

export const leakStages: FunnelStage[] = [
  {
    id: 'requirement',
    label: 'Requirement',
    width: 1,
    leak: {
      name: 'Requirement mismatch',
      detail:
        'The brief is taken, not calibrated. Everything downstream inherits the error.',
    },
  },
  {
    id: 'pool',
    label: 'Talent pool',
    width: 0.84,
    leak: {
      name: 'Poor qualification',
      detail:
        'Profiles matched on keywords rather than capability, relevance and intent.',
    },
  },
  {
    id: 'qualified',
    label: 'Qualified',
    width: 0.62,
    leak: {
      name: 'Interview failure',
      detail:
        'Strong candidates go in cold — unbriefed on the panel, the round or the bar.',
    },
  },
  {
    id: 'interview',
    label: 'Interview',
    width: 0.44,
    leak: {
      name: 'Candidate disengagement',
      detail:
        'Silence between rounds. Momentum decays and attention moves elsewhere.',
    },
  },
  {
    id: 'offer',
    label: 'Offer',
    width: 0.28,
    leak: {
      name: 'Offer drop-off & counter-offer',
      detail:
        'Expectations were never truly aligned, so the offer becomes a negotiation lever.',
    },
  },
  {
    id: 'joining',
    label: 'Joining',
    width: 0.19,
    leak: {
      name: 'Notice-period drop-off',
      detail:
        'Thirty to ninety days of no contact — the window where accepted offers quietly die.',
    },
  },
]

export const leakIntro = {
  headline: ['Hiring doesn’t fail at sourcing alone.', 'It leaks at every handover.'],
  body:
    'Every stage of a hire is a handover, and every handover is a place to lose the candidate. Most recruitment is measured where it is easiest to measure — CVs sent. The losses happen further down.',
}
