import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin-route";
import { getBlogRepository, ensureSchema } from "@/lib/db";
import { isBlogSlugConflict } from "@/lib/db/postgres";
import { isValidSlug } from "@/lib/blog";
import type { BlogPostInput, BlogPostStatus } from "@/lib/db/types";
import { BLOG_STATUSES } from "@/lib/db/types";

export const dynamic = "force-dynamic";

const TITLE_MAX = 200;
const EXCERPT_MAX = 300;
const CONTENT_MAX = 100_000;

interface ParsedInput {
  ok: true;
  input: BlogPostInput;
}
interface ParsedError {
  ok: false;
  message: string;
}

function parseInput(body: unknown): ParsedInput | ParsedError {
  if (typeof body !== "object" || body === null) {
    return { ok: false, message: "Solicitud inválida." };
  }
  const b = body as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.trim() : "";
  const excerpt = typeof b.excerpt === "string" ? b.excerpt.trim() : "";
  const content = typeof b.content === "string" ? b.content.trim() : "";
  const slug = typeof b.slug === "string" ? b.slug.trim().toLowerCase() : "";
  const status = b.status as BlogPostStatus;

  if (title.length < 3) return { ok: false, message: "El título es demasiado corto." };
  if (title.length > TITLE_MAX) return { ok: false, message: "Título demasiado largo." };
  if (!excerpt) return { ok: false, message: "Añade un resumen (excerpt)." };
  if (excerpt.length > EXCERPT_MAX) return { ok: false, message: "Resumen demasiado largo." };
  if (!content) return { ok: false, message: "El contenido está vacío." };
  if (content.length > CONTENT_MAX) return { ok: false, message: "Contenido demasiado largo." };
  if (!isValidSlug(slug)) {
    return { ok: false, message: "Slug inválido: solo minúsculas, números y guiones." };
  }
  if (!BLOG_STATUSES.includes(status)) {
    return { ok: false, message: "Estado inválido." };
  }

  return { ok: true, input: { slug, title, excerpt, content, status } };
}

/** POST /api/admin/posts — creates a blog entry (admin only). */
export async function POST(request: NextRequest) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  await ensureSchema();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = parseInput(body);
  if (!parsed.ok) return Response.json({ error: parsed.message }, { status: 400 });

  const repo = getBlogRepository();
  try {
    const post = await repo.createPost(parsed.input);
    return Response.json({ ok: true, post }, { status: 201 });
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