import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return { title: "Article — TeenaScript" };
  const article = await prisma.article.findUnique({ where: { id }, select: { title: true, author: true, content: true } });
  if (!article) return { title: "Article Not Found — TeenaScript" };
  return {
    title:       `${article.title} — TeenaScript`,
    description: `${article.author} · ${article.content.slice(0, 155).trimEnd()}…`,
  };
}

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

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const [article, relatedRaw] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.article.findMany({
      where: { NOT: { id } },
      select: { id: true, title: true, author: true, category: true, content: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  if (!article) notFound();

  const wordCount = article.content.trim().split(/\s+/).length;
  const readTime  = Math.ceil(wordCount / 200);

  const related = relatedRaw
    .filter((a) => a.category === article.category)
    .slice(0, 3);

  const paragraphs = article.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-[680px] mx-auto">

          {/* Back */}
          <Link href="/" className="inline-flex items-center gap-1.5 font-sans text-sm text-stone-400 dark:text-stone-500 hover:text-terracotta transition-colors mb-10">
            <span aria-hidden>←</span> Back to library
          </Link>

          {/* Category */}
          <div className="mb-6">
            <Link
              href={`/category/${article.category.toLowerCase()}`}
              className={`inline-block font-sans text-xs font-medium px-2.5 py-0.5 border rounded-full hover:opacity-80 transition-opacity ${badge(article.category)}`}
            >
              {article.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-stone-100 leading-[1.15] mb-6">
            {article.title}
          </h1>

          {/* Byline */}
          <div className="flex items-center justify-between mb-10 pb-10 border-b border-stone-200 dark:border-dark-border">
            <div>
              <p className="font-sans text-sm font-medium text-charcoal dark:text-stone-200">{article.author}</p>
              <p className="font-sans text-xs text-stone-400 dark:text-stone-500 mt-0.5">{formatDate(article.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="font-sans text-xs text-stone-400 dark:text-stone-500">{readTime} min read</p>
              <p className="font-sans text-xs text-stone-400 dark:text-stone-500 mt-0.5">{wordCount.toLocaleString()} words</p>
            </div>
          </div>

          {/* Article body */}
          <article className="article-body">
            {paragraphs.map((para, i) => (
              <p key={i} className="font-serif text-[1.075rem] text-charcoal dark:text-stone-200 leading-[1.9] mb-7 last:mb-0">
                {para}
              </p>
            ))}
          </article>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-stone-200 dark:border-dark-border">
              <h2 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-6">
                More in {article.category}
              </h2>
              <div className="space-y-4">
                {related.map((r) => {
                  const rWords = r.content.trim().split(/\s+/).length;
                  return (
                    <Link
                      key={r.id}
                      href={`/article/${r.id}`}
                      className="group flex items-start justify-between gap-4 py-4 border-b border-stone-100 dark:border-dark-border last:border-0 hover:border-stone-300 dark:hover:border-stone-600 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base font-bold text-charcoal dark:text-stone-100 group-hover:text-terracotta transition-colors leading-snug mb-1 line-clamp-2">
                          {r.title}
                        </p>
                        <p className="font-sans text-xs text-stone-400 dark:text-stone-500">
                          {r.author} · {Math.ceil(rWords / 200)} min read
                        </p>
                      </div>
                      <span className="font-sans text-xs text-terracotta mt-1 shrink-0">Read →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom back link */}
          <div className="mt-16 pt-10 border-t border-stone-200 dark:border-dark-border">
            <Link href="/" className="inline-flex items-center gap-1.5 font-sans text-sm text-stone-400 dark:text-stone-500 hover:text-terracotta transition-colors">
              <span aria-hidden>←</span> Back to library
            </Link>
          </div>
        </div>
      </div>
  );
}
