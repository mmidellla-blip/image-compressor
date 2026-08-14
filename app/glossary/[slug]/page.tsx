import { SiteChrome } from "@/components/site-chrome";
import { CALCULATORS } from "@/lib/calculators/registry";
import {
  getAllGlossarySlugs,
  getGlossaryTermBySlug,
} from "@/lib/glossary";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";
import {
  JsonLdScript,
  buildBreadcrumbListLd,
  buildDefinedTermLd,
} from "@/lib/seo/json-ld";
import { SITE_BRAND } from "@/lib/site-brand";
import { getCanonicalUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const term = getGlossaryTermBySlug(slug);
  if (!term) return { title: "용어를 찾을 수 없습니다" };

  return buildStaticPageMetadata({
    title: `${term.term} 뜻 — ${SITE_BRAND} 용어사전`,
    description: term.shortDefinition,
    path: `/glossary/${term.slug}`,
    noindex: true,
  });
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const term = getGlossaryTermBySlug(slug);
  if (!term) notFound();

  const path = `/glossary/${encodeURIComponent(term.slug)}`;
  const canonical = getCanonicalUrl(path) ?? path;
  const glossaryIndex = getCanonicalUrl("/glossary") ?? "/glossary";
  const home = getCanonicalUrl("/") ?? "/";
  const body = term.longDefinition ?? term.shortDefinition;

  const graph = [
    buildDefinedTermLd({
      name: term.term,
      description: term.shortDefinition,
      url: canonical,
      termSetUrl: glossaryIndex,
    }),
    buildBreadcrumbListLd([
      { name: "홈", url: home },
      { name: "용어사전", url: glossaryIndex },
      { name: term.term, url: canonical },
    ]),
  ];

  const relatedCalc = term.relatedArticleSlug
    ? CALCULATORS.find((c) => {
        const articleSlug = term.relatedArticleSlug!;
        if (articleSlug.includes("청약")) return c.slug === "subscription-score";
        if (articleSlug.includes("신용")) return c.slug === "credit-score";
        if (articleSlug.includes("연말") || articleSlug.includes("공제"))
          return c.slug === "year-end-tax";
        if (articleSlug.includes("적금")) return c.slug === "savings-interest";
        return false;
      })
    : undefined;

  return (
    <SiteChrome mainClassName="glossary-term-main">
      <JsonLdScript id={`jsonld-glossary-${term.slug}`} data={graph} />

      <article>
        <nav className="glossary-bc" aria-label="breadcrumb">
          <Link href="/">홈</Link>
          <span aria-hidden> · </span>
          <Link href="/glossary">용어사전</Link>
          <span aria-hidden> · </span>
          <span>{term.term}</span>
        </nav>

        <h1 className="glossary-term-h1">{term.term}</h1>
        <p className="glossary-term-lead">{term.shortDefinition}</p>

        <div className="glossary-term-body">
          <p>{body}</p>
        </div>

        <section className="glossary-term-refs" aria-labelledby="refs-h">
          <h2 id="refs-h" className="glossary-term-h2">
            더 알아보기
          </h2>
          <ul className="glossary-term-ul">
            {term.relatedArticleSlug ? (
              <li>
                <Link href={`/articles/${encodeURIComponent(term.relatedArticleSlug)}`}>
                  관련 아티클: {term.relatedArticleSlug.replace(/-/g, " ")}
                </Link>
              </li>
            ) : null}
            {relatedCalc ? (
              <li>
                <Link href={relatedCalc.path}>관련 계산기: {relatedCalc.title}</Link>
              </li>
            ) : null}
            <li>
              <Link href="/glossary">← 용어사전 목록</Link>
            </li>
          </ul>
        </section>

        <p className="glossary-disclaimer">
          본 설명은 이해를 돕기 위한 참고 자료이며, 투자·세무·법률 자문이 아닙니다. 제도·
          수치는 변경될 수 있으니 국세청·청약홈·금융감독원 등 공식 채널에서 최신 정보를
          확인하세요.
        </p>
      </article>

      <style>{`
        .glossary-term-main {
          max-width: 42rem;
        }
        .glossary-bc {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 1rem;
        }
        .glossary-bc a {
          color: var(--muted);
          text-decoration: none;
        }
        .glossary-bc a:hover {
          color: #d69e2e;
          text-decoration: underline;
        }
        .glossary-term-h1 {
          font-size: clamp(1.35rem, 3.5vw, 1.75rem);
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .glossary-term-lead {
          margin: 0 0 1.25rem;
          font-size: 1rem;
          line-height: 1.75;
          color: var(--fg);
          font-weight: 600;
        }
        .glossary-term-body p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--fg);
        }
        .glossary-term-refs {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .glossary-term-h2 {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .glossary-term-ul {
          margin: 0;
          padding-left: 1.1rem;
          line-height: 1.75;
          font-size: 0.92rem;
        }
        .glossary-term-ul a {
          color: #d69e2e;
          font-weight: 600;
          text-decoration: none;
        }
        .glossary-term-ul a:hover {
          text-decoration: underline;
        }
        .glossary-disclaimer {
          margin-top: 2rem;
          padding: 1rem;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          font-size: 0.85rem;
          line-height: 1.65;
          color: #78350f;
        }
      `}</style>
    </SiteChrome>
  );
}
