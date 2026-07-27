import { NextResponse } from "next/server";

export function GET() {
  const publisherId =
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "pub-2200717713315446";
  const content = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
