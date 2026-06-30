import { getPostFile } from "@/lib/github-api";
import { notFound } from "next/navigation";
import { PostForm } from "../../_components/post-form";

type Props = { params: Promise<{ slug: string }> };

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;
  const result = await getPostFile(slug);

  if (!result) notFound();

  return (
    <PostForm
      mode="edit"
      initialData={{
        slug,
        sha: result.sha,
        title: result.data.title,
        description: result.data.description,
        datePublished: result.data.datePublished,
        contentHtml: result.data.contentHtml,
        published: result.data.published,
      }}
    />
  );
}
