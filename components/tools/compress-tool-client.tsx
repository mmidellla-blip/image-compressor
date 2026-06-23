"use client";

import imageCompression from "browser-image-compression";
import { useCallback, useRef, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { validateSingleImageFile } from "@/lib/validate-upload";
import { formatBytes, reductionPercent } from "@/lib/format-bytes";

type FileStatus = "processing" | "done" | "error";

type FileItem = {
  id: string;
  file: File;
  originalUrl: string;
  originalSize: number;
  compressedUrl: string | null;
  compressedSize: number | null;
  downloadName: string;
  status: FileStatus;
  error: string | null;
};

const MODE_OPTIONS = {
  saramin: { quality: 0.86, maxWidthOrHeight: 1200, label: "사람인 제출용" },
  email: { quality: 0.8, maxWidthOrHeight: 1600, label: "이메일 첨부용" },
  kakaotalk: { quality: 0.74, maxWidthOrHeight: 1280, label: "카카오톡 전송용" },
  website: { quality: 0.82, maxWidthOrHeight: 1920, label: "웹사이트 업로드용" },
} as const;

type Mode = keyof typeof MODE_OPTIONS;

let _idSeq = 0;

export function CompressToolClient() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg");
  const [mode, setMode] = useState<Mode>("saramin");
  const [targetKb, setTargetKb] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const compressFile = useCallback(
    async (
      id: string,
      file: File,
      m: Mode,
      fmt: "jpeg" | "webp",
      targetKbVal: number | null,
    ) => {
      const outputType = fmt === "webp" ? "image/webp" : "image/jpeg";
      const opts = MODE_OPTIONS[m];
      const maxSizeMB = targetKbVal && targetKbVal > 0 ? targetKbVal / 1024 : 32;
      const initialQuality = targetKbVal && targetKbVal > 0 ? 0.92 : opts.quality;
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB,
          maxWidthOrHeight: opts.maxWidthOrHeight,
          useWebWorker: true,
          initialQuality,
          fileType: outputType,
        });
        const compressedUrl = URL.createObjectURL(compressed);
        const ext = fmt === "webp" ? "webp" : "jpg";
        const base = file.name.replace(/\.[^.]+$/, "") || "image";
        setItems((prev) =>
          prev.map((x) =>
            x.id === id
              ? {
                  ...x,
                  status: "done",
                  compressedUrl,
                  compressedSize: compressed.size,
                  downloadName: `${base}-compressed.${ext}`,
                }
              : x,
          ),
        );
      } catch {
        const errMsg =
          fmt === "webp"
            ? "처리 중 문제가 발생했습니다. 브라우저가 WebP 인코딩을 지원하는지 확인하거나 JPEG를 선택해 주세요."
            : "처리 중 문제가 발생했습니다. 파일을 다시 선택하거나 다른 브라우저에서 시도해 주세요.";
        setItems((prev) =>
          prev.map((x) => (x.id === id ? { ...x, status: "error", error: errMsg } : x)),
        );
      }
    },
    [],
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const targetKbVal = targetKb ? Number(targetKb) : null;
      const newItems: FileItem[] = [];
      for (const file of files) {
        const id = `f${++_idSeq}`;
        const invalid = validateSingleImageFile(file);
        if (invalid) {
          newItems.push({
            id,
            file,
            originalUrl: "",
            originalSize: file.size,
            compressedUrl: null,
            compressedSize: null,
            downloadName: "",
            status: "error",
            error: invalid,
          });
          continue;
        }
        newItems.push({
          id,
          file,
          originalUrl: URL.createObjectURL(file),
          originalSize: file.size,
          compressedUrl: null,
          compressedSize: null,
          downloadName: "",
          status: "processing",
          error: null,
        });
      }
      setItems((prev) => [...newItems, ...prev]);
      for (const item of newItems) {
        if (item.status === "processing") {
          compressFile(item.id, item.file, mode, format, targetKbVal);
        }
      }
    },
    [mode, format, targetKb, compressFile],
  );

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current++;
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current--;
    if (dragDepth.current === 0) setDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (files.length) addFiles(files);
    },
    [addFiles],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length) addFiles(files);
      e.target.value = "";
    },
    [addFiles],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item?.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item?.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const recompress = useCallback(
    (id: string) => {
      const targetKbVal = targetKb ? Number(targetKb) : null;
      setItems((prev) => {
        const item = prev.find((x) => x.id === id);
        if (!item || item.status === "processing") return prev;
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
        compressFile(id, item.file, mode, format, targetKbVal);
        return prev.map((x) =>
          x.id === id
            ? { ...x, status: "processing", compressedUrl: null, compressedSize: null, error: null }
            : x,
        );
      });
    },
    [mode, format, targetKb, compressFile],
  );

  const clearAll = useCallback(() => {
    setItems((prev) => {
      for (const item of prev) {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      }
      return [];
    });
  }, []);

  const downloadAll = useCallback(() => {
    items
      .filter((x) => x.status === "done" && x.compressedUrl)
      .forEach((item, i) => {
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = item.compressedUrl!;
          a.download = item.downloadName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, i * 250);
      });
  }, [items]);

  const doneCount = items.filter((x) => x.status === "done").length;

  return (
    <section className="tool-ui" aria-label="이미지 압축 도구">
      <BrowserNotice />
      <div className="tool-card-wrap">
        {/* Drop Zone */}
        <div
          className={`drop-zone${dragging ? " dragging" : ""}`}
          onDrop={onDrop}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="이미지 파일을 드래그하거나 클릭하여 선택"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/*"
            multiple
            className="drop-hidden-input"
            onChange={onInputChange}
          />
          <svg
            className="drop-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            <polyline points="16 12 12 8 8 12" />
            <line x1="12" y1="8" x2="12" y2="20" />
          </svg>
          <p className="drop-text">
            {dragging ? "이미지를 여기에 놓으세요" : "이미지를 드래그하거나 클릭하여 선택"}
          </p>
          <p className="drop-hint">JPG · PNG · WebP · GIF · 여러 장 동시 선택 가능</p>
        </div>

        {/* Mode */}
        <fieldset className="fmt-fs">
          <legend className="fmt-legend">추천 모드</legend>
          <div className="mode-row">
            {(Object.keys(MODE_OPTIONS) as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`mode-btn${mode === m ? " on" : ""}`}
                onClick={() => setMode(m)}
              >
                {MODE_OPTIONS[m].label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Format */}
        <fieldset className="fmt-fs">
          <legend className="fmt-legend">출력 형식</legend>
          <div className="fmt-row">
            <label className="fmt-label">
              <input
                type="radio"
                name="outfmt"
                checked={format === "jpeg"}
                onChange={() => setFormat("jpeg")}
              />{" "}
              JPEG
            </label>
            <label className="fmt-label">
              <input
                type="radio"
                name="outfmt"
                checked={format === "webp"}
                onChange={() => setFormat("webp")}
              />{" "}
              WebP
            </label>
          </div>
        </fieldset>

        {/* Target KB */}
        <div className="target-row">
          <label className="target-label" htmlFor="target-kb">
            목표 용량
            <span className="target-badge">선택</span>
          </label>
          <div className="target-input-group">
            <input
              id="target-kb"
              type="number"
              min="10"
              max="51200"
              step="10"
              className="target-input"
              placeholder="예: 200"
              value={targetKb}
              onChange={(e) => setTargetKb(e.target.value)}
            />
            <span className="target-unit">KB 이하</span>
            {targetKb && Number(targetKb) > 0 && (
              <button
                type="button"
                className="target-clear"
                onClick={() => setTargetKb("")}
                aria-label="목표 용량 초기화"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Cards header */}
        {items.length > 0 && (
          <div className="cards-header">
            <span className="cards-count">
              {items.length}개 파일
              {doneCount > 0 && ` · ${doneCount}개 완료`}
            </span>
            <div className="cards-header-btns">
              {doneCount >= 2 && (
                <button type="button" className="dl-all-btn" onClick={downloadAll}>
                  전체 다운로드
                </button>
              )}
              <button type="button" className="clear-btn" onClick={clearAll}>
                전체 삭제
              </button>
            </div>
          </div>
        )}

        {/* File cards */}
        <div className="cards">
          {items.map((item) => {
            const reduction =
              item.originalSize && item.compressedSize !== null
                ? reductionPercent(item.originalSize, item.compressedSize)
                : null;
            const isGain = reduction !== null && reduction <= 0;
            const barRatio =
              item.compressedSize !== null
                ? Math.max(3, Math.round((item.compressedSize / item.originalSize) * 100))
                : 0;

            return (
              <div key={item.id} className={`card${item.status === "done" ? " card-done" : ""}`}>
                <div className="card-header">
                  <span className="card-name" title={item.file.name}>
                    {item.file.name}
                  </span>
                  <button
                    type="button"
                    className="card-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="삭제"
                  >
                    ×
                  </button>
                </div>

                {item.status === "error" && !item.originalUrl ? (
                  <p className="card-error">{item.error}</p>
                ) : (
                  <>
                    {/* Before / After */}
                    <div className="card-previews">
                      <div className="preview-box">
                        <span className="preview-label">원본</span>
                        {item.originalUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.originalUrl} alt="원본 이미지" className="preview-img" />
                        )}
                        <span className="preview-size">{formatBytes(item.originalSize)}</span>
                      </div>

                      <span className="preview-arrow" aria-hidden="true">→</span>

                      <div className="preview-box">
                        <span className="preview-label">압축</span>
                        {item.status === "processing" ? (
                          <div className="preview-loading" aria-label="처리 중">
                            <span className="loading-dots">처리 중</span>
                          </div>
                        ) : item.status === "done" && item.compressedUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.compressedUrl}
                            alt="압축 결과 이미지"
                            className="preview-img"
                          />
                        ) : (
                          <div className="preview-placeholder" />
                        )}
                        {item.compressedSize !== null && (
                          <span className="preview-size">{formatBytes(item.compressedSize)}</span>
                        )}
                      </div>
                    </div>

                    {/* Size bar graph */}
                    {item.status === "done" && item.compressedSize !== null && (
                      <div className="size-bars">
                        <div className="bar-row">
                          <span className="bar-lbl">원본</span>
                          <div className="bar-track">
                            <div className="bar-fill bar-orig" style={{ width: "100%" }} />
                          </div>
                          <span className="bar-val">{formatBytes(item.originalSize)}</span>
                        </div>
                        <div className="bar-row">
                          <span className="bar-lbl">압축</span>
                          <div className="bar-track">
                            <div
                              className={`bar-fill${isGain ? " bar-gain" : " bar-comp"}`}
                              style={{ width: `${barRatio}%` }}
                            />
                          </div>
                          <span className="bar-val">{formatBytes(item.compressedSize)}</span>
                        </div>
                      </div>
                    )}

                    {/* Big reduction number */}
                    {reduction !== null && item.compressedSize !== null && (
                      <div className={`result-hero${isGain ? " result-hero-gain" : ""}`}>
                        <span className="result-pct">
                          {isGain ? `+${Math.abs(reduction)}%` : `-${reduction}%`}
                        </span>
                        <span className="result-label">
                          {isGain ? "원본이 더 작음" : "용량 감소"}
                        </span>
                        <span className="result-detail">
                          {formatBytes(item.originalSize)} → {formatBytes(item.compressedSize)}
                        </span>
                      </div>
                    )}

                    {item.status === "error" && item.error && (
                      <p className="card-error">{item.error}</p>
                    )}

                    {/* Actions */}
                    <div className="card-actions">
                      {item.status === "done" && item.compressedUrl && (
                        <a
                          className="card-download"
                          href={item.compressedUrl}
                          download={item.downloadName}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          압축 파일 다운로드
                        </a>
                      )}
                      {item.status !== "processing" && (
                        <button
                          type="button"
                          className="card-recompress"
                          onClick={() => recompress(item.id)}
                        >
                          재압축
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <p className="tool-formats">
          추천 모드는 업로드 오류를 줄이기 위한 기본값입니다. 제출처 숫자(용량·픽셀)가 있으면
          그 값을 우선으로 맞춰 주세요.
        </p>
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
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
        }
        @media (min-width: 640px) {
          .tool-card-wrap {
            padding: 1.35rem 1.25rem 1.4rem;
          }
        }

        /* ── Drop zone ─────────────────────────────────── */
        .drop-zone {
          position: relative;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 2rem 1rem 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: #f8fafc;
          margin-bottom: 0.25rem;
          outline: none;
          user-select: none;
        }
        .drop-zone:hover,
        .drop-zone:focus-visible {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .drop-zone.dragging {
          border-color: #059669;
          border-style: solid;
          background: #ecfdf5;
        }
        .drop-hidden-input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
          pointer-events: none;
        }
        .drop-icon {
          width: 2.25rem;
          height: 2.25rem;
          color: #94a3b8;
          margin: 0 auto 0.6rem;
          display: block;
          transition: color 0.15s;
        }
        .drop-zone:hover .drop-icon,
        .drop-zone:focus-visible .drop-icon,
        .drop-zone.dragging .drop-icon {
          color: #059669;
        }
        .drop-text {
          margin: 0 0 0.3rem;
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }
        .drop-hint {
          margin: 0;
          font-size: 0.8rem;
          color: #64748b;
        }

        /* ── Settings ──────────────────────────────────── */
        .fmt-fs {
          border: none;
          padding: 0;
          margin: 0.85rem 0 0;
        }
        .fmt-legend {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.45rem;
        }
        .fmt-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .mode-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .mode-btn {
          border: 1px solid #cbd5e1;
          background: #fff;
          color: #0f172a;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.38rem 0.6rem;
          cursor: pointer;
          transition: border-color 0.1s, background 0.1s;
        }
        .mode-btn.on {
          border-color: #059669;
          color: #065f46;
          background: #ecfdf5;
        }
        .fmt-label {
          font-size: 0.92rem;
          cursor: pointer;
        }

        /* ── Target KB input ───────────────────────────── */
        .target-row {
          margin-top: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .target-label {
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
        }
        .target-badge {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 0.05rem 0.32rem;
          letter-spacing: 0.02em;
        }
        .target-input-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .target-input {
          width: 5.5rem;
          padding: 0.32rem 0.55rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
        }
        .target-input:focus {
          border-color: #10b981;
        }
        .target-unit {
          font-size: 0.875rem;
          color: #475569;
          white-space: nowrap;
        }
        .target-clear {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.05rem;
          color: #94a3b8;
          padding: 0 0.1rem;
          line-height: 1;
        }
        .target-clear:hover {
          color: #ef4444;
        }

        /* ── Cards header ──────────────────────────────── */
        .cards-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.25rem;
          margin-bottom: 0.6rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .cards-count {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--muted);
        }
        .cards-header-btns {
          display: flex;
          gap: 0.4rem;
        }
        .dl-all-btn {
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 0.28rem 0.7rem;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.1s;
        }
        .dl-all-btn:hover {
          background: #1e293b;
        }
        .clear-btn {
          background: none;
          border: 1px solid #cbd5e1;
          border-radius: 7px;
          padding: 0.28rem 0.65rem;
          font-size: 0.78rem;
          cursor: pointer;
          color: #64748b;
        }
        .clear-btn:hover {
          border-color: #94a3b8;
        }

        /* ── File card ─────────────────────────────────── */
        .cards {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .card {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.85rem;
          background: var(--card);
          transition: border-color 0.2s;
        }
        .card.card-done {
          border-color: #a7f3d0;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
        }
        .card-name {
          flex: 1;
          min-width: 0;
          font-size: 0.82rem;
          font-weight: 600;
          color: #0f172a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .card-remove {
          flex-shrink: 0;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.15rem;
          line-height: 1;
          color: #94a3b8;
          padding: 0 0.2rem;
        }
        .card-remove:hover {
          color: #ef4444;
        }

        /* ── Before / After previews ───────────────────── */
        .card-previews {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .preview-box {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }
        .preview-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .preview-img {
          width: 100%;
          max-height: 130px;
          object-fit: contain;
          border-radius: 6px;
          background: #f1f5f9;
          display: block;
        }
        .preview-loading {
          width: 100%;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 0.82rem;
          color: #64748b;
        }
        .loading-dots {
          animation: blink 1.2s step-start infinite;
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
        .preview-placeholder {
          width: 100%;
          height: 90px;
          background: #f1f5f9;
          border-radius: 6px;
        }
        .preview-size {
          font-size: 0.78rem;
          font-weight: 600;
          color: #475569;
        }
        .preview-arrow {
          flex-shrink: 0;
          font-size: 1.1rem;
          color: #94a3b8;
        }

        /* ── Size bar graph ────────────────────────────── */
        .size-bars {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          animation: fadeInUp 0.35s ease-out;
        }
        .bar-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .bar-lbl {
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748b;
          width: 2.2rem;
          flex-shrink: 0;
          text-align: right;
        }
        .bar-track {
          flex: 1;
          height: 8px;
          background: #f1f5f9;
          border-radius: 99px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 99px;
          transform-origin: left;
          animation: barGrow 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes barGrow {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        .bar-orig {
          background: #cbd5e1;
        }
        .bar-comp {
          background: #10b981;
        }
        .bar-gain {
          background: #f59e0b;
        }
        .bar-val {
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          width: 4.5rem;
          flex-shrink: 0;
          text-align: right;
        }

        /* ── Big reduction hero ────────────────────────── */
        .result-hero {
          margin-top: 0.7rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
          border: 1px solid #6ee7b7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          animation: fadeInUp 0.4s ease-out;
        }
        .result-hero-gain {
          background: #fffbeb;
          border-color: #fcd34d;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .result-pct {
          font-size: 2.15rem;
          font-weight: 900;
          color: #059669;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .result-hero-gain .result-pct {
          color: #d97706;
        }
        .result-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #065f46;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          align-self: flex-end;
          padding-bottom: 0.2rem;
        }
        .result-hero-gain .result-label {
          color: #92400e;
        }
        .result-detail {
          width: 100%;
          text-align: center;
          font-size: 0.88rem;
          font-weight: 600;
          color: #047857;
          margin-top: -0.2rem;
        }
        .result-hero-gain .result-detail {
          color: #b45309;
        }

        .card-error {
          margin: 0.5rem 0 0;
          color: #b91c1c;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        /* ── Card actions ──────────────────────────────── */
        .card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.7rem;
        }
        .card-download {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          min-height: 48px;
          padding: 0.65rem 1rem;
          font-weight: 700;
          font-size: 1rem;
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          color: #fff !important;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 2px 8px rgb(5 150 105 / 0.32);
          transition: filter 0.1s, box-shadow 0.1s;
        }
        .card-download:hover {
          filter: brightness(0.96);
          box-shadow: 0 3px 12px rgb(5 150 105 / 0.4);
        }
        .card-recompress {
          background: none;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          color: #475569;
          white-space: nowrap;
        }
        .card-recompress:hover {
          border-color: #94a3b8;
        }

        .tool-formats {
          margin: 1rem 0 0;
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.55;
        }
      `}</style>
    </section>
  );
}
