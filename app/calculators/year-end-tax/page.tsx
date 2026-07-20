import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { YearEndTaxCalculator } from "@/components/calculators/year-end-tax-calculator";
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

const PATH = "/calculators/year-end-tax";

const FAQS = [
  {
    question: "이 계산기의 환급액이 실제 연말정산 결과와 같나요?",
    answer:
      "다를 수 있습니다. 이 계산기는 근로소득공제·인적공제·신용카드 소득공제·누진세율·근로소득세액공제·연금저축·월세 세액공제의 핵심 구조만 반영한 간이 추정치이며, 보험료·의료비·기부금 등 다른 공제 항목은 포함하지 않았습니다. 정확한 금액은 국세청 홈택스 연말정산 미리보기에서 확인하세요.",
  },
  {
    question: "기납부세액은 어디서 확인하나요?",
    answer:
      "매달 급여명세서의 소득세 항목을 1년치 합산하거나, 국세청 홈택스에서 원천징수영수증을 통해 확인할 수 있습니다.",
  },
  {
    question: "월세 세액공제는 아무나 받을 수 있나요?",
    answer:
      "무주택 세대주, 총급여 기준 등 요건을 충족해야 받을 수 있습니다. 이 계산기는 요건 충족을 가정하고 계산하므로, 본인이 실제로 요건에 해당하는지는 홈택스 안내를 통해 별도로 확인해야 합니다.",
  },
];

export const metadata = buildStaticPageMetadata({
  title: "연말정산 환급액 계산기 - 총급여·공제 입력하고 예상 환급액 확인",
  description:
    "연말정산 환급액 계산기로 총급여, 기납부세액, 부양가족 수, 신용카드 사용액, 연금저축, 월세를 입력하면 예상 환급액(또는 추가 납부액)을 바로 계산합니다.",
  path: PATH,
  keywords: [
    "연말정산 환급액 계산기",
    "연말정산 계산기",
    "13월의 월급",
    "소득공제 세액공제",
    "연말정산 미리보기",
  ],
});

export default function YearEndTaxPage() {
  const canonical = getCanonicalUrl(PATH) ?? PATH;
  const home = getCanonicalUrl("/") ?? "/";

  const graph = [
    buildWebApplicationLd({
      name: "연말정산 환급액 계산기",
      description:
        "총급여, 기납부세액, 부양가족 수, 신용카드 사용액, 연금저축, 월세를 입력하면 예상 연말정산 환급액을 계산해주는 도구입니다.",
      url: canonical,
    }),
    buildFaqPageLd(FAQS),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "연말정산 환급액 계산기", url: canonical },
    ]),
  ];

  return (
    <SiteChrome mainClassName="calc-page-main">
      <JsonLdScript id="jsonld-year-end-tax" data={graph} />

      <article>
        <nav className="calc-bc" aria-label="breadcrumb">
          <ol className="calc-bc-list">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">연말정산 환급액 계산기</li>
          </ol>
        </nav>

        <div className="calc-brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moneygaebi-logo.png" alt={SITE_BRAND} width={28} height={28} />
          <span>{SITE_BRAND} 계산기</span>
        </div>

        <h1 className="calc-h1">연말정산 환급액 계산기</h1>
        <p className="calc-intro">
          총급여, 기납부세액, 부양가족 수, 신용카드 사용액, 연금저축·월세 납입액을
          입력하면 예상 환급액(또는 추가 납부액)을 항목별로 바로 계산해 드립니다.
        </p>

        <YearEndTaxCalculator />

        <section className="calc-sec" aria-labelledby="how-heading">
          <h2 id="how-heading" className="calc-h2">
            왜 &quot;간이&quot; 계산기인가요
          </h2>
          <p className="calc-p">
            실제 연말정산은 보험료·의료비·기부금·주택자금 등 훨씬 많은 공제 항목을
            반영합니다. 이 계산기는 근로소득공제부터 세액공제까지 가장 비중이 큰 핵심
            구조만 반영해 대략적인 환급 방향과 규모를 가늠하는 용도로 만들었습니다.
          </p>
        </section>

        <section className="calc-sec" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="calc-h2">
            계산 구조 한눈에 보기
          </h2>
          <ul className="calc-ul">
            <li><strong>① 근로소득공제</strong> — 총급여 구간별 공제율을 적용해 근로소득금액을 구합니다.</li>
            <li><strong>② 소득공제</strong> — 부양가족 1인당 150만 원 인적공제와 신용카드 등 사용액 소득공제를 반영해 과세표준을 구합니다.</li>
            <li><strong>③ 산출세액</strong> — 과세표준에 6~45% 누진세율을 적용합니다.</li>
            <li><strong>④ 세액공제</strong> — 근로소득세액공제, 연금저축·IRP 세액공제(최대 15%), 월세 세액공제(최대 15%)를 차감해 결정세액을 구합니다.</li>
            <li><strong>⑤ 환급/추징</strong> — 기납부세액(원천징수액)에서 결정세액(지방소득세 10% 포함)을 뺀 만큼 환급받거나 추가로 납부합니다.</li>
          </ul>
        </section>

        <section className="calc-sec" aria-labelledby="example-heading">
          <h2 id="example-heading" className="calc-h2">
            예시로 계산해보기
          </h2>
          <p className="calc-p">
            총급여 4,000만 원, 기납부세액 180만 원, 부양가족 2명, 신용카드 사용액 1,500만
            원, 연금저축 300만 원, 월세 없음인 경우입니다.
          </p>
          <ul className="calc-ul">
            <li>근로소득공제 후 근로소득금액 → 약 2,875만 원</li>
            <li>인적공제(300만 원) + 신용카드공제(75만 원) → 과세표준 약 2,500만 원</li>
            <li>산출세액(누진세율 적용) → 약 249만 원</li>
            <li>근로소득세액공제(68.4만 원) + 연금저축세액공제(45만 원) → 결정세액 약 135.6만 원</li>
            <li>지방소득세(10%) 포함 총 세부담 약 149.2만 원</li>
            <li>기납부세액 180만 원 - 149.2만 원 → 약 <strong>30.8만 원 환급</strong></li>
          </ul>
        </section>

        <section className="calc-sec" aria-labelledby="tips-heading">
          <h2 id="tips-heading" className="calc-h2">
            환급을 늘리는 방법
          </h2>
          <ul className="calc-ul">
            <li>
              <strong>연금저축·IRP 납입</strong> — 연 600만 원 한도까지 총급여
              5,500만 원 이하는 15%, 초과는 12%가 세액공제되어 절세 효과가 큰
              편입니다.
            </li>
            <li>
              <strong>신용카드보다 체크카드·현금영수증</strong> — 신용카드 등 사용액
              소득공제는 사용처·수단별로 공제율이 달라, 이미 신용카드로 총급여의
              25%를 채웠다면 남은 지출은 공제율이 더 높은 체크카드나 현금영수증으로
              돌리는 것이 유리할 수 있습니다.
            </li>
            <li>
              <strong>월세 세액공제 요건 확인</strong> — 무주택 세대주이면서 총급여
              요건을 충족하면 연 750만 원 한도까지 12~15% 세액공제를 받을 수
              있으니, 임대차계약서·주민등록등본 등 요건을 놓치지 않았는지
              확인해보세요.
            </li>
          </ul>
        </section>

        <FAQSection items={FAQS} />

        <nav className="calc-end-nav" aria-label="관련 페이지">
          <Link href="/calculators" className="calc-end-link">
            다른 계산기 보기
          </Link>
          <Link href="/articles/연말정산-환급-추징-갈리는-이유" className="calc-end-link">
            연말정산 관련 아티클
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
        .calc-p + .calc-p {
          margin-top: 0.75rem;
        }
        .calc-ul {
          margin: 0;
          padding-left: 1.15rem;
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--fg);
        }
        .calc-ul li {
          margin-bottom: 0.5rem;
        }
        .calc-ul + .calc-p {
          margin-top: 0.75rem;
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
