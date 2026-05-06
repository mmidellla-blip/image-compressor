import type { FaqItem } from "@/lib/tools/types";
import { SITE_BRAND } from "@/lib/site-brand";

type JsonLdGraphProps = {
  id: string;
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** FAQPage + WebApplication 등 JSON-LD를 삽입합니다. */
export function JsonLdScript({ id, data }: JsonLdGraphProps) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function buildWebApplicationLd(args: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
}): Record<string, unknown> {
  return {
    "@type": "WebApplication",
    name: args.name,
    description: args.description,
    url: args.url,
    applicationCategory: args.applicationCategory ?? "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    isAccessibleForFree: true,
    inLanguage: "ko",
  };
}

export function buildFaqPageLd(faqs: FaqItem[]): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/** 도구·블로그 등 페이지 브레드크럼 (내비게이션 검색 결과용) */
export function buildBreadcrumbListLd(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** 도구 사용 방법 — 검색·AI 답변용 HowTo */
export function buildHowToLd(args: {
  name: string;
  description: string;
  url: string;
  steps: { name: string; text: string }[];
}): Record<string, unknown> {
  return {
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    url: args.url,
    inLanguage: "ko-KR",
    step: args.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** 블로그 글 — 검색·소셜 미리보기 보조 */
export function buildArticleLd(args: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}): Record<string, unknown> {
  const pub = args.datePublished ?? "2026-05-06";
  const mod = args.dateModified ?? pub;
  return {
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    url: args.url,
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    datePublished: pub,
    dateModified: mod,
    author: {
      "@type": "Organization",
      name: SITE_BRAND,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_BRAND,
    },
  };
}
