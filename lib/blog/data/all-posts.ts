import type { BlogPost } from "@/lib/blog-types";
import { chunk1 } from "./chunk-1";
import { chunk2 } from "./chunk-2";
import { chunk3 } from "./chunk-3";
import { chunk4 } from "./chunk-4";
import { chunk5 } from "./chunk-5";
import { chunk6 } from "./chunk-6";

export const allPosts: BlogPost[] = [
  ...chunk1,
  ...chunk2,
  ...chunk3,
  ...chunk4,
  ...chunk5,
  ...chunk6,
];
