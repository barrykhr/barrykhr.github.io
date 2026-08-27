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

from . import db_storage, pipeline
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


# ── role-level pipeline stages ──────────────────────────────────────────


@app.post("/jobs/{role_id}/intake")
def intake(role_id: str, body: IntakeRequest) -> dict[str, Any]:
    if not db_storage.job_exists(role_id):
        raise HTTPException(status_code=404, detail=f"job '{role_id}' not found")
    result = _run_stage(intake_stage.run, role_id, body.jd_text, storage_backend=db_storage)
    return result.model_dump()


@app.post("/jobs/{role_id}/calibrate")
def calibrate(role_id: str) -> dict[str, Any]:
    result = _run_stage(calibration_stage.run, role_id, storage_backend=db_storage)
    return result.model_dump()


@app.post("/jobs/{role_id}/icp")
def icp(role_id: str) -> dict[str, Any]:
    result = _run_stage(icp_stage.run, role_id, storage_backend=db_storage)
    return result.model_dump()


@app.post("/jobs/{role_id}/talent-map")
def talent_map(role_id: str) -> dict[str, Any]:
    result = _run_stage(talent_map_stage.run, role_id, storage_backend=db_storage)
    return result.model_dump()


@app.post("/jobs/{role_id}/search-strategy")
def search_strategy(role_id: str) -> dict[str, Any]:
    result = _run_stage(search_strategy_stage.run, role_id, storage_backend=db_storage)
    return result.model_dump()


# ── candidates ───────────────────────────────────────────────────────────


@app.post("/jobs/{role_id}/candidates")
def add_candidate(role_id: str, body: CandidateAddRequest) -> dict[str, Any]:
    result = _run_stage(
        candidate_analysis_stage.run,
        role_id, body.source_text, body.role_family,
        source_url=body.source_url, storage_backend=db_storage,
    )
    return result.model_dump()


@app.get("/jobs/{role_id}/candidates")
def list_candidates(role_id: str) -> list[dict[str, Any]]:
    state = db_storage.load_role(role_id)
    candidates = state.get("candidates") or {}
    prioritizations = state.get("prioritizations") or {}
    return [
        {**c, "candidate_id": cid, "prioritization": prioritizations.get(cid)}
        for cid, c in candidates.items()
    ]


@app.post("/jobs/{role_id}/candidates/{candidate_id}/prioritize")
def prioritize(role_id: str, candidate_id: str) -> dict[str, Any]:
    result = _run_stage(prioritization_stage.run, role_id, candidate_id, storage_backend=db_storage)
    return result.model_dump()


@app.post("/jobs/{role_id}/candidates/{candidate_id}/screen")
def screen(role_id: str, candidate_id: str) -> dict[str, Any]:
    result = _run_stage(screening_stage.run, role_id, candidate_id, storage_backend=db_storage)
    return result.model_dump()


@app.post("/jobs/{role_id}/candidates/{candidate_id}/outreach")
def outreach(role_id: str, candidate_id: str) -> dict[str, Any]:
    result = _run_stage(outreach_stage.run, role_id, candidate_id, storage_backend=db_storage)
    return result.model_dump()


# ── funnel ───────────────────────────────────────────────────────────────


@app.post("/jobs/{role_id}/funnel/{candidate_id}")
def funnel_update(role_id: str, candidate_id: str, body: FunnelUpdateRequest) -> dict[str, Any]:
    return _run_stage(
        funnel_stage.update, role_id, candidate_id, body.stage.upper(), storage_backend=db_storage
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
