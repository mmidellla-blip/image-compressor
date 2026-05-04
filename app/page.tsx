import type { Metadata } from "next";
import { AdsenseSlot } from "@/components/adsense-slot";
import { CompressorClient } from "@/components/compressor-client";
import { HomeGuide } from "@/components/home-guide";
import { HomeTips } from "@/components/home-tips";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "이미지 용량 줄이기 무료 사이트 — JPG·PNG 압축 도구",
  description:
    "이미지 용량 줄이기, JPG 용량 줄이기, 사진 용량 줄이는 법을 실천할 수 있는 무료 도구와 가이드. JPEG·WebP 변환과 용량 비교를 지원합니다.",
  keywords: [
    "이미지 용량 줄이기",
    "JPG 용량 줄이기",
    "사진 용량 줄이기",
    "무료 이미지 압축",
    "이미지 압축",
  ],
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <SiteChrome>
      <header className="home-header">
        <h1 className="hero-title">이미지 용량 줄이기 무료 사이트</h1>
        <p className="hero-desc">
          JPG·PNG 이미지 용량을 줄이는 무료 도구입니다. 사진 용량 줄이기와 웹·문서 제출에
          맞춰 JPEG 또는 WebP로 내보내고, 압축 전후 크기를 비교할 수 있습니다.
        </p>
      </header>

      <HomeGuide />

      <AdsenseSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? "home-inline"}
        className="home-ad"
      />

      <section className="tool-section" aria-labelledby="tool-heading">
        <h2 id="tool-heading" className="tool-title">
          무료 이미지 압축 도구
        </h2>
        <CompressorClient />
      </section>

      <AdsenseSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM ?? "home-bottom"}
        className="home-ad"
      />

      <HomeTips />

      <style>{`
        .home-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .hero-title {
          font-size: clamp(1.5rem, 4vw, 1.95rem);
          font-weight: 800;
          margin: 0 0 0.5rem;
          line-height: 1.3;
        }
        .hero-desc {
          color: var(--muted);
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.65;
          max-width: 40rem;
          margin-inline: auto;
        }
        .home-ad {
          margin: 1.25rem auto;
          max-width: 40rem;
        }
        .tool-section {
          margin-top: 0.5rem;
        }
        .tool-title {
          font-size: 1.1rem;
          font-weight: 800;
          text-align: center;
          margin: 0 0 1rem;
        }
      `}</style>
    </SiteChrome>
  );
}
