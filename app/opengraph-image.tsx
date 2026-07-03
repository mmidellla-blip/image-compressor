import { ImageResponse } from "next/og";
import { SITE_BRAND } from "@/lib/site-brand";

export const runtime = "edge";

export const alt = `${SITE_BRAND} — 경제 완전 초보를 위한 돈 이야기`;

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
          background: "linear-gradient(145deg, #0f1f3d 0%, #16244a 55%, #0f1f3d 100%)",
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
              borderRadius: 28,
              background: "linear-gradient(180deg, #f5c344 0%, #d69e2e 100%)",
            }}
          />
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "#f5c344",
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
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}
        >
          경제 완전 초보를 위한 돈 이야기
        </div>
        <div style={{ fontSize: 18, color: "#94a3b8", marginTop: 28 }}>
          청약 · 신용점수 · 연말정산 · 적금 계산기
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
