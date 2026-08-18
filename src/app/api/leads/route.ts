import { after } from "next/server";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

import { getLeadRepository, ensureSchema } from "@/lib/db";
import { generateLeadId } from "@/lib/lead-id";
import { notifyLead } from "@/lib/notify";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/validation/lead";

export const dynamic = "force-dynamic";

/**
 * POST /api/leads — creates a qualified lead.
 *
 * Order (never reordered without reason):
 *  1. Rate limit + honeypot (cheap guards first).
 *  2. Server-side validation (Zod).
 *  3. Generate lead id, persist in DB.
 *  4. Only after the DB confirms → schedule notifyLead() (non-blocking).
 *  5. Return the lead id so the client fires `generate_lead`.
 *
 * The external webhook can never block lead creation (after()).
 */
export async function POST(request: NextRequest) {
  // Cheap guards first (rate limit then honeypot).
  const ip = getClientIp(request);
  const limit = rateLimit({
    key: `lead:submit:${ip}`,
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.ok) {
    return Response.json(
      { ok: false, message: "Demasiadas solicitudes. Inténtalo más tarde." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos.";
    return Response.json({ ok: false, message: firstError }, { status: 400 });
  }

  const data = parsed.data;
  if (data.website) {
    // Honeypot triggered — pretend success, drop silently.
    return Response.json({ ok: true, lead_id: null });
  }

  const repo = getLeadRepository();
  await ensureSchema();

  const userAgent = (await headers()).get("user-agent");

  // Generate a unique id server-side (retry on the very unlikely collision).
  let lead = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const leadId = generateLeadId();
    try {
      lead = await repo.create({
        lead_id: leadId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        reform_type: data.reform_type,
        area: data.area,
        size_m2: data.size_m2,
        start_timeframe: data.start_timeframe,
        attribution: data.attribution as never,
        user_agent: userAgent ?? null,
        consent_at: new Date().toISOString(),
      });
      break;
    } catch (err) {
      // Collision on `lead_id` → retry; anything else → rethrow.
      if (attempt === 2 || !isUniqueViolation(err)) throw err;
    }
  }

  if (!lead) {
    return Response.json(
      { ok: false, message: "No pudimos guardar tu solicitud. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  // Persisted OK → notify the provider (non-blocking, failure-tolerant).
  after(async () => {
    await notifyLead(lead!);
  });

  return Response.json({ ok: true, lead_id: lead.lead_id });
}

function isUniqueViolation(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes("unique") ||
    message.includes("23505") ||
    message.includes("lead_id") ||
    message.includes("duplicate")
  );
}
