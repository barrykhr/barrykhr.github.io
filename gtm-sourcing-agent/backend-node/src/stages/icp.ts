// Port of stages/icp.py's update_criteria() only -- deterministic
// rubric-tuning edit. run() (the LLM ICP-build call) is ported
// alongside the other AI stages.
import * as storage from "../db/storage.js";

export async function updateCriteria(
  roleId: string, args: { mustHave?: string[] | null; niceToHave?: string[] | null }
) {
  const current = await storage.requireSection(roleId, "icp");
  const updated = { ...current };
  if (args.mustHave != null) updated.must_have = args.mustHave;
  if (args.niceToHave != null) updated.nice_to_have = args.niceToHave;
  await storage.mergeSection(roleId, "icp", updated);
  return updated;
}
