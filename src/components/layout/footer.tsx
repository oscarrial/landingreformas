import Link from "next/link";

import { siteConfig } from "@/config/site";

/**
 * One footer for the whole site (landing + pages + blog).
 * No contact details: operationally they live in the admin panel and the
 * lead email; publicly we only carry the brand and legal links.
 */
export function Footer() {
  return (
    <footer className="border-t border-line bg-paper py-12">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xl font-bold uppercase tracking-tight">
              {siteConfig.brandName.split(" ")[0]}
              {siteConfig.brandName.split(" ")[1] ? (
                <span className="ml-1.5">{siteConfig.brandName.split(" ")[1]}</span>
              ) : null}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
              {siteConfig.descriptor} · {siteConfig.serviceArea}
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft"
            aria-label="Principal"
          >
            {siteConfig.nav.map((item) => (
              <Link key={item.href + item.label} href={item.href} className="hover:text-ink">
                {item.label}
              </Link>
            ))}
            <Link href="/presupuesto#formulario" className="hover:text-ink">
              Presupuesto
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-soft">
            © {new Date().getFullYear()} {siteConfig.brandName} · Creado por Intelia.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            <Link href="/aviso-legal" className="hover:text-ink">
              Aviso legal
            </Link>
            <Link href="/privacidad" className="hover:text-ink">
              Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-ink">
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}