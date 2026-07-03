import { SiteChrome } from "@/components/site-chrome";
import {
  JsonLdScript,
  buildArticleLd,
  buildBreadcrumbListLd,
  buildFaqPageLd,
} from "@/lib/seo/json-ld";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { getCanonicalUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "글을 찾을 수 없습니다" };
  }
  return buildStaticPageMetadata({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}`,
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug, 3);

  const path = `/articles/${encodeURIComponent(article.slug)}`;
  const canonical = getCanonicalUrl(path) ?? path;
  const articlesIndex = getCanonicalUrl("/articles") ?? "/articles";
  const home = getCanonicalUrl("/") ?? "/";

  const graph: Record<string, unknown>[] = [
    buildArticleLd({
      headline: article.title,
      description: article.description,
      url: canonical,
      datePublished: article.datePublished,
    }),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "아티클", url: articlesIndex },
      { name: article.title, url: canonical },
    ]),
  ];
  if (article.faq && article.faq.length > 0) {
    graph.push(buildFaqPageLd(article.faq));
  }

  return (
    <SiteChrome mainClassName="article-main">
      <JsonLdScript id={`jsonld-article-${article.slug}`} data={graph} />

      <article className="article" itemScope itemType="https://schema.org/Article">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link href="/">홈</Link>
          <span aria-hidden> · </span>
          <Link href="/articles">아티클</Link>
          <span aria-hidden> · </span>
          <span>{article.title}</span>
        </nav>

        <span className="article-category">{article.category}</span>

        <h1 className="article-title" itemProp="headline">
          {article.title}
        </h1>
        <div className="article-meta">
          <span
            className="article-meta-author"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
          >
            <span itemProp="name">머니깨비 편집팀</span>
          </span>
          {article.datePublished && (
            <>
              <span className="article-meta-sep">·</span>
              <time
                className="article-meta-date"
                dateTime={article.datePublished}
                itemProp="datePublished"
              >
                {new Date(article.datePublished).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </>
          )}
        </div>
        <p className="article-desc" itemProp="description">
          {article.description}
        </p>

        <div
          className="prose prose-html"
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {article.closingSummary ? (
          <section className="article-summary" aria-labelledby="sum-h">
            <h2 id="sum-h" className="section-h2">
              한 줄 요약
            </h2>
            <p className="article-summary-p">{article.closingSummary}</p>
          </section>
        ) : null}

        {article.faq && article.faq.length > 0 ? (
          <section className="article-faq" aria-labelledby="faq-h">
            <h2 id="faq-h" className="section-h2">
              자주 묻는 질문
            </h2>
            <dl className="article-faq-dl">
              {article.faq.map((f, i) => (
                <div key={i} className="article-faq-item">
                  <dt className="article-faq-q">{f.question}</dt>
                  <dd className="article-faq-a">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <aside className="cta-box" aria-label="계산기 안내">
          <p>
            직접 계산해보고 싶다면{" "}
            <Link href="/calculators/subscription-score" className="cta-link">
              청약 가점 계산기
            </Link>
            를 사용해보세요.
          </p>
        </aside>

        {related.length > 0 ? (
          <nav className="related" aria-labelledby="related-heading">
            <h2 id="related-heading" className="related-title">
              관련 아티클
            </h2>
            <ul className="related-list">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/articles/${encodeURIComponent(r.slug)}`}>
                    {r.title}
                  </Link>
                  <span className="related-desc">{r.description}</span>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <nav className="article-site-nav" aria-label="사이트 이동">
          <Link href="/articles" className="article-home-link">
            ← 아티클 전체 보기
          </Link>
        </nav>
      </article>

      <style>{`
        .article-main {
          max-width: 42rem;
        }
        .breadcrumb {
          font-size: 0.85rem;
          color: var(--muted);
          margin: 0 0 1rem;
          line-height: 1.5;
          flex-wrap: wrap;
        }
        .breadcrumb a {
          text-decoration: none;
          color: var(--muted);
        }
        .breadcrumb a:hover {
          color: #d69e2e;
        }
        .article-category {
          display: inline-block;
          margin-bottom: 0.6rem;
          padding: 0.15rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #92702a;
          background: #fffbeb;
          border: 1px solid #f5c344;
          border-radius: 999px;
        }
        .article-title {
          font-size: clamp(1.35rem, 3.5vw, 1.75rem);
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 0.75rem;
        }
        .article-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin: 0 0 0.85rem;
          font-size: 0.83rem;
          color: var(--muted);
        }
        .article-meta-sep {
          color: var(--border);
        }
        .article-desc {
          color: var(--muted);
          margin: 0 0 1.5rem;
          font-size: 0.95rem;
        }
        .prose-html p { margin: 0 0 1rem; line-height: 1.8; font-size: 0.96rem; }
        .prose-html h2 { font-size: 1.12rem; font-weight: 800; margin: 1.5rem 0 0.65rem; line-height: 1.35; }
        .prose-html h3 { font-size: 1rem; font-weight: 700; margin: 1.25rem 0 0.5rem; }
        .prose-html ul, .prose-html ol { padding-left: 1.5rem; margin: 0 0 1rem; }
        .prose-html li { margin-bottom: 0.4rem; line-height: 1.75; font-size: 0.96rem; }
        .prose-html strong { font-weight: 700; }
        .article-summary {
          margin-top: 1.75rem;
          padding: 1rem 1.1rem;
          background: #fffbeb;
          border: 1px solid #f5c344;
          border-radius: 12px;
        }
        .article-summary-p {
          margin: 0;
          line-height: 1.8;
          font-size: 0.96rem;
        }
        .article-faq {
          margin-top: 1.75rem;
        }
        .article-faq-dl {
          margin: 0;
        }
        .article-faq-item {
          margin-bottom: 1rem;
        }
        .article-faq-q {
          font-weight: 700;
          margin: 0 0 0.35rem;
          font-size: 0.95rem;
        }
        .article-faq-a {
          margin: 0;
          padding-left: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 0.94rem;
        }
        .cta-box {
          margin-top: 2rem;
          padding: 1rem 1.25rem;
          background: linear-gradient(160deg, #0f1f3d 0%, #16244a 100%);
          color: #fff;
          border-radius: 10px;
          font-size: 0.95rem;
          line-height: 1.7;
        }
        .cta-link {
          font-weight: 700;
          color: #f5c344;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .related {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .related-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .related-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .related-list li {
          padding: 0.85rem 0;
          border-bottom: 1px solid var(--border);
        }
        .related-list a {
          display: block;
          font-weight: 600;
          text-decoration: none;
          color: var(--fg);
        }
        .related-list a:hover {
          color: #d69e2e;
        }
        .related-desc {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .article-site-nav {
          margin-top: 1.5rem;
          padding-top: 1rem;
        }
        .article-home-link {
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          color: #d69e2e;
        }
        .article-home-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </SiteChrome>
  );
}
