import fs from "fs";
import path from "path";
import type { Article } from "./article-types";

export function getDynamicArticles(): Article[] {
  const articlesDir = path.join(process.cwd(), "articles");

  let files: string[];
  try {
    files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }

  const articles: Article[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(articlesDir, file), "utf8");
      const article = JSON.parse(raw) as Article;
      if (article.published !== false) {
        articles.push(article);
      }
    } catch {
      // 손상된 파일 skip
    }
  }

  return articles.sort((a, b) => {
    if (!a.datePublished) return 1;
    if (!b.datePublished) return -1;
    return (
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    );
  });
}
