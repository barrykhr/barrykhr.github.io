"""Session-based auth — Phase 7 (docs/product-plan.md). Deliberately
plain: this is a locally-run, single-recruiter tool with no real domain
or hosting, not a multi-tenant SaaS, so there's exactly one account
(`signup` refuses once one exists) and a bearer session token in an
HTTP-only cookie, not OAuth/SSO or a user-management system this product
has no use for yet.

Password hashing is PBKDF2-HMAC-SHA256 via the stdlib `hashlib` — no new
dependency, and a deliberately conservative choice: correct salted
hashing beats no hashing, and a heavier scheme (bcrypt/argon2) can
replace this later without changing anything above this module, same
"swap what's below" pattern as db_storage.py.
"""

import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import select

from . import db
from .models_orm import Session, User

SESSION_COOKIE_NAME = "gtm_session"
SESSION_TTL = timedelta(days=14)
_PBKDF2_ITERATIONS = 600_000


def _hash_password(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), _PBKDF2_ITERATIONS).hex()


def account_exists() -> bool:
    with db.get_session() as session:
        return session.scalars(select(User)).first() is not None


def create_user(email: str, password: str) -> dict[str, Any]:
    """Only ever succeeds once — see module docstring. Raises ValueError
    (mapped to 400 by the API layer) if an account already exists or the
    password is too weak to bother hashing."""
    if account_exists():
        raise ValueError("an account already exists — log in instead")
    if len(password) < 8:
        raise ValueError("password must be at least 8 characters")
    salt = secrets.token_hex(16)
    with db.get_session() as db_session:
        user = User(
            id=f"user-{secrets.token_hex(8)}", email=email,
            password_hash=_hash_password(password, salt), password_salt=salt,
        )
        db_session.add(user)
        db_session.commit()
        return {"id": user.id, "email": user.email}


def verify_credentials(email: str, password: str) -> dict[str, Any] | None:
    with db.get_session() as db_session:
        user = db_session.scalars(select(User).where(User.email == email)).first()
        if user is None:
            return None
        if _hash_password(password, user.password_salt) != user.password_hash:
            return None
        return {"id": user.id, "email": user.email}


def create_session(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    with db.get_session() as db_session:
        db_session.add(Session(token=token, user_id=user_id, expires_at=datetime.now(UTC) + SESSION_TTL))
        db_session.commit()
    return token


def get_user_from_session(token: str) -> dict[str, Any] | None:
    if not token:
        return None
    with db.get_session() as db_session:
        session = db_session.get(Session, token)
        if session is None:
            return None
        expires_at = session.expires_at.replace(tzinfo=UTC) if session.expires_at.tzinfo is None else session.expires_at
        if expires_at < datetime.now(UTC):
            db_session.delete(session)
            db_session.commit()
            return None
        user = db_session.get(User, session.user_id)
        return {"id": user.id, "email": user.email} if user else None


def delete_session(token: str) -> None:
    with db.get_session() as db_session:
        session = db_session.get(Session, token)
        if session is not None:
            db_session.delete(session)
            db_session.commit()
