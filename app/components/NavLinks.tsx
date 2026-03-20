"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/",       label: "Library",         short: "Library" },
  { href: "/upload", label: "Upload",           short: "Upload"  },
  { href: "/check",  label: "Plagiarism Check", short: "Check"   },
  { href: "/admin",  label: "Admin",            short: "Admin"   },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 sm:gap-6">
      {NAV.map(({ href, label, short }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`font-sans text-sm transition-colors whitespace-nowrap ${
              active
                ? "text-terracotta font-medium"
                : "text-stone-500 dark:text-stone-400 hover:text-charcoal dark:hover:text-stone-100"
            }`}
          >
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
      <ThemeToggle />
    </nav>
  );
}
