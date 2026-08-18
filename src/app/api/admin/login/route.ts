import { NextRequest, NextResponse } from "next/server";

import { createSessionToken, SESSION_COOKIE, isAdminConfigured, verifyAdminPassword } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const LOGIN_MAX_AGE = 7 * 24 * 60 * 60; // seconds

/** POST /api/admin/login — verifies the admin password and sets a session. */
export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return Response.json(
      { error: "El acceso admin no está configurado. Define ADMIN_PASSWORD o ADMIN_PASSWORD_HASH." },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);
  const limit = rateLimit({ key: `admin:login:${ip}`, limit: 10, windowMs: 60_000 });
  if (!limit.ok) {
    return Response.json({ error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!body?.password || typeof body.password !== "string") {
    return Response.json({ error: "Contraseña requerida." }, { status: 400 });
  }

  if (!verifyAdminPassword(body.password)) {
    return Response.json({ error: "Credenciales incorrectas." }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: LOGIN_MAX_AGE,
  });
  return response;
}
