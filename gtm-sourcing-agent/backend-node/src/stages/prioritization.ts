// Port of stages/prioritization.py's deterministic write paths only
// (set_recruiter_decision, set_placement). run() -- the LLM-calling
// re-rank -- is ported alongside the other AI stages, not here.
import { StorageError } from "../db/storage.js";
import * as storage from "../db/storage.js";

export async function setRecruiterDecision(roleId: string, candidateId: string, decision: string) {
  const state = await storage.loadRole(roleId);
  const prioritizations = state.prioritizations ?? {};
  if (!(candidateId in prioritizations)) {
    throw new StorageError(`candidate '${candidateId}' has not been prioritized yet for role '${roleId}'`);
  }
  const record = { ...prioritizations[candidateId] };
  record.recruiter_decision = decision || null;
  await storage.mergePrioritization(roleId, candidateId, record);
  return { candidate_id: candidateId, recruiter_decision: record.recruiter_decision };
}

export async function setPlacement(roleId: string, candidateId: string, placed: boolean, fee = 0.0) {
  const state = await storage.loadRole(roleId);
  const prioritizations = state.prioritizations ?? {};
  if (!(candidateId in prioritizations)) {
    throw new StorageError(`candidate '${candidateId}' has not been prioritized yet for role '${roleId}'`);
  }
  const record = { ...prioritizations[candidateId] };
  record.placed = placed;
  record.placement_fee = placed ? fee : 0.0;
  record.placed_at = placed ? new Date().toISOString() : null;
  await storage.mergePrioritization(roleId, candidateId, record);
  return {
    candidate_id: candidateId, placed: record.placed,
    placement_fee: record.placement_fee, placed_at: record.placed_at,
  };
}
