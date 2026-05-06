import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/site-url";

/** 소개·문의·정책 등 정적 페이지 공통 Metadata */
export function buildStaticPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const canonical = getCanonicalUrl(opts.path);

  return {
    title: opts.title,
    description: opts.description,
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    alternates: canonical ? { canonical } : {},
    openGraph: {
      title: opts.title,
      description: opts.description,
      ...(canonical ? { url: canonical } : {}),
      locale: "ko_KR",
      type: "website",
      siteName: "무료 온라인 이미지 툴 모음",
    },
    robots: { index: true, follow: true },
  };
}
