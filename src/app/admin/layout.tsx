import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: `Admin · ${siteConfig.brandName}`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
