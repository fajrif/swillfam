import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NameForm } from "@/components/admin/NameForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateArticleCategoryAction, deleteArticleCategoryAction } from "../actions";

export default async function EditArticleCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.articleCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <EditHeader title="Edit Article Category" backHref="/admin/article-categories" />
      <Card>
        <NameForm action={updateArticleCategoryAction.bind(null, id)} name={category.name} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteArticleCategoryAction.bind(null, id)} label="Delete category" />
        </div>
      </Card>
    </div>
  );
}
