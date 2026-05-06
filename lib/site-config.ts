/**
 * 배포 시 교체: 문의 이메일·사이트 표기용.
 * 개인정보처리방침·문의 페이지와 동일 값을 씁니다.
 */
export function getPublicContactEmail(): string {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return raw && raw.includes("@") ? raw : "mmi.dellla@gmail.com";
}

/** 푸터·정책 페이지에 표시하는 정보 갱신일 */
export const SITE_INFO_LAST_UPDATED = "2026년 5월 6일";
