import type { Metadata } from "next";
import Script from "next/script";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: {
    default:
      "이미지 용량 줄이기 무료 사이트 | JPG·PNG 압축, 사진 용량 줄이기",
    template: "%s | 이미지 용량 줄이기",
  },
  description:
    "JPG, PNG 이미지 용량을 무료로 줄이세요. 사진 용량 줄이기, JPG 용량 줄이기, 이미지 압축에 맞춘 온라인 도구.",
  keywords: [
    "이미지 용량 줄이기",
    "JPG 용량 줄이기",
    "사진 용량 줄이기",
    "PNG 압축",
    "무료 이미지 압축",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
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
      <head>
        {adsenseClient ? (
          <Script
            id="adsense-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
      </head>
      <body>
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
