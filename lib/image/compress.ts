import { canvasToBlob } from "@/lib/image/browser";

export type CompressAttempt = { quality: number; blob: Blob; sizeBytes: number };

/** 목표 용량에 못 미치면 0.9→0.5까지 단계적으로 화질을 낮춥니다. */
export const AUTO_QUALITY_STEPS = [0.9, 0.8, 0.7, 0.6, 0.5] as const;
/** 0.5에서도 목표 용량을 못 맞췄을 때, 사용자 확인 후 이어서 시도하는 단계. */
export const EXTENDED_QUALITY_STEPS = [0.4, 0.3] as const;

/** 지정한 화질 한 단계로 JPEG 인코딩합니다. */
export async function compressAtQuality(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<CompressAttempt> {
  const blob = await canvasToBlob(canvas, "image/jpeg", quality);
  return { quality, blob, sizeBytes: blob.size };
}

export type SteppedResult =
  | { status: "ok"; attempt: CompressAttempt }
  | { status: "over-target"; bestAttempt: CompressAttempt };

/**
 * 화질 단계를 순서대로 시도해 목표 용량 이하가 되면 즉시 반환합니다.
 * 모든 단계를 다 써도 목표를 못 맞추면 그중 가장 작은 결과를 status:"over-target"로 반환합니다.
 */
export async function runSteppedCompression(
  canvas: HTMLCanvasElement,
  targetSizeBytes: number,
  steps: readonly number[],
): Promise<SteppedResult> {
  let best: CompressAttempt | null = null;
  for (const quality of steps) {
    const attempt = await compressAtQuality(canvas, quality);
    if (!best || attempt.sizeBytes < best.sizeBytes) best = attempt;
    if (attempt.sizeBytes <= targetSizeBytes) {
      return { status: "ok", attempt };
    }
  }
  return { status: "over-target", bestAttempt: best! };
}
