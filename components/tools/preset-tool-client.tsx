"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { formatBytes } from "@/lib/format-bytes";
import {
  canvasToBlob,
  loadImageFromFile,
  stretchImageToCanvas,
} from "@/lib/image/browser";
import {
  cropAreaToCanvas,
  defaultCropPercentages,
  type PixelCropArea,
} from "@/lib/image/crop";
import { compositeOnWhite } from "@/lib/image/composite";
import {
  AUTO_QUALITY_STEPS,
  EXTENDED_QUALITY_STEPS,
  runSteppedCompression,
  type CompressAttempt,
} from "@/lib/image/compress";
import { PHOTO_PRESETS, type PhotoPreset } from "@/lib/tools/presets";
import { validateSingleImageFile } from "@/lib/validate-upload";

type Phase =
  | "idle"
  | "bg-loading-model"
  | "bg-processing"
  | "bg-confirm"
  | "compressing"
  | "compress-confirm-low"
  | "done"
  | "error";

export function PresetToolClient() {
  const [presetId, setPresetId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const [initialCropPct, setInitialCropPct] = useState<PixelCropArea | null>(null);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [whiteBgEnabled, setWhiteBgEnabled] = useState(true);
  const [bgProgress, setBgProgress] = useState(0);
  const [bgPreview, setBgPreview] = useState<{ original: string; white: string } | null>(
    null,
  );

  const [resizedCanvas, setResizedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [compositeCanvas, setCompositeCanvas] = useState<HTMLCanvasElement | null>(null);

  const [pendingLowQuality, setPendingLowQuality] = useState<CompressAttempt | null>(
    null,
  );
  const [result, setResult] = useState<CompressAttempt | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);

  const preset: PhotoPreset | null = presetId
    ? PHOTO_PRESETS.find((p) => p.id === presetId) ?? null
    : null;

  // ── object URL 정리 ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [imageObjectUrl]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  // ── 프리셋 선택 ────────────────────────────────────────────────────────
  const selectPreset = useCallback(
    (id: string) => {
      setPresetId(id);
      setError(null);
      const p = PHOTO_PRESETS.find((x) => x.id === id);
      if (p && imageEl) {
        setInitialCropPct(
          defaultCropPercentages(
            imageEl.naturalWidth,
            imageEl.naturalHeight,
            p.aspectRatio.w,
            p.aspectRatio.h,
          ),
        );
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      }
      setPhase("idle");
    },
    [imageEl],
  );

  // ── 파일 업로드 ────────────────────────────────────────────────────────
  const onFile = useCallback(
    async (f: File | null) => {
      if (!f || !preset) return;
      const v = validateSingleImageFile(f);
      if (v) {
        setError(v);
        return;
      }
      setError(null);
      setPhase("idle");
      setResult(null);
      setDownloadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setBgPreview(null);
      setResizedCanvas(null);
      setCompositeCanvas(null);
      setPendingLowQuality(null);

      try {
        const img = await loadImageFromFile(f);
        const url = URL.createObjectURL(f);
        setImageObjectUrl((prevUrl) => {
          if (prevUrl) URL.revokeObjectURL(prevUrl);
          return url;
        });
        setImageEl(img);
        setFile(f);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setInitialCropPct(
          defaultCropPercentages(
            img.naturalWidth,
            img.naturalHeight,
            preset.aspectRatio.w,
            preset.aspectRatio.h,
          ),
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "이미지를 불러올 수 없습니다.");
      }
    },
    [preset],
  );

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const upscaleWarning =
    !!preset &&
    !!croppedAreaPixels &&
    (croppedAreaPixels.width < preset.targetPixels.w ||
      croppedAreaPixels.height < preset.targetPixels.h);

  // ── 압축 마무리 ────────────────────────────────────────────────────────
  const finish = useCallback((attempt: CompressAttempt) => {
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(attempt.blob);
    });
    setResult(attempt);
    setPhase("done");
  }, []);

  const runCompression = useCallback(
    async (canvas: HTMLCanvasElement) => {
      if (!preset) return;
      setPhase("compressing");
      const res = await runSteppedCompression(canvas, preset.targetSizeBytes, AUTO_QUALITY_STEPS);
      if (res.status === "ok") {
        finish(res.attempt);
      } else {
        setPendingLowQuality(res.bestAttempt);
        setPhase("compress-confirm-low");
      }
    },
    [preset, finish],
  );

  // ── 완성하기 ───────────────────────────────────────────────────────────
  const runPipeline = useCallback(async () => {
    if (!preset || !imageEl || !croppedAreaPixels) return;
    setError(null);
    try {
      const cropped = cropAreaToCanvas(imageEl, croppedAreaPixels);
      const resized = stretchImageToCanvas(
        cropped,
        preset.targetPixels.w,
        preset.targetPixels.h,
      );
      setResizedCanvas(resized);

      if (!whiteBgEnabled) {
        await runCompression(resized);
        return;
      }

      setPhase("bg-loading-model");
      setBgProgress(0);
      const { removeBackground } = await import("@imgly/background-removal");
      setPhase("bg-processing");

      const resizedBlob = await canvasToBlob(resized, "image/png");
      const resizedFile = new File([resizedBlob], "resized.png", { type: "image/png" });

      const transparentBlob = await removeBackground(resizedFile, {
        progress: (_key: string, cur: number, total: number) => {
          if (total > 0) setBgProgress(Math.round((cur / total) * 100));
        },
        output: { format: "image/png" as const, quality: 1 },
      });
      const transparentFile = new File([transparentBlob], "transparent.png", {
        type: "image/png",
      });
      const transparentImg = await loadImageFromFile(transparentFile);
      const composite = compositeOnWhite(
        transparentImg,
        preset.targetPixels.w,
        preset.targetPixels.h,
      );
      setCompositeCanvas(composite);
      setBgPreview({
        original: resized.toDataURL("image/jpeg", 0.9),
        white: composite.toDataURL("image/jpeg", 0.9),
      });
      setPhase("bg-confirm");
    } catch (e) {
      setError(e instanceof Error ? e.message : "처리 중 오류가 발생했습니다.");
      setPhase("error");
    }
  }, [preset, imageEl, croppedAreaPixels, whiteBgEnabled, runCompression]);

  const confirmWhiteBg = useCallback(
    (accept: boolean) => {
      const canvas = accept ? compositeCanvas : resizedCanvas;
      if (!canvas) return;
      void runCompression(canvas);
    },
    [compositeCanvas, resizedCanvas, runCompression],
  );

  const acceptLowQuality = useCallback(() => {
    if (pendingLowQuality) finish(pendingLowQuality);
  }, [pendingLowQuality, finish]);

  const continueLowerQuality = useCallback(async () => {
    if (!preset) return;
    const canvas = compositeCanvas ?? resizedCanvas;
    if (!canvas) return;
    setPhase("compressing");
    const res = await runSteppedCompression(
      canvas,
      preset.targetSizeBytes,
      EXTENDED_QUALITY_STEPS,
    );
    finish(res.status === "ok" ? res.attempt : res.bestAttempt);
  }, [preset, compositeCanvas, resizedCanvas, finish]);

  const resetForNewFile = useCallback(() => {
    setFile(null);
    setImageEl(null);
    setImageObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setInitialCropPct(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setBgPreview(null);
    setResizedCanvas(null);
    setCompositeCanvas(null);
    setPendingLowQuality(null);
    setResult(null);
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setError(null);
    setPhase("idle");
  }, []);

  const isBusy = phase === "bg-loading-model" || phase === "bg-processing" || phase === "compressing";
  const downloadName = preset
    ? `${preset.id}_photo_${preset.targetPixels.w}x${preset.targetPixels.h}.jpg`
    : "photo.jpg";

  return (
    <section className="tool-ui" aria-label="사진 규격 완성">
      <BrowserNotice />

      <div className="tool-card-wrap">
        <div className="preset-grid">
          {PHOTO_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`preset-card${presetId === p.id ? " active" : ""}`}
              onClick={() => selectPreset(p.id)}
              aria-pressed={presetId === p.id}
            >
              <span className="preset-card-label">{p.label}</span>
              <span className="preset-card-spec">
                {p.targetPixels.w}×{p.targetPixels.h}px · {formatBytes(p.targetSizeBytes)} 이하
              </span>
            </button>
          ))}
        </div>

        <FileDropzone
          id="preset-file"
          label="사진 선택"
          accept="image/*"
          disabled={!preset || isBusy}
          onFile={(f) => void onFile(f)}
        />

        {error && (
          <p className="err-msg" role="alert">
            {error}
          </p>
        )}

        {file && imageEl && initialCropPct && preset && phase === "idle" && (
          <div className="crop-section">
            <p className="hint">
              드래그로 위치를, 슬라이더로 확대를 조정하세요. 비율은 {preset.label} 규격으로
              고정됩니다.
            </p>
            <div className="crop-stage">
              <Cropper
                image={imageObjectUrl ?? undefined}
                crop={crop}
                zoom={zoom}
                aspect={preset.aspectRatio.w / preset.aspectRatio.h}
                cropShape="rect"
                restrictPosition
                initialCroppedAreaPercentages={initialCropPct}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <label className="zoom-label" htmlFor="preset-zoom">
              확대: {zoom.toFixed(2)}x
            </label>
            <input
              id="preset-zoom"
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="zoom-range"
            />

            {upscaleWarning && (
              <p className="warn-msg">
                원본 사진이 목표 픽셀({preset.targetPixels.w}×{preset.targetPixels.h}px)보다
                작습니다. 확대되어 화질이 흐려질 수 있습니다.
              </p>
            )}

            <label className="toggle-row">
              <input
                type="checkbox"
                checked={whiteBgEnabled}
                onChange={(e) => setWhiteBgEnabled(e.target.checked)}
              />
              배경을 흰색으로 자동 정리
            </label>

            <button
              type="button"
              className="btn-run"
              disabled={!croppedAreaPixels}
              onClick={() => void runPipeline()}
            >
              완성하기
            </button>
          </div>
        )}

        {(phase === "bg-loading-model" || phase === "bg-processing") && (
          <div className="progress-wrap">
            <div className="progress-label">
              {phase === "bg-loading-model" ? "AI 모델 로딩 중…" : `배경 분석 중… ${bgProgress}%`}
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${phase === "bg-loading-model" ? 5 : bgProgress}%` }}
              />
            </div>
            <p className="progress-hint">
              처음 실행 시 AI 모델을 다운로드해요 (약 30MB). 이후엔 빠르게 처리됩니다. 저사양
              기기에서는 시간이 더 걸릴 수 있어요.
            </p>
          </div>
        )}

        {phase === "bg-confirm" && bgPreview && (
          <div className="bg-confirm">
            <p className="hint">
              AI가 배경과 피사체 경계를 자동 판단하므로, 복잡한 경계나 반투명 소재는 가장자리가
              부정확할 수 있어요. 결과를 확인한 뒤 진행하세요.
            </p>
            <div className="card-previews">
              <div className="preview-box">
                <span className="preview-label">원본 배경</span>
                <img src={bgPreview.original} alt="원본 배경 미리보기" />
              </div>
              <span className="preview-arrow" aria-hidden="true">
                →
              </span>
              <div className="preview-box">
                <span className="preview-label">흰 배경 합성</span>
                <img src={bgPreview.white} alt="흰 배경 합성 미리보기" />
              </div>
            </div>
            <div className="btn-row">
              <button type="button" className="btn-reset" onClick={() => confirmWhiteBg(false)}>
                건너뛰기(원본 배경 유지)
              </button>
              <button type="button" className="btn-run" onClick={() => confirmWhiteBg(true)}>
                확인, 이 결과 사용
              </button>
            </div>
          </div>
        )}

        {phase === "compressing" && <p className="hint">압축 중…</p>}

        {phase === "compress-confirm-low" && pendingLowQuality && preset && (
          <div className="compress-confirm">
            <p className="warn-msg">
              화질 0.5까지 낮췄지만 목표 용량({formatBytes(preset.targetSizeBytes)})보다 큽니다
              (현재 {formatBytes(pendingLowQuality.sizeBytes)}). 화질을 더 낮추면 용량은 줄지만
              화질 저하가 심해질 수 있어요.
            </p>
            <div className="btn-row">
              <button type="button" className="btn-reset" onClick={acceptLowQuality}>
                현재 결과 사용
              </button>
              <button type="button" className="btn-run" onClick={() => void continueLowerQuality()}>
                화질 더 낮추기
              </button>
            </div>
          </div>
        )}

        {phase === "done" && result && downloadUrl && preset && file && (
          <div className="result-section">
            <div className="card-previews">
              <div className="preview-box">
                <span className="preview-label">원본</span>
                <img src={imageObjectUrl ?? undefined} alt="원본 이미지" />
                <span className="preview-size">{formatBytes(file.size)}</span>
              </div>
              <span className="preview-arrow" aria-hidden="true">
                →
              </span>
              <div className="preview-box">
                <span className="preview-label">완성 결과</span>
                <img src={downloadUrl} alt="완성 결과" />
                <span className="preview-size">{formatBytes(result.sizeBytes)}</span>
              </div>
            </div>
            <dl className="rs-stats">
              <div>
                <dt>픽셀</dt>
                <dd>
                  {preset.targetPixels.w}×{preset.targetPixels.h}px
                </dd>
              </div>
              <div>
                <dt>용량</dt>
                <dd>{formatBytes(result.sizeBytes)}</dd>
              </div>
              <div>
                <dt>포맷</dt>
                <dd>JPEG</dd>
              </div>
            </dl>
            <p className="rs-download-wrap">
              <a className="rs-download" href={downloadUrl} download={downloadName}>
                다운로드
              </a>
            </p>
            <p className="disclaimer">
              이 규격은 {preset.label} 기준이며, 실제 접수처 요구사항과 다를 수 있으니 공고문을
              확인하세요.
            </p>
            <button type="button" className="btn-reset" onClick={resetForNewFile}>
              다른 사진으로 다시 하기
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className="error-section">
            <p className="err-msg" role="alert">
              {error ?? "처리에 실패했습니다."}
            </p>
            <button type="button" className="btn-reset" onClick={resetForNewFile}>
              다시 시도
            </button>
          </div>
        )}
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
        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
          gap: 0.65rem;
          margin-bottom: 0.85rem;
        }
        .preset-card {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          text-align: left;
          padding: 0.85rem 0.9rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
        }
        .preset-card.active {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgb(5 150 105 / 0.15);
        }
        .preset-card-label {
          font-weight: 700;
          font-size: 0.9rem;
        }
        .preset-card-spec {
          font-size: 0.78rem;
          color: var(--muted);
        }
        .hint {
          font-size: 0.83rem;
          color: var(--muted);
          margin: 0.6rem 0 0.5rem;
          line-height: 1.55;
        }
        .warn-msg {
          font-size: 0.83rem;
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          margin: 0.6rem 0;
          line-height: 1.5;
        }
        .err-msg {
          color: #b91c1c;
          font-size: 0.85rem;
          margin: 0.5rem 0 0;
        }
        .crop-section {
          margin-top: 0.5rem;
        }
        .crop-stage {
          position: relative;
          width: 100%;
          height: 320px;
          background: #111;
          border-radius: 10px;
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .crop-stage {
            height: 260px;
          }
        }
        .zoom-label {
          display: block;
          margin-top: 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .zoom-range {
          width: 100%;
          margin-top: 0.3rem;
        }
        .toggle-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.85rem;
          font-size: 0.88rem;
          font-weight: 600;
        }
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
        .btn-run:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-run:hover:not(:disabled) {
          filter: brightness(1.05);
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
        .btn-row {
          display: flex;
          gap: 0.65rem;
          margin-top: 0.85rem;
        }
        .btn-row .btn-run {
          margin-top: 0;
          flex: 2;
        }
        .progress-wrap {
          margin-top: 0.85rem;
        }
        .progress-label {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
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
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 4px;
          transition: width 0.2s ease;
        }
        .progress-hint {
          font-size: 0.78rem;
          color: var(--muted);
          margin: 0.45rem 0 0;
          line-height: 1.5;
        }
        .card-previews {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.85rem;
          flex-wrap: wrap;
        }
        .preview-box {
          flex: 1;
          min-width: 9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          background: #f5f5f5;
          border-radius: 10px;
          padding: 0.65rem;
        }
        .preview-box img {
          max-width: 100%;
          max-height: 220px;
          border-radius: 6px;
        }
        .preview-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--muted);
        }
        .preview-size {
          font-size: 0.78rem;
          color: var(--muted);
        }
        .preview-arrow {
          font-size: 1.2rem;
          color: var(--muted);
        }
        .rs-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
          gap: 0.75rem;
          margin: 0.85rem 0 0;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 10px;
        }
        .rs-stats dt {
          font-size: 0.72rem;
          color: var(--muted);
          margin: 0;
        }
        .rs-stats dd {
          margin: 0.2rem 0 0;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .rs-download-wrap {
          margin: 1rem 0 0;
          text-align: center;
        }
        .rs-download {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0.65rem 1.2rem;
          font-weight: 700;
          font-size: 1.05rem;
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          color: #fff !important;
          border-radius: 10px;
          text-decoration: none;
          width: 100%;
        }
        .disclaimer {
          margin: 0.85rem 0 0;
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .result-section .btn-reset,
        .error-section .btn-reset {
          width: 100%;
          margin-top: 0.85rem;
        }
      `}</style>
    </section>
  );
}
