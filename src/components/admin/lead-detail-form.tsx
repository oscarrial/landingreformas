"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Lead } from "@/lib/db/types";
import { LEAD_STATUS_LABELS } from "@/lib/db/types";
import { LeadStatusSelect } from "@/components/admin/lead-status";

export function LeadDetailForm({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [assignedProvider, setAssignedProvider] = useState(lead.assigned_provider ?? "");
  const [quoteAmount, setQuoteAmount] = useState(amountStr(lead.quote_amount));
  const [contractAmount, setContractAmount] = useState(amountStr(lead.contract_amount));
  const [collectedAmount, setCollectedAmount] = useState(amountStr(lead.collected_amount));
  const [lostReason, setLostReason] = useState(lead.lost_reason ?? "");
  const [notes, setNotes] = useState(lead.internal_notes ?? "");
  const [commissionRate, setCommissionRate] = useState(String(lead.commission_rate));
  const [commissionBasis, setCommissionBasis] = useState(lead.commission_basis);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const save = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assigned_provider: assignedProvider,
          quote_amount: quoteAmount || null,
          contract_amount: contractAmount || null,
          collected_amount: collectedAmount || null,
          lost_reason: lostReason,
          internal_notes: notes,
          commission_rate: Number(commissionRate),
          commission_basis: commissionBasis,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMessage({ type: "error", text: data.error ?? "Error al guardar." });
        return;
      }
      setMessage({ type: "ok", text: "Guardado." });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Error de conexión." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-sm border border-line bg-paper p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
        Gestión comercial
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Estado</label>
          <div className="mt-1.5">
            <LeadStatusSelect value={status} onChange={(v) => setStatus(v as Lead["status"])} />
          </div>
        </div>

        <div>
          <label htmlFor="assigned_provider" className="block text-sm font-medium text-ink">
            Proveedor asignado
          </label>
          <input
            id="assigned_provider"
            value={assignedProvider}
            onChange={(e) => setAssignedProvider(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
          />
        </div>

        <MoneyInput label="Presupuesto (€)" value={quoteAmount} onChange={setQuoteAmount} />
        <MoneyInput label="Contratado (€)" value={contractAmount} onChange={setContractAmount} />
        <MoneyInput label="Cobrado (€)" value={collectedAmount} onChange={setCollectedAmount} />

        <div>
          <label className="block text-sm font-medium text-ink">Comisión</label>
          <div className="mt-1.5 flex gap-2">
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-24 rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
              aria-label="Tasa de comisión"
            />
            <select
              value={commissionBasis}
              onChange={(e) => setCommissionBasis(e.target.value as "contract_amount" | "collected_amount")}
              className="flex-1 rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
              aria-label="Base de la comisión"
            >
              <option value="contract_amount">Sobre contrato</option>
              <option value="collected_amount">Sobre cobrado</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="lost_reason" className="block text-sm font-medium text-ink">
            Motivo de pérdida (si aplica)
          </label>
          <input
            id="lost_reason"
            value={lostReason}
            onChange={(e) => setLostReason(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="internal_notes" className="block text-sm font-medium text-ink">
          Notas internas
        </label>
        <textarea
          id="internal_notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
        />
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-sm bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {busy ? "Guardando…" : "Guardar cambios"}
        </button>
        {message ? (
          <p
            role="status"
            className={
              message.type === "ok" ? "text-sm font-medium text-olive" : "text-sm font-medium text-red-700"
            }
          >
            {message.text}
          </p>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-ink-soft">
        Estado actual: {LEAD_STATUS_LABELS[status]}. El estado «Ganado» con
        importes registrados alimenta el cálculo de comisión.
      </p>
    </section>
  );
}

function amountStr(v: number | null): string {
  return v === null || v === undefined ? "" : String(v);
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">{label}</label>
      <input
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
      />
    </div>
  );
}
