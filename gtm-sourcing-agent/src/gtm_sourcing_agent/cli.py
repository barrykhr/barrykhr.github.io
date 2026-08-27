"""CLI entry point. Every command maps 1:1 to a pipeline stage — see
README.md for the full command list and ARCHITECTURE.md for why the
pipeline is shaped this way.

Commands will raise NotImplementedError until llm_client.generate() is
wired up in Phase 1 (docs/implementation-plan.md) — the CLI shape itself
is final; the stage bodies are the scaffolding still to fill in.
"""

from pathlib import Path

import typer

from . import pipeline, storage
from .models.funnel import ForecastAssumptions
from .stages import (
    calibration as calibration_stage,
)
from .stages import (
    candidate_analysis as candidate_analysis_stage,
)
from .stages import (
    funnel as funnel_stage,
)
from .stages import (
    icp as icp_stage,
)
from .stages import (
    intake as intake_stage,
)
from .stages import (
    outreach as outreach_stage,
)
from .stages import (
    prioritization as prioritization_stage,
)
from .stages import (
    screening as screening_stage,
)
from .stages import (
    search_strategy as search_strategy_stage,
)
from .stages import (
    talent_map as talent_map_stage,
)

app = typer.Typer(help="GTM Sourcing Agent — recruiter stays the decision-maker.")
candidate_app = typer.Typer(help="Per-candidate commands.")
funnel_app = typer.Typer(help="Funnel tracking and forecasting.")
app.add_typer(candidate_app, name="candidate")
app.add_typer(funnel_app, name="funnel")


@app.command()
def intake(jd_path: Path, role_id: str = typer.Option(..., "--role-id")):
    """Stage 1: parse a JD file into a structured JobDescription."""
    result = intake_stage.run(role_id, jd_path.read_text())
    typer.echo(result.model_dump_json(indent=2))


@app.command()
def calibrate(role_id: str):
    """Stage 2: generate the hiring manager calibration sheet."""
    result = calibration_stage.run(role_id)
    typer.echo(result.model_dump_json(indent=2))


@app.command()
def icp(role_id: str):
    """Stage 3: generate the Ideal Candidate Profile."""
    result = icp_stage.run(role_id)
    typer.echo(result.model_dump_json(indent=2))


@app.command(name="talent-map")
def talent_map_cmd(role_id: str):
    """Stage 4-5: generate target companies + title intelligence."""
    result = talent_map_stage.run(role_id)
    typer.echo(result.model_dump_json(indent=2))


@app.command(name="search-strategy")
def search_strategy_cmd(role_id: str):
    """Stage 6: generate search strategies against the talent map."""
    result = search_strategy_stage.run(role_id)
    typer.echo(result.model_dump_json(indent=2))


@app.command()
def status(role_id: str):
    """Show which role-level stages have run, and what's next."""
    for name, done in pipeline.status(role_id).items():
        typer.echo(f"  [{'x' if done else ' '}] {name}")
    nxt = pipeline.next_stage(role_id)
    typer.echo(f"next: {nxt or '(role-level pipeline complete)'}")


@candidate_app.command("add")
def candidate_add(
    role_id: str,
    source_path: Path = typer.Option(..., "--source-path", help="resume/profile text file"),
    role_family: str = typer.Option(..., "--role-family", help="e.g. sales, csm, sdr, engineering"),
    source_url: str = typer.Option("", "--source-url"),
):
    """Stage 7: structure a candidate from recruiter-supplied source text."""
    result = candidate_analysis_stage.run(
        role_id, source_path.read_text(), role_family, source_url=source_url
    )
    typer.echo(result.model_dump_json(indent=2))


@app.command()
def prioritize(role_id: str, candidate_id: str):
    """Stage 8: tier a candidate A/B/C/D with rationale (never a rejection)."""
    result = prioritization_stage.run(role_id, candidate_id)
    typer.echo(result.model_dump_json(indent=2))


@app.command()
def screen(role_id: str, candidate_id: str):
    """Stage 10: generate targeted screening questions."""
    result = screening_stage.run(role_id, candidate_id)
    typer.echo(result.model_dump_json(indent=2))


@app.command()
def outreach(role_id: str, candidate_id: str):
    """Stage 11: draft outreach (draft only — this never sends anything)."""
    result = outreach_stage.run(role_id, candidate_id)
    typer.echo(result.model_dump_json(indent=2))


@funnel_app.command("update")
def funnel_update(role_id: str, candidate_id: str, stage: str):
    """Move a candidate to a funnel stage (e.g. CONTACTED, HM_INTERVIEW)."""
    record = funnel_stage.update(role_id, candidate_id, stage.upper())
    typer.echo(record)


@funnel_app.command("report")
def funnel_report(role_id: str):
    """Stage 12: funnel conversion metrics + biggest leakage stage."""
    result = funnel_stage.report(role_id)
    typer.echo(result.model_dump_json(indent=2))


@funnel_app.command("forecast")
def funnel_forecast(
    hires: int,
    weeks: int,
    source: str = typer.Option("market_default", help="'historical' or 'market_default'"),
    screen_to_hm: float = 0.5,
    hm_to_final: float = 0.5,
    final_to_offer: float = 0.5,
    offer_to_accept: float = 0.8,
    contacted_to_screen: float = 0.3,
    sourced_to_contacted: float = 0.3,
):
    """Stage 13: back-calculate required sourcing volume for N hires.

    Default rates are illustrative market defaults, NOT measured history
    — pass --source historical only when the rates came from this
    recruiter's own funnel data (see funnel report)."""
    assumptions = ForecastAssumptions(
        source=source,
        screen_to_hm_interview=screen_to_hm,
        hm_interview_to_final=hm_to_final,
        final_to_offer=final_to_offer,
        offer_to_accept=offer_to_accept,
        contacted_to_screen=contacted_to_screen,
        sourced_to_contacted=sourced_to_contacted,
    )
    result = funnel_stage.forecast(hires, weeks, assumptions)
    typer.echo(result.model_dump_json(indent=2))


if __name__ == "__main__":
    app()
