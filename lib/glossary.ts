import { getDynamicGlossaryTerms } from "./glossary-reader";
import type { GlossaryTerm } from "./glossary-types";

export type { GlossaryTerm } from "./glossary-types";

export function getAllGlossaryTerms(): GlossaryTerm[] {
  return getDynamicGlossaryTerms();
}

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return getAllGlossaryTerms().find((t) => t.slug === slug);
}
