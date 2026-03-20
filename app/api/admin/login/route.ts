import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME    = "admin_session";
const COOKIE_VALUE   = "authenticated";
const MAX_AGE_SECS   = 60 * 60 * 24; // 24 hours

export async function POST(req: NextRequest) {
  const body     = await req.json().catch(() => ({}));
  const password = body?.password as string | undefined;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path:     "/",
    maxAge:   MAX_AGE_SECS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
