import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { BlogPost, BlogSection } from "@/lib/blog-types";

type QueryResult =
  | PageObjectResponse
  | PartialPageObjectResponse
  | PartialDatabaseObjectResponse
  | DatabaseObjectResponse;

/** Notion DB 목록 조회용 경량 타입 (sections 제외) */
export type NotionPostMeta = Pick<
  BlogPost,
  "slug" | "title" | "description" | "datePublished"
>;

// ── 내부 헬퍼 ──────────────────────────────────────────────────────────────

function makeClient(): Client {
  const auth = process.env.NOTION_API_KEY;
  if (!auth) throw new Error("NOTION_API_KEY 환경변수가 설정되지 않았습니다.");
  return new Client({ auth });
}

function getDbId(): string {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) throw new Error("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.");
  return id;
}

function isFullPage(r: QueryResult): r is PageObjectResponse {
  return r.object === "page" && "properties" in r;
}

function plainText(items: Array<{ plain_text: string }>): string {
  return items.map((i) => i.plain_text).join("");
}

function pageToMeta(page: PageObjectResponse): NotionPostMeta | null {
  const p = page.properties;

  const title =
    p["title"]?.type === "title" ? plainText(p["title"].title) : "";
  const slug =
    p["slug"]?.type === "rich_text" ? plainText(p["slug"].rich_text) : "";
  const description =
    p["description"]?.type === "rich_text"
      ? plainText(p["description"].rich_text)
      : "";
  const datePublished =
    p["date"]?.type === "date" && p["date"].date?.start
      ? p["date"].date.start
      : undefined;

  if (!slug || !title) return null;
  return { slug, title, description, datePublished };
}

/** 페이지네이션을 처리하며 모든 블록을 수집합니다. */
async function fetchBlocks(
  notion: Client,
  blockId: string,
): Promise<BlockObjectResponse[]> {
  const acc: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    for (const b of res.results) {
      if ("type" in b) acc.push(b as BlockObjectResponse);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return acc;
}

/**
 * Notion 블록을 BlogSection 배열로 변환합니다.
 *
 * 변환 규칙:
 * - heading_1/2/3 → 섹션 구분자 (BlogSection.heading)
 * - paragraph, quote, callout → BlogSection.paragraphs 항목
 * - bulleted_list_item → "• 텍스트" 형태 paragraphs 항목
 * - numbered_list_item → "N. 텍스트" 형태 paragraphs 항목
 */
function blocksToSections(blocks: BlockObjectResponse[]): BlogSection[] {
  const sections: BlogSection[] = [];
  let current: BlogSection | null = null;
  let listIdx = 0;

  const flush = () => {
    if (current) {
      sections.push(current);
      current = null;
    }
  };

  for (const b of blocks) {
    switch (b.type) {
      case "heading_1": {
        flush();
        listIdx = 0;
        current = { heading: plainText(b.heading_1.rich_text), paragraphs: [] };
        break;
      }
      case "heading_2": {
        flush();
        listIdx = 0;
        current = { heading: plainText(b.heading_2.rich_text), paragraphs: [] };
        break;
      }
      case "heading_3": {
        flush();
        listIdx = 0;
        current = { heading: plainText(b.heading_3.rich_text), paragraphs: [] };
        break;
      }

      case "paragraph": {
        listIdx = 0;
        const text = plainText(b.paragraph.rich_text).trim();
        if (!text) continue;
        if (!current) current = { heading: "", paragraphs: [] };
        current.paragraphs.push(text);
        break;
      }

      case "bulleted_list_item": {
        listIdx = 0;
        const text = plainText(b.bulleted_list_item.rich_text).trim();
        if (!text) continue;
        if (!current) current = { heading: "", paragraphs: [] };
        current.paragraphs.push(`• ${text}`);
        break;
      }

      case "numbered_list_item": {
        const text = plainText(b.numbered_list_item.rich_text).trim();
        if (!text) continue;
        listIdx++;
        if (!current) current = { heading: "", paragraphs: [] };
        current.paragraphs.push(`${listIdx}. ${text}`);
        break;
      }

      case "quote": {
        listIdx = 0;
        const text = plainText(b.quote.rich_text).trim();
        if (!text) continue;
        if (!current) current = { heading: "", paragraphs: [] };
        current.paragraphs.push(text);
        break;
      }

      case "callout": {
        listIdx = 0;
        const text = plainText(b.callout.rich_text).trim();
        if (!text) continue;
        if (!current) current = { heading: "", paragraphs: [] };
        current.paragraphs.push(text);
        break;
      }

      default:
        listIdx = 0;
    }
  }

  flush();
  return sections;
}

// ── 공개 API ───────────────────────────────────────────────────────────────

/**
 * 발행된 블로그 글 목록을 최신순으로 반환합니다 (본문 제외).
 *
 * 필터: published === true
 * 정렬: date 내림차순
 */
export async function getPostList(): Promise<NotionPostMeta[]> {
  const notion = makeClient();

  const res = await notion.databases.query({
    database_id: getDbId(),
    filter: {
      property: "published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "date", direction: "descending" }],
  });

  return res.results
    .filter(isFullPage)
    .map(pageToMeta)
    .filter((p): p is NotionPostMeta => p !== null);
}

/**
 * slug로 발행된 개별 글을 반환합니다 (Notion 페이지 블록 포함).
 *
 * 글이 없거나 미발행이면 null을 반환합니다.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const notion = makeClient();

  const res = await notion.databases.query({
    database_id: getDbId(),
    filter: {
      and: [
        { property: "published", checkbox: { equals: true } },
        { property: "slug", rich_text: { equals: slug } },
      ],
    },
    page_size: 1,
  });

  const page = res.results.filter(isFullPage)[0];
  if (!page) return null;

  const meta = pageToMeta(page);
  if (!meta) return null;

  const blocks = await fetchBlocks(notion, page.id);
  const sections = blocksToSections(blocks);

  return { ...meta, sections, relatedSlugs: [] };
}
