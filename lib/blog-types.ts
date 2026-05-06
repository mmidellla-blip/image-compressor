export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  sections: BlogSection[];
  /** 관련 글 내부 링크용 */
  relatedSlugs: string[];
  /** 하단 FAQ (구조화 데이터·가독성) */
  faq?: { question: string; answer: string }[];
  /** 맺음말 요약 단락 */
  closingSummary?: string;
  /** Article JSON-LD용 (없으면 갱신일 기준 고정값 사용) */
  datePublished?: string;
};
