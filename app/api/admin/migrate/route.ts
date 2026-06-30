import { NextResponse } from "next/server";
import { allPosts } from "@/lib/blog/data/all-posts";
import { savePostFile } from "@/lib/github-api";

function sectionsToHtml(
  sections: Array<{ heading: string; paragraphs: string[] }>
): string {
  return sections
    .map((sec) => {
      const heading = sec.heading ? `<h2>${sec.heading}</h2>` : "";
      const paragraphs = sec.paragraphs
        .map((p) => `<p>${p}</p>`)
        .join("\n");
      return heading + "\n" + paragraphs;
    })
    .join("\n\n");
}

export async function POST() {
  const results: string[] = [];
  const errors: string[] = [];

  for (const post of allPosts) {
    try {
      const contentHtml = sectionsToHtml(post.sections);

      await savePostFile(post.slug, {
        slug: post.slug,
        title: post.title,
        description: post.description,
        datePublished: post.datePublished ?? new Date().toISOString().split("T")[0],
        contentHtml,
        published: true,
        relatedSlugs: post.relatedSlugs,
        sections: [] as never[],
        closingSummary: post.closingSummary,
        faq: post.faq,
      });

      results.push(post.slug);
    } catch (err) {
      errors.push(`${post.slug}: ${String(err)}`);
    }
  }

  return NextResponse.json({
    migrated: results.length,
    failed: errors.length,
    results,
    errors,
  });
}
