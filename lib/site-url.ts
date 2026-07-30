/** 운영 사이트 기본 주소. `NEXT_PUBLIC_SITE_URL`이 없을 때 canonical·사이트맵 등에 사용합니다. */
export const DEFAULT_PUBLIC_SITE_URL = "https://www.compressdeck.com";

/**
 * 프로덕션 도메인.
 * `NEXT_PUBLIC_SITE_URL`이 설정되어 있으면 그 값을 쓰고, 없으면 null을 반환합니다.
 * (하드코딩된 기본 도메인으로 인한 캐노니컬 불일치 및 색인 차단 문제를 방지합니다.)
 */
export function getPublicSiteUrl(): URL | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

/** 절대 canonical URL (기본 도메인 또는 env 기준) */
export function getCanonicalUrl(path: string): string | undefined {
  const base = getPublicSiteUrl();
  if (!base) return undefined;
  try {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return new URL(normalized, base).href;
  } catch {
    return undefined;
  }
}
