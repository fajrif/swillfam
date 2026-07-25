"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { DropdownIcons } from "@/components/shared/DropdownIcons";
import { cn } from "@/lib/utils";
import type { ArticleCategory } from "@/generated/prisma/client";

/** Left-rail category list. "All Journals" + every real ArticleCategory; `scroll={false}` keeps the
 * page position fixed across the server-driven navigation instead of jumping back to the top.
 * On mobile the list collapses to a `<DropdownIcons>` picker. */
export function CategoryNav({
  categories,
  activeCategoryId,
}: {
  categories: ArticleCategory[];
  activeCategoryId?: string;
}) {
  const router = useRouter();

  return (
    <>
      {/* Mobile dropdown */}
      <div className="lg:hidden">
        <DropdownIcons
          options={[
            { value: "", label: "All Journals" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={activeCategoryId ?? ""}
          onValueChange={(v) => {
            router.push(v ? `/articles?category=${v}` : "/articles", { scroll: false });
          }}
        />
      </div>

      {/* Desktop sidebar */}
      <nav className="hidden flex-col gap-3 self-start lg:sticky lg:top-24 lg:flex">
        <Link
          href="/articles"
          scroll={false}
          className={cn(
            "font-syne text-2xl uppercase leading-tight transition-colors lg:text-[28px]",
            !activeCategoryId ? "text-white" : "text-white/40 hover:text-white",
          )}
        >
          All Journals
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/articles?category=${category.id}`}
            scroll={false}
            className={cn(
              "font-syne text-2xl uppercase leading-tight transition-colors lg:text-[28px]",
              activeCategoryId === category.id ? "text-white" : "text-white/40 hover:text-white",
            )}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </>
  );
}
