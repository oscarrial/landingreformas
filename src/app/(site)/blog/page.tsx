import Link from "next/link";

import { CtaCard } from "@/components/sections/cta-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { formatPostDate } from "@/lib/blog";
import { getBlogRepository, ensureSchema } from "@/lib/db";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Consejos y guías sobre reformas en Madrid: alcances, instalaciones, licencias y plazos explicados antes de firmar.",
  path: "/blog",
});

const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

export default async function BlogPage() {
  await ensureSchema();
  const repo = getBlogRepository();
  const posts = await repo.listPublished();

  return (
    <main>
      <section className={`${SHELL} pt-8 md:pt-12`}>
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />

        <div className="mt-10 max-w-[760px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
            Blog
          </p>
          <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] tracking-[-0.025em]">
            Guías antes de reformar
          </h1>
          <p className="mt-7 max-w-[52ch] text-[15px] leading-[1.65] text-ink-soft">
            Lo que conviene saber antes de firmar: alcances, instalaciones,
            licencias y plazos explicados sin humo.
          </p>
        </div>
      </section>

      <section className={`${SHELL} pb-24 pt-14 md:pt-20`}>
        {posts.length === 0 ? (
          <div className="border-t border-line pt-10">
            <p className="max-w-[46ch] text-ink-soft">
              Todavía no hay artículos publicados. Vuelve pronto.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 60}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="flex items-baseline justify-between border-t border-ink pt-3">
                    <span className="text-xs tabular-nums text-bronze">
                      {String(posts.length - i).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                      {post.published_at ? formatPostDate(post.published_at) : ""}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold leading-snug tracking-[-0.02em] transition-colors group-hover:text-bronze-deep">
                    {post.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-[1.6] text-ink-soft">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-block border-b border-ink pb-0.5 text-sm font-semibold transition-colors group-hover:border-bronze-deep group-hover:text-bronze-deep">
                    Leer artículo
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className={`${SHELL} pb-24`}>
        <CtaCard
          tone="line"
          title="¿Tu caso no está en ninguna guía?"
          note="Cuéntanos qué quieres reformar y te decimos con qué alcance se parece."
        />
      </section>
    </main>
  );
}