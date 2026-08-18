import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/server", () => ({
  after: (cb: () => void | Promise<void>) => {
    void cb();
  },
}));

vi.mock("next/headers", () => ({
  headers: async () =>
    new Headers({ "user-agent": "vitest/lead-api" }),
}));

import { POST } from "@/app/api/leads/route";
import { resetDb, getLeadRepository } from "@/lib/db";
import { resetRateLimiter } from "@/lib/rate-limit";

const validBody = {
  reform_type: "cocina",
  size_m2: 70,
  area: "pozuelo",
  start_timeframe: "3_6_meses",
  name: "Carlos Ruiz",
  phone: "611 222 333",
  email: "",
  consent: true,
  website: "",
  attribution: {
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "cocinas",
    landing_page: "/reformas-cocinas-madrid",
    first_touch_source: "google",
    first_touch_landing: "/",
    last_touch_source: "google",
    last_touch_landing: "/reformas-cocinas-madrid",
  },
};

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }) as never
  );
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    resetDb();
    resetRateLimiter();
    delete process.env.DATABASE_URL;
    delete process.env.LEAD_WEBHOOK_URL;
  });

  it("creates a lead and returns a server-generated id", async () => {
    const res = await post(validBody);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { ok: boolean; lead_id: string };
    expect(data.ok).toBe(true);
    expect(data.lead_id).toMatch(/^[A-Z]{2,3}-\d{8}-[A-Z2-9]{5}$/);

    const repo = getLeadRepository();
    const lead = await repo.findByLeadId(data.lead_id);
    expect(lead).not.toBeNull();
    expect(lead?.name).toBe("Carlos Ruiz");
    expect(lead?.attribution.utm_source).toBe("google");
    expect(lead?.consent_at).toBeTruthy();
  });

  it("accepts the null-filled attribution the browser actually sends", async () => {
    // buildLeadAttribution() emits null for every parameter the visit did not
    // carry. Rejecting null here 400'd every real submission.
    const res = await post({
      ...validBody,
      name: "Marta Peláez",
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
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as { ok: boolean; lead_id: string };
    expect(data.ok).toBe(true);

    const lead = await getLeadRepository().findByLeadId(data.lead_id);
    expect(lead?.name).toBe("Marta Peláez");
    expect(lead?.attribution.utm_source).toBeNull();
  });

  it("rejects invalid payloads with 400", async () => {
    const res = await post({ ...validBody, area: "bad-area" });
    expect(res.status).toBe(400);
    const data = (await res.json()) as { ok: boolean };
    expect(data.ok).toBe(false);
  });

  it("silently drops honeypot submissions (no lead stored)", async () => {
    const res = await post({ ...validBody, website: "bot-value" });
    expect(res.status).toBe(200);
    const repo = getLeadRepository();
    const all = await repo.exportAll();
    expect(all.length).toBe(0);
  });

  it("rate-limits repeated submissions from the same ip", async () => {
    for (let i = 0; i < 10; i++) {
      await post({ ...validBody, name: `Persona ${i}` });
    }
    const res = await post(validBody);
    expect(res.status).toBe(429);
  });
});
