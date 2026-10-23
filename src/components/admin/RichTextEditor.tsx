"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Tiptap WYSIWYG editor. Mirrors its HTML into a hidden input so the surrounding
 *  Server Action form reads it like any other field. */
export function RichTextEditor({
  name,
  label,
  defaultValue = "",
  imageUploadUrl,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  /** When set, the toolbar gets an Image button that uploads to this endpoint. */
  imageUploadUrl?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      // Block-level, lazy: a body picture is never above the fold, and the saved
      // width/height keep the page from shifting while it loads.
      Image.extend({
        addAttributes() {
          return { ...this.parent?.(), width: { default: null }, height: { default: null } };
        },
      }).configure({ inline: false, HTMLAttributes: { loading: "lazy" } }),
    ],
    content: defaultValue,
    immediatelyRender: false, // avoids SSR hydration mismatch in Next.js
    editorProps: {
      attributes: {
        class:
          "min-h-[10rem] w-full rounded-b-md border border-t-0 border-input px-3 py-2 text-sm focus:outline-none [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <div>
        <Toolbar editor={editor} imageUploadUrl={imageUploadUrl} />
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="xs"
      variant={active ? "default" : "ghost"}
      onClick={onClick}
      className={cn(!active && "text-muted-foreground")}
    >
      {children}
    </Button>
  );
}

function Toolbar({ editor, imageUploadUrl }: { editor: Editor | null; imageUploadUrl?: string }) {
  if (!editor) {
    return <div className="h-9 rounded-t-md border border-input bg-muted" />;
  }

  return (
    <div className="flex flex-wrap gap-1 rounded-t-md border border-input bg-muted p-1">
      <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        B
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        ❝
      </ToolbarButton>
      {imageUploadUrl ? <ImageButton editor={editor} uploadUrl={imageUploadUrl} /> : null}
    </div>
  );
}

/**
 * Toolbar "Image": pick a file, describe it, upload, insert at the cursor. The
 * dialog is portalled out of the surrounding <form> and holds no <form> of its
 * own, so nothing in it can submit the article.
 */
function ImageButton({ editor, uploadUrl }: { editor: Editor; uploadUrl: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setFile(null);
    setAlt("");
    setError("");
    setBusy(false);
  }

  async function insert() {
    if (!file || !alt.trim()) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: { src: json.src, alt: alt.trim(), width: json.width, height: json.height },
        })
        .run();
      setOpen(false);
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setBusy(false);
    }
  }

  return (
    <>
      <ToolbarButton active={false} onClick={() => setOpen(true)}>
        Image
      </ToolbarButton>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert image</DialogTitle>
            <DialogDescription>
              The picture is placed where the cursor is, shown at the full column width.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="editor-image-alt">Description (alt text)</Label>
              <Input
                id="editor-image-alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                placeholder="What the picture shows"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button type="button" onClick={insert} disabled={busy || !file || !alt.trim()}>
              {busy ? "Uploading…" : "Insert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
