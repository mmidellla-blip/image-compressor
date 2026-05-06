import { formatLimitMb, MAX_MULTI_IMAGE_TOTAL_BYTES, MAX_SINGLE_IMAGE_BYTES } from "@/lib/upload-limits";

/** 단일 이미지 도구용 검증. 오류 시 사용자에게 보여 줄 메시지, 통과 시 null */
export function validateSingleImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "지원하지 않는 파일 형식입니다. JPG·PNG·WebP 등 이미지 파일을 다시 선택해 주세요.";
  }
  if (file.size > MAX_SINGLE_IMAGE_BYTES) {
    return `파일 용량이 제한을 초과했습니다. 한 파일당 약 ${formatLimitMb(MAX_SINGLE_IMAGE_BYTES)} 이하로 줄인 뒤 다시 선택해 주세요.`;
  }
  if (file.size === 0) {
    return "파일을 다시 선택해 주세요. 빈 파일은 처리할 수 없습니다.";
  }
  return null;
}

/** 이미지→PDF 다중 선택 시 합산 용량 검증 */
export function validatePdfBatch(files: File[]): string | null {
  let total = 0;
  for (const f of files) {
    if (!f.type.startsWith("image/")) {
      return "지원하지 않는 파일 형식입니다. JPEG·PNG·WebP 이미지만 넣을 수 있습니다. 파일을 다시 선택해 주세요.";
    }
    total += f.size;
  }
  if (total > MAX_MULTI_IMAGE_TOTAL_BYTES) {
    return `선택한 파일 합계가 너무 큽니다. 전체 약 ${formatLimitMb(MAX_MULTI_IMAGE_TOTAL_BYTES)} 이하로 줄인 뒤 다시 시도해 주세요.`;
  }
  return null;
}
