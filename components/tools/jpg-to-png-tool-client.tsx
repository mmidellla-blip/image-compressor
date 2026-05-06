"use client";

import { useCallback, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ResultSummary } from "@/components/tools/result-summary";
import { canvasToBlob, loadImageFromFile } from "@/lib/image/browser";
import { validateSingleImageFile } from "@/lib/validate-upload";

export function JpgToPngToolClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("converted.png");

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
      setError("JPEG 파일을 선택해 주세요.");
      return;
    }
    const sizeErr = validateSingleImageFile(file);
    if (sizeErr) {
      setError(sizeErr);
      return;
    }
    if (!/image\/jpe?g/i.test(file.type)) {
      setError("JPG·JPEG 이미지를 선택해 주세요.");
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
      const blob = await canvasToBlob(canvas, "image/png");
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setResultSize(blob.size);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setDownloadName(`${base}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "변환에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tool-ui" aria-label="JPG PNG 변환">
      <BrowserNotice />
      <div className="tool-card-wrap">
        <FileDropzone
          id="jpg-file"
          accept="image/jpeg"
          onFile={(f) => void run(f)}
          disabled={loading}
        />
        <p className="hint">파일을 고르면 바로 PNG로 변환합니다.</p>
        <ResultSummary
          originalBytes={originalSize}
          resultBytes={resultSize}
          loading={loading}
          error={error}
          downloadUrl={downloadUrl}
          downloadName={downloadName}
          downloadLabel="PNG 다운로드"
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
        .hint {
          margin: 0;
          font-size: 0.85rem;
          color: var(--muted);
        }
      `}</style>
    </section>
  );
}
