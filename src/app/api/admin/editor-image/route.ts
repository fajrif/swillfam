import { NextResponse } from "next/server";
import { getCurrentAdmin, isAdministrator } from "@/lib/admin-auth";
import { saveBodyImage } from "@/lib/upload";

/**
 * Upload endpoint for pictures placed inside a rich-text body. It is a route
 * handler rather than a Server Action because the editor needs the saved path
 * back mid-edit, before the surrounding form is submitted. Administrator-only:
 * today only the article body uses it.
 */
export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin || !isAdministrator(admin)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file." }, { status: 400 });
  }

  try {
    return NextResponse.json(await saveBodyImage(file, "articles/body"));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 400 },
    );
  }
}
