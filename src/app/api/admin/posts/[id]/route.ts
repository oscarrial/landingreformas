import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin-route";
import { getBlogRepository, ensureSchema } from "@/lib/db";
import { isBlogSlugConflict } from "@/lib/db/postgres";
import { isValidSlug } from "@/lib/blog";
import type { BlogPostStatus } from "@/lib/db/types";
import { BLOG_STATUSES } from "@/lib/db/types";

export const dynamic = "force-dynamic";

/** PATCH /api/admin/posts/[id] — updates a blog entry (admin only). */
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const { id: rawId } = await ctx.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  await ensureSchema();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const patch: Record<string, unknown> = {};

  if (b.slug !== undefined) {
    const slug = String(b.slug).trim().toLowerCase();
    if (!isValidSlug(slug)) {
      return Response.json(
        { error: "Slug inválido: solo minúsculas, números y guiones." },
        { status: 400 }
      );
    }
    patch.slug = slug;
  }
  if (b.title !== undefined) {
    const title = String(b.title).trim();
    if (title.length < 3) {
      return Response.json({ error: "El título es demasiado corto." }, { status: 400 });
    }
    patch.title = title;
  }
  if (b.excerpt !== undefined) {
    const excerpt = String(b.excerpt).trim();
    if (!excerpt) {
      return Response.json({ error: "Añade un resumen (excerpt)." }, { status: 400 });
    }
    patch.excerpt = excerpt;
  }
  if (b.content !== undefined) {
    const content = String(b.content).trim();
    if (!content) {
      return Response.json({ error: "El contenido está vacío." }, { status: 400 });
    }
    patch.content = content;
  }
  if (b.status !== undefined) {
    const status = b.status as BlogPostStatus;
    if (!BLOG_STATUSES.includes(status)) {
      return Response.json({ error: "Estado inválido." }, { status: 400 });
    }
    patch.status = status;
  }

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: "Nada que actualizar." }, { status: 400 });
  }

  const repo = getBlogRepository();
  try {
    const updated = await repo.updatePost(id, patch);
    if (!updated) {
      return Response.json({ error: "Entrada no encontrada." }, { status: 404 });
    }
    return Response.json({ ok: true, post: updated });
  } catch (err) {
    if (isBlogSlugConflict(err)) {
      return Response.json(
        { error: "Ya existe una entrada con ese slug." },
        { status: 409 }
      );
    }
    throw err;
  }
}

/** DELETE /api/admin/posts/[id] — removes a blog entry (admin only). */
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const { id: rawId } = await ctx.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }

  await ensureSchema();
  const repo = getBlogRepository();
  const deleted = await repo.deletePost(id);
  if (!deleted) {
    return Response.json({ error: "Entrada no encontrada." }, { status: 404 });
  }
  return Response.json({ ok: true });
}