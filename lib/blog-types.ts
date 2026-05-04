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
};
