"""Stage 11: Outreach drafting. Draft only — nothing here sends a
message (Architecture §1.4, §7). See prompts/outreach.md."""

import json

from .. import llm_client, storage
from ..models import OutreachSequence


def run(role_id: str, candidate_id: str, *, storage_backend=storage) -> OutreachSequence:
    jd = storage_backend.require_section(role_id, "job_description")
    candidates = storage_backend.require_section(role_id, "candidates")
    if candidate_id not in candidates:
        raise ValueError(f"candidate '{candidate_id}' not found for role '{role_id}'")

    prompt = llm_client.render_prompt(
        "outreach.md",
        candidate_json=json.dumps(candidates[candidate_id]),
        job_description_json=json.dumps(jd),
    )
    result = llm_client.generate(prompt, OutreachSequence, stage="outreach")
    result.candidate_id = candidate_id

    state = storage_backend.load_role(role_id)
    state.setdefault("outreach", {})[candidate_id] = result.model_dump()
    storage_backend.save_role(role_id, state)
    return result
