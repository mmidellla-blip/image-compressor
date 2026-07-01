import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { FAQSection } from "@/components/tools/faq-section";
import { PlaceholderAdBox } from "@/components/tools/placeholder-ad-box";
import { RelatedArticles } from "@/components/tools/related-articles";
import { RelatedTools } from "@/components/tools/related-tools";
import {
  JsonLdScript,
  buildBreadcrumbListLd,
  buildFaqPageLd,
  buildHowToLd,
  buildWebApplicationLd,
} from "@/lib/seo/json-ld";
import { getToolDefinition } from "@/lib/tools/definitions";
import { TOOL_SEO_SUPPLEMENTS } from "@/lib/tools/seo-supplements";
import type { ToolSlug } from "@/lib/tools/types";
import { SITE_BRAND } from "@/lib/site-brand";
import { getCanonicalUrl } from "@/lib/site-url";
import type { ReactNode } from "react";

type Props = {
  slug: ToolSlug;
  children: ReactNode;
};

/**
 * 도구 전용 페이지 공통 레이아웃: SEO 블록, 본문, FAQ, 관련 링크, JSON-LD(@graph).
 */
export function ToolLayout({ slug, children }: Props) {
  const t = getToolDefinition(slug);
  const canonicalTool = getCanonicalUrl(t.path);
  const canonicalHome = getCanonicalUrl("/");
  const appUrl = canonicalTool ?? t.path;
  const homeUrl = canonicalHome ?? "/";

  const supplement = TOOL_SEO_SUPPLEMENTS[slug];

  const graph = [
    buildWebApplicationLd({
      name: t.h1,
      description: t.schemaDescription,
      url: appUrl,
    }),
    buildHowToLd({
      name: `${t.h1} — 사용 방법`,
      description: t.schemaDescription,
      url: appUrl,
      steps: t.howToSteps.map((s) => ({
        name: s.title,
        text: s.body,
      })),
    }),
    buildFaqPageLd(t.faqs),
    buildBreadcrumbListLd([
      { name: "홈", url: homeUrl },
      { name: t.h1, url: appUrl },
    ]),
  ];

  return (
    <SiteChrome mainClassName="tool-page-main">
      <JsonLdScript id={`jsonld-${slug}`} data={graph} />

      <article itemScope itemType="https://schema.org/WebPage">
        <nav className="tool-bc" aria-label="breadcrumb">
          <ol className="tool-bc-list">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t.h1}</li>
          </ol>
        </nav>

        <h1 className="tool-h1" itemProp="headline">
          {t.h1}
        </h1>
        <p className="tool-intro" itemProp="description">
          {t.intro}
        </p>

        {supplement ? (
          <section className="tool-supplement" aria-label="서비스 안내">
            <p className="tool-supplement-p">{supplement}</p>
          </section>
        ) : null}

        {children}

        <section className="tool-sec" aria-labelledby="how-heading">
          <h2 id="how-heading" className="tool-h2">
            {t.howToTitle}
          </h2>
          <ol className="tool-ol">
            {t.howToSteps.map((s, i) => (
              <li key={i} className="tool-li">
                <strong className="tool-step-title">{s.title}</strong>
                <p className="tool-step-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="tool-sec" aria-labelledby="use-heading">
          <h2 id="use-heading" className="tool-h2">
            {t.useCasesTitle}
          </h2>
          <ul className="tool-ul">
            {t.useCases.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="tool-sec" aria-labelledby="warn-heading">
          <h2 id="warn-heading" className="tool-h2">
            {t.warningsTitle}
          </h2>
          <ul className="tool-ul warn">
            {t.warnings.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <FAQSection items={t.faqs} />

        <RelatedTools currentSlug={slug} />

        <RelatedArticles slugs={t.relatedBlogSlugs} title={t.relatedArticlesTitle} />

        <nav className="tool-end-nav" aria-label="관련 페이지">
          <Link href="/" className="tool-end-link">
            ← {SITE_BRAND} 홈
          </Link>
          <Link href="/blog" className="tool-end-link">
            블로그 전체
          </Link>
        </nav>

        <PlaceholderAdBox />
      </article>

      <style>{`
        .tool-page-main {
          max-width: 42rem;
        }
        .tool-bc {
          margin-bottom: 0.85rem;
        }
        .tool-bc-list {
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
        .tool-bc-list a {
          color: var(--muted);
          text-decoration: none;
        }
        .tool-bc-list a:hover {
          color: var(--accent);
          text-decoration: underline;
        }
        .tool-h1 {
          font-size: clamp(1.35rem, 3.5vw, 1.75rem);
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 0.75rem;
        }
        .tool-intro {
          margin: 0 0 1rem;
          font-size: 0.98rem;
          line-height: 1.75;
          color: var(--fg);
        }
        .tool-supplement {
          margin: 0 0 1.15rem;
          padding: 1rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }
        .tool-supplement-p {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--fg);
        }
        .tool-sec {
          margin-top: 1.75rem;
        }
        .tool-h2 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .tool-ol {
          margin: 0;
          padding-left: 1.2rem;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .tool-li {
          margin-bottom: 0.85rem;
        }
        .tool-step-title {
          display: block;
          margin-bottom: 0.25rem;
        }
        .tool-step-body {
          margin: 0;
          color: var(--muted);
        }
        .tool-ul {
          margin: 0;
          padding-left: 1.1rem;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .tool-ul.warn li {
          margin-bottom: 0.45rem;
        }
        .tool-end-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.25rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .tool-end-link {
          font-size: 0.92rem;
          font-weight: 600;
          text-decoration: none;
          color: var(--accent);
        }
        .tool-end-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </SiteChrome>
  );
}
