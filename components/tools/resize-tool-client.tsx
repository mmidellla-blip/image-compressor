"use client";

import { useCallback, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ResultSummary } from "@/components/tools/result-summary";
import { canvasToBlob, loadImageFromFile, stretchImageToCanvas } from "@/lib/image/browser";
import { validateSingleImageFile } from "@/lib/validate-upload";

export function ResizeToolClient() {
  const [file, setFile] = useState<File | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("resized.png");

  const resetOutput = useCallback(() => {
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResultSize(null);
    setError(null);
  }, []);

  const onPick = async (f: File | null) => {
    if (!f) return;
    const err = validateSingleImageFile(f);
    if (err) {
      setError(err);
      return;
    }
    setFile(f);
    resetOutput();
    setOriginalSize(f.size);
    try {
      const img = await loadImageFromFile(f);
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    } catch {
      setError("이미지를 읽을 수 없습니다.");
    }
  };

  const applyWidthFromInput = (wStr: string) => {
    setWidth(wStr);
    if (!lockRatio || !naturalW || !naturalH) return;
    const w = Number.parseInt(wStr, 10);
    if (!Number.isFinite(w) || w <= 0) return;
    const h = Math.round((w * naturalH) / naturalW);
    setHeight(String(h));
  };

  const applyHeightFromInput = (hStr: string) => {
    setHeight(hStr);
    if (!lockRatio || !naturalW || !naturalH) return;
    const h = Number.parseInt(hStr, 10);
    if (!Number.isFinite(h) || h <= 0) return;
    const w = Math.round((h * naturalW) / naturalH);
    setWidth(String(w));
  };

  const run = async () => {
    if (!file) {
      setError("파일을 선택해 주세요.");
      return;
    }
    const tw = Number.parseInt(width, 10);
    const th = Number.parseInt(height, 10);
    if (!Number.isFinite(tw) || !Number.isFinite(th) || tw < 1 || th < 1) {
      setError("가로·세로에 1 이상의 숫자를 입력해 주세요.");
      return;
    }
    if (tw > 16000 || th > 16000) {
      setError("너무 큰 크기입니다. 16000픽셀 이하로 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    resetOutput();
    setOriginalSize(file.size);

    try {
      const img = await loadImageFromFile(file);
      const canvas = stretchImageToCanvas(img, tw, th);
      const blob = await canvasToBlob(canvas, "image/png");
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setResultSize(blob.size);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setDownloadName(`${base}-resized.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "리사이즈에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tool-ui" aria-label="이미지 크기 조절">
      <BrowserNotice />
      <div className="tool-card-wrap">
        <FileDropzone
          id="resize-file"
          accept="image/*"
          onFile={(f) => void onPick(f)}
          disabled={loading}
        />

        <div className="dim-grid">
          <label className="dim-label">
            가로(px)
            <input
              className="dim-input"
              type="number"
              min={1}
              value={width}
              onChange={(e) => applyWidthFromInput(e.target.value)}
            />
          </label>
          <label className="dim-label">
            세로(px)
            <input
              className="dim-input"
              type="number"
              min={1}
              value={height}
              onChange={(e) => applyHeightFromInput(e.target.value)}
            />
          </label>
        </div>

        <label className="chk">
          <input
            type="checkbox"
            checked={lockRatio}
            onChange={(e) => setLockRatio(e.target.checked)}
          />{" "}
          비율 유지 (가로 또는 세로를 바꾸면 다른 쪽이 자동 계산)
        </label>

        <button type="button" className="tool-run-btn" onClick={() => void run()} disabled={loading || !file}>
          {loading ? "처리 중…" : "크기 적용 · PNG 저장"}
        </button>

        <ResultSummary
          originalBytes={originalSize}
          resultBytes={resultSize}
          loading={loading}
          error={error}
          downloadUrl={downloadUrl}
          downloadName={downloadName}
          downloadLabel="결과 다운로드"
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
        .dim-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        .dim-label {
          display: flex;
          flex-direction: column;
          font-size: 0.82rem;
          font-weight: 600;
          gap: 0.35rem;
        }
        .dim-input {
          padding: 0.55rem 0.65rem;
          font-size: 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          min-height: 48px;
        }
        .chk {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          margin-top: 0.85rem;
          font-size: 0.85rem;
          line-height: 1.45;
          cursor: pointer;
        }
        .tool-run-btn {
          margin-top: 1rem;
          width: 100%;
          min-height: 52px;
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }
        .tool-run-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
