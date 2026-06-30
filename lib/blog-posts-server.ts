import { allPosts } from "@/lib/blog/data/all-posts";
import { getDynamicPosts } from "@/lib/posts-reader";
import type { BlogPost } from "@/lib/blog-types";

const staticSlugs = new Set(allPosts.map((p) => p.slug));

const allBlogPosts: BlogPost[] = [
  ...allPosts,
  ...getDynamicPosts().filter((p) => !staticSlugs.has(p.slug)),
];

export function getAllBlogPosts(): BlogPost[] {
  return allBlogPosts;
}

export function getPostBySlugServer(slug: string): BlogPost | undefined {
  return allBlogPosts.find((p) => p.slug === slug);
}

export function getAllSlugsServer(): string[] {
  return allBlogPosts.map((p) => p.slug);
}

export function getRelatedPostsServer(
  slug: string,
  limit = 3
): BlogPost[] {
  const post = getPostBySlugServer(slug);
  if (!post) return [];
  const preferred: BlogPost[] = [];
  const seen = new Set<string>([slug]);

  for (const rs of post.relatedSlugs) {
    const p = getPostBySlugServer(rs);
    if (p && !seen.has(p.slug)) {
      preferred.push(p);
      seen.add(p.slug);
    }
    if (preferred.length >= limit) return preferred.slice(0, limit);
  }

  for (const p of allBlogPosts) {
    if (seen.has(p.slug)) continue;
    preferred.push(p);
    seen.add(p.slug);
    if (preferred.length >= limit) break;
  }

  return preferred.slice(0, limit);
}
