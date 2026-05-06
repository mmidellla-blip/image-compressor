import type { ToolSlug } from "@/lib/tools/types";

/**
 * 블로그 글 slug → 관련 도구 slug (내부 링크용).
 * 새 글을 쓸 때 여기만 추가하면 관련 도구 영역이 갱신됩니다.
 */
export const blogRelatedToolSlugs: Partial<Record<string, ToolSlug[]>> = {
  "사진-용량-줄이는-법": ["compress", "resize", "passport-photo"],
  "jpg-용량-줄이기": ["compress", "png-to-webp", "resize"],
  "이미지-압축-방법": ["compress", "gif-compress", "png-to-webp"],
  "이미지-최적화-seo": ["compress", "png-to-webp", "resize"],
  "webp-변환-필요한-이유": ["png-to-webp", "compress", "jpg-to-png"],
  "증명사진-용량-줄이는-방법": ["passport-photo", "compress", "resize"],
  "이미지-크기-조절-방법": ["resize", "compress", "passport-photo"],
  "이미지-pdf-변환-방법": ["pdf-convert", "compress", "resize"],
  "취업-사진-업로드-오류-해결": ["passport-photo", "resize", "compress"],
  "무료-이미지-툴-추천-브라우저": ["compress", "png-to-webp", "pdf-convert"],
  "사람인-이력서-사진-용량-줄이기": ["passport-photo", "compress", "resize"],
  "잡코리아-프로필-사진-용량-줄이기": ["passport-photo", "compress", "resize"],
  "공공기관-제출용-이미지-용량-줄이기": ["pdf-convert", "compress", "resize"],
  "카카오톡-사진-용량-줄이기": ["compress", "resize", "png-to-webp"],
  "블로그-본문-이미지-용량-줄이기": ["compress", "resize", "png-to-webp"],
  "쇼핑몰-상세페이지-이미지-최적화": ["compress", "png-to-webp", "resize"],
  "아이폰-heic-사진-jpg-변환-방법": ["compress", "resize", "jpg-to-png"],
  "pdf-용량-줄이기-전-이미지-압축-이유": ["pdf-convert", "compress", "resize"],
  "네이버-블로그-이미지-최적화-방법": ["compress", "resize", "png-to-webp"],
  "사진-업로드-오류-해결-방법": ["compress", "resize", "passport-photo"],
};
