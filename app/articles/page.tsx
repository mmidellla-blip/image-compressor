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
      `}</style>
    </SiteChrome>
  );
}
