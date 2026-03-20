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
    const reports = await prisma.plagiarismReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id:           true,
        inputText:    true,
        overallScore: true,
        results:      true,
        createdAt:    true,
      },
    });

    const serialized = reports.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("[GET /api/admin/reports]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
