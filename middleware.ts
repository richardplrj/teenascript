import { NextRequest, NextResponse } from "next/server";

// Protect every route under /admin/dashboard (and deeper).
// If the admin_session cookie is missing or wrong, redirect to /admin.
export function middleware(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;

  if (session !== "authenticated") {
    const loginUrl = new URL("/admin", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
