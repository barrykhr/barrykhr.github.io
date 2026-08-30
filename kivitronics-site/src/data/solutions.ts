/**
 * The five solutions. Each is supported by the company's actual service lines:
 * RPO, IT and non-IT recruitment, US/India coverage, and talent matching.
 * Nothing here describes a capability that does not exist.
 */

export type Solution = {
  slug: string
  index: string
  name: string
  shortName: string
  summary: string
  /** One line for the mega-menu and bento grid. */
  teaser: string
  outcomes: string[]
  /** Long-form, for the detail page. */
  problem: string
  approach: { title: string; body: string }[]
  bestFor: string[]
  metric?: { display: string; label: string }
}

export const solutions: Solution[] = [
  {
    slug: 'rpo',
    index: '01',
    name: 'Recruitment Process Outsourcing',
    shortName: 'RPO',
    teaser: 'Your hiring function, run as a managed service.',
    summary:
      'We take operational ownership of all or part of your recruitment — intake, sourcing, screening, scheduling, offer management and joining — under one accountable delivery team.',
    outcomes: [
      'A single delivery team, not a rotating panel of vendors',
      'Consistent process across every requisition',
      'Reporting on outcomes, not activity',
    ],
    problem:
      'Hiring inside a scaling company is usually distributed across agencies, an overloaded internal team and a handful of hiring managers improvising. Nobody owns the whole thing, so quality varies by requisition and nobody can say why.',
    approach: [
      { title: 'Intake and calibration', body: 'Every role is interrogated before the search opens: the real capability bar, the trade-offs the business will accept, the profile the panel will approve.' },
      { title: 'Managed delivery', body: 'Sourcing, qualification, scheduling and feedback run on one process with one owner, so quality does not depend on which recruiter picked up the brief.' },
      { title: 'Offer and joining', body: 'Expectations and counter-offer exposure are tested before an offer is issued, and engagement continues through the notice period.' },
      { title: 'Reporting', body: 'You see closure rate, time to close and offer-to-joining conversion — the measures that describe outcomes rather than effort.' },
    ],
    bestFor: ['Companies hiring continuously rather than occasionally', 'Teams without a full internal recruitment function', 'Businesses consolidating multiple agency relationships'],
    metric: { display: '72%', label: 'Mandate closure rate' },
  },
  {
    slug: 'it-recruitment',
    index: '02',
    name: 'IT recruitment',
    shortName: 'IT recruitment',
    teaser: 'Engineering, data, product and platform roles.',
    summary:
      'Technical hiring where the difference between adjacent experience and genuinely relevant experience decides whether the interview succeeds.',
    outcomes: [
      'Shortlists calibrated to your actual stack and seniority bar',
      'Candidates briefed for the specific panel and round',
      'Standard closure in 20–30 days',
    ],
    problem:
      'Technical CVs read similarly and interview very differently. A profile that lists the right technologies often turns out to describe someone adjacent to the work rather than doing it — which is discovered in round two, after everyone has spent the time.',
    approach: [
      { title: 'Market mapping', body: 'Where the skill genuinely exists, which companies build it, what it costs today, and how deep the pool actually is.' },
      { title: 'Technical qualification', body: 'We separate what the person personally built, owned and shipped from what their team delivered around them.' },
      { title: 'Interview preparation', body: 'Preparation is rebuilt per round and per level — what works for a mid-level engineer actively harms a staff-level candidate.' },
    ],
    bestFor: ['Engineering and platform teams', 'Data and analytics functions', 'Product and technical leadership'],
    metric: { display: '20–30', label: 'Days to standard closure' },
  },
  {
    slug: 'non-it-recruitment',
    index: '03',
    name: 'Non-IT recruitment',
    shortName: 'Non-IT recruitment',
    teaser: 'Commercial, finance and operations hiring.',
    summary:
      'Commercial, finance, operations and corporate roles, qualified against the same five dimensions and held to the same joining standard as technical hiring.',
    outcomes: [
      'The same qualification rigour applied outside engineering',
      'Fewer, better-argued profiles per role',
      'One delivery owner across mixed technical and commercial hiring',
    ],
    problem:
      'Non-technical roles are often treated as easier to fill, so they get less rigour — broader briefs, higher volume, weaker qualification. The result is a longer process, not a shorter one.',
    approach: [
      { title: 'Same standard, different market', body: 'Capability, relevance, motivation, expectations and risk are assessed exactly as they are for technical roles.' },
      { title: 'Commercial calibration', body: 'We test the brief against what the market actually pays and what the function actually requires at that level.' },
      { title: 'Continuity to joining', body: 'The same engagement through offer and notice period that technical mandates receive.' },
    ],
    bestFor: ['Finance and accounting', 'Sales, marketing and commercial', 'Operations, supply chain and corporate functions'],
  },
  {
    slug: 'global-recruitment',
    index: '04',
    name: 'Global recruitment',
    shortName: 'Global recruitment',
    teaser: 'US and India hiring under one delivery team.',
    summary:
      'Hiring across the United States and India without handing the work to a different vendor at each border — one team, one process, one point of accountability.',
    outcomes: [
      'US and India roles run on the same process',
      'Time-zone coverage without a handover',
      'Consistent qualification across both markets',
    ],
    problem:
      'Cross-border hiring usually means two vendors, two processes and two standards. The gap between them is where roles stall — and it is nobody’s job to notice.',
    approach: [
      { title: 'One delivery model', body: 'The same nine-stage process applies in both markets, so a shortlist means the same thing wherever the role sits.' },
      { title: 'Market-specific mapping', body: 'Compensation, notice periods and availability are read from the local market, not assumed from the other one.' },
      { title: 'Continuous coverage', body: 'The overlap between time zones is used for interview scheduling and candidate engagement rather than lost to it.' },
    ],
    bestFor: ['US companies building teams in India', 'India-based businesses hiring into the US', 'Distributed teams hiring in both markets'],
  },
  {
    slug: 'talent-matching',
    index: '05',
    name: 'Talent matching',
    shortName: 'Talent matching',
    teaser: 'Five-dimension qualification before submission.',
    summary:
      'A structured qualification model applied before anything reaches you. Three of its five dimensions cannot be assessed from a CV — and those are where hires are lost.',
    outcomes: [
      'A curated shortlist with a written rationale per candidate',
      'Risk and motivation established before the first interview',
      '91% of offers converting to a joining',
    ],
    problem:
      'Most submission decisions are made on two dimensions — capability and relevance — because those are the two a CV can show. Motivation, expectations and risk decide whether the hire actually happens, and they are usually discovered at offer stage.',
    approach: [
      { title: 'Capability and relevance', body: 'Can they do the work at this level, and is the experience genuinely the same rather than adjacent?' },
      { title: 'Motivation and expectations', body: 'Why this move and why now — and are compensation, role, location and notice actually aligned?' },
      { title: 'Risk', body: 'Counter-offer exposure, competing processes and drop-off signals, established early and managed through to joining.' },
    ],
    bestFor: ['Roles that have already failed once', 'Senior hires where drop-off is expensive', 'Teams that receive volume and want judgement'],
    metric: { display: '91%', label: 'Offer-to-joining conversion' },
  },
]

export const solutionBySlug = (slug: string) => solutions.find((s) => s.slug === slug)
