"use client";

import Link from "next/link";
import type { ToolDefinition, ToolSlug } from "@/lib/tools/types";

/** 카드 상단 시각 구분용 (홈 도구 그리드 CTR) */
const CARD_VISUAL: Record<
  ToolSlug,
  { emoji: string; category: string }
> = {
  compress: { emoji: "🗜️", category: "용량 줄이기" },
  "jpg-to-png": { emoji: "🔄", category: "포맷 변환" },
  "png-to-webp": { emoji: "🖼️", category: "WebP" },
  "gif-compress": { emoji: "🎞️", category: "GIF" },
  resize: { emoji: "↔️", category: "크기 조절" },
  "passport-photo": { emoji: "🪪", category: "증명사진" },
  "pdf-convert": { emoji: "📄", category: "PDF" },
  "heic-to-jpg": { emoji: "📱", category: "HEIC → JPG" },
  "pdf-compress": { emoji: "📑", category: "PDF 압축" },
  "photo-mosaic": { emoji: "🔒", category: "모자이크" },
  "background-remove": { emoji: "✂️", category: "배경 제거" },
  "gif-maker": { emoji: "🎞", category: "GIF 만들기" },
  "video-download": { emoji: "⬇️", category: "동영상 다운로드" },
  preset: { emoji: "🎯", category: "규격 완성" },
};

type Props = {
  tool: ToolDefinition;
  /** 홈 전용: 더 큰 탭 타깃·강조 스타일 */
  variant?: "default" | "home";
};

export function ToolCard({ tool, variant = "default" }: Props) {
  const visual = CARD_VISUAL[tool.slug];
  const isExperimental = tool.homeGrid === "experimental";
  const category = isExperimental ? "실험·로드맵" : visual.category;
  const shortDesc =
    tool.intro.length > 72 ? `${tool.intro.slice(0, 72).trim()}…` : tool.intro;
  const isHome = variant === "home";
  const comingSoon = tool.status === "coming_soon";

  return (
    <Link
      href={tool.path}
      className={`tool-card ${isHome ? "tool-card--home" : ""} ${comingSoon ? "tool-card--soon" : ""}`.trim()}
    >
      <span className="tool-card-accent" aria-hidden />
      <div className="tool-card-top">
        <span className="tool-card-emoji" aria-hidden>
          {visual.emoji}
        </span>
        <span className="tool-card-cat">{category}</span>
      </div>
      <span className="tool-card-title">{tool.h1}</span>
      <span className="tool-card-desc">{shortDesc}</span>
      <span className="tool-card-cta">
        <span className="tool-card-cta-text">
          {comingSoon ? "로드맵·대안 보기" : "바로 사용하기"}
        </span>
        <span className="tool-card-cta-arrow" aria-hidden>
          →
        </span>
      </span>
      <style jsx>{`
        .tool-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
          padding: 1.1rem 1rem 0.95rem 1.05rem;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
          transition:
            border-color 0.15s,
            box-shadow 0.15s,
            transform 0.12s;
          overflow: hidden;
          min-height: 0;
        }
        .tool-card--home {
          padding: 1.2rem 1.1rem 1.05rem 1.1rem;
          min-height: 168px;
        }
        @media (min-width: 640px) {
          .tool-card--home {
            min-height: 178px;
          }
        }
        .tool-card:hover {
          border-color: #6ee7b7;
          box-shadow: 0 6px 20px rgb(5 150 105 / 0.12);
        }
        .tool-card:active {
          box-shadow: 0 2px 8px rgb(5 150 105 / 0.1);
        }
        .tool-card:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        .tool-card-accent {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #34d399 0%, #059669 100%);
          border-radius: 16px 0 0 16px;
        }
        .tool-card-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-left: 0.15rem;
        }
        .tool-card-emoji {
          font-size: 1.45rem;
          line-height: 1;
        }
        .tool-card--home .tool-card-emoji {
          font-size: 1.6rem;
        }
        .tool-card-cat {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #047857;
          background: #ecfdf5;
          padding: 0.22rem 0.5rem;
          border-radius: 999px;
        }
        .tool-card-title {
          font-weight: 800;
          font-size: 1.02rem;
          line-height: 1.35;
          padding-left: 0.15rem;
          color: var(--fg);
        }
        .tool-card--home .tool-card-title {
          font-size: 1.06rem;
        }
        .tool-card-desc {
          flex: 1;
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.5;
          padding-left: 0.15rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tool-card--home .tool-card-desc {
          font-size: 0.82rem;
        }
        .tool-card-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.35rem;
          padding: 0.62rem 0.75rem;
          background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          margin-left: 0.15rem;
        }
        .tool-card-cta-text {
          font-size: 0.88rem;
          font-weight: 800;
          color: #047857;
        }
        .tool-card-cta-arrow {
          font-size: 1.1rem;
          font-weight: 800;
          color: #059669;
        }
        .tool-card:hover .tool-card-cta {
          background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%);
          border-color: #6ee7b7;
        }
        .tool-card--soon {
          border-style: dashed;
          border-color: #cbd5e1;
          box-shadow: none;
        }
        .tool-card--soon .tool-card-accent {
          background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
        }
        .tool-card--soon .tool-card-cat {
          color: #475569;
          background: #f1f5f9;
        }
        .tool-card--soon .tool-card-cta {
          background: #f8fafc;
          border-color: #e2e8f0;
        }
        .tool-card--soon .tool-card-cta-text {
          color: #475569;
        }
        .tool-card--soon:hover {
          border-color: #94a3b8;
          box-shadow: 0 4px 16px rgb(100 116 139 / 0.12);
        }
      `}</style>
    </Link>
  );
}
