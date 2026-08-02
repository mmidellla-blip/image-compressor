import { TOOL_DEFINITIONS } from "@/lib/tools/definitions";

/** AdSense 정책 대응: 공개 레거시 이미지 도구·블로그 경로 (홈으로 리다이렉트) */
export const LEGACY_PUBLIC_PATH_PREFIXES = [
  "/blog",
  ...TOOL_DEFINITIONS.map((t) => t.path),
] as const;

export function isLegacyPublicPath(pathname: string): boolean {
  return LEGACY_PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
