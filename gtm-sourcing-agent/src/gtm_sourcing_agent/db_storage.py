"""SQLite-backed drop-in replacement for storage.py's file backend, with
matching function signatures (Architecture §4 update, Phase 1 of
docs/product-plan.md: "swap the storage backend, keep everything above
it"). Every stage in stages/*.py can use this instead of storage.py via
the storage_backend= kwarg without any other code changing.

Deliberately a parallel, standalone implementation rather than one that
imports from storage.py — storage.py and its 44 original tests stay
completely untouched, so the CLI has zero regression risk from this file
existing. The two modules share logic (merge_section et al. are ~5 lines)
rather than an abstraction; see ARCHITECTURE.md for why premature
abstraction is avoided here.

Phase 2 (candidate intelligence layer, docs/product-plan.md): candidates
and prioritizations are now backed by CandidateEvaluation rows joined to a
CanonicalCandidate (models_orm.py), not generic JobSection blobs — but
load_role()'s return shape is byte-identical to before, so nothing above
this module (stages/*.py, api.py's existing routes) needed to change.
save_role() explicitly skips the "candidates"/"prioritizations" keys for
the same reason: those two are owned by merge_candidate/
merge_prioritization now, never by a generic whole-state write-back.
"""

import logging
import re
import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from . import db
from .models_orm import CandidateEvaluation, CanonicalCandidate, Job, JobSection

logger = logging.getLogger(__name__)

# save_role() round-trips whatever load_role() handed back; these two keys
# are reconstructed from CandidateEvaluation rows on every load_role() call
# (see below), so writing them back as generic JobSection blobs would be a
# second, driftable copy of the same data.
_CANDIDATE_OWNED_KEYS = ("candidates", "prioritizations")


def load_role(role_id: str) -> dict[str, Any]:
    """Return the role's current state, or an empty skeleton if this role
    has no job row yet — mirrors storage.load_role exactly."""
    with db.get_session() as session:
        job = session.get(Job, role_id)
        state: dict[str, Any] = {"role_id": role_id, "candidates": {}, "prioritizations": {}}
        if job is None:
            return state
        rows = session.scalars(select(JobSection).where(JobSection.role_id == role_id)).all()
        for row in rows:
            state[row.section_key] = row.data
        evaluations = session.scalars(
            select(CandidateEvaluation).where(CandidateEvaluation.role_id == role_id)
        ).all()
        for ev in evaluations:
            state["candidates"][ev.candidate_evaluation_id] = ev.data
            if ev.prioritization is not None:
                state["prioritizations"][ev.candidate_evaluation_id] = ev.prioritization
        return state


def save_role(role_id: str, state: dict[str, Any]) -> None:
    with db.get_session() as session:
        job = session.get(Job, role_id)
        if job is None:
            job = Job(role_id=role_id)
            session.add(job)
        else:
            job.updated_at = datetime.now(UTC)
        for key, value in state.items():
            if key == "role_id" or key in _CANDIDATE_OWNED_KEYS:
                continue
            row = session.scalars(
                select(JobSection).where(JobSection.role_id == role_id, JobSection.section_key == key)
            ).first()
            if row is None:
                session.add(JobSection(role_id=role_id, section_key=key, data=value))
            else:
                row.data = value
                row.updated_at = datetime.now(UTC)
        session.commit()


def require_section(role_id: str, key: str) -> Any:
    """Read a section a later stage depends on, raising the same clear
    error storage.require_section does if the upstream checkpoint hasn't
    run yet."""
    state = load_role(role_id)
    value = state.get(key)
    if not value:
        raise ValueError(
            f"role '{role_id}' has no '{key}' yet — run that stage first "
            f"(see README.md pipeline order)"
        )
    return value


def merge_section(role_id: str, key: str, value: Any) -> dict[str, Any]:
    state = load_role(role_id)
    state[key] = value
    save_role(role_id, state)
    return state


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip().lower())


def _find_matching_canonical(
    session: Session, name: str, current_company: str, source_url: str
) -> tuple[CanonicalCandidate | None, str]:
    """Dedup heuristic (Phase 2) — deliberately simple and inspectable,
    never silent: exact source_url match first (the one identifier that
    isn't ambiguous), then normalized name+company as a fallback. An O(n)
    scan over all canonical candidates — fine at this phase's scale; add
    normalized indexed columns before this matters. Returns (match, how)
    so callers can log what happened rather than guess."""
    if source_url:
        target = source_url.strip().rstrip("/").lower()
        for c in session.scalars(select(CanonicalCandidate)).all():
            if c.source_url and c.source_url.strip().rstrip("/").lower() == target:
                return c, "source_url"
    if name:
        norm_name, norm_company = _normalize(name), _normalize(current_company)
        for c in session.scalars(select(CanonicalCandidate)).all():
            if _normalize(c.name) == norm_name and _normalize(c.current_company) == norm_company:
                return c, "name+company"
    return None, "new"


def merge_candidate(role_id: str, candidate_id: str, value: dict[str, Any]) -> dict[str, Any]:
    with db.get_session() as session:
        if session.get(Job, role_id) is None:
            session.add(Job(role_id=role_id))
            session.flush()

        existing_eval = session.scalars(
            select(CandidateEvaluation).where(
                CandidateEvaluation.role_id == role_id,
                CandidateEvaluation.candidate_evaluation_id == candidate_id,
            )
        ).first()

        if existing_eval is not None:
            existing_eval.data = value
            existing_eval.updated_at = datetime.now(UTC)
        else:
            name = value.get("name", "")
            current_company = value.get("current_company", "")
            source_url = value.get("source_url", "")
            canonical, match_method = _find_matching_canonical(session, name, current_company, source_url)
            if canonical is None:
                canonical = CanonicalCandidate(
                    id=f"cand-{uuid.uuid4().hex[:12]}",
                    name=name, current_company=current_company,
                    current_title=value.get("current_title", ""), location=value.get("location", ""),
                    source_url=source_url, first_seen_job_id=role_id,
                )
                session.add(canonical)
            else:
                # keep the canonical identity fresh with the latest capture
                canonical.current_company = current_company or canonical.current_company
                canonical.current_title = value.get("current_title") or canonical.current_title
                canonical.location = value.get("location") or canonical.location
                canonical.source_url = source_url or canonical.source_url
                canonical.updated_at = datetime.now(UTC)
            session.flush()  # assign canonical.id before it's used as a FK below
            logger.info(
                "candidate dedup match=%s canonical_id=%s role_id=%s candidate_id=%s",
                match_method, canonical.id, role_id, candidate_id,
            )
            session.add(CandidateEvaluation(
                role_id=role_id, candidate_evaluation_id=candidate_id,
                canonical_candidate_id=canonical.id, data=value,
            ))
        session.commit()
    return load_role(role_id)


def merge_prioritization(role_id: str, candidate_id: str, value: dict[str, Any]) -> dict[str, Any]:
    with db.get_session() as session:
        row = session.scalars(
            select(CandidateEvaluation).where(
                CandidateEvaluation.role_id == role_id,
                CandidateEvaluation.candidate_evaluation_id == candidate_id,
            )
        ).first()
        if row is None:
            raise ValueError(f"candidate '{candidate_id}' not found for role '{role_id}'")
        row.prioritization = value
        row.updated_at = datetime.now(UTC)
        session.commit()
    return load_role(role_id)


def create_job(role_id: str, *, title: str = "", role_family: str = "") -> dict[str, Any]:
    """First-class job creation with display metadata. Not part of
    storage.py's contract — the file backend has no "job shell" concept,
    a role only exists once a section is written. The API's POST /jobs
    needs this so a dashboard has a title to show before intake has run.
    """
    with db.get_session() as session:
        job = session.get(Job, role_id)
        if job is None:
            job = Job(role_id=role_id, title=title or role_id, role_family=role_family)
            session.add(job)
        else:
            if title:
                job.title = title
            if role_family:
                job.role_family = role_family
        session.commit()
        return {
            "role_id": job.role_id, "title": job.title, "role_family": job.role_family,
            "created_at": job.created_at, "updated_at": job.updated_at,
        }


def list_jobs() -> list[dict[str, Any]]:
    with db.get_session() as session:
        jobs = session.scalars(select(Job).order_by(Job.updated_at.desc())).all()
        return [
            {
                "role_id": j.role_id, "title": j.title, "role_family": j.role_family,
                "created_at": j.created_at, "updated_at": j.updated_at,
            }
            for j in jobs
        ]


def job_exists(role_id: str) -> bool:
    with db.get_session() as session:
        return session.get(Job, role_id) is not None


# ── global candidate roster (Phase 2) ───────────────────────────────────


def _evaluation_summary(ev: CandidateEvaluation, jobs: dict[str, Job]) -> dict[str, Any]:
    p = ev.prioritization or {}
    job = jobs.get(ev.role_id)
    return {
        "role_id": ev.role_id,
        "job_title": job.title if job else ev.role_id,
        "candidate_evaluation_id": ev.candidate_evaluation_id,
        "tier": p.get("tier"),
        "why_they_fit": p.get("why_they_fit"),
        "recruiter_decision": p.get("recruiter_decision"),
    }


def list_canonical_candidates() -> list[dict[str, Any]]:
    """Every canonical candidate with a summary of every job they've been
    evaluated against — the "92% fit Job A, 71% fit Job B, not evaluated
    for Job C" view from the build instruction's §9."""
    with db.get_session() as session:
        jobs = {j.role_id: j for j in session.scalars(select(Job)).all()}
        candidates = session.scalars(
            select(CanonicalCandidate).order_by(CanonicalCandidate.updated_at.desc())
        ).all()
        result = []
        for c in candidates:
            evals = session.scalars(
                select(CandidateEvaluation).where(CandidateEvaluation.canonical_candidate_id == c.id)
            ).all()
            result.append({
                "candidate_id": c.id, "name": c.name, "current_company": c.current_company,
                "current_title": c.current_title, "location": c.location, "source_url": c.source_url,
                "evaluations": [_evaluation_summary(e, jobs) for e in evals],
            })
        return result


def get_canonical_candidate(canonical_id: str) -> dict[str, Any] | None:
    with db.get_session() as session:
        c = session.get(CanonicalCandidate, canonical_id)
        if c is None:
            return None
        jobs = {j.role_id: j for j in session.scalars(select(Job)).all()}
        evals = session.scalars(
            select(CandidateEvaluation).where(CandidateEvaluation.canonical_candidate_id == canonical_id)
        ).all()
        return {
            "candidate_id": c.id, "name": c.name, "current_company": c.current_company,
            "current_title": c.current_title, "location": c.location, "source_url": c.source_url,
            "evaluations": [_evaluation_summary(e, jobs) for e in evals],
        }
