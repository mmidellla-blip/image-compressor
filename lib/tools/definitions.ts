import type { ToolDefinition, ToolSlug } from "@/lib/tools/types";

export type { ToolSlug } from "@/lib/tools/types";

/** 신규 도구 추가 시 이 배열만 확장하면 네비·사이트맵·관련 링크에 반영됩니다. */
export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    slug: "compress",
    path: "/compress",
    metaTitle: "이미지 용량 줄이기 — JPG·PNG 무료 압축 (브라우저)",
    metaDescription:
      "회원가입 없이 이미지 용량 줄이기·이미지 압축. JPG 용량 줄이기, 사진 용량 줄이기에 맞춰 JPEG·WebP로 저장하며 브라우저에서만 처리합니다.",
    keywords: [
      "이미지 용량 줄이기",
      "JPG 용량 줄이기",
      "사진 용량 줄이기",
      "이미지 압축",
      "무료 이미지 툴",
      "WebP 변환",
    ],
    h1: "이미지 용량 줄이기 (무료)",
    intro:
      "JPG·PNG·WebP 등 사진과 이미지를 JPEG 또는 WebP로 줄여 보세요. 이미지 압축은 브라우저에서 수행되며, JPG 용량 줄이기·사진 용량 줄이기가 필요한 메일 첨부·웹 업로드에 활용할 수 있습니다.",
    howToTitle: "사용 방법",
    howToSteps: [
      {
        title: "1. 이미지 선택",
        body: "압축할 JPG·PNG·WebP 파일을 선택합니다. 여러 장은 한 장씩 처리해 주세요.",
      },
      {
        title: "2. 출력 형식 선택",
        body: "JPEG(호환성) 또는 WebP(용량 효율) 중 하나를 고릅니다.",
      },
      {
        title: "3. 용량 줄이기 실행",
        body: "버튼을 누르면 미리보기 없이 결과 파일이 만들어집니다.",
      },
      {
        title: "4. 다운로드",
        body: "압축 전후 용량·감소율을 확인한 뒤 파일을 저장합니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "이력서·채용 사이트에 사진·이미지를 올리기 직전, ‘용량 초과’가 뜰 때",
      "사람인·잡코리아 등 포털 프로필·지원서에 사진을 넣기 전",
      "공공기관·학교·자격 시험 접수 화면에 첨부하기 전",
      "블로그·카페·웹에 본문 이미지를 넣기 전, 로딩을 가볍게 하고 싶을 때",
      "카카오톡·이메일로 사진·캡처를 보내기 전",
      "쇼핑몰·스마트스토어 상세페이지 이미지를 올리기 전",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "중요한 원본은 PC·클라우드에 별도 폴더로 꼭 보관하세요. 압축본만 제출·공유에 쓰는 습관이 안전합니다.",
      "압축 후 작은 글씨, 얼굴 윤곽, 제품 질감이 흐려지지 않았는지 화면에서 한 번 더 확인하세요.",
      "WebP는 일부 구형 PC·내부 시스템에서 열리지 않을 수 있습니다. 제출처가 JPG만 허용하면 JPEG를 고르세요.",
      "JPEG/WebP는 손실 압축일 수 있어, 같은 파일을 반복해서 저장하면 화질이 누적 저하될 수 있습니다.",
    ],
    faqs: [
      {
        question: "서버에 파일이 올라가나요?",
        answer:
          "아니요. 선택한 파일은 가능한 한 사용자 브라우저에서만 처리되며 서버에 저장하지 않습니다.",
      },
      {
        question: "JPG 용량 줄이기와 WebP 중 무엇이 좋나요?",
        answer:
          "호환성이 중요하면 JPEG, 용량 효율이 중요하면 WebP를 고려하세요. 최신 브라우저는 WebP를 넓게 지원합니다.",
      },
      {
        question: "PNG도 줄일 수 있나요?",
        answer:
          "업로드는 가능하지만, 사진 위주 PNG는 JPEG나 WebP로 바꾸면 이미지 용량 줄이기 효과가 큰 경우가 많습니다.",
      },
      {
        question: "JPG 용량을 줄이면 화질이 깨지나요?",
        answer:
          "용량을 줄일 때 손실 압축이 들어가면 디테일이 줄어들 수 있습니다. 목표 용량을 너무 낮게 잡지 말고, 결과를 확대해 글자·얼굴 윤곽·작은 텍스트를 확인하세요.",
      },
      {
        question: "WebP 파일은 어디서 안 열리나요?",
        answer:
          "일부 구형 PC 사진 앱, 오래된 인쇄소·행정망 PC, 구형 모바일 뷰어에서 문제가 될 수 있습니다. 제출처가 JPG만 허용하면 JPEG로 내보내세요.",
      },
    ],
    relatedToolSlugs: ["png-to-webp", "resize", "pdf-convert", "jpg-to-png"],
    relatedBlogSlugs: [
      "이미지-압축-방법",
      "jpg-용량-줄이기",
      "사진-용량-줄이는-법",
      "이미지-최적화-seo",
    ],
    schemaDescription:
      "브라우저에서 JPG·PNG 이미지 압축 및 JPEG·WebP 내보내기를 제공하는 무료 이미지 툴입니다.",
  },
  {
    slug: "jpg-to-png",
    path: "/jpg-to-png",
    metaTitle: "JPG → PNG 변환 무료 — JPEG를 PNG로 저장",
    metaDescription:
      "JPG를 PNG로 바꾸는 무료 이미지 툴. JPG 용량 줄이기 전 단계로 포맷을 바꾸거나, 투명 배경이 필요 없을 때도 PNG로 통일할 수 있습니다.",
    keywords: [
      "JPG 용량 줄이기",
      "이미지 압축",
      "PNG",
      "JPEG",
      "무료 이미지 툴",
      "이미지 용량 줄이기",
    ],
    h1: "JPG → PNG 변환",
    intro:
      "JPEG(JPG) 이미지를 PNG로 변환합니다. 브라우저 Canvas를 사용하며, 이미지 용량 줄이기·리사이즈는 다른 도구와 함께 쓰면 편합니다.",
    howToTitle: "사용 방법",
    howToSteps: [
      {
        title: "1. JPG 파일 선택",
        body: "변환할 JPEG 파일을 고릅니다.",
      },
      {
        title: "2. PNG로 변환",
        body: "버튼을 누르면 PNG Blob이 생성됩니다.",
      },
      {
        title: "3. 다운로드",
        body: "파일명은 원본 이름 기준으로 .png가 붙습니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "공공기관·교육청 양식에서 ‘PNG만 허용’이라고 적혀 있을 때",
      "디자인 협업 툴이 PNG 업로드만 받을 때",
      "한 프로젝트 안에서 스크린샷·사진 포맷을 PNG로 통일해야 할 때",
      "서류 스캔 JPG를 이후 단계에서 PNG로만 넘기고 싶을 때(손실 복구는 안 됨)",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "원본 JPG는 따로 보관하고, 변환 결과는 새 파일로 저장해 덮어쓰기 실수를 줄이세요.",
      "JPG에서 PNG로 바꾼다고 과거 압축 손실이 복구되지는 않습니다.",
      "사진 위주 JPG는 PNG가 더 무거울 수 있습니다. 용량 줄이기가 목적이면 ‘이미지 용량 줄이기’를 우선 검토하세요.",
    ],
    faqs: [
      {
        question: "JPG 용량 줄이기가 목적인데 PNG로 바꾸면?",
        answer:
          "용량이 늘어날 수 있습니다. 용량이 우선이면 ‘이미지 용량 줄이기’ 도구에서 JPEG/WebP 압축을 사용하세요.",
      },
      {
        question: "투명 배경이 생기나요?",
        answer:
          "일반 JPG에는 알파 채널이 없어 투명 배경이 자동 생성되지 않습니다. 투명이 필요하면 원본 PNG나 마스크 편집이 필요합니다.",
      },
      {
        question: "변환 후 글씨나 로고가 흐려 보여요.",
        answer:
          "JPG에 이미 깔린 손실은 되살릴 수 없습니다. 원본 해상도가 낮다면 리사이즈·재촬영·PNG 원본 확보를 검토하세요.",
      },
    ],
    relatedToolSlugs: ["compress", "png-to-webp", "resize", "pdf-convert"],
    relatedBlogSlugs: ["png-용량-줄이기", "이미지-압축-방법", "무료-이미지-압축-사이트"],
    schemaDescription: "JPEG 이미지를 PNG 형식으로 변환하는 무료 온라인 도구입니다.",
  },
  {
    slug: "png-to-webp",
    path: "/png-to-webp",
    metaTitle: "PNG → WebP 변환 무료 — PNG WebP 변환",
    metaDescription:
      "PNG를 WebP로 바꾸는 무료 이미지 툴. WebP 변환으로 이미지 용량 줄이기·페이지 속도 개선에 도움이 될 수 있습니다.",
    keywords: [
      "PNG WebP 변환",
      "WebP 변환",
      "이미지 용량 줄이기",
      "이미지 압축",
      "무료 이미지 툴",
    ],
    h1: "PNG → WebP 변환",
    intro:
      "PNG 이미지를 WebP로 변환합니다. 브라우저가 WebP 인코딩을 지원해야 하며, PNG WebP 변환 후 용량과 화질을 비교해 보세요.",
    howToTitle: "사용 방법",
    howToSteps: [
      { title: "1. PNG 선택", body: "변환할 PNG 파일을 고릅니다." },
      {
        title: "2. 품질 조절(선택)",
        body: "기본 약 0.85 품질로 저장합니다. 브라우저에 따라 옵션이 제한될 수 있습니다.",
      },
      { title: "3. 변환 및 다운로드", body: "WebP 파일을 저장합니다." },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "블로그·랜딩·쇼핑몰 상세 이미지를 가볍게 만들어 로딩을 개선하고 싶을 때",
      "PNG 아이콘·배너·스크린샷을 웹용으로 줄일 때",
      "이미지 최적화 SEO를 위해 포맷을 정리할 때",
      "카페·커뮤니티에 올릴 캡처 파일이 PNG라 용량 제한에 걸릴 때",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "WebP는 일부 구형 브라우저·내부 행정망·오래된 뷰어에서 열리지 않을 수 있습니다. 제출처 규격을 먼저 확인하세요.",
      "제출·인쇄용으로는 JPG나 PDF가 요구되는 경우가 많습니다. WebP만 받는지 확인한 뒤 사용하세요.",
      "투명 PNG는 변환 후에도 투명이 유지되는 경우가 많지만, 결과 화면에서 배경 합성을 꼭 확인하세요.",
    ],
    faqs: [
      {
        question: "WebP 변환이 필요한 이유는 무엇인가요?",
        answer:
          "동일 화질에서 JPG·PNG보다 용량이 작은 경우가 많아, 이미지 최적화와 로딩 개선에 유리합니다.",
      },
      {
        question: "PNG WebP 변환 후 용량이 더 커질 수 있나요?",
        answer:
          "매우 작은 이미지나 특수 패턴에서는 드물게 그럴 수 있습니다. 결과 요약에서 반드시 확인하세요.",
      },
      {
        question: "압축 후 글자나 로고가 깨져 보이면?",
        answer:
          "품질 손실이 큰 경우입니다. PNG→WebP 대신 ‘이미지 용량 줄이기’에서 JPEG을 쓰거나, 원본 해상도를 올려 다시 시도해 보세요.",
      },
      {
        question: "WebP는 어디서 안 열리나요?",
        answer:
          "구형 브라우저·뷰어, 일부 민원·은행 내부 PC, 메일 첨부 미리보기에서 안 열릴 수 있습니다. 제출 전에는 JPG/PNG 요구 사항을 확인하고, 필요하면 JPEG로 다시 저장하세요.",
      },
    ],
    relatedToolSlugs: ["compress", "jpg-to-png", "resize", "gif-compress"],
    relatedBlogSlugs: [
      "webp-변환-필요한-이유",
      "이미지-최적화-seo",
      "웹사이트-이미지-최적화",
    ],
    schemaDescription: "PNG 이미지를 WebP 형식으로 변환하는 무료 온라인 도구입니다.",
  },
  {
    slug: "gif-compress",
    path: "/gif-compress",
    status: "coming_soon",
    metaTitle: "GIF 압축 (준비 중) — 용량 줄이기 안내",
    metaDescription:
      "GIF 압축·이미지 용량 줄이기를 위한 안내 페이지입니다. 애니메이션 GIF는 현재 준비 중이며, 정지 이미지는 다른 무료 이미지 툴을 이용할 수 있습니다.",
    keywords: [
      "GIF 압축",
      "이미지 용량 줄이기",
      "이미지 압축",
      "무료 이미지 툴",
      "사진 용량 줄이기",
    ],
    h1: "GIF 압축",
    intro:
      "애니메이션 GIF 압축 기능은 브라우저 처리 한계로 현재 준비 중입니다. 우선 정지 프레임이거나 단일 이미지라면 이미지 용량 줄이기·PNG→WebP 변환으로 유사한 목표를 달성할 수 있습니다.",
    howToTitle: "사용 방법 (준비 중)",
    howToSteps: [
      {
        title: "1. 현재 이용 가능한 방법",
        body: "GIF의 첫 프레임만 필요하면 스크린샷 후 ‘이미지 용량 줄이기’로 JPEG/WebP 저장을 검토하세요.",
      },
      {
        title: "2. 대안",
        body: "짧은 영상은 외부 호스팅·동영상 포맷이 더 효율적일 수 있습니다.",
      },
      {
        title: "3. 업데이트",
        body: "GIF 압축이 추가되면 이 페이지에서 바로 처리할 수 있게 안내하겠습니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "카카오톡·메신저에서 움짤을 보내기 전 용량을 줄이고 싶을 때(기능 출시 후)",
      "블로그·카페에 GIF 대신 가벼운 정지 이미지나 짧은 영상으로 바꾸고 싶을 때",
      "웹 배너를 PNG/WebP 정지 이미지로 바꿔 로딩을 개선하고 싶을 때",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "이 페이지의 GIF 압축 실행 기능은 아직 준비 중입니다. 원본·중요 파일은 항상 따로 보관하세요.",
      "GIF는 색 수·프레임 수 때문에 기대만큼 줄지 않을 수 있어, 한 장면이면 JPEG·WebP가 더 나을 때가 많습니다.",
    ],
    faqs: [
      {
        question: "GIF 압축은 언제 되나요?",
        answer:
          "안정적인 브라우저 처리 방식을 검토한 뒤 순차 공개할 예정입니다. 그전까지는 이미지 압축·포맷 변환 도구를 활용해 주세요.",
      },
      {
        question: "지금 당장 줄이려면?",
        answer:
          "정지 이미지라면 ‘이미지 용량 줄이기’ 또는 ‘PNG → WebP 변환’을, 프레임 추출이 가능하면 해당 장면을 JPEG/WebP로 저장해 보세요.",
      },
      {
        question: "왜 브라우저만으로 GIF 압축이 어렵나요?",
        answer:
          "애니메이션은 여러 프레임과 시간 정보를 포함해 처리 비용이 크고, 브라우저 환경마다 결과가 달라질 수 있어 안정화가 필요합니다.",
      },
      {
        question: "GIF 대신 추천하는 방법은?",
        answer:
          "짧은 반복 영상은 동영상 포맷이나 호스팅 링크가 더 가벼운 경우가 많고, 한 장면이면 JPEG·WebP 정지 이미지가 로딩과 호환성 면에서 유리할 수 있습니다.",
      },
    ],
    relatedToolSlugs: ["compress", "png-to-webp", "resize", "jpg-to-png"],
    relatedBlogSlugs: ["이미지-압축-방법", "온라인-이미지-압축", "무료-이미지-줄이기-툴"],
    schemaDescription:
      "GIF 이미지 압축 서비스(준비 중) 안내 및 대안 무료 이미지 툴 링크를 제공합니다.",
    homeGrid: "experimental",
  },
  {
    slug: "resize",
    path: "/resize",
    metaTitle: "이미지 크기 조절 무료 — 가로·세로 픽셀 조정",
    metaDescription:
      "이미지 크기 조절·리사이즈를 브라우저에서 무료로 수행합니다. 사진 용량 줄이기·웹 썸네일 만들기에 활용하세요.",
    keywords: [
      "이미지 크기 조절",
      "이미지 용량 줄이기",
      "사진 용량 줄이기",
      "이미지 압축",
      "무료 이미지 툴",
    ],
    h1: "이미지 크기 조절",
    intro:
      "가로·세로 픽셀을 지정해 이미지 크기 조절을 합니다. 비율 유지 옵션으로 왜곽 없이 줄일 수 있으며, 이후 이미지 압축 도구와 연계하면 JPG 용량 줄이기에도 좋습니다.",
    howToTitle: "사용 방법",
    howToSteps: [
      {
        title: "1. 이미지 선택",
        body: "리사이즈할 파일을 고릅니다.",
      },
      {
        title: "2. 크기 입력",
        body: "목표 가로·세로 픽셀을 입력하고, 비율 유지 여부를 선택합니다.",
      },
      {
        title: "3. 적용 및 다운로드",
        body: "PNG로 내보내거나, 필요 시 다른 도구에서 JPEG/WebP로 저장합니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "카카오톡 프로필·오픈채팅 배경 등에서 권장 픽셀·용량 안내가 있을 때",
      "게시판·블로그 첨부 규격에 ‘가로 n픽셀 이하’가 있을 때",
      "사람인·잡코리아 등 프로필 사진 픽셀 안내에 맞추기 전",
      "공공기관·학교 과제 제출란에 해상도 제한이 있을 때",
      "쇼핑몰 썸네일·목록용 이미지를 과하게 크게 올리지 않으려 할 때",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "원본 고해상도 파일은 별도 폴더에 보관한 뒤, 웹·제출용 사본만 줄이세요.",
      "업스케일(확대)은 화질이 떨어질 수 있습니다. 가능하면 원본에서 충분한 픽셀로 시작하세요.",
      "작게 줄인 뒤에는 문서 속 작은 글씨·얼굴 윤곽 가독성을 꼭 확인하세요.",
    ],
    faqs: [
      {
        question: "이미지 크기 조절만으로 용량이 줄까요?",
        answer:
          "대체로 픽셀 수가 줄면 용량도 줄어듭니다. 더 줄이려면 ‘이미지 용량 줄이기’에서 JPEG/WebP 압축을 이어서 적용하세요.",
      },
      {
        question: "비율 유지는 어떻게 동작하나요?",
        answer:
          "긴 변을 기준으로 짧은 변이 비율에 맞게 자동 계산됩니다.",
      },
      {
        question: "리사이즈 후에도 용량 제한에 안 맞아요.",
        answer:
          "픽셀만 줄고 파일 포맷이 무겁게 남았을 수 있습니다. 같은 이미지를 ‘이미지 용량 줄이기’에서 JPEG으로 한 번 더 맞춰 보세요.",
      },
      {
        question: "사람인·잡코리아 프로필은 픽셀만 맞추면 되나요?",
        answer:
          "픽셀과 파일 용량 제한이 함께 있는 경우가 많습니다. 크기 조절 후에도 MB·KB 상한에 걸리면 압축 도구로 이어서 맞추세요.",
      },
    ],
    relatedToolSlugs: ["compress", "passport-photo", "jpg-to-png", "pdf-convert"],
    relatedBlogSlugs: [
      "이미지-크기-조절-방법",
      "사진-크기-줄이기",
      "이미지-파일-크기-줄이기",
    ],
    schemaDescription:
      "이미지 가로·세로 픽셀을 조절하는 무료 온라인 리사이즈 도구입니다.",
  },
  {
    slug: "passport-photo",
    path: "/passport-photo",
    metaTitle: "증명사진 용량 줄이기 — 규격 맞춤 압축 (브라우저)",
    metaDescription:
      "증명사진 용량 줄이기·제출용 크기 조정을 돕는 무료 이미지 툴. 목표 용량과 픽셀 규격을 옵션으로 조절할 수 있습니다.",
    keywords: [
      "증명사진 용량 줄이기",
      "이미지 용량 줄이기",
      "사진 용량 줄이기",
      "이미지 압축",
      "무료 이미지 툴",
    ],
    h1: "증명사진 용량 줄이기",
    intro:
      "여권·비자·지원 시스템 등에 올리기 전 증명사진 용량 줄이기가 필요할 때 사용합니다. 비율은 대략적인 증명사진 비율(35×45mm에 상응하는 7:9)로 자르고, JPEG로 용량을 맞춥니다.",
    howToTitle: "사용 방법",
    howToSteps: [
      {
        title: "1. 사진 선택",
        body: "정면 증명사진 이미지를 선택합니다.",
      },
      {
        title: "2. 옵션 설정",
        body: "목표 최대 용량(KB)·짧은 변 픽셀(기본 약 413px 등)을 조절합니다.",
      },
      {
        title: "3. 처리 및 저장",
        body: "결과 JPEG를 다운로드하고 제출처 안내에 맞는지 확인합니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "취업·수험·자격증 접수 화면에서 증명사진 용량·픽셀 제한이 있을 때",
      "이력서 사진을 사람인·잡코리아 등에 넣기 전",
      "공공기관 전자민원·교육청 시스템에 증명사진을 붙일 때",
      "원본 사진은 있는데 업로드 칸만 작게 요구할 때",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "제출처 공지의 픽셀·배경색·표정·파일 형식을 반드시 확인하세요. 도구는 보조일 뿐입니다.",
      "원본 사진 파일은 따로 보관하고, 제출본만 이 도구로 만드세요.",
      "압축 후 얼굴 윤곽·눈·입 가독성을 확인하세요. 너무 낮은 용량은 반려 사유가 될 수 있습니다.",
      "자동 크롭은 중앙 기준입니다. 여백·머리 크기 규정은 공지와 비교해 주세요.",
    ],
    faqs: [
      {
        question: "모든 증명사진 규격에 맞나요?",
        answer:
          "아니요. 이 도구는 일반적인 비율·용량 조절을 돕는 보조 수단이며, 최종 규격은 주최 측 기준을 따르세요.",
      },
      {
        question: "증명사진 용량 줄이기 후 화질이 흐려요.",
        answer:
          "목표 용량을 조금 높이거나, 원본 해상도가 충분한지 확인하세요.",
      },
      {
        question: "업로드 오류가 계속 나요.",
        answer:
          "용량 외에 가로·세로 픽셀·확장자 제한이 있을 수 있습니다. 블로그의 ‘취업 사진 업로드 오류 해결’ 글과 함께 순서대로 점검해 보세요.",
      },
      {
        question: "증명사진 용량 제한은 보통 얼마까지인가요?",
        answer:
          "접수처마다 다릅니다. 흔히 500KB~2MB, 픽셀은 수백~수천 px로 제한하는 경우가 많습니다. 사람인·잡코리아·공공 전자민원 화면에 표시된 숫자를 그대로 맞추는 것이 안전합니다.",
      },
    ],
    relatedToolSlugs: ["compress", "resize", "png-to-webp", "pdf-convert"],
    relatedBlogSlugs: [
      "증명사진-용량-줄이는-방법",
      "jpg-용량-줄이기",
      "사진-용량-줄이는-법",
    ],
    schemaDescription:
      "증명사진 이미지를 목표 용량과 규격에 맞게 조정하는 무료 브라우저 도구입니다.",
  },
  {
    slug: "pdf-convert",
    path: "/pdf-convert",
    metaTitle: "이미지 → PDF 변환 무료 — 사진을 PDF로 저장",
    metaDescription:
      "JPG·PNG 이미지를 PDF로 합치는 무료 이미지 툴. PDF 변환·스캔 복사본 제출에 활용하고, 이미지 용량 줄이기는 압축 도구와 함께 쓰면 좋습니다.",
    keywords: [
      "PDF 변환",
      "이미지 용량 줄이기",
      "이미지 압축",
      "무료 이미지 툴",
      "사진 용량 줄이기",
    ],
    h1: "이미지 → PDF 변환",
    intro:
      "한 장 이상의 이미지를 하나의 PDF 파일로 만듭니다. 제출·보관용으로 스캔 이미지를 PDF 변환할 때 쓰기 좋습니다. 용량을 더 줄이려면 먼저 이미지 압축을 적용해 보세요.",
    howToTitle: "사용 방법",
    howToSteps: [
      {
        title: "1. 이미지 선택",
        body: "PDF에 넣을 JPG·PNG를 고릅니다(여러 장 가능).",
      },
      {
        title: "2. PDF 만들기",
        body: "페이지 순서는 선택 순서와 같습니다.",
      },
      {
        title: "3. 다운로드",
        body: "생성된 PDF를 저장합니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "공공기관·학교 과제에 서류 여 장을 ‘한 개 PDF’로 제출해야 할 때",
      "사람인·잡코리아 등에서 서류·포트폴리오를 PDF로만 업로드해야 할 때",
      "스마트폰으로 연속 촬영한 서류를 순서대로 묶을 때",
      "이메일·메신저로 여러 이미지를 한 번에 보내야 할 때",
      "이력서·포트폴리오 이미지를 한 파일로 정리해 올릴 때",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "파일을 선택한 순서가 PDF 페이지 순서와 같습니다. 제출 전 미리보기로 순서를 반드시 확인하세요.",
      "페이지 크기는 이미지 크기에 맞춰질 수 있습니다. A4 등 인쇄 규격이 있으면 ‘이미지 크기 조절’을 먼저 검토하세요.",
      "원본 스캔 이미지는 따로 보관하고, 제출용으로만 압축·변환하세요. 민감 서류는 공용 PC에서 다루지 마세요.",
    ],
    faqs: [
      {
        question: "PDF 변환 후 용량이 커요.",
        answer:
          "각 이미지를 먼저 ‘이미지 용량 줄이기’로 줄인 뒤 PDF로 합치면 효과가 큽니다.",
      },
      {
        question: "PDF에서 이미지로 다시 뽑을 수 있나요?",
        answer:
          "이 페이지는 이미지→PDF만 제공합니다. 역변환은 별도 도구가 필요합니다.",
      },
      {
        question: "페이지 순서가 뒤바뀌었어요.",
        answer:
          "브라우저에서 파일을 다시 선택할 때 목록 순서대로 들어갑니다. 한 장씩 순서를 확인하며 고르거나, 파일명 숫자 접두어로 정렬해 보세요.",
      },
      {
        question: "사람인·잡코리아에 PDF만 올리라고 나오는데 이미지만 있어요.",
        answer:
          "이 도구로 JPG·PNG를 한 파일 PDF로 묶은 뒤 업로드하면 됩니다. 용량 제한이 있으면 먼저 ‘이미지 용량 줄이기’로 각 장을 줄인 다음 PDF로 합치세요.",
      },
    ],
    relatedToolSlugs: ["compress", "resize", "jpg-to-png", "png-to-webp"],
    relatedBlogSlugs: [
      "이미지-pdf-변환-방법",
      "ppt-이미지-용량-줄이기",
      "사진-업로드-용량-줄이기",
    ],
    schemaDescription:
      "여러 이미지를 하나의 PDF 문서로 변환하는 무료 온라인 도구입니다.",
  },
  {
    slug: "heic-to-jpg",
    path: "/heic-to-jpg",
    metaTitle: "HEIC → JPG 변환 — 아이폰 사진 업로드 오류 해결",
    metaDescription:
      "아이폰 HEIC 사진이 업로드되지 않을 때 JPG로 바꿔 보세요. 사람인·잡코리아·공공기관 제출 전 브라우저에서 여러 파일을 변환할 수 있습니다.",
    keywords: [
      "HEIC JPG",
      "아이폰 사진 변환",
      "이미지 용량 줄이기",
      "무료 이미지 툴",
      "사진 변환",
    ],
    h1: "HEIC → JPG 변환",
    intro:
      "아이폰에서 기본 저장되는 HEIC(HEIF) 파일은 채용·공공 업로드 화면에서 형식 오류가 자주 납니다. 이 페이지에서 HEIC를 JPG로 변환한 뒤 다시 업로드하면 실패율을 줄일 수 있습니다. 변환은 브라우저에서 수행되며, 서버 저장 없이 바로 다운로드할 수 있습니다.",
    howToTitle: "사용 방법",
    howToSteps: [
      {
        title: "1. HEIC 파일 선택",
        body: "아이폰 사진 원본(.heic/.heif)을 한 장 또는 여러 장 선택합니다.",
      },
      {
        title: "2. JPG 변환",
        body: "브라우저에서 즉시 JPG로 변환합니다. 업로드 오류가 나는 사이트에 다시 제출해 보세요.",
      },
      {
        title: "3. 필요 시 용량 최적화",
        body: "변환 후 용량이 크면 ‘이미지 용량 줄이기’로 한 번 더 맞추면 메일 첨부·채용 업로드 통과에 유리합니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "PC에서 HEIC를 더블 클릭해도 열리지 않을 때(기능 출시 후)",
      "지원 시스템이 JPG만 받을 때 우선 JPG로 맞추고 싶을 때",
      "가족 사진을 메일·메신저로 보낼 때 상대가 형식을 못 열 때",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "출력은 JPG 고정입니다. 제출처가 PNG·PDF를 요구하면 변환 후 해당 도구를 연계해 주세요.",
      "HEIC 원본은 아이클라우드·PC에 별도 보관한 뒤 제출용 사본만 변환하는 습관을 권장합니다.",
    ],
    faqs: [
      {
        question: "HEIC 파일이 업로드되지 않을 때 어떻게 해야 하나요?",
        answer:
          "이 페이지에서 JPG로 바꾼 뒤 다시 업로드해 보세요. 사람인·잡코리아·일부 공공 양식은 HEIC를 직접 받지 않는 경우가 많습니다.",
      },
      {
        question: "사람인에서 아이폰 사진 오류가 나는 이유는?",
        answer:
          "업로드 검증이 JPG/JPEG 기준일 때 HEIC는 형식 오류가 납니다. HEIC를 JPG로 변환하면 같은 사진도 통과되는 경우가 많습니다.",
      },
      {
        question: "JPG 변환 후에도 용량 초과가 나요.",
        answer:
          "‘이미지 용량 줄이기’ 또는 ‘증명사진 용량 줄이기’로 KB·픽셀을 추가로 맞춰 주세요. 포맷 문제와 용량 문제는 별개로 걸릴 수 있습니다.",
      },
    ],
    relatedToolSlugs: ["compress", "passport-photo", "resize", "pdf-convert"],
    relatedBlogSlugs: [
      "아이폰-heic-사진-jpg-변환-방법",
      "jpg-용량-줄이기",
      "사진-용량-줄이는-법",
    ],
    schemaDescription:
      "아이폰 HEIC 이미지를 브라우저에서 JPG로 변환해 업로드 호환 문제를 줄이는 무료 온라인 도구입니다.",
  },
  {
    slug: "pdf-compress",
    path: "/pdf-compress",
    status: "coming_soon",
    metaTitle: "PDF 용량 줄이기 (준비 중) — 업로드 전 단계",
    metaDescription:
      "완성된 PDF 자체를 줄이는 기능은 준비 중입니다. 그 전 단계로 이미지 압축·페이지 순서 확인으로 용량을 줄이는 방법을 안내합니다.",
    keywords: [
      "PDF 용량 줄이기",
      "이미지 압축",
      "무료 이미지 툴",
      "파일 용량",
    ],
    h1: "PDF 용량 줄이기",
    intro:
      "스캔·사진으로 만든 PDF는 내부 이미지 비트맵이 커서 용량이 불어납니다. 브라우저에서 PDF 구조 자체를 재인코딩하는 기능은 검토 중이며, 현재는 ‘PDF에 넣기 전에 이미지를 줄인다’는 방식이 가장 확실합니다.",
    howToTitle: "지금 권장하는 순서",
    howToSteps: [
      {
        title: "1. 장별 이미지 줄이기",
        body: "각 페이지가 될 JPG·PNG를 ‘이미지 용량 줄이기’로 JPEG/WebP에 맞춥니다.",
      },
      {
        title: "2. PDF로 합치기",
        body: "‘이미지 → PDF 변환’으로 한 파일로 묶습니다. 순서는 파일 선택 순서와 같습니다.",
      },
      {
        title: "3. 향후 기능",
        body: "완성된 PDF만 업로드해서 용량을 줄이는 전용 기능은 별도로 준비합니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "제출 플랫폼에 PDF만 올릴 수 있는데 용량 제한에 걸릴 때(단계별 안내)",
      "스캔 복사본 PDF가 수 MB를 넘을 때",
      "이메일로 PDF를 보내야 하는데 첨부 한도에 걸릴 때",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "PDF 전용 압축 기능은 아직 없습니다. 위 단계로도 부족하면 스캔 해상도·색 모드를 조정해 보세요.",
      "원본 PDF는 삭제 전에 백업해 두세요.",
    ],
    faqs: [
      {
        question: "왜 이미지부터 줄이나요?",
        answer:
          "PDF 용량 대부분은 안쪽 이미지에서 옵니다. 이미지 바이트를 줄이면 PDF 전체가 함께 가벼워집니다.",
      },
      {
        question: "PDF만 받는 사이트에 어떻게 올리나요?",
        answer:
          "페이지를 이미지로 분리할 수 있다면 각 장을 줄인 뒤 다시 PDF로 합치는 방식이 일반적입니다. 분리가 어렵다면 출처 앱에서 스캔 품질을 낮추는 옵션이 있는지 확인하세요.",
      },
      {
        question: "전용 PDF 압축은 언제 되나요?",
        answer:
          "서버 없이 브라우저에서 안전하게 처리할 수 있는지 검토한 뒤 공개할 예정입니다.",
      },
    ],
    relatedToolSlugs: ["pdf-convert", "compress", "resize", "jpg-to-png"],
    relatedBlogSlugs: [
      "pdf-용량-줄이기-전-이미지-압축-이유",
      "이미지-pdf-변환-방법",
      "jpg-용량-줄이기",
    ],
    schemaDescription:
      "PDF 문서 용량 축소 기능(준비 중) 안내 및 이미지 선압축·PDF 변환 대안을 제공합니다.",
  },
  {
    slug: "photo-mosaic",
    path: "/photo-mosaic",
    metaTitle: "사진 모자이크 — 얼굴·번호판 무료 가리기",
    metaDescription:
      "이미지를 올리고 가리고 싶은 영역을 드래그하면 모자이크가 적용돼요. 파일이 서버로 전송되지 않고 브라우저에서만 처리됩니다.",
    keywords: [
      "모자이크",
      "사진 모자이크",
      "얼굴 가리기",
      "개인정보 가리기",
      "번호판 모자이크",
      "무료 이미지 편집",
    ],
    h1: "사진 모자이크",
    intro:
      "중고 거래 인증 사진, 행사 사진, 민원 서류 캡처 등에서 얼굴·번호판·연락처를 가릴 때 쓸 수 있어요. 이미지를 올리고 드래그로 영역을 선택하면 모자이크가 적용됩니다. 파일은 브라우저에서만 처리되고 외부 서버로 전송되지 않아요.",
    howToTitle: "사용 방법",
    howToSteps: [
      {
        title: "1. 이미지 업로드",
        body: "JPG, PNG 등 이미지를 올립니다. 드래그 앤 드롭도 가능해요.",
      },
      {
        title: "2. 영역 선택",
        body: "가리고 싶은 부분을 드래그해서 선택하면 바로 모자이크가 적용돼요. 여러 번 반복할 수 있어요.",
      },
      {
        title: "3. 저장 · 다운로드",
        body: "’저장하기’ 버튼을 눌러 완성된 이미지를 다운로드하세요. 원본 포맷(JPG/PNG)으로 저장됩니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "중고 거래 인증 사진에 주소·연락처가 보일 때",
      "행사 사진에 참석자 얼굴을 가리고 SNS에 올리고 싶을 때",
      "민원 서류·영수증 캡처에서 계좌번호·이름을 가릴 때",
      "번호판이 찍힌 차량 사진을 공유하기 전",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "모자이크 크기를 너무 크게 설정하면 이미지가 조각처럼 보일 수 있어요. 16~24px이 무난해요.",
      "모자이크를 적용한 뒤 ‘되돌리기’를 누르면 원본으로 돌아가요. 저장 전에 꼭 확인하세요.",
      "저장된 이미지 파일은 모자이크가 적용된 최종본이에요. 원본이 필요하면 원본 파일을 따로 보관하세요.",
    ],
    faqs: [
      {
        question: "파일이 서버에 올라가나요?",
        answer:
          "아니요. 모든 처리는 브라우저 안에서만 이뤄지고, 파일이 외부 서버로 전송되지 않아요.",
      },
      {
        question: "모자이크를 잘못 적용했어요.",
        answer:
          "’되돌리기’ 버튼을 누르면 원본 이미지로 돌아가요. 저장 전에는 언제든 되돌릴 수 있어요.",
      },
      {
        question: "모자이크 크기는 어떻게 조절하나요?",
        answer:
          "슬라이더로 4~48px 범위에서 조절할 수 있어요. 숫자가 클수록 픽셀이 굵게 보여요.",
      },
      {
        question: "이미지 용량도 줄이고 싶어요.",
        answer:
          "저장 후 ‘이미지 용량 줄이기’ 도구로 JPG/WebP 압축을 추가로 적용하면 돼요.",
      },
    ],
    relatedToolSlugs: ["compress", "resize", "jpg-to-png"],
    relatedBlogSlugs: [
      "사진-업로드-오류-해결-방법",
      "jpg-용량-줄이기",
      "이미지-압축-방법",
    ],
    schemaDescription:
      "브라우저에서 이미지 영역을 드래그해 모자이크를 적용하는 무료 온라인 도구입니다. 파일이 서버로 전송되지 않아 개인정보가 안전합니다.",
    homeGrid: "experimental",
  },
  {
    slug: "background-remove",
    path: "/background-remove",
    status: "coming_soon",
    metaTitle: "이미지 배경 제거 (준비 중) — 단색 배경 대체",
    metaDescription:
      "AI·색키 기반 배경 제거 기능을 검토 중입니다. 증명사진·상품 컷 등은 우선 스튜디오 촬영·PNG 원본을 권장합니다.",
    keywords: [
      "배경 제거",
      "누끼",
      "이미지 편집",
      "무료 이미지 툴",
    ],
    h1: "이미지 배경 제거",
    intro:
      "전자상거래 썸네일·프로필 이미지에서 배경을 없애면 후작업이 쉬워집니다. 고품질 배경 제거는 연산량이 커 브라우저·프라이버시 조건을 맞추며 준비하고 있습니다. 그전에는 단색 배경에서 촬영하거나, 디자인 툴에서 마스크를 쓰는 방법이 가장 확실합니다.",
    howToTitle: "준비 중 · 실무 팁",
    howToSteps: [
      {
        title: "1. 촬영 단계",
        body: "밝고 균일한 배경에서 인물·제품을 찍으면 추후 편집이 수월합니다.",
      },
      {
        title: "2. 증명·제출용",
        body: "많은 기관은 배경색·머리 여백을 규정합니다. 도구보다 공지문을 우선하세요.",
      },
      {
        title: "3. 로드맵",
        body: "가벼운 단색 제거부터 순차적으로 검토합니다.",
      },
    ],
    useCasesTitle: "이럴 때 사용하세요",
    useCases: [
      "쇼핑몰 상품 사진을 흰 배경 컷으로 통일하고 싶을 때(기능 출시 후)",
      "프로필 이미지에서 배경만 정리하고 싶을 때",
      "프레젠테이션용 인물 컷을 따로 저장하고 싶을 때",
    ],
    warningsTitle: "사용 전 확인하세요",
    warnings: [
      "배경 제거 기능은 아직 없습니다. 자동 추출 결과는 항상 가장자리를 수동 확인해야 합니다.",
      "증명사진·공공 제출용은 기관별 배경 규정을 따르세요. 임의 제거는 불이익이 될 수 있습니다.",
    ],
    faqs: [
      {
        question: "증명사진에 쓸 수 있나요?",
        answer:
          "대개 공지된 배경색이 있습니다. 자동 배경 제거는 허용되지 않는 경우가 많으니 주최 측 안내를 확인하세요.",
      },
      {
        question: "지금 상품 사진은 어떻게 하나요?",
        answer:
          "밝은 천·종이 위에서 촬영한 뒤, 이미지 크기 조절과 용량 줄이기로 플랫폼 규격을 맞추는 방식이 무난합니다.",
      },
      {
        question: "PNG와 JPG 중 무엇을 쓰나요?",
        answer:
          "투명 배경이 필요하면 PNG, 아니면 JPG나 WebP가 흔합니다. 목적지 규격을 먼저 확인하세요.",
      },
    ],
    relatedToolSlugs: ["compress", "png-to-webp", "resize", "passport-photo"],
    relatedBlogSlugs: [
      "쇼핑몰-상세페이지-이미지-최적화",
      "증명사진-용량-줄이는-방법",
      "webp-변환-필요한-이유",
    ],
    schemaDescription:
      "이미지 배경 제거 기능(준비 중) 안내 및 촬영·포맷 대안을 제공합니다.",
    homeGrid: "experimental",
  },
];

const slugSet = new Set<ToolSlug>(TOOL_DEFINITIONS.map((t) => t.slug));

export function getToolDefinition(slug: ToolSlug): ToolDefinition {
  const t = TOOL_DEFINITIONS.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown tool: ${slug}`);
  return t;
}

export function getAllToolDefinitions(): ToolDefinition[] {
  return TOOL_DEFINITIONS;
}

/** 홈 상단·메인 그리드(실험·로드맵 제외) */
export function getHomePrimaryTools(): ToolDefinition[] {
  return TOOL_DEFINITIONS.filter(
    (t) => t.homeGrid !== "experimental" && t.homeGrid !== "omit",
  );
}

/** 홈 하단 ‘실험·로드맵’ 소구역 */
export function getHomeExperimentalTools(): ToolDefinition[] {
  return TOOL_DEFINITIONS.filter((t) => t.homeGrid === "experimental");
}

export function isToolSlug(s: string): s is ToolSlug {
  return slugSet.has(s as ToolSlug);
}
