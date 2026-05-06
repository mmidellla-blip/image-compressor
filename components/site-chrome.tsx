import Link from "next/link";
import type { ReactNode } from "react";

export function SiteChrome({
  children,
  mainClassName = "",
}: {
  children: ReactNode;
  mainClassName?: string;
}) {
  return (
    <div className="site">
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">
            이미지 용량 줄이기
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            <Link href="/">홈</Link>
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
            <p className="footer-brand">이미지 용량 줄이기</p>
            <p className="footer-tag">
              사진·JPG·PNG 용량 줄이기와 이미지 압축 가이드를 제공합니다.
            </p>
          </div>
          <div>
            <p className="footer-col-title">콘텐츠</p>
            <ul className="footer-links">
              <li>
                <Link href="/">이미지 압축 도구</Link>
              </li>
              <li>
                <Link href="/blog">블로그</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">사이트</p>
            <ul className="footer-links">
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
        <p className="footer-cookie">
          쿠키 및 맞춤 광고에 관한 안내는{" "}
          <Link href="/privacy-policy#adsense">개인정보처리방침</Link>을 참고하세요.
        </p>
        <p className="footer-copy">
          © {new Date().getFullYear()} · 이미지 용량 줄이기
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
            grid-template-columns: 1.4fr 1fr 1fr;
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
          font-size: 0.85rem;
          color: var(--muted);
          text-decoration: none;
        }
        .footer-links a:hover {
          color: var(--accent);
        }
        .footer-cookie {
          max-width: 56rem;
          margin: 1.25rem auto 0;
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
        .footer-copy {
          max-width: 56rem;
          margin: 0.65rem auto 0;
          text-align: center;
          font-size: 0.75rem;
          color: var(--muted);
        }
        .footer-copy a {
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}
