import type { Metadata } from "next";
import Script from "next/script";
import { SITE_BRAND } from "@/lib/site-brand";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: {
    default: `사진 용량 줄이기 - 무료 이미지 압축 | ${SITE_BRAND}`,
    template: `%s | ${SITE_BRAND}`,
  },
  description:
    "사진 용량 줄이기, JPG·PNG 압축, WebP 변환, PDF 합치기를 브라우저에서 무료로. 회원가입·서버 저장 없이 바로 쓰는 이미지 툴.",
  keywords: [
    "사진 용량 줄이기",
    "이미지 용량 줄이기",
    "JPG 용량 줄이기",
    "이미지 압축",
    "사진 파일 크기 줄이기",
    "WebP 변환",
    "PDF 합치기",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_BRAND,
  },
  robots: { index: true, follow: true },
  /** AdSense 사이트 연결용 (각 페이지 head에 메타로 출력됨) */
  other: {
    "google-adsense-account": "ca-pub-2200717713315446",
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
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2200717713315446"
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
