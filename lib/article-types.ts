/** 경제 아티클 전용 타입. 기존 블로그(이미지 도구) 시스템과 완전히 분리해서 관리합니다. */
export type ArticleFaqItem = {
  question: string;
  answer: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  datePublished: string;
  /** 작성자 표시명 (미설정 시 머니깨비 편집팀) */
  author?: string;
  contentHtml: string;
  relatedSlugs: string[];
  faq?: ArticleFaqItem[];
  closingSummary?: string;
  published?: boolean;
};
