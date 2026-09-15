import type { Lead } from "@/lib/db/types";
import { areaLabel, reformTypeLabel, timeframeLabel } from "@/lib/lead-labels";

/**
 * Lead email notification — SERVER ONLY.
 *
 * The destination address and SMTP credentials live exclusively in env vars
 * read here; they are never exposed to the browser (no NEXT_PUBLIC_, nothing
 * in siteConfig or client components). Nothing can sniff the address from
 * the served HTML or JS.
 *
 * Sending paths (first one configured wins):
 *  1. SMTP (nodemailer): SMTP_HOST + SMTP_USER + SMTP_PASS (+ optional port/secure).
 *  2. LEAD_EMAIL_WEBHOOK_URL: an external endpoint (Make / n8n / Zapier…) that
 *     sends the email. Useful when no SMTP credentials are available.
 *  3. Nothing configured → status "disabled" (lead still stored + notified
 *     via webhook if set).
 */

export type EmailSendStatus = "sent" | "disabled" | "failed";

const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? "inteliagroup1@gmail.com";

function line(label: string, value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  return `${label}: ${value}\n`;
}

function buildEmailText(lead: Lead): string {
  const a = lead.attribution;
  return [
    `Nuevo lead de presupuesto`,
    ``,
    `Lead: ${lead.lead_id}`,
    `Fecha: ${new Date(lead.created_at).toLocaleString("es-ES")}`,
    ``,
    `Contacto`,
    line("Nombre", lead.name),
    line("Teléfono", lead.phone),
    line("Email", lead.email),
    ``,
    `Proyecto`,
    line("Reforma", reformTypeLabel(lead.reform_type)),
    line("Superficie", lead.size_m2 ? `${lead.size_m2} m²` : "No lo sé"),
    line("Zona", areaLabel(lead.area)),
    line("Cuándo empezar", timeframeLabel(lead.start_timeframe)),
    ``,
    `Origen`,
    line("Página de llegada", a.landing_page),
    line("UTM source", a.utm_source),
    line("UTM campaign", a.utm_campaign),
    line("Referrer", a.referrer),
  ]
    .filter((x) => x !== "")
    .join("\n");
}

export async function sendLeadEmail(lead: Lead): Promise<EmailSendStatus> {
  // Path 2: external webhook that sends the email.
  const webhookUrl = process.env.LEAD_EMAIL_WEBHOOK_URL;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (webhookUrl) {
    try {
      const controller = new AbortController();
      // Apps Script cold starts can pass 5 s; give the bridge time to respond.
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: LEAD_EMAIL_TO,
          subject: `Nuevo lead · ${lead.lead_id}`,
          text: buildEmailText(lead),
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      return res.ok ? "sent" : "failed";
    } catch (err) {
      console.error("[email] webhook failed:", err);
      return "failed";
    }
  }

  // Path 1: SMTP.
  if (host && user && pass) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user, pass },
      });
      await transporter.sendMail({
        from: `"Intelia Reformas" <${user}>`,
        to: LEAD_EMAIL_TO,
        subject: `Nuevo lead · ${lead.lead_id}`,
        text: buildEmailText(lead),
      });
      return "sent";
    } catch (err) {
      console.error("[email] SMTP failed:", err);
      return "failed";
    }
  }

  // Path 3: nothing configured.
  return "disabled";
}
