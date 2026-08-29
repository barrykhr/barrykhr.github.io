/**
 * Section 13 — the intelligence layer.
 *
 * IMPORTANT: everything under `next` and `future` is FORWARD-LOOKING.
 * These are not live capabilities and must never be presented as shipped
 * product. The UI labels this explicitly.
 */

export const technologyHorizons = [
  {
    tag: 'Today',
    status: 'live' as const,
    title: 'What already works',
    items: ['Human judgement', 'Structured process', 'Candidate relationships'],
  },
  {
    tag: 'Next',
    status: 'building' as const,
    title: 'Where we are investing',
    items: [
      'Technology augmentation',
      'Less administrative work',
      'Better pipeline visibility',
      'Earlier risk signals',
    ],
  },
  {
    tag: 'Future',
    status: 'roadmap' as const,
    title: 'What we are building toward',
    items: [
      'An intelligent recruitment operating system',
      'Decision support, not automation',
      'Journey managed end to end',
      'Delivery measured to joining',
    ],
  },
]

/** Roadmap capabilities. NOT live. The UI renders these under a roadmap label. */
export const roadmapCapabilities = [
  {
    name: 'Talent mapping',
    detail: 'Market structure and availability, held as living data rather than a one-off exercise.',
  },
  {
    name: 'Candidate matching',
    detail: 'Decision support across the five qualification dimensions — surfacing, not deciding.',
  },
  {
    name: 'Risk detection',
    detail: 'Earlier signals on counter-offer exposure, disengagement and notice-period drift.',
  },
  {
    name: 'Automated engagement',
    detail: 'Administrative continuity, so consultant time goes to the conversations that matter.',
  },
  {
    name: 'Interview preparation',
    detail: 'Structured briefing assets tuned to level, role and round.',
  },
]

export const technologyStance = {
  headline: ['Human-led today.', 'Increasingly intelligent tomorrow.'],
  body:
    'We are building technology around what already works — not replacing the human judgement that makes recruitment work.',
  disclaimer:
    'The capabilities below are a development roadmap. They are not live product, and nothing on this page is sold as software today.',
}
