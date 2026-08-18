import { requireAdmin } from "@/lib/admin-route";
import { getLeadRepository } from "@/lib/db";

export const dynamic = "force-dynamic";

const CSV_COLUMNS = [
  "lead_id",
  "created_at",
  "status",
  "name",
  "phone",
  "email",
  "reform_type",
  "area",
  "size_m2",
  "start_timeframe",
  "landing_page",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "first_touch_source",
  "first_touch_landing",
  "last_touch_source",
  "last_touch_landing",
  "user_agent",
  "assigned_provider",
  "quote_amount",
  "contract_amount",
  "collected_amount",
  "commission_rate",
  "commission_basis",
  "lost_reason",
  "internal_notes",
] as const;

function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** GET /api/admin/leads/export — CSV of all leads (protected). */
export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const repo = getLeadRepository();
  const leads = await repo.exportAll();

  const header = CSV_COLUMNS.join(",");
  const rows = leads.map((lead) =>
    CSV_COLUMNS.map((col) => {
      switch (col) {
        case "landing_page":
        case "referrer":
        case "utm_source":
        case "utm_medium":
        case "utm_campaign":
        case "utm_term":
        case "utm_content":
        case "gclid":
        case "gbraid":
        case "wbraid":
        case "fbclid":
        case "msclkid":
        case "first_touch_source":
        case "first_touch_landing":
        case "last_touch_source":
        case "last_touch_landing":
          return csvEscape(lead.attribution[col]);
        default:
          return csvEscape((lead as unknown as Record<string, unknown>)[col] as never);
      }
    }).join(",")
  );

  const csv = [header, ...rows].join("\n");
  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
