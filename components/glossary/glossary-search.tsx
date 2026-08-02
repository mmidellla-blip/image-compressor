"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GlossaryTerm } from "@/lib/glossary-types";

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.shortDefinition.toLowerCase().includes(q),
    );
  }, [terms, query]);

  return (
    <div className="glossary-wrap">
      <input
        type="search"
        className="glossary-search"
        placeholder="용어 검색 (예: 뱅크런, 지급준비율)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="용어 검색"
      />

      {filtered.length === 0 ? (
        <p className="glossary-empty">일치하는 용어가 없습니다.</p>
      ) : (
        <dl className="glossary-list">
          {filtered.map((t) => (
            <div key={t.slug} className="glossary-item">
              <dt className="glossary-term">
                <Link href={`/glossary/${encodeURIComponent(t.slug)}`}>{t.term}</Link>
              </dt>
              <dd className="glossary-def">
                {t.shortDefinition}
                <div className="glossary-links">
                  <Link href={`/glossary/${encodeURIComponent(t.slug)}`}>
                    용어 페이지 →
                  </Link>
                  {t.relatedArticleSlug ? (
                    <Link href={`/articles/${encodeURIComponent(t.relatedArticleSlug)}`}>
                      자세히 보기 →
                    </Link>
                  ) : null}
                  {t.videoUrl ? (
                    <a href={t.videoUrl} target="_blank" rel="noopener noreferrer nofollow">
                      관련 영상 보기 →
                    </a>
                  ) : null}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}

      <style jsx>{`
        .glossary-wrap {
          margin-top: 1rem;
        }
        .glossary-search {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 0.95rem;
          box-sizing: border-box;
          margin-bottom: 1.25rem;
        }
        .glossary-search:focus {
          outline: 2px solid #d69e2e;
          outline-offset: 1px;
          border-color: #d69e2e;
        }
        .glossary-empty {
          color: var(--muted);
          font-size: 0.9rem;
        }
        .glossary-list {
          margin: 0;
        }
        .glossary-item {
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }
        .glossary-term {
          font-weight: 800;
          font-size: 1.02rem;
          margin-bottom: 0.35rem;
          color: #0f172a;
        }
        .glossary-term a {
          color: inherit;
          text-decoration: none;
        }
        .glossary-term a:hover {
          color: #d69e2e;
        }
        .glossary-def {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--fg);
        }
        .glossary-links {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .glossary-links a {
          font-size: 0.85rem;
          font-weight: 700;
          color: #d69e2e;
          text-decoration: none;
        }
        .glossary-links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
