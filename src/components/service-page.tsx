import Image from "next/image";
import Link from "next/link";

import { BeforeAfter } from "@/components/landing/before-after";
import type { ReformType } from "@/components/lead-form";
import type { Service } from "@/config/services";
import { PRIMARY_CTA_LABEL, siteConfig } from "@/config/site";
import { FaqList } from "@/components/sections/faq-list";
import { CtaCard } from "@/components/sections/cta-card";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * The service page already tells us what the visitor wants to reform, so the
 * form skips that question. Unmapped slugs fall through to the full form.
 */
const REFORM_TYPE_BY_SLUG: Record<string, ReformType> = {
  "reformas-integrales-madrid": "vivienda_completa",
  "reformas-pisos-madrid": "piso",
  "reformas-cocinas-madrid": "cocina",
  "reformas-banos-madrid": "bano",
  "reformas-humedades-madrid": "humedades",
};

interface ServicePageProps {
  service: Service;
  schemas: Record<string, unknown>[];
}

export function ServicePage({ service, schemas }: ServicePageProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: service.name, href: `/${service.slug}` },
          ]}
        />
      </div>

      {/* Page hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-12 lg:items-end lg:pb-24">
        <div className="lg:col-span-7">
          <h1 className="text-balance font-display text-4xl leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl">
            {service.h1}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {service.intro}
          </p>
          <div className="mt-9">
            <CtaButton href="#presupuesto" label={PRIMARY_CTA_LABEL} />
            <p className="mt-4 text-sm text-ink-soft">
              Presupuesto sin compromiso · {siteConfig.serviceArea}
            </p>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded bg-line ring-1 ring-ink/10">
            <Image
              src={service.photos.after.src}
              alt={service.photos.after.alt}
              fill
              preload
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Proof: the real before/after of one of our obras for this service.
          Replaces the old six-tile grid, whose captions restated their own
          labels ("Electricidad — circuitos dimensionados para la cocina"). */}
      <section className="border-t border-line bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="section-marker">{service.differentiator.kicker}</p>
            <h2 className="text-balance mt-5 font-display text-3xl leading-[1.08] tracking-[-0.015em] text-ink sm:text-4xl">
              {service.differentiator.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {service.differentiator.body}
            </p>
          </div>

          <BeforeAfter
            before={service.photos.before}
            after={service.photos.after}
            sizes="(min-width: 1024px) 1150px, 100vw"
            className="mt-12 aspect-[4/3] lg:aspect-[2/1]"
          />
          <p className="mt-3.5 border-t border-line pt-3 text-[11px] uppercase tracking-[0.12em] text-ink-soft">
            Obra real ejecutada en {siteConfig.serviceArea} · TODO: confirmar
            zona, superficie y fecha
          </p>
        </div>
      </section>

      {/* Lead capture, mid-page: right after the proof, before the detail. */}
      <LeadFormSection
        title={`Pide presupuesto para ${service.name.toLowerCase()}`}
        body="Cuatro preguntas y te llamamos para concretar la visita técnica. Presupuesto detallado por partidas, sin compromiso."
        defaultReformType={REFORM_TYPE_BY_SLUG[service.slug]}
      />

      {/* Body sections */}
      <section className="border-t border-line bg-sand py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
<h2 className="text-balance mt-5 font-display text-3xl leading-tight tracking-[-0.015em] text-ink">
              {service.sections[0]?.heading}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-ink-soft">
              {service.sections[0]?.body}
            </p>
            {service.sections[0]?.points ? (
              <ul className="mt-7 space-y-3.5">
                {service.sections[0].points.map((point) => (
                  <li key={point} className="flex gap-3 text-ink">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-bronze"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      {service.sections.slice(1).map((section, i) => (
        <section
          key={section.heading}
          className={
            i % 2 === 0
              ? "border-t border-line bg-paper py-16 lg:py-20"
              : "border-t border-line bg-sand py-16 lg:py-20"
          }
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-balance font-display text-3xl leading-tight tracking-[-0.015em] text-ink">
                {section.heading}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg leading-relaxed text-ink-soft">{section.body}</p>
              {section.points ? (
                <ul className="mt-7 space-y-3.5">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-3 text-ink">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-bronze"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="border-t border-line bg-paper py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-balance mt-5 font-display text-3xl leading-tight tracking-[-0.015em] text-ink">
              Dudas habituales sobre {service.name.toLowerCase()}
            </h2>
            <CtaButton
              href="#presupuesto-final"
              variant="outline"
              label="Saltar a las preguntas del presupuesto"
              className="mt-8"
            />
          </div>
          <div className="lg:col-span-7">
            <FaqList items={service.faqs} />
          </div>
        </div>
      </section>

      {/* Second capture point, after the FAQ has answered the objections. */}
      <LeadFormSection
        id="presupuesto-final"
        eyebrow="Siguiente paso"
        title="Cuéntanos tu caso"
        body="Si ya lo tienes claro, empieza por aquí. Te llamamos para concretar la visita."
        defaultReformType={REFORM_TYPE_BY_SLUG[service.slug]}
      />

      {/* Internal linking */}
      <section className="border-t border-line bg-sand py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-3">
            {service.related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="btn-outline px-5 py-3 text-sm"
              >
                {r.label}
              </Link>
            ))}
          </div>
          <CtaCard
            className="mt-10"
            tone="line"
            title="O empieza directamente por el presupuesto."
            href="#presupuesto"
          />
        </div>
      </section>
    </>
  );
}
