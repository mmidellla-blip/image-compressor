"use client";

import imageCompression from "browser-image-compression";
import { useCallback, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ResultSummary } from "@/components/tools/result-summary";
import { validateSingleImageFile } from "@/lib/validate-upload";

export function CompressToolClient() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("compressed.jpg");

  const resetOutput = useCallback(() => {
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResultSize(null);
    setError(null);
  }, []);

  const onPick = (f: File | null) => {
    if (!f) return;
    const invalid = validateSingleImageFile(f);
    if (invalid) {
      setError(invalid);
      setFile(null);
      return;
    }
    setFile(f);
    resetOutput();
    setOriginalSize(f.size);
  };

  const run = async () => {
    if (!file) {
      setError("파일을 먼저 선택해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    resetOutput();
    setOriginalSize(file.size);

    try {
      const outputType = format === "webp" ? "image/webp" : "image/jpeg";
      const compressed = await imageCompression(file, {
        maxSizeMB: 32,
        maxWidthOrHeight: 8192,
        useWebWorker: true,
        initialQuality: 0.82,
        fileType: outputType,
      });

      const url = URL.createObjectURL(compressed);
      setDownloadUrl(url);
      setResultSize(compressed.size);
      const ext = format === "webp" ? "webp" : "jpg";
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setDownloadName(`${base}-compressed.${ext}`);
    } catch {
      setError(
        format === "webp"
          ? "처리 중 문제가 발생했습니다. 브라우저가 WebP 인코딩을 지원하는지 확인하거나 JPEG를 선택해 주세요. 원본 파일을 보관한 뒤 다시 시도해 주세요."
          : "처리 중 문제가 발생했습니다. 파일을 다시 선택하거나 다른 브라우저에서 시도해 주세요. 원본 파일을 보관한 뒤 다시 시도해 주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tool-ui" aria-label="이미지 압축 도구">
      <BrowserNotice />
      <div className="tool-card-wrap">
        <FileDropzone
          id="compress-file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/*"
          onFile={onPick}
          disabled={loading}
        />

        <fieldset className="fmt-fs">
          <legend className="fmt-legend">출력 형식</legend>
          <div className="fmt-row">
            <label className="fmt-label">
              <input
                type="radio"
                name="outfmt"
                checked={format === "jpeg"}
                onChange={() => setFormat("jpeg")}
              />{" "}
              JPEG
            </label>
            <label className="fmt-label">
              <input
                type="radio"
                name="outfmt"
                checked={format === "webp"}
                onChange={() => setFormat("webp")}
              />{" "}
              WebP
            </label>
          </div>
        </fieldset>

        <button
          type="button"
          className="tool-run-btn"
          onClick={run}
          disabled={loading || !file}
          aria-busy={loading}
        >
          {loading ? "처리 중…" : "용량 줄이기"}
        </button>

        <ResultSummary
          originalBytes={originalSize}
          resultBytes={resultSize}
          loading={loading}
          error={error}
          downloadUrl={downloadUrl}
          downloadName={downloadName}
          downloadLabel="압축 파일 다운로드"
        />

        <p className="tool-formats">
          지원: JPG, PNG, WebP 등 일반 이미지. GIF 애니메이션은 첫 프레임 위주로 처리될 수
          있습니다.
        </p>
      </div>

      <style jsx>{`
        .tool-ui {
          margin-top: 0.5rem;
        }
        .tool-card-wrap {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.15rem 1rem 1.25rem;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
        }
        @media (min-width: 640px) {
          .tool-card-wrap {
            padding: 1.35rem 1.25rem 1.4rem;
          }
        }
        .fmt-fs {
          border: none;
          padding: 0;
          margin: 0.75rem 0 0;
        }
        .fmt-legend {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.45rem;
        }
        .fmt-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .fmt-label {
          font-size: 0.92rem;
          cursor: pointer;
        }
        .tool-run-btn {
          margin-top: 1rem;
          width: 100%;
          min-height: 52px;
          padding: 0.85rem 1rem;
          font-size: 1.08rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgb(5 150 105 / 0.35);
        }
        .tool-run-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .tool-formats {
          margin: 1rem 0 0;
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.55;
        }
      `}</style>
    </section>
  );
}
