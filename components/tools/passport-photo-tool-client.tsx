"use client";

import imageCompression from "browser-image-compression";
import { useCallback, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ResultSummary } from "@/components/tools/result-summary";
import { cropCenterToAspect } from "@/lib/image/crop";
import { canvasToBlob, loadImageFromFile } from "@/lib/image/browser";
import { validateSingleImageFile } from "@/lib/validate-upload";

/** 여권 사진에 흔히 쓰이는 픽셀 규격(대략 35×45mm @300dpi) */
const OUT_W = 413;
const OUT_H = 531;

export function PassportPhotoToolClient() {
  const [targetKb, setTargetKb] = useState(200);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("passport.jpg");

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
      setError("이미지를 선택해 주세요.");
      return;
    }
    const v = validateSingleImageFile(file);
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setError(null);
    resetOutput();
    setOriginalSize(file.size);

    try {
      const img = await loadImageFromFile(file);
      const cropped = cropCenterToAspect(img, 7, 9);
      const sized = document.createElement("canvas");
      sized.width = OUT_W;
      sized.height = OUT_H;
      const sctx = sized.getContext("2d");
      if (!sctx) throw new Error("처리 초기화에 실패했습니다.");
      sctx.drawImage(cropped, 0, 0, OUT_W, OUT_H);

      const jpegBlob = await canvasToBlob(sized, "image/jpeg", 0.92);
      const jpegFile = new File([jpegBlob], "tmp.jpg", { type: "image/jpeg" });

      const maxMb = Math.max(targetKb / 1024, 0.02);
      let best = await imageCompression(jpegFile, {
        maxSizeMB: maxMb,
        maxWidthOrHeight: Math.max(OUT_W, OUT_H),
        useWebWorker: true,
        initialQuality: 0.88,
        fileType: "image/jpeg",
      });

      if (best.size > targetKb * 1024) {
        best = await imageCompression(jpegFile, {
          maxSizeMB: maxMb * 0.85,
          useWebWorker: true,
          initialQuality: 0.72,
          fileType: "image/jpeg",
        });
      }

      const url = URL.createObjectURL(best);
      setDownloadUrl(url);
      setResultSize(best.size);
      const base = file.name.replace(/\.[^.]+$/, "") || "passport";
      setDownloadName(`${base}-passport.jpg`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tool-ui" aria-label="증명사진 용량 줄이기">
      <BrowserNotice />
      <div className="tool-card-wrap">
        <FileDropzone
          id="passport-file"
          accept="image/*"
          onFile={(f) => void run(f)}
          disabled={loading}
        />
        <label className="kb-label" htmlFor="kb-max">
          목표 최대 용량: 약 {targetKb} KB 이하로 맞추기 시도
        </label>
        <input
          id="kb-max"
          type="range"
          min={80}
          max={800}
          step={10}
          value={targetKb}
          onChange={(e) => setTargetKb(Number(e.target.value))}
          className="kb-range"
        />
        <p className="hint">
          중앙 기준 7:9 비율로 자른 뒤 {OUT_W}×{OUT_H}px 근처로 맞추고 JPEG로 압축합니다. 기관별
          규격은 반드시 확인하세요.
        </p>
        <ResultSummary
          originalBytes={originalSize}
          resultBytes={resultSize}
          loading={loading}
          error={error}
          downloadUrl={downloadUrl}
          downloadName={downloadName}
          downloadLabel="JPEG 다운로드"
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
        .kb-label {
          display: block;
          margin-top: 0.85rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .kb-range {
          width: 100%;
          margin-top: 0.35rem;
        }
        .hint {
          margin: 0.65rem 0 0;
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.55;
        }
      `}</style>
    </section>
  );
}
