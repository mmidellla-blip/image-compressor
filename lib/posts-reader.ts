import fs from "fs";
import path from "path";
import type { BlogPost } from "./blog-types";

export function getDynamicPosts(): BlogPost[] {
  const postsDir = path.join(process.cwd(), "posts");

  let files: string[];
  try {
    files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }

  const posts: BlogPost[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const post = JSON.parse(raw) as BlogPost & { published?: boolean };
      if (post.published !== false) {
        posts.push({
          slug: post.slug,
          title: post.title,
          description: post.description,
          datePublished: post.datePublished,
          contentHtml: post.contentHtml,
          sections: post.sections ?? [],
          relatedSlugs: post.relatedSlugs ?? [],
          faq: post.faq,
          closingSummary: post.closingSummary,
        });
      }
    } catch {
      // 손상된 파일 skip
    }
  }

  return posts.sort((a, b) => {
    if (!a.datePublished) return 1;
    if (!b.datePublished) return -1;
    return (
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    );
  });
}
