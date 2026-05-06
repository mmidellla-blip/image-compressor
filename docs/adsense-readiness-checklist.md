# 애드센스·운영 준비 체크리스트

기준일: 2026년 5월 6일. 배포 URL·문의 메일 설정 후 다시 확인하세요.

## 완료한 항목

- **필수 페이지**: `/about`, `/contact`, `/privacy-policy`, `/terms` 존재. 소개·문의에 운영 목적·응답 지연 안내·오류/제안/제휴 안내.
- **개인정보·약관**: 브라우저 처리·비저장 원칙·쿠키·애드센스·Analytics 가능성·문의 메일 (privacy-policy).
- **도구 페이지**: 고유 메타·H1·사용법·「이럴 때 사용하세요」·「사용 전 확인하세요」·FAQ·관련 도구/블로그·JSON-LD(WebApplication·FAQPage·BreadcrumbList).
- **준비 중 도구**: HEIC→JPG, PDF 용량 줄이기, 모자이크, 배경 제거 — 설명·FAQ·대체 도구·ComingSoon 패널.
- **블로그**: 다수 글 1200자 이상 수준으로 보강·FAQ·요약·내부 링크. 롱테일 글 10개(chunk-9) 추가. 글별 Article+Breadcrumb+FAQ JSON-LD.
- **SEO**: `buildStaticPageMetadata` / `buildBlogPostMetadata`, canonical, OG, robots index/follow, `sitemap.xml`, `robots.txt`에 sitemap URL.
- **신뢰**: 푸터에 갱신일, 문의·정책·사이트맵, 브라우저 처리 문구.
- **광고**: 실제 애드센스 코드 없음. `PlaceholderAdBox`만, 문구 통일. 도구 상단 광고 제거(콘텐츠 우선).
- **OG 이미지**: `app/opengraph-image.tsx`(동적 OG). **파비콘**: `app/icon.svg`.
- **업로드 안내 문구**: BrowserNotice 및 푸터와 통일(선택한 파일은 브라우저 처리·비저장).
- **에러 메시지**: 검증·압축 실패 문구 정비(지원 형식·용량·재시도 안내).

## 배포 후 사용자가 할 일 (남은 항목)

- **환경 변수**: `NEXT_PUBLIC_SITE_URL`(선택, 미설정 시 기본 `https://www.compressdeck.com`), `NEXT_PUBLIC_CONTACT_EMAIL`(선택, 기본 `mmi.dellla@gmail.com`), 필요 시 `NEXT_PUBLIC_SHOW_AD_PLACEHOLDER=true`.
- **Search Console**: 사이트 소유권 확인 후 sitemap 제출 (`/sitemap.xml`).
- **수동 점검**: 실제 기기에서 주요 도구 UX·색 대비·Lighthouse 한 번씩 실행.
- **애드센스 승인 후**: placeholder 제거 또는 실제 광고 단위로 교체, `privacy-policy`의 광고 문구와 일치 확인.

## 자동화 한계

이 저장소만으로는 라이브 URL 기준 broken link 전수 검사, 실제 Lighthouse 점수, Search Console 인덱싱 상태를 확정할 수 없습니다. 배포 후 위 항목을 마무리하세요.
