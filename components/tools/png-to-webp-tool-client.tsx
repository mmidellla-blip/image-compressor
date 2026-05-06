"use client";

import { useCallback, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ResultSummary } from "@/components/tools/result-summary";
import { canvasToBlob, loadImageFromFile } from "@/lib/image/browser";
import { validateSingleImageFile } from "@/lib/validate-upload";

export function PngToWebpToolClient() {
  const [quality, setQuality] = useState(0.85);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("converted.webp");

  const resetOutput = useCallback(() => {
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResultSize(null);
    setError(null);
  }, []);

  const run = async (file: File | null) => {
    if (!file) {
      setError("PNG 파일을 선택해 주세요.");
      return;
    }
    const sizeErr = validateSingleImageFile(file);
    if (sizeErr) {
      setError(sizeErr);
      return;
    }
    if (file.type !== "image/png") {
      setError("PNG 이미지를 선택해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    resetOutput();
    setOriginalSize(file.size);

    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, "image/webp", quality);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setResultSize(blob.size);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setDownloadName(`${base}.webp`);
    } catch {
      setError(
        "이 브라우저에서 WebP로 내보낼 수 없습니다. Chrome·Edge 최신 버전 등을 이용해 주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tool-ui" aria-label="PNG WebP 변환">
      <BrowserNotice />
      <div className="tool-card-wrap">
        <FileDropzone
          id="png-file"
          accept="image/png"
          onFile={(f) => void run(f)}
          disabled={loading}
        />
        <label className="q-label" htmlFor="webp-q">
          WebP 품질 ({Math.round(quality * 100)}%)
        </label>
        <input
          id="webp-q"
          type="range"
          min={0.5}
          max={1}
          step={0.05}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="q-range"
        />
        <p className="hint">
          파일 선택 시 현재 품질 설정으로 변환합니다. 품질을 바꾼 뒤에는 파일을 다시
          선택해 주세요.
        </p>
        <ResultSummary
          originalBytes={originalSize}
          resultBytes={resultSize}
          loading={loading}
          error={error}
          downloadUrl={downloadUrl}
          downloadName={downloadName}
          downloadLabel="WebP 다운로드"
        />
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
        }
        .q-label {
          display: block;
          margin-top: 0.85rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .q-range {
          width: 100%;
          margin-top: 0.35rem;
        }
        .hint {
          margin: 0.5rem 0 0;
          font-size: 0.85rem;
          color: var(--muted);
        }
      `}</style>
    </section>
  );
}
