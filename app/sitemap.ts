import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog-posts";
import { getAllToolDefinitions } from "@/lib/tools/definitions";
import { getPublicSiteUrl } from "@/lib/site-url";

/** NEXT_PUBLIC_SITE_URL 이 설정된 경우에만 절대 URL로 사이트맵을 채웁니다. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();
  if (!base) return [];

  const origin = base.origin;
  const paths = [
    "/",
    "/blog",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    ...getAllToolDefinitions().map((t) => t.path),
    ...getAllSlugs().map((slug) => `/blog/${encodeURIComponent(slug)}`),
  ];

  return paths.map((path) => ({
    url: `${origin}${path.startsWith("/") ? path : `/${path}`}`,
    changeFrequency: path === "/" ? "weekly" : ("monthly" as const),
    priority: path === "/" ? 1 : path.startsWith("/blog") ? 0.75 : 0.85,
  }));
}
