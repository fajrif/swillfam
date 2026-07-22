"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getUploadedFileSize } from "@/lib/image-info";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Wraps a thumbnail; clicking it opens the image at full size in a dialog. */
export function ImageLightbox({
  src,
  alt = "",
  className,
  bgBlack,
  fileName,
  fileSize,
}: {
  src: string;
  alt?: string;
  className?: string;
  bgBlack?: boolean;
  /** Real original filename, when known (e.g. a freshly picked, not-yet-uploaded file). */
  fileName?: string;
  /** Real byte size, when known upfront (e.g. from a freshly picked File). */
  fileSize?: number;
}) {
  const [open, setOpen] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [resolvedSize, setResolvedSize] = useState<number | null>(fileSize ?? null);

  // For already-uploaded images (no fileSize prop), look up the real byte size
  // lazily once the dialog is opened, not for every thumbnail on the page.
  useEffect(() => {
    if (!open || fileSize !== undefined || resolvedSize !== null || src.startsWith("blob:")) return;
    getUploadedFileSize(src).then((size) => {
      if (size !== null) setResolvedSize(size);
    });
  }, [open, fileSize, resolvedSize, src]);

  const displayName = fileName ?? src.split("/").pop() ?? src;
  const caption = [
    displayName,
    naturalSize && `${naturalSize.w} × ${naturalSize.h} px`,
    resolvedSize !== null && formatBytes(resolvedSize),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label="View full size image"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={cn("object-cover bg-muted", bgBlack && "bg-black", className)} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="flex w-fit max-w-[calc(100%-2rem)] flex-col gap-2 p-2 sm:max-w-[min(90vw,1400px)]"
        >
          <DialogTitle className="sr-only">{alt || "Image preview"}</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onLoad={(e) =>
              setNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
            }
            className={cn(
              "mx-auto h-auto max-h-[75vh] w-auto max-w-full rounded object-contain",
              bgBlack && "bg-black",
            )}
          />
          <p className="text-center text-xs text-muted-foreground">{caption}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
