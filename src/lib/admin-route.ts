import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getLeadRepository } from "@/lib/db";

/**
 * Defense-in-depth for admin API routes. The proxy already guards /admin
 * and /api/admin, but every mutation also re-verifies the session here.
 */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : false;
}

/** Convenience for admin route handlers. */
export async function requireAdmin(): Promise<Response | null> {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

/** Returns the lead id parsed from a RouteContext params promise. */
export async function getRouteId(params: Promise<{ id: string }>): Promise<number | null> {
  const { id } = await params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export { getLeadRepository };
