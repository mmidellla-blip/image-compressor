"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "./editor";

export type PostFormData = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  contentHtml: string;
  published: boolean;
  sha?: string;
};

type Props = {
  initialData?: Partial<PostFormData>;
  mode: "new" | "edit";
};

function toSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/-+/g, "-");
}

export function PostForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [datePublished, setDatePublished] = useState(
    initialData?.datePublished ?? new Date().toISOString().split("T")[0]
  );
  const [contentHtml, setContentHtml] = useState(
    initialData?.contentHtml ?? ""
  );
  const [slugEdited, setSlugEdited] = useState(mode === "edit");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(toSlug(value));
  }

  async function handleSave(publishedValue: boolean) {
    if (!title.trim() || !slug.trim()) {
      setError("제목과 슬러그는 필수입니다");
      return;
    }

    setSaving(true);
    setError("");

    const body = {
      slug,
      title,
      description,
      datePublished,
      contentHtml,
      published: publishedValue,
      relatedSlugs: [],
      sections: [],
      ...(initialData?.sha ? { sha: initialData.sha } : {}),
    };

    try {
      const url =
        mode === "edit" ? `/api/admin/posts/${slug}` : "/api/admin/posts";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "저장 실패");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800 }}>
          {mode === "new" ? "새 글 쓰기" : "글 수정"}
        </h1>
        <a
          href="/admin/dashboard"
          style={{ color: "#718096", textDecoration: "none", fontSize: "0.9rem" }}
        >
          ← 목록으로
        </a>
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fff5f5",
            border: "1px solid #fed7d7",
            borderRadius: "8px",
            color: "#c53030",
            marginBottom: "1.25rem",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <label style={label}>제목</label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="글 제목을 입력하세요"
            style={input}
          />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
        >
          <div>
            <label style={label}>슬러그 (URL 경로)</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="my-post-slug"
              disabled={mode === "edit"}
              style={{
                ...input,
                background: mode === "edit" ? "#f8fafc" : "white",
                color: mode === "edit" ? "#718096" : "inherit",
              }}
            />
          </div>
          <div>
            <label style={label}>발행일</label>
            <input
              type="date"
              value={datePublished}
              onChange={(e) => setDatePublished(e.target.value)}
              style={input}
            />
          </div>
        </div>

        <div>
          <label style={label}>설명 (SEO·블로그 목록 표시)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="블로그 목록과 검색엔진에 사용되는 한두 줄 설명"
            rows={2}
            style={{ ...input, resize: "vertical" as const }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "1.75rem" }}>
        <label style={label}>본문</label>
        <TiptapEditor content={contentHtml} onChange={setContentHtml} />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          style={{
            padding: "0.7rem 1.5rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "저장 중..." : "발행"}
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          style={{
            padding: "0.7rem 1.25rem",
            background: "white",
            color: "#374151",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          임시저장
        </button>
        <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          저장 후 GitHub에 커밋 → Vercel이 자동 배포합니다 (~1분)
        </span>
      </div>
    </div>
  );
}

const label: React.CSSProperties = {
  display: "block",
  marginBottom: "0.35rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#374151",
};

const input: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.65rem 0.85rem",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "0.95rem",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
