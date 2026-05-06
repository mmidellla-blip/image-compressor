import Link from "next/link";
import { ToolCard } from "@/components/tools/tool-card";
import { SiteChrome } from "@/components/site-chrome";
import { HOME_FEATURED_BLOG_SLUGS } from "@/lib/home-featured";
import { getPostBySlug } from "@/lib/blog-posts";
import { getAllToolDefinitions } from "@/lib/tools/definitions";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata = buildStaticPageMetadata({
  title: "무료 온라인 이미지 툴 모음 — 압축·변환·PDF",
  description:
    "회원가입 없이 쓰는 무료 이미지 툴 모음. 이미지 용량 줄이기, JPG·PNG·WebP 변환, 이미지 크기 조절, 증명사진 압축, PDF 변환까지 브라우저에서 처리합니다.",
  path: "/",
  keywords: [
    "무료 이미지 툴",
    "이미지 용량 줄이기",
    "JPG 용량 줄이기",
    "사진 용량 줄이기",
    "이미지 압축",
    "WebP 변환",
    "PNG WebP 변환",
    "이미지 크기 조절",
    "증명사진 용량 줄이기",
    "PDF 변환",
  ],
});

export default function HomePage() {
  const tools = getAllToolDefinitions();
  const featuredPosts = HOME_FEATURED_BLOG_SLUGS.map((slug) => getPostBySlug(slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <SiteChrome mainClassName="home-wrap">
      <header className="home-hero">
        <h1 className="home-h1">무료 온라인 이미지 툴 모음</h1>
        <p className="home-lead">
          회원가입 없이 바로 사용하는 무료 이미지 툴 모음.
          <br />
          이미지 압축, 포맷 변환, 크기 조절, PDF 변환까지 한 번에.
        </p>
      </header>

      <section id="tools" className="home-tools" aria-labelledby="tools-heading">
        <div className="home-tools-inner">
          <h2 id="tools-heading" className="home-h2">
            도구 바로가기
          </h2>
          <p className="home-tools-desc">
            원하는 작업을 고르고 <strong>바로 사용하기</strong>를 눌러 주세요. 브라우저에서만
            처리되며 서버에 저장하지 않습니다.
          </p>
          <div className="tool-grid">
            {tools.map((t) => (
              <ToolCard key={t.slug} tool={t} variant="home" />
            ))}
          </div>
        </div>
      </section>

      <section className="home-blog" aria-labelledby="blog-heading">
        <h2 id="blog-heading" className="home-h2">
          읽어볼 만한 글
        </h2>
        <ul className="home-blog-ul">
          {featuredPosts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${encodeURIComponent(p.slug)}`}>{p.title}</Link>
              <span className="home-blog-desc">{p.description.slice(0, 96)}…</span>
            </li>
          ))}
        </ul>
        <p className="home-blog-more">
          <Link href="/blog">블로그 전체 보기 →</Link>
        </p>
      </section>

      <style>{`
        .home-wrap {
          padding-top: 0.5rem;
        }
        .home-hero {
          text-align: center;
          margin-bottom: 1.25rem;
        }
        .home-h1 {
          font-size: clamp(1.4rem, 4.5vw, 2rem);
          font-weight: 800;
          margin: 0 0 0.65rem;
          line-height: 1.28;
        }
        .home-lead {
          margin: 0 auto;
          max-width: 38rem;
          font-size: 0.95rem;
          color: var(--muted);
          line-height: 1.65;
        }
        .home-tools {
          margin-bottom: 2rem;
        }
        .home-tools-inner {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.25rem 1rem 1.35rem;
          box-shadow: 0 1px 0 rgb(255 255 255 / 0.8) inset;
        }
        @media (min-width: 640px) {
          .home-tools-inner {
            padding: 1.5rem 1.35rem 1.6rem;
          }
        }
        .home-h2 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .home-tools-desc {
          margin: 0 0 1.15rem;
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
        }
        .home-tools-desc strong {
          color: var(--fg);
          font-weight: 700;
        }
        .tool-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
        }
        @media (min-width: 520px) {
          .tool-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
        @media (min-width: 900px) {
          .tool-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }
        .home-blog {
          margin-bottom: 2rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border);
        }
        .home-blog-ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .home-blog-ul li {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }
        .home-blog-ul a {
          font-weight: 600;
          text-decoration: none;
          color: var(--fg);
          font-size: 0.95rem;
        }
        .home-blog-ul a:hover {
          color: var(--accent);
        }
        .home-blog-desc {
          display: block;
          margin-top: 0.3rem;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.45;
        }
        .home-blog-more {
          margin: 1rem 0 0;
          font-size: 0.9rem;
        }
      `}</style>
    </SiteChrome>
  );
}
