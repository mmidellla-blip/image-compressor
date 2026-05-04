import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "블로그 · 이미지 용량 줄이기, JPG·PNG 압축 가이드",
  description:
    "이미지 용량 줄이기, JPG 용량 줄이기, 사진 용량 줄이기, 이미지 압축 방법을 다루는 글 모음입니다.",
  keywords: [
    "이미지 용량 줄이기",
    "JPG 용량 줄이기",
    "사진 용량 줄이기",
    "이미지 압축",
  ],
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <SiteChrome>
      <h1 className="page-title">블로그</h1>
      <p className="page-lead">
        사진 용량 줄이기, 이미지 압축, 웹·쇼핑몰 최적화 팁을 모았습니다. 메인
        페이지의{" "}
        <Link href="/" className="inline-link">
          이미지 용량 줄이기 도구
        </Link>
        와 함께 보시면 좋습니다.
      </p>
      <ul className="post-list">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
            <span className="post-desc">{post.description}</span>
          </li>
        ))}
      </ul>

      <style>{`
        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
        }
        .page-lead {
          color: var(--muted);
          margin: 0 0 1.5rem;
          line-height: 1.65;
        }
        .inline-link {
          font-weight: 600;
        }
        .post-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .post-list li {
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }
        .post-list a {
          display: block;
          font-weight: 600;
          text-decoration: none;
          color: var(--fg);
        }
        .post-list a:hover {
          color: var(--accent);
        }
        .post-desc {
          display: block;
          margin-top: 0.35rem;
          font-size: 0.875rem;
          color: var(--muted);
        }
      `}</style>
    </SiteChrome>
  );
}
