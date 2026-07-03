import { getDynamicArticles } from "./articles-reader";
import type { Article } from "./article-types";

export type { Article } from "./article-types";

export function getAllArticles(): Article[] {
  return getDynamicArticles();
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

/** 관련 아티클: 우선 relatedSlugs, 부족하면 나머지 글에서 채움 */
export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const all = getAllArticles();
  const article = all.find((a) => a.slug === slug);
  if (!article) return [];

  const preferred: Article[] = [];
  const seen = new Set<string>([slug]);

  for (const rs of article.relatedSlugs) {
    const a = all.find((x) => x.slug === rs);
    if (a && !seen.has(a.slug)) {
      preferred.push(a);
      seen.add(a.slug);
    }
    if (preferred.length >= limit) return preferred.slice(0, limit);
  }

  for (const a of all) {
    if (seen.has(a.slug)) continue;
    preferred.push(a);
    seen.add(a.slug);
    if (preferred.length >= limit) break;
  }

  return preferred.slice(0, limit);
}
