import { getPostBySlugServer } from "@/lib/blog-posts-server";
import Link from "next/link";

type Props = {
  slugs: string[];
  title?: string;
};

/** 블로그 글 slug 목록으로 카드형 내부 링크를 만듭니다. */
export function RelatedArticles({ slugs, title = "관련 블로그 글" }: Props) {
  const posts = slugs
    .map((s) => getPostBySlugServer(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (posts.length === 0) return null;

  return (
    <nav className="rel-art" aria-labelledby="rel-art-h">
      <h2 id="rel-art-h" className="rel-art-title">
        {title}
      </h2>
      <ul className="rel-art-ul">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${encodeURIComponent(p.slug)}`}>{p.title}</Link>
            <span className="rel-art-desc">{p.description}</span>
          </li>
        ))}
      </ul>
      <style>{`
        .rel-art {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .rel-art-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 0.85rem;
        }
        .rel-art-ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .rel-art-ul li {
          padding: 0.65rem 0;
          border-bottom: 1px solid var(--border);
        }
        .rel-art-ul a {
          display: block;
          font-weight: 600;
          text-decoration: none;
          color: var(--fg);
          font-size: 0.95rem;
          line-height: 1.35;
        }
        .rel-art-ul a:hover {
          color: var(--accent);
        }
        .rel-art-desc {
          display: block;
          margin-top: 0.3rem;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.45;
        }
      `}</style>
    </nav>
  );
}
