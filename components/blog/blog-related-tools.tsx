"use client";

import { getToolDefinition } from "@/lib/tools/definitions";
import type { ToolSlug } from "@/lib/tools/types";
import Link from "next/link";

type Props = {
  toolSlugs: ToolSlug[];
};

/** 블로그 글 하단 — 관련 무료 이미지 툴 링크 */
export function BlogRelatedTools({ toolSlugs }: Props) {
  if (!toolSlugs.length) return null;
  const tools = toolSlugs.map((s) => getToolDefinition(s));

  return (
    <nav className="brt" aria-labelledby="brt-h">
      <h2 id="brt-h" className="brt-title">
        관련 무료 이미지 툴
      </h2>
      <ul className="brt-ul">
        {tools.map((t) => (
          <li key={t.slug}>
            <Link href={t.path}>{t.h1}</Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .brt {
          margin-top: 2rem;
          padding: 1.15rem 1.1rem;
          background: #f9fafb;
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .brt-title {
          font-size: 1rem;
          font-weight: 800;
          margin: 0 0 0.65rem;
        }
        .brt-ul {
          margin: 0;
          padding-left: 1.1rem;
          line-height: 1.75;
          font-size: 0.92rem;
        }
        .brt-ul a {
          font-weight: 600;
          text-decoration: none;
          color: var(--accent);
        }
        .brt-ul a:hover {
          text-decoration: underline;
        }
      `}</style>
    </nav>
  );
}
