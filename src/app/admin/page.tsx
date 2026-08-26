import { DashboardMetrics } from "@/components/admin/dashboard-metrics";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await ensureSchema();
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Panel</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Resumen del pipeline de captación de leads.
      </p>
      <div className="mt-6">
        <DashboardMetrics />
      </div>
    </div>
  );
}
