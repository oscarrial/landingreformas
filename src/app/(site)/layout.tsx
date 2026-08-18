import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { CookieBanner } from "@/components/widgets/cookie-banner";
import { WhatsAppButton } from "@/components/widgets/whatsapp-button";
import { MobileStickyCta } from "@/components/widgets/mobile-sticky-cta";
import { ScrollToTop } from "@/components/widgets/scroll-to-top";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalyticsProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[0.125rem] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <MobileStickyCta />
      <WhatsAppButton />
      <CookieBanner />
    </AnalyticsProvider>
  );
}
