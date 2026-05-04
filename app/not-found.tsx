import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <h1 className="nf-title">페이지를 찾을 수 없습니다</h1>
      <p className="nf-text">
        <Link href="/">홈으로 돌아가기</Link> 또는{" "}
        <Link href="/blog">블로그 목록</Link>을 이용해 주세요.
      </p>
      <style>{`
        .nf-title {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .nf-text {
          color: var(--muted);
        }
      `}</style>
    </SiteChrome>
  );
}
