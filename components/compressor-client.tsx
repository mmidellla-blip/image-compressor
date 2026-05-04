"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function CompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("compressed.jpg");

  const resetOutput = useCallback(() => {
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCompressedSize(null);
    setOriginalSize(null);
    setError(null);
  }, []);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("이미지 파일(JPG, PNG 등)을 선택해 주세요.");
      setFile(null);
      return;
    }
    setFile(f);
    resetOutput();
    setOriginalSize(f.size);
  };

  const compress = async () => {
    if (!file) {
      setError("파일을 먼저 선택해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    resetOutput();
    setOriginalSize(file.size);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("format", format);

    try {
      const res = await fetch("/api/compress", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError((j as { error?: string }).error ?? "압축에 실패했습니다.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setCompressedSize(blob.size);
      const ext = format === "webp" ? "webp" : "jpg";
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setDownloadName(`${base}-compressed.${ext}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const reduction =
    originalSize && compressedSize && originalSize > 0
      ? Math.round((1 - compressedSize / originalSize) * 100)
      : null;

  return (
    <div className="compressor">
      <div className="card">
        <label className="label" htmlFor="file">
          이미지 선택
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/*"
          onChange={onPick}
          className="file-input"
        />

        <fieldset className="format-fieldset">
          <legend className="label">출력 형식</legend>
          <div className="format-row">
            <label className="radio">
              <input
                type="radio"
                name="format"
                checked={format === "jpeg"}
                onChange={() => setFormat("jpeg")}
              />
              JPEG (품질 약 60%)
            </label>
            <label className="radio">
              <input
                type="radio"
                name="format"
                checked={format === "webp"}
                onChange={() => setFormat("webp")}
              />
              WebP (품질 약 60%)
            </label>
          </div>
        </fieldset>

        <button
          type="button"
          className="btn-primary"
          onClick={compress}
          disabled={loading || !file}
        >
          {loading ? "압축 중…" : "용량 줄이기"}
        </button>

        {error ? <p className="error">{error}</p> : null}

        {originalSize !== null && (
          <dl className="stats">
            <div>
              <dt>원본 크기</dt>
              <dd>{formatBytes(originalSize)}</dd>
            </div>
            {compressedSize !== null && (
              <div>
                <dt>압축 후</dt>
                <dd>{formatBytes(compressedSize)}</dd>
              </div>
            )}
            {reduction !== null && compressedSize !== null && (
              <div>
                <dt>감소율</dt>
                <dd className="highlight">{reduction}%</dd>
              </div>
            )}
          </dl>
        )}

        {downloadUrl ? (
          <p className="download-wrap">
            <a
              className="download"
              href={downloadUrl}
              download={downloadName}
            >
              압축 이미지 다운로드
            </a>
          </p>
        ) : null}
      </div>

      <p className="hint">
        브라우저에서 처리되며 서버는 압축에만 사용됩니다. 민감한 이미지는 오프라인
        도구를 권장합니다.{" "}
        <Link href="/blog">이미지 용량·SEO 팁</Link>은 블로그를 참고하세요.
      </p>

      <style jsx>{`
        .compressor {
          max-width: 40rem;
          margin: 0 auto;
        }
        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
        }
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--fg);
        }
        .file-input {
          width: 100%;
          padding: 0.5rem 0;
          font-size: 0.9rem;
        }
        .format-fieldset {
          border: none;
          padding: 0;
          margin: 1.25rem 0 0;
        }
        .format-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.35rem;
        }
        .radio {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .btn-primary {
          margin-top: 1.25rem;
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--accent-hover);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .error {
          margin-top: 1rem;
          color: #b91c1c;
          font-size: 0.9rem;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
          gap: 1rem;
          margin: 1.25rem 0 0;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .stats dt {
          font-size: 0.75rem;
          color: var(--muted);
          margin: 0;
        }
        .stats dd {
          margin: 0.15rem 0 0;
          font-weight: 600;
        }
        .highlight {
          color: var(--accent);
        }
        .download-wrap {
          margin: 1.25rem 0 0;
          text-align: center;
        }
        .download {
          display: inline-block;
          font-weight: 600;
        }
        .hint {
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: var(--muted);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
