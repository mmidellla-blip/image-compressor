import { NextRequest, NextResponse } from "next/server";
import {
  listPostFiles,
  getPostFile,
  savePostFile,
  type PostData,
} from "@/lib/github-api";

export async function GET() {
  try {
    const files = await listPostFiles();
    const posts = await Promise.all(
      files.map(async ({ slug, sha: fileSha }) => {
        const result = await getPostFile(slug);
        if (!result) return null;
        return {
          slug,
          sha: fileSha,
          title: result.data.title,
          datePublished: result.data.datePublished,
          published: result.data.published,
        };
      })
    );
    return NextResponse.json(posts.filter(Boolean));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as PostData;
    await savePostFile(data.slug, { ...data, sections: [] as never[] });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
