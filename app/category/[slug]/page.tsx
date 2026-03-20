import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

const SLUG_TO_CATEGORY: Record<string, string> = {
  science:    "Science",
  technology: "Technology",
  literature: "Literature",
  history:    "History",
  philosophy: "Philosophy",
  other:      "Other",
};

const CATEGORY_BADGE: Record<string, string> = {
  Science:    "bg-blue-50    dark:bg-blue-950    text-blue-700   dark:text-blue-300   border-blue-100   dark:border-blue-900",
  Technology: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900",
  Literature: "bg-purple-50  dark:bg-purple-950  text-purple-700  dark:text-purple-300  border-purple-100  dark:border-purple-900",
  History:    "bg-amber-50   dark:bg-amber-950   text-amber-700   dark:text-amber-300   border-amber-100   dark:border-amber-900",
  Philosophy: "bg-slate-100  dark:bg-slate-900   text-slate-600   dark:text-slate-300   border-slate-200   dark:border-slate-700",
  Other:      "bg-stone-50   dark:bg-stone-900   text-stone-500   dark:text-stone-400   border-stone-200   dark:border-stone-700",
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = SLUG_TO_CATEGORY[params.slug];
  if (!category) return { title: "Category Not Found — TeenaScript" };
  return { title: `${category} — TeenaScript`, description: `Browse all ${category} articles in TeenaScript.` };
}

export function generateStaticParams() {
  return Object.keys(SLUG_TO_CATEGORY).map((slug) => ({ slug }));
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = SLUG_TO_CATEGORY[params.slug];
  if (!category) notFound();

  const articles = await prisma.article.findMany({
    where: { category },
    select: { id: true, title: true, author: true, content: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const badgeCls = CATEGORY_BADGE[category] ?? "bg-stone-50 text-stone-500 border-stone-200";

  return (
    <div className="min-h-screen px-4 sm:px-6">

      {/* Hero */}
      <section className="border-b border-stone-200 dark:border-dark-border py-16">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 font-sans text-sm text-stone-400 dark:text-stone-500 hover:text-terracotta transition-colors mb-8">
            <span aria-hidden>←</span> All categories
          </Link>
          <div className="mb-4">
            <span className={`inline-block font-sans text-xs font-medium px-2.5 py-0.5 border rounded-full ${badgeCls}`}>
              {category}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-stone-100 leading-tight mb-3">
            {category}
          </h1>
          <p className="font-sans text-stone-500 dark:text-stone-400 text-sm">
            {articles.length} {articles.length === 1 ? "article" : "articles"} in this category
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto">
          {articles.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-stone-300 dark:text-stone-600 mb-3">No articles yet</p>
              <Link href="/upload" className="font-sans text-sm text-terracotta hover:underline">Upload the first one →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => {
                const wordCount = a.content.trim().split(/\s+/).length;
                const rt = Math.ceil(wordCount / 200);
                return (
                  <Link
                    key={a.id}
                    href={`/article/${a.id}`}
                    className="group block bg-white dark:bg-dark-card border border-stone-200 dark:border-dark-border p-6 hover:-translate-y-1 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-sm transition-all duration-200"
                  >
                    <h2 className="font-serif text-lg font-bold text-charcoal dark:text-stone-100 leading-snug mb-2 group-hover:text-terracotta transition-colors">
                      {a.title}
                    </h2>
                    <p className="font-sans text-xs text-stone-400 dark:text-stone-500 mb-1">
                      {a.author} · {formatDate(a.createdAt)}
                    </p>
                    <p className="font-sans text-xs text-stone-400 dark:text-stone-500 mb-3">
                      {rt} min read · {wordCount.toLocaleString("en-US")} words
                    </p>
                    <p className="font-sans text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                      {a.content.slice(0, 160).trimEnd()}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
