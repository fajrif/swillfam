"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/slug";

/** Slug input, always derived from a sibling field (by name) — not directly editable. */
export function SlugField({
  sourceName,
  name = "slug",
  label = "Slug",
  defaultValue = "",
}: {
  sourceName: string;
  name?: string;
  label?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = inputRef.current?.closest("form");
    const source = form?.querySelector(`[name="${sourceName}"]`) as HTMLInputElement | null;
    if (!source) return;
    const handler = () => setValue(slugify(source.value));
    handler();
    source.addEventListener("input", handler);
    return () => source.removeEventListener("input", handler);
  }, [sourceName]);

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        ref={inputRef}
        id={name}
        name={name}
        value={value}
        readOnly
        className="cursor-not-allowed bg-muted text-muted-foreground"
      />
      <p className="text-xs text-muted-foreground">
        Automatically generated from the name/title — not editable directly.
      </p>
    </div>
  );
}
