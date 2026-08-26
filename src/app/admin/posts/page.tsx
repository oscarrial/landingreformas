import Link from "next/link";

import { DeletePostButton } from "@/components/admin/delete-post-button";
import { getBlogRepository, ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PostsPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminPostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  await ensureSchema();

  const status = params.status === "published" || params.status === "draft" ? params.status : undefined;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const pageSize = 20;

  const repo = getBlogRepository();
  const result = await repo.listPosts({ status, page, pageSize });
  const totalPages = Math.max(1, Math.ceil(result.total / pageSize));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Blog</h1>
          <p className="text-sm text-ink-soft">
            {result.total} {result.total === 1 ? "entrada" : "entradas"}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-sm bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
        >
          Nueva entrada
        </Link>
      </div>

      <div className="mt-4 flex gap-2 text-sm">
        <StatusFilter href="/admin/posts" label="Todas" active={!status} />
        <StatusFilter href="/admin/posts?status=draft" label="Borradores" active={status === "draft"} />
        <StatusFilter href="/admin/posts?status=published" label="Publicadas" active={status === "published"} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line">
            <tr className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Publicación</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {result.items.map((post) => (
              <tr key={post.id} className="hover:bg-sand">
                <td className="px-4 py-3">
                  <Link href={`/admin/posts/${post.id}/edit`} className="font-medium text-ink hover:underline">
                    {post.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-soft">/blog/{post.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      post.status === "published"
                        ? "rounded-sm bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200"
                        : "rounded-sm bg-sand px-2 py-1 text-xs font-semibold text-ink-soft border border-line"
                    }
                  >
                    {post.status === "published" ? "Publicada" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("es-ES")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="rounded-sm border border-line px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-bronze"
                    >
                      Editar
                    </Link>
                    <DeletePostButton postId={post.id} />
                  </div>
                </td>
              </tr>
            ))}
            {result.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-soft">
                  No hay entradas todavía. Crea la primera.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <nav className="mt-6 flex items-center justify-between text-sm" aria-label="Paginación">
          <p className="text-ink-soft">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={`/admin/posts?status=${status ?? ""}&page=${page - 1}`}
                className="rounded-sm border border-line px-3 py-1.5 font-semibold text-ink transition-colors hover:border-bronze"
              >
                Anterior
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                href={`/admin/posts?status=${status ?? ""}&page=${page + 1}`}
                className="rounded-sm border border-line px-3 py-1.5 font-semibold text-ink transition-colors hover:border-bronze"
              >
                Siguiente
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}

function StatusFilter({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-sm bg-ink px-3 py-1.5 font-semibold text-paper"
          : "rounded-sm border border-line px-3 py-1.5 font-semibold text-ink-soft transition-colors hover:text-ink"
      }
    >
      {label}
    </Link>
  );
}