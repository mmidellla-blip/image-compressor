import type { Metadata } from "next";
import { SITE_BRAND } from "@/lib/site-brand";
import { getToolDefinition, type ToolSlug } from "@/lib/tools/definitions";
import { getCanonicalUrl } from "@/lib/site-url";

/** 각 도구 페이지의 Metadata 객체를 한곳에서 생성합니다. */
/** 이미지 도구는 저품질 콘텐츠 정책 대응을 위해 당분간 검색 노출을 막습니다. */
const NOINDEX_IMAGE_TOOLS = true;

export function buildToolMetadata(slug: ToolSlug): Metadata {
  const t = getToolDefinition(slug);
  const isComingSoon = t.status === "coming_soon";
  const isImageTool = slug !== "video-download";
  const canonical = getCanonicalUrl(t.path);

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    keywords: t.keywords,
    alternates: canonical ? { canonical } : {},
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      ...(canonical ? { url: canonical } : {}),
      locale: "ko_KR",
      type: "website",
      siteName: SITE_BRAND,
    },
    robots:
      isComingSoon || (NOINDEX_IMAGE_TOOLS && isImageTool)
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };
}
