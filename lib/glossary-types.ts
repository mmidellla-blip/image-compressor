/** 머니깨비 용어사전 전용 타입. */
export type GlossaryTerm = {
  slug: string;
  term: string;
  shortDefinition: string;
  /** 개별 용어 페이지용 상세 설명 (300~500자 권장) */
  longDefinition?: string;
  /** 더 깊이 있는 설명이 있는 아티클 슬러그 (선택) */
  relatedArticleSlug?: string;
  /** 관련 유튜브 영상 URL (없으면 비워둠 — 추측해서 채우지 않음) */
  videoUrl?: string;
  published?: boolean;
};
