import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // 이력서 사진 300x400 픽셀 → 증명사진 300x400 픽셀 비율 맞추는법 (2026-07 슬러그 정리)
        source:
          "/blog/%EC%9D%B4%EB%A0%A5%EC%84%9C%20%EC%82%AC%EC%A7%84%20300x400%20%ED%94%BD%EC%85%80",
        destination:
          "/blog/%EC%A6%9D%EB%AA%85%EC%82%AC%EC%A7%84-300x400-%ED%94%BD%EC%85%80-%EB%B9%84%EC%9C%A8-%EB%A7%9E%EC%B6%94%EB%8A%94%EB%B2%95",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
