import Image from "next/image";
import Link from "next/link";

import { CtaCard } from "@/components/sections/cta-card";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/ui/reveal";
import { landingServices } from "@/config/landing";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Reformas en Madrid",
  description:
    "Los cuatro tipos de reforma que ejecutamos en Madrid: integrales, pisos, cocinas y baños. Alcance de cada uno y a quién le encaja.",
  path: "/reformas",
});

/** Same gutter and canvas width as the rest of the site. */
const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

export default function ReformasPage() {
  return (
    <main>
      {/* ============ CABECERA ============ */}
      <section className={`${SHELL} pt-8 md:pt-12`}>
        <Breadcrumbs items={[{ label: "Reformas", href: "/reformas" }]} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-end lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
              Servicios
            </p>
            <h1 className="mt-5 max-w-[16ch] text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] tracking-[-0.025em]">
              Qué reformamos
            </h1>
          </div>
          <div className="lg:pb-2">
            <p className="text-[15px] leading-[1.65] text-ink-soft">
              Cuatro alcances. Cambian los gremios y los plazos; no la forma de
              llevar la obra.
            </p>
            <CtaButton className="mt-7" />
          </div>
        </div>
      </section>

      {/* ============ LOS CUATRO ALCANCES ============ */}
      <section className={`${SHELL} pt-16 md:pt-20`}>
        <h2 className="sr-only">Tipos de reforma</h2>

        <ul>
          {landingServices.map((service, i) => (
            <li key={service.href}>
              <Reveal delay={i * 60}>
                <Link
                  href={service.href}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-5 gap-y-4 border-t border-line py-6 transition-colors hover:bg-sand md:grid-cols-[3.5rem_1fr_minmax(0,17rem)_6rem_2rem] md:gap-6 md:py-7"
                >
                  <span className="text-xs tabular-nums text-bronze">
                    {service.number}
                  </span>

                  <span className="text-[clamp(1.5rem,3.2vw,2.125rem)] font-bold leading-tight tracking-[-0.025em]">
                    {service.name}
                  </span>

                  {/* Thumbnail sits before the copy on small screens so the
                      row never becomes a wall of text. */}
                  <span className="relative col-start-3 row-start-1 block h-14 w-20 overflow-hidden rounded bg-line md:col-start-4 md:row-start-1 md:h-16 md:w-24">
                    <Image
                      src={service.photo.src}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                    />
                  </span>

                  <span className="col-span-2 col-start-2 text-sm leading-[1.55] text-ink-soft md:col-span-1 md:col-start-3 md:row-start-1">
                    {service.description}
                  </span>

                  <span
                    aria-hidden="true"
                    className="hidden text-ink-soft transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-ink md:col-start-5 md:row-start-1 md:block md:justify-self-end"
                  >
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 7h11m0 0L8 3m4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <CtaCard
          className="mt-12"
          tone="sand"
          title="Cualquiera de los cuatro empieza igual: una visita."
        />
      </section>

      {/* ============ CAPTACIÓN ============ */}
      <LeadFormSection
        title="¿No sabes en cuál encaja tu caso?"
        body="Dinos qué quieres cambiar y te decimos con qué alcance se parece, con presupuesto por partidas."
      />
    </main>
  );
}
