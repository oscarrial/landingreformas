import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

/** LAN IPv4 addresses of this machine (so dev:network works from any device). */
function getLanHosts(): string[] {
  const hosts: string[] = [];
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (address.family === "IPv4" && !address.internal) {
        hosts.push(address.address);
      }
    }
  }
  return hosts;
}

const nextConfig: NextConfig = {
  // All photography is now bundled from src/assets/obra, so the image
  // optimizer needs no remote hosts allowed.
  // Dev only: allow access from LAN devices (next dev -H 0.0.0.0).
  // Without this, Next blocks /_next assets for network origins.
  allowedDevOrigins: [...getLanHosts(), "localhost"],
  // nodemailer uses dynamic requires — keep it external (server-only).
  serverExternalPackages: ["nodemailer"],
};

export default nextConfig;
