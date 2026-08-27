"""Stage 1: Role Intake & Deconstruction. See prompts/intake.md and
docs/implementation-plan.md Phase 1."""

from .. import llm_client, storage
from ..models import JobDescription


def run(role_id: str, jd_text: str) -> JobDescription:
    prompt = llm_client.render_prompt("intake.md", jd_text=jd_text)
    result = llm_client.generate(prompt, JobDescription)
    storage.merge_section(role_id, "job_description", result.model_dump())
    return result
