"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { formatBytes } from "@/lib/format-bytes";
import type { MakeOptions } from "@/lib/gif-make";

const MAX_FILES = 30;

const COLOR_OPTS = [
  { label: "256색", value: 256 },
  { label: "128색", value: 128 },
  { label: "64색",  value: 64 },
];

const SCALE_OPTS = [
  { label: "원본", value: 1 },
  { label: "75%",  value: 0.75 },
  { label: "50%",  value: 0.5 },
];

interface Frame {
  id: number;
  file: File;
  previewUrl: string;
}

let idSeq = 0;

export function GifMakerToolClient() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [delay, setDelay] = useState(200);      // ms per frame
  const [colors, setColors] = useState(128);
  const [scale, setScale] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string; name: string; size: number; width: number; height: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      frames.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── add files ─────────────────────────────────────────────────────────────
  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const accepted: File[] = [];
    for (const f of Array.from(fileList)) {
      if (!f.type.startsWith("image/")) continue;
      accepted.push(f);
    }
    if (accepted.length === 0) { setError("이미지 파일만 추가할 수 있어요."); return; }

    setError(null);
    setResult((prev) => { if (prev) URL.revokeObjectURL(prev.url); return null; });
    setFrames((prev) => {
      const remaining = MAX_FILES - prev.length;
      const toAdd = accepted.slice(0, remaining).map((f) => ({
        id: ++idSeq,
        file: f,
        previewUrl: URL.createObjectURL(f),
      }));
      return [...prev, ...toAdd];
    });
  }, []);

  // ── drag & drop zone ───────────────────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  // ── frame controls ─────────────────────────────────────────────────────────
  const moveFrame = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= frames.length) return;
    setFrames((prev) => {
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const removeFrame = (id: number) => {
    setFrames((prev) => {
      const frame = prev.find((f) => f.id === id);
      if (frame) URL.revokeObjectURL(frame.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    frames.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFrames([]);
    setResult((prev) => { if (prev) URL.revokeObjectURL(prev.url); return null; });
    setError(null);
  };

  // ── make GIF ──────────────────────────────────────────────────────────────
  const make = useCallback(async () => {
    if (frames.length < 2) { setError("이미지를 2장 이상 추가해 주세요."); return; }
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult((prev) => { if (prev) URL.revokeObjectURL(prev.url); return null; });

    try {
      const { makeGif } = await import("@/lib/gif-make");
      const opts: MakeOptions = { delay, colors, scale, loop: 0 };
      const res = await makeGif(frames.map((f) => f.file), opts, setProgress);

      const url = URL.createObjectURL(res.blob);
      setResult({ url, name: "animation.gif", size: res.blob.size, width: res.width, height: res.height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "GIF 생성에 실패했습니다.");
    } finally {
      setProcessing(false);
    }
  }, [frames, delay, colors, scale]);

  const fps = Math.round(1000 / delay);

  return (
    <section className="tool-ui" aria-label="GIF 만들기">
      <BrowserNotice />

      <div className="tool-card-wrap">
        {/* ── drop zone ── */}
        <div
          ref={dropRef}
          className="drop-zone"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="이미지 추가"
        >
          <span className="drop-icon">🖼</span>
          <span className="drop-text">
            이미지를 드래그하거나 <span className="drop-link">클릭해서 추가</span>
          </span>
          <span className="drop-sub">JPG · PNG · WebP · 최대 {MAX_FILES}장</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden-input"
            onChange={(e) => addFiles(e.target.files)}
            onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
          />
        </div>

        {error && <p className="err-msg" role="alert">{error}</p>}

        {frames.length > 0 && (
          <>
            {/* ── frame list ── */}
            <div className="frame-header">
              <span className="frame-count">{frames.length}장 추가됨</span>
              <button type="button" className="btn-clear" onClick={clearAll}>전체 삭제</button>
            </div>

            <div className="frame-list">
              {frames.map((frame, idx) => (
                <div key={frame.id} className="frame-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frame.previewUrl} alt={frame.file.name} className="frame-thumb" />
                  <div className="frame-info">
                    <span className="frame-num">{idx + 1}</span>
                    <span className="frame-name">{frame.file.name}</span>
                    <span className="frame-size">{formatBytes(frame.file.size)}</span>
                  </div>
                  <div className="frame-actions">
                    <button
                      type="button"
                      className="fa-btn"
                      onClick={() => moveFrame(idx, -1)}
                      disabled={idx === 0}
                      aria-label="위로"
                    >↑</button>
                    <button
                      type="button"
                      className="fa-btn"
                      onClick={() => moveFrame(idx, 1)}
                      disabled={idx === frames.length - 1}
                      aria-label="아래로"
                    >↓</button>
                    <button
                      type="button"
                      className="fa-btn del"
                      onClick={() => removeFrame(frame.id)}
                      aria-label="삭제"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── controls ── */}
            <div className="ctrl-section">
              <div className="ctrl-row">
                <label className="ctrl-label">재생 속도</label>
                <div className="ctrl-body">
                  <input
                    type="range"
                    min={50} max={1000} step={50}
                    value={delay}
                    onChange={(e) => setDelay(Number(e.target.value))}
                    className="slider"
                  />
                  <span className="ctrl-val">{delay}ms · {fps}fps</span>
                </div>
              </div>

              <div className="ctrl-row">
                <label className="ctrl-label">색상 수</label>
                <div className="preset-row">
                  {COLOR_OPTS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={`preset-btn${colors === o.value ? " active" : ""}`}
                      onClick={() => setColors(o.value)}
                    >{o.label}</button>
                  ))}
                </div>
              </div>

              <div className="ctrl-row">
                <label className="ctrl-label">해상도</label>
                <div className="preset-row">
                  {SCALE_OPTS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={`preset-btn${scale === o.value ? " active" : ""}`}
                      onClick={() => setScale(o.value)}
                    >{o.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── make button / progress ── */}
            {processing ? (
              <div className="progress-wrap">
                <div className="progress-label">GIF 생성 중… {progress}%</div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <button type="button" className="btn-make" onClick={() => void make()}>
                GIF 만들기
              </button>
            )}

            {/* ── result ── */}
            {result && (
              <div className="result-box">
                <div className="result-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="생성된 GIF 미리보기" className="preview-gif" />
                </div>
                <div className="result-meta">
                  <span>{result.width}×{result.height}</span>
                  <span>{frames.length}프레임</span>
                  <span>{formatBytes(result.size)}</span>
                </div>
                <a href={result.url} download={result.name} className="dl-btn">
                  GIF 다운로드
                </a>
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

        /* drop zone */
        .drop-zone {
          border: 2px dashed var(--border);
          border-radius: 10px;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
          text-align: center;
          transition: border-color 0.15s;
        }
        .drop-zone:hover { border-color: #6366f1; }
        .drop-icon { font-size: 1.8rem; line-height: 1; }
        .drop-text { font-size: 0.9rem; font-weight: 600; }
        .drop-link { color: #4f46e5; text-decoration: underline; }
        .drop-sub { font-size: 0.78rem; color: var(--muted); }
        .hidden-input { display: none; }

        .err-msg { color: #b91c1c; font-size: 0.85rem; margin: 0.5rem 0 0; }

        /* frame list */
        .frame-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.85rem 0 0.4rem;
        }
        .frame-count { font-size: 0.85rem; font-weight: 700; }
        .btn-clear {
          font-size: 0.78rem;
          color: #b91c1c;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .frame-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          max-height: 320px;
          overflow-y: auto;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.4rem;
        }
        .frame-item {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: var(--bg, #fff);
          border-radius: 6px;
          padding: 0.35rem 0.4rem;
        }
        .frame-thumb {
          width: 48px;
          height: 36px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid var(--border);
          flex-shrink: 0;
        }
        .frame-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .frame-num { font-size: 0.7rem; color: var(--muted); font-weight: 700; }
        .frame-name {
          font-size: 0.8rem;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .frame-size { font-size: 0.72rem; color: var(--muted); }
        .frame-actions { display: flex; gap: 0.25rem; flex-shrink: 0; }
        .fa-btn {
          width: 28px;
          height: 28px;
          font-size: 0.8rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fg);
        }
        .fa-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .fa-btn.del { color: #b91c1c; border-color: #fca5a5; }
        .fa-btn.del:hover { background: #fef2f2; }

        /* controls */
        .ctrl-section { margin-top: 0.85rem; display: flex; flex-direction: column; gap: 0.65rem; }
        .ctrl-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
        .ctrl-label { font-size: 0.82rem; font-weight: 700; width: 60px; flex-shrink: 0; }
        .ctrl-body { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; }
        .slider { flex: 1; accent-color: #4f46e5; }
        .ctrl-val { font-size: 0.8rem; font-weight: 700; color: #4f46e5; white-space: nowrap; }
        .preset-row { display: flex; gap: 0.35rem; }
        .preset-btn {
          padding: 0.3rem 0.65rem;
          font-size: 0.83rem;
          font-weight: 600;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: white;
          cursor: pointer;
          color: var(--fg);
        }
        .preset-btn.active { border-color: #4f46e5; background: #f5f3ff; color: #4f46e5; }

        /* progress / make */
        .progress-wrap { margin-top: 0.85rem; }
        .progress-label { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; }
        .progress-bar-bg {
          width: 100%; height: 8px;
          background: var(--border);
          border-radius: 4px; overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #4f46e5);
          border-radius: 4px;
          transition: width 0.15s ease;
        }
        .btn-make {
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
        .btn-make:hover { filter: brightness(1.07); }

        /* result */
        .result-box {
          margin-top: 0.9rem;
          border: 1px solid #c7d2fe;
          border-radius: 10px;
          background: #eef2ff;
          overflow: hidden;
        }
        .result-preview {
          background: repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 0 0 / 16px 16px;
          line-height: 0;
        }
        .preview-gif {
          display: block;
          width: 100%;
          height: auto;
          max-height: 280px;
          object-fit: contain;
        }
        .result-meta {
          display: flex;
          gap: 1rem;
          padding: 0.6rem 1rem 0.4rem;
          font-size: 0.82rem;
          color: var(--muted);
        }
        .dl-btn {
          display: block;
          text-align: center;
          margin: 0 1rem 0.85rem;
          padding: 0.6rem 0;
          background: #4f46e5;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 8px;
          text-decoration: none;
        }
        .dl-btn:hover { background: #4338ca; }
      `}</style>
    </section>
  );
}
