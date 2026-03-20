"use client";

import {
  useState, useRef, useEffect, useCallback, ChangeEvent, FormEvent,
} from "react";
import Link from "next/link";

interface MatchedPair { inputSentence: string; librarySentence: string; score: number; }
interface ArticleMatch { articleId: number; articleTitle: string; similarityScore: number; matchedPairs: MatchedPair[]; }
interface CheckResult { overallScore: number; matches: ArticleMatch[]; totalArticles: number; }

function scoreTheme(score: number) {
  if (score < 30) return { label: "Original",       ring: "#16a34a", trackRing: "#dcfce7", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950", border: "border-emerald-200 dark:border-emerald-800", bar: "bg-emerald-400" } as const;
  if (score < 60) return { label: "Some Similarity", ring: "#d97706", trackRing: "#fef3c7", text: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-950",     border: "border-amber-200 dark:border-amber-800",   bar: "bg-amber-400"   } as const;
  return           { label: "High Similarity",       ring: "#dc2626", trackRing: "#fee2e2", text: "text-red-600 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-950",         border: "border-red-200 dark:border-red-800",       bar: "bg-red-400"     } as const;
}

const RADIUS = 54, STROKE_W = 8, CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  const theme = scoreTheme(score);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 60); return () => clearTimeout(t); }, []);
  const offset = animated ? CIRCUMFERENCE * (1 - score / 100) : CIRCUMFERENCE;
  return (
    <div className="flex flex-col items-center">
      <svg width={140} height={140} viewBox="0 0 120 120" className="-rotate-90" aria-label={`Similarity score: ${score}%`}>
        <circle cx={60} cy={60} r={RADIUS} fill="none" stroke={theme.trackRing} strokeWidth={STROKE_W} />
        <circle cx={60} cy={60} r={RADIUS} fill="none" stroke={theme.ring} strokeWidth={STROKE_W} strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: 140, height: 140 }}>
        <span className={`font-serif text-3xl font-bold ${theme.text}`}>{score.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: ArticleMatch }) {
  const [open, setOpen] = useState(false);
  const theme = scoreTheme(match.similarityScore);
  return (
    <div className={`border ${theme.border} bg-white dark:bg-dark-card overflow-hidden`}>
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <Link href={`/article/${match.articleId}`} className="font-serif text-base font-bold text-charcoal dark:text-stone-100 hover:text-terracotta transition-colors leading-snug">
            {match.articleTitle}
          </Link>
          <span className={`shrink-0 font-sans text-sm font-semibold ${theme.text}`}>{match.similarityScore.toFixed(1)}%</span>
        </div>
        <div className="w-full h-1 bg-stone-100 dark:bg-dark-border rounded-full overflow-hidden mb-3">
          <div className={`h-full ${theme.bar} rounded-full transition-all duration-700`} style={{ width: `${match.similarityScore}%` }} />
        </div>
        {match.matchedPairs.length > 0 && (
          <button onClick={() => setOpen((o) => !o)} className="font-sans text-xs text-stone-400 dark:text-stone-500 hover:text-charcoal dark:hover:text-stone-100 transition-colors flex items-center gap-1">
            <span className="inline-block transition-transform duration-200" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
            {open ? "Hide matched passages" : `Show ${match.matchedPairs.length} matched passage${match.matchedPairs.length > 1 ? "s" : ""}`}
          </button>
        )}
      </div>
      {open && match.matchedPairs.length > 0 && (
        <div className="border-t border-stone-100 dark:border-dark-border divide-y divide-stone-100 dark:divide-dark-border">
          {match.matchedPairs.map((pair, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="px-5 py-4 bg-amber-50 dark:bg-amber-950/40 md:border-r border-stone-100 dark:border-dark-border">
                <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-2">Your text</p>
                <p className="font-sans text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{pair.inputSentence}</p>
              </div>
              <div className="px-5 py-4 bg-blue-50 dark:bg-blue-950/40">
                <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-2">Library match · {pair.score.toFixed(1)}%</p>
                <p className="font-sans text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{pair.librarySentence}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-cream" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function CheckClient() {
  const [text, setText]       = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus]   = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult]   = useState<CheckResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const fileRef    = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith(".txt")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setText((ev.target?.result as string) ?? "");
    reader.readAsText(file);
  }

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || status === "loading") return;
    setStatus("loading"); setResult(null); setVisible(false);
    try {
      const res = await fetch("/api/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data?.error ?? "The server returned an error."); }
      const data: CheckResult = await res.json();
      setResult(data); setStatus("done");
      setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(() => setVisible(true), 150); }, 100);
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Unexpected error."); setStatus("error"); }
  }, [text, status]);

  const charCount = text.length;
  const theme = result ? scoreTheme(result.overallScore) : null;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-[720px] mx-auto">

        <div className="mb-10">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-terracotta mb-3">Analysis Tool</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-stone-100 leading-tight mb-3">Plagiarism Checker</h1>
          <p className="font-sans text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-lg">
            Paste your text below or upload a file. We&apos;ll compare it sentence-by-sentence against every article in the library using TF-IDF cosine similarity.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="font-sans text-xs font-semibold tracking-wide uppercase text-stone-500 dark:text-stone-400">Your text</label>
            <button type="button" onClick={() => fileRef.current?.click()} className="font-sans text-xs font-medium px-3 py-1.5 border border-stone-300 dark:border-dark-border text-stone-500 dark:text-stone-400 hover:border-charcoal dark:hover:border-stone-400 hover:text-charcoal dark:hover:text-stone-100 transition-colors whitespace-nowrap">
              {fileName ? `📄 ${fileName}` : "Upload .txt"}
            </button>
            <input ref={fileRef} type="file" accept=".txt" onChange={handleFileChange} className="hidden" />
          </div>

          <textarea
            rows={10}
            placeholder="Paste your article, essay, or research text here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full font-sans text-sm bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border px-4 py-3 text-charcoal dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 leading-relaxed focus:outline-none focus:border-terracotta transition-colors resize-y"
          />

          <div className="flex items-center justify-between mt-1.5 mb-6">
            <span className="font-sans text-xs text-stone-400 dark:text-stone-500">
              {charCount > 0 ? `${charCount.toLocaleString()} characters` : "No text entered"}
            </span>
            {charCount > 0 && charCount < 80 && <span className="font-sans text-xs text-amber-500">Add more text for accurate results</span>}
          </div>

          {status === "error" && (
            <div className="font-sans text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 mb-4">{errorMsg}</div>
          )}

          <button type="submit" disabled={!text.trim() || status === "loading"}
            className="w-full font-sans text-sm font-medium bg-charcoal dark:bg-stone-100 text-cream dark:text-charcoal px-6 py-4 hover:bg-terracotta dark:hover:bg-terracotta dark:hover:text-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2">
            {status === "loading" ? <><Spinner />Analyzing…</> : "Check for Plagiarism"}
          </button>
        </form>

        {result && (
          <div ref={resultsRef} className="mt-16 scroll-mt-20"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>

            <div className={`border ${theme!.border} ${theme!.bg} p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8`}>
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: 140, height: 140 }}>
                <ScoreRing score={result.overallScore} />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-1">Overall Similarity</p>
                <p className={`font-serif text-3xl font-bold ${theme!.text} mb-1`}>{theme!.label}</p>
                <p className="font-sans text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
                  {result.overallScore < 30 ? "Your text shows little overlap with library articles. It appears to be original."
                    : result.overallScore < 60 ? "Moderate similarity detected. Review the matched passages below."
                    : "High overlap found. Please review all matched passages carefully."}
                </p>
              </div>
            </div>

            {result.matches.length === 0 && (
              <div className="text-center py-12 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 mb-8">
                <div className="text-4xl mb-3">✓</div>
                <p className="font-serif text-xl text-charcoal dark:text-stone-100 mb-1">Your text appears to be original!</p>
                <p className="font-sans text-sm text-stone-500 dark:text-stone-400">No significant matches found against library articles.</p>
              </div>
            )}

            {result.matches.length > 0 && (
              <div className="mb-8">
                <h2 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-4">Matched Articles ({result.matches.length})</h2>
                <div className="space-y-3">
                  {result.matches.map((match) => <MatchCard key={match.articleId} match={match} />)}
                </div>
              </div>
            )}

            <p className="font-sans text-xs text-stone-400 dark:text-stone-500 text-center border-t border-stone-200 dark:border-dark-border pt-6">
              This check compared your text against{" "}
              <span className="font-medium text-stone-500 dark:text-stone-400">{result.totalArticles} article{result.totalArticles !== 1 ? "s" : ""}</span>{" "}
              currently in the library.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
