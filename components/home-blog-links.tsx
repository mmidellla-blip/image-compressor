import Link from "next/link";

/** 홈 하단: 관련 블로그 링크 */
export function HomeBlogLinks() {
  return (
    <nav className="bloglinks" aria-labelledby="bloglinks-heading">
      <h2 id="bloglinks-heading" className="bloglinks-h2">
        관련 블로그 글
      </h2>
      <ul className="bloglinks-ul">
        <li>
          <Link href="/blog/이미지-압축-방법">이미지 압축 방법</Link>
          <span className="bloglinks-desc">순서와 체크포인트</span>
        </li>
        <li>
          <Link href="/blog/jpg-용량-줄이기">JPG 용량 줄이기</Link>
          <span className="bloglinks-desc">품질과 용량 균형</span>
        </li>
        <li>
          <Link href="/blog/사진-용량-줄이는-법">사진 용량 줄이는 법</Link>
          <span className="bloglinks-desc">실전 순서</span>
        </li>
        <li>
          <Link href="/blog">블로그 전체 보기</Link>
        </li>
      </ul>
      <p className="bloglinks-meta">
        운영·문의는 <Link href="/about">소개</Link>, <Link href="/contact">문의</Link>를
        이용해 주세요.
      </p>
      <style>{`
        .bloglinks {
          margin-top: 1.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .bloglinks-h2 {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 0.65rem;
        }
        .bloglinks-ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .bloglinks-ul li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.93rem;
        }
        .bloglinks-ul li:last-child {
          border-bottom: none;
          padding-top: 0.65rem;
        }
        .bloglinks-ul a {
          font-weight: 600;
          text-decoration: none;
          color: var(--accent);
        }
        .bloglinks-ul a:hover {
          text-decoration: underline;
        }
        .bloglinks-desc {
          display: block;
          font-size: 0.82rem;
          color: var(--muted);
          margin-top: 0.15rem;
          font-weight: 400;
        }
        .bloglinks-meta {
          margin: 1rem 0 0;
          font-size: 0.85rem;
          color: var(--muted);
        }
      `}</style>
    </nav>
  );
}
