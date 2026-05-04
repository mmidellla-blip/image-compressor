import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/tiff",
  "image/avif",
]);

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const file = form.get("file");
  const formatRaw = String(form.get("format") ?? "jpeg").toLowerCase();
  const outputFormat = formatRaw === "webp" ? "webp" : "jpeg";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  if (!ALLOWED.has(file.type) && !file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "지원하지 않는 형식입니다." },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());

  try {
    const pipeline = sharp(buf).rotate();

    if (outputFormat === "webp") {
      const out = await pipeline.webp({ quality: 60 }).toBuffer();
      return new NextResponse(new Uint8Array(out), {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "no-store",
          "Content-Disposition": 'inline; filename="compressed.webp"',
        },
      });
    }

    const out = await pipeline
      .jpeg({ quality: 60, mozjpeg: true })
      .toBuffer();

    return new NextResponse(new Uint8Array(out), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store",
        "Content-Disposition": 'inline; filename="compressed.jpg"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "이미지를 처리할 수 없습니다." },
      { status: 422 },
    );
  }
}
