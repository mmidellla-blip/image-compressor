/** 브라우저 메모리 보호를 위한 단일 파일 상한 (바이트). 약 40MB */
export const MAX_SINGLE_IMAGE_BYTES = 40 * 1024 * 1024;

/** 이미지→PDF 다중 선택 시 합산 상한 (바이트). 약 80MB */
export const MAX_MULTI_IMAGE_TOTAL_BYTES = 80 * 1024 * 1024;

export function formatLimitMb(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${Math.round(mb)}MB`;
}
