"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageManager } from "./ImageManager";
import { cn } from "@/lib/utils";

/**
 * Where a value stops helping and starts getting cut off in search results.
 * `max` mirrors DESCRIPTION_MAX in src/lib/seo/metadata.ts; `min` is the point
 * below which a field is too thin to earn a click.
 */
const TITLE_RANGE = { min: 25, max: 60 };
const DESCRIPTION_RANGE = { min: 70, max: 155 };

/**
 * Live length readout for one SEO field.
 *
 * Advisory only — it never blocks a save. Admins sometimes have a good reason
 * to run long, and a form that refuses to submit over a soft SEO guideline is
 * worse than one that just says so. An empty field is called out as inheriting
 * the page default rather than flagged as a problem.
 */
function Counter({
  length,
  min,
  max,
}: {
  length: number;
  min: number;
  max: number;
}) {
  if (length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Empty — the page falls back to its built-in default.
      </p>
    );
  }

  const over = length > max;
  const short = length < min;

  return (
    <p
      className={cn(
        "text-xs",
        over && "font-medium text-destructive",
        short && !over && "font-medium text-amber-600",
        !over && !short && "text-muted-foreground",
      )}
    >
      {length} / {max} characters
      {over && ` — ${length - max} over, search results will cut this off`}
      {short && !over && " — short enough that it may get rewritten"}
    </p>
  );
}

/**
 * Meta title/description/share-image group, reused on every resource form and
 * on the Page SEO screen.
 *
 * The Page SEO screen renders 16 of these in one form, which is why every
 * field name is a prop: it prefixes each with its page key.
 */
export function SeoFields({
  titleLabel = "Meta Title",
  titleName = "metaTitle",
  titleValue,
  descriptionLabel = "Meta Description",
  descriptionName = "metaDescription",
  descriptionValue,
  ogImageLabel = "Social share image",
  ogImageName = "ogImage",
  ogImageValue,
}: {
  titleLabel?: string;
  titleName?: string;
  titleValue?: string | null;
  descriptionLabel?: string;
  descriptionName?: string;
  descriptionValue?: string | null;
  ogImageLabel?: string;
  ogImageName?: string;
  ogImageValue?: string | null;
}) {
  const [title, setTitle] = useState(titleValue ?? "");
  const [description, setDescription] = useState(descriptionValue ?? "");

  return (
    <div className="grid gap-4 rounded-md border bg-muted/40 p-4">
      <div className="grid gap-1.5">
        <Label htmlFor={titleName}>{titleLabel}</Label>
        <Input
          id={titleName}
          name={titleName}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Counter length={title.length} {...TITLE_RANGE} />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={descriptionName}>{descriptionLabel}</Label>
        <Textarea
          id={descriptionName}
          name={descriptionName}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Counter length={description.length} {...DESCRIPTION_RANGE} />
      </div>

      <ImageManager
        name={ogImageName}
        label={ogImageLabel}
        existing={ogImageValue ? [ogImageValue] : []}
        hint="1200×630 works everywhere. Optional — falls back to this record's banner or poster image, then to the sitewide default."
      />
    </div>
  );
}
