/** The nine-stage delivery model. Detail lives on /how-we-work. */

export type Stage = {
  index: string
  name: string
  summary: string
  detail: string
  phase: 'Understand' | 'Source' | 'Evaluate' | 'Deliver'
}

export const stages: Stage[] = [
  { index: '01', name: 'Requirement', phase: 'Understand', summary: 'Calibrate the role before the search starts.', detail: 'We interrogate the brief: the real capability bar, the trade-offs the business will accept, the profile the panel will actually approve. A mandate that starts vague ends in rejected shortlists.' },
  { index: '02', name: 'Map', phase: 'Understand', summary: 'Map the market the role sits in.', detail: 'Where this skill genuinely exists, which companies build it, what it costs today, and how deep the pool really is. Mapping tells us whether the brief is achievable before we spend anyone’s time.' },
  { index: '03', name: 'Source', phase: 'Source', summary: 'Search the mapped market, not a keyword.', detail: 'Sourcing runs against the map — targeted, deliberate and directed at people doing the same work, not adjacent work that reads similarly on a CV.' },
  { index: '04', name: 'Qualify', phase: 'Evaluate', summary: 'Five dimensions, not a CV scan.', detail: 'Capability, relevance, motivation, expectations and risk are assessed before anything reaches you. Three of those five have nothing to do with the CV.' },
  { index: '05', name: 'Submit', phase: 'Evaluate', summary: 'A curated shortlist with a point of view.', detail: 'Fewer profiles, each with a written rationale: why this person, what the gaps are, what the compensation and notice reality is. Volume is not a strategy.' },
  { index: '06', name: 'Prepare', phase: 'Deliver', summary: 'Brief the candidate for this round.', detail: 'Preparation is customised to the level, the role and the specific interview round — not a generic tips document sent to everyone.' },
  { index: '07', name: 'Engage', phase: 'Deliver', summary: 'Hold the candidate between rounds.', detail: 'Debriefs both ways after every round. The candidate never sits in silence wondering where the process went, and the panel never waits for feedback.' },
  { index: '08', name: 'Offer', phase: 'Deliver', summary: 'Align before the number is issued.', detail: 'Expectations, counter-offer exposure and competing processes are tested before an offer goes out — so the offer lands as a confirmation, not an opening bid.' },
  { index: '09', name: 'Join', phase: 'Deliver', summary: 'Stay engaged through the notice period.', detail: 'The notice period is the highest-risk window in the whole process. We stay in contact through it and confirm joining. The mandate closes on day one, not at acceptance.' },
]

export const dimensions = [
  { index: '01', name: 'Capability', question: 'Can they do the work at this level?', detail: 'Not what the title says. What the person personally built, owned, decided and shipped at the seniority this role demands.', onCv: true },
  { index: '02', name: 'Relevance', question: 'Adjacent, or genuinely the same?', detail: 'Adjacent experience reads well and interviews badly. We separate the two before submission, not after a rejected panel.', onCv: true },
  { index: '03', name: 'Motivation', question: 'Why this move, and why now?', detail: 'A candidate without a real reason to move is a candidate who will accept an offer and then not move.', onCv: false },
  { index: '04', name: 'Expectations', question: 'Compensation, role, location, notice — aligned?', detail: 'Every unspoken expectation becomes a renegotiation at offer stage. We surface them at qualification instead.', onCv: false },
  { index: '05', name: 'Risk', question: 'Counter-offer and drop-off exposure?', detail: 'Tenure patterns, employer retention behaviour, live processes elsewhere. Risk is assessed early, then managed all the way to joining.', onCv: false },
]

export const touchpoints = [
  { marker: 'Day 0', title: 'First conversation', intervention: 'Motivation, expectations and risk established before a profile is sent.' },
  { marker: 'Prep', title: 'Interview briefing', intervention: 'The panel, the format and the bar for this specific round.' },
  { marker: 'Round 1', title: 'Interview', intervention: 'Reachable on the day; the interview is confirmed as happened.' },
  { marker: 'Between', title: 'Debrief and feedback', intervention: 'Feedback both ways within the day. Silence is where candidates disengage.' },
  { marker: 'Round 2', title: 'Customised preparation', intervention: 'Rebuilt around what round one revealed, not repeated from a template.' },
  { marker: 'Offer', title: 'Motivation and risk check', intervention: 'Counter-offer exposure tested before the number is issued.' },
  { marker: 'Notice', title: 'Continuous engagement', intervention: 'Scheduled contact through the highest-risk window in the process.' },
  { marker: 'Day 1', title: 'Joining', intervention: 'Joining confirmed. Only then is the mandate complete.' },
]

export const preparationTiers = [
  { level: 'Entry', frame: 'Prove the foundation', focus: ['Fundamentals', 'Communication', 'STAR structure', 'Role understanding'], note: 'The failure mode here is structure and nerves, not capability.' },
  { level: 'Mid', frame: 'Prove the ownership', focus: ['Ownership', 'Problem solving', 'Stakeholders', 'Impact', 'Ambiguity'], note: 'The panel is testing what the candidate decided, not what their team delivered.' },
  { level: 'Senior', frame: 'Prove the judgement', focus: ['Strategy', 'Leadership', 'Business impact', 'Executive presence'], note: 'Senior interviews are lost on framing and presence more often than on knowledge.' },
]
