"""Stage 8: Candidate Prioritization (A/B/C/D). Never deletes or hides a
candidate — see Architecture §1.1 and prompts/prioritization.md."""

import json

from .. import llm_client, storage
from ..models import CandidatePrioritization


def run(role_id: str, candidate_id: str) -> CandidatePrioritization:
    icp = storage.require_section(role_id, "icp")
    candidates = storage.require_section(role_id, "candidates")
    if candidate_id not in candidates:
        raise ValueError(f"candidate '{candidate_id}' not found for role '{role_id}'")

    prompt = llm_client.render_prompt(
        "prioritization.md",
        icp_json=json.dumps(icp),
        candidate_json=json.dumps(candidates[candidate_id]),
    )
    result = llm_client.generate(prompt, CandidatePrioritization)
    result.candidate_id = candidate_id
    result.recruiter_decision = None  # only the recruiter sets this, never this stage
    storage.merge_prioritization(role_id, candidate_id, result.model_dump())
    return result
