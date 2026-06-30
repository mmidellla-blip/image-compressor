"use client";

import { useCallback, useRef, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { formatBytes } from "@/lib/format-bytes";
import { validateSingleImageFile } from "@/lib/validate-upload";

type Phase = "idle" | "loading-model" | "processing" | "done" | "error";
type Rect = { x: number; y: number; w: number; h: number };

export function BackgroundRemoveToolClient() {
  // result canvas (visible, editable)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // offscreen canvas holding original pixels for restore
  const origCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [dragRect, setDragRect] = useState<Rect | null>(null);

  // ── coord helpers ─────────────────────────────────────────────────────────
  function displayToCanvas(dx: number, dy: number) {
    const c = canvasRef.current!;
    const br = c.getBoundingClientRect();
    return {
      cx: Math.round(dx * (c.width / br.width)),
      cy: Math.round(dy * (c.height / br.height)),
    };
  }

  function clientToDisplay(e: React.MouseEvent | React.Touch) {
    const c = canvasRef.current!;
    const br = c.getBoundingClientRect();
    const clientX = "clientX" in e ? e.clientX : (e as React.Touch).clientX;
    const clientY = "clientY" in e ? e.clientY : (e as React.Touch).clientY;
    return {
      x: Math.max(0, Math.min(clientX - br.left, br.width)),
      y: Math.max(0, Math.min(clientY - br.top, br.height)),
    };
  }

  // ── restore drag ──────────────────────────────────────────────────────────
  function commitRestore(endX: number, endY: number) {
    if (!dragStart.current || !canvasRef.current || !origCanvasRef.current) return;
    const { x: sx, y: sy } = dragStart.current;
    if (Math.abs(endX - sx) < 4 || Math.abs(endY - sy) < 4) {
      dragStart.current = null;
      setDragRect(null);
      return;
    }
    const { cx: x1, cy: y1 } = displayToCanvas(Math.min(sx, endX), Math.min(sy, endY));
    const { cx: x2, cy: y2 } = displayToCanvas(Math.max(sx, endX), Math.max(sy, endY));
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.drawImage(origCanvasRef.current, x1, y1, x2 - x1, y2 - y1, x1, y1, x2 - x1, y2 - y1);
    dragStart.current = null;
    setDragRect(null);
  }

  // ── mouse handlers ────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (phase !== "done") return;
    e.preventDefault();
    const { x, y } = clientToDisplay(e);
    dragStart.current = { x, y };
    setDragRect({ x, y, w: 0, h: 0 });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current) return;
    const { x, y } = clientToDisplay(e);
    const { x: sx, y: sy } = dragStart.current;
    setDragRect({ x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) });
  };
  const onMouseUp = (e: React.MouseEvent) => commitRestore(...Object.values(clientToDisplay(e)) as [number, number]);

  // ── touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (phase !== "done") return;
    e.preventDefault();
    const { x, y } = clientToDisplay(e.touches[0] as unknown as React.Touch);
    dragStart.current = { x, y };
    setDragRect({ x, y, w: 0, h: 0 });
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragStart.current) return;
    e.preventDefault();
    const { x, y } = clientToDisplay(e.touches[0] as unknown as React.Touch);
    const { x: sx, y: sy } = dragStart.current;
    setDragRect({ x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) });
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const { x, y } = clientToDisplay(e.changedTouches[0] as unknown as React.Touch);
    commitRestore(x, y);
  };

  // ── file pick ─────────────────────────────────────────────────────────────
  const onPick = useCallback(async (f: File | null) => {
    if (!f) return;
    const err = validateSingleImageFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setOriginalSize(f.size);
    setError(null);
    setPhase("idle");
    setProgress(0);
    origCanvasRef.current = null;
  }, []);

  // ── run AI ────────────────────────────────────────────────────────────────
  const run = useCallback(async () => {
    if (!file) return;
    setPhase("loading-model");
    setProgress(0);
    setError(null);

    try {
      const { removeBackground } = await import("@imgly/background-removal");
      setPhase("processing");

      const resultBlob = await removeBackground(file, {
        progress: (_key: string, cur: number, total: number) => {
          if (total > 0) setProgress(Math.round((cur / total) * 100));
        },
        output: { format: "image/png" as const, quality: 1 },
      });

      // build offscreen canvas with original pixels
      const origUrl = URL.createObjectURL(file);
      const origImg = await loadImg(origUrl);
      URL.revokeObjectURL(origUrl);

      const offscreen = document.createElement("canvas");
      offscreen.width = origImg.naturalWidth;
      offscreen.height = origImg.naturalHeight;
      offscreen.getContext("2d")!.drawImage(origImg, 0, 0);
      origCanvasRef.current = offscreen;

      // draw AI result onto visible canvas
      const resultUrl = URL.createObjectURL(resultBlob);
      const resultImg = await loadImg(resultUrl);
      URL.revokeObjectURL(resultUrl);

      const canvas = canvasRef.current!;
      canvas.width = origImg.naturalWidth;
      canvas.height = origImg.naturalHeight;
      canvas.getContext("2d")!.drawImage(resultImg, 0, 0);

      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "배경 제거에 실패했습니다.");
      setPhase("error");
    }
  }, [file]);

  // ── save ──────────────────────────────────────────────────────────────────
  const save = async () => {
    if (!canvasRef.current || !file) return;
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvasRef.current!.toBlob((b) => (b ? resolve(b) : reject()), "image/png")
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^.]+$/, "") || "image"}-no-bg.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ── reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setFile(null);
    setOriginalSize(null);
    setPhase("idle");
    setProgress(0);
    setError(null);
    origCanvasRef.current = null;
  }, []);

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
              {originalSize != null && <span className="file-size">{formatBytes(originalSize)}</span>}
            </div>

            {error && <p className="err-msg" role="alert">{error}</p>}

            {(phase === "idle" || phase === "error") && (
              <button type="button" className="btn-run" onClick={() => void run()}>
                배경 제거 시작
              </button>
            )}

            {isRunning && (
              <div className="progress-wrap">
                <div className="progress-label">
                  {phase === "loading-model" ? "AI 모델 로딩 중…" : `배경 분석 중… ${progress}%`}
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${phase === "loading-model" ? 5 : progress}%` }}
                  />
                </div>
                <p className="progress-hint">
                  처음 실행 시 AI 모델을 다운로드해요 (약 30MB). 이후엔 빠르게 처리됩니다.
                </p>
              </div>
            )}
          </>
        )}

        {/* canvas is always mounted so canvasRef is available during run() */}
        <div className={`canvas-section${phase === "done" ? "" : " hidden"}`}>
          <p className="hint">
            드래그해서 원본을 되살리고 싶은 영역을 선택하세요. 여러 번 반복할 수 있어요.
          </p>
          <div className="canvas-wrap">
            <canvas
              ref={canvasRef}
              className="result-canvas"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
            {dragRect && dragRect.w > 0 && dragRect.h > 0 && (
              <div
                className="drag-sel"
                style={{ left: dragRect.x, top: dragRect.y, width: dragRect.w, height: dragRect.h }}
              />
            )}
          </div>

          <div className="btn-row">
            <button type="button" className="btn-reset" onClick={reset}>
              다른 이미지
            </button>
            <button type="button" className="btn-save" onClick={() => void save()}>
              PNG 다운로드
            </button>
          </div>
        </div>
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 70%;
        }
        .file-size { font-size: 0.82rem; color: var(--muted); }
        .err-msg { color: #b91c1c; font-size: 0.85rem; margin: 0.5rem 0 0; }
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
        .progress-wrap { margin-top: 0.85rem; }
        .progress-label { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; }
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
        .progress-hint { font-size: 0.78rem; color: var(--muted); margin: 0.45rem 0 0; line-height: 1.5; }
        .canvas-section.hidden { display: none; }
        .hint { font-size: 0.83rem; color: var(--muted); margin: 0.65rem 0 0.5rem; line-height: 1.5; }
        .canvas-wrap {
          position: relative;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          cursor: crosshair;
          line-height: 0;
          touch-action: none;
          /* checkerboard to show transparency */
          background-image:
            linear-gradient(45deg, #d1d5db 25%, transparent 25%),
            linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #d1d5db 75%),
            linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0;
          background-color: #fff;
        }
        .result-canvas {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
          -webkit-user-select: none;
        }
        .drag-sel {
          position: absolute;
          pointer-events: none;
          border: 2px dashed #6366f1;
          background: rgba(99, 102, 241, 0.15);
          box-sizing: border-box;
        }
        .btn-row { display: flex; gap: 0.65rem; margin-top: 0.85rem; }
        .btn-reset {
          flex: 1;
          min-height: 48px;
          font-size: 0.9rem;
          font-weight: 600;
          background: white;
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          color: var(--fg);
        }
        .btn-save {
          flex: 2;
          min-height: 48px;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .btn-save:hover { filter: brightness(1.07); }
      `}</style>
    </section>
  );
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
