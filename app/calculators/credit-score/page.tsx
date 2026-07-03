import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { CreditScoreSimulator } from "@/components/calculators/credit-score-simulator";
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

const PATH = "/calculators/credit-score";

const FAQS = [
  {
    question: "이 시뮬레이터의 점수 변화가 정확한가요?",
    answer:
      "아니요. NICE·KCB 등 신용평가사의 실제 산정 알고리즘은 공개되어 있지 않습니다. 이 시뮬레이터는 일반적으로 알려진 경향을 참고해 예상 범위를 보여주는 참고용 도구이며, 실제 점수 변화와 다를 수 있습니다."
    },
  {
    question: "내 정확한 신용점수는 어디서 확인하나요?",
    answer:
      "토스, 카카오뱅크, 네이버페이 등 여러 앱에서 무료로 신용점수를 조회할 수 있습니다. 신용평가사(NICE·KCB)마다 점수가 다르게 나올 수 있습니다.",
  },
  {
    question: "연체를 갚으면 점수가 바로 회복되나요?",
    answer:
      "상환 즉시 완전히 회복되기보다 이력이 일정 기간 남아 서서히 회복되는 경우가 일반적입니다. 이후 연체 없이 꾸준한 거래를 이어가는 것이 회복에 도움이 됩니다.",
  },
];

export const metadata = buildStaticPageMetadata({
  title: "신용점수 시뮬레이터 - 연체·대출·카드 사용률 시나리오별 예상 변화",
  description:
    "연체, 대출 추가, 카드 한도 사용률 시나리오를 선택하면 신용점수가 어느 방향으로, 대략 어느 정도 움직일 수 있는지 참고용 범위로 보여주는 신용점수 시뮬레이터입니다.",
  path: PATH,
  keywords: [
    "신용점수 시뮬레이터",
    "신용점수 계산",
    "연체 신용점수",
    "신용점수 올리는 법",
    "신용점수 등급",
  ],
});

export default function CreditScorePage() {
  const canonical = getCanonicalUrl(PATH) ?? PATH;
  const home = getCanonicalUrl("/") ?? "/";

  const graph = [
    buildWebApplicationLd({
      name: "신용점수 시뮬레이터",
      description:
        "연체, 대출 추가, 카드 한도 사용률 시나리오별로 예상 신용점수 변화 범위를 보여주는 참고용 시뮬레이터입니다.",
      url: canonical,
    }),
    buildFaqPageLd(FAQS),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "신용점수 시뮬레이터", url: canonical },
    ]),
  ];

  return (
    <SiteChrome mainClassName="calc-page-main">
      <JsonLdScript id="jsonld-credit-score" data={graph} />

      <article>
        <nav className="calc-bc" aria-label="breadcrumb">
          <ol className="calc-bc-list">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">신용점수 시뮬레이터</li>
          </ol>
        </nav>

        <div className="calc-brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moneygaebi-logo.png" alt={SITE_BRAND} width={28} height={28} />
          <span>{SITE_BRAND} 계산기</span>
        </div>

        <h1 className="calc-h1">신용점수 시뮬레이터</h1>
        <p className="calc-intro">
          연체, 신규 대출·카드, 카드 한도 사용률 시나리오를 선택하면 신용점수가 대략
          어느 방향으로 움직일 수 있는지 참고용 범위로 확인할 수 있습니다.
        </p>

        <CreditScoreSimulator />

        <section className="calc-sec" aria-labelledby="how-heading">
          <h2 id="how-heading" className="calc-h2">
            왜 &quot;정확한 점수&quot;가 아니라 범위로 보여주나요
          </h2>
          <p className="calc-p">
            신용점수는 신용평가사가 비공개 알고리즘으로 산정하기 때문에, 외부에서 정확한
            변화 폭을 계산할 방법이 없습니다. 이 시뮬레이터는 일반적으로 알려진 경향(연체는
            점수를 크게 낮추고, 단기간 다수의 신규 대출·조회는 부정적으로 작용하는 경향 등)을
            참고해 대략적인 범위만 제공합니다.
          </p>
        </section>

        <FAQSection items={FAQS} />

        <nav className="calc-end-nav" aria-label="관련 페이지">
          <Link href="/calculators" className="calc-end-link">
            다른 계산기 보기
          </Link>
          <Link href="/articles/신용점수-오르고-내리는-이유" className="calc-end-link">
            신용점수 관련 아티클
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
