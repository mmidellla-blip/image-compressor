import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { CALCULATORS } from "@/lib/calculators/registry";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "경제 계산기 모음 - 청약·신용점수·연말정산·종부세",
  description:
    "청약 가점 계산기, 신용점수 시뮬레이터, 연말정산 환급액 계산기, 종합부동산세 계산기를 한곳에서 무료로 이용하세요.",
  path: "/calculators",
  keywords: [
    "경제 계산기",
    "청약 가점 계산기",
    "신용점수 시뮬레이터",
    "연말정산 환급액 계산기",
    "종합부동산세 계산기",
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

      <section className="calc-about">
        <h2 className="calc-about-h2">왜 계산기 결과를 믿고 써도 되나요?</h2>
        <p className="calc-about-p">
          청약 가점 계산기는 주택공급에 관한 규칙의 가점제 기준(무주택기간 32점·부양가족수
          35점·청약통장 가입기간 17점)을 그대로 반영했고, 연말정산 환급액 계산기는 근로소득공제
          →소득공제→누진세율→세액공제 순서로 국세청이 안내하는 계산 구조를 따릅니다. 신용점수
          시뮬레이터는 신용평가사가 공개하지 않는 정확한 알고리즘 대신 일반적으로 알려진 항목별
          영향 범위를 참고한 추정치이고, 적금 이자 계산기는 단리·복리 공식과 이자소득세(15.4%)를
          그대로 계산에 넣었습니다. 종합부동산세 계산기는 2026년 8월 발표된 세제개편안의
          기본공제·공정시장가액비율·누진세율 구조를 그대로 반영했습니다.
        </p>
        <p className="calc-about-p">
          다만 모든 계산기는 <strong>참고용 추정치</strong>입니다. 실제 접수·신고 시 최종 수치는
          청약홈·국세청 홈택스·각 금융회사 앱 등 공식 채널에서 다시 확인하시고, 제도·세율이
          바뀌면 계산기도 순차적으로 검토해 갱신합니다. 계산 기준에 대한 더 자세한 설명은{" "}
          <Link href="/about">소개 페이지</Link>에서 확인할 수 있습니다.
        </p>
      </section>

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
        .calc-about {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .calc-about-h2 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .calc-about-p {
          margin: 0 0 1rem;
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--fg);
        }
      `}</style>
    </SiteChrome>
  );
}
