import type { Metadata } from "next";
import Script from "next/script";
import { SITE_BRAND } from "@/lib/site-brand";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: {
    default: `${SITE_BRAND} | 무료 이미지 압축·변환 (브라우저)`,
    template: `%s | ${SITE_BRAND}`,
  },
  description:
    "회원가입 없이 브라우저에서 이미지 용량 줄이기, JPG·PNG·WebP 변환, 크기 조절, 증명사진·PDF까지 무료로 처리합니다. 서버 저장 없이 이용할 수 있습니다.",
  keywords: [
    "무료 이미지 툴",
    "이미지 용량 줄이기",
    "이미지 압축",
    "WebP 변환",
    "PDF 변환",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_BRAND,
  },
  robots: { index: true, follow: true },
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
