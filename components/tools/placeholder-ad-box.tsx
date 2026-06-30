"use client";

// 애드센스 승인 전까지 렌더링 완전 비활성화.
// 승인 후 실제 광고 스크립트로 교체할 것.
export function PlaceholderAdBox({ className: _className = "" }: { className?: string }) {
  return null;
}
