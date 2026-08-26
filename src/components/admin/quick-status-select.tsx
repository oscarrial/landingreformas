"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LEAD_STATUS_LABELS, LEAD_STATUSES } from "@/lib/db/types";
import { STATUS_BADGE_CLASSES } from "@/components/admin/lead-status";

/**
 * Inline status change on the leads list: flips a lead between
 * Nuevo / Contactado / Cualificado / Visita / Presupuesto enviado /
 * Ganado / Perdido without opening the detail page.
 */
export function QuickStatusSelect({
  leadId,
  status,
}: {
  leadId: number;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const change = async (next: string) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
    } finally {
      setBusy(false);
      router.refresh();
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => change(e.target.value)}
      disabled={busy}
      aria-label="Cambiar estado"
      title={LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS]}
      className={`cursor-pointer rounded-sm px-2 py-1 text-xs font-semibold outline-none transition-opacity disabled:opacity-50 ${STATUS_BADGE_CLASSES[status]}`}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {LEAD_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
