import Link from "next/link";
import { getToolDefinition } from "@/lib/tools/definitions";
import type { ToolSlug } from "@/lib/tools/types";

/** 로드맵(준비 중) 도구 전용 — 대체 도구 링크로 thin content 방지 */
export function ComingSoonPanel({ slug }: { slug: ToolSlug }) {
  const t = getToolDefinition(slug);
  const alts = t.relatedToolSlugs.map((s) => getToolDefinition(s));

  return (
    <section className="csp" aria-labelledby="csp-h">
      <p className="csp-badge" role="status">
        준비 중 · 로드맵
      </p>
      <h2 id="csp-h" className="csp-title">
        도구 화면은 아직 연결되지 않았습니다
      </h2>
      <p className="csp-lead">
        이 기능은 브라우저에서 안정적으로 동작하는지, 업로드 파일이 기기 밖으로 나가지 않도록 할 수
        있는지까지 함께 검토한 뒤 공개할 예정입니다. 그전까지는 아래 대체 도구와 블로그 글로 비슷한
        목표를 달성해 보실 수 있습니다.
      </p>
      <h3 className="csp-h3">지금 바로 쓸 수 있는 도구</h3>
      <ul className="csp-ul">
        {alts.map((d) => (
          <li key={d.slug}>
            <Link href={d.path} className="csp-link">
              {d.h1}
            </Link>
            <span className="csp-meta">{d.metaDescription.slice(0, 72)}…</span>
          </li>
        ))}
      </ul>
      <p className="csp-note">
        문의·우선순위 제안은 <Link href="/contact">문의 페이지</Link>로 남겨 주세요.
      </p>
      <style>{`
        .csp {
          margin: 0 0 1.5rem;
          padding: 1.15rem 1.1rem;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 14px;
        }
        .csp-badge {
          display: inline-block;
          margin: 0 0 0.65rem;
          padding: 0.2rem 0.55rem;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #92400e;
          background: #fef3c7;
          border-radius: 999px;
        }
        .csp-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 0.65rem;
          line-height: 1.35;
        }
        .csp-lead {
          margin: 0 0 1rem;
          font-size: 0.94rem;
          line-height: 1.75;
          color: var(--fg);
        }
        .csp-h3 {
          font-size: 0.95rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
        }
        .csp-ul {
          margin: 0;
          padding-left: 1.1rem;
          line-height: 1.65;
          font-size: 0.92rem;
        }
        .csp-ul li {
          margin-bottom: 0.65rem;
        }
        .csp-link {
          font-weight: 700;
          text-decoration: none;
          color: var(--accent);
        }
        .csp-link:hover {
          text-decoration: underline;
        }
        .csp-meta {
          display: block;
          margin-top: 0.15rem;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.45;
        }
        .csp-note {
          margin: 1rem 0 0;
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.55;
        }
        .csp-note a {
          font-weight: 600;
          color: var(--accent);
        }
      `}</style>
    </section>
  );
}
