"use client";

import { useCallback, useRef, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { formatBytes } from "@/lib/format-bytes";
import { validateSingleImageFile } from "@/lib/validate-upload";

type Phase = "idle" | "loading-model" | "processing" | "done" | "error";

export function BackgroundRemoveToolClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("no-bg.png");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const resultBlobRef = useRef<Blob | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setOriginalSize(null);
    setResultSize(null);
    setPhase("idle");
    setProgress(0);
    setError(null);
    setPreviewUrl((p) => { if (p) URL.revokeObjectURL(p); return null; });
    setDownloadUrl((p) => { if (p) URL.revokeObjectURL(p); return null; });
    resultBlobRef.current = null;
  }, []);

  const onPick = useCallback(async (f: File | null) => {
    if (!f) return;
    const err = validateSingleImageFile(f);
    if (err) { setError(err); return; }
    reset();
    setFile(f);
    setOriginalSize(f.size);
    setError(null);
  }, [reset]);

  const run = useCallback(async () => {
    if (!file) return;
    setPhase("loading-model");
    setProgress(0);
    setError(null);

    try {
      const { removeBackground } = await import("@imgly/background-removal");

      setPhase("processing");

      const blob = await removeBackground(file, {
        progress: (key: string, cur: number, total: number) => {
          if (total > 0) setProgress(Math.round((cur / total) * 100));
        },
        output: { format: "image/png" as const, quality: 1 },
      });

      resultBlobRef.current = blob;
      const url = URL.createObjectURL(blob);
      setPreviewUrl((p) => { if (p) URL.revokeObjectURL(p); return url; });
      setDownloadUrl((p) => { if (p) URL.revokeObjectURL(p); return URL.createObjectURL(blob); });
      setResultSize(blob.size);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setDownloadName(`${base}-no-bg.png`);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "배경 제거에 실패했습니다.");
      setPhase("error");
    }
  }, [file]);

  const isRunning = phase === "loading-model" || phase === "processing";

  return (
    <section className="tool-ui" aria-label="이미지 배경 제거">
      <BrowserNotice />

      <div className="tool-card-wrap">
        <FileDropzone
          id="bg-remove-file"
          accept="image/*"
          onFile={(f) => void onPick(f)}
          disabled={isRunning}
        />

        {file && (
          <>
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              {originalSize != null && (
                <span className="file-size">{formatBytes(originalSize)}</span>
              )}
            </div>

            {error && <p className="err-msg" role="alert">{error}</p>}

            {phase === "idle" || phase === "error" ? (
              <button
                type="button"
                className="btn-run"
                onClick={() => void run()}
              >
                배경 제거 시작
              </button>
            ) : isRunning ? (
              <div className="progress-wrap">
                <div className="progress-label">
                  {phase === "loading-model" ? "AI 모델 로딩 중…" : `배경 분석 중… ${progress}%`}
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${phase === "loading-model" ? 0 : progress}%` }}
                  />
                </div>
                <p className="progress-hint">
                  처음 실행 시 AI 모델을 다운로드해요 (약 30MB). 이후엔 빠르게 처리됩니다.
                </p>
              </div>
            ) : null}

            {phase === "done" && previewUrl && (
              <>
                <div className="result-wrap">
                  {/* checkerboard via CSS background to show transparency */}
                  <div className="preview-checker">
                    <img src={previewUrl} alt="배경 제거 결과" className="preview-img" />
                  </div>
                  <div className="dl-box">
                    <div className="dl-stats">
                      {originalSize != null && <span>원본 {formatBytes(originalSize)}</span>}
                      {resultSize != null && <span>→ PNG {formatBytes(resultSize)}</span>}
                    </div>
                    <a href={downloadUrl!} download={downloadName} className="dl-btn">
                      PNG 다운로드
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-reset"
                  onClick={reset}
                >
                  다른 이미지 사용
                </button>
              </>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .tool-ui { margin-top: 0.5rem; }
        .tool-card-wrap {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.15rem 1rem 1.25rem;
        }
        .file-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.75rem 0 0;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .file-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--fg);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 70%;
        }
        .file-size {
          font-size: 0.82rem;
          color: var(--muted);
        }
        .err-msg {
          color: #b91c1c;
          font-size: 0.85rem;
          margin: 0.5rem 0 0;
        }
        .btn-run {
          width: 100%;
          min-height: 48px;
          margin-top: 0.85rem;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .btn-run:hover { filter: brightness(1.07); }
        .progress-wrap {
          margin-top: 0.85rem;
        }
        .progress-label {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: var(--fg);
        }
        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #4f46e5);
          border-radius: 4px;
          transition: width 0.2s ease;
        }
        .progress-hint {
          font-size: 0.78rem;
          color: var(--muted);
          margin: 0.45rem 0 0;
          line-height: 1.5;
        }
        .result-wrap {
          margin-top: 0.85rem;
        }
        .preview-checker {
          border-radius: 8px;
          overflow: hidden;
          line-height: 0;
          background-image:
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
          background-color: #fff;
        }
        .preview-img {
          display: block;
          width: 100%;
          height: auto;
        }
        .dl-box {
          margin-top: 0.75rem;
          padding: 0.75rem 1rem;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .dl-stats {
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--muted);
          flex-wrap: wrap;
        }
        .dl-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.55rem 1.1rem;
          background: #4f46e5;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
        }
        .dl-btn:hover { background: #4338ca; }
        .btn-reset {
          width: 100%;
          min-height: 44px;
          margin-top: 0.65rem;
          font-size: 0.9rem;
          font-weight: 600;
          background: white;
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          color: var(--fg);
        }
        .btn-reset:hover { background: var(--muted-bg, #f9fafb); }
      `}</style>
    </section>
  );
}
