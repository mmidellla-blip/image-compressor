import { ImageResponse } from "next/og";
import { SITE_BRAND } from "@/lib/site-brand";

export const runtime = "edge";

export const alt = `${SITE_BRAND} — 압축 · 변환 · 크기조절 · PDF`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #ecfdf5 0%, #ffffff 42%, #f0fdf4 100%)",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(180deg, #34d399 0%, #059669 100%)",
            }}
          />
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "#065f46",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE_BRAND}
          </div>
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: "#047857",
            letterSpacing: "0.02em",
          }}
        >
          압축 · 변환 · 크기조절 · PDF
        </div>
        <div style={{ fontSize: 18, color: "#64748b", marginTop: 28 }}>
          브라우저에서 처리 · 회원가입 불필요
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
