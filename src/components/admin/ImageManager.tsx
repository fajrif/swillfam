"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "./ImageLightbox";

type Item =
  | { kind: "existing"; id: string; path: string }
  | { kind: "new"; id: string; file: File; url: string };

let idCounter = 0;
const nextId = () => `im-${idCounter++}`;

/**
 * Reusable upload widget for single or multiple images.
 *
 * Posts two hidden form fields the server action reads via `reconcileImageField`:
 *   - `<name>__order`: JSON array of tokens (kept existing paths, or "new:<N>")
 *   - `<name>__file`:  the new File objects, in order (FileList built via DataTransfer)
 *
 * Supports reordering (multi), and checkbox selection → "Delete selected". Removing an
 * image simply omits it from the posted order, which makes the server unlink the file.
 */
export function ImageManager({
  name,
  label,
  multiple = false,
  existing = [],
  accept = "image/*",
  hint,
}: {
  name: string;
  label: string;
  multiple?: boolean;
  existing?: string[];
  accept?: string;
  hint?: string;
}) {
  const [items, setItems] = useState<Item[]>(() =>
    existing.map((path) => ({ kind: "existing" as const, id: nextId(), path })),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null); // hidden, submitted
  const orderInputRef = useRef<HTMLInputElement>(null); // hidden, submitted
  const pickerRef = useRef<HTMLInputElement>(null); // visible picker

  // Keep the two hidden submitted inputs in sync with the current item list/order.
  useEffect(() => {
    const newItems = items.filter(
      (it): it is Extract<Item, { kind: "new" }> => it.kind === "new",
    );
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      for (const it of newItems) dt.items.add(it.file);
      fileInputRef.current.files = dt.files;
    }
    if (orderInputRef.current) {
      const tokens = items.map((it) =>
        it.kind === "existing" ? it.path : `new:${newItems.indexOf(it)}`,
      );
      orderInputRef.current.value = JSON.stringify(tokens);
    }
  }, [items]);

  // Revoke object URLs on unmount.
  useEffect(() => {
    return () => {
      setItems((prev) => {
        prev.forEach((it) => it.kind === "new" && URL.revokeObjectURL(it.url));
        return prev;
      });
    };
  }, []);

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const additions: Item[] = Array.from(files).map((file) => ({
      kind: "new" as const,
      id: nextId(),
      file,
      url: URL.createObjectURL(file),
    }));
    setItems((prev) => {
      if (multiple) return [...prev, ...additions];
      prev.forEach((it) => it.kind === "new" && URL.revokeObjectURL(it.url));
      return additions.slice(0, 1);
    });
    if (pickerRef.current) pickerRef.current.value = "";
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function deleteSelected() {
    setItems((prev) =>
      prev.filter((it) => {
        if (selected.has(it.id)) {
          if (it.kind === "new") URL.revokeObjectURL(it.url);
          return false;
        }
        return true;
      }),
    );
    setSelected(new Set());
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const selectedCount = selected.size;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {selectedCount > 0 && (
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={deleteSelected}
            className="text-destructive hover:text-destructive"
          >
            Delete selected ({selectedCount})
          </Button>
        )}
      </div>

      {items.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {items.map((it, index) => {
            const src = it.kind === "existing" ? it.path : it.url;
            const isSelected = selected.has(it.id);
            return (
              <li
                key={it.id}
                className={cn(
                  "relative w-28 rounded-md border bg-card p-1",
                  isSelected && "border-destructive ring-2 ring-destructive/30",
                )}
              >
                <ImageLightbox src={src} className="h-24 w-full rounded" />
                <label className="absolute top-2 left-2 flex items-center gap-1 rounded bg-background/90 px-1 py-0.5 text-[10px]">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(it.id)}
                    className="h-3 w-3 accent-primary"
                  />
                </label>
                {multiple && (
                  <div className="mt-1 flex items-center justify-between">
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </Button>
                    <span className="text-[10px] text-muted-foreground">#{index + 1}</span>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <input
        ref={pickerRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => addFiles(e.target.files)}
        className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground file:text-sm hover:file:bg-primary/90"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {/* Submitted to the server action. */}
      <input ref={orderInputRef} type="hidden" name={`${name}__order`} defaultValue="[]" />
      <input ref={fileInputRef} type="file" name={`${name}__file`} multiple className="hidden" tabIndex={-1} aria-hidden />
    </div>
  );
}
