import type { MetadataRoute } from "next";
import { CALCULATOR_PATHS } from "@/lib/calculators/registry";
import { getAllArticleSlugs } from "@/lib/articles";
import { DEFAULT_PUBLIC_SITE_URL, getPublicSiteUrl } from "@/lib/site-url";
import { headers } from "next/headers";

/** 절대 URL은 `NEXT_PUBLIC_SITE_URL` 또는 접속 헤더(Host) 기준입니다. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let origin = "";

  const base = getPublicSiteUrl();
  if (base) {
    origin = base.origin;
  } else {
    try {
      const headersList = await headers();
      const host = headersList.get("host");
      if (host) {
        const proto = headersList.get("x-forwarded-proto") || "https";
        origin = `${proto}://${host}`;
      }
    } catch {
      // 정적 빌드 시점 등 헤더 사용이 안 될 때
    }
  }

  // 폴백 기본 주소
  if (!origin) {
    origin = DEFAULT_PUBLIC_SITE_URL;
  }

  // 이미지 도구·이미지 압축 블로그 글은 저품질 콘텐츠 정책 대응을 위해 사이트맵에서 제외합니다.
  const paths = [
    ...new Set([
      "/",
      "/about",
      "/contact",
      "/privacy-policy",
      "/terms",
      "/editorial-policy",
      "/articles",
      "/calculators",
      "/glossary",
      ...CALCULATOR_PATHS,
      ...getAllArticleSlugs().map((slug) => `/articles/${encodeURIComponent(slug)}`),
    ]),
  ];

  return paths.map((path) => ({
    url: `${origin}${path.startsWith("/") ? path : `/${path}`}`,
    changeFrequency: path === "/" ? "weekly" : ("monthly" as const),
    priority: path === "/" ? 1 : path.startsWith("/blog") ? 0.75 : path.startsWith("/articles") ? 0.8 : 0.85,
  }));
}
