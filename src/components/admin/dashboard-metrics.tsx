import Link from "next/link";

import { getLeadRepository, isUsingMemoryDb } from "@/lib/db";
import { formatEuro } from "@/lib/format";

export async function DashboardMetrics() {
  const repo = getLeadRepository();
  const m = await repo.metrics();

  const cards = [
    { label: "Leads", value: String(m.totalLeads), hint: "Total captado" },
    { label: "Leads cualificados", value: String(m.qualifiedLeads), hint: "Con visita o presupuesto" },
    { label: "Presupuestos enviados", value: String(m.quotesSent), hint: "quote_sent" },
    { label: "Ganados", value: String(m.wonLeads), hint: "Obras ganadas" },
    { label: "Valor contratado", value: formatEuro(m.contractedValue), hint: "Suma contract_amount" },
    { label: "Comisión atribuida", value: formatEuro(m.attributedCommission), hint: "Según base configurada" },
  ];

  return (
    <div>
      {isUsingMemoryDb() ? (
        <p className="mb-4 rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Aviso: sin DATABASE_URL se usa almacenamiento en memoria. Los datos se
          pierden al reiniciar. Configura PostgreSQL para producción.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-sm border border-line bg-paper p-6"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-bronze-deep">
              {card.label}
            </p>
            <p className="mt-3 font-display text-3xl text-ink">
              {card.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/leads"
          className="inline-flex items-center justify-center rounded-sm bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
        >
          Ver leads
        </Link>
        <Link
          href="/api/admin/leads/export"
          className="inline-flex items-center justify-center rounded-sm border border-ink px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-sand"
        >
          Exportar CSV
        </Link>
      </div>
    </div>
  );
}
