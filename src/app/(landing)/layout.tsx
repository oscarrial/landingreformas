import { Header } from "@/components/layout/header";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { CookieBanner } from "@/components/widgets/cookie-banner";
import { MobileStickyCta } from "@/components/widgets/mobile-sticky-cta";
import { WhatsAppButton } from "@/components/widgets/whatsapp-button";
import { ScrollToTop } from "@/components/widgets/scroll-to-top";

/**
 * Landing layout — same header as the rest of the site. The landing renders
 * the shared footer. Wrapped in AnalyticsProvider like the (site) layout so
 * GTM, consent mode and the SPA page-view events also run on the home page.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalyticsProvider>
      <ScrollToTop />
      <Header />
      {children}
      <MobileStickyCta />
      <WhatsAppButton />
      <CookieBanner />
    </AnalyticsProvider>
  );
}
