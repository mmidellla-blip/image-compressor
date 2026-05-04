import { AdsenseSlot } from "@/components/adsense-slot";
import { SiteChrome } from "@/components/site-chrome";
import { getAllSlugs, getPostBySlug } from "@/lib/blog-posts";
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

  return (
    <SiteChrome mainClassName="article-main">
      <article className="article">
        <p className="breadcrumb">
          <Link href="/blog">블로그</Link>
          <span aria-hidden> / </span>
          <span>{post.title}</span>
        </p>
        <h1 className="article-title">{post.title}</h1>
        <p className="article-desc">{post.description}</p>

        <AdsenseSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG ?? "blog-top"}
          className="mb-8"
        />

        <div className="prose">
          {post.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <aside className="cta-box" aria-label="무료 이미지 압축 도구 안내">
          <p>
            <Link href="/" className="cta-link">
              이미지 용량 줄이기 무료 사이트
            </Link>
            에서 JPG·PNG를 JPEG 또는 WebP로 바로 줄여 보세요. 설치 없이
            브라우저에서 압축 전후 용량을 비교할 수 있습니다.
          </p>
        </aside>

        <AdsenseSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_FOOTER ?? "blog-foot"}
        />
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
        .prose p {
          margin: 0 0 1rem;
          line-height: 1.75;
        }
        .cta-box {
          margin-top: 1.75rem;
          padding: 1rem 1.25rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          font-size: 0.95rem;
        }
        .cta-link {
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>
    </SiteChrome>
  );
}
