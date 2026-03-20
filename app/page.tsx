import { prisma } from "@/lib/db";
import BrowsePage, { type ArticleSummary } from "./components/BrowsePage";

export const dynamic = "force-dynamic";

function readTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return { wordCount: words, readTime: Math.ceil(words / 200) };
}

export default async function Home() {
  const articles = await prisma.article.findMany({
    select: { id: true, title: true, author: true, category: true, content: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized: ArticleSummary[] = articles.map((a) => {
    const { wordCount, readTime: rt } = readTime(a.content);
    return {
      id:         a.id,
      title:      a.title,
      author:     a.author,
      category:   a.category,
      excerpt:    a.content.slice(0, 160).trimEnd(),
      searchBlob: a.content.slice(0, 400).toLowerCase(),
      createdAt:  a.createdAt.toISOString(),
      wordCount,
      readTime:   rt,
    };
  });

  return <BrowsePage articles={serialized} />;
}
