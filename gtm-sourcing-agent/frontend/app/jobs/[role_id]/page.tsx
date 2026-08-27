"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ApiError,
  Candidate,
  ChatMessage,
  FUNNEL_STAGES,
  Json,
  JobDetail,
  PendingProposal,
  addCandidate,
  confirmChatProposal,
  getChat,
  getFunnelReport,
  getJob,
  listCandidates,
  outreachCandidate,
  postChat,
  prioritizeCandidate,
  runCalibrate,
  runIcp,
  runIntake,
  runSearchStrategy,
  runTalentMap,
  screenCandidate,
  updateFunnelStage,
} from "@/lib/api";
import { StatusChip, tierVariant } from "@/components/StatusChip";

const TABS = [
  "Overview",
  "Hiring Profile",
  "Talent Map",
  "Sourcing",
  "Candidates",
  "Pipeline",
  "AI Chat",
] as const;
type Tab = (typeof TABS)[number];

export default function JobWorkspace() {
  const params = useParams<{ role_id: string }>();
  const roleId = params.role_id;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");
  const [busy, setBusy] = useState<string | null>(null); // which action is in flight

  const refresh = useCallback(() => {
    getJob(roleId)
      .then(setJob)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not reach the API."));
  }, [roleId]);

  useEffect(refresh, [refresh]);

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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
        {job.role_family && <p className="mt-1 text-sm text-zinc-500">{job.role_family}</p>}
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
      {tab === "Hiring Profile" && <HiringProfileTab job={job} busy={busy} runAction={runAction} />}
      {tab === "Talent Map" && <TalentMapTab job={job} busy={busy} runAction={runAction} />}
      {tab === "Sourcing" && <SourcingTab job={job} busy={busy} runAction={runAction} />}
      {tab === "Candidates" && <CandidatesTab roleId={roleId} job={job} refresh={refresh} />}
      {tab === "Pipeline" && <PipelineTab roleId={roleId} job={job} refresh={refresh} />}
      {tab === "AI Chat" && <ChatTab roleId={roleId} refresh={refresh} />}
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

function CandidatesTab({ roleId, job, refresh }: { roleId: string; job: JobDetail; refresh: () => void }) {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [roleFamily, setRoleFamily] = useState(job.role_family ?? "");
  const [sourceUrl, setSourceUrl] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadCandidates = useCallback(() => {
    listCandidates(roleId)
      .then(setCandidates)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load candidates."));
  }, [roleId]);

  useEffect(loadCandidates, [loadCandidates]);

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

  if (!job.status.icp) return <p className="text-sm text-zinc-500">Build the hiring profile first — candidates are evaluated against it.</p>;

  return (
    <div className="flex flex-col gap-4">
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
              onClick={() => run("add", () => addCandidate(roleId, sourceText, roleFamily, sourceUrl))}
            />
          </div>
        </div>
      </Card>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">{error}</div>}

      {candidates === null ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : candidates.length === 0 ? (
        <p className="text-sm text-zinc-500">No candidates yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {candidates.map((c) => {
            const screening = job.state.screening?.[c.candidate_id];
            const outreach = job.state.outreach?.[c.candidate_id];
            const isOpen = expanded === c.candidate_id;
            return (
              <div key={c.candidate_id} className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  onClick={() => setExpanded(isOpen ? null : c.candidate_id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-zinc-500">{c.current_title} @ {c.current_company}</p>
                  </div>
                  {c.prioritization ? (
                    <StatusChip label={`Tier ${c.prioritization.tier}`} variant={tierVariant(c.prioritization.tier)} />
                  ) : (
                    <StatusChip label="Not prioritized" variant="pending" />
                  )}
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-3 border-t border-zinc-200 p-4 dark:border-zinc-800">
                    <div className="flex flex-wrap gap-2">
                      <ActionButton
                        label="Prioritize" busyLabel="Scoring…" busy={busy === `pri-${c.candidate_id}`}
                        onClick={() => run(`pri-${c.candidate_id}`, () => prioritizeCandidate(roleId, c.candidate_id))}
                      />
                      <ActionButton
                        label="Generate screen" busyLabel="Writing…" busy={busy === `scr-${c.candidate_id}`}
                        disabled={!c.prioritization}
                        onClick={() => run(`scr-${c.candidate_id}`, () => screenCandidate(roleId, c.candidate_id))}
                      />
                      <ActionButton
                        label="Generate outreach" busyLabel="Drafting…" busy={busy === `out-${c.candidate_id}`}
                        onClick={() => run(`out-${c.candidate_id}`, () => outreachCandidate(roleId, c.candidate_id))}
                      />
                    </div>

                    {c.prioritization && (
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Card title="Why they fit"><List items={c.prioritization.why_they_fit} /></Card>
                        <Card title="Unknown"><List items={c.prioritization.what_is_unknown} /></Card>
                        <Card title="To validate"><List items={c.prioritization.what_to_validate} /></Card>
                      </div>
                    )}

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

                    {screening && (
                      <Card title="Screening — must-ask">
                        <List items={screening.must_ask} />
                      </Card>
                    )}

                    {outreach && (
                      <Card title="Outreach draft — email">
                        <p className="whitespace-pre-wrap text-sm">{outreach.email || "—"}</p>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Pipeline (funnel) ────────────────────────────────────────────────

function PipelineTab({ roleId, job, refresh }: { roleId: string; job: JobDetail; refresh: () => void }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [report, setReport] = useState<Json | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    listCandidates(roleId).then(setCandidates).catch(() => {});
    getFunnelReport(roleId).then(setReport).catch(() => {});
  }, [roleId]);

  useEffect(load, [load]);

  async function onStageChange(candidateId: string, stage: string) {
    setBusy(candidateId);
    try {
      await updateFunnelStage(roleId, candidateId, stage);
      load();
      refresh();
    } finally {
      setBusy(null);
    }
  }

  const funnel: Json = job.state.funnel ?? {};

  return (
    <div className="flex flex-col gap-4">
      {candidates.length === 0 ? (
        <p className="text-sm text-zinc-500">No candidates yet — add some in the Candidates tab.</p>
      ) : (
        <Card title="Candidates by funnel stage">
          <div className="flex flex-col gap-2">
            {candidates.map((c) => (
              <div key={c.candidate_id} className="flex items-center justify-between gap-3 text-sm">
                <span>{c.name}</span>
                <select
                  value={funnel[c.candidate_id]?.current_stage ?? "IDENTIFIED"}
                  disabled={busy === c.candidate_id}
                  onChange={(e) => onStageChange(c.candidate_id, e.target.value)}
                  className="rounded-md border border-zinc-300 px-2 py-1 text-xs outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
                >
                  {FUNNEL_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>
      )}

      {report && (
        <Card title="Funnel report">
          <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {Object.entries(report.counts_by_stage as Record<string, number>).map(([stage, count]) => (
              <div key={stage} className="flex justify-between">
                <span className="text-zinc-500">{stage}</span>
                <span className="tabular-nums">{count}</span>
              </div>
            ))}
          </div>
          {report.biggest_leakage_stage && (
            <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">
              Biggest leakage: {report.biggest_leakage_stage} — {report.recommended_intervention}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

// ── AI Chat ────────────────────────────────────────────────────────────

function ChatTab({ roleId, refresh }: { roleId: string; refresh: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState<PendingProposal | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    getChat(roleId)
      .then((c) => {
        setMessages(c.messages);
        setPending(c.pending_proposal);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load chat."));
  }, [roleId]);

  useEffect(load, [load]);

  async function send() {
    const message = input.trim();
    if (!message) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setSending(true);
    setError(null);
    try {
      const result = await postChat(roleId, message);
      setMessages((prev) => [...prev, { role: "assistant", text: result.reply }]);
      setPending(result.pending_proposal);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "The assistant didn't respond.");
    } finally {
      setSending(false);
    }
  }

  async function confirm(approve: boolean) {
    setConfirming(true);
    try {
      await confirmChatProposal(roleId, approve);
      setPending(null);
      load();
      refresh(); // the ICP may have just changed
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not apply the change.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="callout-note rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400">
        Ask about this job in plain language — e.g. &ldquo;who have we got so far?&rdquo; or &ldquo;remove Fabric as a
        mandatory requirement.&rdquo; Requirement changes are proposed, never applied automatically — you&apos;ll get an
        explicit confirm/decline step first.
      </div>

      <Card>
        <div className="flex max-h-[28rem] min-h-[12rem] flex-col gap-3 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-zinc-400">No messages yet — ask something below.</p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "self-end bg-teal-700 text-white"
                    : "self-start bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                {m.text}
              </div>
            ))
          )}
        </div>
      </Card>

      {pending && (
        <Card title="Proposed change">
          <p className="text-sm">{pending.description}</p>
          <p className="mt-1 text-sm text-zinc-500">{pending.impact}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => confirm(true)}
              disabled={confirming}
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {confirming ? "Applying…" : "Yes — apply"}
            </button>
            <button
              onClick={() => confirm(false)}
              disabled={confirming}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              No
            </button>
          </div>
        </Card>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !sending && send()}
          placeholder="Ask about this job…"
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <ActionButton label="Send" busyLabel="Sending…" busy={sending} disabled={!input.trim()} onClick={send} />
      </div>
    </div>
  );
}
