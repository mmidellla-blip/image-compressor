"use client";

/**
 * 애드센스 승인 후 실제 광고 코드를 넣을 영역.
 * 기본은 숨김. NEXT_PUBLIC_SHOW_AD_PLACEHOLDER=true 일 때만 표시.
 */
export function PlaceholderAdBox({ className = "" }: { className?: string }) {
  const show =
    typeof process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDER === "string" &&
    process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDER === "true";

  if (!show) {
    return null;
  }

  return (
    <aside
      className={`placeholder-ad ${className}`.trim()}
      aria-label="광고 영역 (준비 중)"
    >
      광고 영역 — 애드센스 승인 후 표시 예정
      <style jsx>{`
        .placeholder-ad {
          margin: 1.25rem 0;
          padding: 1.25rem 1rem;
          text-align: center;
          font-size: 0.82rem;
          color: var(--muted);
          background: #f9fafb;
          border: 1px dashed var(--border);
          border-radius: 12px;
          line-height: 1.5;
        }
      `}</style>
    </aside>
  );
}
