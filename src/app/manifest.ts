import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.descriptor,
    short_name: siteConfig.brandName,
    description: siteConfig.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f4f0",
    theme_color: "#f5f4f0",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
