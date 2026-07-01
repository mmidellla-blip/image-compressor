import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["xhscdn.com", "xiaohongshu.com"];

function isAllowedHost(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const videoUrl = req.nextUrl.searchParams.get("url");
  const title = req.nextUrl.searchParams.get("title") ?? "동영상";

  if (!videoUrl) {
    return NextResponse.json({ error: "url 파라미터가 필요해요." }, { status: 400 });
  }

  if (!isAllowedHost(videoUrl)) {
    return NextResponse.json({ error: "허용되지 않는 도메인이에요." }, { status: 403 });
  }

  try {
    const upstream = await fetch(videoUrl, {
      headers: {
        Referer: "https://www.xiaohongshu.com/",
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `업스트림 오류 ${upstream.status}` },
        { status: 502 },
      );
    }

    const safeName = title
      .slice(0, 60)
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
      .trim() || "video";

    const isM3U8 = videoUrl.includes(".m3u8");
    const ext = isM3U8 ? "m3u8" : "mp4";
    const contentType = upstream.headers.get("Content-Type") ?? (isM3U8 ? "application/vnd.apple.mpegurl" : "video/mp4");

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(safeName)}.${ext}`,
    );

    const contentLength = upstream.headers.get("Content-Length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (err) {
    console.error("[video-download/proxy]", err);
    return NextResponse.json(
      { error: "다운로드 중 오류가 발생했어요." },
      { status: 500 },
    );
  }
}
