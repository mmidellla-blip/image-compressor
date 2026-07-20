import type { MetadataRoute } from "next";
import { getAllToolDefinitions } from "@/lib/tools/definitions";
import { CALCULATOR_PATHS } from "@/lib/calculators/registry";
import { getAllArticleSlugs } from "@/lib/articles";
import { getPublicSiteUrl } from "@/lib/site-url";

/** 절대 URL은 `NEXT_PUBLIC_SITE_URL` 또는 기본값(https://www.compressdeck.com) 기준입니다. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();
  if (!base) return [];

  const origin = base.origin;
  // 이미지 도구·이미지 압축 블로그 글은 저품질 콘텐츠 정책 대응을 위해 사이트맵에서 제외합니다.
  const liveNonImageTools = getAllToolDefinitions().filter(
    (t) => t.status !== "coming_soon" && t.slug === "video-download",
  );
  const paths = [
    ...new Set([
      "/",
      "/about",
      "/contact",
      "/privacy-policy",
      "/terms",
      "/articles",
      "/calculators",
      "/glossary",
      ...CALCULATOR_PATHS,
      ...liveNonImageTools.map((t) => t.path),
      ...getAllArticleSlugs().map((slug) => `/articles/${encodeURIComponent(slug)}`),
    ]),
  ];

  return paths.map((path) => ({
    url: `${origin}${path.startsWith("/") ? path : `/${path}`}`,
    changeFrequency: path === "/" ? "weekly" : ("monthly" as const),
    priority: path === "/" ? 1 : path.startsWith("/blog") ? 0.75 : path.startsWith("/articles") ? 0.8 : 0.85,
  }));
}
