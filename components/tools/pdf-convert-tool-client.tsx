"use client";

import { jsPDF } from "jspdf";
import { useCallback, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { ResultSummary } from "@/components/tools/result-summary";
import { loadImageFromFile } from "@/lib/image/browser";
import { validatePdfBatch } from "@/lib/validate-upload";

export function PdfConvertToolClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const resetOutput = useCallback(() => {
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResultSize(null);
    setError(null);
  }, []);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const list = input.files;
    if (!list?.length) return;
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!files.length) {
      setError("이미지 파일만 선택해 주세요.");
      return;
    }

    const batchErr = validatePdfBatch(files);
    if (batchErr) {
      setError(batchErr);
      input.value = "";
      return;
    }

    setLoading(true);
    setError(null);
    resetOutput();
    setOriginalSize(files.reduce((s, f) => s + f.size, 0));

    try {
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < files.length; i++) {
        const img = await loadImageFromFile(files[i]);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 오류");
        ctx.drawImage(img, 0, 0);
        const data = canvas.toDataURL("image/jpeg", 0.92);

        const ratio = Math.min(pageW / img.naturalWidth, pageH / img.naturalHeight);
        const dw = img.naturalWidth * ratio;
        const dh = img.naturalHeight * ratio;
        const x = (pageW - dw) / 2;
        const y = (pageH - dh) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(data, "JPEG", x, y, dw, dh);
      }

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setResultSize(blob.size);
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} 다른 브라우저 탭을 닫거나 파일 수·용량을 줄인 뒤 다시 시도해 주세요.`
          : "PDF 생성에 실패했습니다. 네트워크가 아닌 로컬 처리이므로, 브라우저를 최신으로 유지해 주세요.",
      );
    } finally {
      setLoading(false);
      input.value = "";
    }
  };

  return (
    <section className="tool-ui" aria-label="이미지 PDF 변환">
      <BrowserNotice />
      <div className="tool-card-wrap">
        <label className="lbl" htmlFor="pdf-files">
          이미지 선택 (여러 장 가능)
        </label>
        <input
          id="pdf-files"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="file-in"
          onChange={(e) => void onPick(e)}
          disabled={loading}
          aria-label="PDF에 넣을 이미지 파일 선택"
        />
        <p className="hint">
          선택 순서대로 한 PDF에 페이지로 넣습니다. A4 용지에 맞게 비율을 유지합니다. 파일을 고르면
          바로 생성됩니다.
        </p>
        <ResultSummary
          originalBytes={originalSize}
          resultBytes={resultSize}
          loading={loading}
          error={error}
          downloadUrl={downloadUrl}
          downloadName="images.pdf"
          downloadLabel="PDF 다운로드"
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
        .lbl {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.45rem;
        }
        .file-in {
          width: 100%;
          font-size: 1rem;
          min-height: 48px;
        }
        .hint {
          margin: 0.65rem 0 0;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.55;
        }
      `}</style>
    </section>
  );
}
