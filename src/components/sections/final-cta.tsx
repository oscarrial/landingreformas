import Image from "next/image";
import Link from "next/link";

import { photos } from "@/config/photos";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";

export function FinalCta() {
  return (
    <section className="relative border-t border-line overflow-hidden bg-ink">
      {/* Background photograph */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={photos.salonDespues.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center text-paper sm:px-6 lg:py-32">
        <Reveal>
          <h2 className="text-balance font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-6xl">
            Tu próxima casa puede empezar en la que ya tienes.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-paper/80">
            Cuéntanos qué quieres cambiar y te ayudaremos a valorar las
            posibilidades de tu vivienda.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/presupuesto#formulario" className="btn-primary bg-paper px-7 py-4 text-base text-ink hover:bg-white">
              Quiero valorar mi reforma
              <span className="btn-arrow bg-ink/10 text-ink" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M2 12L12 2M12 2H4M12 2v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            {siteConfig.whatsapp ? (
              <Link
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-paper/40 px-6 py-4 text-base text-paper hover:border-paper hover:bg-paper/10"
              >
                Hablar por WhatsApp
              </Link>
            ) : null}
          </div>
          <p className="mt-6 text-sm text-paper/60">
            Presupuesto sin compromiso · {siteConfig.serviceArea}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
