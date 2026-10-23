/** "Published" / "Draft" pill for the admin list tables. */
export function PublishedBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      Published
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
      Draft
    </span>
  );
}
