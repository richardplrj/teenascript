import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAdmin(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [articleCount, checkCount, aggregate] = await Promise.all([
      prisma.article.count(),
      prisma.plagiarismReport.count(),
      prisma.plagiarismReport.aggregate({ _avg: { overallScore: true } }),
    ]);

    return NextResponse.json({
      articleCount,
      checkCount,
      averageScore: aggregate._avg.overallScore ?? 0,
    });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
