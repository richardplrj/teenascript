"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ToastProvider";
import { CategoryChart, type CategoryData } from "./Charts";

export interface ArticleRow { id: number; title: string; author: string; category: string; createdAt: string; }
export interface ReportRow  { id: number; inputText: string; overallScore: number; results: string; createdAt: string; }
export interface Stats      { articleCount: number; checkCount: number; averageScore: number; }

interface ParsedMatch {
  articleId: number; articleTitle: string; similarityScore: number;
  matchedPairs: { inputSentence: string; librarySentence: string; score: number }[];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function scoreChip(s: number) {
  if (s < 30) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800";
  if (s < 60) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800";
  return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border px-6 py-5">
      <p className="font-sans text-xs font-semibold tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-1">{label}</p>
      <p className="font-serif text-3xl font-bold text-charcoal dark:text-stone-100">{value}</p>
      {sub && <p className="font-sans text-xs text-stone-400 dark:text-stone-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function DeleteButton({ id, onDeleted }: { id: number; onDeleted: (id: number) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading]       = useState(false);
  const { addToast } = useToast();

  async function doDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) { const data = await res.json().catch(() => ({})); addToast(data?.error ?? "Failed to delete article.", "error"); return; }
      onDeleted(id);
      addToast("Article deleted.", "success");
    } finally { setLoading(false); setConfirming(false); }
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="font-sans text-xs text-stone-400 dark:text-stone-500">Sure?</span>
        <button onClick={doDelete} disabled={loading} className="font-sans text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 transition-colors disabled:opacity-50">
          {loading ? "Deleting…" : "Yes"}
        </button>
        <button onClick={() => setConfirming(false)} className="font-sans text-xs text-stone-400 dark:text-stone-500 hover:text-charcoal dark:hover:text-stone-100 transition-colors">Cancel</button>
      </span>
    );
  }
  return (
    <button onClick={() => setConfirming(true)} className="font-sans text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 border border-red-200 dark:border-red-900 hover:border-red-400 px-2.5 py-1 transition-colors">
      Delete
    </button>
  );
}

function ArticlesTable({ articles: initial }: { articles: ArticleRow[] }) {
  const [articles, setArticles] = useState(initial);
  return articles.length === 0 ? (
    <div className="border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-card py-10 text-center">
      <p className="font-sans text-sm text-stone-400 dark:text-stone-500">No articles yet.</p>
    </div>
  ) : (
    <div className="border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-stone-100 dark:border-dark-border text-left">
            <Th w="38%">Title</Th><Th>Author</Th><Th>Category</Th><Th>Date</Th><Th right>Action</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-dark-border">
          {articles.map((a) => (
            <tr key={a.id} className="hover:bg-stone-50 dark:hover:bg-dark-border/30 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/article/${a.id}`} className="font-medium text-charcoal dark:text-stone-200 hover:text-terracotta transition-colors line-clamp-1">{a.title}</Link>
              </td>
              <td className="px-4 py-3 text-stone-500 dark:text-stone-400">{a.author}</td>
              <td className="px-4 py-3">
                <span className="text-xs text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-dark-border px-2 py-0.5 rounded-full">{a.category}</span>
              </td>
              <td className="px-4 py-3 text-xs text-stone-400 dark:text-stone-500 whitespace-nowrap">{fmtDate(a.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                <DeleteButton id={a.id} onDeleted={(id) => setArticles((prev) => prev.filter((x) => x.id !== id))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportsTable({ reports }: { reports: ReportRow[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  function toggle(id: number) {
    setExpanded((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  if (reports.length === 0) {
    return (
      <div className="border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-card py-10 text-center">
        <p className="font-sans text-sm text-stone-400 dark:text-stone-500">No checks run yet.</p>
      </div>
    );
  }
  return (
    <div className="border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-stone-100 dark:border-dark-border text-left">
            <Th>Date</Th><Th w="42%">Input text</Th><Th>Score</Th><Th right>Details</Th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => {
            const isOpen = expanded.has(r.id);
            let matches: ParsedMatch[] = [];
            try { matches = JSON.parse(r.results); } catch { /* ignore */ }
            return (
              <React.Fragment key={r.id}>
                <tr className={`border-b border-stone-100 dark:border-dark-border hover:bg-stone-50 dark:hover:bg-dark-border/30 transition-colors ${isOpen ? "bg-stone-50 dark:bg-dark-border/20" : ""}`}>
                  <td className="px-4 py-3 text-xs text-stone-400 dark:text-stone-500 whitespace-nowrap align-top">{fmtDateTime(r.createdAt)}</td>
                  <td className="px-4 py-3 text-xs text-stone-600 dark:text-stone-400 leading-relaxed align-top">
                    {r.inputText.slice(0, 80)}{r.inputText.length > 80 ? "…" : ""}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className={`text-xs font-semibold px-2 py-0.5 border rounded-full ${scoreChip(r.overallScore)}`}>{r.overallScore.toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <button onClick={() => toggle(r.id)} className="font-sans text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-charcoal dark:hover:text-stone-100 border border-stone-200 dark:border-dark-border hover:border-stone-400 px-2.5 py-1 transition-colors">
                      {isOpen ? "Close" : "View"}
                    </button>
                  </td>
                </tr>
                {isOpen && (
                  <tr className="border-b border-stone-200 dark:border-dark-border bg-stone-50 dark:bg-[#141412]">
                    <td colSpan={4} className="px-4 py-4">
                      {matches.length === 0 ? (
                        <p className="font-sans text-xs text-stone-400 dark:text-stone-500 italic">No matches — text appeared original.</p>
                      ) : (
                        <div className="space-y-3">
                          {matches.map((m) => (
                            <div key={m.articleId} className="bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border p-4">
                              <div className="flex items-center justify-between mb-3">
                                <Link href={`/article/${m.articleId}`} className="font-sans text-sm font-medium text-charcoal dark:text-stone-200 hover:text-terracotta transition-colors">{m.articleTitle}</Link>
                                <span className={`text-xs font-semibold px-2 py-0.5 border rounded-full ${scoreChip(m.similarityScore)}`}>{m.similarityScore.toFixed(1)}%</span>
                              </div>
                              {m.matchedPairs.slice(0, 2).map((p, i) => (
                                <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 p-2">
                                    <span className="block font-sans text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400 mb-1">Your text</span>
                                    <span className="font-sans text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{p.inputSentence}</span>
                                  </div>
                                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 p-2">
                                    <span className="block font-sans text-[10px] font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1">Library · {p.score.toFixed(1)}%</span>
                                    <span className="font-sans text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{p.librarySentence}</span>
                                  </div>
                                </div>
                              ))}
                              {m.matchedPairs.length > 2 && <p className="font-sans text-xs text-stone-400 dark:text-stone-500 mt-1">+{m.matchedPairs.length - 2} more passage{m.matchedPairs.length - 2 > 1 ? "s" : ""}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, w, right }: { children: React.ReactNode; w?: string; right?: boolean }) {
  return (
    <th className={`px-4 py-3 font-sans font-semibold text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 ${right ? "text-right" : "text-left"}`} style={w ? { width: w } : undefined}>
      {children}
    </th>
  );
}

export default function DashboardClient({
  stats, articles, reports, categoryData,
}: {
  stats:         Stats;
  articles:      ArticleRow[];
  reports:       ReportRow[];
  categoryData:  CategoryData[];
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-terracotta mb-2">Admin</p>
            <h1 className="font-serif text-3xl font-bold text-charcoal dark:text-stone-100">Dashboard</h1>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            className="font-sans text-xs text-stone-400 dark:text-stone-500 hover:text-charcoal dark:hover:text-stone-100 border border-stone-200 dark:border-dark-border hover:border-stone-400 px-3 py-1.5 transition-colors disabled:opacity-50">
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="Total Articles"     value={stats.articleCount} sub="in the library" />
          <StatCard label="Plagiarism Checks"  value={stats.checkCount}   sub="total runs" />
          <StatCard label="Average Similarity" value={stats.checkCount > 0 ? `${stats.averageScore.toFixed(1)}%` : "—"} sub={stats.checkCount > 0 ? "across all checks" : "no checks yet"} />
        </div>

        {/* Charts */}
        {categoryData.length > 0 && (
          <div className="mb-12">
            <div className="bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border p-5">
              <p className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-stone-400 dark:text-stone-500 mb-4">Articles by Category</p>
              <CategoryChart data={categoryData} />
            </div>
          </div>
        )}

        {/* Articles */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-stone-500 dark:text-stone-400">All Articles ({articles.length})</h2>
            <Link href="/upload" className="font-sans text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-charcoal dark:hover:text-stone-100 border border-stone-200 dark:border-dark-border hover:border-stone-400 px-3 py-1.5 transition-colors">
              + Add article
            </Link>
          </div>
          <ArticlesTable articles={articles} />
        </section>

        {/* Reports */}
        <section>
          <h2 className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-stone-500 dark:text-stone-400 mb-4">Recent Plagiarism Checks ({reports.length})</h2>
          <ReportsTable reports={reports} />
        </section>

      </div>
    </div>
  );
}
