"""FastAPI service — the HTTP surface for the product layer (Phase 1, see
docs/implementation-plan.md and the Recruiting OS Blueprint). One route
per stage, mirroring the CLI 1:1: every route is a thin wrapper that calls
the exact same stages/*.py functions the CLI calls, passing
storage_backend=db_storage instead of the file backend. No recruiting
logic lives in this file — see ARCHITECTURE.md for why that boundary
matters.
"""

import os
import re
import unicodedata
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import db_storage, orchestrator, pipeline, task_queue
from .models.funnel import ForecastAssumptions
from .stages import calibration as calibration_stage
from .stages import candidate_analysis as candidate_analysis_stage
from .stages import funnel as funnel_stage
from .stages import icp as icp_stage
from .stages import intake as intake_stage
from .stages import outreach as outreach_stage
from .stages import prioritization as prioritization_stage
from .stages import screening as screening_stage
from .stages import search_strategy as search_strategy_stage
from .stages import talent_map as talent_map_stage

app = FastAPI(title="GTM Sourcing Agent API", version="0.1.0")

_allowed_origins = os.environ.get("GTM_CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _run_stage(fn, *args, **kwargs) -> Any:
    """Every stage call goes through this so a missing checkpoint
    (ValueError) and an LLM-call failure (RuntimeError) map to distinct,
    predictable HTTP statuses instead of a generic 500 — the API-layer
    equivalent of cli.py's _friendly_errors decorator."""
    try:
        return fn(*args, **kwargs)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from None
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from None


def _slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-") or "job"


def _job_summary(role_id: str) -> dict[str, Any]:
    return {
        "role_id": role_id,
        "status": pipeline.status(role_id, storage_backend=db_storage),
        "next_stage": pipeline.next_stage(role_id, storage_backend=db_storage),
    }


# ── request bodies ──────────────────────────────────────────────────────


class JobCreateRequest(BaseModel):
    title: str
    role_family: str = ""
    role_id: str | None = None  # override the auto-generated slug if provided


class IntakeRequest(BaseModel):
    jd_text: str


class CandidateAddRequest(BaseModel):
    source_text: str
    role_family: str
    source_url: str = ""


class FunnelUpdateRequest(BaseModel):
    stage: str
    note: str = ""


class ChatRequest(BaseModel):
    message: str


class ChatConfirmRequest(BaseModel):
    approve: bool


class ForecastRequest(BaseModel):
    hires: int
    weeks: int
    source: str = "market_default"
    screen_to_hm: float = 0.5
    hm_to_final: float = 0.5
    final_to_offer: float = 0.5
    offer_to_accept: float = 0.8
    contacted_to_screen: float = 0.3
    sourced_to_contacted: float = 0.3


# ── health ───────────────────────────────────────────────────────────────


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# ── jobs ─────────────────────────────────────────────────────────────────


@app.post("/jobs")
def create_job(body: JobCreateRequest) -> dict[str, Any]:
    role_id = body.role_id or _slugify(body.title)
    base_role_id, n = role_id, 2
    while db_storage.job_exists(role_id):
        role_id = f"{base_role_id}-{n}"
        n += 1
    job = db_storage.create_job(role_id, title=body.title, role_family=body.role_family)
    return {**job, **_job_summary(role_id)}


@app.get("/jobs")
def list_jobs() -> list[dict[str, Any]]:
    return [{**job, **_job_summary(job["role_id"])} for job in db_storage.list_jobs()]


@app.get("/jobs/{role_id}")
def get_job(role_id: str) -> dict[str, Any]:
    if not db_storage.job_exists(role_id):
        raise HTTPException(status_code=404, detail=f"job '{role_id}' not found")
    state = db_storage.load_role(role_id)
    jobs = {j["role_id"]: j for j in db_storage.list_jobs()}
    return {**jobs[role_id], **_job_summary(role_id), "state": state}


# ── global candidate roster (Phase 2) ───────────────────────────────────
# Additive only — the per-job /jobs/{role_id}/candidates routes below are
# unchanged. This is the cross-job view: one canonical person, every job
# they've been evaluated against (build instruction §9).


@app.get("/candidates")
def list_candidates_global() -> list[dict[str, Any]]:
    return db_storage.list_canonical_candidates()


@app.get("/candidates/{candidate_id}")
def get_candidate_global(candidate_id: str) -> dict[str, Any]:
    detail = db_storage.get_canonical_candidate(candidate_id)
    if detail is None:
        raise HTTPException(status_code=404, detail=f"candidate '{candidate_id}' not found")
    return detail


# ── background task runners (Phase 4) ───────────────────────────────────
# Every LLM-touching stage call is registered here and executed by
# task_queue.py's worker thread instead of inline in a request handler —
# see task_queue.py's module docstring for why. Deterministic stages
# (funnel update/report/forecast below) stay synchronous; there's nothing
# to gain by queueing work that doesn't call the model.


def _run_intake(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return intake_stage.run(role_id, args["jd_text"], storage_backend=db_storage).model_dump()


def _run_calibrate(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return calibration_stage.run(role_id, storage_backend=db_storage).model_dump()


def _run_icp(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return icp_stage.run(role_id, storage_backend=db_storage).model_dump()


def _run_talent_map(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return talent_map_stage.run(role_id, storage_backend=db_storage).model_dump()


def _run_search_strategy(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return search_strategy_stage.run(role_id, storage_backend=db_storage).model_dump()


def _run_add_candidate(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return candidate_analysis_stage.run(
        role_id, args["source_text"], args["role_family"],
        source_url=args.get("source_url", ""), storage_backend=db_storage,
    ).model_dump()


def _run_prioritize(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return prioritization_stage.run(role_id, args["candidate_id"], storage_backend=db_storage).model_dump()


def _run_screen(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return screening_stage.run(role_id, args["candidate_id"], storage_backend=db_storage).model_dump()


def _run_outreach(role_id: str, args: dict[str, Any]) -> dict[str, Any]:
    return outreach_stage.run(role_id, args["candidate_id"], storage_backend=db_storage).model_dump()


for _kind, _fn in [
    ("intake", _run_intake),
    ("calibrate", _run_calibrate),
    ("icp", _run_icp),
    ("talent_map", _run_talent_map),
    ("search_strategy", _run_search_strategy),
    ("add_candidate", _run_add_candidate),
    ("prioritize", _run_prioritize),
    ("screen", _run_screen),
    ("outreach", _run_outreach),
]:
    task_queue.register_runner(_kind, _fn)


# ── role-level pipeline stages ──────────────────────────────────────────
# Each POST enqueues a task and returns immediately (202 + task_id) instead
# of blocking on the model call; poll GET .../tasks/{task_id} for the
# result. See task_queue.py.


@app.post("/jobs/{role_id}/intake", status_code=202)
def intake(role_id: str, body: IntakeRequest) -> dict[str, Any]:
    if not db_storage.job_exists(role_id):
        raise HTTPException(status_code=404, detail=f"job '{role_id}' not found")
    return task_queue.enqueue(role_id, "intake", {"jd_text": body.jd_text})


@app.post("/jobs/{role_id}/calibrate", status_code=202)
def calibrate(role_id: str) -> dict[str, Any]:
    return task_queue.enqueue(role_id, "calibrate", {})


@app.post("/jobs/{role_id}/icp", status_code=202)
def icp(role_id: str) -> dict[str, Any]:
    return task_queue.enqueue(role_id, "icp", {})


@app.post("/jobs/{role_id}/talent-map", status_code=202)
def talent_map(role_id: str) -> dict[str, Any]:
    return task_queue.enqueue(role_id, "talent_map", {})


@app.post("/jobs/{role_id}/search-strategy", status_code=202)
def search_strategy(role_id: str) -> dict[str, Any]:
    return task_queue.enqueue(role_id, "search_strategy", {})


# ── task status (Phase 4) ───────────────────────────────────────────────


@app.get("/jobs/{role_id}/tasks/{task_id}")
def get_task(role_id: str, task_id: str) -> dict[str, Any]:
    task = db_storage.get_task(task_id)
    if task is None or task["role_id"] != role_id:
        raise HTTPException(status_code=404, detail=f"task '{task_id}' not found")
    return task


@app.get("/jobs/{role_id}/tasks")
def list_tasks(role_id: str) -> list[dict[str, Any]]:
    return db_storage.list_tasks(role_id)


# ── candidates ───────────────────────────────────────────────────────────


@app.post("/jobs/{role_id}/candidates", status_code=202)
def add_candidate(role_id: str, body: CandidateAddRequest) -> dict[str, Any]:
    return task_queue.enqueue(role_id, "add_candidate", {
        "source_text": body.source_text, "role_family": body.role_family, "source_url": body.source_url,
    })


@app.get("/jobs/{role_id}/candidates")
def list_candidates(role_id: str) -> list[dict[str, Any]]:
    state = db_storage.load_role(role_id)
    candidates = state.get("candidates") or {}
    prioritizations = state.get("prioritizations") or {}
    return [
        {**c, "candidate_id": cid, "prioritization": prioritizations.get(cid)}
        for cid, c in candidates.items()
    ]


@app.post("/jobs/{role_id}/candidates/{candidate_id}/prioritize", status_code=202)
def prioritize(role_id: str, candidate_id: str) -> dict[str, Any]:
    return task_queue.enqueue(role_id, "prioritize", {"candidate_id": candidate_id})


@app.post("/jobs/{role_id}/candidates/{candidate_id}/screen", status_code=202)
def screen(role_id: str, candidate_id: str) -> dict[str, Any]:
    return task_queue.enqueue(role_id, "screen", {"candidate_id": candidate_id})


@app.post("/jobs/{role_id}/candidates/{candidate_id}/outreach", status_code=202)
def outreach(role_id: str, candidate_id: str) -> dict[str, Any]:
    return task_queue.enqueue(role_id, "outreach", {"candidate_id": candidate_id})


@app.post("/jobs/{role_id}/candidates/{candidate_id}/outreach/mark-sent")
def mark_outreach_sent(role_id: str, candidate_id: str) -> dict[str, Any]:
    # Deterministic bookkeeping, not a model call — synchronous like the
    # funnel routes below, not queued like the LLM-touching routes above.
    return _run_stage(outreach_stage.mark_sent, role_id, candidate_id, storage_backend=db_storage)


# ── funnel ───────────────────────────────────────────────────────────────


@app.post("/jobs/{role_id}/funnel/{candidate_id}")
def funnel_update(role_id: str, candidate_id: str, body: FunnelUpdateRequest) -> dict[str, Any]:
    return _run_stage(
        funnel_stage.update, role_id, candidate_id, body.stage.upper(),
        note=body.note, storage_backend=db_storage,
    )


@app.get("/jobs/{role_id}/funnel/report")
def funnel_report(role_id: str) -> dict[str, Any]:
    result = funnel_stage.report(role_id, storage_backend=db_storage)
    return result.model_dump()


@app.post("/funnel/forecast")
def funnel_forecast(body: ForecastRequest) -> dict[str, Any]:
    assumptions = _run_stage(
        ForecastAssumptions,
        source=body.source,
        screen_to_hm_interview=body.screen_to_hm,
        hm_interview_to_final=body.hm_to_final,
        final_to_offer=body.final_to_offer,
        offer_to_accept=body.offer_to_accept,
        contacted_to_screen=body.contacted_to_screen,
        sourced_to_contacted=body.sourced_to_contacted,
    )
    result = funnel_stage.forecast(body.hires, body.weeks, assumptions)
    return result.model_dump()


# ── AI chat / orchestrator (Phase 3) ──────────────────────────────────
# Every route here is a thin wrapper too: orchestrator.py holds the tool
# loop, this file only persists history/pending-proposal state and turns
# a raw message list into something a chat UI can render. See
# orchestrator.py's module docstring for the confirm-before-mutate design
# — apply_hiring_profile_edit below is the only place a hiring-profile
# edit actually happens, and it's called from here, never from the model.


def _display_messages(history: list[dict[str, Any]]) -> list[dict[str, str]]:
    """Collapse the raw tool-use transcript into something renderable:
    user/assistant text turns, with tool calls noted inline rather than
    shown as raw JSON. Tool-result turns (role="user" carrying
    tool_result blocks) are internal plumbing and are skipped."""
    display: list[dict[str, str]] = []
    for msg in history:
        content = msg.get("content")
        if isinstance(content, str):
            display.append({"role": msg["role"], "text": content})
            continue
        if not isinstance(content, list):
            continue
        if any(block.get("type") == "tool_result" for block in content if isinstance(block, dict)):
            continue  # tool-result carrier message, not shown
        text_parts = [b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text"]
        tool_notes = [
            f"[used {b.get('name')}]" for b in content if isinstance(b, dict) and b.get("type") == "tool_use"
        ]
        text = " ".join(p for p in text_parts if p)
        if tool_notes and not text:
            text = " ".join(tool_notes)
        if text:
            display.append({"role": msg["role"], "text": text})
    return display


@app.get("/jobs/{role_id}/chat")
def get_chat(role_id: str) -> dict[str, Any]:
    if not db_storage.job_exists(role_id):
        raise HTTPException(status_code=404, detail=f"job '{role_id}' not found")
    state = db_storage.load_role(role_id)
    return {
        "messages": _display_messages(state.get("chat_history") or []),
        "pending_proposal": state.get("chat_pending"),
    }


@app.post("/jobs/{role_id}/chat")
def post_chat(role_id: str, body: ChatRequest) -> dict[str, Any]:
    if not db_storage.job_exists(role_id):
        raise HTTPException(status_code=404, detail=f"job '{role_id}' not found")
    state = db_storage.load_role(role_id)
    history = state.get("chat_history") or []

    result = _run_stage(
        orchestrator.run_chat_turn, role_id, body.message, history, storage_backend=db_storage
    )

    db_storage.merge_section(role_id, "chat_history", result["history"])
    db_storage.merge_section(role_id, "chat_pending", result["pending_proposal"])
    return {"reply": result["reply"], "pending_proposal": result["pending_proposal"]}


@app.post("/jobs/{role_id}/chat/confirm")
def confirm_chat_proposal(role_id: str, body: ChatConfirmRequest) -> dict[str, Any]:
    if not db_storage.job_exists(role_id):
        raise HTTPException(status_code=404, detail=f"job '{role_id}' not found")
    state = db_storage.load_role(role_id)
    pending = state.get("chat_pending")
    if not pending:
        raise HTTPException(status_code=400, detail="no pending proposal for this job")

    if body.approve:
        icp = orchestrator.apply_hiring_profile_edit(
            role_id, pending["field"], pending["action"], pending["value"], storage_backend=db_storage
        )
        note = f"Applied: {pending['description']}"
    else:
        icp = state.get("icp")
        note = f"Declined: {pending['description']}"

    db_storage.merge_section(role_id, "chat_pending", None)
    history = state.get("chat_history") or []
    history.append({"role": "assistant", "content": [{"type": "text", "text": note}]})
    db_storage.merge_section(role_id, "chat_history", history)

    return {"applied": body.approve, "message": note, "icp": icp}
