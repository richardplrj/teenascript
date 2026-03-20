import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import DashboardClient, { type ArticleRow, type ReportRow, type Stats } from "./DashboardClient";
import type { CategoryData } from "./Charts";

export const metadata: Metadata = {
  title:  "Admin Dashboard — TeenaScript",
  robots: { index: false, follow: false },
};

function requireAdmin() {
  if (cookies().get("admin_session")?.value !== "authenticated") redirect("/admin");
}

export default async function DashboardPage() {
  requireAdmin();

  const [articles, reportRows, aggregate, checkCount, categoryGroups] = await Promise.all([
    prisma.article.findMany({
      select: { id: true, title: true, author: true, category: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plagiarismReport.findMany({
      select: { id: true, inputText: true, overallScore: true, results: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.plagiarismReport.aggregate({ _avg: { overallScore: true } }),
    prisma.plagiarismReport.count(),
    prisma.article.groupBy({ by: ["category"], _count: { id: true } }),
  ]);

  const categoryData: CategoryData[] = categoryGroups.map((g) => ({
    category: g.category,
    count:    g._count.id,
  }));

  const stats: Stats = {
    articleCount: articles.length,
    checkCount,
    averageScore: aggregate._avg.overallScore ?? 0,
  };

  return (
    <DashboardClient
      stats={stats}
      articles={articles.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
      reports={reportRows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      categoryData={categoryData}
    />
  );
}
