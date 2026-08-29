/**
 * What we do — framed as mandate types and the accountability that comes with
 * them, not as a service menu. Anchored to the published closure timelines.
 */

export type Mandate = {
  index: string
  title: string
  body: string
  markers: string[]
}

export const mandates: Mandate[] = [
  {
    index: '01',
    title: 'Technology hiring',
    body:
      'Engineering, data, product and platform roles where the difference between adjacent and genuinely relevant experience decides the interview.',
    markers: ['20–30 days standard closure'],
  },
  {
    index: '02',
    title: 'Non-technology hiring',
    body:
      'Commercial, finance, operations and corporate functions, qualified against the same five dimensions and owned to the same joining standard.',
    markers: ['20–30 days standard closure'],
  },
  {
    index: '03',
    title: 'Niche and scarce-skill mandates',
    body:
      'Narrow markets where the pool is small enough to map by name. Mapping tells us whether the brief is achievable before anyone spends a month finding out.',
    markers: ['~45 days typical closure'],
  },
  {
    index: '04',
    title: 'Senior and leadership hiring',
    body:
      'Roles where motivation, expectations and counter-offer exposure carry more risk than capability — and where preparation decides the outcome.',
    markers: ['Customised preparation per round'],
  },
]

export const engagement = {
  headline: 'What you get, on every mandate',
  points: [
    {
      title: 'One named delivery lead',
      body: 'The same person from calibration through to joining. No account-management layer.',
    },
    {
      title: 'A calibrated brief',
      body: 'The role interrogated and market-tested before the search begins.',
    },
    {
      title: 'A curated shortlist',
      body: 'Fewer profiles, each with a written rationale, gaps included.',
    },
    {
      title: 'Candidate continuity',
      body: 'Preparation, debriefs and engagement held across every round and through notice.',
    },
    {
      title: 'Delivery measured to joining',
      body: 'The mandate is complete on day one — not at submission, not at acceptance.',
    },
  ],
}

export const forTalent = {
  headline: ['We represent you properly,', 'or we don’t represent you.'],
  body:
    'Being put forward by KiVitronics means someone has understood what you actually do, why you are moving, and what you need — before your profile goes anywhere.',
  commitments: [
    {
      title: 'Your CV is not sent blind',
      body: 'Nothing goes to a client without a conversation with you first, and your consent.',
    },
    {
      title: 'You are briefed before every round',
      body: 'The panel, the format and the bar — tuned to your level and this specific round.',
    },
    {
      title: 'You hear back',
      body: 'Feedback after every round, in both directions, within the day where we have it.',
    },
    {
      title: 'You are not dropped after the offer',
      body: 'We stay in contact through your notice period, which is when most processes go quiet.',
    },
  ],
}
