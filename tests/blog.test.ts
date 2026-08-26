import { beforeEach, describe, expect, it } from "vitest";

import { isValidSlug, slugify } from "@/lib/blog";
import { getBlogRepository } from "@/lib/db";
import { resetBlogMemoryDb } from "@/lib/db/memory";

beforeEach(() => {
  resetBlogMemoryDb();
});

describe("slugify", () => {
  it("lowercases, strips accents and joins with dashes", () => {
    expect(slugify("Reformas de cocina: guía 2026!")).toBe(
      "reformas-de-cocina-guia-2026"
    );
    expect(slugify("Baños pequeños, grandes cambios")).toBe(
      "banos-pequenos-grandes-cambios"
    );
    expect(slugify("  Hola   Mundo  ")).toBe("hola-mundo");
  });

  it("rejects invalid slugs", () => {
    expect(isValidSlug("reformas-cocinas")).toBe(true);
    expect(isValidSlug("Reformas")).toBe(false);
    expect(isValidSlug("reformas_cocinas")).toBe(false);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("reformas-cocinas-")).toBe(false);
  });
});

describe("blog memory repository", () => {
  const repo = () => getBlogRepository();

  it("creates drafts without a publication date and published posts with one", async () => {
    const draft = await repo().createPost({
      slug: "borrador",
      title: "Borrador",
      excerpt: "Resumen",
      content: "Contenido",
      status: "draft",
    });
    expect(draft.published_at).toBeNull();

    const pub = await repo().createPost({
      slug: "publicado",
      title: "Publicado",
      excerpt: "Resumen",
      content: "Contenido",
      status: "published",
    });
    expect(pub.published_at).not.toBeNull();
  });

  it("only lists published posts on the public view", async () => {
    await repo().createPost({
      slug: "a",
      title: "A",
      excerpt: "x",
      content: "x",
      status: "draft",
    });
    await repo().createPost({
      slug: "b",
      title: "B",
      excerpt: "x",
      content: "x",
      status: "published",
    });

    const published = await repo().listPublished();
    expect(published).toHaveLength(1);
    expect(published[0]!.slug).toBe("b");
  });

  it("sets published_at once and never resets it", async () => {
    const post = await repo().createPost({
      slug: "a",
      title: "A",
      excerpt: "x",
      content: "x",
      status: "draft",
    });

    const first = await repo().updatePost(post.id, { status: "published" });
    const stamp = first!.published_at;
    expect(stamp).not.toBeNull();

    const second = await repo().updatePost(post.id, { status: "draft" });
    const third = await repo().updatePost(post.id, { status: "published" });
    expect(second!.published_at).toBe(stamp);
    expect(third!.published_at).toBe(stamp);
  });

  it("updates content and deletes posts", async () => {
    const post = await repo().createPost({
      slug: "a",
      title: "A",
      excerpt: "x",
      content: "x",
      status: "draft",
    });

    const updated = await repo().updatePost(post.id, { title: "A2" });
    expect(updated!.title).toBe("A2");
    expect(updated!.content).toBe("x");

    expect(await repo().deletePost(post.id)).toBe(true);
    expect(await repo().listPosts()).toMatchObject({ total: 0 });
  });
});