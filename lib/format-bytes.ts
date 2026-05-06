/** 파일 용량을 사용자에게 보여 줄 때 사용하는 통합 포맷터입니다. */
export function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n < 1024) return `${Math.round(n)} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

/** 압축 전후 용량으로 감소율(%)을 계산합니다. */
export function reductionPercent(before: number, after: number): number | null {
  if (!(before > 0) || !(after >= 0)) return null;
  return Math.round((1 - after / before) * 100);
}
