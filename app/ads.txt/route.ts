import { NextResponse } from "next/server";

/**
 * Serves ads.txt for Google AdSense seller verification.
 * Uses NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-…) to emit the google.com line.
 */
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!client?.startsWith("ca-pub-")) {
    return new NextResponse(
      "# AdSense: set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-… to publish a valid google.com line.\n",
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=600",
        },
      },
    );
  }

  const publisherId = client.replace(/^ca-/, "");
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
