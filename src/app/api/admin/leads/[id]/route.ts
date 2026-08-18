import { NextRequest } from "next/server";

import { requireAdmin, getRouteId } from "@/lib/admin-route";
import { getLeadRepository } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/db/types";
import type { CommissionBasis } from "@/config/site";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/leads/[id] — update lead status / financials / notes.
 * Authorization is enforced here (defense in depth), never only by proxy.
 */
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const id = await getRouteId(ctx.params);
  if (id === null) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const repo = getLeadRepository();
  const lead = await repo.findById(id);
  if (!lead) {
    return Response.json({ error: "Lead no encontrado" }, { status: 404 });
  }

  const patch: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!LEAD_STATUSES.includes(body.status as (typeof LEAD_STATUSES)[number])) {
      return Response.json({ error: "Estado inválido" }, { status: 400 });
    }
    patch.status = body.status;
  }

  const moneyFields = ["quote_amount", "contract_amount", "collected_amount"] as const;
  for (const field of moneyFields) {
    if (body[field] !== undefined) {
      const v = body[field];
      if (v === null || v === "") {
        patch[field] = null;
      } else {
        const n = Number(v);
        if (!Number.isFinite(n) || n < 0) {
          return Response.json({ error: `Importe inválido: ${field}` }, { status: 400 });
        }
        patch[field] = Math.round(n * 100) / 100;
      }
    }
  }

  if (body.lost_reason !== undefined) {
    patch.lost_reason = String(body.lost_reason).slice(0, 2000) || null;
  }
  if (body.internal_notes !== undefined) {
    patch.internal_notes = String(body.internal_notes).slice(0, 4000) || null;
  }
  if (body.assigned_provider !== undefined) {
    patch.assigned_provider = String(body.assigned_provider).slice(0, 200) || null;
  }
  if (body.commission_rate !== undefined) {
    const rate = Number(body.commission_rate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
      return Response.json({ error: "Comisión inválida (0–1)" }, { status: 400 });
    }
    patch.commission_rate = rate;
  }
  if (body.commission_basis !== undefined) {
    if (!["contract_amount", "collected_amount"].includes(String(body.commission_basis))) {
      return Response.json({ error: "Base de comisión inválida" }, { status: 400 });
    }
    patch.commission_basis = body.commission_basis as CommissionBasis;
  }

  const updated = await repo.update(id, patch);
  return Response.json({ ok: true, lead: updated });
}
