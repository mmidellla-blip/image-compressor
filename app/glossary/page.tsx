import type { Metadata } from "next";
import Link from "next/link";
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

      <section className="glossary-about">
        <h2 className="glossary-about-h2">용어사전은 어떻게 골랐나요?</h2>
        <p className="glossary-about-p">
          뉴스·은행 앱·계산기 화면에 자주 등장하지만 짧게 설명해주는 곳이 없는 용어부터
          골랐습니다. 신용점수·연말정산·청약·적금 계산기를 쓰다가 마주치는 용어(원천징수,
          인적공제, DSR, 신용등급 등)와 뉴스에서 자주 나오는 거시경제 용어(뱅크런, 지급준비율,
          신용창조)를 함께 담았습니다.
        </p>
        <p className="glossary-about-p">
          각 용어는 한두 문장으로 먼저 감을 잡을 수 있게 짧게 정의하고, 더 깊이 알고 싶으면
          연결된 <Link href="/articles">아티클</Link>에서 예시·계산 구조까지 이어서 볼 수
          있습니다.
        </p>
      </section>

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
        .glossary-about {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .glossary-about-h2 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .glossary-about-p {
          margin: 0 0 1rem;
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--fg);
        }
      `}</style>
    </SiteChrome>
  );
}
