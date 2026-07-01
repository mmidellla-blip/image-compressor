import { NextRequest, NextResponse } from "next/server";

const PC_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

function xhsCookie(): string {
  return process.env.XHS_COOKIE ?? "";
}

// ── URL 파싱 ──────────────────────────────────────────────────────────────────

type ParsedXHS = {
  rawUrl: string;
  noteId: string | null;
  xsecToken: string | null;
  xsecSource: string | null;
};

function parseXHSInput(input: string): ParsedXHS | null {
  const match = input.match(
    /https?:\/\/(?:www\.)?(?:xiaohongshu\.com|xhslink\.com)[^\s"'<>]*/i,
  );
  if (!match) return null;

  const rawUrl = match[0];
  const noteIdMatch = rawUrl.match(/\/(?:explore|discovery\/item)\/([a-f0-9]{24})/i);
  const noteId = noteIdMatch?.[1] ?? null;

  let xsecToken: string | null = null;
  let xsecSource: string | null = null;
  try {
    const p = new URL(rawUrl);
    xsecToken = p.searchParams.get("xsec_token");
    xsecSource = p.searchParams.get("xsec_source");
  } catch {
    // ignore
  }

  return { rawUrl, noteId, xsecToken, xsecSource };
}

function isXHSHost(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "www.xiaohongshu.com" ||
      hostname === "xiaohongshu.com" ||
      hostname === "xhslink.com"
    );
  } catch {
    return false;
  }
}

// ── 동영상 결과 타입 ──────────────────────────────────────────────────────────

type VideoResult = { title: string; videoUrl: string };

// ── HTML 페이지 파싱 ──────────────────────────────────────────────────────────

function extractInitialState(html: string): Record<string, unknown> | null {
  const marker = "window.__INITIAL_STATE__=";
  const idx = html.indexOf(marker);
  if (idx === -1) return null;

  const start = idx + marker.length;
  const scriptEnd = html.indexOf("</script>", start);
  if (scriptEnd === -1) return null;

  const raw = html
    .slice(start, scriptEnd)
    .trim()
    .replace(/;+$/, "")
    .replace(/\bundefined\b/g, "null")
    .replace(/\bNaN\b/g, "null")
    .replace(/\bInfinity\b/g, "null");

  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

type AnyObj = Record<string, unknown>;

function videoFromState(state: AnyObj, title: string): VideoResult | null {
  const detailMap = ((state?.note as AnyObj)?.noteDetailMap as AnyObj) ?? {};

  for (const key of Object.keys(detailMap)) {
    const note = (detailMap[key] as AnyObj)?.note as AnyObj | undefined;
    if (!note?.video) continue;

    const originKey = ((note.video as AnyObj)?.consumer as AnyObj)
      ?.originVideoKey as string | undefined;
    if (originKey) {
      return { title, videoUrl: `https://sns-video-bd.xhscdn.com/${originKey}` };
    }

    const stream = ((note.video as AnyObj)?.media as AnyObj)?.stream as AnyObj | undefined;
    if (stream) {
      for (const codec of ["h264", "h265"]) {
        const variants = stream[codec] as Array<{
          masterUrl?: string;
          backupUrls?: string[];
        }> | undefined;
        if (!Array.isArray(variants)) continue;

        for (const v of variants) {
          for (const bUrl of v?.backupUrls ?? []) {
            if (typeof bUrl === "string" && bUrl && !bUrl.includes(".m3u8")) {
              return { title, videoUrl: bUrl };
            }
          }
        }
        for (const v of variants) {
          if (typeof v?.masterUrl === "string" && v.masterUrl) {
            return { title, videoUrl: v.masterUrl };
          }
        }
      }
    }
  }
  return null;
}

function extractFromHtml(html: string): VideoResult | null {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = (titleMatch?.[1] ?? "소홍서 동영상")
    .replace(/\s*[-—|]\s*小红书.*$/i, "")
    .replace(/\s*[-—|]\s*xiaohongshu.*$/i, "")
    .trim() || "소홍서 동영상";

  const state = extractInitialState(html);
  if (state) {
    const r = videoFromState(state, title);
    if (r) return r;
  }

  // OGP 메타
  const ogMeta = html.match(
    /<meta[^>]+property=["']og:video(?::url)?["'][^>]+content=["']([^"']+)["']/i,
  );
  if (ogMeta) return { title, videoUrl: ogMeta[1] };

  // 직접 URL 스캔
  const mp4 = html.match(/https:\/\/[^\s"'\\]+\.mp4(?:\?[^\s"'\\]*)?/);
  if (mp4) return { title, videoUrl: mp4[0] };

  const m3u8 = html.match(/https:\/\/[^\s"'\\]+\.m3u8(?:\?[^\s"'\\]*)?/);
  if (m3u8) return { title, videoUrl: m3u8[0] };

  return null;
}

// ── XHS API 직접 호출 ─────────────────────────────────────────────────────────

function pickVideoUrl(item: AnyObj): string | null {
  // consumer.originVideoKey
  const originKey = ((item?.consumer as AnyObj)?.originVideoKey as string | undefined);
  if (originKey) return `https://sns-video-bd.xhscdn.com/${originKey}`;

  // media.stream
  const stream = (item?.media as AnyObj)?.stream as AnyObj | undefined;
  if (stream) {
    for (const codec of ["h264", "h265"]) {
      const variants = (stream as AnyObj)[codec] as Array<{
        masterUrl?: string;
        backupUrls?: string[];
      }> | undefined;
      if (!Array.isArray(variants)) continue;
      for (const v of variants) {
        for (const bUrl of v?.backupUrls ?? []) {
          if (typeof bUrl === "string" && !bUrl.includes(".m3u8")) return bUrl;
        }
      }
      for (const v of variants) {
        if (v?.masterUrl) return v.masterUrl;
      }
    }
  }
  return null;
}

async function tryXHSApis(
  noteId: string,
  xsecToken: string | null,
  xsecSource: string | null,
): Promise<VideoResult | null> {
  const token = xsecToken ?? "";
  const src = xsecSource ?? "pc_share";

  const cookie = xhsCookie();
  const commonHeaders: Record<string, string> = {
    "User-Agent": PC_UA,
    Referer: "https://www.xiaohongshu.com/",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "X-Requested-With": "XMLHttpRequest",
    ...(cookie && { Cookie: cookie }),
  };

  // 시도 1: /api/sns/web/v1/feed (GET)
  try {
    const qs = new URLSearchParams({
      source_note_id: noteId,
      ...(token && { xsec_token: token }),
      ...(src && { xsec_source: src }),
    });
    const res = await fetch(
      `https://www.xiaohongshu.com/api/sns/web/v1/feed?${qs}`,
      { headers: commonHeaders },
    );
    if (res.ok) {
      const json = (await res.json()) as AnyObj;
      const items = (json?.data as AnyObj)?.items as AnyObj[] | undefined;
      if (Array.isArray(items)) {
        for (const item of items) {
          const card = item?.note_card as AnyObj | undefined;
          const title = (card?.title as string | undefined) ?? "소홍서 동영상";
          const video = card?.video as AnyObj | undefined;
          if (!video) continue;
          const url = pickVideoUrl(video);
          if (url) return { title, videoUrl: url };
        }
      }
    }
  } catch {
    // continue
  }

  // 시도 2: /api/sns/web/v1/note/detail (GET)
  try {
    const qs2 = new URLSearchParams({
      note_id: noteId,
      ...(token && { xsec_token: token }),
      ...(src && { xsec_source: src }),
    });
    const res2 = await fetch(
      `https://www.xiaohongshu.com/api/sns/web/v1/note/detail?${qs2}`,
      { headers: commonHeaders },
    );
    if (res2.ok) {
      const json2 = (await res2.json()) as AnyObj;
      const note = (json2?.data as AnyObj)?.note as AnyObj | undefined;
      const title = (note?.title as string | undefined) ?? "소홍서 동영상";
      const video = note?.video as AnyObj | undefined;
      if (video) {
        const url = pickVideoUrl(video);
        if (url) return { title, videoUrl: url };
      }
    }
  } catch {
    // continue
  }

  // 시도 3: edith API (POST)
  try {
    const res3 = await fetch(
      "https://edith.xiaohongshu.com/api/sns/web/v1/note/detail",
      {
        method: "POST",
        headers: { ...commonHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          note_id: noteId,
          xsec_token: token,
          xsec_source: src,
        }),
      },
    );
    if (res3.ok) {
      const json3 = (await res3.json()) as AnyObj;
      const note = (json3?.data as AnyObj)?.note as AnyObj | undefined;
      const title = (note?.title as string | undefined) ?? "소홍서 동영상";
      const video = note?.video as AnyObj | undefined;
      if (video) {
        const url = pickVideoUrl(video);
        if (url) return { title, videoUrl: url };
      }
    }
  } catch {
    // continue
  }

  return null;
}

// ── 단축 URL 리졸브 ───────────────────────────────────────────────────────────

async function resolveShortUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    headers: { "User-Agent": PC_UA },
  });
  return res.url;
}

// ── 라우트 핸들러 ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawInput: string =
      typeof body?.url === "string" ? body.url.trim() : "";

    if (!rawInput) {
      return NextResponse.json({ error: "URL을 입력해주세요." }, { status: 400 });
    }

    const parsed = parseXHSInput(rawInput);
    if (!parsed || !isXHSHost(parsed.rawUrl)) {
      return NextResponse.json(
        {
          error:
            "소홍서(xiaohongshu.com) 링크를 입력해주세요. 앱 공유 텍스트를 그대로 붙여넣기해도 돼요.",
        },
        { status: 400 },
      );
    }

    const { rawUrl, noteId, xsecToken, xsecSource } = parsed;

    // 1) XHS API 직접 호출 (가장 안정적)
    if (noteId) {
      const apiResult = await tryXHSApis(noteId, xsecToken, xsecSource);
      if (apiResult) return NextResponse.json(apiResult);
    }

    // 2) 단축 URL 리졸브
    const resolvedUrl = rawUrl.includes("xhslink.com")
      ? await resolveShortUrl(rawUrl)
      : rawUrl;

    // 3) HTML 스크래핑 — 여러 URL 형식 시도
    const urlsToTry: string[] = [resolvedUrl];
    if (noteId) {
      const tok = xsecToken
        ? `?xsec_token=${encodeURIComponent(xsecToken)}&xsec_source=${encodeURIComponent(xsecSource ?? "pc_share")}`
        : "";
      urlsToTry.push(`https://www.xiaohongshu.com/explore/${noteId}${tok}`);
    }

    for (const pageUrl of [...new Set(urlsToTry)]) {
      let html: string;
      try {
        const cookie = xhsCookie();
        const pageRes = await fetch(pageUrl, {
          headers: {
            "User-Agent": PC_UA,
            Accept: "text/html,application/xhtml+xml",
            "Accept-Language": "zh-CN,zh;q=0.9",
            Referer: "https://www.xiaohongshu.com/",
            ...(cookie && { Cookie: cookie }),
          },
        });
        if (!pageRes.ok) continue;
        html = await pageRes.text();
      } catch {
        continue;
      }

      const result = extractFromHtml(html);
      if (result) return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        error:
          "동영상 URL을 찾지 못했어요. 소홍서가 서버 직접 접근을 차단 중일 수 있습니다. 잠시 후 다시 시도하거나, 앱에서 '저장' 기능을 이용해 주세요.",
      },
      { status: 404 },
    );
  } catch (err) {
    console.error("[video-download]", err);
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
