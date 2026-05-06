"use client";

import dynamic from "next/dynamic";

/** PDF(jsPDF 등) 번들 분리 — 서버 컴포넌트에서는 `ssr: false` 동적 임포트 불가해 클라이언트 래퍼로 분리 */
export const PdfConvertLazy = dynamic(
  () =>
    import("./pdf-convert-tool-client").then((mod) => mod.PdfConvertToolClient),
  {
    loading: () => (
      <p
        className="pdf-tool-loading"
        style={{ padding: "1rem 0", color: "var(--muted)" }}
      >
        PDF 도구를 불러오는 중입니다…
      </p>
    ),
    ssr: false,
  },
);
