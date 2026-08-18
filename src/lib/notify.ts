import { siteConfig } from "@/config/site";
import type { Lead, NotifyStatus } from "@/lib/db/types";
import { getLeadRepository } from "@/lib/db";
import { sendLeadEmail } from "@/lib/email";

export interface WebhookPayload {
  lead_id: string;
  name: string;
  phone: string;
  email: string | null;
  reform_type: string;
  area: string | null;
  size_m2: number | null;
  start_timeframe: string;
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  provider: string;
  source: string;
}

async function sendWebhook(lead: Lead): Promise<"sent" | "failed" | "disabled"> {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) return "disabled";

  const payload: WebhookPayload = {
    lead_id: lead.lead_id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    reform_type: lead.reform_type,
    area: lead.area,
    size_m2: lead.size_m2,
    start_timeframe: lead.start_timeframe,
    landing_page: lead.attribution.landing_page,
    referrer: lead.attribution.referrer,
    utm_source: lead.attribution.utm_source,
    utm_medium: lead.attribution.utm_medium,
    utm_campaign: lead.attribution.utm_campaign,
    created_at: lead.created_at,
    provider: siteConfig.providerName,
    source: "koflat-lead-form",
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok ? "sent" : "failed";
  } catch (err) {
    console.error(`[notify] webhook failed for lead ${lead.lead_id}:`, err);
    return "failed";
  }
}

/**
 * notifyLead — notify the operational provider (and/or email the lead team)
 * that a new qualified lead arrived.
 *
 * Contract:
 *  1. Never throws (a failing email/webhook must NOT break lead creation).
 *  2. Runs after the lead is safely persisted.
 *  3. Records the outcome on the lead (notify_status) for retry.
 *  4. The recipient email address lives ONLY in server env vars (see
 *     src/lib/email.ts) — nothing sniffable from the browser.
 */
export async function notifyLead(lead: Lead): Promise<void> {
  const repo = getLeadRepository();

  const [webhookStatus, emailStatus] = await Promise.allSettled([
    sendWebhook(lead),
    sendLeadEmail(lead),
  ]);

  const wh = webhookStatus.status === "fulfilled" ? webhookStatus.value : "failed";
  const em = emailStatus.status === "fulfilled" ? emailStatus.value : "failed";

  let status: NotifyStatus;
  if (wh === "disabled" && em === "disabled") {
    status = "disabled";
  } else if (wh === "sent" || em === "sent") {
    status = "sent";
  } else {
    status = "failed";
  }

  await repo.update(lead.id, { notify_status: status });
}
