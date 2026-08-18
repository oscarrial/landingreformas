import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST /api/admin/logout — clears the admin session cookie. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
