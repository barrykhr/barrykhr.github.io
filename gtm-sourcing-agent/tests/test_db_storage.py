"""Mirrors tests/test_storage.py exactly, against db_storage.py instead —
same contract, SQLite backend. If these two test files ever diverge in
what they assert, the two backends have drifted apart."""

import pytest

from gtm_sourcing_agent import db, db_storage


@pytest.fixture
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(db, "DB_PATH", tmp_path / "test.db")
    return tmp_path


def test_load_role_returns_empty_skeleton_when_missing(isolated_db):
    state = db_storage.load_role("acme-ae-2026")
    assert state == {"role_id": "acme-ae-2026", "candidates": {}, "prioritizations": {}}


def test_merge_section_persists_across_loads(isolated_db):
    db_storage.merge_section("acme-ae-2026", "job_description", {"company": "Acme"})
    reloaded = db_storage.load_role("acme-ae-2026")
    assert reloaded["job_description"] == {"company": "Acme"}


def test_merge_section_preserves_other_sections(isolated_db):
    db_storage.merge_section("acme-ae-2026", "job_description", {"company": "Acme"})
    db_storage.merge_section("acme-ae-2026", "calibration", {"must_have_criteria": ["quota history"]})
    state = db_storage.load_role("acme-ae-2026")
    assert state["job_description"] == {"company": "Acme"}
    assert state["calibration"] == {"must_have_criteria": ["quota history"]}


def test_merge_section_overwrites_same_key_in_place(isolated_db):
    db_storage.merge_section("acme-ae-2026", "icp", {"must_have": ["SaaS"]})
    db_storage.merge_section("acme-ae-2026", "icp", {"must_have": ["SaaS", "enterprise"]})
    state = db_storage.load_role("acme-ae-2026")
    assert state["icp"] == {"must_have": ["SaaS", "enterprise"]}


def test_require_section_raises_when_missing(isolated_db):
    with pytest.raises(ValueError, match="job_description"):
        db_storage.require_section("acme-ae-2026", "job_description")


def test_require_section_returns_value_when_present(isolated_db):
    db_storage.merge_section("acme-ae-2026", "icp", {"must_have": ["SaaS"]})
    assert db_storage.require_section("acme-ae-2026", "icp") == {"must_have": ["SaaS"]}


def test_merge_candidate_and_prioritization(isolated_db):
    db_storage.merge_candidate("acme-ae-2026", "cand-1", {"name": "Jane"})
    db_storage.merge_prioritization("acme-ae-2026", "cand-1", {"candidate_id": "cand-1", "tier": "A"})
    state = db_storage.load_role("acme-ae-2026")
    assert state["candidates"]["cand-1"]["name"] == "Jane"
    assert state["prioritizations"]["cand-1"]["tier"] == "A"


def test_create_job_sets_title_and_is_idempotent(isolated_db):
    db_storage.create_job("acme-ae-2026", title="Enterprise AE — Acme", role_family="sales")
    db_storage.create_job("acme-ae-2026")  # re-creating shouldn't blank out the title
    jobs = db_storage.list_jobs()
    assert len(jobs) == 1
    assert jobs[0]["title"] == "Enterprise AE — Acme"
    assert jobs[0]["role_family"] == "sales"


def test_create_job_defaults_title_to_role_id(isolated_db):
    db_storage.create_job("acme-ae-2026")
    assert db_storage.list_jobs()[0]["title"] == "acme-ae-2026"


def test_list_jobs_orders_most_recently_updated_first(isolated_db):
    db_storage.create_job("job-a", title="A")
    db_storage.create_job("job-b", title="B")
    db_storage.merge_section("job-a", "job_description", {"company": "Acme"})  # bumps job-a's updated_at
    role_ids = [j["role_id"] for j in db_storage.list_jobs()]
    assert role_ids[0] == "job-a"


def test_job_exists(isolated_db):
    assert db_storage.job_exists("acme-ae-2026") is False
    db_storage.create_job("acme-ae-2026")
    assert db_storage.job_exists("acme-ae-2026") is True


def test_role_id_isolation_across_two_jobs(isolated_db):
    db_storage.merge_section("job-a", "job_description", {"company": "A"})
    db_storage.merge_section("job-b", "job_description", {"company": "B"})
    assert db_storage.load_role("job-a")["job_description"]["company"] == "A"
    assert db_storage.load_role("job-b")["job_description"]["company"] == "B"


def test_analytics_overview_counts_across_jobs(isolated_db):
    db_storage.create_job("job-a", title="A")
    db_storage.create_job("job-b", title="B")
    db_storage.merge_candidate("job-a", "cand-1", {"name": "Jane"})
    db_storage.merge_candidate("job-a", "cand-2", {"name": "Marcus"})
    db_storage.merge_candidate("job-b", "cand-3", {"name": "Elena"})
    db_storage.merge_prioritization("job-a", "cand-1", {"candidate_id": "cand-1", "tier": "A", "recruiter_decision": "pursue"})
    db_storage.merge_prioritization("job-a", "cand-2", {"candidate_id": "cand-2", "tier": "B"})
    # cand-3 never prioritized

    overview = db_storage.analytics_overview()

    assert overview["total_jobs"] == 2
    assert overview["total_candidates"] == 3
    assert overview["total_evaluations"] == 3
    assert overview["tier_distribution"] == {"A": 1, "B": 1, "C": 0, "D": 0, "not_prioritized": 1}
    assert overview["decisions_recorded"] == 1
    assert overview["decisions_pending"] == 1
    assert overview["decision_breakdown"] == {"pursue": 1}


def test_analytics_overview_empty_state(isolated_db):
    overview = db_storage.analytics_overview()
    assert overview["total_jobs"] == 0
    assert overview["total_evaluations"] == 0
    assert overview["decision_breakdown"] == {}
