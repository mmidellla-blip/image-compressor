import { GifMakerToolClient } from "@/components/tools/gif-maker-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("gif-maker");

export default function GifMakerPage() {
  return (
    <ToolLayout slug="gif-maker">
      <GifMakerToolClient />
    </ToolLayout>
  );
}
