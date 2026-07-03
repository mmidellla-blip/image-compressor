import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { SavingsInterestCalculator } from "@/components/calculators/savings-interest-calculator";
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

const PATH = "/calculators/savings-interest";

const FAQS = [
  {
    question: "단리와 복리 중 어느 쪽을 골라야 하나요?",
    answer:
      "적금은 매달 나눠 납입하는 구조라 단리·복리 차이가 예금만큼 크게 벌어지지 않는 경우가 많습니다. 이자율 표시 방식보다 우대금리 조건 충족 여부와 세후 실수령액을 함께 비교하는 것이 더 중요합니다.",
  },
  {
    question: "우대금리 조건은 이 계산기에 반영되나요?",
    answer:
      "반영되지 않습니다. 이 계산기는 입력한 연 이자율을 기준으로 세전·세후 이자를 계산할 뿐이므로, 우대금리를 포함한 실제 최고 금리를 받을 수 있는지는 상품 약관에서 별도로 확인해야 합니다.",
  },
  {
    question: "세금은 얼마나 반영되나요?",
    answer:
      "일반적인 이자소득세율인 15.4%(이자소득세 14% + 지방소득세 1.4%)를 적용했습니다. 비과세·세금우대 상품은 이보다 적게 과세되므로 실제 수령액이 더 많을 수 있습니다.",
  },
];

export const metadata = buildStaticPageMetadata({
  title: "적금 이자 계산기 - 단리·복리 세후 수령액 비교",
  description:
    "적금 이자 계산기로 매달 납입액, 기간, 연 이자율을 입력하면 단리와 복리 방식의 만기 세후 수령액을 바로 비교할 수 있습니다.",
  path: PATH,
  keywords: [
    "적금 이자 계산기",
    "적금 단리 복리",
    "적금 이자율 계산",
    "적금 만기 이자",
    "이자소득세",
  ],
});

export default function SavingsInterestPage() {
  const canonical = getCanonicalUrl(PATH) ?? PATH;
  const home = getCanonicalUrl("/") ?? "/";

  const graph = [
    buildWebApplicationLd({
      name: "적금 이자 계산기",
      description:
        "매달 납입액, 기간, 연 이자율을 입력하면 단리와 복리 방식의 세전·세후 이자를 비교해주는 도구입니다.",
      url: canonical,
    }),
    buildFaqPageLd(FAQS),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "적금 이자 계산기", url: canonical },
    ]),
  ];

  return (
    <SiteChrome mainClassName="calc-page-main">
      <JsonLdScript id="jsonld-savings-interest" data={graph} />

      <article>
        <nav className="calc-bc" aria-label="breadcrumb">
          <ol className="calc-bc-list">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">적금 이자 계산기</li>
          </ol>
        </nav>

        <div className="calc-brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moneygaebi-logo.png" alt={SITE_BRAND} width={28} height={28} />
          <span>{SITE_BRAND} 계산기</span>
        </div>

        <h1 className="calc-h1">적금 이자 계산기</h1>
        <p className="calc-intro">
          매달 납입액, 적금 기간, 연 이자율만 입력하면 단리와 복리 방식의 만기 세후
          수령액을 바로 비교해 드립니다.
        </p>

        <SavingsInterestCalculator />

        <section className="calc-sec" aria-labelledby="how-heading">
          <h2 id="how-heading" className="calc-h2">
            적금에서 단리·복리 차이가 크지 않은 이유
          </h2>
          <p className="calc-p">
            적금은 예금과 달리 매달 조금씩 나눠 넣는 상품이라, 가장 먼저 넣은 돈만 만기까지
            온전히 이자를 다 받고 마지막 달에 넣은 돈은 이자가 붙는 기간이 한 달뿐입니다.
            이 구조 때문에 단리와 복리의 차이가 예금만큼 크게 벌어지지 않는 경우가 많습니다.
          </p>
        </section>

        <FAQSection items={FAQS} />

        <nav className="calc-end-nav" aria-label="관련 페이지">
          <Link href="/calculators" className="calc-end-link">
            다른 계산기 보기
          </Link>
          <Link href="/articles/적금-단리-복리-차이" className="calc-end-link">
            적금 관련 아티클
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
