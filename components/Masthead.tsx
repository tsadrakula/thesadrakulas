"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGES } from "@/content/site";

export function Masthead() {
  const pathname = usePathname();
  return (
    <header className="masthead">
      <nav className="masthead-nav" aria-label="Primary">
        {PAGES.map((p) => {
          const active = pathname === p.href;
          return (
            <Link key={p.href} href={p.href} className={active ? "active" : ""}>
              {p.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
