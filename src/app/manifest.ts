import type { MetadataRoute } from "next";

/**
 * Web app manifest.
 *
 * Not a PWA ambition — `display: "browser"` says so plainly. It exists because
 * the brief asks for one, and because without it Android's "Add to Home
 * screen" invents a name and screenshots the page for an icon. With it, a
 * saved shortcut carries the brand mark and the right name.
 *
 * The icons are the only two files it needs and they live in `public/` rather
 * than coming from the `icon.png` file convention: Next serves that one from a
 * content-hashed URL, which is exactly what a manifest must not hardcode.
 * `scripts/generate-icons.ts` writes all of them from one source.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SwillFam",
    short_name: "SwillFam",
    description:
      "SwillFam runs Jakarta's lifestyle and nightlife venues — restaurants, cafés, cocktail bars and clubs.",
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
