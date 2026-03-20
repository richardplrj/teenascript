import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page Not Found — TeenaScript" };

export default function NotFound() {
  return (
    <div className="min-h-[72vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-terracotta mb-5">404</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-stone-100 mb-4 leading-tight">Page not found</h1>
        <p className="font-sans text-stone-400 dark:text-stone-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-terracotta hover:underline underline-offset-4 transition-all">
          <span aria-hidden>←</span> Back to the library
        </Link>
      </div>
    </div>
  );
}
