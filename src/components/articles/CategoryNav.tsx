import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "./data";

/** Left-rail category list. First item is active; the rest are placeholder links. */
export function CategoryNav() {
  return (
    <nav className="flex flex-col gap-3">
      {CATEGORIES.map((category, i) => (
        <Link
          key={category}
          href="#"
          className={cn(
            "font-syne text-2xl uppercase leading-tight transition-colors lg:text-[28px]",
            i === 0 ? "text-white" : "text-white/40 hover:text-white",
          )}
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}
