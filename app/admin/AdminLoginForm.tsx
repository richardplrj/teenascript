"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data?.error ?? "Incorrect password"); return; }
      router.push("/admin/dashboard");
    } catch { setError("Unable to connect. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] flex">

      {/* ── Left: brand panel ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f0f0d] flex-col justify-between p-12 relative overflow-hidden">

        {/* Background grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-terracotta/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-terracotta/5 blur-[80px] pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {/* TS monogram */}
            <div className="w-10 h-10 bg-terracotta flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-sm font-bold text-white tracking-tight">TS</span>
            </div>
            <span className="font-serif text-xl font-bold text-white tracking-tight">TeenaScript</span>
          </div>
          <p className="font-sans text-xs text-stone-600 tracking-[0.2em] uppercase ml-[52px]">Digital Library</p>
        </div>

        {/* Middle: feature list */}
        <div className="relative z-10 space-y-6">
          <Feature
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            }
            title="Curated Library"
            desc="Browse and manage a growing collection of scholarly articles."
          />
          <Feature
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            }
            title="Plagiarism Detection"
            desc="TF-IDF cosine similarity engine for accurate originality checks."
          />
          <Feature
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            }
            title="Admin Dashboard"
            desc="Full control over articles, checks, and library statistics."
          />
        </div>

        {/* Bottom: quote */}
        <div className="relative z-10">
          <div className="w-8 h-px bg-terracotta mb-5" />
          <blockquote className="font-serif text-lg text-stone-400 leading-relaxed mb-4 italic">
            &ldquo;A library is the delivery room for the birth of ideas.&rdquo;
          </blockquote>
          <p className="font-sans text-xs text-stone-600">— Norman Cousins</p>
        </div>
      </div>

      {/* ── Right: form panel ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream dark:bg-dark-bg">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex items-center gap-3">
            <div className="w-8 h-8 bg-terracotta flex items-center justify-center">
              <span className="font-serif text-xs font-bold text-white">TS</span>
            </div>
            <span className="font-serif text-lg font-bold text-charcoal dark:text-stone-100">TeenaScript</span>
          </div>

          <div className="mb-10">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-terracotta mb-3">Restricted access</p>
            <h1 className="font-serif text-3xl font-bold text-charcoal dark:text-stone-100 mb-2">Admin Login</h1>
            <p className="font-sans text-sm text-stone-500 dark:text-stone-400">Enter your password to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label className="block font-sans text-xs font-semibold tracking-wide uppercase text-stone-500 dark:text-stone-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password…"
                autoFocus
                className="w-full font-sans text-sm bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border px-4 py-3 text-charcoal dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-terracotta transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <span className="text-red-500 text-sm">✕</span>
                <p className="font-sans text-xs text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!password || loading}
              className="w-full font-sans text-sm font-medium bg-charcoal dark:bg-stone-100 text-cream dark:text-charcoal px-6 py-3.5 hover:bg-terracotta dark:hover:bg-terracotta dark:hover:text-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying…
                </>
              ) : (
                <>Enter Dashboard <span aria-hidden className="ml-1">→</span></>
              )}
            </button>
          </form>

          <p className="font-sans text-xs text-stone-400 dark:text-stone-600 mt-8 text-center">
            TeenaScript · Admin Portal
          </p>
        </div>
      </div>

    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 border border-stone-800 flex items-center justify-center text-terracotta flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="font-sans text-sm font-semibold text-stone-300 mb-0.5">{title}</p>
        <p className="font-sans text-xs text-stone-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
