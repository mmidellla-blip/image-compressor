import type { MetadataRoute } from "next";
import { getAllSlugsServer as getAllSlugs } from "@/lib/blog-posts-server";
import { getAllToolDefinitions } from "@/lib/tools/definitions";
import { CALCULATOR_PATHS } from "@/lib/calculators/registry";
import { getAllArticleSlugs } from "@/lib/articles";
import { getPublicSiteUrl } from "@/lib/site-url";

/** 절대 URL은 `NEXT_PUBLIC_SITE_URL` 또는 기본값(https://www.compressdeck.com) 기준입니다. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();
  if (!base) return [];

  const origin = base.origin;
  const liveTools = getAllToolDefinitions().filter((t) => t.status !== "coming_soon");
  const paths = [
    ...new Set([
      "/",
      "/blog",
      "/about",
      "/contact",
      "/privacy-policy",
      "/terms",
      "/articles",
      "/calculators",
      "/glossary",
      ...CALCULATOR_PATHS,
      ...liveTools.map((t) => t.path),
      ...getAllSlugs().map((slug) => `/blog/${encodeURIComponent(slug)}`),
      ...getAllArticleSlugs().map((slug) => `/articles/${encodeURIComponent(slug)}`),
    ]),
  ];

  return paths.map((path) => ({
    url: `${origin}${path.startsWith("/") ? path : `/${path}`}`,
    changeFrequency: path === "/" ? "weekly" : ("monthly" as const),
    priority: path === "/" ? 1 : path.startsWith("/blog") ? 0.75 : path.startsWith("/articles") ? 0.8 : 0.85,
  }));
}
