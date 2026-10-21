import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader } from "@/components/admin/PageHeader";
import { updateCategoryAction, deleteCategoryAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";
import { EditPageTabs } from "@/components/admin/EditPageTabs";
import { SeoDetailsPanel } from "@/components/admin/SeoDetailsPanel";
import { categorySeo } from "@/lib/seo/entities";
import { getImageAltRecord } from "@/lib/image-alt";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const altsByPath = await getImageAltRecord();
  await requireAdministrator();
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <EditHeader title="Edit Venue Category" backHref="/admin/categories" />
      <EditPageTabs
        details={
          <>
            <CategoryForm
              altsByPath={altsByPath}
              action={updateCategoryAction.bind(null, id)}
              category={category}
            />
            <div className="mt-6 pt-6 border-t border-zinc-200">
              <ConfirmDeleteButton action={deleteCategoryAction.bind(null, id)} label="Delete category" />
            </div>
          </>
        }
        seo={
          <>
            <SeoDetailsPanel seo={categorySeo(category)} publicPath={`/venues/${category.slug}`} />
          </>
        }
      />
    </div>
  );
}
