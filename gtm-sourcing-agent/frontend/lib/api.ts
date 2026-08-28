/**
 * Typed client for the FastAPI service (gtm-sourcing-agent/src/gtm_sourcing_agent/api.py).
 * One function per route, matching the API 1:1 — this file has no business
 * logic of its own, it's a thin wire-format boundary, mirroring how
 * stages/*.py has no HTTP knowledge. Every call throws ApiError with the
 * backend's `detail` message on a non-2xx response, so pages can show the
 * same one-line, no-jargon error the CLI shows instead of a stack trace.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // non-JSON error body — fall back to statusText
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
const get = <T>(path: string) => request<T>(path);

// Every stage response is validated server-side against a Pydantic schema
// (see models/*.py) — the frontend doesn't re-declare each one, since the
// UI only reads a handful of fields per response (see the typed shapes
// below for the ones it does). `Json` is the escape hatch for the rest.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = Record<string, any>;

// ── types (only the fields the UI actually reads) ─────────────────────────

export type PipelineStatus = {
  intake: boolean;
  calibration: boolean;
  icp: boolean;
  talent_map: boolean;
  search_strategy: boolean;
};

export type JobSummary = {
  role_id: string;
  title: string;
  role_family: string | null;
  created_at: string;
  updated_at: string;
  status: PipelineStatus;
  next_stage: string | null;
};

export type JobDetail = JobSummary & {
  state: Json;
};

export type EvidencedFact = { fact: string; evidence_level: "VERIFIED" | "NOT_STATED" | "INFERRED"; source: string };

export type Candidate = {
  candidate_id: string;
  name: string;
  current_company: string;
  current_title: string;
  location: string;
  relevant_experience_summary: string;
  achievements: EvidencedFact[];
  metrics: EvidencedFact[];
  concerns: string[];
  recommended_next_action: string;
  source_url: string;
  prioritization: {
    tier: "A" | "B" | "C" | "D";
    why_they_fit: string[];
    what_is_unknown: string[];
    what_to_validate: string[];
    recruiter_decision: string | null;
  } | null;
};

export type CandidateEvaluationSummary = {
  role_id: string;
  job_title: string;
  candidate_evaluation_id: string;
  tier: "A" | "B" | "C" | "D" | null;
  why_they_fit: string[] | null;
  recruiter_decision: string | null;
};

export type CanonicalCandidate = {
  candidate_id: string;
  name: string;
  current_company: string;
  current_title: string;
  location: string;
  source_url: string;
  evaluations: CandidateEvaluationSummary[];
};

// ── jobs ────────────────────────────────────────────────────────────────

export const listJobs = () => get<JobSummary[]>("/jobs");

export const createJob = (title: string, role_family = "", role_id?: string) =>
  post<JobSummary>("/jobs", { title, role_family, role_id });

export const getJob = (roleId: string) => get<JobDetail>(`/jobs/${roleId}`);

// ── background tasks (Phase 4) ────────────────────────────────────────
// Every LLM-touching stage route below enqueues a task and returns 202
// immediately (see task_queue.py) instead of blocking on the model call.
// waitForTask() polls the real status to completion so call sites below
// keep the exact shape they had before Phase 4 (`await runIcp(...)`
// resolves with the stage result, or throws the real error) — what
// changed underneath is that a slow real model call no longer ties up
// an HTTP request/server thread for its whole duration, it's a handful
// of short polls instead.

export type TaskStatus = "pending" | "running" | "succeeded" | "failed";

export type Task = {
  task_id: string;
  role_id: string;
  kind: string;
  status: TaskStatus;
  args: Json;
  result: Json | null;
  error: string | null;
  created_at: string;
  updated_at: string;
  finished_at: string | null;
};

export const getTask = (roleId: string, taskId: string) => get<Task>(`/jobs/${roleId}/tasks/${taskId}`);
export const listTasks = (roleId: string) => get<Task[]>(`/jobs/${roleId}/tasks`);

const TASK_POLL_INTERVAL_MS = 250;

async function waitForTask<T>(roleId: string, task: Task, onStatus?: (t: Task) => void): Promise<T> {
  let current = task;
  onStatus?.(current);
  while (current.status === "pending" || current.status === "running") {
    await new Promise((resolve) => setTimeout(resolve, TASK_POLL_INTERVAL_MS));
    current = await getTask(roleId, current.task_id);
    onStatus?.(current);
  }
  if (current.status === "failed") {
    throw new ApiError(502, current.error ?? "Task failed.");
  }
  return current.result as T;
}

// ── role-level stages ──────────────────────────────────────────────────

export const runIntake = async (roleId: string, jdText: string) =>
  waitForTask<Json>(roleId, await post<Task>(`/jobs/${roleId}/intake`, { jd_text: jdText }));

export const runCalibrate = async (roleId: string) =>
  waitForTask<Json>(roleId, await post<Task>(`/jobs/${roleId}/calibrate`));

export const runIcp = async (roleId: string) =>
  waitForTask<Json>(roleId, await post<Task>(`/jobs/${roleId}/icp`));

export const runTalentMap = async (roleId: string) =>
  waitForTask<Json>(roleId, await post<Task>(`/jobs/${roleId}/talent-map`));

export const runSearchStrategy = async (roleId: string) =>
  waitForTask<Json>(roleId, await post<Task>(`/jobs/${roleId}/search-strategy`));

// ── candidates ─────────────────────────────────────────────────────────

export const listCandidates = (roleId: string) => get<Candidate[]>(`/jobs/${roleId}/candidates`);

export const addCandidate = async (roleId: string, sourceText: string, roleFamily: string, sourceUrl = "") =>
  waitForTask<Candidate>(
    roleId,
    await post<Task>(`/jobs/${roleId}/candidates`, {
      source_text: sourceText,
      role_family: roleFamily,
      source_url: sourceUrl,
    })
  );

export const prioritizeCandidate = async (roleId: string, candidateId: string) =>
  waitForTask<Json>(roleId, await post<Task>(`/jobs/${roleId}/candidates/${candidateId}/prioritize`));

export const screenCandidate = async (roleId: string, candidateId: string) =>
  waitForTask<Json>(roleId, await post<Task>(`/jobs/${roleId}/candidates/${candidateId}/screen`));

export const outreachCandidate = async (roleId: string, candidateId: string) =>
  waitForTask<Json>(roleId, await post<Task>(`/jobs/${roleId}/candidates/${candidateId}/outreach`));

// ── global candidate roster (Phase 2) ─────────────────────────────────

export const listCandidatesGlobal = () => get<CanonicalCandidate[]>("/candidates");

export const getCandidateGlobal = (candidateId: string) =>
  get<CanonicalCandidate>(`/candidates/${candidateId}`);

// ── AI chat (Phase 3) ─────────────────────────────────────────────────
// Real natural-language routing is unverified without a live API key —
// see docs/product-plan.md Phase 3. What's verified here is the plumbing:
// history persistence and the confirm-before-mutate flow for hiring-
// profile edits.

export type ChatMessage = { role: "user" | "assistant"; text: string };

export type PendingProposal = {
  field: string;
  action: string;
  value: string;
  description: string;
  impact: string;
  role_id: string;
};

export const getChat = (roleId: string) =>
  get<{ messages: ChatMessage[]; pending_proposal: PendingProposal | null }>(`/jobs/${roleId}/chat`);

export const postChat = (roleId: string, message: string) =>
  post<{ reply: string; pending_proposal: PendingProposal | null }>(`/jobs/${roleId}/chat`, { message });

export const confirmChatProposal = (roleId: string, approve: boolean) =>
  post<{ applied: boolean; message: string; icp: Json }>(`/jobs/${roleId}/chat/confirm`, { approve });

// ── funnel ─────────────────────────────────────────────────────────────

export const updateFunnelStage = (roleId: string, candidateId: string, stage: string) =>
  post<Json>(`/jobs/${roleId}/funnel/${candidateId}`, { stage });

export const getFunnelReport = (roleId: string) => get<Json>(`/jobs/${roleId}/funnel/report`);

export const FUNNEL_STAGES = [
  "IDENTIFIED", "REVIEWED", "SHORTLISTED", "CONTACTED", "RESPONDED", "INTERESTED",
  "RECRUITER_SCREEN", "HM_INTERVIEW", "FINAL_INTERVIEW", "OFFER", "ACCEPTED", "JOINED",
] as const;
