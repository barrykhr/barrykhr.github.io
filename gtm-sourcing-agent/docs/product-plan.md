# Product Build Plan

This tracks the 7-phase product build-out proposed in the **Recruiting OS
Blueprint** (published as an artifact; ask if you need the link again) —
turning the CLI-only recruiting pipeline into a persistent, job-centric
product. It's a separate tracking document from
[`implementation-plan.md`](implementation-plan.md), which covers the
*recruiting pipeline itself* (JD → ICP → talent map → ... → funnel) and
already reached its Phase 6. Don't confuse the two "Phase 1"s — this file
is about the product/UI layer built *on top of* that pipeline, which the
pipeline's own plan never touches.

**Ground rule carried over from the Blueprint:** nothing in `prompts/*.md`
or `models/*.py` changes as part of any phase below. This is additive
product work around the existing recruiting intelligence, not a rewrite
of it.

## Phase 1 — Product shell — done, pending live-LLM acceptance

- **Done:** `db.py` + `models_orm.py` — SQLite via SQLAlchemy, two tables
  (`jobs`, `job_sections`). Mirrors `storage.py`'s one-JSON-blob-per-section
  model (row per section instead of file per role) rather than normalizing
  every nested field — that's deliberate scope discipline, see
  `models_orm.py`'s docstring. Candidate/evaluation normalization is
  Phase 2, not this phase.
- **Done:** `db_storage.py` — a drop-in backend implementing the same six
  functions as `storage.py` (`load_role`, `save_role`, `merge_section`,
  `require_section`, `merge_candidate`, `merge_prioritization`), plus
  `create_job` / `list_jobs` / `job_exists` for the product's job-shell
  concept, which the file backend never needed. `storage.py` itself is
  untouched — the CLI still runs on it, zero regression risk.
- **Done:** every `stages/*.py` function (and `pipeline.py`'s
  `status`/`next_stage`) takes an optional `storage_backend=storage` kwarg.
  Every existing call site is unaffected (same default); the API passes
  `db_storage` instead.
- **Done:** `api.py` — FastAPI service, one route per stage, 1:1 with the
  CLI. Verified booting under a real `uvicorn` process (not just
  `TestClient`) before being trusted.
- **Done:** offline test coverage for all of the above — 73 tests total,
  zero network calls, zero API key required (`test_db_storage.py`,
  `test_stage_backend_injection.py`, `test_api.py` are new; the original
  59 are untouched and still pass).
- **Done:** `frontend/` — Next.js 16 + TypeScript + Tailwind SPA. Job
  dashboard (list + create) and a job workspace with Overview, Hiring
  Intelligence, Talent Map, Sourcing, Candidates, Pipeline tabs (Outreach
  and Analytics were added in the Phase 3 correction below), each an
  action button over the matching stage endpoint plus a live view of its
  output. See `frontend/README.md`.
- **Done:** `scripts/mock_llm_server.py` — runs the real API with
  `llm_client.generate` monkeypatched to plausible canned per-stage
  responses, so the whole product (dashboard → intake → hiring profile →
  talent map → sourcing → candidates → prioritize/screen/outreach →
  pipeline) is exercisable in an actual browser without
  `ANTHROPIC_API_KEY`. Used to verify the full golden path end-to-end via
  Playwright before this phase was called done — every tab, every action
  button, screenshotted and confirmed rendering real (fabricated but
  correctly-shaped) data, not just passing offline unit tests.
- **Deferred to later phases, per the Blueprint:** auth beyond a
  single local user, the chat orchestrator, async task queues.
- **Still outstanding:** live acceptance against a real
  `ANTHROPIC_API_KEY` — everything above is verified structurally (tests,
  a real uvicorn boot, a real browser walkthrough against fabricated
  data) but not against genuine model output, same caveat as the
  recruiting pipeline itself in `implementation-plan.md`.

## Phase 2 — Candidate intelligence layer — done

- **Done:** `candidates` (canonical identity) + `candidate_evaluations`
  (per-job — achievements/evidence/tier, since evidence is inherently
  job-context-specific) tables. `db_storage.load_role()` reconstructs the
  exact same `{"candidates": {...}, "prioritizations": {...}}` shape
  Phase 1 returned, so `stages/*.py` and every existing `api.py` route
  needed **zero** changes — only `db_storage.py`'s internals moved.
- **Done:** dedup-on-add, explicit and inspectable (logged, never
  silent) — exact `source_url` match first, normalized name+company as
  fallback, else a new canonical record. No auto-merging of existing
  records after the fact.
- **Done:** `GET /candidates` (global roster) and
  `GET /candidates/{id}` (identity + per-job tier history), additive to
  the existing per-job routes.
- **Done:** a "Candidates" top-level nav item, a roster page, and a
  detail page showing cross-job tier history — the "92% fit Job A, 71%
  fit Job B" view from the build instruction's §9. Verified in a real
  browser against `scripts/mock_llm_server.py`: added the same
  `source_url` to two different jobs, confirmed the roster collapsed
  them to one canonical card reading "2 jobs," and the detail page
  listed both job titles with their tiers.
- Same outstanding caveat as Phase 1: verified structurally + via a real
  browser walkthrough against fabricated data, not live model output.

## Phase 3 — Chat orchestrator — plumbing done, tool-selection quality unverified

This phase has a fundamentally different risk profile from Phases 1–2:
its entire value is natural-language understanding, which cannot be
checked without a live model. What's below is honest about that split.

- **Done:** `orchestrator.py` — a real Claude tool-use loop
  (`client.beta.messages.tool_runner` + `@beta_tool`) over 11 tools
  wrapping the existing stage functions, job-scoped via closure (the
  model never chooses which job — that's fixed context per the
  Blueprint's §J). `_run_tool_loop` is the one function that talks to the
  Anthropic API; every tool's actual logic lives in plain `TOOL_IMPLS`
  functions tested directly, so no test in this repo depends on Anthropic
  SDK response object internals.
- **Done — the confirm-before-mutate pattern (build instruction §14):**
  `propose_hiring_profile_edit` is read-only — it validates and returns a
  proposal, never touches the ICP. `apply_hiring_profile_edit` is plain
  deterministic Python, called only from `POST /jobs/{id}/chat/confirm`
  after explicit recruiter approval — the model is never the thing that
  writes that particular change, only the thing that explains it.
- **Done:** `POST /jobs/{id}/chat`, `POST /jobs/{id}/chat/confirm`,
  `GET /jobs/{id}/chat` — history and pending-proposal persistence.
- **Done, then corrected:** chat first shipped as an "AI Chat" tab
  (Phase 1's placeholder), then was demoted to a persistent side panel —
  see "Phase 3 correction" below. The panel is the same message
  list / input / [Yes — apply] / [No] proposal card, just relocated so
  chat is never the primary interface.
- **Verified structurally and via a real browser walkthrough**, same
  discipline as Phases 1–2 — but the browser pass used a *scripted*
  stand-in for the model (`scripts/mock_llm_server.py`'s
  `_fake_run_chat_turn`: a fixed keyword trigger, explicitly documented
  as not NL understanding), proving the plumbing (message round-trip,
  tool execution, confirm/decline, ICP actually changing) rather than
  chat quality.
- **Genuinely unverified, more so than any earlier phase:** whether real
  natural language like "remove Fabric as a mandatory requirement" or
  "find me 20 more like candidate 17" actually triggers the right tool
  with the right arguments. There is no way to check this without a live
  `ANTHROPIC_API_KEY` — this is not the same caveat as "haven't run it
  yet," it's "cannot be assessed by this environment at all." Treat the
  orchestrator as unvalidated for real recruiter use until it's been run
  against genuine conversations.

### Phase 3 correction — chat demoted from a tab to a side panel

After the "AI Chat" tab shipped, the product direction was corrected:
this is an AI-powered Recruiting OS, not a recruiting chatbot — chat is
how the recruiter *commands* the product, not the product itself. The
job workspace must read as a set of dedicated work surfaces first, with
chat as a secondary, collapsible control layer over them. Concretely:

- **`components/CopilotPanel.tsx`** (new) — the chat UI extracted from
  the old tab into a slide-in overlay (`fixed inset-y-0 right-0`),
  toggled by an "AI Copilot" button in the job-workspace header. It
  renders over whichever tab is open rather than replacing it — the tab
  underneath stays visible and interactive-looking behind the panel.
  Same backend contract as before (`GET/POST /jobs/{id}/chat`,
  `POST /jobs/{id}/chat/confirm`); no API changes were needed for this
  correction, only presentation.
- **Outreach and Analytics promoted from candidate-row/pipeline
  afterthoughts to dedicated tabs.** Outreach lists every candidate with
  a drafted/no-draft status chip, a generate/regenerate action, and an
  expandable view of the drafted sequence (LinkedIn note, InMail, email,
  two follow-ups) — with an explicit banner that sending isn't built
  (no email/LinkedIn integration exists yet; drafts are copy-paste
  only). Analytics shows funnel counts, nine conversion-rate metrics,
  and the leakage insight, labeled "computed from funnel data — not a
  separate AI call" so it doesn't read as a fabricated LLM insight.
- **Candidates** rebuilt as a real table (candidate, role & company,
  tier, pipeline stage, outreach status, actions) with expandable rows,
  instead of a stacked-card list.
- **Pipeline** rebuilt as a horizontally-scrollable column board, one
  column per funnel stage, with per-candidate ‹ back / next › controls.
  Not full drag-and-drop — deliberately deferred, see below.
- A `dataVersion` counter, bumped whenever the Copilot panel completes a
  turn or a confirm, is threaded into `CandidatesTab` and `PipelineTab`
  so a copilot-driven change (e.g. "remove X as a must-have") is visibly
  reflected in the relevant tab without a manual refresh — this is what
  makes the copilot feel like it's acting *on* the product rather than
  just chatting about it.
- Verified via a 9-step Playwright walkthrough against
  `scripts/mock_llm_server.py` covering: no "AI Chat" tab exists; the
  Copilot opens as an overlay without hiding the current tab's content;
  and a copilot propose/confirm round-trip visibly updates the Hiring
  Intelligence tab's "Must have" list. Same fabricated-data caveat as
  the rest of this phase.
- **Still deferred, unchanged by this correction:** real search
  execution, async progress indicators, drag-and-drop pipeline reorder,
  dashboard-level aggregation across jobs, and the live-`ANTHROPIC_API_KEY`
  acceptance pass noted above.

## Phase 4 — Async + scale — done

Every LLM-touching route in api.py used to call the model synchronously
inside the request handler — fine against the mock (instant canned
responses) but a real problem against a live model: a slow call (real
Anthropic latency can run into the tens of seconds) ties up an HTTP
request and a server thread for its whole duration, and there was no way
to fire off several long-running actions without serializing them one
blocking call at a time.

- **Done:** a `tasks` table (`models_orm.py`) — id, role_id, kind,
  status (`pending`/`running`/`succeeded`/`failed`), args, result,
  error, timestamps. `db_storage.py` gained matching
  `create_task`/`get_task`/`list_tasks`/`update_task` CRUD, same
  pattern as every other table in this file.
- **Done:** `task_queue.py` — a single dedicated background worker
  thread pulling task ids off an in-process `queue.Queue`, one at a
  time. Deliberately not a pool and not an external broker
  (Celery/Redis): concurrent writer threads against the SQLite file
  caused real "database is locked" / "readonly database" failures
  during earlier phases' manual testing (see the Phase 3 correction's
  error notes), and a single sequential worker sidesteps that
  entirely — no WAL-mode tuning, no infra this product doesn't need
  yet at this scale. If volume ever outgrows one worker, the queue can
  be swapped for a real broker without api.py's routes changing, same
  "swap what's below, not what's above" pattern `db_storage.py`
  established in Phase 1.
- **Done:** every LLM-touching POST route (intake, calibrate, icp,
  talent-map, search-strategy, add-candidate, prioritize, screen,
  outreach) now enqueues a task and returns `202` + `task_id`
  immediately instead of blocking on the model call. New
  `GET /jobs/{role_id}/tasks/{task_id}` and `GET /jobs/{role_id}/tasks`
  for polling. Deterministic routes (funnel update/report/forecast)
  were left synchronous on purpose — there's nothing to gain by
  queueing work that never calls the model. The chat orchestrator
  (Phase 3) was also left as-is: a chat turn is inherently a
  request-and-wait exchange from the recruiter's point of view, not a
  fire-and-forget action.
- **Done:** `frontend/lib/api.ts` — each stage function (`runIcp`,
  `addCandidate`, `prioritizeCandidate`, etc.) now enqueues, then polls
  `GET .../tasks/{id}` every 250ms until the task is done, resolving
  with the real result or throwing the real error. This keeps every
  call site in `page.tsx` byte-for-byte unchanged (`await
  runIcp(job.role_id)` still just works) — what changed is underneath:
  a slow real model call no longer holds a request open, it's a
  handful of short polls instead. No fake progress bar was added; the
  existing busy-button state already reflected genuine in-flight work
  and still does.
- **Verified:** the full backend suite (107 tests, up from 105 —
  `test_prioritize_screen_outreach_are_async_tasks`,
  `test_task_404_when_missing_or_wrong_job`, and the existing
  intake/calibrate/candidate tests rewritten to poll a real task to
  completion instead of asserting on a synchronous response body).
  Also verified live in a browser two ways against
  `scripts/mock_llm_server.py` (unmodified — the monkeypatch on
  `llm_client.generate` is a module-level attribute, so the worker
  thread picks it up the same as the request thread always did): the
  full existing 9-step correction walkthrough re-run end-to-end with
  zero UI changes needed, plus a dedicated check confirming the POST
  responses are genuinely `202`, `GET .../tasks` returns real
  per-task records, and a wrong-job task lookup 404s rather than
  leaking across jobs.
- **Not built, and deliberately out of scope for this phase:** a bulk
  action (e.g. "generate outreach for every shortlisted candidate")
  that fires many tasks at once with real per-item status. The queue
  and polling infrastructure above would support it directly, but
  nothing here materialized it into a UI action — left for whenever a
  concrete bulk workflow is asked for, rather than built speculatively.
- Same outstanding caveat as every earlier phase: verified structurally
  and via a real browser walkthrough against fabricated mock data, not
  a live model — real latency, real timeouts, and real concurrent
  request volume are still unverified.

## Phase 5 — Outreach + pipeline execution — done

Before this phase, Outreach and Pipeline were disconnected from each
other and, in Pipeline's case, from data that already existed: every
funnel stage move has always been recorded with a timestamp
(`FunnelRecord.stage_history`), but nothing surfaced it — the board only
ever showed a candidate's *current* stage. And a drafted outreach
sequence had no way to become a real recruiter action; drafting and
"having reached out" were the same state.

The scope here was picked to respect the standing invariant that
nothing in this repo sends outreach (Architecture §1.4, §7) — "outreach
execution" does not mean adding real send integration. It means giving
the recruiter's own actions somewhere to go:

- **Done — "Mark as sent"** (`stages/outreach.py::mark_sent`,
  `POST /jobs/{role_id}/candidates/{candidate_id}/outreach/mark-sent`):
  records that the recruiter reached out through some channel outside
  this product (their own LinkedIn, their own email client — nothing
  here transmits anything). Requires a draft to already exist. If the
  candidate hasn't reached CONTACTED yet, deterministically advances
  them there with a `"outreach marked sent"` note on the transition —
  a direct consequence of the recruiter's own click, the same category
  of action as manually dragging a pipeline card, never further than
  CONTACTED and never backward. Deterministic bookkeeping, not a model
  call, so — like the funnel routes — it's synchronous, not
  task-queued.
- **Done — stage notes**: `StageTransition` gained an optional `note`
  field; the funnel update route and the Pipeline board's next/back
  controls now accept one (e.g. "HM loved the resume," "SMB-only
  background, passing for now"). Purely recruiter-authored — nothing
  here generates a note.
- **Done — the Pipeline board surfaces its own history**: each
  candidate card now shows "Xd in stage" (computed from the last
  transition's timestamp) and, on click, the full stage-history
  timeline with timestamps and notes. All of this data already existed
  in `job.state.funnel` from Phase 1 onward; Phase 5 is entirely UI —
  no new storage was needed for it.
- **Done — Outreach ↔ Pipeline are now visibly connected**: the
  Outreach tab's status chip is now a real three-state progression (No
  draft → Drafted → Sent, gray → amber → green) instead of a binary
  drafted/not, and marking sent immediately shows up as a stage move on
  the Pipeline board — verified live, not just asserted from the
  API layer.
- **Verified:** backend suite at 113 tests (up from 107 — new
  `stages/outreach.py::mark_sent` tests covering "no draft yet" (400,
  not 500), the CONTACTED auto-advance, and that an already-further-
  along candidate is never pulled backward; a `note`-on-transition
  test; an API-level test for the new route). Live in a browser against
  `scripts/mock_llm_server.py`: the full existing 9-step correction
  walkthrough re-run with zero regressions, plus a dedicated 5-step
  walkthrough — generate a draft, mark it sent, confirm the pipeline
  card lands on CONTACTED with an "outreach marked sent" history entry,
  then move it forward with a custom note and confirm that note is the
  one that shows up in the timeline.
- **Not built, deliberately out of scope:** drag-and-drop pipeline
  reordering (still just next/back — unchanged since the Phase 3
  correction that first noted this deferral); a dedicated "needs
  follow-up" / stalled-candidates view (the per-card "Xd in stage"
  signal covers the same need at a glance without a separate panel);
  per-channel sent-tracking (LinkedIn vs. email vs. InMail) — a single
  sent timestamp per candidate was judged sufficient for this phase.
- Same outstanding caveat as every earlier phase: verified structurally
  and via a real browser walkthrough against fabricated mock data, not
  live model output.

## Phase 6 — Analytics + recruiter memory — done

Scope here started from a concrete, pre-existing gap rather than a
blank slate: `CandidatePrioritization.recruiter_decision` has existed
since Phase 1 (the model docstring, `prioritization.py`'s explicit
`result.recruiter_decision = None  # only the recruiter sets this`, and
even the candidate-detail page's `{e.recruiter_decision && ...}`
rendering all reference it) — but no route and no UI control anywhere
ever set it. It was fully wired to display a value that could never
exist. "Recruiter memory" is what filling that in turns out to mean:
giving the recruiter's own past judgment on a candidate somewhere to
live, and surfacing it back to them.

- **Done — the write path itself**
  (`stages/prioritization.py::set_recruiter_decision`,
  `POST /jobs/{role_id}/candidates/{candidate_id}/decision`):
  deterministic, not a model call — same category as `outreach.mark_sent`
  and `funnel.update`. Requires the candidate to already be prioritized
  (there's no decision to attach to a tier that doesn't exist yet).
  Read-modify-write on the existing prioritization record, so it never
  touches tier/why-they-fit/evidence. Passing an empty string clears a
  previously recorded decision.
- **Done — the UI**: the Candidates tab's expanded row gets a
  "Recruiter decision" card with three quick-pick buttons (Pursue / Pass
  for now / Revisit later — the same examples the model's own docstring
  uses) plus a free-text override and a Clear action. Free text, not a
  hard enum — matching what the field was already documented to accept.
- **Done — cross-job memory, surfaced inline**: Phase 2's canonical-
  candidate dedup and cross-job evaluation summary
  (`GET /candidates/{id}`) already contained everything needed for
  this — no new backend work, only a new frontend consumer. When a
  candidate's row is expanded, the tab fetches their canonical profile
  and, if they've been evaluated on another job, shows a "Seen before"
  card: which job, their tier there, and — now that it can actually be
  set — the decision recorded on them. Verified live: the same person
  (matched by identical `source_url`, same dedup heuristic as Phase 2)
  added to a second job immediately surfaces "Tier A ·
  'pass for now'" from the first.
- **Done — cross-job analytics** (`db_storage.analytics_overview`,
  `GET /analytics/overview`): deterministic counting across every job
  — total jobs, canonical candidates, evaluations, a tier distribution,
  and decisions-recorded vs. still-pending — the same discipline
  `funnel.report()` uses for a single job's conversion math, just
  aggregated across all of them. Surfaced as a compact stat strip on
  the Jobs dashboard (hidden until there's at least one job, so an
  empty account isn't greeted with a wall of zeros). Distinct from the
  per-job Analytics tab, which is one role's funnel conversion — this
  is the dashboard-level aggregation explicitly called out as deferred
  back in the Phase 3 correction.
- **Verified:** backend suite at 120 tests (up from 113 — new
  `set_recruiter_decision` tests covering the "not prioritized yet"
  error, that it doesn't disturb the rest of the record, and that it
  can be cleared; `analytics_overview` tests for both a populated and
  an empty account; API-level tests for both new routes). Live in a
  browser against `scripts/mock_llm_server.py`: the full existing
  9-step correction walkthrough re-run with zero regressions, plus a
  dedicated 4-step walkthrough — record a decision via quick-pick,
  confirm it persists and highlights the selected option, add the same
  candidate (same `source_url`) to a second job and confirm "Seen
  before" surfaces the first job's tier and decision, then confirm the
  dashboard's stat strip matches (2 jobs, 1 candidate, 2 evaluations,
  1/1 decisions recorded).
- **Not built, deliberately out of scope:** decision analytics beyond
  counting (e.g. time-from-decision-to-hire); any attempt to have the
  model suggest a recruiter_decision — that field stays recruiter-only
  by design, unchanged from Phase 1's invariant.
- Same outstanding caveat as every earlier phase: verified structurally
  and via a real browser walkthrough against fabricated mock data, not
  live model output — though this phase's core value (the write path,
  the cross-job surfacing, the aggregation) is itself model-independent
  deterministic bookkeeping, so it's less exposed to that caveat than
  most phases before it.

## Phase 7 — Auth — done

Scoped deliberately small: this is a locally-run, single-recruiter tool
with no real domain or hosting, not a multi-tenant SaaS — so "auth
hardening" means session-based email+password auth with exactly one
account, not OAuth/SSO or a user-management system nothing here needs
yet. Every route this product exposes was reachable by anyone who could
reach the port before this phase; now it isn't.

- **Done:** `users` + `sessions` tables (`models_orm.py`) and a new
  `auth.py` module — `account_exists`, `create_user` (refuses a second
  account), `verify_credentials`, `create_session`,
  `get_user_from_session`, `delete_session`. Passwords are salted
  PBKDF2-HMAC-SHA256 (stdlib `hashlib`, 600k iterations, no new
  dependency) — a deliberately conservative choice: correct hashing
  beats no hashing, and swapping in bcrypt/argon2 later touches nothing
  above this module, same "swap what's below" pattern `db_storage.py`
  established in Phase 1.
- **Done:** `AuthMiddleware` in `api.py` — every route requires a valid
  session cookie except `/health`, `/auth/signup`, `/auth/login`,
  `/auth/status`. Enforced once via middleware rather than a per-route
  dependency, so a new route can never be accidentally left unguarded.
  New `POST /auth/signup` (200 once, 400 on every attempt after — there
  is only ever one account), `/auth/login`, `/auth/logout`,
  `GET /auth/me`, `GET /auth/status`. Session token lives in an
  HTTP-only, `SameSite=Lax` cookie; `secure` is off by default for local
  HTTP dev and flips on via `GTM_COOKIE_SECURE=true` for a real HTTPS
  deployment. CORS now sets `allow_credentials=True` so the cookie
  actually flows cross-origin between the Next.js dev server and the API.
- **Done — frontend:** a `/login` page that shows a signup form on first
  run and a login form ever after (driven by `GET /auth/status`); an
  `AuthProvider`/`useAuth()` context shared by an `AuthGate` (redirects
  to `/login` on a 401, shown nowhere else) and an `AccountMenu` in the
  header (logged-in email + log out). Every `fetch` now sends
  `credentials: "include"`.
- **Verified:** backend suite at 130 tests (up from 120 — new
  `test_auth.py` covering signup/login/logout, the second-account
  refusal, wrong-password and unknown-email rejection, and that a
  protected route 401s with no session). The two existing TestClient
  fixtures (`test_api.py`, `test_chat_api.py`) now sign up and log in as
  part of their one shared `isolated_db` fixture, so none of the ~50
  existing test functions across both files needed to change when auth
  was added. Live in a browser: unauthenticated `/` redirects to
  `/login`; sign up lands on the dashboard with the account email in the
  header; a page reload keeps the session (the cookie, not client
  state); log out returns to `/login`; log back in works. Then the full
  existing 9-step correction walkthrough and the Phase 4/5 verification
  walkthroughs were all re-run end-to-end against the now-authenticated
  app with zero regressions.
- **Not built, deliberately out of scope:** multi-user accounts, roles/
  permissions, password reset (single local account — if you forget it,
  reset the SQLite file), OAuth/SSO. All real gaps for a multi-recruiter
  or hosted version of this product, not for what it is today.
- Same outstanding caveat as every earlier phase for the rest of the
  product (mock LLM data, not live model output) — but this phase's own
  correctness (hashing, session validation, the middleware allowlist) is
  independent of that caveat, verified directly.

## Running the product layer locally

```bash
cd gtm-sourcing-agent
source .venv/bin/activate       # after the Quick start in README.md
pip install -e ".[dev]"          # picks up fastapi/uvicorn/sqlalchemy

export ANTHROPIC_API_KEY=...     # stage endpoints still need this
uvicorn gtm_sourcing_agent.api:app --reload --port 8000
```

`GET /health` for a liveness check, `GET /jobs` for the dashboard's data,
interactive API docs at `/docs` (FastAPI's built-in Swagger UI). The
SQLite file lives at `data/gtm_sourcing_agent.db` by default (gitignored,
same reasoning as `workspace/*.json`); override with `GTM_DB_PATH`.
`GTM_CORS_ORIGINS` (comma-separated) controls which frontend origins may
call the API — defaults to `http://localhost:3000`.

Then, in a second terminal, the frontend:

```bash
cd gtm-sourcing-agent/frontend
npm install
npm run dev
```

Open `http://localhost:3000` — **not** `http://127.0.0.1:3000`, see
`frontend/README.md`'s note on `allowedDevOrigins`.

### Without an API key — the mock LLM dev server

To exercise the whole product (every tab, every action button) without a
real `ANTHROPIC_API_KEY`, run the mock server instead of `uvicorn`
directly:

```bash
cd gtm-sourcing-agent
source .venv/bin/activate
python scripts/mock_llm_server.py     # same port 8000, no API key needed
```

Every response is fabricated (see the script's docstring) — never use it
for anything but local UI development.
