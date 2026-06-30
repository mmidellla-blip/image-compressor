"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PostMeta = {
  slug: string;
  sha: string;
  title: string;
  datePublished?: string;
  published: boolean;
};

export default function DashboardPage() {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data: PostMeta[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string, sha: string) {
    if (!confirm(`"${slug}" 글을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`))
      return;

    setDeleting(slug);
    try {
      await fetch(`/api/admin/posts/${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sha }),
      });
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } finally {
      setDeleting(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "2rem 1.25rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>
            블로그 관리
          </h1>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "#718096" }}>
            글을 저장하면 GitHub에 커밋되고 약 1분 후 사이트에 반영됩니다
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            href="/admin/new"
            style={{
              padding: "0.6rem 1.2rem",
              background: "#3b82f6",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            + 새 글 쓰기
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.6rem 1rem",
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
              color: "#374151",
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#718096", padding: "2rem 0" }}>불러오는 중...</p>
      ) : posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 0",
            color: "#718096",
            border: "2px dashed #e2e8f0",
            borderRadius: "12px",
          }}
        >
          <p style={{ margin: "0 0 1rem", fontSize: "1rem" }}>
            아직 작성된 글이 없습니다
          </p>
          <Link
            href="/admin/new"
            style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}
          >
            첫 번째 글 쓰기 →
          </Link>
        </div>
      ) : (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={th}>제목</th>
                <th style={th}>발행일</th>
                <th style={th}>상태</th>
                <th style={{ ...th, width: "120px" }}></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.slug}
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                >
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{post.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.15rem" }}>
                      /blog/{post.slug}
                    </div>
                  </td>
                  <td style={{ ...td, color: "#718096", fontSize: "0.875rem" }}>
                    {post.datePublished
                      ? new Date(post.datePublished).toLocaleDateString("ko-KR")
                      : "-"}
                  </td>
                  <td style={td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.2rem 0.65rem",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background: post.published ? "#dcfce7" : "#fef9c3",
                        color: post.published ? "#15803d" : "#854d0e",
                      }}
                    >
                      {post.published ? "발행됨" : "임시저장"}
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <Link
                      href={`/admin/edit/${post.slug}`}
                      style={{
                        marginRight: "0.85rem",
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug, post.sha)}
                      disabled={deleting === post.slug}
                      style={{
                        color: "#ef4444",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        opacity: deleting === post.slug ? 0.5 : 1,
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "0.75rem 1rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#718096",
  textTransform: "uppercase" as const,
  letterSpacing: "0.03em",
};

const td: React.CSSProperties = {
  padding: "0.9rem 1rem",
  verticalAlign: "middle",
};
