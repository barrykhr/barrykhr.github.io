"""SQLite-backed drop-in replacement for storage.py's file backend, with
matching function signatures (Architecture §4 update, Phase 1 of
docs/implementation-plan.md: "swap the storage backend, keep everything
above it"). Every stage in stages/*.py can use this instead of storage.py
via the storage_backend= kwarg without any other code changing.

Deliberately a parallel, standalone implementation rather than one that
imports from storage.py — storage.py and its 44 existing tests stay
completely untouched, so the CLI has zero regression risk from this file
existing. The two modules share logic (merge_section et al. are ~5 lines)
rather than an abstraction; see ARCHITECTURE.md for why premature
abstraction is avoided here.
"""

from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select

from . import db
from .models_orm import Job, JobSection


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
            if key == "role_id":
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


def merge_candidate(role_id: str, candidate_id: str, value: dict[str, Any]) -> dict[str, Any]:
    state = load_role(role_id)
    state.setdefault("candidates", {})[candidate_id] = value
    save_role(role_id, state)
    return state


def merge_prioritization(role_id: str, candidate_id: str, value: dict[str, Any]) -> dict[str, Any]:
    state = load_role(role_id)
    state.setdefault("prioritizations", {})[candidate_id] = value
    save_role(role_id, state)
    return state


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
