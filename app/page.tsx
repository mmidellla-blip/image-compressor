import Link from "next/link";
import { ToolCard } from "@/components/tools/tool-card";
import { SiteChrome } from "@/components/site-chrome";
import { HOME_FEATURED_BLOG_SLUGS } from "@/lib/home-featured";
import { getPostBySlug } from "@/lib/blog-posts";
import {
  getHomeExperimentalTools,
  getHomePrimaryTools,
} from "@/lib/tools/definitions";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";
import { SITE_BRAND, SITE_BRAND_LINE } from "@/lib/site-brand";
import { HOME_PAGE_FAQS } from "@/lib/home-faq";
import { JsonLdScript, buildFaqPageLd } from "@/lib/seo/json-ld";

export const metadata = buildStaticPageMetadata({
  title: `${SITE_BRAND} — 빠른 이미지 압축·변환 (브라우저, 무료)`,
  description:
    "회원가입 없이 브라우저에서 JPG·PNG 압축, WebP 변환, PDF 합치기까지. 서버 저장 없이 무료로 쓰는 이미지 툴 CompressDeck.",
  path: "/",
  keywords: [
    "이미지 압축",
    "무료 이미지 툴",
    "JPG 용량 줄이기",
    "WebP 변환",
    "PDF 변환",
    "브라우저 이미지 처리",
    "회원가입 없는 이미지 압축",
  ],
});

export default function HomePage() {
  const primaryTools = getHomePrimaryTools();
  const experimentalTools = getHomeExperimentalTools();
  const featuredPosts = HOME_FEATURED_BLOG_SLUGS.map((slug) =>
    getPostBySlug(slug),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <SiteChrome mainClassName="home-wrap">
      <JsonLdScript id="jsonld-home-faq" data={buildFaqPageLd(HOME_PAGE_FAQS)} />

      <header className="home-hero">
        <p className="home-kicker">{SITE_BRAND_LINE}</p>
        <h1 className="home-h1">빠른 이미지 압축과 변환</h1>
        <p className="home-lead">
          채용 사이트·공공 제출·메일 첨부 전에 걸리는 용량 제한을, 설치 없이 브라우저에서
          바로 맞춰 보세요.
        </p>
        <ul className="home-pill-list" aria-label="서비스 특징">
          <li>회원가입 없이 사용</li>
          <li>브라우저에서 처리</li>
          <li>서버 저장 없음</li>
          <li>무료 이용</li>
          <li>빠른 이미지 압축</li>
        </ul>
        <div className="home-cta-row">
          <Link href="/compress" className="home-cta home-cta--primary">
            이미지 압축 시작하기
          </Link>
          <Link href="/jpg-to-png" className="home-cta">
            JPG → PNG 변환
          </Link>
          <Link href="/pdf-convert" className="home-cta">
            PDF 변환 바로가기
          </Link>
        </div>
        <ul className="home-trust-badges" aria-label="신뢰 안내">
          <li>개인정보 별도 저장 없음</li>
          <li>무료 사용</li>
          <li>설치 필요 없음</li>
          <li>모바일 지원</li>
        </ul>
      </header>

      <section className="home-compare" aria-labelledby="compare-heading">
        <h2 id="compare-heading" className="home-h2">
          압축 전후가 체감되는 예시
        </h2>
        <p className="home-compare-intro">
          실제 업로드 화면에서는 용량과 포맷이 통과 여부를 가릅니다. 아래는 흔한 사진 한 장을
          웹용으로 줄였을 때의 비교입니다.
        </p>
        <div className="home-compare-grid">
          <div className="home-compare-card home-compare-card--before">
            <h3 className="home-compare-h3">압축 전</h3>
            <ul className="home-compare-ul">
              <li>
                <strong>용량</strong> 약 5.2MB
              </li>
              <li>
                <strong>포맷</strong> JPG
              </li>
              <li>
                <strong>업로드</strong> 느림 · 제한에 걸리기 쉬움
              </li>
            </ul>
          </div>
          <div className="home-compare-card home-compare-card--after" aria-hidden="true">
            <span className="home-compare-arrow">→</span>
          </div>
          <div className="home-compare-card home-compare-card--result">
            <h3 className="home-compare-h3">압축 후</h3>
            <ul className="home-compare-ul">
              <li>
                <strong>용량</strong> 약 430KB
              </li>
              <li>
                <strong>포맷</strong> WebP
              </li>
              <li>
                <strong>업로드</strong> 빠름 · 같은 화면에서 통과하기 쉬움
              </li>
            </ul>
            <p className="home-compare-note">
              제출처가 WebP를 허용하지 않으면 같은 도구에서 JPEG을 고르세요.
            </p>
          </div>
        </div>
      </section>

      <section id="tools" className="home-tools" aria-labelledby="tools-heading">
        <div className="home-tools-inner">
          <h2 id="tools-heading" className="home-h2">
            도구 바로가기
          </h2>
          <p className="home-tools-desc">
            원하는 작업을 고른 뒤 카드를 누르면 해당 페이지로 이동합니다.{" "}
            <strong>브라우저에서 처리</strong>되며, 별도 프로그램 설치가 필요 없습니다.
          </p>
          <div className="tool-grid">
            {primaryTools.map((t) => (
              <ToolCard key={t.slug} tool={t} variant="home" />
            ))}
          </div>

          {experimentalTools.length > 0 ? (
            <div className="home-experimental">
              <h3 id="experimental-heading" className="home-h3">
                실험·로드맵
              </h3>
              <p className="home-experimental-desc">
                아래 항목은 동작 방식·프라이버시를 검토하며 준비 중입니다. 필요하면 페이지에서
                대안 도구와 블로그 가이드를 함께 확인할 수 있습니다.
              </p>
              <div className="tool-grid tool-grid--experimental">
                {experimentalTools.map((t) => (
                  <ToolCard key={t.slug} tool={t} variant="home" />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="home-why" id="why" aria-labelledby="why-heading">
        <h2 id="why-heading" className="home-h2">
          왜 {SITE_BRAND}를 사용하나요?
        </h2>
        <ul className="home-why-ul">
          <li>파일을 서버에 쌓아 두지 않는 브라우저 중심 처리</li>
          <li>회원가입·로그인 없이 바로 실행</li>
          <li>무료로 이용 가능한 기본 기능</li>
          <li>빠른 압축·변환으로 업로드 제한에 맞추기 쉬움</li>
          <li>스마트폰 브라우저에서도 동작하도록 설계</li>
          <li>채용·공공·메신저 등 실제 제출 상황을 염두에 둔 도구 구성</li>
        </ul>
      </section>

      <section className="home-blog" aria-labelledby="blog-heading">
        <h2 id="blog-heading" className="home-h2">
          상황별로 읽을 만한 글
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
          padding-top: 0.35rem;
        }
        .home-hero {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .home-kicker {
          margin: 0 0 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #047857;
          letter-spacing: 0.02em;
          line-height: 1.35;
        }
        .home-h1 {
          font-size: clamp(1.45rem, 5vw, 2.05rem);
          font-weight: 800;
          margin: 0 0 0.55rem;
          line-height: 1.25;
          letter-spacing: -0.03em;
        }
        .home-lead {
          margin: 0 auto 0.85rem;
          max-width: 36rem;
          font-size: 0.94rem;
          color: var(--muted);
          line-height: 1.65;
        }
        .home-pill-list {
          list-style: none;
          padding: 0;
          margin: 0 auto 1rem;
          max-width: 28rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          justify-content: center;
        }
        .home-pill-list li {
          font-size: 0.72rem;
          font-weight: 700;
          color: #0f172a;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 0.28rem 0.55rem;
        }
        .home-cta-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 22rem;
          margin: 0 auto 1rem;
        }
        @media (min-width: 520px) {
          .home-cta-row {
            max-width: none;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
        .home-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem 1rem;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          border: 1px solid var(--border);
          color: var(--fg);
          background: #fff;
        }
        .home-cta--primary {
          background: #059669;
          color: #fff;
          border-color: #047857;
        }
        .home-cta--primary:hover {
          background: #047857;
        }
        .home-cta:hover {
          border-color: #94a3b8;
        }
        .home-trust-badges {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem 0.65rem;
          justify-content: center;
          font-size: 0.72rem;
          color: var(--muted);
        }
        .home-trust-badges li::before {
          content: "✓ ";
          color: #059669;
          font-weight: 800;
        }
        .home-compare {
          margin-bottom: 1.5rem;
          padding: 1.1rem 0.85rem;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 18px;
        }
        .home-compare-intro {
          margin: 0 0 1rem;
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.6;
        }
        .home-compare-grid {
          display: grid;
          gap: 0.65rem;
        }
        @media (min-width: 720px) {
          .home-compare-grid {
            grid-template-columns: 1fr auto 1fr;
            align-items: stretch;
            gap: 0.75rem;
          }
          .home-compare-card--after {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 2.5rem;
            border: none;
            background: transparent;
            box-shadow: none;
          }
        }
        .home-compare-card {
          border-radius: 14px;
          padding: 0.85rem 0.9rem;
          border: 1px solid var(--border);
          background: #f8fafc;
        }
        .home-compare-card--before {
          border-left: 3px solid #94a3b8;
        }
        .home-compare-card--result {
          border-left: 3px solid #059669;
          background: #f0fdf4;
        }
        .home-compare-h3 {
          margin: 0 0 0.5rem;
          font-size: 0.95rem;
          font-weight: 800;
        }
        .home-compare-ul {
          margin: 0;
          padding-left: 1.1rem;
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--fg);
        }
        .home-compare-ul strong {
          color: #0f172a;
        }
        .home-compare-note {
          margin: 0.6rem 0 0;
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.45;
        }
        .home-compare-arrow {
          font-size: 1.25rem;
          color: var(--muted);
          font-weight: 800;
        }
        @media (max-width: 719px) {
          .home-compare-card--after {
            display: none;
          }
        }
        .home-tools {
          margin-bottom: 1.75rem;
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
        .home-h3 {
          font-size: 1.02rem;
          font-weight: 800;
          margin: 1.25rem 0 0.4rem;
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
        .home-experimental {
          margin-top: 1.35rem;
          padding-top: 1.1rem;
          border-top: 1px dashed #cbd5e1;
        }
        .home-experimental-desc {
          margin: 0 0 0.85rem;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.55;
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
        .tool-grid--experimental {
          gap: 0.75rem;
        }
        @media (min-width: 900px) {
          .tool-grid--experimental {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .home-why {
          margin-bottom: 1.75rem;
          padding: 1.15rem 1rem;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 18px;
        }
        .home-why-ul {
          margin: 0;
          padding-left: 1.15rem;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--fg);
        }
        .home-why-ul li {
          margin-bottom: 0.35rem;
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
