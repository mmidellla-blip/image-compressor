import type { Metadata } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: {
    default: "무료 온라인 이미지 툴 모음 | 압축·변환·PDF",
    template: "%s | 무료 이미지 툴 모음",
  },
  description:
    "이미지 용량 줄이기, JPG·PNG·WebP 변환, 이미지 크기 조절, 증명사진 압축, PDF 변환 등 무료 이미지 툴을 모았습니다.",
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
    siteName: "무료 온라인 이미지 툴 모음",
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
