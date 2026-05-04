import { allPosts } from "@/lib/blog/data/all-posts";
import type { BlogPost } from "@/lib/blog-types";

export type { BlogPost } from "@/lib/blog-types";

export const blogPosts: BlogPost[] = allPosts;

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}

/** 관련 글: 우선 relatedSlugs, 부족하면 나머지 글에서 채움 */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  const preferred: BlogPost[] = [];
  const seen = new Set<string>([slug]);

  for (const rs of post.relatedSlugs) {
    const p = getPostBySlug(rs);
    if (p && !seen.has(p.slug)) {
      preferred.push(p);
      seen.add(p.slug);
    }
    if (preferred.length >= limit) return preferred.slice(0, limit);
  }

  for (const p of blogPosts) {
    if (seen.has(p.slug)) continue;
    preferred.push(p);
    seen.add(p.slug);
    if (preferred.length >= limit) break;
  }

  return preferred.slice(0, limit);
}
