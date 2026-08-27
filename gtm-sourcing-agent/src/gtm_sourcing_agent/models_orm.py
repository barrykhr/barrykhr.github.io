"""SQLAlchemy tables backing db_storage.py (Phase 1 of the product build —
see docs/implementation-plan.md). Deliberately minimal: a `jobs` row per
role plus a generic `job_sections` key-value JSON table that mirrors
storage.py's one-JSON-blob-per-section model, one row per section instead
of one key per JSON file. Splitting candidates into a canonical identity
table + per-job evaluation table (the Blueprint's Fig. 4) is Phase 2 —
doing it now would be schema work ahead of the dedup logic that actually
needs it.
"""

from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


def _now() -> datetime:
    return datetime.now(UTC)


class Job(Base):
    __tablename__ = "jobs"

    role_id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str | None] = mapped_column(String, default=None)
    role_family: Mapped[str | None] = mapped_column(String, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=_now, onupdate=_now)


class JobSection(Base):
    __tablename__ = "job_sections"
    __table_args__ = (UniqueConstraint("role_id", "section_key", name="uq_job_section"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    role_id: Mapped[str] = mapped_column(ForeignKey("jobs.role_id"))
    section_key: Mapped[str] = mapped_column(String)
    data: Mapped[dict] = mapped_column(JSON)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=_now, onupdate=_now)
