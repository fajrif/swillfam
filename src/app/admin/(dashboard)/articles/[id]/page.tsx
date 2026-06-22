import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateArticleAction, deleteArticleAction } from "../actions";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.articleCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!article) notFound();

  return (
    <div>
      <EditHeader title="Edit Article" backHref="/admin/articles" />
      <Card>
        <ArticleForm action={updateArticleAction.bind(null, id)} article={article} categories={categories} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteArticleAction.bind(null, id)} label="Delete article" />
        </div>
      </Card>
    </div>
  );
}
