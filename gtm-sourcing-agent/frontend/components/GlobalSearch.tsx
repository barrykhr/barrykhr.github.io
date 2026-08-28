"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { search, SearchResult } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const DEBOUNCE_MS = 200;

export function GlobalSearch() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return; // stale `result` is fine — rendering below is gated on query.trim()
    const timer = setTimeout(() => {
      search(trimmed)
        .then(setResult)
        .catch(() => setResult(null));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function go(path: string) {
    setOpen(false);
    setQuery("");
    setResult(null);
    router.push(path);
  }

  const hasResults = result && (result.jobs.length > 0 || result.candidates.length > 0);

  if (!user) return null; // not logged in yet (e.g. on /login) — nothing to search

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder="Search jobs or candidates…"
        aria-label="Search jobs or candidates"
        className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
      />
      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {!hasResults ? (
            <p className="px-3 py-3 text-sm text-zinc-400">No matches.</p>
          ) : (
            <>
              {result!.jobs.length > 0 && (
                <div>
                  <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Jobs</p>
                  {result!.jobs.map((j) => (
                    <button
                      key={j.role_id}
                      onClick={() => go(`/jobs/${j.role_id}`)}
                      className="block w-full truncate px-3 py-1.5 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {j.title}
                    </button>
                  ))}
                </div>
              )}
              {result!.candidates.length > 0 && (
                <div>
                  <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Candidates</p>
                  {result!.candidates.map((c) => (
                    <button
                      key={c.candidate_id}
                      onClick={() => go(`/candidates/${c.candidate_id}`)}
                      className="block w-full truncate px-3 py-1.5 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {c.name}
                      {c.current_title && (
                        <span className="text-zinc-400"> — {c.current_title}{c.current_company ? ` @ ${c.current_company}` : ""}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
