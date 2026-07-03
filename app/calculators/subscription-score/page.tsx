import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { SubscriptionScoreCalculator } from "@/components/calculators/subscription-score-calculator";
import { FAQSection } from "@/components/tools/faq-section";
import { PlaceholderAdBox } from "@/components/tools/placeholder-ad-box";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";
import {
  JsonLdScript,
  buildBreadcrumbListLd,
  buildFaqPageLd,
  buildWebApplicationLd,
} from "@/lib/seo/json-ld";
import { getCanonicalUrl } from "@/lib/site-url";
import { SITE_BRAND } from "@/lib/site-brand";

const PATH = "/calculators/subscription-score";

const FAQS = [
  {
    question: "이 계산기의 가점 산정 기준이 정확한가요?",
    answer:
      "주택공급에 관한 규칙에 정해진 청약 가점제 기준(무주택기간 32점·부양가족수 35점·청약통장 가입기간 17점)을 그대로 반영했습니다. 다만 참고용 계산이며, 실제 접수 시 최종 가점은 청약홈에서 공식 확인하세요.",
  },
  {
    question: "무주택기간은 어떻게 계산하나요?",
    answer:
      "원칙적으로 만 30세가 되는 날부터 계산하되, 30세 이전에 혼인한 경우 혼인신고일부터 계산합니다. 과거 주택을 소유한 적이 있다면 그 주택을 처분한 날 이후부터 다시 계산됩니다. 정확한 기산일은 청약홈 안내를 확인하세요.",
  },
  {
    question: "부양가족 수에 배우자도 포함되나요?",
    answer:
      "네. 신청자 본인과 같은 세대별 주민등록표에 등재된 배우자·직계존속·직계비속 등이 대상이며, 본인은 부양가족 수에서 제외하고 계산합니다.",
  },
  {
    question: "청약통장 가입기간은 통장을 바꾸면 초기화되나요?",
    answer:
      "청약저축·청약예금·청약부금에서 주택청약종합저축으로 전환한 경우 등 일부 사례는 가입기간이 통산되지만, 예외 조건이 있으므로 은행 또는 청약홈에서 통장 가입 이력을 확인하는 것이 안전합니다.",
  },
];

export const metadata = buildStaticPageMetadata({
  title: "청약 가점 계산기 - 무주택기간·부양가족·가입기간 자동 계산",
  description:
    "청약가점계산기로 무주택기간, 부양가족 수, 청약통장 가입기간만 입력하면 84점 만점 기준 예상 청약 가점을 항목별로 바로 계산합니다.",
  path: PATH,
  keywords: [
    "청약가점계산기",
    "청약 가점 계산기",
    "무주택기간 점수",
    "부양가족 가점",
    "청약통장 가입기간 점수",
    "주택청약 가점제",
  ],
});

export default function SubscriptionScorePage() {
  const canonical = getCanonicalUrl(PATH) ?? PATH;
  const home = getCanonicalUrl("/") ?? "/";

  const graph = [
    buildWebApplicationLd({
      name: "청약 가점 계산기",
      description:
        "무주택기간, 부양가족 수, 청약통장 가입기간을 입력하면 84점 만점 기준 청약 가점을 계산해주는 도구입니다.",
      url: canonical,
    }),
    buildFaqPageLd(FAQS),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "청약 가점 계산기", url: canonical },
    ]),
  ];

  return (
    <SiteChrome mainClassName="calc-page-main">
      <JsonLdScript id="jsonld-subscription-score" data={graph} />

      <article>
        <nav className="calc-bc" aria-label="breadcrumb">
          <ol className="calc-bc-list">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">청약 가점 계산기</li>
          </ol>
        </nav>

        <div className="calc-brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moneygaebi-logo.png" alt={SITE_BRAND} width={28} height={28} />
          <span>{SITE_BRAND} 계산기</span>
        </div>

        <h1 className="calc-h1">청약 가점 계산기</h1>
        <p className="calc-intro">
          무주택기간, 부양가족 수, 청약통장 가입기간 세 가지만 입력하면 84점 만점 기준
          청약 가점을 항목별로 바로 계산해 드립니다.
        </p>

        <SubscriptionScoreCalculator />

        <section className="calc-sec" aria-labelledby="how-heading">
          <h2 id="how-heading" className="calc-h2">
            청약 가점제란
          </h2>
          <p className="calc-p">
            청약 가점제는 무주택기간(32점)·부양가족수(35점)·청약통장 가입기간(17점) 세
            항목의 점수를 더해 총 84점 만점으로 산정합니다. 점수가 높을수록 가점제
            물량 청약에서 유리합니다.
          </p>
        </section>

        <FAQSection items={FAQS} />

        <nav className="calc-end-nav" aria-label="관련 페이지">
          <Link href="/calculators" className="calc-end-link">
            다른 계산기 보기
          </Link>
          <Link href="/articles/청약-가점제-완전정복" className="calc-end-link">
            청약 가점제 관련 아티클
          </Link>
          <Link href="/" className="calc-end-link">
            ← {SITE_BRAND} 홈
          </Link>
        </nav>

        <PlaceholderAdBox />
      </article>

      <style>{`
        .calc-page-main {
          max-width: 42rem;
        }
        .calc-bc {
          margin-bottom: 0.85rem;
        }
        .calc-bc-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem 0.5rem;
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.82rem;
          color: var(--muted);
        }
        .calc-bc-list a {
          color: var(--muted);
          text-decoration: none;
        }
        .calc-bc-list a:hover {
          color: #d69e2e;
          text-decoration: underline;
        }
        .calc-brand-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 0.6rem;
        }
        .calc-brand-row img {
          border-radius: 50%;
        }
        .calc-brand-row span {
          font-size: 0.8rem;
          font-weight: 700;
          color: #d69e2e;
        }
        .calc-h1 {
          font-size: clamp(1.35rem, 3.5vw, 1.75rem);
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 0.75rem;
        }
        .calc-intro {
          margin: 0 0 1rem;
          font-size: 0.98rem;
          line-height: 1.75;
          color: var(--fg);
        }
        .calc-sec {
          margin-top: 1.75rem;
        }
        .calc-h2 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .calc-p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--fg);
        }
        .calc-end-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.25rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .calc-end-link {
          font-size: 0.92rem;
          font-weight: 600;
          text-decoration: none;
          color: #d69e2e;
        }
        .calc-end-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </SiteChrome>
  );
}
