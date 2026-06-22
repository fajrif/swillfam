import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createArticleAction } from "../actions";

export default async function NewArticlePage() {
  const categories = await prisma.articleCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <EditHeader title="New Article" backHref="/admin/articles" />
      <Card>
        <ArticleForm action={createArticleAction} categories={categories} />
      </Card>
    </div>
  );
}
