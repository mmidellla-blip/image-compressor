/** 프로덕션 도메인 (NEXT_PUBLIC_SITE_URL). 없거나 잘못된 값이면 null */
export function getPublicSiteUrl(): URL | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

/** 절대 canonical URL. env 미설정 시 undefined (로컬에서 잘못된 도메인 고정 방지) */
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
