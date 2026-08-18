import Link from "next/link";

import { areas } from "@/config/landing";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper pb-10 pt-14 text-ink">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-3">
            <p className="text-2xl font-extrabold uppercase leading-none tracking-tight">
              {siteConfig.brandName.split(" ")[0]}
              {siteConfig.brandName.split(" ")[1] ? (
                <span className="ml-1.5">{siteConfig.brandName.split(" ")[1]}</span>
              ) : null}
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">
              {siteConfig.descriptor} · {siteConfig.serviceArea}
            </p>
          </div>

          {/* Services */}
          <nav className="lg:col-span-3" aria-label="Servicios">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
              Servicios
            </h2>
            <ul className="mt-5 space-y-3">
              {[
                { label: "Todas las reformas", href: "/reformas" },
                { label: "Reformas integrales", href: "/reformas-integrales-madrid" },
                { label: "Reformas de pisos", href: "/reformas-pisos-madrid" },
                { label: "Reformas de cocinas", href: "/reformas-cocinas-madrid" },
                { label: "Reformas de baños", href: "/reformas-banos-madrid" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-ink/70 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Zones */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
              Zonas
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {areas.slice(0, 8).map((area) => (
                <li key={area} className="text-sm font-medium text-ink-soft">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
              Contacto
            </h2>
            <ul className="mt-5 space-y-3 text-sm font-medium">
              {siteConfig.phone ? (
                <li>
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-ink-soft">
                    {siteConfig.phone}
                  </a>
                </li>
              ) : null}
              <li>
                {/* TODO: placeholder email — replace in site.ts before production */}
                <a href={`mailto:${siteConfig.email}`} className="hover:text-ink-soft">
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-ink-soft">{siteConfig.serviceArea}</li>
              {siteConfig.social.instagram ? (
                <li>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink-soft"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-soft">
            © {new Date().getFullYear()} {siteConfig.brandName}. Plataforma de
            captación de reformas; las obras las ejecuta el proveedor operativo.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-5">
            {[
              { label: "Aviso legal", href: "/aviso-legal" },
              { label: "Privacidad", href: "/privacidad" },
              { label: "Cookies", href: "/cookies" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-ink-soft hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
