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

// ── role-level stages ──────────────────────────────────────────────────

export const runIntake = (roleId: string, jdText: string) =>
  post<Json>(`/jobs/${roleId}/intake`, { jd_text: jdText });

export const runCalibrate = (roleId: string) => post<Json>(`/jobs/${roleId}/calibrate`);
export const runIcp = (roleId: string) => post<Json>(`/jobs/${roleId}/icp`);
export const runTalentMap = (roleId: string) => post<Json>(`/jobs/${roleId}/talent-map`);
export const runSearchStrategy = (roleId: string) => post<Json>(`/jobs/${roleId}/search-strategy`);

// ── candidates ─────────────────────────────────────────────────────────

export const listCandidates = (roleId: string) => get<Candidate[]>(`/jobs/${roleId}/candidates`);

export const addCandidate = (roleId: string, sourceText: string, roleFamily: string, sourceUrl = "") =>
  post<Candidate>(`/jobs/${roleId}/candidates`, {
    source_text: sourceText,
    role_family: roleFamily,
    source_url: sourceUrl,
  });

export const prioritizeCandidate = (roleId: string, candidateId: string) =>
  post<Json>(`/jobs/${roleId}/candidates/${candidateId}/prioritize`);

export const screenCandidate = (roleId: string, candidateId: string) =>
  post<Json>(`/jobs/${roleId}/candidates/${candidateId}/screen`);

export const outreachCandidate = (roleId: string, candidateId: string) =>
  post<Json>(`/jobs/${roleId}/candidates/${candidateId}/outreach`);

// ── global candidate roster (Phase 2) ─────────────────────────────────

export const listCandidatesGlobal = () => get<CanonicalCandidate[]>("/candidates");

export const getCandidateGlobal = (candidateId: string) =>
  get<CanonicalCandidate>(`/candidates/${candidateId}`);

// ── funnel ─────────────────────────────────────────────────────────────

export const updateFunnelStage = (roleId: string, candidateId: string, stage: string) =>
  post<Json>(`/jobs/${roleId}/funnel/${candidateId}`, { stage });

export const getFunnelReport = (roleId: string) => get<Json>(`/jobs/${roleId}/funnel/report`);

export const FUNNEL_STAGES = [
  "IDENTIFIED", "REVIEWED", "SHORTLISTED", "CONTACTED", "RESPONDED", "INTERESTED",
  "RECRUITER_SCREEN", "HM_INTERVIEW", "FINAL_INTERVIEW", "OFFER", "ACCEPTED", "JOINED",
] as const;
