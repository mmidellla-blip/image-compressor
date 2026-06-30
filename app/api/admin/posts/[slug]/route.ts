import { NextRequest, NextResponse } from "next/server";
import {
  getPostFile,
  savePostFile,
  deletePostFile,
  type PostData,
} from "@/lib/github-api";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const result = await getPostFile(slug);
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ sha: result.sha, ...result.data, slug });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = (await req.json()) as PostData & { sha: string };
    const { sha, ...data } = body;
    await savePostFile(slug, { ...data, sections: [] as never[] }, sha);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { sha } = (await req.json()) as { sha: string };
    await deletePostFile(slug, sha);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
