import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Proxy (Next.js 16 replacement for middleware).
 * Protects the admin area: pages under /admin and data under /api/admin.
 * Admin is never secured by hiding the URL — auth is enforced here AND
 * inside every admin route handler (defense in depth).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (!isLoginPage && !isLoginApi) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const authed = token ? verifySessionToken(token) : false;

    if (!authed) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      if (pathname.startsWith("/admin")) {
        const url = new URL("/admin/login", request.url);
        return NextResponse.redirect(url);
      }
    }
  }

  // Defense: never index the admin area.
  const response = NextResponse.next();
  if (pathname.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
