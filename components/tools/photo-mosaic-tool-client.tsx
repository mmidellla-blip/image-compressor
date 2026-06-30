"use client";

import { useCallback, useRef, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { canvasToBlob, loadImageFromFile } from "@/lib/image/browser";
import { formatBytes } from "@/lib/format-bytes";
import { validateSingleImageFile } from "@/lib/validate-upload";

type Rect = { x: number; y: number; w: number; h: number };

function applyPixelate(ctx: CanvasRenderingContext2D, r: Rect, block: number) {
  const ex = r.x + r.w;
  const ey = r.y + r.h;
  for (let bx = r.x; bx < ex; bx += block) {
    for (let by = r.y; by < ey; by += block) {
      const bw = Math.min(block, ex - bx);
      const bh = Math.min(block, ey - by);
      if (bw <= 0 || bh <= 0) continue;
      const data = ctx.getImageData(bx, by, bw, bh).data;
      let red = 0, grn = 0, blu = 0;
      const n = bw * bh;
      for (let i = 0; i < data.length; i += 4) {
        red += data[i]; grn += data[i + 1]; blu += data[i + 2];
      }
      ctx.fillStyle = `rgb(${Math.round(red / n)},${Math.round(grn / n)},${Math.round(blu / n)})`;
      ctx.fillRect(bx, by, bw, bh);
    }
  }
}

export function PhotoMosaicToolClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("mosaic.jpg");
  const [blockSize, setBlockSize] = useState(16);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // drag state (display-pixel coords relative to canvas element)
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [dragRect, setDragRect] = useState<Rect | null>(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  function displayToCanvas(dx: number, dy: number): { cx: number; cy: number } {
    const canvas = canvasRef.current!;
    const br = canvas.getBoundingClientRect();
    return {
      cx: Math.round(dx * (canvas.width / br.width)),
      cy: Math.round(dy * (canvas.height / br.height)),
    };
  }

  function clientToDisplay(e: React.MouseEvent | React.Touch): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const br = canvas.getBoundingClientRect();
    const clientX = "clientX" in e ? e.clientX : (e as React.Touch).clientX;
    const clientY = "clientY" in e ? e.clientY : (e as React.Touch).clientY;
    return {
      x: Math.max(0, Math.min(clientX - br.left, br.width)),
      y: Math.max(0, Math.min(clientY - br.top, br.height)),
    };
  }

  function commitDrag(endX: number, endY: number) {
    if (!dragStart.current || !canvasRef.current) return;
    const { x: sx, y: sy } = dragStart.current;
    const dw = Math.abs(endX - sx);
    const dh = Math.abs(endY - sy);
    if (dw < 4 || dh < 4) { dragStart.current = null; setDragRect(null); return; }

    const { cx: x1, cy: y1 } = displayToCanvas(Math.min(sx, endX), Math.min(sy, endY));
    const { cx: x2, cy: y2 } = displayToCanvas(Math.max(sx, endX), Math.max(sy, endY));
    const canvas = canvasRef.current;
    const br = canvas.getBoundingClientRect();
    const scale = canvas.width / br.width;
    const canvasBlockSize = Math.max(1, Math.round(blockSize * scale));
    const ctx = canvas.getContext("2d")!;
    applyPixelate(ctx, { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }, canvasBlockSize);
    setHasChanges(true);
    dragStart.current = null;
    setDragRect(null);
  }

  // ── file pick ─────────────────────────────────────────────────────────────
  const onPick = useCallback(async (f: File | null) => {
    if (!f) return;
    const err = validateSingleImageFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setError(null);
    setHasChanges(false);
    setDownloadUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setResultSize(null);
    setOriginalSize(f.size);
    try {
      const img = await loadImageFromFile(f);
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
    } catch {
      setError("이미지를 불러올 수 없습니다.");
    }
  }, []);

  // ── mouse handlers ────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (!file) return;
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

  const onMouseUp = (e: React.MouseEvent) => {
    const { x, y } = clientToDisplay(e);
    commitDrag(x, y);
  };

  // ── touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (!file) return;
    e.preventDefault();
    const t = e.touches[0];
    const { x, y } = clientToDisplay(t as unknown as React.Touch);
    dragStart.current = { x, y };
    setDragRect({ x, y, w: 0, h: 0 });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragStart.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const { x, y } = clientToDisplay(t as unknown as React.Touch);
    const { x: sx, y: sy } = dragStart.current;
    setDragRect({ x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    const { x, y } = clientToDisplay(t as unknown as React.Touch);
    commitDrag(x, y);
  };

  // ── reset ─────────────────────────────────────────────────────────────────
  const reset = () => {
    if (!canvasRef.current || !imgRef.current) return;
    canvasRef.current.getContext("2d")!.drawImage(imgRef.current, 0, 0);
    setHasChanges(false);
    setDownloadUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setResultSize(null);
  };

  // ── save ──────────────────────────────────────────────────────────────────
  const save = async () => {
    if (!canvasRef.current || !file) return;
    setSaving(true);
    setError(null);
    try {
      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob = await canvasToBlob(canvasRef.current, mime, mime === "image/jpeg" ? 0.92 : undefined);
      const url = URL.createObjectURL(blob);
      setDownloadUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
      setResultSize(blob.size);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setDownloadName(`${base}-mosaic.${mime === "image/png" ? "png" : "jpg"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="tool-ui" aria-label="사진 모자이크">
      <BrowserNotice />

      <div className="tool-card-wrap">
        <FileDropzone id="mosaic-file" accept="image/*" onFile={(f) => void onPick(f)} disabled={saving} />

        {file && (
          <>
            <div className="block-row">
              <div className="block-label-row">
                <span className="block-label">모자이크 크기</span>
                <span className="block-val">{blockSize}px</span>
              </div>
              <input
                type="range" min={4} max={64} step={2} value={blockSize}
                onChange={(e) => setBlockSize(Number(e.target.value))}
                className="block-slider"
              />
            </div>

            <p className="hint">드래그해서 가리고 싶은 영역을 선택하세요. 여러 번 선택할 수 있어요.</p>

            <div className="canvas-wrap">
              <canvas
                ref={canvasRef}
                className="mosaic-canvas"
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

            {error && <p className="err-msg" role="alert">{error}</p>}

            <div className="btn-row">
              <button type="button" className="btn-reset" onClick={reset} disabled={!hasChanges}>
                되돌리기
              </button>
              <button type="button" className="btn-save" onClick={() => void save()} disabled={saving || !hasChanges}>
                {saving ? "저장 중…" : "저장하기"}
              </button>
            </div>

            {downloadUrl && (
              <div className="dl-box">
                <div className="dl-stats">
                  {originalSize != null && <span>원본 {formatBytes(originalSize)}</span>}
                  {resultSize != null && <span>→ {formatBytes(resultSize)}</span>}
                </div>
                <a href={downloadUrl} download={downloadName} className="dl-btn">다운로드</a>
              </div>
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
        .block-row { margin-top: 0.85rem; }
        .block-label-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }
        .block-label { font-size: 0.85rem; font-weight: 600; }
        .block-val { font-size: 0.85rem; font-weight: 700; color: var(--accent); }
        .block-slider { width: 100%; accent-color: var(--accent); }
        .hint {
          font-size: 0.83rem;
          color: var(--muted);
          margin: 0.65rem 0 0.5rem;
          line-height: 1.5;
        }
        .canvas-wrap {
          position: relative;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          cursor: crosshair;
          line-height: 0;
          touch-action: none;
        }
        .mosaic-canvas {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
          -webkit-user-select: none;
        }
        .drag-sel {
          position: absolute;
          pointer-events: none;
          border: 2px dashed #f59e0b;
          background: rgba(245, 158, 11, 0.18);
          box-sizing: border-box;
        }
        .err-msg {
          color: #b91c1c;
          font-size: 0.85rem;
          margin: 0.5rem 0 0;
        }
        .btn-row {
          display: flex;
          gap: 0.65rem;
          margin-top: 0.85rem;
        }
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
        .btn-reset:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-save {
          flex: 2;
          min-height: 48px;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .btn-save:disabled { opacity: 0.55; cursor: not-allowed; }
        .dl-box {
          margin-top: 0.85rem;
          padding: 0.85rem 1rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
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
          background: var(--accent);
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
        }
        .dl-btn:hover { background: var(--accent-hover); }
      `}</style>
    </section>
  );
}
