"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { slugify } from "@/lib/blog";
import type { BlogPost, BlogPostStatus } from "@/lib/db/types";

interface PostFormProps {
  /** Existing post when editing; undefined when creating. */
  post?: BlogPost;
}

const STATUS_LABELS: Record<BlogPostStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
};

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [status, setStatus] = useState<BlogPostStatus>(post?.status ?? "draft");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const onTitleChange = (value: string) => {
    setTitle(value);
    // Auto-generate the slug from the title until the user edits it manually.
    if (!slugTouched) setSlug(slugify(value));
  };

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const payload = { title, slug: slug || slugify(title), excerpt, content, status };
    try {
      const res = post
        ? await fetch(`/api/admin/posts/${post.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMessage({ type: "error", text: data.error ?? "Error al guardar." });
        return;
      }
      setMessage({ type: "ok", text: post ? "Guardado." : "Entrada creada." });
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Error de conexión." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      className="rounded-sm border border-line bg-paper p-6"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium text-ink">
            Título
          </label>
          <input
            id="post-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="post-slug" className="block text-sm font-medium text-ink">
            Slug (URL)
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink-soft focus-within:border-bronze-deep">
            <span>koflat.es/blog/</span>
            <input
              id="post-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
              className="w-full bg-transparent text-ink outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Se rellena solo desde el título; minúsculas, números y guiones.
          </p>
        </div>

        <div>
          <label htmlFor="post-excerpt" className="block text-sm font-medium text-ink">
            Resumen
          </label>
          <textarea
            id="post-excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            placeholder="Aparece en el listado del blog y en el SEO."
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="post-content" className="block text-sm font-medium text-ink">
            Contenido
          </label>
          <textarea
            id="post-content"
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2 font-mono text-sm leading-relaxed text-ink focus:border-bronze-deep focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Línea en blanco = párrafo · línea con «## » = título de sección ·
            líneas con «- » = lista.
          </p>
        </div>

        <div className="flex items-end gap-4">
          <div>
            <label htmlFor="post-status" className="block text-sm font-medium text-ink">
              Estado
            </label>
            <select
              id="post-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
              className="mt-1.5 rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
            >
              <option value="draft">{STATUS_LABELS.draft}</option>
              <option value="published">{STATUS_LABELS.published}</option>
            </select>
          </div>
          {post?.published_at ? (
            <p className="text-xs text-ink-soft">
              Publicado el {new Date(post.published_at).toLocaleDateString("es-ES")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="rounded-sm bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {busy ? "Guardando…" : post ? "Guardar cambios" : "Crear entrada"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="rounded-sm border border-line px-4 py-3 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          Cancelar
        </button>
        {message ? (
          <p
            role="status"
            className={
              message.type === "ok"
                ? "text-sm font-medium text-olive"
                : "text-sm font-medium text-red-700"
            }
          >
            {message.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}