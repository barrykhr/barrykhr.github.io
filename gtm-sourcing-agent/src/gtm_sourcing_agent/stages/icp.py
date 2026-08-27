"""Stage 3: Ideal Candidate Profile. See prompts/icp.md."""

import json

from .. import llm_client, storage
from ..models import IdealCandidateProfile


def run(role_id: str, *, storage_backend=storage) -> IdealCandidateProfile:
    jd = storage_backend.require_section(role_id, "job_description")
    calibration = storage_backend.require_section(role_id, "calibration")
    prompt = llm_client.render_prompt(
        "icp.md",
        job_description_json=json.dumps(jd),
        calibration_json=json.dumps(calibration),
    )
    result = llm_client.generate(prompt, IdealCandidateProfile, stage="icp")
    storage_backend.merge_section(role_id, "icp", result.model_dump())
    return result
