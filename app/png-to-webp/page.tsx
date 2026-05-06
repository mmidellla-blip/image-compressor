import { PngToWebpToolClient } from "@/components/tools/png-to-webp-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("png-to-webp");

export default function PngToWebpPage() {
  return (
    <ToolLayout slug="png-to-webp">
      <PngToWebpToolClient />
    </ToolLayout>
  );
}
