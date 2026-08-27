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
  Profile, Talent Map, Sourcing, Candidates, and Pipeline tabs, each an
  action button over the matching stage endpoint plus a live view of its
  output. Analytics/Activity/AI Chat tabs are Phase 3/6 scope, not built
  as empty placeholders here. See `frontend/README.md`.
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

## Phases 3–7

Unstarted. See the Blueprint artifact for scope (chat orchestrator,
async + scale, outreach + pipeline execution, analytics + recruiter
memory, auth hardening). Not duplicated here to avoid two documents
drifting out of sync — this file only tracks *status*, the Blueprint is
the plan of record for *scope*.

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
