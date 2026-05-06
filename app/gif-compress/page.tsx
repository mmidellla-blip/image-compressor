import { GifCompressToolClient } from "@/components/tools/gif-compress-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("gif-compress");

export default function GifCompressPage() {
  return (
    <ToolLayout slug="gif-compress">
      <GifCompressToolClient />
    </ToolLayout>
  );
}
