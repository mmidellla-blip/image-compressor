"use client";

import Link from "next/link";
import { BrowserNotice } from "@/components/tools/browser-notice";

/** GIF 바이너리 압축은 추후 지원 예정 — 안내 전용 UI */
export function GifCompressToolClient() {
  return (
    <section className="tool-ui" aria-label="GIF 압축 준비 중">
      <BrowserNotice />
      <div className="soon-card">
        <p className="soon-title">GIF 압축 처리기는 준비 중입니다.</p>
        <p className="soon-body">
          애니메이션 GIF는 브라우저에서 안정적으로 줄이기 어려운 경우가 많아, 기능을 검증한 뒤
          제공할 예정입니다. 지금은 정지 이미지를{" "}
          <Link href="/compress">이미지 용량 줄이기</Link> 또는{" "}
          <Link href="/png-to-webp">PNG → WebP</Link>로 바꿔 보세요.
        </p>
      </div>
      <style jsx>{`
        .tool-ui {
          margin-top: 0.5rem;
        }
        .soon-card {
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 14px;
          padding: 1.25rem 1.1rem;
        }
        .soon-title {
          margin: 0 0 0.5rem;
          font-weight: 800;
          font-size: 1rem;
        }
        .soon-body {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--fg);
        }
      `}</style>
    </section>
  );
}
