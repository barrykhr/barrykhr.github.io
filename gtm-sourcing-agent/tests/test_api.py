"""FastAPI service tests via TestClient — no network calls. Mirrors
tests/test_stages.py and tests/test_cli.py's mocking pattern: mock
llm_client.generate, isolate the DB per test, exercise the real HTTP
layer end to end.

Phase 4 (async + scale): every LLM-touching POST route now enqueues a
background task and returns 202 immediately instead of the stage result
— see task_queue.py. Tests call _wait_for_task() to poll the real task
status to completion (bounded, short timeout — the mocked
llm_client.generate below returns instantly, so the worker thread
finishes in well under a second) rather than asserting on the enqueue
response's body."""

import time

import pytest
from fastapi.testclient import TestClient

from gtm_sourcing_agent import db, llm_client
from gtm_sourcing_agent.api import app
from gtm_sourcing_agent.models import HiringManagerCalibration, JobDescription

client = TestClient(app)


def _wait_for_task(role_id: str, task_id: str, timeout: float = 5.0) -> dict:
    deadline = time.time() + timeout
    task = None
    while time.time() < deadline:
        task = client.get(f"/jobs/{role_id}/tasks/{task_id}").json()
        if task["status"] in ("succeeded", "failed"):
            return task
        time.sleep(0.01)
    raise AssertionError(f"task {task_id} did not finish within {timeout}s: last seen {task}")


@pytest.fixture
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(db, "DB_PATH", tmp_path / "test.db")
    return tmp_path


@pytest.fixture
def fake_generate(monkeypatch):
    calls = []
    queue = []

    def _fake(prompt, output_model, *, model=llm_client.DEFAULT_MODEL, max_tokens=0, stage=""):
        calls.append({"prompt": prompt, "output_model": output_model, "stage": stage})
        return queue.pop(0)

    monkeypatch.setattr(llm_client, "generate", _fake)
    _fake.calls = calls
    _fake.queue = queue
    return _fake


def test_health(isolated_db):
    assert client.get("/health").json() == {"status": "ok"}


def test_create_job_and_list(isolated_db):
    resp = client.post("/jobs", json={"title": "Enterprise AE — Acme", "role_family": "sales"})
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["role_id"] == "enterprise-ae-acme"
    assert body["status"]["intake"] is False
    assert body["next_stage"] == "intake"

    jobs = client.get("/jobs").json()
    assert len(jobs) == 1
    assert jobs[0]["title"] == "Enterprise AE — Acme"


def test_create_job_dedupes_slug(isolated_db):
    first = client.post("/jobs", json={"title": "Enterprise AE"}).json()
    second = client.post("/jobs", json={"title": "Enterprise AE"}).json()
    assert first["role_id"] == "enterprise-ae"
    assert second["role_id"] == "enterprise-ae-2"


def test_get_job_404_when_missing(isolated_db):
    resp = client.get("/jobs/does-not-exist")
    assert resp.status_code == 404


def test_intake_requires_job_to_exist_first(isolated_db):
    resp = client.post("/jobs/no-such-job/intake", json={"jd_text": "some JD"})
    assert resp.status_code == 404


def test_calibrate_before_intake_surfaces_as_failed_task(isolated_db):
    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    resp = client.post("/jobs/ae-role/calibrate")
    assert resp.status_code == 202, resp.text

    task = _wait_for_task("ae-role", resp.json()["task_id"])
    assert task["status"] == "failed"
    assert "job_description" in task["error"]


def test_intake_end_to_end_updates_job_status(isolated_db, fake_generate):
    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    fixed = JobDescription(
        raw_jd_text="x", company="Acme", role_title="AE", function="Sales",
        seniority="Senior", geography="US", role_objective="Own net-new logos.",
    )
    fake_generate.queue.append(fixed)

    resp = client.post("/jobs/ae-role/intake", json={"jd_text": "Enterprise AE role."})
    assert resp.status_code == 202, resp.text

    task = _wait_for_task("ae-role", resp.json()["task_id"])
    assert task["status"] == "succeeded", task
    assert task["result"]["company"] == "Acme"

    job = client.get("/jobs/ae-role").json()
    assert job["status"]["intake"] is True
    assert job["next_stage"] == "calibration"
    assert job["state"]["job_description"]["company"] == "Acme"


def test_full_job_and_calibration_chain(isolated_db, fake_generate):
    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    fake_generate.queue.append(
        JobDescription(
            raw_jd_text="x", company="Acme", role_title="AE", function="Sales",
            seniority="Senior", geography="US", role_objective="x",
        )
    )
    intake_resp = client.post("/jobs/ae-role/intake", json={"jd_text": "JD text"})
    _wait_for_task("ae-role", intake_resp.json()["task_id"])

    fake_generate.queue.append(HiringManagerCalibration(must_have_criteria=["quota history"]))
    resp = client.post("/jobs/ae-role/calibrate")
    assert resp.status_code == 202

    task = _wait_for_task("ae-role", resp.json()["task_id"])
    assert task["status"] == "succeeded", task
    assert task["result"]["must_have_criteria"] == ["quota history"]


def test_candidate_add_prioritize_requires_icp_first(isolated_db):
    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    resp = client.post(
        "/jobs/ae-role/candidates",
        json={"source_text": "resume text", "role_family": "sales"},
    )
    assert resp.status_code == 202, resp.text

    task = _wait_for_task("ae-role", resp.json()["task_id"])
    assert task["status"] == "failed"
    assert "icp" in task["error"]


def test_candidate_list_empty_then_populated(isolated_db, fake_generate):
    from gtm_sourcing_agent import db_storage
    from gtm_sourcing_agent.models import Candidate

    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    db_storage.merge_section("ae-role", "icp", {"must_have": ["SaaS"]})

    assert client.get("/jobs/ae-role/candidates").json() == []

    fake_generate.queue.append(Candidate(candidate_id="cand-1", name="Jane Doe"))
    resp = client.post(
        "/jobs/ae-role/candidates",
        json={"source_text": "resume text", "role_family": "sales"},
    )
    assert resp.status_code == 202

    task = _wait_for_task("ae-role", resp.json()["task_id"])
    assert task["status"] == "succeeded", task

    listed = client.get("/jobs/ae-role/candidates").json()
    assert len(listed) == 1
    assert listed[0]["name"] == "Jane Doe"
    assert listed[0]["prioritization"] is None


def test_prioritize_screen_outreach_are_async_tasks(isolated_db, fake_generate):
    from gtm_sourcing_agent import db_storage
    from gtm_sourcing_agent.models import Candidate, CandidatePrioritization, OutreachSequence, ScreeningQuestionSet

    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    db_storage.merge_section("ae-role", "job_description", {"company": "Acme", "role_title": "AE"})
    db_storage.merge_section("ae-role", "icp", {"must_have": ["SaaS"]})
    db_storage.merge_section("ae-role", "calibration", {"must_have_criteria": ["quota history"]})

    fake_generate.queue.append(Candidate(candidate_id="cand-1", name="Jane Doe"))
    add_resp = client.post(
        "/jobs/ae-role/candidates", json={"source_text": "resume text", "role_family": "sales"}
    )
    add_task = _wait_for_task("ae-role", add_resp.json()["task_id"])
    candidate_id = add_task["result"]["candidate_id"]

    fake_generate.queue.append(CandidatePrioritization(candidate_id=candidate_id, tier="A"))
    p_resp = client.post(f"/jobs/ae-role/candidates/{candidate_id}/prioritize")
    assert p_resp.status_code == 202, p_resp.text
    p_task = _wait_for_task("ae-role", p_resp.json()["task_id"])
    assert p_task["status"] == "succeeded", p_task
    assert p_task["result"]["tier"] == "A"

    fake_generate.queue.append(ScreeningQuestionSet(candidate_id=candidate_id))
    s_resp = client.post(f"/jobs/ae-role/candidates/{candidate_id}/screen")
    s_task = _wait_for_task("ae-role", s_resp.json()["task_id"])
    assert s_task["status"] == "succeeded", s_task["error"]

    fake_generate.queue.append(OutreachSequence(candidate_id=candidate_id))
    o_resp = client.post(f"/jobs/ae-role/candidates/{candidate_id}/outreach")
    o_task = _wait_for_task("ae-role", o_resp.json()["task_id"])
    assert o_task["status"] == "succeeded", o_task["error"]

    all_tasks = client.get("/jobs/ae-role/tasks").json()
    assert {t["kind"] for t in all_tasks} == {"add_candidate", "prioritize", "screen", "outreach"}
    assert all(t["status"] == "succeeded" for t in all_tasks)


def test_task_404_when_missing_or_wrong_job(isolated_db):
    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    client.post("/jobs", json={"title": "Other Role", "role_id": "other-role"})
    assert client.get("/jobs/ae-role/tasks/task-doesnotexist").status_code == 404

    resp = client.post("/jobs/ae-role/calibrate")
    task_id = resp.json()["task_id"]
    # right task id, wrong job in the URL — must not leak across jobs
    assert client.get(f"/jobs/other-role/tasks/{task_id}").status_code == 404
    _wait_for_task("ae-role", task_id)  # drain it so it doesn't run past this test


def test_funnel_update_and_report(isolated_db):
    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    resp = client.post("/jobs/ae-role/funnel/cand-1", json={"stage": "contacted"})
    assert resp.status_code == 200
    assert resp.json()["current_stage"] == "CONTACTED"

    report = client.get("/jobs/ae-role/funnel/report").json()
    assert report["counts_by_stage"]["CONTACTED"] == 1


def test_funnel_update_records_note(isolated_db):
    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    resp = client.post(
        "/jobs/ae-role/funnel/cand-1", json={"stage": "recruiter_screen", "note": "HM loved the resume"}
    )
    assert resp.status_code == 200
    assert resp.json()["stage_history"][-1]["note"] == "HM loved the resume"


def test_mark_outreach_sent_requires_draft_then_advances_pipeline(isolated_db, fake_generate):
    from gtm_sourcing_agent.models import Candidate, OutreachSequence

    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})

    # no draft yet — 400, not a 500
    resp = client.post("/jobs/ae-role/candidates/cand-1/outreach/mark-sent")
    assert resp.status_code == 400
    assert "no outreach draft" in resp.json()["detail"]

    from gtm_sourcing_agent import db_storage

    db_storage.merge_section("ae-role", "icp", {"must_have": ["SaaS"]})
    db_storage.merge_section("ae-role", "job_description", {"company": "Acme"})
    fake_generate.queue.append(Candidate(candidate_id="cand-1", name="Jane Doe"))
    add_resp = client.post("/jobs/ae-role/candidates", json={"source_text": "resume", "role_family": "sales"})
    add_task = _wait_for_task("ae-role", add_resp.json()["task_id"])
    candidate_id = add_task["result"]["candidate_id"]

    fake_generate.queue.append(OutreachSequence(candidate_id=candidate_id, email="Hi Jane"))
    o_resp = client.post(f"/jobs/ae-role/candidates/{candidate_id}/outreach")
    _wait_for_task("ae-role", o_resp.json()["task_id"])

    resp = client.post(f"/jobs/ae-role/candidates/{candidate_id}/outreach/mark-sent")
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["funnel_stage"] == "CONTACTED"
    assert body["sent_at"]


def test_funnel_update_rejects_unknown_stage(isolated_db):
    client.post("/jobs", json={"title": "AE Role", "role_id": "ae-role"})
    resp = client.post("/jobs/ae-role/funnel/cand-1", json={"stage": "not_a_stage"})
    assert resp.status_code == 400


def test_funnel_forecast_labels_assumption_source(isolated_db):
    resp = client.post("/funnel/forecast", json={"hires": 5, "weeks": 12})
    assert resp.status_code == 200
    body = resp.json()
    assert body["hires_needed"] == 5
    assert body["assumptions"]["source"] == "market_default"


def test_funnel_forecast_rejects_invalid_source(isolated_db):
    resp = client.post("/funnel/forecast", json={"hires": 5, "weeks": 12, "source": "guess"})
    assert resp.status_code == 400


def test_global_candidates_roster_dedupes_across_jobs(isolated_db, fake_generate):
    from gtm_sourcing_agent import db_storage
    from gtm_sourcing_agent.models import Candidate

    client.post("/jobs", json={"title": "Job A", "role_id": "job-a"})
    client.post("/jobs", json={"title": "Job B", "role_id": "job-b"})
    db_storage.merge_section("job-a", "icp", {"must_have": ["SaaS"]})
    db_storage.merge_section("job-b", "icp", {"must_have": ["SaaS"]})

    same_url = "https://linkedin.com/in/janedoe"
    fake_generate.queue.append(Candidate(candidate_id="", name="Jane Doe", source_url=same_url))
    r1 = client.post(
        "/jobs/job-a/candidates",
        json={"source_text": "resume", "role_family": "sales", "source_url": same_url},
    )
    assert r1.status_code == 202, r1.text
    t1 = _wait_for_task("job-a", r1.json()["task_id"])
    assert t1["status"] == "succeeded", t1

    fake_generate.queue.append(Candidate(candidate_id="", name="Jane Doe", source_url=same_url))
    r2 = client.post(
        "/jobs/job-b/candidates",
        json={"source_text": "resume", "role_family": "sales", "source_url": same_url},
    )
    assert r2.status_code == 202, r2.text
    t2 = _wait_for_task("job-b", r2.json()["task_id"])
    assert t2["status"] == "succeeded", t2

    roster = client.get("/candidates").json()
    assert len(roster) == 1
    assert len(roster[0]["evaluations"]) == 2
    assert {e["role_id"] for e in roster[0]["evaluations"]} == {"job-a", "job-b"}

    detail = client.get(f"/candidates/{roster[0]['candidate_id']}").json()
    assert detail["name"] == "Jane Doe"
    job_titles = {e["role_id"]: e["job_title"] for e in detail["evaluations"]}
    assert job_titles == {"job-a": "Job A", "job-b": "Job B"}


def test_global_candidate_detail_404_when_missing(isolated_db):
    resp = client.get("/candidates/cand-doesnotexist")
    assert resp.status_code == 404
