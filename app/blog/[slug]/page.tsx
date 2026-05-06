import { BlogRelatedTools } from "@/components/blog/blog-related-tools";
import { PlaceholderAdBox } from "@/components/tools/placeholder-ad-box";
import { SiteChrome } from "@/components/site-chrome";
import { blogRelatedToolSlugs } from "@/lib/blog/related-tools-map";
import type { ToolSlug } from "@/lib/tools/types";
import {
  JsonLdScript,
  buildArticleLd,
  buildBreadcrumbListLd,
  buildFaqPageLd,
} from "@/lib/seo/json-ld";
import { buildBlogPostMetadata } from "@/lib/seo/blog-metadata";
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog-posts";
import { SITE_BRAND } from "@/lib/site-brand";
import { getCanonicalUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "글을 찾을 수 없습니다" };
  }
  return buildBlogPostMetadata(post);
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);
  const toolKeys: ToolSlug[] =
    blogRelatedToolSlugs[post.slug] ?? (["compress", "png-to-webp", "resize"] as const);

  const path = `/blog/${encodeURIComponent(post.slug)}`;
  const canonical = getCanonicalUrl(path) ?? path;
  const blogIndex = getCanonicalUrl("/blog") ?? "/blog";
  const home = getCanonicalUrl("/") ?? "/";

  const graph: Record<string, unknown>[] = [
    buildArticleLd({
      headline: post.title,
      description: post.description,
      url: canonical,
      datePublished: post.datePublished,
    }),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "블로그", url: blogIndex },
      { name: post.title, url: canonical },
    ]),
  ];
  if (post.faq && post.faq.length > 0) {
    graph.push(buildFaqPageLd(post.faq));
  }

  return (
    <SiteChrome mainClassName="article-main">
      <JsonLdScript id={`jsonld-blog-${post.slug}`} data={graph} />

      <article className="article" itemScope itemType="https://schema.org/Article">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link href="/">홈</Link>
          <span aria-hidden> · </span>
          <Link href="/blog">블로그</Link>
          <span aria-hidden> · </span>
          <span>{post.title}</span>
        </nav>
        <h1 className="article-title" itemProp="headline">
          {post.title}
        </h1>
        <p className="article-desc" itemProp="description">
          {post.description}
        </p>

        <div className="prose" itemProp="articleBody">
          {post.sections.map((sec, si) => (
            <section key={si} className="article-section">
              <h2 className="section-h2">{sec.heading}</h2>
              {sec.paragraphs.map((para, pi) => (
                <p key={pi}>{para}</p>
              ))}
            </section>
          ))}
        </div>

        {post.closingSummary ? (
          <section className="article-summary" aria-labelledby="sum-h">
            <h2 id="sum-h" className="section-h2">
              한 줄 요약
            </h2>
            <p className="article-summary-p">{post.closingSummary}</p>
          </section>
        ) : null}

        {post.faq && post.faq.length > 0 ? (
          <section className="article-faq" aria-labelledby="faq-h">
            <h2 id="faq-h" className="section-h2">
              자주 묻는 질문
            </h2>
            <dl className="article-faq-dl">
              {post.faq.map((f, i) => (
                <div key={i} className="article-faq-item">
                  <dt className="article-faq-q">{f.question}</dt>
                  <dd className="article-faq-a">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <BlogRelatedTools toolSlugs={toolKeys} />

        <aside className="cta-box" aria-label="도구 안내">
          <p>
            브라우저에서 바로 쓰는{" "}
            <Link href="/compress" className="cta-link">
              이미지 용량 줄이기
            </Link>
            ,{" "}
            <Link href="/png-to-webp" className="cta-link">
              PNG → WebP
            </Link>
            ,{" "}
            <Link href="/resize" className="cta-link">
              이미지 크기 조절
            </Link>
            ,{" "}
            <Link href="/pdf-convert" className="cta-link">
              PDF 변환
            </Link>
            ,{" "}
            <Link href="/" className="cta-link">
              {SITE_BRAND} 홈
            </Link>
            으로 이어서 이용해 보세요.
          </p>
        </aside>

        <nav className="related" aria-labelledby="related-heading">
          <h2 id="related-heading" className="related-title">
            관련 글
          </h2>
          <ul className="related-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${encodeURIComponent(r.slug)}`}>{r.title}</Link>
                <span className="related-desc">{r.description}</span>
              </li>
            ))}
          </ul>
        </nav>

        <PlaceholderAdBox />

        <nav className="article-site-nav" aria-label="사이트 이동">
          <Link href="/" className="article-home-link">
            ← {SITE_BRAND} 홈으로
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
          color: var(--accent);
        }
        .article-title {
          font-size: clamp(1.35rem, 3.5vw, 1.75rem);
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 0.75rem;
        }
        .article-desc {
          color: var(--muted);
          margin: 0 0 1.5rem;
          font-size: 0.95rem;
        }
        .article-section {
          margin-bottom: 1.5rem;
        }
        .section-h2 {
          font-size: 1.12rem;
          font-weight: 800;
          margin: 0 0 0.65rem;
          line-height: 1.35;
        }
        .prose p {
          margin: 0 0 1rem;
          line-height: 1.8;
          font-size: 0.96rem;
        }
        .article-summary {
          margin-top: 1.75rem;
          padding: 1rem 1.1rem;
          background: #f8fafc;
          border: 1px solid var(--border);
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
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          font-size: 0.95rem;
          line-height: 1.7;
        }
        .cta-link {
          font-weight: 700;
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
          color: var(--accent);
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
          color: var(--accent);
        }
        .article-home-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </SiteChrome>
  );
}
