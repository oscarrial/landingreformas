import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/db/types";

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  new: "bg-sand text-ink-soft border border-line",
  contacted: "bg-blue-50 text-blue-800 border border-blue-200",
  qualified: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  visit_scheduled: "bg-teal-50 text-teal-800 border border-teal-200",
  quote_sent: "bg-amber-50 text-amber-800 border border-amber-200",
  won: "bg-olive text-paper border border-olive",
  lost: "bg-red-50 text-red-800 border border-red-200",
};

export function LeadStatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Estado del lead"
      className="rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {LEAD_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
