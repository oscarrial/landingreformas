import Link from "next/link";

import { getLeadRepository } from "@/lib/db";
import { formatDate, formatEuro } from "@/lib/format";
import { computeCommission } from "@/lib/commission";
import { LeadDetailForm } from "@/components/admin/lead-detail-form";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const leadId = Number(id);
  const repo = getLeadRepository();
  const lead = Number.isInteger(leadId) ? await repo.findById(leadId) : null;

  if (!lead) {
    return (
      <div className="rounded-sm border border-line bg-paper p-10 text-center">
        <p className="text-ink">Lead no encontrado.</p>
        <Link href="/admin/leads" className="link-ghost mt-3 inline-block text-sm font-semibold text-ink">
          Volver a leads
        </Link>
      </div>
    );
  }

  const commission = computeCommission({
    contractAmount: lead.contract_amount,
    collectedAmount: lead.collected_amount,
    basis: lead.commission_basis,
    rate: lead.commission_rate,
  });

  return (
    <div>
      <Link href="/admin/leads" className="link-ghost text-sm font-semibold text-ink-soft">
        ← Volver a leads
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-lg text-bronze-deep">{lead.lead_id}</h1>
          <p className="mt-1 font-display text-2xl text-ink">{lead.name}</p>
        </div>
        <p className="text-sm text-ink-soft">{formatDate(lead.created_at)}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Read-only summary */}
        <section className="rounded-sm border border-line bg-paper p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            Datos de la solicitud
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Field label="Teléfono" value={lead.phone} />
            <Field label="Email" value={lead.email ?? "—"} />
            <Field label="Reforma" value={reformLabel(lead.reform_type)} />
            <Field label="Zona" value={areaLabel(lead.area)} />
            <Field label="Superficie" value={lead.size_m2 ? `${lead.size_m2} m²` : "No lo sé"} />
            <Field label="Inicio" value={timeframeLabel(lead.start_timeframe)} />
            <Field label="Consentimiento" value={formatDate(lead.consent_at)} />
          </dl>
        </section>

        <section className="rounded-sm border border-line bg-paper p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
            Atribución
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Field label="Fuente (first touch)" value={lead.attribution.first_touch_source ?? "—"} />
            <Field label="Landing (first touch)" value={lead.attribution.first_touch_landing ?? "—"} />
            <Field label="Fuente (last touch)" value={lead.attribution.last_touch_source ?? "—"} />
            <Field label="Landing (last touch)" value={lead.attribution.last_touch_landing ?? "—"} />
            <Field label="UTM campaign" value={lead.attribution.utm_campaign ?? "—"} />
            <Field label="Landing page" value={lead.attribution.landing_page ?? "—"} />
            <Field label="Referrer" value={lead.attribution.referrer ?? "—"} />
            <Field label="Notificación proveedor" value={notifyLabel(lead.notify_status)} />
          </dl>
        </section>
      </div>

      {/* Commission read-only */}
      <section className="mt-6 rounded-sm border border-line bg-paper p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
          Comisión estimada
        </h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <Field label="Base" value={lead.commission_basis === "contract_amount" ? "Contrato" : "Cobrado"} />
          <Field label="Tasa" value={`${(lead.commission_rate * 100).toFixed(0)}%`} />
          <Field
            label="Comisión"
            value={commission ? formatEuro(commission.amount) : "—"}
            strong
          />
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          La base se configura por lead: contrato o cobrado. Confirma la base
          legal aplicable en cada operación.
        </p>
      </section>

      {/* Editable form */}
      <div className="mt-6">
        <LeadDetailForm lead={lead} />
      </div>
    </div>
  );
}

function Field({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className={`mt-1 break-words ${strong ? "font-display text-xl text-ink" : "text-ink"}`}>
        {value}
      </dd>
    </div>
  );
}

function reformLabel(v: string): string {
  return (
    {
      vivienda_completa: "Vivienda completa",
      piso: "Piso",
      cocina: "Cocina",
      bano: "Baño",
      chalet: "Chalet",
      otro: "Otro",
    }[v] ?? v
  );
}
function areaLabel(v: string | null): string {
  if (!v) return "—";
  return (
    {
      madrid: "Madrid capital",
      pozuelo: "Pozuelo",
      majadahonda: "Majadahonda",
      las_rozas: "Las Rozas",
      boadilla: "Boadilla",
      otro: "Otro",
    }[v] ?? v
  );
}
function timeframeLabel(v: string): string {
  return (
    {
      lo_antes_posible: "Lo antes posible",
      "1_3_meses": "En 1–3 meses",
      "3_6_meses": "En 3–6 meses",
      mas_adelante: "Más adelante",
    }[v] ?? v
  );
}
function notifyLabel(v: string | null): string {
  return { pending: "Pendiente", sent: "Enviado", failed: "Error", disabled: "Desactivado" }[v ?? ""] ?? "—";
}
