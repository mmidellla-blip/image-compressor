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
            용량 줄이기
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            <Link href="/">압축</Link>
            <Link href="/blog">블로그</Link>
          </nav>
        </div>
      </header>

      <main id="main" className={`main ${mainClassName}`.trim()}>
        {children}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} · 이미지 용량 줄이기</p>
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
        }
        .logo {
          font-weight: 700;
          text-decoration: none;
          color: var(--fg);
        }
        .nav {
          display: flex;
          gap: 1.25rem;
        }
        .nav a {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.9rem;
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
          padding: 1rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}
