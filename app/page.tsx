import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { FAQSection } from "@/components/tools/faq-section";
import { getAllArticles } from "@/lib/articles";
import { CALCULATORS } from "@/lib/calculators/registry";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";
import { SITE_BRAND, SITE_BRAND_LINE } from "@/lib/site-brand";
import { getCanonicalUrl } from "@/lib/site-url";
import { HOME_PAGE_FAQS } from "@/lib/home-faq";
import {
  JsonLdScript,
  buildFaqPageLd,
  buildWebApplicationLd,
} from "@/lib/seo/json-ld";

export const metadata = buildStaticPageMetadata({
  title: "머니깨비 - 청약 가점·신용점수·연말정산·적금 계산기 | 경제 용어사전",
  description:
    "청약 가점 계산기, 신용점수 시뮬레이터, 연말정산 환급액 계산기, 적금 이자 계산기를 무료로 제공합니다. 무주택기간, 뱅크런, 소득공제, 세액공제 같은 경제 용어도 쉽게 찾아볼 수 있습니다.",
  path: "/",
  keywords: [
    "머니깨비",
    "청약 가점 계산기",
    "신용점수 시뮬레이터",
    "연말정산 환급액 계산기",
    "적금 이자 계산기",
    "무주택기간",
    "뱅크런",
    "소득공제",
    "세액공제",
    "경제 용어사전",
    "경제 초보",
  ],
});

export default function HomePage() {
  const articles = getAllArticles().slice(0, 5);
  const glossaryTerms = getAllGlossaryTerms().slice(0, 6);

  const homeUrl = getCanonicalUrl("/") ?? "/";
  const homeGraph = [
    buildWebApplicationLd({
      name: SITE_BRAND,
      description:
        "청약 가점 계산기, 신용점수 시뮬레이터, 연말정산 환급액 계산기, 적금 이자 계산기를 무료로 제공합니다. 무주택기간, 뱅크런, 소득공제, 세액공제 같은 경제 용어도 쉽게 찾아볼 수 있습니다.",
      url: homeUrl,
    }),
    buildFaqPageLd(HOME_PAGE_FAQS),
  ];

  return (
    <SiteChrome mainClassName="home-wrap">
      <JsonLdScript id="jsonld-home" data={homeGraph} />

      <header className="home-hero">
        <p className="home-kicker">{SITE_BRAND_LINE}</p>
        <h1 className="home-h1">경제 완전 초보를 위한 돈 이야기</h1>
        <p className="home-lead">
          청약·신용점수·연말정산·적금처럼 매일 마주치지만 막상 알아보려면 어려운 돈 이야기를,
          계산기와 쉬운 설명으로 바로 확인해 보세요.
        </p>
        <p className="home-problem-lead">
          청약·신용·연말정산·적금 주제별 아티클과 계산기로, 내 상황에 맞는 숫자와 개념을
          바로 확인해 보세요.
        </p>
        <ul className="home-pill-list" aria-label="서비스 특징">
          <li>회원가입 없이 사용</li>
          <li>무료 계산기</li>
          <li>쉬운 경제 용어 설명</li>
          <li>사회초년생 눈높이</li>
        </ul>
        <div className="home-cta-row">
          <Link href="/calculators/subscription-score" className="home-cta home-cta--primary">
            청약 가점 계산기 보기
          </Link>
          <Link href="/glossary" className="home-cta">
            경제 용어사전 보기
          </Link>
        </div>
        <ul className="home-trust-badges" aria-label="신뢰 안내">
          <li>청약 가점 84점 만점 기준</li>
          <li>숫자만 입력하면 바로 결과</li>
          <li>용어 12개 검색 가능</li>
          <li>PC·모바일 브라우저 지원</li>
        </ul>
      </header>

      <section id="calculators" className="home-money-section" aria-labelledby="calculators-heading">
        <h2 id="calculators-heading" className="home-h2">
          경제 계산기
        </h2>
        <p className="home-money-desc">
          복잡한 계산을 숫자만 입력하면 바로 확인할 수 있습니다.
        </p>
        <div className="money-card-grid">
          {CALCULATORS.map((c) => (
            <Link key={c.slug} href={c.path} className="money-card money-card--live">
              <strong>{c.title}</strong>
              <span>{c.description} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="articles" className="home-money-section" aria-labelledby="articles-heading">
        <h2 id="articles-heading" className="home-h2">
          아티클
        </h2>
        <p className="home-money-desc">
          계산기와 관련된 경제 개념을 사회초년생 눈높이로 쉽게 풀어 썼습니다.
        </p>
        <ul className="article-teaser-list">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={`/articles/${encodeURIComponent(article.slug)}`}>
                {article.title}
              </Link>
              <span className="article-teaser-category">{article.category}</span>
            </li>
          ))}
        </ul>
        <p className="home-money-more">
          <Link href="/articles">아티클 전체 보기 →</Link>
        </p>
      </section>

      <section id="glossary" className="home-money-section" aria-labelledby="glossary-heading">
        <h2 id="glossary-heading" className="home-h2">
          머니깨비 용어사전
        </h2>
        <p className="home-money-desc">
          신용창조·지급준비율·뱅크런처럼 자주 듣지만 헷갈리는 경제 용어를 검색해서 바로
          확인할 수 있습니다.
        </p>
        <ul className="article-teaser-list">
          {glossaryTerms.map((t) => (
            <li key={t.slug}>
              <Link href="/glossary">{t.term}</Link>
            </li>
          ))}
        </ul>
        <p className="home-money-more">
          <Link href="/glossary">용어사전 전체 보기 →</Link>
        </p>
      </section>

      <FAQSection title="자주 묻는 질문" items={HOME_PAGE_FAQS} />

      <style>{`
        .home-wrap {
          padding-top: 0.35rem;
        }
        .home-hero {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .home-kicker {
          margin: 0 0 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #047857;
          letter-spacing: 0.02em;
          line-height: 1.35;
        }
        .home-h1 {
          font-size: clamp(1.45rem, 5vw, 2.05rem);
          font-weight: 800;
          margin: 0 0 0.55rem;
          line-height: 1.25;
          letter-spacing: -0.03em;
        }
        .home-lead {
          margin: 0 auto 0.85rem;
          max-width: 36rem;
          font-size: 0.94rem;
          color: var(--muted);
          line-height: 1.65;
        }
        .home-problem-lead {
          margin: 0 auto 0.9rem;
          max-width: 38rem;
          font-size: 0.84rem;
          line-height: 1.55;
          color: #334155;
        }
        .home-pill-list {
          list-style: none;
          padding: 0;
          margin: 0 auto 1rem;
          max-width: 28rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          justify-content: center;
        }
        .home-pill-list li {
          font-size: 0.72rem;
          font-weight: 700;
          color: #0f172a;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 0.28rem 0.55rem;
        }
        .home-cta-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 22rem;
          margin: 0 auto 1rem;
        }
        @media (min-width: 520px) {
          .home-cta-row {
            max-width: none;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
        .home-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem 1rem;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          border: 1px solid var(--border);
          color: var(--fg);
          background: #fff;
        }
        .home-cta--primary {
          background: #059669;
          color: #fff;
          border-color: #047857;
        }
        .home-cta--primary:hover {
          background: #047857;
        }
        .home-cta:hover {
          border-color: #94a3b8;
        }
        .home-trust-badges {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem 0.65rem;
          justify-content: center;
          font-size: 0.72rem;
          color: var(--muted);
        }
        .home-trust-badges li::before {
          content: "✓ ";
          color: #059669;
          font-weight: 800;
        }
        .home-money-section {
          margin-bottom: 1.75rem;
          padding: 1.15rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
        }
        .home-money-desc {
          margin: 0 0 1rem;
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.6;
        }
        .money-card-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.7rem;
        }
        @media (min-width: 640px) {
          .money-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .money-card {
          display: grid;
          gap: 0.25rem;
          padding: 0.85rem 0.9rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: #fff;
          text-decoration: none;
        }
        .money-card strong {
          font-size: 0.92rem;
          color: #0f172a;
        }
        .money-card span {
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .money-card--soon {
          opacity: 0.85;
        }
        .money-card--live {
          border-color: #d69e2e;
          background: #fffbeb;
        }
        .money-card--live span {
          color: #92702a;
          font-weight: 600;
        }
        .money-card--live:hover {
          border-color: #b7791f;
          background: #fef3c7;
        }
        .article-teaser-list {
          list-style: none;
          margin: 0 0 0.9rem;
          padding: 0;
          display: grid;
          gap: 0.55rem;
        }
        .article-teaser-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding: 0.6rem 0;
          border-bottom: 1px solid var(--border);
        }
        .article-teaser-list a {
          font-weight: 600;
          text-decoration: none;
          color: var(--fg);
          font-size: 0.9rem;
        }
        .article-teaser-list a:hover {
          color: #d69e2e;
        }
        .article-teaser-category {
          font-size: 0.7rem;
          font-weight: 700;
          color: #92702a;
          background: #fffbeb;
          border: 1px solid #f5c344;
          border-radius: 999px;
          padding: 0.1rem 0.5rem;
        }
        .home-money-more {
          margin: 0;
          font-size: 0.9rem;
        }
        .home-h2 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
      `}</style>
    </SiteChrome>
  );
}
