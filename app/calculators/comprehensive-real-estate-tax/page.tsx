import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { ComprehensiveRealEstateTaxCalculator } from "@/components/calculators/comprehensive-real-estate-tax-calculator";
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

const PATH = "/calculators/comprehensive-real-estate-tax";

const FAQS = [
  {
    question: "종부세 계산기는 어떻게 세금을 계산하나요?",
    answer:
      "공시가격 합계에서 실거주 1주택(14억)·비거주 1주택(9억)·다주택(4억) 기준 기본공제를 뺀 뒤 공정시장가액비율을 곱해 과세표준을 구하고, 3억 원부터 94억 원 초과까지 7단계 누진세율을 구간별로 나눠 합산해 산출세액을 계산합니다. 실거주 1주택자는 고령자·장기보유 세액공제를 추가로 적용합니다.",
  },
  {
    question: "재산세랑 종부세는 뭐가 다른가요?",
    answer:
      "재산세는 보유한 모든 부동산에 매년 부과되는 지방세이고, 종부세는 인별로 공시가격 합계가 기본공제 기준선을 넘는 경우에만 국세로 추가 부과됩니다. 즉 종부세는 재산세와 별개로, 공시가격이 높은 주택을 보유한 사람에게만 해당하는 세금입니다.",
  },
  {
    question: "공시가격은 어디서 확인하나요?",
    answer:
      "국토교통부가 운영하는 부동산공시가격알리미(realtyprice.kr)에서 주소만 입력하면 아파트·단독주택 등의 공시가격을 무료로 조회할 수 있습니다.",
  },
  {
    question: "다주택자 계산 결과가 실제와 다를 수 있는 이유는?",
    answer:
      "이 계산기는 다주택자 기본공제를 4억 원으로 단순화했지만, 실제로는 거주주택 비중에 따라 최대 5억 원의 추가공제가 적용될 수 있습니다. 또한 세부담 상한 제도로 전년 대비 세액 증가폭이 제한되는데, 이 부분도 계산에 반영되지 않았습니다.",
  },
  {
    question: "이 계산기 결과가 실제 고지서 금액과 같은가요?",
    answer:
      "아니요. 이 계산기는 핵심 공제 구조만 반영한 간이 추정치입니다. 실제 고지 세액은 세부담 상한, 추가공제, 재산세 과세표준 산정 방식 등이 함께 반영되어 달라질 수 있으므로 정확한 금액은 국세청 홈택스 또는 세무사 상담을 통해 확인하세요.",
  },
];

export const metadata = buildStaticPageMetadata({
  title: "종합부동산세 계산기 - 2026년 세제개편안 기준 종부세 자동 계산",
  description:
    "종부세계산기로 공시가격, 실거주 여부, 공동명의 여부만 입력하면 2026년 8월 발표된 세제개편안 기준 예상 종합부동산세를 누진세율 구간별로 바로 계산합니다.",
  path: PATH,
  keywords: [
    "종부세계산기",
    "종합부동산세 계산기",
    "종부세 계산법",
    "공정시장가액비율",
    "종부세 세율",
    "1주택 종부세",
  ],
});

export default function ComprehensiveRealEstateTaxPage() {
  const canonical = getCanonicalUrl(PATH) ?? PATH;
  const home = getCanonicalUrl("/") ?? "/";

  const graph = [
    buildWebApplicationLd({
      name: "종합부동산세 계산기",
      description:
        "공시가격, 실거주 여부, 공동명의 여부를 입력하면 2026년 세제개편안 기준 예상 종합부동산세를 계산해주는 도구입니다.",
      url: canonical,
    }),
    buildFaqPageLd(FAQS),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "종합부동산세 계산기", url: canonical },
    ]),
  ];

  return (
    <SiteChrome mainClassName="calc-page-main">
      <JsonLdScript id="jsonld-comprehensive-real-estate-tax" data={graph} />

      <article>
        <nav className="calc-bc" aria-label="breadcrumb">
          <ol className="calc-bc-list">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">종합부동산세 계산기</li>
          </ol>
        </nav>

        <div className="calc-brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moneygaebi-logo.png" alt={SITE_BRAND} width={28} height={28} />
          <span>{SITE_BRAND} 계산기</span>
        </div>

        <h1 className="calc-h1">종합부동산세 계산기</h1>
        <p className="calc-intro">
          공시가격과 실거주 여부만 입력하면 2026년 8월 발표된 세제개편안 기준 예상 종부세를
          바로 계산해 드립니다. 부부 공동명의, 고령자·장기보유 세액공제까지 확인하고 싶다면
          접이식 섹션을 펼쳐 세부 조건을 추가로 입력하세요.
        </p>

        <ComprehensiveRealEstateTaxCalculator />

        <section className="calc-sec" aria-labelledby="how-heading">
          <h2 id="how-heading" className="calc-h2">
            종합부동산세란
          </h2>
          <p className="calc-p">
            종합부동산세(종부세)는 매년 6월 1일 기준 보유한 주택의 공시가격 합계가 인별 기본공제
            기준선을 넘는 경우, 재산세와 별도로 국세청이 추가로 부과하는 국세입니다. 이 계산기는
            2026년 8월 3일 발표된 세제개편안을 기준으로 하며, 세율·공제는 2026년부터 2028년까지
            단계적으로 시행될 예정입니다.
          </p>
        </section>

        <section className="calc-sec" aria-labelledby="deduction-heading">
          <h2 id="deduction-heading" className="calc-h2">
            기본공제 및 공정시장가액비율 (2026년 기준)
          </h2>
          <ul className="calc-ul">
            <li>
              <strong>실거주 1주택자</strong> — 기본공제 14억 원, 공정시장가액비율 60%
              (2027년 70%로 인상 예정)
            </li>
            <li>
              <strong>비거주 1주택자</strong> — 기본공제 9억 원, 공정시장가액비율 60%
              (2027년 70%, 2028년 80%로 단계적 인상 예정)
            </li>
            <li>
              <strong>다주택자</strong> — 기본공제 4억 원(거주주택 비중에 따라 최대 5억 원
              추가공제 가능하나 계산이 복잡해 1차 버전에서는 단순화했으며, 정확한 추가공제는
              세무 전문가 확인이 필요합니다), 공정시장가액비율 60%(2027년 70%, 2028년 80%)
            </li>
          </ul>
        </section>

        <section className="calc-sec" aria-labelledby="table-heading">
          <h2 id="table-heading" className="calc-h2">
            누진세율표 (2028년 최종 적용 기준)
          </h2>
          <div className="calc-table-wrap">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>과세표준 구간</th>
                  <th>세율</th>
                  <th>누진공제</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>3억 원 이하</td>
                  <td>0.5%</td>
                  <td>0원</td>
                </tr>
                <tr>
                  <td>3억 초과 ~ 6억 이하</td>
                  <td>0.7%</td>
                  <td>60만 원</td>
                </tr>
                <tr>
                  <td>6억 초과 ~ 12억 이하</td>
                  <td>1.3%</td>
                  <td>420만 원</td>
                </tr>
                <tr>
                  <td>12억 초과 ~ 25억 이하</td>
                  <td>2.0%</td>
                  <td>1,260만 원</td>
                </tr>
                <tr>
                  <td>25억 초과 ~ 50억 이하</td>
                  <td>3.0%</td>
                  <td>3,760만 원</td>
                </tr>
                <tr>
                  <td>50억 초과 ~ 94억 이하</td>
                  <td>4.0%</td>
                  <td>8,760만 원</td>
                </tr>
                <tr>
                  <td>94억 원 초과</td>
                  <td>5.0%</td>
                  <td>1억 8,760만 원</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="calc-p">
            누진세율은 과세표준 전체에 최고 구간 세율을 곱하는 것이 아니라, 구간별로 나눠서
            계산한 뒤 합산합니다. 예를 들어 과세표준이 4.2억 원이면 &ldquo;3억 원 × 0.5% + 1.2억
            원 × 0.7%&rdquo;로 계산합니다. 위 누진공제표를 쓰면 &ldquo;과세표준 × 세율 − 누진공제
            = 산출세액&rdquo;으로 간단히 검산할 수 있습니다.
          </p>
        </section>

        <section className="calc-sec" aria-labelledby="credit-heading">
          <h2 id="credit-heading" className="calc-h2">
            고령자·장기보유 세액공제
          </h2>
          <p className="calc-p">
            실거주 1주택자에 한해 아래 두 공제를 중복 적용할 수 있으며, 합산 공제 한도는 최대
            80%입니다.
          </p>
          <ul className="calc-ul">
            <li>
              <strong>고령자 공제</strong> — 60세 이상 65세 미만 20%, 65세 이상 70세 미만 30%,
              70세 이상 40%
            </li>
            <li>
              <strong>장기보유 공제</strong> — 5년 이상 10년 미만 20%, 10년 이상 15년 미만
              40%, 15년 이상 50%
            </li>
          </ul>
          <p className="calc-p">
            또한 전년도 대비 세부담이 일정 비율(1주택자 150%, 다주택자 300% 등, 정확한 수치는
            최신 시행령 확인 필요) 이상 급증하지 않도록 세부담 상한 제도가 별도로 적용됩니다.
          </p>
        </section>

        <section className="calc-sec" aria-labelledby="notice-heading">
          <h2 id="notice-heading" className="calc-h2">
            데이터 최신성 안내
          </h2>
          <p className="calc-p">
            이 계산기는 2026년 8월 3일 발표된 세제개편안 기준이며, 세율·공제는 2026년부터
            2028년까지 단계적으로 시행되는 내용입니다. 국회 통과 전 발표 단계의 내용이 포함되어
            있을 수 있으므로 국회 통과 과정에서 세부 내용이 변경될 수 있습니다.
          </p>
        </section>

        <FAQSection items={FAQS} />

        <nav className="calc-end-nav" aria-label="관련 페이지">
          <Link href="/calculators" className="calc-end-link">
            다른 계산기 보기
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
        .calc-table-wrap {
          overflow-x: auto;
          margin-bottom: 0.75rem;
        }
        .calc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .calc-table th,
        .calc-table td {
          padding: 0.55rem 0.6rem;
          border: 1px solid var(--border);
          text-align: left;
          white-space: nowrap;
        }
        .calc-table th {
          background: #fafafa;
          font-weight: 700;
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
