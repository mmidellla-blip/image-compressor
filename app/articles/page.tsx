import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { getAllArticles } from "@/lib/articles";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "경제 아티클 - 청약·신용점수·연말정산·적금 쉽게 이해하기",
  description:
    "청약 가점, 신용점수, 연말정산, 적금처럼 사회초년생이 자주 마주치는 경제 개념을 쉽고 재밌게 풀어 쓴 머니깨비 아티클 모음입니다.",
  path: "/articles",
  keywords: [
    "경제 아티클",
    "청약 가점제",
    "신용점수",
    "연말정산",
    "적금 이자",
    "경제 용어",
  ],
});

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <SiteChrome>
      <h1 className="page-title">아티클</h1>
      <p className="page-lead">
        청약·신용점수·연말정산·적금처럼 사회초년생이 자주 마주치지만 막상 알아보려면
        어려운 돈 이야기를 쉽고 재밌게 풀어 썼습니다.
      </p>
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/articles/${encodeURIComponent(article.slug)}`}>
              {article.title}
            </Link>
            <span className="article-category">{article.category}</span>
            {article.datePublished && (
              <time className="article-date" dateTime={article.datePublished}>
                {new Date(article.datePublished).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            <span className="article-desc">{article.description}</span>
          </li>
        ))}
      </ul>

      <section className="article-about">
        <h2 className="article-about-h2">아티클은 어떻게 쓰나요?</h2>
        <p className="article-about-p">
          청약·신용점수·연말정산·적금 계산기를 만들면서 &quot;계산 결과는 나왔는데 이 항목이
          왜 이렇게 계산되는지 모르겠다&quot;는 질문에 답하려고 아티클을 씁니다. 각 글은 법령·
          공식 산정 방식을 근거로 하되, 법령 문구를 그대로 옮기지 않고 사회초년생이 실제로
          헷갈리는 지점(무주택기간 기산일, 소득공제와 세액공제 차이, DSR과 신용점수 차이 등)을
          중심으로 다시 씁니다.
        </p>
        <p className="article-about-p">
          각 글 끝에는 자주 묻는 질문과 요약, 관련 아티클 링크를 붙여 계산기 → 아티클 →
          <Link href="/glossary">용어사전</Link>으로 자연스럽게 이어볼 수 있게 했습니다. 제도·세율이
          바뀌면 관련 글을 순차적으로 검토해 갱신하며, 오류를 발견하면{" "}
          <Link href="/contact">문의 페이지</Link>로 알려주세요.
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
          margin: 0 0 1.5rem;
          line-height: 1.65;
        }
        .article-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .article-list li {
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }
        .article-list a {
          display: inline-block;
          font-weight: 700;
          text-decoration: none;
          color: var(--fg);
        }
        .article-list a:hover {
          color: #d69e2e;
        }
        .article-category {
          display: inline-block;
          margin-left: 0.55rem;
          padding: 0.12rem 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: #92702a;
          background: #fffbeb;
          border: 1px solid #f5c344;
          border-radius: 999px;
          vertical-align: middle;
        }
        .article-date {
          display: block;
          margin-top: 0.2rem;
          font-size: 0.8rem;
          color: var(--muted);
        }
        .article-desc {
          display: block;
          margin-top: 0.2rem;
          font-size: 0.875rem;
          color: var(--muted);
        }
        .article-about {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .article-about-h2 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .article-about-p {
          margin: 0 0 1rem;
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--fg);
        }
      `}</style>
    </SiteChrome>
  );
}
