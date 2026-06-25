import type { Category } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiblingCategorySection } from "@/components/category";

/** "Explore by Category" — a SiblingCategorySection card per category. */
export function VenuesCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="pt-8 lg:pt-16">
      <Container>
        <SectionHeading
          title="Explore by Category"
          titleClassName="mb-4"
        />
      </Container>
      {categories.map((category, i) => (
        <SiblingCategorySection
          key={category.id}
          category={category}
          imagePosition={i % 2 === 0 ? "left" : "right"}
          sectionClassName="py-4"
        />
      ))}
    </section>
  );
}
