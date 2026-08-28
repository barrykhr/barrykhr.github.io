"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Jobs" },
  { href: "/candidates", label: "Candidates" },
  { href: "/guide", label: "Guide" },
] as const;

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {LINKS.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              active
                ? "bg-teal-700/10 text-teal-800 dark:bg-teal-400/10 dark:text-teal-400"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
