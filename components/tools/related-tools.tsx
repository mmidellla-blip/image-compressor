"use client";

import { getToolDefinition, type ToolSlug } from "@/lib/tools/definitions";
import Link from "next/link";

type Props = {
  currentSlug: ToolSlug;
};

/** 현재 도구를 제외한 관련 도구 내부 링크(설정 기반). */
export function RelatedTools({ currentSlug }: Props) {
  const { relatedToolSlugs } = getToolDefinition(currentSlug);
  const tools = relatedToolSlugs.map((s) => getToolDefinition(s));

  return (
    <nav className="rel-tools" aria-labelledby="rel-tools-h">
      <h2 id="rel-tools-h" className="rel-tools-title">
        관련 무료 이미지 툴
      </h2>
      <p className="rel-tools-lead">
        이미지 용량 줄이기·포맷 변환·PDF 변환 등 다른 무료 이미지 툴도 바로 이어서 쓸 수
        있습니다.
      </p>
      <ul className="rel-tools-ul">
        {tools.map((t) => (
          <li key={t.slug}>
            <Link href={t.path}>{t.h1}</Link>
            <span className="rel-tools-desc">{t.intro.slice(0, 92)}…</span>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .rel-tools {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .rel-tools-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 0.35rem;
        }
        .rel-tools-lead {
          margin: 0 0 0.85rem;
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .rel-tools-ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .rel-tools-ul li {
          padding: 0.65rem 0;
          border-bottom: 1px solid var(--border);
        }
        .rel-tools-ul a {
          display: block;
          font-weight: 600;
          text-decoration: none;
          color: var(--fg);
          font-size: 0.95rem;
        }
        .rel-tools-ul a:hover {
          color: var(--accent);
        }
        .rel-tools-desc {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.45;
        }
      `}</style>
    </nav>
  );
}
