import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostContent } from "@/components/blog/post-content";
import { CtaCard } from "@/components/sections/cta-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { formatPostDate } from "@/lib/blog";
import { getBlogRepository, ensureSchema } from "@/lib/db";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublished(slug);
  if (!post) {
    return buildMetadata({
      title: "Artículo no encontrado",
      description: "Este artículo ya no está disponible.",
      path: "/blog",
    });
  }
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

async function fetchPublished(slug: string) {
  await ensureSchema();
  const repo = getBlogRepository();
  const post = await repo.getPostBySlug(slug);
  return post && post.status === "published" ? post : null;
}

const SHELL = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchPublished(slug);
  if (!post) notFound();

  return (
    <main>
      <section className={`${SHELL} pt-8 md:pt-12`}>
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <header className="mt-12 max-w-[820px]">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
            {post.published_at ? formatPostDate(post.published_at) : ""}
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,5.5vw,4rem)] leading-[0.95] tracking-[-0.025em]">
            {post.title}
          </h1>
          <p className="mt-7 max-w-[60ch] text-lg leading-[1.6] text-ink-soft">
            {post.excerpt}
          </p>
        </header>
      </section>

      <article className={`${SHELL} pb-24 pt-12`}>
        <div className="border-t border-line pt-10">
          <PostContent content={post.content} />
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-line pt-8">
          <Link
            href="/blog"
            className="whitespace-nowrap border-b border-ink pb-1 text-sm font-semibold transition-colors hover:border-bronze-deep hover:text-bronze-deep"
          >
            ← Todos los artículos
          </Link>
        </div>
      </article>

      <section className={`${SHELL} pb-24`}>
        <CtaCard
          tone="line"
          title="¿Te planteas una reforma parecida?"
          note="Empezamos por una visita técnica para ver qué se puede hacer y qué cuesta."
        />
      </section>
    </main>
  );
}