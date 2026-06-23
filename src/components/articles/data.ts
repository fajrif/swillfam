import type { ArticleRow } from "@/components/shared/ArticleListSection";

export const CATEGORIES = [
  "All Journals",
  "Nightlife",
  "Lifestyle",
  "Talents",
  "Social Proof",
];

const EXCERPT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.";

const ARTICLE_IMAGES = [
  "/home/guide-1.jpg",
  "/home/poster-1.png",
  "/home/guide-2.jpg",
  "/home/poster-2.png",
  "/home/guide-3.jpg",
  "/home/poster-3.png",
  "/home/guide-1.jpg",
  "/home/poster-2.png",
  "/home/guide-3.jpg",
];

/** Static placeholder article feed (Figma "SwillFam - Articles"). */
export const ARTICLES: ArticleRow[] = ARTICLE_IMAGES.map((img) => ({
  img,
  date: "22/06/2026",
  title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna",
  excerpt: EXCERPT,
  href: "#",
}));
