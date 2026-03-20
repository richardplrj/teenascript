"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export interface ArticleSummary {
  id:         number;
  title:      string;
  author:     string;
  category:   string;
  excerpt:    string;
  searchBlob: string;
  createdAt:  string;
  wordCount:  number;
  readTime:   number;
}

const CATEGORIES = ["All", "Science", "Technology", "Literature", "History", "Philosophy", "Other"];

const CATEGORY_BADGE: Record<string, string> = {
  Science:    "bg-blue-50    dark:bg-blue-950    text-blue-700   dark:text-blue-300   border-blue-100   dark:border-blue-900",
  Technology: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900",
  Literature: "bg-purple-50  dark:bg-purple-950  text-purple-700  dark:text-purple-300  border-purple-100  dark:border-purple-900",
  History:    "bg-amber-50   dark:bg-amber-950   text-amber-700   dark:text-amber-300   border-amber-100   dark:border-amber-900",
  Philosophy: "bg-slate-100  dark:bg-slate-900   text-slate-600   dark:text-slate-300   border-slate-200   dark:border-slate-700",
  Other:      "bg-stone-50   dark:bg-stone-900   text-stone-500   dark:text-stone-400   border-stone-200   dark:border-stone-700",
};

function badge(category: string) {
  return CATEGORY_BADGE[category] ?? "bg-stone-50 text-stone-500 border-stone-200";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function BrowsePage({ articles }: { articles: ArticleSummary[] }) {
  const [query,          setQuery]    = useState("");
  const [activeCategory, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const catOk    = activeCategory === "All" || a.category === activeCategory;
      const searchOk = !q || a.title.toLowerCase().includes(q) || a.searchBlob.includes(q);
      return catOk && searchOk;
    });
  }, [articles, query, activeCategory]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 dark:border-dark-border py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-terracotta mb-5">
            Digital Library
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-charcoal dark:text-stone-100 leading-[1.1] mb-5">
            Explore the Library
          </h1>
          <p className="font-sans text-stone-500 dark:text-stone-400 text-lg mb-10 max-w-lg leading-relaxed">
            A curated collection of scholarly articles across science, technology, literature, and history.
          </p>
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by title or content…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full font-sans text-sm bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border px-4 py-3 pr-10 text-charcoal dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-terracotta transition-colors"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal text-lg leading-none" aria-label="Clear search">×</button>
            )}
          </div>
        </div>
      </section>

      {/* ── Category filter ───────────────────────────────────────────── */}
      <section className="border-b border-stone-200 dark:border-dark-border py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`font-sans text-xs font-medium px-4 py-1.5 rounded-full border transition-colors duration-150 ${
                activeCategory === cat
                  ? "bg-charcoal dark:bg-stone-100 text-cream dark:text-charcoal border-charcoal dark:border-stone-100"
                  : "bg-transparent text-stone-500 dark:text-stone-400 border-stone-300 dark:border-dark-border hover:border-charcoal dark:hover:border-stone-400 hover:text-charcoal dark:hover:text-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto font-sans text-xs text-stone-400 dark:text-stone-500 self-center">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </span>
        </div>
      </section>

      {/* ── Article grid ─────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {articles.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif text-2xl text-stone-300 dark:text-stone-600 mb-3">The library is empty</p>
              <p className="font-sans text-sm text-stone-400 dark:text-stone-500 mb-6">No articles yet. Be the first to upload one!</p>
              <a href="/upload" className="font-sans text-sm font-medium text-terracotta hover:underline underline-offset-4">Upload an article →</a>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-stone-300 dark:text-stone-600 mb-2">No articles found</p>
              <p className="font-sans text-sm text-stone-400 dark:text-stone-500">Try a different search term or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <div
                  key={article.id}
                  className="group bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border p-6 hover:-translate-y-1 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-sm transition-all duration-200"
                >
                  <Link
                    href={`/category/${article.category.toLowerCase()}`}
                    className={`inline-block font-sans text-xs font-medium px-2.5 py-0.5 border rounded-full mb-4 hover:opacity-80 transition-opacity ${badge(article.category)}`}
                  >
                    {article.category}
                  </Link>
                  <Link href={`/article/${article.id}`} className="block">
                    <h2 className="font-serif text-lg font-bold text-charcoal dark:text-stone-100 leading-snug mb-2 group-hover:text-terracotta transition-colors">
                      {article.title}
                    </h2>
                    <p className="font-sans text-xs text-stone-400 dark:text-stone-500 mb-3">
                      {article.author}
                      <span className="mx-1.5">·</span>
                      {formatDate(article.createdAt)}
                    </p>
                    <p className="font-sans text-xs text-stone-400 dark:text-stone-500 mb-3">
                      {article.readTime} min read · {article.wordCount.toLocaleString("en-US")} words
                    </p>
                    <p className="font-sans text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
