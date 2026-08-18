import Link from "next/link";

import { siteConfig } from "@/config/site";

export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Miga de pan">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
        <li>
          <Link href="/" className="transition-colors hover:text-ink">
            {siteConfig.brandName}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-line">
              /
            </span>
            {/* The current page is not a link to itself. */}
            {i === lastIndex ? (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
