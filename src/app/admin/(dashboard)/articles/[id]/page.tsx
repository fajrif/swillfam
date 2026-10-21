import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader } from "@/components/admin/PageHeader";
import { updateArticleAction, deleteArticleAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";
import { EditPageTabs } from "@/components/admin/EditPageTabs";
import { SeoDetailsPanel } from "@/components/admin/SeoDetailsPanel";
import { articleSeo } from "@/lib/seo/entities";
import { getImageAltRecord } from "@/lib/image-alt";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const altsByPath = await getImageAltRecord();
  await requireAdministrator();
  const { id } = await params;
  const [article, categories, venues] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { venues: { select: { id: true } } },
    }),
    prisma.articleCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!article) notFound();

  return (
    <div>
      <EditHeader title="Edit Article" backHref="/admin/articles" />
      <EditPageTabs
        details={
          <>
            <ArticleForm
              altsByPath={altsByPath}
              action={updateArticleAction.bind(null, id)}
              article={article}
              categories={categories}
              venues={venues}
              selectedVenueIds={article.venues.map((v) => v.id)}
            />
            <div className="mt-6 pt-6 border-t border-zinc-200">
              <ConfirmDeleteButton action={deleteArticleAction.bind(null, id)} label="Delete article" />
            </div>
          </>
        }
        seo={
          <>
            <SeoDetailsPanel
              seo={articleSeo(article)}
              publicPath={`/guides/${article.slug}`}
              unavailableReason={
                article.status === 1
                  ? undefined
                  : "This guide is still a draft, so it has no public page yet. Set Status to Published to see it."
              }
            />
          </>
        }
      />
    </div>
  );
}
