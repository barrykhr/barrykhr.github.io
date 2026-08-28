"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function AccountMenu() {
  const router = useRouter();
  const { user, refresh } = useAuth();

  if (!user) return <span className="text-xs text-zinc-500">recruiter stays the decision-maker</span>;

  async function handleLogout() {
    await logout();
    refresh();
    router.replace("/login");
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-500">{user.email}</span>
      <button
        onClick={handleLogout}
        className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        Log out
      </button>
    </div>
  );
}
