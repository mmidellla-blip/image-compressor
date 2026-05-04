import type { Metadata } from "next";
import { CompressorClient } from "@/components/compressor-client";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "이미지 용량 줄이기 무료 사이트",
  description: "JPG, PNG 이미지 용량을 무료로 줄이세요",
  keywords: [
    "이미지 용량 줄이기",
    "JPG 용량 줄이기",
    "사진 용량 줄이기",
    "무료 이미지 압축",
  ],
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <SiteChrome>
      <h1 className="hero-title">이미지 용량 줄이기 무료 사이트</h1>
      <p className="hero-desc">
        JPG, PNG 이미지 용량을 무료로 줄이세요. 사진 용량 줄이기와 웹·SNS
        업로드에 맞는 JPEG·WebP 변환을 지원합니다.
      </p>
      <CompressorClient />

      <style>{`
        .hero-title {
          font-size: clamp(1.5rem, 4vw, 1.85rem);
          font-weight: 800;
          text-align: center;
          margin: 0 0 0.5rem;
          line-height: 1.3;
        }
        .hero-desc {
          text-align: center;
          color: var(--muted);
          margin: 0 0 1.75rem;
          font-size: 0.95rem;
        }
      `}</style>
    </SiteChrome>
  );
}
