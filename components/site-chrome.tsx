import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_INFO_LAST_UPDATED } from "@/lib/site-config";
import { getAllToolDefinitions } from "@/lib/tools/definitions";

export function SiteChrome({
  children,
  mainClassName = "",
}: {
  children: ReactNode;
  mainClassName?: string;
}) {
  const tools = getAllToolDefinitions();

  return (
    <div className="site">
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">
            무료 이미지 툴 모음
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            <Link href="/">홈</Link>
            <Link href="/#tools">도구</Link>
            <Link href="/blog">블로그</Link>
            <Link href="/about">소개</Link>
            <Link href="/contact">문의</Link>
          </nav>
        </div>
      </header>

      <main id="main" className={`main ${mainClassName}`.trim()}>
        {children}
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">무료 온라인 이미지 툴 모음</p>
            <p className="footer-tag">
              이미지 용량 줄이기·포맷 변환·크기 조절·PDF 변환 등 브라우저에서 처리하는 무료
              이미지 툴을 제공합니다.
            </p>
          </div>
          <div>
            <p className="footer-col-title">도구</p>
            <ul className="footer-links">
              {tools.map((t) => (
                <li key={t.slug}>
                  <Link href={t.path}>{t.h1}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-col-title">사이트</p>
            <ul className="footer-links">
              <li>
                <Link href="/blog">블로그</Link>
              </li>
              <li>
                <Link href="/about">소개</Link>
              </li>
              <li>
                <Link href="/contact">문의</Link>
              </li>
              <li>
                <Link href="/privacy-policy">개인정보처리방침</Link>
              </li>
              <li>
                <Link href="/terms">이용약관</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer-trust">
          선택한 파일은 가능한 한 브라우저에서 처리되며 서버에 저장되지 않습니다.
        </p>
        <p className="footer-links-row">
          <Link href="/contact">문의</Link>
          {" · "}
          <Link href="/privacy-policy">개인정보처리방침</Link>
          {" · "}
          <Link href="/terms">이용약관</Link>
          {" · "}
          <Link href="/sitemap.xml">사이트맵</Link>
        </p>
        <p className="footer-cookie">
          개인정보·쿠키 및 향후 광고 안내는{" "}
          <Link href="/privacy-policy">개인정보처리방침</Link>을 참고하세요.
        </p>
        <p className="footer-meta">
          최종 정보 갱신: {SITE_INFO_LAST_UPDATED} · © {new Date().getFullYear()} 무료 이미지 툴 모음
        </p>
      </footer>

      <style>{`
        .site {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
        }
        .header {
          border-bottom: 1px solid var(--border);
          background: #fff;
        }
        .header-inner {
          max-width: 56rem;
          margin: 0 auto;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .logo {
          font-weight: 800;
          text-decoration: none;
          color: var(--fg);
          font-size: 0.95rem;
        }
        .nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.1rem;
        }
        .nav a {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.88rem;
        }
        .nav a:hover {
          color: var(--accent);
        }
        .main {
          flex: 1;
          max-width: 56rem;
          margin: 0 auto;
          padding: 1.5rem 1rem 3rem;
          width: 100%;
        }
        .footer {
          border-top: 1px solid var(--border);
          background: #fff;
          padding: 1.5rem 1rem 1.25rem;
        }
        .footer-grid {
          max-width: 56rem;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1.2fr 1fr 1fr;
          }
        }
        .footer-brand {
          font-weight: 800;
          margin: 0 0 0.35rem;
          font-size: 0.95rem;
        }
        .footer-tag {
          margin: 0;
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.55;
        }
        .footer-col-title {
          font-size: 0.8rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: var(--fg);
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links li {
          margin-bottom: 0.35rem;
        }
        .footer-links a {
          font-size: 0.82rem;
          color: var(--muted);
          text-decoration: none;
        }
        .footer-links a:hover {
          color: var(--accent);
        }
        .footer-trust {
          max-width: 56rem;
          margin: 1.1rem auto 0;
          padding: 0 0.75rem;
          text-align: center;
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.55;
        }
        .footer-links-row {
          max-width: 56rem;
          margin: 0.5rem auto 0;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .footer-links-row a {
          color: var(--muted);
          text-decoration: none;
        }
        .footer-links-row a:hover {
          color: var(--accent);
          text-decoration: underline;
        }
        .footer-cookie {
          max-width: 56rem;
          margin: 0.85rem auto 0;
          padding: 0 0.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: var(--muted);
          line-height: 1.55;
        }
        .footer-cookie a {
          color: var(--muted);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .footer-cookie a:hover {
          color: var(--accent);
        }
        .footer-meta {
          max-width: 56rem;
          margin: 0.5rem auto 0;
          text-align: center;
          font-size: 0.72rem;
          color: var(--muted);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
