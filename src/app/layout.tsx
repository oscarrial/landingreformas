import type { Metadata, Viewport } from "next";
import "./globals.css";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.descriptor} · ${siteConfig.brandName}`,
    template: `%s · ${siteConfig.brandName}`,
  },
  description: siteConfig.tagline,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: siteConfig.brandName,
    title: `${siteConfig.descriptor} · ${siteConfig.brandName}`,
    description: siteConfig.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head>
        {/* Open Sauce One — per design spec */}
        <link
          href="https://db.onlinewebfonts.com/c/1cd1e7d71e048159076fd90b39846902?family=Open+Sauce+One"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/42acf9aa4a6dc2f2886a3f682e337ead?family=Open+Sauce+One+Bold"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
