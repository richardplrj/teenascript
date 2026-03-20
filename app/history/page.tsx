import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Check History — TeenaScript",
  description: "Recent plagiarism checks run against the TeenaScript library.",
};

export const dynamic = "force-dynamic";

function scoreTheme(s: number) {
  if (s < 30) return { chip: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", label: "Original" };
  if (s < 60) return { chip: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800", label: "Some similarity" };
  return { chip: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800", label: "High similarity" };
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function HistoryPage() {
  const reports = await prisma.plagiarismReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, inputText: true, overallScore: true, results: true, createdAt: true },
  });

  const entries = reports.map((r) => {
    let matchCount = 0;
    try { matchCount = (JSON.parse(r.results) as unknown[]).length; } catch { /* ignore */ }
    return {
      id:           r.id,
      inputPreview: r.inputText.slice(0, 100),
      overallScore: r.overallScore,
      matchCount,
      createdAt:    r.createdAt.toISOString(),
    };
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-terracotta mb-3">
            Records
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-stone-100 leading-tight mb-3">
            Check History
          </h1>
          <p className="font-sans text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
            The {entries.length} most recent plagiarism checks run against the library.
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="py-20 text-center border border-stone-200 dark:border-dark-border">
            <p className="font-serif text-2xl text-stone-300 dark:text-stone-600 mb-3">No checks yet</p>
            <Link href="/check" className="font-sans text-sm text-terracotta hover:underline">Run your first check →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((e) => {
              const theme = scoreTheme(e.overallScore);
              return (
                <div
                  key={e.id}
                  className="bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`font-sans text-xs font-semibold px-2.5 py-0.5 border rounded-full ${theme.chip}`}>
                        {e.overallScore.toFixed(1)}% — {theme.label}
                      </span>
                      <span className="font-sans text-xs text-stone-400 dark:text-stone-500">
                        {e.matchCount} {e.matchCount === 1 ? "article matched" : "articles matched"}
                      </span>
                    </div>
                    <span className="font-sans text-xs text-stone-400 dark:text-stone-500 shrink-0">
                      {fmtDateTime(e.createdAt)}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed italic">
                    &ldquo;{e.inputPreview}{e.inputPreview.length >= 100 ? "…" : ""}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-stone-200 dark:border-dark-border flex items-center justify-between">
          <Link href="/check" className="font-sans text-sm font-medium text-terracotta hover:underline underline-offset-4">
            Run a new check →
          </Link>
          <span className="font-sans text-xs text-stone-400 dark:text-stone-500">
            Showing last {entries.length} checks
          </span>
        </div>

      </div>
    </div>
  );
}
