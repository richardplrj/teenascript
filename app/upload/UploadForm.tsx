"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/app/components/ToastProvider";

const CATEGORIES = ["Science", "Technology", "Literature", "History", "Philosophy", "Other"] as const;
type Category = (typeof CATEGORIES)[number];
interface FormState { title: string; author: string; category: Category | ""; content: string; }

export default function UploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const [form, setForm]       = useState<FormState>({ title: "", author: "", category: "", content: "" });
  const [fileName, setFileName] = useState<string | null>(null);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".txt")) { setErrors((e) => ({ ...e, content: "Only .txt files are supported." })); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => set("content", (ev.target?.result as string) ?? "");
    reader.readAsText(file);
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim())                    e.title    = "Title is required.";
    if (!form.author.trim())                   e.author   = "Author name is required.";
    if (!form.category)                        e.category = "Please select a category.";
    if (!form.content.trim())                  e.content  = "Content is required.";
    else if (form.content.trim().length < 100) e.content  = "Content must be at least 100 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data?.error ?? "Something went wrong."); }
      setStatus("success");
      addToast("Article submitted successfully!", "success");
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setErrorMsg(msg); setStatus("error"); addToast(msg, "error");
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-[560px] mx-auto">

        <Link href="/" className="inline-flex items-center gap-1.5 font-sans text-sm text-stone-400 dark:text-stone-500 hover:text-terracotta transition-colors mb-10">
          <span aria-hidden>←</span> Back to library
        </Link>

        <div className="mb-10">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-terracotta mb-3">Contribute</p>
          <h1 className="font-serif text-4xl font-bold text-charcoal dark:text-stone-100 leading-tight mb-3">Submit an Article</h1>
          <p className="font-sans text-stone-500 dark:text-stone-400 text-sm leading-relaxed">Share your work with the library. All submissions are stored and made available for scholarly reference.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-7">

          <Field label="Title" error={errors.title}>
            <input type="text" placeholder="e.g. The Nature of Consciousness" value={form.title}
              onChange={(e) => set("title", e.target.value)} className={inputCls(!!errors.title)} />
          </Field>

          <Field label="Author" error={errors.author}>
            <input type="text" placeholder="e.g. Dr. Ada Lovelace" value={form.author}
              onChange={(e) => set("author", e.target.value)} className={inputCls(!!errors.author)} />
          </Field>

          <Field label="Category" error={errors.category}>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className={`${inputCls(!!errors.category)} bg-white dark:bg-dark-card appearance-none cursor-pointer`}>
              <option value="" disabled>Select a category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Content" error={errors.content}
            hint={form.content.trim().length > 0 ? `${form.content.trim().length} characters` : "Paste text or upload a .txt file"}>
            <div className="mb-2 flex items-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="font-sans text-xs font-medium px-3 py-1.5 border border-stone-300 dark:border-dark-border text-stone-500 dark:text-stone-400 hover:border-charcoal dark:hover:border-stone-400 hover:text-charcoal dark:hover:text-stone-100 transition-colors">
                Upload .txt file
              </button>
              {fileName && <span className="font-sans text-xs text-stone-400 dark:text-stone-500 truncate max-w-[180px]">{fileName}</span>}
              <input ref={fileRef} type="file" accept=".txt" onChange={handleFileChange} className="hidden" />
            </div>
            <textarea placeholder="Or paste your article text here…" value={form.content}
              onChange={(e) => set("content", e.target.value)} rows={14}
              className={`${inputCls(!!errors.content)} resize-y leading-relaxed`} />
          </Field>

          {status === "error" && (
            <div className="font-sans text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3">{errorMsg}</div>
          )}
          {status === "success" && (
            <div className="font-sans text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-4 py-3">
              Article submitted successfully. Redirecting to the library…
            </div>
          )}

          <div className="pt-2">
            <button type="submit" disabled={status === "loading" || status === "success"}
              className="w-full font-sans text-sm font-medium bg-charcoal dark:bg-stone-100 text-cream dark:text-charcoal px-6 py-3.5 hover:bg-terracotta dark:hover:bg-terracotta dark:hover:text-cream disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              {status === "loading" ? "Submitting…" : "Submit Article"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full font-sans text-sm bg-white dark:bg-dark-card border px-4 py-3 text-charcoal dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none transition-colors ${hasError ? "border-red-400 focus:border-red-500" : "border-stone-200 dark:border-dark-border focus:border-terracotta"}`;
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="font-sans text-xs font-semibold tracking-wide uppercase text-stone-500 dark:text-stone-400">{label}</label>
        {hint && !error && <span className="font-sans text-xs text-stone-400 dark:text-stone-500">{hint}</span>}
        {error && <span className="font-sans text-xs text-red-500">{error}</span>}
      </div>
      {children}
    </div>
  );
}
