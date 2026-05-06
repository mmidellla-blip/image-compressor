import type { Metadata } from "next";
import { SITE_BRAND } from "@/lib/site-brand";
import type { BlogPost } from "@/lib/blog-types";
import { getCanonicalUrl } from "@/lib/site-url";

/** 블로그 글 canonical·OG·robots 통일 */
export function buildBlogPostMetadata(post: BlogPost): Metadata {
  const path = `/blog/${encodeURIComponent(post.slug)}`;
  const canonical = getCanonicalUrl(path);

  return {
    title: post.title,
    description: post.description,
    keywords: [
      "이미지 용량 줄이기",
      "JPG 용량 줄이기",
      "사진 용량 줄이기",
      "무료 이미지 툴",
      "이미지 압축",
      post.title,
    ],
    alternates: canonical ? { canonical } : {},
    openGraph: {
      title: post.title,
      description: post.description,
      ...(canonical ? { url: canonical } : {}),
      locale: "ko_KR",
      type: "article",
      siteName: SITE_BRAND,
    },
    robots: { index: true, follow: true },
  };
}
