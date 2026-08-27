"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, createJob, JobSummary, listJobs } from "@/lib/api";
import { StatusChip } from "@/components/StatusChip";

const STAGE_LABELS: Record<string, string> = {
  intake: "JD analysed",
  calibration: "Calibrated",
  icp: "Hiring profile",
  talent_map: "Talent map",
  search_strategy: "Sourcing strategy",
};

function jobProgress(job: JobSummary): { done: number; total: number } {
  const values = Object.values(job.status);
  return { done: values.filter(Boolean).length, total: values.length };
}

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [roleFamily, setRoleFamily] = useState("");

  const refresh = () => {
    listJobs()
      .then(setJobs)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not reach the API."));
  };

  useEffect(refresh, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const job = await createJob(title.trim(), roleFamily.trim());
      router.push(`/jobs/${job.role_id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not create the job.");
      setCreating(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="mt-1 text-sm text-zinc-500">Every hiring assignment is a persistent workspace.</p>
        </div>
      </div>

      <form
        onSubmit={handleCreate}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex flex-1 min-w-48 flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="title">
            Role title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enterprise AE — Acme"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="role_family">
            Role family
          </label>
          <input
            id="role_family"
            value={roleFamily}
            onChange={(e) => setRoleFamily(e.target.value)}
            placeholder="sales, csm, sdr, engineering…"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <button
          type="submit"
          disabled={creating || !title.trim()}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {creating ? "Creating…" : "New job"}
        </button>
      </form>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {jobs === null && !error ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : jobs && jobs.length === 0 ? (
        <p className="text-sm text-zinc-500">No jobs yet — create one above to get started.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs?.map((job) => {
            const { done, total } = jobProgress(job);
            return (
              <button
                key={job.role_id}
                onClick={() => router.push(`/jobs/${job.role_id}`)}
                className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left transition hover:border-teal-600 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <h2 className="font-medium">{job.title}</h2>
                  {job.role_family && <p className="text-xs text-zinc-500">{job.role_family}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip
                    label={`${done}/${total} stages`}
                    variant={done === total ? "ok" : done === 0 ? "pending" : "running"}
                  />
                  {job.next_stage && (
                    <span className="text-xs text-zinc-500">
                      next: {STAGE_LABELS[job.next_stage] ?? job.next_stage}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
