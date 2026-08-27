"""Thin wrapper around the Anthropic Messages API, used by every stage so
model choice, retry policy, and structured-output enforcement live in one
place (Architecture §5).

Not wired up yet (Phase 0 is scaffolding only — no network calls). Phase 1
implements `generate()` using tool-use-enforced structured output: define
a single tool whose input schema is `output_model.model_json_schema()`,
force `tool_choice`, and parse the tool call's input back into
`output_model`. On a validation failure, retry once with the Pydantic
validation error appended to the prompt before raising.
"""

import os
from typing import TypeVar

from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel

ModelT = TypeVar("ModelT", bound=BaseModel)

PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "prompts")
_jinja_env = Environment(loader=FileSystemLoader(PROMPTS_DIR), keep_trailing_newline=True)

DEFAULT_MODEL = "claude-sonnet-5"


def render_prompt(template_name: str, **context: object) -> str:
    """Render a prompt template from prompts/<template_name> with the
    given context variables."""
    return _jinja_env.get_template(template_name).render(**context)


def generate(prompt: str, output_model: type[ModelT], *, model: str = DEFAULT_MODEL) -> ModelT:
    """Call Claude with `prompt`, enforce output against `output_model`,
    and return a validated instance.

    TODO(Phase 1): implement via tool-use structured output. Left
    unimplemented deliberately rather than stubbed with a fake response,
    so a stage that calls this fails loudly instead of silently producing
    placeholder data that looks real.
    """
    raise NotImplementedError(
        "llm_client.generate() is not wired up yet — see "
        "docs/implementation-plan.md Phase 1. Set ANTHROPIC_API_KEY and "
        "implement the anthropic SDK call here before running stages "
        "end-to-end."
    )
