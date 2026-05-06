import { CompressToolClient } from "@/components/tools/compress-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("compress");

export default function CompressPage() {
  return (
    <ToolLayout slug="compress">
      <CompressToolClient />
    </ToolLayout>
  );
}
