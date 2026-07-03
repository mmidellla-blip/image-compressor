 "use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { SITE_INFO_LAST_UPDATED } from "@/lib/site-config";
import { SITE_BRAND } from "@/lib/site-brand";

export function SiteChrome({
  children,
  mainClassName = "",
}: {
  children: ReactNode;
  mainClassName?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site">
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo" aria-label={`${SITE_BRAND} 홈`}>
            <img
              src="/moneygaebi-logo.png"
              alt=""
              width={32}
              height={32}
              className="logo-img"
            />
            <span className="logo-text">
              <span className="logo-name">{SITE_BRAND}</span>
              <span className="logo-tag">경제 완전 초보를 위한 돈 이야기</span>
            </span>
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-icon" aria-hidden>
              ☰
            </span>
            <span className="menu-text">메뉴</span>
          </button>
          <nav
            id="site-nav"
            className={`nav ${menuOpen ? "nav-open" : ""}`}
            aria-label="주요 메뉴"
          >
            <Link href="/" onClick={() => setMenuOpen(false)}>
              홈
            </Link>
            <Link href="/calculators" onClick={() => setMenuOpen(false)}>
              계산기
            </Link>
            <Link href="/articles" onClick={() => setMenuOpen(false)}>
              아티클
            </Link>
            <Link href="/glossary" onClick={() => setMenuOpen(false)}>
              용어사전
            </Link>
            <span className="nav-sep" aria-hidden>
              |
            </span>
            <Link href="/#tools" onClick={() => setMenuOpen(false)}>
              도구
            </Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)}>
              아카이브
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              소개
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              문의
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className={`main ${mainClassName}`.trim()}>
        {children}
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">{SITE_BRAND}</p>
            <p className="footer-tag">
              경제 완전 초보를 위한 계산기·아티클·용어사전. 어려운 돈 이야기를 쉽고 재밌게
              풀어드립니다.
            </p>
          </div>
          <div>
            <p className="footer-col-title">경제 콘텐츠</p>
            <ul className="footer-links">
              <li>
                <Link href="/calculators">계산기</Link>
              </li>
              <li>
                <Link href="/articles">아티클</Link>
              </li>
              <li>
                <Link href="/glossary">용어사전</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">사이트</p>
            <ul className="footer-links">
              <li>
                <Link href="/#tools">이미지 도구</Link>
              </li>
              <li>
                <Link href="/blog">아카이브</Link>
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
          최종 정보 갱신: {SITE_INFO_LAST_UPDATED} · © {new Date().getFullYear()} {SITE_BRAND}
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
          flex-wrap: nowrap;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          text-decoration: none;
          color: var(--fg);
          line-height: 1.2;
        }
        .logo-img {
          border-radius: 50%;
          flex-shrink: 0;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
        }
        .logo-name {
          font-size: 1.02rem;
          letter-spacing: -0.02em;
        }
        .logo-tag {
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--muted);
        }
        .nav {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0.75rem 1.1rem;
        }
        .nav-sep {
          color: var(--border);
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .nav-sep {
            display: none;
          }
        }
        .menu-toggle {
          display: none;
          align-items: center;
          gap: 0.35rem;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--fg);
          border-radius: 10px;
          min-height: 40px;
          padding: 0.35rem 0.6rem;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }
        .menu-icon {
          font-size: 0.95rem;
          line-height: 1;
        }
        .menu-text {
          line-height: 1;
        }
        .nav a {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.88rem;
        }
        .nav a:hover {
          color: var(--accent);
        }
        @media (max-width: 768px) {
          .header-inner {
            flex-wrap: wrap;
            gap: 0.65rem;
          }
          .menu-toggle {
            display: inline-flex;
            margin-left: auto;
          }
          .nav {
            width: 100%;
            display: none;
            flex-direction: column;
            gap: 0;
            border-top: 1px solid var(--border);
            padding-top: 0.45rem;
          }
          .nav.nav-open {
            display: flex;
          }
          .nav a {
            display: block;
            padding: 0.55rem 0.1rem;
            font-size: 0.92rem;
          }
        }
        @media (min-width: 769px) {
          .nav {
            display: flex !important;
          }
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
