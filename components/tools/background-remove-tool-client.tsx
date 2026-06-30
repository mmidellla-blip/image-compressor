"use client";

import { useCallback, useRef, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { formatBytes } from "@/lib/format-bytes";
import { validateSingleImageFile } from "@/lib/validate-upload";

type Phase = "idle" | "loading-model" | "processing" | "done" | "error";
type Mode = "brush" | "rect";
type Rect = { x: number; y: number; w: number; h: number };

export function BackgroundRemoveToolClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const origCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("brush");
  const [brushSize, setBrushSize] = useState(30); // display-pixel diameter

  // brush state
  const isPainting = useRef(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // rect state
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [dragRect, setDragRect] = useState<Rect | null>(null);

  // ── coord helpers ─────────────────────────────────────────────────────────
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

  function displayToCanvas(dx: number, dy: number) {
    const c = canvasRef.current!;
    const br = c.getBoundingClientRect();
    return {
      cx: Math.round(dx * (c.width / br.width)),
      cy: Math.round(dy * (c.height / br.height)),
    };
  }

  // ── brush paint ───────────────────────────────────────────────────────────
  function paintBrush(displayX: number, displayY: number) {
    const canvas = canvasRef.current;
    const orig = origCanvasRef.current;
    if (!canvas || !orig) return;
    const br = canvas.getBoundingClientRect();
    const scaleX = canvas.width / br.width;
    const scaleY = canvas.height / br.height;
    const cx = Math.round(displayX * scaleX);
    const cy = Math.round(displayY * scaleY);
    const r = Math.max(1, Math.round((brushSize / 2) * scaleX));
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(orig, 0, 0);
    ctx.restore();
  }

  // ── rect restore ──────────────────────────────────────────────────────────
  function commitRestore(endX: number, endY: number) {
    if (!dragStart.current || !canvasRef.current || !origCanvasRef.current) return;
    const { x: sx, y: sy } = dragStart.current;
    if (Math.abs(endX - sx) < 4 || Math.abs(endY - sy) < 4) {
      dragStart.current = null; setDragRect(null); return;
    }
    const { cx: x1, cy: y1 } = displayToCanvas(Math.min(sx, endX), Math.min(sy, endY));
    const { cx: x2, cy: y2 } = displayToCanvas(Math.max(sx, endX), Math.max(sy, endY));
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.drawImage(origCanvasRef.current, x1, y1, x2 - x1, y2 - y1, x1, y1, x2 - x1, y2 - y1);
    dragStart.current = null; setDragRect(null);
  }

  // ── mouse handlers ────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (phase !== "done") return;
    e.preventDefault();
    const { x, y } = clientToDisplay(e);
    if (mode === "brush") {
      isPainting.current = true;
      paintBrush(x, y);
    } else {
      dragStart.current = { x, y };
      setDragRect({ x, y, w: 0, h: 0 });
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (phase !== "done") return;
    const { x, y } = clientToDisplay(e);
    setCursorPos({ x, y });
    if (mode === "brush") {
      if (isPainting.current) paintBrush(x, y);
    } else {
      if (!dragStart.current) return;
      const { x: sx, y: sy } = dragStart.current;
      setDragRect({ x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) });
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (mode === "brush") {
      isPainting.current = false;
    } else {
      const { x, y } = clientToDisplay(e);
      commitRestore(x, y);
    }
  };

  const onMouseLeave = () => {
    isPainting.current = false;
    setCursorPos(null);
    if (mode === "rect") { dragStart.current = null; setDragRect(null); }
  };

  // ── touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (phase !== "done") return;
    e.preventDefault();
    const { x, y } = clientToDisplay(e.touches[0] as unknown as React.Touch);
    if (mode === "brush") {
      isPainting.current = true;
      paintBrush(x, y);
    } else {
      dragStart.current = { x, y };
      setDragRect({ x, y, w: 0, h: 0 });
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (phase !== "done") return;
    e.preventDefault();
    const { x, y } = clientToDisplay(e.touches[0] as unknown as React.Touch);
    if (mode === "brush") {
      paintBrush(x, y);
    } else {
      if (!dragStart.current) return;
      const { x: sx, y: sy } = dragStart.current;
      setDragRect({ x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) });
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    isPainting.current = false;
    if (mode === "rect") {
      const { x, y } = clientToDisplay(e.changedTouches[0] as unknown as React.Touch);
      commitRestore(x, y);
    }
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

      const origUrl = URL.createObjectURL(file);
      const origImg = await loadImg(origUrl);
      URL.revokeObjectURL(origUrl);

      const offscreen = document.createElement("canvas");
      offscreen.width = origImg.naturalWidth;
      offscreen.height = origImg.naturalHeight;
      offscreen.getContext("2d")!.drawImage(origImg, 0, 0);
      origCanvasRef.current = offscreen;

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
                  <div className="progress-bar-fill" style={{ width: `${phase === "loading-model" ? 5 : progress}%` }} />
                </div>
                <p className="progress-hint">처음 실행 시 AI 모델을 다운로드해요 (약 30MB). 이후엔 빠르게 처리됩니다.</p>
              </div>
            )}
          </>
        )}

        <div className={`canvas-section${phase === "done" ? "" : " hidden"}`}>
          {/* mode + brush size controls */}
          <div className="controls-row">
            <div className="mode-tabs">
              <button
                type="button"
                className={`mode-tab${mode === "brush" ? " active" : ""}`}
                onClick={() => setMode("brush")}
              >
                붓
              </button>
              <button
                type="button"
                className={`mode-tab${mode === "rect" ? " active" : ""}`}
                onClick={() => setMode("rect")}
              >
                사각형
              </button>
            </div>

            {mode === "brush" && (
              <div className="brush-size-row">
                <span className="brush-label">크기</span>
                <input
                  type="range" min={4} max={80} step={2} value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="brush-slider"
                />
                <span className="brush-val">{brushSize}px</span>
              </div>
            )}
          </div>

          <p className="hint">
            {mode === "brush"
              ? "붓으로 드래그해서 원본 영역을 복원하세요."
              : "드래그해서 복원할 사각형 영역을 선택하세요."}
          </p>

          <div
            className={`canvas-wrap${mode === "brush" ? " brush-cursor-none" : ""}`}
          >
            <canvas
              ref={canvasRef}
              className="result-canvas"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />

            {/* brush cursor circle */}
            {mode === "brush" && cursorPos && (
              <div
                className="brush-cursor-ring"
                style={{
                  left: cursorPos.x - brushSize / 2,
                  top: cursorPos.y - brushSize / 2,
                  width: brushSize,
                  height: brushSize,
                }}
              />
            )}

            {/* rect selection overlay */}
            {mode === "rect" && dragRect && dragRect.w > 0 && dragRect.h > 0 && (
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

        .controls-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.85rem;
          flex-wrap: wrap;
        }
        .mode-tabs {
          display: flex;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .mode-tab {
          padding: 0.35rem 0.85rem;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--muted);
        }
        .mode-tab.active {
          background: #4f46e5;
          color: #fff;
        }
        .brush-size-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }
        .brush-label { font-size: 0.82rem; font-weight: 600; white-space: nowrap; }
        .brush-slider { flex: 1; accent-color: #4f46e5; }
        .brush-val { font-size: 0.82rem; font-weight: 700; color: #4f46e5; white-space: nowrap; }

        .hint { font-size: 0.83rem; color: var(--muted); margin: 0.5rem 0 0.4rem; line-height: 1.5; }

        .canvas-wrap {
          position: relative;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          cursor: crosshair;
          line-height: 0;
          touch-action: none;
          background-image:
            linear-gradient(45deg, #d1d5db 25%, transparent 25%),
            linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #d1d5db 75%),
            linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0;
          background-color: #fff;
        }
        .canvas-wrap.brush-cursor-none { cursor: none; }

        .result-canvas {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
          -webkit-user-select: none;
        }

        .brush-cursor-ring {
          position: absolute;
          pointer-events: none;
          border: 2px solid #4f46e5;
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.7);
          box-sizing: border-box;
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
