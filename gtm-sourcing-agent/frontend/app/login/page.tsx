"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, getAuthStatus, login, signup } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signupRequiresCode, setSignupRequiresCode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAuthStatus()
      .then((s) => setSignupRequiresCode(s.signup_requires_code))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        await signup(email, password, signupCode || undefined);
      } else {
        await login(email, password);
      }
      refresh();
      router.replace("/");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-16">
      <div>
        <div className="mb-4 flex gap-1 rounded-md border border-zinc-200 p-1 dark:border-zinc-800">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
                mode === m
                  ? "bg-teal-700 text-white"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {m === "login" ? "Log in" : "Create account"}
            </button>
          ))}
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          {mode === "signup" ? "Create your account" : "Log in"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {mode === "signup"
            ? "A shared recruiting workspace — every account sees the same jobs and candidates."
            : "GTM Sourcing Agent — recruiter stays the decision-maker."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
          />
          {mode === "signup" && <p className="text-xs text-zinc-400">At least 8 characters.</p>}
        </div>
        {mode === "signup" && signupRequiresCode && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500" htmlFor="signup_code">
              Invite code
            </label>
            <input
              id="signup_code"
              required
              value={signupCode}
              onChange={(e) => setSignupCode(e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-zinc-700 dark:bg-zinc-950"
            />
          </div>
        )}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {busy ? "Working…" : mode === "signup" ? "Create account" : "Log in"}
        </button>
      </form>
    </div>
  );
}
