import Link from "next/link";

import { PostForm } from "@/components/admin/post-form";

export default function AdminNewPostPage() {
  return (
    <div>
      <Link href="/admin/posts" className="link-ghost text-sm font-semibold text-ink-soft">
        ← Volver al blog
      </Link>
      <h1 className="mt-3 font-display text-2xl text-ink">Nueva entrada</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Guárdala como borrador o publícala directamente. La URL se genera desde
        el título.
      </p>
      <div className="mt-6 max-w-3xl">
        <PostForm />
      </div>
    </div>
  );
}