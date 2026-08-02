# AdSense 재신청 체크리스트

기준일: 2026년 8월 3일. Phase 1~2 코드·콘텐츠 반영 후 배포하고 아래를 순서대로 확인하세요.

## 배포 전 확인

- [ ] `NEXT_PUBLIC_SITE_URL`이 AdSense·Search Console 등록 URL과 동일한지 Vercel(또는 호스팅) 환경 변수 확인
- [ ] 프로덕션 빌드 성공 (`npm run build`)

## 레거시 차단 확인 (Phase 1)

- [ ] `/blog`, `/compress`, `/jpg-to-png` 등 이미지 도구 URL → 홈(`/`)으로 301 리다이렉트
- [ ] `robots.txt`에 `/blog`, `/compress`, 도구 경로 `Disallow` 포함
- [ ] 개인정보처리방침·이용약관에 이미지 툴 언급 없음

## 콘텐츠·색인 (Phase 2)

- [ ] 아티클 **40편** (기존 22 + 신규 18), 평균 본문 **2,000자+**
- [ ] 용어사전 **18개** 개별 URL (`/glossary/[slug]`) + sitemap 포함
- [ ] `/editorial-policy` 편집 기준 페이지 공개
- [ ] Search Console에 `https://[도메인]/sitemap.xml` 제출
- [ ] 색인 페이지 **50+** 목표 (홈·계산기·아티클·용어·정적 페이지 합산)
  - 예: 1 + 5 + 40 + 18 + 6 ≈ 70 URL

## 재신청 타이밍

1. 배포 후 **최소 2주** 대기 (급하게 재신청하지 않기)
2. Search Console → 페이지 색인 → 주요 아티클·용어 페이지가 “색인 생성됨”인지 확인
3. AdSense → 사이트 → **사이트 검토 요청**
4. 거절 시 2~4주 간격으로 콘텐츠 추가 후 재시도 (한 번에 대량 추가 지양)

## 수동 UX 점검

- [ ] 모바일에서 홈·계산기·아티클·푸터 링크 정상
- [ ] `/about`, `/contact`, `/privacy-policy`, `/terms`, `/editorial-policy` 접근 가능
- [ ] Lighthouse 접근성·SEO 한 번씩 실행

## 참고

- noindex만으로는 AdSense 통과가 어렵습니다. 레거시 URL 차단 + 장문 콘텐츠 + E-E-A-T가 핵심입니다.
- 도메인이 `compressdeck.com`이고 브랜드가 `머니깨비`인 경우, 장기적으로 전용 도메인 또는 완전 리브랜딩을 검토하세요.
