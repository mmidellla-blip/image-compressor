import type { Metadata } from "next";
import { SiteChrome } from "@/components/site-chrome";
import { GlossarySearch } from "@/components/glossary/glossary-search";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";
import {
  JsonLdScript,
  buildBreadcrumbListLd,
  buildDefinedTermSetLd,
} from "@/lib/seo/json-ld";
import { getCanonicalUrl } from "@/lib/site-url";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "머니깨비 용어사전 - 신용창조·지급준비율·뱅크런 쉽게 이해하기",
  description:
    "신용창조, 지급준비율, 뱅크런처럼 자주 듣지만 헷갈리는 경제 용어를 검색해서 바로 확인할 수 있는 머니깨비 용어사전입니다.",
  path: "/glossary",
  keywords: [
    "경제 용어사전",
    "신용창조",
    "지급준비율",
    "뱅크런",
    "청약 가점제",
    "신용점수",
  ],
});

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms();
  const canonical = getCanonicalUrl("/glossary") ?? "/glossary";
  const home = getCanonicalUrl("/") ?? "/";

  const graph = [
    buildDefinedTermSetLd({
      name: "머니깨비 용어사전",
      description:
        "신용창조, 지급준비율, 뱅크런처럼 자주 듣지만 헷갈리는 경제 용어를 정리한 용어사전입니다.",
      url: canonical,
      terms: terms.map((t) => ({
        name: t.term,
        description: t.shortDefinition,
        url: t.relatedArticleSlug
          ? getCanonicalUrl(`/articles/${encodeURIComponent(t.relatedArticleSlug)}`) ??
            undefined
          : undefined,
      })),
    }),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "용어사전", url: canonical },
    ]),
  ];

  return (
    <SiteChrome>
      <JsonLdScript id="jsonld-glossary" data={graph} />

      <h1 className="page-title">머니깨비 용어사전</h1>
      <p className="page-lead">
        신용창조·지급준비율·뱅크런처럼 자주 듣지만 막상 설명하려면 헷갈리는 경제 용어를
        검색해서 바로 확인하고, 더 자세한 설명이 필요하면 관련 아티클로 이어볼 수
        있습니다.
      </p>

      <GlossarySearch terms={terms} />

      <style>{`
        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
        }
        .page-lead {
          color: var(--muted);
          margin: 0 0 0.5rem;
          line-height: 1.65;
        }
      `}</style>
    </SiteChrome>
  );
}
