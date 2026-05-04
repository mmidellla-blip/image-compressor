import { AdsenseSlot } from "@/components/adsense-slot";
import { SiteChrome } from "@/components/site-chrome";
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog-posts";
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
  return {
    title: post.title,
    description: post.description,
    keywords: [
      "이미지 용량 줄이기",
      "JPG 용량 줄이기",
      "사진 용량 줄이기",
      post.title,
    ],
    alternates: { canonical: `/blog/${encodeURIComponent(post.slug)}` },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  return (
    <SiteChrome mainClassName="article-main">
      <article className="article" itemScope itemType="https://schema.org/Article">
        <p className="breadcrumb">
          <Link href="/blog">블로그</Link>
          <span aria-hidden> / </span>
          <span>{post.title}</span>
        </p>
        <h1 className="article-title" itemProp="headline">
          {post.title}
        </h1>
        <p className="article-desc" itemProp="description">
          {post.description}
        </p>

        <AdsenseSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG ?? "blog-inline"}
          className="mb-8"
        />

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

        <aside className="cta-box" aria-label="무료 이미지 압축 도구 안내">
          <p>
            지금 바로{" "}
            <Link href="/" className="cta-link">
              이미지 용량 줄이기 무료 사이트
            </Link>
            에서 JPG·PNG를 JPEG 또는 WebP로 줄여 보세요. 압축 전후 용량을 숫자로 비교할 수
            있습니다.
          </p>
        </aside>

        <nav className="related" aria-labelledby="related-heading">
          <h2 id="related-heading" className="related-title">
            관련 글
          </h2>
          <ul className="related-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}`}>{r.title}</Link>
                <span className="related-desc">{r.description}</span>
              </li>
            ))}
          </ul>
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
        .cta-box {
          margin-top: 1.75rem;
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
          margin-top: 2.25rem;
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
      `}</style>
    </SiteChrome>
  );
}
