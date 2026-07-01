/**
 * "규격 완성" 프리셋 정의. 항목 추가만으로 새 규격을 지원합니다.
 * 값은 기존 블로그 글(이력서 300x400·5MB, 공무원 응시원서 350x450·1MB,
 * 여권 3.5x4.5·1MB)에서 이미 검증된 수치와 동일하게 맞춥니다.
 */
export type PhotoPreset = {
  id: string;
  label: string;
  aspectRatio: { w: number; h: number };
  targetPixels: { w: number; h: number };
  targetSizeBytes: number;
  format: "jpg";
};

export const PHOTO_PRESETS: PhotoPreset[] = [
  {
    id: "resume",
    label: "이력서용 (사람인·잡코리아 등)",
    aspectRatio: { w: 3, h: 4 },
    targetPixels: { w: 300, h: 400 },
    targetSizeBytes: 5_000_000,
    format: "jpg",
  },
  {
    id: "civil-service-exam",
    label: "공무원 시험 응시원서용",
    aspectRatio: { w: 3.5, h: 4.5 },
    targetPixels: { w: 350, h: 450 },
    targetSizeBytes: 1_000_000,
    format: "jpg",
  },
  {
    id: "passport",
    label: "여권용",
    aspectRatio: { w: 3.5, h: 4.5 },
    targetPixels: { w: 413, h: 531 },
    targetSizeBytes: 1_000_000,
    format: "jpg",
  },
];

export function getPhotoPreset(id: string): PhotoPreset | undefined {
  return PHOTO_PRESETS.find((p) => p.id === id);
}
