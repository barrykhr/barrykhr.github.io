# Talyn — Product Requirements Document

**Product name:** Talyn
**Category:** AI-assisted recruiting workspace for GTM roles (Sales, Customer Success, SDR/BDR, Key Account Management) and adjacent functions
**One-line pitch:** Talyn turns a job description into a structured, evidence-based sourcing operation — from ideal candidate profile through search strategy, candidate evidence, prioritization, screening, outreach, and funnel forecasting — while keeping the recruiter as the final decision-maker on every candidate.

This document describes the complete product: what it does, who it's for, every feature it needs, the data model, the non-functional requirements, and the design principles. It is written so it can be handed to an AI coding assistant (or a dev team) as a build specification for the full product, whether building from scratch or continuing an existing codebase.

---

## 1. Product Principles (non-negotiable, apply to every feature)

1. **The recruiter is always the final decision-maker.** The system never auto-rejects a candidate, never hides a candidate from the recruiter, and never sends outreach without recruiter review/approval.
2. **Evidence discipline.** Every AI-generated claim about a candidate is labeled one of three ways, and these labels are never blended or hidden:
   - `VERIFIED` — stated directly by the candidate/source material
   - `NOT_STATED` — the information doesn't exist in what was captured
   - `INFERRED` — the AI drew a conclusion, and it must say from what
3. **Nothing downstream runs silently on stale or unapproved upstream output.** Each pipeline stage is a checkpoint: its output is shown to the recruiter for review before the next stage runs.
4. **Never fabricate to hit a target.** Where the product enforces a minimum (e.g. "at least 15 target companies," "at least 10 interview questions"), a shortfall triggers one retry with a more specific instruction — never padding with invented, low-quality filler.
5. **No admin/role tiers.** Every logged-in recruiter sees the same data and the same controls — no hidden permission layer, consistent with the product's flat-team design.

---

## 2. Users & Personas

- **Recruiter (primary user)** — owns roles, sources and evaluates candidates, drives outreach, tracks their pipeline and revenue contribution.
- **Recruiting team lead** — same account type as recruiter, but uses the cross-team views (Team usage, velocity, revenue by recruiter) to see how the whole team is doing. There is no separate "admin" role — anyone can see this.
- **Client / hiring manager (external, no login)** — receives a read-only, shareable link showing role status without needing an account.

---

## 3. Core Workflow (the pipeline)

Every role moves through this pipeline. Steps 1–2 happen once per role; steps 3–5 are regenerable checkpoints; steps 6–10 repeat per candidate/ongoing.

```
1. Role Intake & Deconstruction   → structured JD + flagged ambiguities/contradictions
2. Hiring Manager Calibration     → must-haves, red flags, "looks good but reject" list
3. Ideal Candidate Profile (ICP)  → must-have / nice-to-have / transferable / disqualifier criteria
4. Talent-Market Map              → Tier 1/2/3 target companies + title intelligence
5. Search Strategy / Sourcing     → boolean strings, X-ray queries, channel-specific searches
6. Candidate Evidence Capture     → structured candidate record, evidence-labeled
7. Prioritization (A/B/C/D)       → why-fit / unknowns / what-to-validate — never auto-reject
8. Screening / Interview Questions → must-ask / nice-to-ask / red-flag follow-ups
9. Outreach Drafting              → personalized, evidence-only, recruiter-reviewed before send
10. Funnel Tracking & Forecasting → stage conversion, leakage, hire-backwards forecasting
```

---

## 4. Feature Requirements by Module

### 4.1 Accounts & Authentication
- Email/password signup and login.
- Google Sign-In (Gmail-based OAuth login).
- Session-based auth (secure cookies), working across a split frontend/backend deployment (cross-site cookies configured for `SameSite=None; Secure`).
- Multi-recruiter accounts — no single-account limit; any number of recruiters share the workspace.
- Logout control available from anywhere in the app.

### 4.2 Jobs / Roles
- Create a role from a pasted/uploaded job description.
- Role fields: title, role family, client name, lifecycle status (`OPEN` / `ON_HOLD` / `FILLED` / `CANCELLED`), owner (primary recruiter), role value (manually entered deal/CTC value, used for revenue calculation — never AI-inferred).
- **Multi-recruiter assignment per role**: one primary recruiter (owner) plus any number of contributors, each trackable independently.
- Clone/template a role (start a new role pre-filled from an existing one).
- Client tagging on jobs.
- Client-facing read-only share link (a public, token-based URL showing role status, no login required) — creatable and revocable per role.
- Activity/audit log per role (who did what, when).
- Global search across jobs and candidates.
- "My jobs" filter (roles owned/assigned to the current recruiter).
- Cross-job "Attention needed" view: follow-ups due and upcoming interviews across all of a recruiter's roles.

### 4.3 Intake & Calibration
- Parse a pasted or uploaded job description into a structured form, flagging ambiguities or contradictions for the recruiter to resolve.
- Hiring-manager calibration step: capture must-haves, red flags, and a "looks good on paper but should be rejected" list, used to ground every later AI stage.

### 4.4 Ideal Candidate Profile (ICP)
- Generate a structured ICP from JD + calibration: must-have / nice-to-have / transferable-skill / disqualifier criteria.
- **Rebuild** must always be available once an ICP exists (not just the initial "Build" button) — a recruiter must be able to regenerate on demand at any time.
- Rubric/criteria tuning: recruiter can adjust/edit ICP criteria after generation.

### 4.5 Talent-Market Map
- Generate target companies to source from, grouped into three tiers, using **the same four match dimensions consistently across all tiers**:
  - `product`, `business_segment`, `customer_base`, `industry`
- **Tier 1 — direct talent**: shares most or all four dimensions with the role.
- **Tier 2 — adjacent talent**: shares some of the four; real transferable skill, some ramp-up expected.
- **Tier 3 — transferable talent**: shares few of the four but is still a legitimate source, further afield.
- Minimum 15 target companies total (5+ per tier); one automatic retry if the first generation comes back thin, keeping whichever result is better — never fabricated padding.
- Each target company shows which of the four dimensions it actually shares (`match_dimensions`) and a `why_relevant` explanation — the tier is a consequence of the dimensions, not a separate unexplained opinion.
- Title intelligence (equivalent job titles across companies for the same seniority/function).

### 4.6 Sourcing / Search Strategy
- Generate boolean search strings, X-ray queries, and channel-specific searches (multiple categories: broad, targeted, competitor, adjacent, transferable, geography, seniority).
- Each search string is copyable with one click.
- Primary focus channels: Naukri and LinkedIn (structured target-profile: titles, companies, keywords, career-transition patterns — not just one boolean string).

### 4.7 Candidates
- **Global Candidates page** (across all roles) and **per-role Candidates tab**.
- Add a candidate manually, or via file upload (resume parsing — PDF and DOCX supported).
- Bulk CSV candidate import.
- Candidate record fields: name, current company/title, location, source URL, CTC, notice period, evidence-labeled skills/experience, fit score, RYG (red/yellow/green) status, weaknesses/unknowns.
- Canonical candidate identity + dedup: the same person appearing in multiple roles is recognized, with "seen before" cross-job context surfaced.
- Recruiter decision write-path: explicit accept/reject/hold decisions per candidate, always recruiter-driven, never automatic.
- Private candidate notes (per recruiter, not shared).
- Side-by-side candidate comparison view.
- Export: CSV and JSON export of a role's candidate list.

### 4.8 Prioritization
- A/B/C/D prioritization per candidate with why-fit reasoning, unknowns, and what-to-validate next — never an auto-reject, always a recommendation for the recruiter.
- Bulk "prioritize all" action across a role's candidate list.

### 4.9 Interview / Screening Questions
- **Role-level Interview Questions** (grounded in the role's own ICP/calibration — must-haves, red flags): core questions (ask every candidate), role-specific questions, red-flag probing questions.
- **Generation history, not overwrite**: every regeneration is appended, not destructive. Minimum 10 questions per generation; a repeat-detection check flags questions that closely match an earlier generation's text (surfaced honestly, not hidden) rather than silently assuming the model avoided repeating itself.
- Bulk "draft all" action.
- Separate from this: **candidate-level screening questions** validate one specific candidate's own claims against the role (distinct model, used during evaluation of a specific person, not the standard role question set).

### 4.10 Outreach
- Personalized outreach drafting per candidate, using only evidence already captured (never inventing candidate facts).
- Recruiter must review and approve before anything is treated as sent.
- "Mark as sent" tracking (distinct from actually sending — outreach is drafted, then handed off).
- Email draft handoff via `mailto:` (opens the recruiter's own email client pre-filled).
- Daily digest email handoff.

### 4.11 Communications / Conversation History
- Per-candidate communications log: WhatsApp-style messaging thread and call log, viewable in the candidate detail view.
- Structured conversation history persisted per candidate, visible both on the per-role candidate detail and the global Candidates page.
- (Current implementation is a demo/logging UI — see §8 Out of Scope for real WhatsApp Business API / telephony integration status.)

### 4.12 Pipeline & Funnel
- Pipeline board (column view by stage) per role.
- Stage transition history per candidate, with days-in-stage and notes.
- Funnel report: stage conversion rates, leakage identification.
- Hire-backwards forecasting: given a hiring target, forecast how many candidates/searches are needed at each stage.
- Interview scheduling: `scheduled_at` timestamps on stage transitions, surfaced in the cross-job "upcoming interviews" view.

### 4.13 Revenue & Placement
- Placement/fee tracking: recruiter records the actual placement fee when a candidate is placed (realized revenue).
- **Revenue model**: `role_value` (manually entered, never AI-generated) × `8.33%` margin = expected revenue per open role. Roles with no `role_value` set show no expected revenue rather than a fabricated number.
- Revenue overview: firm-level expected vs. realized revenue rollup.
- Revenue by recruiter: each recruiter's attributed roles' expected + realized revenue, and their share of the firm total — team-level contribution tracking, not an individual payout/commission model.

### 4.14 Analytics & Team Views
- Cross-job analytics overview (dashboard summary).
- Recruiter performance analytics with charts (funnel/conversion, revenue, comparison across recruiters).
- Velocity/conversion dashboard (time-in-stage, stage-to-stage conversion).
- Team usage view: per-recruiter role counts, placements.
- Recruiter capacity view (current open-role load per recruiter).

### 4.15 AI Copilot
- Persistent side-panel chat, available from any job workspace.
- Tool-using: can read the role's current state and apply structured edits (e.g. editing the hiring profile) on request, with the same checkpoint/review discipline as the rest of the product — it doesn't silently mutate data without the change being visible.

### 4.16 Reports & Integrations
- Print-friendly view for any role (browser print/PDF).
- CSV and JSON export.
- Outbound webhook integration (configurable per role, with a test-send action).

### 4.17 In-Product Guide
- A built-in Guide page explaining the pipeline and how to use the product, for a non-technical recruiter to onboard themselves without external documentation.

---

## 5. Data Model (core entities)

- **Job** — `role_id`, `title`, `role_family`, `client_name`, `share_token`, `lifecycle_status`, `owner_email`, `role_value`, timestamps.
- **JobRecruiter** — join table: `role_id`, `email`, `assignment` (`primary` | `contributor`), `added_at`. Powers multi-recruiter attribution while `Job.owner_email` stays as a synced convenience column for existing single-owner views.
- **JobSection** — generic per-role keyed JSON blob (`role_id`, `section_key`, `data`) storing the output of each pipeline stage (icp, talent_map, search_strategy, interview_questions, etc.) — this is what makes each stage's output independently versionable/regenerable without a bespoke table per stage.
- **CanonicalCandidate** — cross-job candidate identity: `id`, `name`, `current_company`, `current_title`, `location`, `source_url`, `first_seen_job_id`, timestamps — the entity that powers dedup and "seen before" context.
- **Task** — background job queue entry for any LLM-touching operation (see §6.2).
- **InterviewQuestionHistory** — `{generations: [{generated_at, core_questions, role_specific_questions, red_flag_questions, repeated_questions}, ...]}`, append-only; old flat single-generation data is normalized into generation one on read so nothing existing breaks.
- **TargetCompany** (within talent_map) — `name`, `tier` (1/2/3), `why_relevant`, `match_dimensions` (subset of `product`/`business_segment`/`customer_base`/`industry`).
- Evidence-labeled fields throughout the candidate model use `EvidenceLevel = "VERIFIED" | "NOT_STATED" | "INFERRED"`.

---

## 6. Non-Functional Requirements

### 6.1 Evidence & Trust
- Every AI-touched candidate fact carries its evidence label. No UI surface may present an `INFERRED` claim with the same visual weight as a `VERIFIED` one.

### 6.2 Async / Background Processing
- Any LLM-touching operation runs as a background task (not a blocking request): the API enqueues a task, returns immediately, and the frontend polls task status until `succeeded`/`failed`. This keeps the UI responsive during multi-second AI generations and is the pattern for every "Build X" / "Regenerate X" action in the product.
- Task failures must be visibly surfaced to the recruiter (not a silent infinite spinner) with a timeout/staleness check on the polling side.

### 6.3 Deployment Architecture
- **Split-host deployment**: FastAPI backend and Next.js frontend deployed independently (backend on Render, frontend on Vercel, or equivalent split hosts).
- Cross-site session cookies (`SameSite=None; Secure`) required for the frontend's domain to authenticate against the backend's separate domain.
- CORS explicitly allow-listing the frontend's exact deployed origin.
- Frontend backend-URL configuration via a public build-time environment variable (e.g. `NEXT_PUBLIC_API_URL`) — must be stored as a plain/readable config value, not a write-only "secret" type, since it is inlined into the public JS bundle regardless and an unreadable value can't be verified when debugging.
- Database: SQLite for local/dev; Postgres via a `DATABASE_URL` environment variable for production — required before scaling past a single lightweight deployment, since a single in-process SQLite writer cannot safely serve more than one backend worker process (concurrent writes lock the file).

### 6.4 Design System
- Light-mode-first: the product does not yet expose a user-facing dark mode toggle; any `dark:`-variant styling must be explicitly scoped (not silently triggered by the OS/browser's own dark-mode preference) so the whole app stays visually consistent until a real toggle is built.
- Design tokens: a defined color/elevation/radius/spacing system (Inter typeface, indigo accent, zinc neutrals) applied consistently — not per-component ad hoc styling.
- Sidebar navigation + command palette (Cmd+K) for fast navigation.
- Every async action shows a busy/loading state local to the control that triggered it, not just a global spinner.

### 6.5 Accessibility & Responsiveness
- Keyboard-operable controls, visible focus states.
- Responsive layout — the product is used on both desktop and, for quick checks, mobile browsers.

---

## 7. Tech Stack (as implemented)

- **Backend**: Python, FastAPI, SQLAlchemy ORM, Pydantic models for structured LLM outputs, Anthropic Claude API for all generation stages.
- **Frontend**: Next.js (React), Tailwind CSS v4.
- **Persistence**: SQLite (dev) / Postgres (prod, via `DATABASE_URL`).
- **Background jobs**: in-process async task queue/worker.
- **Testing**: pytest (backend, target: full suite green before any deploy), Playwright (end-to-end browser verification against a mock LLM server for deterministic testing).
- **Deployment**: Render (backend), Vercel (frontend).

---

## 8. Out of Scope / Explicitly Not Faked

- **Real WhatsApp/telephony integration** — the current communications feature is a structured logging/demo UI for conversation history, not a live WhatsApp Business API or calling-platform integration. Building that is a distinct, separate integration project (webhook receivers, provider account, compliance requirements) and should not be assumed "done" from the UI alone.
- **Individual recruiter commission/payout amounts** — the product tracks firm revenue and each recruiter's contribution *share*, deliberately not a personal earnings/payout calculator (no compensation/commission-plan modeling).
- **Auto-rejecting or auto-hiding candidates** — never build this; it violates the core "recruiter is the decision-maker" principle even if requested as a "convenience" feature later.
- **AI-inferred deal/role value** — `role_value` must always be a manually entered number, never model-generated, since it drives real revenue reporting.
- **PDF report generation** (server-rendered PDF with embedded charts) — not yet built; today's export is CSV/JSON + browser print view. If prioritized, use a pure-Python PDF library with no system-library build dependency (avoids deployment fragility on platforms like Render).

---

## 9. How to Use This Document

Hand this PRD to an AI coding assistant (or engineering team) as the build/continuation specification. Recommended approach:
1. Treat §1 (Principles) as constraints that override any convenience shortcut suggested elsewhere.
2. Build/verify §3 (pipeline) end-to-end before layering on §4's supporting features — the pipeline is the product's spine.
3. Each feature in §4 should ship with automated tests (backend) and a live browser verification pass (frontend) before being considered done, per §7's testing stack.
4. Treat §8 explicitly — a coding assistant should not silently "complete" any of those items without flagging that it's a real scope decision, not a small polish task.
