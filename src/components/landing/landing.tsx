import Image from "next/image";
import Link from "next/link";

import { BeforeAfter } from "@/components/landing/before-after";
import { FaqList } from "@/components/sections/faq-list";
import { CtaCard } from "@/components/sections/cta-card";
import { LeadFormSection } from "@/components/sections/lead-form-section";
import { CtaButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/ui/reveal";
import { homeFaqs } from "@/config/content";
import {
  beforeAfter,
  beforeAfterPairs,
  hero,
  landingProjects,
  landingServices,
  processSummary,
} from "@/config/landing";
import { siteConfig } from "@/config/site";

/** Page gutter — 40px at the 1440px design width, tighter on small screens. */
const GUTTER = "px-5 md:px-10";
/** Full-bleed container capped at the design canvas width. */
const SHELL = `mx-auto w-full max-w-[1440px] ${GUTTER}`;

export function Landing() {
  return (
    <div className="bg-paper">
      {/* ============ HERO — full-bleed photograph, headline laid over it == */}
      <section className={`${SHELL} pt-6 md:pt-8`}>
        <div className="film-grain relative aspect-[2/3] overflow-hidden rounded bg-line ring-1 ring-ink/10 sm:aspect-[3/2] lg:aspect-[2/1]">
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            fill
            preload
            sizes="(min-width: 1440px) 1360px, 100vw"
            className="hero-settle object-cover object-[50%_42%]"
          />
          {/* Three scrims, tuned by sampling the composited pixels under each
              text box: one lifts the whole lower band, two weight the corners
              where the headline and the support copy sit. Contrast is verified
              against the blown-out window on the right, not just the average. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(21,22,19,0.88)_0%,rgba(21,22,19,0.68)_26%,rgba(21,22,19,0.24)_52%,transparent_76%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(21,22,19,0.42)_0%,rgba(21,22,19,0.12)_40%,transparent_68%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgba(21,22,19,0.38)_0%,rgba(21,22,19,0.10)_32%,transparent_58%)]"
          />

          <div className="absolute inset-x-5 bottom-6 z-[2] flex flex-col gap-8 md:inset-x-10 md:bottom-10 md:flex-row md:items-end md:justify-between md:gap-16">
            <div className="hero-rise">
              {/* Negative indent pulls the R's side bearing back so the
                  headline aligns optically with the gutter. */}
              <h1 className="-ml-[0.05em] text-[clamp(3rem,8vw,7rem)] leading-[0.84] text-sand">
                Reformas
                <br />
                Madrid
              </h1>
            </div>

            <div className="hero-rise flex flex-col items-start gap-5 [animation-delay:200ms] md:max-w-[19rem] md:items-end md:pb-2 md:text-right">
              <p className="max-w-sm text-[15px] leading-[1.55] text-sand">
                {hero.support}
              </p>
              <CtaButton href="#presupuesto" label={hero.cta} variant="light" />
            </div>
          </div>
        </div>
        <p className="mt-3.5 border-t border-line pt-3 text-[11px] uppercase tracking-[0.12em] text-ink-soft">
          {hero.caption}
        </p>
      </section>

      {/* ============ STATEMENT ============ */}
      {/* Tighter on top than on the bottom: the hero caption sits right above,
          so the statement should read as its continuation, not as a new block. */}
      <section className={`${SHELL} grid gap-10 pb-24 pt-12 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-20 lg:pb-30 lg:pt-16`}>
        <Reveal>
          <p className="max-w-[760px] text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.18] tracking-[-0.02em]">
            Coordinamos planificación, proveedores y ejecución desde una única
            dirección de obra.
          </p>
        </Reveal>
        <Reveal delay={80} className="flex flex-col gap-5 lg:pt-2.5">
          <p className="text-[15px] leading-[1.65] text-ink-soft">
            Definimos alcance y partidas antes de empezar. Cada fase queda
            planificada y hay una sola persona que responde de la obra durante
            todo el proceso.
          </p>
          <CtaButton
            href="#presupuesto"
            label="Cuéntanos tu proyecto"
            variant="underline"
            className="self-start"
          />
        </Reveal>
      </section>

      {/* ============ ANTES Y DESPUÉS ============ */}
      <section id="antes-despues" className={`${SHELL} pb-24 lg:pb-30`}>
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="text-[clamp(3rem,6.5vw,6rem)] leading-[0.86]">
            Antes
            <br />y después
          </h2>
          <p className="max-w-[340px] text-sm leading-relaxed text-ink-soft md:pb-3">
            {beforeAfter.context}
            <br />
            <span className="text-bronze">{beforeAfter.pendingNote}</span>
          </p>
        </div>
        <BeforeAfter
          before={beforeAfter.before}
          after={beforeAfter.after}
          sizes="(min-width: 1440px) 1360px, 100vw"
          className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[560px]"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beforeAfterPairs.map((pair, i) => (
            <Reveal key={pair.label} delay={i * 60}>
              <div className="grid grid-cols-2 gap-1">
                {[pair.before, pair.after].map((photo) => (
                  <div
                    key={photo.alt}
                    className="relative aspect-[4/3] overflow-hidden rounded bg-line"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 220px, (min-width: 640px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-xs uppercase tracking-[0.14em] text-ink-soft">
                {pair.label}
              </p>
            </Reveal>
          ))}
        </div>

        <CtaCard
          className="mt-12"
          tone="line"
          title="¿Quieres un cambio así en tu casa?"
          note="Empezamos por una visita técnica para ver qué se puede hacer y qué cuesta."
        />
      </section>

      {/* ============ PROYECTOS ============ */}
      <section id="proyectos" className={`${SHELL} pb-24 lg:pb-30`}>
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)]">Proyectos</h2>
          <Link
            href="/proyectos"
            className="whitespace-nowrap border-b border-ink pb-1 text-sm font-semibold transition-colors hover:border-bronze-deep hover:text-bronze-deep"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {landingProjects.slice(0, 3).map((project, i) => (
            <Reveal key={project.title} delay={i * 60}>
              <Link href={project.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded bg-line lg:aspect-auto lg:h-[300px]">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 440px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.025]"
                  />
                </div>
                <h3 className="mt-3.5 text-xl leading-snug">{project.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-soft">
                  {[
                    project.type,
                    project.zone,
                    project.sizeM2,
                    project.pendingNote,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-start border-t border-line pt-8">
          <CtaButton variant="outline" label="Pedir presupuesto para mi obra" />
        </div>
      </section>

      {/* ============ SERVICIOS ============ */}
      <section id="servicios" className={`${SHELL} pb-24 lg:pb-30`}>
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Servicios
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {landingServices.map((service, i) => (
            <Reveal key={service.href} delay={i * 60}>
              <Link href={service.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded bg-line">
                  <Image
                    src={service.photo.src}
                    alt={service.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.025]"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-line pt-2.5">
                  <span className="text-lg font-bold tracking-tight">
                    {service.name}
                  </span>
                  <span className="text-[11px] text-bronze">
                    {service.number}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-ink-soft">
                  {service.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <CtaCard
          className="mt-12"
          tone="ink"
          title="No sabemos tu caso hasta verlo."
          note="Cuéntanos qué quieres reformar y te decimos qué alcance tiene."
        />
      </section>

      {/* ============ PROCESO / PRESUPUESTO (bento) ============ */}
      <section id="proceso" className={`${SHELL} pb-24 lg:pb-30`}>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col justify-between gap-10 rounded-lg bg-sand p-8 lg:h-[300px]">
              <h2 className="text-[clamp(2.75rem,7vw,5rem)] leading-[0.95]">
                Reforma
                <br />
                integral
              </h2>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                De la visita a la entrega de llaves
              </p>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg bg-line p-8">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                  Presupuesto
                </p>
                <h3 className="text-2xl leading-7">
                  Valoración
                  <br />
                  sin compromiso
                </h3>
              </div>
              <CtaButton href="#presupuesto" label="Solicitar" variant="light" className="shrink-0" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-1 flex-col justify-between rounded-lg bg-sand p-8">
              <h4 className="text-xl leading-6">
                El proceso
                <br />
                de tu reforma
              </h4>
              <ol className="mt-6 flex flex-col gap-2.5 text-sm text-ink-soft">
                {processSummary.map((step) => (
                  <li
                    key={step.number}
                    className="flex gap-3 border-t border-line pt-2.5"
                  >
                    <span className="text-bronze">{step.number}</span>
                    {step.label}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-6 rounded-lg bg-ink p-8 text-sand">
              <h4 className="text-xl leading-6">
                Cuidamos tu casa
                <br />
                como propia
              </h4>
              <p className="max-w-[240px] text-[13px] leading-[1.55] text-sand/70">
                Protección de superficies, limpieza diaria y horarios acordados
                con la comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CAPTACIÓN ============ */}
      <LeadFormSection
        title="Cuéntanos qué quieres reformar"
        body="Cinco preguntas rápidas y te llamamos para concretar la visita técnica. Respondemos con un presupuesto detallado por partidas, sin compromiso."
      />

      {/* ============ PREGUNTAS FRECUENTES ============
          Must stay on the page: (landing)/page.tsx emits faqSchema(homeFaqs),
          and FAQPage markup requires the answers to be visible here. */}
      <section id="faq" className={`${SHELL} border-t border-line py-24 lg:py-30`}>
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,760px)] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
              Preguntas frecuentes
            </p>
            <h2 className="mt-5 max-w-[14ch] text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05]">
              Lo que se pregunta antes de firmar
            </h2>
            <CtaButton className="mt-8" />
          </div>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      {/* ============ FOOTER (slim, editorial) ============ */}
      <footer className="border-t border-line bg-sand py-12">
        <div className={SHELL}>
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
              {/* Review marker — drop once siteConfig.phone/email are real. */}
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-soft">
                Teléfono y email: TODO configurar
              </p>
            </div>
            <nav
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft"
              aria-label="Legal"
            >
              <Link href="/presupuesto#formulario" className="hover:text-ink">
                Presupuesto
              </Link>
              <Link href="/proyectos" className="hover:text-ink">
                Proyectos
              </Link>
              <Link href="/blog" className="hover:text-ink">
                Blog
              </Link>
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
          <p className="mt-8 border-t border-line pt-6 text-xs text-ink-soft">
            © {new Date().getFullYear()} {siteConfig.brandName}. Plataforma de
            captación de reformas; las obras las ejecuta el proveedor operativo.
          </p>
        </div>
      </footer>
    </div>
  );
}
