# Implementation Plan

Phased so nothing gets built before the piece it depends on exists, and so
each phase ships something the recruiter can actually use. "Done" for a
phase means: models validated, stage runs end-to-end against a real JD,
output manually reviewed for evidence-discipline compliance.

## Phase 0 — Scaffolding (this change)

- Repo layout, architecture doc, data models (schemas only, no LLM calls
  wired up yet), prompt templates, stage function *signatures* (stubs),
  CLI skeleton, storage read/write for the workspace JSON, `.gitignore`,
  dependency manifest.
- No network calls. No Anthropic API key required to run tests.

## Phase 1 — Intake + Calibration (first real pipeline slice)

- Wire `llm_client.py` to the Anthropic API with structured output
  (tool-use enforced schema) against `models/job_description.py`.
- Implement `stages/intake.py` and `stages/calibration.py` for real.
- CLI: `intake`, `calibrate`.
- Acceptance: run against 3 real JDs spanning different role families
  (e.g. AE, CSM, SWE); confirm contradiction/ambiguity flagging actually
  fires on a JD that has them (don't just test the happy path).

## Phase 2 — ICP + Talent Map + Search Strategy

- `stages/icp.py`, `stages/talent_map.py`, `stages/search_strategy.py`.
- CLI: `icp`, `talent-map`, `search-strategy`.
- Acceptance: search strategy output includes multiple distinct strategies
  (broad/targeted/competitor/adjacent/geo/seniority) per §6 of the brief,
  not one boolean string; talent map explains *why* each company is
  relevant rather than listing competitor names.

## Phase 3 — Candidate Evidence Capture + Prioritization

- `stages/candidate_analysis.py`: takes recruiter-supplied candidate
  source text/notes (not scraped — see "explicitly out of scope" below)
  and structures it into `models/candidate.py`, with evidence labeling
  enforced at the schema level (every achievement/metric carries a label).
- `stages/prioritization.py`: A/B/C/D tiering with why-fit / unknowns /
  validate-next, against the ICP from Phase 2. No delete/reject path.
- CLI: `candidate add`, `candidate list`, `prioritize`.
- Acceptance: run against a batch of candidates including at least one
  deliberately weak match; confirm it's tiered D with rationale, not
  silently dropped from output.

## Phase 4 — Screening Questions + Outreach Drafting

- `stages/screening.py`, `stages/outreach.py`.
- Outreach generation must refuse (raise, not silently fabricate) if a
  candidate record has no verified facts to personalize against —
  generic outreach is a recruiter's explicit fallback, not a silent
  default.
- CLI: `screen`, `outreach`.
- Acceptance: spot-check that outreach never states an inferred fact as
  verified; must-ask screening questions target the specific unknowns
  flagged in that candidate's prioritization record, not generic
  role-family questions.

## Phase 5 — Funnel Tracking + Forecasting

- `models/funnel.py` stage-transition log; `stages/funnel.py` computes
  conversion rates and flags the largest leakage stage.
- Forecasting mode (§13 of the brief): given hires + timeline + either
  recruiter-supplied historical conversion rates or explicit
  market-default assumptions, back-calculate required volume at each
  stage — output must visibly label which rates are historical vs.
  assumed.
- CLI: `funnel update <candidate> <stage>`, `funnel report`,
  `funnel forecast --hires N --weeks W [--rates <file>]`.

## Phase 6 — Hardening / operational polish

- Prompt-output validation-repair loop (on schema-invalid LLM output,
  retry once with the validation error appended before failing loudly).
- Structured logging of every stage run (role_id, stage, model, token
  usage) for cost visibility.
- Real test suite: model validation tests (Phase 0 already has these),
  plus stage tests using recorded/mocked LLM responses (no live API calls
  in CI).
- Revisit: is a database needed yet? Is a UI needed yet? (Only if real
  usage says so — see Architecture §7.)

## Explicitly deferred (not yet scheduled)

- **Automated candidate sourcing** (actually querying LinkedIn/Naukri/
  GitHub programmatically). Most of these have ToS restrictions on
  automated scraping; the search-strategy stage produces query strings
  for the recruiter to run by hand. Revisit only with the user's explicit
  direction on which channels/APIs are actually licensed for automated
  access.
- **Sending outreach automatically.** Draft-only by design (Architecture
  §1.4). Would require email/LinkedIn integration and, more importantly,
  a deliberate decision about where human send-approval lives.
- **Multi-recruiter / hosted deployment.**

## How to track progress

Each phase above should land as its own PR/branch slice against this
scaffolding, not as one large change. Update this file's checkmarks (or
convert to a table with status) as phases land — this file is the map,
not a status snapshot, so keep it current rather than re-deriving plan
state from git history.
