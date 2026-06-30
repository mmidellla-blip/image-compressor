"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "로그인 실패");
      }
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "100%",
          maxWidth: "360px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <h1
          style={{ margin: "0 0 0.25rem", fontSize: "1.25rem", fontWeight: 800 }}
        >
          관리자
        </h1>
        <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: "#718096" }}>
          CompressDeck 블로그 관리
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
          autoFocus
          style={{
            display: "block",
            width: "100%",
            padding: "0.65rem 0.85rem",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "1rem",
            marginBottom: "0.75rem",
            boxSizing: "border-box",
          }}
        />
        {error && (
          <p
            style={{
              color: "#e53e3e",
              fontSize: "0.875rem",
              margin: "0 0 0.75rem",
            }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.7rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
