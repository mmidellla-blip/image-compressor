"use client";

import type { FaqItem } from "@/lib/tools/types";

export function FAQSection({
  title = "자주 묻는 질문",
  items,
}: {
  title?: string;
  items: FaqItem[];
}) {
  return (
    <section className="faq-sec" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="faq-h2">
        {title}
      </h2>
      <dl className="faq-dl">
        {items.map((item, i) => (
          <div key={i} className="faq-item">
            <dt className="faq-q">{item.question}</dt>
            <dd className="faq-a">{item.answer}</dd>
          </div>
        ))}
      </dl>
      <style jsx>{`
        .faq-sec {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .faq-h2 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 1rem;
        }
        .faq-dl {
          margin: 0;
        }
        .faq-item {
          margin-bottom: 1.15rem;
        }
        .faq-q {
          font-weight: 700;
          font-size: 0.95rem;
          margin: 0 0 0.35rem;
        }
        .faq-a {
          margin: 0;
          font-size: 0.92rem;
          color: var(--muted);
          line-height: 1.7;
        }
      `}</style>
    </section>
  );
}
