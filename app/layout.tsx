import type { Metadata } from "next";
import Script from "next/script";
import { SITE_BRAND } from "@/lib/site-brand";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getPublicSiteUrl();
const rawPublisherId =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "pub-2200717713315446";
const publisherId = rawPublisherId.startsWith("ca-")
  ? rawPublisherId
  : `ca-${rawPublisherId}`;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: {
    default: `${SITE_BRAND} - 경제 완전 초보를 위한 돈 이야기`,
    template: `%s | ${SITE_BRAND}`,
  },
  description:
    "청약 가점 계산기, 연말정산 환급액 계산기, 신용점수 시뮬레이터 등 실생활 경제 계산기와 쉬운 경제 용어 설명을 무료로 제공합니다.",
  keywords: [
    "머니깨비",
    "청약 가점 계산기",
    "연말정산 환급액 계산기",
    "신용점수 시뮬레이터",
    "적금 이자 계산기",
    "경제 용어 사전",
    "경제 초보",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_BRAND,
  },
  robots: { index: true, follow: true },
  /** AdSense 사이트 연결용 (각 페이지 head에 메타로 출력됨) */
  other: {
    "google-adsense-account": publisherId,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Script
          id="adsense-script"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        {children}
        <style>{`
          .skip-link {
            position: absolute;
            left: -9999px;
            z-index: 999;
            padding: 0.5rem 1rem;
            background: #fff;
            color: #171717;
          }
          .skip-link:focus {
            left: 0.5rem;
            top: 0.5rem;
          }
        `}</style>
      </body>
    </html>
  );
}
