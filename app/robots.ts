import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let origin = "";

  const base = getPublicSiteUrl();
  if (base) {
    origin = base.origin;
  } else {
    try {
      const headersList = await headers();
      const host = headersList.get("host");
      if (host) {
        const proto = headersList.get("x-forwarded-proto") || "https";
        origin = `${proto}://${host}`;
      }
    } catch {
      // 정적 빌드 시점 등
    }
  }

  // 폴백 기본 주소
  if (!origin) {
    origin = "https://www.compressdeck.com";
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
