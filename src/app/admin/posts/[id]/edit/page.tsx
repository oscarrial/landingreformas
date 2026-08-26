import Link from "next/link";
import { notFound } from "next/navigation";

import { PostForm } from "@/components/admin/post-form";
import { getBlogRepository, ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  await ensureSchema();
  const repo = getBlogRepository();
  const { items } = await repo.listPosts({ pageSize: 100 });
  const post = items.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/posts" className="link-ghost text-sm font-semibold text-ink-soft">
        ← Volver al blog
      </Link>
      <h1 className="mt-3 font-display text-2xl text-ink">Editar entrada</h1>
      <div className="mt-6 max-w-3xl">
        <PostForm post={post} />
      </div>
    </div>
  );
}