"use client";

import { useCallback, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { formatBytes } from "@/lib/format-bytes";
import { validateSingleImageFile } from "@/lib/validate-upload";
import type { CompressOptions } from "@/lib/gif-compress";

const COLOR_PRESETS = [
  { label: "256색", value: 256, desc: "원본 품질" },
  { label: "128색", value: 128, desc: "권장" },
  { label: "64색",  value: 64,  desc: "높은 압축" },
  { label: "32색",  value: 32,  desc: "최대 압축" },
];

const SCALE_PRESETS = [
  { label: "100%", value: 1 },
  { label: "75%",  value: 0.75 },
  { label: "50%",  value: 0.5 },
];

const FRAME_PRESETS = [
  { label: "전체", value: 1 },
  { label: "½",   value: 2 },
  { label: "⅓",   value: 3 },
];

export function GifCompressToolClient() {
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState(128);
  const [scale, setScale] = useState(1);
  const [frameKeep, setFrameKeep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string;
    name: string;
    size: number;
    originalSize: number;
    frames: number;
    width: number;
    height: number;
  } | null>(null);

  const onPick = useCallback((f: File | null) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".gif") && f.type !== "image/gif") {
      setError("GIF 파일만 업로드할 수 있어요.");
      return;
    }
    const err = validateSingleImageFile(f);
    if (err) { setError(err); return; }
    setFile(f);
    setError(null);
    setResult((prev) => { if (prev) URL.revokeObjectURL(prev.url); return null; });
  }, []);

  const run = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult((prev) => { if (prev) URL.revokeObjectURL(prev.url); return null; });

    try {
      const { compressGif } = await import("@/lib/gif-compress");
      const opts: CompressOptions = { colors, scale, frameKeep };
      const res = await compressGif(file, opts, setProgress);

      const url = URL.createObjectURL(res.blob);
      const base = file.name.replace(/\.gif$/i, "");
      setResult({
        url,
        name: `${base}-compressed.gif`,
        size: res.blob.size,
        originalSize: file.size,
        frames: res.frameCount,
        width: res.width,
        height: res.height,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "압축에 실패했습니다.");
    } finally {
      setProcessing(false);
    }
  }, [file, colors, scale, frameKeep]);

  const reduction = result
    ? Math.round((1 - result.size / result.originalSize) * 100)
    : 0;

  return (
    <section className="tool-ui" aria-label="GIF 압축">
      <BrowserNotice />

      <div className="tool-card-wrap">
        <FileDropzone
          id="gif-file"
          accept="image/gif"
          onFile={onPick}
          disabled={processing}
        />

        {file && (
          <>
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatBytes(file.size)}</span>
            </div>

            {/* ── controls ── */}
            <div className="ctrl-group">
              <div className="ctrl-label-row">
                <span className="ctrl-label">색상 수</span>
                <span className="ctrl-sub">줄일수록 용량↓ 품질↓</span>
              </div>
              <div className="preset-row">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`preset-btn${colors === p.value ? " active" : ""}`}
                    onClick={() => setColors(p.value)}
                  >
                    <span className="preset-main">{p.label}</span>
                    <span className="preset-desc">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-group">
              <div className="ctrl-label-row">
                <span className="ctrl-label">해상도</span>
                <span className="ctrl-sub">줄이면 용량 대폭 감소</span>
              </div>
              <div className="preset-row">
                {SCALE_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`preset-btn${scale === p.value ? " active" : ""}`}
                    onClick={() => setScale(p.value)}
                  >
                    <span className="preset-main">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-group">
              <div className="ctrl-label-row">
                <span className="ctrl-label">프레임 유지</span>
                <span className="ctrl-sub">절반으로 줄이면 속도·용량 감소</span>
              </div>
              <div className="preset-row">
                {FRAME_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`preset-btn${frameKeep === p.value ? " active" : ""}`}
                    onClick={() => setFrameKeep(p.value)}
                  >
                    <span className="preset-main">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="err-msg" role="alert">{error}</p>}

            {processing ? (
              <div className="progress-wrap">
                <div className="progress-label">압축 중… {progress}%</div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <p className="progress-hint">프레임 수·해상도가 클수록 조금 걸릴 수 있어요.</p>
              </div>
            ) : (
              <button type="button" className="btn-run" onClick={() => void run()}>
                압축 시작
              </button>
            )}

            {result && (
              <div className="result-box">
                <div className="result-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="압축된 GIF 미리보기" className="preview-gif" />
                </div>
                <div className="result-stats">
                  <div className="stat-row">
                    <span className="stat-label">원본</span>
                    <span className="stat-val">{formatBytes(result.originalSize)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">압축 후</span>
                    <span className="stat-val accent">{formatBytes(result.size)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">절감</span>
                    <span className={`stat-val${reduction > 0 ? " green" : ""}`}>
                      {reduction > 0 ? `−${reduction}%` : `+${Math.abs(reduction)}%`}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">프레임</span>
                    <span className="stat-val">{result.frames}장</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">크기</span>
                    <span className="stat-val">{result.width}×{result.height}</span>
                  </div>
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

        .ctrl-group { margin-top: 0.9rem; }
        .ctrl-label-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }
        .ctrl-label { font-size: 0.85rem; font-weight: 700; }
        .ctrl-sub { font-size: 0.78rem; color: var(--muted); }
        .preset-row { display: flex; gap: 0.45rem; flex-wrap: wrap; }
        .preset-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.35rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: white;
          cursor: pointer;
          min-width: 62px;
          transition: border-color 0.15s;
        }
        .preset-btn.active {
          border-color: #4f46e5;
          background: #f5f3ff;
        }
        .preset-main { font-size: 0.88rem; font-weight: 700; color: var(--fg); }
        .preset-btn.active .preset-main { color: #4f46e5; }
        .preset-desc { font-size: 0.7rem; color: var(--muted); margin-top: 1px; }

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
          transition: width 0.15s ease;
        }
        .progress-hint { font-size: 0.78rem; color: var(--muted); margin: 0.4rem 0 0; }

        .btn-run {
          width: 100%;
          min-height: 48px;
          margin-top: 0.85rem;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .btn-run:hover { filter: brightness(1.07); }

        .result-box {
          margin-top: 0.9rem;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          background: #f0fdf4;
          overflow: hidden;
        }
        .result-preview {
          line-height: 0;
          background: repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 0 0 / 16px 16px;
        }
        .preview-gif {
          display: block;
          width: 100%;
          height: auto;
          max-height: 260px;
          object-fit: contain;
        }
        .result-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.1rem 0.5rem;
          padding: 0.75rem 1rem 0.6rem;
        }
        .stat-row {
          display: flex;
          flex-direction: column;
        }
        .stat-label { font-size: 0.72rem; color: var(--muted); }
        .stat-val { font-size: 0.9rem; font-weight: 700; }
        .stat-val.accent { color: #059669; }
        .stat-val.green { color: #059669; }
        .dl-btn {
          display: block;
          text-align: center;
          margin: 0 1rem 0.85rem;
          padding: 0.6rem 0;
          background: #059669;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 8px;
          text-decoration: none;
        }
        .dl-btn:hover { background: #047857; }
      `}</style>
    </section>
  );
}
