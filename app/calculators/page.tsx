import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { CALCULATORS } from "@/lib/calculators/registry";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "경제 계산기 모음 - 청약·신용점수·연말정산·적금",
  description:
    "청약 가점 계산기, 신용점수 시뮬레이터, 연말정산 환급액 계산기, 적금 이자 계산기를 한곳에서 무료로 이용하세요.",
  path: "/calculators",
  keywords: [
    "경제 계산기",
    "청약 가점 계산기",
    "신용점수 시뮬레이터",
    "연말정산 환급액 계산기",
    "적금 이자 계산기",
  ],
});

export default function CalculatorsIndexPage() {
  return (
    <SiteChrome>
      <h1 className="page-title">계산기</h1>
      <p className="page-lead">
        청약·신용점수·연말정산·적금처럼 계산이 복잡한 돈 문제를 숫자만 입력하면 바로
        확인할 수 있게 만들었습니다.
      </p>
      <ul className="calc-list">
        {CALCULATORS.map((c) => (
          <li key={c.slug}>
            <Link href={c.path}>{c.title}</Link>
            <span className="calc-desc">{c.description}</span>
          </li>
        ))}
      </ul>

      <style>{`
        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
        }
        .page-lead {
          color: var(--muted);
          margin: 0 0 1.5rem;
          line-height: 1.65;
        }
        .calc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .calc-list li {
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }
        .calc-list a {
          display: block;
          font-weight: 700;
          text-decoration: none;
          color: var(--fg);
        }
        .calc-list a:hover {
          color: #d69e2e;
        }
        .calc-desc {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: var(--muted);
        }
      `}</style>
    </SiteChrome>
  );
}
