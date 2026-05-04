import type { Metadata } from "next";
import { AdsenseSlot } from "@/components/adsense-slot";
import { CompressorClient } from "@/components/compressor-client";
import { HomeBlogLinks } from "@/components/home-blog-links";
import { HomeDeepGuide } from "@/components/home-deep-guide";
import { HomeHowTo } from "@/components/home-how-to";
import { HomeTips } from "@/components/home-tips";
import { SiteChrome } from "@/components/site-chrome";
import { getCanonicalUrl } from "@/lib/site-url";

const canonical = getCanonicalUrl("/");

export const metadata: Metadata = {
  title: "이미지 용량 줄이기 무료 사이트 — JPG·PNG 압축 도구",
  description:
    "JPG·PNG 이미지 용량을 줄이는 무료 도구입니다. 사진 용량 줄이기, JPG 용량 줄이기에 맞춰 JPEG·WebP로 내보내고 전후 용량을 비교할 수 있습니다.",
  keywords: [
    "이미지 용량 줄이기",
    "JPG 용량 줄이기",
    "사진 용량 줄이기",
    "무료 이미지 압축",
    "이미지 압축",
  ],
  ...(canonical ? { alternates: { canonical } } : {}),
};

export default function HomePage() {
  return (
    <SiteChrome mainClassName="home-main">
      <header className="home-header">
        <h1 className="hero-title">이미지 용량 줄이기 무료 사이트</h1>
        <p className="hero-desc">
          JPG·PNG 사진과 이미지를 JPEG 또는 WebP로 줄여 보세요. 웹·문서 첨부에 맞춰 압축
          전후 용량을 바로 비교할 수 있습니다.
        </p>
      </header>

      <section className="tool-section" aria-labelledby="tool-heading">
        <h2 id="tool-heading" className="tool-title visually-hidden">
          무료 이미지 압축 도구
        </h2>
        <CompressorClient />
      </section>

      <HomeHowTo />

      <AdsenseSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? "home-inline"}
        className="home-ad"
      />

      <HomeTips />

      <HomeBlogLinks />

      <HomeDeepGuide />

      <style>{`
        .home-main {
          padding-top: 0.75rem;
        }
        @media (min-width: 640px) {
          .home-main {
            padding-top: 1.5rem;
          }
        }
        .home-header {
          text-align: center;
          margin-bottom: 0.65rem;
        }
        @media (min-width: 640px) {
          .home-header {
            margin-bottom: 1rem;
          }
        }
        .hero-title {
          font-size: clamp(1.35rem, 4.5vw, 1.9rem);
          font-weight: 800;
          margin: 0 0 0.35rem;
          line-height: 1.28;
        }
        .hero-desc {
          color: var(--muted);
          margin: 0 auto;
          font-size: 0.9rem;
          line-height: 1.6;
          max-width: 40rem;
        }
        @media (min-width: 640px) {
          .hero-desc {
            font-size: 0.95rem;
          }
        }
        .tool-section {
          margin-top: 0.35rem;
        }
        .tool-title.visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .home-ad {
          margin: 1rem auto;
          max-width: 40rem;
        }
        @media (min-width: 640px) {
          .home-ad {
            margin: 1.35rem auto;
          }
        }
      `}</style>
    </SiteChrome>
  );
}
