// Port of api.py's deterministic per-job candidate routes (subset of
// lines 1094-1322: list, export, share, mark-sent, decision, placement,
// note, contact, attach-existing). AI-triggering candidate routes
// (add/upload/bulk-import/prioritize/screen/outreach draft) and the
// SMTP-send/resume-download/communications routes are deferred to
// Phase 5-7 -- see docs/migration.md.
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import * as storage from "../db/storage.js";
import * as outreachStage from "../stages/outreach.js";
import * as prioritizationStage from "../stages/prioritization.js";
import { logAction, maybeFireDecisionWebhook, runStage } from "../lib/routeHelpers.js";

const AttachExistingCandidateRequest = z.object({ canonical_candidate_id: z.string() });
const CandidateShareRequest = z.object({ visible: z.boolean() });
const RecruiterDecisionRequest = z.object({ decision: z.string() });
const PlacementRequest = z.object({ placed: z.boolean(), fee: z.number().default(0.0) });
const CandidateNoteRequest = z.object({ note: z.string().default("") });
const CandidateContactRequest = z.object({
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
});

function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function registerJobCandidateRoutes(app: FastifyInstance) {
  app.post("/jobs/:roleId/candidates/attach-existing", async (request, reply) => {
    const { roleId } = request.params as { roleId: string };
    const body = AttachExistingCandidateRequest.parse(request.body);
    const result = await runStage(() => storage.attachExistingCandidate(roleId, body.canonical_candidate_id));
    await logAction(request, roleId, "added candidate (from existing profile)", { detail: body.canonical_candidate_id });
    reply.send(result);
  });

  app.get("/jobs/:roleId/candidates", async (request, reply) => {
    const { roleId } = request.params as { roleId: string };
    const state = await storage.loadRole(roleId);
    const candidates = state.candidates ?? {};
    const prioritizations = state.prioritizations ?? {};
    reply.send(
      Object.entries(candidates).map(([cid, c]: [string, any]) => ({
        ...c, candidate_id: cid, prioritization: prioritizations[cid] ?? null,
      }))
    );
  });

  app.get("/jobs/:roleId/candidates/export.csv", async (request, reply) => {
    const { roleId } = request.params as { roleId: string };
    if (!(await storage.jobExists(roleId))) {
      reply.code(404).send({ detail: `job '${roleId}' not found` });
      return;
    }
    const state = await storage.loadRole(roleId);
    const candidates = state.candidates ?? {};
    const prioritizations = state.prioritizations ?? {};
    const funnel = state.funnel ?? {};
    const outreach = state.outreach ?? {};

    const rows = [
      ["Name", "Current title", "Current company", "Tier", "Recruiter decision", "Pipeline stage", "Outreach drafted", "Source URL"],
    ];
    for (const [cid, c] of Object.entries<any>(candidates)) {
      const p = prioritizations[cid] ?? {};
      rows.push([
        c.name ?? "", c.current_title ?? "", c.current_company ?? "",
        p.tier ?? "", p.recruiter_decision ?? "",
        funnel[cid]?.current_stage ?? "IDENTIFIED",
        cid in outreach ? "yes" : "no",
        c.source_url ?? "",
      ]);
    }
    const csv = rows.map((row) => row.map(csvField).join(",")).join("\r\n") + "\r\n";
    reply
      .header("content-type", "text/csv")
      .header("content-disposition", `attachment; filename="${roleId}-candidates.csv"`)
      .send(csv);
  });

  app.get("/jobs/:roleId/candidates/export.json", async (request, reply) => {
    const { roleId } = request.params as { roleId: string };
    if (!(await storage.jobExists(roleId))) {
      reply.code(404).send({ detail: `job '${roleId}' not found` });
      return;
    }
    const state = await storage.loadRole(roleId);
    const candidates = state.candidates ?? {};
    const prioritizations = state.prioritizations ?? {};
    const funnel = state.funnel ?? {};
    const outreach = state.outreach ?? {};
    reply.send({
      role_id: roleId,
      candidates: Object.entries(candidates).map(([cid, c]: [string, any]) => ({
        ...c, candidate_id: cid, prioritization: prioritizations[cid] ?? null,
        pipeline_stage: funnel[cid]?.current_stage ?? "IDENTIFIED",
        stage_history: funnel[cid]?.stage_history ?? [],
        outreach_drafted: cid in outreach,
      })),
    });
  });

  app.patch("/jobs/:roleId/candidates/:candidateId/share", async (request, reply) => {
    const { roleId, candidateId } = request.params as { roleId: string; candidateId: string };
    const body = CandidateShareRequest.parse(request.body);
    const result = await runStage(() => storage.setCandidateClientVisible(roleId, candidateId, body.visible));
    await logAction(request, roleId, body.visible ? "shared candidate with client" : "unshared candidate from client", { candidateId });
    reply.send(result);
  });

  app.post("/jobs/:roleId/candidates/:candidateId/outreach/mark-sent", async (request, reply) => {
    const { roleId, candidateId } = request.params as { roleId: string; candidateId: string };
    const result = await runStage(() => outreachStage.markSent(roleId, candidateId));
    await logAction(request, roleId, "marked outreach sent", { candidateId });
    reply.send(result);
  });

  app.post("/jobs/:roleId/candidates/:candidateId/decision", async (request, reply) => {
    const { roleId, candidateId } = request.params as { roleId: string; candidateId: string };
    const body = RecruiterDecisionRequest.parse(request.body);
    const result = await runStage(() => prioritizationStage.setRecruiterDecision(roleId, candidateId, body.decision));
    await logAction(request, roleId, `set decision: ${body.decision}`, { candidateId });
    await maybeFireDecisionWebhook(roleId, candidateId, body.decision);
    reply.send(result);
  });

  app.post("/jobs/:roleId/candidates/:candidateId/placement", async (request, reply) => {
    const { roleId, candidateId } = request.params as { roleId: string; candidateId: string };
    const body = PlacementRequest.parse(request.body);
    const result = await runStage(() => prioritizationStage.setPlacement(roleId, candidateId, body.placed, body.fee));
    await logAction(request, roleId, body.placed ? "marked candidate placed" : "cleared placement", {
      detail: body.placed ? `fee=${body.fee}` : "", candidateId,
    });
    reply.send(result);
  });

  app.patch("/jobs/:roleId/candidates/:candidateId/note", async (request, reply) => {
    const { roleId, candidateId } = request.params as { roleId: string; candidateId: string };
    const body = CandidateNoteRequest.parse(request.body);
    const result = await runStage(() => storage.setCandidateNote(roleId, candidateId, body.note));
    await logAction(request, roleId, "edited candidate note", { candidateId });
    reply.send(result);
  });

  app.patch("/jobs/:roleId/candidates/:candidateId/contact", async (request, reply) => {
    const { roleId, candidateId } = request.params as { roleId: string; candidateId: string };
    const body = CandidateContactRequest.parse(request.body);
    const result = await runStage(() =>
      storage.setCandidateContact(roleId, candidateId, { phone: body.phone ?? null, email: body.email ?? null })
    );
    await logAction(request, roleId, "updated candidate contact info", { candidateId });
    reply.send(result);
  });
}
