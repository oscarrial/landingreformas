import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createSessionToken,
  hashPassword,
  verifyAdminPassword,
  verifySessionToken,
} from "@/lib/auth";

function setEnv(k: string, v: string | undefined) {
  if (v === undefined) delete process.env[k];
  else process.env[k] = v;
}

afterEach(() => {
  delete process.env.AUTH_SECRET;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_PASSWORD_HASH;
});

describe("admin session tokens", () => {
  it("creates and verifies a token", () => {
    setEnv("AUTH_SECRET", "super-secret-at-least-16-chars");
    const token = createSessionToken(new Date());
    expect(verifySessionToken(token)).toBe(true);
  });

  it("rejects tampered tokens", () => {
    setEnv("AUTH_SECRET", "super-secret-at-least-16-chars");
    const token = createSessionToken(new Date());
    const tampered = token.slice(0, -2) + (token.endsWith("AA") ? "BB" : "AA");
    expect(verifySessionToken(tampered)).toBe(false);
  });

  it("rejects expired tokens", () => {
    setEnv("AUTH_SECRET", "super-secret-at-least-16-chars");
    const expired = createSessionToken(new Date(Date.now() - 8 * 24 * 3600_000));
    expect(verifySessionToken(expired)).toBe(false);
  });

  it("rejects garbage input", () => {
    setEnv("AUTH_SECRET", "super-secret-at-least-16-chars");
    expect(verifySessionToken("")).toBe(false);
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken("not-a-token")).toBe(false);
  });

  it("requires AUTH_SECRET to be configured", () => {
    expect(() => createSessionToken()).toThrow(/AUTH_SECRET/);
  });
});

describe("admin password", () => {
  it("verifies against a stored hash (timing-safe)", () => {
    const hash = hashPassword("mi-password-1");
    setEnv("ADMIN_PASSWORD_HASH", hash);
    expect(verifyAdminPassword("mi-password-1")).toBe(true);
    expect(verifyAdminPassword("otra-password")).toBe(false);
  });

  it("supports plain dev password", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    setEnv("ADMIN_PASSWORD", "dev-pass");
    expect(verifyAdminPassword("dev-pass")).toBe(true);
    expect(verifyAdminPassword("wrong")).toBe(false);
    warn.mockRestore();
  });

  it("returns false when nothing is configured", () => {
    expect(verifyAdminPassword("anything")).toBe(false);
  });
});
