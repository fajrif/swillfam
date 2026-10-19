import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryView, categoryMetadata, getCategoryBySlug } from "./CategoryView";
import { VenueView, venueMetadata, getVenueBySlug } from "./VenueView";

// SSG per known slug at build time, but data-driven — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

/**
 * One dynamic segment serves both venue categories (/venues/lifestyle) and
 * individual venues (/venues/zoo): the App Router does not allow two dynamic
 * segments side by side, so the slug is resolved here instead. Categories win
 * on a tie, and `createVenueAction`/`updateVenueAction` reject a venue slug
 * that collides with a category so a tie can never actually happen.
 */
export async function generateStaticParams() {
  const [categories, venues] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }),
    prisma.venue.findMany({ where: { published: true }, select: { slug: true } }),
  ]);
  return [...categories, ...venues].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (category) return categoryMetadata(category);

  const venue = await getVenueBySlug(slug);
  if (venue) return venueMetadata(venue);

  return { title: "Venues | SwillFam" };
}

export default async function VenuesSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (category) return <CategoryView category={category} />;

  const venue = await getVenueBySlug(slug);
  if (venue) return <VenueView venue={venue} />;

  notFound();
}
