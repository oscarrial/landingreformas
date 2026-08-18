import Image from "next/image";
import Link from "next/link";

import { BeforeAfter } from "@/components/landing/before-after";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/ui/reveal";
import { worksPage } from "@/config/projects";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Proyectos",
  description:
    "Varias de nuestras obras de reforma en Madrid con su antes y después real: cocinas, baños, dormitorios, salones, pasillos y terrazas.",
  path: "/proyectos",
});

/** Same gutter and canvas width as the home page. */
const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

export default function ProyectosPage() {
  return (
    <main>
      {/* ============ CABECERA ============ */}
      <section className={`${SHELL} pt-8 md:pt-12`}>
        <Breadcrumbs items={[{ label: "Proyectos", href: "/proyectos" }]} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-end lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
              {worksPage.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[15ch] text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] tracking-[-0.025em]">
              {worksPage.title}
            </h1>
          </div>
          <p className="text-[15px] leading-[1.65] text-ink-soft lg:pb-2">
            {worksPage.intro}
          </p>
        </div>

        {/* Ficha del conjunto: nada aqui puede afirmar un dato por obra */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 lg:grid-cols-4">
          {worksPage.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                {fact.label}
              </dt>
              <dd
                className={`mt-2 text-lg tracking-tight ${
                  fact.pending ? "text-bronze" : "text-ink"
                }`}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10">
          <CtaButton />
        </div>
      </section>

      {/* ============ PORTADA ============ */}
      <section className={`${SHELL} pt-12 md:pt-16`}>
        <div className="film-grain relative aspect-[3/2] overflow-hidden rounded bg-line ring-1 ring-ink/10 lg:aspect-[5/2]">
          <Image
            src={worksPage.cover.src}
            alt={worksPage.cover.alt}
            fill
            preload
            sizes="(min-width: 1440px) 1360px, 100vw"
            className="object-cover object-[50%_42%]"
          />
        </div>
        <p className="mt-3.5 border-t border-line pt-3 text-[11px] uppercase tracking-[0.12em] text-ink-soft">
          {worksPage.coverCaption}
        </p>
      </section>

      {/* ============ OBRA POR OBRA ============ */}
      <section className={`${SHELL} pt-24 lg:pt-30`}>
        <h2 className="sr-only">Obras</h2>

        <ol className="flex flex-col gap-24 lg:gap-30">
          {worksPage.works.map((work, i) => (
            <li key={work.id} id={work.id}>
              <Reveal>
                {/* Exactly one grid-cols class per row: emitting both lets the
                    stylesheet order decide, which silently shrank the
                    comparator on alternating rows. The text rail is always
                    320px so every comparator gets the same 1fr width. */}
                <article
                  className={`grid gap-8 lg:items-start lg:gap-16 ${
                    i % 2 === 1
                      ? "lg:grid-cols-[1fr_minmax(0,320px)]"
                      : "lg:grid-cols-[minmax(0,320px)_1fr]"
                  }`}
                >
                  <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                    <div className="flex items-baseline gap-4 border-t border-ink pt-4">
                      <span className="text-xs tabular-nums text-bronze">
                        {work.index}
                      </span>
                      <h3 className="text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight tracking-[-0.02em]">
                        {work.name}
                      </h3>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                      {work.scope}
                    </p>
                    <p className="mt-6 max-w-[42ch] text-[15px] leading-[1.65] text-ink-soft">
                      {work.body}
                    </p>
                  </div>

                  <BeforeAfter
                    before={work.before}
                    after={work.after}
                    sizes="(min-width: 1024px) 960px, 100vw"
                    className={`aspect-[4/3] lg:aspect-[16/10] ${
                      i % 2 === 1 ? "lg:order-1" : ""
                    }`}
                  />
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ============ NOTA + VOLVER ============ */}
      <section className={`${SHELL} pb-20 pt-24 lg:pt-30`}>
        <div className="flex flex-col justify-between gap-8 border-t border-line pt-8 md:flex-row md:items-end">
          <p className="max-w-[52ch] text-sm leading-relaxed text-ink-soft">
            Publicamos solo obras que hemos ejecutado y fotografiado. Cuando
            terminemos la siguiente, aparecerá aquí con el mismo detalle.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/"
              className="whitespace-nowrap border-b border-ink pb-1 text-sm font-semibold transition-colors hover:border-bronze-deep hover:text-bronze-deep"
            >
              Volver al inicio
            </Link>
            <CtaButton variant="outline" />
          </div>
        </div>
      </section>

      {/* ============ CAPTACIÓN ============ */}
      <LeadFormSection
        title="¿Quieres una obra así en tu casa?"
        body="Cuéntanos qué estancias quieres cambiar y preparamos la visita técnica y el presupuesto por partidas."
      />
    </main>
  );
}
