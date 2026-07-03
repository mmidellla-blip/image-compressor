import fs from "fs";
import path from "path";
import type { GlossaryTerm } from "./glossary-types";

export function getDynamicGlossaryTerms(): GlossaryTerm[] {
  const dir = path.join(process.cwd(), "glossary");

  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }

  const terms: GlossaryTerm[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const term = JSON.parse(raw) as GlossaryTerm;
      if (term.published !== false) {
        terms.push(term);
      }
    } catch {
      // 손상된 파일 skip
    }
  }

  return terms.sort((a, b) => a.term.localeCompare(b.term, "ko"));
}
