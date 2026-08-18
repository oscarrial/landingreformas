import { Header } from "@/components/layout/header";
import { CookieBanner } from "@/components/widgets/cookie-banner";
import { MobileStickyCta } from "@/components/widgets/mobile-sticky-cta";
import { WhatsAppButton } from "@/components/widgets/whatsapp-button";
import { ScrollToTop } from "@/components/widgets/scroll-to-top";

/**
 * Landing layout — same header as the rest of the site. The landing renders
 * its own slim footer (mosaic style). Keeps consent + WhatsApp + scroll-top
 * and the mobile sticky CTA the rest of the site already had.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <Header />
      {children}
      <MobileStickyCta />
      <WhatsAppButton />
      <CookieBanner />
    </>
  );
}
