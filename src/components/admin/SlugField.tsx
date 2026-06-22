"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/slug";

/** Slug input that auto-fills from a sibling field (by name) until the user edits it. */
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
  const editedRef = useRef(Boolean(defaultValue));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = inputRef.current?.closest("form");
    const source = form?.querySelector(`[name="${sourceName}"]`) as HTMLInputElement | null;
    if (!source) return;
    const handler = () => {
      if (!editedRef.current) setValue(slugify(source.value));
    };
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
        onChange={(e) => {
          editedRef.current = true;
          setValue(e.target.value);
        }}
      />
      <p className="text-xs text-muted-foreground">
        Used in the public URL. Auto-generated from the name; edit if needed.
      </p>
    </div>
  );
}
