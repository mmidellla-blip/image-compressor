/** URL 세그먼트 및 설정 배열에서 사용하는 도구 식별자 */
export type ToolSlug =
  | "compress"
  | "jpg-to-png"
  | "png-to-webp"
  | "gif-compress"
  | "resize"
  | "passport-photo"
  | "pdf-convert"
  | "heic-to-jpg"
  | "pdf-compress"
  | "photo-mosaic"
  | "background-remove"
  | "gif-maker";

export type FaqItem = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  slug: ToolSlug;
  /** 라우트 경로 (예: /compress) */
  path: string;
  /** 브라우저 탭에 표시되는 짧은 제목 */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** 페이지 상단 h1 */
  h1: string;
  /** 도구 상단 소개 단락 */
  intro: string;
  /**
   * 추가 설명(Thin content 완화·키워드 자연 포함).
   * 도구 UI 바로 위 ToolLayout에서 렌더링합니다.
   */
  seoSupplement?: string;
  /** 구현 완료 | 로드맵(준비 중 페이지) */
  status?: "live" | "coming_soon";
  howToTitle: string;
  howToSteps: { title: string; body: string }[];
  useCasesTitle: string;
  useCases: string[];
  warningsTitle: string;
  warnings: string[];
  faqs: FaqItem[];
  /** 관련 도구 내부 링크용 slug 목록 (보통 3개 이상) */
  relatedToolSlugs: ToolSlug[];
  /** 관련 블로그 글 slug */
  relatedBlogSlugs: string[];
  /** schema.org WebApplication.description */
  schemaDescription: string;
  /**
   * 홈 도구 그리드: 기본 | 실험·로드맵(하단 소구역) | 생략(푸터·직접 링크만).
   * 미지정 시 primary.
   */
  homeGrid?: "primary" | "experimental" | "omit";
};
