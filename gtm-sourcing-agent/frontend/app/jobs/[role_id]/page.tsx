"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ApiError,
  Candidate,
  CanonicalCandidate,
  FUNNEL_STAGES,
  Json,
  JobDetail,
  addCandidate,
  getCandidateGlobal,
  getFunnelReport,
  getJob,
  listCandidates,
  markOutreachSent,
  outreachCandidate,
  prioritizeCandidate,
  runCalibrate,
  runIcp,
  runIntake,
  runSearchStrategy,
  runTalentMap,
  screenCandidate,
  setRecruiterDecision,
  updateFunnelStage,
} from "@/lib/api";
import { StatusChip, tierVariant } from "@/components/StatusChip";
import { CopilotPanel } from "@/components/CopilotPanel";

const TABS = [
  "Overview",
  "Hiring Intelligence",
  "Talent Map",
  "Sourcing",
  "Candidates",
  "Outreach",
  "Pipeline",
  "Analytics",
] as const;
type Tab = (typeof TABS)[number];

export default function JobWorkspace() {
  const params = useParams<{ role_id: string }>();
  const roleId = params.role_id;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");
  const [busy, setBusy] = useState<string | null>(null); // which action is in flight
  const [copilotOpen, setCopilotOpen] = useState(false);
  // Bumped whenever the copilot changes something a tab fetches on its own
  // (candidates, funnel) — those tabs include this in their reload
  // dependency so a copilot action is visible without a manual tab switch.
  const [dataVersion, setDataVersion] = useState(0);

  const refresh = useCallback(() => {
    getJob(roleId)
      .then(setJob)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not reach the API."));
  }, [roleId]);

  useEffect(refresh, [refresh]);

  function onCopilotAction() {
    refresh();
    setDataVersion((v) => v + 1);
  }

  async function runAction(name: string, action: () => Promise<unknown>) {
    setBusy(name);
    setError(null);
    try {
      await action();
      refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : `${name} failed.`);
    } finally {
      setBusy(null);
    }
  }

  if (error && !job) {
    return <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>;
  }
  if (!job) return <p className="text-sm text-zinc-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
          {job.role_family && <p className="mt-1 text-sm text-zinc-500">{job.role_family}</p>}
        </div>
        <button
          onClick={() => setCopilotOpen((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          AI Copilot
        </button>
      </div>

      <nav className="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-t-md px-3 py-2 text-sm font-medium ${
              tab === t
                ? "border-b-2 border-teal-700 text-teal-800 dark:text-teal-400"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {tab === "Overview" && <OverviewTab job={job} busy={busy} runAction={runAction} />}
      {tab === "Hiring Intelligence" && <HiringProfileTab job={job} busy={busy} runAction={runAction} />}
      {tab === "Talent Map" && <TalentMapTab job={job} busy={busy} runAction={runAction} />}
      {tab === "Sourcing" && <SourcingTab job={job} busy={busy} runAction={runAction} />}
      {tab === "Candidates" && (
        <CandidatesTab roleId={roleId} job={job} refresh={refresh} dataVersion={dataVersion} />
      )}
      {tab === "Outreach" && <OutreachTab roleId={roleId} job={job} refresh={refresh} dataVersion={dataVersion} />}
      {tab === "Pipeline" && (
        <PipelineTab roleId={roleId} job={job} refresh={refresh} dataVersion={dataVersion} />
      )}
      {tab === "Analytics" && <AnalyticsTab roleId={roleId} dataVersion={dataVersion} />}

      <CopilotPanel
        roleId={roleId}
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        onAction={onCopilotAction}
      />
    </div>
  );
}

// ── shared bits ────────────────────────────────────────────────────────

function ActionButton({
  label, busyLabel, onClick, busy, disabled,
}: { label: string; busyLabel: string; onClick: () => void; busy: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy || disabled}
      className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
    >
      {busy ? busyLabel : label}
    </button>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {title && <h3 className="mb-2 text-sm font-semibold text-zinc-500">{title}</h3>}
      {children}
    </div>
  );
}

function List({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <p className="text-sm text-zinc-400">—</p>;
  return (
    <ul className="list-disc space-y-1 pl-4 text-sm">
      {items.map((v, i) => <li key={i}>{v}</li>)}
    </ul>
  );
}

type StageProps = {
  job: JobDetail;
  busy: string | null;
  runAction: (name: string, action: () => Promise<unknown>) => void;
};

// ── Overview ───────────────────────────────────────────────────────────

function OverviewTab({ job, busy, runAction }: StageProps) {
  const [jdText, setJdText] = useState("");
  const jd: Json | undefined = job.state.job_description;

  if (!jd) {
    return (
      <Card title="Analyse the job description">
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={10}
          placeholder="Paste the JD here…"
          className="w-full rounded-md border border-zinc-300 p-3 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <div className="mt-3">
          <ActionButton
            label="Analyse JD" busyLabel="Analysing…" busy={busy === "intake"}
            disabled={!jdText.trim()}
            onClick={() => runAction("intake", () => runIntake(job.role_id, jdText))}
          />
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Role">
        <dl className="space-y-1 text-sm">
          <Row label="Company" value={jd.company} />
          <Row label="Title" value={jd.role_title} />
          <Row label="Seniority" value={jd.seniority} />
          <Row label="Geography" value={jd.geography} />
          <Row label="Objective" value={jd.role_objective} />
        </dl>
      </Card>
      <Card title="Must-haves">
        <List items={jd.must_have_requirements} />
      </Card>
      {jd.contradictions?.length > 0 && (
        <Card title="Contradictions flagged">
          <List items={jd.contradictions} />
        </Card>
      )}
      {jd.missing_critical_information?.length > 0 && (
        <Card title="Missing critical information">
          <List items={jd.missing_critical_information} />
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-24 shrink-0 text-zinc-500">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

// ── Hiring Profile (calibration + icp) ────────────────────────────────

function HiringProfileTab({ job, busy, runAction }: StageProps) {
  const calibration: Json | undefined = job.state.calibration;
  const icp: Json | undefined = job.state.icp;

  return (
    <div className="flex flex-col gap-4">
      {!job.status.intake && <p className="text-sm text-zinc-500">Run Overview → Analyse JD first.</p>}

      {job.status.intake && !calibration && (
        <ActionButton
          label="Run calibration" busyLabel="Calibrating…" busy={busy === "calibration"}
          onClick={() => runAction("calibration", () => runCalibrate(job.role_id))}
        />
      )}

      {calibration && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Must-have criteria"><List items={calibration.must_have_criteria} /></Card>
          <Card title="Red flags"><List items={calibration.red_flags} /></Card>
          {calibration.unrealistic_requirements_flag && (
            <Card title="⚠ Unrealistic requirements flag">
              <p className="text-sm">{calibration.unrealistic_requirements_flag}</p>
            </Card>
          )}
        </div>
      )}

      {calibration && !icp && (
        <ActionButton
          label="Build hiring profile (ICP)" busyLabel="Building…" busy={busy === "icp"}
          onClick={() => runAction("icp", () => runIcp(job.role_id))}
        />
      )}

      {icp && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Must have"><List items={icp.must_have} /></Card>
          <Card title="Nice to have"><List items={icp.nice_to_have} /></Card>
          <Card title="Transferable"><List items={icp.transferable} /></Card>
          <Card title="Disqualifier"><List items={icp.disqualifier} /></Card>
        </div>
      )}
    </div>
  );
}

// ── Talent Map ─────────────────────────────────────────────────────────

function TalentMapTab({ job, busy, runAction }: StageProps) {
  const tm: Json | undefined = job.state.talent_map;
  const companies: Json[] = tm?.target_companies ?? [];

  return (
    <div className="flex flex-col gap-4">
      {!job.status.icp && <p className="text-sm text-zinc-500">Build the hiring profile first.</p>}
      {job.status.icp && companies.length === 0 && (
        <ActionButton
          label="Build talent map" busyLabel="Mapping…" busy={busy === "talent_map"}
          onClick={() => runAction("talent_map", () => runTalentMap(job.role_id))}
        />
      )}
      {companies.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c, i) => (
            <Card key={i}>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-medium">{c.name}</h3>
                <StatusChip label={`Tier ${c.tier}`} variant={c.tier === 1 ? "ok" : c.tier === 2 ? "running" : "pending"} />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{c.why_relevant}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sourcing (search strategy) ─────────────────────────────────────────

function SourcingTab({ job, busy, runAction }: StageProps) {
  const tm: Json | undefined = job.state.talent_map;
  const companies: Json[] = tm?.target_companies ?? [];
  const strategies: Json[] = tm?.search_strategies ?? [];

  return (
    <div className="flex flex-col gap-4">
      {companies.length === 0 && <p className="text-sm text-zinc-500">Build the talent map first.</p>}
      {companies.length > 0 && strategies.length === 0 && (
        <ActionButton
          label="Create sourcing strategy" busyLabel="Generating…" busy={busy === "search_strategy"}
          onClick={() => runAction("search_strategy", () => runSearchStrategy(job.role_id))}
        />
      )}
      {strategies.map((s, i) => (
        <Card key={i} title={`${s.name} · ${s.search_type}`}>
          <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">{s.purpose}</p>
          {s.linkedin_boolean && <BooleanBlock label="LinkedIn" value={s.linkedin_boolean} />}
          {s.google_xray && <BooleanBlock label="Google X-ray" value={s.google_xray} />}
          {s.naukri_search && <BooleanBlock label="Naukri" value={s.naukri_search} />}
          {s.github_search && <BooleanBlock label="GitHub" value={s.github_search} />}
        </Card>
      ))}
    </div>
  );
}

function BooleanBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <code className="block overflow-x-auto rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">{value}</code>
    </div>
  );
}

// ── Candidates ─────────────────────────────────────────────────────────

function CandidatesTab({
  roleId, job, refresh, dataVersion,
}: { roleId: string; job: JobDetail; refresh: () => void; dataVersion: number }) {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [roleFamily, setRoleFamily] = useState(job.role_family ?? "");
  const [sourceUrl, setSourceUrl] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [decisionDraft, setDecisionDraft] = useState<Record<string, string>>({});
  // "loading" while the cross-job fetch is in flight, null once it fails or
  // resolves to nothing worth showing — undefined means never fetched yet.
  const [crossJob, setCrossJob] = useState<Record<string, CanonicalCandidate | "loading" | null>>({});

  const loadCandidates = useCallback(() => {
    listCandidates(roleId)
      .then(setCandidates)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load candidates."));
  }, [roleId]);

  useEffect(loadCandidates, [loadCandidates, dataVersion]);

  async function run(name: string, action: () => Promise<unknown>) {
    setBusy(name);
    setError(null);
    try {
      await action();
      loadCandidates();
      refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : `${name} failed.`);
    } finally {
      setBusy(null);
    }
  }

  function toggleExpand(c: Candidate) {
    const opening = expanded !== c.candidate_id;
    setExpanded(opening ? c.candidate_id : null);
    if (opening && c.canonical_candidate_id && crossJob[c.candidate_id] === undefined) {
      setCrossJob((prev) => ({ ...prev, [c.candidate_id]: "loading" }));
      getCandidateGlobal(c.canonical_candidate_id)
        .then((detail) => setCrossJob((prev) => ({ ...prev, [c.candidate_id]: detail })))
        .catch(() => setCrossJob((prev) => ({ ...prev, [c.candidate_id]: null })));
    }
  }

  function saveDecision(candidateId: string, decision: string) {
    return run(`dec-${candidateId}`, () => setRecruiterDecision(roleId, candidateId, decision));
  }

  if (!job.status.icp) return <p className="text-sm text-zinc-500">Build the hiring profile first — candidates are evaluated against it.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-500">
          {candidates?.length ?? 0} candidate{candidates?.length === 1 ? "" : "s"}
        </h2>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          {showAddForm ? "Cancel" : "+ Add candidate"}
        </button>
      </div>

      {showAddForm && (
        <Card title="Add a candidate">
          <div className="flex flex-col gap-2">
            <textarea
              value={sourceText} onChange={(e) => setSourceText(e.target.value)} rows={6}
              placeholder="Paste resume text / LinkedIn profile text / recruiter notes…"
              className="w-full rounded-md border border-zinc-300 p-3 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
            />
            <div className="flex flex-wrap gap-2">
              <input
                value={roleFamily} onChange={(e) => setRoleFamily(e.target.value)} placeholder="role family (sales, csm…)"
                className="flex-1 min-w-40 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
              />
              <input
                value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="source URL (optional)"
                className="flex-1 min-w-40 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
              />
              <ActionButton
                label="Add candidate" busyLabel="Analysing…" busy={busy === "add"}
                disabled={!sourceText.trim() || !roleFamily.trim()}
                onClick={() =>
                  run("add", () => addCandidate(roleId, sourceText, roleFamily, sourceUrl)).then(() => {
                    setSourceText(""); setSourceUrl(""); setShowAddForm(false);
                  })
                }
              />
            </div>
          </div>
        </Card>
      )}

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}

      {candidates === null ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : candidates.length === 0 ? (
        <p className="text-sm text-zinc-500">No candidates yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-2 font-medium">Candidate</th>
                <th className="px-4 py-2 font-medium">Role &amp; company</th>
                <th className="px-4 py-2 font-medium">Tier</th>
                <th className="px-4 py-2 font-medium">Pipeline stage</th>
                <th className="px-4 py-2 font-medium">Outreach</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {candidates.map((c) => {
                const isOpen = expanded === c.candidate_id;
                const stage = job.state.funnel?.[c.candidate_id]?.current_stage ?? "IDENTIFIED";
                const outreachDrafted = Boolean(job.state.outreach?.[c.candidate_id]);
                return (
                  <Fragment key={c.candidate_id}>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                      <td className="px-4 py-2.5 font-medium">
                        <button onClick={() => toggleExpand(c)} className="hover:underline">
                          {c.name}
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                        {c.current_title} @ {c.current_company}
                      </td>
                      <td className="px-4 py-2.5">
                        {c.prioritization ? (
                          <StatusChip label={c.prioritization.tier} variant={tierVariant(c.prioritization.tier)} />
                        ) : (
                          <StatusChip label="—" variant="pending" />
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-zinc-500">{stage}</td>
                      <td className="px-4 py-2.5">
                        <StatusChip label={outreachDrafted ? "Drafted" : "—"} variant={outreachDrafted ? "ok" : "pending"} />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => run(`pri-${c.candidate_id}`, () => prioritizeCandidate(roleId, c.candidate_id))}
                            disabled={busy === `pri-${c.candidate_id}`}
                            className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                          >
                            {busy === `pri-${c.candidate_id}` ? "Scoring…" : c.prioritization ? "Re-rank" : "Prioritize"}
                          </button>
                          <button
                            onClick={() => toggleExpand(c)}
                            className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                          >
                            {isOpen ? "Hide" : "View"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={6} className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/50">
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => run(`scr-${c.candidate_id}`, () => screenCandidate(roleId, c.candidate_id))}
                              disabled={!c.prioritization || busy === `scr-${c.candidate_id}`}
                              className="self-start rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                            >
                              {busy === `scr-${c.candidate_id}` ? "Writing…" : "Generate screening questions"}
                            </button>

                            {c.prioritization && (
                              <div className="grid gap-3 sm:grid-cols-3">
                                <Card title="Why they fit"><List items={c.prioritization.why_they_fit} /></Card>
                                <Card title="Unknown"><List items={c.prioritization.what_is_unknown} /></Card>
                                <Card title="To validate"><List items={c.prioritization.what_to_validate} /></Card>
                              </div>
                            )}

                            {c.prioritization && (
                              <Card title="Recruiter decision">
                                <div className="flex flex-col gap-2">
                                  <div className="flex flex-wrap gap-2">
                                    {["pursue", "pass for now", "revisit later"].map((d) => (
                                      <button
                                        key={d}
                                        onClick={() => saveDecision(c.candidate_id, d)}
                                        disabled={busy === `dec-${c.candidate_id}`}
                                        className={`rounded-md border px-2.5 py-1 text-xs font-medium capitalize disabled:opacity-50 ${
                                          c.prioritization?.recruiter_decision === d
                                            ? "border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                                            : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                                        }`}
                                      >
                                        {d}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <input
                                      value={decisionDraft[c.candidate_id] ?? c.prioritization.recruiter_decision ?? ""}
                                      onChange={(e) =>
                                        setDecisionDraft((prev) => ({ ...prev, [c.candidate_id]: e.target.value }))
                                      }
                                      placeholder="Custom decision…"
                                      className="flex-1 rounded-md border border-zinc-300 px-2 py-1 text-xs outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
                                    />
                                    <button
                                      onClick={() => saveDecision(c.candidate_id, decisionDraft[c.candidate_id] ?? "")}
                                      disabled={busy === `dec-${c.candidate_id}`}
                                      className="rounded-md bg-teal-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50"
                                    >
                                      Save
                                    </button>
                                    {c.prioritization.recruiter_decision && (
                                      <button
                                        onClick={() => saveDecision(c.candidate_id, "")}
                                        disabled={busy === `dec-${c.candidate_id}`}
                                        className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs text-zinc-500 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            )}

                            {crossJob[c.candidate_id] === "loading" && (
                              <p className="text-xs text-zinc-400">Checking other jobs…</p>
                            )}
                            {crossJob[c.candidate_id] && crossJob[c.candidate_id] !== "loading" && (() => {
                              const detail = crossJob[c.candidate_id] as CanonicalCandidate;
                              const others = detail.evaluations.filter((e) => e.role_id !== roleId);
                              if (others.length === 0) return null;
                              return (
                                <Card title={`Seen before — ${others.length} other job${others.length === 1 ? "" : "s"}`}>
                                  <ul className="flex flex-col gap-1.5 text-sm">
                                    {others.map((e) => (
                                      <li key={e.candidate_evaluation_id} className="flex items-center justify-between gap-2">
                                        <span>{e.job_title}</span>
                                        <span className="flex items-center gap-2">
                                          {e.tier && <StatusChip label={`Tier ${e.tier}`} variant={tierVariant(e.tier)} />}
                                          {e.recruiter_decision && (
                                            <span className="text-xs italic text-zinc-500">&ldquo;{e.recruiter_decision}&rdquo;</span>
                                          )}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </Card>
                              );
                            })()}

                            <Card title="Evidence">
                              {c.achievements.length === 0 ? <p className="text-sm text-zinc-400">—</p> : (
                                <ul className="space-y-1 text-sm">
                                  {c.achievements.map((a, i) => (
                                    <li key={i}>
                                      <span className={`mr-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                        a.evidence_level === "VERIFIED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                        : a.evidence_level === "INFERRED" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                      }`}>{a.evidence_level}</span>
                                      {a.fact}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </Card>

                            {job.state.screening?.[c.candidate_id] && (
                              <Card title="Screening — must-ask">
                                <List items={job.state.screening[c.candidate_id].must_ask} />
                              </Card>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Outreach ───────────────────────────────────────────────────────────

function OutreachTab({
  roleId, job, refresh, dataVersion,
}: { roleId: string; job: JobDetail; refresh: () => void; dataVersion: number }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    listCandidates(roleId)
      .then(setCandidates)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load candidates."));
  }, [roleId]);

  useEffect(load, [load, dataVersion]);

  async function generate(candidateId: string) {
    setBusy(candidateId);
    setError(null);
    try {
      await outreachCandidate(roleId, candidateId);
      load();
      refresh(); // job.state.outreach lives on the parent job object, not the candidates list
      setExpanded(candidateId);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not generate outreach.");
    } finally {
      setBusy(null);
    }
  }

  async function markSent(candidateId: string) {
    setBusy(candidateId);
    setError(null);
    try {
      await markOutreachSent(roleId, candidateId);
      refresh(); // job.state.outreach_log + job.state.funnel both live on the parent job object
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not record outreach as sent.");
    } finally {
      setBusy(null);
    }
  }

  if (candidates.length === 0) {
    return <p className="text-sm text-zinc-500">No candidates yet — add some in the Candidates tab.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400">
        Drafts only — sending isn&apos;t built yet (no email/LinkedIn integration). Copy the draft you want to
        use, then mark it sent here once you&apos;ve reached out yourself — that just records your own action
        and moves the pipeline card to Contacted, it doesn&apos;t send anything.
      </div>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}
      {candidates.map((c) => {
        const draft = job.state.outreach?.[c.candidate_id];
        const sentAt: string | undefined = job.state.outreach_log?.[c.candidate_id]?.sent_at;
        const isOpen = expanded === c.candidate_id;
        return (
          <Card key={c.candidate_id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-zinc-500">{c.current_title} @ {c.current_company}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusChip
                  label={sentAt ? "Sent" : draft ? "Drafted" : "No draft"}
                  variant={sentAt ? "ok" : draft ? "running" : "pending"}
                />
                <button
                  onClick={() => generate(c.candidate_id)}
                  disabled={busy === c.candidate_id}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  {busy === c.candidate_id ? "Working…" : draft ? "Regenerate" : "Generate outreach"}
                </button>
                {draft && !sentAt && (
                  <button
                    onClick={() => markSent(c.candidate_id)}
                    disabled={busy === c.candidate_id}
                    className="rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50"
                  >
                    Mark as sent
                  </button>
                )}
                {draft && (
                  <button
                    onClick={() => setExpanded(isOpen ? null : c.candidate_id)}
                    className="text-xs text-teal-700 hover:underline dark:text-teal-400"
                  >
                    {isOpen ? "Hide" : "View"}
                  </button>
                )}
              </div>
            </div>
            {sentAt && (
              <p className="mt-1 text-xs text-zinc-500">Marked sent {new Date(sentAt).toLocaleString()}</p>
            )}
            {isOpen && draft && (
              <div className="mt-3 flex flex-col gap-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <OutreachBlock label="LinkedIn connection note" value={draft.linkedin_connection_note} />
                <OutreachBlock label="InMail" value={draft.linkedin_inmail} />
                <OutreachBlock label="Email" value={draft.email} />
                <OutreachBlock label="Follow-up 1" value={draft.follow_up_1} />
                <OutreachBlock label="Follow-up 2" value={draft.follow_up_2} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function OutreachBlock({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm">{value}</p>
    </div>
  );
}

// ── Pipeline (visual board) ───────────────────────────────────────────

type StageHistoryEntry = { stage: string; at: string; note?: string };

function daysInStage(history: StageHistoryEntry[] | undefined): number | null {
  if (!history || history.length === 0) return null;
  const lastAt = new Date(history[history.length - 1].at).getTime();
  return Math.floor((Date.now() - lastAt) / (1000 * 60 * 60 * 24));
}

function PipelineTab({
  roleId, job, refresh, dataVersion,
}: { roleId: string; job: JobDetail; refresh: () => void; dataVersion: number }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const load = useCallback(() => {
    listCandidates(roleId).then(setCandidates).catch(() => {});
  }, [roleId]);

  useEffect(load, [load, dataVersion]);

  async function moveStage(candidateId: string, stage: string) {
    setBusy(candidateId);
    try {
      await updateFunnelStage(roleId, candidateId, stage, noteDrafts[candidateId] ?? "");
      setNoteDrafts((prev) => ({ ...prev, [candidateId]: "" }));
      load();
      refresh();
    } finally {
      setBusy(null);
    }
  }

  const funnel: Json = job.state.funnel ?? {};

  if (candidates.length === 0) {
    return <p className="text-sm text-zinc-500">No candidates yet — add some in the Candidates tab.</p>;
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3" style={{ minWidth: `${FUNNEL_STAGES.length * 176}px` }}>
        {FUNNEL_STAGES.map((stage, stageIdx) => {
          const inStage = candidates.filter(
            (c) => (funnel[c.candidate_id]?.current_stage ?? "IDENTIFIED") === stage
          );
          return (
            <div
              key={stage}
              className="flex w-44 shrink-0 flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  {stage.replace(/_/g, " ")}
                </h3>
                <span className="text-xs tabular-nums text-zinc-400">{inStage.length}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {inStage.map((c) => {
                  const history: StageHistoryEntry[] = funnel[c.candidate_id]?.stage_history ?? [];
                  const days = daysInStage(history);
                  const isOpen = expanded === c.candidate_id;
                  return (
                    <div
                      key={c.candidate_id}
                      className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <button
                        onClick={() => setExpanded(isOpen ? null : c.candidate_id)}
                        className="block w-full truncate text-left font-medium hover:underline"
                        title={c.name}
                      >
                        {c.name}
                      </button>
                      {days !== null && (
                        <p className="mt-0.5 text-[10px] text-zinc-400">
                          {days === 0 ? "in stage <1d" : `${days}d in stage`}
                        </p>
                      )}
                      <div className="mt-1 flex justify-between">
                        <button
                          onClick={() => moveStage(c.candidate_id, FUNNEL_STAGES[stageIdx - 1])}
                          disabled={stageIdx === 0 || busy === c.candidate_id}
                          className="text-zinc-400 hover:text-zinc-800 disabled:opacity-30 dark:hover:text-zinc-200"
                          aria-label={`Move ${c.name} to previous stage`}
                        >
                          ‹ back
                        </button>
                        <button
                          onClick={() => moveStage(c.candidate_id, FUNNEL_STAGES[stageIdx + 1])}
                          disabled={stageIdx === FUNNEL_STAGES.length - 1 || busy === c.candidate_id}
                          className="text-zinc-400 hover:text-zinc-800 disabled:opacity-30 dark:hover:text-zinc-200"
                          aria-label={`Move ${c.name} to next stage`}
                        >
                          next ›
                        </button>
                      </div>
                      {isOpen && (
                        <div className="mt-2 flex flex-col gap-2 border-t border-zinc-200 pt-2 dark:border-zinc-800">
                          <div className="flex flex-col gap-1">
                            {history.length === 0 ? (
                              <p className="text-[10px] text-zinc-400">No stage history yet.</p>
                            ) : (
                              [...history].reverse().map((h, i) => (
                                <div key={i} className="text-[10px] text-zinc-500">
                                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                    {h.stage.replace(/_/g, " ")}
                                  </span>{" "}
                                  · {new Date(h.at).toLocaleString()}
                                  {h.note && <p className="italic text-zinc-400">&ldquo;{h.note}&rdquo;</p>}
                                </div>
                              ))
                            )}
                          </div>
                          <input
                            value={noteDrafts[c.candidate_id] ?? ""}
                            onChange={(e) =>
                              setNoteDrafts((prev) => ({ ...prev, [c.candidate_id]: e.target.value }))
                            }
                            placeholder="Note for next move (optional)"
                            className="rounded border border-zinc-300 px-1.5 py-1 text-[10px] outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Analytics ──────────────────────────────────────────────────────────

function AnalyticsTab({ roleId, dataVersion }: { roleId: string; dataVersion: number }) {
  const [report, setReport] = useState<Json | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFunnelReport(roleId)
      .then(setReport)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load analytics."));
  }, [roleId, dataVersion]);

  if (error) {
    return <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>;
  }
  if (!report) return <p className="text-sm text-zinc-500">Loading…</p>;

  const rates: [string, number | null][] = [
    ["Contact rate", report.contact_rate], ["Response rate", report.response_rate],
    ["Positive response", report.positive_response_rate], ["Screen conversion", report.screen_conversion],
    ["HM conversion", report.hm_conversion], ["Final conversion", report.final_conversion],
    ["Offer rate", report.offer_rate], ["Offer acceptance", report.offer_acceptance_rate],
    ["Joining rate", report.joining_rate],
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card title="Funnel counts">
        <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {Object.entries(report.counts_by_stage as Record<string, number>).map(([stage, count]) => (
            <div key={stage} className="flex justify-between">
              <span className="text-zinc-500">{stage}</span>
              <span className="tabular-nums">{count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Conversion rates">
        <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {rates.map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-zinc-500">{label}</span>
              <span className="tabular-nums">{value === null ? "—" : `${Math.round(value * 100)}%`}</span>
            </div>
          ))}
        </div>
      </Card>

      {report.biggest_leakage_stage && (
        <Card title="Insight (computed from funnel data — not a separate AI call)">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Biggest leakage: {report.biggest_leakage_stage} — {report.recommended_intervention}
          </p>
        </Card>
      )}
    </div>
  );
}
