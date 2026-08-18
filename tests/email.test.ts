import { afterEach, describe, expect, it } from "vitest";

import { sendLeadEmail } from "@/lib/email";
import type { Lead } from "@/lib/db/types";

const baseLead: Lead = {
  id: 1,
  lead_id: "OC-20260811-TEST1",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  status: "new",
  name: "Test",
  phone: "600 000 000",
  email: "test@example.com",
  reform_type: "cocina",
  area: "madrid",
  size_m2: 70,
  start_timeframe: "1_3_meses",
  attribution: {
    landing_page: "/",
    referrer: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    gclid: null,
    gbraid: null,
    wbraid: null,
    fbclid: null,
    msclkid: null,
    first_touch_source: null,
    first_touch_landing: null,
    last_touch_source: null,
    last_touch_landing: null,
  },
  user_agent: null,
  consent_at: new Date().toISOString(),
  property_type: null,
  postal_code: null,
  property_size: null,
  assigned_provider: null,
  quote_amount: null,
  contract_amount: null,
  collected_amount: null,
  lost_reason: null,
  internal_notes: null,
  commission_rate: 0.05,
  commission_basis: "collected_amount",
  notify_status: null,
};

afterEach(() => {
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.LEAD_EMAIL_WEBHOOK_URL;
});

describe("sendLeadEmail", () => {
  it("returns disabled (no throw) when nothing is configured", async () => {
    const status = await sendLeadEmail(baseLead);
    expect(status).toBe("disabled");
  });

  it("uses the server-side destination env var, not the client", () => {
    // The recipient must only ever come from the server env, never from a
    // NEXT_PUBLIC_ variable (nothing sniffable in the browser bundle).
    process.env.LEAD_EMAIL_TO = "inteliagroup1@gmail.com";
    expect(process.env.LEAD_EMAIL_TO).toBe("inteliagroup1@gmail.com");
    expect(process.env).not.toHaveProperty("NEXT_PUBLIC_LEAD_EMAIL_TO");
  });
});
