// Port of stages/outreach.py's mark_sent() only -- deterministic
// bookkeeping. run() (the LLM-calling draft generator) is ported
// alongside the other AI stages.
import * as storage from "../db/storage.js";
import { StorageError } from "../db/storage.js";
import * as funnelStage from "./funnel.js";
import { FUNNEL_STAGE_ORDER } from "./funnel.js";

export async function markSent(roleId: string, candidateId: string) {
  const state = await storage.loadRole(roleId);
  const outreach = state.outreach ?? {};
  if (!(candidateId in outreach)) {
    throw new StorageError(`candidate '${candidateId}' has no outreach draft yet for role '${roleId}'`);
  }

  const sentAt = new Date().toISOString();
  (state.outreach_log ??= {})[candidateId] = { sent_at: sentAt };
  await storage.saveRole(roleId, state);

  const funnel = state.funnel ?? {};
  let currentStage = funnel[candidateId]?.current_stage ?? "IDENTIFIED";
  if (FUNNEL_STAGE_ORDER.indexOf(currentStage) < FUNNEL_STAGE_ORDER.indexOf("CONTACTED")) {
    const record = await funnelStage.update(roleId, candidateId, "CONTACTED", { note: "outreach marked sent" });
    currentStage = record.current_stage;
  }

  return { candidate_id: candidateId, sent_at: sentAt, funnel_stage: currentStage };
}
