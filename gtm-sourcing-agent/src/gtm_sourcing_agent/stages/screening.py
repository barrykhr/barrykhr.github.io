"""Stage 10: Recruiter Screening questions. See prompts/screening_questions.md."""

import json

from .. import llm_client, storage
from ..models import ScreeningQuestionSet


def run(role_id: str, candidate_id: str) -> ScreeningQuestionSet:
    calibration = storage.require_section(role_id, "calibration")
    candidates = storage.require_section(role_id, "candidates")
    prioritizations = storage.require_section(role_id, "prioritizations")
    if candidate_id not in candidates:
        raise ValueError(f"candidate '{candidate_id}' not found for role '{role_id}'")
    if candidate_id not in prioritizations:
        raise ValueError(
            f"candidate '{candidate_id}' has not been prioritized yet — run prioritize first"
        )

    prompt = llm_client.render_prompt(
        "screening_questions.md",
        candidate_json=json.dumps(candidates[candidate_id]),
        prioritization_json=json.dumps(prioritizations[candidate_id]),
        calibration_json=json.dumps(calibration),
    )
    result = llm_client.generate(prompt, ScreeningQuestionSet)
    result.candidate_id = candidate_id

    state = storage.load_role(role_id)
    state.setdefault("screening", {})[candidate_id] = result.model_dump()
    storage.save_role(role_id, state)
    return result
